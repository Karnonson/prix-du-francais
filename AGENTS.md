# Agents

Ce projet suit cadrer-x. Avant de travailler, lire :

- `docs/vision.md` — pour qui, le problème, le succès
- `docs/architecture.md` — les pièces, les modules et leurs chemins, les données, les secrets par leur nom
- `docs/constitution.md` — les règles que chaque changement respecte
- `docs/adr/` — une décision par fichier, jamais modifiée, seulement remplacée
- `docs/features/NNNN-<slug>/` — un dossier par fonctionnalité : idee, decisions, spec, taches, audit, livraison
- `cadrer-x.yml` — où est le code, comment l'installer, et les vérifs qui doivent passer

Le code reste dans son module (Modules dans `docs/architecture.md`), et les vérifs de `cadrer-x.yml`
tournent après chaque changement. Les secrets ne passent jamais par une conversation ni un fichier suivi.
