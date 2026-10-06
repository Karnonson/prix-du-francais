# Jeu plus marrant — spec

**Branche** : `feature/jeu-marrant`
**Créée** : 2026-10-05
**Statut** : validée
**Source** : `idee.md`, `decisions.md`

## Récits

### US1 — Un jeu qui fait sourire (Priorité : P1)

En tant que personne qui joue une partie sur son téléphone, je veux des verdicts taquins, un titre rigolo à la fin et des défis surprenants afin de rire en découvrant ce que coûtent le français et l'anglais.

**Pourquoi cette priorité** : c'est toute la fonctionnalité ; le jeu marche déjà, il lui manque le côté amusant promis.

**Test seul** : se vérifie entièrement en jouant une partie sur téléphone, et apporte un jeu qui fait sourire.

**Scénarios** :

1. **Étant donné** une partie en cours, **quand** je choisis la bonne phrase, **alors** la révélation montre une des 4 phrases taquines de la bonne réponse (`contenu.md`), puis la ligne actuelle « Dans le mille : … » avec les nombres de jetons.
2. **Étant donné** une partie en cours, **quand** je choisis la mauvaise phrase, **alors** la révélation montre une des 4 phrases taquines du raté, puis la ligne actuelle « Aïe, raté : … ».
3. **Étant donné** un défi où les deux phrases ont le même nombre de jetons, **quand** je choisis l'une ou l'autre, **alors** la révélation montre une des 4 phrases taquines de l'égalité, puis la ligne actuelle « Match nul : … ».
4. **Étant donné** une partie finie avec 3 bonnes réponses sur 5, **quand** l'écran de fin s'affiche, **alors** je vois sous le score le titre « 📒 Comptable du dimanche » ; avec 0 à 5 bonnes réponses, le titre est celui de `contenu.md` pour ce nombre.
5. **Étant donné** plusieurs parties, **quand** je joue, **alors** les défis sont tirés parmi 30, dont les 10 nouveaux de `contenu.md` (au moins 4 pièges des mots), et les défis déjà joués gardés par le navigateur restent les mêmes.

### Cas limites

- Un défi composé soi-même (hors partie) : sa révélation reçoit aussi une phrase taquine, puisque c'est le même écran ; il ne donne aucun titre de fin.
- Moins de mouvement demandé : les phrases et le titre s'affichent sans animation.
- Une progression gardée avant cette version : les 20 premiers défis gardent leur place, les défis déjà vus restent justes.

## Exigences

- **EF1** : La révélation DOIT afficher une phrase taquine tirée au hasard parmi les 4 de son cas (bonne réponse, raté, égalité), avant la ligne actuelle avec les nombres de jetons, qui ne change pas.
- **EF2** : L'écran de fin DOIT afficher, sous le score, le titre qui correspond au nombre de bonnes réponses, de 0 à 5.
- **EF3** : Le jeu DOIT proposer 30 défis : les 20 actuels à leur place, puis les 10 nouveaux de `contenu.md`, dans cet ordre.
- **EF4** : Les phrases taquines, les titres et les défis DOIVENT être mot pour mot ceux de `contenu.md`.
- **EF5** : Parmi les 10 nouveaux défis, au moins 4 DOIVENT être des pièges des mots : la phrase qui a le moins de mots coûte le plus de jetons, pour qu'on ne gagne pas en comptant les mots.

## Critères

- **CS1** : Ce soir, le 5 octobre 2026 avant 23h30, le propriétaire joue une partie sur son téléphone, sourit ou rit au moins 2 fois, et au moins 1 défi le surprend.
- **CS2** : 30 défis disponibles, et le nombre de jetons de chaque nouveau défi, le plus cher des deux, correspond à `contenu.md`.

## Supposé

- Le titre de fin s'ajoute sous le score ; le titre de l'écran (« Et voilà, c'est fini »), le détail des points et les confettis restent.
- Le défi composé reçoit aussi une phrase taquine, sans titre de fin.
- Deux révélations de suite peuvent tomber sur la même phrase : le tirage reste simple.

## Pas encore

- Série et vies, deviner l'écart, défier un ami : chacune sa propre fonctionnalité, plus tard (`idee.md`).
- Humour sur l'accueil du jeu et l'écran composer : hors de cette version (D1), pour tenir l'échéance de ce soir.

## Vérifs

- [x] Chaque récit nomme une personne de `idee.md` et pourquoi ça compte pour elle ? (US1)
- [x] Chaque scénario se vérifie par quelqu'un qui ne code pas, en faisant et en regardant ? (US1)
- [x] Chaque décision de `decisions.md` apparaît dans un récit ou sous Pas encore ? (US1)
- [x] Qui peut voir, changer ou télécharger chaque donnée personnelle est dit ? (aucune donnée personnelle)
- [x] Chaque point ouvert est tranché, supposé, ou posé dans `a-trancher.md` avec un conseil ? (US1)
