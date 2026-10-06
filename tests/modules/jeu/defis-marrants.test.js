import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFIS, tirerDefis } from "../../../src/modules/jeu/partie.js";

// Les 20 défis d'avant cette version, à leur place : la progression gardée les désigne par leur position.
const ANCIENS_FR = [
  "Tu peux me rappeler d’appeler le dentiste demain matin avant le travail ?",
  "Merci pour ton aide",
  "Où est la gare la plus proche ?",
  "Je voudrais réserver une table pour quatre personnes ce soir.",
  "Peux-tu résumer ce document en trois phrases ?",
  "Il fait beau aujourd’hui, allons nous promener au bord de la rivière.",
  "J’ai oublié mon mot de passe, comment puis-je le changer ?",
  "Pourriez-vous m’envoyer la facture par e-mail avant vendredi ?",
  "Ce film était vraiment meilleur que ce que j’imaginais.",
  "Rendez-vous à neuf heures devant la bibliothèque.",
  "Peux-tu m’envoyer l’adresse exacte du restaurant pour ce soir ?",
  "J’aimerais déplacer mon rendez-vous chez le dentiste à la semaine prochaine.",
  "Le café du coin ferme à quelle heure le dimanche ?",
  "Nous avons raté le dernier train, il va falloir dormir ici.",
  "Est-ce que tu peux garder mon chat pendant les vacances ?",
  "Ce clavier ne fonctionne plus, je dois en racheter un.",
  "On se retrouve directement devant le cinéma, ou chez toi d’abord ?",
  "J’ai besoin d’un conseil pour choisir entre ces deux appartements.",
  "Le médecin m’a conseillé de me reposer encore quelques jours.",
  "Pourrais-tu relire ce message avant que je l’envoie ?",
];

// Les 10 nouveaux défis de contenu.md, mot pour mot et dans l'ordre (21 à 30).
const NOUVEAUX = [
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

// Les défis 22 à 25 : le français, plus cher en jetons (contenu.md), a moins de mots que l'anglais.
const PIEGES_DES_MOTS = [21, 22, 23, 24];

const mots = (phrase) => phrase.split(/\s+/).filter((m) => /\p{L}/u.test(m)).length;

test("plusieurs parties : les défis sont tirés parmi 30, dont les 10 nouveaux de contenu.md (au moins 4 pièges des mots), et les défis déjà joués gardés par le navigateur restent les mêmes", () => {
  assert.equal(DEFIS.length, 30);
  assert.deepEqual(DEFIS.slice(0, 20).map((d) => d.fr), ANCIENS_FR);
  assert.deepEqual(DEFIS.slice(20).map(({ fr, en }) => ({ fr, en })), NOUVEAUX);

  for (const i of PIEGES_DES_MOTS) {
    assert.ok(mots(DEFIS[i].fr) < mots(DEFIS[i].en), `défi ${i + 1} : le français devrait avoir moins de mots`);
  }

  // Une progression d'avant cette version a vu les 20 anciens : la partie suivante tire parmi les nouveaux.
  const vus = ANCIENS_FR.map((_, i) => i);
  const tires = tirerDefis(Math.random, 5, DEFIS, vus);
  assert.equal(tires.length, 5);
  assert.ok(tires.every((d) => DEFIS.indexOf(d) >= 20));

  // Sur plusieurs parties, chacun des 30 défis peut sortir.
  const sortis = new Set();
  for (let partie = 0; partie < 400; partie += 1) for (const d of tirerDefis()) sortis.add(DEFIS.indexOf(d));
  assert.equal(sortis.size, 30);
});
