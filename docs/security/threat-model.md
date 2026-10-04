# Tokenette — menaces

Une ligne par risque nommé dans `Risques :` d'une tâche : sa protection, et le test qui la prouve.
Aucun secret, aucune connexion, aucune donnée gardée.

## Défis (0001)

| Domaine | Menace | Protection | Test |
|---|---|---|---|
| saisies | un texte à balises dans une phrase révélée en blocs (T05) | chaque bloc est inséré comme texte, jamais comme code | `tests/modules/jeu/jugement.test.js` — « des balises dans une phrase révélée en blocs restent du texte » |
| saisies | une phrase vide, d'espaces ou énorme dans « Composer mon défi » (T10) | vérifiée avant tout comptage, plafond de 280 caractères vus | `tests/modules/jeu/saisie.test.js`, `composer.test.js` |
| abus | un très long texte collé pour ralentir la page (T10) | refusé avant d'être découpé en jetons | `tests/modules/jeu/saisie.test.js` — « un texte énorme est refusé vite, sans être découpé en jetons » |
| saisies | des balises dans un champ ou une phrase composée (T10, T11) | affichées comme texte (jamais `innerHTML`), dans le choix et dans la révélation | `tests/modules/jeu/composer.test.js`, `jouer-seul.test.js` |
| abus | un défi composé joué avant l'arrivée du compteur vidait le jeu (T12) | « Composer mon défi » attend que le compteur soit prêt | `tests/modules/jeu/compteur.test.js` — quatre tests |
| données personnelles | un score ou une phrase restant dans le navigateur (T07) | rien n'est écrit (localStorage, sessionStorage, cookies, IndexedDB) | `tests/modules/jeu/rien-garde.test.js` |

Reste : le compteur de frappe de l'écran composer découpe tout le texte collé à chaque frappe (environ 0,9 s pour 5 millions de caractères) ; sans effet sur le refus.
