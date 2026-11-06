// THE CART YARD: where the carts were kept, and the first track you ride.
// Two carts wait at the west end of a line, one behind the other, and the line
// forks twice. The first fork (14,8) has a lever beside it: straight on, the
// line runs to the end by a spoil heap (and a purse), where a second stone
// plate sits at the buffer; thrown, it turns down the siding. The siding forks
// again (14,12), and that fork has NO lever: it is held by the east plate. A
// cart sitting on the east plate keeps the siding fork turned east, to the
// plate by the gate; with nothing on the east plate it goes straight on to a
// dead end. So the first cart goes east and stays there, as a weight, and the
// second goes down the siding with the lever thrown (the one most people try
// first is the siding, which only gets them to the dead end and a ride home).
// Nothing can go wrong: every end of the line is a bumper, a cart always rolls
// back the way it came, and the stump at the start puts both carts home.
// (Track rows: the run is row 8 from the stub at x 3 to the bumper at x 26;
// the first junction is at 14,8, stem left, off = straight on, on = down; the
// siding is col 14 down to the second junction at 14,12 (stem up, off = straight
// on to the dead end at 14,14, on = east along row 12 to the plate at 22,12).)

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   ^  stalagmite (solid)

export const DIGGINGS_CART_YARD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_cart_yard',
  // The room's name, for the Room Editor.
  name: 'THE CART YARD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',

  tiles: [
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#####',
    '#..............................#####',
    '#.......I...........I..........#####',
    '#...........................I..#####',
    '#.........OO...................#####',
    'W..............................WWWWW',
    '....................................',
    '....................................',
    '#..............................#####',
    '#........................OO....#####',
    '#..............................#####',
    '#..............................#####',
    '#...^..........................#####',
    '#..............................#####',
    '####################################',
    '####################################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '...╶──────────┬───────────╴.........',
    '..............│.....................',
    '..............│.....................',
    '..............│.....................',
    '..............├───────╴.............',
    '..............│.....................',
    '..............╵.....................',
    '....................................',
    '....................................',
  ],
  // Junctions you can throw (a rail lever, a button or an eye answers to the name).
  // The second one answers to the east plate: a cart resting there holds it on.
  switches: [
    { x: 14, y: 8, name: 'yard_sw', stem: 'L' },
    { x: 14, y: 12, name: 'yard_hold', stem: 'U' },
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'diggings_pithead', spawn: { x: 32, y: 8 } },
    { x: 35, y: 7, w: 1, h: 2, to: 'diggings_switchback', spawn: { x: 1, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The two carts, the points lever, the east plate that holds the siding fork, the
  // stone plate at the end of the siding and the gate it opens, signs, wrecked carts (no rails to them: just scenery), sacks, a purse
  // beyond the dead end.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save point near the way in (added so the mines have more of them).
    { sprite: 'savepoint', x: 3, y: 10, save: true },
    { sprite: 'mine_cart', x: 5, y: 8, cart: 'a', dir: 'R', text: 'cart_stuck' },
    { sprite: 'mine_cart', x: 3, y: 8, cart: 'b', dir: 'R', text: 'cart_stuck' },
    { sprite: 'rail_lever', x: 12, y: 9, switch: 'yard_sw', text: 'yard_lever' },
    { sprite: 'stone_button', x: 26, y: 8, text: 'yard_hold', button: 'yard_hold' },
    { sprite: 'rock_stump', x: 6, y: 13, text: 'cart_stump', rockReset: true },
    { sprite: 'stone_button', x: 22, y: 12, text: 'yard_plate', button: 'yard_plate' },
    { sprite: 'gate_narrow', x: 32, y: 7, text: 'yard_gate', opensWith: ['yard_plate'], openText: 'yard_gate_open' },
    { sprite: 'gate_narrow', x: 32, y: 8, text: 'yard_gate', opensWith: ['yard_plate'], openText: 'yard_gate_open' },
    { sprite: 'sign', x: 2, y: 6, text: 'yard_sign' },
    { sprite: 'sign', x: 5, y: 5, text: 'yard_board' },
    { sprite: 'warning_sign', x: 13, y: 10, text: 'yard_warning' },
    { sprite: 'mine_cart', x: 7, y: 12, text: 'd_wreck' },
    { sprite: 'mine_cart', x: 9, y: 13, text: 'd_wreck' },
    { sprite: 'mine_cart', x: 27, y: 3, text: 'd_wreck' },
    { sprite: 'spoil_heap', x: 28, y: 11, text: 'd_spoil' },
    { sprite: 'ore_sacks', x: 2, y: 12, text: 'd_sacks' },
    { sprite: 'ore_sacks', x: 2, y: 13, text: 'd_sacks' },
    { sprite: 'toolbox', x: 16, y: 14, text: 'd_toolbox' },
    { sprite: 'broken_ladder', x: 30, y: 3, text: 'd_ladder' },
    { sprite: 'mine_lamp_hung', x: 6, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 18, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 26, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 8, y: 7, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 24, y: 14, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 28, y: 8, text: 'yard_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 3, y: 1, text: 'd_post' },
    { sprite: 'tiny_tools', x: 10, y: 1, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 15, y: 1, text: 'd_post' },
    { sprite: 'wall_shoring', x: 20, y: 1, text: 'd_post' },
    { sprite: 'tiny_door', x: 28, y: 1, text: 'd_tiny_door' },
    { sprite: 'drip_puddle', x: 27, y: 2, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 9, y: 3, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 14, y: 3, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 6, y: 4, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 19, y: 5, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 28, y: 5, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 23, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 16, y: 7, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 29, y: 8, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 24, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 21, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 1, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 16, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 25, y: 13, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 17, y: 14, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', '^': 'd_stalag', W: 'd_face' },

  // A drillbug works the north side (row 4, x 6 to 18) and a slagling sits warm by
  // the spoil heaps in the south-east (row 14, x 25 to 29). Both keep clear of the
  // rails (rows 8 and 12, col 14 down to 14) and the way to the gate.
  npcs: [
    { enemy: 'drillbug', x: 12, y: 4, patrol: [6, 18] },
    { enemy: 'slagling', x: 26, y: 14, patrol: [25, 29] },
    // A magpie mole in the north-east corner (row 5, x 20 to 27), three rows above the line,
    // clear of both buttons, the cart and the gate.
    { enemy: 'magpiemole', x: 24, y: 5, patrol: [20, 27] },
  ],
};
