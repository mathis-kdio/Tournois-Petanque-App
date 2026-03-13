import {
  joueursSuggestion,
  NewJoueur,
  NewJoueursListes,
  NewPreparationTournoi,
} from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { JoueursRepository } from '@/repositories/joueurs/joueursRepository';
import { JoueursListesRepository } from '@/repositories/joueursListes/joueursListesRepository';
import { JoueursSuggestionRepository } from '@/repositories/joueursSuggestion/joueursSuggestionRepository';
import { ListesJoueursRepository } from '@/repositories/listesJoueurs/listesJoueursRepository';
import { PreparationTournoisRepository } from '@/repositories/preparationTournoi/preparationTournoiRepository';
import { TerrainsRepository } from '@/repositories/terrains/terrainsRepository';
import { TournoisRepository } from '@/repositories/tournois/tournoisRepository';
import { Complement } from '@/types/enums/complement';
import { JoueurType } from '@/types/enums/joueurType';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import {
  ListeJoueurs,
  ListeJoueursInfos,
} from '@/types/interfaces/listeJoueurs';
import { MemesAdversairesType } from '@/types/interfaces/preparationTournoiModel';

// Redux state types
interface ReduxListesJoueurs {
  avecNoms: ReduxJoueurModel[];
  sansNoms: ReduxJoueurModel[];
  avecEquipes: ReduxJoueurModel[];
  historique: { id: number; name: string; nbTournois: number }[];
  sauvegarde: ReduxJoueurModel[];
}

type ReduxJoueurModel = {
  id: number;
  name: string;
  type: JoueurType | undefined;
  equipe: number | undefined;
  isChecked: boolean;
};

interface ReduxListesSauvegarde {
  avecNoms: ListeJoueurs;
}

interface ReduxTournament {
  tournoi: any[];
  tournoiId: number;
  creationDate: string;
  updateDate: string;
  name?: string;
}

interface ReduxMatch {
  equipe: any[][];
  id: number;
  manche: number;
}

interface ReduxOptionsTournoi {
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
}

interface ReduxTerrain {
  id: number;
  name: string;
}

export class DataMigrationService {
  static async migrateDataFromRedux(
    listesJoueurs: ReduxListesJoueurs,
    listesSauvegarde: ReduxListesSauvegarde,
    listeTournois: ReduxTournament[],
    listeMatchs: ReduxMatch[],
    optionsTournoi: ReduxOptionsTournoi,
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
      /*await this.migratePlayers(listesJoueurs);*/

      // Migrate player lists
      await this.migratePlayerLists(listesSauvegarde);

      // Migrate tournaments
      await this.migrateTournaments(listeTournois);

      // Migrate matches
      /*await this.migrateMatches(listeMatchs);*/

      //Migrate tournament options
      await this.migrateTournamentOptions(optionsTournoi);

      // Migrate terrains (fields)
      /*await this.migrateTerrains(listeTerrains);*/

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
    const allPlayers: JoueurModel[] = [
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
    // Note: The Redux player format might need adjustment based on actual data structure
    const playersToInsert = allPlayers.map((player) => {
      // Handle different player formats from Redux
      const basePlayer: NewJoueur = {
        joueurId: player.id,
        name: player.name || '',
        type: player.type,
        equipe: player.equipe,
        isChecked: player.isChecked || false,
      };

      return basePlayer;
    });

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
    const savedLists = [...listesSauvegarde.avecNoms] as unknown[][];

    for (const savedList of savedLists) {
      const listeJoueursInfos = savedList.at(-1) as ListeJoueursInfos;
      const listeJoueur = savedList.splice(-1) as ReduxJoueurModel[];
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

        // Debug: Log the tournament structure
        console.log(
          `Tournament ${tournoiId} structure:`,
          JSON.stringify(tournoiData.tournoi, null, 2),
        );

        // Extract tournament options from the tournament data
        // Based on the console output, the options seem to be at the end of the tournoi array
        const options =
          tournoiData.tournoi[tournoiData.tournoi.length - 1] || {};

        // Debug: Log extracted options
        console.log(
          `Extracted options for tournament ${tournoiId}:`,
          JSON.stringify(options, null, 2),
        );

        const newTournoi = {
          id: tournoiId,
          name: tournoiName,
          nbTours: options.nbTours || 1,
          nbMatchs: options.nbMatchs || 0,
          nbPtVictoire: options.nbPtVictoire || 13,
          speciauxIncompatibles: options.speciauxIncompatibles || false,
          memesEquipes: options.memesEquipes || false,
          memesAdversaires: options.memesAdversaires || 50,
          typeEquipes: options.typeEquipes || TypeEquipes.DOUBLETTE,
          typeTournoi: options.typeTournoi || TypeTournoi.MELEDEMELE,
          avecTerrains: options.avecTerrains || false,
          mode: options.mode || ModeTournoi.SANSNOMS,
          estTournoiActuel: false, // Default to false for migrated tournaments
          createAt: new Date(tournoiData.creationDate).getTime(),
          updatedAt: new Date(tournoiData.updateDate).getTime(),
        };

        await TournoisRepository.insertTournoi(newTournoi);
        console.log(`Migrated tournament: ${tournoiName} (ID: ${tournoiId})`);
      } catch (error) {
        console.error(
          `Error migrating tournament ${tournoiData.tournoiId}:`,
          error,
        );
        continue;
      }
    }
  }

  private static async migrateMatches(
    listeMatchs: ReduxMatch[],
  ): Promise<void> {
    console.log('Migrating matches...');

    if (listeMatchs.length === 0) {
      console.log('No matches to migrate');
      return;
    }

    // For matches, we need to associate them with tournaments
    // Since we don't have the direct tournament association in the Redux match list,
    // we'll skip match migration for now or associate with the most recent tournament
    console.log(
      'Match migration requires tournament association - skipping for now',
    );
  }

  private static async migrateTournamentOptions(
    optionsTournoi: ReduxOptionsTournoi,
  ): Promise<void> {
    console.log('Migrating tournament options...');

    try {
      const preparationData: NewPreparationTournoi = {
        id: 0,
        nbTours: optionsTournoi.nbTours,
        nbPtVictoire: optionsTournoi.nbPtVictoire,
        speciauxIncompatibles: optionsTournoi.speciauxIncompatibles,
        memesEquipes: optionsTournoi.memesEquipes,
        memesAdversaires: optionsTournoi.memesAdversaires,
        typeTournoi: optionsTournoi.type,
        typeEquipes: optionsTournoi.typeEquipes,
        mode: optionsTournoi.mode,
        modeCreationEquipes: optionsTournoi.modeCreationEquipes,
        complement: optionsTournoi.complement,
        avecTerrains: optionsTournoi.avecTerrains,
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

  private static async migrateTerrains(
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
      }
      console.log(`Migrated ${listeTerrains.length} terrains`);
    } catch (error) {
      console.error('Error migrating terrains:', error);
      throw error;
    }
  }

  private static async migratePlayerSuggestions(
    historique: { id: number; name: string; nbTournois: number }[],
  ): Promise<void> {
    console.log('Migrating player suggestions from historique...');

    if (historique.length === 0) {
      console.log('No player suggestions to migrate');
      return;
    }

    try {
      for (const player of historique) {
        await JoueursSuggestionRepository.insertOrUpdateOccurence({
          name: player.name,
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
