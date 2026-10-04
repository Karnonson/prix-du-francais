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

Ce que les récits partagent en dessous : de quoi lancer des tests, le module compteur, et la place du jeu
dans la page. La page elle-même ne change pas (pas de découpage de `index.html`, la copie Claude Artifact
reste telle quelle) : le jeu s'ajoute à côté, dans `src/modules/`.

- [x] T01 [US1] Lancer les tests dans `./build.sh` et copier `src/` dans `dist/`
  - [x] `./build.sh` construit `dist/index.html` comme avant, copie `src/` dans `dist/` à l'identique (`src/modules/x/y.js` devient `dist/modules/x/y.js`, rien si `src/` n'existe pas encore), puis lance `node --test tests/` et échoue si un test échoue ; `SANS_TESTS=1 ./build.sh` saute les tests
  - [x] Un test construit avec `SANS_TESTS=1` et vérifie que chaque fichier de `src/` est dans `dist/` au même chemin, avec le même contenu
  - [x] `tests/aide/faux-dom.js` offre un faux `document` minimal (créer un élément, y ajouter des enfants, lire son texte, poser un attribut, écouter et déclencher un clic) pour importer et monter un écran sans navigateur
  - [x] `decisions.md` nomme l'outil sous **Stack** (le lanceur de tests intégré à Node, aucune dépendance ajoutée, pour la règle M5) et le README dit comment lancer les tests
  Exigences : aucune
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Fichiers : build.sh, tests/assemblage.test.js, tests/aide/faux-dom.js, docs/features/0001-defis/decisions.md, README.md
  Après : aucune
  Taille : M
- [x] T02 [US1] Créer le module compteur : compter les jetons « Récent » en dehors de la page
  - [x] `src/modules/compteur/api.js` offre `creerCompteur()` qui charge le découpeur « Récent » (`o200k`, `gpt-tokenizer` 2.9.0) depuis jsDelivr, à la même adresse que la page, et rend `compter(texte)` (nombre de jetons et blocs), `pret()`, `echec()` et `surChangement(rappel)`
  - [x] Avec un faux découpeur, `compter` replie les morceaux vides dans le suivant et rend le vrai nombre de jetons (un caractère coupé en plusieurs jetons garde son compte)
  - [x] Le compteur compte toujours avec « Récent », que la page soit réglée sur « Plus ancien » ou non : il ne lit rien de la page
  - [x] Si le chargement échoue, `echec()` est vrai, `pret()` reste faux et `surChangement` prévient
  Exigences : EF4
  Risques : aucun — pas de connexion, pas de secret ; le texte ne quitte pas le navigateur
  Fichiers : src/modules/compteur/api.js, tests/modules/compteur/compteur.test.js
  Après : T01
  Taille : S
- [x] T03 [US1] Monter le jeu dans la page
  - [x] `index.html` a un emplacement `<section id="jeu">` avant le comparateur, et un `<script type="module">` qui importe `creerCompteur` et `monter` par leurs points d'entrée (`modules/compteur/api.js`, `modules/jeu/api.js`) et appelle `monter(document.getElementById("jeu"), creerCompteur())`
  - [x] `src/modules/jeu/api.js` offre `monter(el, compteur, ecrans?)` : il ne touche à rien d'autre que `el`, il s'importe sans navigateur (le DOM n'est touché qu'à l'appel), et il charge chaque écran à la demande depuis `ui/<écran>.js` (qui exporte `montrer(contexte)`), pour qu'un écran s'ajoute sans retoucher `api.js` ; le contexte offre `accueil()`, `demarrerPartie()`, `jouerSeul(defi)` et `composer()`
  - [x] Chaque écran charge son `.css` par un `<link>` créé depuis `import.meta.url`
  - [x] Publiée seule (la copie Claude Artifact, sans `modules/`), la page reste celle d'avant : l'emplacement reste vide et ne laisse aucun trou
  Exigences : EF4
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Fichiers : index.html, src/modules/jeu/api.js, tests/modules/jeu/branchement.test.js
  Après : T02
  Taille : M

---

## US1 — Jouer une partie de 5 défis (Priorité : P1) 🎯

**But** : jouer une partie de 5 défis de bout en bout, et voir les vrais chiffres.

**Test seul** : jouer les 5 défis d'une partie jusqu'au bout.

- [x] T04 [US1] Démarrer une partie et afficher le premier défi à choisir
  - [x] Étant donné que j'ouvre la page, quand je touche « C'est parti », alors je vois le premier défi : deux phrases, l'une en français, l'autre en anglais, et « Défi 1 sur 5 » ; l'accueil montre son titre, ses trois cartes, « C'est parti » et « Composer mon défi », avec les textes de `contenu.md` (SC1, SC2)
  - [x] Une partie tire 5 défis différents, dans un ordre au hasard, d'une liste écrite à la main d'au moins 5 défis ; le nombre 5 est une constante à un seul endroit
  - [x] Sur un écran de 390 pixels de large, l'accueil et le défi ne demandent aucun défilement de côté (vérifié à la relecture, à 390 et à 1280)
  Exigences : EF1, EF2, EF6
  Risques : aucun — pas de connexion, pas de secret, les défis viennent d'une liste fixe
  Écrans : SC1, SC2
  Fichiers : src/modules/jeu/partie.js, src/modules/jeu/ui/jeu.js, src/modules/jeu/ui/jeu.css, src/modules/jeu/api.js, tests/modules/jeu/partie.test.js
  Après : T03
  Taille : M
- [x] T05 [US1] Révéler les nombres de jetons après un choix, et passer au défi suivant
  - [x] Étant donné un défi affiché, quand je touche la phrase que je pense la plus chère, alors chaque phrase est découpée en blocs de jetons colorés, deux barres comparent les nombres écrits, et on me dit si j'ai bien deviné
  - [x] Étant donné que les deux phrases ont le même nombre de jetons, quand je touche l'une d'elles, alors on me dit « égalité » et le défi ne compte ni comme bon ni comme mauvais
  - [x] Étant donné une révélation affichée, quand je touche « Défi suivant », alors le défi suivant s'affiche ; après le 5e défi, le bouton mène à l'écran final
  - [x] Quand je touche deux fois de suite la même phrase, alors la réponse ne compte qu'une fois
  - [x] Les nombres révélés sont ceux du compteur « Récent » du module compteur
  - [x] Sur un écran de 390 pixels de large, les phrases, les blocs et les barres restent lisibles sans défilement de côté, même avec un mot très long (vérifié à la relecture, à 390 et à 1280)
  Exigences : EF3, EF4, EF5
  Risques : saisies — un texte à balises dans une phrase révélée en blocs → chaque bloc inséré comme texte, jamais comme code
  Écrans : SC2
  Fichiers : src/modules/jeu/jugement.js, src/modules/jeu/ui/revelation.js, src/modules/jeu/ui/revelation.css, tests/modules/jeu/jugement.test.js
  Après : T04
  Taille : M
- [x] T06 [P] [US1] Attendre ou refuser de démarrer selon l'état du compteur
  - [x] Étant donné que le compteur de jetons ne se charge pas, quand j'ouvre la page, alors le jeu ne démarre pas, la page dit « Le compteur de jetons ne répond pas… » (texte de `contenu.md`, SC1 erreur) et un bouton recharge la page
  - [x] Étant donné que le compteur charge encore, quand je touche « C'est parti », alors le jeu attend, puis démarre dès que le compteur est prêt ; s'il n'arrive pas, la page dit qu'il ne répond pas
  Exigences : EF14
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Écrans : SC1
  Fichiers : src/modules/jeu/ui/jeu.js, tests/modules/jeu/compteur.test.js
  Après : T04
  Taille : S
- [x] T07 [P] [US1] Ne rien garder d'une partie
  - [x] Étant donné une partie en cours, quand je ferme la page puis je la rouvre, alors je repars de l'accueil : une partie jouée en entier n'écrit rien dans le stockage du navigateur (localStorage, sessionStorage, cookies, IndexedDB)
  Exigences : EF13
  Risques : données personnelles — un score ou une phrase restant dans le navigateur → rien n'est écrit, vérifié sur une partie entière
  Fichiers : tests/modules/jeu/rien-garde.test.js
  Après : T05
  Taille : XS

**Point d'étape** : US1 marche seul → `/cadrer-x-examiner US1`.

---

## US2 — Voir mon score et rejouer (Priorité : P1)

**But** : finir sur un score amusant et rejouer tout de suite.

**Test seul** : finir une partie et toucher « Rejouer ».

- [x] T08 [P] [US2] Calculer le score et l'afficher à l'écran final, avec « Rejouer »
  - [x] Étant donné que j'ai répondu au 5e défi, quand j'arrive à l'écran final, alors je vois mon score fait de 10 points par bonne réponse plus 5 points de bonus pour chaque réponse donnée en 15 secondes ou moins, les deux séparés, le nombre de bonnes réponses sur 5 (même avec une égalité), et des confettis et des emojis ; une réponse fausse ou une égalité ne rapporte rien
  - [x] Étant donné l'écran final, quand je touche « Rejouer », alors une nouvelle partie de 5 défis démarre aussitôt, sans repasser par l'accueil ; « Retour à l'accueil » y mène
  - [x] Étant donné une partie où j'ai tout faux, quand j'arrive à l'écran final, alors je vois 0 point, sans confettis et sans moquerie, et le bouton « Rejouer »
  - [x] Quand je mets plus de 15 secondes à répondre, alors le bonus vaut 0 et ma bonne réponse compte quand même ses 10 points
  - [x] Quand je touche « Rejouer » plusieurs fois très vite, alors une seule partie démarre
  - [x] Sur un écran de 390 pixels de large, l'écran final ne demande aucun défilement de côté (vérifié à la relecture, à 390 et à 1280)
  Exigences : EF7, EF8
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Écrans : SC3
  Fichiers : src/modules/jeu/score.js, src/modules/jeu/ui/fin.js, src/modules/jeu/ui/fin.css, tests/modules/jeu/score.test.js
  Après : T05
  Taille : M
- [x] T09 [US2] Couper les animations quand l'appareil demande moins de mouvement
  - [x] Étant donné que mon appareil demande moins de mouvement, quand j'arrive à l'écran final ou à une révélation, alors il n'y a aucune animation : le score et les barres s'affichent tout de suite, sans perdre d'information
  - [x] Sans cette demande, les confettis, les emojis et les animations d'entrée jouent sur l'écran final et la révélation
  Exigences : EF8, EF9
  Risques : aucun — pas de connexion, pas de secret, rien de saisi
  Écrans : SC2, SC3
  Fichiers : src/modules/jeu/ui/animations.css, src/modules/jeu/ui/fin.js, src/modules/jeu/ui/revelation.css, tests/modules/jeu/mouvement.test.js
  Après : T08
  Taille : M

**Point d'étape** : US1 et US2 marchent chacun seul → `/cadrer-x-examiner US2`.

---

## US3 — Composer mon propre défi (Priorité : P2)

**But** : voir l'écart sur ses propres mots.

**Test seul** : écrire deux phrases et voir la révélation.

- [x] T10 [P] [US3] Écrire deux phrases et refuser celles qui sont vides ou trop longues
  - [x] Étant donné l'accueil, quand je touche « Composer mon défi », alors je vois deux champs, un pour la phrase française et un pour l'anglaise, chacun avec son étiquette et un compteur « n / 280 caractères », et rien n'est traduit pour moi
  - [x] Étant donné un champ vide ou fait seulement d'espaces, quand je touche « Jouer ce défi », alors on me dit quel champ est à remplir, et le défi ne démarre pas
  - [x] Étant donné une phrase plus longue que 280 caractères (ceux que je vois : un emoji ou une lettre accentuée compte pour un), quand je touche « Jouer ce défi », alors on me dit que la phrase est trop longue et de combien, et le défi ne démarre pas ; ce que j'ai écrit reste dans le champ
  - [x] Deux phrases correctes appellent `jouerSeul(defi)` du contexte avec les phrases telles qu'écrites ; « Retour à l'accueil » y mène
  - [x] Sur un écran de 390 pixels de large, l'écran composer ne demande aucun défilement de côté (vérifié à la relecture, à 390 et à 1280)
  Exigences : EF10, EF11
  Risques : saisies — une phrase vide, d'espaces ou énorme → vérifiée avant tout comptage, plafond de 280 caractères vus ; abus — un très long texte collé pour ralentir la page → refusé avant d'être découpé ; saisies — des balises dans un champ → affichées comme texte, jamais comme code
  Écrans : SC4
  Fichiers : src/modules/jeu/ui/composer.js, src/modules/jeu/ui/composer.css, src/modules/jeu/saisie.js, tests/modules/jeu/composer.test.js, tests/modules/jeu/saisie.test.js
  Après : T04
  Taille : M
- [x] T11 [US3] Jouer le défi composé, seul
  - [x] Étant donné deux phrases écrites, quand je touche « Jouer ce défi », alors je joue ce défi comme les autres : je choisis la phrase la plus chère (« Ton défi »), puis je vois la révélation (blocs colorés, barres), hors partie et hors score, avec « Composer un autre » et « Retour à l'accueil »
  - [x] Étant donné une phrase qui ressemble à du code (par exemple des balises), quand je joue le défi, alors elle s'affiche telle que je l'ai écrite, sans être interprétée
  Exigences : EF12
  Risques : saisies — des balises dans une phrase composée → affichée comme texte (jamais `innerHTML`), dans le choix et dans la révélation
  Écrans : SC2
  Fichiers : src/modules/jeu/ui/jeu.js, src/modules/jeu/ui/revelation.js, src/modules/jeu/api.js, tests/modules/jeu/jouer-seul.test.js
  Après : T05, T06, T10
  Taille : M

- [x] T12 [US3] Faire attendre « Composer mon défi » tant que le compteur charge (correctif de l'audit US3)
  - [x] Étant donné que le compteur charge encore, quand je touche « Composer mon défi », alors le bouton attend (occupé) et l'écran composer s'ouvre dès que le compteur est prêt, une seule fois même si je touche plusieurs fois
  - [x] Étant donné que le compteur est prêt, quand je touche « Composer mon défi », alors l'écran composer s'ouvre tout de suite
  - [x] Étant donné que j'attends et que le compteur échoue, alors la page dit qu'il ne répond pas et l'écran composer ne s'ouvre pas
  Exigences : EF12, EF14
  Risques : abus — un défi composé joué avant l'arrivée du compteur vidait tout le jeu sans un mot → le compteur est prêt avant que l'écran composer n'existe
  Écrans : SC1
  Fichiers : src/modules/jeu/ui/jeu.js, tests/modules/jeu/compteur.test.js
  Après : T11
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
- Vague 5 : T05, T06, T10
- Vague 6 : T07, T08, T11
- Vague 7 : T09

## À surveiller

- T04 : la page en anglais garde les textes du jeu en français, les textes anglais n'étant pas écrits (`passation.md` → Ouvert).
- T03 : la copie Claude Artifact (`index.html` publié seul) ne charge pas le jeu ; elle doit rester la page d'avant, sans trou ni erreur visible.
- T05 : un mot très long sans espace dans une phrase (jusqu'à 280 caractères) peut faire déborder les blocs à 390 pixels.
- T10 : un emoji composé (drapeau, famille) ou une lettre accentuée en deux morceaux doit compter pour un seul caractère vu.
- T08 : la rapidité se mesure de l'affichage du défi au choix ; un onglet laissé en arrière-plan ne doit pas donner de bonus à tort.

## Couverts

| Quoi | Tâches |
|---|---|
| US1 | T01, T02, T03, T04, T05, T06, T07 |
| US2 | T08, T09 |
| US3 | T10, T11 |
| EF1 | T04 |
| EF2 | T04 |
| EF3 | T05 |
| EF4 | T02, T03, T05 |
| EF5 | T05 |
| EF6 | T04 |
| EF7 | T08 |
| EF8 | T08, T09 |
| EF9 | T09 |
| EF10 | T10 |
| EF11 | T10 |
| EF12 | T11 |
| EF13 | T07 |
| EF14 | T06 |
| M2 | T05, T10, T11 |
| M5 | T01 |
| M6 | T02, T03 |
| M7 | T01 |

- Règles en conflit : aucune
