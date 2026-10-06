import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { monter } from "../../../src/modules/jeu/api.js";
import { DEFIS, NB_DEFIS, tirerDefis } from "../../../src/modules/jeu/partie.js";
import { attendreQue, bouton, installerFauxDocument, retirerFauxDocument, trouver, trouverTous } from "../../aide/ecran.js";

afterEach(() => retirerFauxDocument());

const sourcesJeu = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "src", "modules", "jeu");

function lireSources(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const complet = join(dossier, nom);
    return statSync(complet).isDirectory() ? lireSources(complet) : [{ nom: complet, texte: readFileSync(complet, "utf8") }];
  });
}

async function ouvrirAccueil() {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  monter(el, { pret: () => true, echec: () => false, surChangement: () => {}, compter: () => null });
  await attendreQue(() => bouton(el, "C’est parti"));
  return { document, el };
}

test("l'accueil montre son titre, ses trois cartes, « C’est parti » et « Composer mon défi »", async () => {
  const { el } = await ouvrirAccueil();
  const texte = el.textContent;

  assert.match(texte, /Tokenette/);
  assert.match(texte, /Tu lis une phrase en français et la même en anglais\. Tu paries sur la plus chère en jetons\. Tokenette compte, et tu vois qui gagne\./);
  assert.match(texte, /Tu choisis la phrase la plus chère\./);
  assert.match(texte, /Tokenette compte les vrais jetons et te montre la découpe\./);
  assert.match(texte, /Une bonne réponse te rapporte des points\. Une réponse rapide t’en rapporte plus\./);
  assert.ok(bouton(el, "C’est parti"));
  assert.ok(bouton(el, "Composer mon défi"));
});

test("l'accueil charge son feuille de style par un <link> créé depuis le dossier de l'écran", async () => {
  const { document } = await ouvrirAccueil();

  const liens = document.head.children.filter((l) => l.tagName === "LINK");
  assert.equal(liens.length, 1);
  assert.match(liens[0].getAttribute("href"), /\/src\/modules\/jeu\/ui\/jeu\.css$/);
  assert.equal(liens[0].getAttribute("rel"), "stylesheet");
});

test("« C’est parti » montre le premier défi : deux phrases, une en français, une en anglais, et « Défi 1 sur 5 »", async () => {
  const { el } = await ouvrirAccueil();

  bouton(el, "C’est parti").click();
  await attendreQue(() => /Défi 1 sur 5/.test(el.textContent));

  const phrases = trouverTous(el, (e) => e.tagName === "BUTTON" && e.getAttribute("data-lang"));
  assert.deepEqual(phrases.map((p) => p.getAttribute("data-lang")), ["fr", "en"]);
  const defi = DEFIS.find((d) => phrases[0].textContent.includes(d.fr));
  assert.ok(defi, "la phrase française doit venir de la liste");
  assert.ok(phrases[1].textContent.includes(defi.en), "la phrase anglaise est celle du même défi");
  assert.match(el.textContent, /À ton avis, quelle phrase compte le plus de jetons \?/);
});

test("« Composer mon défi » mène à l'écran composer", async () => {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const appels = [];
  const { montrer } = await import("../../../src/modules/jeu/ui/jeu.js");

  montrer({ el, compteur: { pret: () => true, echec: () => false, surChangement: () => {} }, donnees: { vue: "accueil" }, composer: () => appels.push("composer"), demarrerPartie: () => appels.push("partie") });
  bouton(el, "Composer mon défi").click();

  assert.deepEqual(appels, ["composer"]);
});

test("une partie tire 5 défis différents, d'une liste écrite à la main d'au moins 5 défis", () => {
  assert.ok(DEFIS.length >= 5);
  for (const defi of DEFIS) {
    assert.equal(typeof defi.fr, "string");
    assert.equal(typeof defi.en, "string");
    assert.ok(defi.fr.trim() && defi.en.trim());
  }
  assert.equal(new Set(DEFIS.map((d) => d.fr)).size, DEFIS.length, "deux défis ont la même phrase française");

  const tires = tirerDefis();

  assert.equal(tires.length, 5);
  assert.equal(new Set(tires).size, 5);
  assert.ok(tires.every((d) => DEFIS.includes(d)));
});

test("l'ordre des défis est tiré au hasard à chaque partie", () => {
  const toujoursZero = tirerDefis(() => 0).map((d) => d.fr);
  const toujoursHaut = tirerDefis(() => 0.999).map((d) => d.fr);

  assert.notDeepEqual(toujoursZero, toujoursHaut);
  assert.equal(new Set(toujoursZero).size, 5);
  assert.equal(new Set(toujoursHaut).size, 5);
});

test("le tirage évite les défis déjà vus tant qu'il en reste d'autres (D2)", () => {
  const vus = DEFIS.map((_, i) => i).slice(0, DEFIS.length - 3);
  const tires = tirerDefis(Math.random, 3, DEFIS, vus);

  assert.equal(tires.length, 3);
  assert.ok(tires.every((d) => !vus.includes(DEFIS.indexOf(d))));
});

test("une fois tous les défis vus, le tirage recommence sur tous (D2)", () => {
  const tousVus = DEFIS.map((_, i) => i);
  const tires = tirerDefis(Math.random, 5, DEFIS, tousVus);

  assert.equal(tires.length, 5);
  assert.ok(tires.every((d) => DEFIS.includes(d)));
});

test("le nombre de défis d'une partie est une constante à un seul endroit", () => {
  assert.equal(NB_DEFIS, 5);
  assert.equal(tirerDefis().length, NB_DEFIS);

  const affectations = lireSources(sourcesJeu).filter((s) => /NB_DEFIS\s*=\s*\d/.test(s.texte));
  assert.equal(affectations.length, 1);
  assert.match(affectations[0].nom, /partie\.js$/);
});

test("toucher une phrase demande la révélation avec le choix fait", async () => {
  const document = installerFauxDocument();
  const el = document.createElement("section");
  const demandes = [];
  const reel = await import("../../../src/modules/jeu/ui/jeu.js");
  const contexte = {
    el,
    compteur: {},
    donnees: { vue: "partie" },
    montrer: (nom, donnees) => demandes.push({ nom, donnees }),
  };

  reel.montrer(contexte);
  trouver(el, (e) => e.tagName === "BUTTON" && e.getAttribute("data-lang") === "en").click();

  assert.equal(demandes.length, 1);
  assert.equal(demandes[0].nom, "revelation");
  assert.equal(demandes[0].donnees.choix, "en");
  assert.equal(demandes[0].donnees.partie.numero(), 1);
});
