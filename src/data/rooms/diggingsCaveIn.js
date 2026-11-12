// THE CAVE-IN: the line was cut here by a fall of rock that a shift was lucky
// to be out of. The passage through it is one tile wide (x 13 to 19, row 8,
// the rails running down the middle) and has a big rock at its mouth (14,8,
// on the rails). Beyond it the cavern holds the stranded cart (24,8) on the
// old line, with another rock jammed against its back end (23,8), and the
// line runs on east into a tunnel one tile wide with a barricade across it
// (32,8): the old shift's last defence against the fall. Nothing gets past
// that but an empty cart. And past the barricade, across the tunnel (35,8),
// is a drop gate: the old shift's other defence. It is held shut by a weigh
// plate set in the line in the cavern (27,8) that only a CART's weight
// presses (a rock on it does nothing: cartOnly).
//
// The trouble is that a cart pushed off down the line runs the whole way: it
// goes over the plate without stopping, smashes the barricade and parks in
// the little siding past it, and the gate stays shut. To weigh the plate the
// cart has to STOP on it, and the only thing that stops a cart is something
// in its way. So: push the first rock down the passage and out into the
// cavern, get it round (up or down a row, along, and back onto the line) to
// stand on the rails just past the plate (28,8) as a brake; move the second
// rock off the cart's back; push the cart (it stops against the brake, on the
// plate, and the gate opens for good); push the brake off the line; push the
// cart again. It smashes the barricade, rolls on and turns down into the
// siding (33,9 to 33,10), and the tunnel to the east door is clear to walk.
// (Or take it the long way: let it smash and park first, then ride it back
// and let a rock stop it on the plate from the other side.)
// The stumps (3,13 and 30,4) put the rocks and the cart back if you box
// something in. As you go in, the roof grumbles (diggings_quake).
// (About twenty pushes; checked with a solver.)

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   J  snapped timber (solid, standing)

export const DIGGINGS_CAVE_IN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_cave_in',
  // The room's name, for the Room Editor.
  name: 'THE CAVE-IN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  // How it rings (a narrow drift: ECHOES in src/audio/music.js).
  echo: 'tunnel',
  // Darker the further down you go.
  lamplight: { shade: 0.55 },

  tiles: [
    '######################################',
    '#WWWWWW##WWW##########################',
    '#.qqq..WW...W#######WWWW##WWWWWW######',
    '#.qI.........#######qqq.WW.....q######',
    '#..........J.#######......O....q######',
    '#q....O......#######.....qqq....######',
    '#q..........O#######....Jqqqq...######',
    'W...........OWWWWWWW............WWWWWW',
    '......................................',
    '............O#######.....q...J..#.####',
    '#...........O#######...qqq......#.####',
    '#...........O#######...qq..O..qq######',
    '#q...........#######..Oqq.....qq######',
    '#........O...#######....q......q######',
    '#............#########...##q....######',
    '###...###..I.#########################',
    '######################################',
    '######################################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '..╶──────────────────────────────┐....',
    '.................................│....',
    '.................................╵....',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_flooded_drift', spawn: { x: 38, y: 13 } },
    { x: 37, y: 8, w: 1, h: 1, to: 'diggings_lift', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 13, y: 8, w: 1, h: 1, scene: 'diggings_quake' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The stranded cart, the two rocks, the barricade, the weigh plate and the gate it holds,
  // two stumps to reset them, signs, a hard hat and purses.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save point near the way in (added so the mines have more of them).
    { sprite: 'savepoint', x: 2, y: 11, save: true },
    { sprite: 'mine_cart', x: 24, y: 8, cart: 'c', text: 'cart_stuck' },
    { sprite: 'push_rock', x: 14, y: 8, text: 'cave_rock', rock: true },
    { sprite: 'push_rock', x: 23, y: 8, text: 'cave_rock', rock: true },
    { sprite: 'barricade', x: 32, y: 8, smash: true, text: 'cave_barricade' },
    // The weigh plate in the line (only a cart presses it) and the drop gate it holds shut.
    { sprite: 'stone_button', x: 27, y: 8, text: 'cave_plate', button: 'cave_plate', cartOnly: true },
    { sprite: 'gate_narrow', x: 35, y: 8, text: 'cave_gate', opensWith: ['cave_plate'], openText: 'cave_gate_open' },
    { sprite: 'rock_stump', x: 3, y: 13, text: 'rock_stump', rockReset: true },
    { sprite: 'rock_stump', x: 30, y: 4, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 2, y: 6, text: 'cave_sign' },
    { sprite: 'warning_sign', x: 11, y: 7, text: 'cave_warning' },
    { sprite: 'toolbox', x: 23, y: 4, text: 'd_toolbox' },
    { sprite: 'moles_hard_hat', x: 21, y: 3, text: 'cave_hat' },
    { sprite: 'broken_ladder', x: 31, y: 14, text: 'd_ladder' },
    { sprite: 'mine_cart', x: 28, y: 13, text: 'd_wreck' },
    { sprite: 'spoil_heap', x: 7, y: 14, text: 'd_spoil' },
    { sprite: 'mine_lamp_hung', x: 4, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 10, y: 4, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 22, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 29, y: 12, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 35, y: 7, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 5, y: 14, text: 'cave_pouch', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 31, y: 3, text: 'cave_pouch_east', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 2, y: 1, text: 'd_post' },
    { sprite: 'tiny_tools', x: 9, y: 1, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 24, y: 2, text: 'd_post' },
    { sprite: 'wall_shoring', x: 30, y: 2, text: 'd_post' },
    { sprite: 'ore_crumbs', x: 4, y: 3, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 8, y: 3, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 30, y: 3, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 12, y: 4, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 4, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 7, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 28, y: 6, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 10, y: 7, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 21, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 26, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 8, y: 11, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 11, y: 13, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', J: 'd_snapped', W: 'd_face' },

  // A drillbug in the west cavern (row 3, x 4 to 10) and a slagling in the east one (row
  // 13, x 22 to 27). Clear of the rocks' passage, the cart and its run (row 8), and the
  // quake scene (it has no walking in it).
  npcs: [
    { enemy: 'drillbug', x: 6, y: 3, patrol: [4, 10] },
    { enemy: 'slagling', x: 25, y: 13, patrol: [22, 27] },
    // A magpie mole in the east cavern's north-east (row 5, x 27 to 30), well off the line
    // (row 8), the plate and the quake trigger at the mouth (13,8).
    { enemy: 'magpiemole', x: 28, y: 5, patrol: [27, 30] },
  ],
};
