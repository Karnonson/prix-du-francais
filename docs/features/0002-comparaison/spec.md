# Accueil — spec

**Branche** : `feature/comparaison`
**Créée** : 2026-10-04
**Statut** : validée
**Source** : `idee.md`, `decisions.md`

## Récits

### US1 — Comprendre le jeton et choisir (Priorité : P1)

En tant que personne qui arrive sur le site, d'abord le propriétaire sur son téléphone, je veux comprendre ce qu'est un jeton et ce que je peux faire ici, afin de choisir en connaissance de cause entre jouer et comparer.

**Pourquoi cette priorité** : sans ça, le jeu et le comparateur restent mélangés sans explication, comme aujourd'hui ; c'est le cœur de la mesure.

**Test seul** : se vérifie entièrement en ouvrant la page et en lisant l'accueil, et apporte déjà la compréhension, même sans toucher un bouton.

**Scénarios** :

1. **Étant donné** que j'ouvre le site, **quand** la page se charge, **alors** je vois le titre « Tokenette », une explication de ce qu'est un jeton et pourquoi ça compte, puis deux blocs égaux — « Jouer » et « Comparer » — chacun avec une icône, un titre et une phrase qui dit ce qu'il fait.
2. **Étant donné** l'accueil affiché, **quand** je regarde la page, **alors** je ne vois ni le jeu ni le comparateur : seul l'accueil est là.

---

### US2 — Passer de l'accueil à l'usage choisi, et revenir (Priorité : P1)

En tant que personne sur l'accueil, je veux basculer vers le jeu ou le comparateur d'un geste, et revenir à l'accueil ensuite, afin d'utiliser un seul des deux à la fois sans être distrait par l'autre.

**Pourquoi cette priorité** : c'est ce qui sépare enfin le jeu du comparateur, le problème que l'idée pointe.

**Test seul** : se vérifie entièrement en touchant « Jouer » puis « Retour à l'accueil », et apporte déjà la séparation des deux usages.

**Scénarios** :

1. **Étant donné** l'accueil affiché, **quand** je touche « Jouer », **alors** l'accueil disparaît et le jeu des défis prend toute la page, avec un bouton « Retour à l'accueil » visible.
2. **Étant donné** l'accueil affiché, **quand** je touche « Comparer », **alors** l'accueil disparaît et le comparateur (les exemples, la comparaison, l'explication de l'écart) prend toute la page, avec un bouton « Retour à l'accueil » visible.
3. **Étant donné** le jeu ou le comparateur affiché, **quand** je touche « Retour à l'accueil », **alors** je reviens à l'accueil tel qu'au premier chargement : les deux blocs, rien d'autre.
4. **Étant donné** que je suis en pleine partie de défis, **quand** je touche « Retour à l'accueil », **alors** la partie est perdue, comme si je fermais la page, et je repars de l'accueil.

---

### Cas limites

- Que se passe-t-il quand je touche « Jouer » ou « Comparer » avant que le compteur de jetons ait fini de charger ? Comme aujourd'hui : j'attends, la section démarre dès qu'il est prêt ; s'il ne répond pas, la section le dit.
- Que se passe-t-il quand je touche deux fois de suite « Jouer » ou « Comparer » ? Rien de plus : je reste sur la section déjà affichée.
- Que se passe-t-il sur un écran de téléphone étroit ? L'accueil, ses deux blocs et le bouton retour restent lisibles sans défiler de côté.

## Exigences

- **EF1** : Au premier chargement, l'appli DOIT montrer un accueil avec le titre « Tokenette », une explication de ce qu'est un jeton, et deux blocs « Jouer » / « Comparer », chacun avec une icône, un titre et une phrase qui dit ce qu'il fait, sans montrer le jeu ni le comparateur. (US1, scénarios 1 et 2)
- **EF2** : Toucher « Jouer » DOIT cacher l'accueil et montrer le jeu des défis, avec un bouton « Retour à l'accueil ». (US2, scénario 1)
- **EF3** : Toucher « Comparer » DOIT cacher l'accueil et montrer le comparateur, avec un bouton « Retour à l'accueil ». (US2, scénario 2)
- **EF4** : Toucher « Retour à l'accueil » DOIT cacher la section affichée et remontrer l'accueil seul. (US2, scénario 3)
- **EF5** : Quitter le jeu par « Retour à l'accueil » pendant une partie DOIT perdre la partie, comme fermer la page. (US2, scénario 4)
- **EF6** : La balise de titre du navigateur, le titre affiché sur la page, et le premier titre du README DOIVENT dire « Tokenette », sans « Le prix du français ». (US1, scénario 1)

## Critères

- **CS1** : Ce soir, le 4 octobre 2026 avant 20h, le propriétaire arrive sur la page sur son téléphone, sans aide, comprend ce qu'est un jeton, et choisit clairement entre jouer et comparer.
- **CS2** : Sur un écran de téléphone, l'accueil ne demande de défiler de côté à aucun moment.

## Supposé

- Le texte exact de l'explication du jeton et des deux phrases descriptives (Jouer, Comparer) est écrit à l'étape suivante, selon `cadrer-x-textes`, et validé par le propriétaire à la livraison.
- Les icônes des deux blocs sont des emojis, pas des images : 0 € et aucune nouvelle dépendance.
- Le bouton « Retour à l'accueil » est un bouton de la page, pas une nouvelle adresse : le bouton retour du navigateur n'est pas câblé spécialement.
- Si le jeu ou le comparateur ne charge pas, l'accueil s'affiche quand même normalement ; le problème n'apparaît qu'au clic sur le bloc concerné, comme aujourd'hui pour le jeu.

## Pas encore

- Garder ce que le visiteur a déjà joué, son meilleur score : fonctionnalité 0003 (progression), après celle-ci.
- Réécrire l'explication de pourquoi le français coûte plus (le pied de page) : elle existe déjà, elle n'est pas touchée ici.

## Vérifs

- [x] Chaque récit nomme une personne de `idee.md` et pourquoi ça compte pour elle ? (US1, US2)
- [x] Chaque scénario se vérifie par quelqu'un qui ne code pas, en faisant et en regardant ? (US1, US2)
- [x] Chaque décision de `decisions.md` apparaît dans un récit ou sous Pas encore ? (D1-D5 dans US1/US2 ; D6 sous Supposé)
- [x] Qui peut voir, changer ou télécharger chaque donnée personnelle est dit ? (aucune donnée personnelle : rien n'est gardé)
- [x] Chaque point ouvert est tranché, supposé, ou posé dans `a-trancher.md` avec un conseil ? (tout tranché dans `decisions.md` ou en Supposé ; aucun `a-trancher.md` nécessaire)
