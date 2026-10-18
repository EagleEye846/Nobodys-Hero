import { defineBulletArt } from '../projectiles.js';

// The Stone Golem's attacks. It's a heap of cave stone with ice crystals
// growing out of it, slow and enormously heavy, so it fights with what it's
// made of: a stone fist that punches the whole width of the box, crystals
// that grow out of the floor and roof and shatter, a stamp that heaves the
// floor up in a wave of rocks, and geodes that crack open full of ice.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Things that happen "when a bullet lands" check
// the bullet itself (its age and position), so they stay in step with it, and
// only while it's still in the box (a shield or an arrow may have broken it).

const STONE = { k: '#1a1624', S: '#c8c2d4', s: '#9a94a8', d: '#6e6880', D: '#4e4a5c', c: '#4f9fd8', i: '#9fe0ff', I: '#eafaff' };

// The golem's fist, punching right, and punching left. Its hitbox is the
// whole fist, knuckles to wrist.
const FIST = [
  '..kkkkkkkk..',
  '.kdsSSSSSSk.',
  'kdsskSskSSSk',
  'kdssksskssSk',
  'kddsssssssSk',
  'kdddkssksssk',
  '.kddkkkkkkk.',
  '..kkk.......',
];
const mirror = (rows) => rows.map((row) => [...row].reverse().join(''));
defineBulletArt('golemFist', { frames: [FIST], palette: STONE, hitbox: { w: 10, h: 6 } });
defineBulletArt('golemFistLeft', { frames: [mirror(FIST)], palette: STONE, hitbox: { w: 10, h: 6 } });

// A chip of stone knocked off by a punch or a stamp.
defineBulletArt('golemPebble', {
  frames: [['.S.', 'Ssd', '.d.'], ['.s.', 'dSs', '.s.']],
  palette: STONE,
  radius: 1.5,
  frameSeconds: 0.08,
});

// A lump of rock heaved up out of the floor, with a fleck of ice in it.
defineBulletArt('golemRock', {
  frames: [[
    '.kkkk.',
    'kSSsdk',
    'kSsisk',
    'ksssdk',
    'kddDdk',
    '.kkkk.',
  ]],
  palette: STONE,
  radius: 2.5,
  spin: 5,
});

// A shard of ice, pointing the way it flies.
defineBulletArt('golemShard', {
  frames: [['.c...', 'ciiII', '.c...']],
  palette: STONE,
  radius: 1.5,
  rotate: true,
});

// A spike of crystal grown out of the floor (pointing up) or the roof
// (pointing down). Its hitbox is the whole spike.
const spike = (height) => {
  const rows = ['..I..', '.kIk.'];
  for (let i = 2; i < height - 1; i++) rows.push(i < height / 3 ? '.iIc.' : 'kiIck');
  rows.push('kcick');
  return rows;
};
for (const [name, height] of [['Short', 14], ['Tall', 24]]) {
  const rows = spike(height);
  defineBulletArt(`golemSpike${name}`, { frames: [rows], palette: STONE, hitbox: { w: 3, h: height - 1 } });
  defineBulletArt(`golemSpike${name}Down`, { frames: [[...rows].reverse()], palette: STONE, hitbox: { w: 3, h: height - 1 } });
}

// A geode: a lump of plain grey stone, then the crack opening, showing ice.
defineBulletArt('golemGeode', {
  frames: [
    ['..kkkkk..', '.kSSsssk.', 'kSSsssddk', 'kSsssssdk', 'ksssssddk', 'ksssssddk', 'kdsssdddk', '.kddddDk.', '..kkkkk..'],
    ['..kkkkk..', '.kSSiksk.', 'kSSskissk', 'kSsiIcsdk', 'kssiIIkdk', 'kskcIidk.', 'kdskcdddk', '.kddkdDk.', '..kkkkk..'],
  ],
  palette: STONE,
  radius: 4,
  frameSeconds: 0.45,
});

export const STONE_GOLEM_ATTACKS = {
  // Rock Fist. A stone fist blinks at one side of the box, level with you,
  // then punches straight across. When it hits the far wall it knocks loose
  // a spray of pebbles that bounce back the way it came.
  golemFist(box, density, { Shot, every, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right']);
    let fists = [];
    const punch = every(1.25, 1.55, (bullets, soul) => {
      const fromLeft = side() === 'left';
      const fist = new Shot({
        x: fromLeft ? box.x + 6 : box.x + box.w - 6,
        y: clamp(soul.y + rand(-3, 3), box.y + 5, box.y + box.h - 5),
        vx: fromLeft ? 60 : -60,
        accel: 140,
        warn: 0.7,
        art: fromLeft ? 'golemFist' : 'golemFistLeft',
      });
      bullets.push(fist);
      fists.push(fist);
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        punch(dt, bullets, soul);
        for (const fist of fists) {
          if (fist.age < fist.warn) continue;
          const hitWall = fist.vx > 0 ? fist.x >= box.x + box.w - 6 : fist.x <= box.x + 6;
          if (!hitWall) continue;
          fist.done = true;
          if (!bullets.includes(fist)) continue;
          fist.life = fist.age - fist.warn;
          const back = -Math.sign(fist.vx);
          fist.vx = 0;
          for (let i = 0; i < 4; i++) {
            bullets.push(new Shot({
              x: fist.x,
              y: fist.y + rand(-3, 3),
              vx: back * rand(25, 55),
              vy: -rand(30, 75),
              gravity: 140,
              life: 1.6,
              art: 'golemPebble',
            }));
          }
        }
        fists = fists.filter((fist) => !fist.done);
      },
    };
  },

  // Crystal Growth. Spikes of ice grow out of the floor and the roof of the
  // box, a few at a time (one always right where you are). They blink first,
  // stand a moment, then shatter, and their tips fly off as shards.
  golemCrystals(box, density, { Shot, every, rand, clamp }) {
    let spikes = [];
    let fromFloor = Math.random() < 0.5;
    const grow = every(1.15, 1.4, (bullets, soul) => {
      const xs = [clamp(soul.x + rand(-2, 2), box.x + 3, box.x + box.w - 3)];
      for (let tries = 0; xs.length < 3 && tries < 40; tries++) {
        const x = rand(box.x + 4, box.x + box.w - 4);
        if (xs.every((other) => Math.abs(other - x) > 12)) xs.push(x);
      }
      for (const x of xs) {
        const tall = Math.random() < 0.5;
        const height = tall ? 24 : 14;
        const art = `golemSpike${tall ? 'Tall' : 'Short'}${fromFloor ? '' : 'Down'}`;
        const y = fromFloor ? box.y + box.h - height / 2 : box.y + height / 2;
        const shot = new Shot({ x, y, warn: 0.75, life: 0.7, art, angle: 0 });
        shot.tip = { y: fromFloor ? y - height / 2 : y + height / 2, way: fromFloor ? -1 : 1 };
        bullets.push(shot);
        spikes.push(shot);
      }
      fromFloor = !fromFloor;
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        grow(dt, bullets, soul);
        for (const spike of spikes) {
          if (spike.age < spike.warn + spike.life) continue;
          spike.done = true;
          if (!bullets.includes(spike)) continue;
          for (const angle of [-0.55, 0, 0.55]) {
            const heading = (spike.tip.way > 0 ? Math.PI / 2 : -Math.PI / 2) + angle;
            bullets.push(new Shot({ x: spike.x, y: spike.tip.y, vx: Math.cos(heading) * 48, vy: Math.sin(heading) * 48, art: 'golemShard' }));
          }
        }
        spikes = spikes.filter((spike) => !spike.done);
      },
    };
  },

  // Tremor. The golem stamps, and the floor heaves: a wave runs across the
  // box, throwing rocks up out of the floor as it goes, some barely a hop,
  // some nearly to the roof. Then it stamps again and the wave runs back.
  // Chips of the roof rattle down the whole time.
  golemTremor(box, density, { Shot, every, rand, spreadAcross }) {
    const floor = box.y + box.h - 3;
    const pebbleX = spreadAcross(box.x + 4, box.x + box.w - 4);
    let way = Math.random() < 0.5 ? 1 : -1;
    let front = null;
    let wait = 0.2;
    let lastHeave = null;
    let high = false;
    const crumble = every(0.6, 0.85, (bullets) => {
      bullets.push(new Shot({ x: pebbleX(), y: box.y - 3, vx: rand(-5, 5), vy: rand(30, 40), art: 'golemPebble' }));
    }, { first: 0.6 });
    return {
      duration: 7,
      update: (dt, bullets) => {
        crumble(dt, bullets);
        if (front === null) {
          wait -= dt;
          if (wait > 0) return;
          front = way > 0 ? box.x + 2 : box.x + box.w - 2;
          lastHeave = null;
        }
        front += way * 42 * dt;
        if (lastHeave === null || Math.abs(front - lastHeave) >= 10) {
          lastHeave = front;
          high = !high;
          // High and low by turns: the low ones only hop, the high ones
          // nearly reach the roof, so the top of the box is the place to be,
          // between the chips falling from the roof.
          bullets.push(new Shot({ x: front, y: floor, vy: -(high ? rand(125, 150) : rand(70, 95)), gravity: 200, warn: 0.3, art: 'golemRock' }));
        }
        if (front < box.x || front > box.x + box.w) {
          front = null;
          way = -way;
          wait = 0.9;
        }
      },
    };
  },

  // Geode. A lump of rock thumps into the box away from you, sits there
  // while a crack opens across it, then bursts: two rings of ice shards,
  // the second turned half a step from the first, so the gaps don't line up.
  golemGeode(box, density, { Shot, every, rand, pointAwayFrom }) {
    let geodes = [];
    const land = every(1.5, 1.8, (bullets, soul) => {
      const at = pointAwayFrom(box, soul, 30, 12);
      const geode = new Shot({ x: at.x, y: at.y, warn: 0.5, life: 0.9, art: 'golemGeode', angle: 0 });
      geode.rings = 0;
      bullets.push(geode);
      geodes.push(geode);
    }, { first: 0.2 });
    const burst = (bullets, geode, tilt) => {
      for (let i = 0; i < 9; i++) {
        const angle = tilt + (i / 9) * Math.PI * 2;
        bullets.push(new Shot({ x: geode.x, y: geode.y, vx: Math.cos(angle) * 42, vy: Math.sin(angle) * 42, art: 'golemShard' }));
      }
    };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        land(dt, bullets, soul);
        for (const geode of geodes) {
          const open = geode.age - (geode.warn + geode.life);
          if (open < 0) continue;
          if (geode.rings === 0) {
            geode.tilt = rand(0, Math.PI * 2);
            // Broken before it opened (a shield, an arrow): no shards at all.
            if (!bullets.includes(geode)) {
              geode.rings = 2;
              continue;
            }
            burst(bullets, geode, geode.tilt);
            geode.rings = 1;
          } else if (open > 0.3) {
            burst(bullets, geode, geode.tilt + Math.PI / 9);
            geode.rings = 2;
          }
        }
        geodes = geodes.filter((geode) => geode.rings < 2);
      },
    };
  },
};
