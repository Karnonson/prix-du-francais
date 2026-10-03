# Tokenette — architecture

<!-- Ce qui est rempli par l'agent sans l'avoir vu dans le repo ni entendu de la personne est marqué *supposé*. -->

## Pièces

- La page, qui tourne dans le navigateur du visiteur : compte les jetons, les affiche découpés, et bientôt le jeu — `index.html`
- Le compteur de jetons, chargé depuis jsDelivr et exécuté dans le navigateur — `gpt-tokenizer` 2.9.0 (à ne pas monter en 3.x, voir README)
- Les polices, chargées depuis Google Fonts — Bricolage Grotesque, Atkinson Hyperlegible
- Le site publié, servi par GitHub Pages depuis la branche `gh-pages` — `deploy.sh`
- La copie Claude Artifact, avec le bouton « Traduire » (capability `sample`) — `index.html` publié tel quel

## Modules

État actuel : tout le code tient dans `index.html` (style, script, données), sans module.

Cible, l'approche classique d'un site statique : `src/` le code en fichiers séparés, `public/` les images et l'icône, `dist/` le site construit (ignoré par git). `build.sh` devra rassembler `src/` en un seul `dist/index.html`.

Modules prévus (*supposé*) : compteur (jetons et découpe), jeu (défis, score), progression (ce que le visiteur a déjà fait).

| Module | Possède | Chemins |
|---|---|---|
| (aucun encore) | tout, dans un seul fichier | `index.html` |

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

Rien.

## Écarté

- Tiktokenizer et l'outil d'OpenAI : comptent les jetons, gratuits, mais sans comparaison FR/EN ni jeu.
- Google Forms, Typeform : des quiz, mais sans découpe en jetons.
- Tableur ou papier : les comptes se font ailleurs, sans découpe visible.

## Mots

- Jeton : l'unité qu'une IA compte dans un texte, en français ; « token » seulement dans les noms techniques.
