import { defineBulletArt } from '../projectiles.js';

// The Cairn Hound's attacks. It's a dog made of stacked stones that still
// guards the cairns of the old city's dead, though its masters are long
// gone. So it fights like a big, loyal, slightly too-heavy dog: it plays
// fetch with a bone (which comes back), stacks up flat stones into cairns
// all over the box, barks (and the barks are solid), digs (dirt and pebbles
// flying out behind it), and walks its rounds, its stone paws coming down
// right where you're standing.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const BONE = { w: '#e8e0cc', W: '#b8ac94' };
const STONE = { k: '#16141c', s: '#9a94a6', S: '#6e6880', d: '#48425a' };
const BARK = { y: '#f0e0b0', Y: '#c8a860' };
const DIRT = { d: '#6a5038', D: '#4a3828', s: '#9a94a6' };
const PAW = { p: '#a8a2b8', P: '#6e6880' };
const EYES = { y: '#f0c060', k: '#16141c' };

// A bone, spinning end over end.
defineBulletArt('houndBone', {
  frames: [['ww.....ww', 'wWwwwwwWw', 'wWwwwwwWw', 'ww.....ww']],
  palette: BONE,
  radius: 2.6,
  spin: 9,
});

// A round stone, tumbling.
defineBulletArt('houndStone', {
  frames: [['.kkkk.', 'kssSSk', 'ksSSdk', 'kSSddk', '.kkkk.']],
  palette: STONE,
  radius: 2.4,
  spin: 4,
});

// A flat cairn stone, the kind you stack.
defineBulletArt('houndSlab', {
  frames: [['.kkkkkkkk.', 'ksssSSSSdk', 'kSSSSSdddk', '.kkkkkkkk.']],
  palette: STONE,
  hitbox: { w: 10, h: 4 },
});

// A bark: a solid "WOOF" of sound, drawn heading right.
defineBulletArt('houndBark', {
  frames: [
    ['yy...', '.yY..', '..yY.', '..yY.', '..yY.', '.yY..', 'yy...'],
    ['Yy...', '.yy..', '..Yy.', '..yy.', '..Yy.', '.yy..', 'Yy...'],
  ],
  palette: BARK,
  hitbox: { w: 3, h: 6 },
  rotate: true,
  frameSeconds: 0.08,
});

// A clod of dirt (with a pebble in it, sometimes), dug up.
defineBulletArt('houndDirt', {
  frames: [['.dD', 'dDd', 'Dd.'], ['dd.', 'dsD', '.Dd']],
  palette: DIRT,
  radius: 1.4,
  frameSeconds: 0.1,
});

// A big stone paw print, pressed down where it trod.
defineBulletArt('houndPaw', {
  frames: [['.p.p.', 'p...p', '.PpP.', 'pPPPp', '.PPP.']],
  palette: PAW,
  radius: 2.2,
});

// Its eyes, in the dark at the edge of the box (harmless): it's about to
// bark from there.
defineBulletArt('houndEyes', {
  frames: [['kkk.kkk', 'kyk.kyk', 'kkk.kkk'], ['.......', 'kkk.kkk', '.......']],
  palette: EYES,
  radius: 1,
  frameSeconds: 0.15,
});

export const CAIRN_HOUND_ATTACKS = {
  // Fetch: it flings a bone at you, end over end, and the bone slows,
  // stops, and comes back, faster, because it's fetching it. Several at
  // once, from different heights.
  houndFetch(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let bones = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 6.6) {
          next = t + 0.85;
          const from = { x: box.x + box.w + 8, y: clamp(soul.y + rand(-24, 24), box.y + 6, box.y + box.h - 6) };
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          const speed = rand(90, 100);
          const bone = new Shot({ x: from.x, y: from.y, warn: 0.25, vx: Math.cos(aim) * speed, vy: Math.sin(aim) * speed, accel: -80, art: 'houndBone' });
          bone.from = from;
          bones.push(bone);
          bullets.push(bone);
        }
        for (const bone of bones) {
          if (bone.back || bone.age < bone.warn + 0.3 || Math.hypot(bone.vx, bone.vy) > 1) continue;
          // Stopped: back it comes, the way it went, speeding up.
          bone.back = true;
          const home = Math.atan2(bone.from.y - bone.y, bone.from.x - bone.x);
          bone.vx = Math.cos(home) * 20;
          bone.vy = Math.sin(home) * 20;
          bone.accel = 110;
        }
        bones = bones.filter((bone) => !bone.back);
      },
    };
  },

  // Cairns: flat stones come down out of the dark, and stack, one on
  // another, into little cairns all along the floor of the box. They pile
  // up where you are, so keep moving. Then it bumps them with its nose, and
  // the tall ones topple.
  houndStack(box, density, { Shot, rand, shuffleBag }) {
    const LANES = 6;
    const laneWidth = box.w / LANES;
    const heights = Array(LANES).fill(0);
    const stacks = Array.from({ length: LANES }, () => []);
    const randomLane = shuffleBag([...Array(LANES).keys()]);
    let falling = [];
    let t = 0;
    let next = 0.1;
    let count = 0;
    let toppled = false;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.6) {
          next = t + 0.36;
          // Every other stone comes down on your lane.
          const yours = Math.floor((soul.x - box.x) / laneWidth);
          let lane = count++ % 2 === 0 ? yours : randomLane();
          lane = Math.max(0, Math.min(LANES - 1, lane));
          if (heights[lane] + falling.filter((slab) => slab.lane === lane).length < 5) {
            const x = box.x + laneWidth * (lane + 0.5);
            const slab = new Shot({ x, y: box.y + 3, warn: 0.4, vy: 70, art: 'houndSlab' });
            slab.lane = lane;
            falling.push(slab);
            bullets.push(slab);
          }
        }
        for (const slab of falling) {
          const rest = box.y + box.h - 2 - heights[slab.lane] * 4 - 2;
          if (slab.y < rest) continue;
          // Landed on the pile.
          slab.y = rest;
          slab.vy = 0;
          slab.landed = true;
          heights[slab.lane]++;
          stacks[slab.lane].push(slab);
        }
        falling = falling.filter((slab) => !slab.landed);
        // The nudge: every pile two or more high tips over, sideways.
        if (!toppled && t >= 6) {
          toppled = true;
          stacks.forEach((stack, lane) => {
            if (stack.length < 2) return;
            const way = lane < LANES / 2 ? 1 : -1;
            stack.forEach((slab, i) => {
              slab.vx = way * (20 + i * 14);
              slab.vy = -20 - i * 10;
              slab.gravity = 120;
            });
          });
        }
      },
    };
  },

  // Barking: its eyes show at the edge of the dark, then it barks, and the
  // barks come at you in a spray of three (and every third time, a big one:
  // five). Each bark knocks a stone loose up above.
  houndBark(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.1;
    let count = 0;
    let waiting = [];
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 6.4) {
          next = t + 0.8;
          const right = count % 2 === 0;
          const at = {
            x: right ? box.x + box.w + 5 : box.x - 5,
            y: clamp(soul.y + rand(-14, 14), box.y + 8, box.y + box.h - 8),
          };
          bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 0.35, art: 'houndEyes' }));
          waiting.push({ at, when: t + 0.4, big: ++count % 3 === 0 });
        }
        for (const bark of waiting) {
          if (t < bark.when) continue;
          bark.done = true;
          const aim = Math.atan2(soul.y - bark.at.y, soul.x - bark.at.x);
          const n = bark.big ? 5 : 3;
          for (let i = 0; i < n; i++) {
            const angle = aim + (i - (n - 1) / 2) * 0.32;
            bullets.push(new Shot({ x: bark.at.x, y: bark.at.y, vx: Math.cos(angle) * 72, vy: Math.sin(angle) * 72, art: 'houndBark' }));
          }
          bullets.push(new Shot({ x: rand(box.x + 6, box.x + box.w - 6), y: box.y - 3, vy: 10, gravity: 90, art: 'houndStone' }));
        }
        waiting = waiting.filter((bark) => !bark.done);
      },
    };
  },

  // Digging: it's dug in somewhere along the floor of the box, and dirt
  // and pebbles come flying up out of the hole and over, in arcs, back
  // behind it. Every so often it turns up a bone. Then it moves along and
  // starts a new hole, near you.
  houndDig(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let spot = null;
    let nextSpot = 0;
    let nextClod = 0;
    let nextBone = 1.2;
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= nextSpot && t < 6) {
          nextSpot = t + 1.7;
          // A new hole, a little way off from you, throwing dirt back your way.
          const side = soul.x < box.x + box.w / 2 ? 1 : -1;
          const x = clamp(soul.x + side * rand(16, 26), box.x + 6, box.x + box.w - 6);
          spot = { x, way: -side, from: t + 0.45 };
          for (let i = -1; i <= 1; i++) bullets.push(new Shot({ x: x + i * 4, y: box.y + box.h - 3, harmless: true, life: 0.45, art: 'houndDirt' }));
        }
        if (!spot || t < spot.from || t > 6.4) return;
        if (t >= nextClod) {
          nextClod = t + 0.09;
          const art = Math.random() < 0.25 ? 'houndStone' : 'houndDirt';
          bullets.push(new Shot({
            x: spot.x + rand(-2, 2), y: box.y + box.h - 3,
            vx: spot.way * rand(14, 58), vy: -rand(105, 140), gravity: 210, art,
          }));
        }
        if (t >= nextBone) {
          nextBone = t + 1.5;
          bullets.push(new Shot({ x: spot.x, y: box.y + box.h - 3, vx: spot.way * rand(24, 36), vy: -150, gravity: 200, art: 'houndBone' }));
        }
      },
    };
  },

  // Its rounds: it walks its beat across the box and back, nose down,
  // sniffing, and its big stone paws come down one after another along the
  // way, left, right, left, and stay a moment. It goes along your row, and
  // wanders a bit as it sniffs.
  houndPatrol(box, density, { Shot, clamp }) {
    let t = 0;
    let walk = null;
    let walks = 0;
    let nextWalk = 0.1;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!walk && t >= nextWalk && t < 6) {
          const fromLeft = walks++ % 2 === 0;
          walk = {
            x: fromLeft ? box.x + 4 : box.x + box.w - 4,
            way: fromLeft ? 1 : -1,
            y: clamp(soul.y, box.y + 10, box.y + box.h - 10),
            step: 0,
            next: t,
            sniff: Math.random() * Math.PI * 2,
          };
        }
        if (!walk || t < walk.next) return;
        walk.next = t + 0.15;
        const foot = walk.step % 2 === 0 ? -5 : 5;
        const y = walk.y + Math.sin(walk.step * 0.7 + walk.sniff) * 7 + foot;
        bullets.push(new Shot({ x: walk.x, y, warn: 0.35, life: 1.3, art: 'houndPaw' }));
        walk.x += walk.way * 8;
        walk.step++;
        if (walk.x < box.x || walk.x > box.x + box.w) {
          // The end of the beat: a bark back along it.
          bullets.push(new Shot({ x: walk.x, y: walk.y, vx: -walk.way * 70, art: 'houndBark' }));
          walk = null;
          nextWalk = t + 0.35;
        }
      },
    };
  },
};
