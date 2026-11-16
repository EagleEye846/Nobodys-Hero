// TAPER'S DIPPING ROOM (id taper_hall): through the right door of her potting
// room. Where the candles are made: a pot of hot wax and a tub of cold water
// side by side, racks of candles hung in pairs by their wicks, spools of wick
// and tin moulds on the walls, crates of wax. The glasshouse is through the
// right-hand door, and the stairs at the bottom go down to the way out.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            h  home wall (solid)
//   o  wooden floor                                D  doorway (walk through it; see `doors`)
//   u  stairs down (walk through it; see `doors`)
// Taper's own props (vats, racks, wick board) are drawn in src/data/art/taperHouse.js.
import { R1_PROPS } from '../ruinsLife.js';
export const TAPER_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'taper_hall',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S DIPPING ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',
  // Lit by the wax stove and a candle on the wall.
  indoors: true,
  lamplight: { shade: 0.32, nightShade: 0, tint: '34, 16, 6' },

  tiles: [
    '################',
    '##hhhhhhhhhhhh##',
    '#hhhhhhhhhhhhhh#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#ooooooooooooooD',
    'DooooooooooooooD',
    'Doooooooooooooo#',
    '#oooooooooooooo#',
    '##oooooooooooo##',
    '##########uu####',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'taper_home', spawn: { x: 18, y: 7 } },
    { x: 15, y: 6, w: 1, h: 2, to: 'your_room', spawn: { x: 1, y: 5 } },
    { x: 10, y: 11, w: 2, h: 1, to: 'way_out', spawn: { x: 3, y: 4 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'col_charm_bell', x: 2, y: 10, walkable: true, flat: true, gives: 'charm_bell', taken: { gone: true } },
    { sprite: 'th_wick_board', x: 2, y: 2, text: 'dip_wick' },
    { sprite: 'th_mould_shelf', x: 7, y: 2, text: 'dip_moulds' },
    { sprite: 'th_sconce', x: 10, y: 2, text: 'dip_sconce' },
    { sprite: 'th_dipping_vats', x: 4, y: 3, text: 'dip_vats', until: 'taper_defeated' },
    { sprite: 'th_dipping_vats_cold', x: 4, y: 3, text: 'dip_vats_cold', after: 'taper_defeated' },
    { sprite: 'th_wax_crate', x: 12, y: 3, text: 'dip_crate' },
    { sprite: 'th_wax_crate', x: 13, y: 3, text: 'dip_crate' },
    { sprite: 'th_stool', x: 6, y: 4, text: 'dip_stool' },
    // Racks of candles hung to cool, out in the room so you walk between them.
    { sprite: 'th_dipping_rack', x: 4, y: 7, text: 'dip_rack' },
    { sprite: 'th_dipping_rack', x: 8, y: 7, text: 'dip_rack_thin' },
    { sprite: 'th_sacks', x: 14, y: 9, text: 'dip_sacks' },
    // The life pass, round 2 (15 November 2026): chapter 1's dressing, in src/data/ruinsLife.js.
    ...(R1_PROPS['taper_hall'] ?? []),
  ],

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
