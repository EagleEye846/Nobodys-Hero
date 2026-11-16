// The life pass's touches for the Pinefall and Hollin (see src/overworld/r3pLife.js for the kinds). Drawn only: no bodies.
export const R3P_TOUCHES = {
  pinefall_landing: [
    { kind: 'r3p_canopy', x0: 1, x1: 23, y: 1, side: 'top', n: 7, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 22, h: 14, n: 6 },
    { kind: 'r3p_flit', x: 10, y: 13, w: 5, h: 3, n: 3 },
    { kind: 'r3p_ants', x1: 1.5, y1: 11.8, x2: 5.5, y2: 12.6, n: 7 },
  ],
  pinefall_bramble_gate: [
    { kind: 'r3p_canopy', x0: 1, x1: 9, y: 1, side: 'top', n: 2, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 24, h: 16, n: 8 },
    { kind: 'r3p_flit', x: 9, y: 7, w: 5, h: 3, n: 3 },
    { kind: 'r3p_ants', x1: 1.5, y1: 2.8, x2: 5.5, y2: 3.6, n: 7 },
  ],
  pinefall_deadfall: [
    { kind: 'r3p_canopy', x0: 1, x1: 29, y: 1, side: 'top', n: 9, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 28, h: 16, n: 9 },
    { kind: 'r3p_flit', x: 5, y: 3, w: 5, h: 3, n: 3 },
    { kind: 'r3p_ants', x1: 20.5, y1: 1.8, x2: 24.5, y2: 2.6, n: 7 },
  ],
  pinefall_tumbled: [
    { kind: 'r3p_canopy', x0: 1, x1: 23, y: 1, side: 'top', n: 7, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 22, h: 13, n: 6 },
    { kind: 'r3p_flit', x: 9, y: 10, w: 5, h: 3, n: 3 },
    { kind: 'r3p_critter', species: 'squirrel', x: 7, y: 8, refuge: { x: 8, y: 5 }, flip: false },
  ],
  pinefall_brook: [
    { kind: 'r3p_canopy', x0: 1, x1: 29, y: 1, side: 'top', n: 9, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 28, h: 18, n: 10 },
    { kind: 'r3p_flit', x: 10, y: 4, w: 5, h: 3, n: 3 },
    { kind: 'r3p_ants', x1: 7.5, y1: 1.8, x2: 11.5, y2: 2.6, n: 7 },
  ],
  pinefall_camp: [
    { kind: 'r3p_canopy', x0: 1, x1: 31, y: 1, side: 'top', n: 10, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 30, h: 18, n: 11 },
    { kind: 'r3p_flit', x: 24, y: 5, w: 5, h: 3, n: 3 },
    { kind: 'r3p_ants', x1: 30.5, y1: 14.8, x2: 34.5, y2: 15.6, n: 7 },
  ],
  pinefall_rolling: [
    { kind: 'r3p_canopy', x0: 1, x1: 23, y: 1, side: 'top', n: 7, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 22, h: 15, n: 7 },
    { kind: 'r3p_flit', x: 7, y: 11, w: 5, h: 3, n: 3 },
    { kind: 'r3p_critter', species: 'rabbit', x: 14, y: 13, refuge: { x: 18.5, y: 13 }, flip: true },
  ],
  pinefall_maze: [
    { kind: 'r3p_canopy', x0: 1, x1: 34, y: 1, side: 'top', n: 11, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 33, h: 21, n: 14 },
    { kind: 'r3p_ants', x1: 30.5, y1: 15.8, x2: 34.5, y2: 16.6, n: 7 },
  ],
  pinefall_tatters: [
    { kind: 'r3p_canopy', x0: 1, x1: 27, y: 1, side: 'top', n: 8, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 26, h: 16, n: 9 },
    { kind: 'r3p_flit', x: 10, y: 0, w: 5, h: 3, n: 3 },
    { kind: 'r3p_critter', species: 'hedgehog', x: 8, y: 1, flip: false },
  ],
  pinefall_quarry: [
    { kind: 'r3p_canopy', x0: 1, x1: 8, y: 1, side: 'top', n: 2, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 22, h: 16, n: 7 },
    { kind: 'r3p_flit', x: 0, y: 10, w: 5, h: 3, n: 3 },
    { kind: 'r3p_ants', x1: 18.5, y1: 1.8, x2: 22.5, y2: 2.6, n: 7 },
  ],
  pinefall_ravine: [
    { kind: 'r3p_canopy', x0: 1, x1: 8, y: 1, side: 'top', n: 2, size: 11 },
    { kind: 'r3p_dapple', x: 1, y: 1, w: 22, h: 32, n: 14 },
    { kind: 'r3p_flit', x: 5, y: 30, w: 5, h: 3, n: 3 },
    { kind: 'r3p_critter', species: 'squirrel', x: 15, y: 15, refuge: { x: 12, y: 16 }, flip: true },
  ],
  hollin_gate: [
    { kind: 'r3p_perch', bird: 'crow', x: 23, y: 1.3, twig: false, flip: true },
    { kind: 'r3p_looseboard', x: 26, y: 4 },
    { kind: 'r3p_flit', x: 27, y: 11, w: 5, h: 3, n: 3, colors: [['#d8d0c8', '#8a8076'], ['#c8d0d8', '#6a7480']] },
    { kind: 'r3p_canopy', x0: 1, x1: 16, y: 1, side: 'top', n: 5, size: 11 },
  ],
  hollin_lane: [
    { kind: 'r3p_perch', bird: 'crow', x: 29, y: 3.3, twig: false, flip: true },
    { kind: 'r3p_canopy', x0: 1, x1: 12, y: 1, side: 'top', n: 3, size: 11 },
  ],
  hollin_mill: [
    { kind: 'r3p_looseboard', x: 21, y: 8 },
    { kind: 'r3p_flit', x: 2, y: 6, w: 5, h: 3, n: 3, colors: [['#d8d0c8', '#8a8076'], ['#c8d0d8', '#6a7480']] },
    { kind: 'r3p_critter', species: 'squirrel', x: 30, y: 12, refuge: { x: 27, y: 16 }, flip: true },
    { kind: 'r3p_canopy', x0: 1, x1: 13, y: 1, side: 'top', n: 4, size: 11 },
  ],
  hollin_well: [
    { kind: 'r3p_perch', bird: 'crow', x: 6, y: 2.3, twig: false, flip: true },
    { kind: 'r3p_looseboard', x: 7, y: 5 },
    { kind: 'r3p_canopy', x0: 1, x1: 31, y: 1, side: 'top', n: 10, size: 11 },
  ],
  hollin_stores: [
    { kind: 'r3p_motes', x: 2, y: 6, w: 4, h: 3, n: 12 },
  ],
  hollin_backroom: [
    { kind: 'r3p_motes', x: 11, y: 7, w: 3, h: 3, n: 8 },
  ],
  hollin_lookout: [
    { kind: 'r3p_motes', x: 3, y: 4, w: 6, h: 5, n: 10, color: '255,220,170' },
    { kind: 'r3p_canopy', x0: 1, x1: 13, y: 1, side: 'top', n: 5, size: 10 },
    { kind: 'r3p_flit', x: 4, y: 4, w: 5, h: 3, n: 2 },
  ],
  hollin_well_bottom: [
    { kind: 'r3p_motes', x: 6, y: 2, w: 6, h: 6, n: 8, color: '200,230,255' },
  ],
};
