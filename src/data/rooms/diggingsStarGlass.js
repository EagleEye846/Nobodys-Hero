// THE GLASSWORKS (secret, draft): a cavern the star's heat ran through, with a
// twelve-wide drop where the floor fell away and the glass set over the edges.
// The miners got across by light: they hung sun-crystals and prisms from the
// roof, and the light made a road. It only works one way now, and in three
// steps (the Glimmering's tricks, in the miners' own coat).
//
// beam: S1 (the sun-crystal at 2,4) throws right along row 4 to the prism PA at 6,4.
//   PA is set '/' (up, into the rock): turn it to '\' and the beam runs down column 6 to
//   the clamped prism PC at 6,10 ('\', right) and along row 10 to the eye E1 at 10,10
//   (latched, sg1), which lays the near span (x 11 to 14, rows 8-9) to the island.
//   S2 (the island's sun-crystal, 15,6) only wakes with sg1 and throws right along row 6,
//   but the crystal standing at 17,6 stops it. Ves, steered (Q), stands at 16,6 facing down and
//   bounces it down column 16 to the eye E2 at 16,8 (latched, sg2): the far span (x 19 to 22).
//   S3 (24,12) only wakes with sg2 and throws right along row 12 at a loose prism LP
//   (27,12, set '\', into the floor). Shove LP east to 30,12 (stand at 26,12 and lean) and
//   turn it '/': the beam goes up column 30 to the eye E3 at 30,6 (latched, sg3), which opens
//   the gate across the corridor to the camp.
// Nothing can be lost: every eye latches, the spans stay once lit, the stump at 25,9 puts
//   LP and the prisms home, and either of you can walk back over the spans.
//   (LP shoved too far east at 32,12 can't be pushed back: use the stump.)
//   Ves can't push LP, and only the hero can stand on the west side of it.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  ore rock (solid)
//   x  glassy crystal (solid)       q  loose gravel        ^  stalagmite (solid)
//   0  the drop (solid, a beam flies over it)   .  packed dirt floor

import { DIGGINGS_DRESSING } from '../diggingsDressing.js';

export const DIGGINGS_STAR_GLASS = {
  id: 'diggings_star_glass',
  name: 'THE GLASSWORKS',
  area: 'diggings',
  // "Something Hums Below" (src/data/music/starSeamTheme.js), the secret seam's own song.
  music: 'starSeam',
  ambience: 'mine_quiet',
  echo: 'cavern',
  lamplight: { shade: 0.62 },

  tiles: [
    '####################################',
    '####################################',
    '###WWWWWWWW############WWWWWWWW#####',
    '##W........000000000000...^xx.^W####',
    '#W.........000000000000.........W###',
    '#...q......000000000000...q......###',
    'W..........0000....0000.q........###',
    '...........0000....0000..........WWW',
    '...........0000....0000....q........',
    '..qq.......0000....0000............q',
    '#x.q.......000000000000..........###',
    '#..........000000000000.........x###',
    '#..........000000000000..........###',
    '####.^.OO..000000000000..x...O######',
    '####################################',
    '####################################',
  ],

  // The two spans of light over the drop, each standing while its eye is lit
  // (both latch, so for good once lit).
  lightBridges: [
    { x: 11, y: 8, w: 4, h: 2, when: 'sg1' },
    { x: 19, y: 8, w: 4, h: 2, when: 'sg2' },
  ],

  playerStart: { x: 1, y: 8 },

  doors: [
    { x: 0, y: 7, w: 1, h: 3, to: 'diggings_star_siding', spawn: { x: 34, y: 8 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'diggings_star_gallery', spawn: { x: 1, y: 8 } },
  ],
  cutscenes: [],

  textFile: 'interactions/star_seam.txt',
  props: [
    ...(DIGGINGS_DRESSING.diggings_star_glass ?? []),
    // The first road: the sun-crystal, the prism you turn, the clamped prism, the eye.
    { sprite: 'sun_crystal', x: 2, y: 4, beam: 'right', text: 'g_sun' },
    { sprite: 'prism', x: 6, y: 4, mirror: '/', text: 'g_prism' },
    { sprite: 'prism', x: 6, y: 10, mirror: '\\', fixed: true, text: 'g_prism_fixed' },
    { sprite: 'crystal_eye', x: 10, y: 10, eye: 'sg1', text: 'g_eye_1' },
    // The island: a sleeping sun-crystal, the crystal that blocks it, the eye Ves lights.
    { sprite: 'sun_crystal', x: 15, y: 6, beam: 'right', beamWhen: 'sg1', text: 'g_sun_island' },
    { sprite: 'crystal_gold_s', x: 17, y: 6, text: 'g_pillar' },
    { sprite: 'crystal_eye', x: 16, y: 8, eye: 'sg2', text: 'g_eye_2' },
    { sprite: 'gold_pouch', x: 18, y: 7, text: 'g_pouch_i', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The far ledge: the sleeping crystal, the loose prism, the last eye, the gate.
    { sprite: 'sun_crystal', x: 24, y: 12, beam: 'right', beamWhen: 'sg2', text: 'g_sun_far' },
    { sprite: 'prism', x: 27, y: 12, mirror: '\\', rock: true, text: 'g_prism_loose' },
    { sprite: 'crystal_eye', x: 30, y: 6, eye: 'sg3', text: 'g_eye_3' },
    { sprite: 'gate_narrow', x: 33, y: 8, text: 'g_gate', opensWith: ['sg3'], openText: 'g_gate_open' },
    { sprite: 'gate_narrow', x: 33, y: 9, text: 'g_gate', opensWith: ['sg3'], openText: 'g_gate_open' },
    { sprite: 'rock_stump', x: 25, y: 9, text: 'g_stump', rockReset: true },
    { sprite: 'sign', x: 3, y: 6, text: 'g_sign' },
    { sprite: 'gold_pouch', x: 2, y: 11, text: 'g_pouch_w', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing.
    { sprite: 'crystal_teal_s', x: 9, y: 3, text: 'g_crystal' },
    { sprite: 'crystal_violet_s', x: 24, y: 3, text: 'g_crystal' },
    { sprite: 'mine_lamp_hung', x: 6, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 27, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 9, y: 7, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'wall_shoring', x: 8, y: 2, text: 'sc_shoring' },
    { sprite: 'drip_puddle', x: 8, y: 6, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 4, y: 9, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 28, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 22, y: 5, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sc_ore', x: 'sc_glass', '^': 'sc_stalag', '0': 'g_drop' },

  // A gleamsnail on the near ledge's south side (row 12, x 2 to 8) and a drillbug
  // on the far ledge's north side (row 4, x 24 to 30): clear of every beam line.
  npcs: [
    { enemy: 'gleamsnail', x: 4, y: 12, patrol: [2, 8] },
    { enemy: 'drillbug', x: 27, y: 4, patrol: [24, 30] },
  ],
};
