import { defineBulletArt } from '../projectiles.js';

// The Gloamworm's attacks. It's a glowworm grub hanging in the dark under
// the dead giant tree, so it fights the way glowworms fish: glowing silk
// threads let down from above with sweet dew beaded on the ends, little
// lights to make you come and look, swinging down on its own thread, and a
// curtain of sticky threads for the moths (and you) to blunder into.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const THREAD = '#bff6ea';
const THREAD_GLOW = '#6ad8c4';
const DEW = { d: '#d8fff4', D: '#5ac8b0', w: '#ffffff' };
const LIGHT = { l: '#7affe0', L: '#2ac8a8', w: '#ffffff', k: '#14101c' };
const GRUB = { k: '#14101c', g: '#e8dcc0', G: '#b8a888', s: '#8a7a64', e: '#000000', l: '#7affe0', L: '#2ac8a8' };

// A bead of dew, a little heavy at the bottom.
defineBulletArt('gloamDew', {
  frames: [['.d.', 'dwd', 'dDd', '.D.']],
  palette: DEW,
  radius: 1.6,
});

defineBulletArt('gloamSpark', {
  frames: [['LllW']],
  palette: { L: '#2ac8a8', l: '#7affe0', W: '#ffffff' },
  radius: 1.2,
  rotate: true,
});

// Its lure: a bright soft light, just like a friend's candle (harmless: it's
// what the dew is after).
defineBulletArt('gloamLight', {
  frames: [
    ['..L..', '.LlL.', 'LlwlL', '.LlL.', '..L..'],
    ['.L.L.', 'LlllL', '.lwl.', 'LlllL', '.L.L.'],
  ],
  palette: LIGHT,
  radius: 3,
  frameSeconds: 0.25,
});

// The Gloamworm itself, curled up on the end of its thread, head down.
defineBulletArt('gloamGrub', {
  frames: [[
    '..kkk..',
    '.kLlLk.',
    '.kgggk.',
    'kgsgGgk',
    'kgggggk',
    'kgsgGgk',
    'kekgkek',
    '.kgggk.',
    '..kkk..',
  ]],
  palette: GRUB,
  radius: 3.5,
});

// A moth, fluttering along (drawn heading right).
defineBulletArt('gloamMoth', {
  frames: [['g.g..', '.GgGe', 'g.g..'], ['.....', 'gGgGe', '.....']],
  palette: GRUB,
  radius: 1.8,
  frameSeconds: 0.08,
});

export const GLOAMWORM_ATTACKS = {
  // Fishing lines: it lets its glowing threads down from the roof of the
  // box, each to its own length, with a bead of dew on the end. They hang a
  // moment, then it reels them in and the dew drops off and falls. They
  // never quite reach the floor, but the dew does. Every fourth line comes
  // down right over you.
  gloamLines(box, density, { Shot, Line, every, rand, clamp, spreadAcross }) {
    const nextX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    let lines = [];
    let cast = 0;
    const castLine = every(0.42, 0.58, (bullets, soul) => {
      const x = ++cast % 4 === 0 ? clamp(soul.x, box.x + 6, box.x + box.w - 6) : nextX();
      const length = rand(30, 66);
      const line = new Line({
        x, y: box.y - 2, angle: Math.PI / 2, length, thickness: 2, warn: 0.5, life: 1.3, grow: 90,
        color: THREAD, glow: THREAD_GLOW,
      });
      const bead = new Shot({ x, y: box.y - 2, warn: 0.5, art: 'gloamDew' });
      bullets.push(line, bead);
      lines.push({ line, bead });
    });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        castLine(dt, bullets, soul);
        for (const hung of lines) {
          const { line, bead } = hung;
          if (line.age < line.warn + line.life) {
            // The bead rides on the end of the thread as it comes down.
            bead.x = line.x;
            bead.y = line.y + line.solidLength + 1;
          } else {
            // Reeled in: the bead's let go.
            bead.vy = 10;
            bead.gravity = 130;
            hung.done = true;
          }
        }
        lines = lines.filter((hung) => !hung.done);
      },
    };
  },

  // Come and look: a soft light comes on somewhere in the box, just like a
  // friend's candle. Every bead of dew in the dark goes to it, from all
  // round the edges, and gathers on it. When the light goes out, the dew
  // it gathered flies off in all directions. Don't go to the light.
  gloamLure(box, density, { Shot, every, rand, pointAwayFrom, edgePoint }) {
    let light = null;
    let beads = [];
    const lightSeconds = 1.65;
    let sparks = 0;
    const spark = (bullets, soul) => {
      if (!light) return;
      // From all round the edges, and most of them from the wall nearest you.
      let p = edgePoint(box, undefined, 4);
      if (sparks++ % 3 !== 0 && soul) {
        const walls = [
          { side: 'left', d: soul.x - box.x }, { side: 'right', d: box.x + box.w - soul.x },
          { side: 'top', d: soul.y - box.y }, { side: 'bottom', d: box.y + box.h - soul.y },
        ].sort((a, b) => a.d - b.d);
        p = edgePoint(box, walls[0].side, 4);
        // Close by you along that wall.
        if (walls[0].side === 'left' || walls[0].side === 'right') p.y = Math.min(Math.max(soul.y + rand(-10, 10), box.y + 2), box.y + box.h - 2);
        else p.x = Math.min(Math.max(soul.x + rand(-10, 10), box.x + 2), box.x + box.w - 2);
      }
      const angle = Math.atan2(light.y - p.y, light.x - p.x);
      const bead = new Shot({
        x: p.x, y: p.y, vx: Math.cos(angle) * 46, vy: Math.sin(angle) * 46,
        homing: { target: light, turn: 2.6 }, life: 4.5, art: 'gloamDew',
      });
      bullets.push(bead);
      beads.push(bead);
    };
    const drip = every(0.16, 0.22, spark, { first: 0.35 });
    // The light goes out, and the dew it gathered flies off.
    const douse = () => {
      if (!light) return;
      light.life = light.age;
      const gathered = beads.filter((bead) => bead.stuck);
      gathered.forEach((bead, i) => {
        // (Aimed off into the corners as much as anywhere.)
        const angle = (i / gathered.length) * Math.PI * 2 + Math.PI / 4 + rand(-0.2, 0.2);
        bead.x = light.x;
        bead.y = light.y;
        bead.vx = Math.cos(angle) * 52;
        bead.vy = Math.sin(angle) * 52;
        bead.life = bead.age + 2;
      });
      beads = beads.filter((bead) => !bead.stuck);
      for (const bead of beads) bead.homing = null;
      light = null;
    };
    let t = 0;
    let next = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 9.4) {
          douse();
          // A new one comes on, well away from you.
          const p = pointAwayFrom(box, soul, 30, 12);
          light = new Shot({ x: p.x, y: p.y, harmless: true, art: 'gloamLight' });
          bullets.push(light);
          next = t + lightSeconds;
        }
        if (t >= 9.9) douse();
        drip(dt, bullets, soul);
        for (const bead of beads) {
          if (bead.stuck || !light || bead.homing?.target !== light) continue;
          const d = Math.hypot(bead.x - light.x, bead.y - light.y);
          if (d > 5) continue;
          // It's reached the light: it clings there, in a little ring.
          bead.stuck = true;
          bead.homing = null;
          bead.vx = 0;
          bead.vy = 0;
          const ring = beads.filter((b) => b.stuck).length;
          bead.x = light.x + Math.cos(ring * 2.4) * 4;
          bead.y = light.y + Math.sin(ring * 2.4) * 4;
        }
      },
    };
  },

  // Down it comes: the Gloamworm lets itself down on its own thread from
  // the roof and swings, back and forth across the box like a pendulum. The
  // thread hurts as much as it does. It starts short of the floor, but it
  // lets itself down further as it swings, so don't count on low down. At
  // the end of each swing it flicks off dew, and a drop rolls back across
  // the floor. Then it climbs up and comes down somewhere else.
  gloamSwing(box, density, { Shot, Line, rand }) {
    let drop = null;
    let drops = 0;
    let t = 0;
    const warn = 0.6;
    const swingSeconds = 2.5;
    const reach = 1.25; // how far it swings either side, in radians
    const period = 1.8;
    const lower = (bullets) => {
      const anchor = { x: box.x + box.w / 2 + rand(-14, 14), y: box.y - 2 };
      const length = rand(48, 56);
      const thread = new Line({
        x: anchor.x, y: anchor.y, angle: Math.PI / 2 + reach, length, thickness: 2, warn, life: swingSeconds,
        color: THREAD, glow: THREAD_GLOW,
      });
      const grub = new Shot({ x: 0, y: 0, warn, life: swingSeconds, art: 'gloamGrub' });
      drop = { anchor, length, thread, grub, t: 0, side: 1 };
      place(drop);
      bullets.push(thread, grub);
      drops++;
    };
    // Sets the thread and the grub where they are this far into the swing.
    const place = (d) => {
      const swing = Math.max(0, d.t - warn);
      const angle = Math.PI / 2 + reach * Math.cos((swing / period) * Math.PI * 2);
      // It lets itself down further as it swings, till it brushes the floor.
      const length = d.length + Math.min(1, swing / swingSeconds) * 24;
      d.thread.angle = angle;
      d.thread.length = length;
      d.grub.x = d.anchor.x + Math.cos(angle) * length;
      d.grub.y = d.anchor.y + Math.sin(angle) * length;
      return { angle, swing };
    };
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (!drop && drops < 3 && t >= 0.1 + drops * (warn + swingSeconds + 0.3)) lower(bullets);
        if (!drop) return;
        drop.t += dt;
        const { angle, swing } = place(drop);
        // At each end of the swing (where it turns), it flicks dew outward.
        const side = Math.sign(Math.sin((swing / period) * Math.PI * 2));
        if (swing > 0 && side !== drop.side) {
          drop.side = side;
          const out = angle;
          for (let i = -1; i <= 1; i++) {
            const a = out + i * 0.35;
            bullets.push(new Shot({ x: drop.grub.x, y: drop.grub.y, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, gravity: 50, life: 2, art: 'gloamDew' }));
          }
          // And a fat drop falls and rolls back across the floor.
          const back = drop.grub.x < box.x + box.w / 2 ? 1 : -1;
          const from = Math.min(Math.max(drop.grub.x, box.x + 2), box.x + box.w - 2);
          bullets.push(new Shot({ x: from, y: box.y + box.h - 6, vx: back * 60, warn: 0.3, life: 1.5, art: 'gloamDew' }));
        }
        if (drop.t >= warn + swingSeconds) drop = null;
      },
    };
  },

  // Sticky: it lets down a curtain of its threads (they glow as they come),
  // and they don't hurt, but they're sticky: brush one and you're stuck on
  // it for a moment. Meanwhile moths come fluttering across the box, and a
  // moth that blunders into a thread sticks too, and shakes the dew off it.
  // (It pretends that was the plan.) Dodge the moths without touching the
  // threads. Every so often it reels them in and lets down a new curtain.
  gloamSnare(box, density, { Shot, Line, rand, clamp }) {
    const STICK = 0.4;
    let threads = [];
    let moths = [];
    let t = 0;
    let curtain = 0;
    let moth = 0.5;
    let stuck = 0;
    let held = null;
    const hang = (bullets) => {
      for (const thread of threads) thread.life = Math.min(thread.life, thread.age - thread.warn);
      threads = [];
      const count = 4;
      for (let i = 0; i < count; i++) {
        const x = box.x + ((i + 0.5 + rand(-0.3, 0.3)) / count) * box.w;
        const length = rand(40, 70);
        const thread = new Line({ x, y: box.y - 2, angle: Math.PI / 2, length, thickness: 1, warn: 0.6, life: 30, grow: 120, color: THREAD, glow: THREAD_GLOW });
        // Sticky, not sharp: it never hurts.
        thread.edgeDistance = () => Infinity;
        thread.at = { x, end: box.y - 2 + length };
        threads.push(thread);
        bullets.push(thread);
      }
    };
    const onThread = (x, y, slack) => threads.find((thread) => thread.age > thread.warn + 0.3 && Math.abs(thread.x - x) < slack && y < thread.at.end + 1);
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        curtain -= dt;
        if (curtain <= 0 && t < 9.6) {
          curtain = 3.2;
          hang(bullets);
        }
        moth -= dt;
        if (moth <= 0 && t < 9.8) {
          moth = rand(0.3, 0.4);
          const fromLeft = Math.random() < 0.5;
          const y = Math.random() < 0.4 ? clamp(soul.y, box.y + 6, box.y + box.h - 6) : rand(box.y + 6, box.y + box.h - 6);
          const m = new Shot({
            x: fromLeft ? box.x - 4 : box.x + box.w + 4, y, vx: (fromLeft ? 1 : -1) * rand(40, 52),
            wobble: { amplitude: 4, frequency: 7 }, warn: 0.2, art: 'gloamMoth',
          });
          moths.push(m);
          bullets.push(m);
        }
        // A moth in a thread sticks fast, and the dew shakes off.
        for (const m of moths) {
          if (m.caught || m.age < m.warn) continue;
          const thread = onThread(m.x, m.y, 2.5);
          if (!thread) continue;
          m.caught = true;
          m.vx = 0;
          m.wobble = null;
          m.life = m.age - m.warn + 1.2;
          for (let k = 0; k < 3; k++) {
            bullets.push(new Shot({ x: thread.x, y: m.y, vx: rand(-30, 30), vy: rand(-30, -10), gravity: 90, life: 1.6, art: 'gloamDew' }));
          }
        }
        moths = moths.filter((m) => m.age < m.warn + m.life && m.x > box.x - 30 && m.x < box.x + box.w + 30);
        // And so do you.
        if (stuck > 0) {
          stuck -= dt;
          soul.x = held.x;
          soul.y = held.y;
        } else if (stuck > -0.5) {
          stuck -= dt;
        } else if (onThread(soul.x, soul.y, 2.8)) {
          stuck = STICK;
          held = { x: soul.x, y: soul.y };
        }
      },
    };
  },
};
