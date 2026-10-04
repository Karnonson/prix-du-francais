# Tokenette — architecture

<!-- Ce qui est rempli par l'agent sans l'avoir vu dans le repo ni entendu de la personne est marqué *supposé*. -->

## Pièces

- La page, qui tourne dans le navigateur du visiteur : compte les jetons et les affiche découpés — `index.html`
- Le jeu des défis, qui s'ajoute à la page dans `<section id="jeu">`, en modules chargés à la demande — `src/modules/`, [ADR 0001](adr/0001-le-jeu-a-cote-de-la-page.md)
- Le compteur de jetons, chargé depuis jsDelivr et exécuté dans le navigateur — `gpt-tokenizer` 2.9.0 (à ne pas monter en 3.x, voir README)
- Les polices, chargées depuis Google Fonts — Bricolage Grotesque, Atkinson Hyperlegible
- Le site publié, servi par GitHub Pages depuis la branche `gh-pages` — `deploy.sh`
- La copie Claude Artifact, avec le bouton « Traduire » (capability `sample`) — `index.html` publié tel quel

## Modules

La disposition, celle d'un site statique sans framework : `src/main.js` branche les modules à la page,
`src/modules/<module>/api.js` est l'entrée de chaque module (`ui/` pour ce qu'il dessine), les tests sont
dans `tests/modules/<module>/` lancés par `node --test`, `dist/` est le site construit par `build.sh`,
jamais modifié à la main. `index.html` reste à la racine, avec le balisage et le style de la page :
`build.sh` l'enveloppe et copie `src/` dans `dist/`. Pas de `src/shared/` : aucun code n'y est partagé
par plusieurs modules aujourd'hui.

| Module | Possède | Chemins |
|---|---|---|
| comparaison | la comparaison des deux phrases : exemples, jetons découpés, verdict, découpeur choisi, langue de la page, mesures sur textes longs, bouton « Traduire » | `src/modules/comparaison/`, `tests/modules/comparaison/` |
| compteur | compter les jetons « Récent » et découper une phrase pour le jeu | `src/modules/compteur/`, `tests/modules/compteur/` |
| jeu | les défis, la partie de 5, le score, les écrans (accueil, défi, révélation, fin, composer) | `src/modules/jeu/`, `tests/modules/jeu/` |

## Données

Rien n'est gardé, ni côté serveur ni dans le navigateur : une partie fermée est perdue, et les phrases composées ne servent qu'à compter les jetons ([ADR 0001](adr/0001-le-jeu-a-cote-de-la-page.md)). La progression viendra avec la fonctionnalité 0003.

## Secrets

Aucun. `deploy.sh` utilise les identifiants git de la machine, déjà en place.

## Coût

0 € par mois (GitHub Pages, jsDelivr et Google Fonts gratuits à cet usage). Aucune carte demandée.

## En local

Lancer `./build.sh`, puis servir `dist/` (`python3 -m http.server -d dist`) et ouvrir http://localhost:8000. Les modules ne se chargent pas depuis un fichier ouvert directement (`file://`). Il faut internet pour le compteur et les polices.

## Lancer

- `./build.sh` : enveloppe `index.html` dans `dist/index.html`, copie `src/` dans `dist/`, puis lance `node --test tests/` (`SANS_TESTS=1` saute les tests). C'est la vérification de `cadrer-x.yml`.
- `./deploy.sh` : construit, puis pousse `dist/` sur `gh-pages`.

## Trajet

Tu écris une phrase en français → la page envoie le texte au compteur dans ton navigateur → il le découpe en jetons → tu vois la phrase découpée et le total, en anglais et en français.

## À faire

- [x] ranger le code en modules : /cadrer-x-ranger

## Écarté

- Tiktokenizer et l'outil d'OpenAI : comptent les jetons, gratuits, mais sans comparaison FR/EN ni jeu.
- Google Forms, Typeform : des quiz, mais sans découpe en jetons.
- Tableur ou papier : les comptes se font ailleurs, sans découpe visible.

<!-- Les mots du produit et de son domaine sont dans `glossaire.md`, à côté. -->
