import { equipesJoueurs, joueurs, joueursListes, NewJoueur } from '@/db/schema';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { JoueurType } from '@/types/enums/joueurType';
import { and, eq, inArray, sql } from 'drizzle-orm';

export interface Joueur_EquipesJoueurs {
  j_equipe: number | null;
  j_id: string;
  j_isChecked: boolean | null;
  j_joueurId: number;
  j_name: string;
  j_type: JoueurType | null;
}

export const JoueursRepository = {
  getAll() {
    return getDrizzleDb()
      .select()
      .from(joueurs)
      .where(eq(joueurs.deleted, false));
  },

  async insert(newJoueur: NewJoueur) {
    const result = (
      await getDrizzleDb()
        .insert(joueurs)
        .values({ ...newJoueur, ...stampForSync() })
        .returning()
    ).at(0);
    if (!result) {
      throw new Error('Insert operation returned undefined');
    }
    return result;
  },

  insertMultiples(newJoueurs: NewJoueur[]) {
    const values = newJoueurs.map((j) => ({
      ...j,
      ...stampForSync(),
    }));
    return getDrizzleDb().insert(joueurs).values(values).returning();
  },

  delete(id: string[]) {
    return getDrizzleDb()
      .update(joueurs)
      .set(stampForDelete())
      .where(inArray(joueurs.id, id));
  },

  deleteAll() {
    return getDrizzleDb().delete(joueurs);
  },

  softDeleteAll() {
    return getDrizzleDb()
      .update(joueurs)
      .set(stampForDelete())
      .where(eq(joueurs.deleted, false));
  },

  updateName(id: string, name: string) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ name, ...stampForSync() })
      .where(eq(joueurs.id, id));
  },

  updateJoueurId(id: string, joueurId: number) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ joueurId, ...stampForSync() })
      .where(eq(joueurs.id, id));
  },

  updateCheck(id: string, isChecked: boolean) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ isChecked, ...stampForSync() })
      .where(eq(joueurs.id, id));
  },

  updateEquipe(id: string, equipeId: number) {
    return getDrizzleDb()
      .update(joueurs)
      .set({ equipe: equipeId, ...stampForSync() })
      .where(eq(joueurs.id, id));
  },

  async select(uniqueBDDId: string) {
    const result = (
      await getDrizzleDb()
        .select()
        .from(joueurs)
        .where(and(eq(joueurs.id, uniqueBDDId), eq(joueurs.deleted, false)))
    ).at(0);
    if (!result) {
      throw new Error('Joueur not found');
    }
    return result;
  },

  getEquipes(equipeIds: string[]) {
    return getDrizzleDb()
      .select({
        joueurs: {
          j_equipe: sql<number | null>`${joueurs.equipe}`.as('j_equipe'),
          j_id: sql<string>`${joueurs.id}`.as('j_id'),
          j_isChecked: sql<boolean | null>`${joueurs.isChecked}`.as(
            'j_isChecked',
          ),
          j_joueurId: sql<number>`${joueurs.joueurId}`.as('j_joueurId'),
          j_name: sql<string>`${joueurs.name}`.as('j_name'),
          j_type: sql<JoueurType | null>`${joueurs.type}`.as('j_type'),
        },
        equipes_joueurs: {
          ej_equipeId: sql<string>`${equipesJoueurs.equipeId}`.as(
            'ej_equipeId',
          ),
          ej_id: sql<string>`${equipesJoueurs.id}`.as('ej_id'),
          ej_joueurId: sql<string>`${equipesJoueurs.joueurId}`.as(
            'ej_joueurId',
          ),
        },
      })
      .from(joueurs)
      .where(
        and(
          inArray(equipesJoueurs.equipeId, equipeIds),
          eq(joueurs.deleted, false),
          eq(equipesJoueurs.deleted, false),
        ),
      )
      .innerJoin(equipesJoueurs, eq(equipesJoueurs.joueurId, joueurs.id));
  },

  getJoueursListe(listeId: string) {
    return getDrizzleDb()
      .select({
        equipe: joueurs.equipe,
        id: joueurs.id,
        isChecked: joueurs.isChecked,
        joueurId: joueurs.joueurId,
        name: joueurs.name,
        type: joueurs.type,
      })
      .from(joueursListes)
      .where(
        and(
          eq(joueursListes.listeId, listeId),
          eq(joueursListes.deleted, false),
          eq(joueurs.deleted, false),
        ),
      )
      .innerJoin(joueurs, eq(joueurs.id, joueursListes.joueurId));
  },
};
