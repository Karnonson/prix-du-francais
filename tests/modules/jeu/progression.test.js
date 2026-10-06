import { test } from "node:test";
import assert from "node:assert/strict";
import { enregistrerPartie, lireProgression, remettreAZero } from "../../../src/modules/jeu/progression.js";

// Un faux localStorage, fidèle à l'API réelle (setItem/getItem/removeItem).
function fauxStockage(valeurs = {}) {
  return {
    getItem: (cle) => (cle in valeurs ? valeurs[cle] : null),
    setItem: (cle, valeur) => { valeurs[cle] = valeur; },
    removeItem: (cle) => { delete valeurs[cle]; },
  };
}

test("sans stockage ni partie jouée, la progression est vide", () => {
  assert.deepEqual(lireProgression(fauxStockage()), { meilleurScore: 0, vus: [] });
  assert.deepEqual(lireProgression(null), { meilleurScore: 0, vus: [] });
});

test("enregistrer une partie garde le score et les défis vus", () => {
  const stockage = fauxStockage();

  const progression = enregistrerPartie(stockage, { score: 30, vus: [0, 1, 2] });

  assert.deepEqual(progression, { meilleurScore: 30, vus: [0, 1, 2] });
  assert.deepEqual(lireProgression(stockage), { meilleurScore: 30, vus: [0, 1, 2] });
});

test("une partie suivante garde le plus haut score et ajoute les défis vus, sans doublon", () => {
  const stockage = fauxStockage();
  enregistrerPartie(stockage, { score: 30, vus: [0, 1] });

  const progression = enregistrerPartie(stockage, { score: 20, vus: [1, 2] });

  assert.deepEqual(progression, { meilleurScore: 30, vus: [0, 1, 2] });
});

test("remettre à zéro efface la progression gardée", () => {
  const stockage = fauxStockage();
  enregistrerPartie(stockage, { score: 30, vus: [0, 1] });

  remettreAZero(stockage);

  assert.deepEqual(lireProgression(stockage), { meilleurScore: 0, vus: [] });
});

test("une valeur illisible dans le stockage est ignorée plutôt que de faire planter le jeu", () => {
  const stockage = fauxStockage({ "tokenette-progression": "{pas du json" });

  assert.deepEqual(lireProgression(stockage), { meilleurScore: 0, vus: [] });
});
