# Jeu plus marrant — décisions
## Décisions
- D1 L'humour va à la révélation (bonne réponse, raté, égalité) et à l'écran de fin ; l'accueil du jeu et l'écran composer ne changent pas — pourquoi : ce sont les deux moments où l'on réagit, et l'échéance est ce soir 23h30.
- D2 4 verdicts par cas (bonne réponse, raté, égalité), tirés au hasard à chaque révélation — pourquoi : une blague répétée 5 fois dans une partie ne fait plus rire.
- D3 Le verdict taquin vient d'abord, puis la ligne actuelle avec les nombres de jetons, gardée telle quelle — pourquoi : le jeu reste utile, l'humour s'ajoute sans remplacer l'information.
- D4 L'écran de fin montre un titre rigolo selon le nombre de bonnes réponses, un par résultat de 0 à 5 ; le score, son détail et les confettis restent — pourquoi : simple, lisible, et tient avec les égalités.
- D5 L'agent propose la liste complète des textes (12 verdicts, 6 titres, 10 défis) ; le propriétaire la valide avant la construction — pourquoi : c'est son humour qui est en jeu.
- D6 Les 10 nouveaux défis s'ajoutent après les 20 actuels dans `DEFIS` (30 en tout), dont au moins 3 où le français coûte moins de jetons que l'anglais, chacun vérifié avec le compteur « Récent » — pourquoi : la progression garde les défis vus par leur position, et les pièges surprennent.
- D7 Ton taquin et complice, tutoiement, un jeu de mots de temps en temps, jamais méchant — pourquoi : choix du propriétaire à l'idée.
- D8 Avec moins de mouvement demandé, rien ne change : les textes ne s'animent pas — supposé.
## Étapes
- écrans : oui
- code : oui
- données : non
- voie : courte
## Précisions
- Q : Où met-on l'humour ? → R : révélation et écran de fin.
- Q : Le verdict varie-t-il ? → R : 4 variantes par cas, au hasard.
- Q : Les chiffres restent-ils dans le verdict ? → R : oui, après la phrase taquine.
- Q : Sur quoi se base le titre de fin ? → R : le nombre de bonnes réponses, de 0 à 5.
- Q : Qui écrit les textes ? → R : l'agent propose, le propriétaire valide avant la construction.
## Stack
- aucun nouveau besoin : la stack actuelle (page statique, `gpt-tokenizer` 2.9.0, GitHub Pages) — coût : 0 €/mois
## Impact archi
aucun
## Données et risques
Aucune donnée personnelle nouvelle, aucun secret. La progression existante (défis vus, meilleur score, dans le navigateur) garde son format : les nouveaux défis prennent les positions 20 à 29, les anciennes positions ne bougent pas. Aucune saisie nouvelle : les verdicts et titres sont des textes fixes, insérés comme texte (M2).
## À faire
- [ ] Valider la liste des verdicts, des titres et des 10 nouveaux défis — avant la construction
