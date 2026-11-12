import { TILE_SIZE as T, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { glowSprite } from './lamplight.js';
import { drawRainLayer, lightningLevel, paintFlash } from './atmosphere.js';
import { music } from '../audio/music.js';

// STAGE EFFECTS for cutscenes: the lights, curtains and confetti of King
// Peptup's show, the Sunstone guttering, and the wave of light when it
// blazes up again. A scene turns them on with a `stage` step, and they go on
// by themselves, drawn over the room (ScenePlayer.drawOverlay), until the
// scene says otherwise or ends:
//
//   { do: 'stage', spots: [ { at: {x, y}, color: '255, 240, 180', radius: 34,
//       sweep: { rx: 4, ry: 1.5, period: 5, phase: 0 } } ] }
//         Glow-worm spotlights on the floor round a tile (tile coordinates)
//         with a beam coming down from the roof. `sweep` wanders the pool
//         round in an ellipse (tiles, seconds); `onto: '<actor id>'` follows
//         someone instead; `from` is where the beam leaves the roof (tiles).
//         `spots: []` puts them out.
//   { do: 'stage', curtains: { x, y, w, h, open: 0 } }
//         Velvet curtains over a box of tiles. `open` 0 closed, 1 right back
//         at the sides; with `seconds` they glide there (without it they
//         jump). `curtains: null` takes them down.
//   { do: 'stage', confetti: 4 }      paper rains for that many seconds.
//   { do: 'stage', flicker: 2.2 }     the light stutters: the whole view
//                                     dips dark in jerks and half recovers.
//   { do: 'stage', dim: 0.2 }         holds the view that much darker
//                                     (`seconds` to ease; 0 to clear).
//   { do: 'stage', sky: 0.7 }        the storm look comes over the view: a green wash,
//                                     deep teal at the top, sickly yellow-green low
//                                     down, and everything a little darker (0
//                                     clears it; `seconds` eases it in or out).
//   { do: 'stage', rain: 0.8 }       slanting rain over the view (0 clears it; 1 is steady, 1.5 a
//                                     downpour; `seconds` eases it in or out).
//   { do: 'stage', bolt: true }      one flash of lightning (a hard white-green frame and a
//                                     fainter second pulse) with a clap of thunder behind it.
//   { do: 'stage', white: 1 }        the whole view whited out (0 clears it);
//                                     `seconds` eases it: blinking into the
//                                     daylight after a long time underground.
//   { do: 'stage', tilt: 0.38 }       looks up: the room slides down the screen
//                                     by that much of its height and a dusk sky
//                                     comes in over the top, with a first star
//                                     (0 comes back down; `seconds` eases it).
//   { do: 'stage', flare: { at: {x, y}, seconds: 2.4 } }
//                                     a blaze: white-gold flash, then rings
//                                     of light rolling out from that tile.
//   { do: 'stage', rubble: 6 }        the roof coming down: chunks of rock and
//                                     crystal fall and bounce, dust drifts, for
//                                     that many seconds (0 stops it at once;
//                                     `rubbleAmount` 0 to 2 is how much, 1 usual).
//   { do: 'stage', haze: 0.8 }       dust hanging in the air: slow, wide banks of it
//                                     drifting over the view (0 to 1.5; `seconds`
//                                     eases it in or out, so it can settle).
//   { do: 'stage', burst: { at: {x, y}, power: 1 } }
//                                     a splash of dust and flying grit from that
//                                     tile, once (`power` 0.5 to 2): something
//                                     heavy landing.
//   { do: 'stage', shafts: [ { at: {x, y}, w: 1.5, color: '255, 240, 170' } ] }
//                                     pillars cracked and shining through:
//                                     pulsing shafts of light from the roof down
//                                     to that tile (`shafts: []` puts them out).
//   { do: 'stage', notes: { at: {x, y}, seconds: 3 } }
//                                     music notes floating up from that tile
//                                     and away (a whistle echoing through rock).
//   { do: 'stage', doorway: { at: {x, y}, w: 5, length: 13 } }
//                                     light from outside spilling in through a
//                                     doorway: a fan of it up the floor from
//                                     that tile (the middle of the threshold),
//                                     `w` tiles wide there, `length` tiles long,
//                                     bright through any `dim`. `seconds` eases
//                                     it in; `doorway: null` shuts it.
//   { do: 'stage', shadow: { at: {x, y}, seconds: 5 } }
//                                     somebody steps into the light outside the
//                                     `doorway` and their shadow looms in: a long
//                                     figure stretching up the floor from the
//                                     threshold, its head creeping up to `at`
//                                     (tiles), swaying a little as they come,
//                                     and the light round it dimmed where they
//                                     block it. Only the shadow: whoever casts
//                                     it is never shown. `shadow: null` lifts it.
//   { do: 'stage', flood: 0.4 }      the sea coming in: green water over the bottom
//                                     of the view, that much of its height deep,
//                                     heaving, with foam along the top (0 drains
//                                     it; `seconds` eases it up or down).
//   { do: 'stage', glow: { who: 'player', power: 0.5 } }
//                                     light pouring out of someone (an actor id,
//                                     or 'player'): a white bloom and rays, the
//                                     whole view going white as `power` nears 1,
//                                     and any `flood` pushed down before it.
//                                     The `press` step drives it as the bar
//                                     fills; `glow: null` puts it out.

const CONFETTI = ['#e8484e', '#f6c640', '#4aa8e8', '#58c878', '#f08ad0', '#ffffff'];

function noise(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export class Stage {
  constructor() {
    this.time = 0;
    this.spots = [];
    this.curtain = null;
    this.confetti = [];
    this.confettiLeft = 0;
    this.flickerAt = null;
    this.flickerLength = 0;
    this.dim = { from: 0, to: 0, t: 1, seconds: 0 };
    this.flare = null;
    this.white = { from: 0, to: 0, t: 1, seconds: 0 };
    this.tilt = { from: 0, to: 0, t: 1, seconds: 0 };
    this.shot = null;
    this.rubble = [];
    this.rubbleLeft = 0;
    this.rubbleAmount = 1;
    this.shafts = [];
    this.haze = { from: 0, to: 0, t: 1, seconds: 0 };
    this.sky = { from: 0, to: 0, t: 1, seconds: 0 };
    this.rain = { from: 0, to: 0, t: 1, seconds: 0 };
    this.boltAt = null;
    this.notes = [];
    this.notesFrom = null;
    this.shadow = null;
    this.doorway = null;
    this.flood = { from: 0, to: 0, t: 1, seconds: 0 };
    this.glow = null;
  }

  // One `stage` step.
  apply(step) {
    if (step.spots !== undefined) {
      this.spots = (step.spots ?? []).map((spot, i) => ({ ...spot, i, color: spot.color ?? '255, 240, 180', radius: spot.radius ?? 34 }));
    }
    if (step.curtains !== undefined) {
      if (!step.curtains) this.curtain = null;
      else {
        const c = step.curtains;
        const open = c.open ?? 0;
        this.curtain = { x: c.x, y: c.y, w: c.w, h: c.h, from: this.curtain ? this.curtain.now : open, to: open, now: this.curtain ? this.curtain.now : open, t: 0, seconds: c.seconds ?? 0 };
        if (!this.curtain.seconds) this.curtain.now = open;
      }
    }
    if (step.confetti) this.confettiLeft = step.confetti;
    if (step.flicker) {
      this.flickerAt = this.time;
      this.flickerLength = step.flicker;
    }
    if (step.dim !== undefined) {
      const current = this.dimNow();
      this.dim = { from: current, to: step.dim, t: 0, seconds: step.seconds ?? 0 };
    }
    if (step.white !== undefined) this.white = { from: this.whiteNow(), to: step.white, t: 0, seconds: step.seconds ?? 0 };
    if (step.tilt !== undefined) this.tilt = { from: this.tiltNow(), to: step.tilt, t: 0, seconds: step.seconds ?? 0 };
    if (step.sky !== undefined) this.sky = { from: this.skyNow(), to: step.sky, t: 0, seconds: step.seconds ?? 0 };
    if (step.rain !== undefined) this.rain = { from: this.rainNow(), to: step.rain, t: 0, seconds: step.seconds ?? 0 };
    if (step.bolt) {
      this.boltAt = this.time;
      music.thunderCue(0.5, 0.9);
    }
    if (step.haze !== undefined) this.haze = { from: this.hazeNow(), to: step.haze, t: 0, seconds: step.seconds ?? 0 };
    if (step.burst) this.burst(step.burst);
    if (step.rubbleAmount !== undefined) this.rubbleAmount = step.rubbleAmount;
    if (step.rubble !== undefined) {
      this.rubbleLeft = step.rubble;
      if (!step.rubble) this.rubble = this.rubble.filter((p) => p.burst);
    }
    if (step.shafts !== undefined) this.shafts = (step.shafts ?? []).map((sh, i) => ({ ...sh, i, w: sh.w ?? 1.5, color: sh.color ?? '255, 240, 170' }));
    if (step.notes) this.notesFrom = { at: step.notes.at, left: step.notes.seconds ?? 3 };
    if (step.shadow !== undefined) {
      const sh = step.shadow;
      this.shadow = sh ? { at: sh.at, alpha: sh.alpha ?? 0.9, seconds: sh.seconds ?? 4, t: 0 } : null;
    }
    if (step.doorway !== undefined) {
      const d = step.doorway;
      this.doorway = d ? { at: d.at, w: d.w ?? 5, length: d.length ?? 13, color: d.color ?? '255, 226, 170', seconds: d.seconds ?? 0, t: 0 } : null;
    }
    if (step.flare) this.flare = { at: step.flare.at, seconds: step.flare.seconds ?? 2.4, t: 0 };
    if (step.flood !== undefined) this.flood = { from: this.floodNow(), to: step.flood, t: 0, seconds: step.seconds ?? 0 };
    if (step.glow !== undefined) this.glow = step.glow ? { who: step.glow.who ?? 'player', power: step.glow.power ?? 1 } : null;
  }

  // Eased both ways, like the look up: water rises and settles, it doesn't jerk.
  floodNow() {
    const f = this.flood;
    if (!f.seconds || f.t >= f.seconds) return f.to;
    const k = f.t / f.seconds;
    return f.from + (f.to - f.from) * k * k * (3 - 2 * k);
  }

  skyNow() {
    const s = this.sky;
    if (!s.seconds || s.t >= s.seconds) return s.to;
    return s.from + (s.to - s.from) * (s.t / s.seconds);
  }

  rainNow() {
    const r = this.rain;
    if (!r.seconds || r.t >= r.seconds) return r.to;
    return r.from + (r.to - r.from) * (r.t / r.seconds);
  }

  hazeNow() {
    const h = this.haze;
    if (!h.seconds || h.t >= h.seconds) return h.to;
    return h.from + (h.to - h.from) * (h.t / h.seconds);
  }

  // Something heavy lands: a ring of dust rolls out along the floor, grit and
  // chips fly up and come down, and a puff stands over the spot.
  burst({ at, power = 1 }) {
    const x = (at.x + 0.5) * T;
    const y = (at.y + 0.5) * T;
    const seed = this.time * 211 + x;
    const puffs = Math.round(16 * power);
    for (let i = 0; i < puffs; i++) {
      const a = (i / puffs) * Math.PI * 2 + noise(seed + i) * 0.4;
      const v = (14 + noise(seed + i + 20) * 26) * Math.min(1.6, power);
      this.rubble.push({ kind: 'dust', burst: true, x: x + Math.cos(a) * 3, y: y + Math.sin(a) * 1.5, r: 3 + noise(seed + i + 40) * 3, life: 0, span: 0.9 + noise(seed + i + 60) * 1.1, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.4 - 2 });
    }
    // The tall puff over the spot.
    for (let i = 0; i < Math.round(5 * power); i++) {
      this.rubble.push({ kind: 'dust', burst: true, x: x + (noise(seed + i + 80) - 0.5) * 10, y: y - noise(seed + i + 90) * 6, r: 4 + noise(seed + i + 100) * 4, life: 0, span: 1.3 + noise(seed + i + 110) * 0.9, vx: (noise(seed + i + 120) - 0.5) * 8, vy: -9 - noise(seed + i + 130) * 9 });
    }
    const chips = Math.round(14 * power);
    for (let i = 0; i < chips; i++) {
      const big = noise(seed + i + 140) > 0.78;
      this.rubble.push({
        kind: 'chunk',
        burst: true,
        x: x + (noise(seed + i + 150) - 0.5) * 8,
        y,
        vx: (noise(seed + i + 160) - 0.5) * 90 * Math.min(1.5, power),
        vy: -(50 + noise(seed + i + 170) * 70) * Math.min(1.4, power),
        floor: y + 2 + noise(seed + i + 180) * 8,
        size: big ? 3 : 1 + Math.floor(noise(seed + i + 190) * 2),
        color: ['#6a5a52', '#8a7a6a', '#4a3e3a', '#a89a88', '#5a4a44', '#7ad8d0'][Math.floor(noise(seed + i + 200) * 6)],
        bounces: 0,
      });
    }
  }

  dimNow() {
    const d = this.dim;
    if (!d.seconds || d.t >= d.seconds) return d.to;
    return d.from + (d.to - d.from) * (d.t / d.seconds);
  }

  whiteNow() {
    const w = this.white;
    if (!w.seconds || w.t >= w.seconds) return w.to;
    return w.from + (w.to - w.from) * (w.t / w.seconds);
  }

  // Eased both ways, so the look up starts and ends gently.
  tiltNow() {
    const m = this.tilt;
    if (!m.seconds || m.t >= m.seconds) return m.to;
    const k = m.t / m.seconds;
    return m.from + (m.to - m.from) * k * k * (3 - 2 * k);
  }

  update(dt, camera) {
    this.time += dt;
    this.dim.t += dt;
    this.white.t += dt;
    this.tilt.t += dt;
    this.haze.t += dt;
    this.sky.t += dt;
    this.rain.t += dt;
    this.flood.t += dt;
    if (this.curtain && this.curtain.seconds && this.curtain.t < this.curtain.seconds) {
      this.curtain.t += dt;
      const k = Math.min(1, this.curtain.t / this.curtain.seconds);
      const ease = k * k * (3 - 2 * k);
      this.curtain.now = this.curtain.from + (this.curtain.to - this.curtain.from) * ease;
    }
    if (this.flare) {
      this.flare.t += dt;
      if (this.flare.t > this.flare.seconds + 1.2) this.flare = null;
    }
    // Paper, spawned across the top of whatever the camera sees.
    if (this.confettiLeft > 0 && camera) {
      this.confettiLeft -= dt;
      const count = Math.max(1, Math.round(dt * 130));
      for (let i = 0; i < count; i++) {
        const seed = this.time * 977 + i * 13.37 + this.confetti.length;
        this.confetti.push({
          x: camera.x + noise(seed) * SCREEN_WIDTH,
          y: camera.y - 6 - noise(seed + 1) * 14,
          vy: 22 + noise(seed + 2) * 30,
          sway: noise(seed + 3) * 6.28,
          swing: 4 + noise(seed + 4) * 8,
          spin: 4 + noise(seed + 5) * 6,
          color: CONFETTI[Math.floor(noise(seed + 6) * CONFETTI.length)],
        });
      }
    }
    for (const p of this.confetti) {
      p.y += p.vy * dt;
      p.sway += dt * 2.4;
    }
    if (camera) this.confetti = this.confetti.filter((p) => p.y < camera.y + SCREEN_HEIGHT + 6);
    if (camera) this.updateRubble(dt, camera);
    this.updateNotes(dt);
    if (this.shadow) this.shadow.t += dt;
    if (this.doorway) this.doorway.t += dt;
  }

  // Rock and crystal coming off the roof, bouncing on the floor, and dust
  // that hangs and slowly drifts.
  updateRubble(dt, camera) {
    if (this.rubbleLeft > 0) {
      this.rubbleLeft -= dt;
      const count = Math.max(1, Math.round(dt * 38 * this.rubbleAmount));
      for (let i = 0; i < count; i++) {
        const seed = this.time * 733 + i * 17.13 + this.rubble.length;
        const big = noise(seed + 7) > 0.8;
        this.rubble.push({
          kind: 'chunk',
          x: camera.x + noise(seed) * SCREEN_WIDTH,
          y: camera.y - 8,
          vy: 20 + noise(seed + 2) * 40,
          vx: (noise(seed + 3) - 0.5) * 10,
          floor: camera.y + SCREEN_HEIGHT * (0.45 + noise(seed + 4) * 0.55),
          size: big ? 4 + Math.floor(noise(seed + 5) * 3) : 1 + Math.floor(noise(seed + 5) * 3),
          color: ['#6a5a52', '#8a7a6a', '#4a3e3a', '#a89a88', '#5a4a44', '#7ad8d0'][Math.floor(noise(seed + 6) * 6)],
          bounces: 0,
        });
      }
      // And a puff of dust for every few.
      if (noise(this.time * 91) > 0.55) {
        const seed = this.time * 311;
        this.rubble.push({ kind: 'dust', x: camera.x + noise(seed) * SCREEN_WIDTH, y: camera.y + noise(seed + 1) * SCREEN_HEIGHT, r: 4 + noise(seed + 2) * 6, life: 0, span: 1.2 + noise(seed + 3) * 1.4, vx: (noise(seed + 4) - 0.5) * 8 });
      }
    }
    for (const p of this.rubble) {
      if (p.kind === 'dust') {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += (p.vy ?? -3) * dt;
        if (p.vy !== undefined) {
          p.vx *= 0.97;
          p.vy *= 0.97;
        }
        p.r += 5 * dt;
        continue;
      }
      if (p.landed) {
        p.landed += dt;
        continue;
      }
      p.vy += 160 * dt;
      p.y += p.vy * dt;
      p.x += p.vx * dt;
      if (p.y >= p.floor) {
        p.y = p.floor;
        if (p.bounces < 1 && p.size > 2) {
          p.vy = -p.vy * 0.3;
          p.bounces++;
        } else {
          p.landed = 0.001;
        }
      }
    }
    this.rubble = this.rubble.filter((p) => (p.kind === 'dust' ? p.life < p.span : !p.landed || p.landed < 1.5));
  }

  updateNotes(dt) {
    const from = this.notesFrom;
    if (from && from.left > 0) {
      from.left -= dt;
      from.gap = (from.gap ?? 0) - dt;
      if (from.gap <= 0) {
        from.gap = 0.28;
        const seed = this.time * 53 + this.notes.length;
        this.notes.push({ x: (from.at.x + 0.5) * T + (noise(seed) - 0.5) * 10, y: (from.at.y + 0.5) * T, t: 0, sway: noise(seed + 1) * 6.28, kind: Math.floor(noise(seed + 2) * 3) });
      }
    }
    for (const n of this.notes) n.t += dt;
    this.notes = this.notes.filter((n) => n.t < 3.2);
  }

  // Everything, over the room. `bodyAt(id)` finds a scene actor.
  draw(ctx, camera, bodyAt) {
    this.drawSpots(ctx, camera, bodyAt);
    this.drawCurtains(ctx, camera);
    this.drawConfetti(ctx, camera);
    this.drawShafts(ctx, camera);
    this.drawHaze(ctx, camera);
    this.drawRubble(ctx, camera);
    this.drawNotes(ctx, camera);
    this.drawFlood(ctx);
    this.drawGlow(ctx, camera, bodyAt);
    this.drawSky(ctx);
    this.drawStormRain(ctx);
    this.drawFlicker(ctx);
    this.drawDoorway(ctx, camera);
    this.drawFlare(ctx, camera);
    this.drawWhite(ctx);
    this.drawTilt(ctx);
  }

  // The sea coming in over the bottom of the view: a heaving green body of
  // water, darker as it deepens, light lines sliding through it, and a ragged
  // band of foam along the top. A `glow` shoves it down.
  drawFlood(ctx) {
    const push = this.glow ? Math.min(1, this.glow.power) : 0;
    const level = this.floodNow() * (1 - 0.9 * push);
    if (level <= 0.004) return;
    const t = this.time;
    const top = SCREEN_HEIGHT * (1 - level);
    const surface = (x) => top + Math.sin(x * 0.045 + t * 2.1) * 3 + Math.sin(x * 0.11 - t * 3.3) * 1.5;
    const body = ctx.createLinearGradient(0, top - 4, 0, SCREEN_HEIGHT);
    body.addColorStop(0, 'rgba(70, 150, 128, 0.5)');
    body.addColorStop(0.35, 'rgba(32, 96, 88, 0.7)');
    body.addColorStop(1, 'rgba(10, 44, 48, 0.88)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(0, SCREEN_HEIGHT);
    for (let x = 0; x <= SCREEN_WIDTH; x += 4) ctx.lineTo(x, surface(x));
    ctx.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.closePath();
    ctx.fill();
    // Light lines slipping along under the surface.
    for (let i = 0; i < 26; i++) {
      const depth = noise(i + 7);
      const y = top + 6 + depth * (SCREEN_HEIGHT - top);
      if (y > SCREEN_HEIGHT) continue;
      const x = ((noise(i + 31) * SCREEN_WIDTH * 1.3 + t * (14 + depth * 20) * (i % 2 ? 1 : -1)) % (SCREEN_WIDTH + 40) + SCREEN_WIDTH + 40) % (SCREEN_WIDTH + 40) - 20;
      ctx.fillStyle = `rgba(170, 236, 210, ${(0.35 * (1 - depth)).toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), 6 + Math.round(depth * 10), 1);
    }
    // The foam: a bright broken line on the crest, and flecks just under it.
    for (let x = 0; x < SCREEN_WIDTH; x += 2) {
      const y = Math.round(surface(x));
      const n = noise(Math.floor(x / 2) + Math.floor(t * 6) * 0.37);
      ctx.fillStyle = n > 0.25 ? 'rgba(236, 255, 244, 0.9)' : 'rgba(190, 236, 220, 0.7)';
      ctx.fillRect(x, y - 1, 2, n > 0.6 ? 2 : 1);
      if (n > 0.8) {
        ctx.fillStyle = 'rgba(220, 250, 236, 0.6)';
        ctx.fillRect(x, y + 2 + Math.round(n * 3), 1, 1);
      }
    }
  }

  // Light pouring out of someone: a bloom, slow rays turning round them, and
  // as `power` nears 1 the whole view going white.
  drawGlow(ctx, camera, bodyAt) {
    const g = this.glow;
    if (!g || g.power <= 0.004) return;
    const body = bodyAt(g.who);
    if (!body) return;
    const x = body.x - camera.x;
    const y = body.y - 12 - camera.y;
    const p = Math.min(1, g.power);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // The rays: long thin wedges, turning slowly, longer as it grows.
    const rays = 12;
    const reach = 30 + p * 360;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 + this.time * 0.25 + noise(i) * 0.3;
      const spread = 0.05 + noise(i + 50) * 0.05;
      const len = reach * (0.6 + noise(i + 90) * 0.4) * (0.92 + 0.08 * Math.sin(this.time * 3 + i));
      ctx.fillStyle = `rgba(255, 252, 236, ${(0.18 + 0.3 * p).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a - spread) * len, y + Math.sin(a - spread) * len);
      ctx.lineTo(x + Math.cos(a + spread) * len, y + Math.sin(a + spread) * len);
      ctx.closePath();
      ctx.fill();
    }
    // The bloom.
    const radius = 16 + p * p * 300;
    const bloom = ctx.createRadialGradient(x, y, 1, x, y, radius);
    bloom.addColorStop(0, `rgba(255, 255, 255, ${(0.7 + 0.3 * p).toFixed(3)})`);
    bloom.addColorStop(0.4, `rgba(255, 250, 228, ${(0.35 + 0.4 * p).toFixed(3)})`);
    bloom.addColorStop(1, 'rgba(255, 244, 210, 0)');
    ctx.fillStyle = bloom;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
    // Swallowing the room.
    const wash = Math.max(0, (p - 0.55) / 0.45);
    if (wash > 0) {
      ctx.fillStyle = `rgba(255, 252, 240, ${(wash * wash * 0.92).toFixed(3)})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  }

  // Rain and the odd bolt, for scenes that bring the storm in.
  drawStormRain(ctx) {
    const rain = this.rainNow();
    if (rain > 0.01) drawRainLayer(ctx, this.time, rain);
    if (this.boltAt !== null) {
      const dt = this.time - this.boltAt;
      if (dt > 0.9) this.boltAt = null;
      else paintFlash(ctx, lightningLevel(dt));
    }
  }

  // The green storm look: a wash from deep teal above to yellow-green below.
  drawSky(ctx) {
    const k = this.skyNow();
    if (k <= 0.005) return;
    const g = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    g.addColorStop(0, `rgba(8, 52, 40, ${(0.62 * k).toFixed(3)})`);
    g.addColorStop(1, `rgba(104, 128, 28, ${(0.52 * k).toFixed(3)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  drawWhite(ctx) {
    const alpha = this.whiteNow();
    if (alpha <= 0.005) return;
    ctx.fillStyle = `rgba(255, 249, 230, ${alpha.toFixed(3)})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  // Looking up at the evening: everything drawn so far slides down the
  // screen and a dusk sky fills the gap, a low line of far trees along the
  // seam, a few stars and, last, the first one, bright, with a glint.
  drawTilt(ctx) {
    const k = this.tiltNow();
    if (k <= 0.002) return;
    const canvas = ctx.canvas;
    const W = canvas.width;
    const H = canvas.height;
    if (!this.shot || this.shot.width !== W || this.shot.height !== H) {
      this.shot = document.createElement('canvas');
      this.shot.width = W;
      this.shot.height = H;
    }
    this.shot.getContext('2d').drawImage(canvas, 0, 0);
    const scale = W / SCREEN_WIDTH;
    const drop = Math.round(k * H / 2) * 2;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // The sky: indigo overhead, rose, then a warm band at the treeline.
    const sky = ctx.createLinearGradient(0, 0, 0, drop);
    sky.addColorStop(0, '#141a45');
    sky.addColorStop(0.45, '#2c2c68');
    sky.addColorStop(0.75, '#7a4a86');
    sky.addColorStop(0.92, '#d98a7a');
    sky.addColorStop(1, '#f4b682');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, drop + 2);
    // Stars come out as the sky comes in, hung from the sky so they slide down with it.
    const reveal = Math.min(1, k / 0.3);
    for (let i = 0; i < 46; i++) {
      const x = Math.round(noise(i * 3.1) * W / 2) * 2;
      const y = Math.round((drop - H * 0.5 + noise(i * 5.3 + 1) * H * 0.42) / 2) * 2;
      if (y < 0 || y > drop - 30) continue;
      const fade = Math.max(0, Math.min(1, (reveal - noise(i * 7.7) * 0.7) * 3));
      const twinkle = 0.55 + 0.45 * Math.sin(this.time * 1.9 + i * 2.3);
      ctx.fillStyle = `rgba(255, 246, 220, ${(fade * twinkle * 0.8).toFixed(3)})`;
      ctx.fillRect(x, y, 2, 2);
    }
    // The first star: brighter than the rest, glinting, once the sky is nearly in.
    const first = Math.max(0, Math.min(1, (k - 0.7 * this.tilt.to) / (0.3 * this.tilt.to + 0.001)));
    if (first > 0.01) {
      const sx = Math.round(W * 0.62 / 2) * 2;
      const sy = Math.round(drop * 0.42 / 2) * 2;
      const pulse = 0.8 + 0.2 * Math.sin(this.time * 2.6);
      ctx.fillStyle = `rgba(255, 244, 200, ${(first * 0.18 * pulse).toFixed(3)})`;
      ctx.fillRect(sx - 12, sy - 12, 26, 26);
      ctx.fillStyle = `rgba(255, 250, 225, ${(first * 0.45 * pulse).toFixed(3)})`;
      ctx.fillRect(sx - 6, sy - 6, 14, 14);
      ctx.fillStyle = `rgba(255, 252, 238, ${first.toFixed(3)})`;
      ctx.fillRect(sx - 2, sy - 2, 6, 6);
      const ray = Math.round(10 * pulse);
      ctx.fillRect(sx, sy - 2 - ray, 2, ray);
      ctx.fillRect(sx, sy + 4, 2, ray);
      ctx.fillRect(sx - 2 - ray, sy, ray, 2);
      ctx.fillRect(sx + 4, sy, ray, 2);
    }
    // Far trees along the seam, dark against the warm band.
    ctx.fillStyle = '#26304a';
    for (let x = 0; x < W; x += 4 * scale) {
      const tall = Math.round((2 + noise(x * 0.37) * 5 + (noise(Math.floor(x / (28 * scale))) * 6)) * scale / 2) * 2;
      ctx.fillRect(x, drop - tall, 4 * scale, tall + 2);
    }
    // The room itself, slid down.
    ctx.drawImage(this.shot, 0, drop);
    ctx.restore();
  }

  // Dust hanging in the air: wide soft banks sliding slowly across the view,
  // thicker for a moment now and then, and a faint veil under them.
  drawHaze(ctx, camera) {
    const amount = this.hazeNow();
    if (amount <= 0.01) return;
    const sprite = glowSprite('196, 176, 150');
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = `rgba(190, 170, 144, ${(0.07 * amount).toFixed(3)})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < 8; i++) {
      const w = 150 + noise(i + 5) * 110;
      const h = 50 + noise(i + 15) * 40;
      const span = SCREEN_WIDTH + w;
      const x = ((noise(i + 25) * span + this.time * (6 + noise(i + 35) * 10) * (i % 2 ? 1 : -1)) % span + span) % span - w / 2;
      const y = 20 + noise(i + 45) * (SCREEN_HEIGHT - 40) + Math.sin(this.time * 0.4 + i) * 5;
      ctx.globalAlpha = Math.min(1, 0.2 * amount * (0.7 + 0.3 * Math.sin(this.time * 0.9 + i * 1.7)));
      ctx.drawImage(sprite, x - w / 2, y - h / 2, w, h);
    }
    ctx.restore();
  }

  // Light pouring down out of cracked pillars: a hard core and a soft edge,
  // pulsing a little, each out of step.
  drawShafts(ctx, camera) {
    if (!this.shafts.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const sh of this.shafts) {
      const x = (sh.at.x + 0.5) * T - camera.x;
      const y = (sh.at.y + 1) * T - camera.y;
      const top = y - (sh.height ?? 150);
      const pulse = 0.75 + 0.25 * Math.sin(this.time * 3 + sh.i * 1.9);
      const half = (sh.w * T) / 2;
      const g = ctx.createLinearGradient(0, top, 0, y);
      g.addColorStop(0, `rgba(${sh.color}, ${(0.05 * pulse).toFixed(3)})`);
      g.addColorStop(1, `rgba(${sh.color}, ${(0.3 * pulse).toFixed(3)})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - half * 0.35, top);
      ctx.lineTo(x + half * 0.35, top);
      ctx.lineTo(x + half, y);
      ctx.lineTo(x - half, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = `rgba(${sh.color}, ${(0.16 * pulse).toFixed(3)})`;
      ctx.fillRect(Math.round(x - half * 0.25), Math.round(top), Math.max(1, Math.round(half * 0.5)), Math.round(y - top));
      // Dust turning in the beam.
      for (let i = 0; i < 6; i++) {
        const k = (this.time * 0.15 + i / 6 + sh.i * 0.2) % 1;
        ctx.fillStyle = `rgba(${sh.color}, ${(0.5 * Math.sin(k * Math.PI) * pulse).toFixed(3)})`;
        ctx.fillRect(Math.round(x + Math.sin(i * 7.7 + this.time) * half * 0.6), Math.round(top + k * (y - top)), 1, 1);
      }
      // And a bloom where it lands.
      const bloom = ctx.createRadialGradient(x, y, 1, x, y, half * 1.8);
      bloom.addColorStop(0, `rgba(${sh.color}, ${(0.35 * pulse).toFixed(3)})`);
      bloom.addColorStop(1, `rgba(${sh.color}, 0)`);
      ctx.fillStyle = bloom;
      ctx.fillRect(x - half * 2, y - half * 2, half * 4, half * 4);
    }
    ctx.restore();
  }

  // Light from outside, in through a doorway: a fan of it up the floor,
  // brightest at the threshold, drawn over the dim. And, once somebody steps
  // into it outside, their shadow (drawShadow) laid along it.
  drawDoorway(ctx, camera) {
    const d = this.doorway;
    if (!d) return;
    const fade = d.seconds ? Math.min(1, d.t / d.seconds) : 1;
    const x = (d.at.x + 0.5) * T - camera.x;
    const y = d.at.y * T - camera.y;
    const half = (d.w * T) / 2;
    const top = y - d.length * T;
    const spread = half * 1.9;
    // Whoever's out there blocks some of it.
    const sh = this.shadow;
    const k = sh ? Math.min(1, sh.t / sh.seconds) : 0;
    const blocked = sh ? 0.35 * Math.min(1, sh.t / 0.8) : 0;
    const flicker = 0.94 + 0.06 * Math.sin(this.time * 2.3) * Math.sin(this.time * 5.1);
    const power = fade * flicker * (1 - blocked);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y, 0, top);
    g.addColorStop(0, `rgba(${d.color}, ${(0.34 * power).toFixed(3)})`);
    g.addColorStop(0.45, `rgba(${d.color}, ${(0.14 * power).toFixed(3)})`);
    g.addColorStop(1, `rgba(${d.color}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - half, y);
    ctx.lineTo(x + half, y);
    ctx.lineTo(x + spread, top);
    ctx.lineTo(x - spread, top);
    ctx.closePath();
    ctx.fill();
    // The bright sill of the doorway, and the way out beyond it, lit (the
    // light is out there somewhere).
    ctx.fillStyle = `rgba(${d.color}, ${(0.4 * power).toFixed(3)})`;
    ctx.fillRect(Math.round(x - half), Math.round(y - 2), Math.round(half * 2), 2);
    const out = ctx.createLinearGradient(0, y, 0, y + 4 * T);
    out.addColorStop(0, `rgba(${d.color}, ${(0.3 * power).toFixed(3)})`);
    out.addColorStop(1, `rgba(${d.color}, ${(0.55 * power).toFixed(3)})`);
    ctx.fillStyle = out;
    ctx.fillRect(Math.round(x - half), Math.round(y), Math.round(half * 2), 4 * T);
    ctx.restore();
    // (Whoever it is stands out in the passage, past the threshold.)
    if (sh) this.drawShadow(ctx, camera, x, y + 1.5 * T, k);
  }

  // The shadow of somebody standing in the light outside the doorway: a long,
  // thin figure laid up the floor from the threshold (its feet), growing as
  // they come closer to the door, its head creeping up to `at`. Plain dark,
  // no detail: it gives nothing away about whose it is.
  drawShadow(ctx, camera, footX, footY, k) {
    const sh = this.shadow;
    const ease = k * k * (3 - 2 * k);
    // Where the head ends up.
    const hx = (sh.at.x + 0.5) * T - camera.x;
    const hy = (sh.at.y + 0.5) * T - camera.y;
    const full = Math.hypot(hx - footX, hy - footY);
    // In at the door first (a sliver), then stretching up the floor; a step's
    // sway on the way, gone once they've stopped.
    const len = Math.max(4, full * (0.08 + 0.92 * ease));
    const walking = k < 1 ? 1 - ease : 0;
    const sway = Math.sin(sh.t * 3.4) * 0.05 * walking;
    const angle = Math.atan2(hy - footY, hx - footX) + sway;
    // Wider as they come near (the shadow of something close to the light
    // spreads), but always a tall thin shape.
    const wide = (len / 7.5) * (0.85 + 0.15 * ease);
    const a = sh.alpha * Math.min(1, sh.t / 0.6);
    // Half-widths along it, feet (0) to the top of the head (1).
    const PROFILE = [
      [0, 0.18], [0.04, 0.34], [0.42, 0.42], [0.47, 0.5], [0.72, 0.62], [0.78, 0.66], [0.8, 0.3], [0.83, 0.26],
      [0.86, 0.36], [0.93, 0.36], [0.98, 0.24], [1, 0],
    ];
    ctx.save();
    ctx.translate(footX, footY);
    ctx.rotate(angle);
    // (Drawn along +x: feet at 0, head at len.)
    const path = () => {
      ctx.beginPath();
      PROFILE.forEach(([u, w], i) => (i ? ctx.lineTo(u * len, -w * wide) : ctx.moveTo(u * len, -w * wide)));
      for (let i = PROFILE.length - 1; i >= 0; i--) ctx.lineTo(PROFILE[i][0] * len, PROFILE[i][1] * wide);
      ctx.closePath();
    };
    // A soft edge, then the dark of it.
    ctx.filter = 'blur(2px)';
    ctx.fillStyle = `rgba(2, 1, 6, ${(a * 0.6).toFixed(3)})`;
    path();
    ctx.fill();
    ctx.filter = 'none';
    ctx.fillStyle = `rgba(2, 1, 6, ${(a * 0.75).toFixed(3)})`;
    path();
    ctx.fill();
    // The gap between the legs lets a strip of light through.
    if (len > 20) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(${this.doorway.color}, ${(0.12 * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len * 0.4, -wide * 0.02);
      ctx.lineTo(len * 0.4, wide * 0.02);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawRubble(ctx, camera) {
    for (const p of this.rubble) {
      if (p.kind === 'dust') {
        const k = p.life / p.span;
        const a = Math.sin(Math.min(1, k) * Math.PI) * 0.22;
        ctx.fillStyle = `rgba(196, 176, 150, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(Math.round(p.x - camera.x), Math.round(p.y - camera.y), p.r, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      const x = Math.round(p.x - camera.x);
      const y = Math.round(p.y - camera.y);
      const fade = p.landed ? Math.max(0, 1 - p.landed / 1.5) : 1;
      ctx.globalAlpha = fade;
      ctx.fillStyle = '#120c1c';
      if (p.size > 2) ctx.fillRect(x - 1, y - 1, p.size + 2, p.size + 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(x, y, p.size, p.size);
      ctx.globalAlpha = 1;
    }
  }

  // Little music notes, rising and swaying, fading as they go.
  drawNotes(ctx, camera) {
    for (const n of this.notes) {
      const k = n.t / 3.2;
      const x = Math.round(n.x + Math.sin(n.sway + n.t * 3) * 6 - camera.x);
      const y = Math.round(n.y - n.t * 34 - camera.y);
      ctx.globalAlpha = Math.min(1, (1 - k) * 1.6);
      ctx.fillStyle = '#120c1c';
      ctx.fillRect(x - 1, y + 3, 4, 4);
      ctx.fillRect(x + 2, y - 3, 2, 8);
      ctx.fillStyle = n.kind === 1 ? '#ffd84a' : n.kind === 2 ? '#9ad8ff' : '#ffffff';
      ctx.fillRect(x, y + 4, 2, 2);
      ctx.fillRect(x + 2, y - 2, 1, 7);
      if (n.kind !== 2) ctx.fillRect(x + 3, y - 2, 2, 1);
      ctx.globalAlpha = 1;
    }
  }

  spotCentre(spot, bodyAt) {
    if (spot.onto) {
      const body = bodyAt(spot.onto);
      return { x: body.x, y: body.y - 4 };
    }
    const sweep = spot.sweep;
    let x = (spot.at.x + 0.5) * T;
    let y = (spot.at.y + 0.5) * T;
    if (sweep) {
      const a = (this.time / (sweep.period ?? 5)) * Math.PI * 2 + (sweep.phase ?? 0);
      x += Math.sin(a) * (sweep.rx ?? 3) * T;
      y += Math.sin(a * 1.7 + 1) * (sweep.ry ?? 1) * T;
    }
    return { x, y };
  }

  drawSpots(ctx, camera, bodyAt) {
    if (!this.spots.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const spot of this.spots) {
      const c = this.spotCentre(spot, bodyAt);
      const cx = c.x - camera.x;
      const cy = c.y - camera.y;
      const r = spot.radius;
      // Where the beam leaves the roof: straight above, or as told.
      const sx = (spot.from ? (spot.from.x + 0.5) * T : c.x + (spot.i % 2 ? -1 : 1) * 26) - camera.x;
      const sy = (spot.from ? (spot.from.y + 0.5) * T : c.y - 150) - camera.y;
      const beam = ctx.createLinearGradient(sx, sy, cx, cy);
      beam.addColorStop(0, `rgba(${spot.color}, 0.02)`);
      beam.addColorStop(1, `rgba(${spot.color}, 0.2)`);
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(sx - 2, sy);
      ctx.lineTo(sx + 2, sy);
      ctx.lineTo(cx + r * 0.9, cy);
      ctx.lineTo(cx - r * 0.9, cy);
      ctx.closePath();
      ctx.fill();
      // The pool on the floor, squashed flat.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.45);
      const pool = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
      pool.addColorStop(0, `rgba(${spot.color}, 0.55)`);
      pool.addColorStop(0.7, `rgba(${spot.color}, 0.32)`);
      pool.addColorStop(1, `rgba(${spot.color}, 0)`);
      ctx.fillStyle = pool;
      ctx.fillRect(-r, -r, r * 2, r * 2);
      ctx.restore();
    }
    ctx.restore();
  }

  drawCurtains(ctx, camera) {
    const c = this.curtain;
    if (!c) return;
    const x0 = Math.round(c.x * T - camera.x);
    const y0 = Math.round(c.y * T - camera.y);
    const w = c.w * T;
    const h = c.h * T;
    // Each side's drape is a half of the box, drawn back toward its edge as
    // the curtains open (never quite off: a bunched fold stays).
    const half = w / 2;
    const bunch = 7;
    const reach = Math.max(bunch, half * (1 - c.now));
    const drape = (left, right, bunched) => {
      const width = right - left;
      if (width <= 0) return;
      ctx.fillStyle = '#7a1428';
      ctx.fillRect(left, y0, width, h);
      // Folds: stripes of lighter and darker velvet, wider when bunched.
      const gap = bunched ? 3 : 5;
      for (let x = left; x < right; x += gap) {
        ctx.fillStyle = (Math.floor((x - left) / gap) % 2) ? '#9c2038' : '#5c0e1e';
        ctx.fillRect(x, y0, Math.max(1, gap - 2), h);
        if (!bunched) {
          ctx.fillStyle = 'rgba(255, 150, 150, 0.14)';
          ctx.fillRect(x, y0, 1, h);
        }
      }
      // Gold fringe along the hem.
      ctx.fillStyle = '#d8a030';
      ctx.fillRect(left, y0 + h - 3, width, 2);
      ctx.fillStyle = '#f6d060';
      for (let x = left; x < right; x += 3) ctx.fillRect(x, y0 + h - 1, 1, 2);
    };
    drape(x0, x0 + reach, c.now > 0.5);
    drape(x0 + w - reach, x0 + w, c.now > 0.5);
    // The gold tie-backs, and the valance swagged along the top.
    ctx.fillStyle = '#d8a030';
    if (c.now > 0.5) {
      ctx.fillRect(x0 + reach - 2, y0 + h * 0.55, 4, 3);
      ctx.fillRect(x0 + w - reach - 2, y0 + h * 0.55, 4, 3);
    }
    ctx.fillStyle = '#4a0a18';
    ctx.fillRect(x0, y0, w, 6);
    for (let x = x0; x < x0 + w; x += 12) {
      ctx.fillStyle = '#a02440';
      ctx.fillRect(x, y0 + 4, 12, 3);
      ctx.fillStyle = '#d8a030';
      ctx.fillRect(x, y0 + 7, 12, 1);
    }
  }

  drawConfetti(ctx, camera) {
    for (const p of this.confetti) {
      const x = Math.round(p.x + Math.sin(p.sway) * p.swing - camera.x);
      const y = Math.round(p.y - camera.y);
      // Turning over as it falls: wide, then tall.
      const flat = Math.sin(p.sway * p.spin * 0.5) > 0;
      ctx.fillStyle = p.color;
      ctx.fillRect(x, y, flat ? 3 : 2, flat ? 2 : 3);
    }
  }

  // The light stuttering: dips that come in jerks, a long dark gap near the
  // end, and a half recovery.
  drawFlicker(ctx) {
    let alpha = this.dimNow();
    if (this.flickerAt !== null) {
      const t = this.time - this.flickerAt;
      if (t < this.flickerLength) {
        const k = t / this.flickerLength;
        const jerk = noise(Math.floor(t * 9)) > 0.45 ? 1 : 0.25;
        const gap = k > 0.6 && k < 0.78 ? 1 : 0;
        alpha = Math.max(alpha, Math.min(0.78, (0.18 + 0.5 * k) * jerk + gap * 0.3));
      } else {
        this.flickerAt = null;
      }
    }
    if (alpha <= 0.005) return;
    ctx.fillStyle = `rgba(8, 4, 24, ${alpha.toFixed(3)})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  drawFlare(ctx, camera) {
    const f = this.flare;
    if (!f) return;
    const x = (f.at.x + 0.5) * T - camera.x;
    const y = (f.at.y + 0.5) * T - camera.y;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // The flash: the whole view whites out and settles.
    const flash = Math.max(0, 1 - f.t / 1.2) ** 1.5 * Math.min(1, f.t / 0.12);
    if (flash > 0.01) {
      ctx.fillStyle = `rgba(255, 244, 205, ${(flash * 0.8).toFixed(3)})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    // Rings of light rolling out across the town.
    for (let i = 0; i < 3; i++) {
      const k = (f.t - i * 0.35) / f.seconds;
      if (k <= 0 || k >= 1) continue;
      const radius = 20 + k * 420;
      const ring = ctx.createRadialGradient(x, y, radius * 0.82, x, y, radius);
      ring.addColorStop(0, 'rgba(255, 230, 160, 0)');
      ring.addColorStop(0.85, `rgba(255, 230, 160, ${((1 - k) * 0.5).toFixed(3)})`);
      ring.addColorStop(1, 'rgba(255, 230, 160, 0)');
      ctx.fillStyle = ring;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    // And the stone itself, a hot bloom that eases down.
    const bloom = Math.max(0, 1 - f.t / (f.seconds + 1)) * 0.9;
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 120);
    glow.addColorStop(0, `rgba(255, 240, 190, ${bloom.toFixed(3)})`);
    glow.addColorStop(1, 'rgba(255, 220, 140, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 120, y - 120, 240, 240);
    ctx.restore();
  }
}
