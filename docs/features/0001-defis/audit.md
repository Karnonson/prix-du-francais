# Défis — audit

## US3 Composer mon propre défi

**Tour** : 2
**Date** : 2026-10-03
**Verdict** : validé

### Spec

- Corrigé : « Composer mon défi » touchable pendant que le compteur charge, révélation d'un défi composé sur `null` — src/modules/jeu/ui/jeu.js:35 `demander("composer")` : le bouton attend (`aria-busy`), l'écran composer s'ouvre dès que le compteur est prêt (jeu.js:49), une seule fois, et rien ne s'ouvre si le compteur échoue ; prouvé par quatre tests de tests/modules/jeu/compteur.test.js (pas prêt, prêt, touches répétées, échec) ; la ligne `|| quoi === "composer"` ajoutée à la garde fait échouer trois tests, et `const quoi = "partie"` à la reprise en fait échouer deux
- Info : les scénarios 1 à 5 restent faits et prouvés (tour 1) ; aucun test affaibli : l'ancien test « reste possible tant que le compteur charge » encodait le défaut et est remplacé par quatre tests du comportement voulu

### Règles

- Détail : src/modules/jeu/ui/jeu.js:35 `if (enAttente) return;` — la garde « une seule demande en attente » (toucher l'autre bouton pendant l'attente est ignoré, choix du commit) n'a aucun test : la retirer laisse les neuf tests verts ; ce qu'une personne y gagne ne change pas, une touche répétée du même bouton ne double rien ; correction : un test « C'est parti » puis « Composer mon défi » pendant l'attente
- Détail : src/modules/jeu/saisie.js:7 `caracteresVus` — compteur de frappe sans plafond (tour 1), laissé par le correctif, sans effet sur le refus ; correction : arrêter de compter à 281
- Info : tard — src/modules/jeu/api.js:18 `.catch(() => …)` vide l'emplacement pour toute erreur d'un écran sans trace ; le défaut qu'il cachait est corrigé en amont, reste une dette de diagnostic ; correction : ne vider que sur échec du `import`
- Info : M2 et M6 tenues par le correctif (`jeu.js` ne lit le compteur que par l'objet du contexte) ; aucun secret ; `architecture.md`, `adr/` et `CHANGELOG.md` non touchés par le correctif (ils changent par le merge de main)

### Correctifs

- Info : T12, 24 lignes de code (jeu.js) et 41 de test ; rien d'autre ; le texte du bouton n'a pas changé (« Composer mon défi », contenu.md:14), `aria-busy` suit le style de « C'est parti » (jeu.css:25)

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 91, pass 91, fail 0 »
Écrans : pas cliqués — tour 2 : seul le correctif est revu, par le code et les tests ; SC1 (état d’attente du bouton « Composer mon défi »), SC2 et SC4 n’ont pas été cliqués à 390 et à 1280, aucune capture `SC4-*.png`
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
- Info : textes de SC3 identiques à `contenu.md`, formes du singulier et du pluriel comprises ; aucun secret, aucune donnée gardée, `architecture.md`, `adr/` et `CHANGELOG.md` non touchés

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

