# Défis — audit

## US3 Composer mon propre défi

**Tour** : 1
**Date** : 2026-10-03
**Verdict** : à corriger

### Spec

- Bloquant : src/modules/jeu/ui/jeu.js:72 `onclick: () => contexte.composer()` — contraire : « Composer mon défi » reste touchable tant que le compteur charge (ni prêt, ni en échec), alors que `compter` rend `null` (src/modules/compteur/api.js:49) ; `juger` lit `fr.nombre` sur `null` (src/modules/jeu/jugement.js:6) et l'erreur est avalée par le `.catch` de src/modules/jeu/api.js:18, qui vide l'emplacement ; une personne sur une connexion lente écrit ses deux phrases, touche « Jouer ce défi », choisit une phrase, et tout le jeu disparaît sans un mot (rejoué : après le choix, `el.textContent` vaut `""`) ; correction : à l'accueil, faire attendre « Composer mon défi » comme « C'est parti » (EF14), ou ne montrer la révélation qu'une fois `pret()` vrai ; ajouter un task avec un test « compteur pas prêt, défi composé joué » (aujourd'hui tous les tests de composer et de jouer seul utilisent `compteurParMots`, toujours prêt)
- Info : scénarios 1, 3, 4 et 5 faits et prouvés par tests/modules/jeu/composer.test.js, saisie.test.js et jouer-seul.test.js ; casser la limite (`>` en `>=`), le `trim()`, le segmenteur de graphèmes ou l'insertion en texte (`innerHTML`) fait chaque fois échouer un test

### Règles

- Détail : src/modules/jeu/ui/composer.js:24 `oninput` et src/modules/jeu/saisie.js:7 `caracteresVus` — le compteur « n / 280 caractères » segmente tout le texte à chaque frappe, sans plafond ; 5 millions de caractères collés coûtent environ 0,9 s par segmentation (mesuré) ; rien n'est découpé en jetons avant le refus, le risque d'abus est tenu ; correction : arrêter de compter à 281
- Info : M2 tenue : toute saisie passe par `verifier` avant `jouerSeul`, et le texte n'est inséré que par `append` d'une chaîne (src/modules/jeu/ui/dom.js:11) ; M6 tenue : `jeu` n'importe pas `compteur`, il reçoit l'objet de `monter` ; aucun secret ; aucune donnée gardée
- Info : textes de SC4 identiques à `textes.md` (étiquettes, « n / 280 caractères », « ✋ Tu n'as pas écrit la phrase en français. », « ✂️ … dépasse la limite de 32 caractères. Coupe un peu. »)

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 88, pass 88, fail 0 »
Écrans : pas cliqués — SC1, SC2 et SC4 : le navigateur de l'outil est tenu par une autre session (« Browser is already in use ») ; SC1 et SC2 ont été cliqués au tour 1 de US1 ; SC4 vu par le code seulement : textes, étiquettes de champs, `aria-invalid`, `role="alert"`, cibles de 44 px
- SC4 à 390 et à 1280 : défilement de côté et ordre de Tab non vérifiés, aucune capture `SC4-*.png`
- Les textes anglais du jeu n'existent pas (`passation.md` → Ouvert)

## US2 Voir mon score et rejouer

**Tour** : 1
**Date** : 2026-10-03
**Verdict** : validé

### Spec

- Info : scénarios 1 à 4 faits et prouvés (src/modules/jeu/score.js, ui/fin.js, ui/animations.css) ; casser le seuil de 15 s (`<=` en `<`), le bonus d'une réponse fausse ou d'une égalité, la garde de « Rejouer », les confettis à 0 point ou la coupure à « moins de mouvement » fait chaque fois échouer un test
- Info : EF7 à EF9 couverts ; le 5e défi donne bien « sur 5 » même avec une égalité

### Règles

- Détail : src/modules/jeu/ui/revelation.js:55 `partie?.repondre(...)` — la rapidité se mesure à l'instant où `revelation.js` est montré, pas à l'instant du toucher (spec : « de l'affichage du défi au choix ») ; au premier défi, le chargement de `revelation.js` et de son `.css` s'ajoute au temps, une personne qui répond à 14,9 s sur une connexion lente peut perdre 5 points ; correction : relever l'heure dans le `onclick` de src/modules/jeu/ui/jeu.js:88 et la passer à `repondre`
- Détail : src/modules/jeu/api.js:18 `.catch(() => …)` — toute erreur d'un écran vide l'emplacement sans trace, ce qui cache le défaut de US3 ; correction : ne vider que sur échec du `import`, pas sur une erreur dans `montrer`
- Info : le correctif de US1 sur les points de révélation reste en place ; la rapidité par l'heure (`performance.now`), pas par minuteur, tient l'onglet en arrière-plan
- Info : textes de SC3 identiques à `textes.md`, formes du singulier et du pluriel comprises ; aucun secret, aucune donnée gardée, `architecture.md`, `adr/` et `CHANGELOG.md` non touchés

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 88, pass 88, fail 0 »
Écrans : pas cliqués — le navigateur de l'outil est tenu par une autre session ; SC3 vu par le code seulement (textes, `aria-live`, confettis `aria-hidden`, coupure par `prefers-reduced-motion` dans le CSS et dans `fin.js`)
- SC3 à 390 et à 1280 : défilement de côté non vérifié, aucune capture `SC3-*.png`
- Les textes anglais du jeu n'existent pas (`passation.md` → Ouvert)

## US1 Jouer une partie de 5 défis

**Tour** : 2
**Date** : 2026-10-03
**Verdict** : validé

### Spec

- Info : les 5 scénarios restent faits et prouvés (tour 1) ; le correctif n'en touche aucun, `./build.sh` passe

### Règles

- Corrigé : la révélation d'une partie ne montrait pas les points — src/modules/jeu/ui/revelation.js:24 `lignesPoints` (« ⭐ +10 points », « ⚡ +5 points de rapidité », « 0 point », avec les valeurs de `calculerScore`), monté ligne 80 pour une partie seulement ; prouvé par quatre tests de tests/modules/jeu/jugement.test.js (rapide, lent, faux, égalité) ; ligne « 0 point » retirée, ligne de rapidité forcée, ou lignes montrées hors partie : chaque fois un test échoue
- Détail : README, tailles brutes de `jeu.css` et rappels `surChangement`, laissés tels quels par le correctif (choix écrit dans le commit) ; la mesure de rapidité après le chargement de `revelation.js` reste à regarder avec US2
- Info : tard, US3 — src/modules/jeu/ui/jeu.js:72 et src/modules/jeu/jugement.js:4 : « Composer mon défi » permis pendant que le compteur charge, `compter` rend alors `null` et la révélation d'un défi composé lèverait une erreur ; à regarder à la relecture de US3

### Correctifs

- Info : le correctif ajoute 12 lignes de code et 37 lignes de test, rien d'autre ; aucun test affaibli

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 88, pass 88, fail 0 »
Écrans : pas cliqués — tour 2 : seul le correctif est revu, par le code et les tests ; les écrans cliqués au tour 1 (SC1 SC2, 390 et 1280) n'ont pas été rejoués
- Les textes anglais du jeu n'existent pas (`passation.md` → Ouvert)

