import { defineBulletArt } from '../projectiles.js';

// The Fiddler's attacks. It's an eyeless cave cricket that plays its wings
// with its back leg, so everything it does is music (and the leg that plays
// it): runs of notes up and down a scale, strings strummed across the box,
// big leaps that land with a ring of leg-spikes, feelers that sweep the dark
// for you, and a single note that goes round and round the box, throwing
// echoes off every wall. It can't see you. It listens.
//
// It stands to the right of the box. Each attack is a factory `(box, density,
// tools) => ({ duration, update })`; see dummy.js for the shape.

const NOTE = { n: '#ffe9a0', N: '#d8a84a', k: '#6a583c' };
const SPIKE = { s: '#ece0bc', S: '#c9b48c', d: '#6a583c' };

// A note, an eighth note with a flag, gold in the dark.
defineBulletArt('fidNote', {
  frames: [
    ['...nn', '...n.n', '...n..', '...n..', '.nnn..', 'nNNn..', '.nn...'],
    ['...nn', '...nn.n', '...n...', '...n...', '.nnn...', 'nNNn...', '.nn....'],
  ],
  palette: NOTE,
  radius: 2.2,
  frameSeconds: 0.3,
});

// A fat quarter note, the one it sends round the box.
defineBulletArt('fidBigNote', {
  frames: [
    ['.....nn', '.....nn', '.....nn', '.....nn', '..nnnnn', '.nnNNn.', 'nnNNNn.', 'nNNNnn.', '.nnnn..'],
  ],
  palette: NOTE,
  radius: 3.4,
  spin: 1.2,
});

// The echo of a note: smaller, paler.
defineBulletArt('fidEcho', {
  frames: [
    ['..nn', '..n.', '.nn.', 'nn..'],
    ['..nn', '..n.', '.nn.', '.n..'],
  ],
  palette: { n: '#b8c8d8' },
  radius: 1.5,
  frameSeconds: 0.2,
});

// A spike off its back leg, pointing right.
defineBulletArt('fidSpike', {
  frames: [['.dss....', 'dSsssSS.', '.dss....']],
  palette: SPIKE,
  radius: 2.2,
  rotate: true,
});

// A puff of rosin dust (it's what it plays with), drifting.
defineBulletArt('fidDust', {
  frames: [
    ['.ww.', 'wWww', 'wwWw', '.ww.'],
    ['.ww.', 'wwWw', 'wWww', '.ww.'],
  ],
  palette: { w: '#f4ecd0', W: '#c9b48c' },
  radius: 1.8,
  frameSeconds: 0.25,
});

// Where it will land (harmless): a ring of notes in the dark, a gleam.
defineBulletArt('fidMark', {
  frames: [
    ['..g..', '.g.g.', 'g...g', '.g.g.', '..g..'],
    ['.ggg.', 'g...g', 'g...g', 'g...g', '.ggg.'],
  ],
  palette: { g: '#ffe9a0' },
  radius: 1,
  frameSeconds: 0.15,
});

// The tip of a feeler: a pale bead on the end of a thin line (harmless).
defineBulletArt('fidBead', {
  frames: [['.s.', 'sws', '.s.']],
  palette: { s: '#c9b48c', w: '#ffffff' },
  radius: 1,
});

export const FIDDLER_ATTACKS = {
  // Scales: a run of eight notes climbs the box from the floor to the
  // ceiling, one after another, at different heights, and then runs back
  // down. Each run starts one note off from where you are.
  fidScale(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let runs = 0;
    let next = 0.2;
    let queue = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && runs < 3 && t < 4.4) {
          next = t + 1.9;
          const up = runs % 2 === 0;
          // A little off true each run.
          const shift = rand(-3, 3);
          for (let i = 0; i < 8; i++) {
            const idx = up ? i : 7 - i;
            const y = clamp(box.y + 6 + idx * 10 + shift, box.y + 5, box.y + box.h - 5);
            queue.push({ at: t + i * 0.2, y });
          }
          // One of them is always on your row.
          const near = queue.slice(-8).reduce((a, b) => (Math.abs(b.y - soul.y) < Math.abs(a.y - soul.y) ? b : a));
          near.y = soul.y;
          runs++;
        }
        for (const q of queue) {
          if (t < q.at) continue;
          q.done = true;
          bullets.push(new Shot({ x: box.x + box.w + 6, y: q.y, vx: -62, art: 'fidNote', life: 3.4 }));
        }
        queue = queue.filter((q) => !q.done);
      },
    };
  },

  // Strum: four strings stretch across the box (they flash, thin), and it
  // draws its leg down them: each goes off in turn, top to bottom or bottom to
  // top, with a half-second to get off the next. The first set runs across the
  // box, the second runs up and down it, the third across again, and each
  // has a string through where you stand (or very near it), and a gap between
  // strings to get to.
  fidStrum(box, density, { Shot, Line }) {
    let t = 0;
    let strums = 0;
    let next = 0.15;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || strums >= 3) return;
        next = t + 2.25;
        const down = strums !== 1;
        const upright = strums === 1;
        // Four strings 18px apart; the second one down is on you.
        const at = upright ? soul.x : soul.y;
        const lo = upright ? box.x : box.y;
        const hi = upright ? box.x + box.w : box.y + box.h;
        const offs = [-1, 0, 1, 2].map((k) => at + k * 18 + (strums === 2 ? -9 : 0));
        offs.forEach((v, i) => {
          if (v < lo + 3 || v > hi - 3) return;
          const order = down ? i : 3 - i;
          const warn = 0.6 + order * 0.4;
          if (upright) {
            bullets.push(new Line({ x: v, y: box.y - 4, angle: Math.PI / 2, length: box.h + 8, thickness: 3, warn, life: 0.4, color: '#ffe9a0', glow: '#d8a84a' }));
            bullets.push(new Shot({ x: v, y: box.y - 3, harmless: true, life: warn + 0.3, art: 'fidBead' }));
          } else {
            bullets.push(new Line({ x: box.x - 4, y: v, angle: 0, length: box.w + 8, thickness: 3, warn, life: 0.4, color: '#ffe9a0', glow: '#d8a84a' }));
            bullets.push(new Shot({ x: box.x + box.w + 3, y: v, harmless: true, life: warn + 0.3, art: 'fidBead' }));
          }
        });
        strums++;
      },
    };
  },

  // Leaps: it springs up out of the dark and comes down on a spot that shows
  // first (a ring of glints), on you, throwing the spikes of its back leg out
  // round it in a ring, a puff of rosin behind them. Three leaps; each one
  // lands a little nearer where you've moved to.
  fidLeap(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let leaps = 0;
    let next = 0.2;
    let landing = [];
    let last = null;
    let drift = { x: 0, y: 0 };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // Which way you've been heading (it lands a little ahead of that).
        if (last && dt > 0) {
          drift.x = drift.x * 0.9 + ((soul.x - last.x) / dt) * 0.1;
          drift.y = drift.y * 0.9 + ((soul.y - last.y) / dt) * 0.1;
        }
        last = { x: soul.x, y: soul.y };
        if (t >= next && leaps < 3 && t < 4.6) {
          next = t + 1.55;
          leaps++;
          const ahead = (v) => clamp(v * 0.35, -26, 26);
          // Never right on top of you: a step to one side, so there's room to slip between the spikes.
          const side = rand(0, Math.PI * 2);
          const pos = { x: clamp(soul.x + ahead(drift.x) + Math.cos(side) * 13, box.x + 9, box.x + box.w - 9), y: clamp(soul.y + ahead(drift.y) + Math.sin(side) * 13, box.y + 9, box.y + box.h - 9) };
          const warn = 0.95;
          bullets.push(new Shot({ x: pos.x, y: pos.y, harmless: true, life: warn, art: 'fidMark' }));
          landing.push({ at: t + warn, pos });
        }
        for (const l of landing) {
          if (t < l.at) continue;
          l.done = true;
          const turn = rand(0, Math.PI / 4);
          for (let i = 0; i < 8; i++) {
            const a = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: l.pos.x, y: l.pos.y, vx: Math.cos(a) * 68, vy: Math.sin(a) * 68, warn: 0.3, art: 'fidSpike', life: 1.7 }));
          }
          // The dust of the landing: a slower ring on the same lines, trailing the spikes.
          for (let i = 0; i < 8; i++) {
            const a = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: l.pos.x, y: l.pos.y, vx: Math.cos(a) * 38, vy: Math.sin(a) * 38, warn: 0.3, art: 'fidDust', life: 1.6 }));
          }
        }
        landing = landing.filter((l) => !l.done);
      },
    };
  },

  // Feelers: it can't see, so it sweeps the dark with its antennae: a fan of
  // thin lines, one after another from the top of the box to the bottom
  // (then back), each going off where it touches. They reach right across
  // the box, from a different side each sweep (the right edge, the upper left,
  // the lower left), and each has a bead on the tip.
  fidFeelers(box, density, { Shot, Line }) {
    const roots = [
      { x: box.x + box.w + 10, y: box.y + box.h / 2 },
      { x: box.x - 10, y: box.y - 4 },
      { x: box.x - 10, y: box.y + box.h + 4 },
    ];
    let t = 0;
    let sweeps = 0;
    let next = 0.2;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || sweeps >= 3) return;
        next = t + 2.2;
        const root = roots[sweeps];
        const down = sweeps !== 1;
        const aim = Math.atan2(soul.y - root.y, soul.x - root.x);
        const count = 9;
        for (let i = 0; i < count; i++) {
          const k = down ? i : count - 1 - i;
          // Spread out round the line to you, nine steps of 0.18 radians.
          const angle = aim + (i - 4) * 0.18;
          const warn = 0.6 + k * 0.14;
          const length = 300;
          bullets.push(new Line({ x: root.x, y: root.y, angle, length, thickness: 2, warn, life: 0.22, color: '#c9b48c', glow: '#ece0bc' }));
          bullets.push(new Shot({ x: root.x + Math.cos(angle) * 70, y: root.y + Math.sin(angle) * 70, harmless: true, life: warn + 0.22, art: 'fidBead' }));
        }
        sweeps++;
      },
    };
  },

  // Echo: one fat note is sent at you and goes round and round the box,
  // glancing off every wall; every time it hits one, an echo of it comes
  // off in each direction, smaller and paler, and fades.
  fidEcho(box, density, { Shot, rand }) {
    let t = 0;
    let note = null;
    let bounces = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!note && t > 0.2) {
          const x = box.x + box.w - 6;
          const y = box.y + box.h / 2;
          const aim = Math.atan2(soul.y - y, soul.x - x);
          note = new Shot({ x, y, vx: Math.cos(aim) * 58, vy: Math.sin(aim) * 58, bounce: true, warn: 0.6, art: 'fidBigNote', life: 5.6 });
          note.lastVx = note.vx;
          note.lastVy = note.vy;
          bullets.push(note);
        }
        if (!note || note.age <= note.warn) return;
        const bouncedX = note.vx * note.lastVx < 0;
        const bouncedY = note.vy * note.lastVy < 0;
        if ((bouncedX || bouncedY) && bounces < 6) {
          bounces++;
          const base = Math.atan2(note.vy, note.vx);
          for (const side of [-1, 1]) {
            const a = base + side * (0.55 + rand(0, 0.15));
            bullets.push(new Shot({ x: note.x, y: note.y, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, art: 'fidEcho', life: 1.9 }));
          }
          note.vx *= 1.06;
          note.vy *= 1.06;
        }
        note.lastVx = note.vx;
        note.lastVy = note.vy;
      },
    };
  },
};
