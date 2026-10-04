# Accueil — audit

## US1 Comprendre le jeton et choisir

**Tour** : 1
**Date** : 2026-10-04
**Verdict** : à corriger

### Spec

- À corriger : tests/accueil.test.js:11,44 — partiel : `assert.match(accueil, /Token(?:<[^>]*>)?ette/, …)` ne lit pas le `<h1>`, elle cherche le mot n'importe où dans tout l'état accueil ; comme le mot « Tokenette » revient aussi dans un des messages du corps (« Tokenette te permet de connaître… »), le test reste vert même quand le `<h1>` est vide ou absent, vérifié en le retirant dans un worktree jetable (`git worktree add --detach … feature/comparaison`, édition, test relancé : toujours au vert) ; une personne arrivant sur la page sans titre ne le saurait jamais depuis la suite. Correction : faire porter l'assertion sur le `<h1>` lui-même (l'extraire, ou ancrer la regex `<h1>.*Token(?:<[^>]*>)?ette.*<\/h1>`), pas sur tout le bloc accueil.
- Info : scénario 1 (titre, explication, deux blocs avec icône/titre/phrase) et scénario 2 (jeu et comparateur cachés au premier chargement) vus dans `index.html` et prouvés par `tests/accueil.test.js`, qui lit la page telle qu'écrite sur le disque ; cassé le `hidden` du jeu dans un worktree jetable, le test correspondant échoue bien (`AssertionError: le jeu doit être cache au premier chargement`).
- Info : EF6 (balise `<title>`, titre affiché, premier titre du `README.md`) vérifié : les trois disent « Tokenette », sans « Le prix du français » ; le `<h1>` qui garde ce texte à l'intérieur de l'état `comparateur` (ligne 315) est hors de portée du scénario 1 (il n'est visible qu'après le basculement de US2, pas construit ici) et son changement touche `src/modules/comparaison/{api,textes}.js`, hors des `Fichiers :` de T01 — écrit comme tel dans la commit (`Choix :`).
- Info : aucune fonction, route ou table ajoutée par T01 ; seulement du balisage et du CSS, tous rattachés à un scénario ou à une Nouveauté de `passation.md`.

### Règles

- À corriger : index.html:251,254-256,267,269 — un ajout de T01 utilise des tailles brutes là où le design system (`docs/design-system/styles.css`) tient un token : `.duo { gap: 20px; margin-top: 32px; }`, `.duo .choix { border-radius: 14px; padding: 24px 20px; min-height: 44px; }`, `.barre-haut { margin-bottom: 24px; }`, `.bouton-retour { min-height: 44px; padding: 8px 20px; border-radius: 999px; }` ; aucun de `--espace-*`, `--rayon-*`, `--cible` ou `--largeur` n'est même déclaré dans le `:root` d'`index.html` (vérifié : aucune occurrence), alors que `passation.md` → Nouveautés affirme que Duo est « fait avec --espace-3 », l'icône et la ligne d'action « avec --step-2, --espace-1, --espace-2, --ink », et la Barre du haut « avec --espace-4 ». Une personne ne voit rien de cassé aujourd'hui (les valeurs brutes reprennent par hasard celles des tokens, 44px = `--cible`, 14px = `--rayon-3`, 20px = `--espace-4`), mais un futur ajustement de l'échelle d'espacement ou de la taille de cible du design system n'atteindra jamais cette page, et les deux copies dérivent sans que rien ne le signale. Correction : ajouter au `:root` d'`index.html` les `--espace-*`, `--rayon-*` et `--cible` dont ce bloc a besoin (valeurs reprises de `docs/design-system/styles.css`, en `Choix :`), et les référencer par `var(...)` dans `.duo`, `.duo .choix`, `.barre-haut` et `.bouton-retour`.
- Info : aucun secret, aucune nouvelle dépendance, aucune saisie ajoutée (M1, M2, M5 respectés).
- Info : M6 — aucune frontière de module franchie : T01 ne touche que du balisage et du CSS dans `index.html` ; le montage/démontage du jeu et du comparateur par leurs entrées (`monter()`) reste dans `src/main.js`, non touché par T01, conforme à D5.
- Info : aucun mot du produit détourné : « Jouer », « Comparer », « Jouer →», « Comparer →» reprennent `glossaire.md` et `contenu.md` mot pour mot.
- Info : `README.md` et `architecture.md` non mis à jour par cette tâche au-delà du premier titre — normal, c'est `rendre` qui les tient à jour à la livraison.

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 114 / pass 114 / fail 0 ».
Écrans : pas cliqués — aucun `commands.dev` dans `cadrer-x.yml` pour lancer l'appli ; jugé depuis le code : chaque texte de `contenu.md` → SC1 → accueil retrouvé mot pour mot dans `index.html` ; les trois états (`accueil` visible, `jeu` et `comparateur` cachés) retrouvés dans le balisage et prouvés par le test ; les parties neuves de `passation.md` (Duo, Icône et ligne d'action, Barre du haut) retrouvées dans le CSS, avec la réserve ci-dessus sur les tokens.
- Le défilement latéral à 390 px (CS2, cas limite) n'a pas pu être vérifié dans un navigateur ; déjà noté dans `taches.md` → À surveiller comme vérifié seulement à la relecture, pas par un test automatisé — reste donc à confirmer visuellement avant livraison.
- Le contraste et l'ordre du focus réels (accessibilité de `passation.md`) n'ont pas pu être vérifiés sans navigateur ; jugés corrects depuis le balisage (boutons natifs, icônes `aria-hidden`, tokens de couleur du design system pour le texte).
