// THE KING'S ROAD: the last of the Glimmering. A wide old road runs along the
// outside of the cavern wall, high above everything, and every step of it the
// view gets bigger: the whole buried kingdom far down in its haze, a lake,
// spires, and in the middle of it a town under a great crystal that ought to
// be a sun and is only a lamp turned low. Tuck is waiting on the road ahead
// and finally says what he's afraid of (tuck_on_the_road). By the end of the
// road the first glow-worm lamps are lit, and then the town's gate.
//
// Cutscene clearance: no monsters on the road. The scene walks along rows 6
// to 8 between x 22 and 38.
//
// The secret (optional): along the north wall, west of the bend, four
// crystals stand in steps, each ringing a different note (src/overworld/chimes.js).
// A worn stone beside them has the chapter's four-note tune cut into it. Ring
// the crystals in that order (G C E D: lowest, second, tallest, third) and
// the cavern sings it back, and the sealed geode in the corner splits to show
// a chest with the Singing Shard in it. A wrong note only clinks and starts over.
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   .  lilac cave floor (the road)   ,  glowing moss   N  glowing ferns
//   O  crystal cluster (solid)   J  crystal spires   ^  crystal spike
//   p  small glowing mushrooms (solid)   b/B  amethyst blocks
//   _  open air: the view over the edge shows through
export const GLIMMER_KINGS_ROAD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_kings_road',
  // The room's name, for the Room Editor.
  name: 'THE KING\'S ROAD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // The view down over the buried kingdom, behind the open air.
  vista: { kind: 'kingdom' },

  tiles: [
    '########################################',
    '########################################',
    '#WWWVWWWWWWWHWWWWWWWWWVWWWWWWWWHWWWWVWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#N.....O..O..O.###...^.O.........O..B..#',
    '#.O............###.O..............J.BbO#',
    '................O.........O...N.......,#',
    '...,....,,....p.....,,..........,.......',
    '#....^.......,.............,,...........',
    '#.......J...N.........N......J.......N.#',
    '#______________________________________#',
    '#______________________________________#',
    '#______________________________________#',
    '#______________________________________#',
    '#______________________________________#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // The east door goes to Belowtown's gate: you arrive on its west edge at 1,8
  // (belowtown_gate's west door sends you back here, to 38,7).
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'glimmer_crystal_bridge', spawn: { x: 30, y: 8 } },
    { x: 39, y: 7, w: 1, h: 2, to: 'belowtown_gate', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // Where the road bends and the whole kingdom opens out.
  cutscenes: [
    { x: 21, y: 4, w: 1, h: 6, scene: 'tuck_on_the_road' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    { sprite: 'sign', x: 9, y: 6, text: 'road_sign' },
    // The singing crystals, lowest to highest note, left to right (the tune
    // goes G C E D, so: first, second, fourth, third), the stone that has the
    // tune on it, and the cache that opens when it's sung.
    { sprite: 'singing_a', x: 3, y: 4, text: 'singing_crystal', chime: { set: 'cavern', note: 0 } },
    { sprite: 'singing_b', x: 6, y: 4, text: 'singing_crystal', chime: { set: 'cavern', note: 1 } },
    { sprite: 'singing_c', x: 9, y: 4, text: 'singing_crystal', chime: { set: 'cavern', note: 2 } },
    { sprite: 'singing_d', x: 12, y: 4, text: 'singing_crystal', chime: { set: 'cavern', note: 3 } },
    { sprite: 'stave_stone', x: 11, y: 4, text: 'stave_stone' },
    { sprite: 'sealed_geode', x: 1, y: 4, text: 'sealed_geode', opensWith: ['cavern_song'] },
    { sprite: 'chest', x: 1, y: 4, text: 'singing_chest', gives: 'singing_shard', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'crystal_bloom', x: 14, y: 5, text: 'road_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_teal_l', x: 4, y: 5, text: 'road_crystal' },
    { sprite: 'crystal_pink_l', x: 18, y: 9, text: 'road_crystal' },
    { sprite: 'crystal_gold_l', x: 28, y: 4, text: 'road_crystal' },
    { sprite: 'crystal_violet_s', x: 11, y: 9, text: 'road_crystal' },
    { sprite: 'crystal_pink_s', x: 24, y: 9, text: 'road_crystal' },
    { sprite: 'crystal_teal_s', x: 31, y: 5, text: 'road_crystal' },
    { sprite: 'glowcap_trio', x: 6, y: 9, text: 'road_trio' },
    { sprite: 'glowcap_big', x: 25, y: 4, text: 'road_glowcap' },
    { sprite: 'glowcap_tall', x: 2, y: 9, text: 'road_glowcap' },
    { sprite: 'glowcap_small', x: 16, y: 9, text: 'road_glowcap' },
    { sprite: 'glow_moss', x: 8, y: 7, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'glow_moss', x: 20, y: 7, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'glow_moss', x: 27, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7 },
    // The first of the town's lamps, lit along the edge, and a post for what's ahead.
    { sprite: 'glowworm_lamp', x: 30, y: 9, text: 'road_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 33, y: 9, text: 'road_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 36, y: 9, text: 'road_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'town_signpost', x: 35, y: 6, text: 'road_signpost' },
    // A purse up on a high block (b, then B), tucked into a corner of the cave wall.
    { sprite: 'gold_pouch', x: 36, y: 4, text: 'road_purse', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike', p: 'cave_mushrooms',
    _: 'road_edge', B: 'geode_block', b: 'geode_block',
  },

  // None: it's a walk, and the scene wants the road clear.
  npcs: [],
};
