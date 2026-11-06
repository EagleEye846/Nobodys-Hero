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
  // ---- Sunnyside ----
  sunny_lane: [
    { kind: 'pinwheel', x: 6, y: 14 },
    { kind: 'bees', x: 20, y: 14, n: 3 },
    { kind: 'grass', x: 10, y: 3, w: 9, h: 3 },
  ],
  sunny_brook: [
    { kind: 'fishjump', x: 2, y: 9, w: 29, h: 2.5, n: 2, every: 7 },
    { kind: 'dragonfly', x: 10, y: 8, w: 12, h: 3 },
    { kind: 'bees', x: 15, y: 3, n: 3 },
  ],
  sunny_gate_field: [
    { kind: 'kite', x: 3.6, y: 4.6 },
    { kind: 'bees', x: 9, y: 4, n: 3 },
  ],
  sunny_soft_field: [
    { kind: 'grass', x: 1, y: 3, w: 12, h: 4 },
    { kind: 'bees', x: 17, y: 5, n: 3 },
  ],

  // ---- The Glimmering ----
  glimmer_landing: [
    { kind: 'shaft', x: 6, y: 3, w: 4, h: 9 },
    { kind: 'caustics', x: 20, y: 8, w: 5, h: 2 },
  ],
  glimmer_kings_road: [
    { kind: 'banner', x: 17.4, y: 1.7, w: 10, h: 22, color: '#5a3f93', trim: '#c9b6ff' },
    { kind: 'banner', x: 28.4, y: 1.7, w: 10, h: 18, color: '#3f6f93', trim: '#b6e4ff', emblem: false },
  ],
  glimmer_tuck: [
    { kind: 'caustics', x: 9, y: 6, w: 5, h: 2 },
    { kind: 'glints', chime: true },
  ],
  glimmer_vug: [
    { kind: 'spores', x: 6, y: 6, w: 3, h: 2, color: '120, 255, 230', n: 6 },
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
  ],
  belowtown_market: [
    { kind: 'lanterns', x: 2.5, y: 5.1, x2: 12.5, y2: 5.1, n: 6, posts: true },
    { kind: 'lanterns', x: 17.5, y: 5.1, x2: 28.5, y2: 5.1, n: 6, posts: true, shell: '#4a7a3a', color: '170, 255, 150' },
    { kind: 'steam', x: 15, y: 6, lean: 1 },
  ],
  belowtown_square: [
    { kind: 'laundry', x: 28.4, y: 13.2, x2: 33.8, y2: 13.4, items: 4 },
    { kind: 'sleeper', x: 18.2, y: 11, color: '#d8c8a0', dark: '#a89878' },
  ],
  belowtown_inn: [
    { kind: 'steam', x: 13, y: 2, lean: -1 },
    { kind: 'sparks', x: 6, y: 2.2, n: 4 },
    { kind: 'sleeper', x: 8, y: 3.2, color: '#c0a070', dark: '#8a6a40' },
  ],
  belowtown_forge: [
    { kind: 'sparks', x: 4, y: 3.4, n: 7 },
    { kind: 'steam', x: 11, y: 3.4 },
  ],
  belowtown_hall_of_the_visit: [
    { kind: 'banner', x: 7.2, y: 1.2, w: 10, h: 24, color: '#3a5a8a', trim: '#d8e4f0' },
    { kind: 'banner', x: 16.6, y: 1.2, w: 10, h: 24, color: '#3a5a8a', trim: '#d8e4f0' },
    { kind: 'shaft', x: 9, y: 4.2, w: 6, h: 7, color: '255, 226, 160' },
  ],
  belowtown_throne: [
    { kind: 'banner', x: 2.4, y: 1.2, w: 12, h: 30, color: '#a8323a', trim: '#e8c25a' },
    { kind: 'banner', x: 21.4, y: 1.2, w: 12, h: 30, color: '#a8323a', trim: '#e8c25a' },
  ],
  // The folk's back lane: somebody's washing, strung along the wall.
  belowtown_secret_way: [
    { kind: 'laundry', x: 12.4, y: 2.3, x2: 16.6, y2: 2.4, items: 4 },
  ],
  belowtown_collapse: [
    { kind: 'drip', x: 5, y: 1.2, fall: 3, dust: true, every: 4 },
    { kind: 'drip', x: 19, y: 1.2, fall: 3, dust: true, every: 5 },
  ],
  belowtown_long_rope: [
    { kind: 'shaft', x: 6, y: 2, w: 7, h: 22, color: '255, 220, 150' },
    { kind: 'bats', x: 6.5, y: 12, w: 6, n: 2 },
    { kind: 'bats', x: 6.5, y: 34, w: 6, n: 1, every: 17 },
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
    { kind: 'bats', x: 10, y: 5, w: 20, n: 3, every: 11 },
    { kind: 'drip', x: 6, y: 1.3, fall: 2 },
  ],
  diggings_switchback: [
    { kind: 'drip', x: 11.5, y: 1.2, fall: 3, every: 3.6 },
    { kind: 'drip', x: 27, y: 1.2, fall: 3, every: 4.4 },
  ],
  diggings_old_seam: [
    { kind: 'drip', x: 9, y: 1.2, fall: 2, dust: true, every: 5.3 },
    { kind: 'seam', x: 1, y: 2.2, w: 11, h: 0.9, n: 6 },
    { kind: 'seam', x: 28, y: 3, w: 8, h: 0.9, n: 6 },
  ],
  diggings_flooded_drift: [
    { kind: 'drip', x: 14, y: 1.2, fall: 2, every: 3.4 },
    { kind: 'drip', x: 30, y: 1.2, fall: 2, every: 4.1 },
  ],
  diggings_cave_in: [
    { kind: 'drip', x: 5, y: 1.2, fall: 2.5, dust: true, every: 4.2 },
    { kind: 'drip', x: 22.5, y: 2.2, fall: 2, dust: true, every: 5.1 },
  ],
  diggings_lift: [
    { kind: 'hanglamp', x: 8, y: 2.3, len: 14 },
    { kind: 'drip', x: 20, y: 2.3, fall: 2, dust: true, every: 4.7 },
  ],
  diggings_lost_seam: [
    { kind: 'seam', x: 4, y: 3.5, w: 21, h: 9, n: 5, color: '190, 220, 255' },
    { kind: 'drip', x: 13, y: 1.5, fall: 3, every: 3.8 },
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
    { kind: 'bubbles', x: 18, y: 12 },
  ],
  stillwater_stair_down: [
    { kind: 'spores', x: 7, y: 3, w: 5, h: 2, color: '150, 255, 200', n: 7 },
    { kind: 'drip', x: 8, y: 6.3, fall: 1.5, every: 3.9 },
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
    { kind: 'spores', x: 5, y: 4, w: 4, h: 4, color: '120, 255, 230', n: 8 },
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
    { kind: 'bats', x: 3, y: 41.5, w: 14, n: 2, every: 15 },
  ],
};
