# Rangement — Tokenette

**Cible** : site statique sans framework — `src/modules/<module>/api.js` (`ui/` pour ce qu'il dessine), `src/main.js` qui branche les modules à la page, tests dans `tests/modules/<module>/`, `dist/` construit par `build.sh`.
**Base** : main @ 6a38c4c

## Avant
- Vérifs : `./build.sh` — tests 91, pass 91, fail 0
- Écrans : aucun — la personne a dit de ne pas tester avec un navigateur ; la preuve : les tests de la page (`tests/modules/comparaison/`, faux document) et le second regard

## Modules
- [ ] comparaison — la page : les exemples, les deux phrases découpées en jetons, le verdict et les barres, le choix du découpeur, la langue de la page, les mesures sur textes longs, le bouton « Traduire » — depuis : le `<script>` de `index.html` (lignes 343-808)
- [ ] main — `src/main.js` : monte `comparaison`, puis `jeu` avec `compteur` (ce que fait aujourd'hui le `<script type="module">` de `index.html`)

Déjà rangés, rien à y déplacer : `compteur`, `jeu`. Pas de `shared/` : aucun code n'est partagé par plusieurs modules aujourd'hui.

## Remarques
- La copie Claude Artifact (`index.html` publié seul, avec « Traduire ») ne marchera plus après le rangement : décision de la personne, on ne publie plus que le site construit. À reporter dans l'ADR 0001 / le README par un prochain changement, pas ici.
- Le style de la page reste dans le `<style>` de `index.html` : `build.sh` coupe le fichier à cette balise pour faire `dist/index.html`. Le sortir dans `src/styles.css` changerait le build, pas un simple déplacement.
- `comparaison` refait le découpage en blocs de jetons (`cut`) que `compteur` fait déjà (`decouper`) : deux copies, gardées telles quelles. La page découpe avec « Récent » ou « Plus ancien » ; `compteur`, toujours « Récent ».
