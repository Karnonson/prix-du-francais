// Vérifie les deux phrases d'un défi composé, avant tout comptage de jetons : ni vide, ni plus de 280
// caractères vus. Un emoji composé, un drapeau ou une lettre accentuée en deux morceaux comptent pour un.
export const MAX_CARACTERES = 280;

const segmenteur = typeof Intl !== "undefined" && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

export function caracteresVus(texte) {
  if (!segmenteur) return Array.from(texte).length;
  let n = 0;
  for (const _ of segmenteur.segment(texte)) n += 1;
  return n;
}

function verifierChamp(champ, texte) {
  if (typeof texte !== "string" || texte.trim() === "") return { champ, type: "vide" };
  // Un texte de moins de 280 unités ne peut pas dépasser 280 caractères vus : pas besoin de le segmenter.
  if (texte.length <= MAX_CARACTERES) return null;
  const vus = caracteresVus(texte);
  return vus > MAX_CARACTERES ? { champ, type: "longue", depasse: vus - MAX_CARACTERES } : null;
}

export function verifier({ fr, en }) {
  const erreurs = [verifierChamp("fr", fr), verifierChamp("en", en)].filter(Boolean);
  return erreurs.length ? { ok: false, erreurs } : { ok: true, defi: { fr, en } };
}
