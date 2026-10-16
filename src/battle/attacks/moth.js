import { defineBulletArt } from '../projectiles.js';

// The Lantern Moth's attacks. It's a moth that can't stay away from light, so
// everything it throws is from a moth's world: little moths that flutter
// toward your glow, glittering wing scales, lantern flames and sparks, beams
// of lantern light, and cocoons that hatch into more moths.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// `tools` holds the bullet classes and helpers (see PATTERN_TOOLS in
// src/battle/bullets.js). Art with `rotate` is drawn pointing right, so moths
// face where they fly.

const MOTH_COLOURS = {
  w: '#c9b8ff', // wing
  W: '#8a6fd4', // wing pattern
  b: '#ffe08a', // body
  g: '#fff6c0', // glowing tail
  a: '#8a6fd4', // antennae
};

// A tiny moth, flapping as it flies (two frames: wings open, wings closed).
defineBulletArt('mothling', {
  frames: [
    [
      '.ww...a',
      'wWWw.a.',
      'gbbbbb.',
      'wWWw.a.',
      '.ww...a',
    ],
    [
      '.......',
      '.wWw..a',
      'gbbbbb.',
      '.wWw..a',
      '.......',
    ],
  ],
  palette: MOTH_COLOURS,
  radius: 2,
  rotate: true,
  frameSeconds: 0.09,
});

// A glittering scale of wing dust, shimmering as it drifts.
defineBulletArt('mothScale', {
  frames: [
    ['.w.', 'wWw', 'wWw', '.w.'],
    ['.W.', 'WgW', 'WgW', '.W.'],
  ],
  palette: { w: '#c9b8ff', W: '#8a6fd4', g: '#fff6c0' },
  radius: 1.5,
  spin: 5,
  frameSeconds: 0.1,
});

// A lantern flame, flickering as it falls.
defineBulletArt('mothSpark', {
  frames: [
    ['..o..', '.oyo.', 'oywyo', '.oyo.'],
    ['.o...', '.oyo.', 'oywyo', '.oyo.'],
    ['...o.', '.oyo.', 'oywyo', '.oyo.'],
  ],
  palette: { o: '#ff8c1a', y: '#ffd25e', w: '#fff6c0' },
  radius: 1.5,
  frameSeconds: 0.08,
});

// A little hanging lantern (harmless itself; it shines beams or drops sparks).
defineBulletArt('mothLantern', {
  frames: [
    ['..k..', '.kkk.', 'kyyyk', 'kywyk', 'kyyyk', '.kkk.'],
    ['..k..', '.kkk.', 'kyyyk', 'kyyyk', 'kywyk', '.kkk.'],
  ],
  palette: { k: '#4a3a2a', y: '#ffd25e', w: '#fff6c0' },
  radius: 3,
  frameSeconds: 0.15,
});

// A silky cocoon, wriggling before it hatches (harmless itself).
defineBulletArt('mothCocoon', {
  frames: [
    ['..s..', '.cCc.', 'cCcCc', 'cCcCc', '.cCc.', '..c..'],
    ['..s..', '.cCc.', 'cCcCc', '.cCcC', '.cCc.', '...c.'],
    ['..s..', '.cCc.', 'cCcCc', 'CcCc.', '.cCc.', '.c...'],
  ],
  palette: { s: '#f2ecff', c: '#e6dcc0', C: '#b8a882' },
  radius: 3,
  frameSeconds: 0.1,
});

// A bigger moth, beating its wings (harmless itself; its wings shed scales).
defineBulletArt('mothWingbeat', {
  frames: [
    [
      'a.......a',
      '.a.....a.',
      'wWw.b.wWw',
      'wWWwgwWWw',
      '.wwwbwww.',
      '..ww.ww..',
    ],
    [
      'a.......a',
      '.a.....a.',
      '...wbw...',
      '..wWgWw..',
      '..wwbww..',
      '...w.w...',
    ],
  ],
  palette: MOTH_COLOURS,
  radius: 3,
  frameSeconds: 0.1,
});

// A chain for a hanging lantern: drawn, never hurts.
function lanternChain(pivot, lantern) {
  return {
    dmg: null,
    done: false,
    update() {},
    isGone() {
      return this.done;
    },
    edgeDistance() {
      return Infinity;
    },
    draw(ctx) {
      ctx.save();
      ctx.strokeStyle = '#6b5a44';
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 1]);
      ctx.beginPath();
      ctx.moveTo(pivot.x, pivot.y);
      ctx.lineTo(lantern.x, lantern.y - 3);
      ctx.stroke();
      ctx.restore();
    },
  };
}

export const MOTH_ATTACKS = {
  // Drawn to your light! Little moths blink in around the edges of the box,
  // then flutter toward you, steering after you for a couple of seconds
  // before they lose interest and fade.
  mothSwarm(box, density, { Shot, every, edgePoint, angleTo, rand, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const arrive = every(1.2, 1.6, (bullets, soul) => {
      const start = edgePoint(box, edge(), -4);
      const aim = angleTo(start, soul) + rand(-0.6, 0.6);
      const speed = 45;
      bullets.push(new Shot({
        x: start.x,
        y: start.y,
        vx: Math.cos(aim) * speed,
        vy: Math.sin(aim) * speed,
        art: 'mothling',
        warn: 0.6,
        life: 2.2,
        homing: { target: soul, turn: 0.35 },
        wobble: { amplitude: 1.5, frequency: 16 },
      }));
    });
    return { duration: 6.5, update: (dt, bullets, soul) => arrive(dt, bullets, soul) };
  },

  // A lantern blinks on at the edge of the box, shows a flashing preview for
  // a full second, then shines a beam of light across it. Sometimes it's one beam straight at you; sometimes two beams
  // either side of you, with a dark gap to stay in.
  mothLanternBeam(box, density, { Shot, Line, every, edgePoint, angleTo, rand, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const pattern = shuffleBag(['single', 'single', 'pair']);
    const warn = 1.0;
    const shine = every(2.4, 2.8, (bullets, soul) => {
      const lantern = edgePoint(box, edge(), -4);
      bullets.push(new Shot({ x: lantern.x, y: lantern.y, art: 'mothLantern', harmless: true, life: warn + 0.6 }));
      const aim = angleTo(lantern, soul);
      const angles = pattern() === 'single' ? [aim + rand(-0.12, 0.12)] : [aim - 0.5, aim + 0.5];
      for (const angle of angles) {
        bullets.push(new Line({
          x: lantern.x,
          y: lantern.y,
          angle,
          length: 130,
          thickness: 4,
          warn,
          grow: 240,
          life: 0.6,
          color: '#ffe08a',
          glow: '#ffd25e',
        }));
      }
    });
    return { duration: 6.5, update: (dt, bullets, soul) => shine(dt, bullets, soul) };
  },

  // A lantern swings back and forth on a chain from the top of the box,
  // shaking loose flames that fly off the way it's swinging and fall.
  mothSwingingLantern(box, density, { Shot, every, rand }) {
    const pivot = { x: box.x + box.w / 2, y: box.y - 6 };
    const chainLength = 30;
    const reach = 0.95; // widest swing, in radians
    const swingSpeed = 2.1; // radians of the swing cycle per second
    let time = 0;
    let lantern = null;
    let chain = null;

    const swingAngle = () => Math.sin(time * swingSpeed) * reach;
    const drop = every(0.5, 0.65, (bullets) => {
      // How fast the lantern is moving sideways right now, so flames fly with it.
      const sideways = Math.cos(time * swingSpeed) * reach * swingSpeed * chainLength;
      bullets.push(new Shot({
        x: lantern.x,
        y: lantern.y + 3,
        vx: sideways * 0.6 + rand(-10, 10),
        vy: rand(-18, 4),
        gravity: 70,
        art: 'mothSpark',
      }));
    });

    return {
      duration: 6.5,
      update: (dt, bullets) => {
        time += dt;
        if (!lantern) {
          lantern = new Shot({ x: pivot.x, y: pivot.y + chainLength, art: 'mothLantern', harmless: true });
          chain = lanternChain(pivot, lantern);
          bullets.push(chain, lantern);
        }
        const angle = swingAngle();
        lantern.x = pivot.x + Math.sin(angle) * chainLength;
        lantern.y = pivot.y + Math.cos(angle) * chainLength;
        // Give it a moment to start swinging before the flames shake loose.
        if (time > 0.6) drop(dt, bullets);
        if (time > 6.2) {
          lantern.life = 0;
          chain.done = true;
        }
      },
    };
  },

  // Cocoons appear around the box (never right on top of you) and wriggle,
  // then hatch: five little moths burst out in a star, one heading your
  // way, picking up speed as they go.
  mothCocoonHatch(box, density, { Shot, every, rand, angleTo, pointAwayFrom }) {
    const wriggle = 0.85;
    let cocoons = [];
    const hang = every(1.15, 1.45, (bullets, soul) => {
      const { x, y } = pointAwayFrom(box, soul, 30);
      bullets.push(new Shot({ x, y, art: 'mothCocoon', harmless: true, life: wriggle }));
      cocoons.push({ x, y, t: wriggle });
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        hang(dt, bullets, soul);
        for (const cocoon of cocoons) {
          cocoon.t -= dt;
          if (cocoon.t > 0) continue;
          const aim = angleTo(cocoon, soul) + rand(-0.35, 0.35);
          for (let i = 0; i < 5; i++) {
            const angle = aim + (i / 5) * Math.PI * 2;
            bullets.push(new Shot({
              x: cocoon.x,
              y: cocoon.y,
              vx: Math.cos(angle) * 22,
              vy: Math.sin(angle) * 22,
              accel: 45,
              art: 'mothling',
            }));
          }
        }
        cocoons = cocoons.filter((cocoon) => cocoon.t > 0);
      },
    };
  },

  // A big moth drifts back and forth across the top of the box beating its
  // wings, and the glittering dust it sheds spirals out in two turning arms.
  // Slip through the gaps between them.
  mothWingDust(box, density, { Shot, rand }) {
    const home = { x: box.x + box.w / 2, y: box.y + 12 };
    const spinRate = 1.2; // how fast the arms turn, radians per second
    const shedEvery = 0.46;
    let time = 0;
    let shedTimer = 0.6; // a moment to see the moth before the dust starts
    let turn = rand(0, Math.PI * 2);
    let moth = null;

    return {
      duration: 6.5,
      update: (dt, bullets) => {
        time += dt;
        turn += spinRate * dt;
        if (!moth) {
          moth = new Shot({ x: home.x, y: home.y, art: 'mothWingbeat', harmless: true, life: 6.3 });
          bullets.push(moth);
        }
        moth.x = home.x + Math.sin(time * 0.9) * 24;
        moth.y = home.y + Math.sin(time * 2.3) * 3;

        shedTimer -= dt;
        while (shedTimer <= 0 && time < 6) {
          shedTimer += shedEvery;
          for (const arm of [0, Math.PI]) {
            const angle = turn + arm;
            bullets.push(new Shot({
              x: moth.x,
              y: moth.y,
              vx: Math.cos(angle) * 36,
              vy: Math.sin(angle) * 36,
              art: 'mothScale',
            }));
          }
        }
      },
    };
  },
};
