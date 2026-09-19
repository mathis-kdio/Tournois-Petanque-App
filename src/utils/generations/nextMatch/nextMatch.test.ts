import { TypeTournoi } from '@/types/enums/typeTournoi';
import { nextMatch } from './nextMatch';

// Mock du repository
jest.mock('@/repositories/matchs/matchsRepository', () => ({
  MatchsRepository: {
    get: jest.fn(),
    updateMatchNext: jest.fn(),
  },
}));

// Import après le mock pour récupérer la version mockée
const { MatchsRepository } = require('@/repositories/matchs/matchsRepository');

describe('nextMatch', () => {
  const tournoiId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TypeTournoi.COUPE', () => {
    const mockMatch = { equipe1: 101, equipe2: 102 };

    beforeEach(() => {
      (MatchsRepository.get as jest.Mock).mockResolvedValue([mockMatch]);
      (MatchsRepository.updateMatchNext as jest.Mock).mockResolvedValue(
        undefined,
      );
    });

    it('met à jour le match suivant quand matchId + 1 < nbMatchs', async () => {
      // matchId 0, nbMatchs 7 → 0 + 1 < 7 = true
      // nextMatchCoupe(0, 13, 7, 1, 7) → equipeNumber 0, gagnantMatchId 4, nextEquipeNumber 0
      await nextMatch(0, 13, 7, 1, 7, TypeTournoi.COUPE, 3, tournoiId);

      expect(MatchsRepository.get).toHaveBeenCalledWith(tournoiId, 0);
      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        101, // equipeNumber 0 → equipe1
        4, // gagnantMatchId
        0, // nextEquipeNumber
      );
    });

    it('utilise equipe2 quand score2 > score1 (equipeNumber = 1)', async () => {
      // nextMatchCoupe(0, 5, 10, 1, 7) → equipeNumber 1, gagnantMatchId 4, nextEquipeNumber 0
      await nextMatch(0, 5, 10, 1, 7, TypeTournoi.COUPE, 3, tournoiId);

      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        102, // equipeNumber 1 → equipe2
        4,
        0,
      );
    });

    it('ne fait rien pour le dernier match (matchId + 1 >= nbMatchs)', async () => {
      // matchId 6, nbMatchs 7 → 6 + 1 = 7, 7 < 7 = false
      await nextMatch(6, 13, 7, 3, 7, TypeTournoi.COUPE, 3, tournoiId);

      expect(MatchsRepository.get).not.toHaveBeenCalled();
      expect(MatchsRepository.updateMatchNext).not.toHaveBeenCalled();
    });

    it('met à jour avec nextEquipeNumber 1 pour un matchId impair', async () => {
      // nextMatchCoupe(1, 13, 7, 1, 7) → equipeNumber 0, gagnantMatchId 4, nextEquipeNumber 1
      await nextMatch(1, 13, 7, 1, 7, TypeTournoi.COUPE, 3, tournoiId);

      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        101, // equipeNumber 0 → equipe1
        4, // gagnantMatchId
        1, // nextEquipeNumber
      );
    });
  });

  describe('TypeTournoi.MULTICHANCES', () => {
    const mockMatch = { equipe1: 201, equipe2: 202 };

    beforeEach(() => {
      (MatchsRepository.get as jest.Mock).mockResolvedValue([mockMatch]);
      (MatchsRepository.updateMatchNext as jest.Mock).mockResolvedValue(
        undefined,
      );
    });

    it('met à jour le match du gagnant et du perdant quand manche < nbTours', async () => {
      // nextMatchMultiChances(0, 13, 7, 1, 8, 2)
      // → gagnantEquipeNumber 0, gagnantMatchId 4, perdantEquipeNumber 1, perdantMatchId 6, nextEquipeNumber 0
      await nextMatch(0, 13, 7, 1, 8, TypeTournoi.MULTICHANCES, 2, tournoiId);

      expect(MatchsRepository.get).toHaveBeenCalledWith(tournoiId, 0);
      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledTimes(2);

      // Mise à jour du gagnant
      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        201, // gagnantEquipeNumber 0 → equipe1
        4, // gagnantMatchId
        0, // nextEquipeNumber
      );

      // Mise à jour du perdant
      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        202, // perdantEquipeNumber 1 → equipe2
        6, // perdantMatchId
        0, // nextEquipeNumber
      );
    });

    it('inverse gagnant/perdant quand score2 > score1', async () => {
      // nextMatchMultiChances(0, 5, 10, 1, 8, 2)
      // → gagnantEquipeNumber 1, perdantEquipeNumber 0
      await nextMatch(0, 5, 10, 1, 8, TypeTournoi.MULTICHANCES, 2, tournoiId);

      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledTimes(2);

      // Gagnant = equipe2
      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        202, // gagnantEquipeNumber 1 → equipe2
        4,
        0,
      );

      // Perdant = equipe1
      expect(MatchsRepository.updateMatchNext).toHaveBeenCalledWith(
        tournoiId,
        201, // perdantEquipeNumber 0 → equipe1
        6,
        0,
      );
    });

    it('ne fait rien au dernier tour (manche >= nbTours)', async () => {
      // manche 2, nbTours 2 → 2 < 2 = false
      await nextMatch(4, 13, 7, 2, 8, TypeTournoi.MULTICHANCES, 2, tournoiId);

      expect(MatchsRepository.get).not.toHaveBeenCalled();
      expect(MatchsRepository.updateMatchNext).not.toHaveBeenCalled();
    });
  });

  describe('autres types de tournoi', () => {
    it('ne fait rien pour TypeTournoi.MELEE', async () => {
      await nextMatch(0, 13, 7, 1, 7, TypeTournoi.MELEE, 3, tournoiId);

      expect(MatchsRepository.get).not.toHaveBeenCalled();
      expect(MatchsRepository.updateMatchNext).not.toHaveBeenCalled();
    });

    it('ne fait rien pour TypeTournoi.MELEDEMELE', async () => {
      await nextMatch(0, 13, 7, 1, 7, TypeTournoi.MELEDEMELE, 3, tournoiId);

      expect(MatchsRepository.get).not.toHaveBeenCalled();
      expect(MatchsRepository.updateMatchNext).not.toHaveBeenCalled();
    });

    it('ne fait rien pour TypeTournoi.CHAMPIONNAT', async () => {
      await nextMatch(0, 13, 7, 1, 7, TypeTournoi.CHAMPIONNAT, 3, tournoiId);

      expect(MatchsRepository.get).not.toHaveBeenCalled();
      expect(MatchsRepository.updateMatchNext).not.toHaveBeenCalled();
    });
  });
});
