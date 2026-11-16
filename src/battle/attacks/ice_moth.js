import { defineBulletArt } from '../projectiles.js';

// The Ice Moth's attacks. It's a moth of frost from the ice caves, and like
// every moth it can't keep away from a light, only here the lights are the
// glowing crystals in the rock. So: little ice moths circling a crystal (and
// now and then one deciding you're brighter), the moth flitting from crystal
// to crystal with frost forming in the air behind it, and a flurry of moths
// in a long line,
// all following the leader.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The moths that circle or follow are placed by
// the attack each frame rather than flying on their own.

const FROST = { k: '#1c2a4a', I: '#f0fcff', i: '#a8e4ff', c: '#5aa8e0', C: '#3a78b8', b: '#2e4a7a', g: '#9ff6ff' };

// A little ice moth: wings up, then wings down. Its hit circle is its body
// and the inner wings, not the wingtips.
defineBulletArt('iceMothling', {
  frames: [
    ['Ii.....iI', 'iIi...iIi', 'ciIi.iIic', '.ciIgIic.', '..ccgcc..', '...igi...', '.........'],
    ['.........', '.........', 'iIi.g.iIi', 'iIIigiIIi', 'ciIcgcIic', '.cc.g.cc.', '.........'],
  ],
  palette: FROST,
  radius: 3,
  frameSeconds: 0.1,
});

// The glowing crystal the moths can't leave alone. It hurts to touch.
defineBulletArt('iceMothCrystal', {
  frames: [
    ['..I..', '.iIc.', '.iIc.', 'giIcg', '.iIc.', '.iIc.', '.ccc.'],
    ['..g..', '.iIc.', 'giIcg', '.iIc.', '.iIc.', '.iIc.', '.ccc.'],
  ],
  palette: FROST,
  hitbox: { w: 3, h: 7 },
  frameSeconds: 0.25,
});

// The ice moth itself, big, fluttering along the top of the box.
defineBulletArt('iceMothBig', {
  frames: [
    ['ii.......ii', 'iIi.....iIi', 'ciIi.g.iIic', '.ciIcgciIc.', '..cicgcic..', '.iIc.g.cIi.', '.cc.....cc.'],
    ['...........', '...........', '.....g.....', 'ciIiIgIiIic', 'iIiccgcciIi', '.cc..g..cc.', '...........'],
  ],
  palette: FROST,
  hitbox: { w: 9, h: 5 },
  frameSeconds: 0.12,
});

// Frost forming in the air where the moth has flown: a little starburst of
// rime, glinting.
defineBulletArt('iceMothFrost', {
  frames: [
    ['i.c.i', '.iIi.', 'cIgIc', '.iIi.', 'i.c.i'],
    ['..c..', '.iIi.', 'cIIIc', '.iIi.', '..c..'],
  ],
  palette: FROST,
  radius: 2,
  frameSeconds: 0.2,
});

export const ICE_MOTH_ATTACKS = {
  // Drawn to the Glow. A crystal lights up somewhere in the box, away from
  // you, and a ring of little ice moths circles it, the ring breathing in and
  // out. Every so often one of them notices you glow too and darts at you,
  // and another flutters in to take its place. Halfway through, the crystal
  // goes dark and another lights elsewhere, and the ring drifts over to it.
  iceMothOrbit(box, density, { Shot, every, rand, angleTo, edgePoint, pointAwayFrom }) {
    const count = 6;
    let crystal = null;
    let centre = null;
    let time = 0;
    let swapAt = 3.3;
    let ring = [];
    const light = (bullets, soul) => {
      const at = pointAwayFrom(box, soul, 30, 18);
      if (crystal) crystal.life = crystal.age - crystal.warn;
      crystal = new Shot({ x: at.x, y: at.y, warn: 0.5, art: 'iceMothCrystal', angle: 0 });
      bullets.push(crystal);
    };
    // A moth joins the ring from somewhere off the edge of the box.
    const join = (bullets, slot) => {
      const from = edgePoint(box);
      const moth = new Shot({ x: from.x, y: from.y, art: 'iceMothling' });
      ring.push({ moth, slot, arrive: 0 });
      bullets.push(moth);
    };
    const dart = every(1.2, 1.5, (bullets, soul) => {
      const ready = ring.filter((member) => member.arrive >= 1);
      if (!ready.length) return;
      // The one nearest you is the one that notices you.
      const member = ready.sort((a, b) => Math.hypot(a.moth.x - soul.x, a.moth.y - soul.y) - Math.hypot(b.moth.x - soul.x, b.moth.y - soul.y))[0];
      ring = ring.filter((other) => other !== member);
      const aim = angleTo(member.moth, soul);
      bullets.push(new Shot({ x: member.moth.x, y: member.moth.y, vx: Math.cos(aim) * 70, vy: Math.sin(aim) * 70, warn: 0.3, art: 'iceMothling' }));
      member.moth.life = member.moth.age;
      member.moth.harmless = true;
      join(bullets, member.slot);
    }, { first: 1.6 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        time += dt;
        if (!crystal) {
          light(bullets, soul);
          centre = { x: crystal.x, y: crystal.y };
          for (let i = 0; i < count; i++) join(bullets, i);
        }
        if (time >= swapAt) {
          swapAt = Infinity;
          light(bullets, soul);
        }
        // The ring follows its crystal, gently.
        const pull = Math.min(1, dt * 2.5);
        centre.x += (crystal.x - centre.x) * pull;
        centre.y += (crystal.y - centre.y) * pull;
        const radius = 23 + Math.sin(time * 1.6) * 10;
        for (const member of ring) {
          const angle = time * 1.5 + (member.slot / count) * Math.PI * 2;
          const x = centre.x + Math.cos(angle) * radius;
          const y = centre.y + Math.sin(angle) * radius;
          // Newcomers fly in to their place over half a second or so.
          member.arrive = Math.min(1, member.arrive + dt * 1.8);
          const t = member.arrive;
          member.moth.x += (x - member.moth.x) * (t < 1 ? Math.min(1, dt * 6) : 1);
          member.moth.y += (y - member.moth.y) * (t < 1 ? Math.min(1, dt * 6) : 1);
        }
        dart(dt, bullets, soul);
      },
    };
  },

  // Frost forms on everything it flies past. The ice moth flits from one
  // glowing crystal to the next (each one lights up just before it goes),
  // and behind it a trail of frost forms in the air: glinting at first,
  // then set hard for a moment, then cracking away. Every other crystal
  // lights up right where you are. Get out of its way, and don't stand in
  // its wake.
  iceMothFrostTrail(box, density, { Shot, rand, clamp, pointAwayFrom }) {
    const SPEED = 62;
    const LIGHT = 0.6;
    const GAP = 7;
    let moth = null;
    let crystal = null;
    let target = null;
    let wait = 0;
    let stops = 0;
    let laid = 0;
    const light = (bullets, soul) => {
      stops++;
      target = stops % 2 === 0
        ? { x: clamp(soul.x, box.x + 5, box.x + box.w - 5), y: clamp(soul.y, box.y + 5, box.y + box.h - 5) }
        : pointAwayFrom(box, moth, 34, 8);
      crystal = new Shot({ ...target, art: 'iceMothCrystal', harmless: true, life: LIGHT + 2 });
      bullets.push(crystal);
      wait = LIGHT;
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        if (!moth) {
          const start = pointAwayFrom(box, soul, 40, 8);
          moth = new Shot({ ...start, warn: 0.5, art: 'iceMothBig' });
          bullets.push(moth);
          light(bullets, soul);
        }
        if (moth.age < moth.warn) return;
        if (wait > 0) {
          wait -= dt;
          return;
        }
        const dx = target.x - moth.x;
        const dy = target.y - moth.y;
        const away = Math.hypot(dx, dy);
        const step = Math.min(away, SPEED * dt);
        if (away > 0) {
          moth.x += (dx / away) * step;
          moth.y += (dy / away) * step;
        }
        // Frost behind it, every few pixels it flies.
        laid += step;
        while (laid >= GAP) {
          laid -= GAP;
          bullets.push(new Shot({ x: moth.x + rand(-1, 1), y: moth.y + rand(-1, 1), art: 'iceMothFrost', warn: 0.45, life: 1.3 }));
        }
        if (away <= step + 0.01) {
          // It's reached the crystal: off to the next.
          crystal.life = 0;
          light(bullets, soul);
        }
      },
    };
  },

  // Flurry. A line of ice moths streams into the box, all following the one
  // in front, and the leader keeps turning toward you. After a while it
  // loses interest and flies off, and the whole line follows it out. Then
  // another line comes in from somewhere else.
  iceMothFlurry(box, density, { Shot, every, rand, edgePoint, shuffleBag }) {
    const length = 9;
    const gap = 0.11;
    const side = shuffleBag(['top', 'left', 'right', 'bottom']);
    let lines = [];
    const start = (bullets, soul) => {
      const from = edgePoint(box, side(), 6);
      const aim = Math.atan2(soul.y - from.y, soul.x - from.x) + rand(-0.6, 0.6);
      const leader = new Shot({
        x: from.x, y: from.y, vx: Math.cos(aim) * 50, vy: Math.sin(aim) * 50, warn: 0.5,
        homing: { target: soul, turn: 1.5 }, art: 'iceMothling',
      });
      bullets.push(leader);
      const followers = [];
      for (let i = 0; i < length - 1; i++) {
        const moth = new Shot({ x: from.x, y: from.y, art: 'iceMothling', harmless: true });
        bullets.push(moth);
        followers.push(moth);
      }
      lines.push({ leader, followers, trail: [], time: 0 });
    };
    const send = every(3.2, 3.4, start, { first: 0.1 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        send(dt, bullets, soul);
        for (const line of lines) {
          const { leader } = line;
          line.time += dt;
          // It loses interest, and heads straight on out.
          if (line.time > 3.4) leader.homing = null;
          if (leader.age < leader.warn) continue;
          line.trail.unshift({ x: leader.x, y: leader.y, t: line.time });
          line.followers.forEach((moth, i) => {
            const wanted = line.time - (i + 1) * gap;
            const spot = line.trail.find((point) => point.t <= wanted);
            if (!spot) return;
            moth.x = spot.x;
            moth.y = spot.y;
            // Only once it's in the box and on the trail can it hurt you.
            moth.harmless = false;
          });
          if (line.trail.length > 200) line.trail.length = 200;
        }
        lines = lines.filter((line) => line.time < 7);
      },
    };
  },
};
