# Jeu plus marrant — audit

## US1 Un jeu qui fait sourire

**Tour** : 1
**Date** : 2026-10-05
**Verdict** : validé

### Spec

- Info : scénarios 1 à 3 (EF1, EF4) — src/modules/jeu/ui/revelation.js:35 choisit le cas (égalité, bonne, raté) et :107 place la phrase taquine juste avant la ligne en gras, inchangée ; tests/modules/jeu/revelation-taquine.test.js vérifie les 4 phrases de chaque cas mot pour mot, aux deux choix pour l'égalité, avec les vraies lignes « Dans le mille », « Aïe, raté » et « Match nul ».
- Info : scénario 4 (EF2, EF4) — src/modules/jeu/ui/fin.js:13 et :57 placent le titre juste sous le score ; tests/modules/jeu/titre-fin.test.js vérifie les 6 titres de 0 à 5 mot pour mot, sous le score, et l'absence des 5 autres.
- Info : scénario 5 (EF3, EF4, EF5) — src/modules/jeu/partie.js:28 ajoute les 10 défis aux positions 20 à 29, mot pour mot ; tests/modules/jeu/defis-marrants.test.js vérifie les 30, l'ordre, les 20 anciens à leur place et le tirage après une progression d'avant cette version.
- Info : À surveiller T01 — jetons des 10 nouveaux défis recomptés avec le compteur « Récent » (gpt-tokenizer 2.9.0, o200k_base, le fichier que charge la page) : 12·6, 15·11, 10·9, 6·5, 11·9, 11·8, 8·8, 3·6, 9·10, 12·15, comme le tableau de contenu.md ; les défis 22 à 25 sont des pièges des mots, le français a moins de mots et plus de jetons (EF5 tenu).
- Info : cas limites — le défi composé reçoit sa phrase taquine (test « un défi composé… ») et n'a pas d'écran de fin ; aucune animation nouvelle, les règles `prefers-reduced-motion: reduce` de animations.css couvrent le titre et la phrase.
- Info : tests mis à l'épreuve dans un worktree jetable : phrase placée après la ligne, raté et bonne inversés, égalité vers bonne, toujours la première phrase, titre décalé d'un, titre placé après le détail, un nouveau défi intercalé, le texte d'un nouveau défi changé ; chaque cassure rend son test rouge.
- Info : aucun ajout non demandé — aucune fonction exportée nouvelle ; `contexte.hasard` est la protection prévue au `Risques :` de T02.
- Info : page non ouverte — voie courte, `cadrer-x.yml` n'a pas de `commands.dev` ; révélation à 390 et 1280 et écran de fin à 0 et 5 jugés depuis le code : paragraphes simples dans la bande et `p.chapo`, classes existantes, aucun style ajouté, aucune capture.
- Détail : tests/modules/jeu/defis-marrants.test.js:50 — le test garde la place des 20 anciens défis par leur seule phrase française ; une phrase anglaise ancienne changée passerait ; correction : comparer aussi `en` pour les 20 premiers.

### Règles

- Info : M1 — aucun secret dans le code, les tests ni les commits de la fonctionnalité.
- Info : M2 — phrases et titres fixes, insérés comme texte par `h()` ; aucune saisie nouvelle.
- Info : M5, M6 — aucune dépendance nouvelle ; les fichiers touchés restent dans le module jeu, les tests passent par `montrer()` de chaque écran comme les tests existants.
- Info : M7 — `./build.sh` passe (voir Vérifs).
- Info : mots — « défi », « partie », « révélation », « égalité », « jeton » comme le glossaire ; seuls les fichiers des `Fichiers :` et les documents de la fonctionnalité sont touchés ; aucun test assoupli.

### Non jugé

Vérifs : lancées — `./build.sh`, code de sortie 0, « tests 135, pass 135, fail 0 »
- La page réelle à 390 et 1280 de large (débordement, rendu des émojis) : pas de `commands.dev`, donc pas ouverte ; le jugement vient du code.
- CS1 (le propriétaire sourit en jouant ce soir) : seul le propriétaire peut le dire.
