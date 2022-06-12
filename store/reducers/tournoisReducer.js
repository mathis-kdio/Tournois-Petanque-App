const initialState = { listeTournois: [], tournoiIncr: 1 }

function listeTournois(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_TOURNOI':
      if (action.value.tournoi != undefined) {
        action.value.tournoi[action.value.tournoi.length - 1].tournoiID = state.tournoiIncr;
        nextState = {
          ...state,
          listeTournois: state.listeTournois.concat({tournoi: action.value.tournoi, tournoiId: state.tournoiIncr}),
          tournoiIncr: state.tournoiIncr + 1
        };
      }
      return nextState || state
    case 'UPDATE_TOURNOI':
      if (action.value.tournoiId != undefined && action.value.tournoi != undefined) {
        const listeTournois = {...state.listeTournois};
        listeTournois[action.value.tournoiId] = action.value.tournoi;
        nextState = {
          ...state,
          listeTournois: listeTournois
        };
      }
      return nextState || state
    case 'SUPPR_TOURNOI':
      if (action.value.tournoiId != undefined) {
        const tournoiIndex = state.listeTournois.findIndex(item => item.tournoiId === action.value.tournoiId)
        if (tournoiIndex !== -1) {
          nextState = {
            ...state,
            listeTournois: state.listeTournois.filter((item, index) => index !== tournoiIndex)
          }
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