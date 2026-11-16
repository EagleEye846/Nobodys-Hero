// The life pass's touches for chapter 3's Old Drains and Lantern Marsh (15 November 2026), by room id. The
// kinds it adds are in src/overworld/marshLife.js; the rest are in src/overworld/touches.js and lanesLife.js.
// Drawn only: nothing here has a body, so nothing can block a current, a push, a bog hop, a carry or a
// cutscene walk. The marsh stays quiet on purpose: no bird here scatters, and the herons only slip away.
export const MARSH_TOUCHES = {
  // ---- The Old Drains ----
  drains_cistern: [
    { kind: 'drainrat', x0: 1, x1: 8, y: 12, n: 1 },
    { kind: 'bats', x: 2, y: 3, w: 20, n: 2, every: 26 },
    { kind: 'drip', x: 20, y: 2.2, fall: 2.2, every: 5.1 },
    { kind: 'drainseep', x: 22, y: 1, len: 1, every: 13 },
  ],
  drains_culvert: [
    { kind: 'drainflotsam', speed: 0.12 },
    { kind: 'drainrat', x0: 1, x1: 3, y: 4, n: 1 },
    { kind: 'drip', x: 6, y: 2.2, fall: 0.9, every: 3.3 },
    { kind: 'moss', points: [[1, 11], [31, 3]], color: '200, 215, 230' },
  ],
  drains_gratings: [
    { kind: 'drainflotsam', speed: 0.1, kind0: 2 },
    { kind: 'drainrat', x0: 1, x1: 3, y: 4, n: 1 },
    { kind: 'drip', x: 7, y: 2.2, fall: 1.6, every: 3.6 },
    { kind: 'moss', points: [[3, 5], [27, 9]], color: '200, 215, 230' },
  ],
  drains_ladle: [
    { kind: 'steam', x: 10, y: 3.4, lean: 0.4 },
    { kind: 'moths', x: 11.5, y: 1.6, n: 3 },
    { kind: 'spores', x: 8, y: 3, w: 4, h: 3, color: '255, 214, 150', n: 6 },
    { kind: 'drip', x: 15, y: 1.3, fall: 1.2, every: 6 },
  ],
  drains_sumps: [
    { kind: 'drainrat', x0: 2, x1: 12, y: 12, n: 1 },
    { kind: 'moss', points: [[12, 11], [2, 12], [13, 3]], color: '170, 200, 190' },
    { kind: 'eyes', points: [[3, 12], [13, 2], [9, 10], [14, 8]], color: '255, 220, 140' },
    { kind: 'spores', x: 3, y: 4, w: 9, h: 6, color: '170, 200, 190', n: 6 },
  ],
  drains_conduit: [
    { kind: 'drainflotsam', speed: 0.14, kind0: 1 },
    { kind: 'bats', x: 2, y: 3, w: 26, n: 3, every: 30 },
    { kind: 'drainrat', x0: 2, x1: 12, y: 13, n: 1 },
    { kind: 'moss', points: [[2, 13], [29, 13]], color: '200, 215, 230' },
  ],
  drains_vault: [
    { kind: 'spores', x: 3, y: 3, w: 8, h: 5, color: '255, 224, 140', n: 9 },
    { kind: 'moss', points: [[3, 3], [10, 3]], color: '255, 224, 140' },
    { kind: 'eyes', points: [[1, 8]], color: '255, 200, 100' },
  ],
  drains_weir: [
    { kind: 'drainflotsam', speed: 0.16, kind0: 3 },
    { kind: 'drainrat', x0: 1, x1: 6, y: 8, n: 1 },
    { kind: 'drip', x: 12, y: 2.2, fall: 1.2, every: 3.5 },
    { kind: 'drainseep', x: 3, y: 1, len: 1 },
  ],
  drains_stair: [
    { kind: 'drainflotsam', speed: 0.13, kind0: 4 },
    { kind: 'drainrat', x0: 2, x1: 22, y: 12, n: 1 },
    { kind: 'bubbles', x: 12, y: 6 },
    { kind: 'drip', x: 6, y: 7.3, fall: 1.5, every: 3.4 },
  ],
  drains_outfall: [
    { kind: 'fenmist', y: 2, h: 10, w: 26, n: 4, alpha: 0.07, speed: 6 },
    { kind: 'fenstriders', x: 18, y: 2, w: 7, h: 10, n: 4 },
    { kind: 'fenrise', x: 18, y: 2, w: 7, h: 10, n: 2, every: 6 },
    { kind: 'drip', x: 4, y: 1.3, fall: 1.4, every: 5.5 },
  ],

  // ---- The Lantern Marsh ----
  marsh_falls_foot: [
    { kind: 'fenmist', y: 1, h: 12, w: 28, n: 4 },
    { kind: 'fenwisp', x: 18, y: 1, w: 9, h: 3, n: 2 },
    { kind: 'fenrise', x: 18, y: 2, w: 8, h: 3, n: 2 },
    { kind: 'fenstriders', x: 19, y: 2, w: 6, h: 3, n: 3 },
  ],
  marsh_lantern_path: [
    { kind: 'fenmist', y: 1, h: 15, w: 36, n: 6, alpha: 0.09 },
    { kind: 'fenwisp', x: 10, y: 12, w: 22, h: 5, n: 3 },
    { kind: 'fenplop', points: [[8, 2], [16, 4], [20, 6], [8, 10], [15, 10], [26, 11], [33, 8], [20, 15], [4, 13], [29, 15]] },
    { kind: 'fenreeds', points: [[1, 16], [5, 16], [10, 16], [18, 16], [24, 16], [31, 16]] },
  ],
  marsh_rushes: [
    { kind: 'fenmist', y: 1, h: 14, w: 30, n: 4 },
    { kind: 'fenrise', x: 18, y: 2, w: 1, h: 14, n: 3, every: 5 },
    { kind: 'fenstriders', x: 18, y: 3, w: 1, h: 12, n: 3 },
    { kind: 'fenwisp', x: 19, y: 1, w: 9, h: 3, n: 2 },
  ],
  marsh_sunken_road: [
    { kind: 'fenmist', y: 1, h: 13, w: 32, n: 4 },
    { kind: 'fenrise', x: 1, y: 1, w: 30, h: 3, n: 2 },
    { kind: 'fenstriders', x: 2, y: 10, w: 20, h: 3, n: 4 },
    { kind: 'fenwisp', x: 2, y: 10, w: 26, h: 4, n: 3 },
  ],
  marsh_hut_island: [
    { kind: 'smoke', x: 12, y: 1.2, stack: true },
    { kind: 'fenmist', y: 1, h: 13, w: 26, n: 3, alpha: 0.06 },
    { kind: 'fenheron', x: 5, y: 3, face: 1 },
    { kind: 'fenrise', x: 1, y: 1, w: 8, h: 3, n: 2 },
  ],
  marsh_hut: [
    { kind: 'hutglow', x: 8, y: 3, w: 4, h: 2, alpha: 0.12 },
    { kind: 'spores', x: 2, y: 3, w: 4, h: 3, color: '255, 230, 180', n: 6 },
  ],
  marsh_tollhouse: [
    { kind: 'spores', x: 5, y: 3, w: 6, h: 4, color: '220, 214, 196', n: 7 },
    { kind: 'drip', x: 4, y: 1.3, fall: 1.8, every: 4.6 },
  ],
  marsh_jetty: [
    { kind: 'fenmist', y: 1, h: 11, w: 30, n: 4 },
    { kind: 'fenrise', x: 3, y: 10, w: 3, h: 3, n: 2 },
    { kind: 'fenstriders', x: 3, y: 10, w: 3, h: 3, n: 3 },
    { kind: 'fenwisp', x: 1, y: 9, w: 28, h: 4, n: 3 },
  ],
  marsh_wisp_hollow: [
    { kind: 'fenmist', y: 1, h: 15, w: 34, n: 7, alpha: 0.1 },
    { kind: 'fenwisp', x: 1, y: 2, w: 32, h: 14, n: 4 },
    { kind: 'fenheron', x: 7, y: 14, face: -1 },
    { kind: 'fenplop', points: [[2, 11], [8, 4], [16, 5], [19, 14], [26, 9], [31, 13], [4, 14], [24, 2], [12, 10]] },
  ],
  marsh_heron_flats: [
    { kind: 'fenmist', y: 1, h: 15, w: 30, n: 4, alpha: 0.06 },
    { kind: 'fenrise', x: 1, y: 8, w: 3, h: 2, n: 1 },
    { kind: 'fenplop', points: [[13, 3], [13, 7], [13, 11], [13, 15], [12, 5], [14, 9], [12, 13]] },
    { kind: 'fenreeds', points: [[1, 16], [6, 16], [10, 16], [18, 16], [26, 16], [4, 11]] },
  ],
  marsh_watergate: [
    { kind: 'fenmist', y: 1, h: 13, w: 30, n: 3, alpha: 0.06 },
    { kind: 'fenrise', x: 1, y: 2, w: 12, h: 2, n: 2 },
    { kind: 'fenstriders', x: 16, y: 13, w: 12, h: 2, n: 4 },
    { kind: 'moths', x: 2.4, y: 10.4, n: 3 },
  ],
  marsh_far_shore: [
    { kind: 'fenmist', y: 1, h: 12, w: 28, n: 3, alpha: 0.05 },
    { kind: 'fenwisp', x: 0, y: 1, w: 4, h: 12, n: 3 },
    { kind: 'fenrise', x: 0, y: 14, w: 28, h: 1, n: 3 },
    { kind: 'fenreeds', points: [[3, 13], [8, 13], [14, 13], [21, 13], [26, 13]] },
  ],
  marsh_clerks_islet: [
    { kind: 'fenmist', y: 1, h: 9, w: 20, n: 3, alpha: 0.05 },
    { kind: 'fenstriders', x: 11, y: 1, w: 2, h: 9, n: 3 },
    { kind: 'fenrise', x: 11, y: 1, w: 2, h: 9, n: 2 },
    { kind: 'fenreeds', points: [[2, 10], [15, 10]] },
  ],
};
