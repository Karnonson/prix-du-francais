import { test } from "node:test";
import assert from "node:assert/strict";
import { creerCompteur } from "../../../src/modules/compteur/api.js";

const ADRESSE_RECENT = "https://cdn.jsdelivr.net/npm/gpt-tokenizer@2.9.0/dist/o200k_base.js";

// Faux découpeur : « é » est coupé en deux jetons (le premier ne décode rien tout seul), « ! » en un.
function fauxDecoupeur() {
  const textes = { 1: "a", 2: "", 3: "é", 4: "!" };
  return {
    encode: (texte) => [...texte].flatMap((c) => (c === "a" ? [1] : c === "é" ? [2, 3] : [4])),
    decode: ([id]) => textes[id],
  };
}

const attendre = () => new Promise((resolve) => setTimeout(resolve, 0));

test("compter replie les morceaux vides dans le suivant et garde le vrai nombre de jetons", async () => {
  const compteur = creerCompteur({ charger: async () => fauxDecoupeur() });
  await attendre();

  assert.deepEqual(compteur.compter("aé!"), {
    nombre: 4,
    blocs: [
      { texte: "a", n: 1 },
      { texte: "é", n: 2 },
      { texte: "!", n: 1 },
    ],
  });
});

test("compter rend un compte vide pour un texte vide", async () => {
  const compteur = creerCompteur({ charger: async () => fauxDecoupeur() });
  await attendre();

  assert.deepEqual(compteur.compter(""), { nombre: 0, blocs: [] });
});

test("le compteur charge toujours « Récent » (o200k), sans rien lire de la page", async () => {
  const demandes = [];
  const compteur = creerCompteur({
    charger: async (demande) => {
      demandes.push(demande);
      return fauxDecoupeur();
    },
  });
  await attendre();

  assert.deepEqual(demandes, [{ global: "GPTTokenizer_o200k_base", src: ADRESSE_RECENT }]);
  assert.equal(compteur.pret(), true);
});

test("tant que le découpeur charge, pret() est faux et compter() ne rend rien ; surChangement prévient à l'arrivée", async () => {
  let arrive;
  const compteur = creerCompteur({ charger: () => new Promise((resolve) => { arrive = resolve; }) });
  let appels = 0;
  compteur.surChangement(() => { appels += 1; });

  assert.equal(compteur.pret(), false);
  assert.equal(compteur.echec(), false);
  assert.equal(compteur.compter("a"), null);

  arrive(fauxDecoupeur());
  await attendre();

  assert.equal(compteur.pret(), true);
  assert.equal(appels, 1);
});

test("si le chargement échoue, echec() est vrai, pret() reste faux et surChangement prévient", async () => {
  const compteur = creerCompteur({ charger: async () => { throw new Error("hors ligne"); } });
  let appels = 0;
  compteur.surChangement(() => { appels += 1; });
  await attendre();

  assert.equal(compteur.echec(), true);
  assert.equal(compteur.pret(), false);
  assert.equal(compteur.compter("a"), null);
  assert.equal(appels, 1);
});
