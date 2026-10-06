// L'écran final (SC3) : le score, comment il s'est formé, des confettis, et « Rejouer ».
import { calculerScore } from "../score.js";
import { DEFIS } from "../partie.js";
import { enregistrerPartie } from "../progression.js";
import { chargerStyle, emoji, h } from "./dom.js";

const STYLE = new URL("./fin.css", import.meta.url);

const points = (n) => (n > 1 ? `${n} points` : `${n} point`);
const bonnesReponses = (n) => (n > 1 ? `${n} bonnes réponses` : `${n} bonne réponse`);

// Moins de mouvement demandé : pas de confettis, le score est déjà tout entier à l'écran.
const moinsDeMouvement = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function confettis() {
  const bandes = Array.from({ length: 10 }, (_, i) => h("i", { style: `--x: ${5 + i * 10}%; --d: -${((i * 7) % 22) / 10 + 0.1}s` }));
  return h("div", { class: "confettis", "aria-hidden": "true" }, bandes);
}

const ligne = (signe, libelle, valeur, classe = "ligne-score") =>
  h("div", { class: classe }, h("span", {}, emoji(signe), ` ${libelle}`), h("span", { class: "num" }, points(valeur)));

export function montrer(contexte) {
  chargerStyle(STYLE);
  const score = calculerScore(contexte.donnees.partie.reponses());
  const vus = contexte.donnees.partie.tousLesDefis().map((d) => DEFIS.indexOf(d)).filter((i) => i !== -1);
  enregistrerPartie(contexte.stockage, { score: score.total, vus });
  const gagne = score.total > 0;
  const fete = gagne && !moinsDeMouvement();
  let relance = false;

  const rejouer = () => {
    if (relance) return;
    relance = true;
    contexte.demarrerPartie();
  };

  contexte.el.append(h("div", { class: "pile", "aria-live": "polite" },
    fete && confettis(),
    h("h2", { class: "titre" }, emoji(gagne ? "🎉" : "🙃"), gagne ? " Et voilà, c’est fini" : " C’est fini"),
    h("p", { class: "grand num" }, points(score.total)),
    h("p", { class: "chapo" }, `${bonnesReponses(score.bonnes)} sur ${score.sur}. ${gagne ? "Joli." : "Ça arrive : rejoue pour te rattraper."}`),
    h("div", { class: "carte" },
      ligne("✅", "Bonnes réponses", score.pointsBonnes),
      ligne("⚡", "Bonus de rapidité", score.pointsBonus),
      ligne("🏆", "Total", score.total, "ligne-score total")),
    h("div", { class: "rangee" },
      h("button", { type: "button", class: "bouton", onclick: rejouer }, emoji("🔁"), " Rejouer"),
      h("button", { type: "button", class: "bouton secondaire", onclick: () => contexte.accueil() }, emoji("🏠"), " Retour à l’accueil"))));
}
