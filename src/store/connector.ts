import { OptionsTournoiModel } from '@/types/interfaces/optionsTournoi';
import { ConnectedProps, connect } from 'react-redux';

const mapStateToProps = (state: any) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    savedLists: state.listesJoueurs.listesSauvegarde,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    listeTerrains: state.listeTerrains.listeTerrains,
    optionsTournoi: state.optionsTournoi.options as OptionsTournoiModel,
  };
};

export const connector = connect(mapStateToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;
