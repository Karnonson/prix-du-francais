// T01 — l'accueil au premier chargement : titre, explication du jeton, blocs Jouer/Comparer, sans le
// jeu ni le comparateur. Lu tel qu'écrit sur le disque, sans navigateur.
// T02 — le basculement entre l'accueil, le jeu et le comparateur (US2) : un faux document bâti depuis
// le balisage de index.html (même aide que la comparaison, `tests/aide/page.js`), assez pour cliquer
// les boutons `[data-goto]` de `src/main.js` et lire `hidden` sur les sections `[data-state]` après coup.
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { lireIndex, lireReadme, estCachee, texteEtat, premierTitreReadme, titreH1 } from "./aide/accueil.js";
import { creerDocument } from "./aide/page.js";

test("étant donné que j'ouvre le site, quand la page se charge, alors je vois le titre « Tokenette », l'explication du jeton, puis les deux blocs Jouer et Comparer", () => {
  const accueil = texteEtat(lireIndex(), "accueil", "jeu");

  assert.match(titreH1(accueil), /Token(?:<[^>]*>)?ette/, "le titre « Tokenette » manque du <h1>");
  assert.match(accueil, /Une IA ne lit pas des mots\. Elle lit des jetons, des morceaux de texte\. Chaque jeton coûte de l’argent, et prend de la place dans sa mémoire\./, "l'explication du jeton manque");
  assert.match(accueil, /Pour dire la même chose, un texte en français demande presque toujours plus de jetons qu’en anglais\./);
  assert.match(accueil, /Tokenette te permet de connaître le coût en jetons d’une requête dans les deux langues\./);
  assert.match(accueil, /Elle te propose deux façons de le savoir, en jouant ou en comparant directement deux phrases\./);

  // Bloc Jouer : icône, titre, phrase qui dit ce qu'il fait.
  assert.match(accueil, /🎮/);
  assert.match(accueil, /<strong>Jouer<\/strong>/);
  assert.match(accueil, /Devine en cinq défis quelle phrase coûte le plus de jetons\./);

  // Bloc Comparer : icône, titre, phrase qui dit ce qu'il fait.
  assert.match(accueil, /⚖️/);
  assert.match(accueil, /<strong>Comparer<\/strong>/);
  assert.match(accueil, /Écris une phrase en français et en anglais, et vois l’écart de jetons\./);
});

test("étant donné l'accueil affiché, quand je regarde la page, alors je ne vois ni le jeu ni le comparateur : seul l'accueil est là", () => {
  const html = lireIndex();

  assert.equal(estCachee(html, 'data-state="accueil"'), false, "l'accueil ne doit pas être caché");
  assert.equal(estCachee(html, 'data-state="jeu"'), true, "le jeu doit être cache au premier chargement");
  assert.equal(estCachee(html, 'data-state="comparateur"'), true, "le comparateur doit être caché au premier chargement");
});

test("étant donné le dépôt, quand j'ouvre index.html et README.md, alors le titre de l'onglet, le titre affiché sur la page et le premier titre du README disent « Tokenette », sans « Le prix du français »", () => {
  const html = lireIndex();
  const accueil = texteEtat(html, "accueil", "jeu");
  const titreOnglet = html.match(/<title>([^<]*)<\/title>/)?.[1];

  assert.equal(titreOnglet, "Tokenette");
  assert.doesNotMatch(titreOnglet ?? "", /Le prix du français/);

  assert.match(titreH1(accueil), /Token(?:<[^>]*>)?ette/, "le titre « Tokenette » manque du <h1>");
  assert.doesNotMatch(accueil, /Le prix du français/);

  assert.equal(premierTitreReadme(lireReadme()), "Tokenette");
});

// --- T02 ---------------------------------------------------------------

const CHEMIN_MAIN = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "main.js");

afterEach(() => {
  delete globalThis.document;
  delete globalThis.window;
});

// Monte la page par son vrai point d'entrée (`src/main.js`), sur un faux document tiré du balisage de
// index.html : de quoi cliquer les boutons et lire `hidden` ensuite. Une requête différente par appel
// force une ré-évaluation de main.js (sinon Node ne l'exécute qu'une fois, sur le premier faux document).
async function monterAccueil() {
  const document = creerDocument();
  globalThis.document = document;
  globalThis.window = globalThis;
  await import(`${pathToFileURL(CHEMIN_MAIN).href}?t=${Date.now()}-${Math.random()}`);
  return document;
}

function etat(document, nom) {
  return [...document.querySelectorAll("[data-state]")].find((s) => s.dataset.state === nom);
}

function boutonGoto(document, cible) {
  return [...document.querySelectorAll("[data-goto]")].find((b) => b.dataset.goto === cible);
}

test("étant donné l'accueil affiché, quand je touche « Jouer », alors l'accueil disparaît et le jeu prend toute la page, avec un bouton « Retour à l'accueil » visible", async () => {
  const document = await monterAccueil();
  assert.equal(etat(document, "accueil").hidden, false, "l'accueil est affiché au départ");

  boutonGoto(document, "jeu").click();

  assert.equal(etat(document, "accueil").hidden, true, "l'accueil disparaît");
  assert.equal(etat(document, "jeu").hidden, false, "le jeu prend la page");
  assert.equal(etat(document, "comparateur").hidden, true, "le comparateur reste caché");
  assert.ok(boutonGoto(document, "accueil"), "un bouton « Retour à l'accueil » existe sur l'écran jeu");
});

test("étant donné l'accueil affiché, quand je touche « Comparer », alors l'accueil disparaît et le comparateur prend toute la page, avec un bouton « Retour à l'accueil » visible", async () => {
  const document = await monterAccueil();

  boutonGoto(document, "comparateur").click();

  assert.equal(etat(document, "accueil").hidden, true, "l'accueil disparaît");
  assert.equal(etat(document, "comparateur").hidden, false, "le comparateur prend la page");
  assert.equal(etat(document, "jeu").hidden, true, "le jeu reste caché");
  assert.ok(boutonGoto(document, "accueil"), "un bouton « Retour à l'accueil » existe sur l'écran comparateur");
});

test("étant donné le jeu ou le comparateur affiché, quand je touche « Retour à l'accueil », alors je reviens à l'accueil tel qu'au premier chargement : les deux blocs, rien d'autre", async () => {
  const document = await monterAccueil();

  boutonGoto(document, "jeu").click();
  boutonGoto(document, "accueil").click();

  assert.equal(etat(document, "accueil").hidden, false, "l'accueil revient");
  assert.equal(etat(document, "jeu").hidden, true, "le jeu se cache");
  assert.equal(etat(document, "comparateur").hidden, true, "le comparateur reste caché");
});

test("étant donné l'accueil affiché, quand je touche deux fois de suite « Jouer » ou « Comparer », alors je reste sur la section déjà affichée, sans erreur", async () => {
  const document = await monterAccueil();
  const jouer = boutonGoto(document, "jeu");

  assert.doesNotThrow(() => {
    jouer.click();
    jouer.click();
  });

  assert.equal(etat(document, "jeu").hidden, false, "je reste sur le jeu");
  assert.equal(etat(document, "accueil").hidden, true);
  assert.equal(etat(document, "comparateur").hidden, true);
});
