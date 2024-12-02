import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { ConnectedProps, connect } from 'react-redux';

const mapStateToProps = (state: any) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    savedLists: state.listesJoueurs.listesSauvegarde,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    listeTerrains: state.listeTournois.listeTerrains,
    optionsTournoi: state.optionsTournoi.options as OptionsTournoi,
  };
};

export const connector = connect(mapStateToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;
