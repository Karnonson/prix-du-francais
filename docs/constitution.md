# Tokenette — constitution

Les règles que chaque changement respecte. Une règle ne change que par un ADR approuvé
(`docs/adr/`). Chaque tâche qui demande du travail pour une règle la cite sous Couverts (`| M2 | T02 |`),
et chaque relecture vérifie le code contre elle.

| # | Règle | Vérifiée par | Quand |
|---|---|---|---|
| M1 | Aucun secret dans le dépôt, un commit ou une sortie affichée | la relecture | chaque tâche ; la relecture |
| M2 | Chaque saisie d'une personne est vérifiée avant d'être utilisée (type, taille, format), et jamais insérée dans la page comme du code | les tests de la tâche ; la relecture | construction ; relecture |
| M5 | Une nouvelle dépendance est nommée dans `decisions.md` avec pourquoi ; une qui change la stack demande un ADR | la relecture | relecture |
| M6 | Un module n'en utilise un autre que par son point d'entrée (voir Modules dans `architecture.md`) | la relecture | relecture |
| M7 | `./build.sh` passe avant toute fusion | la construction ; la relecture | chaque tâche ; la relecture |

## Exceptions

aucune
