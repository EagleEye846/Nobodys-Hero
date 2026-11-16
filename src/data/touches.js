// Each room's own little touches (see src/overworld/touches.js for what every
// kind does and the fields it takes). Positions are in tiles. They're only
// drawn, so none of them blocks anything: a walk, a beam, a cart or a push
// route can't be in their way. Keep one idea per room, so no two rooms feel
// the same, and keep them off the middle of a puzzle's picture.
//
// (The crystal props and the glowcaps swell with the song by themselves: see
// `pulse` in src/overworld/prop.js and beatPulse.js.)

// What every room of a region gets.
export const AREA_TOUCHES = {
  // Crystals glint as you walk past.
  glimmer: [{ kind: 'glints' }],
  deep: [{ kind: 'glints' }],
};

export const ROOM_TOUCHES = {
  // ---- Mother Taper's house (chapter 1) ----
  // Grey daylight down through the glasshouse roof.
  your_room: [{ kind: 'shaft', x: 4, y: 0.5, w: 6, h: 8.5, color: '210,225,235' }],
  // ---- Sunnyside ----
  sunny_lane: [
    { kind: 'grass', x: 10, y: 3, w: 9, h: 3 },
  ],
  sunny_brook: [
    { kind: 'dragonfly', x: 10, y: 8, w: 12, h: 3 },
    { kind: 'bees', x: 15, y: 3, n: 3 },
  ],
  sunny_gate_field: [
    { kind: 'kite', x: 3.6, y: 4.6 },
    { kind: 'bees', x: 9, y: 4, n: 3 },
  ],
  sunny_soft_field: [
  ],

  // ---- The Glimmering ----
  glimmer_landing: [
    { kind: 'caustics', x: 20, y: 8, w: 5, h: 2 },
  ],
  glimmer_kings_road: [
    { kind: 'banner', x: 17.4, y: 1.7, w: 10, h: 22, color: '#5a3f93', trim: '#c9b6ff' },
  ],
  glimmer_tuck: [
    { kind: 'caustics', x: 9, y: 6, w: 5, h: 2 },
    { kind: 'glints', chime: true },
  ],
  glimmer_vug: [
    { kind: 'glints', chime: true },
  ],
  glimmer_crystal_bridge: [{ kind: 'spores', x: 11, y: 5, w: 10, h: 7, color: '190, 160, 255', n: 14 }],
  // Spores drifting up out of the crack (open air; nothing on the hill or its stones).
  glimmer_geode: [{ kind: 'spores', x: 18, y: 8.5, w: 2, h: 4, color: '200, 235, 255', n: 8 }],
  glimmer_echo_falls: [{ kind: 'spores', x: 11, y: 4.5, w: 3, h: 2, color: '200, 235, 255', n: 8 }],

  // ---- Belowtown ----
  belowtown_gate: [
    { kind: 'laundry', x: 1.4, y: 3, x2: 6.6, y2: 3.2 },
    { kind: 'sleeper', x: 18, y: 2 },
    // The life pass (14 Nov): lanterns between the lamp posts, a hot pot of tea, a cat on the crates, a bat or two.
    { kind: 'lanterns', x: 3.5, y: 6.1, x2: 11.5, y2: 6.1, n: 5, posts: false },
    { kind: 'cat', x: 26, y: 3.4, color: '#7a7a86', dark: '#4a4a56', light: '#d8d8de' },
  ],
  belowtown_market: [
    { kind: 'lanterns', x: 2.5, y: 5.1, x2: 12.5, y2: 5.1, n: 6, posts: true },
    { kind: 'steam', x: 15, y: 6, lean: 1 },
    // The life pass (14 Nov): the stew, a cat at its dish, spores off the tall mushroom, bats about the roof.
    { kind: 'bats', x: 8, y: 1.3, w: 16, n: 2, every: 15 },
  ],
  belowtown_square: [
    { kind: 'laundry', x: 28.4, y: 13.2, x2: 33.8, y2: 13.4, items: 4 },
    { kind: 'sleeper', x: 18.2, y: 11, color: '#d8c8a0', dark: '#a89878' },
    // The life pass (14 Nov): washing in the south, steam off the stew and the tea, a cat by the bench, bats.
    { kind: 'cat', x: 14.4, y: 15.6, color: '#8a8a96', dark: '#55555f', light: '#e0e0e4' },
    { kind: 'spores', x: 35.6, y: 5.4, w: 2, h: 2, color: '255, 170, 150', n: 6 },
  ],
  belowtown_inn: [
    { kind: 'sparks', x: 6, y: 2.2, n: 4 },
    // The life pass (14 Nov): lamps on chains, a cat on the hearth rug's edge, the teapot.
    { kind: 'steam', x: 11.3, y: 5.3, lean: 0.3 },
  ],
  belowtown_forge: [
    { kind: 'sparks', x: 4, y: 3.4, n: 7 },
    { kind: 'steam', x: 11, y: 3.4 },
    // The life pass (14 Nov): a lamp on a chain over the work.
  ],
  belowtown_hall_of_the_visit: [
    { kind: 'banner', x: 7.2, y: 1.2, w: 10, h: 24, color: '#3a5a8a', trim: '#d8e4f0' },
    { kind: 'shaft', x: 9, y: 4.2, w: 6, h: 7, color: '255, 226, 160' },
    // The life pass (14 Nov): the pinwheel in the tub that has no business turning, a lamp, dust motes round the stash.
    { kind: 'hanglamp', x: 4.5, y: 1.3, len: 18 },
  ],
  belowtown_throne: [
    { kind: 'banner', x: 2.4, y: 1.2, w: 12, h: 30, color: '#a8323a', trim: '#e8c25a' },
  ],
  // The folk's back lane: somebody's washing, strung along the wall.
  belowtown_secret_way: [
    { kind: 'laundry', x: 12.4, y: 2.3, x2: 16.6, y2: 2.4, items: 4 },
  ],
  belowtown_collapse: [
    { kind: 'drip', x: 5, y: 1.2, fall: 3, dust: true, every: 4 },
  ],
  belowtown_long_rope: [
    { kind: 'shaft', x: 6, y: 2, w: 7, h: 22, color: '255, 220, 150' },
    { kind: 'bats', x: 6.5, y: 12, w: 6, n: 2 },
  ],

  // ---- The Diggings ----
  diggings_pithead: [
    { kind: 'canary', x: 19, y: 4 },
    { kind: 'drip', x: 8, y: 1.3, fall: 2, every: 4.5 },
  ],
  diggings_cart_yard: [
    { kind: 'lunchtin', x: 11, y: 13 },
    { kind: 'drip', x: 27, y: 1.2, fall: 1, every: 3.8 },
  ],
  diggings_trestle: [
    { kind: 'drip', x: 6, y: 1.3, fall: 2 },
  ],
  diggings_switchback: [
  ],
  diggings_old_seam: [
    { kind: 'drip', x: 9, y: 1.2, fall: 2, dust: true, every: 5.3 },
    { kind: 'seam', x: 1, y: 2.2, w: 11, h: 0.9, n: 6 },
  ],
  diggings_flooded_drift: [
    { kind: 'drip', x: 14, y: 1.2, fall: 2, every: 3.4 },
  ],
  diggings_cave_in: [
  ],
  diggings_lift: [
  ],
  diggings_lost_seam: [
    { kind: 'seam', x: 4, y: 3.5, w: 21, h: 9, n: 5, color: '190, 220, 255' },
  ],

  // ---- The Stillwater ----
  stillwater_shore: [
    { kind: 'fishjump', x: 14, y: 4, w: 24, h: 8, n: 2, every: 7 },
    { kind: 'pads', points: [[11, 13.2], [14.5, 13.4], [38, 3.4]] },
  ],
  stillwater_isles: [
    { kind: 'fireflies', x: 30, y: 3, w: 10, h: 4, n: 6 },
    { kind: 'fishjump', x: 11, y: 9.5, w: 22, h: 1.5, n: 2, every: 8 },
    { kind: 'pads', points: [[2, 14.4], [6, 15.5], [37, 15.4], [40, 5.4]] },
  ],
  stillwater_reeds: [{ kind: 'fireflies', x: 3, y: 3, w: 38, h: 11, n: 12 }],
  stillwater_sunken_hall: [
    { kind: 'drip', x: 6, y: 1.2, fall: 3, every: 4.6 },
    { kind: 'bubbles', x: 14, y: 9 },
  ],
  stillwater_stair_down: [
  ],
  stillwater_far_shore: [
    { kind: 'fishjump', x: 1, y: 3, w: 6, h: 10, n: 1, every: 8 },
    { kind: 'pads', points: [[2, 4], [4, 11.4], [3, 13]] },
    { kind: 'fireflies', x: 11, y: 3, w: 10, h: 3, n: 6 },
  ],

  // ---- The Deep ----
  deep_crawl: [
    { kind: 'eyes', points: [[12, 8], [28, 13]] },
    { kind: 'moss', points: [[7, 12], [12, 14]] },
  ],
  deep_first_dark: [
    { kind: 'eyes', points: [[4, 13], [30, 4]] },
    { kind: 'moss', points: [[11, 10], [32, 9]] },
  ],
  deep_heros_camp: [
    { kind: 'moss', points: [[8, 6], [22, 11], [26, 6]] },
    { kind: 'spores', x: 15.5, y: 8, w: 1.5, h: 1.5, color: '200, 200, 215', n: 5 },
    { kind: 'eyes', points: [[3, 8]] },
  ],
  deep_hidden_vug: [
    { kind: 'moss', points: [[3, 6], [10, 7]] },
  ],
  deep_keepers_fire: [
    { kind: 'sparks', x: 22, y: 6.4, n: 7 },
  ],
  deep_root: [
    { kind: 'eyes', points: [[5, 15], [28, 14]] },
    { kind: 'moss', points: [[3, 22], [31, 19]] },
  ],
  deep_way_up: [
    { kind: 'moss', points: [[3, 16], [19, 21], [4, 32]] },
    { kind: 'eyes', points: [[2, 13], [22, 27]] },
  ],

  // ---- Chapter 5: the coast (kinds in src/overworld/coastTouches.js) ----
  // `when: 'storm'` / `when: 'calm'`: only while the green storm is on, or once it's lifted.

  // Sunnyside: the mill pond.
  sunny_mill_pond: [
  ],

  // Gullrest: gulls on mooring posts, crabs in the sand, fish and floats out in the bay.
  gullrest_beach: [
    { kind: 'gull', x: 13.5, y: 15.1, post: true, face: -1 },
    { kind: 'crab', x: 16, y: 11 },
    { kind: 'fishjump', x: 2, y: 16.5, w: 40, h: 2.5, n: 2, every: 8 },
    { kind: 'floats', points: [[5, 17.2], [7, 17.5], [9, 17.3], [11, 17.6]] },
  ],
  // (Nothing out on the water here: the tide drains the middle to walkable shingle.)
  gullrest_cove: [
    { kind: 'crab', x: 6, y: 12, r: 1.2 },
  ],
  gullrest_jetty: [
    { kind: 'gull', x: 17.5, y: 11.6, post: true, face: -1 },
    { kind: 'floats', points: [[29, 14.2], [31, 14.6], [33, 14.3], [35, 14.7]] },
    { kind: 'fishjump', x: 24, y: 15, w: 20, h: 2, n: 1, every: 8 },
  ],
  gullrest_cliff_steps: [
    { kind: 'gull', x: 5.5, y: 9.2, post: true },
  ],
  gullrest_lifeboat_house: [
    { kind: 'steam', x: 15, y: 2.6, lean: -1 },
    { kind: 'rope', x: 7.5, y: 2.7, len: 12 },
  ],
  sunny_cliff_hollow: [
    { kind: 'crab', x: 17, y: 9, r: 1.2, color: '#b8704a', dark: '#6a3a22' },
  ],

  // The Wrack Shore: wrack and sand blowing through in the storm, a gull sitting it out
  // hunched on a post, puddles on the path. Crabs come out once the storm's gone.
  // (Nothing on the tide rooms' water: wrack_pools and wrack_tide_clock drain.)
  wrack_landing: [
    { kind: 'blown', x: 1, y: 8.5, w: 38, h: 5, n: 7, wind: 95, colors: ['#4a5a2a', '#6a5a32', '#3a4a2a'], when: 'storm' },
    { kind: 'puddles', points: [[13, 12.6], [27.5, 11.5, 18]] },
  ],
  wrack_headland: [
    { kind: 'blown', x: 1, y: 2, w: 38, h: 5, n: 6, wind: 95, colors: ['#4a5a2a', '#6a5a32', '#3a4a2a'], when: 'storm' },
    { kind: 'crab', x: 33, y: 13, when: 'calm' },
  ],
  wrack_dunes: [
  ],
  wrack_bathtub: [
    { kind: 'puddles', points: [[8, 9.6, 16], [28, 8.4]] },
  ],
  wrack_boardwalk: [
    { kind: 'gull', x: 17.5, y: 20.3, post: true, face: -1 },
    { kind: 'floats', points: [[20, 22.4], [22, 22.8], [24, 22.5], [26, 22.9]] },
  ],
  wrack_pools: [
    { kind: 'crab', x: 4, y: 7, r: 1, when: 'calm' },
  ],
  wrack_tide_clock: [
  ],
  wrack_gaps: [
    { kind: 'puddles', points: [[10, 11.6], [21, 14.5, 18], [32, 11.3]] },
  ],
  // The old hulk lets the rain in through its seams.
  secret_wrack_hulk: [
    { kind: 'drip', x: 4, y: 2.6, fall: 1.6, every: 3.4, when: 'storm' },
  ],

  // Saltcombe: chimneys smoking (torn sideways in the storm), gulls on the harbour posts,
  // the inn's grey cat asleep by the fire while it rains and out on a sill once it stops,
  // washing out between the market lamps once there's something to dry it.
  saltcombe_quay: [
    { kind: 'smoke', x: 6.5, y: 1.6, stack: true },
    { kind: 'gull', x: 14.5, y: 15.2, post: true },
    { kind: 'puddles', points: [[13, 10.6], [27, 8.5]] },
    { kind: 'cat', x: 3.15, y: 4.25, color: '#8a8a96', dark: '#55555f', light: '#e0e0e4', eye: '#e8d050', when: 'calm' },
  ],
  saltcombe_market: [
    { kind: 'smoke', x: 5.5, y: 1.6, stack: true },
    { kind: 'puddles', points: [[11, 10.5, 18], [24, 13.6], [20, 18.4]] },
    { kind: 'laundry', x: 28.6, y: 2.5, x2: 33.4, y2: 2.5, items: 4, posts: false, when: 'calm' },
  ],
  saltcombe_inn: [
    { kind: 'sleeper', x: 3, y: 3.9, color: '#b4b4c0', dark: '#62626e', when: 'storm' },
    // The oilskin by the fire dripping while it rains (indoor details, 2026-11-08).
    { kind: 'drip', x: 1, y: 2.8, fall: 0.9, every: 2.6, when: 'storm' },
    // The leak over the bucket by the east wall (2026-11-09).
  ],
  // The town hall's oilskin dripping in the rain, the badger's tea steaming on its stool.
  saltcombe_town_hall: [
    { kind: 'drip', x: 3, y: 2.8, fall: 0.9, every: 2.9, when: 'storm' },
    { kind: 'steam', x: 19, y: 4.9, lean: -0.3 },
    // The leak over the bucket (2026-11-09).
  ],
  saltcombe_chandlery: [
    { kind: 'rope', x: 10.6, y: 2.6, len: 12 },
  ],
  saltcombe_lookout: [
    { kind: 'gull', x: 20.5, y: 5.4, face: -1 },
    { kind: 'blown', x: 1, y: 6, w: 34, h: 9, n: 7, wind: 85, colors: ['#5a7a3a', '#7a8a4a', '#4a6a2a'], when: 'storm' },
  ],
  saltcombe_lagoon: [
  ],

  // The Sunken Lanes: left behind. Someone's washing still out in the storm, puddles in
  // the lanes, a gull on a post in the flood, the attic's leak.
  // (Nothing on the causeway's or the sluices' water: both rise and fall.)
  lanes_down: [
    { kind: 'gull', x: 8.5, y: 14.2, post: true },
    { kind: 'puddles', points: [[9, 6.6, 18], [21, 9.6], [16, 3.6]] },
  ],
  lanes_fork: [
    { kind: 'floats', points: [[25, 14.3], [27, 14.7], [29, 14.4], [31, 14.8]] },
    { kind: 'blown', x: 1, y: 2, w: 38, h: 13, n: 7, wind: 85, colors: ['#5a6a3a', '#7a6a42', '#4a5a2a'], when: 'storm' },
  ],
  lanes_mill: [
    { kind: 'laundry', x: 2.4, y: 11.6, x2: 7.6, y2: 11.8, items: 4 },
    { kind: 'puddles', points: [[25, 9.6, 18], [29, 14.5]] },
  ],
  // The attic's leak, into its pail (2026-11-09).
  secret_lanes_attic: [
    { kind: 'drip', x: 8, y: 2.6, fall: 1.6, every: 3.1, when: 'storm' },
  ],
  // The parlour behind the doorway in the Sluices (2026-11-14): the teapot on the table, still hot.
  secret_lanes_door: [
    { kind: 'steam', x: 9.05, y: 5, lean: 0.3 },
  ],
  lanes_hamlet: [
    { kind: 'puddles', points: [[6, 14.6, 18], [24, 14.4], [36, 14.6]] },
    { kind: 'crab', x: 11, y: 15, when: 'calm' },
  ],
  lanes_causeway: [
    { kind: 'crab', x: 37, y: 13, r: 1, when: 'calm' },
  ],
  secret_lanes_attic: [
  ],

  // Merrow: nobody left but the crabs, which have the run of the square; a gull on a post
  // in the flood; drips in the cold house and the bell tower.
  merrow_square: [
    { kind: 'crab', x: 7, y: 7 },
    { kind: 'gull', x: 22.5, y: 17.3, post: true, face: -1 },
  ],
  merrow_tower_lane: [
    { kind: 'crab', x: 10, y: 11 },
  ],
  merrow_high_street: [
    { kind: 'crab', x: 37, y: 6, r: 1 },
  ],
  merrow_house: [
    { kind: 'drip', x: 11, y: 1.6, fall: 2.2, every: 4.2 },
  ],
  merrow_belfry: [
    { kind: 'drip', x: 9, y: 2.2, fall: 2.4, every: 3.8 },
  ],
  merrow_sea_gate: [
    { kind: 'gull', x: 33.5, y: 9, sort: 17 },
  ],

  // The Wreck Yard: gulls riding out the storm on the bollards, ropes hanging off the
  // wrecks, the old hulks dripping inside, the ghost cook's pot steaming.
  wreck_gate: [
    { kind: 'gull', x: 17.5, y: 8, sort: 17, face: -1 },
  ],
  wreck_fog: [
    { kind: 'blown', x: 1, y: 3, w: 42, h: 12, n: 6, wind: 80, colors: ['#4a5a2a', '#6a5a32'], when: 'storm' },
  ],
  wreck_slip: [
    { kind: 'floats', points: [[21, 15.3], [23, 15.7], [25, 15.4], [27, 15.8]] },
    { kind: 'crab', x: 26, y: 6, when: 'calm' },
  ],
  wreck_hull: [
    { kind: 'drip', x: 8, y: 1.4, fall: 2.2, every: 4.4 },
  ],
  wreck_galley: [
    { kind: 'steam', x: 13, y: 3.6, lean: 0.5 },
    { kind: 'drip', x: 20, y: 1.4, fall: 2, every: 4.9 },
  ],
  wreck_pumps: [
    { kind: 'drip', x: 7, y: 1.4, fall: 1.4, every: 3.9 },
  ],
  secret_wreck_pocket: [
    { kind: 'drip', x: 4, y: 1.4, fall: 2.2, every: 5 },
  ],

  // The Soundings: pale cave crabs on the shingle, fish in the cave mouth's still water.
  // (The tide rooms' water is left alone.)
  soundings_mouth: [
    { kind: 'crab', x: 27, y: 13, color: '#c8a088', dark: '#7a5a48' },
    { kind: 'fishjump', x: 2, y: 14.6, w: 32, h: 1.4, n: 1, every: 11 },
  ],
  soundings_echo_hall: [
    { kind: 'crab', x: 40, y: 18, r: 1.2, color: '#c8a088', dark: '#7a5a48' },
  ],
  soundings_up: [
    { kind: 'drip', x: 15, y: 2.4, fall: 2.4, every: 4.7 },
  ],

  // The Beacon Isles and the Reach: spray and wrack flying in the storm, gulls on the
  // bollards, crabs once it's over. Orla's forge spits sparks and the quench tub steams.
  isles_landing: [
    { kind: 'blown', x: 1, y: 3, w: 34, h: 12, n: 8, wind: 110, colors: ['#e0eef0', '#4a5a2a', '#c8dce0'], when: 'storm' },
  ],
  isles_causeway: [
    { kind: 'blown', x: 1, y: 2, w: 46, h: 13, n: 9, wind: 120, colors: ['#e0eef0', '#c8dce0', '#4a5a2a'], when: 'storm' },
  ],
  // The ring climbs (2026-11-14): spray and weed torn off the tops, a gull on the stack.
  isles_gannet_stack: [
    { kind: 'blown', x: 1, y: 2, w: 38, h: 6, n: 7, wind: 120, colors: ['#e0eef0', '#c8dce0', '#4a5a2a'], when: 'storm' },
    { kind: 'gull', x: 30.5, y: 12.2, face: -1 },
  ],
  reach_needle: [
    { kind: 'blown', x: 1, y: 1, w: 28, h: 36, n: 10, wind: 140, colors: ['#e0eef0', '#c8dce0', '#4a5a2a'], when: 'storm' },
  ],
  isles_west_light: [
    { kind: 'gull', x: 25.5, y: 10, sort: 17, face: -1 },
  ],
  isles_east_light: [
    { kind: 'blown', x: 1, y: 2, w: 42, h: 17, n: 7, wind: 110, colors: ['#e0eef0', '#4a5a2a'], when: 'storm' },
  ],
  isles_forge: [
    { kind: 'sparks', x: 3, y: 3.2, n: 6 },
    { kind: 'steam', x: 12, y: 2.8, lean: 1 },
    // Orla's oilskin, near enough to the forge to steam.
  ],
  isles_old_lightroom: [
    { kind: 'spores', x: 6, y: 3, w: 6, h: 4, color: '220, 214, 196', n: 7 },
  ],
  reach_eye: [
  ],
  reach_reef: [
    { kind: 'blown', x: 9, y: 3, w: 25, h: 13, n: 7, wind: 120, colors: ['#e0eef0', '#c8dce0', '#4a5a2a'], when: 'storm' },
  ],
  reach_first_rock: [
    { kind: 'blown', x: 9, y: 2, w: 22, h: 12, n: 6, wind: 120, colors: ['#e0eef0', '#c8dce0'], when: 'storm' },
  ],
  reach_wreck: [
    { kind: 'rope', x: 25.5, y: 3.6, len: 16 },
  ],

  // Haddock's Light: his stovepipe smoking while he's there, cold after; floats by the Bother.
  haddock_light_door: [
    { kind: 'smoke', x: 17.6, y: 1.4, stack: true, when: 'storm' },
    { kind: 'floats', points: [[24, 13.3], [26, 13.7], [28, 13.4]] },
  ],
  haddock_light_parlour: [
    { kind: 'steam', x: 5, y: 2.6, lean: 1, when: 'storm' },
  ],

  // The Last Light: the sea getting in, and dust in the dead lamp's room.
  lastlight_foot: [
    { kind: 'drip', x: 6, y: 2.4, fall: 2.4, every: 4.3 },
  ],
  lastlight_sluice: [
    { kind: 'drip', x: 9, y: 1.6, fall: 2, every: 3.7 },
  ],
  lastlight_lamp: [
    { kind: 'spores', x: 6, y: 5, w: 9, h: 5, color: '210, 210, 200', n: 8 },
  ],
};
