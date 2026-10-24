import { defineBulletArt } from '../projectiles.js';

// The Gloamworm's attacks. It's a glowworm grub hanging in the dark under
// the dead giant tree, so it fights the way glowworms fish: glowing silk
// threads let down from above with sweet dew beaded on the ends, little
// lights to make you come and look, and the roots it hangs from, shaken till
// the earth comes down.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const THREAD = '#bff6ea';
const THREAD_GLOW = '#6ad8c4';
const DEW = { d: '#d8fff4', D: '#5ac8b0', w: '#ffffff' };
const LIGHT = { l: '#7affe0', L: '#2ac8a8', w: '#ffffff', k: '#14101c' };
const GRUB = { k: '#14101c', g: '#e8dcc0', G: '#b8a888', s: '#8a7a64', e: '#000000', l: '#7affe0', L: '#2ac8a8' };
// Earth is a little paler than real earth, so you can see it in the dark.
const EARTH = { r: '#c09468', R: '#8a6440', e: '#a88c6c', E: '#76604a' };

// A bead of dew, a little heavy at the bottom.
defineBulletArt('gloamDew', {
  frames: [['.d.', 'dwd', 'dDd', '.D.']],
  palette: DEW,
  radius: 1.6,
});

// A mote of its light, twinkling; the same mote gone out (harmless); and a
// splinter of light, drawn pointing right.
defineBulletArt('gloamMote', {
  frames: [['.L.', 'LwL', '.L.'], ['l.l', '.w.', 'l.l']],
  palette: LIGHT,
  radius: 1.5,
  frameSeconds: 0.15,
});
defineBulletArt('gloamMoteOut', {
  frames: [['.L.', 'L.L', '.L.']],
  palette: { L: '#1e5a50' },
  radius: 1.5,
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

// A clod of earth with a root through it, spinning down; and a length of
// broken root, falling flat.
defineBulletArt('gloamClod', {
  frames: [['.eEe.', 'eErEe', 'rrRrr', 'eEeEE', '.EeE.']],
  palette: EARTH,
  radius: 2.2,
  spin: 4,
});
defineBulletArt('gloamRoot', {
  frames: [['r.rrrRRrrrrrRr', 'RrRRrrrRRrRRrR', '.R..r....R..r.']],
  palette: EARTH,
  hitbox: { w: 14, h: 3 },
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
      duration: 6.5,
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
    const spark = (bullets) => {
      if (!light) return;
      const p = edgePoint(box, undefined, 4);
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
        const angle = (i / gathered.length) * Math.PI * 2 + rand(-0.2, 0.2);
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
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 6.2) {
          douse();
          // A new one comes on, well away from you.
          const p = pointAwayFrom(box, soul, 30, 12);
          light = new Shot({ x: p.x, y: p.y, harmless: true, art: 'gloamLight' });
          bullets.push(light);
          next = t + lightSeconds;
        }
        if (t >= 6.2) douse();
        drip(dt, bullets);
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
  // thread hurts as much as it does. It can't reach the floor right under
  // where it hangs, so get under it, low down. At the end of each swing it
  // flicks off dew. Then it climbs up and comes down somewhere else.
  gloamSwing(box, density, { Shot, Line, rand }) {
    let drop = null;
    let drops = 0;
    let t = 0;
    const warn = 0.6;
    const swingSeconds = 2.5;
    const reach = 1.05; // how far it swings either side, in radians
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
      d.thread.angle = angle;
      d.grub.x = d.anchor.x + Math.cos(angle) * d.length;
      d.grub.y = d.anchor.y + Math.sin(angle) * d.length;
      return { angle, swing };
    };
    return {
      duration: 6.6,
      update: (dt, bullets) => {
        t += dt;
        if (!drop && drops < 2 && t >= 0.1 + drops * (warn + swingSeconds + 0.3)) lower(bullets);
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
        }
        if (drop.t >= warn + swingSeconds) drop = null;
      },
    };
  },

  // Glow-swarm: its lights come drifting up from the floor like sparks off
  // a fire, swaying as they go. Now and then one goes out. Count to two: it
  // lights up again and bursts, a splinter of light at you and one either
  // side.
  gloamMotes(box, density, { Shot, every, rand, angleTo, spreadAcross }) {
    const nextX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    let motes = [];
    let dark = [];
    let count = 0;
    const rise = every(0.26, 0.34, (bullets) => {
      const x = nextX();
      const mote = new Shot({ x, y: box.y + box.h + 3, vy: rand(-34, -26), art: 'gloamMote' });
      mote.baseX = x;
      mote.sway = rand(0, Math.PI * 2);
      // Every other one goes out somewhere on its way up.
      mote.outAt = ++count % 2 === 0 ? rand(0.7, 1.6) : Infinity;
      bullets.push(mote);
      motes.push(mote);
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        rise(dt, bullets);
        for (const mote of motes) {
          mote.x = mote.baseX + Math.sin(mote.age * 3 + mote.sway) * 5;
          if (mote.age < mote.outAt) continue;
          // It goes out, and sits there dark for a moment.
          mote.life = mote.age - mote.warn;
          mote.done = true;
          const speck = new Shot({ x: mote.x, y: mote.y, harmless: true, life: 0.5, art: 'gloamMoteOut' });
          speck.relight = 0.5;
          bullets.push(speck);
          dark.push(speck);
        }
        motes = motes.filter((mote) => !mote.done && mote.y > box.y - 10);
        for (const speck of dark) {
          speck.relight -= dt;
          if (speck.relight > 0) continue;
          speck.done = true;
          const aim = angleTo(speck, soul);
          for (const turn of [-0.55, 0, 0.55]) {
            bullets.push(new Shot({ x: speck.x, y: speck.y, vx: Math.cos(aim + turn) * 62, vy: Math.sin(aim + turn) * 62, life: 2, art: 'gloamSpark' }));
          }
        }
        dark = dark.filter((speck) => !speck.done);
      },
    };
  },

  // Root rattle: it tugs on all its threads at once, and the roots they
  // hang from shake. Earth comes down in clods all over (each one blinks
  // before it drops), and every so often a whole length of broken root
  // falls flat, right over you.
  gloamRattle(box, density, { Shot, every, rand, clamp, spreadAcross }) {
    const nextX = spreadAcross(box.x + 4, box.x + box.w - 4, 6);
    const crumble = every(0.17, 0.25, (bullets) => {
      bullets.push(new Shot({ x: nextX(), y: box.y + 3, vy: 18, gravity: 140, warn: 0.35, art: 'gloamClod' }));
    });
    const snap = every(1.25, 1.45, (bullets, soul) => {
      const x = clamp(soul.x + rand(-6, 6), box.x + 8, box.x + box.w - 8);
      bullets.push(new Shot({ x, y: box.y + 3, vy: 12, gravity: 120, warn: 0.5, art: 'gloamRoot' }));
    }, { first: 0.8 });
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        crumble(dt, bullets);
        snap(dt, bullets, soul);
      },
    };
  },
};
