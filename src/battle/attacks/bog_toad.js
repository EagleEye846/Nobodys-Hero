import { defineBulletArt } from '../projectiles.js';

// The Bog Toad's attacks. It's a big, slow, grumpy, sleepy toad that would
// like everyone to go away so it can get back to sleep, so it fights like a
// toad that can't be bothered to get up: its long sticky tongue lashing out
// across the box, hopping from lily pad to lily pad (always to the pad
// nearest you), a great GULP that swallows
// the whole box and carries it off (you, and the frogspawn in its mouth,
// slosh about inside) before it spits it back out, frogspawn that hatches
// into tadpoles, and a belly flop that lands right on you, after which it
// falls asleep for a bit and snores.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const TONGUE = { k: '#3a1420', p: '#e87a8a', P: '#b84a5e', w: '#ffd0d8' };
const FLY = { k: '#14141a', w: '#c8d8e8', r: '#a83a3a' };
const SPAWN = { c: '#b8d0c0', C: '#7a9a8a', e: '#14141a', w: '#ffffff' };
const TADPOLE = { k: '#14141a', o: '#3a4226', O: '#5a6a32' };
const MUD = { m: '#5a4a32', M: '#3a3020', l: '#7a6a48' };
const TOAD = { k: '#141a10', o: '#5a6a32', O: '#3c4822', b: '#c8c08a', B: '#9a9466' };
const SNORE = { z: '#c8d0e8', Z: '#8a92b0' };
const SHADOW = { s: '#0a0a0e' };

// The sticky end of its tongue.
defineBulletArt('toadTongueTip', {
  frames: [['.kkk.', 'kpppk', 'kpwPk', 'kpPPk', '.kkk.']],
  palette: TONGUE,
  radius: 2.6,
});

// A fly, buzzing (its wings flicker).
defineBulletArt('toadFly', {
  frames: [['w.w', '.k.', 'krk'], ['.w.', 'wkw', 'krk']],
  palette: FLY,
  radius: 1.4,
  frameSeconds: 0.05,
});

// A clump of frogspawn: clear jelly with a little black dot in each egg.
defineBulletArt('toadSpawn', {
  frames: [[
    '.cCc.c.',
    'cecCcec',
    'CcCcecC',
    'cecCcCc',
    'CcCecCc',
    '.cCcec.',
    '..cCc..',
  ]],
  palette: SPAWN,
  radius: 3.2,
});

// A tadpole, wiggling, drawn heading right.
defineBulletArt('toadTadpole', {
  frames: [
    ['......kk.', '.o..kOOOk', 'o.oookOok', '......kk.'],
    ['o.....kk.', '.ooookOOk', '....okOok', '......kk.'],
  ],
  palette: TADPOLE,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.1,
});

// A splat of bog mud.
defineBulletArt('toadMud', {
  frames: [['.l.', 'mmM', '.M.']],
  palette: MUD,
  radius: 1.5,
});

// Its belly, coming down on you from above (seen from underneath).
defineBulletArt('toadBelly', {
  frames: [[
    '...kkkkkkkkk...',
    '.kkoooooooookk.',
    'kooobbbbbbbbook',
    'kobbbbbbbbbbbok',
    'kobbbbBBBbbbbok',
    'kobbbbbbbbbbbok',
    'kooobbbbbbbbook',
    '.kkOOOOOOOOOkk.',
    '...kkkkkkkkk...',
  ]],
  palette: TOAD,
  radius: 6.5,
});

// A lily pad on the pool (harmless).
defineBulletArt('toadPad', {
  frames: [['..gggg..', '.gGggGg.', 'gGgg.gGg', 'ggGg..gg', '.gGggGg.', '..gggg..']],
  palette: { g: '#4a7a3a', G: '#2e5226' },
  radius: 1,
});

// Its shadow on the box, growing as it comes down (harmless).
defineBulletArt('toadShadow', {
  frames: [[
    '....sssssss....',
    '..sssssssssss..',
    '.sssssssssssss.',
    'sssssssssssssss',
    '.sssssssssssss.',
    '..sssssssssss..',
    '....sssssss....',
  ]],
  palette: SHADOW,
  radius: 1,
});

// A Z, from the snoring.
defineBulletArt('toadZ', {
  frames: [['zzzz', '..Zz', '.zZ.', 'zZ..', 'zzzz']],
  palette: SNORE,
  radius: 2,
});

// Its tongue: a thick pink line out from the toad's side of the box, which
// shoots out, sticks a moment, and reels back in, with the sticky tip on the
// end. Moved by hand each frame (see lash).
function makeTongue(Line, Shot, from, angle, length, warn) {
  const line = new Line({ x: from.x, y: from.y, angle, length, thickness: 4, warn, life: 0.6, color: '#e87a8a' });
  const tip = new Shot({ x: from.x, y: from.y, warn, life: 0.6, angle, art: 'toadTongueTip' });
  return { line, tip, from, angle, length, warn, reach: length };
}

// Out fast, a moment stuck, back a little slower; the tip rides the end.
function moveTongue(tongue) {
  const { line, tip, from, angle, reach } = tongue;
  const k = line.age - line.warn;
  if (k < 0) return;
  let out;
  if (k < 0.18) out = (k / 0.18) ** 0.7;
  else if (k < 0.3) out = 1;
  else out = Math.max(0, 1 - (k - 0.3) / 0.3);
  line.length = Math.max(1, reach * out);
  tip.x = from.x + Math.cos(angle) * line.length;
  tip.y = from.y + Math.sin(angle) * line.length;
}

export const BOG_TOAD_ATTACKS = {
  // Lash: its tongue shoots out across the box from its side, at the row
  // you're on (then from the top corner, then low), sticks, and reels back
  // in. Any fly it was after and missed buzzes off, cross.
  toadLash(box, density, { Shot, Line, rand, clamp }) {
    let tongues = [];
    let t = 0;
    let next = 0.15;
    let count = 0;
    const lash = (bullets, soul) => {
      const kind = count++ % 3;
      let from;
      if (kind === 1) from = { x: box.x + box.w + 6, y: box.y - 6 };
      else from = { x: box.x + box.w + 6, y: clamp(soul.y + (kind === 2 ? rand(-10, 10) : 0), box.y + 6, box.y + box.h - 6) };
      const angle = Math.atan2(soul.y - from.y, soul.x - from.x);
      const length = Math.min(130, Math.hypot(box.x - from.x, (box.y + box.h / 2) - from.y) + 20);
      const tongue = makeTongue(Line, Shot, from, angle, length, 0.55);
      bullets.push(tongue.line, tongue.tip);
      tongues.push(tongue);
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.6) {
          lash(bullets, soul);
          next = t + 0.95;
        }
        for (const tongue of tongues) {
          moveTongue(tongue);
          // Reeling in: the flies it missed scatter off the tip.
          if (!tongue.missed && tongue.line.age - tongue.line.warn > 0.3) {
            tongue.missed = true;
            for (let i = 0; i < 2; i++) {
              const a = tongue.angle + Math.PI + rand(-1.2, 1.2);
              bullets.push(new Shot({ x: tongue.tip.x, y: tongue.tip.y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, accel: -20, life: 1.6, art: 'toadFly' }));
            }
          }
        }
        tongues = tongues.filter((tongue) => tongue.line.age < tongue.warn + 1);
      },
    };
  },

  // Lily pads: five lily pads float in the pool, and the toad hops from pad
  // to pad, SPLOSH, sending a ring of pondwater out each time it lands. It
  // always hops to the pad nearest you (its shadow shows which), so you
  // choose where it comes down: keep a pad between you and it, and be
  // somewhere else when it lands.
  toadHop(box, density, { Shot, rand }) {
    const pads = [
      { x: box.x + 18, y: box.y + 18 }, { x: box.x + box.w - 18, y: box.y + 18 },
      { x: box.x + box.w / 2, y: box.y + box.h / 2 },
      { x: box.x + 18, y: box.y + box.h - 18 }, { x: box.x + box.w - 18, y: box.y + box.h - 18 },
    ];
    let t = 0;
    let next = 0.4;
    let on = -1;
    let hop = null;
    let laid = false;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!laid) {
          laid = true;
          for (const pad of pads) bullets.push(new Shot({ x: pad.x, y: pad.y, harmless: true, life: 30, art: 'toadPad' }));
        }
        if (!hop && t >= next && t < 9.8) {
          // The pad nearest you (not the one it's on).
          let best = -1;
          pads.forEach((pad, i) => {
            if (i === on) return;
            if (best < 0 || Math.hypot(pad.x - soul.x, pad.y - soul.y) < Math.hypot(pads[best].x - soul.x, pads[best].y - soul.y)) best = i;
          });
          hop = { to: best, at: t };
          bullets.push(new Shot({ x: pads[best].x, y: pads[best].y, harmless: true, life: 0.9, art: 'toadShadow' }));
        }
        if (hop && t - hop.at >= 0.9) {
          // SPLOSH.
          const pad = pads[hop.to];
          on = hop.to;
          bullets.push(new Shot({ x: pad.x, y: pad.y, life: 0.6, art: 'toadBelly' }));
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < 8; i++) {
            const a = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: pad.x, y: pad.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, accel: -20, life: 1.6, art: 'toadMud' }));
          }
          hop = null;
          next = t + 0.7;
        }
      },
    };
  },

  // GULP: its tongue sticks to the box and hauls it in, and the toad
  // swallows the lot. The box is dragged off toward it, with you inside,
  // and rocks about while it gulps, and the frogspawn it had in its mouth
  // sloshes around in there with you. Then it spits the box back out where
  // it was (PTOO), and everything in it goes flying.
  toadGulp(box, density, { Shot, Line, rand }) {
    // Where the box belongs. It always goes back here, and the battle puts
    // it back at the end of the turn too, just in case.
    const home = { x: box.x, y: box.y };
    const haulAt = 0.7;
    const swallowAt = 1.7;
    const spitAt = 7.6;
    const backAt = 8.2;
    const pull = { x: 22, y: -8 };
    let t = 0;
    let owner = false;
    let line = null;
    let tip = null;
    let blobs = [];
    let spat = false;
    let lastX = home.x;
    let lastY = home.y;
    // How far off home the box is, `time` seconds in.
    const offset = (time) => {
      if (time < haulAt) return { x: 0, y: 0 };
      if (time < swallowAt) {
        const k = (time - haulAt) / (swallowAt - haulAt);
        const e = k * k * (3 - 2 * k);
        return { x: pull.x * e, y: pull.y * e };
      }
      if (time < spitAt) {
        const w = time - swallowAt;
        return { x: pull.x + Math.sin(w * 5) * 5, y: pull.y + Math.sin(w * 3.3) * 4 };
      }
      if (time < backAt) {
        // Out it shoots, a bit past home, and settles.
        const k = (time - spitAt) / (backAt - spitAt);
        const back = 1 - (1 - k) ** 3;
        const over = Math.sin(k * Math.PI) * 6;
        return { x: pull.x * (1 - back) - over, y: pull.y * (1 - back) };
      }
      return { x: 0, y: 0 };
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        // Only one toad at a time gets to swallow the box.
        if (!owner && !box.heldBy) {
          owner = true;
          box.heldBy = 'toadGulp';
        }
        if (!line) {
          // The tongue, from off to the right, stuck to the box's wall.
          line = new Line({ x: box.x + box.w + 60, y: box.y + box.h / 2, angle: Math.PI, length: 58, thickness: 4, warn: 0.5, life: spitAt - 0.5, color: '#e87a8a' });
          tip = new Shot({ x: box.x + box.w + 3, y: box.y + box.h / 2, warn: 0.5, life: spitAt - 0.5, harmless: true, art: 'toadTongueTip' });
          bullets.push(line, tip);
        }
        if (owner) {
          const off = offset(t);
          box.x = home.x + off.x;
          box.y = home.y + off.y;
        }
        // The tongue stays stuck to the wall outside the box, reeling in as
        // the box comes, so it never reaches you inside.
        line.length = Math.max(4, 58 - (box.x - home.x));
        line.x = box.x + box.w + 2 + line.length;
        line.y = box.y + box.h / 2;
        tip.x = box.x + box.w + 3;
        tip.y = line.y;
        // Everything inside rides along with the box: you, and the frogspawn.
        const dx = box.x - lastX;
        const dy = box.y - lastY;
        lastX = box.x;
        lastY = box.y;
        soul.x += dx;
        soul.y += dy;
        for (const blob of blobs) {
          if (spat) break;
          blob.x += dx;
          blob.y += dy;
        }
        // Swallowed: the frogspawn tumbles in, bouncing off the walls.
        if (t >= swallowAt && !blobs.length) {
          for (let i = 0; i < 7; i++) {
            const a = rand(0, Math.PI * 2);
            const speed = rand(30, 46);
            const blob = new Shot({ x: rand(box.x + 10, box.x + box.w - 10), y: box.y + 8, vx: Math.cos(a) * speed, vy: Math.abs(Math.sin(a)) * speed, bounce: true, warn: 0.45, life: spitAt - swallowAt, art: 'toadSpawn' });
            bullets.push(blob);
            blobs.push(blob);
          }
        }
        // And sloshes about as the toad gulps.
        if (t >= swallowAt && t < spitAt) {
          const tilt = Math.cos((t - swallowAt) * 5) * 60;
          for (const blob of blobs) blob.vx += tilt * dt;
          if (Math.random() < dt * 1.6) {
            bullets.push(new Shot({ x: rand(box.x + 6, box.x + box.w - 6), y: box.y + 3, vy: 30, gravity: 40, warn: 0.3, life: 2, art: 'toadFly' }));
          }
        }
        // PTOO: spat out, and the frogspawn goes flying out with the box.
        if (t >= spitAt && !spat) {
          spat = true;
          for (const blob of blobs) {
            blob.bounce = false;
            blob.life = Infinity;
            blob.vx = -rand(70, 100);
            blob.vy = rand(-30, 30);
          }
          for (let i = 0; i < 8; i++) {
            bullets.push(new Shot({ x: box.x + box.w - 4, y: box.y + 10 + i * 9, vx: -rand(60, 90), vy: rand(-20, 20), gravity: 50, life: 2.5, art: 'toadMud' }));
          }
        }
        if (owner && t >= backAt) {
          box.x = home.x;
          box.y = home.y;
        }
      },
    };
  },

  // Frogspawn: clumps of it plop into the box and sit there wobbling for a
  // moment. Then they hatch, and the tadpoles wiggle off every which way.
  toadSpawnHatch(box, density, { Shot, rand, spreadAcross }) {
    const nextX = spreadAcross(box.x + 10, box.x + box.w - 10, 5);
    let clumps = [];
    let t = 0;
    let next = 0.1;
    const plop = (bullets) => {
      const clump = new Shot({ x: nextX(), y: box.y - 4, vy: 90, accel: -120, warn: 0.35, art: 'toadSpawn' });
      clump.hatchAt = rand(1.3, 1.7);
      bullets.push(clump);
      clumps.push(clump);
    };
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 8.4) {
          plop(bullets);
          next = t + 0.62;
        }
        for (const clump of clumps) {
          if (clump.age - clump.warn < clump.hatchAt) continue;
          // Hatched: the clump's gone, and out come the tadpoles.
          clump.spent = true;
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < 5; i++) {
            const a = turn + (i / 5) * Math.PI * 2;
            bullets.push(new Shot({ x: clump.x, y: clump.y, vx: Math.cos(a) * 38, vy: Math.sin(a) * 38, wobble: { amplitude: 2.5, frequency: 12 }, life: 2.6, art: 'toadTadpole' }));
          }
        }
        clumps = clumps.filter((clump) => !clump.spent);
      },
    };
  },

  // Belly flop: it jumps right up out of sight. Its shadow comes over the
  // box, following you, getting bigger... and down it comes, THUD, with mud
  // flying out all round. Three times, and then it's worn itself out and
  // dozes off where it lands, snoring Zs up the box.
  toadFlop(box, density, { Shot, rand, clamp }) {
    let flops = [];
    let count = 0;
    let t = 0;
    let next = 0.15;
    let snoreFrom = null;
    let nextZ = 0;
    const jump = (bullets, soul) => {
      const shadow = new Shot({ x: soul.x, y: soul.y, harmless: true, life: 1.05, art: 'toadShadow' });
      bullets.push(shadow);
      flops.push({ shadow, landed: false });
      count++;
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 3) {
          jump(bullets, soul);
          next = t + 1.55;
        }
        for (const flop of flops) {
          const s = flop.shadow;
          if (!flop.landed && s.age < 0.75) {
            // It follows you, slowly, until just before it lands.
            s.x += (soul.x - s.x) * Math.min(1, dt * 2.2);
            s.y += (soul.y - s.y) * Math.min(1, dt * 2.2);
          }
          if (!flop.landed && s.age >= 1.0) {
            flop.landed = true;
            const x = clamp(s.x, box.x + 8, box.x + box.w - 8);
            const y = clamp(s.y, box.y + 6, box.y + box.h - 6);
            bullets.push(new Shot({ x, y, life: 0.4, art: 'toadBelly' }));
            for (let i = 0; i < 10; i++) {
              const a = (i / 10) * Math.PI * 2 + rand(-0.15, 0.15);
              bullets.push(new Shot({ x, y, vx: Math.cos(a) * 52, vy: Math.sin(a) * 52, accel: -24, life: 1.8, art: 'toadMud' }));
            }
            snoreFrom = { x, y };
          }
        }
        // Asleep where it landed: Zs drift up out of it, slowly.
        if (count >= 3 && snoreFrom && flops[2].landed && t >= nextZ) {
          nextZ = t + 0.38;
          bullets.push(new Shot({ x: snoreFrom.x + rand(-6, 6), y: snoreFrom.y - 4, vx: rand(-14, 14), vy: -rand(22, 30), wobble: { amplitude: 3, frequency: 3 }, art: 'toadZ' }));
        }
      },
    };
  },
};
