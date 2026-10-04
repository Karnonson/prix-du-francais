# Accueil — tâches

**Source** : `spec.md`, `decisions.md`, `passation.md` (s'il y a des écrans)

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

aucune

---

## US1 — Comprendre le jeton et choisir (Priorité : P1) 🎯

**But** : au premier chargement, montrer le titre « Tokenette », l'explication du jeton et les deux
blocs Jouer/Comparer, sans rien d'autre.

**Test seul** : se vérifie entièrement en ouvrant la page et en lisant l'accueil.

- [x] T01 [US1] Afficher l'accueil au chargement : titre, explication du jeton, blocs Jouer/Comparer
  - [x] Étant donné que j'ouvre le site, quand la page se charge, alors je vois le titre « Tokenette », une explication de ce qu'est un jeton et pourquoi ça compte, puis deux blocs égaux — « Jouer » et « Comparer » — chacun avec une icône, un titre et une phrase qui dit ce qu'il fait.
  - [x] Étant donné l'accueil affiché, quand je regarde la page, alors je ne vois ni le jeu ni le comparateur : seul l'accueil est là.
  - [x] Étant donné le dépôt, quand j'ouvre `index.html` et `README.md`, alors le titre de l'onglet, le titre affiché sur la page et le premier titre du README disent « Tokenette », sans « Le prix du français ».
  Exigences : EF1, EF6
  Risques : aucun — affichage statique, aucune saisie ni donnée nouvelle
  Écrans : SC1
  Fichiers : index.html, README.md, tests/aide/accueil.js, tests/accueil.test.js
  Après : aucune
  Taille : M

**Point d'étape** : US1 marche seul → `/cadrer-x-examiner US1`.

---

## US2 — Passer de l'accueil à l'usage choisi, et revenir (Priorité : P1)

**But** : basculer d'un geste entre l'accueil, le jeu et le comparateur, avec un retour qui n'use
jamais les deux usages en même temps.

**Test seul** : se vérifie entièrement en touchant « Jouer » puis « Retour à l'accueil ».

- [ ] T02 [US2] Faire basculer vers le jeu ou le comparateur, avec le bouton retour
  - [ ] Étant donné l'accueil affiché, quand je touche « Jouer », alors l'accueil disparaît et le jeu des défis prend toute la page, avec un bouton « Retour à l'accueil » visible.
  - [ ] Étant donné l'accueil affiché, quand je touche « Comparer », alors l'accueil disparaît et le comparateur prend toute la page, avec un bouton « Retour à l'accueil » visible.
  - [ ] Étant donné le jeu ou le comparateur affiché, quand je touche « Retour à l'accueil », alors je reviens à l'accueil tel qu'au premier chargement : les deux blocs, rien d'autre.
  - [ ] Étant donné l'accueil affiché, quand je touche deux fois de suite « Jouer » ou « Comparer », alors je reste sur la section déjà affichée, sans erreur.
  Exigences : EF2, EF3, EF4
  Risques : abus — clics rapides et répétés sur Jouer, Comparer ou Retour → un seul état affiché à la fois, pas de montage multiple
  Écrans : SC1
  Fichiers : src/main.js, tests/accueil.test.js
  Après : T01
  Taille : S
- [ ] T03 [US2] Perdre la partie en cours en revenant à l'accueil
  - [ ] Étant donné que je suis en pleine partie de défis, quand je touche « Retour à l'accueil », alors la partie est perdue, comme si je fermais la page, et je repars de l'accueil.
  Exigences : EF5
  Risques : aucun — remonter le jeu ne touche qu'à son propre état en mémoire, rien d'externe
  Fichiers : src/main.js, tests/accueil.test.js
  Après : T02
  Taille : S

**Point d'étape** : US1 et US2 marchent chacun seul → `/cadrer-x-examiner US2`.

---

## Ordre

1. `/cadrer-x-realiser <fonctionnalité>` construit toutes les tâches, chacune dans son worktree, deux
   tâches `[P]` à la fois ; les autres attendent ce que nomme leur `Après :`. À la main, une tâche :
   `/cadrer-x-realiser T<nn>`.
2. À chaque point d'étape, le récit est relu par quelqu'un qui ne l'a pas construit
   (`/cadrer-x-examiner US<n>`) ; `realiser` lance cette relecture lui-même.
3. Après US1 : la plus petite version qui vaut d'être montrée. On peut s'arrêter là et la montrer.
4. Un récit ajouté ne casse jamais ceux d'avant : leurs tests restent verts.

- Vague 1 : T01
- Vague 2 : T02
- Vague 3 : T03

## À surveiller

- T01 : l'accueil à 390 px, sans défilement de côté (cas limite de l'écran de téléphone étroit) — vérifié à la relecture, pas par un test automatisé.
- T02 : toucher « Jouer » ou « Comparer » avant que le compteur de jetons ait fini de charger reste comme aujourd'hui (la section attend, ou dit l'échec) — comportement existant, non retesté ici.

## Couverts

| Quoi | Tâches |
|---|---|
| US1 | T01 |
| US2 | T02, T03 |
| EF1 | T01 |
| EF2 | T02 |
| EF3 | T02 |
| EF4 | T02 |
| EF5 | T03 |
| EF6 | T01 |

- Règles en conflit : aucune
