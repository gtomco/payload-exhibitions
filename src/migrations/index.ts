import * as migration_20260616_203057 from './20260616_203057';
import * as migration_20260616_213008 from './20260616_213008';

export const migrations = [
  {
    up: migration_20260616_203057.up,
    down: migration_20260616_203057.down,
    name: '20260616_203057',
  },
  {
    up: migration_20260616_213008.up,
    down: migration_20260616_213008.down,
    name: '20260616_213008'
  },
];
