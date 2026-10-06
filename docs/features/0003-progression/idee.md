# Progression, défis en plus et texte de Comparaison
## Résultat
- Progression : le jeu retient, dans le navigateur du visiteur, les défis déjà joués et son meilleur score.
- Défis : le jeu passe de 10 à 20 défis, pour que les parties tirées au hasard se répètent moins.
- Texte Comparaison : plus de question commençant par « Et », plus de deux-points sans énumération ni exemple à la suite, et plus d'espace entre les blocs de la page.
## Pour qui
Toute personne qui veut comparer le coût en jetons d'une requête en français et en anglais ; d'abord le propriétaire.
## Problème
- Progression : sans mémoire, chaque partie repart de zéro.
- Défis : avec seulement 10 défis, les parties (tirage de 5) retombent vite sur les mêmes phrases.
- Texte Comparaison : des questions qui commencent par « Et » (« Et sur de vrais textes longs ? »), des deux-points sans énumération ni exemple à la suite, des éléments de la page trop collés.
## Pourquoi maintenant
Troisième et quatrième fonctionnalités de la découpe, après les défis et l'accueil ; la relecture du texte de Comparaison en profite pour avancer en même temps.
## Mesure
- Progression : testable une fois les défis et le meilleur score réellement gardés après avoir fermé puis rouvert le site.
- Défis : 20 défis disponibles, vérifiés par les tests.
- Texte Comparaison : le propriétaire relit l'écran et ne retrouve plus les trois défauts cités.
## Contraintes
- 0 € par mois, rien de nouveau gardé côté serveur.
- Les 10 nouveaux défis écrits à la main dans le même style que les dix actuels (liste proposée, à valider).
- Le texte de Comparaison suit les règles de `cadrer-x-textes`.
- L'espacement se corrige en CSS, sans nouveau composant.
- Hors de la route du cycle : mise en pratique de cadrer-x.
## Existant
Aucun outil à reprendre pour la progression ni les défis (voir 0001-defis). Les textes actuels de Comparaison sont dans `src/modules/comparaison/textes.js`.
## Non couverts
- Les défis existants (0001) et l'accueil (0002) ne changent pas de fond.
- Pas de catégories ni de niveaux de difficulté pour les nouveaux défis.
- Le contenu des exemples de Comparaison (`exemples.js`) n'est pas revu, sauf fautes trouvées en relisant.
## Ouvert
- Ce qui est gardé exactement pour la progression, et ce qui arrive si le visiteur efface son navigateur.
- Si un visiteur peut tout remettre à zéro.
- Le texte exact des 10 nouveaux défis.
- La liste précise des corrections de texte et d'espacement sur Comparaison.
