# Jeu plus marrant 0.3.0

## Résumé

Le jeu fait sourire. Après chaque défi, une phrase taquine ouvre le verdict, avant les nombres de jetons.
Un titre rigolo s'affiche sous le score, selon le nombre de bonnes réponses.
Le jeu passe de 20 à 30 défis, avec des expressions, des phrases absurdes et 4 pièges des mots.
Les règles, le score et la progression gardée ne changent pas.

## Preuves

- Vérifs : `./build.sh` — tests 135, pass 135, fail 0
- Sécurité : recherche de secrets dans les 10 commits de la branche (gitleaks absent, recherche à la main) — aucun secret
- Sécurité : failles des paquets — rien à analyser, le produit n'a aucun paquet installé (le compteur vient de jsDelivr, version fixée 2.9.0, inchangée)
- Relectures : US1 tour 1, validé
- Jetons des 10 nouveaux défis recomptés par la relecture avec le compteur « Récent » : conformes à `contenu.md`

## Risque de fusion

**Porte** : aller-retour
**Portée** : les joueurs voient de nouveaux textes à la révélation et à la fin. Leur progression gardée reste juste.
