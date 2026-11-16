// The life pass, round 2 (15 November 2026): the living things of chapter 1's Ruins and Mother Taper's house,
// per room (see src/overworld/ruinsLife.js for the kinds it adds, and src/overworld/touches.js and
// lanesLife.js for the ones it borrows: moths, candles, snail, swimfish, drift, echodrip). Drawn only: no
// bodies, so none of them can block a lever, a gate, a block, a monster or a cutscene walk.
export const RUINS_TOUCHES = {
  ruins_entrance: [
    { kind: 'beetles', points: [[11, 14], [12, 17]] },
    { kind: 'candles', points: [[12, 11], [26, 17]] },
    { kind: 'shaft', x: 15, y: 3, w: 3, h: 5, color: '200,210,235' },
    { kind: 'spores', x: 15, y: 3, w: 3, h: 6, color: '210,215,235', n: 8 },
  ],
  lantern_hall: [
    { kind: 'moths', x: 5, y: 10.2, n: 4 },
    { kind: 'bats', x: 3, y: 1.6, w: 14, n: 2, every: 17 },
    { kind: 'gecko', x: 12, y: 1.5, toX: 17 },
    { kind: 'dustfall', x: 9, y: 2, w: 2 },
  ],
  pillar_room: [
    { kind: 'beetles', points: [[3, 10], [16, 12]] },
    { kind: 'candles', points: [[2, 5], [18, 12]] },
    { kind: 'drip', x: 12, y: 8, fall: 2 },
    { kind: 'spores', x: 2, y: 4, w: 16, h: 8, color: '200,190,220', n: 10 },
  ],
  flower_room: [
    { kind: 'moonbells', points: [[8, 5], [9, 5], [11, 5], [12, 5], [8, 6], [9, 6], [11, 6], [12, 6], [3, 7], [16, 10]] },
    { kind: 'beetles', look: 'ladybird', points: [[7, 7], [13, 7], [5, 9], [15, 9]] },
    { kind: 'fireflies', x: 7, y: 3, w: 7, h: 5, color: '170,200,255', n: 7 },
    { kind: 'swimfish', x: 16, y: 5, w: 3, h: 2, n: 2 },
  ],
  way_out: [
    { kind: 'webs', x: 1, y: 3, side: 'l' },
    { kind: 'beetles', points: [[10, 6], [18, 7], [27, 6]] },
    { kind: 'candles', points: [[29, 7], [33, 7]] },
    { kind: 'spores', x: 28, y: 3, w: 6, h: 5, color: '200,200,215', n: 8 },
  ],
  taper_home: [
    { kind: 'moths', x: 4, y: 1.7, n: 3 },
    { kind: 'hanglamp', x: 13, y: 1.3, len: 18 },
    { kind: 'spores', x: 4, y: 4, w: 8, h: 6, color: '255,200,140', n: 6 },
  ],
  taper_kitchen: [
    { kind: 'steam', x: 3.5, y: 2.5, lean: 0.4 },
    { kind: 'spores', x: 4, y: 3, w: 6, h: 5, color: '255,200,140', n: 6 },
  ],
  taper_hall: [
    { kind: 'steam', x: 4.8, y: 3, lean: 0.3 },
    { kind: 'sparks', x: 4.6, y: 3.4, n: 4 },
    { kind: 'hanglamp', x: 8, y: 1.3, len: 20 },
    { kind: 'moths', x: 10, y: 1.7, n: 3 },
  ],
  your_room: [
    { kind: 'beetles', look: 'ladybird', points: [[3, 5], [7, 5], [10, 7]] },
    { kind: 'moths', x: 7, y: 1.7, n: 3 },
    { kind: 'spores', x: 3, y: 3, w: 8, h: 5, color: '240,240,200', n: 8 },
  ],
};
