import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { creerPartie } from "../../../src/modules/jeu/partie.js";
import { montrer as montrerRevelation } from "../../../src/modules/jeu/ui/revelation.js";
import { compteurParMots, installerFauxDocument, retirerFauxDocument } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const DENTISTE = { fr: "Tu peux me rappeler", en: "Can you remind" };
const compte = (nombre) => ({ nombre, blocs: [{ texte: "x", n: nombre }] });
const FR_PLUS_CHER = { [DENTISTE.fr]: compte(17), [DENTISTE.en]: compte(13) };
const EGALITE = { [DENTISTE.fr]: compte(4), [DENTISTE.en]: compte(4) };

// Les phrases taquines de contenu.md, mot pour mot.
const BONNE = [
  "Bien vu, tu sens le jeton cher à dix mètres.",
  "Bravo, ton portefeuille te remercie.",
  "Tu lis dans les pensées de l’IA, c’est un peu inquiétant.",
  "Joli coup. Tu devrais facturer tes conseils.",
];
const RATE = [
  "Ton portefeuille a senti passer celle-là.",
  "L’IA te remercie pour ce généreux pourboire.",
  "Pas grave, personne n’a rien vu. Sauf l’IA.",
  "Ton intuition est partie en pause café.",
];
const EGAL = [
  "Les deux langues se sont mises d’accord dans ton dos.",
  "Même prix au jeton près. L’IA ne fait pas de jaloux.",
  "Personne ne paie plus cher cette fois. Profites-en.",
  "Égalité parfaite. Même la balance n’en revient pas.",
];

// Un tirage au hasard qui tombe sur chacune des 4 phrases, dans l'ordre.
const TIRAGES = [0, 0.25, 0.5, 0.99];

// Monte la révélation avec un tirage au hasard fixé ; renvoie les textes des paragraphes, dans l'ordre.
function reveler({ choix, table, hasard, partie = creerPartie({ defis: [DENTISTE, DENTISTE, DENTISTE, DENTISTE, DENTISTE] }) }) {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const donnees = partie ? { partie, choix } : { defi: DENTISTE, choix };
  montrerRevelation({ el, compteur: compteurParMots(table), donnees, hasard, montrer: () => {}, composer: () => {}, accueil: () => {} });
  const paragraphes = [];
  const parcourir = (noeud) => {
    for (const enfant of noeud.children) {
      if (enfant.tagName === "P") paragraphes.push(enfant.textContent.trim());
      parcourir(enfant);
    }
  };
  parcourir(el);
  return paragraphes;
}

// La phrase taquine, puis aussitôt la ligne actuelle avec les nombres.
function taquineAvant(paragraphes, ligne) {
  const i = paragraphes.findIndex((p) => ligne.test(p));
  assert.ok(i > 0, `la ligne ${ligne} manque ou rien ne la précède : ${JSON.stringify(paragraphes)}`);
  return paragraphes[i - 1];
}

test("quand je choisis la bonne phrase, la révélation montre une des 4 phrases taquines de la bonne réponse, puis « Dans le mille : … » avec les nombres", () => {
  const vues = TIRAGES.map((tirage) =>
    taquineAvant(reveler({ choix: "fr", table: FR_PLUS_CHER, hasard: () => tirage }), /^🎯 Dans le mille : 17 jetons en français, 13 en anglais\.$/));

  assert.deepEqual(vues, BONNE);
});

test("quand je choisis la mauvaise phrase, la révélation montre une des 4 phrases taquines du raté, puis « Aïe, raté : … »", () => {
  const vues = TIRAGES.map((tirage) =>
    taquineAvant(reveler({ choix: "en", table: FR_PLUS_CHER, hasard: () => tirage }), /^🤔 Aïe, raté : 17 jetons en français, seulement 13 en anglais\. Tu avais choisi l’anglais\.$/));

  assert.deepEqual(vues, RATE);
});

test("à égalité de jetons, quel que soit mon choix, la révélation montre une des 4 phrases taquines de l'égalité, puis « Match nul : … »", () => {
  for (const choix of ["fr", "en"]) {
    const vues = TIRAGES.map((tirage) =>
      taquineAvant(reveler({ choix, table: EGALITE, hasard: () => tirage }), /^🤝 Match nul : 4 jetons chacune\. Ce défi ne compte pas\.$/));

    assert.deepEqual(vues, EGAL);
  }
});

test("un défi composé reçoit aussi une phrase taquine avant sa ligne", () => {
  const paragraphes = reveler({ choix: "fr", table: FR_PLUS_CHER, hasard: () => 0.25, partie: null });

  assert.equal(taquineAvant(paragraphes, /^🎯 Dans le mille/), BONNE[1]);
});

test("sans tirage donné par le contexte, la phrase taquine est quand même une des 4 du cas", () => {
  const paragraphes = reveler({ choix: "fr", table: FR_PLUS_CHER, hasard: undefined });

  assert.ok(BONNE.includes(taquineAvant(paragraphes, /^🎯 Dans le mille/)));
});
