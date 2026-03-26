import {
  Joueur,
  joueursSuggestion,
  NewJoueur,
  NewJoueursListes,
  NewJoueursPreparationTournois,
  NewPreparationTournoi,
  NewTournoi,
} from '@/db/schema';
import { NewEquipe } from '@/db/schema/equipe';
import { NewEquipesJoueurs } from '@/db/schema/equipesJoueurs';
import { NewMatch } from '@/db/schema/match';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';

import { EquipeRepository } from '@/repositories/equipe/equipeRepository';
import { EquipesJoueursRepository } from '@/repositories/equipesJoueurs/equipesJoueursRepository';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursListesRepository } from '@/repositories/joueursListes/joueursListesRepository';
import { JoueursPreparationTournoisRepository } from '@/repositories/joueursPreparationTournois/joueursPreparationTournoiRepository';
import { JoueursSuggestionRepository } from '@/repositories/joueursSuggestion/joueursSuggestionRepository';
import { ListesJoueursRepository } from '@/repositories/listesJoueurs/listesJoueursRepository';
import { MatchsRepository } from '@/repositories/matchs/matchsRepository';
import { PreparationTournoisRepository } from '@/repositories/preparationTournoi/preparationTournoiRepository';
import { TerrainsRepository } from '@/repositories/terrains/terrainsRepository';
import { TerrainsPreparationTournoisRepository } from '@/repositories/terrainsPreparationTournois/terrainsPreparationTournoiRepository';
import { TournoisRepository } from '@/repositories/tournois/tournoisRepository';
import { Complement } from '@/types/enums/complement';
import { JoueurType } from '@/types/enums/joueurType';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';

// Redux state types
interface ReduxListesJoueurs {
  avecNoms: ReduxJoueur[];
  sansNoms: ReduxJoueur[];
  avecEquipes: ReduxJoueur[];
  historique: ReduxHistoriqueJoueurs[];
  sauvegarde: ReduxJoueur[];
}

type ReduxJoueur = {
  id: number;
  name: string;
  type?: JoueurType | undefined;
  equipe?: number | undefined;
  isChecked?: boolean;
};

type ReduxHistoriqueJoueurs = {
  id: number;
  name: string;
  nbTournois: number;
};

type ReduxListesSauvegardeJoueurs = {
  id: number;
  name: string;
  type: JoueurType | '';
  equipe: number;
};

type ReduxListesSauvegarde = {
  avecNoms: (ReduxListesSauvegardeJoueurs | ListeJoueursInfos)[][];
};

type ReduxTournament = {
  tournoi: ReduxTournoi;
  tournoiId: number;
  creationDate: string;
  updateDate: string;
  name?: string;
};

type ReduxMatch = {
  id: number;
  manche: number;
  equipe: [[number, number, number, number], [number, number, number, number]];
  score1: number;
  score2: number;
  terrain: {
    id: number;
    name: string;
  };
  mancheName?: string;
};

type ReduxTournoiOptions = {
  tournoiID: number;
  nbTours: number;
  nbMatchs: number;
  nbPtVictoire: number;
  speciauxIncompatibles: boolean;
  memesEquipes: boolean;
  memesAdversaires: MemesAdversairesType;
  typeEquipes: TypeEquipes;
  typeTournoi: TypeTournoi;
  listeJoueurs: ReduxJoueur[];
  avecTerrains: boolean;
  mode: ModeTournoi.AVECNOMS | ModeTournoi.SANSNOMS | ModeTournoi.AVECEQUIPES;
};

type ReduxTournoi = (ReduxMatch | ReduxTournoiOptions)[];

type ReduxOptionsPreparationTournoi = {
  avecTerrains: boolean;
  memesAdversaires: MemesAdversairesType;
  memesEquipes: boolean;
  mode: ModeTournoi;
  modeCreationEquipes: ModeCreationEquipes | null;
  nbPtVictoire: number;
  nbTours: number;
  speciauxIncompatibles: boolean;
  type: TypeTournoi | null;
  typeEquipes: TypeEquipes;
  complement?: Complement;
};

type ReduxTerrain = {
  id: number;
  name: string;
};

export class DataMigrationService {
  static async migrateDataFromRedux(
    listesJoueurs: ReduxListesJoueurs,
    listesSauvegarde: ReduxListesSauvegarde,
    listeTournois: ReduxTournament[],
    listeMatchs: ReduxTournoi,
    optionsTournoi: ReduxOptionsPreparationTournoi,
    listeTerrains: ReduxTerrain[],
  ): Promise<boolean> {
    // Check if migration already completed
    const migrationCompleted = await this.checkMigrationCompleted();
    if (migrationCompleted) {
      console.log('Migration déjà complète');
      return false;
    }

    try {
      console.log('Début de la migration');

      //Migrate Preparation Tournoi Options
      await this.migratePreparationTournoi(optionsTournoi);

      // Migrate Joueurs Preparation Tournoi
      await this.migrateJoueursPreparationTournoi(listesJoueurs);

      // Migrate player lists
      await this.migratePlayerLists(listesSauvegarde); // TODO différence entre state.listesJoueurs.listesSauvegarde et state.listesJoueurs.listesJoueurs.sauvegarde ???

      // Migrate tournaments
      await this.migrateTournaments(listeTournois);

      // Set actual tournament
      await this.setActualTournament(listeMatchs);

      // Migrate terrains
      await this.migrateTerrainsPreparationTournois(listeTerrains);

      // Migrate player suggestions from historique
      await this.migratePlayerSuggestions(listesJoueurs.historique);

      console.log('Fin de la migration avec succès');
      return true;
    } catch (error) {
      console.error('Echec de la migration:', error);
      return false;
    }
  }

  private static async checkMigrationCompleted(): Promise<boolean> {
    const db = getDrizzleDb();
    // Check if we have any data in the database
    const playerCount = await db.select().from(joueursSuggestion).limit(1);
    return playerCount.length > 0;
  }

  private static async migrateJoueursPreparationTournoi(
    listesJoueurs: ReduxListesJoueurs,
  ): Promise<void> {
    console.log('Début migration joueurs preparation tournoi');

    // Combine all player lists
    const allPlayers =
      listesJoueurs.avecEquipes.length !== 0
        ? listesJoueurs.avecEquipes
        : listesJoueurs.avecNoms;

    if (allPlayers.length === 0) {
      console.log('Aucun joueur preparation tournoi à migrer');
      return;
    }

    const playersToInsert: NewJoueur[] = allPlayers.map((player) => {
      return {
        joueurId: player.id,
        name: player.name,
        type: player.type,
        equipe: player.equipe || 0,
        isChecked: player.isChecked || false,
      };
    });

    const joueurs = await JoueursRepository.insertMultiples(playersToInsert);
    const joueursPreparationTournois: NewJoueursPreparationTournois[] =
      joueurs.map((joueur) => {
        return {
          joueurId: joueur.id,
          preparationTournoiId: 0,
        };
      });
    await JoueursPreparationTournoisRepository.insert(
      joueursPreparationTournois,
    );
    console.log(
      `Fin migration joueurs preparation tournoi (${playersToInsert.length})`,
    );
  }

  private static async migratePlayerLists(
    listesSauvegarde: ReduxListesSauvegarde,
  ) {
    console.log('Début migration liste joueurs');

    // Migrate saved lists first
    for (const savedList of listesSauvegarde.avecNoms) {
      const listeJoueursInfos = savedList.at(-1) as ListeJoueursInfos;
      const listeJoueur = savedList.splice(
        -1,
      ) as ReduxListesSauvegardeJoueurs[];
      const listName = listeJoueursInfos?.name || '';
      const listId = listeJoueursInfos.listId;

      // Insert de la liste
      const newList = await ListesJoueursRepository.insertListeJoueurs({
        id: listId,
        name: listName,
        updatedAt: Date.now(),
        synced: 0,
      });
      await this.migrateJoueursListe(listeJoueur, newList[0].id);
    }
    console.log(
      `Fin migration liste joueurs (${listesSauvegarde.avecNoms.length})`,
    );
  }

  private static async migrateJoueursListe(
    listeJoueur: ReduxListesSauvegardeJoueurs[],
    listeId: number,
  ) {
    if (listeJoueur.length === 0) {
      return;
    }
    // Insertion joueurs de la liste
    const listeNewJoueur: NewJoueur[] = listeJoueur.map((joueur) => {
      return {
        joueurId: joueur.id,
        name: joueur.name,
        type:
          joueur.type.length !== 0 ? (joueur.type as JoueurType) : undefined,
        equipe: joueur.equipe,
        isChecked: false,
      };
    });
    const joueurs = await JoueursRepository.insertMultiples(listeNewJoueur);
    const joueursListes = joueurs.map((joueur) => {
      return {
        joueurId: joueur.id,
        listeId: listeId,
      } as NewJoueursListes;
    });
    await JoueursListesRepository.insertMultiple(joueursListes);
  }

  private static async migrateTournaments(
    listeTournois: ReduxTournament[],
  ): Promise<void> {
    console.log('Début migration tournois');

    if (listeTournois.length === 0) {
      console.log('Aucun tournoi à migrer');
      return;
    }

    for (const tournoiData of listeTournois) {
      const tournoiId = tournoiData.tournoiId;
      const tournoiName = tournoiData.name || `${tournoiId}`;

      console.log(`Début migration tournoi: ${tournoiName} (ID: ${tournoiId})`);
      // Extract tournament options from the tournament data
      const options = tournoiData.tournoi.at(-1) as ReduxTournoiOptions;

      const newTournoi: NewTournoi = {
        id: tournoiId,
        name: tournoiName,
        nbTours: options.nbTours,
        nbMatchs: options.nbMatchs,
        nbPtVictoire: options.nbPtVictoire || 13,
        speciauxIncompatibles: options.speciauxIncompatibles || false,
        memesEquipes: options.memesEquipes || false,
        memesAdversaires: options.memesAdversaires || 50,
        typeEquipes: options.typeEquipes,
        typeTournoi: options.typeTournoi,
        avecTerrains: options.avecTerrains || false,
        mode: options.mode || ModeTournoi.AVECNOMS,
        estTournoiActuel: false,
        createAt: new Date(tournoiData.creationDate).getTime(),
        updatedAt: new Date(tournoiData.updateDate).getTime(),
      };

      await TournoisRepository.insertTournoi(newTournoi);

      console.log(`Début migration joueurs tournoi ${tournoiId}`);
      const joueurs = await this.migrateTournamentPlayers(options.listeJoueurs);
      console.log(`Fin migration joueurs tournoi`);

      console.log(`Début migration matchs tournoi ${tournoiId}`);
      const matches = tournoiData.tournoi.slice(0, -1) as ReduxMatch[];
      await this.migrateTournamentMatches(tournoiId, matches, joueurs);
      console.log(`Fin migration matchs tournoi`);
      console.log(`Fin migration tournoi: ${tournoiName} (ID: ${tournoiId})`);
    }
    console.log('Fin migration tournois');
  }

  private static async migrateTournamentPlayers(
    joueurs: ReduxJoueur[],
  ): Promise<Joueur[]> {
    const playersToInsert: NewJoueur[] = joueurs.map((joueur) => ({
      joueurId: joueur.id,
      name: joueur.name,
      type: joueur.type,
      equipe: joueur.equipe,
      isChecked: joueur.isChecked || false,
    }));

    return await JoueursRepository.insertMultiples(playersToInsert);
  }

  private static async migrateTournamentMatches(
    tournoiId: number,
    matches: ReduxMatch[],
    joueurs: Joueur[],
  ): Promise<void> {
    let nextTeamId = 1;
    for (const matchData of matches) {
      // Create teams for this match
      const newTeam1: NewEquipe = {
        equipeId: nextTeamId,
        updatedAt: Date.now(),
        synced: 0,
      };
      nextTeamId++;
      const createdTeam1 = await EquipeRepository.insert(newTeam1);
      const newTeam2: NewEquipe = {
        equipeId: nextTeamId,
        updatedAt: Date.now(),
        synced: 0,
      };
      const createdTeam2 = await EquipeRepository.insert(newTeam2);
      nextTeamId++;

      // Create the match
      const newMatch: NewMatch = {
        matchId: matchData.id,
        tournoiId: tournoiId,
        tourId: matchData.manche,
        tourName: matchData.mancheName || `Tour ${matchData.manche}`,
        equipe1: createdTeam1.id,
        equipe2: createdTeam2.id,
        score1: matchData.score1 || null,
        score2: matchData.score2 || null,
        terrainId: matchData.terrain?.id || null,
        updatedAt: Date.now(),
        synced: 0,
      };

      await MatchsRepository.insertMatch([newMatch]);

      // Associate players with teams
      await this.migrateJoueursEquipes(
        matchData.equipe[0],
        createdTeam1.id,
        joueurs,
      );
      await this.migrateJoueursEquipes(
        matchData.equipe[1],
        createdTeam2.id,
        joueurs,
      );
    }
  }

  private static async migrateJoueursEquipes(
    equipe: [number, number, number, number],
    teamId: number,
    joueurs: Joueur[],
  ): Promise<void> {
    for (const playerId of equipe.filter((id) => id !== -1)) {
      // Find the player in the database
      const joueur = joueurs.find((joueur) => joueur.joueurId === playerId);
      if (!joueur) {
        throw Error('Aucun joueur correspond trouvé');
      }

      // Create the player-team association
      const newEquipeJoueur: NewEquipesJoueurs = {
        joueurId: joueur.id,
        equipeId: teamId,
      };

      await EquipesJoueursRepository.insert(newEquipeJoueur);
    }
  }

  private static async setActualTournament(
    listeMatchs: ReduxTournoi,
  ): Promise<void> {
    console.log('Début migration tournoi actuel');

    if (listeMatchs.length === 0) {
      console.log('Pas de tournoi en cours');
      return;
    }
    const options = listeMatchs.at(-1) as ReduxTournoiOptions;
    await TournoisRepository.setActualTournoi(options.tournoiID, true);

    console.log('Fin migration tournoi actuel');
  }

  private static async migratePreparationTournoi(
    optionsTournoi: ReduxOptionsPreparationTournoi,
  ): Promise<void> {
    console.log('Début migration preparation tournoi');

    const preparationData: NewPreparationTournoi = {
      id: 0,
      mode: optionsTournoi.mode,
      nbTours: optionsTournoi.nbTours,
      nbPtVictoire: optionsTournoi.nbPtVictoire,
      speciauxIncompatibles: optionsTournoi.speciauxIncompatibles,
      memesEquipes: optionsTournoi.memesEquipes,
      memesAdversaires: optionsTournoi.memesAdversaires,
      typeEquipes: optionsTournoi.typeEquipes,
      typeTournoi: optionsTournoi.type,
      avecTerrains: optionsTournoi.avecTerrains,
      modeCreationEquipes: optionsTournoi.modeCreationEquipes,
      complement: optionsTournoi.complement,
    };

    await PreparationTournoisRepository.updatePreparationTournoi(
      preparationData,
    );
    console.log('Fin migration preparation tournoi');
  }

  private static async migrateTerrainsPreparationTournois(
    listeTerrains: ReduxTerrain[],
  ): Promise<void> {
    console.log('Début migration terrains');

    if (listeTerrains.length === 0) {
      console.log('Accun terrains à migrer');
      return;
    }

    for (const terrain of listeTerrains) {
      await TerrainsRepository.insert({
        id: terrain.id,
        name: terrain.name,
        updatedAt: Date.now(),
        synced: 0,
      });
      await TerrainsPreparationTournoisRepository.insert({
        preparationTournoiId: 0,
        terrainId: terrain.id,
      });
    }
    console.log(`Fin migration terrains (${listeTerrains.length})`);
  }

  private static async migratePlayerSuggestions(
    historique: ReduxHistoriqueJoueurs[],
  ): Promise<void> {
    console.log('Début migration joueurs suggérés');

    if (historique.length === 0) {
      console.log('Aucun joueur suggéré à migrer');
      return;
    }

    for (const player of historique) {
      await JoueursSuggestionRepository.insertOrUpdateOccurence({
        name: player.name.trim(),
        occurence: player.nbTournois,
        cacher: false,
      });
    }
    console.log(`Fin migration joueurs suggérés (${historique.length})`);
  }
}
