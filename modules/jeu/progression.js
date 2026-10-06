// La progression (D1, D2, D3) : le meilleur score et les défis déjà vus, gardés dans le navigateur.
// Une valeur illisible dans le stockage est ignorée plutôt que de faire planter le jeu.
const CLE = "tokenette-progression";

function stockageParDefaut() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

const VIDE = { meilleurScore: 0, vus: [] };

export function lireProgression(stockage = stockageParDefaut()) {
  if (!stockage) return { ...VIDE };
  try {
    const brut = stockage.getItem(CLE);
    if (!brut) return { ...VIDE };
    const { meilleurScore, vus } = JSON.parse(brut);
    return {
      meilleurScore: Number.isFinite(meilleurScore) ? meilleurScore : 0,
      vus: Array.isArray(vus) ? vus.filter((n) => Number.isInteger(n)) : [],
    };
  } catch {
    return { ...VIDE };
  }
}

// Fusionne une partie finie dans la progression gardée : le plus haut score, les défis vus en plus.
export function enregistrerPartie(stockage = stockageParDefaut(), { score, vus }) {
  const actuelle = lireProgression(stockage);
  const fusion = { meilleurScore: Math.max(actuelle.meilleurScore, score), vus: [...new Set([...actuelle.vus, ...vus])] };
  if (stockage) {
    try {
      stockage.setItem(CLE, JSON.stringify(fusion));
    } catch {
      // Stockage plein ou refusé (navigation privée) : la progression ne tient que pour cette page.
    }
  }
  return fusion;
}

export function remettreAZero(stockage = stockageParDefaut()) {
  if (!stockage) return;
  try {
    stockage.removeItem(CLE);
  } catch {
    // rien à faire si le stockage refuse déjà d'écrire
  }
}
