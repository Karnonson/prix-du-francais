# Jeu plus marrant — tâches

**Source** : `spec.md`, `decisions.md`, `contenu.md`

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

## US1 — Un jeu qui fait sourire (Priorité : P1) 🎯

**But** : des verdicts taquins, un titre rigolo à la fin et 10 défis surprenants, dont 4 pièges des mots.

**Test seul** : se vérifie entièrement en jouant une partie sur téléphone, et apporte un jeu qui fait sourire.

- [x] T01 [US1] Ajouter les 10 nouveaux défis à la suite des 20 actuels
  - [x] Étant donné plusieurs parties, quand je joue, alors les défis sont tirés parmi 30, dont les 10 nouveaux de `contenu.md` (au moins 4 pièges des mots), et les défis déjà joués gardés par le navigateur restent les mêmes.
  Exigences : EF3, EF4, EF5
  Risques : aucun — des phrases fixes écrites à la main, aucune saisie nouvelle
  Fichiers : src/modules/jeu/partie.js, tests/modules/jeu/defis-marrants.test.js
  Après : aucune
  Taille : S
- [x] T02 [P] [US1] Afficher une phrase taquine avant le verdict de la révélation
  - [x] Étant donné une partie en cours, quand je choisis la bonne phrase, alors la révélation montre une des 4 phrases taquines de la bonne réponse (`contenu.md`), puis la ligne actuelle « Dans le mille : … » avec les nombres de jetons.
  - [x] Étant donné une partie en cours, quand je choisis la mauvaise phrase, alors la révélation montre une des 4 phrases taquines du raté, puis la ligne actuelle « Aïe, raté : … ».
  - [x] Étant donné un défi où les deux phrases ont le même nombre de jetons, quand je choisis l'une ou l'autre, alors la révélation montre une des 4 phrases taquines de l'égalité, puis la ligne actuelle « Match nul : … ».
  Exigences : EF1, EF4
  Risques : aucun — textes fixes insérés comme texte (M2) ; le tirage au hasard se donne par le contexte (`hasard`, par défaut `Math.random`) pour que le test le pilote
  Fichiers : src/modules/jeu/ui/revelation.js, tests/modules/jeu/revelation-taquine.test.js
  Après : aucune
  Taille : S
- [x] T03 [P] [US1] Afficher le titre de fin selon les bonnes réponses
  - [x] Étant donné une partie finie avec 3 bonnes réponses sur 5, quand l'écran de fin s'affiche, alors je vois sous le score le titre « 📒 Comptable du dimanche » ; avec 0 à 5 bonnes réponses, le titre est celui de `contenu.md` pour ce nombre.
  Exigences : EF2, EF4
  Risques : aucun — textes fixes insérés comme texte (M2), aucune saisie nouvelle
  Fichiers : src/modules/jeu/ui/fin.js, tests/modules/jeu/titre-fin.test.js
  Après : aucune
  Taille : S

**Point d'étape** : US1 marche seul → `/cadrer-x-examiner US1`.

---

## Ordre

1. `/cadrer-x-realiser <fonctionnalité>` construit toutes les tâches, chacune dans son worktree, deux
   tâches `[P]` à la fois ; les autres attendent ce que nomme leur `Après :`. À la main, une tâche :
   `/cadrer-x-realiser T<nn>`.
2. À chaque point d'étape, le récit est relu par quelqu'un qui ne l'a pas construit
   (`/cadrer-x-examiner US<n>`) ; `realiser` lance cette relecture lui-même.
3. Après US1 : la plus petite version qui vaut d'être montrée. On peut s'arrêter là et la montrer.
4. Un récit ajouté ne casse jamais ceux d'avant : leurs tests restent verts.

- Vague 1 : T01, T02, T03

## À surveiller

- T01 : les nombres de jetons des 10 nouveaux défis ne sont pas comptés par les tests (le compteur se charge en ligne) ; la relecture les compare au tableau de `contenu.md` avec le compteur « Récent » sur la vraie page, pièges des mots compris.
- T01 : les 20 défis actuels gardent leur texte et leur place, sinon la progression gardée désigne d'autres défis.
- T02 : un défi composé passe par la même révélation et reçoit aussi une phrase taquine (cas limite de la spec).
- T02 : la révélation avec sa phrase taquine se vérifie sur la vraie page à 390 et 1280 de large, sans débordement.
- T03 : l'écran de fin à 0 bonne réponse (sans confettis) et à 5, vérifié sur la vraie page à 390 et 1280 de large.

## Couverts

| Quoi | Tâches |
|---|---|
| US1 | T01, T02, T03 |
| EF1 | T02 |
| EF2 | T03 |
| EF3 | T01 |
| EF4 | T01, T02, T03 |
| EF5 | T01 |
| M2 | T02, T03 |
| M7 | T01, T02, T03 |

- Règles en conflit : aucune
