import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { SHOPS } from '../data/shops.js';
import { STAR_FORGINGS } from '../data/fallenStar.js';
import { drawText, textWidth } from '../ui/text.js';
import { music, sfx } from '../audio/music.js';

// THE REFORGE SHOW: the big moment every time the Fallen Star is reforged,
// like the nail upgrade in Hollow Knight, once a chapter, in each smith's own
// style. The screen dims to the forge, the smith takes the sword, the fire
// flares (heat shimmer, embers), slow-motion hammer strikes (each with a hit
// stop, a spark burst, a ring of light, a flash and a real anvil), the shard
// sinks into the blade with a flare of star-light, the blade is raised with
// light pouring off it, and the new name is shown big with its power and
// STARFALL's star count, under its smith's music sting.
//
// About ten seconds, and the sting is written to the show's clock (12
// November 2026, cut down from 15 to 20 seconds). Every smith's show keeps
// the same marks, in real seconds from the start:
//   0       the screen dims, the sting begins (the Falling Star rung once,
//           softly, its last note landing on the first blow)
//   ~0.7    the fire flares
//   1.5-4.5 the blows, each on a beat of the sting (Orla's 2, 3, 4)
//   ~5      the shard starts down; the sting plays the Falling Star again
//   6.0     THE FLARE: the shard meets the blade on the star's last note,
//           the sting's big hit
//   7.2     the new name
//   8.7     Z can end it; at 10.1 it has ended by itself
// The show keeps its clock on the sting's (the audio clock), so the blows
// and the flare land on the music even if a frame comes late. Each style's
// `lead`, `interval`, `toSink` and `fallTime` were worked out (with the slow
// motion and the hit stops counted in) to put the blows and the flare on
// those seconds; change one and the sting no longer lines up.
//
// It is a `forge_show` step in a cutscene (src/overworld/scenePlayer.js), and
// plays after reforgeAt() whether the reforge came from a room's trigger or
// from the shop's TALK topic ("The star sword"). It does not change the save:
// the reforge has already happened. It always ends by itself (a hold-to-
// continue, then an automatic end), so it can never hold the game.
//
// Everything is drawn in code, in UI space (640x480). Time inside the show
// is its own clock `u` that slows down around each strike (the slow motion)
// and stops for a moment on each hit (the hit stop). The look is seeded, so
// a still of any moment is the same every time (tools/preview.html?reforge=).

const W = UI_WIDTH;
const H = UI_HEIGHT;

// Where things sit on the screen.
const ANVIL = { x: 360, top: 348 };
const BLADE = { x: 268, y: 334, length: 262, half: 10 };
const HAND = { x: 255, y: 222 };           // the smith's hand, where the hammer swings from
const HANDLE = 140;                         // the hammer's reach
const STRIKE_X = 359;                       // where the head lands on the blade
const NOTCH_X = 470;                        // the chip the shard goes back into
const SMITH = { x: 150, floor: 432, height: 232 };
const RAISED = { x: 320, y: 212, scale: 0.62 };

// Each smith's forge: how it looks, how fast they work, what the fire is like.
export const REFORGE_STYLES = {
  // Teasel: a village smith. Brisk, four quick blows, sparks everywhere.
  // Blows at 1.5, 2.5, 3.5, 4.5 s; the shard starts down at 5.0 and lands at 6.0.
  lasthome_smithy: {
    who: 'Teasel', backdrop: 'hearth', sting: 'reforgeTeasel',
    strikes: 4, windup: 0.42, interval: 0.579, fall: 0.1, hitStop: 0.06, slow: 0.45, shake: 5, sparks: 54, power: 1,
    lead: 0.359, toSink: 0.254, fallTime: 0.89,
    hit: 'forgeHitBright', quench: false,
    glow: '255, 170, 70', fire: ['#fff4c0', '#ffb030', '#d8480c'], spark: ['#fffbe0', '#ffe27a', '#ffa23a'],
    ring: '255, 214, 130', wall: ['#241a1c', '#0c0709'], name: ['#fff0b8', '#ffc84a'], nameGlow: '255, 200, 80',
    captions: { intro: 'Steady. Hold it right there.', mid: 'Good iron. Better than good.', name: 'Hot work, that.' },
  },
  // Hobnail: a mole at a heat vent. Slow, heavy, three deliberate blows; dust shakes down.
  // Blows at 1.5, 3.0, 4.5 s; the shard starts down at 5.3 and lands at 6.0.
  hobnail_forge: {
    who: 'Hobnail', backdrop: 'vent', sting: 'reforgeHobnail',
    strikes: 3, windup: 0.7, interval: 0.768, fall: 0.18, hitStop: 0.12, slow: 0.3, shake: 9, sparks: 40, power: 1.5,
    lead: -0.036, toSink: 0.325, fallTime: 0.627,
    hit: 'forgeHitHeavy', quench: false, pops: 'Hn.',
    glow: '255, 110, 40', fire: ['#ffe9b0', '#ff7a22', '#a01c08'], spark: ['#fff0c8', '#ffa040', '#ff5a1c'],
    ring: '255, 150, 80', wall: ['#1e1716', '#0a0707'], name: ['#ffe2b0', '#ff9a40'], nameGlow: '255, 110, 40',
    captions: { intro: 'Hn.', mid: 'Hn. Hn.', name: 'Hn.' },
  },
  // Orla Cobb: a seal at a lighthouse forge. The lamp's beam sweeps over it; sea spray hisses on the hot metal.
  // Blows at 2.0, 3.0, 4.0 s; the shard starts down at 4.9 and lands at 6.0.
  orla_forge: {
    who: 'Orla', backdrop: 'lighthouse', sting: 'reforgeOrla',
    strikes: 3, windup: 0.5, interval: 0.478, fall: 0.14, hitStop: 0.08, slow: 0.38, shake: 6, sparks: 44, power: 1.15,
    lead: 0.734, toSink: 0.573, fallTime: 0.999,
    hit: 'forgeHitHiss', quench: true,
    glow: '255, 196, 110', fire: ['#fff6d0', '#ffc050', '#c85a18'], spark: ['#fffbe8', '#ffe8a0', '#9fe0ff'],
    ring: '190, 232, 255', wall: ['#16202c', '#060a10'], name: ['#fffbe8', '#ffd98a'], nameGlow: '120, 210, 255',
    captions: { intro: 'Keep it steady. The sea is watching.', mid: 'Hiss, you old gull. Take it.', name: 'Mind it. Still hot.' },
  },
};

const SEEN_KEY = 'ruins-rpg-reforge-seen-v1';
function seenBefore() {
  try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
function markSeen() {
  try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* nothing to skip next time */ }
}

const smooth = (x) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (x) => 1 - (1 - clamp01(x)) ** 3;
const easeIn = (x) => clamp01(x) ** 2.2;
const rgb = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const mix = (a, b, t) => { const x = rgb(a); const y = rgb(b); return `rgb(${Math.round(lerp(x[0], y[0], t))}, ${Math.round(lerp(x[1], y[1], t))}, ${Math.round(lerp(x[2], y[2], t))})`; };

// The blade's heat colour: cold steel, dull red, orange, yellow, white.
const HEAT = ['#8a98ae', '#7a3a30', '#e0561c', '#ffb43a', '#fff0b8', '#ffffff'];
function heatColor(h) {
  const p = clamp01(h) * (HEAT.length - 1);
  const i = Math.min(HEAT.length - 2, Math.floor(p));
  return mix(HEAT[i], HEAT[i + 1], p - i);
}

function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const spriteCache = new Map();
function smithSprite(name) {
  if (!spriteCache.has(name) && PROP_SPRITES[name]) spriteCache.set(name, makeSprite(PROP_SPRITES[name], PROP_PALETTE));
  return spriteCache.get(name) ?? null;
}

export class ReforgeShow {
  // `smith`: a shop id with a REFORGE_STYLES entry. `forging`/`previous`: the new
  // and the old STAR_FORGINGS rows (the show reads them from the smith's own
  // row if they aren't given). `quiet`: no sound (a cutscene being skipped).
  constructor(smith, { forging = null, previous = null, quiet = false } = {}) {
    this.style = REFORGE_STYLES[smith] ?? REFORGE_STYLES.lasthome_smithy;
    const index = Math.max(1, STAR_FORGINGS.findIndex((f) => f.smith === smith));
    this.forging = forging ?? STAR_FORGINGS[index];
    this.previous = previous ?? STAR_FORGINGS[index - 1];
    this.sprite = smithSprite(SHOPS[smith]?.keeper?.sprite);
    this.quiet = quiet;
    this.rand = seeded(1109);
    const s = this.style;

    // The timeline, in the show's own seconds (u). (The real seconds these
    // come to, with the slow motion and hit stops, are in the header.)
    this.dimEnd = 0.55;
    this.fireAt = this.dimEnd + 0.1;               // the fire flares
    this.strikeStart = this.dimEnd + s.lead;
    this.hits = Array.from({ length: s.strikes }, (_, i) => this.strikeStart + s.windup + i * s.interval);
    this.sinkStart = this.hits[this.hits.length - 1] + s.toSink;
    this.sinkHit = this.sinkStart + s.fallTime;     // the shard meets the blade: the flare
    this.raiseStart = this.sinkHit + 0.35;
    this.raiseEnd = this.raiseStart + 0.7;
    this.nameStart = this.raiseEnd + 0.05;
    this.holdMin = this.nameStart + 1.5;            // Z can end it from here
    this.holdMax = this.nameStart + 2.4;            // and it ends itself here
    this.fadeOut = 0.5;
    // Real seconds of each moment as it happens (for the preview's check).
    this.marks = {};
    this.waited = 0;

    this.u = 0;
    this.real = 0;
    this.freeze = 0;
    this.hitIndex = 0;
    this.heat = 0.05;
    this.local = 0;            // heat of the spot under the hammer
    this.flash = 0;
    this.shakeAmp = 0;
    this.flareStars = 0;
    this.healed = 0;
    this.particles = [];
    this.rings = [];
    this.twinkles = [];
    this.pops = [];
    this.done = false;
    this.ending = false;
    this.endT = 0;
    this.flags = {};
    this.skipHeld = 0;
    this.canSkip = seenBefore();
    this.prevSong = null;
  }

  // ----- sound -----
  play(name) { if (!this.quiet) sfx(name); }
  // The sting starts with the show: it's written to the show's ten seconds.
  startMusic() {
    if (this.quiet || this.flags.music) return;
    this.flags.music = true;
    this.prevSong = music.songName ?? null;
    music.play(this.style.sting);
    this.playback = music.current ?? null;
  }
  // A held skip lands on the name: the sting starts again from its ring
  // (the hit and what follows), so the name still gets its chord.
  ringSting() {
    this.playback = null;
    if (this.quiet || !this.flags.music) return;
    music.play(this.style.sting, null, 'ring');
  }

  // How far to run the show this frame: the frame's own time, or, while the
  // sting is playing, however far the sting has got past the show (so the
  // blows and the flare stay on the music). Null: the sting's recordings are
  // still loading the first time, so the show waits for it (at most two
  // seconds, then it goes on without it).
  clockStep(dt) {
    const p = this.playback;
    if (!p) return dt;
    if (p.stopped || music.current !== p || !music.ctx) {
      this.playback = null;
      return dt;
    }
    if (!Number.isFinite(p.startTime)) {
      this.waited += dt;
      if (this.waited > 2) this.playback = null;
      return this.waited > 2 ? dt : null;
    }
    const heard = music.ctx.currentTime - p.startTime;
    return Math.max(0, Math.min(0.1, heard - this.real));
  }
  endMusic() {
    if (this.quiet || !this.flags.music) return;
    music.play(this.prevSong ?? null);
  }

  // ----- the slow motion -----
  // How fast the show's clock runs: slowed to `slow` around each strike and the sink.
  scale() {
    const s = this.style;
    let k = 1;
    for (const ts of this.hits) {
      const d = this.u - ts;
      const span = d < 0 ? 0.35 : 0.4;
      if (Math.abs(d) < span) k = Math.min(k, s.slow + (1 - s.slow) * smooth(Math.abs(d) / span));
    }
    const sd = this.u - this.sinkHit;
    if (Math.abs(sd) < 0.35) k = Math.min(k, 0.6 + 0.4 * smooth(Math.abs(sd) / 0.35));
    return k;
  }

  // The phase the show is in (for captions, and the preview's stills).
  get phase() {
    const u = this.u;
    if (u < this.dimEnd) return 'dim';
    if (u < this.strikeStart) return 'fire';
    if (u < this.sinkStart) return 'strike';
    if (u < this.sinkHit) return 'sink';
    if (u < this.raiseStart) return 'sunk';
    if (u < this.nameStart) return 'raise';
    return 'name';
  }

  // Runs the clock (quietly) to a moment: for stills, and for a held skip.
  jumpTo(u, { quiet = true } = {}) {
    const was = this.quiet;
    this.quiet = quiet;
    let guard = 0;
    while (this.u < u && !this.done && guard++ < 20000) this.update(1 / 60);
    this.quiet = was;
  }

  update(dt, input = null, skipping = false) {
    if (this.done) return;
    if (skipping && !this.quiet) this.quiet = true;
    this.startMusic();
    const frame = dt;
    const step = this.ending ? dt : this.clockStep(dt);
    if (step === null) return;          // waiting for the sting to start
    dt = step;
    this.real += dt;

    // Hold the skip key (C) to jump to the name, once you've seen one before.
    if (input && this.canSkip && this.u < this.nameStart) {
      this.skipHeld = input.isDown?.('skip') ? this.skipHeld + frame : 0;
      if (this.skipHeld > 0.8) {
        this.skipHeld = 0;
        this.skipped = true;
        this.playback = null;
        this.jumpTo(this.nameStart + 0.01, { quiet: true });
        this.ringSting();
      }
    }

    // Ending: fade out, then done.
    if (this.ending) {
      this.endT += dt;
      this.simulate(dt);
      if (this.endT >= this.fadeOut) this.finish();
      return;
    }
    if (this.u >= this.holdMin && input?.wasPressed?.('confirm')) this.ending = true;
    if (this.u >= this.holdMax) this.ending = true;

    // The hit stop: the whole show holds for a moment on a hit (and what's
    // left of the frame after it runs on, so the show doesn't fall behind).
    if (this.freeze > 0) {
      this.freeze -= dt;
      if (this.freeze > 0) return;
      dt = -this.freeze;
      this.freeze = 0;
    }
    this.simulate(dt);
  }

  finish() {
    this.done = true;
    markSeen();
    this.endMusic();
  }

  simulate(dt) {
    const s = this.style;
    const step = dt * this.scale();
    this.u += step;
    const u = this.u;
    const rand = this.rand;

    // Heat rises as the fire flares, and with each strike; the spot under the hammer glows.
    const baseHeat = u < this.fireAt ? 0.05 : u < this.sinkHit ? 0.12 + 0.5 * smooth((u - this.fireAt) / 1.6) + 0.1 * this.hitIndex : 1;
    this.heat += (Math.min(1, baseHeat) - this.heat) * Math.min(1, step * 5);
    this.local = Math.max(0, this.local - step * 1.6);
    this.flash = Math.max(0, this.flash - step * 3.2);
    this.shakeAmp = Math.max(0, this.shakeAmp - step * 22);
    this.flareStars = Math.max(0, this.flareStars - step * 1.1);

    // The flare of the fire.
    if (!this.flags.flare && u >= this.fireAt) {
      this.flags.flare = true;
      this.play('forgeFlare');
      this.flash = Math.max(this.flash, 0.25);
    }

    // Each blow.
    while (this.hitIndex < this.hits.length && u >= this.hits[this.hitIndex]) this.strike(this.hitIndex++);

    // The shard sinks in.
    if (!this.flags.sink && u >= this.sinkStart) {
      this.flags.sink = true;
      this.marks.sinkStart = this.real;
      this.play('forgeShard');
    }
    if (!this.flags.sinkHit && u >= this.sinkHit) {
      this.flags.sinkHit = true;
      this.marks.flare = this.real;
      this.flash = 0.8;
      this.flareStars = 1;
      this.shakeAmp = Math.max(this.shakeAmp, 7);
      this.play('forgeSink');
      const at = this.bladePoint(NOTCH_X, this.bladeLocal(0, NOTCH_X));
      this.rings.push({ x: at.x, y: at.y, r: 6, max: 210, life: 0.9, t: 0, col: '255, 248, 220', w: 7 });
      this.rings.push({ x: at.x, y: at.y, r: 4, max: 340, life: 1.3, t: 0, col: s.ring, w: 4 });
      this.burst(at.x, at.y, 60, 1.3, ['#ffffff', '#fff6c0', '#bfeaff']);
    }
    this.healed = u >= this.sinkHit ? 1 : 0;
    if (u > this.sinkHit + 0.3) this.shardAt = null;

    // The blade comes up.
    if (!this.flags.raise && u >= this.raiseStart) {
      this.flags.raise = true;
      this.play('shimmer');
    }
    if (u >= this.nameStart && !this.flags.name) {
      this.flags.name = true;
      this.marks.name = this.real;
      this.play('forgeName');
    }

    // Star twinkles over the sword once it's lit.
    if (u > this.sinkHit && rand() < step * 9) {
      const f = rand();
      this.twinkles.push({ f, side: (rand() < 0.5 ? -1 : 1) * (1 + rand() * 1.6), t: 0, life: 0.5 + rand() * 0.5, size: 6 + rand() * 10 });
    }

    // Embers rise off the fire all the while.
    if (u > this.fireAt - 0.2) {
      const where = this.fireSpot();
      const rate = (u < this.sinkHit ? 15 : 8) * (this.style.backdrop === 'vent' ? 1.4 : 1);
      for (let n = rand() * rate * step * 2; n > 0; n -= 1) {
        this.particles.push({
          kind: 'ember', x: where.x + (rand() - 0.5) * where.w, y: where.y + rand() * 8,
          vx: (rand() - 0.5) * 24, vy: -(40 + rand() * 80), life: 1.6 + rand() * 2, t: 0, size: 1.5 + rand() * 2.2,
          col: s.fire[1 + (rand() < 0.4 ? 1 : 0)], wob: rand() * 6,
        });
      }
    }
    // Steam, over the quench tub (Orla) and over the hot spot after a blow.
    if (s.quench && u > this.fireAt && rand() < step * 4) this.puff(540 + (rand() - 0.5) * 34, 360, 0.7);

    this.updateParticles(step);
  }

  // Where the fire's embers come from.
  fireSpot() {
    const b = this.style.backdrop;
    if (b === 'vent') return { x: 360, y: 440, w: 220 };
    if (b === 'lighthouse') return { x: 548, y: 270, w: 70 };
    return { x: 520, y: 292, w: 90 };
  }

  strike(i) {
    const s = this.style;
    const at = { x: STRIKE_X, y: BLADE.y - BLADE.half };
    this.freeze = s.hitStop;
    this.flash = Math.max(this.flash, 0.55 + 0.1 * i);
    this.shakeAmp = s.shake + i;
    this.local = 1;
    this.hitCount = i + 1;
    (this.marks.hits ??= []).push(this.real);
    this.play(s.hit);
    this.burst(at.x, at.y, s.sparks, s.power, s.spark);
    this.rings.push({ x: at.x, y: at.y + 6, r: 8, max: 150 * s.power + 40, life: 0.7, t: 0, col: s.ring, w: 6 });
    this.rings.push({ x: at.x, y: at.y + 6, r: 4, max: 90 * s.power + 20, life: 0.45, t: 0, col: '255, 255, 255', w: 3 });
    if (s.quench) for (let n = 0; n < 5; n++) this.puff(at.x + (this.rand() - 0.5) * 50, at.y - 6, 1.1);
    if (s.backdrop === 'vent') for (let n = 0; n < 16; n++) this.dust();
    if (s.pops) this.pops.push({ text: s.pops, t: 0, life: 1.1, x: HAND.x + 40, y: HAND.y - 120 });
  }

  burst(x, y, count, power, cols) {
    const rand = this.rand;
    for (let n = 0; n < count; n++) {
      const a = -Math.PI / 2 + (rand() - 0.5) * 2.9;
      const v = (110 + rand() * 330) * power;
      this.particles.push({
        kind: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.9 - 40, t: 0, life: 0.5 + rand() * 0.8,
        size: 1.2 + rand() * 2.4, col: cols[Math.floor(rand() * cols.length)],
      });
    }
    // A few big slow glows, like sparks too heavy to fly.
    for (let n = 0; n < 6; n++) {
      const a = -Math.PI / 2 + (rand() - 0.5) * 1.6;
      this.particles.push({ kind: 'glow', x, y, vx: Math.cos(a) * 60 * power, vy: Math.sin(a) * 90 * power, t: 0, life: 0.9 + rand() * 0.6, size: 5 + rand() * 8, col: cols[1] });
    }
  }

  puff(x, y, size) {
    const rand = this.rand;
    this.particles.push({ kind: 'steam', x, y, vx: (rand() - 0.5) * 30, vy: -(26 + rand() * 40), t: 0, life: 1.4 + rand() * 1.2, size: (10 + rand() * 12) * size });
  }

  dust() {
    const rand = this.rand;
    this.particles.push({ kind: 'dust', x: 40 + rand() * (W - 80), y: -10 + rand() * 40, vx: (rand() - 0.5) * 16, vy: 20 + rand() * 60, t: 0, life: 1.8 + rand() * 1.4, size: 2 + rand() * 4 });
  }

  updateParticles(step) {
    for (const p of this.particles) {
      p.t += step;
      if (p.kind === 'spark' || p.kind === 'glow') {
        p.vy += 760 * step;
        p.vx *= 1 - 0.9 * step;
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx * step;
        p.y += p.vy * step;
        // Bounce off the anvil's face.
        if (p.y > ANVIL.top - 3 && p.x > ANVIL.x - 110 && p.x < ANVIL.x + 110 && p.vy > 0) {
          p.y = ANVIL.top - 3;
          p.vy *= -0.38;
          p.vx *= 0.8;
        }
      } else if (p.kind === 'ember') {
        p.x += (p.vx + Math.sin(p.t * 3 + p.wob) * 14) * step;
        p.y += p.vy * step;
      } else if (p.kind === 'steam') {
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.vx *= 1 - 0.5 * step;
      } else if (p.kind === 'dust') {
        p.x += p.vx * step;
        p.y += p.vy * step;
      }
    }
    this.particles = this.particles.filter((p) => p.t < p.life);
    if (this.particles.length > 900) this.particles.splice(0, this.particles.length - 900);
    for (const r of this.rings) r.t += step;
    this.rings = this.rings.filter((r) => r.t < r.life);
    for (const t of this.twinkles) t.t += step;
    this.twinkles = this.twinkles.filter((t) => t.t < t.life);
    for (const p of this.pops) p.t += step;
    this.pops = this.pops.filter((p) => p.t < p.life);
  }

  // ----- where the blade is -----
  // The hammer's angle (radians, 0 pointing right, positive down), from the timeline.
  hammerAngle(u = this.u) {
    const s = this.style;
    const aRest = -0.2;
    const aRaise = -1.35;
    const aHit = Math.atan2(BLADE.y - BLADE.half - HAND.y, STRIKE_X - HAND.x);
    let angle = aRest;
    for (let i = 0; i < this.hits.length; i++) {
      const ts = this.hits[i];
      const lift = ts - s.windup;
      const fall = ts - s.fall;
      if (u < lift) break;
      if (u < fall) angle = lerp(aRest, aRaise, easeOut((u - lift) / Math.max(0.01, fall - lift - 0.05)));
      else if (u < ts) angle = lerp(aRaise, aHit, easeIn((u - fall) / s.fall));
      else if (u < ts + 0.32) angle = lerp(aHit, aRest, easeOut((u - ts) / 0.32));
      else angle = aRest;
    }
    return angle;
  }

  // Where the blade's pieces are right now: the grip's end (pivot), its angle and scale.
  // Resting on the anvil it lies along y = BLADE.y; the raise swings it up and over to the top.
  bladePose() {
    const p = easeOut((this.u - this.raiseStart) / (this.raiseEnd - this.raiseStart));
    const lift = smooth((this.u - this.raiseStart) / (this.raiseEnd - this.raiseStart));
    // The smith slides the iron along between blows (a few pixels).
    const slide = this.u < this.sinkStart ? this.slideAt() : 0;
    // And it sinks a little under each blow.
    const bump = this.local > 0 ? Math.sin(this.local * 3) * 0 : 0;
    return {
      x: lerp(BLADE.x + slide, RAISED.x, lift),
      y: lerp(BLADE.y + bump, RAISED.y, lift),
      angle: lerp(0, -Math.PI / 2, p),
      scale: lerp(1, RAISED.scale, lift),
    };
  }

  slideAt() {
    // Slides back and forth: a few pixels between blows.
    let slide = 0;
    for (let i = 0; i < this.hits.length; i++) {
      const d = this.u - (this.hits[i] + 0.2);
      if (d > 0) slide = (i % 2 ? -1 : 1) * 14 * easeOut(d / 0.35);
    }
    return slide;
  }

  // A point at distance `along` (blade pixels from the grip's end) and `across`, in screen space.
  bladeLocal(across, along) { return { across, along }; }
  bladePoint(along, local = { across: 0 }) {
    const pose = this.bladePose();
    const d = (typeof along === 'number' ? along - BLADE.x : 0) * pose.scale;
    const a = local.across * pose.scale;
    const c = Math.cos(pose.angle);
    const s = Math.sin(pose.angle);
    return { x: pose.x + d * c - a * s, y: pose.y + d * s + a * c };
  }

  // ----- drawing -----
  ensureLayers() {
    if (!this.layer) {
      this.layer = document.createElement('canvas');
      this.layer.width = W;
      this.layer.height = H;
      this.tmp = document.createElement('canvas');
      this.tmp.width = 360;
      this.tmp.height = 320;
    }
  }

  draw(ctx) {
    this.ensureLayers();
    const s = this.style;
    const u = this.u;
    const dim = smooth(u / this.dimEnd) * (this.ending ? 1 - clamp01(this.endT / this.fadeOut) : 1);
    if (dim <= 0.001) return;
    const lc = this.layer.getContext('2d');
    lc.imageSmoothingEnabled = false;
    lc.setTransform(1, 0, 0, 1, 0, 0);
    lc.globalAlpha = 1;
    lc.globalCompositeOperation = 'source-over';
    lc.clearRect(0, 0, W, H);

    // The name card pushes the forge back: it dims while the name shows.
    const nameP = smooth((u - this.nameStart) / 0.6);
    this.drawBackdrop(lc);
    // The room behind the work stays dark: the light is all in the forge.
    lc.fillStyle = 'rgba(0, 0, 0, 0.34)';
    lc.fillRect(0, 0, W, H);
    this.drawSmith(lc);
    this.drawAnvil(lc);
    this.drawSword(lc);
    this.drawHammer(lc);
    // Over the forge, a darkening toward the edges, deeper once the name shows.
    const vig = lc.createRadialGradient(W / 2, H * 0.55, 120, W / 2, H * 0.55, 460);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${0.7 + 0.2 * nameP})`);
    lc.fillStyle = vig;
    lc.fillRect(0, 0, W, H);
    if (nameP > 0) {
      lc.fillStyle = `rgba(6, 4, 12, ${0.4 * nameP})`;
      lc.fillRect(0, 0, W, H);
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // The room, dimmed.
    ctx.fillStyle = `rgba(4, 2, 8, ${0.9 * dim})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = dim;
    // The forge, with its heat shimmer and its shake.
    const shake = this.shakeAmp;
    const ox = shake ? (this.rand2(1) - 0.5) * shake : 0;
    const oy = shake ? (this.rand2(2) - 0.5) * shake : 0;
    const shimmer = (u > this.fireAt ? 0.6 + 1.4 * this.heat : 0) * (s.backdrop === 'vent' ? 1.4 : 1) * (1 - nameP * 0.7);
    ctx.drawImage(this.layer, Math.round(ox), Math.round(oy));
    if (shimmer > 0.2) {
      // The air over the iron and the fire wavers (right of the smith, so he doesn't).
      const left = 236;
      for (let y = 40; y < SMITH.floor; y += 3) {
        const near = Math.exp(-(((y - 290) / 130) ** 2));
        const dx = (Math.sin(y * 0.09 + this.real * 8) + 0.6 * Math.sin(y * 0.031 - this.real * 3)) * shimmer * near;
        if (Math.abs(dx) < 0.4) continue;
        ctx.drawImage(this.layer, left, y, W - left, 3, Math.round(left + ox + dx), Math.round(y + oy), W - left, 3);
      }
    }
    ctx.globalAlpha = 1;

    // Light, over everything: the fire, the blade, the rings, the sparks.
    ctx.globalCompositeOperation = 'lighter';
    this.drawLights(ctx, dim);
    this.drawRings(ctx, dim);
    this.drawParticles(ctx, dim);
    this.drawRays(ctx, dim);
    this.drawTwinkles(ctx, dim);
    if (this.flash > 0.01) {
      ctx.fillStyle = `rgba(255, 250, 236, ${(0.38 * this.flash * dim).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'source-over';
    this.drawSteamDust(ctx, dim);
    this.drawText(ctx, dim);
    ctx.restore();
  }

  // A shake that is the same for every draw of one moment (the show's own time, not the frame's).
  rand2(salt) {
    return seeded(Math.floor(this.real * 40) * 7 + salt * 131)();
  }

  drawBackdrop(c) {
    const s = this.style;
    const fireF = this.fireLevel();
    c.fillStyle = s.wall[1];
    c.fillRect(0, 0, W, H);
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, s.wall[1]);
    g.addColorStop(0.55, s.wall[0]);
    g.addColorStop(1, s.wall[1]);
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    if (s.backdrop === 'hearth') this.backHearth(c, fireF);
    else if (s.backdrop === 'vent') this.backVent(c, fireF);
    else this.backLighthouse(c, fireF);
    // The floor.
    c.fillStyle = 'rgba(0,0,0,0.5)';
    c.fillRect(0, SMITH.floor, W, H - SMITH.floor);
    c.fillStyle = 'rgba(255,255,255,0.05)';
    c.fillRect(0, SMITH.floor, W, 2);
  }

  // How bright the fire is: low, a flare, then a steady roar.
  fireLevel() {
    const u = this.u;
    if (u < this.fireAt) return 0.28 + 0.1 * smooth(u / this.fireAt);
    const flare = Math.exp(-(((u - this.fireAt - 0.3) / 0.55) ** 2));
    return 0.62 + 0.38 * flare + 0.05 * Math.sin(this.real * 17) + 0.04 * Math.sin(this.real * 29);
  }

  flames(c, x, y, w, h, level) {
    const s = this.style;
    for (let i = 0; i < 7; i++) {
      const fx = x + (i + 0.5) * (w / 7);
      const sway = Math.sin(this.real * (6 + i) + i * 2) * 5 * level;
      const fh = h * (0.55 + 0.45 * Math.sin(this.real * (7 + i * 1.3) + i)) * level;
      const grad = c.createLinearGradient(0, y, 0, y - Math.max(8, fh));
      grad.addColorStop(0, s.fire[0]);
      grad.addColorStop(0.35, s.fire[1]);
      grad.addColorStop(1, `${s.fire[2]}00`);
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(fx - w / 12, y);
      c.quadraticCurveTo(fx - w / 18 + sway, y - fh * 0.5, fx + sway * 1.6, y - Math.max(8, fh));
      c.quadraticCurveTo(fx + w / 18 + sway, y - fh * 0.5, fx + w / 12, y);
      c.fill();
    }
  }

  stoneWall(c, x, y, w, h, line, seed) {
    const r = seeded(seed);
    c.strokeStyle = line;
    c.lineWidth = 2;
    for (let row = 0; row * 22 < h; row++) {
      let cx = x - (row % 2) * 24 - r() * 10;
      while (cx < x + w) {
        const bw = 36 + r() * 30;
        c.strokeRect(Math.round(cx), y + row * 22, Math.round(bw), 22);
        cx += bw;
      }
    }
  }

  backHearth(c, f) {
    // Teasel's: a brick hearth on the right with a hooded mouth, pots on a shelf, a bellows.
    this.stoneWall(c, 0, 0, W, SMITH.floor, 'rgba(0,0,0,0.35)', 4);
    // The shelf of mended pots.
    c.fillStyle = '#4a3020';
    c.fillRect(34, 120, 210, 8);
    const pots = [[50, 40, '#6a4a3a'], [92, 52, '#7a5a42'], [140, 36, '#5a3e30'], [182, 46, '#6e4c3a'], [220, 34, '#7a5a42']];
    for (const [px, ph, col] of pots) {
      c.fillStyle = col;
      c.beginPath();
      c.ellipse(px, 120 - ph / 2, 15, ph / 2, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(px - 15, 120 - ph / 2 - 2, 30, 3);
    }
    // The hearth: a brick block with a dark mouth, and fire in it.
    c.fillStyle = '#3a2a28';
    c.fillRect(448, 150, 190, 282);
    c.fillStyle = '#4a3632';
    c.fillRect(440, 140, 206, 24);
    this.stoneWall(c, 448, 164, 190, 268, 'rgba(0,0,0,0.5)', 9);
    c.fillStyle = '#0c0606';
    c.beginPath();
    c.moveTo(470, 340);
    c.lineTo(470, 244);
    c.quadraticCurveTo(470, 214, 520, 214);
    c.quadraticCurveTo(570, 214, 570, 244);
    c.lineTo(570, 340);
    c.fill();
    // Coals and flames.
    c.fillStyle = mix('#5a1408', '#ff7a22', f);
    c.fillRect(472, 322, 96, 18);
    this.flames(c, 474, 324, 92, 110, f);
    // A hooked bellows on the wall.
    c.fillStyle = '#5a4030';
    c.beginPath();
    c.moveTo(400, 300);
    c.lineTo(440, 290);
    c.lineTo(440, 326);
    c.lineTo(400, 316);
    c.fill();
  }

  backVent(c, f) {
    // Hobnail's: rough cave stone, stalactites, and a glowing fissure in the floor under the anvil.
    this.stoneWall(c, 0, 0, W, SMITH.floor, 'rgba(0,0,0,0.4)', 31);
    c.fillStyle = '#0c0808';
    for (let i = 0; i < 9; i++) {
      const x = 20 + i * 76 + ((i * 37) % 30);
      const hgt = 40 + ((i * 53) % 70);
      c.beginPath();
      c.moveTo(x - 24, 0);
      c.lineTo(x + 24, 0);
      c.lineTo(x + 4, hgt);
      c.fill();
    }
    // A pick and a coal heap, because it is his.
    c.strokeStyle = '#4a3624';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(560, 250);
    c.lineTo(604, 330);
    c.stroke();
    c.fillStyle = '#58585e';
    c.fillRect(540, 242, 44, 8);
    c.fillStyle = '#16100e';
    c.beginPath();
    c.moveTo(500, 432);
    c.lineTo(540, 372);
    c.lineTo(620, 432);
    c.fill();
    // The fissure: a crack of fire in the floor, and the column of heat above it.
    const crack = c.createLinearGradient(130, 0, 590, 0);
    crack.addColorStop(0, '#00000000');
    crack.addColorStop(0.5, mix('#c0300c', '#ffe0a0', f));
    crack.addColorStop(1, '#00000000');
    c.fillStyle = crack;
    c.fillRect(130, SMITH.floor - 4, 460, 8);
    const col = c.createLinearGradient(0, SMITH.floor, 0, 90);
    col.addColorStop(0, `rgba(255, 120, 40, ${0.55 * f})`);
    col.addColorStop(1, 'rgba(255, 120, 40, 0)');
    c.fillStyle = col;
    c.fillRect(180, 90, 360, SMITH.floor - 90);
  }

  backLighthouse(c, f) {
    // Orla's: a curved lighthouse wall, a high round window with the lamp's beam sweeping, a furnace and a quench tub.
    this.stoneWall(c, 0, 0, W, SMITH.floor, 'rgba(0,0,0,0.35)', 17);
    // The window, high on the right, with the night sea in it.
    c.save();
    c.beginPath();
    c.arc(540, 100, 52, 0, Math.PI * 2);
    c.clip();
    const sea = c.createLinearGradient(0, 48, 0, 152);
    sea.addColorStop(0, '#182a46');
    sea.addColorStop(0.55, '#2a4a70');
    sea.addColorStop(1, '#0c1a30');
    c.fillStyle = sea;
    c.fillRect(480, 40, 120, 120);
    c.fillStyle = 'rgba(190, 230, 255, 0.35)';
    for (let i = 0; i < 5; i++) c.fillRect(490 + i * 18 + ((i * 7) % 9), 112 + i * 7, 14, 2);
    c.restore();
    c.strokeStyle = '#4a5666';
    c.lineWidth = 8;
    c.beginPath();
    c.arc(540, 100, 52, 0, Math.PI * 2);
    c.stroke();
    // The lamp's beam, sweeping slowly across the wall from the window.
    const sweep = Math.sin(this.real * 0.7) * 0.5;
    c.save();
    c.translate(540, 100);
    c.rotate(Math.PI * 0.82 + sweep * 0.6);
    const beam = c.createLinearGradient(0, 0, 700, 0);
    beam.addColorStop(0, `rgba(255, 240, 190, ${0.34 + 0.12 * f})`);
    beam.addColorStop(1, 'rgba(255, 240, 190, 0)');
    c.fillStyle = beam;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(700, -110);
    c.lineTo(700, 110);
    c.fill();
    c.restore();
    // The furnace, low on the right.
    c.fillStyle = '#2c2c34';
    c.fillRect(496, 232, 142, 200);
    this.stoneWall(c, 496, 232, 142, 200, 'rgba(0,0,0,0.45)', 21);
    c.fillStyle = '#080608';
    c.beginPath();
    c.moveTo(520, 340);
    c.lineTo(520, 296);
    c.quadraticCurveTo(520, 272, 556, 272);
    c.quadraticCurveTo(592, 272, 592, 296);
    c.lineTo(592, 340);
    c.fill();
    c.fillStyle = mix('#5a1408', '#ff8a2a', f);
    c.fillRect(522, 326, 68, 14);
    this.flames(c, 524, 328, 64, 70, f);
    // The quench tub, on the left of the furnace, with water that catches the beam.
    c.fillStyle = '#4a3a2c';
    c.fillRect(428, 372, 58, 60);
    c.fillStyle = '#2a2018';
    c.fillRect(428, 372, 58, 6);
    c.fillStyle = '#3a6a90';
    c.fillRect(432, 374, 50, 4);
    c.fillStyle = '#6a5440';
    c.fillRect(428, 392, 58, 3);
    c.fillRect(428, 414, 58, 3);
    // Coils of rope and a hanging lantern hook (with its post: no floating light).
    c.strokeStyle = '#5a4a38';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(60, 0);
    c.lineTo(60, 120);
    c.stroke();
    c.fillStyle = '#5a4a38';
    c.fillRect(54, 120, 12, 8);
    c.fillStyle = `rgba(255, 190, 90, ${0.6 + 0.2 * f})`;
    c.fillRect(54, 128, 12, 16);
  }

  drawSmith(c) {
    const sprite = this.sprite;
    if (!sprite) return;
    const scale = Math.max(1, Math.round(SMITH.height / sprite.height));
    const w = sprite.width * scale;
    const h = sprite.height * scale;
    // He leans into each blow, and dips as it lands.
    const angle = this.hammerAngle();
    const lean = smooth((angle + 1.35) / 1.9) * 7 - (this.local > 0.6 ? 3 : 0);
    const dip = this.local > 0.6 ? 4 : 0;
    const t = this.tmp.getContext('2d');
    t.setTransform(1, 0, 0, 1, 0, 0);
    t.globalCompositeOperation = 'source-over';
    t.clearRect(0, 0, this.tmp.width, this.tmp.height);
    t.imageSmoothingEnabled = false;
    const tw = Math.min(this.tmp.width, w);
    const th = Math.min(this.tmp.height, h);
    t.drawImage(sprite, 0, 0, tw, th);
    // The forge's light, on the side facing it.
    t.globalCompositeOperation = 'source-atop';
    const f = this.fireLevel();
    const lit = t.createLinearGradient(0, 0, tw, 0);
    lit.addColorStop(0, `rgba(${this.style.glow}, ${0.05 + 0.1 * f})`);
    lit.addColorStop(1, `rgba(${this.style.glow}, ${0.28 + 0.4 * f + 0.25 * this.flash})`);
    t.fillStyle = lit;
    t.fillRect(0, 0, tw, th);
    t.globalCompositeOperation = 'source-over';
    // Dark outline for a silhouette against the glow (the sprite, offset in black).
    c.save();
    c.imageSmoothingEnabled = false;
    c.globalAlpha = 0.9;
    c.drawImage(this.tmp, 0, 0, tw, th, Math.round(SMITH.x - w / 2 + lean), Math.round(SMITH.floor - h + dip), w, h);
    c.restore();
  }

  drawAnvil(c) {
    const { x, top } = ANVIL;
    // The block under it.
    c.fillStyle = '#3a2c22';
    c.fillRect(x - 56, top + 56, 112, 36);
    c.fillStyle = '#4a382a';
    c.fillRect(x - 56, top + 56, 112, 6);
    // Waist and base.
    c.fillStyle = '#2a2630';
    c.beginPath();
    c.moveTo(x - 62, top + 56);
    c.lineTo(x - 46, top + 26);
    c.lineTo(x + 46, top + 26);
    c.lineTo(x + 62, top + 56);
    c.fill();
    // The face and horn.
    c.fillStyle = '#4a4a58';
    c.beginPath();
    c.moveTo(x - 110, top);
    c.lineTo(x + 70, top);
    c.lineTo(x + 130, top + 8);
    c.quadraticCurveTo(x + 150, top + 12, x + 118, top + 18);
    c.lineTo(x + 70, top + 26);
    c.lineTo(x - 100, top + 26);
    c.lineTo(x - 112, top + 14);
    c.fill();
    c.fillStyle = '#7a7a8c';
    c.fillRect(x - 108, top, 178, 4);
    c.fillStyle = 'rgba(0,0,0,0.35)';
    c.fillRect(x - 100, top + 18, 170, 8);
    // The face glows where the iron lies.
    c.fillStyle = `rgba(${this.style.glow}, ${0.1 + 0.25 * this.heat * (this.u < this.raiseStart ? 1 : 0)})`;
    c.fillRect(x - 108, top, 178, 4);
  }

  // The sword: drawn in slices along its length so the heat can run through it. The
  // notch where the shard broke away is cut in its top edge until the shard sinks in.
  drawSword(c) {
    const pose = this.bladePose();
    const raised = smooth((this.u - this.raiseStart) / (this.raiseEnd - this.raiseStart));
    c.save();
    c.translate(pose.x, pose.y);
    c.rotate(pose.angle);
    c.scale(pose.scale, pose.scale);
    c.translate(-BLADE.x, -BLADE.y);
    const slices = 44;
    const len = BLADE.length;
    const struck = (x) => Math.exp(-(((x - (STRIKE_X - (pose.x - BLADE.x) + 0)) / 46) ** 2));
    const heatAt = (along) => {
      const near = this.u < this.sinkStart && pose.angle === 0 ? struck(BLADE.x + along) * this.local * 0.5 : 0;
      const wholly = this.u >= this.sinkHit ? 1 : 0;
      return clamp01(this.heat * (0.92 + 0.1 * (along / len)) + near + wholly * 0.2);
    };
    const halfAt = (along) => {
      const f = along / len;
      if (f > 0.9) return BLADE.half * (1 - (f - 0.9) / 0.1) * 0.9 + 1;
      return BLADE.half * (0.92 + 0.08 * (1 - f));
    };
    const bite = (along) => {
      const d = Math.abs(BLADE.x + along - NOTCH_X);
      return this.healed ? 0 : d < 12 ? (1 - d / 12) * 9 : 0;
    };
    for (let i = 0; i < slices; i++) {
      const a0 = (i / slices) * len;
      const a1 = ((i + 1) / slices) * len + 0.6;
      const h = halfAt(a0);
      c.fillStyle = this.u >= this.sinkHit ? mix('#fff2c8', '#bfe6ff', i / slices) : heatColor(heatAt(a0));
      c.beginPath();
      c.moveTo(BLADE.x + a0, BLADE.y - h + bite(a0));
      c.lineTo(BLADE.x + a1, BLADE.y - halfAt(a1) + bite(a1));
      c.lineTo(BLADE.x + a1, BLADE.y + halfAt(a1));
      c.lineTo(BLADE.x + a0, BLADE.y + h);
      c.fill();
    }
    // A bright fuller down the middle, and the lit top edge.
    c.fillStyle = 'rgba(255, 255, 255, 0.28)';
    c.fillRect(BLADE.x + 14, BLADE.y - 2, len * 0.78, 3);
    c.fillStyle = `rgba(255, 255, 255, ${0.25 + 0.4 * this.heat})`;
    c.fillRect(BLADE.x + 4, BLADE.y - BLADE.half + 1, len * 0.86, 2);
    // The crossguard, grip and pommel (to the left of the blade).
    c.fillStyle = '#c8a04a';
    c.fillRect(BLADE.x - 12, BLADE.y - 26, 12, 52);
    c.fillStyle = '#ffe09a';
    c.fillRect(BLADE.x - 12, BLADE.y - 26, 4, 52);
    c.fillStyle = '#5a3a2a';
    c.fillRect(BLADE.x - 74, BLADE.y - 6, 62, 12);
    c.fillStyle = 'rgba(0,0,0,0.3)';
    for (let i = 0; i < 5; i++) c.fillRect(BLADE.x - 70 + i * 12, BLADE.y - 6, 2, 12);
    c.fillStyle = '#c8a04a';
    c.beginPath();
    c.arc(BLADE.x - 80, BLADE.y, 9, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#ffe09a';
    c.fillRect(BLADE.x - 84, BLADE.y - 5, 3, 3);
    // The pale star-metal sheen, once it's whole.
    if (raised > 0 || this.healed) {
      c.fillStyle = `rgba(210, 240, 255, ${0.25 * Math.max(raised, this.healed * 0.5)})`;
      c.fillRect(BLADE.x, BLADE.y - 3, len, 6);
    }
    c.restore();
    // The shard, falling into the notch.
    if (this.u >= this.sinkStart && this.u < this.sinkHit + 0.25) this.drawShard(c);
  }

  drawShard(c) {
    const p = clamp01((this.u - this.sinkStart) / (this.sinkHit - this.sinkStart));
    const fall = easeIn(p) * 0.55 + p * 0.45;
    const x = lerp(NOTCH_X + 40, NOTCH_X, p) + Math.sin(p * 9) * 6 * (1 - p);
    const y = lerp(40, BLADE.y - BLADE.half + 2, fall);
    const shrink = this.u > this.sinkHit ? clamp01(1 - (this.u - this.sinkHit) / 0.25) : 1;
    const r = 21 * shrink;
    this.shardAt = r < 0.5 ? null : { x, y, r };
    if (r < 0.5) return;
    c.save();
    c.translate(x, y);
    c.rotate(p * 5);
    const g = c.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.5, '#bfeaff');
    g.addColorStop(1, '#6aa8e0');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, -r * 1.5);
    c.lineTo(r * 0.8, 0);
    c.lineTo(0, r * 1.2);
    c.lineTo(-r * 0.7, -r * 0.1);
    c.fill();
    c.restore();
    // Its trail.
    for (let i = 1; i <= 6; i++) {
      const tp = clamp01(p - i * 0.04);
      const tx = lerp(NOTCH_X + 40, NOTCH_X, tp) + Math.sin(tp * 9) * 6 * (1 - tp);
      const ty = lerp(40, BLADE.y - BLADE.half + 2, easeIn(tp) * 0.55 + tp * 0.45);
      c.fillStyle = `rgba(190, 234, 255, ${0.35 - i * 0.05})`;
      c.beginPath();
      c.arc(tx, ty, Math.max(1, r * 0.5 - i), 0, Math.PI * 2);
      c.fill();
    }
  }

  drawHammer(c) {
    if (this.u > this.raiseStart - 0.2 && !(this.hitIndex < this.hits.length)) {
      // Put down once the blows are done.
    }
    const draw = (angle, alpha) => {
      c.save();
      c.globalAlpha = alpha;
      c.translate(HAND.x, HAND.y);
      c.rotate(angle);
      // The handle, and the head at its end.
      c.fillStyle = '#6a4a30';
      c.fillRect(0, -4, HANDLE, 8);
      c.fillStyle = '#8a6a48';
      c.fillRect(0, -4, HANDLE, 2);
      c.fillStyle = '#5a5a68';
      c.fillRect(HANDLE - 12, -20, 34, 40);
      c.fillStyle = '#9a9aac';
      c.fillRect(HANDLE - 12, -20, 34, 6);
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(HANDLE - 12, 12, 34, 8);
      // The head glows where it just struck hot iron.
      c.fillStyle = `rgba(${this.style.glow}, ${0.5 * this.local})`;
      c.fillRect(HANDLE + 12, -20, 10, 40);
      c.restore();
    };
    if (this.u > this.hits[this.hits.length - 1] + 0.7) return;
    const angle = this.hammerAngle();
    // Ghosts behind it as it falls (the slow motion's streak).
    const falling = this.hits.some((ts) => this.u > ts - this.style.fall * 1.6 && this.u < ts + 0.05);
    if (falling) for (let k = 3; k >= 1; k--) draw(this.hammerAngle(this.u - k * 0.028), 0.14);
    draw(angle, 1);
    // The arm: from the smith's shoulder to the hand, with a fist on the handle.
    c.save();
    c.lineCap = 'round';
    c.strokeStyle = '#2e2420';
    c.lineWidth = 17;
    c.beginPath();
    c.moveTo(SMITH.x + 36, SMITH.floor - SMITH.height * 0.55);
    c.lineTo(HAND.x, HAND.y);
    c.stroke();
    c.strokeStyle = '#6a5446';
    c.lineWidth = 12;
    c.stroke();
    c.fillStyle = '#7a6252';
    c.beginPath();
    c.arc(HAND.x, HAND.y, 11, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  // ----- the light -----
  drawLights(ctx, dim) {
    const f = this.fireLevel();
    const s = this.style;
    const glowAt = (x, y, r, a, col = s.glow) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${col}, ${(a * dim).toFixed(3)})`);
      g.addColorStop(1, `rgba(${col}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    // The forge's mouth.
    const spot = this.fireSpot();
    if (s.backdrop === 'vent') {
      glowAt(360, SMITH.floor, 420, 0.28 * f);
      glowAt(360, SMITH.floor - 6, 220, 0.35 * f);
    } else glowAt(spot.x, spot.y - 20, 300, 0.24 * f);
    // The blade and the spot under the hammer.
    if (this.u < this.raiseStart) {
      const at = this.bladePoint(BLADE.x + BLADE.length * 0.5);
      glowAt(at.x, at.y, 120 + 160 * this.heat, 0.18 + 0.35 * this.heat);
      if (this.local > 0) glowAt(STRIKE_X, BLADE.y - 10, 90, 0.7 * this.local, '255, 240, 200');
    } else {
      const pose = this.bladePose();
      const mid = this.bladePoint(BLADE.x + BLADE.length * 0.5);
      glowAt(mid.x, mid.y, 160 + 140 * smooth((this.u - this.raiseStart) / 1.5), 0.42, '255, 244, 214');
      glowAt(pose.x, pose.y, 110, 0.4, '255, 240, 200');
    }
    // The shard's own light as it falls.
    if (this.shardAt && this.u < this.sinkHit + 0.25) glowAt(this.shardAt.x, this.shardAt.y, 70 + this.shardAt.r * 2, 0.75, '190, 234, 255');
    // The notch's flare when the shard lands: a four-point star.
    if (this.flareStars > 0.01) {
      const at = this.bladePoint(NOTCH_X, this.bladeLocal(0, NOTCH_X));
      this.star(ctx, at.x, at.y, 120 * this.flareStars + 16, 0.85 * this.flareStars * dim);
      glowAt(at.x, at.y, 120 * this.flareStars + 30, 0.6 * this.flareStars, '255, 250, 230');
    }
  }

  // A sparkle: four long points and a bright core.
  star(ctx, x, y, size, alpha, col = '255, 250, 230') {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(${col}, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    const thin = size * 0.045;
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(thin, -thin, size, 0);
    ctx.quadraticCurveTo(thin, thin, 0, size);
    ctx.quadraticCurveTo(-thin, thin, -size, 0);
    ctx.quadraticCurveTo(-thin, -thin, 0, -size);
    ctx.fill();
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.28);
    g.addColorStop(0, `rgba(255, 255, 255, ${alpha.toFixed(3)})`);
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(-size * 0.28, -size * 0.28, size * 0.56, size * 0.56);
    ctx.restore();
  }

  drawRings(ctx, dim) {
    for (const r of this.rings) {
      const p = r.t / r.life;
      const radius = lerp(r.r, r.max, easeOut(p));
      const a = (1 - p) ** 1.5 * dim;
      ctx.lineWidth = Math.max(0.5, r.w * (1 - p));
      ctx.strokeStyle = `rgba(${r.col}, ${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, radius, radius * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();
      // A softer fat ring beside it.
      ctx.lineWidth = r.w * 3 * (1 - p) + 1;
      ctx.strokeStyle = `rgba(${r.col}, ${(a * 0.22).toFixed(3)})`;
      ctx.stroke();
    }
  }

  drawParticles(ctx, dim) {
    for (const p of this.particles) {
      const life = 1 - p.t / p.life;
      if (p.kind === 'spark') {
        ctx.strokeStyle = p.col;
        ctx.globalAlpha = Math.min(1, life * 1.6) * dim;
        ctx.lineWidth = Math.max(1, p.size * (0.5 + life * 0.5));
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.px ?? p.x, p.py ?? p.y);
        ctx.stroke();
        ctx.globalAlpha = life * 0.5 * dim;
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'glow') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.6);
        g.addColorStop(0, `rgba(255, 220, 140, ${(0.8 * life * dim).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255, 140, 40, 0)');
        ctx.fillStyle = g;
        ctx.globalAlpha = 1;
        ctx.fillRect(p.x - p.size * 2.6, p.y - p.size * 2.6, p.size * 5.2, p.size * 5.2);
      } else if (p.kind === 'ember') {
        const flick = 0.6 + 0.4 * Math.sin(p.t * 20 + p.wob);
        ctx.globalAlpha = Math.min(1, life * 2) * flick * dim;
        ctx.fillStyle = p.col;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.ceil(p.size), Math.ceil(p.size));
        ctx.globalAlpha = 0.25 * flick * dim * life;
        ctx.fillRect(Math.round(p.x) - 2, Math.round(p.y) - 2, Math.ceil(p.size) + 4, Math.ceil(p.size) + 4);
      }
    }
    ctx.globalAlpha = 1;
  }

  // Slow rays off the blade, once it's whole and lifted.
  drawRays(ctx, dim) {
    const p = smooth((this.u - this.sinkHit) / 1.2);
    if (p <= 0) return;
    const centre = this.u < this.raiseStart ? this.bladePoint(BLADE.x + BLADE.length * 0.5) : this.bladePoint(BLADE.x + BLADE.length * 0.5);
    const raised = smooth((this.u - this.raiseStart) / (this.raiseEnd - this.raiseStart));
    const count = 16;
    ctx.save();
    ctx.translate(centre.x, centre.y);
    ctx.rotate(this.real * 0.12);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const len = 330 + 220 * ((i * 37) % 7) / 7 + 120 * raised;
      const width = 0.05 + 0.03 * ((i * 13) % 5) / 5;
      const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
      g.addColorStop(0, `rgba(255, 246, 214, ${(0.34 * p * (0.4 + 0.6 * raised) * (1 - 0.45 * smooth((this.u - this.nameStart) / 0.9)) * dim).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255, 246, 214, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a - width) * len, Math.sin(a - width) * len);
      ctx.lineTo(Math.cos(a + width) * len, Math.sin(a + width) * len);
      ctx.fill();
    }
    ctx.restore();
  }

  drawTwinkles(ctx, dim) {
    for (const t of this.twinkles) {
      const p = t.t / t.life;
      const along = BLADE.x + t.f * BLADE.length * 0.95;
      const at = this.bladePoint(along, { across: t.side * 12 });
      const pulse = Math.sin(p * Math.PI);
      this.star(ctx, at.x, at.y, t.size * (0.4 + 0.9 * pulse), 0.9 * pulse * dim);
    }
  }

  // Steam and dust sit in front of the light (drawn normally, not added).
  drawSteamDust(ctx, dim) {
    for (const p of this.particles) {
      const life = 1 - p.t / p.life;
      if (p.kind === 'steam') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * (1.2 + (1 - life)));
        g.addColorStop(0, `rgba(226, 238, 248, ${(0.3 * life * dim).toFixed(3)})`);
        g.addColorStop(1, 'rgba(226, 238, 248, 0)');
        ctx.fillStyle = g;
        const r = p.size * (1.2 + (1 - life));
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      } else if (p.kind === 'dust') {
        ctx.fillStyle = `rgba(120, 100, 92, ${(0.7 * Math.min(1, life * 2) * dim).toFixed(3)})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.ceil(p.size), Math.ceil(p.size));
      }
    }
  }

  // ----- the words -----
  caption(ctx, text, alpha) {
    if (alpha <= 0.01) return;
    drawText(ctx, text, W / 2, H - 56, { size: 26, color: `rgba(255, 246, 224, ${alpha.toFixed(3)})`, align: 'center', outline: `rgba(0,0,0,${alpha.toFixed(3)})` });
  }

  drawText(ctx, dim) {
    const s = this.style;
    const u = this.u;
    const fadeEnd = this.ending ? 1 - clamp01(this.endT / this.fadeOut) : 1;
    // Captions: what the smith says, over the work.
    const cap = (from, to, text) => this.caption(ctx, text, smooth((u - from) / 0.3) * (1 - smooth((u - to) / 0.3)) * fadeEnd);
    const second = this.hits[1] ?? this.sinkStart;
    cap(this.dimEnd + 0.1, second - 0.2, s.captions.intro);
    if (this.hits.length > 1) cap(second + 0.2, this.sinkStart, s.captions.mid);
    // Hobnail's grunt pops by the hammer with each blow.
    for (const p of this.pops) {
      const k = p.t / p.life;
      drawText(ctx, p.text, p.x, p.y - k * 24, { size: 34, color: `rgba(255, 214, 160, ${(1 - k).toFixed(3)})`, align: 'center', outline: `rgba(0,0,0,${(1 - k).toFixed(3)})` });
    }
    if (u < this.nameStart - 0.1) return;
    this.drawName(ctx, fadeEnd, dim);
  }

  drawName(ctx, fade, dim) {
    const s = this.style;
    const u = this.u - this.nameStart;
    const name = this.forging.name.toUpperCase();
    const size = name.length > 14 ? 54 : 58;
    const cx = W / 2;
    const y = 286;
    // A band of dark behind the words, so they read over the light.
    const band = ctx.createLinearGradient(0, y - 40, 0, y + 190);
    band.addColorStop(0, 'rgba(6, 4, 12, 0)');
    band.addColorStop(0.18, `rgba(6, 4, 12, ${(0.6 * smooth(u / 0.6) * fade).toFixed(3)})`);
    band.addColorStop(0.9, `rgba(6, 4, 12, ${(0.6 * smooth(u / 0.6) * fade).toFixed(3)})`);
    band.addColorStop(1, 'rgba(6, 4, 12, 0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, y - 40, W, 230);

    // The name, a letter at a time, each popping in bigger and settling.
    const letters = [...name];
    const total = letters.reduce((sum, ch) => sum + textWidth(ctx, ch, size), 0);
    let x = cx - total / 2;
    letters.forEach((ch, i) => {
      const w = textWidth(ctx, ch, size);
      const p = clamp01((u - 0.05 * i) / 0.32);
      if (p > 0) {
        const pop = 1 + (1 - easeOut(p)) * 0.9;
        ctx.save();
        ctx.translate(x + w / 2, y + size / 2);
        ctx.scale(pop, pop);
        ctx.globalAlpha = clamp01(p * 1.6) * fade;
        ctx.shadowColor = `rgba(${s.nameGlow}, 0.95)`;
        ctx.shadowBlur = 26 + 14 * Math.sin(u * 3 + i * 0.7);
        const g = ctx.createLinearGradient(0, -size / 2, 0, size / 2);
        g.addColorStop(0, s.name[0]);
        g.addColorStop(1, s.name[1]);
        drawText(ctx, ch, 0, -size / 2 + 2, { size, color: g, align: 'center', outline: 'rgba(20, 10, 4, 0.9)' });
        ctx.restore();
      }
      x += w;
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // A thin line of light under it.
    const line = smooth((u - 0.5) / 0.6) * fade;
    const lw = 280 * line;
    const lg = ctx.createLinearGradient(cx - lw, 0, cx + lw, 0);
    lg.addColorStop(0, 'rgba(255, 240, 200, 0)');
    lg.addColorStop(0.5, `rgba(255, 240, 200, ${(0.9 * line).toFixed(3)})`);
    lg.addColorStop(1, 'rgba(255, 240, 200, 0)');
    ctx.fillStyle = lg;
    ctx.fillRect(cx - lw, y + size + 4, lw * 2, 2);

    // Its power, and what STARFALL does now.
    const a1 = smooth((u - 0.5) / 0.4) * fade;
    const was = this.previous?.fightPower;
    const power = `POWER  x${this.forging.fightPower.toFixed(2)}`;
    drawText(ctx, power, cx - (was ? 40 : 0), y + size + 12, { size: 32, color: `rgba(255, 246, 224, ${a1.toFixed(3)})`, align: 'center', outline: `rgba(0,0,0,${a1.toFixed(3)})` });
    if (was) {
      const pw = textWidth(ctx, power, 32);
      drawText(ctx, `was x${was.toFixed(2)}`, cx - 40 + pw / 2 + 16, y + size + 18, { size: 24, color: `rgba(190, 180, 210, ${(a1 * 0.9).toFixed(3)})`, outline: `rgba(0,0,0,${a1.toFixed(3)})` });
    }
    const a2 = smooth((u - 0.85) / 0.4) * fade;
    const stars = this.forging.stars;
    drawText(ctx, 'STARFALL', cx - 4, y + size + 50, { size: 30, color: `rgba(255, 224, 150, ${a2.toFixed(3)})`, align: 'right', outline: `rgba(0,0,0,${a2.toFixed(3)})` });
    for (let i = 0; i < stars; i++) {
      const sa = smooth((u - 1.0 - i * 0.12) / 0.25) * fade * dim;
      if (sa <= 0) continue;
      const newest = i === stars - 1;
      const big = newest ? 15 + 4 * Math.sin(u * 5) : 11;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      this.star(ctx, cx + 22 + i * 36, y + size + 64, big * 1.6, sa * (newest ? 1 : 0.7), newest ? '255, 250, 230' : '255, 214, 120');
      ctx.restore();
    }
    // The smith's last word.
    const a3 = smooth((u - 1.3) / 0.4) * fade;
    drawText(ctx, s.captions.name, cx, y + size + 92, { size: 24, color: `rgba(230, 220, 240, ${a3.toFixed(3)})`, align: 'center', outline: `rgba(0,0,0,${a3.toFixed(3)})` });
    // Z to go on, once it can be.
    if (this.u >= this.holdMin && !this.ending) {
      const blink = 0.5 + 0.5 * Math.sin(this.real * 4);
      drawText(ctx, '▼', W - 40, H - 44, { size: 22, color: `rgba(255, 255, 255, ${(0.4 + 0.5 * blink).toFixed(3)})`, align: 'center', outline: '#000' });
    }
  }
}
