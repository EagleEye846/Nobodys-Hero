// The Wrack Shore's and the Wreck Yard's own living touches (kinds in src/overworld/shoreLife.js),
// by room id. touches.js adds them to the room's other touches. (Written by the life pass, 2026-11-14.)
export const SHORE_ROOM_TOUCHES = {
  wrack_bathtub: [
    { kind: 'sandpipers', x: 15, y: 7, w: 5, n: 3 },
    { kind: 'hoppers', x: 10, y: 4, w: 2, h: 1, n: 4 },
    { kind: 'foam', x: 23, y: 3, w: 7, edge: 'bottom' },
    { kind: 'blown', x: 1, y: 1, w: 38, h: 16, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
  wrack_boardwalk: [
    { kind: 'pool', x: 7, y: 6, n: 3 },
    { kind: 'sandpipers', x: 2, y: 7, w: 5, n: 3 },
    { kind: 'hoppers', x: 4, y: 10, w: 2, h: 1, n: 4 },
    { kind: 'spray', x: 21, y: 13, every: 8 },
  ],
  wrack_dunes: [
    { kind: 'hoppers', x: 35, y: 4, w: 2, h: 1, n: 4 },
  ],
  wrack_gaps: [
    { kind: 'sandpipers', x: 2, y: 15, w: 5, n: 3 },
    { kind: 'hoppers', x: 18, y: 14, w: 2, h: 1, n: 4 },
    { kind: 'spray', x: 30, y: 6, every: 6 },
    { kind: 'fronds', x: 14, y: 6, w: 6 },
  ],
  wrack_headland: [
    { kind: 'sandpipers', x: 13, y: 6, w: 5, n: 3 },
    { kind: 'hoppers', x: 37, y: 14, w: 2, h: 1, n: 4 },
    { kind: 'glint', points: [[13, 4]] },
    { kind: 'fronds', x: 32, y: 19, w: 7 },
  ],
  wrack_landing: [
    { kind: 'hoppers', x: 27, y: 9, w: 2, h: 1, n: 4 },
    { kind: 'foam', x: 1, y: 8, w: 6, edge: 'bottom' },
    { kind: 'spray', x: 10, y: 4, every: 6 },
    { kind: 'blown', x: 1, y: 1, w: 38, h: 14, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
  wrack_pools: [
    { kind: 'sandpipers', x: 28, y: 2, w: 5, n: 3 },
    { kind: 'hoppers', x: 29, y: 12, w: 2, h: 1, n: 4 },
    { kind: 'spray', x: 16, y: 13, every: 6 },
    { kind: 'blown', x: 1, y: 1, w: 42, h: 16, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
  wrack_tide_clock: [
    { kind: 'sandpipers', x: 5, y: 15, w: 5, n: 3 },
    { kind: 'hoppers', x: 3, y: 11, w: 2, h: 1, n: 4 },
    { kind: 'fronds', x: 5, y: 16, w: 6 },
    { kind: 'blown', x: 1, y: 1, w: 42, h: 16, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
  wreck_chain_cliff: [
    { kind: 'hoppers', x: 9, y: 12, w: 2, h: 1, n: 4 },
    { kind: 'foam', x: 8, y: 24, w: 8, edge: 'top' },
    { kind: 'glint', points: [[7, 22], [13, 2], [13, 13]] },
  ],
  wreck_fog: [
    { kind: 'sandpipers', x: 35, y: 12, w: 5, n: 3 },
    { kind: 'foam', x: 16, y: 9, w: 5, edge: 'bottom' },
    { kind: 'glint', points: [[3, 5], [15, 9], [22, 7], [3, 10], [4, 10], [42, 11], [1, 12], [12, 12]] },
    { kind: 'blown', x: 1, y: 1, w: 42, h: 16, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
  wreck_galley: [
    { kind: 'glint', points: [[14, 3]] },
  ],
  wreck_gate: [
    { kind: 'sandpipers', x: 33, y: 11, w: 5, n: 3 },
    { kind: 'foam', x: 34, y: 4, w: 5, edge: 'bottom' },
    { kind: 'glint', points: [[10, 7], [17, 8], [17, 11], [31, 8], [31, 11], [33, 13]] },
    { kind: 'blown', x: 1, y: 1, w: 38, h: 16, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
  wreck_hull: [
    { kind: 'glint', points: [[21, 3], [22, 4], [34, 7], [14, 18], [18, 18], [19, 2], [34, 2], [9, 18]] },
    { kind: 'fronds', x: 29, y: 19, w: 6 },
  ],
  wreck_mast: [
    { kind: 'sandpipers', x: 1, y: 19, w: 5, n: 3 },
    { kind: 'foam', x: 13, y: 5, w: 6, edge: 'top' },
    { kind: 'spray', x: 21, y: 12, every: 8 },
    { kind: 'glint', points: [[6, 14], [38, 2], [19, 17], [14, 14]] },
  ],
  wreck_pumps: [
    { kind: 'glint', points: [[23, 9], [17, 3], [1, 2], [1, 18], [11, 15], [16, 12], [32, 15], [22, 15]] },
    { kind: 'fronds', x: 5, y: 20, w: 7 },
  ],
  wreck_slip: [
    { kind: 'pool', x: 11, y: 2, n: 3 },
    { kind: 'hoppers', x: 18, y: 5, w: 2, h: 1, n: 4 },
    { kind: 'foam', x: 4, y: 11, w: 9, edge: 'top' },
    { kind: 'glint', points: [[3, 8], [12, 10], [23, 2], [2, 2], [11, 4], [22, 4], [16, 2], [23, 5]] },
  ],
  wreck_under_point: [
    { kind: 'hoppers', x: 22, y: 9, w: 2, h: 1, n: 4 },
    { kind: 'spray', x: 8, y: 9, every: 6 },
    { kind: 'blown', x: 1, y: 1, w: 24, h: 14, n: 9, wind: 75, colors: ['#d8eceb', '#a8cccc', '#e8f4f0'], when: 'storm' },
  ],
};
