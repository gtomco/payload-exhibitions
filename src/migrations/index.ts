import * as migration_20260616_203057 from './20260616_203057';
import * as migration_20260616_213008 from './20260616_213008';
import * as migration_20260710_105802_microsites_context from './20260710_105802_microsites_context';
import * as migration_20260710_140000_microsite_phase2 from './20260710_140000_microsite_phase2';
import * as migration_20260710_140001_microsite_settings_rels from './20260710_140001_microsite_settings_rels';
import * as migration_20260710_140002_search_microsite_column from './20260710_140002_search_microsite_column';
import * as migration_20260710_150000_microsite_nav_gallery from './20260710_150000_microsite_nav_gallery';
import * as migration_20260710_150001_pages_blocks_banner from './20260710_150001_pages_blocks_banner';
import * as migration_20260710_150002_pages_v_gallery_blocks from './20260710_150002_pages_v_gallery_blocks';
import * as migration_20260710_150003_microsite_settings_crm from './20260710_150003_microsite_settings_crm';
import * as migration_20260710_150004_crm_event_name from './20260710_150004_crm_event_name';
import * as migration_20260710_160000_microsite_theme from './20260710_160000_microsite_theme';
import * as migration_20260722_140000_nav_page_relationships from './20260722_140000_nav_page_relationships';
import * as migration_20260723_010000_main_site from './20260723_010000_main_site';
import * as migration_20260723_020000_main_site_expand from './20260723_020000_main_site_expand';
import * as migration_20260723_030000_visitors from './20260723_030000_visitors';

export const migrations = [
  {
    up: migration_20260616_203057.up,
    down: migration_20260616_203057.down,
    name: '20260616_203057',
  },
  {
    up: migration_20260616_213008.up,
    down: migration_20260616_213008.down,
    name: '20260616_213008',
  },
  {
    up: migration_20260710_105802_microsites_context.up,
    down: migration_20260710_105802_microsites_context.down,
    name: '20260710_105802_microsites_context',
  },
  {
    up: migration_20260710_140000_microsite_phase2.up,
    down: migration_20260710_140000_microsite_phase2.down,
    name: '20260710_140000_microsite_phase2',
  },
  {
    up: migration_20260710_140001_microsite_settings_rels.up,
    down: migration_20260710_140001_microsite_settings_rels.down,
    name: '20260710_140001_microsite_settings_rels',
  },
  {
    up: migration_20260710_140002_search_microsite_column.up,
    down: migration_20260710_140002_search_microsite_column.down,
    name: '20260710_140002_search_microsite_column',
  },
  {
    up: migration_20260710_150000_microsite_nav_gallery.up,
    down: migration_20260710_150000_microsite_nav_gallery.down,
    name: '20260710_150000_microsite_nav_gallery',
  },
  {
    up: migration_20260710_150001_pages_blocks_banner.up,
    down: migration_20260710_150001_pages_blocks_banner.down,
    name: '20260710_150001_pages_blocks_banner',
  },
  {
    up: migration_20260710_150002_pages_v_gallery_blocks.up,
    down: migration_20260710_150002_pages_v_gallery_blocks.down,
    name: '20260710_150002_pages_v_gallery_blocks',
  },
  {
    up: migration_20260710_150003_microsite_settings_crm.up,
    down: migration_20260710_150003_microsite_settings_crm.down,
    name: '20260710_150003_microsite_settings_crm',
  },
  {
    up: migration_20260710_150004_crm_event_name.up,
    down: migration_20260710_150004_crm_event_name.down,
    name: '20260710_150004_crm_event_name',
  },
  {
    up: migration_20260710_160000_microsite_theme.up,
    down: migration_20260710_160000_microsite_theme.down,
    name: '20260710_160000_microsite_theme',
  },
  {
    up: migration_20260722_140000_nav_page_relationships.up,
    down: migration_20260722_140000_nav_page_relationships.down,
    name: '20260722_140000_nav_page_relationships',
  },
  {
    up: migration_20260723_010000_main_site.up,
    down: migration_20260723_010000_main_site.down,
    name: '20260723_010000_main_site',
  },
  {
    up: migration_20260723_020000_main_site_expand.up,
    down: migration_20260723_020000_main_site_expand.down,
    name: '20260723_020000_main_site_expand',
  },
  {
    up: migration_20260723_030000_visitors.up,
    down: migration_20260723_030000_visitors.down,
    name: '20260723_030000_visitors',
  },
]
