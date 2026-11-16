// The life pass, round 2 (15 November 2026): the living touches of the Hushwood, by room id (see
// src/overworld/hushLife.js for what each kind does). Drawn only: nothing here has a body, and nothing
// makes a sound. The glowing fungus and the sleeping toadstools follow the props (src/data/hushLife.js).
export const HUSH_LIFE_TOUCHES = {
  hush_mist_edge: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 26, h: 15, n: 3 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 28, speed: 4, alpha: 0.1, band: 1, bandh: 14 },
    { kind: 'mouse', x: 16, y: 12, w: 3 },
  ],
  hush_felled_run: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 28, h: 15, n: 3 },
    { kind: 'mouse', x: 2, y: 1, w: 3 },
    { kind: 'mothcloud', x: 13, y: 11, w: 3, h: 3, n: 4 },
  ],
  hush_hollow_oak: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 28, h: 17, n: 3 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 30, speed: 4, alpha: 0.1, band: 1, bandh: 16 },
    { kind: 'mouse', x: 1, y: 15, w: 3 },
  ],
  hush_kid_gap: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 26, h: 15, n: 3 },
    { kind: 'mouse', x: 21, y: 6, w: 3 },
    { kind: 'mothcloud', x: 22, y: 12, w: 3, h: 3, n: 4 },
  ],
  hush_leaning_pines: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 28, h: 15, n: 3 },
    { kind: 'hare', x: 15, y: 8, face: 1 },
    { kind: 'mouse', x: 26, y: 9, w: 3 },
  ],
  hush_treadles: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 28, h: 17, n: 3 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 30, speed: 4, alpha: 0.1, band: 1, bandh: 16 },
    { kind: 'mouse', x: 12, y: 9, w: 3 },
  ],
  hush_kiln: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 28, h: 17, n: 3 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 30, speed: 4, alpha: 0.1, band: 1, bandh: 16 },
    { kind: 'mouse', x: 7, y: 18, w: 3 },
  ],
  hush_underroot: [
    { kind: 'mouse', x: 25, y: 11, w: 3 },
    { kind: 'mothcloud', x: 1, y: 17, w: 3, h: 3, n: 4 },
    { kind: 'eyes', points: [[10,17],[19,15],[12,13],[21,8],[3,6],[3,17],[12,5],[24,21],[27,3]], color: '170, 255, 190' },
    { kind: 'drip', x: 5, y: 3, fall: 1.6, every: 4.1 },
  ],
  hush_gorge: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 34, h: 21, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 36, speed: 4, alpha: 0.1, band: 1, bandh: 20 },
    { kind: 'hare', x: 18, y: 11, face: -1 },
  ],
  hush_rummage: [
    { kind: 'mouse', x: 1, y: 2, w: 3 },
    { kind: 'mothcloud', x: 7, y: 0, w: 3, h: 3, n: 4 },
  ],
  hush_sawpit: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 30, h: 17, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 32, speed: 4, alpha: 0.1, band: 1, bandh: 16 },
    { kind: 'mouse', x: 26, y: 1, w: 3 },
  ],
  hush_notched: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 30, h: 19, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 32, speed: 4, alpha: 0.1, band: 1, bandh: 18 },
    { kind: 'mouse', x: 12, y: 9, w: 3 },
  ],
  hush_sprung_trap: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 28, h: 21, n: 4 },
    { kind: 'mouse', x: 21, y: 4, w: 3 },
    { kind: 'mothcloud', x: 14, y: 16, w: 3, h: 3, n: 4 },
  ],
  hush_windfall: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 30, h: 19, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 32, speed: 4, alpha: 0.1, band: 1, bandh: 18 },
    { kind: 'hare', x: 23, y: 12, face: 1 },
  ],
  hush_millrace: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 30, h: 21, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 32, speed: 4, alpha: 0.1, band: 1, bandh: 20 },
    { kind: 'hare', x: 30, y: 19, face: 1 },
  ],
  hush_quiet: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 34, h: 23, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 36, speed: 4, alpha: 0.1, band: 1, bandh: 22 },
    { kind: 'mouse', x: 20, y: 11, w: 3 },
  ],
  hush_clawed_bridge: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 30, h: 17, n: 4 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 32, speed: 4, alpha: 0.1, band: 1, bandh: 16 },
    { kind: 'hare', x: 15, y: 4, face: 1 },
  ],
  hush_starfall: [
    { kind: 'boughs' },
    { kind: 'leaffall', x: 1, y: 1, w: 22, h: 13, n: 3 },
    { kind: 'cloudshade', x: 0, y: 0, n: 3, span: 24, speed: 4, alpha: 0.1, band: 1, bandh: 12 },
    { kind: 'hare', x: 4, y: 11, face: -1 },
  ],
};
