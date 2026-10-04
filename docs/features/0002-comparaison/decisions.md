# Accueil — décisions
## Décisions
- D1 Au premier chargement, seul l'accueil est visible (titre, explication du jeton, deux blocs Jouer/Comparer) ; le jeu et le comparateur sont montés mais cachés jusqu'au clic — pourquoi : sépare clairement les deux usages, mélangés aujourd'hui.
- D2 Chaque clic bascule : l'accueil disparaît, la section choisie (jeu ou comparateur) prend toute la place ; un bouton « Retour à l'accueil » ramène au choix sans recharger la page — pourquoi : vue unique, meilleure sur mobile que les deux sections toujours visibles.
- D3 Chaque bloc du choix (Jouer, Comparer) a une icône, un titre et une phrase qui dit ce qu'il fait, avant son bouton ; pas de bouton nu — pourquoi : le choix doit être compris avant de cliquer.
- D4 Le titre du site devient « Tokenette » partout (balise `<title>`, `<h1>`, premier titre du README), sans « Le prix du français » ; l'explication du jeton suit directement le titre, sans sous-titre — pourquoi : rattrape le renommage déjà fait dans `docs/` (vision, glossaire, architecture, constitution) depuis le commit « vision — Tokenette », jamais propagé au site.
- D5 L'accueil est un nouveau morceau de page (pas un module à part au sens de la carte) qui montre/cache le jeu et le comparateur chacun par leur entrée (`monter()`), sans toucher à leurs internes — pourquoi : respecte la frontière des modules (cadrer-x-modules).
- D6 Le texte développé du jeton et les phrases des deux blocs sont rédigés selon `cadrer-x-textes`, proposés à l'étape suivante, validés par le propriétaire à la livraison — pourquoi : supposé, pratique habituelle du projet.
## Étapes
- écrans : oui
- code : oui
- données : non
- voie : courte (demandé après la spec : fonctionnalité trop petite pour la maquette cliquable ; les détails visuels se décident en codant)
## Précisions
- Q : Le jeu et le comparateur restent visibles ensemble, ou bascule avec retour ? → R : bascule en vue unique, avec un bouton retour.
- Q : Faut-il une phrase avant chaque bouton du choix ? → R : oui, un bloc avec icône, titre et phrase par option.
- Q : Faut-il présenter le nom Tokenette ? → R : oui, Tokenette devient le titre du site, sans « Le prix du français ».
## Stack
aucun
## Impact archi
Pas de nouveau module au sens de la carte : l'accueil vit dans `index.html`/`main.js`, qui orchestre déjà le montage des modules. `comparaison` et `jeu` gagnent chacun, par leur entrée, une façon d'être cachés et montrés sans toucher à leurs internes — le détail (classe, attribut, export) se décide à `decouper`/`realiser` selon `cadrer-x-modules`. `rendre` mettra `architecture.md` à jour à la livraison.
## Données et risques
Aucune donnée nouvelle ; rien n'est gardé, ni côté serveur ni dans le navigateur, comme avant. Pas de connexion, pas de nouvelle saisie à valider au-delà de l'existant (M2 inchangé). Pas de secret.
## À faire
aucun
