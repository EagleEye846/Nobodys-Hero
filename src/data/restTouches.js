// The life pass, round 2: the living extras of Heralds' Rest, the Long Stair and the Ice Caves. Kinds are
// in src/overworld/restLife.js (and the older ones in touches.js, townLife.js, caveTouches.js). Positions in tiles.
export const R2R_ROOM_TOUCHES = {
  // ---- Round 3, the fun check (15 November 2026): rooms that scored low, and the extra life for them ----
  beyond_ruins: [
    { kind: 'grass', x: 14, y: 6, w: 5, h: 3 },
    { kind: 'restFlush', points: [[16.5, 3.3], [6.5, 11.3]], style: 'finch' },
  ],
  cave_entry: [
    { kind: 'restIcedrip', points: [[6, 3.7], [29, 4.7], [18, 9.7], [22, 15.7]], fall: 1.2 },
    { kind: 'restGlow', points: [[3, 4.3], [27, 6.3], [3, 10.3], [11, 16.3], [26, 21.3]], color: '140, 200, 255', r: 28, strength: 0.35, rate: 0.55 },
    { kind: 'sparkle', x: 23, y: 8, w: 5, h: 4, n: 10 },
    { kind: 'mist', x: 2, y: 19, w: 16, h: 2.5 },
  ],
  cave_gallery: [
    { kind: 'restIcedrip', points: [[4, 3.7], [13, 3.7], [22, 3.7], [29, 3.7], [5, 21.7]], fall: 1.2 },
    { kind: 'restGlow', points: [[6, 7.3], [18, 9.3], [32, 5.3], [29, 12.3], [4, 17.3], [29, 18.3]], color: '140, 200, 255', r: 30, strength: 0.38, rate: 0.5 },
    { kind: 'sparkle', x: 15, y: 15, w: 7, h: 4, n: 14 },
    { kind: 'mist', x: 14, y: 17, w: 9, h: 2.4 },
  ],
  vigil_lamplighters_hut: [
    { kind: 'restGlow', points: [[6.6, 5.2]], color: '255, 190, 100', r: 22, strength: 0.28, flicker: true },
    { kind: 'shaft', x: 9.6, y: 2.4, w: 1.8, h: 4.6, color: '230, 240, 255' },
    { kind: 'sparkle', x: 3, y: 3, w: 7, h: 4, n: 8, color: '255, 236, 200' },
  ],
  rest_gate: [
    { kind: 'restDrift', x: 1, y: 2, w: 26, h: 16, n: 18, dir: 1 },
    { kind: 'restSlip', points: [[3, 4.6], [26, 2.6], [2, 11]], every: 19 },
    { kind: 'restFlush', points: [[7, 9.3], [22, 11.3]], style: 'chough' },
    { kind: 'restBreath', points: [[4, 11]], dir: 1 },
  ],
  rest_square: [
    { kind: 'restDrift', x: 1, y: 2, w: 38, h: 8, n: 24, dir: 1 },
    { kind: 'restSlip', points: [[7, 5], [11, 5], [20, 6], [24, 6], [33, 6], [36, 14], [5, 23], [18, 23], [31, 23]], every: 21, drop: 1.2 },
    { kind: 'restFlush', points: [[16.5, 14.3], [18.5, 16.3]], style: 'chough' },
    { kind: 'laundry', x: 10, y: 27.5, x2: 19, y2: 27.5, items: 6, posts: true },
  ],
  rest_inn: [
    { kind: 'steam', x: 7.45, y: 4.7, lean: 0.3 },
    { kind: 'restGlow', points: [[6, 2.6]], color: '255, 150, 60', r: 46, strength: 0.35, flicker: true },
    { kind: 'shaft', x: 3.3, y: 2.6, w: 2.6, h: 5.5, color: '255, 236, 200' },
  ],
  rest_hall: [
    { kind: 'restGlow', points: [[4, 2.6], [12, 2.6]], color: '255, 150, 60', r: 46, strength: 0.32, flicker: true },
    { kind: 'shaft', x: 6.3, y: 2.6, w: 2.6, h: 6.5, color: '255, 240, 210' },
    { kind: 'sparkle', x: 4, y: 4, w: 11, h: 7, n: 14, color: '255, 236, 200' },
  ],
  rest_stores: [
    { kind: 'restGlow', points: [[4, 2.2], [8, 2.2]], color: '255, 214, 150', r: 18, strength: 0.22, rate: 0.5 },
    { kind: 'steam', x: 5.4, y: 4.4, lean: 0.3 },
    { kind: 'sparkle', x: 2, y: 4, w: 9, h: 5, n: 8, color: '255, 236, 200' },
    { kind: 'restFlush', points: [[11, 7.3]], style: 'finch' },
  ],
  rest_forge: [
    { kind: 'sparks', x: 2, y: 2.4, n: 8 },
    { kind: 'restGlow', points: [[2.4, 3.2]], color: '255, 150, 60', r: 42, strength: 0.34, flicker: true },
    { kind: 'sparkle', x: 3, y: 4, w: 8, h: 5, n: 8, color: '255, 236, 200' },
  ],
  rest_belltower: [
    { kind: 'restFlush', points: [[9, 8.3], [2, 12.3]], style: 'finch' },
    { kind: 'shaft', x: 4.5, y: 3, w: 2.5, h: 6, color: '230, 240, 255' },
    { kind: 'steam', x: 4.4, y: 9.4, lean: 0.3 },
  ],
  rest_house_marta: [
    { kind: 'restGlow', points: [[4, 2.6]], color: '255, 150, 60', r: 42, strength: 0.3, flicker: true },
    { kind: 'sparkle', x: 4, y: 3, w: 4, h: 4, n: 8, color: '255, 236, 200' },
  ],
  rest_house_pottle: [
    { kind: 'restGlow', points: [[2, 2.8]], color: '255, 150, 60', r: 34, strength: 0.28, flicker: true },
  ],
  rest_chapel: [
    { kind: 'restGlow', points: [[4, 3], [10, 3]], color: '255, 200, 110', r: 22, strength: 0.3, flicker: true },
    { kind: 'shaft', x: 1.5, y: 2.5, w: 2.2, h: 7, color: '255, 220, 190' },
    { kind: 'sparkle', x: 1.5, y: 3, w: 2.4, h: 7, n: 8, color: '255, 236, 200' },
  ],
  rest_lookout: [
    { kind: 'restDrift', x: 1, y: 2, w: 22, h: 10, n: 20, dir: -1, speed: 30 },
    { kind: 'restSlip', points: [[2, 3.7], [21, 3.7]], every: 21 },
    { kind: 'restFlush', points: [[14.5, 12.4], [2, 9.4]], style: 'chough' },
    { kind: 'restBreath', points: [[6, 9]], dir: 1 },
  ],
  goat_track: [
    { kind: 'restGoats', points: [[5, 3.4], [11, 3.6], [14.5, 5.6]] },
    { kind: 'restFlush', points: [[16, 15.4], [21, 11.4]], style: 'ptarmigan' },
    { kind: 'restDrift', x: 1, y: 2, w: 22, h: 15, n: 9, dir: -1, speed: 26, color: '#eef4c8', color2: '#cfe0a0' },
    { kind: 'restSlip', points: [[5, 2.1], [22, 2.1]], every: 23 },
  ],
  climb_start: [
    { kind: 'restGoats', points: [[3.5, 3.4], [16.5, 3.6]] },
    { kind: 'restFlush', points: [[14.5, 6.4], [2, 5.4]], style: 'chough' },
    { kind: 'restDrift', x: 1, y: 2, w: 18, h: 15, n: 8, dir: -1, speed: 28, color: '#eef4c8', color2: '#cfe0a0' },
    { kind: 'restSlip', points: [[1, 2.1], [19, 2.1]], every: 24 },
  ],
  sheer_face: [
    { kind: 'restFlush', points: [[2.5, 6.6], [16.5, 8.6], [17.5, 15.6], [2.5, 18.6]], style: 'chough' },
    { kind: 'restDrift', x: 1, y: 3, w: 18, h: 19, n: 34, dir: -1, speed: 44 },
    { kind: 'restSlip', points: [[5, 12.1], [15, 12.1], [10, 3.1], [3, 3.1]], every: 15, drop: 2.4 },
    { kind: 'restBreath', points: [[10, 23], [6, 10]], dir: 1 },
  ],
  ice_cave_throat: [
    { kind: 'restIcedrip', points: [[4, 3.7], [25, 6.7], [12, 11.7], [23, 14.7]], fall: 1.2 },
    { kind: 'restGlow', points: [[10, 3.3], [24, 4.3], [15, 8.3], [27, 12.3], [3, 12.3], [26, 17.3]], color: '140, 200, 255', r: 28, strength: 0.35, rate: 0.6 },
    { kind: 'sparkle', x: 2, y: 5, w: 7, h: 4, n: 10 },
    { kind: 'mist', x: 14, y: 15, w: 12, h: 4 },
  ],
  ice_cave_grotto: [
    { kind: 'restIcedrip', points: [[3, 8.7], [16, 3.7], [25, 8.7]], fall: 1.1 },
    { kind: 'restGlow', points: [[4, 3.3], [29, 3.3], [7, 11.3], [27, 11.3], [23, 5.3]], color: '140, 200, 255', r: 28, strength: 0.35, rate: 0.55 },
    { kind: 'sparkle', x: 9, y: 6, w: 9, h: 3, n: 14 },
    { kind: 'mist', x: 2, y: 12, w: 14, h: 3 },
  ],
  ice_cave_hall: [
    { kind: 'restIcedrip', points: [[22, 11.7], [11, 4.7], [27, 3.7]], fall: 1.2 },
    { kind: 'restGlow', points: [[3, 4.3], [10, 9.3], [21, 4.3], [18, 13.3], [32, 11.3]], color: '140, 200, 255', r: 28, strength: 0.35, rate: 0.5 },
    { kind: 'sparkle', x: 3, y: 12, w: 7, h: 3, n: 14 },
    { kind: 'mist', x: 5, y: 14, w: 20, h: 2.4 },
  ],
  ice_cave_roost: [
    { kind: 'restIcedrip', points: [[4, 5.7], [22, 5.7], [17, 3.7], [7, 3.7]], fall: 1.3 },
    { kind: 'restGlow', points: [[2, 4.3], [25, 4.3], [4, 9.3], [22, 9.3], [24, 14.3]], color: '140, 200, 255', r: 28, strength: 0.32, rate: 0.5 },
    { kind: 'sparkle', x: 10, y: 6, w: 8, h: 4, n: 12 },
    { kind: 'mist', x: 2, y: 17, w: 24, h: 2 },
  ],
};
