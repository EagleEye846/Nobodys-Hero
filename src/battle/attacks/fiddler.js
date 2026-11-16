import { defineBulletArt } from '../projectiles.js';
import { Deco } from './coastKit.js';

// The Fiddler's attacks. It's an eyeless cave cricket that plays its wings
// with its back leg. It can't see you; it listens, and it plays back what
// it hears:
//   - Strum: strings across the box, drawn one after another.
//   - Leaps: it springs and lands in a ring of leg-spikes.
//   - Feelers: its antennae sweep the dark for you.
//   - Playback: it hums your footsteps back to you, a little late: every
//     step you took sounds as a note, in order. Don't double back.
//   - The phrase: it plays a phrase quietly on the staff, waits, nods, and
//     plays it again for real, same notes, same rhythm.
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
  // Strum: four strings stretch across the box (they flash, thin), and it
  // draws its leg down them: each goes off in turn, top to bottom or bottom to
  // top, with a half-second to get off the next. The first set runs across the
  // box, the second runs up and down it, the third and fourth across again, and each
  // has a string through where you stand (or very near it), and a gap between
  // strings to get to.
  fidStrum(box, density, { Shot, Line }) {
    let t = 0;
    let strums = 0;
    let next = 0.15;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || strums >= 4) return;
        next = t + 2.5;
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
  // round it in a ring, a puff of rosin behind them. Four leaps; each one
  // lands a little nearer where you've moved to.
  fidLeap(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let leaps = 0;
    let next = 0.2;
    let landing = [];
    let last = null;
    let drift = { x: 0, y: 0 };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // Which way you've been heading (it lands a little ahead of that).
        if (last && dt > 0) {
          drift.x = drift.x * 0.9 + ((soul.x - last.x) / dt) * 0.1;
          drift.y = drift.y * 0.9 + ((soul.y - last.y) / dt) * 0.1;
        }
        last = { x: soul.x, y: soul.y };
        if (t >= next && leaps < 4) {
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
  // the lower left, then the right again), and each has a bead on the tip.
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || sweeps >= 4) return;
        next = t + 2.6;
        const root = roots[sweeps % 3];
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


  // Playback: it listens to your footsteps, and plays them back to you, a
  // little late. Wherever you go, a faint ring marks the step, and a moment
  // later a note sounds right there, in the order you made them. So your own
  // path is the tune: keep moving on, and don't double back over it. (Stand
  // still and it plays the same step over and over.)
  fidPlayback(box, density, { Shot }) {
    const DELAY = 1.35;
    const STEP = 0.13;
    let now = 0;
    let timer = 0.25;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        now += dt / density;
        if (now > 6.4) return;
        timer -= dt / density;
        if (timer > 0) return;
        timer += STEP;
        // The step it heard: a ring now, a note later.
        bullets.push(new Shot({ x: soul.x, y: soul.y, harmless: true, art: 'fidMark', life: DELAY - 0.05 }));
        bullets.push(new Shot({ x: soul.x, y: soul.y, warn: DELAY, art: 'fidNote', life: 0.4 }));
      },
    };
  },

  // The phrase: five staff lines across the box. It plays a short phrase,
  // the notes appearing on the staff one by one, quietly. Then it stops,
  // listens, and nods, and plays the same phrase again, properly: each note
  // in the same place, in the same rhythm, bursts into a ring of little
  // notes. Learn the tune the first time. Two phrases, the second longer.
  fidPhrase(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const BEAT = 0.26;
    const WAIT = 0.75;
    const lines = [0, 1, 2, 3, 4].map((i) => box.y + 16 + i * 12);
    let t = 0;
    let n = 0;
    let started = false;
    const events = [];
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const e of events) {
          if (e.done || t / density < e.at) continue;
          e.done = true;
          if (e.quiet) {
            bullets.push(new Shot({ x: e.note.x, y: e.note.y, harmless: true, art: 'fidNote', life: e.life }));
            continue;
          }
          const turn = rand(0, Math.PI);
          for (let j = 0; j < 5; j++) {
            const a = turn + (j / 5) * Math.PI * 2;
            bullets.push(new Shot({ x: e.note.x, y: e.note.y, vx: Math.cos(a) * 42, vy: Math.sin(a) * 42, warn: 0.3, art: 'fidEcho', life: 1.1 }));
          }
        }
        if (!started) {
          started = true;
          bullets.push(new Deco({
            life: 7.8,
            under: true,
            paint: (ctx) => {
              ctx.fillStyle = '#6a583c';
              for (const y of lines) ctx.fillRect(box.x + 2, y, box.w - 4, 1);
            },
          }));
        }
        if (n >= 2 || t < T(0.2 + n * 3.6)) return;
        const count = 5 + n;
        n++;
        // A phrase that walks across the box near you, note by note.
        let x = clamp(soul.x - 26, box.x + 8, box.x + box.w - 8 - (count - 1) * 9);
        const notes = [];
        for (let i = 0; i < count; i++) {
          const near = Math.min(4, Math.max(0, Math.round((soul.y - lines[0]) / 12)));
          const line = Math.min(4, Math.max(0, near + Math.floor(rand(-2, 3))));
          // Some notes sit between the lines.
          const y = lines[line] + (Math.random() < 0.4 ? 6 : 0);
          notes.push({ x, y: Math.min(y, box.y + box.h - 6) });
          x += 9 + rand(-1, 2);
        }
        const born = t / density;
        notes.forEach((note, i) => {
          // First time round: just the note, quietly, on its beat.
          events.push({ at: born + i * BEAT, note, quiet: true, life: (count - i) * BEAT + WAIT + 0.1 });
          // Second time: the same note, on the same beat, for real.
          // (The note sounds a moment before it bursts: it flickers there.)
          events.push({ at: born + count * BEAT + WAIT + i * BEAT - 0.3, note });
        });
      },
    };
  },
};
