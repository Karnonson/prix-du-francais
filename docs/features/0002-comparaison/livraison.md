# Accueil — livraison

## Version

0.2.0

## Livré

- US1 Comprendre le jeton et choisir : au premier chargement, le titre « Tokenette », une explication du jeton, et deux blocs égaux — « Jouer » et « Comparer » — chacun avec une icône, un titre et une phrase qui dit ce qu'il fait ; ni le jeu ni le comparateur visibles avant un choix.
- US2 Passer de l'accueil à l'usage choisi, et revenir : un geste pour basculer vers le jeu ou le comparateur, un bouton « Retour à l'accueil » qui ramène à l'accueil tel qu'au premier chargement, et la partie en cours perdue en revenant depuis le jeu.
- Plus tard : garder ce que le visiteur a déjà joué, son meilleur score — fonctionnalité 0003 (progression).

## En ligne

https://karnonson.github.io/tokenette/ — 2026-10-04 — commit 04657c8 — version 0.2.0 ; adresse changée depuis le dépôt renommé `prix-du-francais` → `tokenette` le même jour, voir **En cas de problème**

## Mise en ligne

1. `./build.sh` (vérifs)
2. `./deploy.sh` (construit, puis force-pousse `dist/` sur la branche `gh-pages`)

## Vérifié

- Accueil à 390 px : titre « Tokenette », explication du jeton, deux blocs Jouer/Comparer, sans défilement de côté — vu, `captures/livraison-accueil.png`
- « Jouer » bascule vers le jeu, avec « Retour à l'accueil » visible — vu, `captures/livraison-jeu.png`
- « Retour à l'accueil » ramène à l'accueil seul — vu (même état que `livraison-accueil.png`)
- « Comparer » bascule vers le comparateur, avec « Retour à l'accueil » visible — vu, `captures/livraison-comparateur.png`
- Le bouton « Traduire » reste cachée sur GitHub Pages (pas de capability `sample` ici), comme avant cette fonctionnalité — vu dans la page

## En cas de problème

- Revenir à la version d'avant : `git push -f origin f453fd0c391e8b863d85fb4946bb01b2d6a0b54b:gh-pages`
- Rien n'est gardé (aucune donnée à récupérer)
- En cas de souci : relancer `./build.sh` en local, puis regarder la console du navigateur sur la page en ligne
- Le dépôt GitHub s'appelait `prix-du-francais` ; renommé `tokenette` le 2026-10-04. L'ancienne adresse
  (`https://karnonson.github.io/prix-du-francais/`) répond en 404. `git remote get-url origin` donne
  l'adresse actuelle du dépôt.

## À faire

- aucun
