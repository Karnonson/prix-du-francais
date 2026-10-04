import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { montrer } from "../../../src/modules/jeu/ui/jeu.js";
import { bouton, installerFauxDocument, parClasse, retirerFauxDocument, trouver } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const MESSAGE = "Le compteur de jetons ne répond pas. Tu ne peux pas jouer pour l’instant. Recharge la page quand ta connexion revient.";

// Un compteur dont le test décide quand il arrive ou échoue.
function compteurPilote({ pret = false, echec = false } = {}) {
  const etat = { pret, echec };
  const rappels = [];
  return {
    pret: () => etat.pret,
    echec: () => etat.echec,
    compter: () => null,
    surChangement: (rappel) => rappels.push(rappel),
    arrive() { etat.pret = true; rappels.forEach((r) => r()); },
    echoue() { etat.echec = true; rappels.forEach((r) => r()); },
  };
}

function ouvrir(compteur) {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const appels = [];
  montrer({
    el,
    compteur,
    donnees: { vue: "accueil" },
    demarrerPartie: () => appels.push("partie"),
    composer: () => appels.push("composer"),
    recharger: () => appels.push("recharger"),
  });
  return { el, appels };
}

test("si le compteur ne se charge pas à l'ouverture, le jeu ne démarre pas, la page le dit et un bouton recharge la page", () => {
  const { el, appels } = ouvrir(compteurPilote({ echec: true }));

  assert.ok(el.textContent.includes(MESSAGE));
  assert.equal(parClasse(el, "alerte")[0].getAttribute("role"), "alert");
  assert.equal(bouton(el, "C’est parti"), null);
  bouton(el, "Recharger").click();
  assert.deepEqual(appels, ["recharger"]);
});

test("si le compteur charge encore, « C’est parti » attend puis démarre dès que le compteur est prêt", () => {
  const compteur = compteurPilote();
  const { el, appels } = ouvrir(compteur);

  bouton(el, "C’est parti").click();
  assert.deepEqual(appels, []);

  compteur.arrive();
  assert.deepEqual(appels, ["partie"]);
});

test("si le compteur n'arrive jamais, la page dit qu'il ne répond pas et le jeu ne démarre pas", () => {
  const compteur = compteurPilote();
  const { el, appels } = ouvrir(compteur);

  bouton(el, "C’est parti").click();
  compteur.echoue();

  assert.ok(el.textContent.includes(MESSAGE));
  assert.deepEqual(appels, []);
});

test("si le compteur échoue pendant que l'accueil est affiché, l'accueil le dit tout de suite", () => {
  const compteur = compteurPilote();
  const { el } = ouvrir(compteur);

  compteur.echoue();

  assert.ok(el.textContent.includes(MESSAGE));
  assert.equal(bouton(el, "C’est parti"), null);
});

test("toucher « C’est parti » plusieurs fois pendant l'attente ne démarre qu'une partie", () => {
  const compteur = compteurPilote();
  const { el, appels } = ouvrir(compteur);

  bouton(el, "C’est parti").click();
  bouton(el, "C’est parti").click();
  compteur.arrive();

  assert.deepEqual(appels, ["partie"]);
});

// Correctif US3 : un défi composé se révèle avec le compteur ; « Composer mon défi » attend comme « C’est parti ».
test("compteur pas prêt : « Composer mon défi » attend, puis ouvre l'écran composer dès que le compteur est prêt", () => {
  const compteur = compteurPilote();
  const { el, appels } = ouvrir(compteur);

  bouton(el, "Composer mon défi").click();
  assert.deepEqual(appels, []);
  assert.equal(bouton(el, "Composer mon défi").getAttribute("aria-busy"), "true");

  compteur.arrive();
  assert.deepEqual(appels, ["composer"]);
});

test("compteur prêt : « Composer mon défi » ouvre l'écran composer tout de suite", () => {
  const { el, appels } = ouvrir(compteurPilote({ pret: true }));

  bouton(el, "Composer mon défi").click();

  assert.deepEqual(appels, ["composer"]);
});

test("toucher « Composer mon défi » plusieurs fois pendant l'attente n'ouvre qu'un écran", () => {
  const compteur = compteurPilote();
  const { el, appels } = ouvrir(compteur);

  bouton(el, "Composer mon défi").click();
  bouton(el, "Composer mon défi").click();
  compteur.arrive();

  assert.deepEqual(appels, ["composer"]);
});

test("« Composer mon défi » attend puis le compteur échoue : la page le dit et rien ne s'ouvre", () => {
  const compteur = compteurPilote();
  const { el, appels } = ouvrir(compteur);

  bouton(el, "Composer mon défi").click();
  compteur.echoue();

  assert.ok(el.textContent.includes(MESSAGE));
  assert.deepEqual(appels, []);
});
