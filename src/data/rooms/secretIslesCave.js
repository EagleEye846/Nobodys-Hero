// THE TIDY CAVE: a sea cave in the cliff under the rope bridge, its mouth only out of the water
// at low tide. Inside, somebody has swept it. The shingle is raked smooth, the shells are set
// out in rows by size, the rope is coiled just so, and in the middle, on its post, a lantern is
// burning. Beside the lantern a scrap of paper under a pebble says one word: "tidy". (Lantern 6
// of the chapter. Nobody says who lit it; the excuses are plain ones.) A chest (the Darned Jersey), a purse. PUZZLE-FREE,
// no monsters. The way out is the mouth (6,9), and out onto the gully bed (isles_bridge 18,16).
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  cave rock (solid)   q  raked shingle

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SECRET_ISLES_CAVE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_isles_cave',
  // The room's name, for the Room Editor.
  name: 'THE TIDY CAVE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  // The lantern rooms' own quiet song (lanternRoomTheme.js).
  music: 'lanternRoom',
  ambience: 'sea_cave',
  // After chapter 5 the storm is over (`calmAfter`): the same cave sounds and
  // look, but the words switch to their `_calm` sections, like the Soundings.
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  // Under the rock: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  tiles: [
    '##############',
    '##WWWWWWWWWW##',
    '#Wxqqqqqqqqq.#',
    '#..qqqqqqqqq.#',
    '#.qqqqqqqqqqq#',
    '#xqqqqqqqqqq.#',
    '#..qqqqqqqqq.#',
    '#x.qqqqqqqq.x#',
    '##x.qqqqqq.x##',
    '######qq######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Out of the mouth into the gully's west bed, at the foot of the bridge's low point.
    { x: 6, y: 9, w: 2, h: 1, to: 'isles_bridge', spawn: { x: 18, y: 16 } },
  ],

  cutscenes: [
    // (2026-11-14) A piece of the night the Fair Return went down, as soon as you carry the compass piece (the whole room, once).
    { x: 1, y: 2, w: 12, h: 7, scene: 'card_memory', gear: 'compass_card' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // QUEST PIECE 3 (the Fair Return's compass card): tidied away among the shells.
    { sprite: 'gs_compass_card', x: 6, y: 3, text: 'cave_compass', gives: 'compass_card', taken: { gone: true }, notice: true },
    // The lantern (6) and the note.
    { sprite: 'c5_lantern_post_lit', x: 7, y: 4, text: 'cave_lantern', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'il_note_tidy', x: 8, y: 4, text: 'cave_note', walkable: true, flat: true },
    // Everything put away.
    { sprite: 'il_shell_row', x: 2, y: 3, text: 'cave_shells', walkable: true, flat: true },
    { sprite: 'il_shell_row', x: 3, y: 3, text: 'cave_shells', walkable: true, flat: true },
    { sprite: 'c5_rope_coil', x: 11, y: 7, text: 'cave_rope', walkable: true, flat: true },
    { sprite: 'il_broom', x: 12, y: 2, text: 'cave_broom' },
    { sprite: 'c5_crates_stack', x: 2, y: 6, text: 'cave_crates' },
    { sprite: 'c5_chest', x: 11, y: 2, text: 'cave_chest', gives: 'darned_jersey', react: true, taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 7, text: 'cave_pouch', gold: 400, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The drips from the roof, a rock pool the tide leaves, and the weed swept up in a heap by
    // the wall, the way somebody likes it.
    { sprite: 'c5_stalactite_drip', x: 5, y: 2, text: 'cave_rock', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 9, y: 2, text: 'cave_rock', animation: 'c5_stalactite_drip', speed: 0.6 },
    { sprite: 'c5_puddle', x: 9, y: 7, flat: true, walkable: true },
    { sprite: 'c5_seaweed_heap', x: 12, y: 5 },
    { sprite: 'c5_crab_trail', x: 3, y: 5, flat: true, walkable: true },
    // Second pass: more of whoever keeps it: a rug, a shelf, a cairn stacked just so, a pool in the floor.
    { sprite: 'in_rug_blue', x: 6, y: 6, flat: true, walkable: true },
    { sprite: 'il_tidepool_small', x: 4, y: 5, flat: true, walkable: true },
    { sprite: 'il_cairn', x: 12, y: 4, text: 'cave_cairn' },
    { sprite: 'in_shelf_bottles', x: 4, y: 1, text: 'cave_shelf' },
    { sprite: 'il_rocks_flat', x: 9, y: 8, flat: true, walkable: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.secret_isles_cave ?? []),
  ],
  tileTexts: { '#': 'cave_rock', W: 'cave_rock', q: 'cave_floor' },

  // Nobody here.
  npcs: [],
};
