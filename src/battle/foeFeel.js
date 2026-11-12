// How a monster feels to fight, beyond its clips: little themed bits on the
// stage when it's hit, when it winds up an attack, while it idles, and when
// it's beaten, and how it leaves the stage once its death clip has played.
// All of it is set by an enemy's `feel` (in src/data/enemies/<id>.js) and
// drawn with the battle's StageBits (stageBits.js), so it costs a handful of
// little rects a frame and nothing at all for an enemy without a `feel`.
//
//   feel: {
//     hit: 'shell',       // what flies off it when it's struck (HIT below)
//     windup: 'glint',    // a tell as its attack starts (WINDUP below)
//     idle: 'drip',       // bits it gives off while it stands there (IDLE below)
//     defeat: 'splash',   // its themed burst as it's beaten (DEFEAT below)
//     defeatAt: 1,        // (seconds into its death clip the burst goes off, if not at once:
//                         // a jelly pops at the end of its swelling)
//     exit: 'sink',       // how it leaves once its death has played (exitPose)
//     at: [0.2, 0.4],     // where on it (fractions of its sprite) a windup tell
//                         // shows: the claw, the bell, the mouth
//     color: '#a8e0e8',   // the colour of its drips, sparks or bubbles, if not the usual
//   }
//
// Nothing here touches the attacks, the soul or any numbers.

const SCALE = 2;
// Its own little random source (not Math.random), so these looks never shift
// the dice the attacks, damage and drops roll, or the seeded attack checks.
let seed = 0x5eed;
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rand = (a, b) => a + random() * (b - a);
const pick = (list) => list[Math.floor(random() * list.length)];

// Where on the stage a point of the foe is (fractions of its sprite).
function spot(foe, fx, fy) {
  return { x: foe.pos.x + foe.sprite.width * SCALE * fx, y: foe.pos.y + foe.sprite.height * SCALE * fy };
}
const feet = (foe) => foe.pos.y + foe.sprite.height * SCALE - 4;
const middle = (foe) => spot(foe, 0.5, 0.5);

function droplets(bits, x, y, n, colors, { speed = 80, up = 70, gravity = 320, life = 0.7 } = {}) {
  for (let i = 0; i < n; i++) {
    bits.spark(x + rand(-4, 4), y + rand(-3, 3), { vx: rand(-1, 1) * speed, vy: -rand(0.4, 1) * up, gravity, life: rand(0.6, 1) * life, color: pick(colors), size: random() < 0.3 ? 2 : 1 });
  }
}
// Little flakes that drift down slowly, rocking (feathers, ash, salt).
function flakes(bits, x, y, n, colors, { spread = 30, life = 1.4 } = {}) {
  for (let i = 0; i < n; i++) {
    bits.spark(x + rand(-spread, spread) * 0.5, y + rand(-8, 8), { vx: rand(-30, 30), vy: -rand(10, 40), gravity: 50, life: rand(0.7, 1) * life, color: pick(colors), size: 2 });
  }
}
function shards(bits, x, y, n, colors, floor) {
  for (let i = 0; i < n; i++) {
    bits.chip(x + rand(-6, 6), y + rand(-6, 6), { vx: rand(-90, 90), vy: -rand(60, 150), color: pick(colors), w: rand(2, 4), h: 2, floor: floor + rand(-2, 3), life: rand(1.2, 1.8), rot: rand(0, Math.PI * 2) });
  }
}
// Short bright streaks flying out of a point (a clack, a clang).
function streaks(bits, x, y, n, color, speed = 160) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    bits.spark(x, y, { vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, gravity: 0, life: rand(0.12, 0.2), color, size: 2 });
  }
}

// ---------- hit ----------
// Struck, at its middle (a little off, so two hits don't look the same).
const HIT = {
  // A hard shell: a sharp clack, white streaks, grit.
  shell(bits, foe) {
    const { x, y } = middle(foe);
    bits.star(x + rand(-6, 6), y + rand(-6, 6), { size: 8, life: 0.12 });
    streaks(bits, x, y, 5, '#ffffff', 190);
    shards(bits, x, y, 2, ['#9aa4a8', '#d8d4c4'], feet(foe));
  },
  // Fine china: white and willow-blue chips that skitter and settle.
  china(bits, foe) {
    const { x, y } = middle(foe);
    bits.star(x, y, { size: 7, life: 0.1 });
    shards(bits, x, y, 4, ['#f4eedb', '#ffffff', '#4f7fc8', '#cfc7ac'], feet(foe));
  },
  // Wet: a splash of drops.
  splash(bits, foe, color) {
    const { x, y } = middle(foe);
    droplets(bits, x, y, 8, [color ?? '#bfe8ec', '#ffffff', '#7cc0cc']);
  },
  // Jelly: it wobbles, a squashed ring and a few beads of slime.
  jelly(bits, foe, color) {
    const { x, y } = middle(foe);
    bits.ring(x, y, { speed: 70, life: 0.25, color: color ?? '#e8c8ff', width: 2, squash: 0.45 });
    droplets(bits, x, y, 5, [color ?? '#d8b8f8', '#ffffff', '#9ab4f0'], { speed: 60, up: 60 });
  },
  // Sand: a puff and grains falling.
  sand(bits, foe) {
    const { x, y } = middle(foe);
    for (let i = 0; i < 3; i++) bits.puff(x + rand(-8, 8), y + rand(-4, 6), { vx: rand(-30, 30), vy: -rand(5, 20), r: 3, grow: 9, life: 0.45, color: '#e8d29c' });
    droplets(bits, x, y, 6, ['#e8d29c', '#cdb680', '#f4e2b0'], { speed: 50, up: 40, gravity: 300 });
  },
  // Feathers knocked loose, floating down.
  feather(bits, foe, color) {
    const { x, y } = middle(foe);
    bits.star(x, y, { size: 6, life: 0.1 });
    flakes(bits, x, y, 4, [color ?? '#ffffff', '#d8dce0', '#ffffff']);
  },
  // A bell: a ring of sound going out, and a gold spark or two.
  bell(bits, foe) {
    const { x, y } = spot(foe, 0.5, 0.3);
    bits.ring(x, y, { speed: 110, life: 0.35, color: '#ffe8a0', width: 1 });
    streaks(bits, x, y, 3, '#ffe27a', 130);
  },
  // Electric: a crackle of yellow and white.
  zap(bits, foe) {
    const { x, y } = middle(foe);
    bits.star(x, y, { size: 9, life: 0.1 });
    streaks(bits, x, y, 6, pick(['#fff27a', '#ffffff']), 210);
  },
  // A ghost: it frays, pale wisps lifting off.
  ghost(bits, foe, color) {
    const { x, y } = middle(foe);
    for (let i = 0; i < 4; i++) bits.mote(x + rand(-12, 12), y + rand(-10, 10), { vy: -rand(18, 34), life: rand(0.6, 0.9), color: color ?? '#d8fff4', sway: rand(0, Math.PI * 2) });
    bits.puff(x, y, { r: 4, grow: 10, life: 0.35, color: color ?? '#c8f0e8' });
  },
  // Brass and iron: a clank, orange sparks off the metal.
  brass(bits, foe) {
    const { x, y } = spot(foe, 0.5, 0.35);
    bits.star(x, y, { size: 8, life: 0.12 });
    for (let i = 0; i < 6; i++) bits.spark(x, y, { vx: rand(-120, 120), vy: -rand(40, 140), gravity: 380, life: rand(0.25, 0.45), color: pick(['#ffd070', '#ff9a40', '#ffffff']), size: 1 });
  },
  // Spines shaken loose.
  spines(bits, foe, color) {
    const { x, y } = middle(foe);
    streaks(bits, x, y, 6, color ?? '#e8a8f0', 150);
  },
  // Weed and water: green bits and drops.
  kelp(bits, foe) {
    const { x, y } = middle(foe);
    droplets(bits, x, y, 5, ['#bfe8ec', '#ffffff']);
    shards(bits, x, y, 2, ['#7ab040', '#4a8a30'], feet(foe));
  },
  // Wool, fluff, petals: soft and light.
  fluff(bits, foe, color) {
    const { x, y } = middle(foe);
    flakes(bits, x, y, 5, [color ?? '#ffffff', '#f4f0e0']);
  },
};

// ---------- windup ----------
// As its attack starts: a tell at its `at` point.
const WINDUP = {
  // A glint on the claw, the blade, the spines.
  glint(bits, foe) {
    const [fx, fy] = foe.data.feel.at ?? [0.5, 0.3];
    const { x, y } = spot(foe, fx, fy);
    bits.star(x, y, { size: 11, life: 0.3 });
  },
  // Sparks gathering in: it's charging up.
  charge(bits, foe, color) {
    const [fx, fy] = foe.data.feel.at ?? [0.5, 0.5];
    const { x, y } = spot(foe, fx, fy);
    for (let i = 0; i < 7; i++) {
      const a = rand(0, Math.PI * 2);
      const r = rand(18, 28);
      bits.spark(x + Math.cos(a) * r, y + Math.sin(a) * r, { vx: -Math.cos(a) * r * 3.2, vy: -Math.sin(a) * r * 3.2, gravity: 0, life: 0.3, color: color ?? '#fff27a', size: 1 });
    }
  },
  // A note going out (the bell tolls once before it starts).
  toll(bits, foe) {
    const [fx, fy] = foe.data.feel.at ?? [0.5, 0.3];
    const { x, y } = spot(foe, fx, fy);
    bits.ring(x, y, { speed: 80, life: 0.5, color: '#ffe8a0', width: 1 });
  },
  // A splash at its feet: it stamps or thrashes.
  stamp(bits, foe, color) {
    const [fx] = foe.data.feel.at ?? [0.5, 0.9];
    const x = foe.pos.x + foe.sprite.width * SCALE * fx;
    droplets(bits, x, feet(foe), 6, [color ?? '#bfe8ec', '#ffffff'], { speed: 60, up: 90 });
  },
  // Dust kicked up as it braces.
  dust(bits, foe) {
    bits.dust(foe.pos.x + foe.sprite.width, feet(foe) + 2, foe.sprite.width * 1.4, 6, { color: '#cbbf98', random });
  },
};

// ---------- idle ----------
// How many a second, and what each one is.
const IDLE = {
  // Water dripping off it.
  drip: [1.4, (bits, foe, color) => {
    const { x, y } = spot(foe, rand(0.3, 0.7), rand(0.7, 0.9));
    bits.spark(x, y, { vx: 0, vy: 10, gravity: 280, life: 0.45, color: color ?? '#a8dce8', size: 1 });
  }],
  // Little static sparks crackling round it.
  static: [2.5, (bits, foe, color) => {
    const { x, y } = spot(foe, rand(0.15, 0.85), rand(0.2, 0.8));
    bits.spark(x, y, { vx: rand(-40, 40), vy: rand(-40, 20), gravity: 0, life: 0.12, color: color ?? '#fff27a', size: 1 });
  }],
  // Bubbles rising off it.
  bubbles: [1.2, (bits, foe, color) => {
    const [fx, fy] = foe.data.feel.at ?? [0.5, 0.2];
    const { x, y } = spot(foe, fx + rand(-0.08, 0.08), fy);
    bits.mote(x, y, { vy: -rand(18, 30), life: rand(0.9, 1.3), color: color ?? '#bfe8f4', size: 1, sway: rand(0, Math.PI * 2) });
  }],
  // Grains trickling off it.
  sand: [1.6, (bits, foe) => {
    const { x, y } = spot(foe, rand(0.25, 0.75), rand(0.35, 0.75));
    bits.spark(x, y, { vx: rand(-6, 6), vy: 0, gravity: 220, life: 0.35, color: pick(['#e8d29c', '#cdb680']), size: 1 });
  }],
  // Pale glimmers coming off a ghost.
  wisps: [1.6, (bits, foe, color) => {
    const { x, y } = spot(foe, rand(0.2, 0.8), rand(0.5, 0.95));
    bits.mote(x, y, { vy: -rand(10, 20), life: rand(0.8, 1.2), color: color ?? '#d8fff4', size: 1, sway: rand(0, Math.PI * 2) });
  }],
  // Now and then a feather drifting off.
  feather: [0.35, (bits, foe, color) => {
    const { x, y } = spot(foe, rand(0.3, 0.7), rand(0.3, 0.6));
    bits.spark(x, y, { vx: rand(-20, 20), vy: -10, gravity: 30, life: 1.3, color: color ?? '#ffffff', size: 2 });
  }],
  // Spores or pollen or seeds, slowly.
  motes: [1, (bits, foe, color) => {
    const { x, y } = spot(foe, rand(0.2, 0.8), rand(0.2, 0.6));
    bits.mote(x, y, { vy: -rand(8, 16), life: 1.2, color: color ?? '#fff2cf', size: 1, sway: rand(0, Math.PI * 2) });
  }],
};

// ---------- defeat ----------
// Beaten: its themed burst, on top of the battle's own flash.
const DEFEAT = {
  // A jelly bursts: rings, and slime everywhere.
  pop(bits, foe, color) {
    const { x, y } = middle(foe);
    bits.ring(x, y, { speed: 150, life: 0.35, color: '#ffffff', width: 2 });
    bits.ring(x, y, { speed: 90, life: 0.5, color: color ?? '#e8c8ff', width: 2, squash: 0.7 });
    droplets(bits, x, y, 18, [color ?? '#d8b8f8', '#ffffff', '#9ab4f0', '#bfe8f4'], { speed: 140, up: 110, life: 0.9 });
  },
  // Down into the water with a splash.
  splash(bits, foe, color) {
    const x = foe.center.x;
    const y = feet(foe);
    droplets(bits, x, y, 16, [color ?? '#bfe8ec', '#ffffff', '#7cc0cc'], { speed: 70, up: 170, gravity: 360, life: 1 });
    bits.ring(x, y, { speed: 70, life: 0.7, color: '#d8f4f4', width: 1, squash: 0.25 });
  },
  // China smashing.
  shards(bits, foe) {
    const { x, y } = middle(foe);
    shards(bits, x, y, 10, ['#f4eedb', '#ffffff', '#4f7fc8', '#cfc7ac', '#e0673a'], feet(foe));
  },
  // A shell knocked loose: it clatters down and rocks to a stop.
  clatter(bits, foe, color) {
    const { x, y } = middle(foe);
    streaks(bits, x, y, 6, '#ffffff', 170);
    shards(bits, x, y, 6, [color ?? '#b8b0a0', '#8a8478', '#e8e0d0'], feet(foe));
  },
  // Sand slumping down in a cloud.
  sand(bits, foe) {
    bits.dust(foe.center.x, feet(foe), foe.sprite.width * 1.6, 14, { color: '#e8d29c', random });
    droplets(bits, foe.center.x, foe.center.y, 10, ['#e8d29c', '#cdb680', '#f4e2b0'], { speed: 70, up: 50 });
  },
  // A burst of feathers floating down.
  feathers(bits, foe, color) {
    const { x, y } = middle(foe);
    flakes(bits, x, y, 14, [color ?? '#ffffff', '#d8dce0', '#ffffff', '#c8ccd2'], { spread: 50, life: 1.8 });
  },
  // Bubbles going up from where it stood.
  bubbles(bits, foe, color) {
    for (let i = 0; i < 12; i++) bits.mote(foe.center.x + rand(-18, 18), feet(foe) - rand(0, 30), { vy: -rand(20, 45), life: rand(1, 1.6), color: color ?? '#bfe8f4', size: random() < 0.3 ? 2 : 1, sway: rand(0, Math.PI * 2) });
  },
  // A storm cloud rains itself out.
  rainout(bits, foe) {
    for (let i = 0; i < 22; i++) {
      const x = foe.center.x + rand(-24, 24);
      bits.spark(x, foe.center.y + rand(-6, 10), { vx: -8, vy: rand(60, 160), gravity: 300, life: rand(0.5, 1.1), color: pick(['#a8d8f0', '#d8f0ff', '#7ab0d0']), size: 1 });
    }
    streaks(bits, foe.center.x, foe.center.y, 5, '#fff27a', 140);
  },
  // A ghost lets go: a pale ring and the light going up out of it.
  ghost(bits, foe, color) {
    const { x, y } = middle(foe);
    bits.ring(x, y, { speed: 60, life: 0.8, color: color ?? '#d8fff4', width: 1 });
    for (let i = 0; i < 12; i++) bits.mote(x + rand(-16, 16), y + rand(-20, 20), { vy: -rand(20, 40), life: rand(1, 1.6), color: color ?? '#d8fff4', sway: rand(0, Math.PI * 2) });
  },
  // A bell's last clang, and it goes down with a splash.
  clang(bits, foe) {
    const { x, y } = spot(foe, 0.5, 0.3);
    bits.ring(x, y, { speed: 120, life: 0.6, color: '#ffe8a0', width: 2 });
    bits.ring(x, y, { speed: 70, life: 0.9, color: '#ffe8a0', width: 1 });
    DEFEAT.splash(bits, foe);
  },
  // Spines flying everywhere.
  spines(bits, foe, color) {
    const { x, y } = middle(foe);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      bits.spark(x, y, { vx: Math.cos(a) * 130, vy: Math.sin(a) * 130 - 30, gravity: 260, life: 0.8, color: color ?? '#e8a8f0', size: 2 });
    }
  },
  // A last crackle and fizzle.
  fizzle(bits, foe) {
    const { x, y } = middle(foe);
    streaks(bits, x, y, 10, '#fff27a', 200);
    DEFEAT.splash(bits, foe);
  },
  // Brass and bubbles: an old suit going down.
  diver(bits, foe) {
    const { x, y } = spot(foe, 0.5, 0.3);
    streaks(bits, x, y, 5, '#ffd070', 150);
    DEFEAT.bubbles(bits, foe);
  },
  // Soft things, puffing apart.
  fluff(bits, foe, color) {
    const { x, y } = middle(foe);
    flakes(bits, x, y, 14, [color ?? '#ffffff', '#f4f0e0', '#e8e4d4'], { spread: 50, life: 1.8 });
  },
};

export function feelHit(battle, foe) {
  const kind = foe.data.feel?.hit;
  if (kind && HIT[kind]) HIT[kind](battle.bits, foe, foe.data.feel.color);
}

export function feelWindup(battle, foe) {
  const kind = foe.data.feel?.windup;
  if (kind && WINDUP[kind] && foe.state === 'active') WINDUP[kind](battle.bits, foe, foe.data.feel.color);
}

// Returns whether it has its own burst (the battle then skips its generic scatter of sparks).
export function feelDefeat(battle, foe) {
  const kind = foe.data.feel?.defeat;
  if (!kind || !DEFEAT[kind]) return false;
  if (foe.data.feel.defeatAt) foe.burstAt = battle.time + foe.data.feel.defeatAt;
  else DEFEAT[kind](battle.bits, foe, foe.data.feel.color);
  return true;
}

// Every frame: its idle bits while it stands there (not mid-death), and a
// late defeat burst when it's due.
export function feelTick(battle, foe, dt) {
  const feel = foe.data.feel;
  if (!feel) return;
  if (foe.burstAt && battle.time >= foe.burstAt) {
    foe.burstAt = 0;
    DEFEAT[feel.defeat](battle.bits, foe, feel.color);
  }
  if (foe.state !== 'active' || !IDLE[feel.idle]) return;
  const [rate, emit] = IDLE[feel.idle];
  if (random() < rate * dt) emit(battle.bits, foe, feel.color);
}

// How it leaves once its death clip has played, `gone` seconds after (it
// fades over FOE_FADE_SECONDS meanwhile). Null: no move. `{ gone: true }`: it
// isn't drawn any more (a jelly that's popped).
//   sink     settles down into the water
//   scuttle  hurries off to the right on its legs
//   roll     rolls away off to the right
//   drop     falls
//   float    drifts up and away (a ghost)
//   pop      gone at once
export function exitPose(foe, gone) {
  switch (foe.data.feel?.exit) {
    case 'sink': return { dx: 0, dy: Math.round(gone * 26), alpha: 1 - gone };
    case 'scuttle': return { dx: Math.round(gone * gone * 160 + gone * 30), dy: -Math.round(Math.abs(Math.sin(gone * 30)) * 2), alpha: 1 - gone * 0.6 };
    case 'roll': return { dx: Math.round(gone * gone * 140 + gone * 20), dy: 0, alpha: 1 - gone * 0.5, turn: gone * 7 };
    case 'drop': return { dx: 0, dy: Math.round(gone * gone * 220), alpha: 1 - gone * 0.5 };
    case 'float': return { dx: Math.round(Math.sin(gone * 4) * 3), dy: -Math.round(gone * 28), alpha: 1 - gone };
    case 'pop': return { gone: true };
    default: return null;
  }
}
