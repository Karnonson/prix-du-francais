# Défis — passation

## Maquette

- Lien : aucun — maquette locale : ouvrir maquette/accueil.html
- Style : docs/design-system (créé à cette étape depuis `index.html` ; la maquette en garde une copie, `maquette/styles.css`)
- La barre des états (`nav.maquette-etats`) et `maquette.js` sont propres à la maquette, jamais du code produit.

## Écrans

### SC1 Accueil

- Récits : US1, US3
- Fichier : maquette/accueil.html
- Parties : page, pile, rangée, carte, bouton (secondaire), alerte, chapo, mot-fr ; nouvelles : Accueil animé (hero, flottants, gros bouton), Trio, Emoji
- États : avant (#avant) — titre Tokenette, accroche, « C'est parti » (mène à SC2), « Composer mon défi » (mène à SC4), trois cartes d'explication ; erreur (#erreur) — le compteur ne répond pas, le jeu ne démarre pas, bouton pour recharger
- Largeurs : 390 — tout en une colonne, les trois cartes l'une sous l'autre ; 1280 — les trois cartes côte à côte
- Textes : textes.md → SC1

### SC2 Défi

- Récits : US1, US3
- Fichier : maquette/defi.html
- Parties : page, pile, rangée, carte (bande), bouton (secondaire), choix, langue, jetons, pastille, compte, barre, étiquette ; nouvelles : Duo, Emoji, Animations d'entrée
- États : choix (#choix) — « Défi 1 sur 5 », deux phrases à toucher ; bon (#bon) — révélation avec découpe, nombres, barres, « Dans le mille », points et bonus ; faux (#faux) — même révélation, « Aïe, raté », 0 point ; egalite (#egalite) — « Match nul », 0 point ; dernier (#dernier) — 5e défi, le bouton mène à SC3 ; perso-choix (#perso-choix) — « Ton défi », deux phrases à toucher ; perso-revele (#perso-revele) — révélation du défi composé, hors partie, deux boutons (composer un autre, accueil)
- Largeurs : 390 — les deux cartes l'une sous l'autre ; 1280 — les deux cartes côte à côte
- Textes : textes.md → SC2

### SC3 Écran final

- Récits : US2
- Fichier : maquette/fin.html
- Parties : page, pile, rangée, carte, bouton (secondaire), grand ; nouvelles : Ligne de score, Confettis, Emoji
- États : score (#score) — « Et voilà, c'est fini », 55 points, détail bonnes réponses, bonus de rapidité et total, confettis, « Rejouer » (mène à SC2) ; score-bas (#score-bas) — 0 point, sans confettis, même bouton
- Largeurs : 390 — une colonne ; 1280 — une colonne centrée dans la largeur de la page
- Textes : textes.md → SC3

### SC4 Composer

- Récits : US3
- Fichier : maquette/composer.html
- Parties : page, pile, rangée, champ, langue, note (erreur), bouton (secondaire), chapo
- États : vide (#vide) — deux champs vides, compteur à 0 sur 280 ; erreur-vide (#erreur-vide) — il manque la phrase en français, signalé sous le champ ; erreur-longue (#erreur-longue) — la phrase anglaise dépasse de 32 caractères, le texte reste dans le champ ; pret (#pret) — deux phrases correctes, « Jouer ce défi » mène à SC2 (perso-choix)
- Largeurs : 390 — les deux champs l'un sous l'autre ; 1280 — idem, dans la largeur de la page
- Textes : textes.md → SC4

## Nouveautés

- Accueil animé — titre en grand, emojis qui flottent, gros bouton qui pulse (`.hero`, `.flottants`, `.grosbouton`), sur SC1. Le design system n'a pas de partie d'accueil ; fait avec `--step-4`, `--espace-*`, `--ink`, `--ground`.
- Trio — trois cartes d'explication côte à côte, une colonne sur téléphone (`.trio`), sur SC1. Le design system n'a que la carte seule ; fait avec `--surface`, `--rule`, `--espace-3`.
- Duo — deux cartes côte à côte, une colonne sur téléphone (`.duo`), sur SC2. Même raison ; fait avec `--espace-3`.
- Ligne de score — une ligne de détail du score, libellé à gauche et nombre à droite (`.ligne-score`), sur SC3. Aucune partie du design system ne range deux textes sur une ligne ; fait avec `--rule`, `--espace-2`, `--espace-3`.
- Confettis — petits rectangles qui tombent à l'arrivée sur l'écran final (`.confettis`), sur SC3. Aucune partie d'animation décorative ; fait avec `--fr`, `--en`, `--espace-*`.
- Emoji — un emoji animé devant un texte (`.emoji`), partout. Aucune partie pour ça ; fait avec les animations de la page, coupées si l'appareil demande moins de mouvement.
- Animations d'entrée — cartes, pastilles, barres et nombres qui apparaissent en mouvement, sur SC2 et SC3. Le design system n'a pas de mouvement ; coupées si l'appareil demande moins de mouvement.

## Accessibilité

- SC1 : les emojis ne sont pas lus (`aria-hidden`) ; l'erreur du compteur est annoncée (`role="alert"`) ; l'ordre du focus suit la lecture : C'est parti, puis Composer mon défi.
- SC2 : chaque phrase est un bouton, avec son code de langue ; la révélation est annoncée (`aria-live="polite"`) ; le choix est dit par un texte (« Ton choix »), pas seulement par la couleur ; chaque barre porte son nombre écrit.
- SC3 : le score et le détail sont annoncés (`aria-live="polite"`) ; les confettis sont décoratifs (`aria-hidden`) et disparaissent si l'appareil demande moins de mouvement.
- SC4 : chaque champ a un libellé visible et son compteur ; une erreur est annoncée (`role="alert"`) et liée au champ (`aria-invalid`, `aria-describedby`) ; le texte écrit reste dans le champ.

## Ouvert

- Les textes anglais du jeu ne sont pas écrits : la spec dit que le jeu suit le français ou l'anglais de la page, la maquette n'existe qu'en français.
- Les points de la maquette suivent la spec : 10 par bonne réponse, un bonus de 5 points si la réponse vient en 15 secondes ou moins.
- Les nombres de jetons et les phrases des défis sont des exemples ; la liste d'au moins 5 défis écrits à la main reste à écrire.
- Le produit s'appelle Tokenette dans la maquette ; `index.html` et le README disent encore « Le prix du français ».
- Les polices sont copiées dans la maquette ; la vraie page les charge depuis Google Fonts, comme `index.html`.

## Contrôle

- [x] Chaque récit qu'une personne voit a son écran, et chaque scénario se fait sur un écran, dans un état.
- [x] Chaque `class` des pages est une partie du design system, une Nouveauté, ou la barre des états ; aucune couleur ni taille brute.
- [x] Chaque écran montre le moins de données personnelles possible, jamais celles d'un autre.
- [x] Un écran qui recueille des données dit pourquoi, et demande le consentement (jamais pré-coché) quand c'est sa base.
- [x] Chaque texte est dans `textes.md`, tel que les pages le montrent ; un nombre qui varie a chaque forme.
- [x] Chaque champ a un libellé visible ; une erreur est annoncée (`role="alert"`), un résultat qui arrive aussi (`aria-live="polite"`) ; une cible tactile fait au moins la taille du design system.
- [x] Chaque page a été vue à 390 et à 1280, sans défilement de côté à 390 ; sinon, dit sous Ouvert.
