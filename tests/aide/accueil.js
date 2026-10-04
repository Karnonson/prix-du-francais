// Lit index.html et README.md tels qu'écrits sur le disque, sans navigateur : de quoi vérifier ce qui
// est visible au premier chargement (l'accueil seul) et les trois titres qui doivent dire « Tokenette ».
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function lireIndex() {
  return readFileSync(join(racine, "index.html"), "utf8");
}

export function lireReadme() {
  return readFileSync(join(racine, "README.md"), "utf8");
}

// La balise ouvrante (jusqu'à son « > ») qui porte cet attribut, par exemple `data-state="jeu"` :
// assez pour savoir si elle-même porte aussi `hidden`, sans se faire piéger par un `hidden` plus loin.
export function baliseOuvrante(html, attribut) {
  const pos = html.indexOf(attribut);
  if (pos === -1) return null;
  const debut = html.lastIndexOf("<", pos);
  const fin = html.indexOf(">", pos);
  return html.slice(debut, fin + 1);
}

export function estCachee(html, attribut) {
  const balise = baliseOuvrante(html, attribut);
  return balise !== null && /\bhidden\b/.test(balise);
}

// Le texte entre l'état nommé et l'état suivant (ou la fin du corps, sans suivant) : assez pour
// vérifier ce qu'un état montre, sans lire les deux autres.
export function texteEtat(html, etat, etatSuivant) {
  const debut = html.indexOf(`data-state="${etat}"`);
  const fin = etatSuivant ? html.indexOf(`data-state="${etatSuivant}"`) : html.indexOf("<script");
  if (debut === -1) return "";
  return html.slice(debut, fin === -1 ? undefined : fin);
}

// Le premier titre Markdown (`# …`) du README.
export function premierTitreReadme(html) {
  const ligne = html.split("\n").find((l) => l.startsWith("# "));
  return ligne ? ligne.slice(2).trim() : "";
}
