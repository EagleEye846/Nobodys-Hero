// THE REGISTRY (a secret, Chapter 3): the hall where the old city's Welcome
// Register was kept: one great ledger of everyone who promised to be present
// on the day the Hero came, on a stand at the heart of it, counted every night.
// A splinter of the Fallen Star went into its binding, and now it counts by
// itself: QUIRE (src/data/enemies/tally.js), the star-touched guardian of
// Chapter 3's star shard. A save crystal stands by the door. Walking up the
// hall plays `tally_wakes`, the fight. Both ways out of it give you the shard,
// and a stair on the east wall leads back out to the Old Street.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   b  old stone step (the dais the Register's stand is on: jump up onto it)
//   W  the old city's stone wall (solid)
import { LIFE3C_PROPS } from '../lifePass3c.js';
export const REGISTRY_LAIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'registry_lair',
  // The room's name, for the Room Editor.
  name: 'THE REGISTRY',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "Counted Every Night" (src/data/music/registryArchiveTheme.js), the
  // detour's song, built from the Register's own fight. (It was "A Book Left
  // Open", openBook, before.)
  music: 'registryArchive',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  gloom: 0.25,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#............J...............#',
    '#......I..............I......#',
    '#............................#',
    '#............................#',
    '#............................#',
    '..............................',
    '..................bbb.........',
    '#.................bbb........#',
    '#...J.....................J..#',
    '#............................#',
    '#......I..............I......#',
    '#..J............J............#',
    '#............................#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'registry_waiting', spawn: { x: 20, y: 5 } },
    { x: 29, y: 9, w: 1, h: 2, to: 'city_old_street', spawn: { x: 26, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // The hall, from the column past the save crystal: the Register wakes.
    { x: 10, y: 4, w: 1, h: 13, scene: 'tally_wakes' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'savepoint', x: 3, y: 6, save: true },
    // The Register on its stand, shut, until it wakes; after, what's left of it.
    { sprite: 'book_stand', x: 19, y: 10, text: 'registry_stand', until: 'tally_wakes' },
    { sprite: 'book_stand', x: 19, y: 10, text: 'registry_stand_after', after: ['tally_spared'] },
    { sprite: 'book_heap', x: 19, y: 10, text: 'registry_ruin', after: ['tally_beaten'] },
    { sprite: 'bookshelf', x: 4, y: 4, text: 'registry_shelves' },
    { sprite: 'bookshelf', x: 6, y: 4, text: 'registry_shelves' },
    { sprite: 'bookshelf', x: 22, y: 4, text: 'registry_shelves' },
    { sprite: 'bookshelf', x: 25, y: 4, text: 'registry_shelves' },
    { sprite: 'book_heap', x: 5, y: 15, text: 'stacks_heap' },
    { sprite: 'book_heap', x: 25, y: 15, text: 'stacks_heap' },
    { sprite: 'scorch_mark', x: 15, y: 8, text: 'cleft_scorch', walkable: true, light: 18 },
    { sprite: 'inscription', x: 14, y: 4, text: 'registry_inscription' },
    { sprite: 'gold_pouch', x: 27, y: 6, text: 'registry_purse', gold: 420, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The life pass, round 2 (15 November 2026).
    ...(LIFE3C_PROPS['registry_lair'] ?? []),
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', I: 'city_pillar', J: 'city_pillar' },

  // Only the Register. It has all the company it needs.
  npcs: [],
};
