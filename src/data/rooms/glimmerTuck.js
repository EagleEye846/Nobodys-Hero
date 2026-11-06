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
    { sprite: 'glow_moss', x: 8, y: 7, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'glow_moss', x: 15, y: 9, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'glow_moss', x: 21, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'glow_moss', x: 5, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'sign', x: 3, y: 7, text: 'tuck_sign' },
    { sprite: 'gold_pouch', x: 24, y: 4, text: 'tuck_purse', gold: 65, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    '~': 'cave_pool', O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
  },

  // None: the scene needs the room to itself.
  npcs: [],
};
