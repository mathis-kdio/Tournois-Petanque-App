const initialState = { listeTournois: [] }

function listeTournois(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_TOURNOI':
      if (action.value != "") {
        nextState = {
          ...state,
          listeTournois: [...state.listeTournois]
        }
        nextState.listeTournois.push(action.value.tournoi)
      }
      return nextState || state
    case 'SUPPR_TOURNOI':
      const tournoiIndex = state.listeTournois.findIndex(item => item.id === action.value)
      if (tournoiIndex !== -1) {
        nextState = {
          ...state,
          listeTournois: state.listeTournois.filter( (item, index) => index !== tournoiIndex)
        }
      }
      return nextState || state
    case 'SUPPR_ALL_TOURNOIS':
      nextState = {
        ...state,
        listeTournois: initialState.listeTournois
      }
      return nextState
  default:
    return state
  }
}

export default listeTournois