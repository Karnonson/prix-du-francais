import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { creerPartie } from "../../../src/modules/jeu/partie.js";
import { calculerScore } from "../../../src/modules/jeu/score.js";
import { montrer } from "../../../src/modules/jeu/ui/fin.js";
import { bouton, installerFauxDocument, parClasse, retirerFauxDocument } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const DEFI = { fr: "Merci", en: "Thanks" };
const juste = (secondes) => ({ correct: true, secondes });
const faux = (secondes = 2) => ({ correct: false, secondes });
const nul = (secondes = 2) => ({ correct: null, secondes });

// Joue une partie de 5 défis avec une horloge qu'on pilote : chaque réponse arrive après `secondes`.
function jouer(reponses) {
  let maintenant = 1000;
  const partie = creerPartie({ defis: [DEFI, DEFI, DEFI, DEFI, DEFI], maintenant: () => maintenant });
  reponses.forEach((r, i) => {
    maintenant += r.secondes * 1000;
    partie.repondre({ choix: "fr", gagnant: "fr", correct: r.correct });
    maintenant += 40_000; // le temps passé sur la révélation ne compte pas
    if (i < reponses.length - 1) partie.suivant();
  });
  return partie;
}

function afficherFin(partie) {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const appels = [];
  montrer({
    el,
    compteur: {},
    donnees: { partie },
    demarrerPartie: () => appels.push("partie"),
    accueil: () => appels.push("accueil"),
  });
  return { el, appels };
}

test("la rapidité se mesure de l'affichage du défi au choix, révélation exclue", () => {
  const partie = jouer([juste(4), juste(7)]);

  assert.deepEqual(partie.reponses().map((r) => r.secondes), [4, 7]);
});

test("10 points par bonne réponse plus 5 de bonus à 15 secondes ou moins, 15 secondes comprises", () => {
  const score = calculerScore([juste(3), juste(15), juste(16), juste(10), faux()]);

  assert.deepEqual(score, { bonnes: 4, sur: 5, pointsBonnes: 40, pointsBonus: 15, total: 55 });
});

test("une réponse fausse ou une égalité ne rapporte rien, même rapide", () => {
  const score = calculerScore([faux(1), nul(1), faux(1), nul(1), juste(20)]);

  assert.deepEqual(score, { bonnes: 1, sur: 5, pointsBonnes: 10, pointsBonus: 0, total: 10 });
});

test("l'écran final sépare les points des bonnes réponses, le bonus de rapidité et le total, avec le nombre de bonnes réponses", () => {
  const { el } = afficherFin(jouer([juste(3), juste(15), juste(16), juste(10), faux()]));

  assert.match(el.textContent, /Et voilà, c’est fini/);
  assert.deepEqual(parClasse(el, "grand").map((g) => g.textContent), ["55 points"]);
  assert.match(el.textContent, /4 bonnes réponses sur 5\. Joli\./);
  assert.deepEqual(parClasse(el, "ligne-score").map((l) => l.textContent), [
    "✅ Bonnes réponses40 points",
    "⚡ Bonus de rapidité15 points",
    "🏆 Total55 points",
  ]);
  assert.equal(parClasse(el, "confettis").length, 1);
  assert.equal(parClasse(el, "confettis")[0].getAttribute("aria-hidden"), "true");
});

test("une égalité compte dans le « sur 5 » mais pas dans les bonnes réponses", () => {
  const { el } = afficherFin(jouer([juste(30), juste(30), juste(30), nul(), faux()]));

  assert.match(el.textContent, /3 bonnes réponses sur 5\./);
  assert.deepEqual(parClasse(el, "grand").map((g) => g.textContent), ["30 points"]);
});

test("une partie où tout est faux : 0 point, sans confettis ni moquerie, et « Rejouer »", () => {
  const { el } = afficherFin(jouer([faux(), faux(), faux(), faux(), faux()]));

  assert.match(el.textContent, /C’est fini/);
  assert.doesNotMatch(el.textContent, /Et voilà/);
  assert.deepEqual(parClasse(el, "grand").map((g) => g.textContent), ["0 point"]);
  assert.match(el.textContent, /0 bonne réponse sur 5\. Ça arrive : rejoue pour te rattraper\./);
  assert.deepEqual(parClasse(el, "ligne-score").map((l) => l.textContent), [
    "✅ Bonnes réponses0 point",
    "⚡ Bonus de rapidité0 point",
    "🏆 Total0 point",
  ]);
  assert.equal(parClasse(el, "confettis").length, 0);
  assert.ok(bouton(el, "Rejouer"));
});

test("plus de 15 secondes : bonus 0, mais la bonne réponse compte quand même 10 points", () => {
  const { el } = afficherFin(jouer([juste(15.5), faux(), faux(), faux(), faux()]));

  assert.deepEqual(parClasse(el, "grand").map((g) => g.textContent), ["10 points"]);
  assert.deepEqual(parClasse(el, "ligne-score").map((l) => l.textContent), [
    "✅ Bonnes réponses10 points",
    "⚡ Bonus de rapidité0 point",
    "🏆 Total10 points",
  ]);
  assert.match(el.textContent, /1 bonne réponse sur 5\./);
});

test("« Rejouer » démarre aussitôt une nouvelle partie, une seule même touché plusieurs fois très vite", () => {
  const { el, appels } = afficherFin(jouer([juste(3), faux(), faux(), faux(), faux()]));

  bouton(el, "Rejouer").click();
  bouton(el, "Rejouer").click();
  bouton(el, "Rejouer").click();

  assert.deepEqual(appels, ["partie"]);
});

test("« Retour à l’accueil » mène à l'accueil", () => {
  const { el, appels } = afficherFin(jouer([juste(3), faux(), faux(), faux(), faux()]));

  bouton(el, "Retour à l’accueil").click();

  assert.deepEqual(appels, ["accueil"]);
});
