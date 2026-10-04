# Défis — audit

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

