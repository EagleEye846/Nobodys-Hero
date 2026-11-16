import { music, compile } from '../audio/music.js';
import { SOUL_INSET } from './soulModes.js';
import { FIGUREHEAD_BATTLE_THEME } from '../data/music/figureheadBattleTheme.js';

// Madam Fairweather's two rules for the box (src/data/enemies/fairweather.js, drawn by
// fairweatherStage.js). Each of her phases plays one or both:
//
//   THE LIST   Her deck heels over in the swell. The box leans, and your SHADOW slides
//              downhill: a gentle pull you can walk against, strongest at the top of the
//              swell. On her laugh the ship rolls the other way and the slope swaps sides.
//              The swap is always on a bar's ONE, and a bar before it she giggles, the
//              water stirs and the timbers groan, so you can see it coming.
//   THE DANCE  She has your hand. Your SHADOW only steps on the beats of her waltz (the
//              song's own crotchets, ONE two three): a quick glide on each beat, a longer
//              one on ONE. Hold a way and it steps every beat; press between beats and the
//              step waits for the next one (it is never lost); press a moment late and it
//              still counts. Hold X for half steps.
//
//   phase      rule
//   laugh      the list
//   shower     the dance
//   carousel   the dance, while the deck lists (a softer pull)
//   chaos      one, then the other: every laugh swaps the list for the dance and back
//
// The beat comes from the song itself when "Never Morning" is playing (where the music
// is right now, counted from the start of the section it is in, as the band counts
// its bars); with no sound yet, from a clock of the same speed. The same `advance`
// moves the SHADOW in the battle and moves the dodging bot's guesses in
// tools/dodgeCheck.html, so its numbers play by the same rules.

export const BEAT = 1 / 3;           // a crotchet of her song (180 a minute; every bar of it 3/4)
export const BAR = 3 * BEAT;         // a waltz bar: exactly one second
const STEP = 13;                     // a glide on two and three, in world units
const STEP_ONE = 20;                 // the glide on ONE
const GLIDE = 0.12;                  // seconds a glide takes
const LATE = 0.08;                   // a press this soon after a beat still steps on it
const SPEED = 80;                    // as the plain SHADOW (soulModes.js)
const FOCUS_SPEED = 38;
const PULL = 30;                     // how fast the list carries you at its steepest
const SETTLE = 0.3;                  // how soon the slide catches up with the slope
const SWAP_EASE = 0.7;               // seconds the deck takes to roll over
export const WARN_BARS = 1;          // the giggle before a swap

const RULES = {
  laugh: { list: 1, dance: 0, every: 4 },
  shower: { list: 0, dance: 1, every: 0 },
  carousel: { list: 0.55, dance: 1, every: 4 },
  chaos: { list: 1, dance: 1, every: 4, alternate: true },
};
export const deckRules = (phaseId) => RULES[phaseId] ?? null;

// Where her song (figureheadBattleTheme.js) is right now, in seconds from the start of its current section
// (sections open on a full bar, so a whole number of bars in is a ONE), or null.
const startsOf = new WeakMap();
export function songClock() {
  const p = music.current;
  if (!p || p.song?.title !== FIGUREHEAD_BATTLE_THEME.title || !p.ctx || p.ctx.state !== 'running') return null;
  if (!Number.isFinite(p.startTime) || !Number.isFinite(p.nextTime)) return null;
  const now = p.ctx.currentTime;
  if (now < p.startTime) return null;
  // The step being heard now: the next one to be scheduled, less how far ahead it is.
  let pos = p.index - (p.nextTime - now) / p.stepSeconds;
  if (pos < p.loopStart && p.index >= p.loopStart && p.index - p.loopStart < 12) pos += p.loopEnd - p.loopStart;
  if (pos < 0) return null;
  if (!startsOf.has(p.song)) startsOf.set(p.song, Object.values(compile(p.song).starts).sort((a, b) => a - b));
  let from = 0;
  for (const s of startsOf.get(p.song)) if (s <= pos) from = s;
  return (pos - from) * p.stepSeconds;
}

const ease = (k) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, k)));

// One enemy turn's deck: made as the turn starts (fairweatherStage.js turnStart).
export class Deck {
  constructor(phaseId, { clock, side = 1 } = {}) {
    const r = RULES[phaseId];
    this.phaseId = phaseId;
    this.listPull = r.list;
    this.danceOn = r.dance;
    this.alternate = Boolean(r.alternate);
    // In chaos: which rule the turn opens with (then each laugh swaps).
    this.startsDancing = this.alternate && Math.random() < 0.5;
    this.side = side;
    this.tt = 0;                      // seconds into the turn
    this.clock = clock ?? 0;          // the song's clock (see songClock)
    this.ownClock = clock === null || clock === undefined;
    // Laughs (swaps) fall on a ONE, `every` bars apart, from the first ONE of the turn.
    const beats = this.clock / BEAT;
    const toOne = ((3 - (Math.round(beats * 1000) / 1000 % 3)) % 3) * BEAT;
    this.firstOne = toOne;
    this.swaps = [];
    if (r.every) for (let k = 1; k < 8; k++) this.swaps.push(toOne + k * r.every * BAR);
    // For the attacks: the beat that's sounding, whether one just came, and ONE.
    this.beatIx = Math.floor(beats + 1e-6);
    this.beatTick = false;
    this.beats = 0;
    this.sinceSwap = 99;
    this.swapped = 0;
  }

  // How many laughs have gone by at turn time `tt`.
  swapsBy(tt) {
    let n = 0;
    for (const s of this.swaps) if (tt >= s) n++;
    return n;
  }

  // What the rules are at turn time `tt`: { list (0..1), dance (bool) }.
  ruleAt(tt) {
    if (!this.alternate) return { list: this.listPull, dance: Boolean(this.danceOn) };
    const dancing = (this.swapsBy(tt) % 2 === 0) === this.startsDancing;
    return dancing ? { list: 0, dance: true } : { list: this.listPull, dance: false };
  }

  // The slope at `tt`: -1 (downhill to the left) to 1 (to the right), easing over at
  // each laugh, swelling a little (steepest at the top of the swell).
  slopeAt(tt) {
    const rule = this.ruleAt(tt);
    if (!rule.list) return 0;
    let side = this.side;
    let at = 1;
    if (this.alternate) {
      // (In chaos the deck only lists between dances, coming back on the other side
      // each time, and it settles flat as each dance comes in.)
      side = this.side * (Math.floor(this.swapsBy(tt) / 2) % 2 ? -1 : 1);
      for (const s of this.swaps) {
        const d = Math.abs(tt - s);
        if (d < SWAP_EASE / 2) at = Math.min(at, ease(d / (SWAP_EASE / 2)));
      }
    } else {
      for (const s of this.swaps) {
        if (tt >= s + SWAP_EASE / 2) side = -side;
        else if (tt > s - SWAP_EASE / 2) at = 1 - 2 * ease((tt - (s - SWAP_EASE / 2)) / SWAP_EASE);
      }
    }
    const swell = 0.78 + 0.22 * Math.sin((tt / (2 * BAR)) * Math.PI * 2);
    return side * at * swell;
  }

  // The next laugh after `tt` (or Infinity).
  nextSwap(tt = this.tt) {
    return this.swaps.find((s) => s > tt) ?? Infinity;
  }

  // Every frame, before the attacks: the clock, and whether a beat has come.
  tick(dt) {
    this.tt += dt;
    const song = this.ownClock ? null : songClock();
    this.clock = song ?? this.clock + dt;
    const ix = Math.floor(this.clock / BEAT + 1e-6);
    this.beatTick = ix !== this.beatIx;
    if (this.beatTick) this.beats++;
    this.beatIx = ix;
    const n = this.swapsBy(this.tt);
    this.sinceSwap = n > this.swapped ? 0 : this.sinceSwap + dt;
    this.swapJust = n > this.swapped;
    this.swapped = n;
  }

  get one() {
    return ((this.beatIx % 3) + 3) % 3 === 0;
  }

  get beatPhase() {
    return this.clock / BEAT - Math.floor(this.clock / BEAT + 1e-6);
  }

  get rule() {
    return this.ruleAt(this.tt);
  }

  // A fresh mover state for the SHADOW at (x, y).
  stateFor(soul) {
    const prev = soul.deckState;
    return {
      x: soul.x, y: soul.y, vx: prev?.vx ?? 0,
      gx: prev?.gx ?? 0, gy: prev?.gy ?? 0, gleft: prev?.gleft ?? 0,
      buf: prev?.buf ?? null, used: prev?.used ?? null, beatIx: prev?.beatIx ?? this.beatIx,
      since: prev?.since ?? 99, stepped: prev?.stepped ?? true,
      clock: this.clock, tt: this.tt,
    };
  }

  // Moves a mover state on by `dt` with `dir` ([dx, dy], each -1..1) held (`fresh`: a
  // key was pressed this frame). `clock` is the song's clock if known, or it runs on.
  advance(st, dir, focus, dt, box, { fresh = false, clock = null } = {}) {
    st.tt += dt;
    st.clock = clock ?? st.clock + dt;
    const rule = this.ruleAt(st.tt);
    const moving = dir[0] || dir[1];
    if (rule.dance) {
      const ix = Math.floor(st.clock / BEAT + 1e-6);
      if (ix !== st.beatIx) {
        st.beatIx = ix;
        st.since = 0;
        st.stepped = false;
        const d = moving ? dir : st.buf;
        st.buf = null;
        if (d) this.glide(st, d, ix, focus);
      } else {
        st.since += dt;
        const changed = moving && !(st.used && st.used[0] === dir[0] && st.used[1] === dir[1]);
        if (moving && !st.stepped && st.since < LATE) this.glide(st, dir, ix, focus);
        else if (moving && (fresh || changed)) st.buf = [dir[0], dir[1]];
        if (!moving) st.used = null;
      }
      if (st.gleft > 0) {
        const k = Math.min(dt, st.gleft);
        st.x += st.gx * k;
        st.y += st.gy * k;
        st.gleft -= k;
      }
    } else {
      st.gleft = 0;
      st.buf = null;
      if (moving) {
        const speed = (focus ? FOCUS_SPEED : SPEED) / Math.hypot(dir[0], dir[1]);
        st.x += dir[0] * speed * dt;
        st.y += dir[1] * speed * dt;
      }
    }
    const target = PULL * rule.list * this.slopeAt(st.tt);
    st.vx += (target - st.vx) * Math.min(1, dt / SETTLE);
    st.x += st.vx * dt;
    st.x = Math.min(Math.max(st.x, box.x + SOUL_INSET), box.x + box.w - SOUL_INSET);
    st.y = Math.min(Math.max(st.y, box.y + SOUL_INSET), box.y + box.h - SOUL_INSET);
    return st;
  }

  glide(st, d, ix, focus) {
    const len = Math.hypot(d[0], d[1]) || 1;
    const dist = (((ix % 3) + 3) % 3 === 0 ? STEP_ONE : STEP) * (focus ? 0.5 : 1);
    st.gx = (d[0] / len) * (dist / GLIDE);
    st.gy = (d[1] / len) * (dist / GLIDE);
    st.gleft = GLIDE;
    st.stepped = true;
    st.used = [d[0], d[1]];
    st.stepAt = st.tt;
  }

  // The SHADOW's mover (soul.mover): moves it by the rules each frame.
  update(soul, dt, input, box) {
    const ax = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const ay = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    const fresh = ['left', 'right', 'up', 'down'].some((k) => input.wasPressed(k));
    soul.focused = input.isDown('focus');
    const st = soul.deckState ?? this.stateFor(soul);
    st.x = soul.x;
    st.y = soul.y;
    // (The deck's own tick has already moved the clock and turn time this frame.)
    st.tt = this.tt - dt;
    this.advance(st, [ax, ay], soul.focused, dt, box, { fresh, clock: this.clock });
    soul.x = st.x;
    soul.y = st.y;
    soul.deckState = st;
  }

  // For the dodging bot: a copy of the SHADOW's state to try moves with.
  simState(soul) {
    const st = this.stateFor(soul);
    st.x = soul.x;
    st.y = soul.y;
    st.clock = this.clock;
    st.tt = this.tt;
    return st;
  }
}
