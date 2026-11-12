import { Pix, flash, shift, crumble } from './ch5Kit.js';

// QUIRE, 60x68: the Dead City's Welcome Register, woken by the splinter of
// the Fallen Star that came down through the old street. The city's clerks
// kept one great ledger of everybody who had promised to be present when the
// Hero came, and counted it every night. The star got into the binding. Now
// it counts by itself and it will not stop: a hunched thing made of ledgers,
// loose pages and ink, an open book for a face with two round spectacles lit
// star-blue, a red ribbon bookmark for a tongue, a rubber stamp in one hand
// and a long quill in the other, and a splinter of star in its chest, cracks
// of light running out of it.
//
// It is drawn from a pose (see src/data/art/ch5Kit.js), like Chapter 5's
// monsters: bob (px it bobs), flutter (0..3 the loose pages), eyes ('open' |
// 'squint' | 'happy' | 'wide' | 'dead'), stamp and quill (px each arm lifts),
// glow (0..2 the star's light), mouth ('line' | 'open' | 'smile'), lean (px the
// whole of it shifts).
export const TALLY_PALETTE = {
  k: '#13101c', // outline
  l: '#6e2a3c', // leather
  L: '#a04a5e', // leather, lit
  d: '#3e1824', // leather, shade
  p: '#eadfbb', // parchment
  P: '#bfae84', // parchment, shade
  q: '#8a7a56', // old page edge
  i: '#1c2446', // ink
  I: '#44559a', // ink, lit
  g: '#e8c060', // gold
  G: '#9a7220', // gold, shade
  s: '#c4f6ff', // star
  S: '#4ab8e0', // star, deep
  w: '#ffffff',
  r: '#c83a4a', // the ribbon bookmark
  R: '#8a1c2c',
  t: '#f4ecd8', // the quill's feather
  T: '#c8bca0',
};

function draw(pose = {}) {
  const { bob = 0, flutter = 0, eyes = 'open', stamp = 0, quill = 0, glow = 1, mouth = 'line', lean = 0, droop = 0 } = pose;
  const p = new Pix(60, 68);
  const cx = 29 + lean;
  const by = bob;

  // The gown of loose pages it trails along the floor: ragged, a little different each flutter.
  for (let i = 0; i < 9; i++) {
    const x = cx - 18 + i * 4.5;
    const len = 13 + ((i * 5 + flutter * 3) % 6);
    p.poly([[x, 46 + by], [x + 5, 46 + by], [x + 4 + ((i + flutter) % 2), 46 + len + by], [x - 1, 45 + len + by]], i % 2 ? 'P' : 'p');
    p.line(x + 1, 49 + by, x + 3, 49 + by, 'q');
    p.line(x + 1, 53 + by, x + 2, 53 + by, 'q');
  }

  // The stack of ledgers it sits on: three, crooked, spines out.
  const books = [
    [cx - 17, 52 + by, 34, 7, 'l', 'L'],
    [cx - 14, 46 + by, 30, 7, 'd', 'l'],
    [cx - 15, 40 + by, 28, 7, 'l', 'L'],
  ];
  for (const [x, y, w, h, a, b] of books) {
    p.rect(x, y, w, h, a);
    p.rect(x, y, w, 1, b);
    p.rect(x + 3, y + 1, 1, h - 2, 'g');
    p.rect(x + w - 5, y + 1, 1, h - 2, 'g');
    p.rect(x + 7, y + 2, w - 15, 3, 'p');
    p.rect(x + 7, y + 5, w - 15, 1, 'P');
  }

  // The upright ledger it wears as a body, a clasp of gold across it.
  const bx = cx - 11;
  const bt = 22 + by + droop;
  p.rect(bx, bt, 22, 20, 'l');
  p.rect(bx + 1, bt + 1, 20, 18, 'L');
  p.rect(bx + 2, bt + 2, 18, 16, 'l');
  p.rect(bx, bt, 22, 1, 'g');
  p.rect(bx, bt + 19, 22, 1, 'g');
  p.rect(bx + 10, bt + 1, 2, 18, 'G');
  // The splinter of star in its chest, and the cracks of light going out of it.
  const sx = cx;
  const sy = bt + 10;
  const star = ['S', 's', 'w'][Math.min(2, glow + 1)];
  for (const [dx, dy, len] of [[-1, -1, 7], [1, -1, 6], [-1, 1, 6], [1, 1, 7], [0, -1, 5], [-1, 0, 8], [1, 0, 7]]) {
    p.line(sx, sy, sx + dx * len, sy + dy * len * 0.9, glow > 0 ? 'S' : 'I');
  }
  p.poly([[sx, sy - 6], [sx + 3, sy], [sx, sy + 6], [sx - 3, sy]], star);
  p.poly([[sx, sy - 3], [sx + 1, sy], [sx, sy + 3], [sx - 1, sy]], 'w');

  // Its arms: long, black as ink, a hand at the end of each. Left, the stamp.
  const lax = bx - 1;
  const lay = bt + 6;
  const lhx = lax - 9;
  const lhy = lay + 8 - stamp;
  p.line(lax, lay, lhx, lhy, 'i', 2);
  p.line(lax, lay, lhx, lhy, 'I');
  p.rect(lhx - 1, lhy - 7, 3, 7, 'g');
  p.rect(lhx - 5, lhy, 11, 7, 'r');
  p.rect(lhx - 5, lhy + 5, 11, 2, 'R');
  p.rect(lhx - 4, lhy + 1, 9, 1, 'L');
  // Right, the quill: a long feather, and the nib dripping.
  const rax = bx + 22;
  const ray = bt + 6;
  const rhx = rax + 8;
  const rhy = ray + 6 - quill;
  p.line(rax, ray, rhx, rhy, 'i', 2);
  p.line(rax, ray, rhx, rhy, 'I');
  p.line(rhx, rhy, rhx + 6, rhy - 20, 'T', 1);
  p.poly([[rhx + 1, rhy - 8], [rhx + 11, rhy - 20], [rhx + 6, rhy - 28], [rhx + 3, rhy - 22]], 't');
  p.line(rhx + 2, rhy - 9, rhx + 8, rhy - 25, 'T');
  p.line(rhx, rhy, rhx - 1, rhy + 3, 'i');
  if (glow > 0) p.set(rhx - 1, rhy + 5, 'I');

  // Its head: a great book lying open, a page for each cheek. Loose pages fan out of the top of it.
  const hx = cx;
  const hy = 14 + by + droop;
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.34 + (flutter % 2 ? 0.05 : -0.04) * (i - 3);
    const len = 11 + ((i * 3 + flutter) % 4);
    const ex = hx + Math.cos(a) * len;
    const ey = hy - 5 + Math.sin(a) * len;
    p.poly([[hx - 2 + (i - 3) * 2, hy - 5], [hx + 2 + (i - 3) * 2, hy - 5], [ex + 2, ey], [ex - 2, ey]], i % 2 ? 'p' : 'P');
  }
  p.ellipse(hx - 7, hy + 1, 8, 8, 'p');
  p.ellipse(hx + 7, hy + 1, 8, 8, 'p');
  p.ellipse(hx - 7, hy + 3, 8, 6, 'P', 'p');
  p.rect(hx - 1, hy - 6, 2, 16, 'q');
  p.rect(hx - 16, hy + 6, 32, 3, 'l');
  p.rect(hx - 16, hy + 6, 32, 1, 'L');
  // Printed lines of tiny writing on the pages, like a face of text.
  for (const dy of [-5, -3]) {
    p.line(hx - 14, hy + dy, hx - 9, hy + dy, 'q');
    p.line(hx + 9, hy + dy, hx + 14, hy + dy, 'q');
  }
  // Round spectacles on a gold bridge, lit from inside.
  const lens = eyes === 'dead' ? 'q' : eyes === 'wide' ? 'w' : 's';
  for (const side of [-1, 1]) {
    const lx = hx + side * 7;
    p.ellipse(lx, hy, 5, 5, 'g');
    p.ellipse(lx, hy, 4, 4, lens);
    if (eyes === 'open' || eyes === 'wide') {
      p.ellipse(lx + side * -0.5, hy, 2, 2, 'S');
      p.set(lx - 1, hy - 1, 'w');
    } else if (eyes === 'squint') {
      p.rect(lx - 4, hy - 4, 9, 4, 'p');
      p.line(lx - 3, hy, lx + 3, hy, 'i');
    } else if (eyes === 'happy') {
      p.rect(lx - 4, hy, 9, 5, 'p');
      p.line(lx - 3, hy - 1, lx - 1, hy - 3, 'i');
      p.line(lx - 1, hy - 3, lx + 1, hy - 3, 'i');
      p.line(lx + 1, hy - 3, lx + 3, hy - 1, 'i');
    } else if (eyes === 'dead') {
      p.line(lx - 2, hy - 2, lx + 2, hy + 2, 'i');
      p.line(lx + 2, hy - 2, lx - 2, hy + 2, 'i');
    }
  }
  p.line(hx - 2, hy - 1, hx + 2, hy - 1, 'g');
  // Its mouth, and the ribbon bookmark hanging out of it.
  if (mouth === 'open') {
    p.ellipse(hx, hy + 11, 5, 3, 'i');
    p.rect(hx - 1, hy + 10, 3, 9, 'r');
    p.rect(hx - 1, hy + 18, 3, 2, 'R');
  } else if (mouth === 'smile') {
    p.line(hx - 5, hy + 9, hx - 2, hy + 11, 'i');
    p.line(hx - 2, hy + 11, hx + 2, hy + 11, 'i');
    p.line(hx + 2, hy + 11, hx + 5, hy + 9, 'i');
    p.rect(hx, hy + 11, 2, 5, 'r');
  } else {
    p.line(hx - 5, hy + 10, hx + 5, hy + 10, 'i');
    p.rect(hx + 1, hy + 10, 2, 7, 'r');
    p.rect(hx + 1, hy + 16, 2, 2, 'R');
  }
  // Pages that have come loose and hang about it.
  const drift = [[3, 20], [55, 30], [6, 44], [54, 52], [10, 6]];
  drift.forEach(([x, y], i) => {
    const o = (flutter + i) % 4;
    p.poly([[x, y - o], [x + 5, y - o + 1], [x + 4, y - o + 6], [x - 1, y - o + 5]], i % 2 ? 'p' : 'P');
    p.line(x + 1, y - o + 2, x + 3, y - o + 2, 'q');
  });
  return p.outline('k').rows();
}

const IDLE = [
  draw({ bob: 0, flutter: 0, glow: 1 }),
  draw({ bob: 1, flutter: 1, glow: 2 }),
  draw({ bob: 1, flutter: 2, glow: 1, eyes: 'wide' }),
  draw({ bob: 0, flutter: 3, glow: 0 }),
];

export const TALLY_SPRITE = IDLE[0];
// The loose pages going everywhere, the whole of it flung about (its last phase).
export const TALLY_CHAOS_SPRITE = draw({ bob: 0, flutter: 2, glow: 2, eyes: 'wide', mouth: 'open', stamp: 2, quill: 3 });

const chaosIdle = [
  draw({ bob: 0, flutter: 0, glow: 2, eyes: 'wide', mouth: 'open', stamp: 3, quill: 1 }),
  draw({ bob: 2, flutter: 1, glow: 1, eyes: 'wide', mouth: 'open', stamp: 0, quill: 4, lean: 1 }),
  draw({ bob: 1, flutter: 2, glow: 2, eyes: 'wide', mouth: 'open', stamp: 4, quill: 0, lean: -1 }),
  draw({ bob: 0, flutter: 3, glow: 0, eyes: 'wide', mouth: 'open', stamp: 1, quill: 3 }),
];

function anim(idle, extra = {}) {
  return {
    chips: ['#eadfbb', '#bfae84', '#6e2a3c', '#c4f6ff', '#1c2446'],
    idle: { fps: 4, frames: idle },
    windup: {
      fps: 8,
      frames: [
        draw({ stamp: 3, quill: 3, eyes: 'squint', bob: 1 }),
        draw({ stamp: 7, quill: 7, eyes: 'wide', glow: 2, mouth: 'open' }),
        draw({ stamp: 8, quill: 8, eyes: 'wide', glow: 2, mouth: 'open', flutter: 2 }),
      ],
    },
    hurt: {
      fps: 10,
      frames: [
        flash(shift(draw({ eyes: 'squint', droop: 2, glow: 2 }), 2, 0)),
        shift(draw({ eyes: 'squint', droop: 2, flutter: 3 }), 2, 0),
        shift(draw({ eyes: 'squint', droop: 1, flutter: 1 }), 1, 0),
      ],
    },
    death: {
      fps: 4,
      frames: [
        draw({ eyes: 'squint', droop: 2, glow: 2, flutter: 2 }),
        crumble(draw({ eyes: 'dead', droop: 3, glow: 2, flutter: 3 }), 0.2),
        crumble(draw({ eyes: 'dead', droop: 4, glow: 1, flutter: 1 }), 0.45),
        crumble(draw({ eyes: 'dead', droop: 5, glow: 0, flutter: 2 }), 0.7),
        crumble(draw({ eyes: 'dead', droop: 5, glow: 0, flutter: 0 }), 0.92),
      ],
    },
    spared: {
      fps: 3,
      frames: [
        draw({ eyes: 'happy', mouth: 'smile', glow: 1, bob: 1, flutter: 1 }),
        draw({ eyes: 'happy', mouth: 'smile', glow: 2, bob: 0, flutter: 2, quill: 3 }),
        draw({ eyes: 'happy', mouth: 'smile', glow: 1, bob: 1, flutter: 3, stamp: 3 }),
        draw({ eyes: 'happy', mouth: 'smile', glow: 2, bob: 0, flutter: 0 }),
      ],
    },
    ...extra,
  };
}

export const TALLY_ANIM = anim(IDLE);
export const TALLY_CHAOS_ANIM = anim(chaosIdle);
