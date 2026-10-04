import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { creerFauxDocument } from "../../aide/faux-dom.js";
import { monter } from "../../../src/modules/jeu/api.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const page = readFileSync(join(racine, "index.html"), "utf8");
const scriptModule = page.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];

const attendre = () => new Promise((resolve) => setTimeout(resolve, 0));

// Un faux lot d'écrans : chaque écran note qu'il est monté et avec quoi.
function fauxEcrans() {
  const montes = [];
  const demandes = [];
  const charger = async (nom) => {
    demandes.push(nom);
    return { montrer: (contexte) => { montes.push({ nom, contexte }); } };
  };
  return { charger, montes, demandes };
}

test("index.html a l'emplacement du jeu avant le comparateur", () => {
  const jeu = page.indexOf('<section id="jeu"');
  const comparateur = page.indexOf('<section class="templates"');

  assert.ok(jeu > -1, "pas de <section id=\"jeu\">");
  assert.ok(jeu < comparateur, "l'emplacement du jeu doit venir avant le comparateur");
});

test("index.html importe creerCompteur et monter par leurs points d'entrée et appelle monter sur l'emplacement", () => {
  assert.ok(scriptModule, "pas de <script type=\"module\">");
  assert.match(scriptModule, /modules\/compteur\/api\.js/);
  assert.match(scriptModule, /modules\/jeu\/api\.js/);
  assert.ok(scriptModule.includes('monter(document.getElementById("jeu"), creerCompteur())'));
});

test("publiée seule, sans modules/, la page reste celle d'avant : le script ne lève rien et l'emplacement reste vide", async () => {
  const el = creerFauxDocument().createElement("section");
  globalThis.document = { getElementById: () => el };
  try {
    const url = "data:text/javascript;base64," + Buffer.from(scriptModule).toString("base64");
    await import(url);
    await attendre();
  } finally {
    delete globalThis.document;
  }

  assert.equal(el.textContent, "");
  assert.equal(el.children.length, 0);
  assert.match(page, /#jeu:empty\s*\{\s*display:\s*none/);
});

test("monter s'importe sans navigateur et ne charge aucun écran avant d'en avoir besoin", async () => {
  assert.equal(typeof globalThis.document, "undefined");
  const ecrans = fauxEcrans();

  monter(creerFauxDocument().createElement("section"), {}, ecrans.charger);
  await attendre();

  assert.deepEqual(ecrans.demandes, ["jeu"]);
});

test("monter ne touche qu'à el : l'accueil se monte dans el, avec le compteur dans le contexte", async () => {
  const el = creerFauxDocument().createElement("section");
  const compteur = { pret: () => true };
  const ecrans = fauxEcrans();

  monter(el, compteur, ecrans.charger);
  await attendre();

  assert.equal(ecrans.montes.length, 1);
  assert.equal(ecrans.montes[0].contexte.el, el);
  assert.equal(ecrans.montes[0].contexte.compteur, compteur);
});

test("le contexte offre accueil, demarrerPartie, jouerSeul et composer, chacun charge son écran à la demande", async () => {
  const ecrans = fauxEcrans();
  monter(creerFauxDocument().createElement("section"), {}, ecrans.charger);
  await attendre();
  const contexte = ecrans.montes[0].contexte;
  const defi = { fr: "Bonjour", en: "Hello" };

  contexte.composer();
  await attendre();
  contexte.demarrerPartie();
  await attendre();
  contexte.jouerSeul(defi);
  await attendre();
  contexte.accueil();
  await attendre();

  assert.deepEqual(ecrans.montes.slice(1).map((m) => [m.nom, m.contexte.donnees]), [
    ["composer", undefined],
    ["jeu", { vue: "partie" }],
    ["jeu", { vue: "seul", defi }],
    ["jeu", { vue: "accueil" }],
  ]);
});

test("un écran qu'api.js ne connaît pas se charge par son nom, sans retoucher api.js", async () => {
  const ecrans = fauxEcrans();
  monter(creerFauxDocument().createElement("section"), {}, ecrans.charger);
  await attendre();

  ecrans.montes[0].contexte.montrer("nouveau", { x: 1 });
  await attendre();

  const dernier = ecrans.montes.at(-1);
  assert.equal(dernier.nom, "nouveau");
  assert.deepEqual(dernier.contexte.donnees, { x: 1 });
});

test("monter vide el avant chaque écran, et seul le dernier écran demandé s'affiche même si un autre arrive en retard", async () => {
  const document = creerFauxDocument();
  const el = document.createElement("section");
  el.textContent = "ancien";
  const contextes = [];
  const arrivees = [];
  const charger = (nom) => new Promise((resolve) => arrivees.push(() => resolve({
    montrer: (contexte) => { contextes.push(contexte); el.append(document.createTextNode(nom)); },
  })));

  monter(el, {}, charger);
  arrivees[0]();
  await attendre();
  assert.equal(el.textContent, "jeu");

  // « composer » est demandé puis « accueil » ; « composer » arrive en retard et ne doit rien afficher
  contextes[0].composer();
  contextes[0].accueil();
  arrivees[2]();
  await attendre();
  arrivees[1]();
  await attendre();

  assert.equal(el.textContent, "jeu");
});

test("un écran qui ne se charge pas laisse el vide, sans erreur", async () => {
  const el = creerFauxDocument().createElement("section");

  monter(el, {}, async () => { throw new Error("404"); });
  await attendre();

  assert.equal(el.textContent, "");
});
