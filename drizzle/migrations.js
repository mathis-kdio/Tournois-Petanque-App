// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './20260420212648_tiny_molten_man/migration.sql';
import m0001 from './20260929190526_sync_uuid_v7/migration.sql';

export default {
  migrations: {
    '20260420212648_tiny_molten_man': m0000,
    '20260929190526_sync_uuid_v7': m0001,
  },
};
