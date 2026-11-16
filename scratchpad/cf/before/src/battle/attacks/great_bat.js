import { defineBulletArt } from '../projectiles.js';

// The Roost Mother's attacks: the great bat of the ice caves, who lives in a
// roost of ice beyond the Hall of Glass with more little ones than anyone
// could count. She hunts by sound, so her headline attack is ECHOLOCATION:
// the box goes dark and what's in it only shows where her sonar sweeps over
// it. Then there's her screech itself (great rings of sound with a gap to
// slip through), echoes that bounce round the box, a river of her little
// ones, her dive, and icicles shaken down from the roof of the roost.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The sonar rings and arcs are bullets of their
// own made here (anything with update, isGone, edgeDistance and draw will do;
// see projectiles.js).
//
// She sits to the right of the box (her `battlePos` in great_bat.js), so her
// sound comes from there: MOUTH is where her mouth is, measured from the box.

const BAT = {
  k: '#120c1c', z: '#2a2630', Z: '#4a4458', v: '#6a4a9a', V: '#9a7acc', p: '#f0a0b8', P: '#ffd6e4',
  i: '#e8f6ff', I: '#9fdcff', c: '#5aa8e0', w: '#ffffff',
};
const mouth = (box) => ({ x: box.x + box.w + 62, y: box.y + 24 });
// The same sound, echoed off the far (left) wall: as if from her mirror image.
const echoOf = (box, point) => ({ x: 2 * box.x - point.x, y: point.y });

// One of her little ones, flapping (the same little bat as the ones in the
// roost, smallBat.js, in her colours).
defineBulletArt('gbPup', {
  frames: [
    ['k.......k', 'vk.kk.kv.', 'vvkZZkvvk', '.kvZpZvk.', '...kZk...'],
    ['.........', '...kk....', 'kkkZZkkk.', 'vvvZpZvvk', 'vk.kZk.kv'],
  ],
  palette: BAT,
  radius: 2.5,
  frameSeconds: 0.1,
});

// A shard of ice off the roof, pointing the way it falls.
defineBulletArt('gbShard', {
  frames: [['.c..', 'ciIw', '.c..']],
  palette: BAT,
  radius: 1.5,
  rotate: true,
});

// A wave of her screech, pointing the way it travels: ))) in the dark.
defineBulletArt('gbEcho', {
  frames: [
    ['pp...', '.pP..', '..pP.', '..pP.', '..pP.', '.pP..', 'pp...'],
    ['P....', '.pp..', '..pP.', '..pP.', '..pP.', '.pp..', 'P....'],
  ],
  palette: BAT,
  radius: 2.5,
  rotate: true,
  frameSeconds: 0.08,
});

// The Roost Mother herself, small, seen from below as she dives: drawn
// heading right, wings spread to either side, frost on their edges.
defineBulletArt('gbDiver', {
  frames: [
    [
      '....iiv.....',
      '...ivvvk....',
      '..ivvvvk..p.',
      '.ivvvvzZzkpk',
      'kvvvvzZPZZZk',
      '.ivvvvzZzkpk',
      '..ivvvvk..p.',
      '...ivvvk....',
      '....iiv.....',
    ],
    [
      '............',
      '............',
      '.....ivk..p.',
      '..iivvzZzkpk',
      'kvvvvzZPZZZk',
      '..iivvzZzkpk',
      '.....ivk..p.',
      '............',
      '............',
    ],
  ],
  palette: BAT,
  radius: 3.5,
  rotate: true,
  frameSeconds: 0.07,
});

// Frost shaken off her wings as she passes.
defineBulletArt('gbFlake', {
  frames: [['.i.', 'iIi', '.i.'], ['i.i', '.w.', 'i.i']],
  palette: BAT,
  radius: 1,
  frameSeconds: 0.15,
});

// An icicle from the roof of the roost.
defineBulletArt('gbIcicle', {
  frames: [['kik', 'iwI', 'iIc', 'iIc', '.Ic', '.Ic', '.I.', '.c.']],
  palette: BAT,
  hitbox: { w: 3, h: 7 },
});

// --- Sound: things drawn as rings of sonar rather than pixel art. ---

// A ping of her sonar: a ring growing out from `from`. Harmless; it lights up
// whatever it passes over (see `seen` in batEcholocation).
function sonarRing(from, speed, tint) {
  return {
    x: from.x, y: from.y, r: 0, grow: speed, dmg: null, grazed: false, age: 0,
    update(dt) { this.age += dt; this.r += this.grow * dt; },
    isGone(box) { return this.r > Math.hypot(box.w, box.h) + Math.abs(this.x - box.x) + 20; },
    edgeDistance() { return Infinity; },
    passes(x, y) { return Math.abs(Math.hypot(x - this.x, y - this.y) - this.r) < 6; },
    draw(ctx) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = tint;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.r - 4), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
  };
}

// A ring of her screech you can't pass through, except at its gap: a band of
// sound growing out from `from`, with a gap `gapWidth` pixels wide where it
// crosses (gx, gy). It hurts along its whole band but the gap, and the gap's
// edges are honest (measured to the ends of the band).
function screechArc(box, from, gap, gapWidth, speed) {
  const gapAngle = Math.atan2(gap.y - from.y, gap.x - from.x);
  const thickness = 3;
  const far = Math.max(...[[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]]
    .map(([x, y]) => Math.hypot(x - from.x, y - from.y)));
  const near = Math.max(0, Math.min(...[box.x, box.x + box.w].map((x) => Math.abs(x - from.x))) - 8);
  return {
    x: from.x, y: from.y, r: near, grow: speed, dmg: null, grazed: false, age: 0,
    // The gap is a fixed width in pixels, so its angle shrinks as the ring grows.
    half() { return gapWidth / 2 / Math.max(this.r, 1); },
    update(dt) { this.age += dt; this.r += this.grow * dt; },
    isGone() { return this.r > far + 6; },
    edgeDistance(px, py) {
      const off = Math.atan2(py - this.y, px - this.x) - gapAngle;
      const turn = Math.abs(((off + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const half = this.half();
      if (turn > half) return Math.abs(Math.hypot(px - this.x, py - this.y) - this.r) - thickness / 2;
      // In line with the gap: only the band's two ends can touch you.
      const ends = [gapAngle - half, gapAngle + half].map((a) => Math.hypot(px - (this.x + Math.cos(a) * this.r), py - (this.y + Math.sin(a) * this.r)));
      return Math.min(...ends) - thickness / 2;
    },
    draw(ctx) {
      const half = this.half();
      const start = gapAngle + half;
      const end = gapAngle - half + Math.PI * 2;
      ctx.save();
      ctx.lineCap = 'butt';
      ctx.strokeStyle = '#6a4a9a';
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, start, end);
      ctx.stroke();
      ctx.strokeStyle = '#f0a0b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, start, end);
      ctx.stroke();
      // Little bright ticks at the edges of the gap, so you can find it.
      ctx.fillStyle = '#ffd6e4';
      for (const a of [gapAngle - half, gapAngle + half]) {
        ctx.fillRect(Math.round(this.x + Math.cos(a) * this.r) - 1, Math.round(this.y + Math.sin(a) * this.r) - 1, 2, 2);
      }
      ctx.restore();
    },
  };
}

// Hides a shot in the dark: it only shows where a sonar ring has just passed
// over it, fading out again over REVEAL_SECONDS, never quite to nothing (a
// faint glint, so it's never wholly unfair). Its hitbox doesn't change.
const REVEAL_SECONDS = 0.8;
const DARK_GLINT = 0.14;
function hideInDark(shot, rings) {
  shot.seen = 0;
  const move = shot.update.bind(shot);
  shot.update = (dt, box) => {
    move(dt, box);
    shot.seen = Math.max(0, shot.seen - dt / REVEAL_SECONDS);
    if (rings.some((ring) => ring.passes(shot.x, shot.y))) shot.seen = 1;
  };
  shot.draw = (ctx) => {
    const art = shot.art;
    const frame = art.frames[Math.floor(shot.age / art.frameSeconds) % art.frames.length];
    let alpha = DARK_GLINT + (1 - DARK_GLINT) * shot.seen;
    const over = shot.age - (shot.warn + shot.life);
    if (over > 0) alpha *= Math.max(0, 1 - over / 0.25);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(shot.x, shot.y);
    if (art.rotate) ctx.rotate(shot.angle);
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    ctx.restore();
  };
  return shot;
}

export const GREAT_BAT_ATTACKS = {
  // ECHOLOCATION. The box goes dark: her little ones flit across it, and ice
  // shards fall through it, and you can't see any of them, until she screeches.
  // Each screech sweeps a ring of sonar across the box from her side, then its
  // echo sweeps back off the far wall, and everything the rings pass over
  // shows for a moment. Watch where things were, and where they're going.
  batEcholocation(box, density, { Shot, every, rand, spreadAcross }) {
    const rings = [];
    const from = mouth(box);
    const laneY = spreadAcross(box.y + 6, box.y + box.h - 6, 5);
    const fallX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    let time = 0;
    // Each screech, and its echo off the far wall: the echo's ring comes from
    // her mirror image, so it reaches that wall just as the screech does.
    const ping = every(0.95, 0.95, (bullets) => {
      for (const ring of [sonarRing(from, 105, '#f0a0b8'), sonarRing(echoOf(box, from), 105, '#9fdcff')]) {
        rings.push(ring);
        bullets.push(ring);
      }
    }, { first: 0.05 });
    let side = Math.random() < 0.5 ? 1 : -1;
    const spawn = every(0.34, 0.42, (bullets) => {
      if (Math.random() < 0.65) {
        side = -side;
        const y = laneY();
        bullets.push(hideInDark(new Shot({
          x: side > 0 ? box.x - 6 : box.x + box.w + 6, y, vx: side * rand(32, 40),
          wobble: { amplitude: 3, frequency: rand(4, 6) }, art: 'gbPup',
        }), rings));
      } else {
        bullets.push(hideInDark(new Shot({ x: fallX(), y: box.y - 4, vx: rand(-4, 4), vy: rand(30, 38), art: 'gbShard' }), rings));
      }
    }, { first: 0.4 });
    return {
      duration: 7.5,
      update: (dt, bullets) => {
        time += dt;
        ping(dt, bullets);
        for (let i = rings.length - 1; i >= 0; i--) if (rings[i].isGone(box)) rings.splice(i, 1);
        if (time < 6.6) spawn(dt, bullets);
      },
    };
  },

  // Screech. Great rings of her voice roll across the box from her side, each
  // with one gap in it: slip through. Each gap is a step up or down from the
  // last. Halfway through, the echoes start coming back off the far wall too,
  // so the rings come from both sides, turn and turn about.
  batScreech(box, density, { rand, clamp }) {
    const from = mouth(box);
    const echo = echoOf(box, from);
    let time = 0;
    let next = 0.2;
    let count = 0;
    let gapY = rand(box.y + 20, box.y + box.h - 20);
    let step = Math.random() < 0.5 ? 1 : -1;
    return {
      duration: 8,
      update: (dt, bullets) => {
        time += dt;
        if (time >= next && time < 7) {
          count++;
          const fromEcho = time > 3.6 && count % 2 === 0;
          // Each gap a step from the last: up, then down, then up...
          step = -step;
          gapY = clamp(gapY + step * rand(18, 30), box.y + 12, box.y + box.h - 12);
          const source = fromEcho ? echo : from;
          bullets.push(screechArc(box, source, { x: box.x + box.w / 2, y: gapY }, 17, 46));
          next = time + (time > 3.6 ? 0.85 : 1.15);
        }
      },
    };
  },

  // Echoes. She screeches at you, three waves at a time, and they ring round
  // the box, bouncing off the walls. Each bounce makes them a little slower
  // and fainter, and after the third they die away.
  batEchoes(box, density, { Shot, every, rand, angleTo }) {
    const waves = [];
    const volley = every(0.95, 1.1, (bullets, soul) => {
      const at = { x: box.x + box.w - 4, y: rand(box.y + 10, box.y + box.h - 10) };
      const aim = angleTo(at, soul);
      for (const spread of [-0.4, 0, 0.4]) {
        const shot = new Shot({ x: at.x, y: at.y, vx: Math.cos(aim + spread) * 50, vy: Math.sin(aim + spread) * 50, bounce: true, art: 'gbEcho' });
        shot.bounces = 0;
        bullets.push(shot);
        waves.push(shot);
      }
    }, { first: 0.3 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        volley(dt, bullets, soul);
        for (const wave of waves) {
          // A bounce shows as its velocity flipping since last time.
          if (wave.lastVx !== undefined && (Math.sign(wave.vx) !== Math.sign(wave.lastVx) || Math.sign(wave.vy) !== Math.sign(wave.lastVy))) {
            wave.bounces++;
            wave.vx *= 0.85;
            wave.vy *= 0.85;
            if (wave.bounces >= 3) wave.life = Math.max(0, wave.age - wave.warn);
          }
          wave.lastVx = wave.vx;
          wave.lastVy = wave.vy;
        }
        for (let i = waves.length - 1; i >= 0; i--) if (waves[i].isGone(box)) waves.splice(i, 1);
      },
    };
  },

  // The roost wakes. Her little ones pour across the box in two rivers, one
  // each way, snaking up and down as they go. Keep out of the streams; now
  // and then a lost one wanders off on its own.
  batSwarm(box, density, { Shot, every, rand }) {
    const mid = box.y + box.h / 2;
    const phase = rand(0, Math.PI * 2);
    let time = 0;
    const riverY = (way) => mid + Math.sin(time * 1.1 + phase + (way > 0 ? 0 : Math.PI * 0.8)) * 26;
    const river = (way) => every(0.13, 0.17, (bullets) => {
      bullets.push(new Shot({
        x: way > 0 ? box.x - 6 : box.x + box.w + 6, y: riverY(way) + rand(-4, 4), vx: way * rand(58, 66),
        wobble: { amplitude: 1.5, frequency: rand(8, 12) }, art: 'gbPup',
      }));
    }, { first: way > 0 ? 0.1 : 0.6 });
    const left = river(1);
    const right = river(-1);
    const stray = every(1.3, 1.7, (bullets, soul) => {
      const way = Math.random() < 0.5 ? 1 : -1;
      bullets.push(new Shot({
        x: way > 0 ? box.x - 6 : box.x + box.w + 6, y: soul.y + rand(-20, 20), vx: way * 34, vy: rand(-8, 8),
        wobble: { amplitude: 6, frequency: 3 }, art: 'gbPup',
      }));
    }, { first: 1.5 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        time += dt;
        if (time > 6.3) return;
        left(dt, bullets);
        right(dt, bullets);
        stray(dt, bullets, soul);
      },
    };
  },

  // The dive. She blinks at the edge of the box, a line shows where she'll
  // go, and she swoops straight through, shaking frost off her wings behind
  // her. The frost drifts down where she's been, so don't wait under her path.
  batDive(box, density, { Shot, Line, every, rand, angleTo, edgePoint, shuffleBag }) {
    const side = shuffleBag(['left', 'right', 'top', 'bottom']);
    const divers = [];
    const warn = 0.65;
    const dive = every(1.2, 1.3, (bullets, soul) => {
      const edge = edgePoint(box, side(), -5);
      const aim = angleTo(edge, soul) + rand(-0.08, 0.08);
      bullets.push(new Line({
        x: edge.x, y: edge.y, angle: aim, length: 140, warn, life: 0, color: '#f0a0b8', thickness: 1,
      }));
      const diver = new Shot({ x: edge.x, y: edge.y, vx: Math.cos(aim) * 165, vy: Math.sin(aim) * 165, warn, art: 'gbDiver', angle: aim });
      diver.trailAt = 0;
      bullets.push(diver);
      divers.push(diver);
    }, { first: 0.3 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        dive(dt, bullets, soul);
        for (const diver of divers) {
          const flying = diver.age - diver.warn;
          if (flying <= 0 || flying > 1) continue;
          const inside = diver.x > box.x && diver.x < box.x + box.w && diver.y > box.y && diver.y < box.y + box.h;
          if (inside && flying >= diver.trailAt) {
            diver.trailAt = flying + 0.06;
            bullets.push(new Shot({ x: diver.x, y: diver.y, vx: rand(-6, 6), vy: 0, gravity: 30, warn: 0.25, life: 1.4, art: 'gbFlake' }));
          }
        }
        for (let i = divers.length - 1; i >= 0; i--) if (divers[i].isGone(box)) divers.splice(i, 1);
      },
    };
  },

  // Icicles. She grips the roof of the roost and shakes it: icicles shiver
  // along the top of the box, then fall one after another, sweeping from one
  // side to the other, and shatter on the floor into shards that skitter
  // away. Between rows, one falls right where you're standing.
  batIcicles(box, density, { Shot, every, rand, clamp }) {
    const icicles = [];
    let way = Math.random() < 0.5 ? 1 : -1;
    let time = 0;
    const drop = (bullets, x, warn) => {
      const icicle = new Shot({ x, y: box.y + 5, vy: 12, gravity: 150, warn, art: 'gbIcicle', angle: 0 });
      bullets.push(icicle);
      icicles.push(icicle);
    };
    const row = every(1.6, 1.8, (bullets) => {
      way = -way;
      const gap = Math.floor(rand(1, 5));
      for (let i = 0; i < 6; i++) {
        if (i === gap) continue;
        const x = box.x + 7 + ((way > 0 ? i : 5 - i) * (box.w - 14)) / 5 + rand(-2, 2);
        drop(bullets, x, 0.55 + i * 0.12);
      }
    }, { first: 0.2 });
    const aimed = every(1.6, 1.8, (bullets, soul) => {
      drop(bullets, clamp(soul.x, box.x + 4, box.x + box.w - 4), 0.6);
    }, { first: 1.1 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        time += dt;
        if (time < 5.6) {
          row(dt, bullets);
          aimed(dt, bullets, soul);
        }
        for (let i = icicles.length - 1; i >= 0; i--) {
          const icicle = icicles[i];
          if (icicle.y < box.y + box.h - 5) continue;
          // It hits the floor and shatters.
          icicle.life = 0;
          icicle.y = box.y + box.h - 5;
          icicles.splice(i, 1);
          for (const vx of [-1, 1]) {
            bullets.push(new Shot({ x: icicle.x, y: box.y + box.h - 4, vx: vx * rand(38, 48), vy: -rand(26, 34), gravity: 110, life: 0.8, art: 'gbShard' }));
          }
        }
      },
    };
  },
};
