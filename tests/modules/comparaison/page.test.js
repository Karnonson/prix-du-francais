import { test } from "node:test";
import assert from "node:assert/strict";
import { monterPage, attendre, saisir, espaces, coupeRecent } from "../../aide/page.js";

const EN = "Hello world";
const FR = "Bonjour le monde";

async function pageAvec(en, fr, options) {
  const page = await monterPage(options);
  await saisir(page, "en", en);
  await saisir(page, "fr", fr);
  await attendre(150);
  return page;
}

test("au départ : l'exemple « skill » est chargé dans les deux cases, en français", async () => {
  const page = await monterPage();

  assert.equal(page.document.title, "", "le module ne touche plus au titre de l'onglet (Tokenette, posé par la page elle-même)");
  assert.equal(page.document.documentElement.lang, "fr");
  assert.match(page.el("text-en").value, /^You are helping decide \*what\* to build/);
  assert.match(page.el("text-fr").value, /^Tu aides à décider \*quoi\* construire/);
  const boutons = page.el("template-row").children;
  assert.deepEqual(boutons.map((b) => b.id), ["template-daily", "template-prompt", "template-skill"]);
  assert.deepEqual(boutons.map((b) => b.getAttribute("aria-pressed")), ["false", "false", "true"]);
  assert.equal(page.el("templates-label").textContent, "Essaie un exemple, ou écris le tien plus bas");
});

test("les découpeurs chargés : les jetons de chaque case, le nombre de caractères, le verdict", async () => {
  const page = await pageAvec(EN, FR);

  assert.equal(page.el("count-en").textContent, "2");
  assert.equal(page.el("count-fr").textContent, "3");
  assert.equal(page.el("chars-en").textContent, "· 11 caractères");
  assert.equal(page.el("chars-fr").textContent, "· 16 caractères");
  assert.match(espaces(page.el("big").textContent), /^\+50 %$/);
  assert.equal(page.el("big").className, "big num more");
  assert.match(espaces(page.el("verdict-text").textContent), /^En français, ce texte coûte 50 % de jetons en plus\.$/);
  assert.equal(espaces(page.el("verdict-scale").textContent), "Pour 1 000 jetons en anglais, compte environ 1 500 en français.");
});

test("avant le chargement des découpeurs : « – », un message d'attente, pas de verdict", async () => {
  const page = await monterPage({ attente: true });

  assert.equal(page.el("count-en").textContent, "–");
  assert.equal(page.el("chips-en").textContent, "Chargement du compteur (environ 3 Mo, une seule fois)…");
  assert.equal(page.el("chips-en").className, "chips loading");
  assert.equal(page.el("big").textContent, "–");
  assert.equal(page.el("verdict-text").textContent, "");

  await page.liberer();

  assert.notEqual(page.el("count-en").textContent, "–");
  assert.equal(page.el("chips-en").className, "chips");
});

test("aucun découpeur ne se charge : le message d'échec dans les deux cases", async () => {
  const page = await monterPage({ echouer: ["o200k_base.js", "cl100k_base.js"] });

  for (const langue of ["en", "fr"]) {
    assert.equal(page.el(`chips-${langue}`).textContent, "Le compteur n’a pas pu se charger. Vérifie ta connexion, puis recharge la page.");
    assert.equal(page.el(`chips-${langue}`).className, "chips loading");
  }
});

test("un seul découpeur manque (« Plus ancien ») : la page compte, avec une seule paire de barres", async () => {
  const complet = await pageAvec(EN, FR);
  const partiel = await pageAvec(EN, FR, { echouer: ["cl100k_base.js"] });

  assert.equal(complet.el("bars").children.length, 2);
  assert.equal(partiel.el("bars").children.length, 1);
  assert.equal(partiel.el("count-fr").textContent, "3");
});

test("les blocs de jetons : une couleur sur deux, les espaces en « · », les retours en « ↵ » suivis d'un saut de ligne", async () => {
  const page = await pageAvec("Hello world\nbye", FR);

  const chips = page.el("chips-en").children.filter((e) => e.tagName === "SPAN");
  assert.deepEqual(chips.map((c) => c.textContent), ["Hello", "·world", "↵bye"]);
  assert.deepEqual(chips.map((c) => c.className), ["chip", "chip alt", "chip"]);
  assert.equal(page.el("chips-en").children.filter((e) => e.tagName === "BR").length, 1);
});

test("un caractère coupé en deux jetons : un seul bloc, avec le nombre de jetons en indice", async () => {
  const page = await pageAvec("é", FR);

  const [bloc] = page.el("chips-en").children;
  assert.equal(page.el("count-en").textContent, "2");
  assert.equal(bloc.textContent, "é2");
  assert.equal(bloc.children[0].tagName, "SUB");
  assert.equal(bloc.children[0].title, "plusieurs jetons pour un seul caractère");
});

test("au-delà de 700 jetons, les blocs s'arrêtent et la fin est résumée", async () => {
  const page = await pageAvec(Array(800).fill("a").join(" "), FR);

  assert.equal(coupeRecent(page.el("text-en").value).length, 800);
  assert.equal(page.el("count-en").textContent, "800");
  assert.equal(page.el("chips-en").children.filter((e) => ["chip", "chip alt"].includes(e.className)).length, 700);
  assert.equal(page.el("chips-en").children.at(-1).className, "chips-more");
  assert.equal(page.el("chips-en").children.at(-1).textContent, " … et 100 jetons de plus");
});

test("une case vide : son message, et pas de verdict", async () => {
  const page = await pageAvec("", FR);

  assert.equal(page.el("count-en").textContent, "0");
  assert.equal(page.el("chips-en").textContent, "Écris quelque chose au-dessus.");
  assert.equal(page.el("chips-en").className, "chips loading");
  assert.equal(page.el("big").textContent, "–");
  assert.equal(page.el("verdict-text").textContent, "Écris dans les deux cases pour comparer.");
  assert.equal(page.el("verdict-scale").textContent, "");
});

test("le français coûte moins : « − » et « en moins » ; autant : « ±0 % »", async () => {
  const moins = await pageAvec("Hello there my friend", "Salut");
  const autant = await pageAvec("Hello world", "Bonjour monde");

  assert.match(espaces(moins.el("big").textContent), /^−75 %$/);
  assert.equal(moins.el("big").className, "big num less");
  assert.match(espaces(moins.el("verdict-text").textContent), /en moins\.$/);
  assert.equal(espaces(autant.el("big").textContent), "±0 %");
  assert.equal(autant.el("big").className, "big num");
  assert.equal(autant.el("verdict-text").textContent, "Les deux langues coûtent autant de jetons ici.");
});

test("écrire dans une case : le calcul attend un instant, et aucun exemple ne reste choisi", async () => {
  const page = await monterPage();
  await saisir(page, "en", EN);

  assert.notEqual(page.el("count-en").textContent, "2");
  assert.ok(page.el("template-row").children.every((b) => b.getAttribute("aria-pressed") === "false"));
  await attendre(150);
  assert.equal(page.el("count-en").textContent, "2");
});

test("choisir un exemple : ses deux phrases remplacent les cases, et il est le seul choisi", async () => {
  const page = await pageAvec(EN, FR);

  page.el("template-row").children.find((b) => b.id === "template-daily").click();

  assert.equal(page.el("text-en").value, "Can you remind me to call the dentist tomorrow morning before work?");
  assert.equal(page.el("text-fr").value, "Tu peux me rappeler d’appeler le dentiste demain matin avant le travail ?");
  assert.deepEqual(
    page.el("template-row").children.map((b) => b.getAttribute("aria-pressed")),
    ["true", "false", "false"],
  );
  assert.equal(page.el("count-en").textContent, String(coupeRecent(page.el("text-en").value).length));
});

test("« Plus ancien » : le bouton est choisi et les jetons sont ceux de l'autre découpeur", async () => {
  const page = await pageAvec("Hello world", "Bonjour tout le monde");
  assert.match(espaces(page.el("big").textContent), /^\+100 %$/);

  page.el("tok-cl100k").click();

  assert.equal(page.el("tok-cl100k").getAttribute("aria-pressed"), "true");
  assert.equal(page.el("tok-o200k").getAttribute("aria-pressed"), "false");
  assert.equal(page.el("count-en").textContent, "4");
  assert.equal(page.el("count-fr").textContent, "7");
  assert.match(espaces(page.el("big").textContent), /^\+75 %$/);
});

test("passer la page en anglais : titre, langue, textes, nombres et verdict", async () => {
  const page = await pageAvec(EN, FR);

  page.el("ui-en").click();

  assert.equal(page.document.title, "", "le module ne touche plus au titre de l'onglet, même en passant la page en anglais");
  assert.equal(page.document.documentElement.lang, "en");
  assert.equal(page.el("ui-en").getAttribute("aria-pressed"), "true");
  assert.equal(page.el("ui-fr").getAttribute("aria-pressed"), "false");
  assert.equal(page.el("templates-label").textContent, "Try an example, or write your own below");
  assert.equal(page.document.querySelector(".ui-lang").getAttribute("aria-label"), "Page language");
  assert.equal(page.el("chars-en").textContent, "· 11 characters");
  assert.equal(page.el("verdict-text").textContent, "In French, this text costs 50% more tokens.");
  assert.equal(page.el("verdict-scale").textContent, "For every 1,000 tokens in English, expect about 1,500 in French.");
});

test("les mesures sur textes longs : une ligne par découpeur, plus l'axe", async () => {
  const page = await monterPage();

  assert.equal(page.el("plot").children.length, 9);
});

function claudeAvec(sample) {
  return { use: async (nom) => (nom === "sample" ? sample : null) };
}

test("hors d'un hôte qui sait traduire, les boutons « Traduire » restent cachés", async () => {
  const sans = await monterPage();
  const refus = await monterPage({ claude: claudeAvec(null) });

  for (const page of [sans, refus]) {
    assert.equal(page.el("translate-en").hidden, true);
    assert.equal(page.el("translate-fr").hidden, true);
  }
});

test("traduire : la consigne et le texte partent, le résultat se pose, la note le dit", async () => {
  const appels = [];
  const sample = async (consigne, options) => {
    appels.push({ consigne, options });
    options.onText({ text: "Bonj" });
    return { text: "  Bonjour le monde  " };
  };
  const page = await pageAvec(EN, "", { claude: claudeAvec(sample) });
  assert.equal(page.el("translate-fr").hidden, false);
  assert.equal(page.el("translate-fr").textContent, "Traduire depuis l’anglais");

  page.el("translate-fr").click();
  await attendre(150);

  assert.equal(appels.length, 1);
  assert.match(appels[0].consigne, /^Translate the text inside <text> into natural French, using the informal "tu" register\. /);
  assert.ok(appels[0].consigne.endsWith("<text>\nHello world\n</text>"));
  assert.equal(appels[0].options.modelTier, "quick");
  assert.equal(page.el("text-fr").value, "Bonjour le monde");
  assert.equal(page.el("note-fr").textContent, "Traduit par Claude — corrige-le si tu le dirais autrement.");
  assert.equal(page.el("translate-fr").disabled, false);
  assert.equal(page.el("translate-fr").textContent, "Traduire depuis l’anglais");
  assert.equal(page.el("count-fr").textContent, "3");
});

test("traduire vers l'anglais : la consigne change, et pendant l'attente les boutons sont bloqués", async () => {
  let consigne;
  let finir;
  const sample = (c) => { consigne = c; return new Promise((resolve) => { finir = resolve; }); };
  const page = await pageAvec("", FR, { claude: claudeAvec(sample) });

  page.el("translate-en").click();
  await attendre(0);

  assert.equal(page.el("translate-en").textContent, "Traduction…");
  assert.equal(page.el("translate-en").disabled, true);
  assert.equal(page.el("translate-fr").disabled, true);
  finir({ text: "Hello world" });
  await attendre(0);
  assert.ok(consigne.startsWith("Translate the text inside <text> into natural English. "));
  assert.equal(page.el("text-en").value, "Hello world");
  assert.equal(page.el("translate-en").disabled, false);
});

test("traduire une case source vide : on y place le curseur, rien n'est demandé", async () => {
  let appels = 0;
  const page = await pageAvec("   ", FR, { claude: claudeAvec(async () => { appels += 1; return { text: "x" }; }) });

  page.el("translate-fr").click();
  await attendre(0);

  assert.equal(appels, 0);
  assert.equal(page.el("text-en").focus_, 1);
});

test("une traduction qui échoue : la note d'erreur ; refusée, les boutons disparaissent", async () => {
  const echec = (code) => claudeAvec(async () => { throw Object.assign(new Error("x"), { code }); });

  const refusee = await pageAvec(EN, "", { claude: echec("not_granted") });
  refusee.el("translate-fr").click();
  await attendre(10);
  assert.equal(refusee.el("note-fr").textContent, "Traduction refusée. Tu peux écrire la version toi-même.");
  assert.ok(refusee.el("note-fr").classList.contains("error"));
  assert.equal(refusee.el("translate-en").hidden, true);
  assert.equal(refusee.el("translate-fr").hidden, true);

  const limitee = await pageAvec(EN, "", { claude: echec("rate_limited") });
  limitee.el("translate-fr").click();
  await attendre(10);
  assert.equal(limitee.el("note-fr").textContent, "Trop de traductions d’un coup. Réessaie dans une minute.");
  assert.equal(limitee.el("translate-fr").hidden, false);

  const autre = await pageAvec(EN, "", { claude: echec(undefined) });
  autre.el("translate-fr").click();
  await attendre(10);
  assert.equal(autre.el("note-fr").textContent, "La traduction n’a pas marché. Écris la version toi-même, ou réessaie plus tard.");
});
