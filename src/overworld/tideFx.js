import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { sfx } from '../audio/music.js';

// The sea's effects for the end of chapter 5 (tideHeldFinale.js), switched on by a
// scene's `stage` step with `fx` (stageShow.js passes it here). Spots are tiles.
//
//   { fx: { splash: { at, power } } }       something going into the water: a white
//                                           burst, a crown of drops thrown up and
//                                           falling back, rings and foam.
//   { fx: { rings: { id, at, every, size } } }  rings spreading on the water from a spot,
//                                           one every `every` seconds (every 0: stop).
//   { fx: { bubbles: { id, at, rate, spread } } }  bubbles coming up and popping there,
//                                           `rate` a second (0: stop).
//   { fx: { surge: { glass, level, seconds } } }  the sea outside the lamp room standing up
//                                           behind the glass: `glass` is the band of panes
//                                           ({ x, y, w, h } in tiles), `level` 0-1 how far up.
//   { fx: { cracks: { glass, amount, seconds } } }  cracks running across the panes.
//   { fx: { burst: { glass } } }            the glass going: shards in, and white water
//                                           pouring down over the whole room.
//   { fx: { aura: { who, power, seconds, lift } } }  the storm in someone (lift: how high its middle is): a green light round
//                                           them, the wind whipping round, spray going up.
//   { fx: { light: { who, power } } }       the light in the hero (the `press` step sets
//                                           this as it is held): a spark in the chest that
//                                           beats, a glow growing round it, motes of light
//                                           drawn in, a soft pillar going up and rings going
//                                           out across the ground, and at last the whole view.
//   { fx: { pour: { at, w, power, seconds } } }  water pouring out of a doorway (tiles; w px).
//   { fx: { heartbeat: { bpm } } }          a heartbeat under everything (null: it stops).
//   { fx: { vignette: { on, amount, seconds } } }  the dark closing in round someone.
//   { fx: { clear: true } }                 everything off.

function noise(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
const ease = (k) => k * k * (3 - 2 * k);
const tween = (from, to, seconds) => ({ from, to, t: 0, seconds: seconds ?? 0 });
const now = (tw) => (!tw ? 0 : !tw.seconds || tw.t >= tw.seconds ? tw.to : tw.from + (tw.to - tw.from) * ease(tw.t / tw.seconds));
const px = (at) => ({ x: (at.x + 0.5) * T, y: (at.y + 0.5) * T });

export class TideFx {
  constructor() {
    this.time = 0;
    this.drops = [];
    this.puffs = [];
    this.ringList = [];
    this.bubbleList = [];
    this.ringMakers = new Map();
    this.bubbleMakers = new Map();
    this.shards = [];
    this.surge = null;
    this.cracks = null;
    this.burstAt = null;
    this.aura = null;
    this.light = null;
    this.pours = new Map();
    this.beat = null;
    this.vig = null;
  }

  apply(fx) {
    if (fx.clear) Object.assign(this, new TideFx(), { time: this.time });
    if (fx.splash) this.splash(fx.splash);
    if (fx.rings) {
      const r = fx.rings;
      const id = r.id ?? `${r.at?.x},${r.at?.y}`;
      if (!r.every) this.ringMakers.delete(id);
      else this.ringMakers.set(id, { at: px(r.at), every: r.every, size: r.size ?? 14, next: 0 });
    }
    if (fx.bubbles) {
      const b = fx.bubbles;
      const id = b.id ?? `${b.at?.x},${b.at?.y}`;
      if (!b.rate) this.bubbleMakers.delete(id);
      else this.bubbleMakers.set(id, { at: px(b.at), rate: b.rate, spread: b.spread ?? 6, left: 0 });
    }
    if (fx.surge) {
      const s = fx.surge;
      this.surge = {
        glass: s.glass ?? this.surge?.glass,
        level: tween(now(this.surge?.level), s.level ?? now(this.surge?.level) ?? 1, s.seconds),
        // `over`: how far (px) the top of it has come on over the room, pitching down at them.
        over: tween(now(this.surge?.over), s.over ?? (s.level === 0 ? 0 : now(this.surge?.over)), s.seconds),
      };
    }
    if (fx.cracks) {
      const c = fx.cracks;
      this.cracks = { glass: c.glass ?? this.cracks?.glass ?? this.surge?.glass, amount: tween(now(this.cracks?.amount), c.amount ?? 1, c.seconds) };
    }
    if (fx.burst) this.burst(fx.burst.glass ?? this.surge?.glass);
    if (fx.aura !== undefined) {
      if (!fx.aura) this.aura = null;
      else this.aura = { who: fx.aura.who, lift: fx.aura.lift ?? 20, power: tween(now(this.aura?.power), fx.aura.power ?? 1, fx.aura.seconds) };
    }
    if (fx.light !== undefined) this.light = fx.light ? { who: fx.light.who ?? 'player', power: fx.light.power ?? 0 } : null;
    if (fx.pour) {
      const p = fx.pour;
      const id = `${p.at.x},${p.at.y}`;
      const old = this.pours.get(id);
      this.pours.set(id, { at: px(p.at), w: p.w ?? old?.w ?? 16, drop: p.drop ?? old?.drop ?? 20, spread: p.spread ?? old?.spread, power: tween(now(this.pours.get(id)?.power), p.power ?? 1, p.seconds) });
    }
    if (fx.lamp !== undefined) this.lamp = fx.lamp ? { at: px(fx.lamp.at), power: fx.lamp.power ?? 1 } : null;
    if (fx.heartbeat !== undefined) this.beat = fx.heartbeat ? { bpm: fx.heartbeat.bpm ?? 64, next: 0, last: -9 } : null;
    if (fx.vignette !== undefined) {
      const v = fx.vignette;
      if (!v) this.vig = null;
      else this.vig = { on: v.on ?? null, at: v.at ? px(v.at) : null, amount: tween(now(this.vig?.amount), v.amount ?? 0.8, v.seconds) };
    }
  }

  splash({ at, power = 1 }) {
    const { x, y } = px(at);
    const seed = this.time * 97 + x;
    const n = Math.round(80 * power);
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (noise(seed + i) - 0.5) * 2.4;
      const v = (60 + noise(seed + i + 9) * 110) * Math.min(1.5, power);
      this.drops.push({ x: x + (noise(seed + i + 3) - 0.5) * 8, y, vx: Math.cos(a) * v * 0.7, vy: Math.sin(a) * v, floor: y + (noise(seed + i + 5) - 0.3) * 8, life: 0, white: noise(seed + i + 7) > 0.35 });
    }
    for (let i = 0; i < Math.round(9 * power); i++) {
      this.puffs.push({ x: x + (noise(seed + i + 40) - 0.5) * 16, y: y - noise(seed + i + 41) * 8, r: 2 + noise(seed + i + 42) * 3.5 * power, vy: -6 - noise(seed + i + 43) * 10, life: 0, span: 0.7 + noise(seed + i + 44) * 0.8 });
    }
    for (let i = 0; i < 3; i++) this.ringList.push({ x, y: y + 2, life: -i * 0.18, span: 1.6, size: 18 * power + i * 6 });
    this.flashAt = { x, y, t: this.time, power };
  }

  burst(glass) {
    if (!glass) return;
    this.burstAt = { t: this.time, glass };
    const x0 = glass.x * T;
    const x1 = (glass.x + glass.w) * T;
    const y = (glass.y + glass.h) * T;
    for (let i = 0; i < 120; i++) {
      const x = x0 + noise(i + 500) * (x1 - x0);
      this.shards.push({ x, y: y - noise(i + 510) * glass.h * T, vx: (noise(i + 520) - 0.5) * 120, vy: 40 + noise(i + 530) * 160, spin: noise(i + 540) * 6, life: 0, size: 1 + Math.floor(noise(i + 550) * 3) });
    }
  }

  update(dt, bodyAt) {
    this.time += dt;
    const step = (tw) => { if (tw) tw.t += dt; };
    step(this.surge?.level);
    step(this.surge?.over);
    step(this.cracks?.amount);
    step(this.aura?.power);
    step(this.vig?.amount);
    for (const p of this.pours.values()) step(p.power);
    for (const d of this.drops) {
      d.life += dt;
      d.vy += 300 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
    }
    this.drops = this.drops.filter((d) => !(d.vy > 0 && d.y >= d.floor) && d.life < 3);
    for (const p of this.puffs) { p.life += dt; p.y += p.vy * dt; p.r += dt * 8; }
    this.puffs = this.puffs.filter((p) => p.life < p.span);
    for (const r of this.ringList) r.life += dt;
    this.ringList = this.ringList.filter((r) => r.life < r.span);
    for (const m of this.ringMakers.values()) {
      m.next -= dt;
      if (m.next <= 0) {
        m.next = m.every;
        this.ringList.push({ x: m.at.x + (noise(this.time * 13) - 0.5) * 4, y: m.at.y + 3, life: 0, span: 1.8, size: m.size });
      }
    }
    for (const m of this.bubbleMakers.values()) {
      m.left += dt * m.rate;
      while (m.left >= 1) {
        m.left -= 1;
        const k = this.time * 31 + this.bubbleList.length;
        this.bubbleList.push({ x: m.at.x + (noise(k) - 0.5) * m.spread * 2, y: m.at.y + 2 + (noise(k + 1) - 0.5) * m.spread * 0.6, life: 0, span: 0.5 + noise(k + 2) * 0.5, r: noise(k + 3) > 0.7 ? 2 : 1 });
      }
    }
    for (const b of this.bubbleList) b.life += dt;
    this.bubbleList = this.bubbleList.filter((b) => b.life < b.span + 0.25);
    for (const s of this.shards) { s.life += dt; s.vy += 120 * dt; s.x += s.vx * dt; s.y += s.vy * dt; }
    this.shards = this.shards.filter((s) => s.life < 2.2);
    if (this.beat) {
      this.beat.next -= dt;
      if (this.beat.next <= 0) {
        this.beat.next = 60 / this.beat.bpm;
        this.beat.last = this.time;
        if (!this.quiet) sfx('heartbeat');
      }
    }
    this.bodyAt = bodyAt;
  }

  // How hard the heart is beating right now (0-1), for the vignette and the light.
  pulse() {
    if (!this.beat) return 0;
    const since = this.time - this.beat.last;
    return Math.max(0, 1 - since / 0.35) + Math.max(0, 0.6 - Math.abs(since - 0.17) / 0.2) * 0.5;
  }

  draw(ctx, camera, bodyAt) {
    this.drawLamp(ctx, camera);
    this.drawSurge(ctx, camera);
    this.drawCracks(ctx, camera);
    this.drawPours(ctx, camera);
    this.drawRings(ctx, camera);
    this.drawBubbles(ctx, camera);
    this.drawAura(ctx, camera, bodyAt);
    this.drawSplash(ctx, camera);
    this.drawBurst(ctx, camera);
    this.drawVignette(ctx, camera, bodyAt);
    this.drawLight(ctx, camera, bodyAt);
  }

  // The great lamp lit and turning: a warm heart in the drum, and its beam going slowly round
  // the room, soft-edged, brighter near the lamp.
  drawLamp(ctx, camera) {
    if (!this.lamp) return;
    const { at, power } = this.lamp;
    const x = at.x - camera.x;
    const y = at.y - camera.y;
    const a = this.time * 0.9;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const heart = ctx.createRadialGradient(x, y, 1, x, y, 26);
    heart.addColorStop(0, `rgba(255, 236, 170, ${(0.55 * power).toFixed(3)})`);
    heart.addColorStop(1, 'rgba(255, 220, 140, 0)');
    ctx.fillStyle = heart;
    ctx.fillRect(x - 26, y - 26, 52, 52);
    for (const turn of [0, Math.PI]) {
      const len = 300;
      const half = 0.16;
      const g = ctx.createRadialGradient(x, y, 6, x, y, len);
      g.addColorStop(0, `rgba(255, 238, 180, ${(0.22 * power).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255, 238, 180, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, len, a + turn - half, a + turn + half);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawRings(ctx, camera) {
    for (const r of this.ringList) {
      if (r.life < 0) continue;
      const k = r.life / r.span;
      const rx = 2 + k * r.size;
      ctx.strokeStyle = `rgba(214, 244, 236, ${(0.55 * (1 - k)).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(Math.round(r.x - camera.x) + 0.5, Math.round(r.y - camera.y) + 0.5, rx, rx * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawBubbles(ctx, camera) {
    for (const b of this.bubbleList) {
      const x = Math.round(b.x - camera.x);
      const y = Math.round(b.y - camera.y);
      if (b.life < b.span) {
        // Coming up: a pale dome with a glint.
        ctx.fillStyle = 'rgba(200, 240, 236, 0.75)';
        ctx.fillRect(x - b.r + 1, y - b.r, b.r * 2 - 1 || 1, b.r * 2 || 1);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y - b.r, 1, 1);
      } else {
        // Popped: four specks flying off.
        const k = (b.life - b.span) / 0.25;
        ctx.fillStyle = `rgba(230, 252, 246, ${(1 - k).toFixed(3)})`;
        const d = 1 + Math.round(k * 3);
        ctx.fillRect(x - d, y, 1, 1);
        ctx.fillRect(x + d, y, 1, 1);
        ctx.fillRect(x, y - d, 1, 1);
        ctx.fillRect(x, y + Math.max(1, d - 1), 1, 1);
      }
    }
  }

  drawSplash(ctx, camera) {
    if (this.flashAt) {
      const f = this.flashAt;
      const k = (this.time - f.t) / 0.5;
      if (k >= 1) this.flashAt = null;
      else {
        const r = 6 + k * 16 * f.power;
        const g = ctx.createRadialGradient(f.x - camera.x, f.y - camera.y, 1, f.x - camera.x, f.y - camera.y, r);
        g.addColorStop(0, `rgba(255, 255, 255, ${(0.6 * (1 - k)).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(f.x - camera.x - r, f.y - camera.y - r, r * 2, r * 2);
      }
    }
    for (const p of this.puffs) {
      const k = p.life / p.span;
      ctx.fillStyle = `rgba(236, 252, 246, ${(0.45 * (1 - k)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x - camera.x, p.y - camera.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const d of this.drops) {
      ctx.fillStyle = d.white ? '#ffffff' : '#a8e4dc';
      ctx.fillRect(Math.round(d.x - camera.x), Math.round(d.y - camera.y), d.white ? 2 : 1, d.vy < 0 ? 2 : 1);
    }
  }

  glassRect(glass, camera) {
    return { x: glass.x * T - camera.x, y: glass.y * T - camera.y, w: glass.w * T, h: glass.h * T };
  }

  // The sea standing up outside: dark green water climbing the panes, a ragged lit
  // crest with foam blowing off it, light sliding in it.
  drawSurge(ctx, camera) {
    if (!this.surge?.glass) return;
    const level = now(this.surge.level);
    if (level <= 0.005) return;
    const g = this.glassRect(this.surge.glass, camera);
    const t = this.time;
    const over = now(this.surge.over);
    const top = g.y + g.h * (1 - level);
    const crest = (x) => top + Math.sin(x * 0.07 + t * 2.4) * 2 + Math.sin(x * 0.19 - t * 4) * 1.2;
    // Pitching over: the face of it hanging out over the room, its lip ragged with foam, and its
    // shadow on the floor under it.
    if (over > 0.5) {
      const lipY = (x) => g.y + g.h + over + Math.sin(x * 0.045 + t * 3) * 5 + Math.sin(x * 0.12 - t * 5) * 2.5;
      const shade = ctx.createLinearGradient(0, g.y + g.h + over, 0, g.y + g.h + over + 70);
      shade.addColorStop(0, 'rgba(0, 10, 8, 0.55)');
      shade.addColorStop(1, 'rgba(0, 10, 8, 0)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, g.y + g.h + over, W, 70);
      const face = ctx.createLinearGradient(0, g.y, 0, g.y + g.h + over);
      face.addColorStop(0, 'rgba(10, 40, 36, 0.97)');
      face.addColorStop(0.55, 'rgba(34, 112, 94, 0.95)');
      face.addColorStop(0.9, 'rgba(110, 196, 170, 0.95)');
      face.addColorStop(1, 'rgba(200, 244, 228, 0.97)');
      ctx.fillStyle = face;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      for (let x = W; x >= 0; x -= 4) ctx.lineTo(x, lipY(x));
      ctx.closePath();
      ctx.fill();
      // Light sliding across the face of it, and foam streaming down it in long threads.
      for (let i = 0; i < 70; i++) {
        const y = g.y + noise(i + 400) * (g.h + over);
        const x = (noise(i + 410) * W + t * (30 + noise(i + 420) * 40)) % W;
        ctx.fillStyle = `rgba(160, 240, 210, ${(0.2 + 0.3 * noise(i + 440)).toFixed(3)})`;
        ctx.fillRect(Math.round(x), Math.round(y), 5 + Math.round(noise(i + 430) * 12), 1);
      }
      for (let i = 0; i < 26; i++) {
        const x = noise(i + 460) * W;
        const len = 8 + noise(i + 470) * 24;
        const y = g.y + g.h + over - len - noise(i + 480) * 20 + ((t * 40 + noise(i + 490) * 30) % 12);
        ctx.fillStyle = 'rgba(226, 252, 242, 0.55)';
        ctx.fillRect(Math.round(x), Math.round(y), 1, Math.round(len));
      }
      for (let x = 0; x < W; x += 2) {
        const n = noise(Math.floor(x / 2) + Math.floor(t * 9) * 0.27);
        ctx.fillStyle = n > 0.3 ? 'rgba(240, 255, 248, 0.95)' : 'rgba(180, 236, 216, 0.85)';
        ctx.fillRect(x, Math.round(lipY(x)) - 2, 2, 3 + (n > 0.7 ? 2 : 0));
        if (n > 0.8) ctx.fillRect(x, Math.round(lipY(x)) + 3 + Math.round(n * 6), 1, 2);
      }
      return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(g.x, g.y, g.w, g.h);
    ctx.clip();
    const body = ctx.createLinearGradient(0, top, 0, g.y + g.h);
    body.addColorStop(0, 'rgba(40, 110, 92, 0.9)');
    body.addColorStop(0.4, 'rgba(14, 58, 52, 0.92)');
    body.addColorStop(1, 'rgba(4, 22, 22, 0.95)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(g.x, g.y + g.h);
    for (let x = 0; x <= g.w; x += 3) ctx.lineTo(g.x + x, crest(x));
    ctx.lineTo(g.x + g.w, g.y + g.h);
    ctx.closePath();
    ctx.fill();
    // Light sliding through it, and the storm's green coming through from behind.
    for (let i = 0; i < 18; i++) {
      const y = top + 3 + noise(i + 60) * (g.y + g.h - top);
      const x = ((noise(i + 70) * g.w + t * (20 + noise(i + 80) * 30)) % g.w);
      ctx.fillStyle = `rgba(150, 236, 196, ${(0.25 + noise(i + 90) * 0.25).toFixed(3)})`;
      ctx.fillRect(Math.round(g.x + x), Math.round(y), 4 + Math.round(noise(i + 95) * 8), 1);
    }
    // The crest: foam, and spray torn off it.
    for (let x = 0; x < g.w; x += 2) {
      const y = Math.round(crest(x));
      const n = noise(Math.floor(x / 2) + Math.floor(t * 8) * 0.31);
      ctx.fillStyle = n > 0.3 ? 'rgba(236, 255, 244, 0.95)' : 'rgba(170, 230, 210, 0.8)';
      ctx.fillRect(g.x + x, y - 1, 2, n > 0.65 ? 3 : 2);
      if (n > 0.85) {
        ctx.fillStyle = 'rgba(236, 255, 244, 0.7)';
        ctx.fillRect(g.x + x + 1, y - 3 - Math.round(n * 4), 1, 1);
      }
    }
    ctx.restore();
  }

  // Cracks running out across the panes from a few points, longer as `amount` grows.
  drawCracks(ctx, camera) {
    if (!this.cracks?.glass) return;
    const amount = now(this.cracks.amount);
    if (amount <= 0.01) return;
    const g = this.glassRect(this.cracks.glass, camera);
    ctx.save();
    ctx.beginPath();
    ctx.rect(g.x, g.y, g.w, g.h + 4);
    ctx.clip();
    ctx.strokeStyle = 'rgba(232, 255, 246, 0.85)';
    ctx.lineWidth = 1;
    const centres = 7;
    for (let c = 0; c < centres; c++) {
      if (noise(c + 200) > amount * 1.4) continue;
      const cx = g.x + (c + 0.3 + noise(c + 210) * 0.4) * (g.w / centres);
      const cy = g.y + g.h * (0.3 + noise(c + 220) * 0.5);
      for (let b = 0; b < 6; b++) {
        let a = (b / 6) * Math.PI * 2 + noise(c * 7 + b) * 0.8;
        let x = cx;
        let y = cy;
        const len = (10 + noise(c * 13 + b) * 22) * Math.min(1, amount * 1.2);
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, Math.round(y) + 0.5);
        for (let s = 0; s < len; s += 4) {
          a += (noise(c * 31 + b * 5 + s) - 0.5) * 0.9;
          x += Math.cos(a) * 4;
          y += Math.sin(a) * 4;
          ctx.lineTo(Math.round(x) + 0.5, Math.round(y) + 0.5);
        }
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(Math.round(cx) - 1, Math.round(cy) - 1, 2, 2);
    }
    ctx.restore();
  }

  // The glass goes: shards flying in, then a wall of white water pouring down over
  // the whole room from the windows, churning, spray along its front.
  drawBurst(ctx, camera) {
    for (const s of this.shards) {
      const k = s.life / 2.2;
      ctx.fillStyle = `rgba(${s.size > 2 ? '200, 236, 230' : '255, 255, 255'}, ${(0.95 * (1 - k)).toFixed(3)})`;
      const flip = Math.sin(s.life * s.spin * 4) > 0;
      ctx.fillRect(Math.round(s.x - camera.x), Math.round(s.y - camera.y), flip ? s.size : 1, flip ? 1 : s.size);
    }
    if (!this.burstAt) return;
    const since = this.time - this.burstAt.t;
    if (since > 4) { this.burstAt = null; return; }
    const g = this.glassRect(this.burstAt.glass, camera);
    const front = g.y + g.h + Math.min(1, since / 0.9) ** 0.8 * (H + 40 - g.y - g.h);
    const fade = since < 2.4 ? 1 : 1 - (since - 2.4) / 1.6;
    const t = this.time;
    const edge = (x) => front + Math.sin(x * 0.05 + t * 5) * 6 + Math.sin(x * 0.13 - t * 7) * 3;
    const body = ctx.createLinearGradient(0, 0, 0, front);
    body.addColorStop(0, `rgba(30, 96, 84, ${(0.92 * fade).toFixed(3)})`);
    body.addColorStop(0.6, `rgba(120, 196, 176, ${(0.9 * fade).toFixed(3)})`);
    body.addColorStop(1, `rgba(236, 255, 248, ${(0.95 * fade).toFixed(3)})`);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    for (let x = W; x >= 0; x -= 4) ctx.lineTo(x, edge(x));
    ctx.closePath();
    ctx.fill();
    // Churning: white streaks rushing down through it.
    for (let i = 0; i < 60; i++) {
      const x = noise(i + 300) * W;
      const y = ((noise(i + 310) * H + t * (160 + noise(i + 320) * 120)) % (front + 20)) - 10;
      if (y > edge(x)) continue;
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.55 * fade).toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), 1 + (i % 3 === 0 ? 1 : 0), 6 + Math.round(noise(i + 330) * 10));
    }
    // Spray thrown up off the front.
    for (let x = 0; x < W; x += 3) {
      const n = noise(Math.floor(x / 3) + Math.floor(t * 10) * 0.29);
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * fade).toFixed(3)})`;
      ctx.fillRect(x, Math.round(edge(x)) - 2, 3, 3);
      if (n > 0.6) ctx.fillRect(x + 1, Math.round(edge(x)) + 3 + Math.round(n * 8), 1, 1);
    }
  }

  // The storm in him: a green glow, the wind tearing round him in arcs, spray going up.
  drawAura(ctx, camera, bodyAt) {
    if (!this.aura) return;
    const p = now(this.aura.power);
    if (p <= 0.01) return;
    const body = bodyAt(this.aura.who);
    if (!body) return;
    const t = this.time;
    const x = body.x - camera.x;
    // (It goes up with him if he's off the ground.)
    const y = body.y - (body.lift ?? 0) - this.aura.lift - camera.y;
    const flick = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7.3);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const r = (18 + 18 * p) * flick;
    const g = ctx.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, `rgba(120, 255, 170, ${(0.18 * p).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(60, 200, 130, ${(0.1 * p).toFixed(3)})`);
    g.addColorStop(1, 'rgba(40, 160, 110, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    // The light on the floor under him.
    const fy = body.y + 16 - camera.y;
    const fg = ctx.createRadialGradient(x, fy, 1, x, fy, 18 * p + 6);
    fg.addColorStop(0, `rgba(110, 240, 160, ${(0.16 * p).toFixed(3)})`);
    fg.addColorStop(1, 'rgba(110, 240, 160, 0)');
    ctx.fillStyle = fg;
    ctx.fillRect(x - 50, fy - 20, 100, 40);
    ctx.restore();
    // The wind: arcs whipping round him, spray spiralling up.
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const a0 = t * (3 + noise(i) * 2) + i * 0.63;
      const rad = 12 + noise(i + 10) * 18 * (0.6 + p);
      ctx.strokeStyle = `rgba(200, 255, 220, ${(0.5 * p * (0.5 + noise(i + 20) * 0.5)).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(x, y + 4, rad, rad * 0.55, 0, a0, a0 + 0.9 + noise(i + 30) * 0.8);
      ctx.stroke();
    }
    for (let i = 0; i < 24; i++) {
      const rise = (t * (0.5 + noise(i + 40) * 0.6) + noise(i + 50)) % 1;
      const a = t * 2 + i;
      ctx.fillStyle = `rgba(220, 255, 236, ${((1 - rise) * p).toFixed(3)})`;
      ctx.fillRect(Math.round(x + Math.cos(a) * (8 + rise * 16)), Math.round(y + 20 - rise * 50), 1, 2);
    }
  }

  // Water pouring out of a doorway: a sheet of it coming out and spreading as it runs down
  // (`spread`: how much wider at the foot), streaks running in it, foam boiling at its edges.
  drawPours(ctx, camera) {
    const t = this.time;
    for (const p of this.pours.values()) {
      const power = now(p.power);
      if (power <= 0.01) continue;
      const cx = p.at.x - camera.x;
      const y0 = p.at.y - camera.y;
      const drop = p.drop * Math.min(1, power + 0.2);
      const spread = p.spread ?? 1.6;
      const half = (y) => (p.w / 2) * (1 + (spread - 1) * (y / Math.max(1, drop))) + Math.sin(y * 0.5 + t * 6) * 1.2;
      for (let y = 0; y < drop; y++) {
        const hw = half(y);
        const fadeOut = 1 - Math.max(0, (y - drop * 0.6) / (drop * 0.4)) * 0.7;
        for (let x = -hw; x < hw; x++) {
          const n = noise(Math.round(x) * 3.1 + 900);
          const streak = (y - t * (70 + n * 50) + n * 30) % 9;
          const lit = streak < 0 ? streak > -3 : streak < 3;
          const edge = Math.abs(x) > hw - 2;
          ctx.fillStyle = edge || lit
            ? `rgba(236, 255, 246, ${(0.8 * power * fadeOut).toFixed(3)})`
            : `rgba(70, 150, 136, ${(0.6 * power * fadeOut).toFixed(3)})`;
          ctx.fillRect(Math.round(cx + x), Math.round(y0 + y), 1, 1);
        }
      }
      // Foam boiling along its foot and its sides.
      for (let i = 0; i < 18; i++) {
        const k = (t * 1.4 + noise(i + 720)) % 1;
        const side = noise(i + 730) * 2 - 1;
        const by = y0 + drop * (0.4 + 0.6 * noise(i + 750)) - k * 3;
        const bx = cx + side * half(by - y0);
        ctx.fillStyle = `rgba(240, 255, 250, ${((1 - k) * 0.8 * power).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(bx, by, 1.5 + k * 3 * power, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawVignette(ctx, camera, bodyAt) {
    if (!this.vig) return;
    const amount = now(this.vig.amount);
    if (amount <= 0.01) return;
    const body = this.vig.on ? bodyAt(this.vig.on) : null;
    const cx = body ? body.x - camera.x : this.vig.at ? this.vig.at.x - camera.x : W / 2;
    const cy = body ? body.y - 10 - camera.y : this.vig.at ? this.vig.at.y - camera.y : H / 2;
    const beat = this.pulse();
    const inner = 46 - beat * 6;
    const g = ctx.createRadialGradient(cx, cy, inner * (1 - amount * 0.4), cx, cy, inner + 180 * (1 - amount * 0.55));
    g.addColorStop(0, 'rgba(0, 0, 0, 0)');
    g.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.96, amount * (0.92 + beat * 0.08)).toFixed(3)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // The light in him. Low: a single spark at his chest, beating like a heart, a warm
  // glow round it. Then motes of light drawn in toward it out of the dark, the glow
  // spreading over the ground; then long soft rays turning slowly; at the last the
  // whole view going white from him outward.
  drawLight(ctx, camera, bodyAt) {
    const L = this.light;
    if (!L || L.power <= 0.002) return;
    const body = bodyAt(L.who);
    if (!body) return;
    const p = Math.min(1, L.power);
    const t = this.time;
    const x = body.x - camera.x;
    const y = body.y - 9 - camera.y;
    const beat = 0.5 + 0.5 * Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * (0.9 + p * 0.5))), 6);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // The ground lit round him.
    const gr = 10 + p * 90;
    const ground = ctx.createRadialGradient(x, y + 9, 1, x, y + 9, gr);
    ground.addColorStop(0, `rgba(255, 244, 214, ${(0.35 * p).toFixed(3)})`);
    ground.addColorStop(1, 'rgba(255, 244, 214, 0)');
    ctx.fillStyle = ground;
    ctx.save();
    ctx.translate(x, y + 9);
    ctx.scale(1, 0.45);
    ctx.translate(-x, -(y + 9));
    ctx.fillRect(x - gr, y + 9 - gr, gr * 2, gr * 2);
    ctx.restore();
    // The glow.
    const r = 6 + p * 60 + beat * (3 + p * 8);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, `rgba(255, 255, 250, ${(0.55 + 0.35 * p).toFixed(3)})`);
    glow.addColorStop(0.25, `rgba(255, 246, 220, ${(0.28 + 0.3 * p).toFixed(3)})`);
    glow.addColorStop(1, 'rgba(255, 236, 200, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    // Motes of light, drawn in out of the dark toward him.
    if (p > 0.15) {
      const k = Math.min(1, (p - 0.15) / 0.4);
      for (let i = 0; i < 46; i++) {
        const life = (t * (0.18 + noise(i + 900) * 0.2) + noise(i + 910)) % 1;
        const a = noise(i + 920) * Math.PI * 2 + t * 0.1;
        const far = (40 + noise(i + 930) * 150) * (1 - life);
        ctx.fillStyle = `rgba(255, 250, 230, ${(k * Math.min(1, life * 3) * 0.9).toFixed(3)})`;
        ctx.fillRect(Math.round(x + Math.cos(a) * far), Math.round(y + Math.sin(a) * far * 0.7), 1, 1);
      }
    }
    // A soft pillar of light going up out of him, and rings of it going out across the
    // ground with each beat (no hard rays: it swells, it doesn't burst).
    if (p > 0.35) {
      const k = (p - 0.35) / 0.65;
      const pw = 6 + k * 26;
      const pillar = ctx.createLinearGradient(x, y, x, y - 260);
      pillar.addColorStop(0, `rgba(255, 250, 232, ${(0.4 * k).toFixed(3)})`);
      pillar.addColorStop(1, 'rgba(255, 250, 232, 0)');
      ctx.fillStyle = pillar;
      ctx.beginPath();
      ctx.moveTo(x - pw * 0.4, y);
      ctx.lineTo(x + pw * 0.4, y);
      ctx.lineTo(x + pw, y - 260);
      ctx.lineTo(x - pw, y - 260);
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 3; i++) {
        const age = (t * (0.5 + p * 0.4) + i / 3) % 1;
        const rr = 10 + age * (60 + k * 160);
        ctx.strokeStyle = `rgba(255, 248, 226, ${(0.35 * k * (1 - age)).toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y + 9, rr, rr * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // The spark itself.
    ctx.fillStyle = '#ffffff';
    const s = p < 0.1 ? 1 : 2;
    ctx.fillRect(Math.round(x - s / 2), Math.round(y - s / 2), s, s);
    ctx.restore();
    // At the last, everything going white from him outward.
    const wash = Math.max(0, (p - 0.72) / 0.28);
    if (wash > 0) {
      const wr = 20 + wash * 400;
      const w = ctx.createRadialGradient(x, y, 0, x, y, wr);
      w.addColorStop(0, `rgba(255, 252, 242, ${(wash * 0.98).toFixed(3)})`);
      w.addColorStop(0.6, `rgba(255, 250, 236, ${(wash * wash * 0.9).toFixed(3)})`);
      w.addColorStop(1, `rgba(255, 248, 230, ${(wash * wash * wash * 0.85).toFixed(3)})`);
      ctx.fillStyle = w;
      ctx.fillRect(0, 0, W, H);
    }
  }
}
