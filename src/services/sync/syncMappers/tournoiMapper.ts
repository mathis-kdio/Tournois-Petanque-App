import { NewTournoi, Tournoi } from '@/db/schema';

export interface TournoiPostgresRow {
  id: string;
  name: string;
  nb_tours: number;
  nb_matchs: number;
  nb_pt_victoire: number;
  speciaux_incompatibles: boolean;
  memes_equipes: boolean;
  memes_adversaires: number;
  type_equipes: string;
  type_tournoi: string;
  avec_terrains: boolean;
  mode: string;
  est_tournoi_actuel: boolean;
  create_at: string;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  deleted_at: string | null;
  server_updated_at: string;
}

export function tournoiToPostgres(
  row: Tournoi,
  userId: string,
): Omit<TournoiPostgresRow, 'deleted_at' | 'server_updated_at'> {
  return {
    id: row.id,
    name: row.name,
    nb_tours: row.nbTours,
    nb_matchs: row.nbMatchs,
    nb_pt_victoire: row.nbPtVictoire,
    speciaux_incompatibles: row.speciauxIncompatibles,
    memes_equipes: row.memesEquipes,
    memes_adversaires: row.memesAdversaires,
    type_equipes: row.typeEquipes,
    type_tournoi: row.typeTournoi,
    avec_terrains: row.avecTerrains,
    mode: row.mode,
    est_tournoi_actuel: row.estTournoiActuel,
    create_at: row.createAt.toISOString(),
    user_id: userId,
    updated_at: row.updatedAt.toISOString(),
    deleted: row.deleted,
  };
}

export function tournoiFromPostgres(row: TournoiPostgresRow): NewTournoi {
  return {
    id: row.id,
    name: row.name,
    nbTours: row.nb_tours,
    nbMatchs: row.nb_matchs,
    nbPtVictoire: row.nb_pt_victoire,
    speciauxIncompatibles: row.speciaux_incompatibles,
    memesEquipes: row.memes_equipes,
    memesAdversaires: row.memes_adversaires,
    typeEquipes: row.type_equipes as NewTournoi['typeEquipes'],
    typeTournoi: row.type_tournoi as NewTournoi['typeTournoi'],
    avecTerrains: row.avec_terrains,
    mode: row.mode as NewTournoi['mode'],
    estTournoiActuel: row.est_tournoi_actuel,
    createAt: new Date(row.create_at),
    updatedAt: new Date(row.updated_at),
    synced: true,
    deleted: row.deleted,
  };
}
