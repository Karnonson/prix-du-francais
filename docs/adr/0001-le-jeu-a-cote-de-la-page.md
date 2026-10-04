# 0001 — Le jeu s'ajoute à côté de la page, en modules chargés à la demande

**Date** : 2026-10-04
**Fonctionnalité** : `docs/features/0001-defis/`
**Remplace** : aucun

## Contexte

La page tient tout entière dans `index.html`, et sa copie Claude Artifact est cette même page publiée telle quelle. Le jeu des défis demande du code à lui (défis, score, écrans), des tests, et un compteur de jetons qu'il ne doit pas tirer de la page : la page peut être réglée sur « Plus ancien », le jeu compte toujours avec « Récent ».

## Options

- Un module `jeu` et un module `compteur` dans `src/modules/`, copiés tels quels dans `dist/`, chargés par un `<script type="module">` : `index.html` ne gagne qu'un emplacement `<section id="jeu">` et quelques lignes ; la copie Claude Artifact, publiée seule, garde la page d'avant (l'emplacement reste vide). Chaque écran se charge à la demande. Coût : la page publiée seule n'a pas le jeu.
- Tout écrire dans le script de `index.html` : une seule pièce à publier, le jeu aussi dans la copie Claude Artifact. Coût : un fichier de plus en plus gros, des tests impossibles à lancer sans navigateur, et le compteur de la page (réglable) serait partagé avec le jeu.
- Découper d'abord `index.html` en modules, puis ajouter le jeu : plus propre, mais le rangement aurait retardé la fonctionnalité ; il reste à faire (`architecture.md` → À faire).

## Décision

Le jeu s'ajoute à côté de la page : `src/modules/compteur/` et `src/modules/jeu/`, chacun par son point d'entrée `api.js` (règle M6), les écrans dans `ui/`. `build.sh` copie `src/` dans `dist/` et lance `node --test tests/` ; le lanceur de tests intégré à Node n'ajoute aucune dépendance (règle M5).

## Pourquoi

C'est le plus petit changement qui laisse la page et sa copie Claude Artifact intactes, et qui permet de tester le jeu sans navigateur. Le rangement du reste de la page en modules est remis à `/cadrer-x-ranger`.
