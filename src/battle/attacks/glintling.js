import { defineBulletArt } from '../projectiles.js';

// The Glintling's attacks. It's a little living cluster of ice crystal that
// plays with light, and it thinks it's very funny: a beam of light split
// three ways through a prism, a reflection of you in the ice that copies
// every move you make (backwards), crystals that pop up closer and closer
// and burst into glitter, and the glintling itself skating round the box,
// leaving a trail of sparkle behind it.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const ICE = { k: '#1c2a4a', I: '#ffffff', i: '#bff0ff', c: '#7cc8f0', C: '#4a90d0', p: '#ffb8e8', y: '#fff2a0' };

// A prism of ice, floating: the light goes in one side and comes out in colours.
defineBulletArt('glintPrism', {
  frames: [
    ['...I...', '..iIc..', '.iIpcC.', '.iIycC.', 'iiIicCC', '.ciccC.', '..cCC..'],
    ['...i...', '..iIc..', '.iIycC.', '.iIpcC.', 'iiIicCC', '.ciccC.', '..cCC..'],
  ],
  palette: ICE,
  hitbox: { w: 5, h: 6 },
  frameSeconds: 0.2,
});

// A splinter of crystal, pointing the way it flies, with a coloured glint.
defineBulletArt('glintShard', {
  frames: [['.c...', 'ciIIp', '.c...'], ['.c...', 'ciIIy', '.c...']],
  palette: ICE,
  radius: 1.5,
  rotate: true,
  frameSeconds: 0.1,
});

// A sparkle of glitter, twinkling.
defineBulletArt('glintSparkle', {
  frames: [['..i..', '.iIi.', 'iIpIi', '.iIi.', '..i..'], ['.....', '..I..', '.IyI.', '..I..', '.....']],
  palette: ICE,
  radius: 1.5,
  frameSeconds: 0.09,
});

// Your reflection in the ice: the shape of your shadow's helmet, in crystal.
defineBulletArt('glintMirror', {
  frames: [[
    '....ii...',
    '...iIi...',
    '..iIIIi..',
    '.icccccC.',
    '.iIIIIIc.',
    'iiIIIIIcC',
    'iIIIIIIIc',
    '.ciIIIcC.',
    '..ccCCC..',
  ]],
  palette: ICE,
  radius: 3.5,
});

// The glintling, rolled up to skate.
defineBulletArt('glintSkater', {
  frames: [
    ['..kIk..', '.kiIck.', 'kiIpcCk', 'kiIycCk', '.kicCk.', '..kkk..'],
    ['..kIk..', '.kiIck.', 'kiIycCk', 'kiIpcCk', '.kicCk.', '..kkk..'],
  ],
  palette: ICE,
  radius: 2.5,
  frameSeconds: 0.08,
});

// The three colours a beam splits into.
const SPLIT = ['#ffb8e8', '#fff2a0', '#9ff6ff'];

export const GLINTLING_ATTACKS = {
  // Refraction. A prism of ice appears in the box, and a beam of light comes
  // in from the side and hits it, and three coloured beams fan out of the
  // other side of it, the middle one aimed where you are. Each beam shows
  // as a flashing line first. Then the prism winks out and another appears.
  glintRefract(box, density, { Shot, Line, every, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right', 'top', 'bottom']);
    const fire = every(1.55, 1.8, (bullets, soul) => {
      const from = side();
      const across = from === 'left' || from === 'right';
      // The prism sits a third of the way in from the beam's side.
      const prism = {
        x: from === 'left' ? box.x + 22 : from === 'right' ? box.x + box.w - 22 : clamp(rand(box.x + 14, box.x + box.w - 14), box.x, box.x + box.w),
        y: from === 'top' ? box.y + 22 : from === 'bottom' ? box.y + box.h - 22 : rand(box.y + 14, box.y + box.h - 14),
      };
      // Don't put the prism right on top of you.
      if (Math.hypot(prism.x - soul.x, prism.y - soul.y) < 14) {
        if (across) prism.y = soul.y + (soul.y > box.y + box.h / 2 ? -20 : 20);
        else prism.x = soul.x + (soul.x > box.x + box.w / 2 ? -20 : 20);
      }
      const warn = 0.75;
      const life = 0.7;
      bullets.push(new Shot({ x: prism.x, y: prism.y, warn: 0.4, life: warn + life - 0.4 + 0.1, art: 'glintPrism', angle: 0 }));
      const inAngle = { left: 0, right: Math.PI, top: Math.PI / 2, bottom: -Math.PI / 2 }[from];
      const start = { x: prism.x - Math.cos(inAngle) * 40, y: prism.y - Math.sin(inAngle) * 40 };
      bullets.push(new Line({ x: start.x, y: start.y, angle: inAngle, length: 37, thickness: 2, warn, life, color: '#f4fbff', glow: '#bff0ff' }));
      // The middle beam goes at you if it can: never back the way the light came.
      let aim = Math.atan2(soul.y - prism.y, soul.x - prism.x);
      const turn = Math.atan2(Math.sin(aim - inAngle), Math.cos(aim - inAngle));
      aim = inAngle + clamp(turn, -1.1, 1.1);
      [-0.42, 0, 0.42].forEach((spread, i) => {
        bullets.push(new Line({
          x: prism.x + Math.cos(aim + spread) * 4,
          y: prism.y + Math.sin(aim + spread) * 4,
          angle: aim + spread, length: 120, thickness: 2, warn, life, grow: 260, color: SPLIT[i], glow: SPLIT[i],
        }));
      });
    }, { first: 0.15 });
    return { duration: 7, update: (dt, bullets, soul) => fire(dt, bullets, soul) };
  },

  // Mirror Image. Your reflection appears in the ice across the middle of the
  // box and copies everything you do, the wrong way round, so the middle is
  // where you'd bump into it. Now and then it flicks a splinter at you.
  // Halfway through, the mirror turns: now it's top and bottom that swap.
  glintMirror(box, density, { Shot, every, rand, angleTo }) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    let time = 0;
    let image = null;
    let flipped = false;
    // Where the reflection wants to be.
    const target = (soul) => (flipped ? { x: soul.x, y: 2 * cy - soul.y } : { x: 2 * cx - soul.x, y: soul.y });
    const appear = (bullets, soul) => {
      if (image) image.life = image.age - image.warn;
      const at = target(soul);
      image = new Shot({ x: at.x, y: at.y, warn: 0.7, art: 'glintMirror', angle: 0 });
      bullets.push(image);
    };
    const flick = every(0.85, 1.1, (bullets, soul) => {
      if (!image || image.age < image.warn) return;
      const aim = angleTo(image, soul) + rand(-0.12, 0.12);
      bullets.push(new Shot({ x: image.x, y: image.y, vx: Math.cos(aim) * 62, vy: Math.sin(aim) * 62, warn: 0.2, art: 'glintShard' }));
    }, { first: 1.2 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        time += dt;
        if (!image) appear(bullets, soul);
        if (!flipped && time > 3.5) {
          flipped = true;
          appear(bullets, soul);
        }
        // It follows a little behind you, never faster than you can move.
        const at = target(soul);
        const dx = at.x - image.x;
        const dy = at.y - image.y;
        const gap = Math.hypot(dx, dy);
        const step = Math.min(gap, 70 * dt);
        if (gap > 0) {
          image.x += (dx / gap) * step;
          image.y += (dy / gap) * step;
        }
        flick(dt, bullets, soul);
      },
    };
  },

  // Glitter Burst. Crystals pop up in the box, one after another, each one
  // closer to you than the last, and each bursts into a ring of splinters a
  // moment after it appears. After four it starts again from far away.
  glintBurst(box, density, { Shot, every, rand, clamp, pointAwayFrom }) {
    let crystals = [];
    let step = 0;
    let last = null;
    const pop = every(0.7, 0.85, (bullets, soul) => {
      if (step % 4 === 0) {
        last = pointAwayFrom(box, soul, 46, 10);
      } else {
        // A third of the way from the last one toward you, give or take.
        last = {
          x: clamp(last.x + (soul.x - last.x) * 0.38 + rand(-6, 6), box.x + 6, box.x + box.w - 6),
          y: clamp(last.y + (soul.y - last.y) * 0.38 + rand(-6, 6), box.y + 6, box.y + box.h - 6),
        };
      }
      step++;
      const crystal = new Shot({ x: last.x, y: last.y, warn: 0.55, life: 0.35, art: 'glintPrism', angle: 0 });
      bullets.push(crystal);
      crystals.push(crystal);
    }, { first: 0.15 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        pop(dt, bullets, soul);
        for (const crystal of crystals) {
          if (crystal.age < crystal.warn + crystal.life) continue;
          crystal.done = true;
          if (!bullets.includes(crystal)) continue;
          const tilt = rand(0, Math.PI * 2);
          for (let i = 0; i < 7; i++) {
            const angle = tilt + (i / 7) * Math.PI * 2;
            bullets.push(new Shot({ x: crystal.x, y: crystal.y, vx: Math.cos(angle) * 46, vy: Math.sin(angle) * 46, art: 'glintShard' }));
          }
        }
        crystals = crystals.filter((crystal) => !crystal.done);
      },
    };
  },

  // Skating. The glintling rolls itself up and skates round the box,
  // bouncing off the walls (turning a little toward you at each one), and
  // leaves a trail of glitter on the ice that sparkles for a second before
  // it fades. Don't get boxed in by your own side of the trail.
  glintSkate(box, density, { Shot, rand, angleTo }) {
    let skater = null;
    let heading = null;
    let trail = 0;
    const corners = [
      { x: box.x + 6, y: box.y + 6 }, { x: box.x + box.w - 6, y: box.y + 6 },
      { x: box.x + 6, y: box.y + box.h - 6 }, { x: box.x + box.w - 6, y: box.y + box.h - 6 },
    ];
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        if (!skater) {
          // From the corner farthest from you, aimed past you.
          const corner = corners.sort((a, b) => Math.hypot(b.x - soul.x, b.y - soul.y) - Math.hypot(a.x - soul.x, a.y - soul.y))[0];
          const aim = angleTo(corner, soul) + (Math.random() < 0.5 ? -0.35 : 0.35);
          skater = new Shot({ x: corner.x, y: corner.y, vx: Math.cos(aim) * 72, vy: Math.sin(aim) * 72, bounce: true, warn: 0.7, art: 'glintSkater' });
          bullets.push(skater);
          heading = { x: Math.sign(skater.vx), y: Math.sign(skater.vy) };
        }
        if (skater.age < skater.warn) return;
        trail -= dt;
        if (trail <= 0) {
          trail += 0.07;
          bullets.push(new Shot({ x: skater.x, y: skater.y, life: 0.9, art: 'glintSparkle' }));
        }
        // It hit a wall: turn a little toward you, but never back into the wall.
        const sx = Math.sign(skater.vx);
        const sy = Math.sign(skater.vy);
        if (sx === heading.x && sy === heading.y) return;
        heading = { x: sx, y: sy };
        const speed = Math.hypot(skater.vx, skater.vy);
        const now = Math.atan2(skater.vy, skater.vx);
        const want = angleTo(skater, soul);
        const turn = Math.atan2(Math.sin(want - now), Math.cos(want - now));
        let angle = now + Math.max(-0.4, Math.min(0.4, turn)) + rand(-0.1, 0.1);
        if (Math.sign(Math.cos(angle)) !== sx || Math.sign(Math.sin(angle)) !== sy) angle = now;
        skater.vx = Math.cos(angle) * speed;
        skater.vy = Math.sin(angle) * speed;
      },
    };
  },
};
