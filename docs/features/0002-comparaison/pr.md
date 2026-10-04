# Accueil 0.2.0

## Résumé

Au premier chargement, le site montre maintenant un accueil : le titre « Tokenette », une explication du
jeton, et deux blocs — « Jouer » et « Comparer » — pour choisir en connaissance de cause. Un geste
bascule vers le jeu ou le comparateur, en vue unique, avec un bouton « Retour à l'accueil » qui ramène à
l'accueil ; revenir depuis une partie en cours la perd, comme fermer la page. Le titre du site (onglet,
page, README) dit partout « Tokenette », sans « Le prix du français ».

## Preuves

- Vérifs : `./build.sh` — 121 tests, 121 réussis, 0 échec
- Sécurité : recherche de secrets dans les commits de la fonctionnalité — aucun trouvé (gitleaks non installé ici, recherche manuelle des motifs usuels) ; aucune dépendance déclarée dans `package.json`, aucun audit de paquet applicable (rien à auditer)
- Relectures : US1 tour 2, validé ; US2 tour 2, validé
- Vu dans un navigateur (Playwright, serveur local sur `dist/`) : accueil à 390 et 1280, bascule vers le jeu, retour à l'accueil, bascule vers le comparateur — aucun défilement de côté à 390
- ![SC1 à 390](docs/features/0002-comparaison/captures/SC1-390.png)
- ![SC1 à 1280](docs/features/0002-comparaison/captures/SC1-1280.png)

## Risque de fusion

**Porte** : aller-retour
**Portée** : tout visiteur du site voit désormais un accueil avant le jeu ou le comparateur, au lieu d'y
arriver directement ; aucune donnée gardée n'est touchée (rien n'était gardé avant, rien ne l'est après).
