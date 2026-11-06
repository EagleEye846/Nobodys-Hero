import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The KELPIE FOAL, 46x40, facing left: a young water-horse, all knees and
// eyelashes, glossy sea-green and trailing weed. A mane of long kelp
// ribbons, a frond for a tail, bladderwrack in the hair, and wet hooves that
// splash at every step. A foal: it can't quite make its legs go the same
// way at once. Idle, it shifts its weight and the mane ripples; before an
// attack it rears and paws; hit, it staggers; beaten, it folds up into a
// heap of weed; spared, it nuzzles forward. Drawn in code (see pixKit.js).
export const KELPIE_FOAL_PALETTE = {
  k: '#12262a',
  T: '#3aa890',
  t: '#68d0b4',
  d: '#1f7868',
  D: '#14584e',
  K: '#4a7a2a',
  L: '#7ab040',
  l: '#a8d460',
  b: '#6a4a24',
  B: '#9a7a3a',
  e: '#fff6c8',
  E: '#ffffff',
  s: '#a8e8f0',
  S: '#e8fcff',
  h: '#2a3a3a',
  p: '#e090a0',
  r: '#d86a6a',
};

const W = 46;
const H = 40;

// pose: dy, legs ('stand' | 'rear' | 'paw' | 'gallop' | 'fold'), mane (phase), eye ('big' | 'x' | 'glad' | 'wide'),
// mouth (0 shut, 1 open), splash (droplets), head (lift), fold (0-1 sinking).
function drawFoal(pose) {
  const { dy = 0, legs = 'stand', mane = 0, eye = 'big', mouth = 0, splash = 0, head = 0, fold = 0 } = pose;
  const g = new Pix(W, H);
  const rear = legs === 'rear';
  const lift = rear ? -6 : 0;
  const bx = 29;
  const by = 22 + dy + fold * 10;
  // The tail: a long frond of weed, swaying.
  for (let i = 0; i < 4; i++) {
    const sway = Math.sin(mane + i) * 2;
    g.line(bx + 10, by - 2 + lift * 0.5, 43 + sway, by + 6 + i * 3, i % 2 ? 'K' : 'L', 2);
  }
  // Back legs.
  const leg = (x0, y0, x1, y1, c) => {
    g.line(x0, y0, x1, y1, c, 3);
    g.rect(x1 - 1, y1, 3, 2, 'h');
  };
  const floor = 37;
  if (legs === 'fold') {
    g.disc(bx - 2, floor - 3, 16, 3, 'D');
  } else {
    const gal = legs === 'gallop';
    leg(bx + 7, by + 5, bx + (gal ? 14 : 8), gal ? floor - 3 : floor - 1, 'D');
    leg(bx + 4, by + 6, bx + (gal ? 0 : 3), floor - (gal ? 1 : 0), 'd');
    // Front legs.
    if (rear) {
      leg(bx - 8, by + 2, bx - 15, by - 6, 'd');
      leg(bx - 5, by + 4, bx - 11, by - 2, 'D');
    } else if (legs === 'paw') {
      leg(bx - 9, by + 5, bx - 15, by + 8, 'd');
      leg(bx - 6, by + 6, bx - 7, floor, 'D');
    } else {
      leg(bx - 9, by + 5, bx - (gal ? 18 : 10), gal ? floor - 4 : floor, 'd');
      leg(bx - 5, by + 6, bx - (gal ? 8 : 6), floor - (gal ? 1 : 0), 'D');
    }
  }
  // The body and its pale belly.
  g.disc(bx, by + (rear ? -1 : 0), 12, 8, 'T');
  g.disc(bx - 1, by + 4, 10, 4, 't', 'T');
  g.disc(bx + 4, by - 3, 8, 4, 'd', 'T');
  // The neck, an arch curving up to a fine head.
  const hx = 11;
  const hy = 9 + dy + head + fold * 14;
  g.line(bx - 10, by - 2, hx + 6, hy + 4, 'T', 6);
  g.line(bx - 9, by - 6, hx + 8, hy, 'd', 2);
  g.line(bx - 12, by, hx + 4, hy + 7, 't', 2);
  // The mane: long ribbons of kelp flowing back off the crest, rippling.
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const x0 = hx + 9 + t * 9;
    const y0 = hy - 1 + t * 9;
    const sway = Math.sin(mane + i * 1.2) * 2.4;
    g.line(x0, y0, x0 + 6 + sway, y0 + 5, i % 2 ? 'K' : 'L', 2);
    g.line(x0 + 6 + sway, y0 + 5, x0 + 4 + sway * 1.6, y0 + 11 + (i % 2) * 2, i % 2 ? 'L' : 'K', 2);
    g.set(x0 + 6 + sway, y0 + 5, 'l');
    g.set(x0 + 4 + sway * 1.6, y0 + 9, 'l');
  }
  // The head: a small round skull, a slim cheek, and a long fine muzzle.
  g.disc(hx + 5, hy - 0.5, 4.8, 4.4, 'T');
  g.disc(hx + 2, hy + 3, 4.2, 3.2, 'T');
  g.line(hx + 1, hy + 3, hx - 7, hy + 7, 'T', 3);
  g.disc(hx - 8, hy + 7.5, 2.2, 2.2, 'T');
  g.line(hx + 1, hy + 6, hx - 7, hy + 9, 't', 1);
  // Nostril, and a fine whisker of weed under the chin.
  g.set(hx - 9, hy + 6, 'k');
  g.set(hx - 8, hy + 6, 'd');
  // The mouth.
  if (mouth) { g.rect(hx - 8, hy + 9, 7, 2, 'r'); g.set(hx - 7, hy + 9, 'E'); g.set(hx - 4, hy + 9, 'E'); }
  else g.line(hx - 9, hy + 9, hx - 3, hy + 7, 'D');
  // A forelock of kelp over the brow, and the ears with weed in them.
  g.line(hx + 6, hy - 5, hx + 11, hy - 3, 'L', 2);
  g.line(hx + 11, hy - 3, hx + 15, hy + 2 + Math.sin(mane) * 1.5, 'K', 2);
  g.line(hx + 5, hy - 4, hx + 6, hy - 8, 'T', 3);
  g.line(hx + 8, hy - 3, hx + 11, hy - 7, 'd', 2);
  g.set(hx + 6, hy - 8, 'L');
  g.set(hx + 11, hy - 8, 'l');
  // The wet sheen: bright streaks along the crest, brow, muzzle and shoulder.
  g.line(bx - 8, by - 7, hx + 9, hy - 2, 's', 1);
  g.line(hx + 3, hy - 4, hx + 7, hy - 4, 'S');
  g.line(hx - 6, hy + 5, hx - 1, hy + 3, 's');
  g.set(hx - 4, hy + 4, 'S');
  g.line(bx - 4, by - 6, bx + 5, by - 7, 's');
  g.set(bx, by - 7, 'S');
  g.set(bx + 6, by - 5, 'S');
  g.set(bx - 10, by - 1, 's');
  g.set(bx - 6, by + 4, 's');
  // The eye: big, lashed.
  const ex = hx + 3;
  const ey = hy - 1;
  if (eye === 'big') { g.disc(ex, ey, 2.4, 2.8, 'e'); g.disc(ex - 0.5, ey + 0.4, 1.4, 1.8, 'k'); g.set(ex - 1, ey - 1, 'E'); g.line(ex - 3, ey - 3, ex + 2, ey - 4, 'k'); g.set(ex - 3, ey - 4, 'k'); }
  else if (eye === 'wide') { g.disc(ex, ey, 3, 3.2, 'e'); g.disc(ex - 0.5, ey, 1.2, 1.6, 'k'); g.line(ex - 3, ey - 4, ex + 3, ey - 4, 'k'); }
  else if (eye === 'x') { g.set(ex - 2, ey - 2, 'k'); g.set(ex + 1, ey - 2, 'k'); g.set(ex - 1, ey - 1, 'k'); g.set(ex, ey - 1, 'k'); g.set(ex - 2, ey, 'k'); g.set(ex + 1, ey, 'k'); }
  else { g.set(ex - 2, ey, 'k'); g.set(ex - 1, ey - 1, 'k'); g.set(ex, ey - 1, 'k'); g.set(ex + 1, ey, 'k'); g.line(ex - 3, ey - 3, ex + 2, ey - 3, 'k'); }
  // Splash of water round the hooves.
  for (let i = 0; i < splash; i++) {
    const sx = 9 + ((i * 11) % 28);
    g.set(sx, floor - 1 - ((i * 3) % 6), i % 2 ? 's' : 'S');
  }
  g.outline('k');
  return g.rows();
}

const FLASH = { T: 'S', t: 'S', d: 's', D: 's', K: 'S', L: 'S', l: 'S' };

export const KELPIE_FOAL_SPRITE = drawFoal({});

export const KELPIE_FOAL_ANIM = {
  chips: ['#3aa890', '#7ab040', '#a8e8f0'],
  idle: clip(4, [0, 1, 2, 3], (i) => drawFoal({ dy: i === 1 || i === 2 ? 1 : 0, mane: i * 1.3, legs: i === 3 ? 'paw' : 'stand', splash: i % 2 ? 2 : 0 })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawFoal({ legs: i < 1 ? 'stand' : 'rear', dy: i > 1 ? 1 : 0, mane: i * 2, eye: 'wide', mouth: i > 1 ? 1 : 0, head: i > 0 ? -3 : 0, splash: i })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawFoal({ dy: i === 1 ? 2 : 0, head: i < 2 ? 3 : 1, eye: 'x', mouth: 1, mane: i, splash: 3, legs: 'stand' });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawFoal({ legs: i > 0 ? 'fold' : 'stand', fold: Math.min(1, i * 0.4), eye: 'x', mouth: 1, mane: i, splash: i }), i >= 3 ? (i - 2) * 0.3 : 0, 17)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawFoal({ mane: i * 1.4, eye: 'glad', head: i % 2 ? 2 : 0, dy: i % 2 ? 1 : 0, splash: 1 })),
};
