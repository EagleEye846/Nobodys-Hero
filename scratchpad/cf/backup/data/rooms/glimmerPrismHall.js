// THE PRISM HALL: a long, high hall where the light is taught to you. A pool
// runs across it like a moat, with the exit beyond. On this side: two sun-
// crystals, only one of them awake, two crystal eyes, a gate of crystal bars,
// and a single loose prism standing off by itself. Two beams cross over an
// empty tile in the middle of the hall, and the one prism has to serve both of
// them: stood where they meet and turned the right way, it takes the first beam
// down to the first eye, which wakes the second crystal and opens the gate, and
// the second crystal's beam then comes down into the same prism and is sent the
// other way, along the hall, through the gate. That is the one place Ves is
// wanted: she stands in that beam (Q to steer her), holds her umbrella down,
// and sends it to the second eye, which lays a bridge of light across the pool
// for good. (The first eye only stays lit while the beam holds, which is why
// the prism has to stay where it is, and why Ves can't just do the prism's job
// herself: she can only send a beam one way at a time.)
//
// beam: the sun-crystal S1 at 4,8 throws right along row 8. The sun-crystal
//   S2 at 15,4 (asleep until the eye hall_a is lit) throws down column 15.
//   The loose prism starts at 13,10, set '/'. At 15,8, set '\\', it
//   takes S1's beam down column 15 to the eye hall_a at 15,11 (not latched),
//   which opens the gate at 16,8 and wakes S2; S2's beam then comes down
//   column 15 into the prism and out along row 8: through the gate, to Ves at
//   18,8 facing down, and down column 18 to the eye hall_b at 18,11 (latched,
//   it lays the bridge for good). Without the prism at the crossing S1's
//   beam hits the closed gate, and nothing wakes. A stump by the wall puts the
//   loose prism back if it gets pushed somewhere silly.
// Tile key (see src/overworld/brightTiles.js for how the Glimmering draws them):
//   #  dark rock overhead (solid)   W  rock face with veins of crystal (solid)
//   V  wall with a fat glowing vein (solid)   H  wall hung with glowing moss
//   .  lilac cave floor   ,  glowing moss   ~  glowing pool (solid)
//   b  amethyst block, 12 high   B  amethyst block, 24 high
//   O  crystal cluster (solid)   I  crystal column (solid)   J  crystal spires
//   p  small glowing mushrooms (solid)   F  moss mound (solid)   N  glowing ferns
export const GLIMMER_PRISM_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'glimmer_prism_hall',
  // The room's name, for the Room Editor.
  name: 'THE PRISM HALL',
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
    '################################',
    '################################',
    '#WWVWWWWWWWWWHWWWWWWWWVWWWWWHWW#',
    '#WWWWWWWKWWWWWWWWWWWWWWWWWWWWWW#',
    '#N...p................~~.....B.#',
    '#.,.........O...O....O~~,,...BO#',
    '#.,,.........O.......O~~.....b.#',
    '......................~~.N......',
    '......................~~........',
    '#.......,,.I.......,..~~....O..#',
    '#......J.....,,....I..~~.......#',
    '#.....................~~J...,,.#',
    '#O....N........Np.....~~.....FN#',
    '################################',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'glimmer_shelf', spawn: { x: 30, y: 7 } },
    { x: 31, y: 7, w: 1, h: 2, to: 'glimmer_geode', spawn: { x: 1, y: 10 } },
  ],

  // A span of light over the pool, once the second eye is lit.
  lightBridges: [
    { x: 22, y: 8, w: 2, h: 1, when: 'hall_b' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/glimmer_caves.txt',
  props: [
    // beam: row 8 from S1 to the crossing at 15,8; column 15 from S2 to it. The loose
    // prism goes in there. Ves on 18,8 takes the row-8 beam down to the second eye.
    { sprite: 'sun_crystal', x: 4, y: 8, beam: 'right', text: 'sun_crystal' },
    { sprite: 'sun_crystal', x: 15, y: 4, beam: 'down', beamWhen: 'hall_a', text: 'sun_crystal_asleep' },
    { sprite: 'prism', x: 13, y: 10, mirror: '/', rock: true, text: 'prism_loose' },
    { sprite: 'rock_stump', x: 2, y: 10, text: 'rock_stump', rockReset: true },
    { sprite: 'crystal_eye', x: 15, y: 11, eye: 'hall_a', latch: false, text: 'crystal_eye_hold' },
    { sprite: 'crystal_eye', x: 18, y: 11, eye: 'hall_b', text: 'crystal_eye_wake' },
    // A gate of crystal bars across row 8, east of the crossing: it opens while the first eye is lit.
    { sprite: 'gate_narrow', x: 16, y: 8, text: 'hall_gate', opensWith: ['hall_a'], openText: 'hall_gate_open' },
    // The hall.
    { sprite: 'glowcap_giant', x: 5, y: 12, text: 'hall_giant' },
    { sprite: 'crystal_bloom', x: 24, y: 6, text: 'hall_bloom', animation: 'crystal_bloom', speed: 0.6 },
    { sprite: 'crystal_violet_l', x: 11, y: 7, text: 'hall_crystal' },
    { sprite: 'crystal_teal_l', x: 18, y: 6, text: 'hall_crystal' },
    { sprite: 'crystal_pink_s', x: 6, y: 9, text: 'hall_crystal' },
    { sprite: 'crystal_gold_s', x: 20, y: 12, text: 'hall_crystal' },
    { sprite: 'crystal_pink_l', x: 26, y: 12, text: 'hall_crystal' },
    { sprite: 'glowcap_trio', x: 2, y: 11, text: 'hall_trio' },
    { sprite: 'glowcap_tall', x: 12, y: 12, text: 'hall_glowcap' },
    { sprite: 'glowcap_small', x: 29, y: 8, text: 'hall_glowcap' },
    { sprite: 'glow_moss', x: 7, y: 6, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 15, y: 8, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'glow_moss', x: 27, y: 10, walkable: true, animation: 'glow_moss', speed: 0.7, decor: true },
    { sprite: 'crystal_pool', x: 20, y: 4, text: 'hall_pool', animation: 'crystal_pool', speed: 0.5 },
    { sprite: 'sign', x: 5, y: 7, text: 'hall_sign' },
    { sprite: 'gold_pouch', x: 29, y: 4, text: 'hall_purse', gold: 70, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gold_pouch', x: 21, y: 12, text: 'lp_hall_nook', gives: 'glow_pebble', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gl_chime_stalk', x: 3, y: 6, text: 'gp_chime', animation: 'gl_chime_stalk', speed: 0.6, walkable: true },
    { sprite: 'gl_geode_half', x: 18, y: 4, text: 'gp_geode', walkable: true },
    { sprite: 'gl_mirror_puddle', x: 26, y: 10, text: 'gp_puddle', animation: 'gl_mirror_puddle', speed: 0.7, flat: true, walkable: true },
    { sprite: 'gl_old_shell', x: 28, y: 12, text: 'gp_shell', walkable: true },
    { sprite: 'gl_crystal_web', x: 24, y: 9, text: 'gp_web', animation: 'gl_crystal_web', speed: 0.9, walkable: true },
    { sprite: 'gl_crumb_heap', x: 2, y: 8, text: 'gp_crumbs', walkable: true },
    { sprite: 'crystal_gold_s', x: 9, y: 5, text: 'gp_gem', walkable: true },
    { sprite: 'glowcap_small', x: 20, y: 10, text: 'gp_cap', walkable: true },
    { sprite: 'gl_shards', x: 14, y: 8, text: 'lp_hall_shards', flat: true, walkable: true },
    { sprite: 'gl_glitter', x: 6, y: 8, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'gl_glitter', x: 27, y: 6, animation: 'gl_glitter', speed: 0.45, flat: true, walkable: true, decor: true },
    { sprite: 'glow_moss', x: 10, y: 4, animation: 'glow_moss', speed: 0.7, walkable: true, decor: true },
    { sprite: 'glow_moss', x: 21, y: 11, animation: 'glow_moss', speed: 0.7, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 3, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'floor_pebbles_cool', x: 11, y: 5, flat: true, walkable: true, decor: true },
    // --- end life pass ---
  ],
  tileTexts: {
    '#': 'cave_rock', W: 'cave_wall', V: 'cave_vein', H: 'cave_moss_wall', K: 'cave_wall',
    '~': 'hall_water', O: 'cave_cluster', I: 'cave_column', J: 'cave_spires', p: 'cave_mushrooms',
  },

  // A gleamsnail in the south-west corner, well off the loose prism's slides
  // (columns 13-15), and a quartzling among the crystals on the far side of
  // the pool, out of reach of Ves's spot at 18,8. No scenes here, so nothing
  // to keep clear of.
  npcs: [
    { enemy: 'gleamsnail', x: 9, y: 12, patrol: [8, 11], behaviour: 'patrol' },
    { enemy: 'quartzling', x: 26, y: 11, patrol: [26, 26], behaviour: 'disguise', reach: 3 },
    // A prismoth on the far side of the pool (x 25 to 28, row 8), by the exit
    // road; the beams, the prism and the gate are all on the near side.
    { enemy: 'prismoth', x: 26, y: 8, patrol: [25, 28], behaviour: 'wander' },
  ],
};
