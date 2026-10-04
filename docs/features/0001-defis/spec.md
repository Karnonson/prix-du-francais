# Défis — spec

**Branche** : `feature/defis`
**Créée** : 2026-10-03
**Statut** : validée
**Source** : `idee.md`, `decisions.md`

## Récits

### US1 — Jouer une partie de 5 défis (Priorité : P1)

En tant que propriétaire sur mon téléphone (puis francophone qui utilise ses skills), je veux deviner laquelle de deux phrases qui disent la même chose coûte le plus de jetons, afin de sentir l'écart entre le français et l'anglais au lieu de le lire comme une idée abstraite.

**Pourquoi cette priorité** : c'est le jeu lui-même ; sans lui, rien d'autre n'a de sens, et c'est ce que la mesure demande (une partie de bout en bout).

**Test seul** : se vérifie entièrement en jouant les 5 défis d'une partie jusqu'au bout, et apporte déjà le jeu, même sans écran final soigné.

**Scénarios** :

1. **Étant donné** que j'ouvre la page, **quand** je touche « C'est parti », **alors** je vois le premier défi : deux phrases, l'une en français, l'autre en anglais, qui disent la même chose, et je sais que la partie compte 5 défis (« Défi 1 sur 5 »).
2. **Étant donné** un défi affiché, **quand** je touche la phrase que je pense la plus chère en jetons, **alors** on me révèle les vrais chiffres : chaque phrase découpée en blocs de jetons colorés, et deux barres à comparer, avec le nombre de jetons de chacune, et on me dit si j'ai bien deviné.
3. **Étant donné** que les deux phrases ont le même nombre de jetons, **quand** je touche l'une d'elles, **alors** on me dit « égalité » : le défi ne compte ni comme bon ni comme mauvais.
4. **Étant donné** une révélation affichée, **quand** je touche « Défi suivant », **alors** le défi suivant s'affiche ; après le 5e défi, le bouton mène à l'écran final.
5. **Étant donné** une partie en cours, **quand** je ferme la page puis je la rouvre, **alors** la partie est perdue : je repars de l'accueil et rien n'est gardé.

---

### US2 — Voir mon score et rejouer (Priorité : P1)

En tant que propriétaire, je veux voir mon score à la fin de la partie, avec un peu de fête, et pouvoir rejouer tout de suite, afin de finir sur une note amusante et d'avoir envie de recommencer.

**Pourquoi cette priorité** : la mesure demande une partie « aimée » : la fin y pèse autant que le jeu.

**Test seul** : se vérifie entièrement en finissant une partie et en touchant « Rejouer », et apporte un score et une nouvelle partie.

**Scénarios** :

1. **Étant donné** que j'ai répondu au 5e défi, **quand** j'arrive à l'écran final, **alors** je vois mon score, fait de 10 points par bonne réponse, plus un bonus de 5 points pour chaque réponse donnée en 15 secondes ou moins, et je vois comment il s'est formé (points des bonnes réponses, bonus de rapidité), le nombre de bonnes réponses sur 5 (même si un défi s'est fini en égalité), et des animations amusantes : confettis, emojis et animations d'entrée.
2. **Étant donné** l'écran final, **quand** je touche « Rejouer », **alors** une nouvelle partie de 5 défis démarre aussitôt, sans repasser par l'accueil.
3. **Étant donné** que mon appareil demande moins de mouvement, **quand** j'arrive à l'écran final (ou à une révélation), **alors** il n'y a aucune animation : le score et les barres s'affichent tout de suite, sans perdre d'information.
4. **Étant donné** une partie où j'ai tout faux, **quand** j'arrive à l'écran final, **alors** je vois un score de 0 point, sans confettis et sans moquerie, et le bouton « Rejouer ».

---

### US3 — Composer mon propre défi (Priorité : P2)

En tant que francophone qui utilise des skills, je veux écrire moi-même les deux phrases d'un défi (la française et l'anglaise), afin de voir l'écart sur mes propres mots.

**Pourquoi cette priorité** : demandé, mais le jeu marche sans ; c'est ce qui rend le jeu à soi.

**Test seul** : se vérifie entièrement en écrivant deux phrases et en voyant la révélation, et apporte un défi sur ses propres mots.

**Scénarios** :

1. **Étant donné** l'accueil, **quand** je touche « Composer mon défi », **alors** je vois deux champs, un pour la phrase française et un pour l'anglaise, chacun avec son étiquette, et rien n'est traduit pour moi.
2. **Étant donné** deux phrases écrites, **quand** je touche « Jouer ce défi », **alors** je joue ce défi comme les autres : je choisis la phrase la plus chère, puis je vois la révélation (blocs colorés, barres).
3. **Étant donné** un champ vide ou fait seulement d'espaces, **quand** je touche « Jouer ce défi », **alors** on me dit quel champ est à remplir, et le défi ne démarre pas.
4. **Étant donné** une phrase plus longue que 280 caractères (ceux que je vois : un emoji ou une lettre accentuée compte pour un), **quand** je touche « Jouer ce défi », **alors** on me dit que la phrase est trop longue et de combien, et le défi ne démarre pas ; ce que j'ai écrit reste dans le champ.
5. **Étant donné** une phrase qui ressemble à du code (par exemple des balises), **quand** je joue le défi, **alors** elle s'affiche telle que je l'ai écrite, sans être interprétée.

---

### Cas limites

- Que se passe-t-il quand le compteur de jetons ne se charge pas (pas d'internet) ? Le jeu ne démarre pas, et la page le dit comme dans les textes des écrans (« Le compteur de jetons ne répond pas… »), avec de quoi recharger la page.
- Que se passe-t-il quand je touche « C'est parti » alors que le compteur charge encore ? Le jeu attend, puis démarre dès que le compteur est prêt ; s'il n'arrive pas, la page dit qu'il ne répond pas.
- Que se passe-t-il quand je touche deux fois de suite la même phrase ? La réponse ne compte qu'une fois.
- Que se passe-t-il quand je mets du temps à répondre ? Rien : il n'y a pas de limite, le défi attend ; au-delà de 15 secondes le bonus de rapidité vaut 0, et ma bonne réponse compte quand même ses 10 points.
- Que se passe-t-il quand je tourne mon téléphone ou que l'écran est étroit ? Les phrases, les blocs et les barres restent lisibles sans défilement latéral.

## Exigences

- **EF1** : Une partie DOIT compter 5 défis. (US1, scénario 1)
- **EF2** : Chaque défi DOIT montrer deux phrases qui disent la même chose, l'une en français, l'autre en anglais, et laisser choisir celle qu'on pense la plus chère en jetons. (US1, scénario 1)
- **EF3** : Après le choix, l'appli DOIT révéler les vrais nombres de jetons des deux phrases, avec le découpage en blocs colorés et des barres à comparer, et dire si le choix était bon. (US1, scénario 2)
- **EF4** : Les nombres de jetons DOIVENT être les mêmes que ceux du compteur de la page, en version « Récent », même si j'ai choisi « Plus ancien » pour la page. (US1, scénario 2)
- **EF5** : Deux phrases au même nombre de jetons DOIVENT donner « égalité », ni bonne ni mauvaise réponse. (US1, scénario 3)
- **EF6** : Les défis proposés DOIVENT venir d'une liste écrite à la main dans la page. (US1, scénario 1)
- **EF7** : Le score DOIT donner 10 points par bonne réponse, plus un bonus de 5 points si la réponse est donnée en 15 secondes ou moins (0 au-delà), et l'écran final DOIT séparer les deux ; une réponse fausse ou une égalité ne rapporte aucun point. (US2, scénario 1)
- **EF8** : L'écran final DOIT montrer le score, des animations amusantes (confettis, emojis, animations d'entrée ; pas de confettis à 0 point), et un bouton qui relance tout de suite une partie. (US2, scénarios 1 et 2)
- **EF9** : Les animations DOIVENT être absentes quand l'appareil demande moins de mouvement. (US2, scénario 3)
- **EF10** : Je DOIS pouvoir écrire les deux phrases d'un défi moi-même ; l'appli ne traduit rien. (US3, scénario 1)
- **EF11** : Une phrase composée vide, faite d'espaces, ou plus longue que 280 caractères DOIT être refusée avant de jouer, avec un message clair qui dit quoi corriger. (US3, scénarios 3 et 4)
- **EF12** : Ce que j'écris DOIT s'afficher tel quel, jamais interprété comme du code ou de la mise en forme. (US3, scénario 5)
- **EF13** : Fermer la page en pleine partie DOIT perdre la partie, et l'appli ne DOIT rien garder de ce que j'ai joué ni écrit. (US1, scénario 5)
- **EF14** : Si le compteur de jetons ne se charge pas, le jeu NE DOIT PAS démarrer et la page DOIT le dire ; tant qu'il charge, « C'est parti » DOIT attendre, puis démarrer. (Cas limites)

## Critères

- **CS1** : Avant le 4 octobre 2026 à midi, le propriétaire a joué une partie de 5 défis de bout en bout sur son téléphone, sans aide.
- **CS2** : À la fin de cette partie, le propriétaire dit qu'il a aimé.
- **CS3** : Sur un écran de téléphone, aucune page du jeu ne demande de défiler de côté.

## Supposé

- Un défi composé se joue seul (un défi, sa révélation), sans entrer dans une partie de 5 ni dans un score.
- La liste écrite à la main contient au moins 5 défis, pour qu'une partie ne répète pas un défi ; l'ordre est tiré au hasard à chaque partie.
- Le choix se fait en touchant l'une des deux phrases, sans bouton « valider » en plus.
- Le bonus est tout ou rien : 5 points jusqu'à 15 secondes, pour laisser le temps de lire les phrases, puis 0.
- La rapidité se mesure de l'affichage du défi au choix de la phrase.
- Le nombre de défis par partie (5) est un réglage facile à changer plus tard.
- Le jeu parle en « tu », comme le reste de la page, et suit le français/anglais de la page.
- Le produit s'appelle « Tokenette » dans les écrans ; le nom dans la page actuelle est à aligner (hors de cette spec).
- Un défi de la liste est fait de phrases que le propriétaire a vérifiées : ce n'est pas la page qui juge la qualité de la traduction.

## Pas encore

- Garder les parties jouées, le meilleur score, ce que j'ai déjà joué : c'est la fonctionnalité 0003 (progression).
- Les exemples guidés et l'explication de l'écart : c'est la fonctionnalité 0002 (comparaison).
- Une traduction automatique de la phrase composée : écartée (D5) pour que ça marche partout et à 0 €.
- Un classement ou un partage de score : personne ne l'a demandé, et rien n'est gardé dans ce premier essai.
- Choisir le nombre de défis d'une partie : 5 pour l'instant (D1), à augmenter plus tard.

## Vérifs

- [x] Chaque récit nomme une personne de `idee.md` et pourquoi ça compte pour elle ? (US1, US2, US3)
- [x] Chaque scénario se vérifie par quelqu'un qui ne code pas, en faisant et en regardant ? (US1, US2, US3)
- [x] Chaque décision de `decisions.md` apparaît dans un récit ou sous Pas encore ? (US1, US2, US3)
- [x] Qui peut voir, changer ou télécharger chaque donnée personnelle est dit ? (aucune donnée personnelle : rien n'est gardé, EF13)
- [x] Chaque point ouvert est tranché, supposé, ou posé dans `a-trancher.md` avec un conseil ? (US2, US3)
