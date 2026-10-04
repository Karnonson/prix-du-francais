// Le score : 10 points par bonne réponse, plus 5 points de bonus si elle est venue en 15 secondes ou moins.
// Une réponse fausse ou une égalité ne rapporte rien.
export const POINTS_BONNE_REPONSE = 10;
export const POINTS_BONUS = 5;
export const DELAI_BONUS_SECONDES = 15;

export function calculerScore(reponses) {
  const bonnes = reponses.filter((r) => r.correct === true);
  const rapides = bonnes.filter((r) => r.secondes <= DELAI_BONUS_SECONDES);
  const pointsBonnes = bonnes.length * POINTS_BONNE_REPONSE;
  const pointsBonus = rapides.length * POINTS_BONUS;
  return { bonnes: bonnes.length, sur: reponses.length, pointsBonnes, pointsBonus, total: pointsBonnes + pointsBonus };
}
