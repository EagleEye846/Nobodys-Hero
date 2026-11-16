import { defineBulletArt, Shot } from '../projectiles.js';
import { Deco } from './coastKit.js';

// The Quartzling's attacks. It's a little crystal creature that stands
// perfectly still among the crystals of the Glimmering and pretends to be
// one, and it has never once blinked (it blinks). So the fight is about
// stillness and what's hiding in it:
//   - Freeze: the crystals round the box are suddenly quartzlings too, and
//     the ones that open their eyes fire at you.
//   - Glint: shards you only see properly when they catch the light.
//   - Scurry: little quartzlings dash at you and stop dead, being crystals.
//   - Staring contest: nothing moves while it stares. Every blink, every
//     shard in the box jumps one step the way it points.
// (Standing still is its trick, not yours.)
//
// It stands to the right of the box. Each attack is a factory
// `(box, density, tools) => ({ duration, update })`; see dummy.js for the
// shape. Custom bullets here (the watchers, the glinting shards, the light,
// the spire) have the same four methods as Shot: update, isGone,
// edgeDistance, draw.

const SHARD = { w: '#fbf0ff', q: '#e0c8f4', z: '#b494dc', Z: '#8062b0' };
const RUN = { k: '#2a1c3a', q: '#fbf0ff', Q: '#e0c8f4', z: '#b494dc', Z: '#8062b0', e: '#ffffff' };
const SPARK = { g: '#fff6a8', w: '#ffffff', c: '#d8b0ff' };

// A shard of quartz, drawn pointing right.
defineBulletArt('quartzShard', {
  frames: [['.....ww.', 'qqqqwwqz', '.zzzzzZZ']],
  palette: SHARD,
  radius: 1.8,
  rotate: true,
});

// The big shard that splits.
defineBulletArt('quartzBig', {
  frames: [['......ww...', '...qqqwwqz.', 'qqqqqwwqqzz', '..zzzzzzZZZ', '....ZZZZZ..']],
  palette: SHARD,
  radius: 3.2,
  rotate: true,
});
// The same, cracking: a bright split runs through it just before it goes.
defineBulletArt('quartzBigCrack', {
  frames: [
    ['......ww...', '...qqwwwqz.', 'qqwwwwwwwzz', '..zzzwwzZZZ', '....ZZZZZ..'],
    ['.....w.w...', '..wqqwwwqzw', 'wwwwqwwwwww', '..zzzwwzZZZ', '...wZZZZZw.'],
  ],
  palette: SHARD,
  radius: 3.2,
  rotate: true,
  frameSeconds: 0.06,
});
const CRACKED = new Shot({ x: 0, y: 0, art: 'quartzBigCrack' }).art;

// A bit of grit and glass from a split.
defineBulletArt('quartzBit', {
  frames: [['qw', 'zZ']],
  palette: SHARD,
  radius: 1.2,
  rotate: true,
});

// A sparkle where something catches the light (harmless).
defineBulletArt('quartzSpark', {
  frames: [
    ['..g..', '..g..', 'ggwgg', '..g..', '..g..'],
    ['.g.g.', '..c..', '.cwc.', '..c..', '.g.g.'],
  ],
  palette: SPARK,
  radius: 1,
  frameSeconds: 0.1,
});

// The little quartzling itself, scurrying (and stopping dead).
defineBulletArt('quartzRunner', {
  frames: [[
    '....q....',
    '...qwq...',
    '..qwQQz..',
    '.qwQQQzz.',
    '.qQkQkZz.',
    '.qQQQQZz.',
    '.qQQkQZz.',
    '.qQQQQZz.',
    '..zzzzZ..',
    '..zz.ZZ..',
  ]],
  palette: RUN,
  radius: 3.4,
});

// Each crystal has a face when it wants one.
const WATCH_COLORS = [
  ['#ecd8ff', '#b46af0', '#5a3a8a'],
  ['#c8fff4', '#5fe6d4', '#1f7a70'],
  ['#ffd8ec', '#f48cc8', '#8a3a6a'],
  ['#f6ecff', '#d8b0ff', '#6a4a9a'],
];

// A crystal standing on one of the box's edges. Some of them are just
// crystals. Some are quartzlings, keeping very still; when one of those
// opens its eyes (`wakeAt`) it's about to fire, and once it has it shuts
// them again and goes back to being a crystal. It never hurts itself.
// `side` is which edge it stands on: 'bottom', 'top', 'left' or 'right'.
class Watcher {
  constructor({ x, y, side, tone, real = false }) {
    this.x = x;
    this.y = y;
    this.side = side;
    this.tone = WATCH_COLORS[tone % WATCH_COLORS.length];
    this.real = real;
    this.wakeAt = Infinity;
    this.sleepAt = Infinity;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  get awake() {
    return this.age >= this.wakeAt && this.age < this.sleepAt;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return false;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const [light, mid, dark] = this.tone;
    const rise = Math.min(1, this.age / 0.4);
    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));
    // Stand "up" away from the edge it's on.
    const turn = { bottom: 0, right: -Math.PI / 2, top: Math.PI, left: Math.PI / 2 }[this.side];
    ctx.rotate(turn);
    ctx.globalAlpha = rise;
    const H = 12 * rise;
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(-4, -H * 0.6); ctx.lineTo(0, -H); ctx.lineTo(4, -H * 0.6); ctx.lineTo(4, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mid;
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-3, -H * 0.6); ctx.lineTo(0, -H * 0.92); ctx.lineTo(1, -H * 0.6); ctx.lineTo(1, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = light;
    ctx.fillRect(-3, -H * 0.55, 1, H * 0.5);
    if (this.awake) {
      // Two eyes, opening.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -7, 2, 2);
      ctx.fillRect(1, -7, 2, 2);
      ctx.fillStyle = '#2a1c3a';
      ctx.fillRect(-2, -6, 1, 1);
      ctx.fillRect(2, -6, 1, 1);
    }
    ctx.restore();
  }
}

// A shard that you can only see well when it catches the light: faint all
// the time (so it can be dodged), and bright for a moment now and then, or
// whenever the sweeping light is on it.
class GlintShard {
  constructor({ x, y, vx, vy, light, phase }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.light = light;
    this.phase = phase;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.r = 1.8;
  }

  get lit() {
    if (Math.abs(this.x - this.light.x) < 10) return 1;
    return (this.age * 1.15 + this.phase) % 1 < 0.17 ? 1 : 0;
  }

  update(dt) {
    this.age += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  isGone(box) {
    return this.age > 7 || this.x < box.x - 30 || this.x > box.x + box.w + 30 || this.y < box.y - 30 || this.y > box.y + box.h + 30;
  }

  edgeDistance(px, py) {
    return Math.hypot(px - this.x, py - this.y) - this.r;
  }

  draw(ctx) {
    const lit = this.lit;
    ctx.save();
    ctx.globalAlpha = lit ? 1 : 0.2;
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx));
    ctx.fillStyle = lit ? '#fbf0ff' : '#b494dc';
    ctx.fillRect(-4, -1, 7, 2);
    ctx.fillRect(3, 0, 1, 1);
    ctx.fillStyle = lit ? '#ffffff' : '#8062b0';
    ctx.fillRect(-1, -1, 3, 1);
    ctx.restore();
    if (lit) {
      ctx.fillStyle = '#fffbc8';
      ctx.fillRect(Math.round(this.x), Math.round(this.y) - 3, 1, 7);
      ctx.fillRect(Math.round(this.x) - 3, Math.round(this.y), 7, 1);
    }
  }
}

// The light itself: a soft pale column sweeping across the box.
class LightBar {
  constructor({ light, box }) {
    this.light = light;
    this.box = box;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > 6.9;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const { box } = this;
    ctx.save();
    const fade = Math.min(1, this.age / 0.4, Math.max(0, (6.9 - this.age) / 0.4));
    ctx.globalAlpha = 0.16 * fade;
    ctx.fillStyle = '#fff6c8';
    ctx.fillRect(Math.round(this.light.x - 10), box.y, 20, box.h);
    ctx.globalAlpha = 0.18 * fade;
    ctx.fillRect(Math.round(this.light.x - 3), box.y, 6, box.h);
    ctx.restore();
  }
}

// A spire of crystal that grows up out of the floor. First the floor
// cracks and glints where it'll come (`warn`), then it shoots up to its
// full height, stands a moment, and sinks back. Its whole length hurts.
class Spire {
  constructor({ x, baseY, height, width = 8, warn = 0.8 }) {
    this.x = x;
    this.baseY = baseY;
    this.height = height;
    this.width = width;
    this.warn = warn;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  get grown() {
    const k = this.age - this.warn;
    if (k < 0) return 0;
    if (k < 0.14) return k / 0.14;
    if (k < 0.84) return 1;
    return Math.max(0, 1 - (k - 0.84) / 0.3);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > this.warn + 1.2;
  }

  edgeDistance(px, py) {
    const h = this.height * this.grown;
    if (h < 3) return Infinity;
    const up = this.baseY - py;
    const clampedUp = Math.min(Math.max(up, 0), h);
    const half = (this.width / 2) * (1 - clampedUp / h);
    return Math.hypot(Math.max(Math.abs(px - this.x) - half, 0), up - clampedUp) - 0.6;
  }

  draw(ctx) {
    const x = Math.round(this.x);
    if (this.age < this.warn) {
      // The floor cracks.
      ctx.save();
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
      ctx.fillStyle = '#d8b0ff';
      ctx.fillRect(x - 4, this.baseY - 1, 9, 1);
      ctx.fillRect(x - 2, this.baseY - 2, 1, 1);
      ctx.fillRect(x + 2, this.baseY - 2, 1, 1);
      ctx.fillStyle = '#fff6a8';
      if (Math.floor(this.age * 8) % 3 === 0) ctx.fillRect(x, this.baseY - 3, 1, 3);
      ctx.restore();
      return;
    }
    const h = Math.max(1, this.height * this.grown);
    const w = this.width / 2;
    ctx.save();
    ctx.fillStyle = '#6a4a9a';
    ctx.beginPath(); ctx.moveTo(x - w - 1, this.baseY + 1); ctx.lineTo(x - w - 1, this.baseY - h * 0.7); ctx.lineTo(x, this.baseY - h - 1); ctx.lineTo(x + w + 1, this.baseY - h * 0.7); ctx.lineTo(x + w + 1, this.baseY + 1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d8b0ff';
    ctx.beginPath(); ctx.moveTo(x - w, this.baseY); ctx.lineTo(x - w, this.baseY - h * 0.7); ctx.lineTo(x, this.baseY - h); ctx.lineTo(x + 1, this.baseY - h * 0.7); ctx.lineTo(x + 1, this.baseY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fbf0ff';
    ctx.fillRect(x - w + 1, this.baseY - h * 0.65, 1, h * 0.6);
    ctx.fillStyle = '#b494dc';
    ctx.beginPath(); ctx.moveTo(x + 1, this.baseY); ctx.lineTo(x + 1, this.baseY - h * 0.7); ctx.lineTo(x, this.baseY - h); ctx.lineTo(x + w, this.baseY - h * 0.7); ctx.lineTo(x + w, this.baseY); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}

export const QUARTZLING_ATTACKS = {
  // Freeze: it goes perfectly still, and all the crystals round the box are
  // suddenly quartzlings too, or some of them are. The ones that are open
  // their eyes (that's your warning), and each fires a pair of shards at
  // where you're standing, then shuts its eyes and is a crystal again. The
  // rest really are just crystals.
  quartzFreeze(box, density, { Shot, rand, pick, clamp }) {
    const watchers = [];
    let t = 0;
    let built = false;
    let waves = 0;
    let nextWave = 1.0;
    let firing = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!built) {
          built = true;
          // Crystals all round the edge, none too close to each other.
          const spots = [];
          for (let i = 0; i < 4; i++) spots.push({ side: 'bottom', x: box.x + 9 + i * 20 + rand(-3, 3), y: box.y + box.h });
          for (let i = 0; i < 3; i++) spots.push({ side: 'top', x: box.x + 14 + i * 25 + rand(-3, 3), y: box.y });
          for (let i = 0; i < 2; i++) spots.push({ side: 'left', x: box.x, y: box.y + 18 + i * 42 + rand(-3, 3) });
          for (let i = 0; i < 2; i++) spots.push({ side: 'right', x: box.x + box.w, y: box.y + 18 + i * 42 + rand(-3, 3) });
          spots.forEach((spot, i) => {
            const w = new Watcher({ ...spot, tone: i });
            watchers.push(w);
            bullets.push(w);
          });
        }
        if (t >= nextWave && waves < 6) {
          waves++;
          nextWave = t + 1.45;
          // Three of them wake, not the same ones twice running.
          const sleepers = watchers.filter((w) => !w.awake && !w.recent);
          const chosen = [];
          while (chosen.length < 3 && sleepers.length) chosen.push(sleepers.splice(Math.floor(Math.random() * sleepers.length), 1)[0]);
          for (const w of watchers) w.recent = false;
          for (const w of chosen) {
            w.wakeAt = w.age;
            w.sleepAt = w.age + 1.05;
            w.recent = true;
            firing.push({ w, at: t + 0.7, shots: 2 });
          }
        }
        for (const fire of firing) {
          if (t < fire.at) continue;
          const { w } = fire;
          const inward = { bottom: [0, -1], top: [0, 1], left: [1, 0], right: [-1, 0] }[w.side];
          const from = { x: w.x + inward[0] * 6, y: w.y + inward[1] * 6 };
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(aim) * 62, vy: Math.sin(aim) * 62, art: 'quartzShard', life: 3 }));
          fire.shots--;
          fire.at = t + 0.18;
          if (fire.shots <= 0) fire.done = true;
        }
        firing = firing.filter((fire) => !fire.done);
      },
    };
  },

  // Glint: shards come at you that you can only see when they catch the
  // light. They show faintly all the time, flash for a moment every so
  // often, and light up properly whenever a sweeping bar of light crosses
  // them. All aimed at where you are, so staying put is the worst plan.
  quartzGlint(box, density, { rand, clamp }) {
    const light = { x: box.x - 20 };
    let t = 0;
    let started = false;
    let timer = 0.2;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!started) {
          started = true;
          bullets.push(new LightBar({ light, box }));
        }
        // The light goes right, then back left.
        const sweep = (t % 3.4) / 3.4;
        const toRight = Math.floor(t / 3.4) % 2 === 0;
        light.x = box.x - 10 + (toRight ? sweep : 1 - sweep) * (box.w + 20);
        if (t < 8.6) {
          timer -= dt;
          while (timer <= 0) {
            timer += 0.26;
            const fromRight = Math.random() < 0.55;
            const from = fromRight ? { x: box.x + box.w + 6, y: rand(box.y, box.y + box.h) } : { x: rand(box.x, box.x + box.w), y: Math.random() < 0.5 ? box.y - 6 : box.y + box.h + 6 };
            const aim = Math.atan2(soul.y - from.y, soul.x - from.x) + rand(-0.3, 0.3);
            const speed = rand(42, 52);
            bullets.push(new GlintShard({ x: from.x, y: from.y, vx: Math.cos(aim) * speed, vy: Math.sin(aim) * speed, light, phase: Math.random() }));
          }
        }
      },
    };
  },

  // Scurry: little quartzlings dash across the box straight at you and stop
  // dead, right on the spot, and stand there, frozen, being crystals. Then a
  // plus of shards pings out of each, and it dashes off again.
  quartzScurry(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let started = 0;
    let runners = [];
    const DASH = 125;
    // Where you're heading, from how far you moved this frame, so running
    // round in circles or along a wall doesn't shake them.
    let last = null;
    let vel = { x: 0, y: 0 };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (last && dt > 0) vel = { x: vel.x * 0.7 + ((soul.x - last.x) / dt) * 0.3, y: vel.y * 0.7 + ((soul.y - last.y) / dt) * 0.3 };
        last = { x: soul.x, y: soul.y };
        if (started < 6 && t >= started * 1.4 + 0.1) {
          const from = { x: box.x + box.w + 4, y: rand(box.y + 8, box.y + box.h - 8) };
          const lead = { x: clamp(soul.x + vel.x * 0.5, box.x + 2, box.x + box.w - 2), y: clamp(soul.y + vel.y * 0.5, box.y + 2, box.y + box.h - 2) };
          const aim = Math.atan2(lead.y - from.y, lead.x - from.x);
          // It blinks where it'll come in from, then goes.
          const shot = new Shot({ x: box.x + box.w - 5, y: from.y, vx: Math.cos(aim) * DASH, vy: Math.sin(aim) * DASH, warn: 0.6, art: 'quartzRunner', life: 6 });
          runners.push({ shot, state: 'dash', target: lead, dir: { x: Math.cos(aim), y: Math.sin(aim) }, turn: started % 2 ? Math.PI / 4 : 0, until: 0 });
          bullets.push(shot);
          started++;
        }
        for (const run of runners) {
          const { shot } = run;
          if (shot.age <= shot.warn) continue;
          if (run.state === 'dash') {
            // Past the spot it was heading for: stop dead.
            if ((shot.x - run.target.x) * run.dir.x + (shot.y - run.target.y) * run.dir.y >= 0) {
              run.state = 'frozen';
              run.until = t + 0.7;
              shot.vx = 0;
              shot.vy = 0;
              bullets.push(new Shot({ x: shot.x, y: shot.y - 6, harmless: true, life: 0.6, art: 'quartzSpark' }));
            }
          } else if (run.state === 'frozen' && t >= run.until) {
            for (let i = 0; i < 4; i++) {
              const a = run.turn + (i / 4) * Math.PI * 2;
              bullets.push(new Shot({ x: shot.x, y: shot.y, vx: Math.cos(a) * 56, vy: Math.sin(a) * 56, art: 'quartzShard', life: 2.4 }));
            }
            // A beat to shake itself off (it twitches), then off again.
            run.state = 'wind';
            run.until = t + 0.35;
          } else if (run.state === 'wind') {
            shot.x += Math.sin(t * 80) * 0.6;
            if (t < run.until) continue;
            // Off again, at wherever you are now.
            const aim = Math.atan2(soul.y - shot.y, soul.x - shot.x);
            shot.vx = Math.cos(aim) * DASH;
            shot.vy = Math.sin(aim) * DASH;
            run.state = 'leave';
            run.until = t + 0.6;
          } else if (run.state === 'leave' && t >= run.until) {
            run.state = 'gone';
            shot.age = 1e9;
          }
        }
        runners = runners.filter((run) => run.state !== 'gone');
      },
    };
  },


  // Staring contest: it never blinks. (It blinks.) Its eyes are open over
  // the top of the box, and shards of crystal grow out of the air round you,
  // pointing at you. Nothing moves while it's staring. Every time it blinks,
  // every shard jumps one step forward along the way it points, then freezes
  // again. Its eyes twitch just before a blink. Shards hurt still or moving,
  // so read where each one's next step lands and don't be there.
  quartzBlink(box, density, { rand }) {
    const SHUT = 0.32;
    const STEP = 27;
    // When it blinks (real seconds from the start), decided up front.
    const blinks = [];
    for (let s = 1.15; s < 7.6; s += rand(0.95, 1.4)) blinks.push(s);
    const blinking = (s) => blinks.some((b) => s >= b && s < b + SHUT);
    const twitching = (s) => blinks.some((b) => s >= b - 0.3 && s < b);
    class Frozen extends Shot {
      constructor(opts, born) {
        super(opts);
        this.born = born;
        this.heading = opts.angle;
      }
      update(dt) {
        this.age += dt;
        if (this.age < this.warn) return;
        if (blinking(this.born + this.age)) {
          this.x += Math.cos(this.heading) * (STEP / SHUT) * dt;
          this.y += Math.sin(this.heading) * (STEP / SHUT) * dt;
        }
        this.angle = this.heading;
      }
    }
    let now = 0;
    let spawned = -1;
    let started = false;
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        now += dt / density;
        if (!started) {
          started = true;
          // Its eyes, over the box.
          bullets.push(new Deco({
            life: 8.2,
            paint: (ctx, d) => {
              const shut = blinking(d.age);
              const twitch = twitching(d.age);
              for (const ex of [box.x + box.w / 2 - 9, box.x + box.w / 2 + 3]) {
                const y = box.y - 8;
                if (shut) {
                  ctx.fillStyle = '#8062b0';
                  ctx.fillRect(ex, y + 2, 6, 1);
                  continue;
                }
                ctx.fillStyle = '#fbf0ff';
                ctx.fillRect(ex, y + (twitch ? 1 : 0), 6, twitch ? 3 : 5);
                ctx.fillStyle = '#2a1c3a';
                ctx.fillRect(ex + 2 + (twitch && Math.floor(d.age * 20) % 2 ? 1 : 0), y + 1, 2, twitch ? 2 : 3);
              }
            },
          }));
        }
        // A new set of shards each time it opens its eyes again (and at the start).
        const opened = blinks.filter((b) => now >= b + SHUT).length;
        if (opened > spawned && opened < blinks.length) {
          spawned = opened;
          const count = 4;
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < count; i++) {
            const a = turn + (i / count) * Math.PI * 2 + rand(-0.4, 0.4);
            const d = rand(24, 31);
            const x = Math.min(Math.max(soul.x + Math.cos(a) * d, box.x + 3), box.x + box.w - 3);
            const y = Math.min(Math.max(soul.y + Math.sin(a) * d, box.y + 3), box.y + box.h - 3);
            const aim = Math.atan2(soul.y - y, soul.x - x);
            bullets.push(new Frozen({ x, y, angle: aim, warn: 0.35, art: 'quartzShard', life: 3.6 }, now));
          }
        }
      },
    };
  },
};
