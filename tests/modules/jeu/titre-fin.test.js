import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { creerPartie } from "../../../src/modules/jeu/partie.js";
import { montrer as montrerFin } from "../../../src/modules/jeu/ui/fin.js";
import { installerFauxDocument, parClasse, retirerFauxDocument, trouver } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

// Les titres de contenu.md, mot pour mot, selon le nombre de bonnes réponses.
const TITRES = [
  "🪙 Mécène des jetons",
  "🧳 Touriste du jeton",
  "🧮 Apprenti compteur",
  "📒 Comptable du dimanche",
  "🔍 Fin limier du jeton",
  "🏆 Radin du jeton certifié",
];

// Joue une partie de 5 défis avec `bonnes` bonnes réponses, puis monte l'écran de fin.
function finAvec(bonnes) {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const defis = Array.from({ length: 5 }, () => ({ fr: "a", en: "b" }));
  const partie = creerPartie({ defis });
  for (let i = 0; i < 5; i += 1) {
    partie.repondre({ choix: "fr", gagnant: "fr", correct: i < bonnes });
    partie.suivant();
  }
  montrerFin({ el, compteur: {}, donnees: { partie }, demarrerPartie() {}, accueil() {} });
  return el;
}

// Le texte de l'élément qui suit le score (« N points ») sur l'écran de fin.
function sousLeScore(el) {
  const [score] = parClasse(el, "grand");
  const parent = trouver(el, (e) => e.children.includes(score));
  const freres = parent.children;
  return freres[freres.indexOf(score) + 1].textContent;
}

test("une partie finie avec 3 bonnes réponses sur 5 : je vois sous le score le titre « 📒 Comptable du dimanche » ; avec 0 à 5 bonnes réponses, le titre est celui de contenu.md pour ce nombre", () => {
  assert.equal(sousLeScore(finAvec(3)), "📒 Comptable du dimanche");

  for (let bonnes = 0; bonnes <= 5; bonnes += 1) {
    const el = finAvec(bonnes);
    assert.equal(sousLeScore(el), TITRES[bonnes], `${bonnes} bonnes réponses`);
    for (const autre of TITRES.filter((_, i) => i !== bonnes)) {
      assert.ok(!el.textContent.includes(autre), `${bonnes} bonnes réponses : « ${autre} » ne devrait pas s'afficher`);
    }
    retirerFauxDocument();
  }
});
