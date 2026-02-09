import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  EquipesJoueurs,
  equipesJoueurs,
  NewEquipesJoueurs,
} from '@/db/schema/equipesJoueurs';
import { eq, inArray } from 'drizzle-orm';
import { joueurs } from '@/db/schema';
import { JoueurType } from '@/types/enums/joueurType';

export type FullEquipeJoueur = {
  equipes_joueurs: {
    id: number;
    joueurId: number;
    equipeId: number;
  };
  joueurs: {
    id: number;
    joueurId: number;
    name: string;
    type: JoueurType | null;
    equipe: number | null;
    isChecked: boolean | null;
  };
};

export const EquipesJoueursRepository = {
  getEquipes(equipeIds: number[]) {
    return getDrizzleDb()
      .select()
      .from(equipesJoueurs)
      .where(inArray(equipesJoueurs.equipeId, equipeIds))
      .innerJoin(joueurs, eq(joueurs.id, equipesJoueurs.joueurId));
  },

  async insert(newEquipesJoueurs: NewEquipesJoueurs): Promise<EquipesJoueurs> {
    return (
      await getDrizzleDb()
        .insert(equipesJoueurs)
        .values(newEquipesJoueurs)
        .returning()
    )[0];
  },
};
