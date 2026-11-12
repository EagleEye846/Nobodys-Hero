// THE TRESTLE: a great drop where the mine broke into an old cavern, and the
// diggers' answer to it: a trestle of planks and rails carried across on
// timbers. There is no puzzle here. It's a set piece, a breather and a thrill
// between the Old Seam's barricades and the Drift's water.
//
// The cart waits on the west platform (3,8), on a stub of rail. Climb in (Z)
// and it runs: east along the first stretch of planks, a sharp turn DOWN the
// timbers at 14,8, a long run along the low deck (row 12) with the black on
// both sides, a turn UP at 26,12, and a last dash east along row 11 over the
// east platform and out through the door (39,11), which carries the cart into
// the Flooded Drift (it lands on the drift's rail at 1,12). The curves throw
// sparks and the speed lines and clacks come from carts.js; there are no
// switches to throw and nothing to get wrong.
//
// Walking works too (the planks are floor, the rails are floor): the whole
// trestle can be crossed on foot along the same line, and the way back west
// is the same by foot or by cart (a cart arriving from the drift rides the
// track the other way to the west stub; the home cart is at 3,8, so it stops
// just short of it and you hop out beside it). Both purses are on the
// platforms, off the track. The monsters are on the platforms' north halves,
// clear of the rails and of every walk.
//
// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   0  the drop (solid; sight goes over it)   g  trestle planks (walkable, rails run on them)

export const DIGGINGS_TRESTLE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_trestle',
  // The room's name, for the Room Editor.
  name: 'THE TRESTLE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // Darker the further down you go.
  lamplight: { shade: 0.5 },

  tiles: [
    '########################################',
    '##########WWWWWWWWWWWWWWWWWWWWW#########',
    '#WWWWW##WW000000000000000000000WWWW#####',
    '#qqqq.WW..000000000000000000000qqqq#####',
    '#qqqq...I.000000000000000000000.qqq#####',
    '#..qOq....000000000000000000000.O..#####',
    '#..qqq...00000000000000000000000...#####',
    'W.......00000000000000000000000....#####',
    '..........ggggg0000000000000000....#####',
    '......qqq.0000g0000000000000000....WWWWW',
    '#....qqq..0000g0000000000000000.....q...',
    '#....qO...0000g00000000000ggggg.........',
    '#q........0000ggggggggggggg0000I...#####',
    '#qqqq.q...0000000000000000000000.O.#####',
    '#qqqqqq##.0000000000000000000000...#####',
    '##########000000000000000000000#########',
    '########################################',
    '########################################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '..╶───────────┐.........................',
    '..............│.........................',
    '..............│.........................',
    '..............│...........┌─────────────',
    '..............└───────────┘.............',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
  ],
  // The ride is dressed up (see `ride` at the top of src/overworld/carts.js): the
  // planks drop away behind the cart, the camera leans out over the drop at the
  // first turn, the cart picks up speed down the timbers and along the low deck,
  // a flock of bats bursts out of the black, the landing at the bottom jolts,
  // and it all works the same going back from the drift. Nothing here changes the track or the floor.
  ride: {
    crumble: true,
    beats: [
      { at: [9, 8], dir: 'R', cruise: 120, sfx: 'whoosh' },
      { at: [12, 8], dir: 'R', bias: [10, 46], shake: [1, 0.3] },
      { at: [14, 9], cruise: 168, sfx: ['creak', 'whoosh'], shake: [2, 0.35], sparks: 4 },
      { at: [14, 10], bats: 9, bias: [0, 20] },
      { at: [14, 11], sfx: 'whoosh', bats: 5 },
      { at: [14, 12], sfx: ['thud', 'hit'], shake: [4, 0.5], sparks: 8, dust: 6, bias: [0, -10] },
      { at: [19, 12], dir: 'R', sfx: 'whoosh', sparks: 2 },
      { at: [26, 12], cruise: 130, sfx: ['creak', 'thud'], shake: [3, 0.4], sparks: 8, bias: null },
      { at: [29, 11], dir: 'R', line: true, sfx: 'whoosh' },
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // The east door has rail in it (39,11): a cart rides through, and arrives on the
  // rail at 1,12 in the flooded drift. The west door has no rail (walk).
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_old_seam', spawn: { x: 36, y: 8 } },
    { x: 39, y: 10, w: 1, h: 2, to: 'diggings_flooded_drift', spawn: { x: 1, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The cart, signs and purses on both platforms.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save point near the way in (added so the mines have more of them).
    { sprite: 'savepoint', x: 2, y: 13, save: true },
    { sprite: 'mine_cart', x: 3, y: 8, cart: 'a', text: 'cart_stuck' },
    { sprite: 'sign', x: 5, y: 6, text: 'tr_sign' },
    { sprite: 'warning_sign', x: 9, y: 9, text: 'tr_warning' },
    { sprite: 'ore_sacks', x: 3, y: 11, text: 'd_sacks' },
    { sprite: 'toolbox', x: 33, y: 6, text: 'd_toolbox' },
    { sprite: 'mine_lamp_hung', x: 4, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 8, y: 12, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 32, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 34, y: 8, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 1, y: 14, text: 'tr_pouch', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 34, y: 14, text: 'tr_pouch_east', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 5, y: 2, text: 'd_post' },
    { sprite: 'tiny_tools', x: 34, y: 2, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 35, y: 9, text: 'd_post' },
    { sprite: 'floor_pebbles', x: 8, y: 5, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 33, y: 5, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 5, y: 7, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'ore_crumbs', x: 7, y: 11, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 5, y: 14, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', '0': 'tr_drop', g: 'd_trestle', W: 'd_face' },

  // A drillbug on the west platform (row 4) and a slagling on the east (row 4). Both
  // are away from the track (row 8 west, row 11 east).
  npcs: [
    { enemy: 'drillbug', x: 5, y: 4, patrol: [2, 7] },
    { enemy: 'slagling', x: 32, y: 4, patrol: [31, 34] },
    // A magpie mole on the west platform's south end (row 13, x 5 to 9), below the rails (rows
    // 8 to 12), clear of the save point (2,13) and the first purse.
    { enemy: 'magpiemole', x: 7, y: 13, patrol: [5, 9] },
  ],
};
