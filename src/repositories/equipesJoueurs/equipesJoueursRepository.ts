import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import {
  EquipesJoueurs,
  equipesJoueurs,
  NewEquipesJoueurs,
} from '@/db/schema/equipesJoueurs';

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
