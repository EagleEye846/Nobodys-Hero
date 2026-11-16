import { Jaw, DanceString, Stamp, TuckSwing, JointRay, Glint, MarionetteString, ControlBar } from './rumboldAliveBullets.js';
import { RUMBOLD_WOOD_ATTACKS } from './rumboldWood.js';
import { SceneryFlat, Sandbag, SandGrain, Batten, GiantHead, GrabHand, FLY_FLOOR } from './rumboldFinaleBullets.js';
import { Shaving, FlungJoint, splinterRing } from './rumboldWood.js';
import { stairClimb, COLUMN, STAIR_SECONDS } from './rumboldStair.js';
import { Line } from '../projectiles.js';
import { sfx } from '../../audio/music.js';
import { sayLine } from '../../audio/voiceClips.js';

// KING PEPTUP's attacks once he's alive (phase 3 of his fight, NO STRINGS;
// src/data/enemies/rumbold.js). Tuck let go of the levers and the puppet kept
// moving: there's a light in him now, and nobody's hand. The show is his, and
// everything he throws is HIM: his own body, his own stuck words, the strings
// he's turned on Tuck.
//
//   rumboldAliveLimbs,  his own body: loose limbs swinging, the face he
//   rumboldAliveGouge,  digs (and wipes), his ball joints, his control bar
//   rumboldAliveJoints, and its strings (all in rumboldWood.js)
//   rumboldAliveCrossbar
//   rumboldAliveJaw     the box is in his mouth: the lower teeth snap up to
//                       bite, three times on the same word; stand where a
//                       tooth is missing (the light shines up through it)
//   rumboldAliveDance   strings catch YOUR shadow and jerk it about on the
//                       beat, toward chalked dance steps where his shoe
//                       stamps: fight the pull, or snip the string (not in
//                       his rotation since 2026-11-09: Working You does it)
//   rumboldAliveTuck    Tuck, hung on three strings, swung through the box
//                       like a trapeze: don't let him hit you, and SNIP his
//                       strings (each one fills MERCY)
//   rumboldAliveLight   the light inside him, shining out through his joints
//                       in rays that turn, and through his eye holes in
//                       rays that follow you
//   rumboldAliveWorkYou he puppets someone else for once: three strings let
//                       down from a little control bar hook YOUR shadow, and
//                       he walks you about onto the chalk marks where his
//                       shoe stamps. Your keys hardly move you while he has
//                       you; each SNIP cuts one string. Cut all three and
//                       you're free, till he lets down three more
//   rumboldAliveTear    his finale, once, at low HP (the phase's `finale`):
//                       everything stops; his head turns slowly right round
//                       on his neck, two eyes dug in it, burning, to look out
//                       past you at whoever is watching. Then his strings
//                       tear the box in two, the stage falls away, and the
//                       fight is up in the fly tower behind it, where he
//                       brings the whole theatre down on you: his eyes'
//                       light hunting you, the painted scenery of his old
//                       show running across on its tracks (stand in the
//                       window), sandbags and a batten of lamps from the
//                       flies, his light and the shavings off him, and
//                       last of all his head, swollen huge in
//                       the middle of it all, while his hands come in from
//                       the wings to grab you (rumboldFinaleBullets.js)
//
// Each attack is `(box, density, tools) => ({ duration, update })` (see
// dummy.js). Like the show's (rumbold.js), each keeps `real` time (dt /
// density) for its timeline; but here `density` does thin the attack out:
// its repeats come `density` times as often (so a layered second wind at a
// quarter density is light).

// (His arms and legs, his digging, his joints and his control bar are in
// rumboldWood.js.)

// --- The jaw ---

export function jaw(box, density) {
  let real = 0;
  let jawBullet = null;
  const COLS = 10;
  // The bites: three to a word ("FRIENDS FRIENDS FRIENDS"), the same gap for
  // the first word, the gap slipping a column a bite on the last.
  const bites = [];
  let gap = 2 + Math.floor(Math.random() * (COLS - 4));
  const wide = (c) => [c, c + 1];
  const shift = (c, by) => Math.min(COLS - 2, Math.max(0, c + by));
  let at = 1.1;
  for (let word = 0; word < 3 && at < 6.9; word++) {
    const warn = word === 0 ? 0.9 : 0.85;
    // (The last word's gap slips each bite, and you only see where once the
    // last bite's teeth start down: those bites can't come much faster, or
    // there's no time to follow it.)
    const step = word === 2 ? 0.7 / Math.min(1.05, density) : 0.58 / Math.min(1.3, density);
    for (let i = 0; i < 3; i++) {
      if (word === 2 && i > 0) gap = shift(gap, Math.random() < 0.5 ? -1 : 1);
      // (The next bite shows as soon as the last one's teeth start down.)
      bites.push({ warnAt: i === 0 ? at - warn : at - step + 0.32, at, gap: wide(gap) });
      at += step;
    }
    // (A breath between words: the new gap shows once the last bite's teeth
    // start down, so this is most of the warning there is to get to it.)
    at += 0.72;
    // A new word: the gap jumps (but not too far to get to).
    const by = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 2));
    gap = shift(gap, by);
  }
  // At a quarter density (a second wind) it's one word, not three.
  if (density < 0.6) bites.length = 3;
  return {
    duration: 7.8,
    update: (dt, bullets) => {
      real += dt / density;
      if (!jawBullet) {
        jawBullet = new Jaw({ box, cols: COLS, regrow: 0.3, painted: true });
        bullets.push(jawBullet);
      }
      // The upper teeth creep down as it goes on (the mouth closing).
      jawBullet.upper = 4 + Math.min(8, real * 1.1);
      // The bite showing: the latest one warned of, unless the one before
      // is still clamped shut.
      const showing = bites.filter((b) => real >= b.warnAt && real < b.at + 0.56);
      jawBullet.bite = showing.length > 1 && real < showing[0].at + 0.32 ? showing[0] : showing[showing.length - 1] ?? null;
      // Keep the jaw's clock on the attack's (its bites are timed in it).
      jawBullet.age = real;
    },
  };
}

// --- The dance ---

export function dance(box, density, { rand }) {
  let real = 0;
  let next = 0.7;
  const every = 1.05 / density;
  const pad = 9;
  const inBox = (p) => ({ x: Math.min(Math.max(p.x, box.x + pad), box.x + box.w - pad), y: Math.min(Math.max(p.y, box.y + pad), box.y + box.h - pad) });
  const strings = [];
  return {
    duration: 7.8,
    update: (dt, bullets, soul) => {
      const rdt = dt / density;
      real += rdt;
      // A string that's caught you, pulling.
      for (const s of strings) {
        if (!s.pulling) continue;
        const d = Math.hypot(s.anchor.x - soul.x, s.anchor.y - soul.y) || 1;
        soul.x += ((s.anchor.x - soul.x) / d) * s.pull * rdt;
        soul.y += ((s.anchor.y - soul.y) / d) * s.pull * rdt;
      }
      if (real < next || real > 6.4) return;
      next += every;
      // Tied somewhere above or to the side, far enough to pull.
      let anchor;
      for (let tries = 0; tries < 8; tries++) {
        const side = Math.floor(Math.random() * 3);
        anchor = side === 0
          ? { x: rand(box.x, box.x + box.w), y: box.y - 14 }
          : { x: side === 1 ? box.x - 14 : box.x + box.w + 14, y: rand(box.y + 8, box.y + box.h - 8) };
        if (Math.hypot(anchor.x - soul.x, anchor.y - soul.y) > 40) break;
      }
      const string = new DanceString({ anchor, soul, warn: 0.6, pull: 92, jerk: 0.3 });
      strings.push(string);
      bullets.push(string);
      // The dance steps: one where it means to put you, and two more, not on
      // you now. Backed into a wall, fighting every pull from there, you get
      // a step of your own, chalked late enough to snip and step off it.
      const landing = inBox(string.landing(soul.x, soul.y));
      bullets.push(new Stamp({ x: landing.x, y: landing.y, warn: 0.95 }));
      const walled = Math.min(soul.x - box.x, box.x + box.w - soul.x, soul.y - box.y, box.y + box.h - soul.y) < 12;
      if (walled) bullets.push(new Stamp({ x: soul.x, y: soul.y, warn: 1.35, flip: true }));
      for (let k = walled ? 1 : 0; k < 2; k++) {
        for (let tries = 0; tries < 10; tries++) {
          const p = { x: rand(box.x + pad, box.x + box.w - pad), y: rand(box.y + pad, box.y + box.h - pad) };
          if (Math.hypot(p.x - soul.x, p.y - soul.y) > 16 && Math.hypot(p.x - landing.x, p.y - landing.y) > 14) {
            bullets.push(new Stamp({ x: p.x, y: p.y, warn: 0.95, flip: k === 1 }));
            break;
          }
        }
      }
    },
  };
}

// --- Tuck on the strings ---

export function tuck(box, density, { rand, Line, pick }) {
  let real = 0;
  let started = false;
  let nextLash = 2.2;
  const every = 1.7 / density;
  return {
    duration: 8.0,
    update: (dt, bullets, soul) => {
      real += dt / density;
      // (After the puppet's lurch: he hauls Tuck out on the strings.)
      if (!started && real >= 0.5) {
        started = true;
        const side = Math.random() < 0.5 ? -1 : 1;
        bullets.push(new TuckSwing({
          pivot: { x: box.x + box.w / 2 + side * 6, y: box.y - 26 }, length: 70, swing: 0.72, period: 2.9 / Math.min(1.2, density),
          phase: side > 0 ? 0 : Math.PI, warn: 0.85, life: 6.2, mercy: 5, scared: true,
        }));
      }
      // And a loose string lashes across now and then, at you.
      if (density > 0.6 && real >= nextLash && real < 6.6) {
        nextLash += every;
        const left = Math.random() < 0.5;
        const y = rand(box.y + 10, box.y + box.h - 6);
        const x = left ? box.x - 4 : box.x + box.w + 4;
        const aim = Math.atan2(soul.y - y, soul.x - x) + rand(-0.12, 0.12);
        bullets.push(new Line({ x, y, angle: aim, length: 92, thickness: 2, warn: 0.6, life: 0.35, grow: 260, color: '#f4ecdc', dash: [4, 2] }));
      }
    },
  };
}

// --- The light, leaking ---

export function light(box, density, { rand }) {
  let real = 0;
  let stage = 0;
  let nextGlint = 0.9;
  const joints = [];
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  // Points on the walls of the box.
  const wall = (side, u) => [
    { x: box.x + box.w * u, y: box.y - 1 },
    { x: box.x + box.w + 1, y: box.y + box.h * u },
    { x: box.x + box.w * u, y: box.y + box.h + 1 },
    { x: box.x - 1, y: box.y + box.h * u },
  ][side];
  return {
    duration: 7.8,
    update: (dt, bullets, soul) => {
      real += dt / density;
      if (stage === 0 && real >= 0.3) {
        stage = 1;
        // Two joints on opposite walls, their rays turning the same way
        // round (a cross wheeling through the box).
        const side = Math.floor(Math.random() * 2);
        const u = rand(0.3, 0.7);
        const spin = (Math.random() < 0.5 ? -1 : 1) * 0.42;
        for (const p of [wall(side, u), wall(side + 2, 1 - u)]) {
          const ray = new JointRay({ x: p.x, y: p.y, angle: Math.atan2(cy - p.y, cx - p.x) + rand(-0.3, 0.3), spin, warn: 0.85, life: 2.4 });
          joints.push(ray);
          bullets.push(ray);
        }
      }
      if (stage === 1 && real >= 3.6) {
        stage = 2;
        // His eye holes, at the top: two rays that follow you, slowly.
        for (const dx of [-16, 16]) {
          const p = { x: cx + dx, y: box.y + 2 };
          const ray = new JointRay({ x: p.x, y: p.y, angle: Math.atan2(soul.y - p.y, soul.x - p.x) + dx * 0.012, target: soul, turn: 0.35, warn: 0.85, life: 2.9, eye: true });
          joints.push(ray);
          bullets.push(ray);
        }
      }
      // Bits of the light leaking out of the joints that are burning.
      if (real >= nextGlint && real < 6.6) {
        nextGlint += 0.55 / density;
        const live = joints.filter((ray) => ray.burning);
        if (live.length) {
          const ray = live[Math.floor(Math.random() * live.length)];
          const a = Math.atan2(cy - ray.y, cx - ray.x) + rand(-0.9, 0.9);
          bullets.push(new Glint({ x: ray.x, y: ray.y, vx: Math.cos(a) * 26, vy: Math.sin(a) * 26, life: 3 }));
        }
      }
    },
  };
}

// --- Working you ---

export function workYou(box, density, { rand }) {
  let real = 0;
  const pad = 9;
  const bar = { x: box.x + box.w / 2 - 7, y: box.y + 5, tilt: 0 };
  let control = null;
  let strings = [];
  let nextGrab = 0.45;
  let nextStep = Infinity;
  let target = null;
  let last = null;
  return {
    duration: 8.2,
    update: (dt, bullets, soul) => {
      // (Real time, like the others: `dt` comes in sped up by the density.)
      const rdt = dt / density;
      real += rdt;
      if (!control) {
        control = new ControlBar({ bar });
        bullets.push(control);
      }
      const hooked = strings.filter((s) => s.hooked).length;
      // While he has you, your own steering is mostly taken off you: what
      // you moved since last time is cut back (the more strings, the more).
      if (last && hooked) {
        const keep = 1 - 0.2 * hooked;
        soul.x = last.x + (soul.x - last.x) * keep;
        soul.y = last.y + (soul.y - last.y) * keep;
      }
      // Three strings let down at a time, from the bar over you.
      const free = strings.every((s) => s.severed || s.done);
      if (free && real >= nextGrab && real < 6.2) {
        const group = { blocked: false };
        strings = [-1, 0, 1].map((slot) => new MarionetteString({ bar, soul, slot, warn: 0.75, group }));
        bullets.push(...strings);
        nextGrab = Infinity;
        nextStep = real + 0.75;
      }
      if (free && strings.length && nextGrab === Infinity) nextGrab = real + 1.5 / Math.min(1.3, density);
      // He walks you to a chalked dance step, and his shoe comes down on it.
      if (hooked && real >= nextStep && real < 6.9) {
        nextStep = real + 1.9;
        for (let tries = 0; tries < 12; tries++) {
          const p = { x: rand(box.x + pad, box.x + box.w - pad), y: rand(box.y + pad + 8, box.y + box.h - pad) };
          if (Math.hypot(p.x - soul.x, p.y - soul.y) > 22) { target = p; break; }
        }
        // (Time to get all three snipped and step off, even from the first
        // cut: it's the scissors that beat this, not quick feet.)
        if (target) bullets.push(new Stamp({ x: target.x, y: target.y, warn: 1.9 }));
      }
      if (!hooked) target = null;
      if (hooked && target) {
        const d = Math.hypot(target.x - soul.x, target.y - soul.y);
        const go = Math.min(d, (22 + 12 * hooked) * rdt);
        if (d > 0.5) {
          soul.x += ((target.x - soul.x) / d) * go;
          soul.y += ((target.y - soul.y) / d) * go;
        }
      }
      // The bar keeps over you, rocking as he works it.
      bar.x += (soul.x - 7 - bar.x) * Math.min(1, rdt * (hooked ? 6 : 2));
      bar.tilt = Math.sin(real * 7) * (hooked ? 0.18 : 0.05);
      // And he lets go at the end.
      if (real > 7.3) {
        strings.forEach((s) => { s.done = true; });
        control.done = true;
      }
      last = { x: soul.x, y: soul.y };
    },
  };
}

// --- His finale: the light sees you ---

// Where he hangs, on the stage (his battlePos in rumbold.js), and where his
// eyes and his chest are once his head has come round (rumboldBattle.js's
// RUMBOLD_STARE, drawn at double size).
const KING = { x: 144, y: 0 };
const EYES = [{ x: KING.x + 80, y: KING.y + 80 }, { x: KING.x + 96, y: KING.y + 80 }];
const CHEST = { x: KING.x + 88, y: KING.y + 104 };
// The whole stage, as the box (inside the edges of the screen).
const STAGE = { x: 3, y: 3, w: 314, h: 158 };
// When it happens: his head comes round, the box tears, the stage is the box.
const TURNED = 2.8;
const TEAR = 3.0;
const OPEN = 3.7;

// The four acts of it, after the box is gone (seconds of the attack):
//   his eyes find you            OPEN+0.3 on (two rays that follow you)
//   the scenery runs             FLATS: painted flats across on their tracks,
//                                one after another from the same wing
//   the flies come down          sandbags at you, and a batten of lamps
//                                swinging down from the side you're on
//   the light                    the light pours out of his chest in three
//                                wheeling rays, and shavings off him drift
//                                down through it
//   the stair                    the tower narrows to a stairwell: the great
//                                stair of his story, painted, every step on
//                                strings. Your shadow turns heavy and climbs
//                                it as it sinks into the Deep, through his
//                                strings, his hand, and the rest; at the top,
//                                a door onto nothing, which falls on you
//                                (rumboldStair.js)
//   the head                     his head comes up off his neck and swells
//                                till it fills the middle of the tower, eyes
//                                on you, jaw clacking under its painted smile,
//                                cocking itself over too far and snapping
//                                back; his hands, grown to match (and with
//                                too many joints), grab at you from the wings
//                                in turn,
//                                and twice clap together across your row
//   the strings                  the head still up, he lets fly with every
//                                string he has: down from the grid at you,
//                                in from both wings, and his eyes' light
//                                wheeling through it all; then his head goes
//                                back onto him
// (Each act has the stage mostly to itself: his eyes are out before the
// first flat runs, the last flat is off the stage before the batten swings,
// and the batten is falling away as the curtain call's rays light.)
const EYES_AT = OPEN + 0.3;
const FLATS = [
  { at: 6.0, picture: 'stair' },
  { at: 7.1, picture: 'hero' },
  { at: 8.2, picture: 'tower' },
];
const FLAT_SPEED = 165;
// From one flat's window to the next: always a move, never a dash.
const HOLE_H = 30;
const HOLE_MOVE = [20, 44];
const BAGS_FROM = 9.6;
const BAGS_TO = 15.0;
const BATTEN_AT = 11.2;
const CALL_AT = 14.4;
const STARS_TO = 16.0;
// The stair: the box narrows to the stairwell (STAIR_AT to STAIR_IN), the
// climb (rumboldStair.js times it from STAIR_IN), and the box opens back out
// to the whole stage as it ends (STAIR_OUT, over a moment).
const STAIR_AT = 18.4;
const STAIR_IN = 19.2;
const STAIR_OUT = STAIR_IN + STAIR_SECONDS;
// The head: up off his neck and swelling (FACE_AT to FACE_GROWN), from where
// his head is on him to the middle of the tower; hung there for the grabs and
// the strings; shrinking back onto him from FACE_BACK.
const FACE_AT = STAIR_OUT + 0.4;
const FACE_GROWN = FACE_AT + 1.3;
const CAGE_AT = FACE_AT + 9.8;
const FACE_BACK = FACE_AT + 17.6;
const FACE_GONE = FACE_BACK + 0.9;
// And once his head is back on him, THE GRAND FINALE (bow, below).
const FINALE_AT = FACE_GONE + 0.6;
const HEAD_ON_HIM = { x: KING.x + 88, y: KING.y + 74, size: 0.55 };
const HEAD_UP = { x: 160, y: 66, size: 4 };
// While it's up it cocks itself over (as far as TILT_MOST, turning), slowly,
// once every TILT_EVERY seconds, and snaps back.
const TILT_MOST = 0.62;
const TILT_EVERY = 3.4;
// His hands, from FACE_AT: each from the side (`side` -1 left, 1 right),
// from the wing or the flies above it (`high`), grabbing at where you are;
// or both at once, clapping across your row. Quicker as it goes.
const GRABS = [
  { at: 1.4, side: -1, warn: 0.85 },
  { at: 2.2, side: 1, warn: 0.85 },
  { at: 2.95, side: -1, high: true, warn: 0.8 },
  { at: 3.65, side: 1, high: true, warn: 0.8 },
  { at: 4.5, clap: true, warn: 0.9 },
  { at: 5.7, side: 1, warn: 0.75 },
  { at: 6.35, side: -1, warn: 0.75 },
  { at: 7.0, side: 1, high: true, warn: 0.72 },
  { at: 7.9, clap: true, warn: 0.85 },
];
// His strings, from CAGE_AT: volleys of them, each string aimed at you as it
// shows (`from`: the grid overhead, or the wings either side), one after
// another `every` seconds apart; and his eyes' light wheeling through.
// (Thinned 2026-11-09: fewer strings a volley, more room between them, a
// longer look at each.)
const CAGE = [
  { at: 0, from: 'grid', count: 5, every: 0.26, warn: 0.7 },
  { at: 1.9, from: 'wings', count: 6, every: 0.22, warn: 0.65 },
  { at: 3.6, rays: true },
  { at: 4.1, from: 'grid', count: 4, every: 0.3, warn: 0.65 },
  { at: 5.6, from: 'both', count: 8, every: 0.17, warn: 0.6 },
];
// It's his last act and everything he has, and it's long: a hit of it hurts
// a little less than his usual (64), so it can be lived through from less
// than full HP. Every piece is still warned before it lands.
// (2026-11-09: 50 to 46, with the long finale thinned out, so a careful
// player comes through it with mistakes to spare.)
const TEAR_DAMAGE = 46;

export function tear(box, density, { rand }) {
  let real = 0;
  let step = 0;
  let flat = 0;
  let nextBag = BAGS_FROM;
  let nextStar = CALL_AT + 0.4;
  let lastHole = null;
  const flatDir = Math.random() < 0.5 ? -1 : 1;
  let head = null;
  let grab = 0;
  let nextSpit = FACE_GROWN + 0.9;
  let spitEye = 0;
  let bite = 0;
  let stair = null;
  let cage = 0;
  let volley = null;
  const finaleAct = bow(box, density, { rand });
  const home = { x: box.x, y: box.y, w: box.w, h: box.h };
  // The box going from one shape to another, as it narrows to the well and
  // opens back out.
  const shape = (from, to, k) => {
    const e = k * k * (3 - 2 * k);
    for (const key of ['x', 'y', 'w', 'h']) box[key] = from[key] + (to[key] - from[key]) * e;
  };
  const often = Math.min(1.3, density);
  const inStage = (p, pad) => ({
    x: Math.min(STAGE.x + STAGE.w - pad, Math.max(STAGE.x + pad, p.x)),
    y: Math.min(STAGE.y + STAGE.h - pad, Math.max(STAGE.y + pad, p.y)),
  });
  // (The battle hands over a new list of bullets each frame: `push` always
  // adds to the latest, so the stair and the hands can keep hold of it.)
  let live = null;
  const push = (bullet, dmg = TEAR_DAMAGE) => {
    bullet.dmg = dmg;
    live.push(bullet);
  };
  return {
    duration: FINALE_AT + BOW_LENGTH + 0.4,
    update: (dt, bullets, soul) => {
      live = bullets;
      real += dt;
      // What the stage reads (puppetStage.js draws his head coming round, the
      // box tearing, and the fly tower behind it; the battle puts the box
      // back when the turn's over).
      // (While his head is off him, the stage leaves him out and puts his
      // light where the head is.)
      box.tear = { t: real, turned: TURNED, tear: TEAR, open: OPEN, home, face: FACE_AT, faceEnd: FACE_GONE, glow: head && { x: head.x, y: head.y } };
      if (step === 0 && real >= OPEN) {
        step = 1;
        Object.assign(box, STAGE);
      }
      // His eyes, burning, finding you wherever you go.
      if (step === 1 && real >= EYES_AT) {
        step = 2;
        for (const eye of EYES) {
          // (Slow to turn, and out before the first flat runs: the flats pin
          // you to a window, and a ray that keeps finding you there is too
          // much.)
          push(new JointRay({ x: eye.x, y: eye.y, angle: Math.atan2(soul.y - eye.y, soul.x - eye.x) + (eye.x - CHEST.x) * 0.02, target: soul, turn: 0.3, warn: 0.9, life: 1.6, length: 360, ring: false }));
        }
      }
      // The scenery of his old show, running across on its tracks one after
      // another, all from the same wing (two from opposite wings would cross
      // somewhere, and there you'd need to be in both windows at once). Each
      // window is somewhere new, but in easy reach of the last.
      if (flat < FLATS.length && real >= FLATS[flat].at) {
        let holeY;
        for (let tries = 0; tries < 20; tries++) {
          holeY = rand(STAGE.y + 14, STAGE.y + STAGE.h - HOLE_H - 10);
          if (lastHole === null) {
            // (The first one near where you are.)
            if (Math.abs(holeY + HOLE_H / 2 - soul.y) < HOLE_MOVE[1]) break;
          } else if (Math.abs(holeY - lastHole) > HOLE_MOVE[0] && Math.abs(holeY - lastHole) < HOLE_MOVE[1]) break;
        }
        lastHole = holeY;
        sfx('creak');
        push(new SceneryFlat({ stage: STAGE, dir: flatDir, holeY, holeH: HOLE_H, speed: FLAT_SPEED, picture: FLATS[flat].picture }));
        flat++;
      }
      // The flies coming down: sandbags dropped at you, bursting in sand,
      // and still coming while the batten swings.
      if (real >= nextBag && real < BAGS_TO) {
        nextBag += 0.5 / often;
        const x = Math.min(STAGE.x + STAGE.w - 8, Math.max(STAGE.x + 8, soul.x + rand(-20, 20)));
        push(new Sandbag({
          x, warn: 0.65,
          onLand: (bag) => {
            for (let k = 0; k < 4; k++) {
              const side = k % 2 ? 1 : -1;
              push(new SandGrain({ x: bag.x, y: FLY_FLOOR - 2, vx: side * rand(25, 85), vy: -rand(40, 120) }));
            }
          },
        }));
      }
      // And a batten of lamps, swinging down from the side you're on: get
      // out of its reach. (A shorter one if you're right under its rope,
      // so there's always time to run out from under it.)
      if (step === 2 && real >= BATTEN_AT) {
        step = 3;
        const left = soul.x < STAGE.x + STAGE.w / 2;
        const pivot = { x: left ? STAGE.x + 4 : STAGE.x + STAGE.w - 4, y: STAGE.y + 6 };
        const length = Math.min(168, Math.max(124, Math.abs(soul.x - pivot.x) + 84));
        push(new Batten({ pivot, dir: left ? 1 : -1, length, warn: 1.5, life: 2.6 }));
      }
      // The light pouring out of him in three rays from his chest, wheeling
      // across the whole stage, and shavings off his gouged wood drifting
      // down all over.
      if (step === 3 && real >= CALL_AT) {
        step = 4;
        const spin = (Math.random() < 0.5 ? -1 : 1) * 0.5;
        const a = Math.atan2(soul.y - CHEST.y, soul.x - CHEST.x) + Math.PI / 3;
        for (const k of [0, 1, 2]) {
          push(new JointRay({ x: CHEST.x, y: CHEST.y, angle: a + (k * Math.PI * 2) / 3, spin, warn: 1.3, life: 1.9, length: 360, width: 3 }));
        }
      }
      if (real >= nextStar && real < STARS_TO) {
        nextStar += 0.34 / often;
        push(new Shaving({ x: rand(STAGE.x + 6, STAGE.x + STAGE.w - 6), y: rand(10, 22), vx: rand(-8, 8), vy: rand(34, 46), curl: 9, turn: 4, warn: 0.5 }));
      }
      // The stair: the tower narrows to the well, you climb, and it opens out
      // again.
      if (real >= STAIR_AT && real < STAIR_IN) shape(STAGE, COLUMN, (real - STAIR_AT) / (STAIR_IN - STAIR_AT));
      if (!stair && real >= STAIR_IN) {
        Object.assign(box, COLUMN);
        stair = stairClimb({ rand, push, sfx });
        stair.start(bullets, box, soul);
      }
      if (stair && !stair.over) {
        if (real < STAIR_OUT) {
          stair.update(real - STAIR_IN, dt, bullets, box, soul);
        } else {
          stair.over = true;
          stair.finish(bullets, box, soul);
        }
      }
      if (real >= STAIR_OUT && real < FACE_AT) shape(COLUMN, STAGE, (real - STAIR_OUT) / (FACE_AT - STAIR_OUT));
      if (real >= FACE_AT && box.w !== STAGE.w) Object.assign(box, STAGE);
      // The head: up off his neck, swelling to fill the tower, and back.
      if (!head && real >= FACE_AT) {
        head = new GiantHead(HEAD_ON_HIM);
        bullets.unshift(head);
        sfx('flare');
        // His scream as the head swells (a recorded line: voiceClips.js).
        sayLine('rumbold_finale');
      }
      if (!head) return;
      const grow = (k) => {
        const e = k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k);
        head.x = HEAD_ON_HIM.x + (HEAD_UP.x - HEAD_ON_HIM.x) * e;
        head.y = HEAD_ON_HIM.y + (HEAD_UP.y - HEAD_ON_HIM.y) * e;
        head.size = HEAD_ON_HIM.size + (HEAD_UP.size - HEAD_ON_HIM.size) * e;
      };
      if (real < FACE_GROWN) grow((real - FACE_AT) / (FACE_GROWN - FACE_AT));
      else if (real < FACE_BACK) grow(1);
      else grow(Math.max(0, 1 - (real - FACE_BACK) / (FACE_GONE - FACE_BACK)));
      if (real >= FACE_GONE) head.done = true;
      // Its eyes on you, and its jaw going: a clack now and then, a bite
      // as each hand shuts, wide open and shaking at a clap.
      const lookAt = (v) => Math.max(-1, Math.min(1, Math.round(v / 40)));
      head.look = { x: lookAt(soul.x - head.x), y: lookAt(soul.y - head.y) };
      bite = Math.max(0, bite - dt * 9);
      head.open = Math.max(Math.sin(real * 11) > 0.7 ? 1 : 0, bite);
      head.shake = Math.max(0, head.shake - dt * 6);
      // And it cocks itself over, slowly, watching you, further than any
      // head should go; then snaps back upright with a crack, and starts
      // over to the other side.
      if (real >= FACE_GROWN && real < FACE_BACK) {
        const into = (real - FACE_GROWN) % TILT_EVERY;
        const side = Math.floor((real - FACE_GROWN) / TILT_EVERY) % 2 ? -1 : 1;
        const k = Math.min(1, into / (TILT_EVERY - 0.5));
        head.tilt = side * TILT_MOST * k * k * (3 - 2 * k);
        if (into >= TILT_EVERY - dt * 1.5 && !head.snapped) {
          head.snapped = true;
          sfx('clack');
          head.shake = Math.max(head.shake, 1.5);
        } else if (into < TILT_EVERY - 0.2) head.snapped = false;
      } else head.tilt *= Math.max(0, 1 - dt * 8);
      // His hands, grabbing.
      while (grab < GRABS.length && real >= FACE_AT + GRABS[grab].at) {
        const g = GRABS[grab++];
        if (g.clap) {
          // Both at once, flat along your row, to meet where you are.
          const y = inStage(soul, 14).y;
          const meet = Math.min(STAGE.x + STAGE.w - 70, Math.max(STAGE.x + 70, soul.x));
          for (const side of [-1, 1]) {
            push(new GrabHand({
              from: { x: side < 0 ? STAGE.x - 40 : STAGE.x + STAGE.w + 40, y },
              to: { x: meet + side * 9, y },
              clap: true, warn: g.warn, bend: side,
              onClench: side < 0 ? (hand) => {
                sfx('thud');
                bite = 5;
                head.shake = 2.5;
                // Splinters of light burst out from between his palms.
                for (let k = 0; k < 8; k++) {
                  const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
                  push(new Glint({ x: hand.to.x + 9, y: hand.to.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, life: 2.4 }));
                }
              } : null,
            }));
          }
          continue;
        }
        const from = g.high
          ? { x: g.side < 0 ? rand(STAGE.x + 20, STAGE.x + 110) : rand(STAGE.x + STAGE.w - 110, STAGE.x + STAGE.w - 20), y: STAGE.y - 40 }
          : { x: g.side < 0 ? STAGE.x - 40 : STAGE.x + STAGE.w + 40, y: rand(STAGE.y + 30, STAGE.y + STAGE.h - 20) };
        push(new GrabHand({
          from, to: inStage(soul, 10), warn: g.warn, bend: g.side,
          onClench: () => { sfx('clack'); bite = 3; },
        }));
      }
      // And its eyes spit sparks of his light at you, one eye then the other.
      if (real >= nextSpit && real < FACE_AT + 8.4) {
        nextSpit += 1.5 / often;
        const eye = head.eye(spitEye++ % 2);
        const a = Math.atan2(soul.y - eye.y, soul.x - eye.x);
        push(new Glint({ x: eye.x, y: eye.y, vx: Math.cos(a) * 52, vy: Math.sin(a) * 52, life: 3.2 }));
      }
      // His strings: volley after volley, every one aimed at you.
      while (cage < CAGE.length && real >= CAGE_AT + CAGE[cage].at) {
        const c = CAGE[cage++];
        if (c.rays) {
          // His eyes' light, wheeling opposite ways round through the tower.
          for (const i of [0, 1]) {
            const eye = head.eye(i);
            const a = Math.atan2(soul.y - eye.y, soul.x - eye.x) + (i ? 0.9 : -0.9);
            push(new JointRay({ x: eye.x, y: eye.y, angle: a, spin: i ? 0.7 : -0.7, warn: 0.9, life: 3.2, length: 360, ring: false }));
          }
          bite = 5;
          head.shake = 2;
          sfx('flare');
          continue;
        }
        volley = { ...c, shot: 0, next: real };
      }
      if (volley && real >= volley.next) {
        volley.next += volley.every;
        // From the grid overhead, or one wing or the other, or all of them,
        // through where you are as it shows.
        const where = volley.from === 'both' ? ['grid', 'left', 'right'][volley.shot % 3]
          : volley.from === 'wings' ? (volley.shot % 2 ? 'left' : 'right') : 'grid';
        const from = where === 'grid' ? { x: rand(STAGE.x + 10, STAGE.x + STAGE.w - 10), y: STAGE.y - 2 }
          : { x: where === 'left' ? STAGE.x - 2 : STAGE.x + STAGE.w + 2, y: rand(STAGE.y + 8, STAGE.y + STAGE.h - 8) };
        const angle = Math.atan2(soul.y - from.y, soul.x - from.x);
        push(new Line({ x: from.x, y: from.y, angle, length: 380, thickness: 2, warn: volley.warn, life: 0.35, grow: 1400, color: '#f4ecdc' }));
        if (volley.shot === 0) sfx('clack');
        if (++volley.shot >= volley.count) volley = null;
      }
      // THE GRAND FINALE: him, hauling back and throwing the show at you.
      if (real >= FINALE_AT) {
        finaleAct.update(dt, bullets, soul);
        box.tear.pose = finaleAct.pose();
      }
    },
  };
}

// --- The last of him: THE GRAND FINALE ---

// The last thing he does: he hauls back and throws, and the joints of his
// own body go flying up off the boards on each throw (the stage draws him
// doing it, from `pose`): two volleys of them, each bursting into a ring of
// splinters; then all he has left in one, three rings of splinters with a
// gap in each; and he folds over at the middle, like a puppet that's been
// let go. Each joint shows its lane and where it'll burst first. Shavings
// drift down off him through all of it.
const BOW_LENGTH = 10.6;
// His body in the tower, from the second this starts: `tilt` (radians,
// about his feet), squash and stretch, a lift off the boards, and how hard his
// light's burning (all eased; kicks are the little jolts as each joint is flung).
const KICKS = [1.2, 1.7, 2.2, 4.0, 4.4, 6.6];
function bowPose(t) {
  const ease = (k) => k * k * (3 - 2 * k);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  let tilt = 0;
  let stretch = 1;
  let lift = 0;
  let glow = 0.4;
  // Hauling back before each volley.
  for (const [from, to] of [[0, 1.2], [3.0, 4.0], [5.6, 6.6]]) {
    const k = ease(clamp((t - from) / (to - from))) * (t < to ? 1 : 0);
    tilt -= 0.16 * k;
    stretch += 0.04 * k;
    lift -= 5 * k;
    glow += 0.5 * k;
  }
  // Thrown forward on each joint: a quick jolt that rings back.
  for (const at of KICKS) {
    const d = t - at;
    if (d < 0 || d > 0.6) continue;
    const e = Math.exp(-d * 7);
    tilt += 0.2 * e * Math.cos(d * 22);
    stretch -= 0.06 * e;
    glow += 0.6 * e;
  }
  // All of it at once: stretched up, arms flung, light blazing.
  if (t >= 6.6 && t < 8.3) {
    const k = ease(clamp((t - 6.6) / 0.25)) * (1 - ease(clamp((t - 7.9) / 0.4)));
    stretch += 0.1 * k;
    lift -= 7 * k;
    glow += 0.8 * k;
  }
  // The fold: over at the middle, held, and hauled up again.
  if (t >= 8.3) {
    const k = ease(clamp((t - 8.3) / 0.7)) * (1 - ease(clamp((t - 9.7) / 0.7)));
    tilt += 0.38 * k;
    stretch -= 0.2 * k;
    glow -= 0.2 * k;
  }
  return { tilt, sy: stretch, sx: 1 + (1 - stretch) * 0.5, lift, glow: Math.max(0, glow) };
}

export function bow(box, density, { rand }, { stage = false } = {}) {
  if (stage) Object.assign(box, STAGE);
  let real = 0;
  let live = null;
  const plan = [];
  // His joints: when each one's lane shows, then it goes 0.9s later.
  // [shown, size of its ring, ring speed]
  for (const [lit, n, speed] of [[0.3, 9, 32], [0.85, 9, 32], [1.4, 9, 32], [3.1, 12, 36], [3.6, 12, 36]]) plan.push({ lit, n, speed });
  let lit = 0;
  let tada = 0;
  let nextRain = 2.2;
  const pending = [];
  const calls = [];
  const ring = (x, y, n, speed, turn, gap = null) => splinterRing(live, x, y, n, speed, turn, gap, TEAR_DAMAGE);
  // A lane well away from where you're standing.
  const lane = (soul, used) => {
    for (let tries = 0; tries < 20; tries++) {
      const x = box.x + 18 + Math.random() * (box.w - 36);
      if (Math.abs(x - soul.x) > Math.min(70, box.w * 0.22) && used.every((u) => Math.abs(u - x) > Math.min(54, box.w * 0.2))) return x;
    }
    return box.x + (soul.x < box.x + box.w / 2 ? box.w - 24 : 24);
  };
  const used = [];
  const out = {
    duration: BOW_LENGTH,
    pose: () => bowPose(real),
    update: (dt, bullets, soul) => {
      live = bullets;
      real += dt;
      while (lit < plan.length && real >= plan[lit].lit) {
        const { n, speed } = plan[lit++];
        const x = lane(soul, used);
        used.push(x);
        if (used.length > 3) used.shift();
        const top = box.y + box.h * (0.16 + Math.random() * 0.3);
        const joint = new FlungJoint({
          x, floor: box.y + box.h, top, warn: 0.9, rise: 0.5,
          onBurst: (sh) => {
            sfx('crumble');
            ring(sh.x, sh.top, n, speed, Math.random() * 6.28);
          },
        });
        joint.dmg = TEAR_DAMAGE;
        bullets.push(joint);
        // (The joint goes up after its warning: his throw.)
        calls.push(real + 0.9);
      }
      // Shavings off him drifting down all through it, half of them near
      // where you stand.
      if (real >= nextRain && real < 9.4) {
        nextRain += 0.6 / Math.min(1.3, density);
        const aimed = Math.random() < 0.5;
        const x = aimed ? Math.min(box.x + box.w - 6, Math.max(box.x + 6, soul.x + (Math.random() - 0.5) * 40)) : box.x + 6 + Math.random() * (box.w - 12);
        const shaving = new Shaving({ x, y: box.y + 4, vx: (Math.random() - 0.5) * 8, vy: 34, curl: 8, turn: 4, warn: 0.5 });
        shaving.dmg = TEAR_DAMAGE;
        bullets.push(shaving);
      }
      while (calls.length && real >= calls[0]) { calls.shift(); sfx('clack'); }
      // All he has left: a flare in the middle of him, then three rings of
      // splinters, each with a gap.
      if (tada === 0 && real >= 5.6) {
        tada = 1;
        sfx('flare');
      }
      if (tada === 1 && real >= 6.6) {
        tada = 2;
        const cx = box.x + box.w / 2;
        const cy = box.y + box.h * 0.3;
        const gapAt = Math.atan2(soul.y - cy, soul.x - cx) + Math.PI * (0.35 + Math.random() * 0.3);
        sfx('boom');
        [[0, 11, 30], [0.45, 14, 40], [0.9, 17, 50]].forEach(([after, n, speed], i) => {
          pending.push({ at: real + after, burst: { cx, cy, n, speed, turn: i * 0.21, gap: gapAt + i * 1.9 } });
        });
      }
      for (let i = pending.length - 1; i >= 0; i--) {
        const b = pending[i].burst;
        if (!b || real < pending[i].at) continue;
        pending.splice(i, 1);
        sfx('crumble');
        ring(b.cx, b.cy, b.n, b.speed, b.turn, b.gap);
      }
    },
  };
  return out;
}

export const RUMBOLD_ALIVE_ATTACKS = {
  ...RUMBOLD_WOOD_ATTACKS,
  rumboldAliveJaw: (box, density, tools) => jaw(box, density, tools),
  rumboldAliveDance: (box, density, tools) => dance(box, density, tools),
  rumboldAliveTuck: (box, density, tools) => tuck(box, density, tools),
  rumboldAliveLight: (box, density, tools) => light(box, density, tools),
  rumboldAliveWorkYou: (box, density, tools) => workYou(box, density, tools),
  rumboldAliveTear: (box, density, tools) => tear(box, density, tools),
  // The last act of the finale on its own (the same, for checking it).
  rumboldAliveBow: (box, density, tools) => bow(box, density, tools),
  rumboldAliveBowStage: (box, density, tools) => bow(box, density, tools, { stage: true }),
};
