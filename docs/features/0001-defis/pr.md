# Défis 0.1.0

## Résumé

La page gagne un jeu : une partie de 5 défis, où l'on devine laquelle de deux phrases qui disent la même chose, l'une en français, l'autre en anglais, coûte le plus de jetons, puis on voit les vrais chiffres en blocs colorés et en barres.
À la fin, un score (10 points par bonne réponse, 5 points de plus pour une réponse en 15 secondes ou moins), des confettis, et « Rejouer ».
On peut aussi composer son propre défi, en écrivant soi-même les deux phrases. Rien n'est gardé quand on ferme la page.
La page de comparaison ne change pas, et sa copie Claude Artifact, publiée seule, reste celle d'avant.

## Preuves

- Vérifs : `./build.sh` — tests 91, pass 91, fail 0, code de sortie 0
- Relectures : US1 tour 2, validé ; US2 tour 1, validé ; US3 tour 2, validé
- ![SC1 à 390](docs/features/0001-defis/captures/SC1-390.png)
- ![SC1 à 1280](docs/features/0001-defis/captures/SC1-1280.png)
- ![SC1 à 390, compteur en erreur](docs/features/0001-defis/captures/SC1-390-erreur.png)
- ![SC2 à 390](docs/features/0001-defis/captures/SC2-390.png)
- ![SC2 à 1280](docs/features/0001-defis/captures/SC2-1280.png)
- ![SC2 à 390, révélation](docs/features/0001-defis/captures/SC2-390-revelation.png)
- ![SC2 à 1280, révélation](docs/features/0001-defis/captures/SC2-1280-revelation.png)

## Risque de fusion

**Porte** : aller-retour
**Portée** : une personne qui ouvre le site voit un jeu avant le comparateur ; rien n'est supprimé ni réécrit, aucune donnée n'est gardée, et le retour est un simple retrait de la fusion.
