# Accueil — audit

## US2 Passer de l'accueil à l'usage choisi, et revenir

**Tour** : 2
**Date** : 2026-10-04
**Verdict** : validé

### Spec

- Corrigé : `document.title` écrasé par `applyUi()`, et ancien nom dans le `<h1>` du comparateur — src/modules/comparaison/api.js:241 ne touche plus `document.title` (ligne retirée) ; index.html:322 et src/modules/comparaison/textes.js:3,42 portent maintenant `🧮 Token<span class="fr-word">ette</span>` dans les deux langues, comme l'accueil ; `<title>Tokenette</title>` (index.html:1) n'est plus jamais réécrit par le script. Deux tests ajoutés (tests/accueil.test.js:131-146) : le `<h1>` du comparateur ne dit plus « Le prix du français », et `document.title` reste tel que posé par la page après chargement ; tests/modules/comparaison/page.test.js:19,169 adaptés en conséquence. Vérifié en remettant la ligne `document.title = …` dans `applyUi()`, dans un worktree jetable (`git worktree add --detach /tmp/examiner-us2 feature/comparaison`, supprimé ensuite) : 3 tests échouent bien (les deux ajoutés, plus un des deux de `page.test.js`).
- Corrigé : risque abus de T02 non prouvé par le test nommé — docs/features/0002-comparaison/taches.md:64 n'affirme plus « pas de montage multiple », seulement « un seul état affiché à la fois » (ce que le test couvre réellement) ; le code de `src/main.js` est inchangé. La ligne ne prétend plus garder une chose qu'aucun test ne vérifierait si elle cassait.
- Info : scénarios 1 (Jouer), 3 (Retour à l'accueil) et 4 (partie perdue au retour) vus dans `src/main.js` et prouvés par `tests/accueil.test.js`, inchangés depuis le tour 1.
- Info : « deux clics » (cas limite) ne lève pas d'erreur et laisse la section déjà affichée, lu dans le test correspondant.
- Info : aucune fonction, route ou table ajoutée hors de ce que les scénarios demandent ; `basculer()` et `remonterJeu` ne font que montrer/cacher et remonter par l'entrée du module (D5).

### Règles

- Info : M6 — aucune frontière franchie : `src/main.js` n'appelle que `monter()`, point d'entrée de `comparaison`, `compteur` et `jeu`, jamais leurs fichiers internes.
- Info : aucun secret, aucune nouvelle dépendance, aucune saisie ajoutée (M1, M2, M5 respectés) ; le correctif ne touche que `index.html`, `src/modules/comparaison/api.js`, `src/modules/comparaison/textes.js`, `tests/accueil.test.js`, `tests/modules/comparaison/page.test.js` et `taches.md`.
- Info : le texte du bouton « ← Retour à l'accueil » (index.html:310,317) correspond mot pour mot à `contenu.md` → jeu et comparateur.
- Info : `README.md` et `architecture.md` non mis à jour pour le basculement — `rendre`'s, à la livraison.

### Correctifs

- Info : les lignes de `Choix :` du commit `correctifs US2` correspondent à ce que montre le diff ; rien d'autre n'a changé dans le fichier `src/main.js` que le tour 1 avait jugé.

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 121 / pass 121 / fail 0 ».
Écrans : pas cliqués — SC1 : aucun `commands.dev` dans `cadrer-x.yml` pour lancer l'appli ; jugé depuis le code et son exécution directe (`node`, sans navigateur), comme au tour 1.
- Le défilement latéral à 390 px (CS2) et le contraste/focus réels n'ont pas pu être vérifiés dans un navigateur ; déjà notés sous l'US1 comme vérifiés seulement à la relecture.
- Le double-montage du compteur de jetons à chaque retour du jeu (`remonterJeu` recrée `creerCompteur()`) n'a pas d'effet observé dans les tests ; son coût réel (réseau, mémoire) n'a pas été mesuré, hors de portée sans navigateur.

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
