import { nextMatchMultiChances } from './nextMatchMultiChances';

describe('nextMatchMultiChances', () => {
  describe('détermination du gagnant et du perdant', () => {
    it('retourne gagnant = equipe1 (0) et perdant = equipe2 (1) quand score1 > score2', () => {
      const result = nextMatchMultiChances(0, 13, 7, 1, 8, 2);
      expect(result.gagnantEquipeNumber).toBe(0);
      expect(result.perdantEquipeNumber).toBe(1);
    });

    it('retourne gagnant = equipe2 (1) et perdant = equipe1 (0) quand score2 > score1', () => {
      const result = nextMatchMultiChances(0, 5, 10, 1, 8, 2);
      expect(result.gagnantEquipeNumber).toBe(1);
      expect(result.perdantEquipeNumber).toBe(0);
    });

    it('retourne gagnant = equipe1 (0) en cas d\'égalité', () => {
      const result = nextMatchMultiChances(0, 7, 7, 1, 8, 2);
      expect(result.gagnantEquipeNumber).toBe(0);
      expect(result.perdantEquipeNumber).toBe(1);
    });
  });

  describe('nextEquipeNumber', () => {
    it('retourne 0 pour un matchId pair', () => {
      const result = nextMatchMultiChances(0, 13, 7, 1, 8, 2);
      expect(result.nextEquipeNumber).toBe(0);
    });

    it('retourne 1 pour un matchId impair', () => {
      const result = nextMatchMultiChances(1, 13, 7, 1, 8, 2);
      expect(result.nextEquipeNumber).toBe(1);
    });
  });

  describe('manche 1 (nbMatchs=8, nbTours=2, nbMatchsTour=4)', () => {
    it('matchId 0 → gagnantMatchId 4, perdantMatchId 6', () => {
      const result = nextMatchMultiChances(0, 13, 7, 1, 8, 2);
      expect(result.gagnantMatchId).toBe(4);
      expect(result.perdantMatchId).toBe(6);
    });

    it('matchId 1 → gagnantMatchId 4, perdantMatchId 6', () => {
      const result = nextMatchMultiChances(1, 13, 7, 1, 8, 2);
      expect(result.gagnantMatchId).toBe(4);
      expect(result.perdantMatchId).toBe(6);
    });

    it('matchId 2 → gagnantMatchId 5, perdantMatchId 7', () => {
      const result = nextMatchMultiChances(2, 13, 7, 1, 8, 2);
      expect(result.gagnantMatchId).toBe(5);
      expect(result.perdantMatchId).toBe(7);
    });

    it('matchId 3 → gagnantMatchId 5, perdantMatchId 7', () => {
      const result = nextMatchMultiChances(3, 13, 7, 1, 8, 2);
      expect(result.gagnantMatchId).toBe(5);
      expect(result.perdantMatchId).toBe(7);
    });
  });

  describe('tournoi 3 tours (nbMatchs=12, nbTours=3, nbMatchsTour=4)', () => {
    describe('manche 1', () => {
      it('matchId 0 → gagnantMatchId 4, perdantMatchId 6', () => {
        const result = nextMatchMultiChances(0, 13, 7, 1, 12, 3);
        expect(result.gagnantMatchId).toBe(4);
        expect(result.perdantMatchId).toBe(6);
      });

      it('matchId 1 → gagnantMatchId 4, perdantMatchId 6', () => {
        const result = nextMatchMultiChances(1, 13, 7, 1, 12, 3);
        expect(result.gagnantMatchId).toBe(4);
        expect(result.perdantMatchId).toBe(6);
      });

      it('matchId 2 → gagnantMatchId 5, perdantMatchId 7', () => {
        const result = nextMatchMultiChances(2, 13, 7, 1, 12, 3);
        expect(result.gagnantMatchId).toBe(5);
        expect(result.perdantMatchId).toBe(7);
      });

      it('matchId 3 → gagnantMatchId 5, perdantMatchId 7', () => {
        const result = nextMatchMultiChances(3, 13, 7, 1, 12, 3);
        expect(result.gagnantMatchId).toBe(5);
        expect(result.perdantMatchId).toBe(7);
      });
    });

    describe('manche 2', () => {
      it('matchId 4 → gagnantMatchId 8, perdantMatchId 9', () => {
        const result = nextMatchMultiChances(4, 13, 7, 2, 12, 3);
        expect(result.gagnantMatchId).toBe(8);
        expect(result.perdantMatchId).toBe(9);
      });

      it('matchId 5 → gagnantMatchId 8, perdantMatchId 9', () => {
        const result = nextMatchMultiChances(5, 13, 7, 2, 12, 3);
        expect(result.gagnantMatchId).toBe(8);
        expect(result.perdantMatchId).toBe(9);
      });

      it('matchId 6 → gagnantMatchId 10, perdantMatchId 11', () => {
        const result = nextMatchMultiChances(6, 13, 7, 2, 12, 3);
        expect(result.gagnantMatchId).toBe(10);
        expect(result.perdantMatchId).toBe(11);
      });

      it('matchId 7 → gagnantMatchId 10, perdantMatchId 11', () => {
        const result = nextMatchMultiChances(7, 13, 7, 2, 12, 3);
        expect(result.gagnantMatchId).toBe(10);
        expect(result.perdantMatchId).toBe(11);
      });
    });
  });

  describe('structure de retour', () => {
    it('retourne un objet avec les bonnes clés', () => {
      const result = nextMatchMultiChances(0, 13, 7, 1, 8, 2);
      expect(result).toHaveProperty('gagnantEquipeNumber');
      expect(result).toHaveProperty('gagnantMatchId');
      expect(result).toHaveProperty('perdantEquipeNumber');
      expect(result).toHaveProperty('perdantMatchId');
      expect(result).toHaveProperty('nextEquipeNumber');
    });
  });
});
