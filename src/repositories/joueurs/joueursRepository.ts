import { equipesJoueurs, joueurs, joueursListes, NewJoueur } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { JoueurType } from '@/types/enums/joueurType';
import { eq, inArray, sql } from 'drizzle-orm';

export interface Joueur_EquipesJoueurs {
  j_equipe: number | null;
  j_id: number;
  j_isChecked: boolean | null;
  j_joueurId: number;
  j_name: string;
  j_type: JoueurType | null;
}

export const JoueursRepository = {
  getAll() {
    return getDrizzleDb().select().from(joueurs);
  },

  async insert(newJoueur: NewJoueur) {
    const result = (
      await getDrizzleDb().insert(joueurs).values(newJoueur).returning()
    ).at(0);
    if (!result) {
      throw new Error('Insert operation returned undefined');
    }
    return result;
  },

  insertMultiples(newJoueurs: NewJoueur[]) {
    return getDrizzleDb().insert(joueurs).values(newJoueurs).returning();
  },

  delete(id: number[]) {
    return getDrizzleDb().delete(joueurs).where(inArray(joueurs.id, id));
  },

  deleteAll() {
    return getDrizzleDb().delete(joueurs);
  },

  updateName(id: number, name: string) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ name })
      .where(eq(joueurs.id, id));
  },

  updateJoueurId(id: number, joueurId: number) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ joueurId })
      .where(eq(joueurs.id, id));
  },

  updateCheck(id: number, isChecked: boolean) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ isChecked })
      .where(eq(joueurs.id, id));
  },

  updateEquipe(id: number, equipeId: number) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ equipe: equipeId })
      .where(eq(joueurs.id, id));
  },

  async select(uniqueBDDId: number) {
    const result = (
      await getDrizzleDb()
        .select()
        .from(joueurs)
        .where(eq(joueurs.id, uniqueBDDId))
    ).at(0);
    if (!result) {
      throw new Error('Joueur not found');
    }
    return result;
  },

  getEquipes(equipeIds: number[]) {
    return getDrizzleDb()
      .select({
        joueurs: {
          j_equipe: sql<number | null>`${joueurs.equipe}`.as('j_equipe'),
          j_id: sql<number>`${joueurs.id}`.as('j_id'),
          j_isChecked: sql<boolean | null>`${joueurs.isChecked}`.as(
            'j_isChecked',
          ),
          j_joueurId: sql<number>`${joueurs.joueurId}`.as('j_joueurId'),
          j_name: sql<string>`${joueurs.name}`.as('j_name'),
          j_type: sql<JoueurType | null>`${joueurs.type}`.as('j_type'),
        },
        equipes_joueurs: {
          ej_equipeId: sql<number>`${equipesJoueurs.equipeId}`.as(
            'ej_equipeId',
          ),
          ej_id: sql<number>`${equipesJoueurs.id}`.as('ej_id'),
          ej_joueurId: sql<number>`${equipesJoueurs.joueurId}`.as(
            'ej_joueurId',
          ),
        },
      })
      .from(joueurs)
      .where(inArray(equipesJoueurs.equipeId, equipeIds))
      .innerJoin(equipesJoueurs, eq(equipesJoueurs.joueurId, joueurs.id));
  },

  getJoueursListe(listeId: number) {
    return getDrizzleDb()
      .select({
        equipe: joueurs.equipe,
        id: joueurs.id,
        isChecked: joueurs.isChecked,
        joueurId: joueurs.joueurId,
        name: joueurs.name,
        type: joueurs.type,
      })
      .from(joueurs)
      .where(eq(joueursListes.listeId, listeId))
      .innerJoin(joueursListes, eq(joueursListes.joueurId, joueurs.id));
  },
};
