import { defineBulletArt } from '../projectiles.js';

// The Stone Golem's attacks. It's a heap of cave stone with ice crystals
// growing out of it, slow and enormously heavy, so it fights with what it's
// made of: a fist that comes down wherever it's finished thinking about
// (it takes a while: count the dots), crystals
// that grow out of the floor and roof and shatter, a stamp that heaves the
// floor up in a wave of rocks, and geodes that crack open full of ice.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Things that happen "when a bullet lands" check
// the bullet itself (its age and position), so they stay in step with it, and
// only while it's still in the box (a shield or an arrow may have broken it).

const STONE = { k: '#1a1624', S: '#c8c2d4', s: '#9a94a8', d: '#6e6880', D: '#4e4a5c', c: '#4f9fd8', i: '#9fe0ff', I: '#eafaff' };

// A chip of stone knocked off by a slam or a stamp.
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

// The golem's thought bubble over the spot it's thinking about, filling up
// one dot at a time (harmless).
const thought = (dots) => [
  '.sssssssss.',
  'sIIIIIIIIIs',
  `sI${[1, 2, 3].map((n) => (dots >= n ? 'D' : 'I')).join('I')}IIIs`,
  'sIIIIIIIIIs',
  '.sssssssss.',
  '..ss.......',
  '.s.........',
];
for (const dots of [1, 2, 3]) {
  defineBulletArt(`golemThink${dots}`, { frames: [thought(dots)], palette: STONE, radius: 1 });
}

// Its fist coming down on the spot, knuckles first, seen from above.
defineBulletArt('golemSlam', {
  frames: [[
    '.kkkkkkkkk.',
    'kSSkSSkSSdk',
    'kSskSskSsdk',
    'kssksskssdk',
    'kdddddddddk',
    'kdsssssssDk',
    'kdssssssdDk',
    '.kdddddDDk.',
    '..kkkkkkk..',
  ]],
  palette: STONE,
  hitbox: { w: 11, h: 9 },
});

export const STONE_GOLEM_ATTACKS = {
  // "...STILL THINKING." The golem is slow, but it gets there. It picks a
  // spot (where you are, or, every other time, where you're heading) and a
  // thought bubble pops up over it, and fills, one dot at a time: one... two...
  // three. On the third dot its fist blinks over the spot and comes down,
  // knocking a pebble
  // each way along the ground. It starts thinking about the next spot before
  // the last one lands, so count the dots: the bubble with three goes first.
  // Every third is a big think: when it's done, its whole flat hand comes
  // down right across the box, through you and along the way you're going
  // (it blinks first). Step off sideways.
  golemThinking(box, density, { Shot, clamp, rand }) {
    const DOT = 0.5;
    let marks = [];
    let count = 0;
    let timer = 0.1;
    let last = null;
    let vx = 0;
    let vy = 0;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        if (last && dt > 0) {
          vx += ((soul.x - last.x) / dt - vx) * Math.min(1, dt * 6);
          vy += ((soul.y - last.y) / dt - vy) * Math.min(1, dt * 6);
        }
        last = { x: soul.x, y: soul.y };
        timer -= dt;
        if (timer <= 0 && marks.length < 3) {
          timer += 0.8;
          count++;
          const lead = count % 2 === 0 ? DOT * 3 : 0;
          marks.push({
            x: clamp(soul.x + vx * lead + rand(-2, 2), box.x + 6, box.x + box.w - 6),
            y: clamp(soul.y + vy * lead + rand(-2, 2), box.y + 6, box.y + box.h - 6),
            t: 0,
            dots: 0,
            wide: count % 3 === 0,
          });
        }
        for (const mark of marks) {
          mark.t += dt;
          const dots = Math.min(Math.floor(mark.t / DOT) + 1, 4);
          if (dots === mark.dots) continue;
          mark.dots = dots;
          if (dots <= 3) {
            bullets.push(new Shot({ x: mark.x, y: mark.y, art: `golemThink${dots}`, harmless: true, life: DOT }));
            // With the third dot, its fist's shadow, blinking, then the fist.
            // (A big think, every third: its whole flat hand, right across the box.)
            if (dots === 3 && mark.wide) {
              // (Laid along the way you're going.)
              const row = clamp(soul.y, box.y + 5, box.y + box.h - 5);
              const column = clamp(soul.x, box.x + 5, box.x + box.w - 5);
              const across = Math.abs(vx) >= Math.abs(vy);
              for (let along = 6; along < 80; along += 11.5) {
                bullets.push(new Shot({ x: across ? box.x + along : column, y: across ? row : box.y + along, art: 'golemSlam', warn: DOT, life: 0.3 }));
              }
            } else if (dots === 3) {
              bullets.push(new Shot({ x: mark.x, y: mark.y, art: 'golemSlam', warn: DOT, life: 0.3 }));
            }
            continue;
          }
          mark.done = true;
          if (mark.wide) continue;
          for (const side of [-1, 1]) {
            bullets.push(new Shot({ x: mark.x + side * 5, y: mark.y, vx: side * 36, vy: -24, gravity: 120, life: 0.6, art: 'golemPebble' }));
          }
        }
        marks = marks.filter((mark) => !mark.done);
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
  // Chips of the roof rattle down the whole time, every other one right
  // over you.
  golemTremor(box, density, { Shot, every, rand, spreadAcross, clamp }) {
    const floor = box.y + box.h - 3;
    const pebbleX = spreadAcross(box.x + 4, box.x + box.w - 4);
    let way = Math.random() < 0.5 ? 1 : -1;
    let front = null;
    let wait = 0.2;
    let lastHeave = null;
    let high = false;
    let overYou = false;
    const crumble = every(0.6, 0.85, (bullets, soul) => {
      overYou = !overYou;
      const x = overYou ? clamp(soul.x + rand(-2, 2), box.x + 4, box.x + box.w - 4) : pebbleX();
      bullets.push(new Shot({ x, y: box.y - 3, vx: overYou ? 0 : rand(-5, 5), vy: rand(30, 40), art: 'golemPebble' }));
    }, { first: 0.6 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        crumble(dt, bullets, soul);
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
  // The first ring cracks open toward you: one shard comes straight at you
  // (where you're going, if you're on the move).
  golemGeode(box, density, { Shot, every, rand, clamp, pointAwayFrom, angleTo }) {
    let geodes = [];
    // Where you were last frame, to tell which way you're going.
    let last = null;
    let drift = { x: 0, y: 0 };
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
        if (last && dt > 0) drift = { x: (soul.x - last.x) * density / dt, y: (soul.y - last.y) * density / dt };
        last = { x: soul.x, y: soul.y };
        land(dt, bullets, soul);
        for (const geode of geodes) {
          const open = geode.age - (geode.warn + geode.life);
          if (open < 0) continue;
          if (geode.rings === 0) {
            const lead = Math.hypot(soul.x - geode.x, soul.y - geode.y) / 42;
            const ahead = { x: clamp(soul.x + drift.x * lead, box.x + 5, box.x + box.w - 5), y: clamp(soul.y + drift.y * lead, box.y + 5, box.y + box.h - 5) };
            geode.tilt = angleTo(geode, ahead) + rand(-0.06, 0.06);
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
