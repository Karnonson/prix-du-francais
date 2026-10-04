import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { monter } from "../../../src/modules/jeu/api.js";
import { creerPartie } from "../../../src/modules/jeu/partie.js";
import { montrer as montrerRevelation } from "../../../src/modules/jeu/ui/revelation.js";
import {
  attendreQue, bouton, compteurParMots, installerFauxDocument, parClasse, retirerFauxDocument, trouver, trouverTous,
} from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const sourcesJeu = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "src", "modules", "jeu");
const lireSources = (dossier) => readdirSync(dossier).flatMap((nom) => {
  const complet = join(dossier, nom);
  return statSync(complet).isDirectory() ? lireSources(complet) : [{ nom: complet, texte: readFileSync(complet, "utf8") }];
});

const DENTISTE = { fr: "Tu peux me rappeler", en: "Can you remind" };
const FR_17 = { nombre: 17, blocs: [{ texte: "Tu", n: 1 }, { texte: " peux", n: 1 }, { texte: " me rappeler", n: 15 }] };
const EN_13 = { nombre: 13, blocs: [{ texte: "Can", n: 1 }, { texte: " you", n: 1 }, { texte: " remind", n: 11 }] };

// Monte l'écran de révélation seul, avec un contexte qui note où on va ensuite.
function reveler({ defi = DENTISTE, choix, table, partie = creerPartie({ defis: [defi, defi, defi, defi, defi] }), numeroAvant = 0 }) {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const suites = [];
  for (let i = 0; i < numeroAvant; i += 1) partie.suivant();
  const contexte = {
    el,
    compteur: compteurParMots(table),
    donnees: { partie, choix },
    montrer: (nom, donnees) => suites.push({ nom, donnees }),
  };
  montrerRevelation(contexte);
  return { el, partie, suites, contexte };
}

test("après un choix juste, chaque phrase est découpée en blocs colorés, deux barres comparent les nombres et on dit que c'est juste", () => {
  const { el } = reveler({ choix: "fr", table: { [DENTISTE.fr]: FR_17, [DENTISTE.en]: EN_13 } });

  const [carteFr, carteEn] = parClasse(el, "carte").filter((c) => c.getAttribute("data-lang"));
  assert.deepEqual(parClasse(carteFr, "pastille").map((p) => p.textContent), ["Tu", " peux", " me rappeler"]);
  assert.deepEqual(parClasse(carteEn, "pastille").map((p) => p.textContent), ["Can", " you", " remind"]);
  assert.deepEqual(parClasse(carteFr, "pastille").map((p) => p.getAttribute("class")), ["pastille", "pastille alt", "pastille"]);
  const barres = parClasse(el, "remplissage");
  assert.deepEqual(barres.map((b) => b.getAttribute("style")), ["--part: 100%", "--part: 76%"]);
  assert.deepEqual(parClasse(el, "valeur").map((v) => v.textContent), ["17 jetons", "13 jetons"]);
  assert.match(el.textContent, /Dans le mille : 17 jetons en français, 13 en anglais\./);
  assert.match(carteFr.textContent, /Ton choix/);
  assert.doesNotMatch(carteEn.textContent, /Ton choix/);
});

test("après un choix faux, on le dit avec les deux nombres et le choix fait", () => {
  const { el } = reveler({ choix: "en", table: { [DENTISTE.fr]: FR_17, [DENTISTE.en]: EN_13 } });

  assert.match(el.textContent, /Aïe, raté : 17 jetons en français, seulement 13 en anglais\. Tu avais choisi l’anglais\./);
});

test("un choix faux, quand l'anglais est le plus cher, nomme l'anglais d'abord", () => {
  const { el } = reveler({ choix: "fr", table: { [DENTISTE.fr]: EN_13, [DENTISTE.en]: FR_17 } });

  assert.match(el.textContent, /Aïe, raté : 17 jetons en anglais, seulement 13 en français\. Tu avais choisi le français\./);
});

test("à égalité de jetons, on dit « Match nul » et le défi ne compte ni comme bon ni comme mauvais", () => {
  const quatre = { nombre: 4, blocs: [{ texte: "a", n: 4 }] };
  const { el, partie } = reveler({ choix: "fr", table: { [DENTISTE.fr]: quatre, [DENTISTE.en]: quatre } });

  assert.match(el.textContent, /Match nul : 4 jetons chacune\. Ce défi ne compte pas\./);
  assert.deepEqual(partie.reponses().map((r) => r.correct), [null]);
});

test("les nombres révélés sont ceux du compteur", () => {
  const { el } = reveler({ choix: "fr", table: { [DENTISTE.fr]: { nombre: 7, blocs: [{ texte: "x", n: 7 }] }, [DENTISTE.en]: { nombre: 3, blocs: [{ texte: "y", n: 3 }] } } });

  assert.deepEqual(parClasse(el, "valeur").map((v) => v.textContent), ["7 jetons", "3 jetons"]);
  assert.deepEqual(parClasse(el, "remplissage").map((b) => b.getAttribute("style")), ["--part: 100%", "--part: 43%"]);
});

test("un seul jeton s'écrit « 1 jeton »", () => {
  const un = { nombre: 1, blocs: [{ texte: "x", n: 1 }] };
  const { el } = reveler({ choix: "fr", table: { [DENTISTE.fr]: un, [DENTISTE.en]: { nombre: 0, blocs: [] } } });

  assert.deepEqual(parClasse(el, "valeur").map((v) => v.textContent), ["1 jeton", "0 jeton"]);
});

test("toucher deux fois la même phrase ne compte la réponse qu'une fois", () => {
  const partie = creerPartie({ defis: [DENTISTE, DENTISTE, DENTISTE, DENTISTE, DENTISTE] });
  reveler({ choix: "fr", partie, table: { [DENTISTE.fr]: FR_17, [DENTISTE.en]: EN_13 } });
  reveler({ choix: "fr", partie, table: { [DENTISTE.fr]: FR_17, [DENTISTE.en]: EN_13 } });

  assert.equal(partie.reponses().length, 1);
});

test("« Défi suivant » montre le défi suivant, et après le 5e défi le bouton mène à l'écran final", async () => {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const finales = [];
  const ecrans = async (nom) => (nom === "fin" ? { montrer: (contexte) => finales.push(contexte.donnees) } : import(`../../../src/modules/jeu/ui/${nom}.js`));
  monter(el, compteurParMots(), ecrans);
  await attendreQue(() => bouton(el, "C’est parti"));
  bouton(el, "C’est parti").click();

  for (let numero = 1; numero <= 5; numero += 1) {
    await attendreQue(() => el.textContent.includes(`Défi ${numero} sur 5`) && trouver(el, (e) => e.getAttribute("data-lang") && e.tagName === "BUTTON"));
    trouver(el, (e) => e.tagName === "BUTTON" && e.getAttribute("data-lang") === "fr").click();
    if (numero < 5) {
      await attendreQue(() => bouton(el, "Défi suivant"));
      assert.equal(bouton(el, "Voir mon score"), null);
      bouton(el, "Défi suivant").click();
    } else {
      await attendreQue(() => bouton(el, "Voir mon score"));
      assert.equal(bouton(el, "Défi suivant"), null);
      bouton(el, "Voir mon score").click();
    }
  }

  await attendreQue(() => finales.length === 1);
  assert.equal(finales[0].partie.reponses().length, 5);
});

test("des balises dans une phrase révélée en blocs restent du texte : chaque bloc est inséré comme texte", () => {
  const piege = { fr: "<img src=x onerror=alert(1)>", en: "<b>gras</b>" };
  const { el } = reveler({
    defi: piege,
    choix: "fr",
    table: {
      [piege.fr]: { nombre: 3, blocs: [{ texte: "<img src=x", n: 2 }, { texte: " onerror=alert(1)>", n: 1 }] },
      [piege.en]: { nombre: 2, blocs: [{ texte: "<b>gras</b>", n: 2 }] },
    },
  });

  assert.deepEqual(parClasse(el, "pastille").map((p) => p.textContent), ["<img src=x", " onerror=alert(1)>", "<b>gras</b>"]);
  assert.equal(trouverTous(el, (e) => ["IMG", "B"].includes(e.tagName)).length, 0);
  const interdits = lireSources(sourcesJeu).filter((s) => /innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(s.texte));
  assert.deepEqual(interdits.map((s) => s.nom), []);
});

test("un mot très long sans espace ne fait pas déborder les blocs (la feuille de style le coupe)", () => {
  const css = readFileSync(join(sourcesJeu, "ui", "revelation.css"), "utf8");

  assert.match(css, /\.pastille\s*\{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(css, /\.pastille\s*\{[^}]*white-space:\s*pre-wrap/);
});

// Correctif US1 : la révélation dit ce que la réponse rapporte (textes.md : bon, faux, egalite).
const avecHorloge = (secondes) => {
  let t = 1000;
  const partie = creerPartie({ defis: [DENTISTE, DENTISTE, DENTISTE, DENTISTE, DENTISTE], maintenant: () => t });
  t += secondes * 1000;
  return partie;
};
const TABLE = { [DENTISTE.fr]: FR_17, [DENTISTE.en]: EN_13 };

test("une bonne réponse rapide montre « ⭐ +10 points » et « ⚡ +5 points de rapidité »", () => {
  const { el } = reveler({ choix: "fr", table: TABLE, partie: avecHorloge(4) });

  assert.match(el.textContent, /⭐ \+10 points/);
  assert.match(el.textContent, /⚡ \+5 points de rapidité/);
});

test("une bonne réponse lente montre « +10 points » sans la ligne de rapidité", () => {
  const { el } = reveler({ choix: "fr", table: TABLE, partie: avecHorloge(40) });

  assert.match(el.textContent, /⭐ \+10 points/);
  assert.doesNotMatch(el.textContent, /rapidité/);
});

test("une réponse fausse montre « 0 point »", () => {
  const { el } = reveler({ choix: "en", table: TABLE, partie: avecHorloge(4) });

  assert.match(el.textContent, /0 point/);
  assert.doesNotMatch(el.textContent, /\+10|rapidité/);
});

test("une égalité montre « 0 point »", () => {
  const { el } = reveler({ choix: "fr", table: { [DENTISTE.fr]: { ...FR_17, nombre: 4 }, [DENTISTE.en]: { ...EN_13, nombre: 4 } } });

  assert.match(el.textContent, /0 point/);
  assert.doesNotMatch(el.textContent, /\+10/);
});
