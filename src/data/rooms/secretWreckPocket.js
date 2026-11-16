// THE POCKET: the secret of the Wreck Yard, down the hatch in the fog deck's railed-off
// foredeck (Bramble unbolts its gate from inside). A pocket of dry air under the deck,
// where the bosun kept the good things: a diving suit's chest with the BRASS DIVER'S
// PLATE in it, a purse, and the crew's swear jar (full). Indoors, no monsters, no puzzle.
// The ladder at the bottom (7..8, row 9) goes back up to the foredeck.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   W  hull plate (solid)   :  deck planks   ~  bilge (solid)

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SECRET_WRECK_POCKET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_wreck_pocket',
  // The room's name, for the Room Editor.
  name: 'THE POCKET',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Under Her Ribs" (src/data/music/wreckHullsTheme.js): inside the beached wrecks.
  music: 'wreckHulls',
  ambience: 'hulk_storm',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_hulk' },
  vesWell: true,
  indoors: true,

  tiles: [
    '################',
    '#WWWWWWWWWWWWWW#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#::~~::::::::::#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#::::::::::::::#',
    '#######::#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 9, w: 2, h: 1, to: 'wreck_fog', spawn: { x: 39, y: 4 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    { sprite: 'c5_chest', x: 12, y: 3, text: 'pocket_chest', gives: 'brass_divers_plate', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'c5_chest', x: 3, y: 8, text: 'pocket_hatchet', gives: 'marlinspike_hatchet', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 2, text: 'pocket_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_barrels', x: 9, y: 2, text: 'pocket_barrels' },
    { sprite: 'sign', x: 6, y: 2, text: 'pocket_note' },
    { sprite: 'c5_rope_coil', x: 11, y: 7, text: 'hull_rope', walkable: true },
    { sprite: 'c5_anchor', x: 2, y: 7, text: 'hull_anchor' },
    // (2026-11-08) The bosun's own: a ship in a bottle and his knot board.
    { sprite: 'in_bottle_ship', x: 4, y: 1, text: 'in_pocket_ship' },
    { sprite: 'in_knot_board', x: 13, y: 1, text: 'in_pocket_knots' },
    // (Second pass.) Dark under the deck beams along the north wall, the bosun's lamp on its
    // bracket, the bilge spreading out of its hole over the boards, a grating, his sea chest and
    // a heap of chain he never got round to stowing.
    { sprite: 'wy_rail_shadow', x: 3, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 7, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 11, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 13, y: 2, flat: true, walkable: true },
    { sprite: 'in_wall_lamp', x: 8, y: 1 },
    { sprite: 'wy_bilge_slick', x: 5, y: 4, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick_b', x: 3, y: 5, flat: true, walkable: true },
    { sprite: 'wy_grating', x: 9, y: 5, flat: true, walkable: true },
    { sprite: 'in_sea_chest_small', x: 14, y: 7, text: 'pocket_sea_chest' },
    // A page of the Fair Return's log (optional, secret: the way to her fog bell), in a bottle the bosun kept on the rack and
    // never opened.
    { sprite: 'gs_log_bottle', x: 14, y: 4, text: 'pocket_log_bottle', gives: 'log_page_3', notice: true, taken: { gone: true } },
    { sprite: 'wy_chain_pile', x: 4, y: 7, flat: true, walkable: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.secret_wreck_pocket ?? []),
  ],
  tileTexts: { '#': 'hull_plate', W: 'hull_plate', '~': 'hull_bilge' },

  // None: a secret.
  npcs: [
  ],
};
