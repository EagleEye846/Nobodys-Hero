// THE PLANK: the end of the Wreck Yard's quay, in the fog, and the brig FAIR RETURN lying against it,
// her side a long dark wall, a gangway plank run up to a gap in her rail. Nobody on the plank. The
// shipowner's board still stands on the quay saying when she was due. No puzzle, no monsters: a save
// crystal, the quay (rope, bollards, crates tied up and left) and the walk up the gangway.
// Scene ship_boarding (the plank's foot, once): the first sight of her, and a bell that rings four
// times aboard with nobody there to ring it. Everything said is a DRAFT for the designer.
// Tile key (src/overworld/coastTiles.js, ghostship):
//   #  hull / dark (solid)   W  hull face (solid)   w  gunport (solid)   .  quay planks   o  gangway and spur planks
//   ~  black water (solid)

export const SHIP_PLANK = {
  id: 'ship_plank',
  name: 'THE PLANK',
  area: 'ghostship',
  // "Port Tomorrow" (src/data/music/ghostShipTheme.js), the ghost ship's song, from here on.
  music: 'ghostShip',
  // Outdoors, on the quay at the end of the yard: the yard's fog and a far bell, the hull groaning on its piles.
  ambience: 'wreck_yard',
  vesWell: true,
  lastLight: { x: 20, y: 12 },
  skyline: [{ kind: 'hull', x: 26, y: 8, lean: 0 }],

  tiles: [
      '################################',
      '#~~~~~~~~~~~~~~~~~~~~~~~########',
      '#~~~~~~~~~~~~~~~~~o~~~~~########',
      '#~~~~~~~~~~~~~~~~ooo~~~~########',
      '#~~~.....~~~~~~~~~~~~...########',
      '.........~~~~~~.........########',
      '........................########',
      '........................oooooooo',
      '........................oooooooo',
      '........................########',
      '........................########',
      '..........~~~~~.........########',
      '#~~~~.oo..~~~~~~~~~.....########',
      '#~~~~~oo~~~~~~~~~~~~~~~~########',
      '#~~~~~~~~~~~~~~~~~~~~~~~WWWWWWWW',
      '################################',
    ],

  // No tiles change here, but she leans, and the whole room with her (src/overworld/shipList.js).
  list: {},

  playerStart: { x: 2, y: 8 },

  doors: [
    // Back down the plank to the point of the slip's cove, where the fog bell stands (wreck_slip).
    { x: 0, y: 7, w: 1, h: 2, to: 'wreck_slip', spawn: { x: 28, y: 6 } },
    // Up the gangway, onto the Fair Return's deck.
    { x: 31, y: 7, w: 1, h: 2, to: 'ship_deck', spawn: { x: 20, y: 16 } },
  ],

  cutscenes: [
    { x: 22, y: 7, w: 1, h: 2, scene: 'ship_boarding' },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'savepoint', x: 4, y: 7, save: true },
    { sprite: 'gs_owners_board', x: 10, y: 7, text: 'plank_board' },
    { sprite: 'gs_quay_lamp', x: 7, y: 5, text: 'plank_lamp' },
    { sprite: 'gs_quay_lamp', x: 19, y: 6, text: 'plank_lamp' },
    { sprite: 'wy_mooring_post', x: 12, y: 10, text: 'plank_post' },
    { sprite: 'wy_mooring_post', x: 21, y: 11, text: 'plank_post' },
    { sprite: 'c5_chain_bollard', x: 22, y: 9, text: 'plank_bollard' },
    { sprite: 'gs_nameboard', x: 25, y: 14, text: 'plank_name' },
    { sprite: 'gs_coil', x: 14, y: 8, text: 'plank_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 8, y: 10, text: 'plank_coil', flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 16, y: 9, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 5, y: 9, flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 20, y: 8, flat: true, walkable: true },
    { sprite: 'c5_crates_stack', x: 9, y: 5, text: 'plank_crates' },
    { sprite: 'c5_barrels', x: 15, y: 7, text: 'plank_crates' },
    { sprite: 'c5_net_frame', x: 2, y: 4, text: 'plank_nets' },
    { sprite: 'c5_driftwood', x: 13, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 16, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 12, y: 5, flat: true, walkable: true },
    { sprite: 'wy_ribs_jag', x: 3, y: 14 },
    { sprite: 'wy_boat_swamped', x: 10, y: 13, flat: true, walkable: true },
    { sprite: 'c5_rowboat', x: 21, y: 3, text: 'plank_rowboat' },
    { sprite: 'gs_shadow_b', x: 19, y: 3, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 2, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 22, y: 5, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 6, y: 13, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 14, y: 8, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 6, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 12, y: 1, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 13, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 6, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 13, y: 14, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 15, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 13, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 15, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 9, y: 1, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 16, y: 1, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 12, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 15, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 13, y: 14, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 13, y: 13, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 10, y: 14, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 2, y: 13, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 8, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 1, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 8, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 6, y: 1, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 18, y: 12, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 11, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 6, y: 3, flat: true, walkable: true },
    { sprite: 'gs_sail_heap', x: 6, y: 8, flat: true, walkable: true, text: 'dress_sail' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_net_heap', x: 4, y: 6, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 11, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 14, y: 9, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 11, y: 8, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 9, y: 8, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 13, y: 6, flat: true, walkable: true },
    { sprite: 'gs_crate_smashed', x: 18, y: 9, flat: true, walkable: true },
    { sprite: 'gs_bucket', x: 19, y: 10, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 8, y: 6, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 16, y: 6, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 21, y: 8, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 7, y: 9, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 20, y: 6, flat: true, walkable: true },
    { sprite: 'gs_deadeyes', x: 26, y: 10 },
    { sprite: 'gs_deadeyes', x: 29, y: 10 },
    { sprite: 'gs_wall_lantern', x: 24, y: 11 },
    { sprite: 'gs_deadeyes', x: 27, y: 12 },
    { sprite: 'gs_stay_mast', x: 30, y: 12 },
  ],
  tileTexts: { '#': 'plank_edge', W: 'plank_hull', '~': 'plank_water', o: 'plank_planks', '.': 'plank_quay' },

  // None: the first room of the ship, and a save point.
  npcs: [
  ],
};
