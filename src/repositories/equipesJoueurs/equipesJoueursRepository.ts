import {
  EquipesJoueurs,
  equipesJoueurs,
  NewEquipesJoueurs,
} from '@/db/schema/equipesJoueurs';
import { stampForDelete, stampForSync } from '@/db/sync/stampForSync';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { uuidv7 } from '@/utils/uuid/uuidv7';
import { JoueurType } from '@/types/enums/joueurType';
import { inArray } from 'drizzle-orm';

export type FullEquipeJoueur = {
  equipes_joueurs: {
    id: string;
    joueurId: string;
    equipeId: string;
  };
  joueurs: {
    id: string;
    joueurId: number;
    name: string;
    type: JoueurType | null;
    equipe: number | null;
    isChecked: boolean | null;
  };
};

export const EquipesJoueursRepository = {
  async insert(newEquipesJoueurs: NewEquipesJoueurs): Promise<EquipesJoueurs> {
    return (
      await getDrizzleDb()
        .insert(equipesJoueurs)
        .values({ ...newEquipesJoueurs, id: uuidv7(), ...stampForSync() })
        .returning()
    )[0];
  },

  delete(idlist: string[]) {
    return getDrizzleDb()
      .update(equipesJoueurs)
      .set(stampForDelete())
      .where(inArray(equipesJoueurs.id, idlist));
  },

  deleteAll() {
    return getDrizzleDb().delete(equipesJoueurs);
  },
};
