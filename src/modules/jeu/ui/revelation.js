// L'écran de révélation (SC2) : les vrais nombres de jetons, la découpe en blocs colorés, deux barres.
import { juger } from "../jugement.js";
import { chargerStyle, emoji, h } from "./dom.js";

const STYLE = new URL("./revelation.css", import.meta.url);

const LANGUES = [
  { code: "fr", sigle: "FR", nom: "Français", en_langue: "en français", choisie: "le français" },
  { code: "en", sigle: "EN", nom: "Anglais", en_langue: "en anglais", choisie: "l’anglais" },
];

const jetons = (n) => (n > 1 ? `${n} jetons` : `${n} jeton`);

function verdict({ fr, en, gagnant, correct }, choix) {
  if (gagnant === "egalite") return ["🤝", `Match nul : ${jetons(fr.nombre)} chacune. Ce défi ne compte pas.`];
  if (correct) return ["🎯", `Dans le mille : ${jetons(fr.nombre)} en français, ${en.nombre} en anglais.`];
  const [chere, moins] = gagnant === "fr" ? [LANGUES[0], LANGUES[1]] : [LANGUES[1], LANGUES[0]];
  const nombres = { fr: fr.nombre, en: en.nombre };
  const choisie = LANGUES.find((l) => l.code === choix).choisie;
  return ["🤔", `Aïe, raté : ${jetons(nombres[chere.code])} ${chere.en_langue}, seulement ${nombres[moins.code]} ${moins.en_langue}. Tu avais choisi ${choisie}.`];
}

function carte(langue, resultat, choix, maximum) {
  const { nombre, blocs } = resultat[langue.code];
  const part = Math.round((nombre / maximum) * 100);
  return h("div", { class: "carte", "data-lang": langue.code },
    h("div", { class: "rangee" },
      h("span", { class: "langue" }, langue.sigle), h("strong", {}, langue.nom),
      langue.code === choix && h("span", { class: "etiquette" }, emoji("👉"), " Ton choix")),
    h("div", { class: "compte" }, h("span", { class: "nombre num" }, String(nombre)), h("span", {}, nombre > 1 ? "jetons" : "jeton")),
    h("div", { class: "jetons" }, blocs.map((bloc, i) => h("span", { class: i % 2 ? "pastille alt" : "pastille" }, bloc.texte))),
    h("div", { class: "barre" },
      h("span", { class: "code" }, langue.sigle),
      h("span", { class: "piste" }, h("span", { class: "remplissage", style: `--part: ${part}%` })),
      h("span", { class: "valeur num" }, jetons(nombre))));
}

export function montrer(contexte) {
  chargerStyle(STYLE);
  const { partie, choix } = contexte.donnees;
  // Sans partie, c'est un défi composé : on le révèle sans rien compter.
  const defi = partie ? partie.defiCourant() : contexte.donnees.defi;
  const resultat = juger(defi, choix, contexte.compteur);
  partie?.repondre({ choix, gagnant: resultat.gagnant, correct: resultat.correct });

  const maximum = Math.max(resultat.fr.nombre, resultat.en.nombre, 1);
  const [signe, message] = verdict(resultat, choix);
  const dernier = partie && partie.numero() === partie.total();
  const suite = !partie
    ? [
      h("p", {}, "Ce défi est le tien. Il ne compte pas dans une partie."),
      h("div", { class: "rangee" },
        h("button", { type: "button", class: "bouton", onclick: () => contexte.composer() }, emoji("✍️"), " Composer un autre défi"),
        h("button", { type: "button", class: "bouton secondaire", onclick: () => contexte.accueil() }, emoji("🏠"), " Retour à l’accueil")),
    ]
    : h("div", { class: "rangee" }, dernier
      ? h("button", { type: "button", class: "bouton", onclick: () => contexte.montrer("fin", { partie }) }, emoji("🏁"), " Voir mon score")
      : h("button", {
        type: "button",
        class: "bouton",
        onclick: () => { partie.suivant(); contexte.montrer("jeu", { vue: "partie", partie }); },
      }, emoji("➡️"), " Défi suivant"));

  contexte.el.append(h("div", { class: "pile", "aria-live": "polite" },
    h("p", { class: "etiquette" }, partie ? `Défi ${partie.numero()} sur ${partie.total()}` : "Ton défi"),
    h("div", { class: "duo" }, LANGUES.map((langue) => carte(langue, resultat, choix, maximum))),
    h("div", { class: "carte bande" },
      h("p", {}, h("strong", {}, emoji(signe), ` ${message}`)),
      suite)));
}
