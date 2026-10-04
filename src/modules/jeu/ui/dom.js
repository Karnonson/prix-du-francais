// Les petits outils des écrans : construire un élément, un emoji décoratif, charger une feuille de style.
// Tout texte est inséré comme texte (append d'une chaîne), jamais comme code (règle M2).

export function h(nom, proprietes = {}, ...enfants) {
  const el = document.createElement(nom);
  for (const [cle, valeur] of Object.entries(proprietes)) {
    if (valeur === false || valeur == null) continue;
    if (cle.startsWith("on")) el.addEventListener(cle.slice(2), valeur);
    else el.setAttribute(cle, valeur === true ? "" : valeur);
  }
  el.append(...enfants.flat().filter((enfant) => enfant !== false && enfant != null));
  return el;
}

export const emoji = (signe, proprietes = {}) => h("span", { class: "emoji", "aria-hidden": "true", ...proprietes }, signe);

// Une feuille de style par écran, ajoutée une seule fois par document.
const chargees = new WeakMap();
export function chargerStyle(url) {
  const deja = chargees.get(document) ?? new Set();
  chargees.set(document, deja);
  if (deja.has(url.href)) return;
  deja.add(url.href);
  document.head.append(h("link", { rel: "stylesheet", href: url.href }));
}
