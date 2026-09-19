import { Complement } from '@/types/enums/complement';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import {
  attributionEquipes,
  calcNbMatchsParTour,
  shuffle,
  uniqueValueArrayRandOrder,
} from './generation';

const makeJoueur = (id: number): JoueurModel => ({
  uniqueBDDId: id,
  joueurTournoiId: id,
  name: `Joueur ${id}`,
  type: undefined,
  equipe: undefined,
  isChecked: true,
});

describe('shuffle', () => {
  it('retourne un tableau de même longueur', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it("conserve les mêmes éléments (peu importe l'ordre)", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('ne plante pas sur un tableau vide', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('est déterministe quand Math.random est mocké', () => {
    const arr = [1, 2, 3];
    // Math.random retourne toujours 0 → j = 0 à chaque itération
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const result = shuffle([...arr]);
    expect(result).toEqual([1, 2, 3]);
    spy.mockRestore();
  });
});

describe('uniqueValueArrayRandOrder', () => {
  it('retourne un tableau de la bonne longueur', () => {
    expect(uniqueValueArrayRandOrder(5)).toHaveLength(5);
  });

  it('contient uniquement des valeurs uniques', () => {
    const result = uniqueValueArrayRandOrder(10);
    expect(new Set(result).size).toBe(result.length);
  });

  it('contient des valeurs entre 0 et length-1', () => {
    const result = uniqueValueArrayRandOrder(10);
    result.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    });
  });

  it('retourne un tableau vide pour une longueur de 0', () => {
    expect(uniqueValueArrayRandOrder(0)).toEqual([]);
  });
});

describe('calcNbMatchsParTour', () => {
  describe('mode AVECEQUIPES', () => {
    it('calcule pour tête-à-tête (division entière)', () => {
      expect(
        calcNbMatchsParTour(
          8,
          TypeEquipes.TETEATETE,
          ModeTournoi.AVECEQUIPES,
          TypeTournoi.MELEE,
          undefined,
        ),
      ).toBe(4);
    });

    it('calcule pour doublette (arrondi supérieur)', () => {
      expect(
        calcNbMatchsParTour(
          10,
          TypeEquipes.DOUBLETTE,
          ModeTournoi.AVECEQUIPES,
          TypeTournoi.MELEE,
          undefined,
        ),
      ).toBe(3); // ceil(10/4) = 3
    });

    it('calcule pour triplette (arrondi supérieur)', () => {
      expect(
        calcNbMatchsParTour(
          14,
          TypeEquipes.TRIPLETTE,
          ModeTournoi.AVECEQUIPES,
          TypeTournoi.MELEE,
          undefined,
        ),
      ).toBe(3); // ceil(14/6) = 3
    });
  });

  describe('type CHAMPIONNAT', () => {
    it('calcule pour tête-à-tête', () => {
      expect(
        calcNbMatchsParTour(
          6,
          TypeEquipes.TETEATETE,
          ModeTournoi.AVECNOMS,
          TypeTournoi.CHAMPIONNAT,
          undefined,
        ),
      ).toBe(3);
    });
  });

  describe('type MELEDEMELE', () => {
    it('calcule pour doublette avec complément TETEATETE (arrondi supérieur)', () => {
      expect(
        calcNbMatchsParTour(
          10,
          TypeEquipes.DOUBLETTE,
          ModeTournoi.AVECNOMS,
          TypeTournoi.MELEDEMELE,
          Complement.TETEATETE,
        ),
      ).toBe(3); // ceil(10/4)
    });

    it('calcule pour doublette avec complément TRIPLETTE (arrondi inférieur)', () => {
      expect(
        calcNbMatchsParTour(
          10,
          TypeEquipes.DOUBLETTE,
          ModeTournoi.AVECNOMS,
          TypeTournoi.MELEDEMELE,
          Complement.TRIPLETTE,
        ),
      ).toBe(2); // floor(10/4)
    });

    it('calcule pour triplette avec complément QUATREVSTROIS (arrondi inférieur)', () => {
      expect(
        calcNbMatchsParTour(
          14,
          TypeEquipes.TRIPLETTE,
          ModeTournoi.AVECNOMS,
          TypeTournoi.MELEDEMELE,
          Complement.QUATREVSTROIS,
        ),
      ).toBe(2); // floor(14/6)
    });
  });

  describe('type COUPE', () => {
    it('lance une erreur pour le type COUPE', () => {
      expect(() =>
        calcNbMatchsParTour(
          8,
          TypeEquipes.DOUBLETTE,
          ModeTournoi.AVECNOMS,
          TypeTournoi.COUPE,
          undefined,
        ),
      ).toThrow('Type tournoi coupe non prise en charge');
    });
  });
});

describe('attributionEquipes', () => {
  it("attribue les numéros d'équipe pour tête-à-tête", () => {
    const joueurs = Array.from({ length: 4 }, (_, i) => makeJoueur(i));
    const result = attributionEquipes(joueurs, TypeEquipes.TETEATETE);
    const equipes = result.map((j) => j.equipe);
    expect(new Set(equipes).size).toBe(4);
    [1, 2, 3, 4].forEach((eq) => {
      expect(equipes.filter((e) => e === eq)).toHaveLength(1);
    });
  });

  it("attribue les numéros d'équipe pour doublette (2 par équipe)", () => {
    const joueurs = Array.from({ length: 6 }, (_, i) => makeJoueur(i));
    const result = attributionEquipes(joueurs, TypeEquipes.DOUBLETTE);
    const equipes = result.map((j) => j.equipe);
    expect(new Set(equipes).size).toBe(3);
    [1, 2, 3].forEach((eq) => {
      expect(equipes.filter((e) => e === eq)).toHaveLength(2);
    });
  });

  it("attribue les numéros d'équipe pour triplette (3 par équipe)", () => {
    const joueurs = Array.from({ length: 9 }, (_, i) => makeJoueur(i));
    const result = attributionEquipes(joueurs, TypeEquipes.TRIPLETTE);
    const equipes = result.map((j) => j.equipe);
    expect(new Set(equipes).size).toBe(3);
    [1, 2, 3].forEach((eq) => {
      expect(equipes.filter((e) => e === eq)).toHaveLength(3);
    });
  });

  it("lance une erreur pour un type d'équipes non géré", () => {
    const joueurs = [makeJoueur(0)];
    expect(() =>
      attributionEquipes(joueurs, 'inconnu' as unknown as TypeEquipes),
    ).toThrow("Type d'équipes non géré");
  });
});
