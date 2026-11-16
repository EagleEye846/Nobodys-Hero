// TAPER'S HOME: up the stairs from the Flower Room. Mother Taper is a gardener
// and a candlemaker, and this is her potting room, the warm heart of the house:
// a brick hearth with the wax pot on its crane, her potting bench and seed
// drawers, flowers and wick drying on peg rails, raised beds of seedlings, and
// the low cot by the fire she puts you on, like a tray of seedlings set somewhere
// warm. The kitchen is through the left door, the dipping room to the right.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            h  home wall (solid)
//   o  wooden floor                                p  potted plant (solid)
//   F  raised bed of seedlings (solid)             D  doorway (walk through it; see `doors`)
//   u  stairs down (walk through it; see `doors`)
// Taper's own props (hearth, bench, cot, rails) are drawn in src/data/art/taperHouse.js.
import { R1_PROPS } from '../ruinsLife.js';
export const TAPER_HOME = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'taper_home',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S POTTING ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',
  // Lit by its own hearth and candles: warm and dim between them.
  indoors: true,
  lamplight: { shade: 0.28, nightShade: 0, tint: '34, 16, 6' },

  tiles: [
    '####################',
    '##hhhhhhhhhhhhhhhh##',
    '#hhhhhhhhhhhhhhhhhh#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    'DooooooooooooooooooD',
    'DooooooooooooooooooD',
    '#oooooooooooooooooo#',
    '#ooFFFooooooooooooo#',
    '#ooFFFooooooooooooo#',
    '#oooooooooooooooooo#',
    '##ppooooooooooooop##',
    '#########uuu########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 14, w: 3, h: 1, to: 'flower_room', spawn: { x: 10, y: 3 } },
    { x: 0, y: 7, w: 1, h: 2, to: 'taper_kitchen', spawn: { x: 12, y: 6 } },
    { x: 19, y: 7, w: 1, h: 2, to: 'taper_hall', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'col_charm_flame', x: 1, y: 12, walkable: true, flat: true, gives: 'charm_flame', taken: { gone: true } },
    // On the wall: flowers and wick drying on peg rails, a candle on its arm.
    { sprite: 'th_drying_rail', x: 2, y: 2, text: 'home_drying' },
    { sprite: 'th_sconce', x: 4, y: 2, text: 'home_sconce' },
    { sprite: 'th_drying_rail', x: 11, y: 2, text: 'home_drying_wick' },
    // The hearth, the wax pot over it; cold once she's gone.
    { sprite: 'th_hearth', x: 7, y: 3, text: 'home_hearth', animation: 'th_hearth', speed: 0.2, until: 'taper_defeated' },
    { sprite: 'th_hearth_cold', x: 7, y: 3, text: 'home_hearth_cold', after: 'taper_defeated' },
    // The cot by the fire, and the stool she sat you on.
    { sprite: 'th_cot', x: 4, y: 4, text: 'home_cot' },
    { sprite: 'th_stool', x: 6, y: 6, text: 'home_stool' },
    { sprite: 'in_rug_red', x: 7, y: 6, text: 'home_rug', walkable: true, flat: true },
    // Her work along the right-hand wall.
    { sprite: 'th_wax_vat', x: 10, y: 3, text: 'home_vat', until: 'taper_defeated' },
    { sprite: 'th_wax_vat_cold', x: 10, y: 3, text: 'home_vat_cold', after: 'taper_defeated' },
    { sprite: 'th_seed_drawers', x: 13, y: 3, text: 'home_drawers' },
    { sprite: 'th_potting_bench', x: 15, y: 3, text: 'home_bench' },
    { sprite: 'th_sacks', x: 17, y: 3, text: 'home_sacks' },
    { sprite: 'th_trug', x: 16, y: 5, text: 'home_trug' },
    // Staging of pricked-out seedlings, waiting to go through to the glasshouse.
    { sprite: 'th_staging', x: 15, y: 8, text: 'home_staging' },
    // Taper, watering her seedlings, until the fight at the way out.
    { sprite: 'taper', x: 2, y: 10, npc: 'mother_taper', animation: 'taper_watering', after: 'meet_taper', until: 'taper_defeated' },
    { sprite: 'watering_can', x: 2, y: 10, text: 'home_can_left', after: 'taper_defeated' },
    { sprite: 'watering_can', x: 6, y: 11, text: 'home_can' },
    { sprite: 'savepoint', x: 16, y: 12, save: true },
    // Taper's candle-making notes, by the stairs, with a "!" until you've read them.
    { sprite: 'book_stand', x: 13, y: 11, text: 'candle_book', notice: true },
    // The life pass, round 2 (15 November 2026): chapter 1's dressing, in src/data/ruinsLife.js.
    ...(R1_PROPS['taper_home'] ?? []),
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  // Wick, asleep on the warm tile in front of the hearth (a touch in src/data/ruinsTouches.js).
  looks: [{ x: 8, y: 5, text: 'r1_th_cat', pet: true }],
  tileTexts: { F: 'home_beds', p: 'home_pots' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
