// The life pass (2026-11-14): the living touches of the Beacon Isles, the Last Light and the Reach, by room
// id (see src/overworld/isleTouches.js for what each kind does). Drawn only: nothing here has a body.
export const ISLE_ROOM_TOUCHES = {
  isles_landing: [
    { kind: 'puffin', x: 11, y: 12 },
    { kind: 'cormorant', x: 24, y: 8 },
    { kind: 'kelp', x: 18, y: 3, w: 3, n: 6 },
    { kind: 'burst', x: 29, y: 5, every: 7 },
  ],
  isles_causeway: [
    { kind: 'puffin', x: 5, y: 11, face: -1 },
    { kind: 'kelp', x: 20, y: 12, w: 4, n: 6 },
    { kind: 'burst', x: 12, y: 5, every: 8 },
    { kind: 'buoy', x: 8, y: 2 },
  ],
  isles_gannet_stack: [
    { kind: 'gannets', x: 12, y: 11, n: 3 },
    { kind: 'puffin', x: 29, y: 6, face: -1 },
    { kind: 'kelp', x: 20, y: 20, w: 4, n: 6 },
    { kind: 'burst', x: 16, y: 18, every: 7 },
  ],
  isles_bridge: [
    { kind: 'puffin', x: 7, y: 12 },
    { kind: 'cormorant', x: 26, y: 1 },
    { kind: 'kelp', x: 14, y: 6, w: 5, n: 7 },
    { kind: 'burst', x: 25, y: 1, every: 7 },
  ],
  isles_east_light: [
    { kind: 'gannets', x: 8, y: 2, n: 2 },
    { kind: 'puffin', x: 29, y: 11 },
    { kind: 'cormorant', x: 9, y: 4 },
    { kind: 'kelp', x: 5, y: 12, w: 4, n: 6 },
  ],
  isles_west_light: [
    { kind: 'gannets', x: 10, y: 1, n: 2 },
    { kind: 'puffin', x: 36, y: 3 },
    { kind: 'seal', x: 8, y: 14, face: 1 },
    { kind: 'cormorant', x: 16, y: 1 },
  ],
  isles_old_lightroom: [
    { kind: 'moth', x: 13, y: 3 },
  ],
  lastlight_foot: [
    { kind: 'moth', x: 16, y: 4 },
    { kind: 'spores', x: 4, y: 4, w: 6, h: 5, color: '200, 205, 200', n: 7 },
    { kind: 'drip', x: 14, y: 2.4, fall: 2.2, every: 5.1 },
  ],
  lastlight_sluice: [
    { kind: 'moth', x: 17, y: 4 },
    { kind: 'spores', x: 20, y: 4, w: 7, h: 5, color: '200, 205, 200', n: 7 },
    { kind: 'drip', x: 19, y: 2.2, fall: 2, every: 4.9 },
  ],
  lastlight_stair: [
    { kind: 'moth', x: 8, y: 3 },
    { kind: 'kelp', x: 7, y: 19, w: 9, n: 8 },
    { kind: 'spores', x: 4, y: 3, w: 8, h: 5, color: '200, 205, 200', n: 6 },
    { kind: 'drip', x: 14, y: 10.4, fall: 2.2, every: 4.6 },
  ],
  lastlight_gallery: [
    { kind: 'spores', x: 8, y: 5, w: 10, h: 5, color: '200, 205, 200', n: 8 },
    { kind: 'drip', x: 5, y: 2.4, fall: 2.2, every: 5.5 },
  ],
  lastlight_upper: [
    { kind: 'moth', x: 13, y: 4 },
    { kind: 'spores', x: 4, y: 5, w: 10, h: 8, color: '200, 205, 200', n: 9 },
    { kind: 'drip', x: 22, y: 2.4, fall: 2, every: 5.9 },
  ],
  reach_foot: [
    { kind: 'gannets', x: 18, y: 17, n: 3 },
    { kind: 'seal', x: 26, y: 18, face: -1 },
    { kind: 'cormorant', x: 12, y: 18 },
    { kind: 'kelp', x: 5, y: 20, w: 5, n: 7 },
  ],
  reach_eye: [
    { kind: 'gannets', x: 15, y: 2, n: 2 },
    { kind: 'cormorant', x: 22, y: 4 },
    { kind: 'kelp', x: 3, y: 8, w: 5, n: 7 },
    { kind: 'burst', x: 4, y: 4, every: 8 },
  ],
  reach_reef: [
    { kind: 'gannets', x: 19, y: 4, n: 2 },
    { kind: 'puffin', x: 12, y: 7 },
    { kind: 'seal', x: 33, y: 10, face: -1 },
    { kind: 'cormorant', x: 23, y: 10 },
  ],
  reach_first_rock: [
    { kind: 'gannets', x: 10, y: 5, n: 2 },
    { kind: 'puffin', x: 26, y: 2, face: -1 },
    { kind: 'seal', x: 29, y: 7, face: -1 },
    { kind: 'cormorant', x: 22, y: 5 },
  ],
  reach_wreck: [
    { kind: 'gannets', x: 29, y: 12, n: 3 },
    { kind: 'seal', x: 11, y: 2, face: 1 },
    { kind: 'kelp', x: 8, y: 15, w: 6, n: 8 },
    { kind: 'burst', x: 5, y: 12, every: 7 },
  ],
  reach_needle: [
    { kind: 'gannets', x: 20, y: 11, n: 3 },
    { kind: 'puffin', x: 15, y: 3 },
    { kind: 'kelp', x: 4, y: 38, w: 5, n: 7 },
    { kind: 'burst', x: 2, y: 37, every: 7 },
  ],
};
