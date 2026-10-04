// T01 — l'accueil au premier chargement : titre, explication du jeton, blocs Jouer/Comparer, sans le
// jeu ni le comparateur. Lu tel qu'écrit sur le disque, sans navigateur : le basculement (US2) n'est
// pas encore câblé.
import { test } from "node:test";
import assert from "node:assert/strict";
import { lireIndex, lireReadme, estCachee, texteEtat, premierTitreReadme } from "./aide/accueil.js";

test("étant donné que j'ouvre le site, quand la page se charge, alors je vois le titre « Tokenette », l'explication du jeton, puis les deux blocs Jouer et Comparer", () => {
  const accueil = texteEtat(lireIndex(), "accueil", "jeu");

  assert.match(accueil, /Token(?:<[^>]*>)?ette/, "le titre « Tokenette » manque");
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

  assert.match(accueil, /Token(?:<[^>]*>)?ette/);
  assert.doesNotMatch(accueil, /Le prix du français/);

  assert.equal(premierTitreReadme(lireReadme()), "Tokenette");
});
