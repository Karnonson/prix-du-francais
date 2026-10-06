# Progression, défis en plus et texte de Comparaison — décisions
## Décisions
- D1 Le jeu garde, dans le navigateur (`localStorage`), le meilleur score et la liste des défis déjà vus ; perdu si le visiteur efface ses données — pourquoi : supposé, pas de données personnelles, cohérent avec « rien gardé côté serveur ».
- D2 Un défi déjà vu n'est plus tiré tant qu'il en reste un non vu ; une fois les 20 vus, le tirage recommence sur tous — pourquoi : supposé, évite la redite sans bloquer le jeu une fois tous les défis faits.
- D3 L'écran d'accueil du jeu a un bouton « Recommencer ma progression » qui vide le score et les défis vus gardés — pourquoi : demandé.
- D4 Le jeu passe de 10 à 20 défis ; les 10 nouveaux sont écrits à la main dans `DEFIS` (`src/modules/jeu/partie.js`), même style que les dix actuels — pourquoi : demandé.
- D5 Le texte de l'écran Comparaison (`src/modules/comparaison/textes.js`, bloc `fr`) est corrigé : aucune phrase ne commence par « Et », et un deux-points n'introduit plus qu'une énumération ou un exemple — pourquoi : demandé, règles `cadrer-x-textes`.
- D6 L'espacement du bloc des trois notes en bas de l'écran Comparaison passe de 6px à 10px entre le titre et le texte de chaque note — pourquoi : demandé, éléments trop collés à la relecture.
## Étapes
- écrans : oui
- code : oui
- données : oui
## Précisions
- Q : Un visiteur peut-il remettre sa progression à zéro, et d'où ? → R : oui, bouton dans l'écran d'accueil du jeu.
- Q : Qu'est-ce qui gêne dans le texte de Comparaison ? → R : des questions qui commencent par « Et », des deux-points hors énumération/exemple, des éléments trop collés.
## Stack
aucun
## Impact archi
Le module `jeu` gagne une donnée gardée dans le navigateur (meilleur score, défis vus) — à ajouter sous Données dans `architecture.md` à la livraison. Pas de nouveau module : la progression vit dans `jeu` (elle en est le sujet), le texte et l'espacement restent dans `comparaison`.
## Données et risques
Donnée gardée : le meilleur score (un nombre) et la liste des défis déjà vus (des index), dans `localStorage` du navigateur du visiteur, sans limite de durée tant qu'il ne l'efface pas lui-même ou ne clique pas « Recommencer ma progression ». Rien de personnel, rien envoyé à un serveur. Abus possible : une valeur corrompue dans `localStorage` (modifiée à la main) — le jeu l'ignore et repart à zéro si elle est illisible, plutôt que de planter.
## À faire
aucun
