// THE MAST: the heart of the yard. A big old hulk sits in a tidal basin, and out of her
// stands the stump of a mainmast, snapped off high up, with the star caught in the split
// at the top: you can see it glinting from the bank. Her rigging still hangs down the
// mast from the fighting top (the old lookout platform near the top), and from the
// fighting top the main yard (the long spar) runs east over the water to the cliff, where
// the slip is. So the way on is up.
//
// THE PUZZLE (the tide and the rope):
//   - The basin has three parts between the west bank and the hulk: a deep moat (x 7-8),
//     a sandbar (x 9-11, dry at both tides) and the flats (x 12-13).
//   - At HIGH tide an old raft tied in the moat floats up level with the bank (7..8,
//     rows 15-16) and you can walk across it to the sandbar. At LOW it sinks into the moat.
//   - At LOW tide the flats are mud you can walk; at HIGH they are deep water.
//   - So: the wheel on the west bank (4,12) sends the tide up; cross the raft; the wheel on
//     the sandbar (10,13) sends it down; walk the mud to the hulk. A third wheel on the hulk
//     (20,14) means nobody is ever stuck there. Start LOW. No crates, so no stump needed.
//   - On the hulk, walk up into the mast at the rope's foot (17,12) and climb (the long
//     rope engine, ropeClimb.js, all three of you together). At the top you come out on the
//     fighting top (17,4), and the scene wreck_star_shard plays (the id is kept for the goals and
//     Haddock's lines): the mast's split top has a scorch on it and a line of burnt grain running out
//     to sea. The star shard is NOT here any more: it is at the end of the optional ghost ship.
//   - From the fighting top, walk the yard east to the slip (door 39,3). Or go back down:
//     walk down off the top where the rigging comes up (17,4, facing down) and climb down it,
//     or slide down the halyard (the coil at 13,3 is a door back to the rope's foot).
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  edge (solid)   ~  green-black water (solid)   q  shingle / mud   .  iron deck
//   W  the hulk's side (solid)   o  fighting-top planks   g  the yard (and the raft at high)
//   f  rail (solid)   O  crate (solid)   F  net heap (solid)   x  barnacles (solid)

export const WRECK_MAST = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_mast',
  // The room's name, for the Room Editor.
  name: 'THE MAST',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.5, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  // Once the Fair Return has sailed (crew_go_free, 2026-11-14), her fog has gone with her: the yard's fog thins to this.
  fogLiftAfter: { scene: 'crew_go_free', fog: 0.25 },
  vesWell: true,
  lastLight: { x: 33, y: 7, scale: 0.95 },
  skyline: [
    { kind: 'hull', x: 27, y: 14, lean: 1 },
    { kind: 'mast', x: 31, y: 18, lean: -1, tall: 56 },
    { kind: 'mast', x: 5, y: 6, lean: 1, tall: 48 },
  ],

  tiles: [
    '########################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~ooooooffffffffffffffffffff#',
    '#~~~~~~~~~~~~oooooogggggggggggggggggggg.',
    '#~~~~~~~~~~~~ooooooffffffffffffffffffff#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~qqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#qqOqqq~~~~~~~WWWWWWWW~~~~~~~~~~~~~~~~~#',
    '#qqqqqq~~qqx~~.......O~~~~~~~~~~~~~~~~~#',
    '#qqqqqq~~qqq~~........~~~~~~~~~~~~~~~~~#',
    '#qqqqqq~~qqq~~........~~~~~~~~~~~~~~~~~#',
    '#qqqqqqggqqq~~........~~~~~~~~~~~~~~~~~#',
    'qqqqqqqggqqq~~........~~~~~~~~~~~~~~~~~#',
    'qqqqqqq~~qqq~~........~~~~~~~~~~~~~~~~~#',
    '#qqqqqq~~qqq~~........~~~~~~~~~~~~~~~~~#',
    '#qqqqqq~~qqq~~F......x~~~~~~~~~~~~~~~~~#',
    '#Fqqqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '########################################',
  ],

  // The tide: see the header. `tiles` is HIGH (the raft floats); LOW sinks the raft and
  // bares the flats. Spaces mean "the same as high".
  tide: {
    start: 'low',
    low: [
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '                                        ',
    '            qq                          ',
    '            qq                          ',
    '            qq                          ',
    '       ~~   qq                          ',
    '       ~~   qq                          ',
    '            qq                          ',
    '            qq                          ',
    '            qq                          ',
    '                                        ',
    '                                        ',
    '                                        ',
    ],
  },

  // The rigging down the mast: from the hulk's deck at its foot (17,12) up to the fighting
  // top. Climbing out at the top brings you back into this room up there (17,4).
  rope: {
    x: 17, top: 5, bottom: 12, to: 'wreck_mast', spawn: { x: 17, y: 4 },
    barks: [
      { at: 10, who: 'bramble', text: '{scared}Don\'t look down. Don\'t look down.\n\n...I looked down.' },
      { at: 7, who: 'vesper', text: '{bored}If anyone falls, fall quietly. I\'m concentrating.' },
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 16, w: 1, h: 2, to: 'wreck_galley', spawn: { x: 21, y: 8 } },
    // Along the yard to the slip.
    { x: 39, y: 3, w: 1, h: 1, to: 'wreck_slip', spawn: { x: 2, y: 4 } },
    // Back down the halyard to the hulk's deck (the coil at the fighting top's west end).
    { x: 13, y: 3, w: 1, h: 1, to: 'wreck_mast', spawn: { x: 17, y: 13 } },
  ],

  // The fighting top: the scorch and the line of light (wreck_star_shard, once) as you come off the rope.
  cutscenes: [
    { x: 16, y: 2, w: 3, h: 3, scene: 'wreck_star_shard' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The three tide wheels: the west bank, the sandbar, the hulk.
    { sprite: 'valve_wheel', x: 4, y: 12, text: 'mast_wheel', tideWheel: { to: 'toggle', text: 'mast_wheel_turn', busy: 'mast_wheel_busy' } },
    { sprite: 'valve_wheel', x: 10, y: 13, text: 'mast_wheel', tideWheel: { to: 'toggle', text: 'mast_wheel_turn', busy: 'mast_wheel_busy' } },
    { sprite: 'valve_wheel', x: 20, y: 14, text: 'mast_wheel', tideWheel: { to: 'toggle', text: 'mast_wheel_turn', busy: 'mast_wheel_busy' } },
    { sprite: 'tide_dial', x: 2, y: 12, text: 'mast_dial', tideDial: true },
    { sprite: 'sign', x: 5, y: 14, text: 'mast_sign' },
    // The raft's mooring post on the bank (its chain runs out to the raft).
    { sprite: 'c5_chain_bollard', x: 6, y: 14, text: 'mast_raft_post' },
    // The mast, standing out of the hulk, and its split top. (The great mast is one tall prop standing on
    // the hulk's north side; its cross-trees carry the fighting top. Its split top comes up through the
    // planks at 15,4. The scorch beside it (16,3) is the hint to the ghost ship.)
    { sprite: 'wy_mainmast', x: 15, y: 11, text: 'mast_mast' },
    { sprite: 'wy_mast_tip', x: 15, y: 4, text: 'mast_mast' },
    { sprite: 'wy_scorch_line', x: 16, y: 3, text: 'mast_scorch', flat: true, walkable: true },
    { sprite: 'wy_scorch_line_b', x: 21, y: 3, text: 'mast_scorch', flat: true, walkable: true },
    // The fighting top: the halyard coil (the way back down), a flag on its staff.
    { sprite: 'c5_rope_coil', x: 13, y: 3, text: 'mast_halyard', walkable: true },
    { sprite: 'c5_tattered_flag', x: 18, y: 2, text: 'mast_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_chain_bollard', x: 38, y: 2, text: 'mast_yard_end' },
    // The hulk's deck.
    { sprite: 'c5_ships_wheel', x: 19, y: 17, text: 'fog_wheel' },
    { sprite: 'c5_barrels', x: 15, y: 17, text: 'hull_barrels' },
    { sprite: 'c5_hull_lean_b', x: 26, y: 13, text: 'gate_hulk' },
    { sprite: 'gold_pouch', x: 10, y: 18, text: 'mast_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The basin's edges (all on water that stays water at both tides): barnacles and weed up the
    // bank's side, the sandbar's and the hulk's, a mooring post off the bank's corner, an old quay
    // beam fallen across the top of the bar, and the yard's leavings out on the open water.
    { sprite: 'wy_edge_l', x: 7, y: 13, flat: true, walkable: true },
    { sprite: 'wy_edge_l', x: 7, y: 19, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 8, y: 13, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 8, y: 19, flat: true, walkable: true },
    { sprite: 'wy_edge_l', x: 22, y: 14, flat: true, walkable: true },
    { sprite: 'wy_edge_l', x: 22, y: 18, flat: true, walkable: true },
    { sprite: 'wy_barnacle_band', x: 16, y: 20, flat: true, walkable: true },
    { sprite: 'wy_barnacle_band_b', x: 19, y: 20, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 10, y: 20, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 3, y: 22, flat: true, walkable: true },
    { sprite: 'wy_timber_sunk', x: 10, y: 11, flat: true, walkable: true },
    { sprite: 'wy_mooring_post', x: 6, y: 10 },
    { sprite: 'wy_ribs_jag', x: 30, y: 9 },
    { sprite: 'wy_ribs_jag_b', x: 36, y: 14 },
    { sprite: 'wy_plank_slick', x: 25, y: 8, flat: true, walkable: true },
    { sprite: 'wy_weed_mat', x: 33, y: 17, flat: true, walkable: true },
    { sprite: 'wy_weed_mat_b', x: 23, y: 6, flat: true, walkable: true },
    { sprite: 'wy_timber_sunk', x: 29, y: 20, flat: true, walkable: true },
    { sprite: 'wy_plank_slick_b', x: 9, y: 7, flat: true, walkable: true },
    // The hulk's deck: her rail's shadow, a scupper's rust, a grating, her chain.
    { sprite: 'wy_rail_shadow', x: 18, y: 12, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 20, y: 12, flat: true, walkable: true },
    { sprite: 'wy_grating', x: 16, y: 15, flat: true, walkable: true },
    { sprite: 'wy_chain_pile', x: 14, y: 14, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_crab_shell', x: 15, y: 14, text: 'sl_crabshell', flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 1, y: 14, text: 'sl_dinghy' },
    { sprite: 'c5_rope_coil', x: 15, y: 19, text: 'sl_rope', walkable: true },
    { sprite: 'shore_bottle', x: 3, y: 9, text: 'sl_bottle', walkable: true },
    { sprite: 'shore_tally_post', x: 3, y: 18, text: 'sl_tally' },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'gate_edge', '~': 'mast_water', W: 'mast_hulk', f: 'gate_rail', g: 'mast_yard', O: 'hull_cargo', F: 'hull_net', x: 'hull_barnacles' },

  // A PAIR on the hulk's deck: an old diver (row 18, x 18 to 20) and a limpet knight beside it (row
  // 17, x 17 to 20), so they fight together. Clear of the rope's foot (17,12) and the halyard's
  // spawn (17,13), the wheel (20,14) and every tile the tide changes (the flats, x 12 and 13). The
  // west bank (the door, the wheel, the dial and the raft) is left empty. The only scene here,
  // wreck_star_shard, is up on the fighting top, far from both.
  npcs: [
    { enemy: 'old_diver', x: 19, y: 18, patrol: [18, 20], behaviour: 'patrol' },
    { enemy: 'limpet_knight', x: 18, y: 17, patrol: [17, 20], behaviour: 'patrol' },
  ],
};
