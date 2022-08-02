const initialState = {listesJoueurs: { avecNoms: [], sansNoms: [], avecEquipes: [], historique: [] }}

function listesJoueurs(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_JOUEUR'://action: 0: type d'inscription  1: nom du joueur  2: special ou non  3: numéro d'équipe (option)
      if (action.value[0] != "" || action.value[1] != "" || action.value[2] != "") {
        const listes = { ...state.listesJoueurs };
        
        //Joueur
        let idNewJoueur = listes[action.value[0]].length;
        for (let i = 0; i < listes[action.value[0]].length; i++) {
          if (listes[action.value[0]][i].id !== i) {
            idNewJoueur = i;
            break;
          }
        }
        let newJoueur = {
          id: idNewJoueur,
          name: action.value[1],
          special: action.value[2],
          equipe: action.value[3]
        }
        listes[action.value[0]].push(newJoueur)

        //Historique
        if (action.value[0] != "sansNoms") {
          let joueurIndex = listes.historique.findIndex(joueur => joueur.name == action.value[1])
          if (joueurIndex != -1) {
            listes.historique[joueurIndex].nbTournois++
          }
          else {
            let newJoueurHistorique = {
              id: listes.historique.length,
              name: action.value[1],
              nbTournois: 0
            }
            listes.historique.push(newJoueurHistorique)
          }
        }

        //Ajout
        nextState = {
          ...state, 
          listesJoueurs: listes
        }
      }
      return nextState || state
    case 'UPDATE_ALL_JOUEURS_ID'://action: 0: type d'inscription
      if (action.value[0] != "") {
        const listes = { ...state.listesJoueurs };
        for (let i = 0; i < listes[action.value[0]].length; i++) {
          listes[action.value[0]][i].id = i
        }
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state;
    case 'SUPPR_JOUEUR'://action: 0: type d'inscription  1: id du joueur
      if (action.value[0] != "" || action.value[1] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]] = listes[action.value[0]].filter((item, index) => item.id !== action.value[1])
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state
    case 'SUPPR_ALL_JOUEURS'://action: 0: type d'inscription
      if (action.value[0] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]] = []
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state
    case 'RENOMMER_JOUEUR'://action: 0: type d'inscription  1: id du joueur  2: nouveau nom du joueur
      if (action.value[0] != "" || action.value[1] != "" || action.value[2] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]][action.value[1]].name = action.value[2];
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state
    case 'AJOUT_EQUIPE_JOUEUR'://action: 0: type d'inscription  1: id du joueur  2: équipe
      if (action.value[0] != "" || action.value[1] != "" || action.value[2] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]][action.value[1]].equipe = action.value[2];
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state
    case 'UPDATE_ALL_JOUEURS_EQUIPE'://action: 0: type d'inscription
      if (action.value[0] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]].forEach(joueur => {
          joueur.equipe = joueur.id + 1;
        });
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state;
  default:
    return state
  }
}

export default listesJoueurs