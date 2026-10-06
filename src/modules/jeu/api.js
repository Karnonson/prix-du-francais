// Le point d'entrée du jeu. Il ne touche à rien d'autre que l'élément qu'on lui donne, et s'importe sans
// navigateur : le DOM n'est touché qu'à l'appel de monter().
// Chaque écran est un fichier ui/<nom>.js qui exporte montrer(contexte), chargé à la demande :
// un écran de plus ne demande aucune retouche ici.
const chargerEcran = (nom) => import(`./ui/${nom}.js`);

export function monter(el, compteur, ecrans = chargerEcran, stockage) {
  let demande = 0;

  function montrer(nom, donnees) {
    const cette = ++demande;
    return ecrans(nom)
      .then((ecran) => {
        if (cette !== demande) return;
        el.textContent = "";
        ecran.montrer({ ...contexte, donnees });
      })
      .catch(() => {
        // Un écran qui ne se charge pas (page publiée seule, fichier absent) laisse l'emplacement vide.
        if (cette === demande) el.textContent = "";
      });
  }

  const contexte = {
    el,
    compteur,
    stockage,
    montrer,
    accueil: () => montrer("jeu", { vue: "accueil" }),
    demarrerPartie: () => montrer("jeu", { vue: "partie" }),
    jouerSeul: (defi) => montrer("jeu", { vue: "seul", defi }),
    composer: () => montrer("composer"),
  };

  contexte.accueil();
}
