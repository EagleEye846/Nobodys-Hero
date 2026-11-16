// The life pass's touches for Saltcombe and Gullrest (kinds in src/overworld/townLife.js, and the
// older ones in touches.js and coastTouches.js). Added on top of the room's own list in
// src/data/touches.js. `when: 'storm'` / `when: 'calm'` as there. Positions are in tiles.
//
//   gullThief  a gull that swoops in, lands at the drying fish and takes one (spooked if anyone stands there)
//   ripples    rings round a post, buoy or moored boat in the water
//   skyGulls   a few gulls wheeling high overhead (only once the storm is over, or in sunny Gullrest)
//   lap        the sea's edge sliding up the sand and back
export const TOWN_ROOM_TOUCHES = {
  saltcombe_quay: [
    { kind: 'ripples', points: [[13.5, 18.2], [21.5, 17.2], [35.5, 16.2], [17, 16.3], [29, 18.3]], rate: 0.28 },
    { kind: 'laundry', x: 12, y: 10.4, x2: 20, y2: 10.4, items: 5, posts: false, when: 'calm' },
    { kind: 'skyGulls', x: 4, y: 2, w: 30, h: 6, n: 3, when: 'calm' },
  ],
  saltcombe_market: [
    { kind: 'gullThief', x: 28.5, y: 9.4, from: 'right', every: 28, offset: 12 },
    { kind: 'skyGulls', x: 3, y: 1, w: 30, h: 8, n: 3, when: 'calm' },
  ],
  saltcombe_lagoon: [
    { kind: 'crab', x: 7, y: 17, r: 1 },
    { kind: 'skyGulls', x: 3, y: 1, w: 28, h: 6, n: 3, when: 'calm' },
  ],
  saltcombe_lookout: [
    { kind: 'skyGulls', x: 3, y: 2, w: 30, h: 8, n: 3, when: 'calm' },
  ],
  gullrest_beach: [
    { kind: 'lap', x: 1, y: 14, w: 41, amp: 5 },
    { kind: 'skyGulls', x: 3, y: 5, w: 36, h: 7, n: 4 },
    { kind: 'laundry', x: 16, y: 6.6, x2: 22, y2: 6.6, items: 5 },
  ],
  gullrest_cove: [
    { kind: 'skyGulls', x: 3, y: 3, w: 28, h: 8, n: 3 },
  ],
  gullrest_jetty: [
    { kind: 'ripples', points: [[26.5, 12.3], [35.5, 11.3]], rate: 0.3 },
    { kind: 'skyGulls', x: 3, y: 2, w: 40, h: 8, n: 4 },
  ],
  gullrest_cliff_steps: [
    { kind: 'skyGulls', x: 2, y: 8, w: 14, h: 14, n: 3 },
  ],
};
