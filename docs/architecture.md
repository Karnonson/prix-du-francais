# Tokenette — architecture

<!-- Ce qui est rempli par l'agent sans l'avoir vu dans le repo ni entendu de la personne est marqué *supposé*. -->

## Pièces

- La page, qui tourne dans le navigateur du visiteur : compte les jetons, les affiche découpés, et bientôt le jeu — `index.html`
- Le compteur de jetons, chargé depuis jsDelivr et exécuté dans le navigateur — `gpt-tokenizer` 2.9.0 (à ne pas monter en 3.x, voir README)
- Les polices, chargées depuis Google Fonts — Bricolage Grotesque, Atkinson Hyperlegible
- Le site publié, servi par GitHub Pages depuis la branche `gh-pages` — `deploy.sh`
- La copie Claude Artifact, avec le bouton « Traduire » (capability `sample`) — `index.html` publié tel quel

## Modules

La disposition, celle d'un site statique sans framework : `src/modules/<module>/api.js` (chargé par
`import`, `ui/` pour ce qu'il dessine), `src/shared/` pour ce que plusieurs modules partagent, les tests
dans `tests/modules/<module>/` lancés par `node --test`, `dist/` le site construit par `build.sh`, jamais
modifié à la main. `index.html` reste à la racine : `build.sh` l'enveloppe et copie `src/` dans `dist/`.

État actuel : sur la branche principale, tout le code tient encore dans `index.html` (style, script,
données). La fonctionnalité Défis (`feature/defis`) ajoute les modules `compteur` et `jeu` ; la page de
comparaison, elle, reste dans le script de `index.html` jusqu'au rangement (voir À faire).

| Module | Possède | Chemins |
|---|---|---|
| (page) | la comparaison des deux phrases, le style de la page | `index.html` |
| compteur | compter les jetons et découper une phrase (arrive avec Défis) | `src/modules/compteur/` |
| jeu | les défis, le score, l'écran final (arrive avec Défis) | `src/modules/jeu/`, `tests/modules/jeu/` |

## Données

Rien n'est gardé côté serveur. La progression du jeu restera dans le navigateur du visiteur (*supposé*, à décider avec la fonctionnalité).

## Secrets

Aucun. `deploy.sh` utilise les identifiants git de la machine, déjà en place.

## Coût

0 € par mois (GitHub Pages, jsDelivr et Google Fonts gratuits à cet usage). Aucune carte demandée.

## En local

Lancer `./build.sh`, puis ouvrir `dist/index.html`. Il faut internet pour le compteur et les polices.

## Lancer

- `./build.sh` : enveloppe `index.html` dans `dist/index.html`. C'est la vérification de `cadrer-x.yml`.
- `./deploy.sh` : construit, puis pousse `dist/` sur `gh-pages`.

## Trajet

Tu écris une phrase en français → la page envoie le texte au compteur dans ton navigateur → il le découpe en jetons → tu vois la phrase découpée et le total, en anglais et en français.

## À faire

- [ ] ranger le code en modules : /cadrer-x-ranger — avant la construction (après la livraison de Défis, pour ne pas la gêner)

## Écarté

- Tiktokenizer et l'outil d'OpenAI : comptent les jetons, gratuits, mais sans comparaison FR/EN ni jeu.
- Google Forms, Typeform : des quiz, mais sans découpe en jetons.
- Tableur ou papier : les comptes se font ailleurs, sans découpe visible.

<!-- Les mots du produit et de son domaine sont dans `glossaire.md`, à côté. -->
