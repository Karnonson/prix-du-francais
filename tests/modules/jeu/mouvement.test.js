import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { creerPartie } from "../../../src/modules/jeu/partie.js";
import { montrer as montrerFin } from "../../../src/modules/jeu/ui/fin.js";
import { installerFauxDocument, parClasse, retirerFauxDocument } from "../../aide/ecran.js";

afterEach(() => {
  retirerFauxDocument();
  delete globalThis.matchMedia;
});

const dossierUi = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "src", "modules", "jeu", "ui");
const lireCss = (nom) => readFileSync(join(dossierUi, nom), "utf8");
const toutesLesFeuilles = () => readdirSync(dossierUi).filter((nom) => nom.endsWith(".css"));

// Rend le contenu des blocs `@media (…) { … }` dont l'en-tête contient `entete`, et le CSS sans ces blocs.
function separerMedia(css, entete) {
  const dedans = [];
  let dehors = "";
  let i = 0;
  while (i < css.length) {
    const debut = css.indexOf("@media", i);
    if (debut === -1) { dehors += css.slice(i); break; }
    const accolade = css.indexOf("{", debut);
    const titre = css.slice(debut, accolade);
    let profondeur = 1;
    let j = accolade + 1;
    while (profondeur > 0) {
      if (css[j] === "{") profondeur += 1;
      if (css[j] === "}") profondeur -= 1;
      j += 1;
    }
    if (titre.includes(entete)) {
      dedans.push(css.slice(accolade + 1, j - 1));
      dehors += css.slice(i, debut);
    } else {
      dehors += css.slice(i, j);
    }
    i = j;
  }
  return { dedans: dedans.join("\n"), dehors };
}

const MOUVEMENT = /@keyframes|animation\s*:|animation-[a-z-]+\s*:|transition\s*:/;

test("tout le mouvement est dans animations.css : aucune autre feuille du jeu n'anime rien", () => {
  for (const nom of toutesLesFeuilles().filter((n) => n !== "animations.css")) {
    assert.doesNotMatch(lireCss(nom), MOUVEMENT, `${nom} contient du mouvement`);
  }
});

test("dans animations.css, tout mouvement est réservé aux appareils qui ne demandent pas moins de mouvement", () => {
  // le bloc « reduce » sert à tout couper : il a le droit de nommer animation et transition
  const css = separerMedia(lireCss("animations.css"), "prefers-reduced-motion: reduce").dehors;
  const { dedans, dehors } = separerMedia(css, "prefers-reduced-motion: no-preference");

  assert.match(dedans, MOUVEMENT);
  assert.doesNotMatch(dehors, MOUVEMENT, "du mouvement existe hors du bloc no-preference");
});

test("quand l'appareil demande moins de mouvement, rien ne bouge et les confettis disparaissent", () => {
  const { dedans } = separerMedia(lireCss("animations.css"), "prefers-reduced-motion: reduce");

  assert.match(dedans, /animation:\s*none\s*!important/);
  assert.match(dedans, /transition:\s*none\s*!important/);
  assert.match(dedans, /\.confettis\s*\{\s*display:\s*none/);
});

test("sans cette demande, les confettis, les emojis et les animations d'entrée jouent sur l'écran final et la révélation", () => {
  const { dedans } = separerMedia(lireCss("animations.css"), "prefers-reduced-motion: no-preference");
  const anime = (selecteur) => new RegExp(`${selecteur}[^{]*\\{[^}]*animation:`).test(dedans);

  assert.ok(anime("\\.confettis i"), "confettis");
  assert.ok(anime("\\.emoji"), "emojis");
  assert.ok(anime("\\.grand"), "score de l'écran final");
  assert.ok(anime("\\.pastille"), "blocs de la révélation");
  assert.ok(anime("\\.remplissage"), "barres de la révélation");
  assert.ok(anime("\\.nombre"), "nombres de la révélation");
  assert.ok(anime("\\.duo \\.carte"), "cartes de la révélation");
});

test("les barres de la révélation gardent leur longueur dans la feuille, sans l'animation : rien ne se perd", () => {
  const css = lireCss("revelation.css");

  assert.match(css, /\.remplissage\s*\{[^}]*width:\s*var\(--part/);
});

test("la feuille du jeu charge animations.css", () => {
  assert.match(lireCss("jeu.css"), /@import\s+(url\()?["']\.\/animations\.css["']/);
});

function finaleAvec(demandeMoinsDeMouvement, bonnes = 4) {
  globalThis.matchMedia = (requete) => ({ matches: demandeMoinsDeMouvement && requete.includes("reduce") });
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const partie = creerPartie({ defis: [{ fr: "a", en: "b" }, { fr: "a", en: "b" }, { fr: "a", en: "b" }, { fr: "a", en: "b" }, { fr: "a", en: "b" }] });
  for (let i = 0; i < 5; i += 1) {
    partie.repondre({ choix: "fr", gagnant: "fr", correct: i < bonnes });
    partie.suivant();
  }
  montrerFin({ el, compteur: {}, donnees: { partie }, demarrerPartie() {}, accueil() {} });
  return el;
}

test("l'écran final ne crée pas de confettis quand l'appareil demande moins de mouvement, et montre le score tout de suite", () => {
  const el = finaleAvec(true);

  assert.equal(parClasse(el, "confettis").length, 0);
  assert.deepEqual(parClasse(el, "grand").map((g) => g.textContent), ["60 points"]);
  assert.match(el.textContent, /4 bonnes réponses sur 5/);
});

test("l'écran final crée ses confettis quand l'appareil ne demande rien", () => {
  const el = finaleAvec(false);

  assert.equal(parClasse(el, "confettis").length, 1);
  assert.deepEqual(parClasse(el, "grand").map((g) => g.textContent), ["60 points"]);
});
