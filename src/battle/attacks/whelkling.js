import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Whelkling's attacks. It's a hermit crab in a big whelk shell crusted with
// glowing anemones, living in a dark pool, so it's anemones, shell and claws:
// anemone buds that glow up in the box (one always near you) and burst into
// rings of stinging arms; its shell spinning, throwing arms of shell grit
// round in a spiral from a whorl that shows first; its big claw pinching shut
// across your column or your row (the line shows first), with a ring of
// bubbles out of the snap; and the great shell itself, rolling and bouncing
// round the box, shedding grit behind it. It sits to the right of the box.
// (Made harder 2026-11-08: they were too thin and too slow, and took no
// notice of `density`. The old ones are in notes/attack-backup-2026-11-08/.)

const WK = {
  k: '#141a1c', s: '#b8ac94', S: '#d8ceb4', d: '#8a7e68', D: '#5a4a3a', c: '#b0563a', C: '#d8805a', q: '#7a3424',
  n: '#4e7e70', N: '#8ad0b8', g: '#c8ffe8', e: '#fff6e0', w: '#ffffff', b: '#a8d8e0', B: '#e8fcff',
};

// An anemone budding in the box (harmless): a little glowing crown, pulsing brighter.
defineBulletArt('whelkBud', {
  frames: [
    ['.......', '..n.n..', '.nNgNn.', '..nNn..', '...n...'],
    ['..g.g..', '.gN.Ng.', '.nNgNn.', '..nNn..', '...n...'],
  ],
  palette: WK,
  radius: 1,
  frameSeconds: 0.14,
});

// The bud by you, ripe and about to open (harmless): its arms all out, bright.
defineBulletArt('whelkBudRipe', {
  frames: [[
    'C...C...C',
    '.g..g..g.',
    '..gNgNg..',
    'C.NgwgN.C',
    '..gNgNg..',
    '.g..g..g.',
    'C...C...C',
  ]],
  palette: WK,
  radius: 1,
});

// An anemone's stinging arm, flung out: a pale-green whip with a glowing tip (drawn flying right).
defineBulletArt('whelkSting', {
  frames: [['nnN.', '.NNg', 'nnN.'], ['.nN.', 'nNNg', '.nN.']],
  palette: WK,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.12,
});

// Where the shell will spin from (harmless): a little whorl of shell, turning.
defineBulletArt('whelkWhorl', {
  frames: [['..sSs..', '.s...S.', 's..dd.S', 'S.d..dS', 'S..d..s', '.S...s.', '..sSs..']],
  palette: WK,
  radius: 1,
  spin: 4,
});

// A chip of shell, thrown off as it spins.
defineBulletArt('whelkGrit', { frames: [['.S.', 'sSd', '.dD']], palette: WK, radius: 1.7, spin: 5 });

// Half the big claw, open, coming at you (drawn pointing right).
function clawHalf() {
  const g = new Pix(13, 9);
  g.line(0, 4, 4, 4, 'q', 3);
  g.disc(6, 4, 3.4, 3.2, 'c');
  g.disc(5, 3, 1.6, 1.2, 'C', 'c');
  g.line(8, 2, 12, 0, 'c', 2);
  g.line(8, 6, 12, 8, 'q', 2);
  g.set(12, 0, 'C');
  g.outline('k');
  return g.rows();
}
defineBulletArt('whelkClaw', { frames: [clawHalf()], palette: WK, radius: 3.6, rotate: true });

// Where the claw will pinch (harmless): a little pincer mark on the wall.
defineBulletArt('whelkNip', { frames: [['c...c', '.c.c.', '..q..'], ['C...C', '.c.c.', '..q..']], palette: WK, radius: 1, frameSeconds: 0.12 });

// A bubble out of the pinch.
defineBulletArt('whelkBubble', { frames: [['.bb.', 'b..B', 'b..b', '.bb.'], ['.bb.', 'b.B.', 'b..b', '.bb.']], palette: WK, radius: 2, frameSeconds: 0.2 });

// The great whelk shell itself, rolling (it spins as it goes): pale whorls
// round a dark mouth, a couple of glowing anemones stuck on.
function shellRoll() {
  const g = new Pix(13, 13);
  g.disc(6, 6, 6, 6, 's');
  g.disc(6, 6, 4.4, 4.4, 'S', 's');
  g.disc(7, 5, 3, 3, 'd', 'S');
  g.disc(7, 5, 1.6, 1.6, 'S', 'd');
  g.set(7, 5, 'D');
  g.line(1, 8, 4, 11, 'd');
  g.set(3, 3, 'N');
  g.set(10, 9, 'N');
  g.set(9, 2, 'g');
  g.outline('k');
  return g.rows();
}
defineBulletArt('whelkShell', { frames: [shellRoll()], palette: WK, radius: 5.2, spin: 7 });

export const WHELKLING_ATTACKS = {
  // Anemones: four buds glow up in the box (the first a step from you, and it
  // drifts after you until a moment before it opens; the others elsewhere),
  // and each bursts into a ring of stinging arms, then a second, slower ring
  // turned half a step, with a gap facing away from the middle of the box.
  // Three times, quicker each time.
  whelkSting(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    let buds = [];
    // (2026-11-10: lighter. Four buds a wave, each with two rings of eleven or
    // twelve arms, packed the little box with near a hundred stings: the
    // careful dodger was hit more than once a turn by the cave's easy monster.)
    const arms = Math.round(7 + 2 * density);
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (waves < 3 && t >= next) {
          for (let i = 0; i < 3; i++) {
            const side = rand(0, Math.PI * 2);
            const near = i === 0;
            const r = near ? rand(18, 24) : rand(26, 46);
            const x = clamp(soul.x + Math.cos(side) * r, box.x + 8, box.x + box.w - 8);
            const y = clamp(soul.y + Math.sin(side) * r, box.y + 8, box.y + box.h - 8);
            // (In real seconds: a bit over half a second for the one by you,
            // a little longer for each of the others. 2026-11-08: they used
            // to open in under 0.4 s at this monster's pace.)
            const warn = (0.55 + i * 0.12) * density;
            const bud = new Shot({ x, y, harmless: true, life: warn / density, art: 'whelkBud' });
            bullets.push(bud);
            buds.push({ bud, at: t + warn, near, side });
          }
          waves++;
          next = t + 2.4;
        }
        for (const b of buds) {
          // The near one keeps its step from you until a little under half a
          // real second before it opens, then stays put (made fairer
          // 2026-11-08: it used to follow until a sixth of a second before).
          if (b.near && t < b.at - 0.42 * density) {
            b.bud.x = clamp(soul.x + Math.cos(b.side) * 19, box.x + 8, box.x + box.w - 8);
            b.bud.y = clamp(soul.y + Math.sin(b.side) * 19, box.y + 8, box.y + box.h - 8);
          }
          // When it stops it swells: a brighter crown, blinking, so you know it's about to open.
          if (b.near && !b.swelled && t >= b.at - 0.42 * density) {
            b.swelled = true;
            bullets.push(new Shot({ x: b.bud.x, y: b.bud.y, harmless: true, warn: 0.42, life: 0, art: 'whelkBudRipe' }));
          }
          if (t < b.at) continue;
          b.done = true;
          const away = Math.atan2(b.bud.y - (box.y + box.h / 2), b.bud.x - (box.x + box.w / 2));
          // (Only the bud by you sends a second, slower ring.)
          for (let ring = 0; ring < (b.near ? 2 : 1); ring++) {
            for (let k = 1; k < arms; k++) {
              const a = away + ((k + ring * 0.5) / arms) * Math.PI * 2;
              const speed = ring ? 52 : 78;
              bullets.push(new Shot({ x: b.bud.x, y: b.bud.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, warn: 0.06 + ring * 0.22, art: 'whelkSting', life: 1.3 }));
            }
          }
        }
        buds = buds.filter((b) => !b.done);
      },
    };
  },

  // Spin: a whorl of shell shows on the right of the box, high or low (the
  // other side from you), and then it spins, throwing out three arms of shell
  // grit (four when it's harder) that sweep round. The second whorl starts at
  // the other end, the other way round, before the first has finished: for a
  // moment there are two.
  whelkSpiral(box, density, { Shot }) {
    let t = 0;
    let spins = 0;
    let firstHigh = false;
    let live = [];
    const armCount = density >= 1.6 ? 4 : 3;
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (spins < 2 && t >= 0.2 + spins * 2.4) {
          const high = spins === 0 ? soul.y > box.y + box.h / 2 : !firstHigh;
          if (spins === 0) firstHigh = high;
          const at = { x: box.x + box.w - 10, y: high ? box.y + 12 : box.y + box.h - 12 };
          const warn = 0.7;
          bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: warn + 3, art: 'whelkWhorl' }));
          live.push({ at, start: t + warn, turn: spins % 2 ? -1 : 1, angle: Math.atan2(soul.y - at.y, soul.x - at.x) + 0.5, next: 0 });
          spins++;
        }
        for (const c of live) {
          if (t < c.start) continue;
          c.angle += c.turn * 2.4 * dt;
          c.next -= dt;
          if (c.next <= 0) {
            c.next = 0.13;
            for (let k = 0; k < armCount; k++) {
              const a = c.angle + (k / armCount) * Math.PI * 2;
              bullets.push(new Shot({ x: c.at.x, y: c.at.y, vx: Math.cos(a) * 64, vy: Math.sin(a) * 64, art: 'whelkGrit', life: 2.6 }));
            }
          }
          if (t >= c.start + 3) c.done = true;
        }
        live = live.filter((c) => !c.done);
      },
    };
  },

  // Pinch: the big claw comes at you in two halves, from the top and bottom of
  // the box along your column (or from the sides along your row), and snaps
  // shut where they meet, spitting a ring of bubbles. The line shows first and
  // follows you until a moment before. Six pinches, quicker than before; every
  // third is a cross (column and row at once), so only the corners are clear.
  // (Made fairer 2026-11-08: the line used to follow you until a sixth of a
  // second before the claws came, too quick for anyone to read. Now it
  // follows, then stops and goes bright, and the claw halves show at the
  // walls, blinking, for about a third of a second before they close. The
  // times below are real seconds: the pattern's clock runs `density` fast.)
  whelkPinch(box, density, { Shot, Line, clamp }) {
    let t = 0;
    let pinches = 0;
    let open = [];
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    const LOCK = 0.32; // real seconds between the line stopping and the claws moving
    const add = (column, bullets, soul, warn) => {
      const guide = column
        ? new Line({ x: soul.x, y: box.y - 4, angle: Math.PI / 2, length: box.h + 8, thickness: 1, warn: warn / density + LOCK, life: 0, color: '#8a4a34' })
        : new Line({ x: box.x - 4, y: soul.y, angle: 0, length: box.w + 8, thickness: 1, warn: warn / density + LOCK, life: 0, color: '#8a4a34' });
      const nip = column
        ? new Shot({ x: soul.x, y: box.y + 3, harmless: true, life: warn / density, art: 'whelkNip' })
        : new Shot({ x: box.x + box.w - 4, y: soul.y, harmless: true, life: warn / density, art: 'whelkNip' });
      bullets.push(guide, nip);
      open.push({ column, guide, nip, at: t + warn, halves: null });
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        if (pinches < 6 && t >= 0.2 + pinches * 1.1) {
          if (pinches % 3 === 2) {
            add(true, bullets, soul, 0.75);
            add(false, bullets, soul, 0.75);
          } else add(pinches % 2 === 0, bullets, soul, 0.6);
          pinches++;
        }
        for (const p of open) {
          if (!p.halves) {
            // The line follows you (a little ahead) until the claws show.
            if (p.column) { const x = clamp(soul.x + heading.x * 0.3, box.x + 6, box.x + box.w - 6); p.guide.x = x; p.nip.x = x; }
            else { const y = clamp(soul.y + heading.y * 0.3, box.y + 6, box.y + box.h - 6); p.guide.y = y; p.nip.y = y; }
            if (t < p.at) continue;
            // Now it stops: the line goes bright and both halves of the claw
            // show at the walls, blinking (a Shot's warning), then close.
            const meet = p.column ? box.y + box.h / 2 : box.x + box.w / 2;
            p.meet = meet;
            const speed = 105;
            const warn = LOCK;
            p.guide.life = 0;
            p.guide.color = '#ffc89a';
            if (p.column) {
              const x = p.guide.x;
              p.halves = [
                new Shot({ x, y: box.y - 2, vy: speed, warn, art: 'whelkClaw', life: 2 }),
                new Shot({ x, y: box.y + box.h + 2, vy: -speed, warn, art: 'whelkClaw', life: 2 }),
              ];
            } else {
              const y = p.guide.y;
              p.halves = [
                new Shot({ x: box.x - 2, y, vx: speed, warn, art: 'whelkClaw', life: 2 }),
                new Shot({ x: box.x + box.w + 2, y, vx: -speed, warn, art: 'whelkClaw', life: 2 }),
              ];
            }
            bullets.push(...p.halves);
            continue;
          }
          const [a] = p.halves;
          const reached = p.column ? a.y >= p.meet - 4 : a.x >= p.meet - 4;
          if (!reached) continue;
          p.done = true;
          for (const h of p.halves) h.life = Math.min(h.life, h.age - h.warn + 0.12);
          const cx = p.column ? a.x : p.meet;
          const cy = p.column ? p.meet : a.y;
          // A ring of bubbles out of the snap: they show for a moment, then drift
          // off, so a step off the line is still a step clear.
          const n = Math.round(6 + 2 * density);
          for (let k = 0; k < n; k++) {
            const ang = (k / n) * Math.PI * 2 + Math.PI / n;
            bullets.push(new Shot({ x: cx, y: cy, vx: Math.cos(ang) * 34, vy: Math.sin(ang) * 34, warn: 0.3, art: 'whelkBubble', life: 1.8 }));
          }
        }
        open = open.filter((p) => !p.done);
      },
    };
  },

  // Roll: it pulls in and sends its great shell rolling into the box from the
  // right, aimed near you, bouncing off the walls (five bounces), shedding a
  // chip of grit now and then that drifts off slowly behind it. A second
  // shell follows before the first has stopped.
  whelkRoll(box, density, { Shot }) {
    let t = 0;
    let sent = 0;
    const shells = [];
    const speed = 92 + 10 * density;
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (sent < 2 && t >= 0.3 + sent * 2.6) {
          const y = Math.min(box.y + box.h - 8, Math.max(box.y + 8, soul.y + (sent ? 18 : -18)));
          const x = box.x + box.w + 6;
          const a = Math.atan2(soul.y - y, soul.x - x) + (sent ? -0.25 : 0.25);
          const shell = new Shot({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, warn: 0.55, art: 'whelkShell', life: 5 });
          bullets.push(shell);
          shells.push({ shell, bounces: 0, drop: 0.2 });
          sent++;
        }
        for (const s of shells) {
          const b = s.shell;
          if (b.age < b.warn) continue;
          const r = 6;
          if (s.bounces < 5) {
            if (b.x < box.x + r && b.vx < 0) { b.vx = -b.vx; s.bounces++; }
            if (b.x > box.x + box.w - r && b.vx > 0 && b.age > b.warn + 0.3) { b.vx = -b.vx; s.bounces++; }
            if (b.y < box.y + r && b.vy < 0) { b.vy = -b.vy; s.bounces++; }
            if (b.y > box.y + box.h - r && b.vy > 0) { b.vy = -b.vy; s.bounces++; }
          }
          s.drop -= dt;
          if (s.drop <= 0) {
            s.drop = 0.3;
            const ang = Math.atan2(-b.vy, -b.vx) + (Math.random() - 0.5) * 1.2;
            // (It hangs a blink where it fell before it drifts, so the shell
            // passing close by isn't a hit from point-blank. 2026-11-08.)
            bullets.push(new Shot({ x: b.x, y: b.y, vx: Math.cos(ang) * 26, vy: Math.sin(ang) * 26, warn: 0.14, art: 'whelkGrit', life: 1.6 }));
          }
        }
      },
    };
  },
};

// Aimed grit and stings on top (see snipes.js), so the spiral and the anemones can't be waited out in one spot.
WHELKLING_ATTACKS.whelkSpiral = withSnipes(WHELKLING_ATTACKS.whelkSpiral, { art: 'whelkGrit', count: 4, first: 1.0, every: 1.3, lead: [0.9, 'mean', 0.5, 'mean'] });
WHELKLING_ATTACKS.whelkSting = withSnipes(WHELKLING_ATTACKS.whelkSting, { art: 'whelkSting', count: 3, first: 1.3, every: 1.7, lead: [0.9, 'mean', 0.5] });
WHELKLING_ATTACKS.whelkRoll = withSnipes(WHELKLING_ATTACKS.whelkRoll, { art: 'whelkGrit', count: 4, first: 1.2, every: 1.4, lead: [0.9, 'mean', 0.5, 'mean'] });
