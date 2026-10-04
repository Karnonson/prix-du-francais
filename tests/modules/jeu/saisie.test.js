import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_CARACTERES, caracteresVus, verifier } from "../../../src/modules/jeu/saisie.js";

const bonne = "Tu peux me rappeler d’appeler le dentiste demain matin ?";
const bienEcrite = "Can you remind me to call the dentist tomorrow morning?";

test("deux phrases correctes sont acceptées telles qu'écrites, sans rognage", () => {
  const fr = `  ${bonne}\n`;

  assert.deepEqual(verifier({ fr, en: bienEcrite }), { ok: true, defi: { fr, en: bienEcrite } });
});

test("une phrase vide ou faite d'espaces est refusée, avec le champ à remplir", () => {
  assert.deepEqual(verifier({ fr: "", en: bienEcrite }), { ok: false, erreurs: [{ champ: "fr", type: "vide" }] });
  assert.deepEqual(verifier({ fr: bonne, en: " \n\t " }), { ok: false, erreurs: [{ champ: "en", type: "vide" }] });
});

test("les deux champs fautifs sont signalés ensemble", () => {
  assert.deepEqual(verifier({ fr: "", en: "x".repeat(300) }), {
    ok: false,
    erreurs: [{ champ: "fr", type: "vide" }, { champ: "en", type: "longue", depasse: 20 }],
  });
});

test("280 caractères vus passent, 281 sont refusés avec de combien", () => {
  assert.equal(MAX_CARACTERES, 280);
  assert.equal(verifier({ fr: "a".repeat(280), en: bienEcrite }).ok, true);
  assert.deepEqual(verifier({ fr: "a".repeat(281), en: bienEcrite }).erreurs, [{ champ: "fr", type: "longue", depasse: 1 }]);
  assert.deepEqual(verifier({ fr: bonne, en: "a".repeat(312) }).erreurs, [{ champ: "en", type: "longue", depasse: 32 }]);
});

test("un emoji composé, un drapeau ou une lettre accentuée en deux morceaux comptent pour un seul caractère vu", () => {
  assert.equal(caracteresVus("👨‍👩‍👧‍👦"), 1);
  assert.equal(caracteresVus("🇫🇷"), 1);
  assert.equal(caracteresVus("é"), 1);
  assert.equal(caracteresVus("é😀"), 2);
  assert.equal(verifier({ fr: "👨‍👩‍👧‍👦".repeat(280), en: "é".repeat(280) }).ok, true);
  assert.equal(verifier({ fr: "🇫🇷".repeat(281), en: bienEcrite }).ok, false);
});

test("un texte énorme est refusé vite, sans être découpé en jetons (saisie ne connaît pas le compteur)", () => {
  const debut = Date.now();

  const resultat = verifier({ fr: "a ".repeat(100_000), en: bienEcrite });

  assert.equal(resultat.ok, false);
  assert.equal(resultat.erreurs[0].type, "longue");
  assert.ok(Date.now() - debut < 1000, "la vérification est trop lente");
});

test("une valeur qui n'est pas un texte est refusée comme vide", () => {
  assert.deepEqual(verifier({ fr: undefined, en: null }).erreurs, [{ champ: "fr", type: "vide" }, { champ: "en", type: "vide" }]);
});
