import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, existsSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { creerFauxDocument } from "./aide/faux-dom.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// Un dépôt jetable : build.sh et index.html copiés, pour construire sans toucher au vrai dist/.
function depotJetable() {
  const dossier = mkdtempSync(join(tmpdir(), "assemblage-"));
  cpSync(join(racine, "build.sh"), join(dossier, "build.sh"));
  cpSync(join(racine, "index.html"), join(dossier, "index.html"));
  return dossier;
}

function ecrire(dossier, chemin, contenu) {
  const complet = join(dossier, chemin);
  mkdirSync(dirname(complet), { recursive: true });
  writeFileSync(complet, contenu);
}

function construire(dossier, env = {}) {
  const propre = { ...process.env };
  delete propre.NODE_TEST_CONTEXT;
  delete propre.SANS_TESTS;
  return spawnSync("sh", [join(dossier, "build.sh")], {
    cwd: dossier,
    env: { ...propre, ...env },
    encoding: "utf8",
  });
}

function fichiers(dossier) {
  const liste = [];
  for (const nom of readdirSync(dossier)) {
    const complet = join(dossier, nom);
    if (statSync(complet).isDirectory()) liste.push(...fichiers(complet));
    else liste.push(complet);
  }
  return liste;
}

test("chaque fichier de src/ est dans dist/ au même chemin, avec le même contenu", () => {
  const dossier = depotJetable();
  ecrire(dossier, "src/modules/x/y.js", "export const y = 1;\n");
  ecrire(dossier, "src/modules/x/ui/z.css", "p { color: red; }\n");

  const sortie = construire(dossier, { SANS_TESTS: "1" });

  assert.equal(sortie.status, 0, sortie.stderr);
  const sources = fichiers(join(dossier, "src"));
  assert.equal(sources.length, 2);
  for (const source of sources) {
    const copie = join(dossier, "dist", relative(join(dossier, "src"), source));
    assert.ok(existsSync(copie), `${copie} manque`);
    assert.equal(readFileSync(copie, "utf8"), readFileSync(source, "utf8"));
  }
});

test("sans src/, rien d'autre que index.html n'est copié dans dist/", () => {
  const dossier = depotJetable();

  const sortie = construire(dossier, { SANS_TESTS: "1" });

  assert.equal(sortie.status, 0, sortie.stderr);
  assert.deepEqual(readdirSync(join(dossier, "dist")), ["index.html"]);
});

test("./build.sh échoue quand un test échoue, SANS_TESTS=1 saute les tests", () => {
  const dossier = depotJetable();
  ecrire(dossier, "tests/faux.test.js", 'import { test } from "node:test";\nimport assert from "node:assert/strict";\ntest("rouge", () => assert.equal(1, 2));\n');

  const avecTests = construire(dossier);
  const sansTests = construire(dossier, { SANS_TESTS: "1" });

  assert.notEqual(avecTests.status, 0, "le build aurait dû échouer");
  assert.equal(sansTests.status, 0, sansTests.stderr);
});

test("./build.sh lance les tests et réussit quand ils passent", () => {
  const dossier = depotJetable();
  ecrire(dossier, "tests/vert.test.js", 'import { test } from "node:test";\ntest("vert", () => {});\n');

  const sortie = construire(dossier);

  assert.equal(sortie.status, 0, sortie.stdout + sortie.stderr);
  assert.match(sortie.stdout, /pass 1/);
});

test("le faux document crée un élément, y ajoute des enfants, lit son texte, pose un attribut et déclenche un clic", () => {
  const document = creerFauxDocument();
  const bouton = document.createElement("button");
  const mot = document.createElement("span");
  mot.textContent = "C'est parti";
  bouton.append(mot, document.createTextNode(" !"));
  bouton.setAttribute("aria-label", "Démarrer");
  let clics = 0;
  bouton.addEventListener("click", () => { clics += 1; });

  bouton.click();
  bouton.click();

  assert.equal(bouton.textContent, "C'est parti !");
  assert.equal(bouton.getAttribute("aria-label"), "Démarrer");
  assert.equal(clics, 2);
  assert.equal(bouton.children.length, 1);
});

test("le faux document ne lit pas les balises d'un texte comme du code", () => {
  const document = creerFauxDocument();
  const p = document.createElement("p");
  p.textContent = "<b>gras</b>";

  assert.equal(p.textContent, "<b>gras</b>");
  assert.equal(p.children.length, 0);
});
