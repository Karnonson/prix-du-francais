# Accueil — audit

## US2 Passer de l'accueil à l'usage choisi, et revenir

**Tour** : 1
**Date** : 2026-10-04
**Verdict** : à corriger

### Spec

- Bloquant : src/modules/comparaison/api.js:241 — contraire : `applyUi()` remet `document.title` à « Le prix du français » (ou « The price of French »), et elle tourne dès le chargement de la page (`monterComparaison()` dans `src/main.js`, appelée sans condition d'état) ; le même texte reste dans le `<h1 data-i18n-html="title">` du comparateur (index.html:322, texte dans src/modules/comparaison/textes.js:3) qui devient visible dès que je touche « Comparer » (EF3). Vérifié par exécution : `document.title` vaut « Le prix du français » juste après le chargement, dans le propre faux document de test du projet (`tests/aide/page.js`), sans modifier ni le code ni les tests. Une personne qui vient de lire « Tokenette » sur l'accueil revoit l'ancien nom dans l'onglet du navigateur dès l'ouverture, puis en gros titre visible en touchant « Comparer » — exactement ce que D4 et EF6 disent de ne plus jamais montrer (« Tokenette … partout … sans « Le prix du français » »). Correction : dans `applyUi()`, fixer `document.title` à un texte qui garde « Tokenette » (ou ne plus le changer du tout, l'accueil portant déjà ce rôle) ; remplacer le texte du `<h1 data-i18n-html="title">` du comparateur (et sa traduction anglaise) par un texte qui ne répète pas l'ancien nom.
- À corriger : src/main.js:20 — partiel : le test nommé pour le risque abus de T02 (« je touche deux fois de suite ») ne prouve rien contre ce risque : vérifié en retirant `etat === etatActuel ||` de `basculer()` dans un worktree jetable (`git worktree add --detach … feature/comparaison`, puis supprimé) — les 8 tests de `tests/accueil.test.js` restent verts, y compris celui-là, parce que le reste du code (bascule de `hidden`, garde `etatActuel === "jeu"` avant `remonterJeu()`) rend déjà la bascule idempotente sans ce garde-fou. Une personne ne rencontre rien de cassé à l'usage, mais le `Risques :` de T02 (« abus … → un seul état affiché à la fois, pas de montage multiple ») n'est couvert par aucun test qui échouerait si ce garde-fou disparaissait. Correction : soit un test qui distingue réellement le cas (ex. un compteur d'appels sur le montage du jeu, qui doit rester à 1 même après plusieurs clics rapprochés), soit retirer la ligne `Risques :` de T02 si la bascule est de fait sans risque.
- Info : scénarios 1 (Jouer), 3 (Retour à l'accueil) et 4 (partie perdue au retour) vus dans `src/main.js` et prouvés par `tests/accueil.test.js` ; le scénario 4 vérifié par cassure : en retirant `if (etatActuel === "jeu" && etat !== "jeu") remonterJeu();` (src/main.js:21) dans le même worktree jetable, le test dédié échoue bien (`la partie en cours ne doit pas survivre au retour à l'accueil`), remis ensuite.
- Info : « deux clics » (cas limite) ne lève pas d'erreur et laisse la section déjà affichée, lu dans le test correspondant.
- Info : aucune fonction, route ou table ajoutée hors de ce que les scénarios demandent ; `basculer()` et `remonterJeu` ne font que montrer/cacher et remonter par l'entrée du module (D5).

### Règles

- Info : M6 — aucune frontière franchie : `src/main.js` n'appelle que `monter()`, point d'entrée de `comparaison`, `compteur` et `jeu`, jamais leurs fichiers internes.
- Info : aucun secret, aucune nouvelle dépendance, aucune saisie ajoutée (M1, M2, M5 respectés) ; T02 et T03 ne touchent que `src/main.js` et `tests/accueil.test.js`, comme prévu par leurs `Fichiers :`.
- Info : le texte du bouton « ← Retour à l'accueil » (index.html:310,317) correspond mot pour mot à `contenu.md` → jeu et comparateur.
- Info : `README.md` et `architecture.md` non mis à jour pour le basculement — `rendre`'s, à la livraison.

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 119 / pass 119 / fail 0 ».
Écrans : pas cliqués — SC1 : aucun `commands.dev` dans `cadrer-x.yml` pour lancer l'appli ; jugé depuis le code et son exécution directe (`node`, sans navigateur), comme au tour de US1.
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
