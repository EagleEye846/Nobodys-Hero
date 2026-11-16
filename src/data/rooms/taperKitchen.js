// TAPER'S KITCHEN: through the left door of her potting room. Soup on the
// stove, a seed cake cooling on the counter, herbs drying on the peg rail,
// jars of seed on the shelf, a stone sink with a pump, and the table, laid
// for two, with old plate rings in the wood.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            h  home wall (solid)
//   o  wooden floor                                p  potted plant (solid)
//   D  doorway (walk through it; see `doors`)
// Taper's own props (stove, sink, rails, shelf) are drawn in src/data/art/taperHouse.js.
import { R1_PROPS } from '../ruinsLife.js';
export const TAPER_KITCHEN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'taper_kitchen',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S KITCHEN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',
  // Lit by the stove and the candle on the table.
  indoors: true,
  lamplight: { shade: 0.26, nightShade: 0, tint: '34, 16, 6' },

  tiles: [
    '##############',
    '##hhhhhhhhhh##',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#ooooooooooooD',
    '#ooooooooooooD',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '##poooooooooo#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 13, y: 5, w: 1, h: 2, to: 'taper_home', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'col_charm_feather', x: 1, y: 8, walkable: true, flat: true, gives: 'charm_feather', taken: { gone: true } },
    { sprite: 'th_herb_rail', x: 2, y: 2, text: 'kitchen_herbs' },
    { sprite: 'th_jar_shelf', x: 8, y: 2, text: 'kitchen_jars' },
    { sprite: 'th_sconce', x: 11, y: 2, text: 'kitchen_sconce' },
    { sprite: 'th_counter', x: 2, y: 3, text: 'kitchen_counter' },
    { sprite: 'th_soup_stove', x: 3, y: 3, text: 'kitchen_stove' },
    { sprite: 'th_cake_counter', x: 4, y: 3, text: 'kitchen_cake', gives: 'candle_cake', taken: { sprite: 'th_counter', text: 'kitchen_cake_gone' } },
    { sprite: 'th_sink', x: 5, y: 3, text: 'kitchen_sink' },
    { sprite: 'th_sacks', x: 12, y: 3, text: 'kitchen_sacks' },
    { sprite: 'in_rug_blue', x: 5, y: 8, text: 'kitchen_rug', walkable: true, flat: true },
    { sprite: 'chair', x: 5, y: 7, text: 'kitchen_chair' },
    { sprite: 'table', x: 6, y: 7, text: 'kitchen_table' },
    { sprite: 'chair', x: 8, y: 7, text: 'kitchen_chair_hers' },
    { sprite: 'th_trug', x: 11, y: 9, text: 'kitchen_trug' },
    // The life pass, round 2 (15 November 2026): chapter 1's dressing, in src/data/ruinsLife.js.
    ...(R1_PROPS['taper_kitchen'] ?? []),
  ],

  tileTexts: { p: 'home_pots' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
