import {
  joueurs,
  joueursSuggestion,
  NewJoueur,
  NewJoueursListes,
  NewPreparationTournoi,
} from '@/db/schema';
import { NewEquipe } from '@/db/schema/equipe';
import { NewEquipesJoueurs } from '@/db/schema/equipesJoueurs';
import { NewMatch } from '@/db/schema/match';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { eq } from 'drizzle-orm';

import { EquipeRepository } from '@/repositories/equipe/equipeRepository';
import { EquipesJoueursRepository } from '@/repositories/equipesJoueurs/equipesJoueursRepository';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursListesRepository } from '@/repositories/joueursListes/joueursListesRepository';
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
  avecNoms: ReduxJoueurModel[];
  sansNoms: ReduxJoueurModel[];
  avecEquipes: ReduxJoueurModel[];
  historique: ReduxHistoriqueJoueurs[];
  sauvegarde: ReduxJoueurModel[];
}

type ReduxJoueurModel = {
  id: number;
  name: string;
  type: JoueurType | undefined;
  equipe: number | undefined;
  isChecked: boolean;
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
  tournoi: any[];
  tournoiId: number;
  creationDate: string;
  updateDate: string;
  name?: string;
};

type ReduxMatch = {
  id: number;
  manche: number;
  equipe: [[number, number, number, number], [number, number, number, number]];
  terrain: {
    id: number;
    name: string;
  };
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
  listeJoueurs: ReduxJoueurModel[];
  avecTerrains: boolean;
  mode: 'avecEquipes';
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
      console.log('Migration already completed, skipping...');
      return false;
    }

    try {
      console.log('Starting data migration from Redux to Drizzle ORM...');

      // Migrate players
      //await this.migratePlayers(listesJoueurs);

      // Migrate player lists
      await this.migratePlayerLists(listesSauvegarde); // TODO différence entre state.listesJoueurs.listesSauvegarde et state.listesJoueurs.listesJoueurs.sauvegarde ???

      // Migrate tournaments
      //await this.migrateTournaments(listeTournois);

      // Set actual tournament
      await this.setActualTournament(listeMatchs);

      //Migrate tournament options
      await this.migrateTournamentOptions(optionsTournoi);

      // Migrate terrains
      await this.migrateTerrainsPreparationTournois(listeTerrains);

      // Migrate player suggestions from historique
      await this.migratePlayerSuggestions(listesJoueurs.historique);

      console.log('Data migration completed successfully!');
      return true;
    } catch (error) {
      console.error('Data migration failed:', error);
      return false;
    }
  }

  private static async checkMigrationCompleted(): Promise<boolean> {
    try {
      const db = getDrizzleDb();
      // Check if we have any data in the database
      const playerCount = await db.select().from(joueursSuggestion).limit(1);
      return playerCount.length > 0;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  private static async migratePlayers(
    listesJoueurs: ReduxListesJoueurs,
  ): Promise<void> {
    console.log('Migrating players...');

    // Combine all player lists
    const allPlayers: ReduxJoueurModel[] = [
      ...listesJoueurs.avecNoms,
      ...listesJoueurs.sansNoms,
      ...listesJoueurs.avecEquipes,
      ...listesJoueurs.sauvegarde,
    ];

    if (allPlayers.length === 0) {
      console.log('No players to migrate');
      return;
    }

    // Convert Redux player format to Drizzle format
    const playersToInsert = allPlayers
      .filter((player) => player.name && player.name.trim() !== '') // Filter out empty names
      .map((player) => {
        const basePlayer: NewJoueur = {
          joueurId: player.id,
          name: player.name.trim(),
          type: player.type,
          equipe: player.equipe || 0,
          isChecked: player.isChecked || false,
        };
        return basePlayer;
      });

    if (playersToInsert.length === 0) {
      console.log('No valid players to migrate');
      return;
    }

    try {
      await JoueursRepository.insertMultiples(playersToInsert);
      console.log(`Migrated ${playersToInsert.length} players`);
    } catch (error) {
      console.error('Error migrating players:', error);
      throw error;
    }
  }

  private static async migratePlayerLists(
    listesSauvegarde: ReduxListesSauvegarde,
  ) {
    console.log('Migrating player lists...');

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

      // Insertion joueurs de la liste
      const listeNewJoueur = listeJoueur.map((joueurModel) => {
        return {
          joueurId: joueurModel.id,
          name: joueurModel.name,
          type: joueurModel.type,
          equipe: joueurModel.equipe,
          isChecked: false,
        } as NewJoueur;
      });
      const joueurs = await JoueursRepository.insertMultiples(listeNewJoueur);
      const joueursListes = joueurs.map((joueur) => {
        return {
          joueurId: joueur.id,
          listeId: newList[0].id,
        } as NewJoueursListes;
      });
      await JoueursListesRepository.insertMultiple(joueursListes);

      console.log(`Migrated saved list: ${listName} (ID: ${listId})`);
    }
  }

  private static async migrateTournaments(
    listeTournois: ReduxTournament[],
  ): Promise<void> {
    console.log('Migrating tournaments...');

    if (listeTournois.length === 0) {
      console.log('No tournaments to migrate');
      return;
    }

    for (const tournoiData of listeTournois) {
      try {
        const tournoiId = tournoiData.tournoiId;
        const tournoiName = tournoiData.name || `Tournoi ${tournoiId}`;

        // Extract tournament options from the tournament data
        const options =
          tournoiData.tournoi[tournoiData.tournoi.length - 1] || {};

        // Validate required fields
        if (!options.nbTours || !options.nbMatchs) {
          console.warn(
            `Skipping tournament ${tournoiId}: missing required fields`,
          );
          continue;
        }

        const newTournoi = {
          id: tournoiId,
          name: tournoiName,
          nbTours: options.nbTours,
          nbMatchs: options.nbMatchs,
          nbPtVictoire: options.nbPtVictoire || 13,
          speciauxIncompatibles: options.speciauxIncompatibles || false,
          memesEquipes: options.memesEquipes || false,
          memesAdversaires: options.memesAdversaires || 50,
          typeEquipes: options.typeEquipes || TypeEquipes.DOUBLETTE,
          typeTournoi: options.typeTournoi || TypeTournoi.MELEDEMELE,
          avecTerrains: options.avecTerrains || false,
          mode: options.mode || ModeTournoi.SANSNOMS,
          estTournoiActuel: false,
          createAt: new Date(tournoiData.creationDate).getTime(),
          updatedAt: new Date(tournoiData.updateDate).getTime(),
        };

        await TournoisRepository.insertTournoi(newTournoi);
        console.log(`Migrated tournament: ${tournoiName} (ID: ${tournoiId})`);

        // Migrate tournament players
        if (options.listeJoueurs && options.listeJoueurs.length > 0) {
          await this.migrateTournamentPlayers(tournoiId, options.listeJoueurs);
        }

        // Migrate tournament matches
        if (tournoiData.tournoi.length > 1) {
          const matches = tournoiData.tournoi.slice(0, -1); // Exclude the last element (options)
          await this.migrateTournamentMatches(tournoiId, matches);
        }
      } catch (error) {
        console.error(
          `Error migrating tournament ${tournoiData.tournoiId}:`,
          error,
        );
        continue;
      }
    }
  }

  private static async migrateTournamentPlayers(
    tournoiId: number,
    players: ReduxJoueurModel[],
  ): Promise<void> {
    console.log(`Migrating players for tournament ${tournoiId}...`);

    const validPlayers = players.filter(
      (player) => player.name && player.name.trim() !== '',
    );

    if (validPlayers.length === 0) {
      console.log(`No valid players to migrate for tournament ${tournoiId}`);
      return;
    }

    try {
      const playersToInsert = validPlayers.map((player) => ({
        joueurId: player.id,
        name: player.name.trim(),
        type: player.type,
        equipe: player.equipe || 0,
        isChecked: false,
      }));

      await JoueursRepository.insertMultiples(playersToInsert);
      console.log(
        `Migrated ${validPlayers.length} players for tournament ${tournoiId}`,
      );
    } catch (error) {
      console.error(
        `Error migrating players for tournament ${tournoiId}:`,
        error,
      );
      throw error;
    }
  }

  private static async migrateTournamentMatches(
    tournoiId: number,
    matches: ReduxMatch[],
  ): Promise<void> {
    console.log(`Migrating matches for tournament ${tournoiId}...`);

    if (matches.length === 0) {
      console.log(`No matches to migrate for tournament ${tournoiId}`);
      return;
    }

    try {
      // Create a map to track created teams
      const teamMap = new Map<number, number>();
      let nextTeamId = 1;

      // Migrate teams and matches
      for (const matchData of matches) {
        const manche = matchData.manche || 1;

        // Create teams for this match
        const teamIds: number[] = [];
        for (const teamPlayers of matchData.equipe) {
          const teamKey = teamPlayers.join('-');

          if (!teamMap.has(teamKey)) {
            // Create new team
            const newTeam: NewEquipe = {
              equipeId: nextTeamId,
              updatedAt: Date.now(),
              synced: 0,
            };
            const createdTeam = await EquipeRepository.insert(newTeam);
            teamMap.set(teamKey, createdTeam.id);
            nextTeamId++;
          }

          teamIds.push(teamMap.get(teamKey)!);
        }

        // Create the match
        const newMatch: NewMatch = {
          matchId: matchData.id,
          tournoiId: tournoiId,
          tourId: manche,
          tourName: `Manche ${manche}`,
          equipe1: teamIds[0],
          equipe2: teamIds[1],
          score1: matchData.score1 || null,
          score2: matchData.score2 || null,
          terrainId: matchData.terrain?.id || null,
          updatedAt: Date.now(),
          synced: 0,
        };

        await MatchsRepository.insertMatch([newMatch]);

        // Associate players with teams
        for (let i = 0; i < matchData.equipe.length; i++) {
          const teamPlayers = matchData.equipe[i];
          const teamId = teamIds[i];

          for (const playerId of teamPlayers.filter((id) => id !== -1)) {
            // Find the player in the database
            const players = await getDrizzleDb()
              .select()
              .from(joueurs)
              .where(eq(joueurs.joueurId, playerId));

            if (players.length > 0) {
              const player = players[0];

              // Create the player-team association
              const newEquipeJoueur: NewEquipesJoueurs = {
                joueurId: player.id,
                equipeId: teamId,
              };

              await EquipesJoueursRepository.insert(newEquipeJoueur);
            }
          }
        }
      }

      console.log(
        `Migrated ${matches.length} matches for tournament ${tournoiId}`,
      );
    } catch (error) {
      console.error(
        `Error migrating matches for tournament ${tournoiId}:`,
        error,
      );
      throw error;
    }
  }

  private static async setActualTournament(
    listeMatchs: ReduxTournoi,
  ): Promise<void> {
    console.log('Migrating actual tournament...');

    if (!listeMatchs) {
      console.log('No actual tournament');
      return;
    }
    const options = listeMatchs.at(-1) as ReduxTournoiOptions;
    await TournoisRepository.setActualTournoi(options.tournoiID, true);

    console.log('Migrated actual tournament');
  }

  private static async migrateTournamentOptions(
    optionsTournoi: ReduxOptionsPreparationTournoi,
  ): Promise<void> {
    console.log('Migrating tournament options...');

    try {
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
      console.log('Migrated tournament options');
    } catch (error) {
      console.error('Error migrating tournament options:', error);
      throw error;
    }
  }

  private static async migrateTerrainsPreparationTournois(
    listeTerrains: ReduxTerrain[],
  ): Promise<void> {
    console.log('Migrating terrains...');

    if (listeTerrains.length === 0) {
      console.log('No terrains to migrate');
      return;
    }

    try {
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
      console.log(`Migrated ${listeTerrains.length} terrains`);
    } catch (error) {
      console.error('Error migrating terrains:', error);
      throw error;
    }
  }

  private static async migratePlayerSuggestions(
    historique: ReduxHistoriqueJoueurs[],
  ): Promise<void> {
    console.log('Migrating player suggestions from historique...');

    if (historique.length === 0) {
      console.log('No player suggestions to migrate');
      return;
    }

    try {
      for (const player of historique) {
        await JoueursSuggestionRepository.insertOrUpdateOccurence({
          name: player.name.trim(),
          occurence: player.nbTournois,
          cacher: false,
        });
      }
      console.log(`Migrated ${historique.length} player suggestions`);
    } catch (error) {
      console.error('Error migrating player suggestions:', error);
      throw error;
    }
  }
}
