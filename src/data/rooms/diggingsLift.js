// THE LIFT: the way down to the lake. The old winch lift is in a cage at the
// east end, behind a gate, and the gate is held shut by the lift's brake,
// which wants two heavy loads set on two stone plates: a counterweight each
// side (that's how the diggers did it). Three carts stand on the same run at
// the west end, one behind the other, and a lever works the fork at 14,9. Only
// the front cart can go (the rest stop behind it). It is the last of the carts
// puzzles and it uses all of them.
//   - The east line (row 9) has a barricade across it (19,9): a rider stops
//     short, an empty cart goes through. It ends at the buffer at 24,9, which
//     is a weigh plate (lift_hold) with no gate of its own: it works the second
//     fork on the siding.
//   - The weight plate for the gate (lift_p1) is NOT at the buffer: it is one
//     tile short of it (23,9). A cart only stops there if another is already
//     parked at the end, so the east line wants TWO carts: the first to the
//     buffer, the second behind it, on the plate.
//   - The siding (down col 14, along row 13) has a barricade too (16,13), and
//     a second fork (19,13) with NO lever: straight on, it runs to a dead end
//     (22,13); turned, it goes down and round to the second weight plate
//     (lift_p2, 24,14). The fork is held by the buffer plate at the end of
//     the east line: a cart parked there keeps it turned for the plate;
//     with nothing on it, the fork lets go.
//   So: a cart to the east buffer (it has to be pushed empty, past the
//   barricade) and it stays, as the weight that turns the siding's fork; a
//   second behind it, on the east plate; then the lever, and the third cart
//   pushed empty down the siding to the second plate. Both plates held: the
//   gate opens for good. Nothing can go wrong: every end of the line is a
//   bumper, a cart rolls back the way it came, and the stump at 10,5 puts the
//   carts and barricades back.
// Climb on the lift, and down you go. No monsters: it's a rest before the lake
// (the second save crystal is here).
// Track: row 9 from the stub at 3 to the fork at 14,9 (stem L; off = straight on
// to the buffer at 24,9, on = down), the siding col 14 down to 14,13 and along row 13
// to the second fork at 19,13 (stem L; off = straight on to the dead end at 22,13, on =
// down to 19,14 and east along row 14 to the plate at 24,14).

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   o  planks of the lift cage (walkable)

export const DIGGINGS_LIFT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_lift',
  // The room's name, for the Room Editor.
  name: 'THE LIFT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  // Darker the further down you go.
  lamplight: { shade: 0.5 },

  tiles: [
    '####################################',
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWW###########',
    '#........................###########',
    '#........................###########',
    '#................^.......#####WWW###',
    '#...................OO...####IoooI##',
    'W........................WWWWoooooWW',
    '.............................ooooooo',
    '.............................ooooooo',
    '#........................####ooooo##',
    '#........................####IoooI##',
    '#.....OO.................###########',
    '#........................###########',
    '#..........O.............###########',
    '#........................###########',
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
    '....................................',
    '...╶──────────┬─────────╴...........',
    '..............│.....................',
    '..............│.....................',
    '..............│.....................',
    '..............└────┬──╴.............',
    '...................└────╴...........',
    '....................................',
    '....................................',
    '....................................',
  ],

  // Junctions you can throw (a rail lever, a button or an eye answers to the name).
  // The second answers to the buffer plate at the end of the east line: a cart resting there holds it on.
  switches: [
    { x: 14, y: 9, name: 'lift_sw', stem: 'L' },
    { x: 19, y: 13, name: 'lift_hold', stem: 'L' },
  ],


  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // East: down the lift to the lake (stillwater_shore's west door sends you back to 34,8).
  doors: [
    { x: 35, y: 8, w: 1, h: 2, to: 'stillwater_shore', spawn: { x: 1, y: 8 } },
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_cave_in', spawn: { x: 36, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 31, y: 8, w: 1, h: 2, scene: 'diggings_lift_down' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Three carts, the lever, the buffer plate and two weight plates, two barricades, the gate,
  // the winch, the save crystal, a mole winchman, signs and a purse.
  textFile: 'interactions/diggings.txt',
  props: [
    { sprite: 'mine_cart', x: 5, y: 9, cart: 'a', dir: 'R', text: 'cart_stuck' },
    { sprite: 'mine_cart', x: 7, y: 9, cart: 'b', dir: 'R', text: 'cart_stuck' },
    { sprite: 'mine_cart', x: 9, y: 9, cart: 'c', dir: 'R', text: 'cart_stuck' },
    { sprite: 'rail_lever', x: 13, y: 10, switch: 'lift_sw', text: 'lift_lever' },
    { sprite: 'stone_button', x: 24, y: 9, text: 'lift_hold', button: 'lift_hold' },
    { sprite: 'stone_button', x: 23, y: 9, text: 'lift_plate', button: 'lift_p1' },
    { sprite: 'stone_button', x: 24, y: 14, text: 'lift_plate', button: 'lift_p2' },
    { sprite: 'barricade', x: 19, y: 9, smash: true, text: 'lift_barricade' },
    { sprite: 'barricade', x: 16, y: 13, smash: true, text: 'lift_barricade' },
    { sprite: 'gate_narrow', x: 26, y: 8, text: 'lift_gate', opensWith: ['lift_p1', 'lift_p2'], openText: 'lift_gate_open' },
    { sprite: 'gate_narrow', x: 26, y: 9, text: 'lift_gate', opensWith: ['lift_p1', 'lift_p2'], openText: 'lift_gate_open' },
    { sprite: 'rock_stump', x: 10, y: 5, text: 'cart_stump', rockReset: true },
    { sprite: 'savepoint', x: 3, y: 5, save: true },
    { sprite: 'mine_winch', x: 31, y: 6, text: 'lift_winch', cast: 'winch' },
    { sprite: 'sign', x: 28, y: 7, text: 'lift_sign' },
    { sprite: 'sign', x: 3, y: 12, text: 'lift_board' },
    { sprite: 'warning_sign', x: 22, y: 11, text: 'lift_warning' },
    { sprite: 'ore_sacks', x: 2, y: 8, text: 'd_sacks' },
    { sprite: 'toolbox', x: 18, y: 11, text: 'd_toolbox' },
    { sprite: 'mine_cart', x: 16, y: 4, text: 'd_wreck' },
    { sprite: 'mine_cart', x: 9, y: 14, text: 'd_wreck' },
    { sprite: 'spoil_heap', x: 21, y: 3, text: 'd_spoil' },
    { sprite: 'bf_mole_miner_a', x: 11, y: 7, npc: 'mole_winder', animation: 'bf_mole_miner_a', speed: 0.5 },
    { sprite: 'mine_lamp_hung', x: 6, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 18, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 30, y: 5, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 10, y: 11, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 23, y: 15, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 22, y: 3, text: 'lift_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 2, y: 2, text: 'd_post' },
    { sprite: 'tiny_tools', x: 9, y: 2, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 14, y: 2, text: 'd_post' },
    { sprite: 'wall_shoring', x: 23, y: 2, text: 'd_post' },
    { sprite: 'ore_crumbs', x: 5, y: 3, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 17, y: 3, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 10, y: 4, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'drip_puddle', x: 22, y: 4, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 19, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 23, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 31, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 20, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 13, y: 12, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 7, y: 13, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 2, y: 15, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', '^': 'd_stalag', o: 'd_planks', W: 'd_face' },

  // No monsters: it's the last room before the lake. (A mole winchman stands about.)
  npcs: [
  ],
};
