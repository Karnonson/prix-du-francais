// L'écran composer (SC4) : écrire les deux phrases d'un défi, refuser celles qui sont vides ou trop longues.
// Ce que la personne écrit n'est jamais inséré comme code : seul le texte des champs est lu.
import { MAX_CARACTERES, caracteresVus, verifier } from "../saisie.js";
import { chargerStyle, emoji, h } from "./dom.js";

const STYLE = new URL("./composer.css", import.meta.url);

const CHAMPS = [
  { code: "fr", sigle: "FR", etiquette: "Ta phrase en français", nom: "en français" },
  { code: "en", sigle: "EN", etiquette: "Ta phrase en anglais", nom: "en anglais" },
];

const caracteres = (n) => (n > 1 ? `${n} caractères` : `${n} caractère`);

export function montrer(contexte) {
  chargerStyle(STYLE);
  const zones = {};
  const champs = {};
  const comptes = {};

  const compte = (code) => `${caracteresVus(champs[code].value ?? "")} / ${MAX_CARACTERES} caractères`;

  const blocs = CHAMPS.map(({ code, sigle, etiquette }) => {
    champs[code] = h("textarea", { id: `champ-${code}`, "data-lang": code, spellcheck: "false", "aria-describedby": `note-${code}`, oninput: () => { comptes[code].textContent = compte(code); } });
    comptes[code] = h("p", { class: "note num", id: `note-${code}` }, `0 / ${MAX_CARACTERES} caractères`);
    zones[code] = h("div", {});
    return h("div", { class: "champ", "data-lang": code },
      h("label", { for: `champ-${code}` }, h("span", { class: "langue" }, sigle), ` ${etiquette}`),
      champs[code], comptes[code], zones[code]);
  });

  function jouer() {
    const lu = { fr: champs.fr.value ?? "", en: champs.en.value ?? "" };
    const resultat = verifier(lu);
    for (const { code } of CHAMPS) {
      zones[code].textContent = "";
      champs[code].setAttribute("aria-invalid", "false");
      champs[code].setAttribute("aria-describedby", `note-${code}`);
    }
    if (resultat.ok) return contexte.jouerSeul(resultat.defi);
    for (const erreur of resultat.erreurs) {
      const { code, nom, etiquette } = CHAMPS.find((c) => c.code === erreur.champ);
      const message = erreur.type === "vide"
        ? ["✋", `Tu n’as pas écrit la phrase ${nom}.`]
        : ["✂️", `${etiquette} dépasse la limite de ${caracteres(erreur.depasse)}. Coupe un peu.`];
      zones[code].append(h("p", { class: "note erreur", id: `erreur-${code}`, role: "alert" }, emoji(message[0]), ` ${message[1]}`));
      champs[code].setAttribute("aria-invalid", "true");
      champs[code].setAttribute("aria-describedby", `note-${code} erreur-${code}`);
    }
  }

  contexte.el.append(h("div", { class: "pile" },
    h("h2", { class: "titre" }, emoji("✍️"), " Composer mon défi"),
    h("p", { class: "chapo" }, "Tu écris la même phrase en français, puis en anglais. Tokenette ne traduit rien à ta place et ne garde rien."),
    h("div", { class: "pile" }, blocs),
    h("div", { class: "rangee" },
      h("button", { type: "button", class: "bouton", onclick: jouer }, emoji("🎮"), " Jouer ce défi"),
      h("button", { type: "button", class: "bouton secondaire", onclick: () => contexte.accueil() }, emoji("🏠"), " Retour à l’accueil"))));
}
