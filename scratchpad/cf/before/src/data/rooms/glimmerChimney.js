// THE CHIMNEY: a tall crack in the cavern wall, west of the Landing, that
// goes up and up into the crystal. Somebody cut crystal up here once: a line
// of old iron rings is hammered into the face, and at the top, on a little
// shelf, they left a chest. The first ring climb under the ground, and the
// gentlest: a short zigzag of rings, close together, then straight up over
// the edge (see src/overworld/climbing.js). Ves comes up after you, and down
// again when you rope down (stand on the top ring and face down). Nothing to
// fight: it's a cupboard with a very high shelf.
//
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss (solid)
//   .  lilac cave floor   ,  glowing moss   x  crystal-studded rock (solid, glows)
//   O  crystal cluster (solid)   J  crystal spires (solid)   ^  crystal spike (solid)
//   p  small glowing mushrooms (solid)   N  glowing ferns (walkable)
import { R3C_PROPS } from '../r3cLife.js';

export const GLIMMER_CHIMNEY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_chimney',
  // The room's name, for the Room Editor.
  name: 'THE CHIMNEY',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'glimmer',
  // "The Glimmering" (src/data/music/glimmerTheme.js).
  music: 'glimmer',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'crystal',
  // How it rings (a little hollow: ECHOES in src/audio/music.js).
  echo: 'pocket',

  // The chimney's face is drawn as broken rock, not coursed wall (src/overworld/cragRock.js).
  crag: [{ x: 0, y: 6, w: 18, h: 11 }],

  tiles: [
    '##################',
    '##################',
    '#####WWVWWHWW#####',
    '####xWWWWWWWWx####',
    '####x.,..N...x####',
    '####O,..,...^#####',
    '######WWWWWW######',
    '####WWWWVWWWWW####',
    '#####WWWWWWWH#####',
    '###xWWWWWWWWWWW###',
    '###WWWVWWWWWWWW###',
    '###WWWWWWWWWWHWx##',
    '####WWWWWWWVWWW###',
    '##xWWWWWWWWWWWW###',
    '##WWWWWWWWWWWWWW##',
    '###WVWWWWWWW..WW##',
    '##J.WW........O...',
    '#O..,..N......,...',
    '##p...,...^...J###',
    '###^..O....p######',
    '##################',
    '##################',
  ],

  // Where the player starts, in tile coordinates: just in from the Landing.
  playerStart: { x: 15, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // East, back out onto the Landing's ledge.
  doors: [
    { x: 17, y: 16, w: 1, h: 2, to: 'glimmer_landing', spawn: { x: 1, y: 8 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The rings: hook the lowest from just below it (8,16). An easy zigzag, two
  // tiles across and two up each time, then straight up to the clifftop ring
  // at the shelf's edge (10,5). Roping down from there lands you at 10,16.
  textFile: 'interactions/glimmer.txt',
  props: [
    ...(R3C_PROPS.glimmer_chimney ?? []),
    { sprite: 'sign', x: 6, y: 16, text: 'chimney_sign' },
    { sprite: 'swing_ring', x: 8, y: 14 },
    { sprite: 'swing_ring', x: 10, y: 12 },
    { sprite: 'swing_ring', x: 8, y: 10 },
    { sprite: 'swing_ring', x: 10, y: 8 },
    { sprite: 'grapple_ring', x: 10, y: 5, grapple: true },
    // The shelf at the top.
    { sprite: 'chest', x: 7, y: 4, text: 'chimney_chest', gives: 'glowworm_honey', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'crystal_teal_s', x: 11, y: 4, text: 'landing_crystal' },
    { sprite: 'glowcap_small', x: 6, y: 5, text: 'landing_small' },
    // The foot of the chimney.
    { sprite: 'crystal_pink_l', x: 3, y: 17, text: 'chimney_pink' },
    { sprite: 'crystal_violet_s', x: 12, y: 18, text: 'landing_crystal' },
    { sprite: 'crystal_bloom', x: 4, y: 18, text: 'landing_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'glow_moss', x: 9, y: 17, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 13, y: 16, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gl_crumb_heap', x: 5, y: 19, text: 'gp_crumbs', walkable: true },
    { sprite: 'tally_marks_a', x: 8, y: 19, text: 'lp_fell_tally', walkable: true },
    { sprite: 'gl_glitter', x: 6, y: 18, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'gl_glitter', x: 13, y: 18, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 11, y: 18, flat: true, walkable: true, decor: true },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'landing_rock', W: 'chimney_face', V: 'chimney_face', H: 'landing_moss_wall', x: 'landing_wall',
    O: 'landing_crystal', J: 'landing_spires', '^': 'landing_spike', p: 'landing_mushrooms',
  },

  // None: the climb is the thing here.
  npcs: [],
};
