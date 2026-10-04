import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { monter } from "../../../src/modules/jeu/api.js";
import { attendreQue, bouton, compteurParMots, installerFauxDocument, parClasse, retirerFauxDocument, trouver, trouverTous } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const choix = (el, langue) => trouver(el, (e) => e.tagName === "BUTTON" && e.getAttribute("data-lang") === langue);
const champ = (el, langue) => trouver(el, (e) => e.tagName === "TEXTAREA" && e.getAttribute("data-lang") === langue);

// Ouvre le jeu, compose un défi avec ces deux phrases et touche « Jouer ce défi ».
async function composer(fr, en, table) {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  monter(el, compteurParMots(table));
  await attendreQue(() => bouton(el, "Composer mon défi"));
  bouton(el, "Composer mon défi").click();
  await attendreQue(() => champ(el, "fr"));
  for (const [langue, texte] of [["fr", fr], ["en", en]]) {
    champ(el, langue).value = texte;
    champ(el, langue).dispatchEvent({ type: "input", target: champ(el, langue) });
  }
  bouton(el, "Jouer ce défi").click();
  return el;
}

test("un défi composé se joue comme les autres : « Ton défi », le choix, puis la révélation hors partie et hors score", async () => {
  const el = await composer("Tu peux me rappeler d’appeler le dentiste demain matin ?", "Can you remind me to call the dentist tomorrow morning?");

  await attendreQue(() => choix(el, "fr"));
  assert.match(el.textContent, /Ton défi/);
  assert.doesNotMatch(el.textContent, /sur 5/);
  assert.match(el.textContent, /À ton avis, quelle phrase compte le plus de jetons \?/);
  assert.match(choix(el, "fr").textContent, /Tu peux me rappeler d’appeler le dentiste demain matin \?/);
  assert.match(choix(el, "en").textContent, /Can you remind me to call the dentist tomorrow morning\?/);

  choix(el, "fr").click();
  await attendreQue(() => bouton(el, "Composer un autre"));

  assert.match(el.textContent, /Ton défi/);
  assert.match(el.textContent, /Ce défi est le tien\. Il ne compte pas dans une partie\./);
  assert.equal(parClasse(el, "pastille").length, 10 + 10);
  assert.equal(parClasse(el, "remplissage").length, 2);
  assert.ok(bouton(el, "Composer un autre"));
  assert.ok(bouton(el, "Retour à l’accueil"));
  assert.equal(bouton(el, "Défi suivant"), null);
  assert.equal(bouton(el, "Voir mon score"), null);
  assert.doesNotMatch(el.textContent, /sur 5|point/);
});

test("« Composer un autre défi » ramène au composer et « Retour à l’accueil » à l'accueil", async () => {
  const el = await composer("Merci beaucoup", "Thanks a lot");
  await attendreQue(() => choix(el, "fr"));
  choix(el, "fr").click();
  await attendreQue(() => bouton(el, "Composer un autre"));

  bouton(el, "Composer un autre").click();
  await attendreQue(() => champ(el, "fr"));
  assert.match(el.textContent, /Composer mon défi/);

  bouton(el, "Retour à l’accueil").click();
  await attendreQue(() => bouton(el, "C’est parti"));
});

test("« Retour à l’accueil » depuis la révélation mène à l'accueil", async () => {
  const el = await composer("Merci beaucoup", "Thanks a lot");
  await attendreQue(() => choix(el, "en"));
  choix(el, "en").click();
  await attendreQue(() => bouton(el, "Retour à l’accueil"));

  bouton(el, "Retour à l’accueil").click();

  await attendreQue(() => bouton(el, "C’est parti"));
});

test("la révélation d'un défi composé dit si le choix était bon", async () => {
  const el = await composer("un deux trois quatre", "un deux");
  await attendreQue(() => choix(el, "fr"));

  choix(el, "fr").click();
  await attendreQue(() => bouton(el, "Composer un autre"));
  assert.match(el.textContent, /Dans le mille : 4 jetons en français, 2 en anglais\./);
});

test("une phrase qui ressemble à du code s'affiche telle qu'écrite, dans le choix comme dans la révélation", async () => {
  const fr = "<img src=x onerror=alert(1)>";
  const en = "<b>gras</b> & <script>alert(2)</script>";
  const el = await composer(fr, en);

  await attendreQue(() => choix(el, "fr"));
  assert.ok(choix(el, "fr").textContent.includes(fr));
  assert.ok(choix(el, "en").textContent.includes(en));
  assert.equal(trouverTous(el, (e) => ["IMG", "B", "SCRIPT"].includes(e.tagName)).length, 0);

  choix(el, "en").click();
  await attendreQue(() => bouton(el, "Composer un autre"));
  assert.ok(el.textContent.includes("<img"));
  assert.ok(el.textContent.includes("<b>gras</b>"));
  assert.equal(trouverTous(el, (e) => ["IMG", "B", "SCRIPT"].includes(e.tagName)).length, 0);
});
