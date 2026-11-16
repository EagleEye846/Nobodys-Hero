// THE BURROW (secret): Marigold's cousin Clover's front room, under the orchard:
// a hearth, a table laid for one (and a much smaller guest), a bed too small for you, a tart in a chest
// and a note. Nothing hostile. Reached from the orchard's bush ring once
// Bramble has pulled the lever.

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SECRET_SUNNY_BURROW = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_sunny_burrow',
  // The room's name, for the Room Editor.
  name: 'THE BURROW',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'hearth',
  vesWell: true,
  indoors: true,

  // The burrow's own look (src/overworld/brightTiles.js, Sunnyside's k, K and q):
  //   k  earth overhead, roots through it (solid)   K  packed-earth wall (solid)
  //   q  swept earth floor   r  the rug
  // The corners are earth too, so the room is rounded like a burrow.
  tiles: [
    'kkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKk',
    'kKKKKKKKKKKKKk',
    'kkqqqqqqqqqqkk',
    'kqqqqrrrrqqqqk',
    'kqqqqrrrrqqqqk',
    'kqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqk',
    'kkqqqqqqqqqqkk',
    'kkkkkkqkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 1, h: 1, to: 'sunny_orchard', spawn: { x: 19, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'fireplace', x: 2, y: 2, text: 'burrow_fire' },
    { sprite: 'table', x: 5, y: 4, text: 'burrow_table' },
    { sprite: 'chair', x: 4, y: 5, text: 'burrow_chair' },
    { sprite: 'bookshelf', x: 9, y: 2, text: 'burrow_shelf' },
    { sprite: 'bed', x: 10, y: 4, text: 'burrow_bed' },
    { sprite: 'chest', x: 11, y: 7, text: 'burrow_chest', gives: 'jam_tart', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'burrow_pouch', gold: 65, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'lamp', x: 7, y: 2, text: 'burrow_lamp' },
    { sprite: 'sign', x: 8, y: 8, text: 'burrow_note' },
    // The pantry's round door in the back wall (shut).
    { sprite: 'sy_round_door', x: 5, y: 2, text: 'burrow_pantry' },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.secret_sunny_burrow ?? []),
  ],
  tileTexts: { K: 'burrow_wall', k: 'burrow_roof' },

  npcs: [
  ],
};
