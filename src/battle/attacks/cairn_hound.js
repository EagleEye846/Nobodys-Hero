import { defineBulletArt } from '../projectiles.js';

// The Cairn Hound's attacks. It's a dog made of stacked stones that still
// guards the cairns of the old city's dead, though its masters are long
// gone. So it fights like a big, loyal, slightly too-heavy dog made of
// rocks: it plays fetch with a bone (which comes back), stacks flat stones
// into cairns all over the box, shakes itself to bits and pulls itself back
// together somewhere else, and wags its tail until it remembers it's on
// duty, when it barks at anything that moves.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const BONE = { w: '#e8e0cc', W: '#b8ac94' };
const STONE = { k: '#16141c', s: '#9a94a6', S: '#6e6880', d: '#48425a' };
const BARK = { y: '#f0e0b0', Y: '#c8a860' };
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

// Its eyes, in the dark at the edge of the box (harmless): it's about to
// bark from there.
defineBulletArt('houndEyes', {
  frames: [['kkk.kkk', 'kyk.kyk', 'kkk.kkk'], ['.......', 'kkk.kkk', '.......']],
  palette: EYES,
  radius: 1,
  frameSeconds: 0.15,
});

// Its tail, over the top of the box (harmless): a wagging stack of pebbles,
// and the same tail stopped dead.
const TAIL = [
  ['...k..', '..ksk.', '.ksSk.', 'ksSdk.', 'kSdk..'],
  ['..k...', '.ksk..', '.kSsk.', '.kdSsk', '..kdSk'],
];
defineBulletArt('houndTail', { frames: TAIL, palette: STONE, radius: 1, frameSeconds: 0.12 });
defineBulletArt('houndTailStill', { frames: [['..kk..', '.kssk.', '.kSSk.', '.kSdk.', '.kddk.']], palette: STONE, radius: 1 });
// Its eyes wide open, on duty (harmless).
defineBulletArt('houndEyesOpen', {
  frames: [['kkk.kkk', 'kyk.kyk', 'kyk.kyk', 'kkk.kkk']],
  palette: EYES,
  radius: 1,
});

// Changes a thing's look (to the art of a bullet made with the new one).
const LOOKS = {};
const setLook = (shot, name, Shot) => {
  if (shot.artName === name) return;
  LOOKS[name] ??= new Shot({ x: 0, y: 0, art: name }).art;
  shot.artName = name;
  shot.art = LOOKS[name];
};

export const CAIRN_HOUND_ATTACKS = {
  // Fetch: it flings a bone at you, end over end, and the bone slows,
  // stops, and comes back, faster, because it's fetching it. Several at
  // once, from different heights.
  houndFetch(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let bones = [];
    let thrown = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.6) {
          next = t + 0.7;
          // From the right, then the left: it's playing with you.
          const side = thrown++ % 2 ? box.x - 8 : box.x + box.w + 8;
          const from = { x: side, y: clamp(soul.y + rand(-24, 24), box.y + 6, box.y + box.h - 6) };
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          // Two at a time: one at you, one a little to the side.
          const aside = (Math.random() < 0.5 ? -1 : 1) * 0.35;
          for (const angle of [aim, aim + aside]) {
            const speed = rand(100, 110);
            const bone = new Shot({ x: from.x, y: from.y, warn: 0.25, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, accel: -80, art: 'houndBone' });
            bone.from = from;
            bones.push(bone);
            bullets.push(bone);
          }
        }
        for (const bone of bones) {
          if (bone.back || bone.age < bone.warn + 0.3 || Math.hypot(bone.vx, bone.vy) > 1) continue;
          // Stopped: back it comes, the way it went, speeding up.
          bone.back = true;
          const home = Math.atan2(bone.from.y - bone.y, bone.from.x - bone.x);
          bone.vx = Math.cos(home) * 20;
          bone.vy = Math.sin(home) * 20;
          bone.accel = 150;
        }
        bones = bones.filter((bone) => !bone.back);
      },
    };
  },

  // Cairns: flat stones come down out of the dark, and stack, one on
  // another, into little cairns all along the floor of the box. They pile
  // up where you are, so keep moving. Any cairn that gets four high, it
  // noses over toward you, and at the end it bumps the lot.
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
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 7.4) {
          next = t + 0.25;
          // Every other stone comes down on your lane.
          const yours = Math.floor((soul.x - box.x) / laneWidth);
          let lane = count++ % 2 === 0 ? yours : randomLane();
          lane = Math.max(0, Math.min(LANES - 1, lane));
          if (heights[lane] + falling.filter((slab) => slab.lane === lane).length < 5) {
            const x = box.x + laneWidth * (lane + 0.5);
            const slab = new Shot({ x, y: box.y + 3, warn: 0.4, vy: 85, art: 'houndSlab' });
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
          // Four high is too high: it noses that one over, toward you.
          if (heights[slab.lane] >= 4) {
            const way = soul.x >= slab.x ? 1 : -1;
            stacks[slab.lane].forEach((stone, i) => {
              stone.vx = way * (30 + i * 16);
              stone.vy = -30 - i * 12;
              stone.gravity = 120;
            });
            stacks[slab.lane] = [];
            heights[slab.lane] = 0;
          }
        }
        falling = falling.filter((slab) => !slab.landed);
        // The nudge: every pile two or more high tips over, sideways.
        if (!toppled && t >= 7.9) {
          toppled = true;
          stacks.forEach((stack, lane) => {
            if (stack.length < 2) return;
            const way = lane < LANES / 2 ? 1 : -1;
            stack.forEach((slab, i) => {
              slab.vx = way * (30 + i * 16);
              slab.vy = -20 - i * 10;
              slab.gravity = 120;
            });
          });
        }
      },
    };
  },

  // Pull yourself together: it shakes itself to bits, and its stones fly out
  // all round, slow down and hang there. Then its eyes open somewhere else
  // in the box, and every stone comes home to them at once, to stack back
  // up into a dog. Then it does it again from there. Watch the eyes, and
  // keep off the lines between the stones and them.
  houndCollapse(box, density, { Shot, rand, clamp, pointAwayFrom }) {
    let t = 0;
    let round = -1;
    let at = null;
    let home = null;
    let stones = [];
    const ROUND = 2.4;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        const now = Math.floor(t / ROUND);
        const into = t - now * ROUND;
        if (now !== round && t < 9.6) {
          round = now;
          at = home ?? pointAwayFrom(box, soul, 30, 14);
          home = null;
          // To bits: out they go.
          stones = [];
          const count = 16;
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < count; i++) {
            const angle = turn + (i / count) * Math.PI * 2 + rand(-0.12, 0.12);
            const speed = rand(90, 104);
            const stone = new Shot({ x: at.x, y: at.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, accel: -115, warn: 0.3, bounce: true, art: 'houndStone' });
            stones.push(stone);
            bullets.push(stone);
          }
        }
        if (!stones.length) return;
        if (!home && into > 0.9) {
          // Its eyes open where it will stand up: just past you, seen from
          // where it fell apart, so the stones come home past you.
          const away = Math.atan2(soul.y - at.y, soul.x - at.x) + rand(-0.4, 0.4);
          home = { x: clamp(soul.x + Math.cos(away) * 22, box.x + 10, box.x + box.w - 10), y: clamp(soul.y + Math.sin(away) * 22, box.y + 10, box.y + box.h - 10) };
          bullets.push(new Shot({ x: home.x, y: home.y, harmless: true, life: 1.4, art: 'houndEyes' }));
        }
        if (home && into > 1.55 && !stones.called) {
          stones.called = true;
          for (const stone of stones) {
            const angle = Math.atan2(home.y - stone.y, home.x - stone.x);
            stone.accel = 0;
            stone.bounce = false;
            stone.vx = Math.cos(angle) * 115;
            stone.vy = Math.sin(angle) * 115;
            stone.life = stone.age - stone.warn + Math.hypot(home.x - stone.x, home.y - stone.y) / 115;
          }
        }
      },
    };
  },

  // On duty: while its tail wags (clack, clack, clack) pebbles patter down
  // off it, and you'll have to move. Then the tail stops. Its eyes open over
  // the box: it's on duty. Anything that moves now, it barks at, and the
  // barks are solid. Stand still while it's watching and it doesn't see you.
  houndWag(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let tail = null;
    let eyes = null;
    let pebble = 0.1;
    let drops = 0;
    let bark = 0;
    let last = null;
    const CYCLE = 3.2;
    const WAG = 1.8;
    const GRACE = 0.45;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!tail) {
          tail = new Shot({ x: box.x + box.w / 2, y: box.y + 5, harmless: true, art: 'houndTail' });
          bullets.push(tail);
        }
        const into = t % CYCLE;
        const wagging = into < WAG;
        setLook(tail, wagging ? 'houndTail' : 'houndTailStill', Shot);
        if (wagging) {
          if (eyes) { eyes.life = 0; eyes = null; }
          pebble -= dt;
          // (None in the last moment of the wag, so you can settle.)
          if (pebble <= 0 && into < WAG - 0.25) {
            pebble = rand(0.13, 0.16);
            const x = drops++ % 2 === 0 ? clamp(soul.x, box.x + 4, box.x + box.w - 4) : rand(box.x + 4, box.x + box.w - 4);
            bullets.push(new Shot({ x, y: box.y + 2, vy: 45, gravity: 60, warn: 0.25, art: 'houndStone' }));
          }
        } else {
          if (!eyes && t < 9.5) {
            eyes = new Shot({ x: box.x + box.w / 2, y: box.y + 12, harmless: true, art: 'houndEyesOpen' });
            bullets.push(eyes);
          }
          bark -= dt;
          const moved = last ? Math.hypot(soul.x - last.x, soul.y - last.y) : 0;
          if (eyes && into > WAG + GRACE && moved > 0.4 && bark <= 0) {
            // WOOF.
            bark = 0.32;
            const aim = Math.atan2(soul.y - eyes.y, soul.x - eyes.x);
            for (let i = -2; i <= 2; i++) {
              const angle = aim + i * 0.26;
              bullets.push(new Shot({ x: eyes.x, y: eyes.y, vx: Math.cos(angle) * 96, vy: Math.sin(angle) * 96, art: 'houndBark' }));
            }
          }
        }
        last = { x: soul.x, y: soul.y };
      },
    };
  },
};
