const initialState = { listeTournois: [], tournoiIncr: 1 }

function listeTournois(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_TOURNOI':
      if (action.value.tournoi != undefined) {
        action.value.tournoi[action.value.tournoi.length - 1].tournoiID = state.tournoiIncr;
        nextState = {
          ...state,
          listeTournois: state.listeTournois.concat([{tournoi: action.value.tournoi, tournoiId: state.tournoiIncr}]),
          tournoiIncr: state.tournoiIncr + 1
        };
      }
      return nextState || state
    case 'UPDATE_TOURNOI':
      if (action.value.tournoiId != undefined && action.value.tournoi != undefined) {
        if (state.listeTournois.length != 0) {
          let tournoiId = state.listeTournois.findIndex(e => e.tournoiId == action.value.tournoiId);
          state.listeTournois[tournoiId].tournoi = action.value.tournoi;
          nextState = {
            ...state,
            listeTournois: state.listeTournois
          };
        }
      }
      return nextState || state
    case 'SUPPR_TOURNOI':
      if (action.value.tournoiId != undefined) {
        nextState = {
          ...state,
          listeTournois: state.listeTournois.filter((item, index) => item.tournoiId !== action.value.tournoiId)
        }
      }
      return nextState || state
    case 'SUPPR_ALL_TOURNOIS':
      nextState = {
        ...state,
        listeTournois: initialState.listeTournois
      }
      return nextState || state
  default:
    return state
  }
}

export default listeTournois