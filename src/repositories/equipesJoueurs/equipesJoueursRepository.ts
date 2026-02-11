import {
  EquipesJoueurs,
  equipesJoueurs,
  NewEquipesJoueurs,
} from '@/db/schema/equipesJoueurs';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
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
  async insert(newEquipesJoueurs: NewEquipesJoueurs): Promise<EquipesJoueurs> {
    return (
      await getDrizzleDb()
        .insert(equipesJoueurs)
        .values(newEquipesJoueurs)
        .returning()
    )[0];
  },
};
