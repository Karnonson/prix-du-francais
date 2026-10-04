// Le compteur de jetons : toujours « Récent » (o200k), chargé depuis jsDelivr à la même adresse que la page.
// Il ne lit rien de la page, pas même son réglage « Plus ancien ».
const RECENT = {
  global: "GPTTokenizer_o200k_base",
  src: "https://cdn.jsdelivr.net/npm/gpt-tokenizer@2.9.0/dist/o200k_base.js",
};

// Le chargement par défaut : une balise <script> qui pose le découpeur en variable globale, comme la page.
// Le DOM n'est touché qu'à l'appel.
function chargerScript({ global, src }) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => (globalThis[global] ? resolve(globalThis[global]) : reject(new Error("découpeur absent")));
    script.onerror = () => reject(new Error("chargement impossible"));
    document.head.appendChild(script);
  });
}

// Un caractère coupé en plusieurs jetons se décode en "" jusqu'à son dernier octet : les morceaux vides
// se replient dans le suivant, et le bloc garde le vrai nombre de jetons.
function decouper(decoupeur, texte) {
  const ids = decoupeur.encode(texte);
  const blocs = [];
  let attente = 0;
  for (const id of ids) {
    const morceau = decoupeur.decode([id]);
    attente += 1;
    if (morceau === "") continue;
    blocs.push({ texte: morceau, n: attente });
    attente = 0;
  }
  if (attente) blocs.push({ texte: "", n: attente });
  return { nombre: ids.length, blocs };
}

export function creerCompteur({ charger = chargerScript } = {}) {
  let decoupeur = null;
  let echoue = false;
  const rappels = [];
  const prevenir = () => rappels.forEach((rappel) => rappel());

  new Promise((resolve) => resolve(charger(RECENT)))
    .then((charge) => { decoupeur = charge; })
    .catch(() => { echoue = true; })
    .then(prevenir);

  return {
    compter: (texte) => (decoupeur ? decouper(decoupeur, texte) : null),
    pret: () => decoupeur !== null,
    echec: () => echoue,
    surChangement: (rappel) => { rappels.push(rappel); },
  };
}
