import { JoueurModel } from './joueurModel';

export type EquipesType = [EquipeType, EquipeType];

export type EquipeType = [
  JoueurModel | undefined | -1,
  JoueurModel | undefined | -1,
  JoueurModel | undefined | -1,
  JoueurModel | undefined | -1,
];
