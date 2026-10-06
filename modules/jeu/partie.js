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
  { fr: "Peux-tu m’envoyer l’adresse exacte du restaurant pour ce soir ?", en: "Can you send me the restaurant’s exact address for tonight?" },
  { fr: "J’aimerais déplacer mon rendez-vous chez le dentiste à la semaine prochaine.", en: "I’d like to move my dentist appointment to next week." },
  { fr: "Le café du coin ferme à quelle heure le dimanche ?", en: "What time does the corner café close on Sundays?" },
  { fr: "Nous avons raté le dernier train, il va falloir dormir ici.", en: "We missed the last train, we’ll have to sleep here." },
  { fr: "Est-ce que tu peux garder mon chat pendant les vacances ?", en: "Can you look after my cat during the holidays?" },
  { fr: "Ce clavier ne fonctionne plus, je dois en racheter un.", en: "This keyboard doesn’t work anymore, I need to buy a new one." },
  { fr: "On se retrouve directement devant le cinéma, ou chez toi d’abord ?", en: "Shall we meet directly at the cinema, or at your place first?" },
  { fr: "J’ai besoin d’un conseil pour choisir entre ces deux appartements.", en: "I need advice choosing between these two apartments." },
  { fr: "Le médecin m’a conseillé de me reposer encore quelques jours.", en: "The doctor advised me to rest for a few more days." },
  { fr: "Pourrais-tu relire ce message avant que je l’envoie ?", en: "Could you proofread this message before I send it?" },
  // Ajoutés après les 20 premiers, jamais intercalés : la progression gardée désigne les défis par leur position.
  { fr: "Il ne faut pas pousser mémé dans les orties.", en: "Don’t push your luck." },
  { fr: "Une licorne a garé sa trottinette devant ma porte.", en: "A unicorn parked its scooter in front of my door." },
  { fr: "Anticonstitutionnellement, mon chat dort.", en: "My cat sleeps in a very unconstitutional way." },
  { fr: "Quelle idée saugrenue !", en: "What a ridiculous idea!" },
  { fr: "J’ai rendez-vous avec mon ostéopathe.", en: "I have an appointment with my osteopath." },
  { fr: "Il est tombé amoureux d’un réfrigérateur.", en: "He fell in love with a fridge." },
  { fr: "Ça coûte les yeux de la tête.", en: "It costs an arm and a leg." },
  { fr: "Bof.", en: "Meh, not really." },
  { fr: "Mon perroquet parle mieux anglais que moi.", en: "My parrot speaks better English than I do." },
  { fr: "Je mange un croissant au lit, sans aucune honte.", en: "I’m eating a croissant in bed, with no shame at all." },
];

// Mélange la liste (Fisher-Yates) puis garde les n premiers : des défis différents, dans un ordre au hasard.
// `vus` (des index dans `defis`) passe en dernier dans le tirage : une fois tous vus, on retire sur tous (D2).
export function tirerDefis(hasard = Math.random, n = NB_DEFIS, defis = DEFIS, vus = []) {
  const indices = defis.map((_, i) => i);
  const nonVus = indices.filter((i) => !vus.includes(i));
  const bassin = nonVus.length >= n ? nonVus : indices;
  const melange = [...bassin];
  for (let i = melange.length - 1; i > 0; i -= 1) {
    const j = Math.floor(hasard() * (i + 1));
    [melange[i], melange[j]] = [melange[j], melange[i]];
  }
  return melange.slice(0, n).map((i) => defis[i]);
}

// `maintenant` rend l'heure en millisecondes ; on le donne pour piloter l'horloge dans les tests.
export function creerPartie({ defis = tirerDefis(), maintenant = () => performance.now() } = {}) {
  let position = 0;
  let debut = maintenant();
  const reponses = [];
  return {
    numero: () => position + 1,
    total: () => defis.length,
    defiCourant: () => defis[position],
    tousLesDefis: () => [...defis],
    // Une réponse par défi : toucher deux fois la même phrase ne compte qu'une fois.
    repondre(reponse) {
      if (reponses.length > position) return false;
      // La rapidité va de l'affichage du défi au choix, en secondes. On compare des heures, pas des
      // minuteurs : un onglet laissé en arrière-plan garde le temps qui passe.
      reponses.push({ ...reponse, secondes: (maintenant() - debut) / 1000 });
      return true;
    },
    reponses: () => [...reponses],
    // Passe au défi suivant ; faux quand c'était le dernier.
    suivant() {
      if (position + 1 >= defis.length) return false;
      position += 1;
      debut = maintenant();
      return true;
    },
  };
}
