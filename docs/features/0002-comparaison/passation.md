# Accueil — passation

## Maquette

- Lien : https://claude.ai/design/p/f1f76066-bfb7-4b03-8580-ff7ba6c48762?file=accueil.html
- Style : docs/design-system
- La barre des états (`nav.maquette-etats`) et `maquette.js` sont propres à la maquette, jamais du code produit.

## Écrans

### SC1 Accueil

- Récits : US1, US2
- Fichier : maquette/accueil.html
- Parties : page, pile, rangée, carte, bouton (secondaire), choix, langue, jetons, pastille (alt), compte (nombre), grand, étiquette, chapo, mot-fr ; nouvelles : Duo, Icône et ligne d'action, Hero et Trio, Barre du haut, Volets, Verdict coloré
- États : accueil (#accueil) — titre « Tokenette », l'explication du jeton, deux blocs « Jouer » et « Comparer », rien d'autre ; jeu (#jeu) — le bouton « Retour à l'accueil » en haut, puis l'écran d'accueil du jeu tel qu'il existe déjà (repris de 0001-defis, inchangé) ; comparateur (#comparateur) — le bouton « Retour à l'accueil » en haut, puis les exemples, les deux phrases découpées en jetons et le verdict
- Largeurs : 390 — tout en une colonne (les deux blocs, les trois cartes, les deux volets l'un sous l'autre) ; 1280 — les deux blocs côte à côte, les trois cartes côte à côte, les deux volets côte à côte, la page centrée dans sa largeur
- Contenu : contenu.md → SC1

## Nouveautés

- Duo — les deux blocs « Jouer » et « Comparer » côte à côte, une colonne sur téléphone (`.duo`), sur l'état accueil. Le design system n'a pas de grille à deux colonnes toute faite ; fait avec `--espace-3`.
- Icône et ligne d'action — l'icône en haut d'un bloc de choix, la phrase d'action en bas (`.choix .icone`, `.choix .lancer`), sur accueil. Le design system n'a qu'un bloc de choix nu ; fait avec `--step-2`, `--espace-1`, `--espace-2`, `--ink`.
- Hero et Trio — titre et accroche centrés, trois cartes d'explication côte à côte (`.hero`, `.trio`, `.grandemoji`), repris tels quels de la maquette de 0001-defis, sur l'état jeu. Le design system n'a pas de mise en page d'accueil ; fait avec `--espace-4`, `--step-3`, `--step-4`.
- Barre du haut — la ligne qui porte le bouton « Retour à l'accueil » au-dessus du jeu ou du comparateur (`.barre-haut`), sur jeu et comparateur. Le design system n'a pas de barre de ce genre ; fait avec `--espace-4`.
- Volets — les deux colonnes du comparateur condensé, l'une sous l'autre sur téléphone (`.volets`, `.volet`, `.volet-tete`), sur comparateur. Le design system n'a que la carte seule, pas de colonnes internes ; fait avec `--espace-3`, `--espace-4`, `--rule`.
- Verdict coloré — le grand nombre de l'écart en couleur française quand le français coûte plus (`.verdict`, `.grand.plus-cher`), sur comparateur. Le design system n'a pas de variante colorée de `.grand` ; fait avec `--fr`, `--espace-3`.

## Accessibilité

- SC1 : les deux blocs de choix sont des boutons avec un intitulé clair (icône cachée aux lecteurs d'écran, titre et phrase lus) ; l'ordre du focus suit l'ordre visuel (titre, puis les deux blocs sur accueil ; le bouton retour puis le contenu sur jeu et comparateur) ; les états cachés (`hidden`) ne sont ni vus ni lus ; chaque bouton (Jouer, Comparer, Retour à l'accueil) fait au moins la taille `--cible` ; le contraste du texte suit les tokens du design system, déjà vérifiés en clair et en sombre.

## Ouvert

- aucun

## Contrôle

- [x] Chaque récit qu'une personne voit a son écran, et chaque scénario se fait sur un écran, dans un état.
- [x] Chaque `class` des pages est une partie du design system, une Nouveauté, ou la barre des états ; aucune couleur ni taille brute.
- [x] Chaque écran montre le moins de données personnelles possible, jamais celles d'un autre.
- [x] Un écran qui recueille des données dit pourquoi, et demande le consentement (jamais pré-coché) quand c'est sa base.
- [x] Chaque texte est dans `contenu.md`, tel que les pages le montrent ; un nombre qui varie a chaque forme.
- [x] Chaque champ a un libellé visible ; une erreur est annoncée (`role="alert"`), un résultat qui arrive aussi (`aria-live="polite"`) ; une cible tactile fait au moins la taille du design system.
- [x] Chaque page a été vue à 390 et à 1280, sans défilement de côté à 390 ; sinon, dit sous Ouvert.
