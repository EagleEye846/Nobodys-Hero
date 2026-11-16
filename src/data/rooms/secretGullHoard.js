// THE GULLS' HOARD (secret): a sandstone cave behind the cove's north cliff where
// the gulls keep everything shiny they have ever borrowed. A heap of spoons and
// buttons, a hand mirror, the inn's dented dinner bell done up in tinsel, a note, a chest (Ves's Sea-Silk Shawl) and a
// purse. Reached from the cove at LOW tide, along the shingle spit to the hole in
// the cliff. Nothing hostile.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  cave top (solid)   W  cave wall (solid)   .  sand floor

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SECRET_GULL_HOARD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_gull_hoard',
  // The room's name, for the Room Editor.
  name: 'THE GULLS\' HOARD',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // A cave, so the cliff cave's soft song (seaDownstairsTheme.js), not Gullrest's bunting.
  music: 'seaDownstairs',
  // The cliff cave's sounds: drips, the sea through the rock, the gulls outside.
  ambience: 'cliff_cave',
  vesWell: true,
  indoors: true,
  // The cliff cave's rock and soft edges (as in the Fishers' Hollow), so it reads as a hollow in the cove's cliff.
  softEdges: true,
  tileLook: 'cliffcave',

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#WWWWWWWWWWWW#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#...........O#',
    '#O...........#',
    '######..######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'gullrest_cove', spawn: { x: 15, y: 3 } },
  ],

  // None.
  cutscenes: [],

  // The heap, a mirror, the inn's dented dinner bell done up in tinsel, a note, a chest and a purse.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'c5_gull_hoard', x: 5, y: 3, text: 'hoard_pile' },
    { sprite: 'mirror', x: 9, y: 3, text: 'hoard_mirror' },
    { sprite: 'c5_dinner_bell', x: 2, y: 4, text: 'hoard_tinsel' },
    { sprite: 'sign', x: 11, y: 6, text: 'hoard_note' },
    { sprite: 'chest', x: 11, y: 4, text: 'hoard_chest', gives: 'sea_silk_shawl', react: true, taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'chest', x: 3, y: 5, text: 'hoard_duffel', gives: 'beachcombers_duffel', react: true, taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'hoard_pouch', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass): stones in the corners, the gulls' marks, shells and a torn net.
    { sprite: 'c5_rock_sunny', x: 1, y: 3, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 12, y: 8, text: 'beach_rocks' },
    { sprite: 'c5_buoy_red', x: 12, y: 3, text: 'beach_buoy' },
    { sprite: 'c5_net_torn', x: 3, y: 5, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 8, y: 6, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 4, y: 8, flat: true, walkable: true },
    { sprite: 'sy_shells', x: 9, y: 7, flat: true, walkable: true },
    { sprite: 'sy_shells', x: 7, y: 4, flat: true, walkable: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.secret_gull_hoard ?? []),
  ],
  tileTexts: { W: 'hoard_wall', '#': 'hoard_wall' },

  npcs: [
  ],
};
