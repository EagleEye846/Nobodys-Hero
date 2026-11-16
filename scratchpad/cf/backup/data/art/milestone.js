import { Pix, dissolve, recolour, clip, shiftRows } from './pixKit.js';

// The MILESTONE, 28x34: an old roadside milestone that has got up and walks,
// a slab of grey stone with a rounded top, soot-streaked, the moss on it burnt
// to black stubble. Carved in its face is how many miles it is to the buried
// town, and the number goes down as it goes. Two carved eye-holes with a faint
// glow at the back, and two square stone feet. Idle, it rocks from foot to
// foot; before an attack the number glows and its eyes light; hit, a chip
// flies off and the number cracks; beaten, it topples over on its back and the
// number reads nought; spared, it settles into the ground at the roadside,
// where it belongs. Drawn in code (see pixKit.js).
export const MILESTONE_PALETTE = {
  k: '#141012',
  s: '#8a8278',
  S: '#aaa296',
  w: '#cac2b4',
  d: '#5e5850',
  D: '#3e3a36',
  c: '#24201f',
  e: '#ff8c1a',
  E: '#ffd25e',
  r: '#a8401a',
  m: '#2e2a26',
};

const W = 28;
const H = 34;

// The digits carved in its face, 3x5.
const DIGITS = {
  0: ['###', '#.#', '#.#', '#.#', '###'],
  1: ['.#.', '##.', '.#.', '.#.', '###'],
  2: ['###', '..#', '###', '#..', '###'],
  3: ['###', '..#', '.##', '..#', '###'],
  4: ['#.#', '#.#', '###', '..#', '..#'],
  5: ['###', '#..', '###', '..#', '###'],
  6: ['###', '#..', '###', '#.#', '###'],
  7: ['###', '..#', '.#.', '.#.', '.#.'],
};

// pose: dy (bob), rock (-1/0/1: which foot it's on), num (the miles carved on
// it), glow (0 none, 1 the number glows, 2 the eyes too), eye ('on' | 'x' |
// 'calm' | 'out'), chip (a corner knocked off), crack (a crack through the
// number), sink (spared: settled into the ground), fallen (0 standing, 1 tipping, 2 down).
function drawStone(pose) {
  const { dy = 0, rock = 0, num = 3, glow = 0, eye = 'on', chip = 0, crack = 0, sink = 0, fallen = 0 } = pose;
  const g = new Pix(W, H);
  if (fallen >= 2) {
    // Down on its back across the road: the slab seen from the end, the number skyward.
    g.rect(2, 24, 24, 7, 's');
    g.disc(25, 27.5, 2.5, 3.5, 's');
    g.rect(2, 24, 24, 1, 'S');
    g.rect(2, 30, 24, 1, 'd');
    g.rect(0, 25, 3, 3, 'd');
    g.rect(0, 29, 3, 2, 'd');
    // The nought, on its top edge.
    for (let i = 0; i < 6; i++) g.set(9 + i, 24, i === 0 || i === 5 ? 'm' : 'D');
    g.outline('k');
    return g.rows();
  }
  const lean = fallen ? 3 : 0;
  const top = 6 + dy + sink;
  const bottom = 27 + dy + sink;
  const lx = 5;
  const rx = 22;
  // Feet first, behind.
  if (!sink) {
    const lift = (side) => (rock === side ? -2 : 0);
    g.rect(lx + 1, bottom + 1 + lift(-1), 6, 4, 'd');
    g.rect(rx - 6, bottom + 1 + lift(1), 6, 4, 'd');
    g.rect(lx + 1, bottom + 1 + lift(-1), 6, 1, 's');
    g.rect(rx - 6, bottom + 1 + lift(1), 6, 1, 's');
  }
  // The slab: a rounded top, square shoulders.
  for (let y = top; y <= bottom; y++) {
    const shift = Math.round(((y - top) / (bottom - top) - 1) * -lean);
    g.rect(lx + shift, y, rx - lx + 1, 1, 's');
  }
  g.disc((lx + rx) / 2 + lean, top + 1, (rx - lx) / 2 + 0.5, 5, 's');
  // Light down the left, shade down the right and at the foot.
  for (let y = top - 3; y <= bottom; y++) {
    const shift = Math.round(((y - top) / (bottom - top) - 1) * -lean);
    if (g.get(lx + 1 + shift, y) === 's') g.set(lx + 1 + shift, y, 'S');
    if (g.get(lx + 2 + shift, y) === 's' && y < top + 6) g.set(lx + 2 + shift, y, 'w');
    if (g.get(rx + shift, y) === 's') g.set(rx + shift, y, 'd');
  }
  g.rect(lx, bottom - 1, rx - lx + 1, 2, 'd');
  // A corner knocked off.
  if (chip) { g.set(rx, top + 2, '.'); g.set(rx - 1, top + 1, '.'); g.set(rx, top + 3, '.'); g.set(rx - 1, top + 2, 'd'); }
  // Soot streaks down from the top.
  for (const [x, len] of [[lx + 4, 7], [lx + 11, 5], [lx + 14, 9]]) g.line(x + lean, top - 2, x + lean, top - 2 + len, 'd');
  // The eye-holes, carved in under the curve of the top.
  const cx = (lx + rx) / 2 + lean;
  const ey = top + 1;
  for (const x of [cx - 4, cx + 3]) {
    g.rect(x, ey, 2, 2, 'm');
    if (eye === 'on') g.set(x, ey + 1, glow > 1 ? 'E' : 'r');
    else if (eye === 'calm') g.set(x, ey + 1, 'r');
    else if (eye === 'x') { g.set(x, ey, 'D'); g.set(x + 1, ey + 1, 'D'); }
    if (glow > 1 && eye === 'on') g.set(x + 1, ey + 1, 'e');
  }
  // The miles carved into its face, in a sunk panel.
  const px = Math.round(cx - 4);
  const py = top + 6;
  g.rect(px, py, 9, 9, 'd');
  g.rect(px + 1, py + 1, 7, 7, 's');
  g.line(px + 1, py + 1, px + 7, py + 1, 'd');
  const digit = DIGITS[Math.max(0, Math.min(7, num))];
  digit.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === '#') g.set(px + 3 + i, py + 2 + j, glow ? (glow > 1 ? 'E' : 'e') : 'm');
  }));
  if (crack) { g.line(px + 2, py + 1, px + 5, py + 4, 'D'); g.line(px + 5, py + 4, px + 4, py + 8, 'D'); }
  // "M" for miles, scratched underneath, and a line for the road.
  g.line(px + 2, py + 11, px + 6, py + 11, 'd');
  // Burnt moss: black stubble round the foot.
  for (let x = lx; x <= rx; x += 2) g.set(x, bottom - 2 - (x % 3 === 0 ? 1 : 0), 'c');
  g.set(lx + 3, bottom - 3, 'r');
  g.outline('k');
  if (sink) {
    // Settled into the road: a line of ash heaped round its foot.
    for (let x = 2; x < W - 2; x++) g.set(x, bottom + 1, (x % 3) ? 'S' : 'w');
  }
  return g.rows();
}

const FLASH = { s: 'w', S: 'w', d: 'S', D: 's' };

export const MILESTONE_SPRITE = drawStone({});

export const MILESTONE_ANIM = {
  chips: ['#8a8278', '#aaa296', '#5e5850'],
  idle: clip(3, [0, 1, 2, 3], (i) => drawStone({ rock: [-1, 0, 1, 0][i], dy: i % 2 ? 0 : -1 })),
  windup: clip(8, [0, 1, 2, 3], (i) => drawStone({ glow: i < 2 ? 1 : 2, rock: i % 2 ? 1 : -1, dy: -1 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = shiftRows(drawStone({ chip: 1, crack: 1, eye: 'x' }), i < 2 ? 2 : 1, 0);
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(3, [0, 1, 2, 3, 4, 5], (i) => (i < 2
    ? drawStone({ num: 1, crack: 1, chip: 1, eye: 'x', fallen: 1 })
    : dissolve(drawStone({ fallen: 2 }), i >= 4 ? (i - 3) * 0.25 : 0, 3))),
  spared: clip(3, [0, 1, 2, 3], (i) => drawStone({ eye: 'calm', sink: i < 2 ? i * 2 : 3, num: 3 })),
};
