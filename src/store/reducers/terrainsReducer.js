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
        const liste = state.listeTerrains.filter((item, index) => item.id !== action.value.terrainId)
        liste.forEach((e, index) => e.id = index);
        nextState = {
          ...state,
          listeTerrains: liste
        }
      }
      return nextState || state
    case 'RENOMMER_TERRAIN':
      if (action.value.terrainId != undefined && action.value.newName != "") {
        const liste = [ ...state.listeTerrains ];
        liste[action.value.terrainId].name = action.value.newName;
        nextState = {
          ...state,
          listeTerrains: liste
        }
      }
      return nextState || state
    case 'REMOVE_ALL_TERRAINS':
      nextState = {
        ...state,
        listeTerrains: initialState.listeTerrains
      }
      return nextState || state
  default:
    return state
  }
}

export default listeTerrains