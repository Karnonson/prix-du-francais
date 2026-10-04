import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { montrer } from "../../../src/modules/jeu/ui/composer.js";
import { bouton, installerFauxDocument, parClasse, retirerFauxDocument, trouver } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const FR = "Tu peux me rappeler d’appeler le dentiste demain matin ?";
const EN = "Can you remind me to call the dentist tomorrow morning?";

function ouvrir() {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const appels = [];
  // un compteur qui lève si on l'utilise : la saisie est vérifiée avant tout comptage
  const compteur = { compter: () => { throw new Error("la saisie ne doit pas être découpée ici"); } };
  montrer({
    el,
    compteur,
    donnees: undefined,
    accueil: () => appels.push(["accueil"]),
    jouerSeul: (defi) => appels.push(["jouerSeul", defi]),
  });
  const champ = (langue) => trouver(el, (e) => e.tagName === "TEXTAREA" && e.getAttribute("data-lang") === langue);
  const ecrire = (langue, texte) => { const c = champ(langue); c.value = texte; c.dispatchEvent({ type: "input", target: c }); };
  return { el, appels, champ, ecrire };
}

test("l'écran composer montre deux champs avec leur étiquette et un compteur, et ne traduit rien", () => {
  const { el, champ } = ouvrir();

  assert.match(el.textContent, /Composer mon défi/);
  assert.match(el.textContent, /Tu écris la même phrase en français, puis en anglais\. Tokenette ne traduit rien à ta place et ne garde rien\./);
  assert.match(el.textContent, /Ta phrase en français/);
  assert.match(el.textContent, /Ta phrase en anglais/);
  assert.equal(champ("fr").value ?? "", "");
  assert.equal(champ("en").value ?? "", "");
  assert.deepEqual(parClasse(el, "note").map((n) => n.textContent), ["0 / 280 caractères", "0 / 280 caractères"]);
  assert.equal(trouver(el, (e) => e.tagName === "LABEL" && e.textContent.includes("Ta phrase en français")).getAttribute("for"), champ("fr").getAttribute("id"));
});

test("le compteur suit ce qu'on écrit, en caractères vus", () => {
  const { el, ecrire } = ouvrir();

  ecrire("fr", "é👨‍👩‍👧‍👦");

  assert.deepEqual(parClasse(el, "note").map((n) => n.textContent), ["2 / 280 caractères", "0 / 280 caractères"]);
});

test("un champ vide ou d'espaces : on dit quel champ remplir et le défi ne démarre pas", () => {
  const { el, appels, ecrire, champ } = ouvrir();
  ecrire("en", EN);

  bouton(el, "Jouer ce défi").click();

  const alertes = parClasse(el, "erreur");
  assert.equal(alertes.length, 1);
  assert.equal(alertes[0].getAttribute("role"), "alert");
  assert.match(alertes[0].textContent, /Tu n’as pas écrit la phrase en français\./);
  assert.equal(champ("fr").getAttribute("aria-invalid"), "true");
  assert.ok(champ("fr").getAttribute("aria-describedby").includes(alertes[0].getAttribute("id")));
  assert.notEqual(champ("en").getAttribute("aria-invalid"), "true");
  assert.deepEqual(appels, []);

  ecrire("fr", "   ");
  bouton(el, "Jouer ce défi").click();
  assert.equal(parClasse(el, "erreur").length, 1);
  assert.deepEqual(appels, []);
});

test("une phrase trop longue : on dit de combien, le texte reste dans le champ et le défi ne démarre pas", () => {
  const { el, appels, ecrire, champ } = ouvrir();
  const longue = "a".repeat(312);
  ecrire("fr", FR);
  ecrire("en", longue);

  bouton(el, "Jouer ce défi").click();

  assert.match(parClasse(el, "erreur")[0].textContent, /Ta phrase en anglais dépasse la limite de 32 caractères\. Coupe un peu\./);
  assert.equal(champ("en").value, longue);
  assert.equal(champ("fr").value, FR);
  assert.deepEqual(appels, []);
});

test("une seule lettre de trop s'écrit « 1 caractère »", () => {
  const { el, ecrire } = ouvrir();
  ecrire("fr", "a".repeat(281));
  ecrire("en", EN);

  bouton(el, "Jouer ce défi").click();

  assert.match(parClasse(el, "erreur")[0].textContent, /dépasse la limite de 1 caractère\./);
});

test("deux phrases correctes lancent jouerSeul avec les phrases telles qu'écrites, et corriger efface l'erreur", () => {
  const { el, appels, ecrire } = ouvrir();
  ecrire("en", EN);
  bouton(el, "Jouer ce défi").click();
  assert.equal(parClasse(el, "erreur").length, 1);

  ecrire("fr", ` ${FR}`);
  bouton(el, "Jouer ce défi").click();

  assert.equal(parClasse(el, "erreur").length, 0);
  assert.deepEqual(appels, [["jouerSeul", { fr: ` ${FR}`, en: EN }]]);
});

test("« Retour à l’accueil » mène à l'accueil", () => {
  const { el, appels } = ouvrir();

  bouton(el, "Retour à l’accueil").click();

  assert.deepEqual(appels, [["accueil"]]);
});

test("des balises dans un champ restent du texte : rien n'est inséré comme code", () => {
  const { el, appels, ecrire } = ouvrir();
  ecrire("fr", "<img src=x onerror=alert(1)>");
  ecrire("en", "<b>bold</b>");

  bouton(el, "Jouer ce défi").click();

  assert.deepEqual(appels, [["jouerSeul", { fr: "<img src=x onerror=alert(1)>", en: "<b>bold</b>" }]]);
  assert.equal(parClasse(el, "erreur").length, 0);
  assert.equal(trouver(el, (e) => ["IMG", "B"].includes(e.tagName)), null);
});
