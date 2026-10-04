// Les règles d'une partie : la liste des défis, le tirage, et où en est la partie.

// Le nombre de défis d'une partie : un seul endroit à changer.
export const NB_DEFIS = 5;

// Écrits à la main : chaque défi est une phrase en français et la même en anglais.
export const DEFIS = [
  { fr: "Tu peux me rappeler d’appeler le dentiste demain matin avant le travail ?", en: "Can you remind me to call the dentist tomorrow morning before work?" },
  { fr: "Merci pour ton aide", en: "Thanks for your help" },
  { fr: "Où est la gare la plus proche ?", en: "Where is the nearest train station?" },
  { fr: "Je voudrais réserver une table pour quatre personnes ce soir.", en: "I would like to book a table for four people tonight." },
  { fr: "Peux-tu résumer ce document en trois phrases ?", en: "Can you summarise this document in three sentences?" },
  { fr: "Il fait beau aujourd’hui, allons nous promener au bord de la rivière.", en: "The weather is nice today, let’s go for a walk by the river." },
  { fr: "J’ai oublié mon mot de passe, comment puis-je le changer ?", en: "I forgot my password, how can I change it?" },
  { fr: "Pourriez-vous m’envoyer la facture par e-mail avant vendredi ?", en: "Could you email me the invoice before Friday?" },
  { fr: "Ce film était vraiment meilleur que ce que j’imaginais.", en: "This movie was really better than I imagined." },
  { fr: "Rendez-vous à neuf heures devant la bibliothèque.", en: "See you at nine o’clock in front of the library." },
];

// Mélange la liste (Fisher-Yates) puis garde les n premiers : des défis différents, dans un ordre au hasard.
export function tirerDefis(hasard = Math.random, n = NB_DEFIS, defis = DEFIS) {
  const melange = [...defis];
  for (let i = melange.length - 1; i > 0; i -= 1) {
    const j = Math.floor(hasard() * (i + 1));
    [melange[i], melange[j]] = [melange[j], melange[i]];
  }
  return melange.slice(0, n);
}

export function creerPartie({ defis = tirerDefis() } = {}) {
  let position = 0;
  const reponses = [];
  return {
    numero: () => position + 1,
    total: () => defis.length,
    defiCourant: () => defis[position],
    // Une réponse par défi : toucher deux fois la même phrase ne compte qu'une fois.
    repondre(reponse) {
      if (reponses.length > position) return false;
      reponses.push(reponse);
      return true;
    },
    reponses: () => [...reponses],
    // Passe au défi suivant ; faux quand c'était le dernier.
    suivant() {
      if (position + 1 >= defis.length) return false;
      position += 1;
      return true;
    },
  };
}
