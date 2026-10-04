# Accueil — audit

## US1 Comprendre le jeton et choisir

**Tour** : 2
**Date** : 2026-10-04
**Verdict** : validé

### Spec

- Corrigé : l'assertion du titre portait sur tout le bloc accueil, pas sur le `<h1>` — tests/aide/accueil.js:47-51 ajoute `titreH1()` (extrait le premier `<h1>` de l'état), tests/accueil.test.js:11,44 l'utilisent maintenant au lieu de tester tout le bloc. Vérifié en vidant le `<h1>` dans un worktree jetable (`git worktree add --detach /tmp/examiner-us1 feature/comparaison`) : les deux tests échouent bien (`AssertionError: le titre « Tokenette » manque du <h1>`), supprimé ensuite (`git worktree remove --force`).
- Info : scénario 1 (titre, explication, deux blocs avec icône/titre/phrase) et scénario 2 (jeu et comparateur cachés au premier chargement) vus dans `index.html` et prouvés par `tests/accueil.test.js`.
- Info : EF6 (balise `<title>`, titre affiché, premier titre du `README.md`) vérifié : les trois disent « Tokenette », sans « Le prix du français ».
- Info : aucune fonction, route ou table ajoutée par T01 ; seulement du balisage et du CSS, tous rattachés à un scénario ou à une Nouveauté de `passation.md`.

### Règles

- Corrigé : tailles brutes au lieu de tokens — index.html:34-40 déclare maintenant `--espace-2`, `--espace-4`, `--espace-5`, `--rayon-3`, `--rayon-pilule`, `--cible` dans le `:root` ; index.html:258-274 (`.duo`, `.duo .choix`, `.barre-haut`, `.bouton-retour`) les référence par `var(...)`. Valeurs comparées à `docs/design-system/styles.css:30-40` : correspondance exacte pour `--espace-2` (8px), `--espace-4` (20px), `--rayon-3` (14px), `--rayon-pilule` (999px), `--cible` (44px).
- Info : aucun secret, aucune nouvelle dépendance, aucune saisie ajoutée (M1, M2, M5 respectés).
- Info : M6 — aucune frontière de module franchie : T01 ne touche que du balisage et du CSS dans `index.html`.
- Info : aucun mot du produit détourné : « Jouer », « Comparer » reprennent `glossaire.md` et `contenu.md` mot pour mot.
- Info : `README.md` et `architecture.md` non mis à jour au-delà du premier titre — `rendre`'s, à la livraison.

### Correctifs

- Info : tard — index.html:34,40,258,266,273 — pour `--espace-5`, aucun token exact n'existe pour les 32px (`.duo` margin-top) et 24px (`.duo .choix` padding vertical, `.barre-haut` margin-bottom) d'origine ; le correctif arrondit les trois au plus proche, vers le haut, vers `--espace-5` (28px), disclosed en `Choix :` dans le commit. Une personne voit un espacement 4px plus généreux à trois endroits (gap de la grille Duo, haut/bas de chaque bloc Jouer/Comparer, bas de la barre du haut) ; aucun scénario ni test ne porte sur ces valeurs, et 4px de plus ne menace pas le cas limite « pas de défilement latéral à 390 px » de T01 (À surveiller). Passe tel quel.

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 114 / pass 114 / fail 0 ».
Écrans : pas cliqués — SC1 : aucun `commands.dev` dans `cadrer-x.yml` pour lancer l'appli ; jugé depuis le code, comme au tour 1.
- Le défilement latéral à 390 px (CS2, cas limite) n'a pas pu être vérifié dans un navigateur ; déjà noté dans `taches.md` → À surveiller comme vérifié seulement à la relecture — reste à confirmer visuellement avant livraison, le léger supplément d'espacement du correctif compris.
- Le contraste et l'ordre du focus réels (accessibilité de `passation.md`) n'ont pas pu être vérifiés sans navigateur ; jugés corrects depuis le balisage.
