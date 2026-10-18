import { defineBulletArt } from '../projectiles.js';

// The Rimewing's attacks. It's a lantern moth grown huge in the cold, frost
// on its wings, and it can't keep away from a light, so its attacks are all
// about lights: frost scales streaming at the lamp you leave behind when you
// stand still, wing dust that chills you to a crawl, wingbeats that blow
// everything sideways, and a candle that pulls every scale into its flame.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Some of these nudge the soul itself (the dust
// slows it, a wingbeat pushes it), always gently enough to fight against.

const RIME = { k: '#2a2a4a', w: '#e6eef8', W: '#9fd0e8', d: '#5a8ab8', b: '#c8c0d8', e: '#2a2a4a', g: '#fff6c0', y: '#ffd25e' };

// A frost scale off its wing, pointing the way it flies.
defineBulletArt('rimeScale', {
  frames: [['.dW..', 'dWwww', '.dW..']],
  palette: RIME,
  radius: 1.5,
  rotate: true,
});

// Frost dust: it doesn't hurt, but it chills you and slows you down.
defineBulletArt('rimeDust', {
  frames: [['w.w', '.W.', 'w.w'], ['.w.', 'wWw', '.w.']],
  palette: RIME,
  radius: 2,
  frameSeconds: 0.12,
});

// The rimewing itself, small, flying about the box: wings open, then closed.
defineBulletArt('rimeMoth', {
  frames: [
    ['.k.......k.', '..k.....k..', 'kwwk.k.kwwk', 'wWdwkbkwdWw', 'wWWwkbkwWWw', '.wwwkbkwww.', 'wWwk.b.kwWw', '.ww.....ww.'],
    ['.k.......k.', '..k.....k..', '....kwk....', '...kWbWk...', '...wdbdw...', '...wWbWw...', '....wbw....', '.....w.....'],
  ],
  palette: RIME,
  radius: 3.5,
  frameSeconds: 0.14,
});

// The light you leave where you last stood still.
defineBulletArt('rimeLamp', {
  frames: [
    ['..y..', '.ygy.', 'ygwgy', '.ygy.', '..y..'],
    ['y.y.y', '.ygy.', 'ygwgy', '.ygy.', 'y.y.y'],
  ],
  palette: RIME,
  radius: 2,
  frameSeconds: 0.2,
});

// A lone candle, its flame flickering. Touching it burns.
defineBulletArt('rimeCandle', {
  frames: [
    ['..y..', '.ygy.', '.ygy.', '..y..', '.www.', '.wWw.', '.wWw.', '.wWw.', 'kkkkk'],
    ['...y.', '..gy.', '.ygy.', '..y..', '.www.', '.wWw.', '.wWw.', '.wWw.', 'kkkkk'],
  ],
  palette: RIME,
  hitbox: { w: 3, h: 8 },
  frameSeconds: 0.12,
});

// A streak of wind from a wingbeat (harmless).
defineBulletArt('rimeGust', {
  frames: [['wwWWW...']],
  palette: RIME,
  radius: 1,
  rotate: true,
});

// A soft round glow, drawn under the candle: inside it, scales burn up.
function glow(candle, radius) {
  return {
    x: candle.x, y: candle.y, vx: 0, vy: 0, dmg: null, age: 0, radius, done: false,
    update(dt) { this.age += dt; this.x = candle.x; this.y = candle.y - 2; },
    isGone() { return this.done; },
    edgeDistance() { return Infinity; },
    draw(ctx) {
      if (candle.age < candle.warn) return;
      const light = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.radius);
      light.addColorStop(0, 'rgba(255, 220, 140, 0.4)');
      light.addColorStop(0.8, 'rgba(255, 210, 120, 0.15)');
      light.addColorStop(1, 'rgba(255, 210, 120, 0)');
      ctx.save();
      ctx.fillStyle = light;
      ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      ctx.strokeStyle = 'rgba(255, 220, 140, 0.35)';
      ctx.setLineDash([1, 2]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
  };
}

export const RIMEWING_ATTACKS = {
  // Lamp-drawn. Wherever you stand still, you leave a little light behind,
  // and the rimewing can't help itself: it flutters slowly toward the light,
  // and frost scales stream in from all round the box at it. Keep moving and
  // the light stays behind you; stop, and everything comes for you.
  rimeLampDrawn(box, density, { Shot, every, rand, angleTo }) {
    const centre = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
    let lamp = null;
    let moth = null;
    let last = null;
    let still = 0;
    let around = rand(0, Math.PI * 2);
    const stream = every(0.17, 0.22, (bullets) => {
      around += 0.55 + rand(0, 0.25);
      const from = { x: centre.x + Math.cos(around) * 60, y: centre.y + Math.sin(around) * 60 };
      const aim = angleTo(from, lamp) + rand(-0.06, 0.06);
      bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(aim) * 56, vy: Math.sin(aim) * 56, art: 'rimeScale' }));
    }, { first: 0.5 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        if (!lamp) {
          lamp = new Shot({ x: soul.x, y: soul.y, harmless: true, art: 'rimeLamp' });
          moth = new Shot({ x: box.x + box.w / 2, y: box.y + 8, warn: 0.6, art: 'rimeMoth' });
          bullets.push(lamp, moth);
          last = { x: soul.x, y: soul.y };
        }
        // Standing still (near enough) for a moment moves the lamp to you.
        const moved = Math.hypot(soul.x - last.x, soul.y - last.y);
        still = moved < 20 * dt ? still + dt : 0;
        last = { x: soul.x, y: soul.y };
        if (still > 0.3) {
          lamp.x = soul.x;
          lamp.y = soul.y;
        }
        // The moth drifts toward the lamp, fluttering.
        if (moth.age >= moth.warn) {
          const heading = angleTo(moth, lamp);
          const gap = Math.hypot(lamp.x - moth.x, lamp.y - moth.y);
          const speed = Math.min(26, gap * 2);
          moth.x += Math.cos(heading) * speed * dt;
          moth.y += Math.sin(heading) * speed * dt + Math.sin(moth.age * 9) * 0.4;
        }
        stream(dt, bullets);
      },
    };
  },

  // Frost dust. The rimewing hangs over the top of the box beating its
  // wings, and what comes off them spirals out in four turning arms: two of
  // frost scales, which hurt, and two of glittering dust between them, which
  // don't, but chill you so you crawl for a moment. Go round the dust.
  rimeFrostDust(box, density, { Shot, rand }) {
    const home = { x: box.x + box.w / 2, y: box.y + 13 };
    const spin = rand(1.0, 1.3) * (Math.random() < 0.5 ? -1 : 1);
    let time = 0;
    let shed = 0.6;
    let turn = rand(0, Math.PI * 2);
    let moth = null;
    let dust = [];
    let chill = 0;
    let frost = null;
    let last = null;
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        time += dt;
        turn += spin * dt;
        if (!moth) {
          moth = new Shot({ x: home.x, y: home.y, warn: 0.4, art: 'rimeMoth' });
          bullets.push(moth);
        }
        moth.x = home.x + Math.sin(time * 0.8) * 20;
        moth.y = home.y + Math.sin(time * 2.1) * 3;
        shed -= dt;
        while (shed <= 0 && time < 6.1) {
          shed += 0.3;
          for (let arm = 0; arm < 4; arm++) {
            const angle = turn + (arm * Math.PI) / 2;
            const shot = new Shot({
              x: moth.x, y: moth.y, vx: Math.cos(angle) * 34, vy: Math.sin(angle) * 34,
              harmless: arm % 2 === 1, life: 3, art: arm % 2 ? 'rimeDust' : 'rimeScale',
            });
            bullets.push(shot);
            if (arm % 2) dust.push(shot);
          }
        }
        // Touching the dust chills you: for a moment you move at half speed.
        dust = dust.filter((mote) => mote.age < mote.life);
        if (dust.some((mote) => Math.hypot(mote.x - soul.x, mote.y - soul.y) < 5)) chill = 0.7;
        if (chill > 0 && last) {
          chill -= dt;
          soul.x = last.x + (soul.x - last.x) * 0.5;
          soul.y = last.y + (soul.y - last.y) * 0.5;
          if (!frost || frost.age > frost.life) {
            frost = new Shot({ x: soul.x, y: soul.y, harmless: true, life: 0.15, art: 'rimeDust' });
            bullets.push(frost);
          }
          frost.x = soul.x;
          frost.y = soul.y - 6;
        }
        last = { x: soul.x, y: soul.y };
      },
    };
  },

  // Wingbeat. Frost scales drift down from the top of the box, and every so
  // often the rimewing beats its great wings: streaks of wind show which
  // way, then everything, scales and you alike, is blown that way for a
  // moment. The next beat blows the other way.
  rimeBeat(box, density, { Shot, every, rand, spreadAcross }) {
    const fallX = spreadAcross(box.x - 20, box.x + box.w + 20, 6);
    let way = Math.random() < 0.5 ? 1 : -1;
    let scales = [];
    let beat = null;
    const fall = every(0.1, 0.14, (bullets) => {
      const shot = new Shot({ x: fallX(), y: box.y - 3, vy: rand(26, 34), art: 'rimeScale' });
      bullets.push(shot);
      scales.push(shot);
    });
    const flap = every(1.5, 1.7, (bullets) => {
      beat = { way, t: 0 };
      way = -way;
      // Wind streaks come first, so you can see which way it'll blow.
      for (let i = 0; i < 6; i++) {
        bullets.push(new Shot({
          x: beat.way > 0 ? box.x - 4 - rand(0, 20) : box.x + box.w + 4 + rand(0, 20),
          y: box.y + 6 + i * 13 + rand(-3, 3),
          vx: beat.way * 140,
          harmless: true,
          life: 0.9,
          art: 'rimeGust',
        }));
      }
    }, { first: 0.9 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        fall(dt, bullets);
        flap(dt, bullets);
        scales = scales.filter((shot) => shot.y < box.y + box.h + 6);
        if (beat) {
          beat.t += dt;
          // 0.35s of warning, then the gust, then it dies down.
          const gust = beat.t < 0.35 ? 0 : beat.t < 1.15 ? 1 : 0;
          if (gust) {
            soul.x += beat.way * 30 * dt;
            for (const shot of scales) shot.vx += beat.way * 90 * dt;
          } else if (beat.t >= 1.15) {
            beat = null;
          }
        }
        // Between beats the scales settle back to falling straight.
        if (!beat || beat.t < 0.35) for (const shot of scales) shot.vx *= Math.max(0, 1 - 1.8 * dt);
      },
    };
  },

  // A candle. A lone flame lights somewhere in the box, and every frost
  // scale bends toward it, and burns up in its glow. Stand in the light,
  // close to the candle but not on the flame. The glow shrinks as it burns
  // down, and then it goes out and lights again somewhere else.
  rimeCandle(box, density, { Shot, every, rand, angleTo, clamp, edgePoint, pointAwayFrom, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const burn = 2.6;
    let candle = null;
    let light = null;
    let scales = [];
    const relight = (bullets, soul) => {
      if (candle) {
        candle.life = candle.age - candle.warn;
        light.done = true;
      }
      const spot = pointAwayFrom(box, soul, 30, 14);
      candle = new Shot({ x: spot.x, y: spot.y, warn: 0.7, life: burn, art: 'rimeCandle', angle: 0 });
      light = glow(candle, 16);
      bullets.push(light, candle);
    };
    const move = every(burn + 0.7, burn + 0.7, (bullets, soul) => relight(bullets, soul), { first: 0 });
    const shoot = every(0.2, 0.26, (bullets, soul) => {
      const from = edgePoint(box, edge(), 3);
      const aim = angleTo(from, soul) + rand(-0.4, 0.4);
      const shot = new Shot({ x: from.x, y: from.y, vx: Math.cos(aim) * 48, vy: Math.sin(aim) * 48, art: 'rimeScale' });
      bullets.push(shot);
      scales.push(shot);
    }, { first: 0.5 });
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        move(dt, bullets, soul);
        shoot(dt, bullets, soul);
        const lit = candle.age >= candle.warn;
        // The glow burns down from 16 pixels to 10.
        light.radius = 16 - 6 * clamp((candle.age - candle.warn) / burn, 0, 1);
        for (const shot of scales) {
          // The nearer the flame, the harder it pulls.
          const gap = Math.hypot(candle.x - shot.x, candle.y - shot.y);
          shot.homing = lit ? { target: candle, turn: clamp(80 / gap, 0.8, 10) } : null;
          if (lit && gap < light.radius) shot.life = shot.age - shot.warn;
        }
        scales = scales.filter((shot) => shot.age < shot.warn + shot.life);
      },
    };
  },
};
