import { Complement } from '@/types/enums/complement';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';

const rand0ToMax = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

const countOccurrences = (arr: number[], val: number) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export const uniqueValueArrayRandOrder = (arrayLength: number) => {
  const res = [];
  for (let i = 0; i < arrayLength; ) {
    const random = rand0ToMax(arrayLength - 1);
    if (countOccurrences(res, random) < 1) {
      res.push(random);
      i++;
    }
  }
  return res;
};

export const calcNbMatchsParTour = (
  nbjoueurs: number,
  typeEquipes: TypeEquipes,
  modeTournoi: ModeTournoi,
  typeTournoi: TypeTournoi,
  complement: Complement,
): number | undefined => {
  let nbMatchsParTour = undefined;

  if (
    modeTournoi === ModeTournoi.AVECEQUIPES ||
    typeTournoi === TypeTournoi.CHAMPIONNAT
  ) {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      nbMatchsParTour = nbjoueurs / 2;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      nbMatchsParTour = Math.ceil(nbjoueurs / 4);
    } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
      nbMatchsParTour = Math.ceil(nbjoueurs / 6);
    } else {
      console.log(
        'calcNbMatchsParTour : typeEquipes inconnu pour avecEquipes/championnat',
      );
    }
  } else if (typeTournoi === TypeTournoi.MELEDEMELE) {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      nbMatchsParTour = nbjoueurs / 2;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      if (
        complement === Complement.TETEATETE ||
        complement === Complement.DEUXVSUN
      ) {
        nbMatchsParTour = Math.ceil(nbjoueurs / 4);
      } else if (
        complement === Complement.TRIPLETTE ||
        complement === Complement.TROISVSDEUX
      ) {
        nbMatchsParTour = Math.floor(nbjoueurs / 4);
      } else {
        console.log(
          'calcNbMatchsParTour : complement inconnu pour mele-demele',
        );
      }
    } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
      nbMatchsParTour = Math.ceil(nbjoueurs / 6);
    } else {
      console.log('calcNbMatchsParTour : typeEquipes inconnu pour mele-demele');
    }
  } else if (typeTournoi === TypeTournoi.COUPE) {
    console.log('calcNbMatchsParTour: coupe non prise en charge');
  } else {
    console.log('calcNbMatchsParTour: type de tournoi inconnu');
  }

  return nbMatchsParTour;
};

export const shuffle = (array: number[]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
