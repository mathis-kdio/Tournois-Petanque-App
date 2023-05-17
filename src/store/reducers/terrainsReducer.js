const initialState = { listeTerrains: new Array() }

function listeTerrains(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_TERRAIN':
      let newTerrain = {id: state.listeTerrains.length, name: 'Terrain '+ (state.listeTerrains.length+1).toString()};
      nextState = {
        ...state,
        listeTerrains: [...state.listeTerrains, newTerrain]
      };
      return nextState || state
    case 'SUPPR_TERRAIN':
      if (action.value.terrainId != undefined) {
        nextState = {
          ...state,
          listeTerrains: state.listeTerrains.filter((item, index) => item.id !== action.value.terrainId)
        }
      }
      return nextState || state
  default:
    return state
  }
}

export default listeTerrains