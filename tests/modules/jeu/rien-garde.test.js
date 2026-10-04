import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { monter } from "../../../src/modules/jeu/api.js";
import { attendreQue, bouton, compteurParMots, installerFauxDocument, retirerFauxDocument, trouver } from "../../aide/ecran.js";

const AUTRES_GLOBALES = ["localStorage", "sessionStorage", "indexedDB"];

afterEach(() => {
  retirerFauxDocument();
  for (const nom of AUTRES_GLOBALES) delete globalThis[nom];
});

// Un faux stockage qui note toute écriture, par méthode ou par propriété.
function stockageEspion(nom, ecritures) {
  const methodes = {
    setItem: (...args) => ecritures.push([nom, "setItem", ...args]),
    removeItem: () => {},
    clear: () => {},
    getItem: () => null,
    key: () => null,
    length: 0,
  };
  return new Proxy(methodes, {
    set(_, propriete, valeur) {
      ecritures.push([nom, `propriété ${String(propriete)}`, valeur]);
      return true;
    },
  });
}

function installerEspions() {
  const ecritures = [];
  const document = installerFauxDocument();
  Object.defineProperty(document, "cookie", { get: () => "", set: (valeur) => ecritures.push(["cookie", valeur]) });
  globalThis.localStorage = stockageEspion("localStorage", ecritures);
  globalThis.sessionStorage = stockageEspion("sessionStorage", ecritures);
  globalThis.indexedDB = { open: (...args) => { ecritures.push(["indexedDB", "open", ...args]); }, deleteDatabase: () => {} };
  return { document, ecritures };
}

async function jouerUnePartie(el) {
  await attendreQue(() => bouton(el, "C’est parti"));
  bouton(el, "C’est parti").click();
  for (let numero = 1; numero <= 5; numero += 1) {
    await attendreQue(() => el.textContent.includes(`Défi ${numero} sur 5`) && trouver(el, (e) => e.tagName === "BUTTON" && e.getAttribute("data-lang")));
    trouver(el, (e) => e.tagName === "BUTTON" && e.getAttribute("data-lang") === (numero % 2 ? "fr" : "en")).click();
    await attendreQue(() => bouton(el, numero < 5 ? "Défi suivant" : "Voir mon score"));
    bouton(el, numero < 5 ? "Défi suivant" : "Voir mon score").click();
  }
  await attendreQue(() => bouton(el, "Rejouer"));
}

test("une partie jouée en entier, puis rejouée, n'écrit rien dans localStorage, sessionStorage, les cookies ni IndexedDB", async () => {
  const { document, ecritures } = installerEspions();
  const el = document.createElement("section");

  monter(el, compteurParMots());
  await jouerUnePartie(el);
  assert.match(el.textContent, /sur 5\./);
  bouton(el, "Rejouer").click();
  await attendreQue(() => el.textContent.includes("Défi 1 sur 5"));

  assert.deepEqual(ecritures, []);
});

test("composer un défi n'écrit rien non plus", async () => {
  const { document, ecritures } = installerEspions();
  const el = document.createElement("section");

  monter(el, compteurParMots());
  await attendreQue(() => bouton(el, "Composer mon défi"));
  bouton(el, "Composer mon défi").click();
  await attendreQue(() => trouver(el, (e) => e.tagName === "TEXTAREA"));
  for (const langue of ["fr", "en"]) {
    const champ = trouver(el, (e) => e.tagName === "TEXTAREA" && e.getAttribute("data-lang") === langue);
    champ.value = langue === "fr" ? "Bonjour" : "Hello";
    champ.dispatchEvent({ type: "input", target: champ });
  }
  bouton(el, "Jouer ce défi").click();

  assert.deepEqual(ecritures, []);
});

test("le test sait voir une écriture : un setItem est noté", () => {
  const { ecritures } = installerEspions();

  globalThis.localStorage.setItem("score", "55");
  globalThis.document.cookie = "a=1";
  globalThis.indexedDB.open("jeu");

  assert.deepEqual(ecritures.map((e) => e[0]), ["localStorage", "cookie", "indexedDB"]);
});
