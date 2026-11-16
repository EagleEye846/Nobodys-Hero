// Art for Gubb's crossing (the Stillwater, scenes gubb_crossing, gubb_ferry_over
// and gubb_ferry_back): the punt gliding over the black water.
//
//   lake_punt_east    Gubb's punt turned round to face east (the same four
//                     frames as bf_punt, which faces west): rocking, and he
//                     sings on one of them
//   lake_ripples      rings spreading out from the hull over the water, flat on
//                     the lake under the punt (96 x 36, 6 frames)
//   lake_glint        the lantern's warm reflection and the hull's dark one,
//                     wobbling under a west-facing punt (48 x 14, 4 frames)
//   lake_glint_east   the same under an east-facing punt
//
// The ripples and the glint are `flat` actors in the scene, held under the
// punt (see the `hold` step in src/overworld/scenePlayer.js).

import { BF_PUNT_SPRITES, BF_PALETTE } from './belowFolk.js';

// --- The punt, the other way round ---------------------------------------
const flipRows = (rows) => rows.map((row) => [...row].reverse().join(''));
export const LAKE_PUNT_EAST_SPRITES = Object.fromEntries(Object.entries(BF_PUNT_SPRITES).map(([name, rows]) => [name, flipRows(rows)]));
export const LAKE_PUNT_EAST_PALETTE = BF_PALETTE;

// --- Ripples ----------------------------------------------------------------
// Colours are see-through, so the black water shows through the rings.
export const LAKE_RIPPLES_PALETTE = {
  1: 'rgba(176, 214, 238, 0.8)',
  2: 'rgba(160, 204, 232, 0.55)',
  3: 'rgba(140, 190, 222, 0.34)',
  4: 'rgba(120, 172, 208, 0.18)',
};

function ripples(frame) {
  const W = 96;
  const H = 36;
  const cells = Array.from({ length: H }, () => Array(W).fill('.'));
  const cx = 47.5;
  const cy = 18;
  const rings = 3;
  for (let i = 0; i < rings; i++) {
    // Each ring grows from the hull to the edge and fades as it goes.
    const age = ((frame + i * 2) % 6) / 6;
    const rx = 12 + age * 35;
    const ry = rx * 0.36;
    const strength = age < 0.34 ? '1' : age < 0.6 ? '2' : age < 0.85 ? '3' : '4';
    for (let a = 0; a < 360; a += 2) {
      const x = Math.round(cx + Math.cos((a * Math.PI) / 180) * rx);
      // The nearer half (below the hull) is drawn a little stronger.
      const y = Math.round(cy + Math.sin((a * Math.PI) / 180) * ry);
      if (x >= 0 && x < W && y >= 0 && y < H) cells[y][x] = strength;
    }
  }
  return cells.map((row) => row.join(''));
}
export const LAKE_RIPPLES_SPRITES = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`r${i}`, ripples(i)]));

// --- The reflection -----------------------------------------------------
export const LAKE_GLINT_PALETTE = {
  d: 'rgba(3, 6, 14, 0.62)',
  D: 'rgba(3, 6, 14, 0.34)',
  e: 'rgba(255, 214, 122, 0.95)',
  f: 'rgba(255, 200, 100, 0.6)',
  g: 'rgba(255, 190, 90, 0.32)',
};

function glint(frame, east) {
  const W = 48;
  const H = 14;
  const cells = Array.from({ length: H }, () => Array(W).fill('.'));
  const set = (x, y, c) => {
    x = Math.round(x);
    if (x >= 0 && x < W && y >= 0 && y < H) cells[y][x] = c;
  };
  const sway = (y, k) => Math.round(Math.sin((frame * 1.5 + y * 0.9 + k) * 1.1) * (0.6 + y * 0.12));
  // The hull, upside down in the water: a dark band that wobbles at the edges.
  for (let y = 0; y < 5; y++) {
    const inset = 2 + y * 2 + (frame % 2 && y % 2 ? 1 : 0);
    for (let x = inset; x < W - inset; x++) set(x, y, y > 2 ? 'D' : 'd');
  }
  // The lantern at the bow, broken up into dashes that sway.
  const lampX = east ? W - 6 : 5;
  for (let y = 0; y < H; y++) {
    if ((y + frame) % 3 === 2) continue;
    const x = lampX + sway(y, 0);
    set(x, y, y < 4 ? 'e' : y < 8 ? 'f' : 'g');
    if (y < 7) set(x + (frame % 2 ? 1 : -1), y, y < 3 ? 'f' : 'g');
  }
  // A few pale flecks where the hull's light touches the ripples.
  for (let k = 0; k < 4; k++) set(lampX + (east ? -1 : 1) * (4 + k * 4) + sway(k * 2, k), 1 + k * 2 + (frame % 2), 'g');
  return cells.map((row) => row.join(''));
}
export const LAKE_GLINT_SPRITES = Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`g${i}`, glint(i, false)]));
export const LAKE_GLINT_EAST_SPRITES = Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`g${i}`, glint(i, true)]));
export const LAKE_GLINT_EAST_PALETTE = LAKE_GLINT_PALETTE;
