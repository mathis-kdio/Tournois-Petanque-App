import { NewEquipe, NewTournoi, Tournoi } from '@/db/schema';
import { NewEquipesJoueurs } from '@/db/schema/equipesJoueurs';
import { NewMatch } from '@/db/schema/match';
import { EquipeRepository } from '@/repositories/equipe/equipeRepository';
import { EquipesJoueursRepository } from '@/repositories/equipesJoueurs/equipesJoueursRepository';
import { JoueursPreparationTournoisRepository } from '@/repositories/joueursPreparationTournois/joueursPreparationTournoiRepository';
import { MatchsRepository } from '@/repositories/matchs/matchsRepository';
import { PreparationTournoisRepository } from '@/repositories/preparationTournoi/preparationTournoiRepository';
import { TerrainsPreparationTournoisRepository } from '@/repositories/terrainsPreparationTournois/terrainsPreparationTournoiRepository';
import { TournoisRepository } from '@/repositories/tournois/tournoisRepository';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { EquipesType, EquipeType } from '@/types/interfaces/equipeType';
import { MatchModel } from '@/types/interfaces/matchModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';

function toNewTournoi(
  preparationTournoiModel: PreparationTournoiModel,
): NewTournoi {
  const {
    nbTours,
    nbMatchs,
    nbPtVictoire,
    speciauxIncompatibles,
    memesEquipes,
    memesAdversaires,
    typeEquipes,
    typeTournoi,
    avecTerrains,
    mode,
  } = preparationTournoiModel;
  if (
    !mode ||
    (mode !== ModeTournoi.AVECEQUIPES &&
      mode !== ModeTournoi.AVECNOMS &&
      mode !== ModeTournoi.SANSNOMS) ||
    !nbTours ||
    !nbMatchs ||
    !nbPtVictoire ||
    speciauxIncompatibles === undefined ||
    memesEquipes === undefined ||
    !memesAdversaires ||
    (typeEquipes !== TypeEquipes.DOUBLETTE &&
      typeEquipes !== TypeEquipes.TETEATETE &&
      typeEquipes !== TypeEquipes.TRIPLETTE) ||
    (typeTournoi !== TypeTournoi.CHAMPIONNAT &&
      typeTournoi !== TypeTournoi.COUPE &&
      typeTournoi !== TypeTournoi.MELEDEMELE &&
      typeTournoi !== TypeTournoi.MELEE &&
      typeTournoi !== TypeTournoi.MULTICHANCES) ||
    avecTerrains === undefined
  ) {
    throw Error('aaa');
  }

  return {
    mode: mode,
    name: '',
    nbTours: nbTours,
    nbMatchs: nbMatchs,
    nbPtVictoire: nbPtVictoire,
    speciauxIncompatibles: speciauxIncompatibles,
    memesEquipes: memesEquipes,
    memesAdversaires: memesAdversaires,
    typeEquipes: typeEquipes,
    typeTournoi: typeTournoi,
    avecTerrains: avecTerrains,
    createAt: 0,
    updatedAt: 0,
  };
}

function toNewMatch(
  matchModel: MatchModel,
  matchId: number,
  tournoiId: number,
  equipe1Id: number,
  equipe2Id: number,
): NewMatch {
  const { manche, mancheName, terrain } = matchModel;

  return {
    matchId: matchId,
    tournoiId: tournoiId,
    tourId: manche,
    tourName: mancheName,
    equipe1: equipe1Id,
    equipe2: equipe2Id,
    terrainId: terrain?.id,
  };
}

function toNewEquipe(equipeId: number): NewEquipe {
  return {
    equipeId: equipeId,
  };
}

function toNewEquipesJoueurs(
  equipeId: number,
  joueurId: number,
): NewEquipesJoueurs {
  return {
    joueurId: joueurId,
    equipeId: equipeId,
  };
}

export const useCreateTournoi = () => {
  const addEquipesJoueur = async (
    equipeId: number,
    equipeMatch: EquipeType,
  ) => {
    equipeMatch.map(async (joueurEquipe) => {
      if (joueurEquipe && joueurEquipe !== -1) {
        await EquipesJoueursRepository.insert(
          toNewEquipesJoueurs(equipeId, joueurEquipe.id),
        );
      }
    });
  };

  const addEquipes = async (equipesMatch: EquipesType) => {
    // TODO Problème : va insérer des équipes qui peuvent déjà être présentes
    const equipe1 = await EquipeRepository.insert(toNewEquipe(0));
    addEquipesJoueur(equipe1.id, equipesMatch[0]);

    const equipe2 = await EquipeRepository.insert(toNewEquipe(1));
    addEquipesJoueur(equipe2.id, equipesMatch[1]);

    return { equipe1, equipe2 };
  };

  const addTournoi = async (
    preparationTournoiModel: PreparationTournoiModel,
  ): Promise<Tournoi> => {
    return (
      await TournoisRepository.insertTournoiV2(
        toNewTournoi(preparationTournoiModel),
      )
    )[0] as Tournoi;
  };

  const addMatchs = async (matchModels: MatchModel[], tournoiId: number) => {
    const newMatchs = await Promise.all(
      matchModels.map(async (matchModel, index) => {
        const { equipe1, equipe2 } = await addEquipes(matchModel.equipe);
        return toNewMatch(matchModel, index, tournoiId, equipe1.id, equipe2.id);
      }),
    );
    await MatchsRepository.insertMatch(newMatchs);
  };

  const clearPreparationTournois = async () => {
    await JoueursPreparationTournoisRepository.deleteAll();
    await TerrainsPreparationTournoisRepository.deleteAll();
    await PreparationTournoisRepository.delete();
  };

  return {
    addEquipes,
    addTournoi,
    addMatchs,
    clearPreparationTournois,
  };
};
