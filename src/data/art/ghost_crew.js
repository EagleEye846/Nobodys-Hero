import { Pix, flash, shift, crumble } from './ch5Kit.js';

// THE FAIR RETURN'S CREW: two of the ghosts still aboard.
//
// DECKHAND, 34x44: a boy of sixteen or so in a striped jersey and a knitted
// cap, bare feet that fade into mist, a swab over one shoulder and, in the other
// hand, held out toward you, a sealed letter with a red wax seal. He has been
// meaning to post it for a hundred years. His face is blank and kind, and he
// hums. Faces left. Clips: sway, the letter held out, a mop swing, hit, beaten
// (he sets the letter down as he goes), spared (he gives you the letter).
//
// POWDER MONKEY, 32x40: the gunner's boy, a child of ten or eleven in a coat
// cut for a man, a gunner's cap over his eyes, a smoking slow-match in one fist
// (its tip still glowing) and a round shot hugged to his chest. Singed at the
// edges. He crouches ready to run, and he is waiting for someone to say fire,
// so he can stop waiting. Faces left. Clips: bob, match swung up, hit, beaten,
// spared (he puts the match out on his boot and sits down).
export const DECKHAND_PALETTE = {
  k: '#14212a',
  b: '#7aa8b4',
  B: '#456e7e',
  w: '#e4f2ee',
  W: '#a4c4c4',
  e: '#f4ffff',
  E: '#9ae4d8',
  r: '#d8d0b4',
  R: '#8c8468',
  j: '#c8cccc',
  J: '#5a6c78',
  c: '#4a627c',
  C: '#7890a8',
  m: '#b04a3a',
  M: '#6a2a26',
  y: '#b49c68',
  Y: '#74603a',
  g: '#a8bcb4',
  G: '#6c8680',
};

function deckhand(pose = {}) {
  const { sway = 0, bob = 0, letter = 0, mop = 0, eyes = 'glow', wave = 0, hum = false } = pose;
  const p = new Pix(38, 46);
  const cx = 17 + sway;
  const top = 8 + bob;

  // Mist where the legs should be.
  for (let i = -6; i <= 6; i += 2) {
    const len = 9 + ((i * 3 + 18) % 5);
    for (let y = 0; y < len; y++) {
      p.set(cx + i + Math.sin(wave + i * 0.7 + y * 0.45) * (0.5 + y * 0.18), top + 27 + y, y > len - 3 ? 'g' : y > 3 ? 'W' : 'B');
    }
  }
  // Bare feet, barely there.
  p.rect(cx - 5, top + 27, 3, 3, 'w');
  p.rect(cx + 2, top + 27, 3, 3, 'w');
  // The jersey: horizontal stripes, a little too big.
  p.poly([[cx - 7, top + 8], [cx + 7, top + 8], [cx + 8, top + 18], [cx + 6, top + 27], [cx - 6, top + 27], [cx - 8, top + 18]], 'k');
  p.poly([[cx - 6, top + 9], [cx + 6, top + 9], [cx + 7, top + 18], [cx + 5, top + 26], [cx - 5, top + 26], [cx - 7, top + 18]], 'j');
  for (let y = top + 11; y < top + 26; y += 4) p.rect(cx - 7, y, 15, 2, 'c', ['j']);
  // Trousers' ragged hems end at the mist.
  p.rect(cx - 5, top + 24, 4, 4, 'J');
  p.rect(cx + 1, top + 24, 4, 4, 'J');

  // The swab: over the shoulder (idle) or swung (mop).
  const swabAngle = mop ? -0.9 + mop * 1.1 : -0.2;
  const sx0 = cx - 7;
  const sy0 = top + 12;
  const sx1 = sx0 - Math.sin(swabAngle) * 22 - 6;
  const sy1 = sy0 - Math.cos(swabAngle) * 22 + 12;
  p.line(sx0 + 2, sy0 + 6, sx1, sy1, 'Y', 2);
  p.line(sx0 + 2, sy0 + 6, sx1, sy1, 'y');
  for (let i = -3; i <= 3; i++) p.line(sx1 + i, sy1, sx1 + i * 1.4 - 1, sy1 + 6, i % 2 ? 'r' : 'R');

  // The letter arm (his right, nearer us on our left): held out, palm up.
  const lx = cx - 11 - letter * 4;
  const ly = top + 17 - letter * 3;
  p.line(cx - 6, top + 11, lx, ly, 'k', 4);
  p.line(cx - 6, top + 11, lx, ly, 'j', 2);
  p.ellipse(lx, ly, 2, 2, 'k');
  p.ellipse(lx, ly, 1.3, 1.3, 'w');
  // The sealed letter: cream paper, a red seal.
  p.rect(lx - 5, ly - 4, 8, 6, 'k');
  p.rect(lx - 4, ly - 3, 6, 4, 'r');
  p.line(lx - 4, ly - 3, lx + 1, ly - 3, 'w');
  p.set(lx - 1, ly - 1, 'm');
  p.set(lx - 2, ly - 1, 'M');
  p.set(lx - 4, ly, 'R');
  // The other arm, hanging.
  p.line(cx + 6, top + 11, cx + 9, top + 22, 'k', 4);
  p.line(cx + 6, top + 11, cx + 9, top + 22, 'j', 2);
  p.ellipse(cx + 9, top + 23, 2, 2, 'k');
  p.ellipse(cx + 9, top + 23, 1.2, 1.2, 'w');

  // The head: young, blank, a little translucent. A knitted cap.
  const hy = top + 3;
  p.ellipse(cx, hy, 6, 5.4, 'k');
  p.ellipse(cx, hy, 5, 4.5, 'w');
  p.ellipse(cx + 1, hy + 1, 4, 3, 'W', ['w']);
  for (const ex of [cx - 4, cx + 1]) {
    if (eyes === 'closed') p.rect(ex, hy, 3, 1, 'k');
    else if (eyes === 'happy') { p.set(ex, hy + 1, 'e'); p.set(ex + 1, hy, 'e'); p.set(ex + 2, hy + 1, 'e'); }
    else if (eyes === 'dead') { p.set(ex, hy - 1, 'E'); p.set(ex + 2, hy + 1, 'E'); p.set(ex + 2, hy - 1, 'E'); p.set(ex, hy + 1, 'E'); }
    else { p.rect(ex, hy - 1, 3, 3, 'e'); p.set(ex + 1, hy, 'E'); }
  }
  p.rect(cx - 2, hy + 3, hum ? 3 : 4, 1, hum ? 'B' : 'W');
  // The cap: a deep knitted bobble hat, a hole worn at the crown.
  p.ellipse(cx, hy - 4, 6.4, 3.6, 'k');
  p.ellipse(cx, hy - 4, 5.6, 2.9, 'm');
  for (let x = cx - 5; x <= cx + 5; x += 2) p.set(x, hy - 4, 'M');
  p.rect(cx - 6, hy - 1, 13, 2, 'M');
  p.ellipse(cx + 1, hy - 8, 2, 2, 'k');
  p.ellipse(cx + 1, hy - 8, 1.2, 1.2, 'm');
  // A thread of hum: notes drifting up.
  if (hum) { p.set(cx + 9, hy - 6, 'E'); p.set(cx + 10, hy - 7, 'E'); p.set(cx + 12, hy - 10, 'e'); }
  return p.outline('k').rows();
}

const DECK_IDLE = [
  deckhand({ sway: -1, wave: 0, bob: 0 }),
  deckhand({ sway: 0, wave: 0.9, bob: -1, hum: true }),
  deckhand({ sway: 1, wave: 1.8, bob: 0, letter: 0.4 }),
  deckhand({ sway: 0, wave: 2.7, bob: -1, eyes: 'closed' }),
];
export const GHOST_DECKHAND_SPRITE = DECK_IDLE[0];
export const GHOST_DECKHAND_ANIM = {
  chips: ['#7aa8b4', '#e4f2ee', '#b04a3a', '#d8d0b4'],
  idle: { fps: 3, frames: DECK_IDLE, holds: [2, 2, 1, 1] },
  windup: {
    fps: 7,
    frames: [
      deckhand({ mop: 0.3, sway: 1, wave: 1, eyes: 'glow', letter: 0.5 }),
      deckhand({ mop: 0.7, sway: 2, wave: 2, eyes: 'glow', bob: -1, letter: 0.8 }),
      deckhand({ mop: 1, sway: 2, wave: 3, bob: -1, letter: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(deckhand({ eyes: 'closed', letter: 0.3 }), 2, 0)),
      shift(deckhand({ eyes: 'closed', sway: -1, wave: 1.5 }), 2, 0),
      shift(deckhand({ wave: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      deckhand({ eyes: 'happy', letter: 1, sway: 1, wave: 1 }),
      crumble(deckhand({ eyes: 'happy', letter: 1, sway: 1, wave: 2, bob: 2 }), 0.35, true),
      crumble(deckhand({ eyes: 'closed', letter: 1, sway: 1, wave: 3, bob: 4 }), 0.7, true),
      crumble(deckhand({ eyes: 'closed', letter: 1, sway: 1, wave: 4, bob: 6 }), 1, true),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      deckhand({ eyes: 'happy', letter: 1, wave: 0 }),
      deckhand({ eyes: 'happy', letter: 1.2, wave: 1, bob: -1, hum: true }),
      deckhand({ eyes: 'closed', letter: 1.2, wave: 2, hum: true }),
    ],
    holds: [2, 2, 4],
  },
};

// ---------------------------------------------------------------------------
// (His coat was a dead grey that vanished into the ship's dark boards; it is the crew's cold sea-green now,
// paler, so the boy reads as one of the ghosts, as the deckhand does. 14 November.)
export const POWDER_MONKEY_PALETTE = {
  k: '#0e1c1e',
  c: '#6e8c84',
  C: '#a4c0b4',
  d: '#445c56',
  s: '#cfd4c8',
  S: '#8c948c',
  f: '#d0dcd2',
  F: '#8ea49c',
  e: '#f4fff2',
  E: '#a8e8d0',
  h: '#4a3a30',
  H: '#74604c',
  b: '#c8a448',
  B: '#80601c',
  o: '#ff9a2a',
  O: '#ffe070',
  r: '#c8442a',
  g: '#a8b4ac',
  G: '#68807a',
  q: '#2c3a3a',
  Q: '#56686a',
};

function monkey(pose = {}) {
  const { sway = 0, bob = 0, match = 0, eyes = 'glow', wave = 0, smoke = 0, sit = false } = pose;
  const p = new Pix(36, 42);
  const cx = 17 + sway;
  const top = 12 + bob + (sit ? 5 : 0);

  // Mist and smoke where the legs end.
  for (let i = -5; i <= 5; i += 2) {
    const len = 7 + ((i * 3 + 18) % 4);
    for (let y = 0; y < len; y++) p.set(cx + i + Math.sin(wave + i * 0.7 + y * 0.45) * (0.5 + y * 0.18), top + 22 + y, y > len - 3 ? 'g' : y > 3 ? 'G' : 'd');
  }
  // Boots.
  p.rect(cx - 6, top + 20, 5, 3, 'h');
  p.rect(cx + 1, top + 20, 5, 3, 'h');
  p.rect(cx - 6, top + 20, 5, 1, 'H');
  p.rect(cx + 1, top + 20, 5, 1, 'H');
  // The coat: far too big, the sleeves rolled, the hem scorched.
  p.poly([[cx - 8, top + 6], [cx + 8, top + 6], [cx + 10, top + 14], [cx + 9, top + 21], [cx - 9, top + 21], [cx - 10, top + 14]], 'k');
  p.poly([[cx - 7, top + 7], [cx + 7, top + 7], [cx + 9, top + 14], [cx + 8, top + 20], [cx - 8, top + 20], [cx - 9, top + 14]], 'c');
  p.poly([[cx + 1, top + 7], [cx + 7, top + 7], [cx + 9, top + 14], [cx + 8, top + 20], [cx + 2, top + 20]], 'd', ['c']);
  for (let i = 0; i < 3; i++) p.set(cx - 1, top + 9 + i * 4, 'b');
  for (let x = cx - 8; x <= cx + 8; x++) if ((x * 5) % 4 === 0) p.set(x, top + 20, 'q');
  p.rect(cx - 9, top + 14, 3, 3, 'q');
  // The round shot hugged to the chest.
  p.ellipse(cx - 3, top + 14, 4.6, 4.6, 'k');
  p.ellipse(cx - 3, top + 14, 3.8, 3.8, 'q');
  p.ellipse(cx - 4, top + 13, 1.6, 1.4, 'Q');
  p.set(cx - 5, top + 12, 'C');
  // His arms: one wraps the shot, the other holds the slow-match up and out.
  p.line(cx - 6, top + 9, cx - 7, top + 15, 'k', 4);
  p.line(cx - 6, top + 9, cx - 7, top + 15, 'c', 2);
  const mx = cx + 10 + match * 2;
  const my = top + 6 - match * 7;
  p.line(cx + 6, top + 9, mx, my, 'k', 4);
  p.line(cx + 6, top + 9, mx, my, 'c', 2);
  p.ellipse(mx, my, 2, 2, 'k');
  p.ellipse(mx, my, 1.3, 1.3, 'f');
  // The slow-match: a length of grey cord, its tip glowing; a thread of smoke.
  p.line(mx, my, mx + 1, my - 8, 'S', 2);
  p.line(mx, my, mx + 1, my - 8, 's');
  p.set(mx + 1, my - 9, 'O');
  p.set(mx + 1, my - 10, 'o');
  p.set(mx + 2, my - 10, 'O');
  for (let y = 0; y < 8 + smoke * 4; y++) p.set(mx + 2 + Math.sin(wave + y * 0.7) * (1 + y * 0.25), my - 12 - y, y < 3 ? 'C' : y < 6 ? 'g' : 'G');
  // The head: a child's, under a gunner's cap pulled down.
  const hy = top + 1;
  p.ellipse(cx - 1, hy, 5.5, 5, 'k');
  p.ellipse(cx - 1, hy, 4.6, 4.2, 'f');
  p.ellipse(cx, hy + 1, 3.6, 2.8, 'F', ['f']);
  // A smudge of powder across the nose.
  p.rect(cx - 3, hy + 1, 4, 1, 'q');
  for (const ex of [cx - 4, cx]) {
    if (eyes === 'closed') p.rect(ex, hy - 1, 3, 1, 'k');
    else if (eyes === 'happy') { p.set(ex, hy, 'e'); p.set(ex + 1, hy - 1, 'e'); p.set(ex + 2, hy, 'e'); }
    else if (eyes === 'dead') { p.set(ex, hy - 1, 'E'); p.set(ex + 2, hy, 'E'); p.set(ex + 2, hy - 1, 'E'); p.set(ex, hy, 'E'); }
    else { p.rect(ex, hy - 1, 3, 2, 'e'); p.set(ex + 1, hy - 1, 'E'); }
  }
  p.rect(cx - 2, hy + 3, 3, 1, 'd');
  // The cap: a flat gunner's cap, a brass badge of two crossed rammers.
  p.ellipse(cx - 1, hy - 3, 6.6, 3, 'k');
  p.ellipse(cx - 1, hy - 3, 5.8, 2.3, 'h');
  p.rect(cx - 7, hy - 2, 12, 2, 'k');
  p.rect(cx - 6, hy - 2, 10, 1, 'H');
  p.set(cx - 2, hy - 4, 'b');
  p.set(cx - 1, hy - 3, 'b');
  p.set(cx, hy - 4, 'b');
  return p.outline('k').rows();
}

const MONKEY_IDLE = [
  monkey({ sway: 0, wave: 0, bob: 0 }),
  monkey({ sway: 0, wave: 0.9, bob: -1, smoke: 1 }),
  monkey({ sway: -1, wave: 1.8, bob: 0 }),
  monkey({ sway: 0, wave: 2.7, bob: -1, eyes: 'closed', smoke: 1 }),
];
export const POWDER_MONKEY_SPRITE = MONKEY_IDLE[0];
export const POWDER_MONKEY_ANIM = {
  chips: ['#6a6a5c', '#9a9a84', '#ff9a2a', '#c8a448'],
  idle: { fps: 4, frames: MONKEY_IDLE },
  windup: {
    fps: 8,
    frames: [
      monkey({ match: 0.5, sway: 1, wave: 1 }),
      monkey({ match: 1, sway: 2, wave: 2, bob: -1, smoke: 1 }),
      monkey({ match: 1, sway: 2, wave: 3, bob: -2, smoke: 2 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(monkey({ eyes: 'closed', match: 0.3 }), 2, 0)),
      shift(monkey({ eyes: 'closed', sway: -1, wave: 1.5 }), 2, 0),
      shift(monkey({ wave: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      monkey({ eyes: 'dead', match: -0.5, sway: 1, wave: 1 }),
      crumble(monkey({ eyes: 'dead', match: -1, sway: 2, wave: 2, bob: 2 }), 0.35, true),
      crumble(monkey({ eyes: 'dead', match: -1, sway: 2, wave: 3, bob: 4 }), 0.7, true),
      crumble(monkey({ eyes: 'dead', match: -1, sway: 2, wave: 4, bob: 6 }), 1, true),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      monkey({ eyes: 'happy', match: 0 }),
      monkey({ eyes: 'happy', sit: true, match: -0.3, wave: 1 }),
      monkey({ eyes: 'closed', sit: true, match: -0.3, wave: 2 }),
    ],
    holds: [2, 2, 4],
  },
};
