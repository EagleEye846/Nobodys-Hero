// THE LAGOON: out past the market, the town's bathing lagoon behind the sea
// wall, under the cliff the lookout stands on. A plank walk down the west
// side, with a little bathing pool in it (the "front room": its water never
// changes), and beyond the rail the lagoon proper, which fills and empties
// with the sluice. Across it, under the cliff, a ledge with a rope up to the
// lookout.
//
// Scene swimming_lesson (once haddock_hums has played): Haddock, up to his
// chest in the bathing pool, teaches Bramble to swim. Bramble is terrified,
// then manages a bit, and gets the paper boat (keepsake). It all happens in
// the bathing pool, which is the same at both tides.
//
// THE PUZZLE (Saltcombe's only tide puzzle, gentle): the tide is HIGH at the
// start and the lagoon is deep. The sluice wheel (8,6) on the plank walk turns
// it either way. At LOW the bed shows, but a deep outflow gully (column 22,
// rows 7 to 20, deep at both tides) cuts it in half. The crate (19,7) floats on
// the shallows by the rail at high tide: push it east into the gully (from the
// shallows at high, or across the bed at low) and at low it sinks and bridges
// it. Over the bridge to the ledge (27..32, rows 7-8, dry at both tides) and
// the rope (x 30): walk up into the cliff to take hold, and all three climb to
// the lookout (src/overworld/ropeClimb.js). The south edge (row 20) is deep at
// both tides, so the gully can't be waded round. The wheel, the stump (2,4),
// the doors and the ledge are dry at both tides; the stump puts the crate home
// and the tide back to high. No clock.
//
// No monsters (a town).
// Tile key (see src/overworld/coastTiles.js, saltcombe):
//   #  wall top (solid)   h  the backs of the market houses (solid)   K  the cliff's rock face, # its rock (solid)
//   .  planks   f  rail (solid)   ;  shallows (walk)   ~  deep water (solid)   q  the bed (low tide)

export const SALTCOMBE_LAGOON = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_lagoon',
  // The room's name, for the Room Editor.
  name: 'THE LAGOON',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", and the town's rain on the roofs.
  music: 'saltcombe',
  ambience: 'stilt_town',
  vesWell: true,

  // The HIGH-tide map.
  tiles: [
    '####################################',
    '#hhhhhhhhhhhhhhhhhhhh###############',
    '#hhhhhhhhhhhhhhhhhhhh###############',
    '#....................KKKKKKKKKKKKKK#',
    '#....................KKKKKKKKKKKKKK#',
    '#....................KKKKKKKKKKKKKK#',
    '#........ffffffffffffKKKKKKKKKKKKKK#',
    '#........;;;;;;;;;;;;;~~~~~......~##',
    '#........~~~~~~~~~~~~~~~~~~......~##',
    '.........~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '.........~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#........~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#........~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;;;;;;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;~~~~;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;~~~~;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;~~~~;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;~~~~;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;~~~~;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;;;;;;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#........~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '####################################',
  ],

  tide: {
    // The LOW-tide map (a space is "the same as high"): the bed shows, all but the gully.
    low: [
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '         qqqqqqqqqqqqq qqqq      q  ',
      '         qqqqqqqqqqqqq qqqq      q  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq qqqqqqqqqqq  ',
      '                                    ',
      '                                    ',
    ],
    start: 'high',
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'saltcombe_market', spawn: { x: 34, y: 11 } },
  ],

  // The rope up the cliff to the lookout: walk up into the cliff at its foot.
  rope: {
    x: 30,
    top: 1,
    bottom: 7,
    to: 'saltcombe_lookout',
    spawn: { x: 6, y: 14 },
    barks: [
      { at: 5, who: 'bramble', text: '{worried}I\'m not looking down. I\'m looking UP.\n\n{thinking}Up is fine. Up is just sky.' },
      { at: 3, who: 'vesper', text: '{bored}If anyone sees my umbrella fall, no they didn\'t.' },
    ],
  },

  // The lesson plays as you come in, once Haddock has said so at the inn.
  // (Its walks are on the plank walk and in the bathing pool, which never change.)
  cutscenes: [{ x: 1, y: 8, w: 2, h: 4, scene: 'swimming_lesson', after: 'haddock_hums' }],

  // The sluice wheel, the floating crate, the reset stump, the rope's anchor,
  // Haddock (only for the lesson), lamps, a bench, a kid, two purses.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'c5_sluice_wheel', x: 8, y: 6, tideWheel: { to: 'toggle', text: 'lagoon_wheel', busy: 'lagoon_wheel_busy' } },
    { sprite: 'c5_sluice_gate', x: 15, y: 20, text: 'lagoon_sluice_gate' },
    { sprite: 'crates', x: 19, y: 7, rock: true, float: true, step: true },
    // The way back from the lookout. The rope down lands you on the ledge, and crates go home
    // every time you come in, so without these you could never walk back into town. A second
    // wheel on the ledge turns the tide from that side, and a second crate (afloat at high just
    // off the ledge, on the bed at low) is pushed three tiles west from (26,8) into the gully at
    // (22,8). Neither can be reached from the west before crossing, so the puzzle is the same.
    { sprite: 'crates', x: 25, y: 8, rock: true, float: true, step: true },
    { sprite: 'c5_sluice_wheel', x: 31, y: 8, tideWheel: { to: 'toggle', text: 'lagoon_wheel', busy: 'lagoon_wheel_busy' } },
    { sprite: 'rock_stump', x: 2, y: 4, rockReset: true, text: 'lagoon_stump' },
    { sprite: 'sc_rope_anchor', x: 30, y: 0, text: 'lagoon_rope_anchor' },
    { sprite: 'sign', x: 3, y: 8, text: 'lagoon_sign' },
    { sprite: 'sign', x: 28, y: 8, text: 'lagoon_rope_sign' },
    { sprite: 'sc_haddock_wade', x: 5, y: 15, npc: 'haddock_lagoon', animation: 'sc_haddock_wade', speed: 0.5, after: 'haddock_hums', until: 'swimming_lesson' },
    { sprite: 'c5_lantern_post_lit', x: 6, y: 3, text: 'lagoon_lamp', animation: 'c5_lantern_post_lit', speed: 0.26 },
    { sprite: 'c5_lantern_post_lit', x: 16, y: 3, text: 'lagoon_lamp', animation: 'c5_lantern_post_lit', speed: 0.28 },
    { sprite: 'bench', x: 10, y: 3, text: 'lagoon_bench' },
    { sprite: 'c5_hanging_nets', x: 18, y: 3, text: 'lagoon_nets' },
    { sprite: 'c5_lifebuoy_post', x: 8, y: 20, text: 'lagoon_lifebuoy' },
    { sprite: 'cf_kid_pup', x: 13, y: 4, text: 'lagoon_pup', animation: 'cf_kid_pup', speed: 0.3 },
    { sprite: 'gold_pouch', x: 14, y: 16, text: 'lagoon_pouch', lowTide: true, gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 32, y: 8, text: 'lagoon_ledge_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: {
    h: 'lagoon_backs', '#': 'lagoon_cliff', K: 'lagoon_cliff', f: 'lagoon_rail',
    '~': 'lagoon_water', ';': 'lagoon_shallows', q: 'lagoon_bed',
  },

  // None: a town.
  npcs: [
  ],
};
