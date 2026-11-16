// THE GEODE: you walk into the inside of a stone egg the size of a church and
// find it lined with crystal. A crack runs across the floor, a bridge's
// worth of nothing, with the kingdom glittering far down in it, and it goes
// the whole way from the back wall to the front. There is no light puzzle
// here: a climb, and a shove. The only way over the crack is the ridge across
// its head (B, 24 high), and you can't jump a tall block from the floor (a
// jump gets you up one step, 12, never two). The steps are stones: the two
// flat rocks here are `step` rocks, so you can lean on one to roll it a tile at
// a time (like any push rock) and, once it sits still, jump up onto it (12
// high), and from there onto a tall block. Dropping off a wall is always safe.
//
// The hill (the west side of the crack): x 10-17, rows 4-8.
//   A, the hill proper: B at x 11-14 on rows 4 and 7, x 11-12 on rows 5-6, round a
//     little sunk yard (floor, x 13-14, rows 5-6). The hill is ringed with solid
//     crystal (O, J, p) so the ONLY floor that touches it is the notch S at (10,6),
//     in front of B (11,6): a stone sitting on S is the way up onto the hill.
//   The yard holds the second stone Y at (14,5). The yard can't be reached from the
//     floor at all, only from the top of A, and its mouth is a lane (15-16, row 5)
//     running east to the foot of the ridge's cliff (B at 17,5). b at (14,6) is a
//     step up out of the yard onto A again (so the yard is never a pit).
//   The ridge R: B at x 17-19, rows 4-6 (the cliff faces the lane), then b at (20, rows
//     4-6), then the floor at x 21. Nothing but the lane's end touches it (O at 15-16
//     row 4, 15-16 row 6, (17,7)), so the only way onto R is a stone at the foot of
//     the cliff, at (16,5).
// The way over: roll the loose stone R1 (8,10) west to column 5 (3 shoves), north up
// column 5 to row 6 (4 shoves; column 3 and 4 won't do, the b blocks at (2-3,6) stand
// in the way of the last shove), then east along row 6 to S (5 shoves; it stops
// against B). Jump up onto it, up onto A, along to the yard (drop in), and shove the
// yard stone Y east (2 shoves) through the lane to the cliff. Jump up onto it, onto the
// ridge, and across. Coming back is the same road backwards (R, drop into the lane,
// b (14,6) up onto A, drop at S) so nothing here needs the stump to cross; the stump
// (2,9), or Z twice on a stone, puts both back if one is shoved into a corner.
// Soft locks: none (a search over every shove, 43,090 states, every one of them can still
// reach the far side; the shortest way is 14 shoves).
// West corner: b (2,6) / (3,6) -> B (2,5) / (3,5), the purse is on (2,5).
// Far side: b (26,6) / (27,6) -> B (26,5) / (27,5), the chest is on (26,5).
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   .  lilac cave floor   ,  glowing moss   ~  glowing pool (solid)
//   b  amethyst block, 12 high   B  amethyst block, 24 high
//   O  crystal cluster (solid)   J  crystal spires   ^  crystal spike
//   p  small glowing mushrooms (solid)   _  the crack: open air
export const GLIMMER_GEODE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_geode',
  // The room's name, for the Room Editor.
  name: 'THE GEODE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // The view down through the crack.
  vista: { kind: 'kingdom' },

  tiles: [
    '##############################',
    '##############################',
    '#WWWWVWWWWWWWWWWWHWWWWWWWVWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.........OBBBBOOBBBb.O.....O#',
    '#.BBp....JOBB....BBBb...^.BB.#',
    '#.bb.......BB.bOOBBBb.....bb.#',
    '#.....~~~~OBBBBOJO__........,#',
    '#.....~~~~OJpJO...__...,,...,#',
    '#,....~~~~........__.....,.N..',
    '..............O...__...J......',
    '.....,,......p....__N....p...#',
    '#.........NJ.N....__.,.......#',
    '#O.....O..........__.O......O#',
    '##############################',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'glimmer_prism_hall', spawn: { x: 30, y: 7 } },
    { x: 29, y: 9, w: 1, h: 2, to: 'glimmer_echo_falls', spawn: { x: 1, y: 9 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 3, y: 12, save: true },
    // The prizes: the chest up a flight of blocks on the far side (past the
    // ridge), the purse up a flight in the near corner.
    { sprite: 'chest', x: 26, y: 5, text: 'geode_chest', gives: 'prism_canopy', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 5, text: 'geode_purse', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The geode.
    { sprite: 'crystal_bloom', x: 8, y: 12, text: 'geode_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_pink_l', x: 22, y: 6, text: 'geode_crystal' },
    { sprite: 'crystal_teal_l', x: 6, y: 5, text: 'geode_crystal' },
    { sprite: 'crystal_gold_l', x: 24, y: 12, text: 'geode_crystal' },
    { sprite: 'crystal_violet_s', x: 14, y: 12, text: 'geode_crystal' },
    { sprite: 'crystal_teal_s', x: 21, y: 9, text: 'geode_crystal' },
    { sprite: 'glowcap_trio', x: 12, y: 11, text: 'geode_trio' },
    { sprite: 'glowcap_big', x: 27, y: 11, text: 'geode_glowcap' },
    { sprite: 'glowcap_small', x: 1, y: 7, text: 'geode_glowcap' },
    { sprite: 'glow_moss', x: 14, y: 12, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 5, y: 11, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 25, y: 9, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'sign', x: 2, y: 12, text: 'geode_sign' },
    // The two stepping stones (flat-topped, a jump high: `step`). The loose one
    // is the way onto the hill; the other is shut in the yard on top of it.
    // The stump puts them both back.
    { sprite: 'push_rock', x: 8, y: 10, text: 'geode_rock', rock: true, step: true },
    { sprite: 'push_rock', x: 14, y: 5, text: 'geode_rock_yard', rock: true, step: true },
    // The yard on top of the hill, which only the top of the hill touches: a miner's lunch tin
    // left there (Fenn's, "taken up to the light"): the whistle pea (the seven-shift quest, Seam Nine's roster).
    { sprite: 'lunch_crate', x: 13, y: 6, text: 'geode_tin', gives: 'whistle_pea', notice: true, taken: { sprite: 'lunch_crate', text: 'geode_tin_empty' } },
    { sprite: 'rock_stump', x: 2, y: 9, text: 'rock_stump', rockReset: true },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gl_crystal_web', x: 6, y: 4, text: 'gp_web', animation: 'gl_crystal_web', speed: 0.9 },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    '~': 'cave_pool', O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
    _: 'geode_crack', B: 'geode_block', b: 'geode_block',
  },

  // A gleamsnail on the near side, and on the far side a quartzling among the
  // crystals and a prismoth fluttering about the east floor. No scenes here, so nothing to keep clear of
  // (the quartzling at 23,7 is two tiles from where the ridge lets you down).
  npcs: [
    { enemy: 'gleamsnail', x: 12, y: 13, patrol: [9, 16], behaviour: 'patrol' },
    { enemy: 'quartzling', x: 23, y: 7, patrol: [23, 23], behaviour: 'disguise', reach: 3 },
    { enemy: 'prismoth', x: 22, y: 11, patrol: [20, 24], behaviour: 'patrol' },
  ],
};
