# Défis — livraison

## Version

0.1.0

## Livré

- US1 Jouer une partie de 5 défis : deviner laquelle de deux phrases qui disent la même chose coûte le plus de jetons, voir les vrais chiffres, rien n'est gardé.
- US2 Voir mon score et rejouer : 10 points par bonne réponse, 5 points de bonus de rapidité, des confettis, « Rejouer » tout de suite, aucune animation si l'appareil demande moins de mouvement.
- US3 Composer mon propre défi : écrire les deux phrases soi-même, les jouer seul, ce qu'on écrit s'affiche tel quel.
- Plus tard : garder les parties et le meilleur score (fonctionnalité 0003), les exemples guidés (0002), une traduction automatique (écartée), un classement ou un partage de score, choisir le nombre de défis.

## En ligne

pas encore

## Mise en ligne

pas encore

## Vérifié

pas encore

## En cas de problème

pas encore

## À faire

- le propriétaire joue une partie de 5 défis de bout en bout sur son téléphone, sans aide, et dit s'il a aimé (CS1, CS2 de la spec : avant le 4 octobre 2026 à midi) — à la main
- les textes anglais du jeu n'existent pas : la page en anglais garde les textes du jeu en français (`passation.md` → Ouvert) — à la main
- SC1 (attente du bouton « Composer mon défi ») et SC4 (écran composer) n'ont pas été cliqués à 390 et à 1280 pixels, et il n'y a pas de capture SC3 ni SC4 : à regarder en ligne — à la main
- Détails de la relecture, sans effet sur ce qu'on voit : `src/modules/jeu/ui/jeu.js:35` (garde « une seule demande en attente » sans test), `src/modules/jeu/saisie.js:7` (le compteur de frappe ne s'arrête pas à 281), `src/modules/jeu/api.js:18` (une erreur d'un écran vide l'emplacement sans trace) — à la main
