// THE ISLES: a scatter of islands in the black water, joined by wading
// shallows, a line of stepping flagstones and, in two places, nothing at
// all: a channel of open water one stride wide. Two drift logs lie on the
// islands. A log you push rolls till something stops it, and sinks into the
// first open water it meets, and you walk across on its back.
// The way over is the north one: wade the shallows to the first island, where
// the log has to be walked round to row 5 before it will go east; then the
// same trick on the second. Push a log along the wrong row and it sinks in
// a channel two strides wide, and is wasted (the stump puts them back).
// The south way, over the stepping stones, is a dead end with a purse and an
// olm; the shallows on the far side lead back to a second purse and a chest.
//
// logs: L1 (18,7) up to (18,5) (the boulder at 18,4 stops it), then east along
//   row 5 to the channel at 25,5. L2 (28,4) down to (28,6) (the boulder at
//   28,7 stops it), then east along row 6 to the channel at 34,6.
// Tile key (see src/overworld/deepTiles.js for how the Stillwater draws them):
//   #  cold black rock overhead (solid)   W  pale flowstone rock face (solid)
//   .  pale wet stone   ;  shallows (walkable)   ~  black water (solid)
//   I  fluted pillar (solid)   J  broken pillar (solid)   O  boulder (solid)
//   ^  stalagmite (solid)
export const STILLWATER_ISLES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'stillwater_isles',
  // The room's name, for the Room Editor.
  name: 'THE ISLES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stillwater',
  // "The Stillwater" (src/data/music/stillwaterTheme.js).
  music: 'stillwater',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'lake',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // A little mist on the water.
  fog: 0.18,
  vesWell: true,

  tiles: [
    '############################################',
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#~~~~~~~~~~~~I~~WWWWWWWWW~~~qq.qq~~~~~J~~~~#',
    '#~~~~~~~~~~~~~~~........q~O~...qOq~~~~~~~~~#',
    '#~~qqq~~~~~~J~~~........q~......O.~~~~qqq~~#',
    '#^qqqqqq~~~~~~~~......O.O~O~......~~qqq.q.~#',
    '#...qqqq;;;;;;;;...O....q~~~.....O~~~qq..qq#',
    '#.....q...~~~~~~.......qq~~~.Oqq..~~~qq.qq.#',
    '..........~~~~~~~...qqqq~~~~~qqq~~~~qqq.....',
    '..........~~~~~~~~~~~~~~~~~~~~~~~~~~qqq.....',
    '#........q~~~~~~~~~~~~~~~~~~~~J~~~~~qq.....#',
    '#qq.....qqq.~~~.....qq~~J~~~qqqqq~~Jqq..q..#',
    '#qOq....~~~.~~.......q;~~~~...qqqq~~qq...qq#',
    '#~~qq.~~~~~.........qq;~~~~.......;;;q...q~#',
    '#~~~~I~~~~~~~~;;;;q;;;;~~~~~..q...~~~~...~~#',
    '#~~~~~~~J~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates (just in from the west door).
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'stillwater_shore', spawn: { x: 42, y: 7 } },
    { x: 43, y: 9, w: 1, h: 2, to: 'stillwater_reeds', spawn: { x: 1, y: 10 } },
  ],

  // No cutscenes here.
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The two logs, the stumps that put them back, a sign at the first fork,
  // a purse and a chest on the dead-end islands, and the lake's furniture.
  textFile: 'interactions/stillwater.txt',
  props: [
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 3, y: 12, save: true },
    { sprite: 'roll_log', x: 18, y: 8, text: 'lake_log', log: true },
    { sprite: 'roll_log', x: 22, y: 8, text: 'lake_log', log: true },
    { sprite: 'roll_log', x: 29, y: 5, text: 'lake_log', log: true },
    { sprite: 'roll_log', x: 30, y: 7, text: 'lake_log', log: true },
    { sprite: 'rock_stump', x: 23, y: 8, text: 'lake_stump', rockReset: true },
    { sprite: 'rock_stump', x: 30, y: 9, text: 'lake_stump', rockReset: true },
    { sprite: 'sign', x: 7, y: 8, text: 'isles_sign' },
    // Tarn's whistle barrel, in a barrel washed up where the stepping stones run out (the whistle quest: Seam Nine's roster).
    { sprite: 'barrel', x: 16, y: 14, text: 'isles_barrel', gives: 'whistle_barrel', taken: { sprite: 'barrel', text: 'isles_barrel_empty' } },
    { sprite: 'gold_pouch', x: 20, y: 14, text: 'isles_purse', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 14, text: 'isles_far_purse', gold: 105, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 29, y: 13, text: 'isles_chest', gives: 'jam_tart', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'glow_reeds_tall', x: 2, y: 7, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'glow_reeds', x: 9, y: 13, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds_tall', x: 35, y: 5, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.55 },
    { sprite: 'glow_reeds', x: 41, y: 12, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'glow_reeds_tall', x: 16, y: 13, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'fungus_pads', x: 14, y: 6, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 12, y: 9, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 22, y: 10, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 34, y: 11, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 18, y: 16, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'sunken_pillar_top', x: 10, y: 11, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 26, y: 10, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 25, y: 4, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    { sprite: 'sunken_pillar_top', x: 6, y: 4, text: 'pillar_top', animation: 'sunken_pillar_top', speed: 0.6 },
    // Set dressing: roots down the walls, and smooth stones and a drip or two
    // on the floor (walkable: in nobody's way).
    { sprite: 'wall_roots', x: 19, y: 3, text: 'sw_roots' },
    { sprite: 'wall_roots', x: 28, y: 2, text: 'sw_roots' },
    { sprite: 'floor_pebbles_cool', x: 6, y: 10, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 36, y: 10, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'drip_puddle', x: 22, y: 13, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles_cool', x: 29, y: 14, walkable: true, flat: true },
    { sprite: 'floor_pebbles_cool', x: 39, y: 14, walkable: true, flat: true },
  ],
  tileTexts: {
    '#': 'lake_rock', W: 'lake_wall', '~': 'lake_water', ';': 'lake_shallows',
    I: 'lake_pillar', J: 'lake_broken_pillar', O: 'lake_boulder', '^': 'lake_stalagmite',
  },

  // A blindfish patrols the black water south of the north islands (row 11:
  // you only meet it from the stepping stones or the south islands), and an
  // olm waits on the dead-end island's shallows. No scenes here, nothing to
  // keep clear of; neither is near a door.
  npcs: [
    { enemy: 'blindfish', x: 20, y: 11, patrol: [13, 33], behaviour: 'patrol' },
    { enemy: 'olm', x: 18, y: 14, patrol: [15, 21], behaviour: 'patrol' },
    // A fiddler on the east shore (row 8, x 37 to 39), past the last channel and above the
    // chest island; no cutscenes here, and the drift logs and the stones are all to the west.
    // It turns three tiles short of the east door, so coming in from the reeds (42,9) never
    // lands you on it.
    { enemy: 'fiddler', x: 38, y: 8, patrol: [37, 39], behaviour: 'patrol' },
  ],
};
