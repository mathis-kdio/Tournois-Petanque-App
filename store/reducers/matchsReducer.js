const initialState = { listematchs: undefined }

function gestionMatchs(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_MATCHS':
      if (action.value != "") {
        nextState = {
          ...state,
          listematchs: action.value
        }        
      }
      return nextState || state
    case 'SUPPR_MATCHS':
        nextState = {
          ...state, listematchs : initialState.listematchs
        }
      return nextState || state
    case 'AJOUT_SCORE':
      if (action.value != "") {
        nextState = {
          ...state,
          listematchs: [...state.listematchs]
        }
        nextState.listematchs[action.value.idMatch].score1 = action.value.score1;
        nextState.listematchs[action.value.idMatch].score2 = action.value.score2;
      }
      return nextState || state
    case 'INGAME_RENAME_PLAYER':
      if (action.value != "") {
        nextState = {
          ...state,
          listematchs: [...state.listematchs]
        }
        nextState.listematchs[nextState.listematchs.length - 1].listeJoueurs[action.value.playerId].name = action.value.newName;
      }
      return nextState || state
  default:
    return state
  }
}

export default gestionMatchs