// L'écran du jeu : l'accueil (SC1) et les défis d'une partie (SC2, le choix).
import { creerPartie } from "../partie.js";
import { chargerStyle, emoji, h } from "./dom.js";

const STYLE = new URL("./jeu.css", import.meta.url);

const CARTES = [
  ["🎯", "Tu choisis la phrase la plus chère."],
  ["🔍", "Tokenette compte les vrais jetons et te montre la découpe."],
  ["⚡", "Une bonne réponse te rapporte des points. Une réponse rapide t’en rapporte plus."],
];

function accueil(contexte) {
  const flottants = ["🇫🇷", "🪙", "🧮", "🪙", "🇬🇧"].map((signe, i) => h("span", { style: `--d: -${i * 0.6}s` }, signe));
  return h("div", { class: "pile" },
    h("div", { class: "hero" },
      h("div", { class: "flottants", "aria-hidden": "true" }, flottants),
      h("h2", { class: "titre" }, emoji("🧮"), " Token", h("span", { class: "mot-fr" }, "ette")),
      h("p", { class: "chapo" }, "Tu lis une phrase en français et la même en anglais. Tu paries sur la plus chère en jetons. Tokenette compte, et tu vois qui gagne."),
      h("div", { class: "rangee" },
        h("button", { type: "button", class: "bouton grosbouton", onclick: () => contexte.demarrerPartie() }, emoji("🎮"), " C’est parti"),
        h("button", { type: "button", class: "bouton secondaire", onclick: () => contexte.composer() }, emoji("✍️"), " Composer mon défi"))),
    h("div", { class: "trio" },
      CARTES.map(([signe, texte]) => h("div", { class: "carte" }, emoji(signe, { class: "grandemoji emoji" }), h("p", {}, texte)))));
}

const LANGUES = [
  { code: "fr", sigle: "FR", nom: "Français" },
  { code: "en", sigle: "EN", nom: "Anglais" },
];

export function phrasesAChoisir(defi, etiquette, surChoix) {
  return h("div", { class: "pile" },
    h("p", { class: "etiquette" }, etiquette),
    h("h2", { class: "titre" }, emoji("🪙"), " À ton avis, quelle phrase compte le plus de jetons ?"),
    h("div", { class: "duo" },
      LANGUES.map(({ code, sigle, nom }) =>
        h("button", { type: "button", class: "choix", "data-lang": code, onclick: () => surChoix(code) },
          h("span", { class: "rangee" }, h("span", { class: "langue" }, sigle), h("strong", {}, nom)),
          h("span", {}, defi[code])))));
}

function defiDeLaPartie(contexte, partie) {
  return phrasesAChoisir(partie.defiCourant(), `Défi ${partie.numero()} sur ${partie.total()}`, (choix) =>
    contexte.montrer("revelation", { partie, choix }));
}

export function montrer(contexte) {
  chargerStyle(STYLE);
  const { vue, partie } = contexte.donnees ?? { vue: "accueil" };
  const contenu = vue === "partie" ? defiDeLaPartie(contexte, partie ?? creerPartie()) : accueil(contexte);
  contexte.el.append(contenu);
}
