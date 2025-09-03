const initialState = {
  options: {
    type: null,
    typeEquipes: null,
    mode: null,
    modeCreationEquipes: null,
  },
};

function optionsTournoi(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case 'UPDATE_OPTION_TOURNOI': //action: 0: type d'option  1: valeur
      if (action.value[0] !== '' || action.value[1] !== '') {
        const options = { ...state.options };
        options[action.value[0]] = action.value[1];
        nextState = {
          ...state,
          options: options,
        };
      }
      return nextState || state;
    case 'REMOVE_ALL_OPTIONS':
      nextState = {
        ...state,
        options: initialState.options,
      };
      return nextState || state;
    default:
      return state;
  }
}

export default optionsTournoi;
