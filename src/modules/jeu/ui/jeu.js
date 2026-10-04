// L'écran du jeu : l'accueil (SC1) et les défis d'une partie (SC2, le choix).
import { creerPartie } from "../partie.js";
import { chargerStyle, emoji, h } from "./dom.js";

const STYLE = new URL("./jeu.css", import.meta.url);

const CARTES = [
  ["🎯", "Tu choisis la phrase la plus chère."],
  ["🔍", "Tokenette compte les vrais jetons et te montre la découpe."],
  ["⚡", "Une bonne réponse te rapporte des points. Une réponse rapide t’en rapporte plus."],
];

const MESSAGE_COMPTEUR = "Le compteur de jetons ne répond pas. Tu ne peux pas jouer pour l’instant. Recharge la page quand ta connexion revient.";

function titre() {
  return h("h2", { class: "titre" }, emoji("🧮"), " Token", h("span", { class: "mot-fr" }, "ette"));
}

function erreurCompteur(contexte) {
  const recharger = contexte.recharger ?? (() => location.reload());
  return h("div", { class: "pile" },
    titre(),
    h("div", { class: "alerte", role: "alert" },
      h("p", {}, emoji("📡"), ` ${MESSAGE_COMPTEUR}`),
      h("div", {}, h("button", { type: "button", class: "bouton secondaire", onclick: recharger }, emoji("🔄"), " Recharger"))));
}

// L'accueil se redessine quand le compteur change d'état : s'il échoue, le jeu ne démarre pas et on le dit.
function accueil(contexte) {
  const racine = h("div", { class: "pile" });
  let enAttente = false;

  const demarrer = () => {
    if (contexte.compteur.echec()) return dessiner();
    if (contexte.compteur.pret()) return contexte.demarrerPartie();
    enAttente = true;
    dessiner();
  };

  function dessiner() {
    if (contexte.compteur.echec()) {
      racine.textContent = "";
      racine.append(erreurCompteur(contexte));
      return;
    }
    if (contexte.compteur.pret() && enAttente) {
      enAttente = false;
      contexte.demarrerPartie();
      return;
    }
    racine.textContent = "";
    racine.append(pageAccueil(contexte, demarrer, enAttente));
  }

  contexte.compteur.surChangement(() => {
    // l'écran a pu changer entre-temps : on ne redessine que s'il est encore affiché
    if (Array.from(contexte.el.children).includes(racine)) dessiner();
  });
  dessiner();
  return racine;
}

function pageAccueil(contexte, demarrer, enAttente) {
  const flottants = ["🇫🇷", "🪙", "🧮", "🪙", "🇬🇧"].map((signe, i) => h("span", { style: `--d: -${i * 0.6}s` }, signe));
  return h("div", { class: "pile" },
    h("div", { class: "hero" },
      h("div", { class: "flottants", "aria-hidden": "true" }, flottants),
      titre(),
      h("p", { class: "chapo" }, "Tu lis une phrase en français et la même en anglais. Tu paries sur la plus chère en jetons. Tokenette compte, et tu vois qui gagne."),
      h("div", { class: "rangee" },
        h("button", { type: "button", class: "bouton grosbouton", "aria-busy": enAttente ? "true" : false, onclick: () => { if (!enAttente) demarrer(); } }, emoji("🎮"), " C’est parti"),
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

// Un défi composé se joue seul : hors partie, hors score.
function defiSeul(contexte, defi) {
  return phrasesAChoisir(defi, "Ton défi", (choix) => contexte.montrer("revelation", { defi, choix }));
}

export function montrer(contexte) {
  chargerStyle(STYLE);
  const { vue, partie, defi } = contexte.donnees ?? { vue: "accueil" };
  const contenu = vue === "partie" ? defiDeLaPartie(contexte, partie ?? creerPartie())
    : vue === "seul" ? defiSeul(contexte, defi)
    : accueil(contexte);
  contexte.el.append(contenu);
}
