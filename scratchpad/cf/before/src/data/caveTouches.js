// The life pass in Chapter 4's caves: little living things for each room of the Glimmering, the Stillwater
// and the Deep (kinds in src/overworld/caveTouches.js). Drawn only: none of it has a body, so no beam, climb,
// push route or cutscene walk can ever be in its way. Positions are in tiles; `lit: true` shows a thing only
// in your light.
export const CAVE_ROOM_TOUCHES = {
  glimmer_landing: [
    { kind: 'bugs', style: 'glow', points: [[3, 5], [26, 12], [9, 13], [24, 9], [18, 6]] },
    { kind: 'sparkle', x: 22, y: 11, w: 4, h: 3, n: 10, color: '200, 235, 255' },
    { kind: 'sparkle', x: 3, y: 5, w: 3, h: 3, n: 6, color: '255, 190, 230' },
  ],
  glimmer_chimney: [
    { kind: 'bugs', style: 'crystal', points: [[5, 18], [12, 18], [14, 17]] },
    { kind: 'sparkle', x: 3, y: 17, w: 8, h: 3, n: 8 },
  ],
  glimmer_shelf: [
    { kind: 'bugs', style: 'glow', points: [[6, 5], [19, 10], [26, 5], [8, 4]] },
    { kind: 'sparkle', x: 22, y: 8, w: 6, h: 3, n: 8, color: '190, 235, 255' },
    { kind: 'mist', x: 0, y: 11, w: 32, h: 4, n: 5, color: '190, 170, 255' },
  ],
  glimmer_prism_hall: [
    { kind: 'bugs', style: 'glow', points: [[4, 10], [19, 5], [28, 8], [12, 12]] },
    { kind: 'sparkle', x: 24, y: 8, w: 5, h: 3, n: 8 },
  ],
  glimmer_geode: [
    { kind: 'bugs', style: 'crystal', points: [[3, 12], [15, 5], [25, 9], [20, 13]] },
    { kind: 'sparkle', x: 3, y: 4, w: 6, h: 3, n: 10, color: '255, 190, 230' },
  ],
  glimmer_echo_falls: [
    { kind: 'bugs', style: 'glow', points: [[8, 5], [27, 7], [3, 8]] },
    { kind: 'sparkle', x: 10, y: 7, w: 10, h: 5, n: 14, color: '190, 235, 255' },
    { kind: 'mist', x: 9, y: 6, w: 12, h: 6, n: 4, color: '200, 225, 255' },
  ],
  glimmer_tuck: [
    { kind: 'bugs', style: 'glow', points: [[3, 6], [20, 10], [24, 4], [13, 11]] },
    { kind: 'sparkle', x: 9, y: 4, w: 5, h: 2, n: 8, color: '190, 200, 255' },
  ],
  glimmer_crystal_bridge: [
    { kind: 'bugs', style: 'crystal', points: [[3, 5], [28, 9], [7, 10]] },
    { kind: 'mist', x: 10, y: 5, w: 12, h: 7, n: 4, color: '200, 170, 255' },
  ],
  glimmer_kings_road: [
    { kind: 'bugs', style: 'glow', points: [[10, 8], [3, 8], [30, 5], [34, 9]] },
    { kind: 'mist', x: 1, y: 10, w: 38, h: 5, n: 6, color: '190, 170, 255' },
  ],
  glimmer_vug: [
    { kind: 'bugs', style: 'crystal', points: [[4, 7], [9, 5], [11, 7]] },
    { kind: 'sparkle', x: 3, y: 5, w: 8, h: 3, n: 12, color: '160, 255, 235' },
  ],
  stillwater_shore: [
    { kind: 'fish', x: 14, y: 4, w: 22, h: 8, n: 4 },
    { kind: 'ripples', points: [[20, 6], [26, 10], [32, 5], [18, 12], [30, 8]] },
    { kind: 'mist', x: 12, y: 3, w: 28, h: 10, n: 5 },
    { kind: 'bugs', style: 'pale', points: [[5, 5], [8, 12], [40, 6]] },
  ],
  stillwater_isles: [
    { kind: 'fish', x: 10, y: 10, w: 11, h: 2, n: 3 },
    { kind: 'fish', x: 24, y: 10, w: 9, h: 2, n: 2 },
    { kind: 'ripples', points: [[14, 10], [30, 11], [8, 4], [38, 15]] },
    { kind: 'mist', x: 1, y: 3, w: 40, h: 14, n: 5 },
    { kind: 'bugs', style: 'pale', points: [[6, 9], [20, 12], [40, 12]] },
  ],
  stillwater_reeds: [
    { kind: 'fish', x: 2, y: 3, w: 40, h: 12, n: 6 },
    { kind: 'ripples', points: [[10, 9], [22, 5], [35, 12], [28, 14], [40, 7]] },
    { kind: 'mist', x: 1, y: 3, w: 43, h: 12, n: 6 },
  ],
  stillwater_sunken_hall: [
    { kind: 'fish', x: 9, y: 5, w: 14, h: 3, n: 3 },
    { kind: 'fish', x: 9, y: 10, w: 14, h: 3, n: 2 },
    { kind: 'ripples', points: [[10, 6], [14, 6], [9, 11], [16, 12]] },
    { kind: 'mist', x: 1, y: 5, w: 38, h: 8, n: 5 },
    { kind: 'bugs', style: 'pale', points: [[4, 6], [34, 8], [30, 12]] },
  ],
  stillwater_stair_down: [
    { kind: 'bugs', style: 'pale', points: [[6, 5], [11, 4], [9, 3]] },
    { kind: 'mist', x: 4, y: 3, w: 10, h: 5, n: 3 },
  ],
  stillwater_far_shore: [
    { kind: 'fish', x: 1, y: 3, w: 5, h: 4, n: 2 },
    { kind: 'fish', x: 1, y: 10, w: 5, h: 3, n: 2 },
    { kind: 'fish', x: 25, y: 11, w: 3, h: 3, n: 1 },
    { kind: 'ripples', points: [[4, 5], [3, 12], [26, 12]] },
    { kind: 'mist', x: 1, y: 3, w: 34, h: 10, n: 4 },
    { kind: 'bugs', style: 'pale', points: [[12, 4], [28, 8], [33, 9]] },
  ],
  deep_first_dark: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[14, 5], [28, 3], [18, 13], [6, 9], [33, 10]] },
    { kind: 'thread', len: 22, lit: true, points: [[16, 2], [19, 2], [21, 2], [30, 2], [33, 2]] },
  ],
  deep_crawl: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[8, 4], [12, 14], [21, 8], [33, 10]] },
    { kind: 'thread', len: 18, lit: true, points: [[6, 4], [10, 4], [13, 4]] },
  ],
  deep_heros_camp: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[5, 9], [13, 6], [20, 11], [28, 8]] },
    { kind: 'thread', len: 24, lit: true, points: [[7, 5], [12, 5], [18, 5]] },
  ],
  deep_hidden_vug: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[4, 7], [8, 8]] },
    { kind: 'thread', len: 14, lit: true, points: [[4, 4], [8, 4], [9, 4]] },
  ],
  deep_keepers_fire: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[5, 7], [14, 9], [30, 6]] },
    { kind: 'thread', len: 20, lit: true, points: [[13, 5], [27, 5], [34, 6]] },
  ],
  deep_root: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[3, 21], [10, 18], [27, 23], [29, 18]] },
    { kind: 'thread', len: 22, lit: true, points: [[4, 17], [8, 17], [26, 17], [29, 17]] },
  ],
  deep_way_up: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[9, 6], [13, 12], [10, 17], [12, 21]] },
  ],
  deep_last_flight: [
    { kind: 'bugs', style: 'pale', lit: true, points: [[8, 19], [12, 33], [14, 4]] },
  ],
};
