import { Complement } from '@/types/enums/complement';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';

export const uniqueValueArrayRandOrder = (arrayLength: number) => {
  const res = Array.from({ length: arrayLength }, (_, index) => index);
  for (let i = res.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [res[i], res[random]] = [res[random], res[i]];
  }
  return res;
};

export const calcNbMatchsParTour = (
  nbjoueurs: number,
  typeEquipes: TypeEquipes,
  modeTournoi: ModeTournoi,
  typeTournoi: TypeTournoi,
  complement: Complement | undefined,
): number => {
  if (
    modeTournoi === ModeTournoi.AVECEQUIPES ||
    typeTournoi === TypeTournoi.CHAMPIONNAT
  ) {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      return nbjoueurs / 2;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      return Math.ceil(nbjoueurs / 4);
    } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
      return Math.ceil(nbjoueurs / 6);
    } else {
      throw new Error('Type équipes non géré pour avecEquipes/championnat');
    }
  } else if (typeTournoi === TypeTournoi.MELEDEMELE) {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      return nbjoueurs / 2;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      if (
        complement === Complement.TETEATETE ||
        complement === Complement.DEUXVSUN
      ) {
        return Math.ceil(nbjoueurs / 4);
      } else if (
        complement === Complement.TRIPLETTE ||
        complement === Complement.TROISVSDEUX ||
        complement === Complement.TROIS_VS_TROIS_ET_TROIS_VS_DEUX
      ) {
        return Math.floor(nbjoueurs / 4);
      } else if (complement === undefined) {
        return nbjoueurs / 4;
      } else {
        throw new Error('Complement non géré pour mele-demele doublette');
      }
    } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
      if (complement === Complement.QUATREVSTROIS) {
        return Math.floor(nbjoueurs / 6);
      } else if (
        complement === Complement.TETEATETE ||
        complement === Complement.DEUXVSUN ||
        complement === Complement.DOUBLETTES ||
        complement === Complement.TROISVSDEUX
      ) {
        return Math.ceil(nbjoueurs / 6);
      } else if (complement === undefined) {
        return nbjoueurs / 6;
      } else {
        throw new Error('Complement non géré pour mele-demele triplette');
      }
    } else {
      throw new Error('Type équipes non géré pour mele-demele');
    }
  } else if (typeTournoi === TypeTournoi.COUPE) {
    throw new Error('Type tournoi coupe non prise en charge');
  } else {
    throw new Error('Type tournoi non géré');
  }
};

export const shuffle = <T>(array: T[]): T[] => {
  for (let i = 0; i < array.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (array.length - i));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const attributionEquipes = (
  listesJoueurs: JoueurModel[],
  typeEquipes: TypeEquipes,
): JoueurModel[] => {
  let joueursParEquipe: number;
  if (typeEquipes === TypeEquipes.TETEATETE) {
    joueursParEquipe = 1;
  } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
    joueursParEquipe = 2;
  } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
    joueursParEquipe = 3;
  } else {
    throw new Error("Type d'équipes non géré");
  }

  const joueursMelanges = [...listesJoueurs];
  shuffle(joueursMelanges);

  let equipe = 1;
  for (let i = 0; i < joueursMelanges.length; i++) {
    joueursMelanges[i].equipe = equipe;
    if ((i + 1) % joueursParEquipe === 0) {
      equipe++;
    }
  }

  return joueursMelanges;
};
