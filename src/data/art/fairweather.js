import { Pix, flash, shift, crumble } from './ch5Kit.js';

// MADAM FAIRWEATHER, 64x72: the carved wooden figurehead of the brig Fair Return, a woman with her
// chin lifted and one hand held out ahead of the ship, her hair a run of carved waves streaming
// back. A piece of the Fallen Star came down on the brig a hundred years ago and lodged in her
// breast; it woke her. She laughs. She spins. She is beautiful, and something in it is wrong:
// star-light runs in the cracks of her wood, her gilt crown has turned to little stars, and her
// eyes have no one in them. She faces left (toward you).
//
// Four looks, one per phase (see src/data/enemies/fairweather.js):
//   LAUGH      one arm held out, the head back, the mouth open, a quiet glow
//   SHOWER     both arms raised, a ring of stars over her, the shard bright
//   CAROUSEL   arms wide, hair flying, the whole figure sheared as if turning
//   CHAOS      cracked right through, the top half out of true with the bottom, light in every seam
// Beaten (or spared) she is a figurehead again: still, eyes shut, the star gone out of her breast.
// Drawn from a pose (see ch5Kit.js).
export const FAIRWEATHER_PALETTE = {
  k: '#140c10',
  d: '#2c1a14',
  h: '#8a5a34',
  H: '#5a3624',
  l: '#c8905a',
  L: '#ecc690',
  g: '#e8c060',
  G: '#9a7220',
  s: '#bff4ff',
  S: '#4ab8e0',
  w: '#ffffff',
  m: '#ff9ae0',
  b: '#3a7a98',
  B: '#1e4a66',
  f: '#e8f6f4',
  r: '#c03a48',
};

function draw(pose = {}) {
  const {
    sway = 0, bob = 0, arm = 0, mouth = 'laugh', eyes = 'star', wave = 0, cracks = 1, glow = 1,
    lean = 0, split = 0, dim = false, crown = true,
  } = pose;
  const p = new Pix(64, 72);
  const cx = 34 + sway;
  const top = 4 + bob;

  // Hair: carved waves streaming back (to the right), each lock a rolling curl.
  for (let k = 0; k < 9; k++) {
    const y0 = top + 6 + k * 2.4;
    for (let i = 0; i < 15; i++) {
      const x = cx + 4 + i + Math.sin(wave + i * 0.34 + k * 0.7) * (1 + i * 0.09);
      const y = y0 + Math.sin(wave * 1.3 + i * 0.45 + k) * (1.2 + i * 0.07) + i * 0.32;
      p.set(x, y, k % 3 === 0 ? 'L' : k % 3 === 1 ? 'h' : 'l');
      if (i % 5 === 3) p.set(x, y + 1, 'H');
    }
  }
  // Carved swirls at the tips: a curl of wave.
  for (let k = 0; k < 4; k++) {
    const x = cx + 19 + Math.round(Math.sin(wave + k) * 1);
    const y = top + 12 + k * 6;
    p.ellipse(x, y, 2, 2, 'h');
    p.set(x, y, 'H');
  }

  // The body: a bodice carved as a swell of waves, tapering down to the scroll of the prow.
  p.poly([[cx - 9, top + 24], [cx + 9, top + 24], [cx + 13, top + 42], [cx + 8, top + 58], [cx + 18, top + 64], [cx + 17, top + 68], [cx - 14, top + 66], [cx - 12, top + 44]], 'h');
  p.poly([[cx + 1, top + 25], [cx + 9, top + 25], [cx + 13, top + 42], [cx + 8, top + 58], [cx + 2, top + 56]], 'H', ['h']);
  p.poly([[cx - 9, top + 25], [cx - 5, top + 25], [cx - 6, top + 44], [cx - 12, top + 44]], 'l', ['h']);
  // The gown's rippling carved folds.
  for (let y = 44; y < 66; y += 4) {
    for (let x = -12; x < 14; x++) {
      const yy = top + y + Math.round(Math.sin(x * 0.55 + wave + y) * 1.4);
      p.put(cx + x, yy, y % 8 === 0 ? 'b' : 'H', ['h', 'H']);
    }
  }
  for (let x = -14; x < 18; x += 3) p.set(cx + x, top + 66 + Math.round(Math.sin(wave + x) * 0.8), 'f');
  // A gilt belt of carved shells.
  p.rect(cx - 11, top + 40, 24, 2, 'G');
  for (let x = -10; x < 12; x += 4) p.set(cx + x, top + 40, 'g');

  // Neck and shoulders.
  p.rect(cx - 4, top + 17, 8, 9, 'l');
  p.rect(cx - 4, top + 17, 3, 9, 'L');
  p.ellipse(cx - 9, top + 27, 4, 3, 'l');
  p.ellipse(cx + 9, top + 27, 4, 3, 'h');

  // The arms.
  const hand = (x, y, open = true) => {
    p.ellipse(x, y, 3, 2.6, 'l');
    if (open) for (const dy of [-3, -1, 1, 3]) p.set(x - 4, y + dy, 'l');
    p.set(x - 2, y - 1, 'L');
  };
  if (arm === 0) {
    // One hand held out ahead of the ship: palm up, as if for a coin.
    p.line(cx - 9, top + 27, cx - 28, top + 22, 'k', 5);
    p.line(cx - 9, top + 27, cx - 28, top + 22, 'l', 3);
    hand(cx - 31, top + 21);
    p.line(cx + 9, top + 27, cx + 13, top + 38, 'h', 3);
  } else if (arm === 1) {
    // Both arms up, the hands open to the sky.
    p.line(cx - 9, top + 27, cx - 24, top + 10, 'k', 5);
    p.line(cx - 9, top + 27, cx - 24, top + 10, 'l', 3);
    p.line(cx + 9, top + 27, cx + 21, top + 8, 'k', 5);
    p.line(cx + 9, top + 27, cx + 21, top + 8, 'h', 3);
    hand(cx - 27, top + 8);
    hand(cx + 23, top + 6);
  } else {
    // Arms flung wide, the whole of her turning.
    p.line(cx - 9, top + 27, cx - 30, top + 26, 'k', 5);
    p.line(cx - 9, top + 27, cx - 30, top + 26, 'l', 3);
    p.line(cx + 9, top + 27, cx + 25, top + 30, 'k', 5);
    p.line(cx + 9, top + 27, cx + 25, top + 30, 'h', 3);
    hand(cx - 33, top + 26);
    hand(cx + 28, top + 30, false);
  }

  // The head: chin lifted, a little turned toward you.
  p.ellipse(cx - 2, top + 11, 8, 9, 'l');
  p.ellipse(cx + 2, top + 12, 5, 7, 'h', ['l']);
  p.ellipse(cx - 5, top + 9, 3, 4, 'L', ['l']);
  p.set(cx - 7, top + 13, 'L');
  // Brows, high and glad; a small carved nose.
  p.line(cx - 8, top + 6, cx - 4, top + 5, 'H');
  p.line(cx - 1, top + 5, cx + 3, top + 6, 'H');
  p.set(cx - 9, top + 12, 'H');
  p.set(cx - 9, top + 13, 'H');
  // Eyes.
  if (eyes === 'closed') {
    p.line(cx - 7, top + 8, cx - 4, top + 8, 'd');
    p.line(cx - 1, top + 8, cx + 2, top + 8, 'd');
  } else {
    for (const ex of [-6, 0]) {
      p.rect(cx + ex - 1, top + 7, 3, 3, eyes === 'flare' ? 'w' : 's');
      p.set(cx + ex, top + 8, 'w');
      p.set(cx + ex - 2, top + 8, 'S');
      p.set(cx + ex + 2, top + 8, 'S');
    }
  }
  // Mouth.
  if (mouth === 'laugh') {
    p.ellipse(cx - 4, top + 15, 3, 2, 'd');
    p.line(cx - 6, top + 14, cx - 2, top + 14, 'w');
    p.set(cx - 4, top + 16, 'r');
  } else if (mouth === 'wide') {
    p.ellipse(cx - 4, top + 15, 4, 3, 'd');
    p.line(cx - 7, top + 13, cx - 1, top + 13, 'w');
    p.rect(cx - 5, top + 16, 3, 1, 'r');
  } else if (mouth === 'smile') {
    p.line(cx - 7, top + 14, cx - 5, top + 16, 'd');
    p.line(cx - 5, top + 16, cx - 2, top + 15, 'd');
  } else {
    p.line(cx - 7, top + 15, cx - 2, top + 15, 'd');
  }
  // The crown: gilt, a row of little stars; one has come loose and floats.
  if (crown) {
    for (const [dx, dy] of [[-7, -1], [-3, -3], [1, -3], [5, -1]]) {
      p.set(cx + dx, top + dy, dim ? 'G' : 'g');
      p.set(cx + dx, top + dy - 1, dim ? 'G' : 'w');
      p.set(cx + dx - 1, top + dy, dim ? 'G' : 'g');
      p.set(cx + dx + 1, top + dy, dim ? 'G' : 'g');
    }
    p.rect(cx - 8, top + 1, 14, 2, 'G');
  }

  // The star in her breast: a crystal driven into the wood, its cracks running out through the grain.
  const hot = dim ? 'H' : 's';
  const core = dim ? 'd' : 'w';
  p.poly([[cx - 2, top + 28], [cx + 2, top + 32], [cx + 1, top + 40], [cx - 3, top + 37], [cx - 4, top + 31]], hot);
  p.line(cx - 1, top + 29, cx, top + 38, core);
  if (!dim) {
    p.set(cx - 3, top + 31, 'S');
    p.set(cx + 1, top + 36, 'S');
  }
  const crack = (pts) => {
    for (let i = 0; i + 1 < pts.length; i++) p.line(cx + pts[i][0], top + pts[i][1], cx + pts[i + 1][0], top + pts[i + 1][1], dim ? 'd' : (glow > 1.4 ? 'm' : 's'));
  };
  if (cracks >= 1) {
    crack([[-4, 33], [-8, 36], [-10, 41]]);
    crack([[2, 36], [6, 42], [5, 48]]);
  }
  if (cracks >= 2) {
    crack([[-2, 28], [-6, 22], [-5, 18]]);
    crack([[1, 30], [7, 28], [10, 26]]);
    crack([[0, 40], [-2, 48], [-6, 55]]);
  }
  if (cracks >= 3) {
    crack([[-9, 14], [-5, 10], [-6, 5]]);
    crack([[6, 44], [10, 52], [8, 60]]);
    crack([[-8, 44], [-10, 52], [-4, 60]]);
    crack([[4, 18], [3, 12], [6, 8]]);
  }
  // The glow: a dither of star-light round the star and out along the cracks.
  if (glow > 0 && !dim) {
    const near = (x, y, r) => {
      for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (p.get(x + i, y + j) === 's' || p.get(x + i, y + j) === 'm') return true;
      return false;
    };
    const halo = [];
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
      if (p.get(x, y) === '.' || p.get(x, y) === 'k') continue;
      if (['h', 'H', 'l', 'L'].includes(p.get(x, y)) && near(x, y, glow > 1.4 ? 2 : 1) && (x + y) % 2 === 0) halo.push([x, y, 'f']);
    }
    for (const [x, y, c] of halo) p.set(x, y, c);
  }
  p.outline('k');
  let rows = p.rows();
  if (lean) rows = rows.map((row, y) => {
    const dx = Math.round(lean * ((y - 36) / 36));
    return dx === 0 ? row : shift([row], dx, 0)[0];
  });
  if (split) {
    // The top half out of true with the bottom, as if it had turned further than the rest.
    rows = rows.map((row, y) => (y < 34 ? shift([row], split, 0)[0] : row));
  }
  return rows;
}

// LAUGH
const LAUGH = [
  draw({ sway: 0, wave: 0, bob: 0 }),
  draw({ sway: 1, wave: 0.9, bob: -1, mouth: 'wide' }),
  draw({ sway: 0, wave: 1.8, bob: 0 }),
  draw({ sway: -1, wave: 2.7, bob: -1, mouth: 'wide' }),
];
export const FAIRWEATHER_SPRITE = LAUGH[0];

export const FAIRWEATHER_ANIM = {
  chips: ['#8a5a34', '#c8905a', '#bff4ff', '#e8c060'],
  idle: { fps: 4, frames: LAUGH },
  windup: {
    fps: 8,
    frames: [
      draw({ arm: 1, mouth: 'wide', eyes: 'flare', wave: 1, glow: 1.5 }),
      draw({ arm: 1, mouth: 'wide', eyes: 'flare', wave: 2, bob: -1, glow: 1.8 }),
      draw({ arm: 1, mouth: 'wide', eyes: 'flare', wave: 3, bob: -2, glow: 1.8 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ eyes: 'closed', mouth: 'wide', lean: 4 }), 2, 0)),
      shift(draw({ eyes: 'closed', mouth: 'wide', sway: -1, wave: 1.5, lean: 3 }), 2, 0),
      shift(draw({ wave: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ eyes: 'star', mouth: 'smile', lean: 3, wave: 1, glow: 0.6 }),
      draw({ eyes: 'closed', mouth: 'smile', lean: 4, wave: 2, glow: 0.2, cracks: 2 }),
      draw({ eyes: 'closed', mouth: 'smile', wave: 3, dim: true, cracks: 2, glow: 0 }),
    ],
    holds: [2, 2, 5],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ eyes: 'star', mouth: 'smile', glow: 0.6, wave: 0 }),
      draw({ eyes: 'closed', mouth: 'smile', glow: 0.2, wave: 1, bob: -1 }),
      draw({ eyes: 'closed', mouth: 'smile', dim: true, cracks: 1, glow: 0, wave: 2 }),
    ],
    holds: [2, 2, 5],
  },
  intro: {
    fps: 5,
    frames: [
      flash(draw({ arm: 1, mouth: 'wide', eyes: 'flare', glow: 1.8 })),
      draw({ arm: 1, mouth: 'wide', eyes: 'flare', wave: 1, glow: 1.5 }),
      draw({ arm: 0, mouth: 'laugh', wave: 2 }),
    ],
  },
};

// STAR SHOWER: both arms up, the shard bright, the wood split along the grain.
const SHOWER = [
  draw({ arm: 1, cracks: 2, glow: 1.4, wave: 0, mouth: 'wide' }),
  draw({ arm: 1, cracks: 2, glow: 1.6, wave: 1, bob: -1, mouth: 'laugh' }),
  draw({ arm: 1, cracks: 2, glow: 1.4, wave: 2, mouth: 'wide', sway: 1 }),
  draw({ arm: 1, cracks: 2, glow: 1.7, wave: 3, bob: -1, mouth: 'laugh', sway: -1 }),
];
export const FAIRWEATHER_SHOWER_SPRITE = SHOWER[0];
export const FAIRWEATHER_SHOWER_ANIM = {
  chips: FAIRWEATHER_ANIM.chips,
  idle: { fps: 5, frames: SHOWER },
  windup: FAIRWEATHER_ANIM.windup,
  hurt: FAIRWEATHER_ANIM.hurt,
  death: FAIRWEATHER_ANIM.death,
  spared: FAIRWEATHER_ANIM.spared,
  intro: {
    fps: 6,
    frames: [
      flash(draw({ arm: 1, cracks: 2, glow: 1.8, mouth: 'wide', eyes: 'flare' })),
      draw({ arm: 1, cracks: 2, glow: 1.6, mouth: 'wide', wave: 1 }),
      draw({ arm: 1, cracks: 2, glow: 1.4, mouth: 'laugh', wave: 2 }),
    ],
  },
};

// CAROUSEL: arms wide, hair flying, and the picture sheared left and right as she turns.
const CAROUSEL = [
  draw({ arm: 2, cracks: 2, glow: 1.4, wave: 0, mouth: 'wide', lean: -4 }),
  draw({ arm: 2, cracks: 2, glow: 1.4, wave: 1.2, mouth: 'laugh', lean: 0, bob: -1 }),
  draw({ arm: 2, cracks: 2, glow: 1.4, wave: 2.4, mouth: 'wide', lean: 4 }),
  draw({ arm: 2, cracks: 2, glow: 1.4, wave: 3.6, mouth: 'laugh', lean: 0, bob: -1 }),
];
export const FAIRWEATHER_CAROUSEL_SPRITE = CAROUSEL[0];
export const FAIRWEATHER_CAROUSEL_ANIM = {
  chips: FAIRWEATHER_ANIM.chips,
  idle: { fps: 7, frames: CAROUSEL },
  windup: {
    fps: 9,
    frames: [
      draw({ arm: 2, cracks: 2, glow: 1.8, mouth: 'wide', eyes: 'flare', lean: -6, wave: 1 }),
      draw({ arm: 2, cracks: 2, glow: 1.8, mouth: 'wide', eyes: 'flare', lean: 0, wave: 2, bob: -2 }),
      draw({ arm: 2, cracks: 2, glow: 1.8, mouth: 'wide', eyes: 'flare', lean: 6, wave: 3 }),
    ],
  },
  hurt: FAIRWEATHER_ANIM.hurt,
  death: FAIRWEATHER_ANIM.death,
  spared: FAIRWEATHER_ANIM.spared,
  intro: {
    fps: 8,
    frames: [
      flash(draw({ arm: 2, cracks: 2, glow: 1.8, mouth: 'wide', lean: -6 })),
      draw({ arm: 2, cracks: 2, glow: 1.6, mouth: 'wide', lean: 6, wave: 1 }),
      draw({ arm: 2, cracks: 2, glow: 1.4, mouth: 'laugh', lean: -3, wave: 2 }),
      draw({ arm: 2, cracks: 2, glow: 1.4, mouth: 'laugh', lean: 3, wave: 3 }),
    ],
  },
};

// CHAOS: cracked through, the top half out of true, light in every seam, pink where it is too bright.
const CHAOS = [
  draw({ arm: 2, cracks: 3, glow: 2, split: 2, wave: 0, mouth: 'wide', eyes: 'flare', lean: -2 }),
  draw({ arm: 1, cracks: 3, glow: 2, split: -2, wave: 1.5, mouth: 'laugh', eyes: 'flare', bob: -1 }),
  draw({ arm: 2, cracks: 3, glow: 2, split: 3, wave: 3, mouth: 'wide', eyes: 'flare', lean: 2 }),
  draw({ arm: 0, cracks: 3, glow: 2, split: -3, wave: 4.5, mouth: 'laugh', eyes: 'flare', bob: -1 }),
];
export const FAIRWEATHER_CHAOS_SPRITE = CHAOS[0];
export const FAIRWEATHER_CHAOS_ANIM = {
  chips: FAIRWEATHER_ANIM.chips,
  idle: { fps: 9, frames: CHAOS },
  windup: {
    fps: 10,
    frames: [
      draw({ arm: 1, cracks: 3, glow: 2, split: 3, mouth: 'wide', eyes: 'flare', wave: 1 }),
      draw({ arm: 2, cracks: 3, glow: 2, split: -3, mouth: 'wide', eyes: 'flare', wave: 2, bob: -2 }),
      draw({ arm: 1, cracks: 3, glow: 2, split: 4, mouth: 'wide', eyes: 'flare', wave: 3, bob: -2 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ eyes: 'closed', mouth: 'wide', cracks: 3, split: 3, lean: 4 }), 2, 0)),
      shift(draw({ eyes: 'closed', mouth: 'wide', cracks: 3, split: -3, lean: 3 }), 2, 0),
      shift(draw({ cracks: 3, split: 2, wave: 2, eyes: 'flare' }), 1, 0),
    ],
  },
  death: FAIRWEATHER_ANIM.death,
  spared: FAIRWEATHER_ANIM.spared,
  intro: {
    fps: 6,
    frames: [
      flash(draw({ arm: 2, cracks: 3, glow: 2, split: 4, mouth: 'wide', eyes: 'flare' })),
      draw({ arm: 1, cracks: 3, glow: 2, split: -3, mouth: 'wide', eyes: 'flare', wave: 1 }),
      draw({ arm: 2, cracks: 3, glow: 2, split: 2, mouth: 'laugh', eyes: 'flare', wave: 2 }),
    ],
  },
};

// Beaten (or spared): a figurehead again, eyes shut, the star gone out. The room's scene finishes it.
export const FAIRWEATHER_DEATH_LAST = draw({ eyes: 'closed', mouth: 'smile', dim: true, cracks: 2, glow: 0, wave: 3, lean: 2 });
void crumble;
