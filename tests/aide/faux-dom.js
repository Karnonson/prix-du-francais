// Un faux `document` minimal, pour importer et monter un écran sans navigateur.
// Il sait : créer un élément ou un texte, ajouter des enfants, lire le texte, poser un attribut,
// écouter et déclencher un clic. Rien d'autre.

class Texte {
  constructor(valeur) {
    this.valeur = valeur;
  }
  get textContent() {
    return this.valeur;
  }
}

class Element {
  constructor(nom) {
    this.tagName = nom.toUpperCase();
    this.noeuds = [];
    this.attributs = new Map();
    this.ecouteurs = new Map();
  }

  get children() {
    return this.noeuds.filter((noeud) => noeud instanceof Element);
  }

  get textContent() {
    return this.noeuds.map((noeud) => noeud.textContent).join("");
  }

  // Comme dans un navigateur : le texte posé est du texte, jamais du code.
  set textContent(valeur) {
    this.noeuds = [new Texte(String(valeur))];
  }

  append(...enfants) {
    for (const enfant of enfants) {
      this.noeuds.push(typeof enfant === "string" ? new Texte(enfant) : enfant);
    }
  }

  appendChild(enfant) {
    this.append(enfant);
    return enfant;
  }

  setAttribute(nom, valeur) {
    this.attributs.set(nom, String(valeur));
  }

  getAttribute(nom) {
    return this.attributs.has(nom) ? this.attributs.get(nom) : null;
  }

  addEventListener(type, rappel) {
    if (!this.ecouteurs.has(type)) this.ecouteurs.set(type, []);
    this.ecouteurs.get(type).push(rappel);
  }

  dispatchEvent(evenement) {
    for (const rappel of this.ecouteurs.get(evenement.type) ?? []) rappel(evenement);
  }

  click() {
    this.dispatchEvent({ type: "click", target: this });
  }
}

export function creerFauxDocument() {
  return {
    createElement: (nom) => new Element(nom),
    createTextNode: (valeur) => new Texte(String(valeur)),
  };
}
