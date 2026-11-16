import { Pix, flash, shift } from './ch5Kit.js';

// CORRIE, THE TIDECALLER, in battle: 44x58 (drawn twice that, at the right
// of the box, on the Last Light's lamp room). The same boy as his overworld
// figure (corrieFigure in coastFolk.js): about eight, a pale see-through
// boy in a yellow oilskin far too big for him (he copied the Hero's coat),
// the sleeves rolled four times into fat cuffs, wet dark hair, big eyes, a
// driftwood staff taller than he is with a cyan glow in its fork. He floats,
// and there is no floor under him, only a ripple. He faces left, at you.
//
// One drawing (corrie(pose)) in four looks, one a phase of his fight:
//   boy    hovering, the staff held up, sad and stubborn
//   storm  the storm comes out of him: a cloud round him with lightning in
//          it, hair whipped up, eyes white, the coat flaring into spray
//   whirl  below the waist he's water, a funnel turning down into the sea;
//          arms flung out
//   lamp   mostly a boy again, and tired: head down, eyes half shut, the
//          staff leaning, a tear; the lamp's warm light on his side
// and BEATEN: sunk low over the water, the staff across his knees, his head
// down. He is still there: the battle ends on this, and the scene after
// does the rest (src/data/enemies/corrie.js).

export const CORRIE_BATTLE_PALETTE = {
  k: '#0b1626',
  c: '#e4f0f6', C: '#aec8da', d: '#7c98b4',
  H: '#2c3860', h: '#566a9c',
  y: '#f0cc5a', Y: '#ffe89a', z: '#b88a2c', Z: '#7a5a1c',
  e: '#c8fbff', n: '#1a2a50', w: '#ffffff', E: '#eaffff', m: '#6a4a5c',
  W: '#a88a68', V: '#6e553c', U: '#ccb08a',
  T: '#8ff0ff', t: '#efffff', u: '#4ab8d0',
  a: '#7fd4eecc', A: '#3c8cc0cc', f: '#e0f8ffdd', D: '#d8f6ff',
  s: '#13302ad8', S: '#24493ed0', l: '#fff6a0',
  L: '#ffe2a0',
  // His eyes, the colour of the sea out there; the storm cloud's lit edges.
  g: '#3cc4b0', G: '#1e7a72', r: '#5c9a80', R: '#9ad8b8',
};

const W = 44;
const H = 58;

// pose: look ('boy' | 'storm' | 'whirl' | 'lamp' | 'beaten'), bob (0-2 px
// down), cast (0-2: the staff up, the glow swelling), blink, frame (0-3,
// for whatever turns or flickers), hurt (a flinch: eyes screwed shut).
function corrie({ look = 'boy', bob = 0, cast = 0, blink = false, frame = 0, hurt = false } = {}) {
  const p = new Pix(W, H);
  const storm = look === 'storm';
  const whirl = look === 'whirl';
  const lamp = look === 'lamp';
  const beaten = look === 'beaten';
  const tired = lamp || beaten;
  const by = bob + (beaten ? 9 : 0);

  // --- Behind him: the storm's cloud, with lightning in it.
  if (storm) {
    p.ellipse(24, 22, 20, 15, 's');
    p.ellipse(12, 14, 9, 7, 'S');
    p.ellipse(36, 12, 8, 7, 'S');
    p.ellipse(24, 8, 10, 6, 's');
    p.ellipse(8, 28, 6, 6, 's');
    p.ellipse(40, 28, 5, 6, 's');
    const bolts = [[[4, 18], [7, 22], [5, 24], [9, 29]], [[39, 14], [36, 19], [39, 21], [35, 27]]];
    // Its tops lit green-white, the way a thunderhead catches the lightning inside it.
    for (let y = 1; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = p.get(x, y);
        if ((v === 's' || v === 'S') && p.get(x, y - 1) === '.') {
          p.set(x, y, (x + frame) % 5 ? 'r' : 'R');
          if (p.get(x, y + 1) === 's') p.set(x, y + 1, 'S');
        }
      }
    }
    const lit = bolts[frame % 2];
    for (let i = 0; i + 1 < lit.length; i++) p.line(lit[i][0], lit[i][1], lit[i + 1][0], lit[i + 1][1], 'l');
  }

  // --- Under him: the ripple he floats over, or the whirlpool he's become.
  if (whirl) {
    // The funnel: rings narrowing down into the sea, turning (`frame`).
    for (let y = 36; y <= 56; y++) {
      const k = (y - 36) / 20;
      const rx = 17 - k * 14;
      const cx = 24 + Math.sin(k * 5 + frame * 1.2) * 2;
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const band = Math.floor((x - cx + y * 0.8 + frame * 3) / 3) % 3;
        p.set(x, y, band === 0 ? 'f' : band === 1 ? 'a' : 'A');
      }
    }
    // Foam flung off the rim.
    for (const [x, y] of [[5, 37], [42, 39], [3, 42], [40, 34]]) p.set(x + (frame % 2), y, 'f');
  } else {
    p.ellipse(24, 54 + Math.min(1, by - (beaten ? 9 : 0)), beaten ? 15 : 12, 1.8, 'a');
    p.rect(14, 54, 3, 1, 'f');
    p.rect(30, 55, 4, 1, 'f');
  }

  // --- The coat: a bell far too big for him, the hem dragging.
  const coatTop = 25 + by;
  const coatBottom = whirl ? 37 : beaten ? 49 : 47 + Math.min(1, bob);
  const flare = storm ? 4 : 0;
  for (let y = coatTop; y <= coatBottom; y++) {
    const k = (y - coatTop) / (coatBottom - coatTop);
    const half = 8 + k * (beaten ? 13 : 9) + (storm && k > 0.6 ? flare * (k - 0.6) * 2.5 : 0);
    const x0 = Math.round(24 - half);
    const x1 = Math.round(24 + half);
    for (let x = x0; x <= x1; x++) p.set(x, y, x <= x0 + 1 ? 'Y' : x >= x1 - 2 ? 'z' : 'y');
  }
  // A seam down the front and three big toggles.
  p.line(24, coatTop + 3, 24, coatBottom - 1, 'z');
  for (const dy of [5, 10, 15]) if (coatTop + dy < coatBottom) p.rect(23, coatTop + dy, 2, 1, 'Z');
  // The ragged hem (or, in the storm, the hem tearing into spray).
  if (!whirl) {
    for (let x = 8; x <= 40; x += 3) {
      const drop = (x * 7 + frame) % 3;
      p.set(x, coatBottom + 1, drop ? 'z' : '.');
      if (storm) {
        p.set(x - 1, coatBottom + 2 + drop, 'a');
        p.set(x - 2, coatBottom + 4 + drop, 'f');
      }
    }
  }
  // The big upturned collar.
  p.poly([[15, coatTop - 1], [33, coatTop - 1], [31, coatTop + 3], [17, coatTop + 3]], 'z');
  p.rect(17, coatTop, 6, 2, 'y');
  p.rect(27, coatTop, 4, 2, 'Y');

  // --- His far arm (our right): out wide in the whirl, else at his side.
  const sleeve = (x0, y0, x1, y1) => {
    p.line(x0, y0, x1, y1, 'y', 5);
    p.line(x0 + 1, y0 + 1, x1 + 1, y1 + 1, 'z', 2);
    // The cuff, rolled four times.
    p.ellipse(x1, y1 + 1, 3.4, 2.4, 'Z');
    p.line(x1 - 3, y1, x1 + 3, y1, 'z');
    p.line(x1 - 3, y1 + 2, x1 + 3, y1 + 2, 'y');
  };
  if (whirl) {
    sleeve(31, coatTop + 3, 40, coatTop - 3);
    p.ellipse(42, coatTop - 5, 1.6, 1.6, 'c');
  } else if (!beaten) {
    sleeve(31, coatTop + 3, 34, coatTop + 12);
    p.ellipse(34, coatTop + 15, 1.6, 1.4, 'c');
  }

  // --- The staff: driftwood, crooked, taller than him, a glow in its fork.
  // (Raised, but the glow never leaves the top of the picture.)
  const raise = cast * 1.5;
  let sx0 = 10;
  let sy0 = 54 + by - raise;
  let sx1 = 8;
  let sy1 = 5 + by - raise;
  if (lamp) { sx1 = 4; sy1 = 10 + by; }
  if (whirl) { sx0 = 6; sy0 = 34 + by; sx1 = 3; sy1 = 4 + by; }
  if (beaten) { sx0 = 6; sy0 = 47 + by - 9; sx1 = 41; sy1 = 44 + by - 9; }
  p.line(sx0, sy0, sx1, sy1, 'W', 2);
  p.line(sx0 + 1, sy0, sx1 + 1, sy1, 'V');
  // Knots, and a pale highlight.
  for (const f of [0.3, 0.55, 0.8]) p.set(Math.round(sx0 + (sx1 - sx0) * f) - 1, Math.round(sy0 + (sy1 - sy0) * f), 'U');
  if (!beaten) {
    // The fork, and the glow in it.
    p.line(sx1, sy1 + 2, sx1 - 2, sy1 - 2, 'V');
    p.line(sx1 + 1, sy1 + 2, sx1 + 3, sy1 - 2, 'V');
    const glow = tired ? 1.4 : 2.2 + cast * 0.8 + (storm ? 0.6 : 0);
    p.ellipse(sx1 + 0.5, sy1 - 1, glow, glow, tired ? 'u' : 'T');
    p.ellipse(sx1 + 0.5, sy1 - 1, Math.max(0.6, glow - 1.2), Math.max(0.6, glow - 1.2), tired ? 'T' : 't');
    if (cast >= 2 || storm) for (const [dx, dy] of [[-4, -1], [5, -1], [0, -6], [0, 4]]) p.set(sx1 + dx, sy1 - 1 + dy, storm ? 'l' : 't');
  } else {
    p.ellipse(41, 43 + by - 9, 1.4, 1.4, 'u');
  }

  // --- His near arm (our left): holding the staff.
  if (beaten) {
    sleeve(17, coatTop + 3, 14, coatTop + 11);
    sleeve(31, coatTop + 3, 30, coatTop + 11);
    p.ellipse(15, coatTop + 13, 1.6, 1.4, 'c');
    p.ellipse(30, coatTop + 13, 1.6, 1.4, 'c');
  } else {
    const hand = { x: Math.round(sx0 + (sx1 - sx0) * 0.38), y: Math.round(sy0 + (sy1 - sy0) * 0.38) };
    sleeve(17, coatTop + 3, hand.x + 2, hand.y - 2);
    p.ellipse(hand.x + 1, hand.y, 1.8, 1.6, 'c');
    p.set(hand.x + 2, hand.y, 'C');
  }

  // --- The head: round, a bit too big for him.
  const tilt = tired ? 2 : 0;
  const hx = 24 - (tired ? 1 : 0);
  const hy = 15 + by + tilt;
  p.rect(22, hy + 7, 4, 3, 'C');
  p.ellipse(hx, hy, 8.5, 8, 'c');
  // Shadow on the far side of his face.
  p.ellipse(hx + 5, hy + 2, 3, 5, 'C', 'c');
  // Wet hair plastered down, sticking up in points (whipped up in the storm).
  p.ellipse(hx, hy - 4, 9.4, 5, 'H');
  p.rect(hx - 9, hy - 4, 3, 8, 'H');
  p.rect(hx + 7, hy - 4, 3, 7, 'H');
  p.ellipse(hx - 2, hy - 6, 4, 2, 'h');
  for (const [x, dy] of [[-6, 0], [-3, 1], [0, 0], [3, 1], [6, 0]]) p.line(hx + x, hy - 3, hx + x - 1, hy - 1 + dy, 'H');
  if (storm || whirl) {
    for (const [x, len] of [[-8, 5], [-5, 7], [-1, 6], [3, 7], [7, 5]]) p.line(hx + x, hy - 8, hx + x + (frame % 2 ? 1 : -1) * 2, hy - 8 - len, x % 2 ? 'H' : 'h');
  } else {
    for (const [x, dy] of [[-7, 0], [-3, -1], [2, -1], [6, 0]]) p.set(hx + x, hy - 9 + dy, 'H');
  }
  // The eyes: big; white and lit in the storm and the whirl; half shut, tired.
  const eyeY = hy + 1;
  for (const ex of [hx - 5, hx + 1]) {
    if (hurt || blink || beaten) {
      p.rect(ex, eyeY + 2, 3, 1, 'n');
    } else if (storm || whirl) {
      p.rect(ex, eyeY, 3, 4, 'E');
      p.rect(ex, eyeY, 3, 1, 'e');
    } else if (lamp) {
      p.rect(ex, eyeY + 2, 3, 2, 'g');
      p.set(ex + 1, eyeY + 3, 'G');
      p.rect(ex, eyeY + 1, 3, 1, 'n');
      p.set(ex, eyeY + 3, 'n');
    } else {
      // Big, and sea-green.
      p.rect(ex, eyeY, 3, 4, 'g');
      p.rect(ex, eyeY + 3, 3, 1, 'G');
      p.rect(ex + 1, eyeY + 1, 2, 2, 'n');
      p.set(ex + 1, eyeY + 1, 'w');
    }
  }
  // Brows: worried; screwed up when he's hit.
  if (hurt) { p.line(hx - 6, eyeY - 2, hx - 3, eyeY - 1, 'H'); p.line(hx + 4, eyeY - 1, hx + 1, eyeY - 2, 'H'); }
  else if (!(storm || whirl)) { p.line(hx - 5, eyeY - 2, hx - 3, eyeY - 3, 'd'); p.line(hx + 1, eyeY - 3, hx + 3, eyeY - 2, 'd'); }
  // The mouth: a small line; open, shouting, in the storm.
  if (storm || whirl) p.rect(hx - 2, hy + 5, 3, 2, 'm');
  else if (hurt) p.rect(hx - 2, hy + 5, 4, 1, 'm');
  else p.rect(hx - 1, hy + 5, 2, 1, 'm');
  // A tear, tired.
  if (tired && !hurt) { p.set(hx - 5, eyeY + 4, 'D'); p.set(hx - 5, eyeY + 5 + (frame % 2), 'D'); }

  // Drops falling off him.
  if (!whirl) for (const [x, y] of [[12, 50], [35, 51]]) p.set(x, y + ((frame + x) % 3), 'D');

  p.outline('k');

  // The lamp's warm light down his side (after the outline, so it glows).
  if (lamp || beaten) {
    for (let y = 0; y < H; y++) {
      let lit = 0;
      for (let x = W - 1; x >= 0 && lit < 2; x--) {
        const v = p.get(x, y);
        if (v === '.' || v === 'k') continue;
        if ('yYzZcCHh'.includes(v)) p.set(x, y, 'L');
        lit++;
      }
    }
  }
  return p.rows();
}

const looks = (look) => ({
  idle: {
    fps: 3,
    frames: [
      corrie({ look, bob: 0, frame: 0 }),
      corrie({ look, bob: 1, frame: 1 }),
      corrie({ look, bob: 2, frame: 2, blink: look === 'boy' }),
      corrie({ look, bob: 1, frame: 3 }),
    ],
  },
  windup: {
    fps: 7,
    frames: [
      corrie({ look, bob: 1, cast: 1, frame: 1 }),
      corrie({ look, bob: 0, cast: 2, frame: 2 }),
      corrie({ look, bob: 0, cast: 2, frame: 3 }),
    ],
  },
  talk: {
    fps: 5,
    frames: [corrie({ look, bob: 0, frame: 0 }), corrie({ look, bob: 1, frame: 1 })],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(corrie({ look, hurt: true, frame: 0 }), 2, 0)),
      shift(corrie({ look, hurt: true, bob: 1, frame: 1 }), 2, 0),
      shift(corrie({ look, bob: 1, frame: 2 }), 1, 0),
    ],
  },
});

export const CORRIE_BATTLE_SPRITE = corrie({ look: 'boy' });
export const CORRIE_STORM_SPRITE = corrie({ look: 'storm' });
export const CORRIE_WHIRL_SPRITE = corrie({ look: 'whirl' });
export const CORRIE_LAMP_SPRITE = corrie({ look: 'lamp' });
// Beaten: low over the water, the staff across his knees. Still there.
export const CORRIE_BEATEN_SPRITE = corrie({ look: 'beaten' });

// Each phase's clips. A later phase's `intro` plays as it starts: the storm
// coming out of him (a flash, then the cloud), the sea turning under him,
// the lamp's light finding him.
export const CORRIE_BOY_ANIM = looks('boy');
export const CORRIE_STORM_ANIM = {
  ...looks('storm'),
  intro: {
    fps: 8,
    frames: [
      flash(corrie({ look: 'boy', cast: 2 })),
      corrie({ look: 'boy', cast: 2, frame: 1 }),
      flash(corrie({ look: 'storm', cast: 2, frame: 0 })),
      corrie({ look: 'storm', cast: 2, frame: 1 }),
      corrie({ look: 'storm', cast: 1, frame: 2 }),
    ],
  },
};
export const CORRIE_WHIRL_ANIM = {
  ...looks('whirl'),
  intro: {
    fps: 8,
    frames: [
      flash(corrie({ look: 'storm', frame: 0 })),
      corrie({ look: 'whirl', frame: 0 }),
      corrie({ look: 'whirl', frame: 1, cast: 1 }),
      corrie({ look: 'whirl', frame: 2, cast: 2 }),
      corrie({ look: 'whirl', frame: 3, cast: 1 }),
    ],
  },
};
export const CORRIE_LAMP_ANIM = {
  ...looks('lamp'),
  intro: {
    fps: 6,
    frames: [
      flash(corrie({ look: 'whirl', frame: 0 })),
      corrie({ look: 'whirl', frame: 1, hurt: true }),
      flash(corrie({ look: 'lamp', hurt: true })),
      corrie({ look: 'lamp', hurt: true, bob: 1 }),
      corrie({ look: 'lamp', bob: 2 }),
    ],
  },
  // Beaten: his glow goes out and he sinks low over the water, and stays.
  death: {
    fps: 4,
    frames: [
      corrie({ look: 'lamp', hurt: true, bob: 1 }),
      corrie({ look: 'lamp', hurt: true, bob: 2 }),
      shift(corrie({ look: 'beaten' }), 0, -5),
      shift(corrie({ look: 'beaten' }), 0, -2),
      CORRIE_BEATEN_SPRITE,
    ],
  },
};
