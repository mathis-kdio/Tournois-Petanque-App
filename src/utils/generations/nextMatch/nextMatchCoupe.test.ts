import { nextMatchCoupe } from './nextMatchCoupe';

describe('nextMatchCoupe', () => {
  describe('détermination du gagnant (equipeNumber)', () => {
    it('retourne equipeNumber 0 (equipe1) quand score1 > score2', () => {
      const result = nextMatchCoupe(0, 13, 7, 1, 7);
      expect(result.equipeNumber).toBe(0);
    });

    it('retourne equipeNumber 1 (equipe2) quand score2 > score1', () => {
      const result = nextMatchCoupe(0, 5, 10, 1, 7);
      expect(result.equipeNumber).toBe(1);
    });

    it('retourne equipeNumber 0 en cas d\'égalité (score1 === score2)', () => {
      const result = nextMatchCoupe(0, 7, 7, 1, 7);
      expect(result.equipeNumber).toBe(0);
    });
  });

  describe('nextEquipeNumber', () => {
    it('retourne 0 pour un matchId pair', () => {
      const result = nextMatchCoupe(0, 13, 7, 1, 7);
      expect(result.nextEquipeNumber).toBe(0);
    });

    it('retourne 1 pour un matchId impair', () => {
      const result = nextMatchCoupe(1, 13, 7, 1, 7);
      expect(result.nextEquipeNumber).toBe(1);
    });
  });

  describe('manche 1 (8 équipes, 7 matchs)', () => {
    // nbMatchs = 7, div = 2, nbMatchsManche = floor(8/2) = 4
    it('matchId 0 (pair) → nextMatchId 4', () => {
      const result = nextMatchCoupe(0, 13, 7, 1, 7);
      expect(result.gagnantMatchId).toBe(4);
    });

    it('matchId 1 (impair) → nextMatchId 4', () => {
      const result = nextMatchCoupe(1, 13, 7, 1, 7);
      expect(result.gagnantMatchId).toBe(4);
    });

    it('matchId 2 (pair) → nextMatchId 5', () => {
      const result = nextMatchCoupe(2, 13, 7, 1, 7);
      expect(result.gagnantMatchId).toBe(5);
    });

    it('matchId 3 (impair) → nextMatchId 5', () => {
      const result = nextMatchCoupe(3, 13, 7, 1, 7);
      expect(result.gagnantMatchId).toBe(5);
    });
  });

  describe('manche 2 (8 équipes, 7 matchs)', () => {
    // nbMatchs = 7, div = 4, nbMatchsManche = floor(8/4) = 2
    it('matchId 4 → nextMatchId 6', () => {
      const result = nextMatchCoupe(4, 13, 7, 2, 7);
      expect(result.gagnantMatchId).toBe(6);
    });

    it('matchId 5 → nextMatchId 6', () => {
      const result = nextMatchCoupe(5, 13, 7, 2, 7);
      expect(result.gagnantMatchId).toBe(6);
    });
  });

  describe('manche 3 — finale (8 équipes, 7 matchs)', () => {
    // nbMatchs = 7, div = 8, nbMatchsManche = floor(8/8) = 1
    it('matchId 6 → nextMatchId 7', () => {
      const result = nextMatchCoupe(6, 13, 7, 3, 7);
      expect(result.gagnantMatchId).toBe(7);
    });
  });

  describe('tournoi 16 équipes (15 matchs)', () => {
    // nbMatchs = 15
    // manche 1: div = 2, nbMatchsManche = floor(16/2) = 8
    it('manche 1, matchId 0 → nextMatchId 8', () => {
      const result = nextMatchCoupe(0, 13, 7, 1, 15);
      expect(result.gagnantMatchId).toBe(8);
    });

    it('manche 1, matchId 7 → nextMatchId 11', () => {
      const result = nextMatchCoupe(7, 13, 7, 1, 15);
      expect(result.gagnantMatchId).toBe(11);
    });

    // manche 2: div = 4, nbMatchsManche = floor(16/4) = 4
    it('manche 2, matchId 8 → nextMatchId 12', () => {
      const result = nextMatchCoupe(8, 13, 7, 2, 15);
      expect(result.gagnantMatchId).toBe(12);
    });

    // manche 3: div = 8, nbMatchsManche = floor(16/8) = 2
    it('manche 3, matchId 12 → nextMatchId 14', () => {
      const result = nextMatchCoupe(12, 13, 7, 3, 15);
      expect(result.gagnantMatchId).toBe(14);
    });

    // manche 4 (finale): matchId 14 est le dernier match,
    // nextMatch ne l'appelle jamais (matchId + 1 >= nbMatchs), donc pas de test
  });

  describe('structure de retour', () => {
    it('retourne un objet avec les bonnes clés', () => {
      const result = nextMatchCoupe(0, 13, 7, 1, 7);
      expect(result).toHaveProperty('equipeNumber');
      expect(result).toHaveProperty('gagnantMatchId');
      expect(result).toHaveProperty('nextEquipeNumber');
    });
  });
});
