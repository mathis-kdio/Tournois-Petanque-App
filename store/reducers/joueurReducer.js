const initialState = { listeJoueurs: [] }
//const initialState = { listeJoueurs: [{name:"", special: false, id:0}] }

function toggleJoueur(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_JOUEUR':
      /*if (action.value != "") {
        let idNewJoueur = 0;
        for (let i = 0; i < state.listeJoueurs.length; i++) {
          if(state.listeJoueurs[i].id !== i + 1) {
            idNewJoueur = i + 1;
            break;
          }
        }

        if (idNewJoueur === 0) {
          idNewJoueur = state.listeJoueurs.length + 1;
        }

        let newJoueur = {
          name: action.value[0],
          special: action.value[1],
          id: idNewJoueur,
          equipe: action.value[2]
        }

        nextState = {
          ...state, 
            listeJoueurs : state.listeJoueurs.filter( (item, index) => item.id !== 0)
        }
        let indexJoueur = newJoueur.id - 1;
        nextState.listeJoueurs.splice( indexJoueur, 0, newJoueur);
      }*/
      return nextState || state
    case 'UPDATE_ALL_JOUEURS_ID':
      /*const listeJoueursNewId = state.listeJoueurs.slice()
      for (let i = 0; i < listeJoueursNewId.length; i++) {
        listeJoueursNewId[i].id = i + 1
      }
      nextState = {
        ...state,
        listeJoueurs: listeJoueursNewId
      }*/
      return nextState || state
    case 'SUPPR_JOUEUR':
      /*const listeJoueurIndex = state.listeJoueurs.findIndex(item => item.id === action.value)
      if (listeJoueurIndex !== -1) {
        nextState = {
          ...state,
          listeJoueurs: state.listeJoueurs.filter( (item, index) => index !== listeJoueurIndex)
        }
      }*/
      return nextState || state
    case 'SUPPR_ALL_JOUEURS':
      /*nextState = {
        ...state,
        listeJoueurs: initialState.listeJoueurs
      }*/
      return nextState || state
    case 'RENOMMER_JOUEUR':
      /*if (action.value != "") {
        nextState = {
          ...state,
          listeJoueurs: [...state.listeJoueurs]
        }
        nextState.listeJoueurs[action.value[0]].name = action.value[1];
      }*/
      return nextState || state
    case 'AJOUT_EQUIPE_JOUEUR':
      /*if (action.value != "") {
        nextState = {
          ...state,
          listeJoueurs: [...state.listeJoueurs]
        }
        nextState.listeJoueurs[action.value[0]].equipe = action.value[1];
      }*/
      return nextState || state
  default:
    return state
  }
}

export default toggleJoueur