# Défis — décisions
## Décisions
- D1 Une partie compte 5 défis, à augmenter plus tard — pourquoi : demandé par la personne
- D2 Un défi montre deux phrases qui disent la même chose, l'une en français et l'autre en anglais ; le visiteur choisit celle qui coûte le plus de jetons, puis on révèle les vrais chiffres et la découpe — pourquoi : demandé par la personne
- D3 Le score compte les bonnes réponses et la rapidité — pourquoi : demandé par la personne
- D4 Les défis viennent d'une liste écrite à la main dans la page, et le visiteur peut composer les siens — pourquoi : demandé par la personne
- D5 Pour un défi composé, le visiteur écrit lui-même les deux phrases ; aucune traduction automatique — pourquoi : marche partout, coût 0 €
- D6 La révélation est visuelle (blocs de jetons colorés, barres à comparer) plutôt que du texte — pourquoi : la personne comprend mieux avec un visuel
- D7 L'écran final montre le score, avec des animations amusantes et un bouton pour rejouer tout de suite — pourquoi : demandé par la personne
- D8 Deux phrases au même nombre de jetons : « égalité », le défi ne compte ni bon ni mauvais — pourquoi : supposé
- D9 Une phrase composée vide ou trop longue est refusée avant de jouer, avec un message clair — pourquoi : supposé (règle M2)
- D10 Fermer la page en pleine partie perd la partie, rien n'est gardé — pourquoi : supposé (la progression est la fonctionnalité 0003)
- D11 Les animations sont désactivées si l'appareil demande moins de mouvement — pourquoi : supposé
- D12 Si le compteur de jetons ne se charge pas, le jeu ne démarre pas et le dit — pourquoi : supposé
- D13 Le jeu utilise le même tokenizer que la page par défaut — pourquoi : supposé
## Étapes
- écrans : oui
- code : oui
- données : non
## Précisions
- Q : Qui écrit la version anglaise d'un défi composé ? → R : le visiteur, les deux phrases (A)
- Q : Comment mesure-t-on la réussite ? → R : avant le 4 octobre 2026 à midi, une partie jouée de bout en bout sur téléphone, sans aide, et aimée
## Stack
aucun besoin nouveau : tout se fait dans la page existante, avec le compteur de jetons déjà chargé — coût : 0 €/mois
Tests : le lanceur de tests intégré à Node (`node --test`, module `node:test`), lancé par `./build.sh` ; aucune dépendance ajoutée (règle M5) — coût : 0 €/mois
## Impact archi
Un module « jeu » (défis, score) apparaît, prévu dans `architecture.md` (*supposé*). Aucun service, aucune table, aucune donnée gardée. `architecture.md` est mis à jour par `/cadrer-x-rendre`.
## Données et risques
- Aucune donnée personnelle collectée ni gardée. Les phrases composées restent dans le navigateur et ne servent qu'à compter les jetons.
- Secrets : aucun.
- Abus : pas de connexion (rien à protéger) ; pas de données d'un autre ; entrée incorrecte (phrase vide, que des espaces) refusée ; entrée trop longue refusée (plafond proposé 280 caractères) ; le texte saisi est affiché comme du texte, jamais comme du code (M2).
## À faire
aucun
