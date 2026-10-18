import { defineBulletArt } from '../projectiles.js';

// The Ice Moth's attacks. It's a moth of frost from the ice caves, and like
// every moth it can't keep away from a light, only here the lights are the
// glowing crystals in the rock. So: little ice moths circling a crystal (and
// now and then one deciding you're brighter), frost scales shed from its
// wings, drifting down like leaves, and a flurry of moths in a long line,
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

// A frost scale off its wing: a little six-sided flake of ice, tumbling.
defineBulletArt('iceMothScale', {
  frames: [['.i.', 'iIc', '.c.'], ['.I.', 'cii', '.c.'], ['.c.', 'cIi', '.i.']],
  palette: FROST,
  radius: 1.5,
  frameSeconds: 0.12,
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

  // Frost Scales. The ice moth flutters back and forth along the top of the
  // box, shedding frost scales that drift down, see-sawing like leaves. Each
  // time it turns round it gives its wings a shake and a whole fan of them
  // falls at once.
  iceMothScales(box, density, { Shot, every, rand }) {
    let moth = null;
    let scales = [];
    const shed = every(0.2, 0.28, (bullets) => {
      const scale = new Shot({ x: moth.x + rand(-4, 4), y: moth.y + 3, vy: rand(24, 32), art: 'iceMothScale' });
      scale.sway = { size: rand(18, 26), rate: rand(2.6, 3.4), phase: rand(0, Math.PI * 2) };
      bullets.push(scale);
      scales.push(scale);
    }, { first: 0.4 });
    let heading = 0;
    return {
      duration: 7,
      update: (dt, bullets) => {
        if (!moth) {
          const fromLeft = Math.random() < 0.5;
          moth = new Shot({ x: fromLeft ? box.x + 8 : box.x + box.w - 8, y: box.y + 6, vx: fromLeft ? 40 : -40, bounce: true, warn: 0.5, art: 'iceMothBig' });
          bullets.push(moth);
          heading = Math.sign(moth.vx);
        }
        if (moth.age >= moth.warn) shed(dt, bullets);
        // It turned round: a shake of the wings.
        if (Math.sign(moth.vx) !== heading) {
          heading = Math.sign(moth.vx);
          for (let i = -2; i <= 2; i++) {
            bullets.push(new Shot({ x: moth.x, y: moth.y + 3, vx: i * 14, vy: 30, accel: 8, art: 'iceMothScale' }));
          }
        }
        // Scales see-saw from side to side as they fall.
        for (const scale of scales) {
          scale.vx = Math.cos(scale.sway.phase + scale.age * scale.sway.rate) * scale.sway.size;
        }
        scales = scales.filter((scale) => scale.y < box.y + box.h + 6 && bullets.includes(scale));
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
