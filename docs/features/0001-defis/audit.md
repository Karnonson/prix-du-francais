# Défis — audit

## US1 Jouer une partie de 5 défis

**Tour** : 1
**Date** : 2026-10-03
**Verdict** : à corriger

### Spec

- Info : les 5 scénarios sont faits et prouvés : accueil et « Défi 1 sur 5 » (partie.test.js), révélation en blocs et barres, égalité, « Défi suivant » puis « Voir mon score » (jugement.test.js), rien gardé (rien-garde.test.js) ; rejoués dans un vrai navigateur à 390 et 1280, 5 défis de bout en bout
- Info : EF1 à EF6, EF13 et EF14 tiennent ; 13 lignes cassées une à une dans un worktree jetable (même réponse deux fois, égalité, « Récent » seul, attente du compteur, mélange, 5 défis, bon choix, barres, couleurs des blocs, dernier défi, écriture dans localStorage) : chaque test concerné échoue, sauf la ligne retirée dans `demarrer` de jeu.js (équivalente : `dessiner` refuse déjà de démarrer quand le compteur a échoué)
- Info : « C’est parti » pendant que le découpeur est retenu (4 s, vrai navigateur) : bouton occupé, puis le défi 1 s'affiche dès l'arrivée du compteur
- Info : tard, US3 — src/modules/jeu/ui/jeu.js:72 `contexte.composer()` et src/modules/jeu/jugement.js:4 `compteur.compter(defi.fr)` : « Composer mon défi » reste permis tant que le compteur charge (test compteur.test.js l'exige) et `compter` rend alors `null` ; un défi composé joué avant l'arrivée du compteur lèverait une erreur à `fr.nombre` et vide l'écran ; à regarder à la relecture de US3

### Règles

- À corriger : src/modules/jeu/ui/revelation.js:64 `h("div", { class: "carte bande" }, h("p", {}, h("strong", {}, emoji(signe), ` ${message}`)), suite)` — partiel (SC2 `bon`, `faux`, `egalite`) : `textes.md` et la maquette approuvée donnent aux trois états de la révélation une ligne de points (« ⭐ +10 points », « ⚡ +5 points de rapidité », « 0 point »), le code n'en montre aucune ; la personne ne voit pas ce que sa réponse lui rapporte avant l'écran final ; correction : afficher ces lignes à la révélation d'une partie, avec les valeurs de `score.js` (hors défi composé, qui garde « Ce défi est le tien… »), et un test avec les textes de `textes.md`
- Détail : docs/features/0001-defis/captures/SC1-390.png, à ouvrir hors serveur : le jeu n'apparaît pas quand `dist/index.html` est ouvert depuis le disque (`file://`, vérifié dans Chrome : l'emplacement reste vide, sans message) alors que `docs/architecture.md` → En local dit « ouvrir `dist/index.html` » ; correction : dire dans le README de servir `dist/` (`python3 -m http.server --directory dist`)
- Détail : src/modules/jeu/ui/jeu.css:57 `font-size: 0.9375rem` (`.jetons`), `height: 10px` (`.piste`), `padding: 1px 7px`, `grid-template-columns: 2.25rem … 4.5rem` — tailles brutes là où `--step--1`, `--step-0` et les espaces existent ; correction : le jeton le plus proche
- Détail : src/modules/jeu/ui/jeu.js:55 `contexte.compteur.surChangement(...)` — chaque redessin de l'accueil ajoute un rappel au compteur, jamais retiré ; sans effet visible (le garde `children.includes(racine)` les neutralise)
- Détail : src/modules/jeu/ui/revelation.js:44 `partie?.repondre(...)` — la rapidité est prise quand la révélation se monte, après le chargement à la demande de `revelation.js` (première fois : un aller sur le réseau) ; la première réponse peut perdre ou gagner quelques centaines de millisecondes sur le seuil de 15 secondes ; à regarder avec US2
- Info : aucun secret dans le code ni l'historique ; aucun `innerHTML` ni équivalent dans `src/modules/jeu` ; M2, M5, M6 (le jeu et le compteur ne s'importent que par `api.js`, via `index.html`) et M7 tiennent
- Info : `docs/architecture.md` ne dit pas encore les modules compteur et jeu, et la page garde « Le prix du français » : c'est `/cadrer-x-rendre`, à la livraison

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 84, pass 84, fail 0 »
Écrans : cliqués SC1 SC2
- SC1 `erreur` : compteur bloqué par le navigateur, message et bouton « Recharger » vus à 390 (capture) ; à 1280, vu mais non copié
- SC2 `perso-choix` et `perso-revele` (défi composé), SC3 et SC4 : récits US2 et US3, pas dans cette relecture
- Lancé sans `commands.dev` (le projet n'en a pas) : `dist/` servi par `python3 -m http.server` sur le port 8765, arrêté ensuite, avec un Chrome à part (le navigateur de l'outil était pris par une autre session)
- Un défi composé avec un mot de 280 caractères sans espace, joué jusqu'à la révélation à 390 : pas de défilement de côté (la ligne « À surveiller » de T05)
- Le français de la page n'a pas de version anglaise des textes du jeu (`passation.md` → Ouvert) : non jugé
