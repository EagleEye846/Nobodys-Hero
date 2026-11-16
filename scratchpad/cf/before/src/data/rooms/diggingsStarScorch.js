// THE SCORCH (secret, draft): the bottom of Seam Nine's crack. The star
// came down this way, and the rock it came through ran like wax and set again
// as glass, so the whole cavern is a dull blue-grey glaze with the miners' old
// track laid across it. Two carts wait at the west end of one line of rail
// that forks three times; only one setting of the three levers goes anywhere
// but a dead end, and a rider stops short of a barricade across the last
// stretch, so an EMPTY cart has to go first and smash it.
//
//   Route (the miners' own sign says it): DOWN, ACROSS, then STRAIGHT ON.
//   Levers sc_sw1, sc_sw2 and sc_sw3 are the three junctions, left to right.
//   Right setting: sw1 ON, sw2 ON, sw3 OFF. Any other setting ends at a stub
//   (a purse at two of them), and a cart always rolls back out by its stem, so
//   it can always be sent home; the stump by the carts puts both back.
//   Track: row 4 from the stub at 3 to J1 (10,4, stem L: off straight on to the
//   dead end at 24,4, on down col 10); col 10 to J2 (10,9, stem U: off straight
//   down to the dead end at 10,13, on east along row 9); row 9 to J3 (20,9, stem L:
//   off straight on to the curve at 27,9, on down col 20 to the dead end at
//   20,13); col 27 down to the curve at 27,12 and east along row 12 to the stub
//   at 37,12. The barricade is at 30,12. Carts at 4,4 (b) and 7,4 (a): push a
//   (stand at 6,4, lean east) to smash the barricade, then ride b.
//   The hero can always walk it all: the rails are floor.
// The slagling's lane is row 11 (x 2 to 7), the drillbug's row 7 (x 28 to 36)
// and the gleamsnail's row 6 (x 13 to 19): all well off the track.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  ore rock (solid)
//   x  glassy crystal (solid)       q  loose gravel        ^  stalagmite (solid)
//   .  packed dirt floor (here, a glaze over it)

import { DIGGINGS_DRESSING } from '../diggingsDressing.js';

export const DIGGINGS_STAR_SCORCH = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_star_scorch',
  // The room's name, for the Room Editor.
  name: 'THE SCORCH',
  area: 'diggings',
  // "Something Hums Below" (src/data/music/starSeamTheme.js), the secret seam's own song.
  music: 'starSeam',
  ambience: 'mine_quiet',
  echo: 'cavern',
  // Darker still, with a cold blue where the glass is.
  lamplight: { shade: 0.62 },

  tiles: [
    '###.####################################',
    '###.####################################',
    '###.W##WWWWWW##WWWWWWWWWWWWWWW##WWWWW###',
    '##W..WW...O..WW^..^.xO....xx.xWW..x..W##',
    '#Wx............................q......W#',
    '#.......q............qq................#',
    '#..........................q..q.......x#',
    '#.......q.............................x#',
    '#..................q...q.............qx#',
    '#.q....................................#',
    '#x.q...................................W',
    '#.......................................',
    '##...q........q.O.....^x................',
    '###O....##...^.##.xq..###.....qx.##O....',
    '########################################',
    '########################################',
  ],

  // The miners' track, laid over the glaze.
  rails: [
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '...╶──────┬─────────────╴...............',
    '..........│.............................',
    '..........│.............................',
    '..........│.............................',
    '..........│.............................',
    '..........├─────────┬──────┐............',
    '..........│.........│......│............',
    '..........│.........│......│............',
    '..........│.........│......└─────────╴..',
    '..........╵.........╵...................',
    '........................................',
    '........................................',
  ],
  // Three junctions, one lever each (rail_lever props, `switch` names).
  switches: [
    { x: 10, y: 4, name: 'sc_sw1', stem: 'L' },
    { x: 10, y: 9, name: 'sc_sw2', stem: 'U' },
    { x: 20, y: 9, name: 'sc_sw3', stem: 'L' },
  ],

  playerStart: { x: 3, y: 1 },

  // Up the crack to Seam Nine; east to the spill.
  doors: [
    { x: 3, y: 0, w: 1, h: 1, to: 'diggings_lost_seam', spawn: { x: 3, y: 13 } },
    { x: 39, y: 11, w: 1, h: 3, to: 'diggings_star_spill', spawn: { x: 1, y: 8 } },
  ],
  cutscenes: [],

  textFile: 'interactions/star_seam.txt',
  props: [
    ...(DIGGINGS_DRESSING.diggings_star_scorch ?? []),
    // A save point where the crack lets you out.
    { sprite: 'savepoint', x: 5, y: 7, save: true },
    // The two carts: b behind (to ride), a ahead (to send on alone).
    { sprite: 'mine_cart', x: 4, y: 4, cart: 'b', dir: 'R', text: 'sc_cart' },
    { sprite: 'mine_cart', x: 7, y: 4, cart: 'a', dir: 'R', text: 'sc_cart' },
    { sprite: 'rail_lever', x: 11, y: 5, switch: 'sc_sw1', text: 'sc_lever_1' },
    { sprite: 'rail_lever', x: 11, y: 10, switch: 'sc_sw2', text: 'sc_lever_2' },
    { sprite: 'rail_lever', x: 21, y: 10, switch: 'sc_sw3', text: 'sc_lever_3' },
    { sprite: 'barricade', x: 30, y: 12, smash: true },
    { sprite: 'rock_stump', x: 6, y: 10, text: 'sc_stump', rockReset: true },
    { sprite: 'sign', x: 4, y: 6, text: 'sc_route' },
    { sprite: 'warning_sign', x: 11, y: 12, text: 'sc_warning' },
    { sprite: 'gold_pouch', x: 25, y: 4, text: 'sc_pouch_a', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 21, y: 13, text: 'sc_pouch_c', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing.
    { sprite: 'mine_lamp_hung', x: 18, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 26, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 9, y: 7, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 25, y: 11, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'wall_shoring', x: 9, y: 2, text: 'sc_shoring' },
    { sprite: 'wall_shoring', x: 22, y: 2, text: 'sc_shoring' },
    { sprite: 'ore_sacks', x: 12, y: 11, text: 'sc_sacks' },
    { sprite: 'spoil_heap', x: 33, y: 5, text: 'sc_spoil' },
    { sprite: 'drip_puddle', x: 14, y: 7, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 8, y: 5, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 23, y: 7, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 17, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 32, y: 10, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 3, y: 9, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sc_ore', x: 'sc_glass', '^': 'sc_stalag' },

  // A slagling (row 11, west), a gleamsnail (row 6, middle) and a drillbug
  // (row 7, east): all off the rails, the levers and the way to the door.
  npcs: [
    { enemy: 'slagling', x: 4, y: 11, patrol: [2, 7] },
    { enemy: 'gleamsnail', x: 16, y: 6, patrol: [13, 19] },
    { enemy: 'drillbug', x: 31, y: 7, patrol: [28, 36] },
  ],
};
