import { Joueur } from "@/types/interfaces/joueur";

const initialState = {listesJoueurs: { avecNoms: [], sansNoms: [], avecEquipes: [], historique: [], sauvegarde: [] }, listesSauvegarde: { avecNoms: [], sansNoms: [], avecEquipes: [] }}

function listesJoueurs(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'AJOUT_JOUEUR'://action: 0: type d'inscription  1: nom du joueur  2: type ou undefined  3: numéro d'équipe (option)
      if (action.value[0] != "" || action.value[1] != "") {
        const listes = { ...state.listesJoueurs };
        if (listes[action.value[0]] == undefined) {
          listes[action.value[0]] = Array();
        }

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
          type: action.value[2],
          equipe: action.value[3]
        }
        listes[action.value[0]].push(newJoueur)

        //Historique
        if (action.value[0] != "sansNoms") {
          let joueurIndex = listes.historique.findIndex((joueur: Joueur) => joueur.name == action.value[1])
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
    case 'SUPPR_JOUEUR'://action: 0: type d'inscription  1: id du joueur
      if (action.value[0] != "" || action.value[1] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]] = listes[action.value[0]].filter((item, index) => item.id !== action.value[1])
        //Update Ids
        for (let i = 0; i < listes[action.value[0]].length; i++) {
          listes[action.value[0]][i].id = i
        }
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
    case 'CHECK_JOUEUR'://action: 0: type d'inscription  1: id du joueur  2: état du check
      if (action.value[0] != "" || action.value[1] != "" || action.value[2] != "") {
        const listes = { ...state.listesJoueurs };
        listes[action.value[0]][action.value[1]].isChecked = action.value[2];
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
        listes[action.value[0]].forEach((joueur: Joueur) => {
          joueur.equipe = joueur.id + 1;
        });
        nextState = {
          ...state,
          listesJoueurs: listes
        }
      }
      return nextState || state;
    case 'ADD_SAVED_LIST'://typeInscription: avecNoms/sansNoms/AvecEquipes  savedList: list
      if (action.value.typeInscription != "" && action.value.savedList != "") {
        const savedLists = { ...state.listesSauvegarde };
        let listId = 0;
        if (savedLists[action.value.typeInscription].length != 0) {
          let lastlist = savedLists[action.value.typeInscription][savedLists[action.value.typeInscription].length - 1];
          listId = lastlist[lastlist.length - 1].listId + 1;
        }
        savedLists[action.value.typeInscription].push(action.value.savedList);
        savedLists[action.value.typeInscription][savedLists[action.value.typeInscription].length - 1].push({listId: listId});
        nextState = {
          ...state,
          listesSauvegarde: savedLists
        }
      }
      return nextState || state;
    case 'UPDATE_SAVED_LIST'://typeInscription: avecNoms/sansNoms/AvecEquipes  listId: id   savedList: list
      if (action.value.typeInscription != "" && action.value.listId != undefined && action.value.savedList != "") {
        const savedLists = { ...state.listesSauvegarde };
        action.value.savedList.push({listId: action.value.listId})
        let typeSavedLists = savedLists[action.value.typeInscription]
        let listIndex = typeSavedLists.findIndex(e => e[e.length - 1].listId == action.value.listId);
        typeSavedLists[listIndex] = action.value.savedList;
        nextState = {
          ...state,
          listesSauvegarde: savedLists
        }
      }
      return nextState || state;      
    case 'LOAD_SAVED_LIST'://typeInscriptionSrc: avecNoms/sansNoms/AvecEquipes/sauvegarde    //typeInscriptionDst: avecNoms/sansNoms/AvecEquipes/sauvegarde     listId: id
      if (action.value.typeInscriptionSrc != undefined && action.value.typeInscriptionDst != undefined && action.value.listId != undefined) {
        const savedLists = { ...state.listesSauvegarde };
        const listsOfPlayers = { ...state.listesJoueurs };
        //Add to list
        let typeSavedLists = savedLists[action.value.typeInscriptionSrc]
        let listIndex = typeSavedLists.findIndex(e => e[e.length - 1].listId == action.value.listId);
        const copySeletedSavedList = JSON.parse(JSON.stringify(typeSavedLists[listIndex].slice(0, -1)))
        listsOfPlayers[action.value.typeInscriptionDst].push(...copySeletedSavedList);
        //Update Ids
        for (let i = 0; i < listsOfPlayers[action.value.typeInscriptionDst].length; i++) {
          listsOfPlayers[action.value.typeInscriptionDst][i].id = i
        }
        nextState = {
          ...state,
          listesJoueurs: listsOfPlayers
        }
      }
    return nextState || state;
    case 'RENAME_SAVED_LIST'://typeInscription: avecNoms/sansNoms/AvecEquipes  listId: id   newName: name
      if (action.value.typeInscription != undefined && action.value.listId != undefined && action.value.newName != "") {
        const savedLists = { ...state.listesSauvegarde };
        let typeSavedLists = savedLists[action.value.typeInscription]
        let listIndex = typeSavedLists.findIndex(e => e[e.length - 1].listId == action.value.listId);
        typeSavedLists[listIndex][typeSavedLists[listIndex].length - 1].name = action.value.newName;
        nextState = {
          ...state,
          listesSauvegarde: savedLists
        }
      }
      return nextState || state 
    case 'REMOVE_SAVED_LIST'://typeInscription: avecNoms/sansNoms/AvecEquipes     listId: id
      if (action.value.listId != undefined) {
        const savedLists = { ...state.listesSauvegarde };
        savedLists[action.value.typeInscription] = savedLists[action.value.typeInscription].filter((item, index) => item[item.length - 1].listId !== action.value.listId)
        nextState = {
          ...state,
          listesSauvegarde: savedLists
        }
      }
      return nextState || state;
    case 'REMOVE_ALL_SAVED_LIST':
      const listes = { ...state.listesSauvegarde };
      listes["avecNoms"] = [];
      listes["sansNoms"] = [];
      listes["avecEquipes"] = [];
      nextState = {
        ...state,
        listesSauvegarde: listes
      }
      return nextState || state
  default:
    return state
  }
}

export default listesJoueurs