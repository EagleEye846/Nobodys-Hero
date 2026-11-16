import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Milestone's attacks. An old roadside milestone that walks, counting
// down the miles to the buried town. It throws its own numbers (a carved
// 3, 2, 1 and a nought, each hanging over you first, then dropping and
// breaking into chips), sends road chips at you in a stream with the road left
// open through it (the road winds, so you follow it), drops little milestones
// out of the sky onto marked spots, and points fingerposts at you, one along
// your row and one down your column at once. It stands to the right of the box.

const STONE = {
  k: '#141012', s: '#8a8278', S: '#aaa296', w: '#cac2b4', d: '#5e5850', D: '#3e3a36',
  m: '#2e2a26', e: '#ff8c1a', E: '#ffd25e', r: '#a8401a', c: '#24201f', b: '#6a4a32', B: '#8a6644',
};

// The digits, carved in a block of stone, glowing in the cut.
const GLYPHS = {
  3: ['eee', '..e', '.ee', '..e', 'eee'],
  2: ['eee', '..e', 'eee', 'e..', 'eee'],
  1: ['.e.', 'ee.', '.e.', '.e.', 'eee'],
  0: ['eee', 'e.e', 'e.e', 'e.e', 'eee'],
};
for (const [n, glyph] of Object.entries(GLYPHS)) {
  const rows = ['.dddddd.', 'dSSSSSSd'];
  for (const line of glyph) rows.push(`dSs${line.replace(/\./g, 's')}sd`);
  rows.push('dsssssSd', '.dddddd.');
  defineBulletArt(`mileNum${n}`, {
    frames: [rows, rows.map((r) => r.replace(/e/g, 'E'))],
    palette: STONE,
    hitbox: { w: 8, h: 9 },
    frameSeconds: 0.12,
  });
}

// A chip of road stone.
defineBulletArt('mileChip', {
  frames: [['.sS.', 'sSws', 'dsd.'], ['.Ss.', 'dSSs', '.ds.']],
  palette: STONE,
  radius: 1.8,
  frameSeconds: 0.15,
});

// A little milestone, falling.
defineBulletArt('mileStub', {
  frames: [['.ddd.', 'dSSsd', 'dSesd', 'dSssd', 'dsssd', 'ddddd']],
  palette: STONE,
  hitbox: { w: 5, h: 6 },
});

// Its shadow where it will land (harmless).
defineBulletArt('mileShadow', {
  frames: [['..mmm..', '.mDDDm.', 'mDDDDDm', '.mDDDm.', '..mmm..'], ['.......', '..mmm..', '.mDDDm.', '..mmm..', '.......']],
  palette: STONE,
  radius: 1,
  frameSeconds: 0.12,
  rim: false,
});

// A fingerpost, pointing right (it turns to point the way it goes).
defineBulletArt('mileSign', {
  frames: [['BBBBBBBb.', 'BwBwwBBBb', 'BBBBBBBBB', 'bbbbbbbb.']],
  palette: STONE,
  hitbox: { w: 9, h: 4 },
  rotate: true,
});

// A faint mark where the road's stream starts (harmless).
defineBulletArt('mileDot', { frames: [['d']], palette: STONE, radius: 0.5, rim: false });

function tracker() {
  const heading = { x: 0, y: 0 };
  let seen = null;
  return {
    heading,
    see(soul, dt) {
      if (seen && dt > 0) {
        heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
        heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
      }
      seen = { x: soul.x, y: soul.y };
    },
  };
}

export const MILESTONE_ATTACKS = {
  // Count: 3, 2, 1, nought. Each number hangs at the top of the box over you,
  // glowing, then drops; where it lands it breaks into chips that skitter off
  // both ways. The nought bursts into a ring.
  mileCount(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let n = 0;
    const order = [3, 2, 1, 0];
    const track = tracker();
    const drops = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (n < 4 && t >= 0.2 + n * 1.25) {
          const num = new Shot({ x: soul.x, y: box.y + 7, warn: 0.75, art: `mileNum${order[n]}`, life: 2 });
          drops.push({ num, digit: order[n], lead: n % 2 ? 0.35 : 0 });
          bullets.push(num);
          n++;
        }
        for (const d of drops) {
          const num = d.num;
          if (num.age < num.warn - 0.3) num.x = clamp(soul.x + track.heading.x * d.lead, box.x + 6, box.x + box.w - 6);
          else if (!d.dropped && num.age >= num.warn - 0.02) { d.dropped = true; num.vy = 165; }
          if (d.dropped && !d.landed && num.y >= box.y + box.h - 6) {
            d.landed = true;
            num.life = num.age - num.warn;
            num.vy = 0;
            if (d.digit === 0) {
              for (let k = 0; k < 12; k++) {
                const a = (k / 12) * Math.PI * 2 + rand(0, 0.3);
                bullets.push(new Shot({ x: num.x, y: num.y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, art: 'mileChip', life: 2 }));
              }
            } else {
              for (let k = 0; k < 6; k++) {
                const side = k % 2 ? 1 : -1;
                bullets.push(new Shot({ x: num.x, y: num.y, vx: side * rand(40, 80), vy: -rand(40, 110), gravity: 160, art: 'mileChip', life: 2 }));
              }
            }
          }
        }
      },
    };
  },

  // Road: a stream of road chips across the box from the right in seven
  // lanes, with two lanes left open: the road. The road bends a lane up or
  // down every second, and you have to keep to it.
  mileChips(box, density, { Shot, rand }) {
    let t = 0;
    const lanes = 7;
    const lh = box.h / lanes;
    let road = 3;
    let bend = 0.9;
    let next = 0;
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t > 5.4) return;
        bend -= dt;
        if (bend <= 0) {
          bend = 0.95;
          const here = Math.floor((soul.y - box.y) / lh);
          let step = Math.random() < 0.5 ? -1 : 1;
          // Away from where you are, so it never just settles on you.
          if (road === here || road + 1 === here) step = here <= road ? 1 : -1;
          road = Math.max(0, Math.min(lanes - 2, road + step));
        }
        next -= dt;
        if (next > 0) return;
        next = 0.3;
        for (let l = 0; l < lanes; l++) {
          if (l === road || l === road + 1) continue;
          const y = box.y + lh * (l + 0.5) + rand(-1, 1);
          bullets.push(new Shot({ x: box.x + box.w + 4, y, vx: -70, art: 'mileChip', life: 3, warn: t < 0.5 ? 0.35 : 0 }));
        }
      },
    };
  },

  // Stones: little milestones fall out of the sky onto spots near you (a
  // shadow shows each spot first), and break into four chips that fly off
  // along the road and across it.
  mileStones(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let stones = 0;
    const track = tracker();
    const falls = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (stones < 7 && t >= 0.2 + stones * 0.75) {
          const lead = stones % 2 ? 0.6 : 0.15;
          const x = clamp(soul.x + track.heading.x * lead + rand(-4, 4), box.x + 6, box.x + box.w - 6);
          const y = clamp(soul.y + track.heading.y * lead + rand(-4, 4), box.y + 8, box.y + box.h - 6);
          const shadow = new Shot({ x, y, harmless: true, art: 'mileShadow', life: 0.75 });
          bullets.push(shadow);
          falls.push({ shadow, x, y });
          stones++;
        }
        for (const f of falls) {
          if (!f.stub && f.shadow.age >= 0.55) {
            f.stub = new Shot({ x: f.x, y: f.y - 26, harmless: true, art: 'mileStub', life: 0.25 });
            bullets.push(f.stub);
          } else if (f.stub && !f.moving) {
            f.moving = true;
            f.stub.vy = 26 / 0.2;
          }
          if (f.stub && !f.broke && f.stub.age >= 0.2) {
            f.broke = true;
            // It lands, and hurts for a moment where it lands.
            bullets.push(new Shot({ x: f.x, y: f.y, art: 'mileStub', life: 0.3 }));
            const turn = Math.random() < 0.5 ? 0 : Math.PI / 4;
            for (let k = 0; k < 4; k++) {
              const a = turn + (k / 4) * Math.PI * 2;
              bullets.push(new Shot({ x: f.x, y: f.y, vx: Math.cos(a) * 58, vy: Math.sin(a) * 58, art: 'mileChip', life: 1.8 }));
            }
          }
        }
      },
    };
  },

  // Signs: fingerposts, two at a time: one comes in from the left along your
  // row, one from the top down your column, so they cross where you are. Each
  // blinks at the edge and follows you until the last moment.
  mileSigns(box, density, { Shot, clamp }) {
    let t = 0;
    let pairs = 0;
    const track = tracker();
    const sets = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (pairs < 6 && t >= 0.2 + pairs * 0.8) {
          const flip = pairs % 2 === 1;
          const across = new Shot({ x: flip ? box.x + box.w - 5 : box.x + 5, y: soul.y, warn: 0.6, art: 'mileSign', life: 2, angle: flip ? Math.PI : 0 });
          const down = new Shot({ x: soul.x, y: box.y + 5, warn: 0.6, art: 'mileSign', life: 2, angle: Math.PI / 2 });
          // (Its hitbox lies along the post, so the one going down stands up.)
          down.art = { ...down.art, hitbox: { w: 4, h: 9 } };
          sets.push({ across, down, dir: flip ? -1 : 1, lead: pairs % 3 === 2 ? 0.45 : 0.1 });
          bullets.push(across, down);
          pairs++;
        }
        for (const s of sets) {
          const age = s.across.age;
          if (age < s.across.warn - 0.3) {
            s.across.y = clamp(soul.y + track.heading.y * s.lead, box.y + 4, box.y + box.h - 4);
            s.down.x = clamp(soul.x + track.heading.x * s.lead, box.x + 4, box.x + box.w - 4);
          } else if (!s.fired && age >= s.across.warn - 0.02) {
            s.fired = true;
            s.across.vx = s.dir * 120;
            s.down.vy = 120;
          }
        }
      },
    };
  },
};

// Aimed chips on top (see snipes.js), so the open road or a gap between stones is never a place to rest.
MILESTONE_ATTACKS.mileChips = withSnipes(MILESTONE_ATTACKS.mileChips, { art: 'mileChip', count: 4, first: 1.0, every: 1.2, lead: ['mean', 0.9, 'mean', 0.4], until: 5.4 });
MILESTONE_ATTACKS.mileCount = withSnipes(MILESTONE_ATTACKS.mileCount, { art: 'mileChip', count: 4, first: 0.9, every: 1.25, lead: [0.9, 'mean', 0.4, 'mean'], until: 5.6 });
