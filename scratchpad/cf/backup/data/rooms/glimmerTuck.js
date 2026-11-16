// THE GROTTO OF TUCK: a quiet round grotto past the falls, lit from the floor.
// Nothing to solve, nothing to fight. A great violet crystal in the middle of
// it has someone hiding behind it (tuck_finds_you plays as you walk in: a page
// in a tabard much too big for him, peeking out and ducking back). A save
// point glows in the corner, and the way on is east.
//
// Cutscene clearance: no monsters here. The scene's walks use rows 6 to 9.
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   .  lilac cave floor   ,  glowing moss   ~  glowing pool (solid)
//   O  crystal cluster (solid)   J  crystal spires   ^  crystal spike
//   p  small glowing mushrooms (solid)   N  glowing ferns (walkable)
export const GLIMMER_TUCK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_tuck',
  // The room's name, for the Room Editor.
  name: 'THE QUIET GROTTO',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // How it rings (a cave: ECHOES in src/audio/music.js).
  echo: 'cave',

  tiles: [
    '##########################',
    '##########################',
    '#WWWWVWWWWWWWWWHWWWWWVWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWW#',
    '#N.p..^.J.~~~...O.^.N....#',
    '#.........~~~...........O#',
    '#..........,,...........,#',
    '#O......,................#',
    '.....,...............,....',
    '...............,..........',
    '#......,...O....,.....p..#',
    '#N...................O..N#',
    '##########################',
    '##########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'glimmer_echo_falls', spawn: { x: 28, y: 10 } },
    { x: 25, y: 8, w: 1, h: 2, to: 'glimmer_crystal_bridge', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // A line across the grotto's west side.
  cutscenes: [
    { x: 6, y: 4, w: 1, h: 8, scene: 'tuck_finds_you' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    // The crystal he hides behind (2 wide: the scene hides him at 17.5,6).
    { sprite: 'crystal_violet_l', x: 17, y: 7, text: 'tuck_crystal' },
    { sprite: 'savepoint', x: 23, y: 10, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 24, y: 10, travel: 'quiet_grotto', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    { sprite: 'crystal_bloom', x: 6, y: 5, text: 'tuck_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_pink_l', x: 22, y: 5, text: 'tuck_crystal_other' },
    { sprite: 'crystal_teal_s', x: 14, y: 5, text: 'tuck_crystal_other' },
    { sprite: 'crystal_gold_s', x: 4, y: 10, text: 'tuck_crystal_other' },
    { sprite: 'crystal_teal_l', x: 9, y: 11, text: 'tuck_crystal_other' },
    { sprite: 'glowcap_big', x: 13, y: 11, text: 'tuck_glowcap' },
    { sprite: 'glowcap_trio', x: 18, y: 11, text: 'tuck_trio' },
    { sprite: 'glowcap_tall', x: 2, y: 5, text: 'tuck_glowcap' },
    { sprite: 'glowcap_small', x: 20, y: 5, text: 'tuck_glowcap' },
    { sprite: 'crystal_pool', x: 10, y: 4, text: 'tuck_pool', animation: 'crystal_pool', speed: 0.5 },
    { sprite: 'glow_moss', x: 8, y: 7, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 15, y: 9, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 21, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 5, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'sign', x: 3, y: 7, text: 'tuck_sign' },
    { sprite: 'gold_pouch', x: 24, y: 4, text: 'tuck_purse', gold: 65, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'col_token', x: 1, y: 6, walkable: true, flat: true, gives: 'tally_rope', taken: { gone: true } },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gl_chime_stalk', x: 3, y: 5, text: 'gp_chime', animation: 'gl_chime_stalk', speed: 0.6, walkable: true },
    { sprite: 'gl_sweet_tin', x: 21, y: 4, text: 'lp_tuck_tin', gives: 'dab_tin', react: true, walkable: true, taken: { gone: true } },
    { sprite: 'gl_old_shell', x: 2, y: 9, text: 'gp_shell', walkable: true },
    { sprite: 'gl_mirror_puddle', x: 8, y: 10, text: 'gp_puddle', animation: 'gl_mirror_puddle', speed: 0.7, flat: true, walkable: true },
    { sprite: 'crystal_gold_s', x: 19, y: 4, text: 'gp_gem', walkable: true },
    { sprite: 'gl_glowbug', x: 12, y: 10, text: 'gp_bug', animation: 'gl_glowbug', speed: 0.5, walkable: true },
    { sprite: 'gl_glitter', x: 11, y: 11, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'gl_glitter', x: 2, y: 7, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'glow_moss', x: 17, y: 10, animation: 'glow_moss', speed: 0.7, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 14, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 20, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'gl_geode_half', x: 15, y: 11, text: 'gp_geode', walkable: true },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    '~': 'cave_pool', O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
  },

  // None: the scene needs the room to itself.
  npcs: [],
};
