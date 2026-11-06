// THE SWITCHBACK: the line zig-zags down the hillside of the workings in
// three levels, and most of its junctions have no lever. They are SPRUNG: a
// wheel coming into one off a branch leaves it turned that way, so the next
// cart from the stem goes the same way (a cart coming in by the stem changes
// nothing). All three sprung junctions (the top level's east end, the second
// turn, the middle level's west fork) start turned the wrong way: into a spur,
// down to a dead end, on west. The only way to turn them is to come into them
// backwards, and there is a loop that does it: the lever at the top (sb1) sends
// the cart down the west side instead (col 8, across the middle level, along
// the bottom, up col 10, east along the middle level, up the east side and back
// along the top to the start). Riding that loop the long way round leaves every
// sprung junction set for the zig-zag going the other way. Then sb1 back off
// and the same ride goes down the zig-zag to the bottom level, and east to the
// stone plate there that opens the gate. (The bottom fork's lever, sb4, is
// only a way to send a cart back round the west leg.)
// Every end is a bumper you can ride home from, so nothing is lost by a wrong
// ride, and the stump by the start sets the sprung points back, too.
// Track: top level row 3 (stub at x 2, lever junction sb1 at 8,3 stem L, sprung sb5
// at 25,3 stem L with a spur east to the stub at 28,3); the east side col 25 down to
// the sprung sb2 at 25,8 (stem U; off = straight down to the stub at 25,10, on = west);
// the middle level row 8 running west (crossing at 8,8, sprung sb3 at 10,8 stem R; off =
// straight on to the stub at 3,8, on = down col 10); the bottom level row 14 (corner at
// 8,14, lever junction sb4 at 10,14 stem U; off = east to the plate at 31,14, on = west).

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor

export const DIGGINGS_SWITCHBACK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_switchback',
  // The room's name, for the Room Editor.
  name: 'THE SWITCHBACK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',

  tiles: [
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#######',
    'W................................#######',
    '.................................#######',
    '.................................#######',
    '#...........................O....#######',
    '#....I........OO..I..............#######',
    '#................................#######',
    '#................................#######',
    '#................................#######',
    '#................................#######',
    '#.............................I..#######',
    '#.....O.............I.OO.........WWWWWWW',
    '#.......................................',
    '#.......................................',
    '#................................#######',
    '########################################',
    '########################################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '........................................',
    '........................................',
    '........................................',
    '..╶─────┬────────────────┬──╴...........',
    '........│................│..............',
    '........│................│..............',
    '........│................│..............',
    '........│................│..............',
    '...╶────┼─┬──────────────┤..............',
    '........│.│..............│..............',
    '........│.│..............╵..............',
    '........│.│.............................',
    '........│.│.............................',
    '........│.│.............................',
    '........└─┴────────────────────╴........',
    '........................................',
    '........................................',
    '........................................',
  ],

  // Junctions you can throw (a rail lever, a button or an eye answers to the name).
  // The `spring` ones have no lever: the carts throw them (see the notes above).
  switches: [
    { x: 8, y: 3, name: 'sb1', stem: 'L' },
    { x: 25, y: 3, name: 'sb5', stem: 'L', spring: true },
    { x: 25, y: 8, name: 'sb2', stem: 'U', spring: true },
    { x: 10, y: 8, name: 'sb3', stem: 'R', spring: true },
    { x: 10, y: 14, name: 'sb4', stem: 'U' },
  ],


  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 3, w: 1, h: 2, to: 'diggings_cart_yard', spawn: { x: 34, y: 8 } },
    { x: 39, y: 13, w: 1, h: 2, to: 'diggings_old_seam', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The cart, two levers (sb1 at the top, sb4 at the bottom: the three sprung junctions have none),
  // a stump that puts the cart and the sprung points back, the plate and gate at the end, signs,
  // wrecked carts, tools, and a purse at the far end of the second level's west dead end.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save point near the way in (added so the mines have more of them).
    { sprite: 'savepoint', x: 2, y: 7, save: true },
    { sprite: 'mine_cart', x: 3, y: 3, cart: 'a', dir: 'R', text: 'cart_stuck' },
    { sprite: 'rail_lever', x: 7, y: 4, switch: 'sb1', text: 'sb_lever_1' },
    { sprite: 'rail_lever', x: 11, y: 13, switch: 'sb4', text: 'sb_lever_4' },
    { sprite: 'rock_stump', x: 5, y: 4, text: 'cart_stump', rockReset: true },
    { sprite: 'stone_button', x: 31, y: 14, text: 'sb_plate', button: 'sb_plate' },
    { sprite: 'gate_narrow', x: 35, y: 13, text: 'sb_gate', opensWith: ['sb_plate'], openText: 'sb_gate_open' },
    { sprite: 'gate_narrow', x: 35, y: 14, text: 'sb_gate', opensWith: ['sb_plate'], openText: 'sb_gate_open' },
    { sprite: 'sign', x: 3, y: 5, text: 'sb_sign' },
    { sprite: 'sign', x: 28, y: 12, text: 'sb_board' },
    { sprite: 'warning_sign', x: 24, y: 9, text: 'sb_warning' },
    { sprite: 'mine_cart', x: 17, y: 10, text: 'd_wreck' },
    { sprite: 'mine_cart', x: 4, y: 11, text: 'd_wreck' },
    { sprite: 'spoil_heap', x: 14, y: 12, text: 'd_spoil' },
    { sprite: 'ore_sacks', x: 31, y: 3, text: 'd_sacks' },
    { sprite: 'toolbox', x: 21, y: 5, text: 'd_toolbox' },
    { sprite: 'moles_hard_hat', x: 12, y: 2, text: 'd_hat' },
    { sprite: 'mine_lamp_hung', x: 6, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 16, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 29, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 17, y: 7, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 5, y: 14, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 26, y: 15, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 2, y: 9, text: 'sb_pouch', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 5, y: 1, text: 'd_post' },
    { sprite: 'tiny_tools', x: 10, y: 1, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 15, y: 1, text: 'd_post' },
    { sprite: 'wall_shoring', x: 24, y: 1, text: 'd_post' },
    { sprite: 'tiny_door', x: 31, y: 1, text: 'd_tiny_door' },
    { sprite: 'drip_puddle', x: 10, y: 2, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'drip_puddle', x: 13, y: 4, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 18, y: 5, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 23, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 31, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 10, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 7, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 22, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 29, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 3, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 12, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 31, y: 12, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 17, y: 13, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 7, y: 14, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 2, y: 15, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 24, y: 15, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', W: 'd_face' },

  // A drillbug pottering between the second and third level (row 11, x 13 to 24) and a
  // slagling on the top level's flat (row 5, x 12 to 20). Neither crosses a rail
  // (the vertical track is at columns 8, 10 and 25).
  npcs: [
    { enemy: 'drillbug', x: 16, y: 11, patrol: [13, 24] },
    { enemy: 'slagling', x: 17, y: 5, patrol: [12, 20] },
    // A magpie mole on the open floor east of the line (row 7, x 28 to 32): the track's last
    // column is x 26, and nothing here is a sprung junction.
    { enemy: 'magpiemole', x: 30, y: 7, patrol: [28, 32] },
  ],
};
