// Compare les deux phrases d'un défi avec le compteur et dit qui coûte le plus de jetons.
// gagnant : "fr", "en" ou "egalite" ; correct : vrai, faux, ou null à égalité (ni bon ni mauvais).
export function juger(defi, choix, compteur) {
  const fr = compteur.compter(defi.fr);
  const en = compteur.compter(defi.en);
  const gagnant = fr.nombre === en.nombre ? "egalite" : fr.nombre > en.nombre ? "fr" : "en";
  const correct = gagnant === "egalite" ? null : gagnant === choix;
  return { fr, en, gagnant, correct };
}
