# Défis — tâches

**Source** : `spec.md`, `decisions.md`, `passation.md`

## Format

`- [ ] T01 [P] [US1] <verbe> <ce qu'elle construit>`, puis ses lignes :

- `- [ ] <fait quand>` : un scénario de la spec, comme la vérification que le test de la tâche prouve.
  Chaque scénario de `spec.md` est la case d'une seule tâche ; une case qu'aucun scénario ne demande
  est du hors-champ.
- `Exigences :` les `EF<n>` de la spec que la tâche rend vraies.
- `Risques :` <domaine> — <menace> → <protection> ; … ou `aucun — <pourquoi>`. Un test par risque.
- `Écrans :` les `SC<n>` de `passation.md` qu'elle construit ou change ; pas de ligne sans écran.
- `Fichiers :` les chemins exacts, tests compris ; la tâche ne touche qu'eux.
- `Après :` les tâches sans lesquelles elle ne se construit ni ne se teste, ou `aucune`.
- `Taille :` XS (1 fichier), S (1–2), M (3–5). Au-delà, ou un « et » dans le titre : deux tâches.
- `[P]` : elle peut se construire en même temps que la tâche d'avant (son `Après :` ne la nomme pas,
  et elles n'ont aucun fichier en commun).

Chaque tâche est une tranche fine qui traverse toutes les couches dont elle a besoin (ce qu'on garde,
la règle, ce qu'on voit) et qu'un test prouve, jamais une couche seule (« la table », « les routes »).
Le test s'écrit en premier, dans la tâche elle-même : pas de tâche de tests à part.

## Fondations

Tâches de refactor, sans changement pour la personne : la page fait la même chose avant et après chacune,
et chacune sort un morceau de `main.js` dans son module, en le supprimant de `main.js`.

- [ ] T01 [US1] Déplacer la page dans `src/`, en fichiers séparés
  - [ ] `./build.sh` copie `src/` tel quel dans `dist/` (plus d'enveloppe) : `dist/index.html` est un document complet qui charge `styles.css` et `main.js` (`<script type="module">`), sans style ni script écrits dedans
  - [ ] La page se comporte comme avant (comparateur, exemples, bascule FR/EN, bouton « Traduire », polices, compteur chargé depuis jsDelivr), vérifié en servant `dist/` (`python3 -m http.server -d dist`), le test automatique venant avec T02
  Exigences : aucune
  Risques : aucun — pas de connexion, pas de secret, rien de nouveau
  Fichiers : index.html, src/index.html, src/styles.css, src/main.js, build.sh
  Après : aucune
  Taille : M
- [ ] T02 [US1] Lancer les tests dans `./build.sh`
  - [ ] `./build.sh` lance `node --test tests/` (lanceur de Node, aucune dépendance ajoutée) et échoue si un test échoue
  - [ ] Un test lit `dist/` après la construction : `index.html` charge `styles.css` et `main.js`, et `main.js` existe
  - [ ] Le README décrit `src/`, `build.sh`, le test et le serveur local, et ne parle plus de la copie Claude Artifact
  Exigences : aucune
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Fichiers : build.sh, tests/assemblage.test.js, README.md
  Après : T01
  Taille : S
- [ ] T03 [US1] Sortir le compteur de jetons dans le module compteur
  - [ ] `src/modules/compteur/api.js` charge les deux tokenizers depuis jsDelivr (version 2.9.0) et offre `compter(texte, tokenizer = "o200k")` (nombre et blocs, un caractère coupé en plusieurs jetons gardant son vrai compte), `pret()`, `echec()` et `surChangement(rappel)`
  - [ ] Avec un faux tokenizer, `compter` replie les morceaux vides dans le suivant et rend le vrai nombre de jetons
  - [ ] La page compte et affiche les mêmes nombres qu'avant, par ce module
  Exigences : EF4
  Risques : aucun — pas de connexion, pas de secret ; le texte ne quitte pas le navigateur
  Fichiers : src/modules/compteur/api.js, src/main.js, tests/modules/compteur/compteur.test.js
  Après : T02
  Taille : M
- [ ] T04 [US1] Brancher le module jeu sur la page
  - [ ] `src/modules/jeu/api.js` offre `monter(el, compteur)` ; `main.js` l'importe et l'appelle sur `<main id="jeu">`, placé avant le comparateur, avec le module compteur ; `monter` ne touche à rien d'autre que `el`
  - [ ] `dist/` contient `modules/jeu/api.js` et `modules/compteur/api.js`
  Exigences : EF4
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Fichiers : src/modules/jeu/api.js, src/main.js, src/index.html, tests/modules/jeu/branchement.test.js
  Après : T03
  Taille : M
- [ ] T05 [US1] Sortir les textes et les formats dans le module langue
  - [ ] `src/modules/langue/api.js` et `textes.js` offrent la langue de la page, `t(clé)`, `fmt`, `pct`, `times` et un abonnement au changement de langue ; la bascule FR/EN fait ce qu'elle faisait
  - [ ] `fmt`, `pct` et `times` rendent les formats français et anglais d'avant (`fr-CA`, `en-CA`)
  Exigences : aucune
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Fichiers : src/modules/langue/api.js, src/modules/langue/textes.js, src/main.js, tests/modules/langue/langue.test.js
  Après : T04
  Taille : M
- [ ] T06 [US1] Sortir le graphique des mesures dans le module mesures
  - [ ] `src/modules/mesures/api.js` offre les mesures fixes et le dessin du graphique ; la page l'affiche comme avant, dans les deux langues
  - [ ] Pour les mesures fournies, la bande et les rapports français sur anglais sont ceux d'avant
  Exigences : aucune
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Fichiers : src/modules/mesures/api.js, src/main.js, tests/modules/mesures/mesures.test.js
  Après : T05
  Taille : S
- [ ] T07 [US1] Sortir le comparateur (les deux cases, les exemples, le verdict) dans son module
  - [ ] `src/modules/comparateur/api.js`, `affichage.js` et `exemples.js` portent les deux cases, les blocs, le verdict, les barres et les trois exemples, par les modules compteur et langue ; la page fait ce qu'elle faisait
  - [ ] Les trois exemples gardent leurs textes d'avant, dans les deux langues
  Exigences : aucune
  Risques : saisies — du texte tapé dans une case affiché dans la page → inséré comme texte, jamais comme code, comme avant
  Fichiers : src/modules/comparateur/api.js, src/modules/comparateur/affichage.js, src/modules/comparateur/exemples.js, src/main.js, tests/modules/comparateur/exemples.test.js
  Après : T06
  Taille : M
- [ ] T08 [US1] Sortir le bouton « Traduire » dans le comparateur
  - [ ] `src/modules/comparateur/traduction.js` garde le bouton « Traduire » comme avant : caché hors d'un lecteur Claude qui accepte `sample`, visible dedans ; `main.js` ne contient plus que le branchement des modules
  - [ ] La consigne envoyée pour traduire vers le français (tutoiement) et vers l'anglais est celle d'avant
  Exigences : aucune
  Risques : saisies — la traduction rendue par l'IA mise dans la case → insérée comme texte, jamais comme code
  Fichiers : src/modules/comparateur/traduction.js, src/modules/comparateur/api.js, src/main.js, tests/modules/comparateur/traduction.test.js
  Après : T07
  Taille : M

---

## US1 — Jouer une partie de 5 défis (Priorité : P1) 🎯

**But** : jouer une partie de 5 défis de bout en bout, et voir les vrais chiffres.

**Test seul** : jouer les 5 défis d'une partie jusqu'au bout.

- [ ] T09 [P] [US1] Démarrer une partie et afficher le premier défi à choisir
  - [ ] Étant donné que j'ouvre la page, quand je touche « C'est parti », alors je vois le premier défi : deux phrases, l'une en français, l'autre en anglais, et « Défi 1 sur 5 »
  - [ ] Une partie tire 5 défis différents, dans un ordre au hasard, d'une liste écrite à la main d'au moins 5 défis ; le nombre 5 est une constante à un seul endroit
  - [ ] Le module jeu est fait de vrais modules JavaScript (`import`/`export`, chemins relatifs avec `.js`) qui s'importent sans navigateur : le DOM n'est touché qu'à l'appel de `monter` ; chaque écran charge son `.css` par un `<link>` créé depuis `import.meta.url` ; `api.js` offre `monter(el, compteur)` et garde `ecrans`, `demarrerPartie()`, `jouerSeul(defi)` et `suivant()` ; au choix d'une phrase il appelle `ecrans.revelation({defi, choix, comptes, ms})` et, après le 5e défi, `ecrans.fin(resultats)` (en attendant, il écrit « Partie terminée ») ; le bouton « Composer mon défi » appelle `ecrans.composer()`
  Exigences : EF1, EF2, EF6
  Risques : aucun — pas de connexion, pas de secret, les défis viennent d'une liste fixe
  Écrans : SC1, SC2
  Fichiers : src/modules/jeu/defis.js, src/modules/jeu/partie.js, src/modules/jeu/api.js, src/modules/jeu/ui/jeu.css, tests/modules/jeu/partie.test.js
  Après : T04
  Taille : M
- [ ] T10 [US1] Révéler les nombres de jetons après un choix, et passer au défi suivant
  - [ ] Étant donné un défi affiché, quand je touche la phrase que je pense la plus chère, alors chaque phrase est découpée en blocs de jetons colorés, deux barres comparent les nombres écrits, et on me dit si j'ai bien deviné
  - [ ] Étant donné que les deux phrases ont le même nombre de jetons, quand je touche l'une d'elles, alors on me dit « égalité » et le défi ne compte ni comme bon ni comme mauvais
  - [ ] Étant donné une révélation affichée, quand je touche « Défi suivant », alors le défi suivant s'affiche ; après le 5e défi, le bouton mène à l'écran final
  - [ ] Quand je touche deux fois de suite la même phrase, alors la réponse ne compte qu'une fois
  Exigences : EF3, EF4, EF5, EF12
  Risques : saisies — un texte à balises dans une phrase révélée en blocs → chaque bloc inséré comme texte, jamais comme code
  Écrans : SC2
  Fichiers : src/modules/jeu/jugement.js, src/modules/jeu/ui/revelation.js, src/modules/jeu/ui/revelation.css, tests/modules/jeu/jugement.test.js
  Après : T09
  Taille : M
- [ ] T11 [P] [US1] Refuser de démarrer quand le compteur ne se charge pas
  - [ ] Étant donné que le compteur de jetons ne se charge pas, quand j'ouvre la page, alors le jeu ne démarre pas, la page dit « le compteur n'a pas pu se charger » et un bouton recharge la page
  Exigences : EF14
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Écrans : SC1
  Fichiers : src/modules/jeu/api.js, tests/modules/jeu/compteur.test.js
  Après : T09
  Taille : S
- [ ] T12 [P] [US1] Ne rien garder d'une partie
  - [ ] Étant donné une partie en cours, quand je ferme la page puis je la rouvre, alors je repars de l'accueil : une partie jouée en entier n'écrit rien dans le stockage du navigateur (localStorage, sessionStorage, cookies, IndexedDB)
  Exigences : EF13
  Risques : données personnelles — un score ou une phrase restant dans le navigateur → rien n'est écrit, vérifié sur une partie entière
  Fichiers : tests/modules/jeu/rien-gardé.test.js
  Après : T10
  Taille : XS

**Point d'étape** : US1 marche seul → `/cadrer-x-examiner US1`.

---

## US2 — Voir mon score et rejouer (Priorité : P1)

**But** : finir sur un score amusant et rejouer tout de suite.

**Test seul** : finir une partie et toucher « Rejouer ».

- [ ] T13 [P] [US2] Calculer le score et l'afficher à l'écran final, avec « Rejouer »
  - [ ] Étant donné que j'ai répondu au 5e défi, quand j'arrive à l'écran final, alors je vois mon score, les points des bonnes réponses, le bonus de rapidité, le nombre de bonnes réponses sur 5 : 10 points par bonne réponse, un bonus de 5 points à 3 s ou moins qui descend à 0 à 15 s, une réponse fausse ou une égalité ne rapporte rien
  - [ ] Étant donné l'écran final, quand je touche « Rejouer », alors une nouvelle partie de 5 défis démarre aussitôt, sans repasser par l'accueil
  - [ ] Étant donné une partie où j'ai tout faux, quand j'arrive à l'écran final, alors je vois un score bas, sans moquerie, et le bouton « Rejouer »
  - [ ] Quand je mets plus de 15 s à répondre, alors le bonus vaut 0 et ma bonne réponse compte quand même
  Exigences : EF7, EF8
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Écrans : SC3
  Fichiers : src/modules/jeu/score.js, src/modules/jeu/ui/fin.js, src/modules/jeu/ui/fin.css, tests/modules/jeu/score.test.js
  Après : T10
  Taille : M
- [ ] T14 [US2] Animer la fin et la révélation, sauf si l'appareil demande moins de mouvement
  - [ ] Étant donné que mon appareil demande moins de mouvement, quand j'arrive à l'écran final ou à une révélation, alors il n'y a aucune animation : le score et les barres s'affichent tout de suite, sans perdre d'information
  - [ ] Étant donné un appareil sans cette demande, quand j'arrive à l'écran final, alors les confettis, les emojis et les animations d'entrée jouent
  Exigences : EF8, EF9
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Écrans : SC2, SC3
  Fichiers : src/modules/jeu/ui/animations.css, src/modules/jeu/ui/fin.js, src/modules/jeu/ui/revelation.css, tests/modules/jeu/mouvement.test.js
  Après : T13
  Taille : M

**Point d'étape** : US1 et US2 marchent chacun seul → `/cadrer-x-examiner US2`.

---

## US3 — Composer mon propre défi (Priorité : P2)

**But** : voir l'écart sur ses propres mots.

**Test seul** : écrire deux phrases et voir la révélation.

- [ ] T15 [P] [US3] Écrire deux phrases et jouer ce défi seul
  - [ ] Étant donné l'accueil, quand je touche « Composer mon défi », alors je vois deux champs, un pour la phrase française et un pour l'anglaise, chacun avec son étiquette, et rien n'est traduit pour moi
  - [ ] Étant donné deux phrases écrites, quand je touche « Jouer ce défi », alors je joue ce défi comme les autres : je choisis la phrase la plus chère, puis je vois la révélation, hors partie et hors score, avec « Composer un autre » et un retour à l'accueil
  - [ ] Étant donné une phrase qui ressemble à du code (par exemple des balises), quand je joue le défi, alors elle s'affiche telle que je l'ai écrite, sans être interprétée
  Exigences : EF10, EF12
  Risques : saisies — des balises dans une phrase composée → affichée comme texte (jamais `innerHTML`), dans les champs, le choix et la révélation
  Écrans : SC2, SC4
  Fichiers : src/modules/jeu/ui/composer.js, src/modules/jeu/ui/composer.css, src/modules/jeu/api.js, src/modules/jeu/ui/revelation.js, tests/modules/jeu/composer.test.js
  Après : T10, T11
  Taille : M
- [ ] T16 [US3] Refuser une phrase composée vide ou trop longue
  - [ ] Étant donné un champ vide ou fait seulement d'espaces, quand je touche « Jouer ce défi », alors on me dit quel champ est à remplir, et le défi ne démarre pas
  - [ ] Étant donné une phrase plus longue que 280 caractères, quand je touche « Jouer ce défi », alors on me dit que la phrase est trop longue et de combien, et le défi ne démarre pas ; ce que j'ai écrit reste dans le champ
  Exigences : EF11
  Risques : saisies — une phrase vide, d'espaces ou énorme envoyée au compteur → vérifiée avant tout comptage, plafond de 280 caractères ; abus — un très long texte collé pour ralentir la page → refusé avant d'être découpé
  Écrans : SC4
  Fichiers : src/modules/jeu/saisie.js, src/modules/jeu/ui/composer.js, tests/modules/jeu/saisie.test.js
  Après : T15
  Taille : S

**Point d'étape** : US1, US2 et US3 marchent chacun seul → `/cadrer-x-examiner US3`.

---

## Ordre

1. Une tâche par session : `/cadrer-x-realiser T<nn>`, chacune dans son worktree. Les tâches `[P]`
   peuvent tourner en même temps, chacune dans sa session ; les autres attendent ce que nomme leur `Après :`.
2. À chaque point d'étape, la relecture du récit, dans une autre session : `/cadrer-x-examiner US<n>`.
3. Après US1 : la plus petite version qui vaut d'être montrée. On peut s'arrêter là et la montrer.
4. Un récit ajouté ne casse jamais ceux d'avant : leurs tests restent verts.

- Vague 1 : T01
- Vague 2 : T02
- Vague 3 : T03
- Vague 4 : T04
- Vague 5 : T05, T09
- Vague 6 : T06, T10, T11
- Vague 7 : T07, T12, T13, T15
- Vague 8 : T08, T14, T16

## À surveiller

- T09 : « C'est parti » touché alors que le compteur charge encore (ni prêt ni en échec) : le jeu doit attendre ou refuser, pas démarrer sans nombres.
- T09 : la page en anglais garde les textes du jeu en français, les textes anglais n'étant pas écrits (`passation.md` → Ouvert).
- T13 : « Rejouer » touché plusieurs fois très vite ne doit lancer qu'une partie.
- T15 : un défi composé joué seul ne doit entrer dans aucun score de partie.

## Couverts

| Quoi | Tâches |
|---|---|
| US1 | T01, T02, T03, T04, T05, T06, T07, T08, T09, T10, T11, T12 |
| US2 | T13, T14 |
| US3 | T15, T16 |
| EF1 | T09 |
| EF2 | T09 |
| EF3 | T10 |
| EF4 | T03, T04, T10 |
| EF5 | T10 |
| EF6 | T09 |
| EF7 | T13 |
| EF8 | T13, T14 |
| EF9 | T14 |
| EF10 | T15 |
| EF11 | T16 |
| EF12 | T10, T15 |
| EF13 | T12 |
| EF14 | T11 |
| M2 | T10, T15, T16 |
| M6 | T03, T04 |
| M7 | T02 |

- Règles en conflit : aucune
