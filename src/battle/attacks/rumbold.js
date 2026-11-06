import { defineBulletArt } from '../projectiles.js';
import {
  Spot, Trapdoor, Pendulum, SwordDive, PuppetHook, ControlBar, CardboardMole, DropCurtain,
  Popper, ClapHand, Sandbag, drawPaw,
} from './rumboldBullets.js';

// KING PEPTUP's attacks, the show (phase 1 of his fight, src/data/enemies/rumbold.js).
// A royal duel staged as a show, so everything he throws is stage business:
//
//   rumboldSpotlights   follow-spots hunting you, and sweeping pools of light
//   rumboldTrapdoors    hatches banging open in the floor, boxing gloves on springs
//   rumboldSwords       prop swords swinging and dropping on strings
//   rumboldConfetti     party poppers: confetti and streamers that cut
//   rumboldStrings      puppet strings with hooks that reel you in, and control bars
//   rumboldChorus       a chorus line of cardboard moles, kicking
//   rumboldApplause     the CHEER sign: notes, and white gloves that clap on you
//   rumboldCurtain      a curtain drops over half the box; sandbags fall behind it
//   rumboldFinale       fireworks, and the grand TA-DA
//
// The same show after his jaw jams, falling apart, is in rumboldBroken.js,
// which borrows the builders below (each takes `{ broken }`).
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`
// (see dummy.js). `density` speeds up an attack's own clock, so every one
// keeps `real` time (time / density) for its schedule and its end. The cut-
// able parts (strings, sword cords) are for the CUT THE STRING ability the
// duel gives your shadow once his jaw jams (src/battle/soulAbilities.js);
// in the show they're only things to dodge.

// A mark on the floor: where a thing is about to land.
defineBulletArt('rumMark', {
  frames: [['r...r', '.r.r.', '..r..', '.r.r.', 'r...r']],
  palette: { r: '#ff3a5a' },
  radius: 1,
});

const CONFETTI = ['rumConfR', 'rumConfY', 'rumConfT', 'rumConfB', 'rumConfP'];
const SPARKS = ['rumSparkR', 'rumSparkY', 'rumSparkT', 'rumSparkB', 'rumSparkP', 'rumSparkW'];

// What the builders are given.
const clampX = (box, x, pad = 7) => Math.min(Math.max(x, box.x + pad), box.x + box.w - pad);

// Keeps `last` drawn on top of everything else in the list (a curtain over
// what's behind it).
function toFront(bullets, last) {
  const i = bullets.indexOf(last);
  if (i >= 0 && i < bullets.length - 1) bullets.push(...bullets.splice(i, 1));
}

// --- Spotlights ---

// FOLLOW-SPOT: one pool of light creeps after you wherever you stand, so
// standing still gets you caught; and pools sweep the box down lanes shown
// first as a faint band. Stay out of the light. Every couple of seconds the
// operator changes the follow-spot's gel: it goes dark and stops for a
// moment (a breath to slip past it) and blinks before it's back on, in a
// new colour. (So it can't pin you in a corner while a sweep comes.)
export function spotlights(box, density, { rand, pick, shuffleBag }, { broken = false } = {}) {
  let real = 0;
  let next = 1.2;
  const rigY = box.y - 22;
  const rigs = [box.x + 4, box.x + box.w / 2, box.x + box.w - 4];
  const lane = shuffleBag([0, 1, 2, 3]);
  let flip = Math.random() < 0.5;
  let started = false;
  let hunter = null;
  const R = broken ? 11 : 13;

  const huntMove = (s, dt) => {
    const t = s.target;
    if (!t) return;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const d = Math.hypot(dx, dy) || 1;
    // (Even the dying one gathers itself and gets to the far corner.)
    const speed = (broken ? 14 : 16) + Math.min(broken ? 7 : 5, Math.max(0, s.age - s.warn) * 2.5);
    s.x += (dx / d) * speed * dt;
    s.y += (dy / d) * speed * dt;
  };
  // Lit 1.5s, then 0.65s dark changing the gel: how long it has left dark.
  const GEL_LIT = 1.5;
  const GEL_DARK = 0.65;
  const gelChange = (t) => {
    const c = t % (GEL_LIT + GEL_DARK);
    return c >= GEL_LIT ? GEL_LIT + GEL_DARK - c : 0;
  };
  // A bulb that's dying: on for a bit, sputtering out, back on.
  const dying = (t) => ((t * 1.3) % 2.4) < 1.5 && !(t % 0.9 > 0.78);

  return {
    duration: 7.6,
    update: (dt, bullets, soul) => {
      const rdt = dt / density;
      real += rdt;
      if (!started) {
        started = true;
        // The follow-spot comes on at a corner away from you.
        const sx = soul.x < box.x + box.w / 2 ? box.x + box.w - 14 : box.x + 14;
        const sy = soul.y < box.y + box.h / 2 ? box.y + box.h - 14 : box.y + 14;
        bullets.push(hunter = new Spot({
          x: sx, y: sy, r: R + 2, warn: 1.1, life: broken ? 5.6 : 5.0, rig: { x: box.x + box.w / 2, y: rigY }, color: '255, 244, 200',
          move: huntMove, flicker: broken ? dying : null, target: soul,
          rest: broken ? null : gelChange, gels: ['255, 244, 200', '255, 170, 200', '170, 230, 255', '255, 220, 140'],
        }));
      }
      if (real >= next && real < 6.0) {
        next += (broken ? 2.6 : 1.8);
        const horizontal = (flip = !flip);
        const lanePos = (l) => (horizontal ? box.y : box.x) + 12 + (l / 3) * ((horizontal ? box.h : box.w) - 24);
        let pos = lanePos(lane());
        // Never down the lane you're in while the follow-spot is on top of
        // you: that's a pin with no way out.
        const close = hunter && Math.hypot(hunter.x - soul.x, hunter.y - soul.y) < 42;
        for (let tries = 0; close && tries < 3 && Math.abs(pos - (horizontal ? soul.y : soul.x)) < R + 6; tries++) pos = lanePos(lane());
        const dir = Math.random() < 0.5 ? 1 : -1;
        const span = horizontal ? box.w : box.h;
        const start = (horizontal ? box.x : box.y) + (dir > 0 ? -R : span + R);
        const end = (horizontal ? box.x : box.y) + (dir > 0 ? span + R : -R);
        const speed = broken ? 34 : 46;
        const gel = pick(['255, 150, 190', '150, 230, 255', '255, 230, 130', '200, 170, 255']);
        const at = horizontal ? { x: start, y: pos } : { x: pos, y: start };
        const to = horizontal ? { x: end, y: pos } : { x: pos, y: end };
        const travel = Math.abs(end - start) / speed;
        bullets.push(new Spot({
          x: at.x, y: at.y, r: R, warn: 0.95, life: travel, rig: { x: rigs[Math.floor(Math.random() * 3)], y: rigY }, color: gel,
          path: { x1: at.x, y1: at.y, x2: to.x, y2: to.y },
          flicker: broken ? (t) => (t * 1.9) % 1.6 < 1.0 : null,
          move: (s, mdt) => {
            s.x += ((to.x - at.x) / travel) * mdt;
            s.y += ((to.y - at.y) / travel) * mdt;
          },
        }));
        if (!broken && Math.random() < 0.2) {
          // A pincer: another pool from the other end of the same lane.
          bullets.push(new Spot({
            x: to.x, y: to.y, r: R, warn: 0.95, life: travel, rig: { x: rigs[1], y: rigY }, color: gel,
            path: { x1: to.x, y1: to.y, x2: at.x, y2: at.y },
            move: (s, mdt) => {
              s.x += ((at.x - to.x) / travel) * mdt;
              s.y += ((at.y - to.y) / travel) * mdt;
            },
          }));
        }
      }
    },
  };
}

// --- Trapdoors ---

// TRAPDOORS: the floor of the box is sixteen hatches. They blink red, then
// bang open with a boxing glove on a spring in each. Waves of them: a row, a
// column, a checkerboard, a scatter, and the one under your feet.
export function trapdoors(box, density, { rand, pick }, { broken = false } = {}) {
  const N = 4;
  const cw = box.w / N;
  const ch = box.h / N;
  let real = 0;
  let next = 0.4;
  const cell = (c, r, opts = {}) => new Trapdoor({
    x: box.x + c * cw, y: box.y + r * ch, w: cw, h: ch,
    warn: broken ? 1.1 : 0.85, life: broken ? 0.7 : 0.9, ...opts,
  });
  const free = (taken, c, r) => !taken.some(([tc, tr]) => tc === c && tr === r);
  return {
    duration: 7.6,
    update: (dt, bullets, soul) => {
      real += dt / density;
      if (real < next || real > 6.1) return;
      next += (broken ? 1.9 : 1.35);
      const cells = [];
      const sc = Math.min(N - 1, Math.max(0, Math.floor((soul.x - box.x) / cw)));
      const sr = Math.min(N - 1, Math.max(0, Math.floor((soul.y - box.y) / ch)));
      const gapC = Math.floor(Math.random() * N);
      const gapR = Math.floor(Math.random() * N);
      const kind = broken ? pick(['scatter', 'under']) : pick(['row', 'column', 'checker', 'scatter', 'under', 'scatter']);
      if (kind === 'row') {
        const r = Math.floor(Math.random() * N);
        for (let c = 0; c < N; c++) if (c !== gapC) cells.push([c, r]);
        // And the row beside it, a different gap.
        const r2 = (r + 2) % N;
        for (let c = 0; c < N; c++) if (c !== (gapC + 2) % N) cells.push([c, r2]);
      } else if (kind === 'column') {
        const c = Math.floor(Math.random() * N);
        for (let r = 0; r < N; r++) if (r !== gapR) cells.push([c, r]);
        const c2 = (c + 2) % N;
        for (let r = 0; r < N; r++) if (r !== (gapR + 2) % N) cells.push([c2, r]);
      } else if (kind === 'checker') {
        // (The half with your hatch in it: step off sideways. The other
        // half plus yours would leave only corners to squeeze past.)
        const parity = (sc + sr) % 2;
        for (let c = 0; c < N; c++) for (let r = 0; r < N; r++) if ((c + r) % 2 === parity) cells.push([c, r]);
      } else {
        const n = broken ? 3 : 6;
        while (cells.length < n) {
          const c = Math.floor(Math.random() * N);
          const r = Math.floor(Math.random() * N);
          if (free(cells, c, r)) cells.push([c, r]);
        }
      }
      // And the one you're standing on (stillness is no answer), unless that
      // would leave no way across.
      if (kind === 'under' || (kind !== 'checker' && Math.random() < 0.6 && cells.length < 9)) {
        if (free(cells, sc, sr)) cells.push([sc, sr]);
      }
      if (cells.length > 10) cells.length = 10;
      // If yours opens, one hatch beside it (not just a corner) always stays
      // shut, to step onto.
      if (!free(cells, sc, sr)) {
        const beside = [[sc - 1, sr], [sc + 1, sr], [sc, sr - 1], [sc, sr + 1]].filter(([c, r]) => c >= 0 && r >= 0 && c < N && r < N);
        if (beside.every(([c, r]) => !free(cells, c, r))) {
          const [c, r] = beside[Math.floor(Math.random() * beside.length)];
          cells.splice(cells.findIndex(([tc, tr]) => tc === c && tr === r), 1);
        }
      }
      for (const [c, r] of cells) bullets.push(cell(c, r));
    },
  };
}

// --- Prop swords ---

// PROP SWORDS: swords on strings swing across the box like pendulums, and now
// and then one is dropped down a lane (the lane blinks first). They're
// cardboard and foil, and they still cut. Snip the string and the sword falls.
export function swords(box, density, { rand }) {
  let real = 0;
  let nextDive = 2.0;
  let started = false;
  // Which way you've been heading: the dives lead you a little, so running
  // one way along the wall doesn't outrun them. Turn back and they miss.
  let lastX = null;
  let drift = 0;
  return {
    duration: 7.6,
    update: (dt, bullets, soul) => {
      real += dt / density;
      if (lastX !== null && dt > 0) drift += ((soul.x - lastX) / dt - drift) * Math.min(1, dt * 4);
      lastX = soul.x;
      if (!started) {
        started = true;
        // One of the three is hung short, its blade sweeping the top of the
        // box, so there's no ducking up under the swing.
        const short = Math.floor(Math.random() * 3);
        [[0.2, 52, 2.7, 0.0], [0.5, 48, 3.1, 2.1], [0.8, 56, 2.4, 4.2]].forEach(([u, length, period, phase], i) => {
          bullets.push(new Pendulum({
            px: box.x + box.w * u, py: box.y - 8, length: i === short ? 13 : length, swing: i === short ? 1.05 : 0.9, period: i === short ? 2.2 : period, phase, warn: 1.0, life: 6.2,
          }));
        });
      }
      if (real >= nextDive && real < 6.0) {
        nextDive += 1.5;
        const lead = Math.max(-40, Math.min(40, drift * 0.55));
        const x = clampX(box, soul.x + lead + rand(-3, 3), 8);
        bullets.push(new SwordDive({ x, top: box.y - 12, bottom: box.y + box.h, warn: 0.85, speed: 150 }));
      }
    },
  };
}

// --- Confetti ---

// CONFETTI THAT CUTS: party poppers in the walls of the box turn to follow
// you, lock (they shake, and show the spread), and go off in a fan down the
// line they locked on, with a streamer that lashes after; and foil rains
// from the rig. Every piece has an edge.
export function confetti(box, density, { Shot, Line, rand, pick, every }, { broken = false } = {}) {
  let real = 0;
  let nextPop = 0.5;
  const pops = [];
  // (Each piece of the rain glints at the top of the box a moment first.)
  const rain = every(broken ? 0.7 : 0.3, broken ? 0.9 : 0.4, (bullets) => {
    bullets.push(new Shot({
      x: rand(box.x + 4, box.x + box.w - 4), y: box.y + 2, vy: rand(16, 26), vx: rand(-6, 6), warn: 0.35, life: 6,
      wobble: { amplitude: 3, frequency: rand(4, 7) }, art: pick(CONFETTI),
    }));
  }, { first: 0.4 });
  return {
    duration: 7.6,
    update: (dt, bullets, soul) => {
      const rdt = dt / density;
      real += rdt;
      if (real < 6.1) rain(dt, bullets);
      if (real >= nextPop && real < 6.0) {
        nextPop += broken ? 1.5 : 0.85;
        const left = Math.random() < 0.5;
        const x = left ? box.x - 2 : box.x + box.w + 2;
        // Never point-blank: on the wall you're hugging, it goes in well
        // above or below you.
        let y = rand(box.y + 12, box.y + box.h - 12);
        const near = Math.abs(soul.x - x) < 34;
        for (let tries = 0; near && tries < 6 && Math.abs(y - soul.y) < 30; tries++) y = rand(box.y + 12, box.y + box.h - 12);
        const popper = new Popper({ x: left ? x + 2 : x - 2, y, left, soul, warn: 0.75, lock: broken ? 0.4 : 0.36 });
        bullets.push(popper);
        pops.push({ at: real + 0.75, x, y, left, popper });
      }
      while (pops.length && real >= pops[0].at) {
        const { x, y, left, popper } = pops.shift();
        // It fires the way it locked: move once it's shaking and it misses.
        const aim = popper.aim;
        const n = broken ? 4 : 7;
        for (let i = 0; i < n; i++) {
          const a = aim + (i - (n - 1) / 2) * (broken ? 0.4 : 0.16) + rand(-0.03, 0.03);
          const speed = rand(66, 80) * (broken ? 0.55 : 1);
          bullets.push(new Shot({
            x: x + (left ? 6 : -6), y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -16, gravity: broken ? 40 : 20,
            life: 2.4, wobble: { amplitude: 1, frequency: 9 }, art: pick(CONFETTI),
          }));
        }
        if (!broken) {
          // The streamer, lashing out after the soul.
          bullets.push(new Line({
            x: x + (left ? 6 : -6), y, angle: aim + rand(-0.15, 0.15), length: 66, thickness: 2, warn: 0.4, life: 0.4, grow: 190,
            color: pick(['#ff5470', '#ffd25e', '#4fe3d0', '#7ab8ff']), dash: [3, 2],
          }));
        }
      }
    },
  };
}

// --- Puppet strings ---

// PUPPET STRINGS: strings come down from the rig with brass hooks that
// steer after your shadow. A hook that catches it reels it back up toward the
// rig, and puppeteer's control bars slide down the strings to meet it. Fight the
// pull, or SNIP the string (SHIFT) and you're free.
export function strings(box, density, { rand, pick }, { broken = false } = {}) {
  let real = 0;
  let nextHook = 0.3;
  let nextBar = 1.8;
  const hooks = [];
  const TUG = broken ? 24 : 40;
  const top = box.y - 14;
  return {
    duration: 7.8,
    update: (dt, bullets, soul) => {
      const rdt = dt / density;
      real += rdt;
      if (real >= nextHook && real < 5.4) {
        nextHook += broken ? 2.1 : 2.4;
        if (hooks.filter((h) => h.cuttable).length < (broken ? 3 : 2)) {
          const x0 = box.x + 8 + Math.random() * (box.w - 16);
          const hook = new PuppetHook({
            x0, top, soul, speed: broken ? 30 : 36, hold: broken ? 2.0 : 2.4, wander: broken ? 1.2 : 0,
          });
          hooks.push(hook);
          bullets.push(hook);
        }
      }
      // A hook that has you pulls you toward its string's rig.
      for (const hook of hooks) {
        if (hook.state !== 'caught') continue;
        const dx = hook.x0 - soul.x;
        const dy = top - soul.y;
        const d = Math.hypot(dx, dy) || 1;
        soul.x += (dx / d) * TUG * rdt;
        soul.y += (dy / d) * TUG * rdt;
      }
      // (Broken, Tuck can't keep up: fewer bars, slower, a wider gap.)
      if (real >= nextBar && real < 5.8) {
        nextBar += broken ? 2.1 : 1.9;
        const gapW = broken ? 27 : 24;
        let gapX = box.x + 6 + Math.random() * (box.w - 12 - gapW);
        // (Broken, the bar still won't open right over where you're standing:
        // Tuck's hands drift off the mark, so you have to step across.)
        if (broken && soul.x > gapX - 4 && soul.x < gapX + gapW + 4) {
          const left = box.x + 6;
          const right = box.x + box.w - 6 - gapW;
          gapX = soul.x - box.x > box.w / 2 ? Math.max(left, soul.x - gapW - 10 - Math.random() * 14) : Math.min(right, soul.x + 10 + Math.random() * 14);
        }
        bullets.push(new ControlBar({ x: box.x - 2, w: box.w + 4, y: box.y - 6, gapX, gapW, vy: broken ? 30 : 36, top }));
      }
    },
  };
}

// --- The chorus line ---

// THE CHORUS LINE: two rows of cardboard moles march across the box in
// opposite directions, hands on hips, and kick (the leg lifts first) on the
// beat, one row and then the other: in toward the middle, then out at the
// wall, by turns, so watch which way the leg lifts. Between them, now and
// then, the star of the show strides through the middle and kicks straight
// ahead. (Broken, the rows can't keep their line and drift up and down.)
export function chorus(box, density, { rand }, { broken = false } = {}) {
  let real = 0;
  let started = false;
  const PERIOD = broken ? 1.9 : 1.5;
  const rows = [
    { y: box.y + 17, home: box.y + 17, dir: 1, inward: 'down', outward: 'up', offset: 0, state: 0, first: Math.random() < 0.5 },
    { y: box.y + box.h - 17, home: box.y + box.h - 17, dir: -1, inward: 'up', outward: 'down', offset: PERIOD / 2, state: 0, first: Math.random() < 0.5 },
  ];
  rows.forEach((row) => { row.kick = row.first ? row.inward : row.outward; });
  const drift = rand(0, 6.28);
  let nextStar = broken ? 1.5 : 1.6;
  const starLanes = [box.y + 6, box.y + box.h / 2, box.y + box.h - 6].sort(() => Math.random() - 0.5);
  const stateAt = (row) => {
    // Marching, the leg lifted (a warning), the kick, a rest.
    const t = (((real - row.offset) % PERIOD) + PERIOD) % PERIOD;
    if (t < PERIOD * 0.33) return 0;
    if (t < PERIOD * 0.63) return 1;
    if (t < PERIOD * 0.83) return 2;
    return 0;
  };
  return {
    duration: 7.8,
    update: (dt, bullets, soul) => {
      real += dt / density;
      for (const row of rows) {
        // In, out, in, out: the way changes between kicks, never mid-lift.
        const beat = Math.floor((real - row.offset) / PERIOD);
        row.kick = (beat % 2 === 0) === row.first ? row.inward : row.outward;
        if (broken) row.y = row.home + Math.sin(real * 1.4 + drift + row.dir) * 7 * row.dir;
      }
      if (broken) {
        for (const b of bullets) if (b instanceof CardboardMole && b.row.home !== undefined && !(b.flop > 0)) b.y = b.row.y;
      }
      if (!started) {
        started = true;
        const speed = broken ? 20 : 27;
        rows.forEach((row) => {
          // (The show's line is full, shoulder to shoulder; the broken one has gaps.)
          const n = broken ? 4 : 4;
          const gap = broken ? 30 : 25;
          for (let i = 0; i < n; i++) {
            const x = row.dir > 0 ? box.x - 10 - i * gap : box.x + box.w + 10 + i * gap;
            bullets.push(new CardboardMole({
              x, y: row.y, vx: row.dir * speed, kick: row.kick, row,
              // (In the broken show, one of them trips over his own feet.)
              flopAt: broken && i === 1 ? 2.6 + row.dir * 0.3 + rand(0, 1) : null,
              // (And you can see the paws holding them up.)
              paw: broken,
            }));
          }
        });
      }
      for (const row of rows) row.state = stateAt(row);
      if (real >= nextStar && real < 5.4) {
        nextStar += broken ? 1.9 : 1.6;
        const dir = Math.random() < 0.5 ? 1 : -1;
        const born = real;
        // He kicks once, along the top, the middle or the bottom of the box,
        // a different one each time. (Broken, he's late on his cue, and slow.)
        const starRow = {
          // (Broken, he's found his mark: the lane you're standing in.)
          y: broken && soul ? [box.y + 6, box.y + box.h / 2, box.y + box.h - 6].sort((p, q) => Math.abs(p - soul.y) - Math.abs(q - soul.y))[0] : (starLanes.shift() ?? box.y + box.h / 2),
          get state() {
            const t = real - born;
            return t < 0.5 ? 0 : t < 1.0 ? 1 : t < 1.3 ? 2 : 0;
          },
        };
        const mole = new CardboardMole({
          x: dir > 0 ? box.x - 10 : box.x + box.w + 10, y: starRow.y, vx: dir * (broken ? 30 : 38), kick: dir > 0 ? 'right' : 'left', row: starRow,
        });
        bullets.push(mole);
      }
    },
  };
}

// --- The CHEER sign ---

// THE CHEER SIGN: a sign over the box lights up CHEER! or CLAP!. CHEER!
// sends a fan of horn blasts down at you, twice. CLAP! shows rows blinking
// across the box, and white-gloved hands rush in from both walls along
// them and slam together. Get off the rows.
//
// (Broken, the sign hangs crooked off one chain, half its bulbs dead, and a
// stagehand's paw holds it up on a stick from below.)
export class CheerSign {
  constructor({ box, broken = false }) {
    this.box = box;
    this.broken = broken;
    this.x = box.x + box.w / 2;
    this.y = box.y + 8;
    this.word = 'CHEER';
    this.age = 0;
    this.flash = 0;
    this.dmg = null;
    this.grazed = false;
  }

  say(word) { this.word = word; this.flash = 0.7; }
  update(dt) { this.age += dt; this.flash = Math.max(0, this.flash - dt); }
  isGone() { return false; }
  edgeDistance() { return Infinity; }

  draw(ctx) {
    const w = 46;
    const h = 11;
    ctx.save();
    if (this.broken) {
      // Crooked off its one chain, and swinging a little; a paw on a stick
      // shoves it back up now and then.
      const tilt = 0.14 + Math.sin(this.age * 1.6) * 0.05;
      ctx.fillStyle = '#8a8070';
      for (let i = 0; i < 6; i++) ctx.fillRect(Math.round(this.x + w / 2 - 3), Math.round(this.box.y - 6 + i * 2), 1, 1);
      ctx.translate(this.x + w / 2 - 3, this.y - h / 2);
      ctx.rotate(tilt);
      ctx.translate(-(this.x + w / 2 - 3), -(this.y - h / 2));
      const stickX = Math.round(this.x - w / 2 + 8);
      const push = Math.max(0, Math.sin(this.age * 2.3)) * 2;
      ctx.fillStyle = '#6a4628';
      ctx.fillRect(stickX, Math.round(this.y + h / 2 - push), 1, 14);
      drawPaw(ctx, stickX, this.y + h / 2 + 9 - push, { t: this.age });
    }
    const x = Math.round(this.x - w / 2);
    const y = Math.round(this.y - h / 2);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#1a0f18';
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = this.flash > 0 && Math.floor(this.age * 14) % 2 ? '#ffe9a0' : '#c89a5e';
    ctx.fillRect(x, y, w, h);
    // The bulbs chasing round the border.
    for (let i = 0; i < w; i += 4) {
      const dead = this.broken && (i * 7) % 3 === 0;
      const on = !dead && Math.floor(this.age * 8 + i / 4) % 3 === 0;
      ctx.fillStyle = on ? '#fff6c0' : dead ? '#4a3420' : '#8a6234';
      ctx.fillRect(x + i, y, 2, 1);
      ctx.fillRect(x + i + 2, y + h - 1, 2, 1);
    }
    // The word, in capitals made of dots.
    ctx.fillStyle = '#e0344e';
    const letters = this.word + '!';
    let cx = x + Math.round((w - letters.length * 5) / 2) + 1;
    for (const ch of letters) {
      for (const [dx, dy] of (GLYPHS[ch] ?? [])) ctx.fillRect(cx + dx, y + 3 + dy, 1, 1);
      cx += 5;
    }
    ctx.restore();
  }
}
// 4x5 dot-letters for the sign.
const GLYPHS = Object.fromEntries(Object.entries({
  C: ['.XX.', 'X...', 'X...', 'X...', '.XX.'],
  H: ['X..X', 'X..X', 'XXXX', 'X..X', 'X..X'],
  E: ['XXX.', 'X...', 'XX..', 'X...', 'XXX.'],
  R: ['XXX.', 'X..X', 'XXX.', 'X.X.', 'X..X'],
  L: ['X...', 'X...', 'X...', 'X...', 'XXX.'],
  A: ['.XX.', 'X..X', 'XXXX', 'X..X', 'X..X'],
  P: ['XXX.', 'X..X', 'XXX.', 'X...', 'X...'],
  '!': ['.X..', '.X..', '.X..', '....', '.X..'],
}).map(([ch, rows]) => [ch, rows.flatMap((row, y) => [...row].map((c, x) => (c === 'X' ? [x, y] : null)).filter(Boolean))]));

export function applause(box, density, { Shot, rand, pick }, { broken = false } = {}) {
  let real = 0;
  let next = 0.4;
  let count = 0;
  let sign = null;
  let stutter = null;
  const events = [];
  // Which way you've been heading, up or down: the clap leads you a row.
  let lastY = null;
  let driftY = 0;
  return {
    duration: 7.8,
    update: (dt, bullets, soul) => {
      real += dt / density;
      if (lastY !== null && dt > 0) driftY += ((soul.y - lastY) / dt - driftY) * Math.min(1, dt * 4);
      lastY = soul.y;
      if (!sign) {
        sign = new CheerSign({ box, broken });
        bullets.push(sign);
      }
      // (Broken, the sign is stuck on CLAP: now and then it tries to change,
      // gets as far as CHE, and sticks again.)
      if (broken && stutter !== null && real >= stutter) {
        sign.word = sign.word === 'CLAP' ? 'CHE' : 'CLAP';
        stutter = sign.word === 'CHE' ? real + 0.18 : null;
      }
      if (real >= next && real < 6.0) {
        next += broken ? 1.75 : 1.55;
        count++;
        const clap = broken || count % 2 === 1;
        sign.say(clap ? 'CLAP' : 'CHEER');
        if (broken && Math.random() < 0.6) stutter = real + 0.95;
        if (clap) {
          // Rows across the box: where you stand, and either side of it. The
          // gloves wait at the walls with the rows dotted across and a mark
          // where they'll meet (where you are now), then rush in and CLAP.
          // (Up under the sign is no hiding place: the row you're on comes
          // for you wherever you are; the ones either side, only if they fit.)
          const own = Math.min(Math.max(soul.y, box.y + 5), box.y + box.h - 4);
          // (Broken there's one row, and a second where you're heading, if
          // you're on the move.)
          // (Not on the move, the second row is laid on the roomier side, so a
          // circle round the box can't just outrun the claps.)
          const roomy = soul.y - box.y > box.h / 2 ? -1 : 1;
          const ahead = Math.abs(driftY) > 20 ? [soul.y + Math.sign(driftY) * 22, soul.y + driftY * 0.7] : [soul.y + roomy * 22];
          const rows = broken ? [own, ...ahead] : [own, soul.y - 26, soul.y + 26];
          const useRows = rows.filter((y, i) => i === 0 || (y > box.y + 14 && y < box.y + box.h - 3));
          const target = clampX(box, soul.x, 8);
          const speed = broken ? 108 : 96;
          // (The nearer glove comes slower, so the pair meet together.)
          const fromL = Math.max(1, target - (box.x + 4));
          const fromR = Math.max(1, box.x + box.w - 4 - target);
          const far = Math.max(fromL, fromR);
          for (const y of useRows) {
            const pair = [
              new ClapHand({ x: box.x + 4, y, toX: target, warn: broken ? 0.95 : 0.75, speed: speed * (fromL / far), mark: true }),
              new ClapHand({ x: box.x + box.w - 4, y, toX: target, warn: broken ? 0.95 : 0.75, speed: speed * (fromR / far) }),
            ];
            // (Broken, the marked spot follows you while the gloves wait, then
            // locks as they set off: the warning is longer, the rush is quick.)
            if (broken) for (const h of pair) { h.dy = y - own; h.track = true; }
            bullets.push(...pair);
          }
        } else {
          events.push({ at: real + 0.3, kind: 'cheer', n: 0 });
          events.sort((a, b) => a.at - b.at);
        }
      }
      if (broken) {
        for (const b of bullets) {
          if (!b.track || b.age >= b.warn) continue;
          b.y = Math.min(Math.max(soul.y, box.y + 5), box.y + box.h - 4) + b.dy;
          b.toX = clampX(box, soul.x, 8);
        }
      }
      while (events.length && real >= events[0].at) {
        const event = events.shift();
        // A fan of blasts from the sign, aimed down at you, twice: the first
        // goes either side of you, the second (half a gap round) at you, so
        // take a step after the first. Each note hangs a beat by the sign,
        // blinking, then blooms out slowly and picks up speed.
        const aim = Math.atan2(soul.y - sign.y, soul.x - sign.x);
        const n = broken ? 3 : 6;
        for (let i = 0; i < n; i++) {
          const a = aim + (i - (n - 1) / 2) * 0.34 + (event.n ? 0.17 : 0);
          bullets.push(new Shot({ x: sign.x + Math.cos(a) * 6, y: sign.y + 4 + Math.sin(a) * 4, vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, accel: 60, warn: 0.3, life: 3, art: 'rumNote' }));
        }
        if (!event.n) {
          events.push({ at: real + 0.45, kind: 'cheer', n: 1 });
          events.sort((a, b) => a.at - b.at);
        }
      }
    },
  };
}

// --- The curtain ---

// CURTAIN DROP: three sandbags are marked on the floor, and a velvet curtain
// drops over half the box and hides them (its hem hurts on the way down:
// step out from under it, then back in). They fall one after another, where
// they were marked, and thump on the boards. Confetti and the odd loose
// sandbag come down on the open side. (Remember the marks.) Broken, one bag
// gets away early, and the curtain sticks halfway with a paw tugging at it.
export function curtain(box, density, { Shot, rand, pick, every }, { broken = false } = {}) {
  let real = 0;
  let started = false;
  let drape = null;
  const left = Math.random() < 0.5;
  const half = box.w / 2;
  const spans = left ? [box.x + 6, box.x + half - 6] : [box.x + half + 6, box.x + box.w - 6];
  const cols = [];
  const events = [];
  const rain = every(0.4, 0.55, (bullets) => {
    // (Right up to the curtain's hem: there's no hiding in the seam.)
    const openMin = left ? box.x + half : box.x;
    bullets.push(new Shot({ x: rand(openMin + (left ? -3 : 4), openMin + half + (left ? -4 : 3)), y: box.y + 2, vy: rand(20, 32), warn: 0.35, life: 5, wobble: { amplitude: 2, frequency: 6 }, art: pick(CONFETTI) }));
  }, { first: 0.4 });
  return {
    duration: 8.0,
    update: (dt, bullets) => {
      real += dt / density;
      if (!started) {
        started = true;
        // Three columns under the curtain, one in each third (in a random order).
        const n = broken ? 2 : 3;
        const lane = (spans[1] - spans[0]) / n;
        for (let i = 0; i < n; i++) cols.push(spans[0] + (i + 0.5) * lane + rand(-2.5, 2.5));
        cols.sort(() => Math.random() - 0.5);
        cols.forEach((x) => bullets.push(new Shot({ x, y: box.y + box.h - 7, harmless: true, life: 1.4, art: 'rumMark' })));
        drape = new DropCurtain({ box, side: left ? 'left' : 'right', stuck: broken ? 0.58 : null });
        bullets.push(drape);
        events.push({ at: 1.3, kind: 'drop' });
        for (let i = 0; i < (broken ? 4 : 8); i++) events.push({ at: 2.1 + i * (broken ? 0.9 : 0.55), kind: 'bag', x: cols[i % cols.length] });
        events.push({ at: 6.6, kind: 'raise' });
        if (broken) {
          // One gets away early, before the curtain's even down, on the
          // open side (it's marked: whoever let go shouted).
          const x = rand(left ? box.x + half + 8 : box.x + 8, left ? box.x + box.w - 8 : box.x + half - 8);
          events.push({ at: 0.2, kind: 'mark', x });
          events.push({ at: 0.85, kind: 'bag', x });
        } else {
          // The loose ones on the open side, shown first; one of them right
          // down the curtain's hem, where it's easiest to stand and wait.
          const seam = Math.random() < 0.5 ? 0 : 1;
          [3.0, 4.6, 5.4].forEach((at, i) => {
            const x = i === seam
              ? box.x + half + rand(-2, 2)
              : rand(left ? box.x + half + 6 : box.x + 6, left ? box.x + box.w - 6 : box.x + half - 6);
            events.push({ at: at - 0.8, kind: 'mark', x });
            events.push({ at, kind: 'bag', x });
          });
        }
      }
      if (real < 6.3) rain(dt, bullets);
      while (events.length && real >= events.sort((a, b) => a.at - b.at)[0].at) {
        const event = events.shift();
        if (event.kind === 'drop') drape.drop(1.2);
        else if (event.kind === 'raise') drape.raise(2);
        else if (event.kind === 'mark') bullets.push(new Shot({ x: event.x, y: box.y + box.h - 7, harmless: true, life: 0.8, art: 'rumMark' }));
        else bullets.push(new Sandbag({ x: event.x, y: box.y - 6, floor: box.y + box.h, vy: 30 }));
      }
      if (drape) toFront(bullets, drape);
    },
  };
}

// --- The finale ---

// THE GRAND FINALE: fireworks! Rockets go up from the floor (they blink
// first) and burst in rings of sparks high over the box. At the end, TA-DA:
// a great star in the middle, and three rings of sparks with a gap in each.
export function finale(box, density, { Shot, rand, pick, pointAwayFrom }, { broken = false } = {}) {
  let real = 0;
  let next = 0.4;
  const bursts = [];
  const bottom = box.y + box.h + 4;
  let tada = false;
  const gapAt = Math.random() * 6.28;
  const ring = (bullets, x, y, n, speed, turn, gap = null) => {
    const art = pick(SPARKS);
    for (let i = 0; i < n; i++) {
      const a = turn + (i / n) * Math.PI * 2;
      if (gap !== null && Math.abs(((a - gap + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.5) continue;
      bullets.push(new Shot({ x: x + Math.cos(a) * 4, y: y + Math.sin(a) * 4, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -5, gravity: 7, life: 3.4, art }));
    }
  };
  return {
    duration: 8.2,
    update: (dt, bullets, soul) => {
      real += dt / density;
      if (real >= next && real < 5.0) {
        next += broken ? 1.5 : 0.95;
        // A rocket up a lane, the other side from you. (Broken, Tuck can't
        // aim the rack, and it goes up wherever you are: it blinks first.)
        const x = broken ? clampX(box, soul.x, 6) : pointAwayFrom(box, soul, 26, 10).x;
        const stop = box.y + 10 + Math.random() * 22;
        const rise = 95;
        const life = (bottom - stop) / rise;
        bullets.push(new Shot({ x, y: bottom, vy: -rise, warn: 0.65, life, art: 'rumRocket' }));
        bursts.push({ at: real + 0.65 + life, x, y: stop, fizzle: broken && Math.random() < 0.7 });
      }
      if (!tada && real >= 5.0 && !broken) {
        tada = true;
        const cx = box.x + box.w / 2;
        const cy = box.y + 22;
        bullets.push(new Shot({ x: cx, y: cy, harmless: true, life: 1.0, art: 'rumStar' }));
        bursts.push({ at: real + 1.0, x: cx, y: cy, big: 0 });
        bursts.push({ at: real + 1.35, x: cx, y: cy, big: 1 });
        bursts.push({ at: real + 1.7, x: cx, y: cy, big: 2 });
      }
      while (bursts.length && real >= bursts[0].at) {
        const b = bursts.shift();
        if (b.big !== undefined) {
          ring(bullets, b.x, b.y, [14, 18, 22][b.big], [28, 40, 52][b.big], b.big * 0.21, gapAt + b.big * 2.1);
        } else if (b.fizzle) {
          // A dud: a few sparks drooping out of it.
          for (let i = 0; i < 4; i++) {
            bullets.push(new Shot({ x: b.x, y: b.y, vx: rand(-12, 12), vy: rand(-8, 4), gravity: 70, life: 2, art: 'rumSparkW' }));
          }
        } else {
          ring(bullets, b.x, b.y, 11, 34, rand(0, 6));
        }
      }
    },
  };
}

export const RUMBOLD_ATTACKS = {
  rumboldSpotlights: (box, density, tools) => spotlights(box, density, tools),
  rumboldTrapdoors: (box, density, tools) => trapdoors(box, density, tools),
  rumboldSwords: (box, density, tools) => swords(box, density, tools),
  rumboldConfetti: (box, density, tools) => confetti(box, density, tools),
  rumboldStrings: (box, density, tools) => strings(box, density, tools),
  rumboldChorus: (box, density, tools) => chorus(box, density, tools),
  rumboldApplause: (box, density, tools) => applause(box, density, tools),
  rumboldCurtain: (box, density, tools) => curtain(box, density, tools),
  rumboldFinale: (box, density, tools) => finale(box, density, tools),
};
