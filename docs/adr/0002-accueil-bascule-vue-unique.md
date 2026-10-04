# 0002 — L'accueil bascule en vue unique entre jeu et comparateur, tous deux montés dès le chargement

**Date** : 2026-10-04
**Fonctionnalité** : `docs/features/0002-comparaison/`
**Remplace** : aucun

## Contexte

Le jeu et le comparateur vivaient jusqu'ici mélangés sur la même page, sans accueil ni séparation :
rien ne distinguait le moment où on joue de celui où on compare directement deux phrases. L'idée
laissait ouvert ce qui se passe après le choix — rester sur la même page ou deux vues séparées — et si
on peut revenir en arrière.

## Options

- Un accueil qui bascule en vue unique : un clic sur « Jouer » ou « Comparer » cache l'accueil et montre
  la section choisie seule, avec un bouton « Retour à l'accueil » qui la recache sans recharger la page ;
  jeu et comparateur restent montés depuis le chargement, chacun caché ou montré par son élément
  `[data-state]`, jamais remonté sauf en quittant le jeu (pour perdre la partie, EF5). Coût : les deux
  sections partagent le DOM dès le départ, un peu plus de travail au chargement.
- Les deux usages visibles ensemble en permanence, sans bascule : pas de nouveau geste à apprendre, mais
  garde le problème de l'idée (jeu et comparateur mélangés, rien ne sépare les deux usages) et charge la
  page d'un coup, jeu et comparateur ouverts côte à côte même pour qui n'en veut qu'un.
- Deux adresses séparées (`/jeu`, `/comparateur`) avec navigation du navigateur : un vrai aller-retour,
  mais demande un routeur et casse la publication en une seule page (la copie Claude Artifact, qui n'a
  pas d'adresses).

## Décision

L'accueil bascule en vue unique (D1, D2 de `decisions.md`) : `src/main.js` garde une table des sections
par leur `[data-state]`, une fonction `basculer(etat)` qui cache tout sauf l'état visé, et un
`remonterJeu()` qui ne remonte que le jeu, par son entrée `monter()`, jamais en touchant à ses internes
(D5) — pour perdre la partie en cours en quittant vers l'accueil (EF5). Jeu et comparateur restent chacun
dans leur module (`cadrer-x-modules`) ; seule leur visibilité est pilotée depuis `main.js`.

## Pourquoi

Tu as choisi la bascule en vue unique avec retour, plutôt que les deux usages visibles ensemble, pour
séparer enfin le jeu et le comparateur — le problème que l'idée pointe — sans payer le coût d'un
routeur ni casser la page unique que publie aussi la copie Claude Artifact.
