// The life pass's touches for the Sunken Lanes and the Soundings (see src/overworld/lanesLife.js for
// the kinds it adds, and src/overworld/touches.js for the rest). Drawn only: no bodies.
export const LANES_TOUCHES = {
  lanes_fork: [
    { kind: 'swimfish', x: 22, y: 10, w: 17, h: 5, n: 4 },
    { kind: 'rainrings', x: 22, y: 10, w: 17, h: 5, n: 16 },
    { kind: 'bobbers', items: [{ k: 'chair', x: 25, y: 11 }, { k: 'apples', x: 29, y: 12.5 }, { k: 'bucket', x: 24, y: 14, r: 0.5 }, { k: 'hat', x: 34, y: 15 }, { k: 'lantern', x: 28, y: 14 }] },
    { kind: 'midges', x: 23, y: 9, w: 10, h: 2, n: 12 },
  ],
  lanes_causeway: [
    { kind: 'swimfish', x: 5, y: 2, w: 30, h: 13, n: 7 },
    { kind: 'rainrings', x: 5, y: 2, w: 30, h: 13, n: 22 },
    { kind: 'bobbers', items: [{ k: 'chair', x: 9, y: 5, r: 1.2 }, { k: 'hat', x: 14, y: 10, r: 1.2 }, { k: 'bucket', x: 26, y: 5, r: 1.2 }, { k: 'basket', x: 30, y: 10, r: 1 }, { k: 'plank', x: 11, y: 3, r: 1 }, { k: 'slipper', x: 25, y: 13, r: 1 }] },
    { kind: 'drift', x: 5, y: 2, w: 30, h: 13, n: 9, color: '#a86a30', lit: '#d8924a' },
  ],
  lanes_sluices: [
    { kind: 'swimfish', x: 25, y: 9, w: 9, h: 5, n: 3 },
    { kind: 'rainrings', x: 6, y: 3, w: 27, h: 11, n: 18 },
    { kind: 'bobbers', items: [{ k: 'chair', x: 28, y: 14, r: 0.6 }, { k: 'teacup', x: 12, y: 11, r: 0.6 }, { k: 'book', x: 14, y: 2, r: 0.6 }] },
    { kind: 'moths', x: 17, y: 9.4, n: 4 },
  ],
  lanes_hamlet: [
    { kind: 'swimfish', x: 1, y: 17, w: 42, h: 3, n: 5 },
    { kind: 'rainrings', x: 1, y: 17, w: 42, h: 3, n: 16 },
    { kind: 'rainrings', x: 24, y: 2, w: 10, h: 8, n: 8 },
    { kind: 'bobbers', items: [{ k: 'chair', x: 8, y: 18, r: 0.8 }, { k: 'bucket', x: 18, y: 17, r: 0.8 }, { k: 'hat', x: 25, y: 18, r: 0.8 }, { k: 'apples', x: 28, y: 18, r: 0.5 }, { k: 'doll', x: 38, y: 19, r: 0.7 }, { k: 'loaf', x: 12, y: 19, r: 0.8 }, { k: 'boat', x: 22, y: 19, r: 0.8 }] },
  ],
  lanes_mill: [
    { kind: 'swimfish', x: 18, y: 2, w: 3, h: 16, n: 4 },
    { kind: 'rainrings', x: 18, y: 2, w: 3, h: 16, n: 10 },
    { kind: 'rainrings', x: 2, y: 14, w: 6, h: 3, n: 4 },
    { kind: 'bobbers', items: [{ k: 'bucket', x: 19, y: 12, r: 0.6 }, { k: 'plank', x: 19, y: 6, r: 0.6 }] },
  ],
  lanes_down: [
    { kind: 'swimfish', x: 1, y: 14, w: 10, h: 4, n: 3 },
    { kind: 'rainrings', x: 1, y: 13, w: 10, h: 5, n: 8 },
    { kind: 'rainrings', x: 20, y: 13, w: 11, h: 5, n: 9 },
    { kind: 'rainrings', x: 27, y: 10, w: 4, h: 3, n: 4 },
  ],
  lanes_bubble: [
    { kind: 'swimfish', x: 1, y: 2, w: 28, h: 6, n: 5 },
    { kind: 'bobbers', items: [{ k: 'chair', x: 6, y: 5, r: 0.8 }, { k: 'hat', x: 24, y: 4, r: 0.8 }, { k: 'apples', x: 4, y: 15, r: 0.6 }, { k: 'bottle', x: 25, y: 16, r: 0.6 }] },
    { kind: 'midges', x: 11, y: 9, w: 8, h: 2, n: 10 },
  ],
  soundings_mouth: [
    { kind: 'swimfish', x: 1, y: 14, w: 33, h: 3, n: 4, pale: true },
    { kind: 'rainrings', x: 1, y: 13, w: 33, h: 5, n: 8, calm: true },
    { kind: 'echodrip', x: 29, y: 2.6, fall: 4.6, every: 6.5 },
    { kind: 'bats', x: 6, y: 1.6, w: 20, every: 17, n: 2 },
  ],
  soundings_echo_hall: [
    { kind: 'swimfish', x: 2, y: 9, w: 33, h: 11, n: 6, pale: true },
    { kind: 'rainrings', x: 2, y: 9, w: 33, h: 11, n: 12, calm: true },
    { kind: 'echodrip', x: 33, y: 2.6, fall: 6, every: 8.3 },
    { kind: 'bats', x: 4, y: 1.8, w: 34, every: 21, n: 3 },
  ],
  soundings_up: [
    { kind: 'echodrip', x: 6, y: 2.6, fall: 6.5, every: 7.2 },
    { kind: 'bats', x: 4, y: 2, w: 16, every: 19, n: 2 },
    { kind: 'eyes', points: [[2, 7], [21, 22]] },
    { kind: 'candles', points: [[10, 18.7]] },
  ],
  soundings_tide_stair: [
    { kind: 'swimfish', x: 6, y: 19, w: 17, h: 8, n: 4, pale: true },
    { kind: 'rainrings', x: 6, y: 19, w: 17, h: 8, n: 8, calm: true },
    { kind: 'echodrip', x: 18, y: 2.6, fall: 8.6, every: 7 },
    { kind: 'bats', x: 3, y: 2, w: 22, every: 18, n: 2 },
  ],
  soundings_three_wells: [
    { kind: 'swimfish', x: 12, y: 7, w: 11, h: 8, n: 3, pale: true },
    { kind: 'echodrip', x: 16, y: 2.6, fall: 4.5, every: 5.5 },
    { kind: 'bats', x: 3, y: 2, w: 28, every: 22, n: 2 },
    { kind: 'eyes', points: [[1, 14], [34, 2]] },
  ],
  soundings_drowned_chapel: [
    { kind: 'shaft', x: 14.2, y: 0.8, w: 5.6, h: 9, color: '190,225,235' },
    { kind: 'swimfish', x: 1, y: 6, w: 32, h: 10, n: 5, pale: true },
    { kind: 'rainrings', x: 1, y: 6, w: 32, h: 10, n: 10, calm: true },
    { kind: 'candles', points: [[14, 16.6], [18, 16.6]] },
  ],
  soundings_weight_room: [
    { kind: 'swimfish', x: 10, y: 2, w: 18, h: 4, n: 3, pale: true },
    { kind: 'rainrings', x: 22, y: 7, w: 12, h: 12, n: 9, calm: true },
    { kind: 'echodrip', x: 13, y: 2.6, fall: 3.8, every: 6.1 },
    { kind: 'bats', x: 2, y: 1.8, w: 30, every: 23, n: 2 },
  ],
  secret_soundings_bell: [
    { kind: 'echodrip', x: 9, y: 2.6, fall: 3.4, every: 6.4 },
    { kind: 'eyes', points: [[1, 6]] },
  ],
};
