import { defineBulletArt } from '../projectiles.js';

// The Tatterwight's attacks. It's the wind of the Torn Clearing, still going
// round, with everything that was left there caught up in it: scarlet leaves,
// snapped twigs, and the blue wool of Ves's coat. So it blows: leaves come
// spiralling in off the edges of the box; it rakes the claw marks it copied
// off the bark across the box, four grooves at a time; it pulls her wool
// into threads that sink down the box with a tear in each; it shakes twigs
// down out of the trees; and it turns the whole box into a whirlwind that
// carries you round while rings of leaves burst out of its eye.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const TATTER = {
  k: '#1e0a0c', l: '#d8402a', L: '#962418', g: '#ff8a5a',
  b: '#5a3a22', B: '#8a5a32', G: '#4a74b0', J: '#30508a', w: '#c8d8f0',
};
const centre = (box) => ({ x: box.x + box.w / 2, y: box.y + box.h / 2 });

// A scarlet leaf, tumbling as it goes.
defineBulletArt('tatterLeaf', {
  frames: [
    ['..gl.', '.glLl', 'glLl.', '.Ll..'],
    ['.lg..', 'lLlg.', '.lLlg', '..lL.'],
    ['.....', 'glllL', 'LlllL', '.....'],
  ],
  palette: TATTER,
  radius: 2,
  frameSeconds: 0.1,
});

// A snapped twig, spinning end over end.
defineBulletArt('tatterTwig', {
  frames: [['b......', 'bBBbbBb', '....b..']],
  palette: TATTER,
  radius: 2,
  spin: 7,
});

// A knot of blue wool, sliding along a thread.
defineBulletArt('tatterKnot', {
  frames: [['.GJ.', 'GwGJ', 'JGGJ', '.JJ.'], ['.JG.', 'JGwG', 'JGGJ', '.JJ.']],
  palette: TATTER,
  radius: 2,
  frameSeconds: 0.2,
});

// A chip of bark, knocked off by a claw.
defineBulletArt('tatterChip', {
  frames: [['Bb', 'bk']],
  palette: TATTER,
  radius: 1.5,
  spin: 5,
});

export const TATTERWIGHT_ATTACKS = {
  // Leaves come in off every edge of the box, curling as the wind turns
  // them, so they cross the box in long bends rather than straight lines.
  // Which way they curl changes every time.
  tatterLeafStorm(box, density, { Shot, every, pick, angleTo }) {
    const c = centre(box);
    const turn = pick([-1, 1]) * 1.1;
    let angle = Math.random() * Math.PI * 2;
    const leaves = [];
    const blow = every(0.16, 0.2, (bullets, soul) => {
      angle += 2.39996; // the golden angle, so they never bunch up
      const from = { x: c.x + Math.cos(angle) * 56, y: c.y + Math.sin(angle) * 56 };
      // Every other leaf is aimed off to the side by just enough that the
      // wind bends it round onto where you are (an arc of radius speed/turn);
      // the rest just blow across.
      const aimed = Math.random() < 0.5;
      const target = aimed ? soul : c;
      const reach = Math.hypot(target.x - from.x, target.y - from.y);
      const lead = Math.asin(Math.min(1, reach / (2 * (42 / Math.abs(turn))))) * Math.sign(turn);
      const heading = angleTo(from, target) - lead;
      const leaf = new Shot({ x: from.x, y: from.y, vx: Math.cos(heading) * 42, vy: Math.sin(heading) * 42, art: 'tatterLeaf', life: 4 });
      leaves.push(leaf);
      bullets.push(leaf);
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        blow(dt, bullets, soul);
        // Each leaf's heading turns as it flies: the whirl.
        const spin = turn * dt;
        for (const leaf of leaves) {
          const { vx, vy } = leaf;
          leaf.vx = vx * Math.cos(spin) - vy * Math.sin(spin);
          leaf.vy = vx * Math.sin(spin) + vy * Math.cos(spin);
        }
      },
    };
  },

  // The claw marks off the trees: four long grooves, side by side, flash
  // across the box on a slant, then rake through. Stand clear of them, or in
  // one of the narrow gaps between; each rake knocks bark chips loose.
  tatterClaws(box, density, { Shot, Line, every, rand, pick, shuffleBag }) {
    const c = centre(box);
    const slant = shuffleBag([-0.6, 0.6, -1.0, 1.0, Math.PI / 2]);
    const SPACING = 13;
    const rake = every(1.05, 1.25, (bullets, soul) => {
      const angle = slant();
      const length = 150;
      // Across the line of the grooves (where the gaps are).
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);
      // Centred near you, but never so the gap lands exactly on you.
      const offset = (soul.x - c.x) * nx + (soul.y - c.y) * ny + pick([-1, 1]) * rand(4, 9);
      for (let i = 0; i < 4; i++) {
        const along = offset + (i - 1.5) * SPACING;
        const mx = c.x + nx * along;
        const my = c.y + ny * along;
        bullets.push(new Line({
          x: mx - Math.cos(angle) * length / 2,
          y: my - Math.sin(angle) * length / 2,
          angle,
          length,
          thickness: 4,
          warn: 0.7,
          life: 0.3,
          color: '#e8603a',
          glow: '#ff8a5a',
        }));
        // A chip of bark off each groove, flying out sideways.
        const side = i < 2 ? -1 : 1;
        bullets.push(new Shot({ x: mx, y: my, vx: nx * side * 50 + rand(-10, 10), vy: ny * side * 50 + rand(-10, 10), art: 'tatterChip', warn: 0.95, life: 1.5 }));
      }
    }, { first: 0.4 });
    return { duration: 6, update: (dt, bullets, soul) => rake(dt, bullets, soul) };
  },

  // Her wool, pulled into threads right across the box, sinking slowly from
  // the top; each has a tear in it somewhere to slip through, and a knot of
  // wool runs along it.
  tatterThreads(box, density, { Shot, Line, every, rand, clamp }) {
    const SINK = 20;
    const TEAR = 18;
    let lastTear = box.x + box.w / 2;
    const pull = every(1.4, 1.6, (bullets) => {
      // Not too far from the last tear, so you can always make it.
      const tear = clamp(lastTear + rand(-30, 30), box.x + TEAR / 2 + 4, box.x + box.w - TEAR / 2 - 4);
      lastTear = tear;
      const y = box.y + 2;
      const life = (box.h + 4) / SINK;
      const left = tear - TEAR / 2 - (box.x - 10);
      const right = box.x + box.w + 10 - (tear + TEAR / 2);
      const thread = { y, vy: SINK, thickness: 2, warn: 0.5, life, color: '#4a74b0', glow: '#30508a' };
      bullets.push(new Line({ ...thread, x: box.x - 10, angle: 0, length: left }));
      bullets.push(new Line({ ...thread, x: box.x + box.w + 10, angle: Math.PI, length: right }));
      // The knot runs along the thread, from one end to the other.
      const fromLeft = Math.random() < 0.5;
      bullets.push(new Shot({ x: fromLeft ? box.x - 6 : box.x + box.w + 6, y, vx: fromLeft ? 38 : -38, vy: SINK, art: 'tatterKnot', warn: 0.5, life: life }));
    }, { first: 0.3 });
    return { duration: 7, update: (dt, bullets) => pull(dt, bullets) };
  },

  // It shakes the trees: twigs come down end over end, thrown out sideways,
  // with leaves fluttering down slowly between them.
  tatterTwigs(box, density, { Shot, every, rand, spreadAcross }) {
    const twigX = spreadAcross(box.x + 6, box.x + box.w - 6);
    const leafX = spreadAcross(box.x + 2, box.x + box.w - 2, 5);
    const drop = every(0.45, 0.6, (bullets) => {
      const x = twigX();
      bullets.push(new Shot({ x, y: box.y - 4, vx: rand(-28, 28), vy: rand(-10, 10), gravity: 95, art: 'tatterTwig', warn: 0.35 }));
    });
    const flutter = every(0.5, 0.7, (bullets) => {
      bullets.push(new Shot({ x: leafX(), y: box.y - 3, vy: rand(20, 28), art: 'tatterLeaf' }));
    });
    const leaves = [];
    return {
      duration: 6,
      update: (dt, bullets) => {
        const before = bullets.length;
        drop(dt, bullets);
        flutter(dt, bullets);
        for (let i = before; i < bullets.length; i++) if (bullets[i].artName === 'tatterLeaf') leaves.push(bullets[i]);
        // Leaves rock from side to side as they come down.
        for (const leaf of leaves) leaf.vx = Math.sin(leaf.age * 3 + leaf.y * 0.05) * 22;
      },
    };
  },

  // The whirlwind: the box turns, carrying you round its eye, and rings of
  // leaves burst out of the eye with a gap in each. The gap's where the wind
  // is taking you, so go with it.
  tatterWhirl(box, density, { Shot, every, rand, angleTo }) {
    const c = centre(box);
    const way = Math.random() < 0.5 ? 1 : -1;
    const COUNT = 14;
    const burst = every(1.1, 1.3, (bullets, soul) => {
      // The gap opens a little ahead of you, round the way you're being carried.
      const gapAt = angleTo(c, soul) + way * rand(0.3, 0.6);
      for (let i = 0; i < COUNT; i++) {
        const a = gapAt + (i / COUNT) * Math.PI * 2;
        if (i === 0 || i === 1 || i === COUNT - 1) continue;
        bullets.push(new Shot({ x: c.x + Math.cos(a) * 3, y: c.y + Math.sin(a) * 3, vx: Math.cos(a) * 36, vy: Math.sin(a) * 36, art: 'tatterLeaf', warn: 0.35 }));
      }
    }, { first: 0.6 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        burst(dt, bullets, soul);
        // Carried round the eye, gently.
        const dx = soul.x - c.x;
        const dy = soul.y - c.y;
        const r = Math.hypot(dx, dy);
        if (r > 2) {
          soul.x += (-dy / r) * way * 24 * dt;
          soul.y += (dx / r) * way * 24 * dt;
        }
      },
    };
  },
};
