import m0000 from './20260420212648_tiny_molten_man/migration.sql';
import m0001 from './20260530000000_fix_null_joueur_names/migration.sql';

export default {
  migrations: {
    '20260420212648_tiny_molten_man': m0000,
    '20260530000000_fix_null_joueur_names': m0001,
  },
};
