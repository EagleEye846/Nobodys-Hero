// THE SLIP: the far side of the yard, a cove under the cliff where the main yard of the
// mast comes to rest. An old stone boat-slip, planked over, runs down the shingle into the
// water, and Haddock is there with the Bother, as he said he'd be. A save crystal. Puzzle-
// free and no monsters (a save room). The way home: walk down to the end of the slip
// (13..16, row 13) and Haddock rows you back to Saltcombe (wreck_slip_home, any time).
// The way back into the yard is the door you came in by, along the yard to the mast.
// THE GHOST SHIP (optional, secret): at the cove's far east point stands an old fog bell (the lever `fog_bell`). Ring it, walk
// out to the point (the trigger at 29-30, rows 6-8) and the brig Fair Return slides in out of the fog and lays her plank on the
// shingle (scene ship_looms). The first time in after the mast's scorch, the wind rings it once and the camera looks at it
// (slip_bell_heard). She leaves again by her stern door, to the point (28,6). The star-shard is at the end of her.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  cliff top (solid)   W  cliff (solid)   q  shingle   ,  turf   o  the slip's planks
//   ~  green-black water (solid)   x  barnacles   O  crate   F  net heap   J  stump

export const WRECK_SLIP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_slip',
  // The room's name, for the Room Editor.
  name: 'THE SLIP',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.5, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  lastLight: { x: 24, y: 15 },
  skyline: [
    { kind: 'hull', x: 6, y: 15, lean: -1 },
    { kind: 'mast', x: 9, y: 14, lean: 1, tall: 52 },
  ],

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,xx,,,,,,,,,,,,,OO,,,,,#',
    '#q,,,,,qqqqq,,,,,,qqq,,,,,,,qqq#',
    'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqFqqqqqqqooooqqqqqqqqqqqqqq#',
    '#~~qqqqqqqqqqooooqqqqqJqqqqqq~~#',
    '#~~~qqqqqqqqqooooqqqqqqqqqq~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back along the yard to the fighting top of the mast.
    { x: 0, y: 4, w: 1, h: 1, to: 'wreck_mast', spawn: { x: 37, y: 3 } },
  ],

  // The end of the slip: home with Haddock (any time). The point: the Fair Return, once the fog bell has been rung (`when`).
  cutscenes: [
    { x: 13, y: 13, w: 4, h: 1, scene: 'wreck_slip_home' },
    { x: 29, y: 6, w: 2, h: 3, scene: 'ship_looms', when: 'fog_bell' },
    // The first time in after the mast's scorch, the wind rings the fog bell once and the camera looks across at it (a pointer, not a key).
    { x: 5, y: 2, w: 1, h: 9, scene: 'slip_bell_heard', after: 'wreck_star_shard', until: 'ship_looms' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    { sprite: 'savepoint', x: 6, y: 5, save: true },
    // Haddock on the slip (footprint 2: 15 and 16; the way past him is x 13-14), and the Bother.
    { sprite: 'cf_haddock', x: 15, y: 10, npc: 'haddock_wreck', animation: 'cf_haddock', speed: 0.5, until: 'haddock_gone' },
    { sprite: 'cf_bother', x: 17, y: 13, text: 'slip_bother', animation: 'cf_bother', speed: 0.5 },
    { sprite: 'sign', x: 11, y: 7, text: 'slip_sign' },
    { sprite: 'c5_net_frame', x: 7, y: 7, text: 'slip_nets' },
    // The fog bell (secret): the post's plate (28,4), the bell (29,4: a lever, rung once and it stays rung: the fog on the water at
    // 29,10 is the gate that holds it), and the board's brass plate. Nothing here says it is a way in. The bell's brass carries a
    // faint cold shine (the colour of the ship's own lanterns), so it can be picked out from the slip across the storm's gloom.
    { sprite: 'sign', x: 27, y: 4, text: 'slip_fog_bell_post' },
    { sprite: 'c5_harbour_bell', x: 29, y: 4, text: 'slip_fog_bell', lever: 'fog_bell', animation: 'c5_harbour_bell', speed: 0.5,
      glow: [{ dy: -12, bloom: 14, strength: 0.5, flicker: 0.25, color: '170, 226, 255' }, { dy: -2, pool: 40, strength: 0.32, flicker: 0.15, color: '120, 190, 255' }] },
    { sprite: 'gs_fog_c', x: 29, y: 10, opensWith: ['fog_bell'], openText: 'slip_fog_bell', flat: true },
    { sprite: 'c5_lobster_pots', x: 20, y: 7, text: 'hull_pots' },
    { sprite: 'c5_tattered_sail', x: 26, y: 8, text: 'gate_sail', animation: 'c5_tattered_sail', speed: 0.4 },
    { sprite: 'c5_anchor', x: 3, y: 8, text: 'gate_anchor' },
    { sprite: 'c5_snapped_mast', x: 24, y: 14, text: 'gate_mast' },
    { sprite: 'c5_chain_bollard', x: 12, y: 10, text: 'slip_bollard' },
    { sprite: 'gold_pouch', x: 28, y: 5, text: 'slip_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The cove's waterline: weed hanging off the shingle's lip, barnacles up the slip's sides, a
    // mooring post with a rope still on it beside the slip, a beam and planks and a swamped
    // boat out on the water; up the shingle, the tide's line of wrack, an old boat keel-up, and
    // what the gulls and crabs have been doing.
    { sprite: 'wy_weed_fringe', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 10, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 20, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 24, y: 11, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 12, y: 13, flat: true, walkable: true },
    { sprite: 'wy_edge_l', x: 17, y: 12, flat: true, walkable: true },
    { sprite: 'wy_mooring_post', x: 12, y: 12 },
    { sprite: 'wy_timber_sunk', x: 4, y: 14, flat: true, walkable: true },
    { sprite: 'wy_plank_slick', x: 9, y: 15, flat: true, walkable: true },
    { sprite: 'wy_boat_swamped', x: 28, y: 12, flat: true, walkable: true },
    { sprite: 'wy_weed_mat', x: 20, y: 15, flat: true, walkable: true },
    { sprite: 'wy_ribs_jag', x: 2, y: 12 },
    { sprite: 'c5_wrack_line', x: 5, y: 9, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 21, y: 9, flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 27, y: 7 },
    { sprite: 'c5_driftwood', x: 9, y: 4, flat: true, walkable: true },
    { sprite: 'c5_seaweed_heap', x: 18, y: 5, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 22, y: 6, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 14, y: 4, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 25, y: 9, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'gate_edge', W: 'slip_cliff', '~': 'gate_water', o: 'slip_planks', x: 'hull_barnacles', O: 'hull_cargo', F: 'hull_net', J: 'fog_stump' },

  // None: a save room.
  npcs: [
  ],
};
