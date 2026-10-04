// Aides pour monter un écran du jeu sans navigateur : un faux document installé en global, de quoi
// retrouver un bouton dans l'arbre, et attendre qu'un écran chargé à la demande soit monté.
import { creerFauxDocument } from "./faux-dom.js";

export function installerFauxDocument() {
  const document = creerFauxDocument();
  document.head = document.createElement("head");
  globalThis.document = document;
  return document;
}

export function retirerFauxDocument() {
  delete globalThis.document;
}

export function trouverTous(racine, condition, trouves = []) {
  for (const enfant of racine.children) {
    if (condition(enfant)) trouves.push(enfant);
    trouverTous(enfant, condition, trouves);
  }
  return trouves;
}

export function trouver(racine, condition) {
  return trouverTous(racine, condition)[0] ?? null;
}

// Le premier bouton ou lien dont le texte contient `texte`.
export function bouton(racine, texte) {
  return trouver(racine, (el) => ["BUTTON", "A"].includes(el.tagName) && el.textContent.includes(texte));
}

export async function attendreQue(condition, delai = 2000) {
  const fin = Date.now() + delai;
  while (!condition()) {
    if (Date.now() > fin) throw new Error("trop long : la condition n'est jamais devenue vraie");
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

export function parClasse(racine, nom) {
  return trouverTous(racine, (el) => (el.getAttribute("class") ?? "").split(" ").includes(nom));
}

// Un faux compteur : un jeton par mot, chaque mot (avec son espace de tête) est un bloc.
export function compteurParMots(table = {}) {
  return {
    pret: () => true,
    echec: () => false,
    surChangement: () => {},
    compter(texte) {
      if (table[texte]) return table[texte];
      const blocs = texte.split(" ").map((mot, i) => ({ texte: i === 0 ? mot : ` ${mot}`, n: 1 }));
      return { nombre: blocs.length, blocs };
    },
  };
}
