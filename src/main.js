// Branche les modules à la page : la comparaison, puis le jeu à côté, avec son compteur.
import { monter as monterComparaison } from "./modules/comparaison/api.js";

monterComparaison();

// Le jeu s'ajoute à côté de la page : s'il ne se charge pas, l'emplacement reste vide.
try {
  const [{ creerCompteur }, { monter }] = await Promise.all([
    import("./modules/compteur/api.js"),
    import("./modules/jeu/api.js"),
  ]);
  monter(document.getElementById("jeu"), creerCompteur());
} catch {}
