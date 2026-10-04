// Monter la page de comparaison sans navigateur : un faux document tiré du balisage de index.html,
// de faux découpeurs (un par réglage), et de quoi les faire se charger, échouer ou attendre.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SANS_BALISE = /<[^>]*>/g;

class Element {
  constructor(nom, attributs = {}) {
    this.tagName = nom.toUpperCase();
    this.attributs = new Map(Object.entries(attributs));
    this.noeuds = [];
    this.texte = "";
    this.ecouteurs = new Map();
    this.style = {};
    this.value = "";
    this.title = "";
    this.disabled = false;
    this.hidden = this.attributs.has("hidden");
    this.id = attributs.id ?? "";
    this.classList = new Set((attributs.class ?? "").split(/\s+/).filter(Boolean));
    this.dataset = {};
    for (const [nom_, valeur] of this.attributs) {
      if (nom_.startsWith("data-")) {
        this.dataset[nom_.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = valeur;
      }
    }
    this.focus_ = 0;
    const liste = this.classList;
    this.classList = {
      add: (c) => liste.add(c),
      remove: (c) => liste.delete(c),
      contains: (c) => liste.has(c),
    };
    this._liste = liste;
  }
  get className() { return [...this._liste].join(" "); }
  set className(v) { this._liste.clear(); String(v).split(/\s+/).filter(Boolean).forEach((c) => this._liste.add(c)); }
  get children() { return this.noeuds.filter((n) => n instanceof Element); }
  get textContent() { return this.texte + this.noeuds.map((n) => n.textContent).join(""); }
  set textContent(v) { this.texte = String(v); this.noeuds = []; }
  get innerHTML() { return this.html ?? ""; }
  set innerHTML(v) { this.html = String(v); this.texte = this.html.replace(SANS_BALISE, ""); this.noeuds = []; }
  append(...enfants) {
    for (const e of enfants) this.noeuds.push(typeof e === "string" ? { textContent: e } : e);
  }
  appendChild(e) { this.append(e); return e; }
  replaceChildren(...enfants) { this.noeuds = []; this.append(...enfants); }
  setAttribute(n, v) { this.attributs.set(n, String(v)); }
  getAttribute(n) { return this.attributs.has(n) ? this.attributs.get(n) : null; }
  addEventListener(type, rappel) {
    if (!this.ecouteurs.has(type)) this.ecouteurs.set(type, []);
    this.ecouteurs.get(type).push(rappel);
  }
  dispatchEvent(e) { for (const r of this.ecouteurs.get(e.type) ?? []) r(e); }
  click() { this.dispatchEvent({ type: "click", target: this }); }
  focus() { this.focus_ += 1; }
  // Les éléments que la page crée puis cherche dans son propre balisage interne ne sont pas suivis.
  querySelector() { return new Element("span"); }
  querySelectorAll() { return []; }
}

function elementsDuBalisage() {
  const html = readFileSync(join(racine, "index.html"), "utf8");
  const corps = html.slice(html.indexOf('<div class="wrap">'), html.indexOf("<script"));
  const liste = [];
  for (const [, nom, brut] of corps.matchAll(/<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*>/g)) {
    const attributs = {};
    for (const [, n, v] of brut.matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attributs[n] = v ?? "";
    liste.push(new Element(nom, attributs));
  }
  return liste;
}

function selecteur(sel, el) {
  const attribut = sel.match(/^\[([\w-]+)\]$/);
  if (attribut) return el.attributs.has(attribut[1]);
  if (sel.startsWith(".")) return el.classList.contains(sel.slice(1));
  return false;
}

export function creerDocument() {
  const elements = elementsDuBalisage();
  const document = {
    title: "",
    documentElement: { lang: "" },
    head: new Element("head"),
    createElement: (nom) => new Element(nom),
    getElementById: (id) => elements.find((e) => e.id === id) ?? null,
    querySelector: (sel) => elements.find((e) => selecteur(sel, e)) ?? null,
    querySelectorAll: (sel) => elements.filter((e) => selecteur(sel, e)),
  };
  return document;
}

// Un découpeur de mots (« Récent ») qui coupe « é » en deux jetons, le premier se décodant en "",
// et un découpeur par tranches de 3 caractères (« Plus ancien »).
function fauxDecoupeur(couper) {
  const vocabulaire = [];
  return {
    encode(texte) {
      const ids = [];
      for (const morceau of couper(texte)) {
        if (morceau === "é") { vocabulaire.push(""); ids.push(vocabulaire.length - 1); }
        vocabulaire.push(morceau);
        ids.push(vocabulaire.length - 1);
      }
      return ids;
    },
    decode: ([id]) => vocabulaire[id],
  };
}
export const coupeRecent = (texte) => texte.match(/é|\s?[^\sé]+|\s+/g) ?? [];
export const coupeAncien = (texte) => texte.match(/[\s\S]{1,3}/g) ?? [];
const DECOUPEURS = {
  "o200k_base.js": ["GPTTokenizer_o200k_base", coupeRecent],
  "cl100k_base.js": ["GPTTokenizer_cl100k_base", coupeAncien],
};

export const attendre = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// Monte la page par l'entrée du module. `echouer` : les fichiers de découpeurs qui ne se chargent pas ;
// `attente` : les découpeurs ne se chargent qu'à l'appel de `liberer()` ; `claude` : le `window.claude` de l'hôte.
export async function monterPage({ echouer = [], attente = false, claude } = {}) {
  const document = creerDocument();
  const global = globalThis;
  global.document = document;
  global.window = global;
  delete global.claude;
  for (const nom of ["GPTTokenizer_o200k_base", "GPTTokenizer_cl100k_base"]) delete global[nom];
  if (claude) global.claude = claude;
  const enAttente = [];
  const charger = (script) => {
    const fichier = script.src.split("/").pop();
    const [nom, couper] = DECOUPEURS[fichier];
    if (echouer.includes(fichier)) return script.onerror();
    global[nom] = fauxDecoupeur(couper);
    script.onload();
  };
  document.head.append = (script) => {
    if (attente) enAttente.push(script);
    else queueMicrotask(() => charger(script));
  };
  const { monter } = await import(pathToFileURL(join(racine, "src/modules/comparaison/api.js")));
  monter();
  await attendre(0);
  return {
    document,
    el: (id) => document.getElementById(id),
    liberer: async () => { enAttente.splice(0).forEach(charger); await attendre(0); },
  };
}

export const espaces = (texte) => texte.replace(/\s/g, " ");

export async function saisir(page, langue, valeur) {
  const zone = page.el(`text-${langue}`);
  zone.value = valeur;
  zone.dispatchEvent({ type: "input" });
}
