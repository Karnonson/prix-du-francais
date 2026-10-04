# Design system — Le prix du français

Tiré de `index.html` (sa feuille de style, ses couleurs, ses polices), sans rien inventer, sauf deux ajouts
*supposés* : la taille minimale d'une cible tactile (`--cible`, 44 px, car le jeu se joue au doigt) et l'échelle
des espaces (`--espace-1` à `--espace-6`, les valeurs que la page utilise déjà). La feuille est `styles.css`.
Polices à charger par la page : Bricolage Grotesque, Atkinson Hyperlegible (Google Fonts, comme `index.html`).

## Tokens

- Couleurs : `--ground`, `--surface`, `--ink`, `--muted`, `--rule`, `--band`, `--track`, `--focus` ; une couleur par langue : `--en` (anglais, bleu), `--fr` (français, rose-rouge), avec leurs deux fonds de pastille `--*-chip-a` et `--*-chip-b`. Mode sombre par `prefers-color-scheme`.
- Polices : `--display`, `--body`, `--mono`. Tailles : `--step--1` à `--step-4`. Espaces : `--espace-1` à `--espace-6`. Coins : `--rayon-1` à `--rayon-3`, `--rayon-pilule`. Cible : `--cible`.

## Parties

| Partie | Classes | Dans `index.html` |
|---|---|---|
| Page, pile, rangée | `.page`, `.pile`, `.rangee` | `.wrap` |
| Carte | `.carte`, `.carte.bande` | `.bench`, `.verdict` |
| Bouton | `.bouton`, `.bouton.secondaire` | `.translate`, `.seg button` |
| Code de langue | `.langue` sur un parent `data-lang="fr"` ou `"en"` | `.lang-code` |
| Choix | `.choix` | `.template` |
| Champ | `.champ`, `.note`, `.note.erreur` | `.pane` + `textarea` |
| Découpe en jetons | `.jetons`, `.pastille`, `.pastille.alt` | `.chips`, `.chip` |
| Compte, grand nombre | `.compte .nombre`, `.grand` | `.count`, `.big` |
| Barre à comparer | `.barre` (`--part` = largeur) | `.bar` |
| Alerte, liste, étiquette | `.alerte`, `.liste`, `.etiquette` | `.note.error`, `.label` |

## Règles

- Jamais une couleur, une taille ou un espace brut : un token.
- Le français est toujours en `--fr`, l'anglais en `--en`.
- Le focus se voit (`:focus-visible`) ; une cible tactile fait au moins `--cible`.
- Ne pas modifier cette feuille pour une fonctionnalité : une partie qui manque se construit avec les tokens, dans la fonctionnalité.
