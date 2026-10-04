# Accueil — vérification

**Date** : 2026-10-04
**Portée** : spec et tâches
**Verdict** : à reprendre

## Constats

- À reprendre : spec.md:20 — « deux blocs égaux — « Jouer » et « Comparer » » et spec.md:36 — « le comparateur (les exemples, la comparaison, l'explication de l'écart) prend toute la page », repris tels quels dans decisions.md (D1, D2, D3, D5), taches.md (T01, T02, « À surveiller ») et contenu.md (section « comparateur ») : `glossaire.md:5` nomme déjà cette page « Compteur » (« la page où l'on saisit directement ses textes pour estimer leur coût en jetons, sans jouer » — exactement ce que décrit l'état « comparateur » de cette fonctionnalité). « Comparateur » est un synonyme non déclaré, et le risque est aggravé par le fait qu'`architecture.md:26` porte déjà un module distinct et sans rapport nommé `compteur` (compter les jetons « Récent », pour le jeu) : un bâtisseur qui suit `glossaire.md` à la lettre peut confondre le nouvel état « comparateur » avec ce module existant, ou chercher le mot « compteur » et ne jamais le trouver dans la spec. → /cadrer-x-affiner
- À reprendre : taches.md:71 — « Étant donné que je suis en pleine partie de défis, quand je touche « Retour à l'accueil » puis « Jouer » à nouveau, alors je repars d'une partie neuve, comme si j'avais fermé puis rouvert la page. » ne dit pas la même chose que son scénario, spec.md:38 — « Étant donné que je suis en pleine partie de défis, quand je touche « Retour à l'accueil », alors la partie est perdue, comme si je fermais la page, et je repars de l'accueil. » : la case ajoute une action au « quand » (« puis « Jouer » à nouveau ») absente du scénario, et remplace l'« alors » (« je repars de l'accueil ») par un autre critère (« je repars d'une partie neuve ») ; un bâtisseur qui construit exactement la case de T03 ne vérifie jamais littéralement que « Retour à l'accueil » seul suffit à perdre la partie et à montrer l'accueil — seulement qu'un second « Jouer » redémarre à zéro. → /cadrer-x-decouper
- Remarque : taches.md:65 — la ligne `Risques : abus — clics rapides et répétés sur Jouer, Comparer ou Retour → un seul état affiché à la fois, pas de montage multiple` promet une protection, mais aucune case de T02 ne la teste ; le format de `taches.md` (« Un test par risque ») l'exige, et le même comportement n'apparaît que sous `taches.md:99` (« À surveiller »), explicitement hors test automatisé. → /cadrer-x-decouper

## Vérifié

- Les lints de forme (`cadrer-x-affiner/scripts/lint.py spec`, `passation`, et `cadrer-x-decouper/scripts/lint.py taches`) ne signalent rien.
- Chaque scénario de US1 et des trois premiers scénarios de US2 est repris dans `taches.md` avec les mêmes valeurs et la même personne (T01, T02).
- Chaque décision de `decisions.md` (D1–D5) atterrit dans US1 ou US2 ; D6 est sous Supposé, comme `spec.md` le dit lui-même.
- Aucune contradiction trouvée avec `constitution.md` (M1, M2, M5, M6, M7) : pas de nouvelle dépendance, pas de nouvelle saisie, la frontière des modules respectée par D5 (montrer/cacher par `monter()`, sans toucher aux internes de `jeu` et `comparaison`).
- Aucune donnée personnelle en jeu ; `decisions.md` et `architecture.md` le confirment tous deux.
- Les chemins de `Fichiers :` (T01, T02, T03) suivent la disposition existante : `tests/aide/` et un `.test.js` à la racine de `tests/` ont déjà un précédent (`tests/aide/ecran.js`, `tests/assemblage.test.js`), l'accueil n'étant pas un module au sens de la carte (D5).
- Les cas limites de `spec.md` (chargement du compteur, double clic, écran étroit) sont chacun repris dans `taches.md`, en test ou en point de vigilance à la relecture.
- Chaque récit tient seul : US1 se vérifie par la seule lecture de l'accueil ; US2 s'appuie sur US1 déjà construit, ce que la règle permet.
