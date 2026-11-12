// THE SEA GATE: the old harbour of Merrow, inside the town wall, and in the wall the town's iron
// sea gate (16,4, four wide): a great fish's head with its mouth open, and the bars of the gate
// are its teeth. One tooth is missing, the socket empty. Beyond the gate a flooded tunnel runs
// north under the wall and then east under the cliff, into the Soundings (soundings_mouth).
// With the Gulper Tooth in the bag (either way the fight ended), stepping up to the gate plays
// `merrow_sea_gate` (the trigger is in front of it, x 16 to 19, rows 5-6): the tooth goes in the
// socket, and the jaws open. The shut gate (`until`) and the open gate (`after`, walkable) are
// both props on the same tiles. The key stays in the bag (like the Bathtub Bell).
// One monster, a moonjelly in the basin, kept away from the gate and the scene's walks.
// Tile key (see src/overworld/coastTiles.js, merrow):
//   #  rock top (solid)   W  dressed stone face (solid)   :  the quay's flagstones
//   ;  the tunnel's water and the old slip (walk)   ~  green floodwater (solid)

export const MERROW_SEA_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'merrow_sea_gate',
  // The room's name, for the Room Editor.
  name: 'THE SEA GATE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  // "Bells Under Water", and the storm over the water under it.
  music: 'merrow',
  ambience: 'drowned_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_drowned_town', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // No wreck masts or hulls on the skyline: the water here is the drowned town, not the open sea.
  skyline: false,

  tiles: [
    '####################################',
    '####################################',
    '#WWWWWWWWWWWWWWW;;;;;;;;;;;;;;;;;;;;',
    '#WWWWWWWWWWWWWWW;;;;;;;;;;;;;;;;;;;;',
    '#WWWWWWWWWWWWWWW;;;;WWWWWWWWWWWWWWW#',
    '#O.....:::::::::::::::::::::::::..O#',
    '#.XXX..::::::::::::::::::::XX:::..:#',
    '#.XX::::::::::::::::::::::XXX::::::#',
    '#::::::::::::::::::::::..:::::::.::#',
    '::::::::::;;:::::::::::::::;;::::::#',
    ':::::;;~~~~~~~;;:::;;~~~~~~~~~~;:::#',
    '#:::;~~~~~~~~~~~~~~~~~~~~~~~~~~~~::#',
    '#O::~~~~~~~~~~~~~~~~~~~~~~~~~~~~;;:#',
    '#::;~~~~~~~~;;;;~~~~~~~~bb~~~~~~;::#',
    '#::;~~~~~~~;;;;;~~~~~~~bbb~~~~~~:::#',
    '#:::~~~~~~~~;;~~~~~~~~~~~~~~~~~~:::#',
    '#::;;~~~bb~~~~~~~~~J~~~~~~~~~~~~;::#',
    '#:;;~~~bbb~~~~~~~~~~~~~~~~~~~~~;;:O#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'merrow_belfry', spawn: { x: 27, y: 8 } },
    // The far end of the tunnel, east under the cliff into the Soundings' mouth.
    { x: 35, y: 2, w: 1, h: 2, to: 'soundings_mouth', spawn: { x: 2, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene: in front of the gate, once you have the tooth.
  cutscenes: [
    { x: 16, y: 5, w: 4, h: 2, scene: 'merrow_sea_gate', after: 'gulper_spared' },
    { x: 16, y: 5, w: 4, h: 2, scene: 'merrow_sea_gate', after: 'gulper_beaten' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'mw_sea_gate', x: 16, y: 4, text: 'gate_shut', until: 'merrow_sea_gate' },
    { sprite: 'mw_sea_gate_open', x: 16, y: 4, text: 'gate_open', after: 'merrow_sea_gate', walkable: true },
    { sprite: 'sign', x: 14, y: 6, text: 'gate_sign' },
    { sprite: 'mw_roof_boat', x: 27, y: 6, text: 'gate_boat' },
    { sprite: 'c5_lobster_pots', x: 6, y: 6, text: 'gate_pots' },
    { sprite: 'c5_chain_bollard', x: 33, y: 9, text: 'gate_bollard' },
    { sprite: 'gold_pouch', x: 2, y: 16, text: 'gate_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'mw_bubbles', x: 14, y: 12, text: 'merrow_bubbles', flat: true, walkable: true, animation: 'mw_bubbles', speed: 0.25 },
    // The old harbour after the flood came over it: the high-water line along the quay, a boat
    // left keel-up by the wall, a net torn off its frame, sandbags that didn't help, puddles,
    // and a lamp still burning on its hook by the gate, the one warm thing here.
    { sprite: 'c5_wrack_line', x: 4, y: 9, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 24, y: 9, flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 8, y: 6 },
    { sprite: 'c5_net_torn', x: 23, y: 7, flat: true, walkable: true },
    { sprite: 'c5_sandbags', x: 31, y: 5 },
    { sprite: 'c5_puddle', x: 11, y: 8, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 29, y: 8, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 4, y: 7, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 1, y: 14, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 21, y: 5 },
    { sprite: 'c5_rubble', x: 13, y: 5, flat: true, walkable: true },
    { sprite: 'c5_oar_stuck', x: 34, y: 15 },
    { sprite: 'c5_lantern_hook', x: 2, y: 6 },
    // The basin's edges, after a hundred years of the sea working at them: a flight of steps
    // going down into the green, coping stones knocked off and lying in the shallows, the old
    // mooring posts with a rope's end still on a ring, weed hanging off the quay, and what the
    // flood took with it: a handcart, a rowing boat sunk at her painter, a quay beam, weed rafts.
    { sprite: 'wy_steps_water', x: 9, y: 10, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 12, y: 10, flat: true, walkable: true },
    { sprite: 'wy_coping_fallen', x: 23, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 28, y: 10, flat: true, walkable: true },
    { sprite: 'wy_mooring_post', x: 32, y: 11 },
    { sprite: 'wy_mooring_post', x: 6, y: 11 },
    { sprite: 'wy_coping_fallen_b', x: 5, y: 14, flat: true, walkable: true },
    { sprite: 'wy_block_sunk', x: 5, y: 16, flat: true, walkable: true },
    { sprite: 'wy_coping_fallen', x: 9, y: 12, flat: true, walkable: true },
    { sprite: 'wy_boat_swamped', x: 18, y: 12, flat: true, walkable: true },
    { sprite: 'wy_weed_mat', x: 21, y: 15, flat: true, walkable: true },
    { sprite: 'wy_cart_drowned', x: 27, y: 16, flat: true, walkable: true },
    { sprite: 'wy_timber_sunk', x: 13, y: 17, flat: true, walkable: true },
    { sprite: 'wy_weed_mat_b', x: 7, y: 18, flat: true, walkable: true },
    { sprite: 'wy_block_sunk', x: 29, y: 15, flat: true, walkable: true },
    { sprite: 'mw_slates_afloat', x: 23, y: 17, flat: true, walkable: true },
    { sprite: 'mw_barrel_bob', x: 26, y: 12, flat: true, walkable: true },
    { sprite: 'mw_crate_drift', x: 9, y: 15, flat: true, walkable: true },
    { sprite: 'mw_ripples', x: 32, y: 12, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'merrow_stone', W: 'merrow_stone', ';': 'gate_tunnel', '~': 'gate_basin' },

  // A moonjelly drifting along the basin's top (row 10, x 22 to 28: water, met from the quay),
  // four rows below the gate's trigger and the scene's walks (x 14 to 21, rows 5-6), and clear
  // of both doors.
  npcs: [
    { enemy: 'moonjelly', x: 25, y: 10, patrol: [22, 28], behaviour: 'patrol' },
  ],
};
