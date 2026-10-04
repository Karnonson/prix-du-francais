// Branche les modules à la page : la comparaison, puis le jeu à côté, avec son compteur.
import { monter as monterComparaison } from "./modules/comparaison/api.js";

// Bascule entre l'accueil, le jeu et le comparateur (US2) : chaque bouton `[data-goto]` montre l'état
// visé et cache les deux autres. Jeu et comparateur restent montés depuis le chargement (D1) ; seule
// leur visibilité change ici, jamais leurs internes (D5). Un clic sur l'état déjà affiché ne fait rien :
// une seule section visible à la fois, même sous des clics rapides et répétés sur Jouer, Comparer ou
// Retour à l'accueil (risque abus — aucun remontage, donc aucun montage multiple possible).
const sections = new Map(
  [...document.querySelectorAll("[data-state]")].map((section) => [section.dataset.state, section]),
);
let etatActuel = "accueil";

function basculer(etat) {
  if (etat === etatActuel || !sections.has(etat)) return;
  for (const [nom, section] of sections) section.hidden = nom !== etat;
  etatActuel = etat;
}

for (const bouton of document.querySelectorAll("[data-goto]")) {
  bouton.addEventListener("click", () => basculer(bouton.dataset.goto));
}

monterComparaison();

// Le jeu s'ajoute à côté de la page : s'il ne se charge pas, l'emplacement reste vide.
try {
  const [{ creerCompteur }, { monter }] = await Promise.all([
    import("./modules/compteur/api.js"),
    import("./modules/jeu/api.js"),
  ]);
  monter(document.getElementById("jeu"), creerCompteur());
} catch {}
