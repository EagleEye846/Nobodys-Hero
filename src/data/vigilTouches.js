// The life pass's living things on Mount Vigil, by room id (see src/overworld/vigilLife.js for what each kind does).
// Drawn only: none has a body. Positions are in tiles.
export const VIGIL_ROOM_TOUCHES = {
  vigil_ridge: [
    { kind: 'hare', x: 31, y: 31, min: 24, max: 35, face: -1 },
    { kind: 'slide', x: 38, y: 20, w: 2, drop: 28, every: 36.8 },
    { kind: 'sparkle', x: 10, y: 9, w: 30, h: 2, n: 12 },
    { kind: 'spindrift', x: 9, y: 9, w: 34, h: 2, dir: 1, n: 7 },
  ],
  vigil_hollow: [
    { kind: 'sparkle', x: 3, y: 26, w: 38, h: 4, n: 14 },
    { kind: 'spindrift', x: 2, y: 26, w: 38, h: 4, dir: 1, n: 7 },
  ],
  vigil_spiral: [
    { kind: 'stoat', x: 12, y: 12, to: [16, 12], face: 1 },
    { kind: 'slide', x: 8, y: 19, w: 2, drop: 36, every: 36.6 },
    { kind: 'sparkle', x: 3, y: 16, w: 40, h: 2, n: 12 },
    { kind: 'spindrift', x: 3, y: 16, w: 40, h: 2, dir: 1, n: 6 },
  ],
  vigil_shoulder: [
    { kind: 'pineSnow', x: 41, y: 19, every: 15.1 },
    { kind: 'slide', x: 4, y: 23, w: 2, drop: 32, every: 26.9 },
    { kind: 'sparkle', x: 3, y: 19, w: 40, h: 3, n: 16 },
    { kind: 'spindrift', x: 3, y: 19, w: 40, h: 3, dir: 1, n: 8 },
  ],
  vigil_ice_face: [
    { kind: 'grouse', x: 23, y: 11, min: 23, max: 23, face: -1 },
    { kind: 'pineSnow', x: 13, y: 30, every: 18.7 },
    { kind: 'slide', x: 32, y: 15, w: 2, drop: 42, every: 36.0 },
    { kind: 'sparkle', x: 11, y: 12, w: 26, h: 2, n: 12 },
  ],
  vigil_knife_edge: [
    { kind: 'pineSnow', x: 5, y: 14, every: 21.6 },
    { kind: 'slide', x: 31, y: 18, w: 2, drop: 41, every: 21.2 },
    { kind: 'sparkle', x: 5, y: 14, w: 36, h: 3, n: 14 },
    { kind: 'spindrift', x: 5, y: 14, w: 36, h: 3, dir: 1, n: 9 },
  ],
  vigil_cloud_walk: [
    { kind: 'grouse', x: 10, y: 31, min: 10, max: 17, face: 1 },
    { kind: 'pineSnow', x: 36, y: 14, every: 22.2 },
    { kind: 'slide', x: 17, y: 18, w: 2, drop: 41, every: 22.3 },
    { kind: 'sparkle', x: 3, y: 14, w: 40, h: 3, n: 16 },
  ],
  vigil_second_cairn: [
    { kind: 'slide', x: 21, y: 8, w: 2, drop: 41, every: 22.5 },
    { kind: 'sparkle', x: 1, y: 2, w: 22, h: 5, n: 14 },
    { kind: 'spindrift', x: 1, y: 2, w: 22, h: 5, dir: 1, n: 7 },
  ],
  vigil_cloud_bank: [
    { kind: 'grouse', x: 4, y: 16, min: 1, max: 11, face: -1 },
    { kind: 'iceFish', cx: 27.9, cy: 15.7, rx: 3.0, ry: 0.85, n: 5 },
    { kind: 'slide', x: 29, y: 8, w: 2, drop: 27, every: 20.5 },
    { kind: 'sparkle', x: 1, y: 2, w: 38, h: 5, n: 16 },
  ],
  vigil_high_shelf: [
    { kind: 'sparkle', x: 1, y: 7, w: 28, h: 5, n: 12 },
    { kind: 'spindrift', x: 1, y: 7, w: 28, h: 5, dir: 1, n: 7 },
  ],
  vigil_broken_span: [
    { kind: 'hare', x: 1, y: 19, min: 1, max: 1, face: 1 },
    { kind: 'pineSnow', x: 2, y: 31, every: 17.4 },
    { kind: 'slide', x: 18, y: 12, w: 2, drop: 32, every: 30.1 },
    { kind: 'sparkle', x: 1, y: 2, w: 24, h: 9, n: 16 },
  ],
  vigil_wind_stair: [
    { kind: 'grouse', x: 5, y: 16, min: -2, max: 5, face: 1 },
    { kind: 'pineSnow', x: 9, y: 25, every: 15.9 },
    { kind: 'slide', x: 0, y: 19, w: 2, drop: 37, every: 30.7 },
    { kind: 'sparkle', x: 0, y: 6, w: 44, h: 3, n: 18 },
  ],
  vigil_lamplighters_ledge: [
    { kind: 'sparkle', x: 2, y: 3, w: 21, h: 3, n: 8 },
    { kind: 'spindrift', x: 1, y: 10, w: 22, h: 8, dir: 1, n: 9 },
  ],
  vigil_gale_face: [
    { kind: 'hare', x: 29, y: 50, min: 29, max: 34, face: 1 },
    { kind: 'slide', x: 22, y: 29, w: 2, drop: 44, every: 22.3 },
    { kind: 'sparkle', x: 10, y: 49, w: 25, h: 4, n: 16 },
    { kind: 'spindrift', x: 10, y: 49, w: 25, h: 4, dir: 1, n: 14 },
  ],
  vigil_weathervanes: [
    { kind: 'grouse', x: 7, y: 10, min: 7, max: 7, face: -1 },
    { kind: 'sparkle', x: 1, y: 2, w: 21, h: 4, n: 10 },
    { kind: 'spindrift', x: 1, y: 2, w: 21, h: 4, dir: 1, n: 9 },
  ],
  vigil_vane_gardens: [
    { kind: 'slide', x: 9, y: 8, w: 2, drop: 38, every: 26.1 },
    { kind: 'sparkle', x: 3, y: 2, w: 24, h: 5, n: 12 },
    { kind: 'spindrift', x: 3, y: 2, w: 24, h: 5, dir: 1, n: 10 },
  ],
  vigil_spire_neck: [
    { kind: 'slide', x: 38, y: 26, w: 2, drop: 29, every: 21.6 },
    { kind: 'sparkle', x: 8, y: 33, w: 29, h: 5, n: 14 },
    { kind: 'spindrift', x: 8, y: 33, w: 29, h: 5, dir: 1, n: 12 },
  ],
  vigil_owl_shelf: [
    { kind: 'sparkle', x: 1, y: 3, w: 26, h: 10, n: 18 },
    { kind: 'spindrift', x: 1, y: 3, w: 10, h: 10, dir: 1, n: 7 },
  ],
  vigil_summit: [
    { kind: 'slide', x: 23, y: 19, w: 2, drop: 36, every: 35.5 },
    { kind: 'spindrift', x: 2, y: 3, w: 28, h: 12, dir: 1, n: 12 },
  ],
  vigil_ice_chimney: [
    { kind: 'iceFish', cx: 11, cy: 5.5, rx: 2.7, ry: 0.6, n: 4 },
    { kind: 'drip', x: 19.5, y: 3.9, fall: 22, every: 4.9 },
    { kind: 'sparkle', x: 2, y: 3, w: 20, h: 4, n: 10 },
  ],
  vigil_lamplighters_hut: [
  ],
};
