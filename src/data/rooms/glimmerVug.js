// THE VUG: a pocket in the rock the size of a cupboard, behind a vein of the
// cave wall that wasn't really wall, and every inch of it crystal. The water of
// the falls has been dripping in here for a thousand years and grown a thousand
// shapes. A chest sits at the heart of it with a sword in, pale and clear as
// ice, called the Quartz Edge (quartz_edge). There was a purse too, with a
// note.
//
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)
//   .  lilac cave floor   ,  glowing moss   x  crystal-studded rock (solid, glows)
//   O  crystal cluster (solid)   J  crystal spires   ^  crystal spike   N  ferns
export const GLIMMER_VUG = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_vug',
  // The room's name, for the Room Editor.
  name: 'THE VUG',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // How it rings (a little hollow: ECHOES in src/audio/music.js).
  echo: 'pocket',

  tiles: [
    '##############',
    '##############',
    '#WWWWWWVWWWWW#',
    '#WWWWWWWWWWWW#',
    '#xx.N...N..xx#',
    '#x..........x#',
    '#O...,..,...O#',
    '#O.,......,.O#',
    '#............#',
    '#xJO......O^x#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'glimmer_echo_falls', spawn: { x: 16, y: 4 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    { sprite: 'chest', x: 6, y: 5, text: 'vug_chest', gives: 'quartz_edge', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'crystal_bloom', x: 3, y: 5, text: 'vug_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_gold_l', x: 8, y: 5, text: 'vug_crystal' },
    { sprite: 'crystal_teal_s', x: 2, y: 8, text: 'vug_crystal' },
    { sprite: 'crystal_pink_s', x: 11, y: 8, text: 'vug_crystal' },
    { sprite: 'crystal_violet_s', x: 5, y: 4, text: 'vug_crystal' },
    { sprite: 'crystal_pool', x: 9, y: 8, text: 'vug_pool', animation: 'crystal_pool', speed: 0.5 },
    { sprite: 'glowcap_small', x: 4, y: 8, text: 'vug_glowcap' },
    { sprite: 'glow_moss', x: 7, y: 7, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'glow_moss', x: 5, y: 7, walkable: true, animation: 'glow_moss', speed: 0.7 },
    { sprite: 'gold_pouch', x: 10, y: 4, text: 'vug_purse', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', x: 'vug_wall', O: 'cave_cluster', J: 'cave_spires', '^': 'cave_spike',
  },

  // None: it's a cupboard.
  npcs: [],
};
