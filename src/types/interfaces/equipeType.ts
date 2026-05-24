import { JoueurModel } from './joueurModel';

export type EquipesType = [EquipeType, EquipeType];

export type EquipeType = [
  JoueurModel | undefined,
  JoueurModel | undefined,
  JoueurModel | undefined,
  JoueurModel | undefined,
];
