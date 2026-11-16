import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { ENEMIES } from '../data/enemies/index.js';
import { sfx } from '../audio/music.js';
import { HIDEOUTS, hideoutSprite, drawHideout, burst, updateBits, drawBits } from './hideouts.js';
import { followTide, drawSurfacing, followNoise } from './monsterHabits.js';

const SPEED = 18; // pixels per second
const TOUCH_DISTANCE = 16;
// After you run from a fight, the enemy blinks and ignores you this long.
const COOLDOWN_SECONDS = 2.5;

// How each enemy moves around a room, picked in the Room Editor. `patrol` is
// the leftmost and rightmost tile for the ones that walk.
export const BEHAVIOURS = {
  patrol: 'Walks back and forth',
  still: 'Stays put',
  wander: 'Wanders about',
  chase: 'Chases you when it sees you',
  ambush: 'Hides, jumps out, then chases',
  pounce: 'Hides, then pounces on you',
  disguise: 'In disguise, then pounces',
  burrow: 'Buried (sand, water, leaves), bursts up, then pounces',
  drop: 'Up overhead, drops down on you',
};
// Behaviours that start out hidden or disguised, waiting for you to come close.
const LURKING = new Set(['ambush', 'pounce', 'disguise', 'burrow', 'drop']);

// Hidden and disguised enemies spring when you come within this many tiles,
// from any side. A room can set its own `reach` for each one.
export const DEFAULT_REACH = { ambush: 2, pounce: 4, disguise: 4, burrow: 3, drop: 2.5 };
// Chasers notice you from this far away.
const SIGHT_DISTANCE = 64;
// Leaping out: an ambusher hops this far to the side. A pouncer makes a big,
// high leap that homes in on you while it's in the air.
const LEAP_DISTANCE = 20;
const LEAP_SECONDS = 0.45;
const LEAP_HEIGHT = 14;
const POUNCE_SECONDS = 0.65;
const POUNCE_HEIGHT = 30;
// Bursting up out of the ground (`burrow`): it rises out of it this long, then pounces.
const RISE_SECONDS = 0.3;
// Dropping from overhead (`drop`): a moment's warning (a shadow on the floor
// where you stand, a "!"), then it falls from this high. It lands where you
// were, so keep moving and it misses, and chases you instead.
const DROP_WARN_SECONDS = 0.35;
const DROP_SECONDS = 0.4;
const DROP_HEIGHT = 80;
// Chasing is slower than walking, so you can always get away.
const CHASE_SPEED = 40;
// The "!" shows this long after they spot you.
const ALERT_SECONDS = 0.9;
// Hidden ones lean out to peek now and then, so a sharp eye can spot them.
const PEEK_EVERY_SECONDS = 3.5;
const PEEK_SECONDS = 0.5;
const PEEK_DISTANCE = 5;
// A disguise mostly shows its first frame; the others (a tongue flick, a
// blink) flash by this often, for this long.
const TELL_EVERY_SECONDS = 2.6;
const TELL_SECONDS = 0.35;
// Catching you: it rears back, then throws itself at you, this far and this
// high, over this long (see Npc.pounceOn, and the battle's lead-in in
// OverworldScene).
const LUNGE_SECONDS = 0.34;
const LUNGE_REACH = 7;
const LUNGE_HOP = 5;
// How each kind of enemy gets about (its `gait`, in its file in
// src/data/enemies/), for when it's out walking in a room. `cycle` is one
// stride in seconds, `moving` the share of it spent moving (and `pace` how
// fast, as a multiple of the usual speed; the rest is a pause), `height` how
// high a hop goes, in pixels. Drawing is in Npc.drawBody.
//   walk    the usual: a gentle bob
//   fly     hovers well off the ground, bobbing, its shadow below
//   hop     little hops with a pause between (the bunny)
//   bound   big leaps and longer pauses (the craghorn, a goat)
//   roll    tumbles over and over as it goes (boulders: the stone golem)
//   stomp   heavy shuffles that thud down (stone steps, the pillar)
//   ooze    slow, squashing and stretching like a heap of snow (the frostbite)
//   dash    darts, then freezes (the glintling)
//   swing   rocks back and forth like a hanging ring (the ringer)
//   float   drifts, and flickers (the shade)
//   waddle  rocks side to side as it walks (the dummy, the waxling)
export const GAITS = {
  walk: { cycle: 1, moving: 1, pace: 1 },
  fly: { cycle: 1, moving: 1, pace: 1.1 },
  hop: { cycle: 0.7, moving: 0.45, pace: 1.8, height: 6 },
  bound: { cycle: 1.2, moving: 0.5, pace: 2.2, height: 12 },
  roll: { cycle: 1, moving: 1, pace: 1 },
  stomp: { cycle: 0.7, moving: 0.3, pace: 2.6, height: 3 },
  ooze: { cycle: 1, moving: 1, pace: 0.65 },
  dash: { cycle: 1.5, moving: 0.25, pace: 4 },
  swing: { cycle: 1, moving: 1, pace: 0.9 },
  float: { cycle: 1, moving: 1, pace: 0.8 },
  waddle: { cycle: 1, moving: 1, pace: 0.9 },
};

// Wanderers pause between strolls, and stay within this many tiles up or down.
const WANDER_PAUSE = [0.8, 2.2];
// Held up this long by something in the way (seconds), it tries another way:
// a new spot to wander to, or round the side of it in a chase.
const STUCK_SECONDS = 0.4;
const DETOUR_SECONDS = 0.7;
const WANDER_RANGE_Y = 1.5;

// The feet-level box used to keep a moving enemy out of walls.
const BODY_HALF_WIDTH = 5;
const BODY_HEIGHT = 5;

const rand = (min, max) => min + Math.random() * (max - min);

// The biggest an enemy is drawn out in a room, in pixels, either way.
const OVERWORLD_MAX = 30;

// Battle art made smaller for a room, staying crisp: each new pixel takes the
// colour most of its patch of the old art has (empty if most of it is empty),
// and at an edge, where the patch is part empty, its outline (k) if it has one,
// so the outline doesn't break up. Art that already fits comes back as it is.
function shrinkRows(rows, palette, max) {
  const w = Math.max(...rows.map((row) => row.length));
  const h = rows.length;
  const scale = Math.min(1, max / Math.max(w, h));
  if (scale >= 1) return rows;
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));
  const out = [];
  for (let ty = 0; ty < th; ty++) {
    let line = '';
    for (let tx = 0; tx < tw; tx++) {
      const counts = new Map();
      let empty = 0;
      let total = 0;
      for (let y = Math.floor((ty * h) / th); y < Math.max(Math.floor((ty * h) / th) + 1, Math.floor(((ty + 1) * h) / th)); y++) {
        for (let x = Math.floor((tx * w) / tw); x < Math.max(Math.floor((tx * w) / tw) + 1, Math.floor(((tx + 1) * w) / tw)); x++) {
          const char = rows[y]?.[x];
          total++;
          if (!char || !palette[char]) empty++;
          else counts.set(char, (counts.get(char) ?? 0) + 1);
        }
      }
      if (empty * 2 > total || !counts.size) line += '.';
      else if (empty && counts.has('k')) line += 'k';
      else line += [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }
    out.push(line);
  }
  return out;
}

// An enemy out in a room. Touching it starts a battle. How it moves is its
// `behaviour` (see BEHAVIOURS); older rooms may say `ambush: true` instead.
// `reach` is how many tiles away a hidden or disguised one springs from.
export class Npc {
  // `art` is optional: by default the enemy looks like its own battle sprite.
  constructor({ art, enemy, x, y, patrol, behaviour, ambush = false, reach = null, look = null, lantern = null, chaseSpeed = null, sight = null, dormant = false, quiet = false, name = null, tide = null, hears = null }) {
    const source = ENEMIES[art] ?? ENEMIES[enemy];
    if (!source) throw new Error(`Unknown enemy '${enemy}' in a room's npcs`);
    const { rows, palette } = source.sprite;
    // Out in a room nobody is bigger than OVERWORLD_MAX pixels across or tall
    // (about two tiles): bigger battle art is shrunk for the room (see shrinkRows).
    this.sprite = makeSprite(shrinkRows(rows, palette, OVERWORLD_MAX), palette);
    this.enemy = enemy;
    // How it gets about (GAITS): its own way of walking.
    this.gait = GAITS[ENEMIES[enemy]?.gait] ? ENEMIES[enemy].gait : 'walk';
    // Whether it moves through water (`swims: true` in the enemy's data).
    this.swims = Boolean(ENEMIES[enemy]?.swims);
    // How far into its stride it is, how far it's rolled, and whether it moved this frame.
    this.stride = Math.random();
    this.roll = 0;
    this.moving = false;
    this.behaviour = behaviour ?? (ambush ? 'ambush' : 'patrol');
    if (!BEHAVIOURS[this.behaviour]) throw new Error(`Unknown behaviour '${this.behaviour}' for ${enemy}`);
    // A disguised enemy wears its `disguise` art if it has some (see columneon.js).
    const disguise = ENEMIES[enemy]?.disguise;
    this.disguiseFrames = disguise?.frames.map((frame) => makeSprite(frame, disguise.palette)) ?? null;
    // Or a hiding place the room gives it (`look`, see hideouts.js): scenery to
    // pass for, or what shows of it while it's buried or up overhead.
    if (look && !HIDEOUTS[look]) throw new Error(`Unknown hiding place '${look}' for ${enemy}`);
    this.look = look ? HIDEOUTS[look] : null;
    this.lookSprite = this.look ? hideoutSprite(this.look, this.sprite) : null;
    // What flies out of its hiding place as it goes (hideouts.js `burst`).
    this.bits = [];

    // Like the player, (x, y) is the point under the feet.
    this.x = (x + 0.5) * T;
    this.y = (y + 1) * T;
    this.homeY = this.y;
    this.homeX = this.x;
    this.minX = (patrol[0] + 0.5) * T;
    this.maxX = (patrol[1] + 0.5) * T;
    this.direction = 1;
    this.time = Math.random() * 10;
    this.cooldown = 0;

    // The ghost ship (haunt.js): what a lantern's light does to it ('freeze' it, make it 'flee', or
    // it is 'unseen' outside the light), how fast it chases and how far it notices you.
    this.lantern = lantern;
    this.chaseSpeed = chaseSpeed;
    this.sightDistance = sight;
    this.frozen = false;
    this.ghostAlpha = null;
    // Waiting where it stands until a scene wakes it (haunt.js `wake`); `quiet` skips the ambush sting.
    this.dormant = dormant;
    this.quiet = quiet;
    this.name = name;
    // Out of the water only at this tide (monsterHabits.js `tide`): `surface` is how far up it is, 0 to 1.
    this.tideWhen = tide;
    this.surface = null;
    // Goes to look when something in the room makes a noise (monsterHabits.js `hears`): `heard` is where and what it is doing about it.
    this.hears = hears;
    this.heard = null;
    this.lurking = LURKING.has(this.behaviour);
    this.springDistance = (reach ?? DEFAULT_REACH[this.behaviour] ?? 0) * T;
    this.peekSide = Math.random() < 0.5 ? -1 : 1;
    this.leap = null;
    this.chasing = false;
    this.alert = 0;
    this.wander = { target: null, pause: rand(...WANDER_PAUSE) };
  }

  // A sleeper told to start (a scene's `haunt` step): it comes for you.
  wake() {
    this.dormant = false;
    this.alert = ALERT_SECONDS;
    this.chasing = true;
  }

  startCooldown() {
    this.cooldown = COOLDOWN_SECONDS;
    this.lunge = null;
  }

  // It's caught you: a "!" (if it hadn't already seen you), and it lunges.
  pounceOn(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const surprised = this.alert <= 0;
    this.alert = ALERT_SECONDS;
    // Still hiding when a fight starts beside it: out it comes to join in.
    if (this.lurking) {
      this.lurking = false;
      if (this.look) this.bits = burst(this.look, this.x, this.y - 4);
    }
    // Dropped in or out of the ground mid-way: it joins in from where it is.
    if (this.leap?.kind) this.leap = null;
    this.lunge = { t: 0, dx: dx / d, dy: dy / d };
    return surprised;
  }

  // How far along its lunge it is: back a pixel or two, then at you, then
  // it holds there, right up against you.
  lungeOffset() {
    if (!this.lunge) return { x: 0, y: 0, lift: 0 };
    const k = Math.min(1, this.lunge.t / LUNGE_SECONDS);
    const reach = k < 0.3 ? -2 * (k / 0.3) : -2 + (LUNGE_REACH + 2) * Math.min(1, (k - 0.3) / 0.4);
    const lift = k < 0.3 ? 0 : Math.round(Math.sin(Math.min(1, (k - 0.3) / 0.7) * Math.PI) * LUNGE_HOP);
    return { x: Math.round(this.lunge.dx * reach), y: Math.round(this.lunge.dy * reach), lift };
  }

  get sortY() {
    return this.y;
  }

  // How fast it's going right now, as a multiple of its speed: hoppers and
  // darters move in bursts with pauses between, oozers slowly, and so on.
  pace(dt) {
    const gait = GAITS[this.gait];
    this.stride = (this.stride + dt / gait.cycle) % 1;
    return this.stride < gait.moving ? gait.pace : 0;
  }

  update(dt, player, room) {
    if (this.bits.length) this.bits = updateBits(this.bits, dt);
    // Rising and sinking with the tide (monsterHabits.js): under or part way up, it just waits.
    if (this.tideWhen) {
      followTide(this, dt, room);
      if (this.surface < 1) {
        this.time += dt;
        this.moving = false;
        return;
      }
    }
    // Flattened by a careening gun on the ghost ship (shipList.js): it lies there a while, harmless.
    if (this.stunned > 0) {
      this.stunned = Math.max(0, this.stunned - dt);
      this.time += dt;
      this.moving = false;
      return;
    }
    if (this.lunge) {
      this.lunge.t += dt;
      this.time += dt;
      this.alert = Math.max(0, this.alert - dt);
      return;
    }
    const before = { x: this.x, y: this.y };
    this.updateMovement(dt, player, room);
    const moved = Math.hypot(this.x - before.x, this.y - before.y);
    this.moving = moved > 0.01;
    // A roller turns over as it goes: once round for every lap of its edge.
    if (this.gait === 'roll' && this.moving) this.roll += (moved / Math.max(4, this.sprite.width / 2)) * Math.sign(this.x - before.x || 1);
  }

  updateMovement(dt, player, room) {
    this.time += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.alert = Math.max(0, this.alert - dt);
    const distance = Math.hypot(player.x - this.x, player.y - this.y);
    // Held still in a lantern's light (haunt.js).
    if (this.frozen || this.dormant) return;

    if (this.lurking) {
      if (distance < this.springDistance) this.spring(player, room);
      return;
    }
    if (this.leap) {
      this.updateLeap(dt, player);
      // Landed in a wall (a pounce at you up against one): out to the nearest clear spot.
      if (!this.leap) this.unstick(room);
      return;
    }
    if (this.chasing) {
      this.unstick(room);
      if (this.cooldown <= 0) this.chase(dt, player, room);
      return;
    }

    // Off to see what the noise was (monsterHabits.js `hears`); a monster that has seen you comes first.
    if (this.hears && this.heard && followNoise(this, dt, room)) return;
    if (this.behaviour === 'chase' && distance < (this.sightDistance ?? SIGHT_DISTANCE) && this.cooldown <= 0) {
      this.alert = ALERT_SECONDS;
      sfx(this.quiet ? 'creak' : 'ambush');
      this.chasing = true;
    } else if (this.behaviour === 'chase' && Math.hypot(this.x - this.homeX, this.y - this.homeY) > 3) {
      // Lost you (the ghost ship's hiding places, haunt.js): back to his post, slowly, looking.
      const speed = this.chaseSpeed;
      this.chaseSpeed = (speed ?? CHASE_SPEED) * 0.55;
      this.chase(dt, { x: this.homeX, y: this.homeY }, room);
      this.chaseSpeed = speed;
    } else if (this.behaviour === 'patrol' || this.behaviour === 'chase') {
      this.patrol(dt);
    } else if (this.behaviour === 'wander') {
      this.stroll(dt, room);
    }
  }

  patrol(dt) {
    this.x += this.direction * SPEED * this.pace(dt) * dt;
    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.direction = -1;
    } else if (this.x < this.minX) {
      this.x = this.minX;
      this.direction = 1;
    }
  }

  // Walks to a random nearby spot, pauses, and picks another.
  stroll(dt, room) {
    const wander = this.wander;
    if (!wander.target) {
      wander.pause -= dt;
      if (wander.pause > 0) return;
      wander.target = { x: rand(this.minX, this.maxX), y: this.homeY + rand(-WANDER_RANGE_Y, WANDER_RANGE_Y) * T };
    }
    const dx = wander.target.x - this.x;
    const dy = wander.target.y - this.y;
    const distance = Math.hypot(dx, dy);
    const speed = SPEED * this.pace(dt);
    if (distance < 1) {
      wander.target = null;
      wander.pause = rand(...WANDER_PAUSE);
      return;
    }
    // Blocked (pressed up against a tree, say) for a moment: give up on that
    // spot and pick another.
    const moved = speed > 0 && this.step(room, (dx / distance) * speed * dt, (dy / distance) * speed * dt);
    wander.blocked = speed > 0 && !moved ? (wander.blocked ?? 0) + dt : 0;
    if (wander.blocked > STUCK_SECONDS) {
      wander.target = null;
      wander.blocked = 0;
      wander.pause = rand(...WANDER_PAUSE);
    }
  }

  // Leaves its hiding place or drops its disguise. Ambushers hop out to the side
  // nearest you (or the other side, if that's blocked) and then give chase;
  // pouncers and the disguised leap right at you.
  spring(player, room) {
    this.lurking = false;
    this.alert = ALERT_SECONDS;
    if (this.look?.sound) sfx(this.look.sound);
    sfx('ambush');
    if (this.behaviour === 'burrow') {
      // Up out of the ground in a spray of whatever it was under, then at you.
      this.bits = burst(this.look, this.x, this.y);
      this.leap = { kind: 'rise', fromX: this.x, fromY: this.y, toX: this.x, toY: this.y, t: 0, seconds: RISE_SECONDS, height: 0 };
    } else if (this.behaviour === 'drop') {
      // It comes down where you are now.
      this.x = player.x;
      this.y = player.y;
      this.leap = { kind: 'drop', fromX: this.x, fromY: this.y, toX: this.x, toY: this.y, t: 0, seconds: DROP_WARN_SECONDS + DROP_SECONDS, height: DROP_HEIGHT };
    } else if (this.behaviour === 'ambush') {
      const toward = Math.sign(player.x - this.x) || this.peekSide;
      const down = Math.sign(player.y - this.y) * LEAP_DISTANCE * 0.6;
      const landing = [toward, -toward]
        .map((side) => ({ x: this.x + side * LEAP_DISTANCE, y: this.y + down }))
        .find((spot) => !this.blockedAt(room, spot.x, spot.y)) ?? { x: this.x, y: this.y };
      this.leap = { fromX: this.x, fromY: this.y, toX: landing.x, toY: landing.y, t: 0, seconds: LEAP_SECONDS, height: LEAP_HEIGHT };
    } else {
      // A disguise the room gave it flies apart as it goes.
      if (this.look) this.bits = burst(this.look, this.x, this.y - 4);
      this.leap = { fromX: this.x, fromY: this.y, toX: player.x, toY: player.y, t: 0, seconds: POUNCE_SECONDS, height: POUNCE_HEIGHT, homing: true };
    }
  }

  updateLeap(dt, player) {
    const leap = this.leap;
    if (leap.kind === 'rise') {
      leap.t += dt;
      if (leap.t >= leap.seconds) this.leap = { fromX: this.x, fromY: this.y, toX: player.x, toY: player.y, t: 0, seconds: POUNCE_SECONDS, height: POUNCE_HEIGHT, homing: true };
      return;
    }
    if (leap.kind === 'drop') {
      leap.t = Math.min(leap.seconds, leap.t + dt);
      if (leap.t >= leap.seconds) {
        // Down: a thump, and a puff of whatever was up there with it.
        this.leap = null;
        this.chasing = true;
        sfx(this.look?.land ?? 'land');
        this.bits = burst(this.look, this.x, this.y, 10);
      }
      return;
    }
    if (leap.homing) {
      leap.toX = player.x;
      leap.toY = player.y;
    }
    leap.t = Math.min(leap.seconds, leap.t + dt);
    const k = leap.t / leap.seconds;
    this.x = leap.fromX + (leap.toX - leap.fromX) * k;
    this.y = leap.fromY + (leap.toY - leap.fromY) * k;
    if (k >= 1) {
      // Landed: if you dodged the pounce, it chases you instead.
      this.leap = null;
      this.chasing = true;
    }
  }

  // A hunter (behaviour 'chase': the ghost ship's Bosun) goes round things, not at them: a breadth-first
  // search over the room's tiles to the one `to` is on, worked out again a few times a second. Returns the
  // middle of the next tile to make for, or null to head straight there (same tile, next door, or no way).
  waypoint(room, to) {
    const tx = Math.floor(this.x / T);
    const ty = Math.floor((this.y - 1) / T);
    const gx = Math.floor(to.x / T);
    const gy = Math.floor((to.y - 1) / T);
    if (Math.abs(tx - gx) + Math.abs(ty - gy) <= 1) return null;
    const key = `${tx},${ty}>${gx},${gy}`;
    this.pathAge = (this.pathAge ?? 0) + 1;
    if (this.pathKey !== key || this.pathAge > 20) {
      this.pathKey = key;
      this.pathAge = 0;
      this.path = this.findPath(room, tx, ty, gx, gy);
    }
    const next = this.path?.find(([x, y]) => !(x === tx && y === ty));
    return next ? { x: next[0] * T + T / 2, y: (next[1] + 1) * T - 4 } : null;
  }

  findPath(room, sx, sy, gx, gy) {
    const w = room.width;
    const h = room.height;
    const open = (x, y) => x >= 0 && y >= 0 && x < w && y < h && !this.blockedAt(room, x * T + T / 2, (y + 1) * T - 4);
    if (!open(gx, gy)) return null;
    const from = new Map([[`${sx},${sy}`, null]]);
    const queue = [[sx, sy]];
    for (let i = 0; i < queue.length && i < 4000; i++) {
      const [x, y] = queue[i];
      if (x === gx && y === gy) {
        const path = [];
        for (let k = `${x},${y}`; k; k = from.get(k)) path.unshift(k.split(',').map(Number));
        return path;
      }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        const k = `${nx},${ny}`;
        if (from.has(k) || !open(nx, ny)) continue;
        from.set(k, `${x},${y}`);
        queue.push([nx, ny]);
      }
    }
    return null;
  }

  // Heads straight for the player, sliding along walls rather than through them. A hunter
  // (behaviour 'chase') follows the aisles instead (waypoint).
  chase(dt, player, room) {
    const aim = this.behaviour === 'chase' ? (this.waypoint(room, player) ?? player) : player;
    const dx = aim.x - this.x;
    const dy = aim.y - this.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) return;
    // Bursty gaits keep their rhythm in a chase, at the same average speed.
    const gait = GAITS[this.gait];
    const speed = (this.chaseSpeed ?? CHASE_SPEED) * this.pace(dt) / (gait.moving * gait.pace || 1) * Math.min(1, gait.pace);
    if (speed <= 0) return;
    // Going round something in the way (a tree between you): sideways for a bit.
    if (this.detour) {
      this.detour.t -= dt;
      if (!this.step(room, this.detour.x * speed * dt, this.detour.y * speed * dt)) {
        this.detour.x *= -1;
        this.detour.y *= -1;
      }
      if (this.detour.t <= 0) this.detour = null;
      return;
    }
    const before = distance;
    this.step(room, (dx / distance) * speed * dt, (dy / distance) * speed * dt);
    const gained = before - Math.hypot(aim.x - this.x, aim.y - this.y);
    this.blocked = gained < speed * dt * 0.3 ? (this.blocked ?? 0) + dt : 0;
    if (this.blocked > STUCK_SECONDS) {
      // Step out to whichever side is clear, at right angles to you.
      const side = Math.random() < 0.5 ? 1 : -1;
      const sides = [side, -side].map((k) => ({ x: (-dy / distance) * k, y: (dx / distance) * k }));
      const free = sides.find((d) => !this.blockedAt(room, this.x + d.x * T, this.y + d.y * T)) ?? sides[0];
      this.detour = { ...free, t: DETOUR_SECONDS };
      this.blocked = 0;
    }
  }

  // Inside something solid (landed in a wall from a leap): step out to the
  // nearest spot it can stand, looking further out a few pixels at a time.
  unstick(room) {
    if (this.lurking || !this.blockedAt(room, this.x, this.y)) return;
    for (let r = 2; r <= 2 * T; r += 2) {
      for (let a = 0; a < 16; a++) {
        const x = this.x + Math.round(Math.cos((a / 16) * Math.PI * 2) * r);
        const y = this.y + Math.round(Math.sin((a / 16) * Math.PI * 2) * r);
        if (!this.blockedAt(room, x, y)) {
          this.x = x;
          this.y = y;
          return;
        }
      }
    }
  }

  // Moves by (dx, dy) one axis at a time, stopping at walls. Returns whether it moved.
  // (Not moving on an axis doesn't count as moving: slid up against a tree
  // until it's level with where it's going, it's stuck, not walking.)
  step(room, dx, dy) {
    let moved = false;
    if (Math.abs(dx) > 0.001 && !this.blockedAt(room, this.x + dx, this.y)) { this.x += dx; moved = true; }
    if (Math.abs(dy) > 0.001 && !this.blockedAt(room, this.x, this.y + dy)) { this.y += dy; moved = true; }
    return moved;
  }

  blockedAt(room, x, y) {
    // A swimmer (blindfish, olm) goes through the open water that stops everyone else.
    if (this.swims) {
      const left = Math.round(x) - BODY_HALF_WIDTH, top = Math.round(y) - BODY_HEIGHT, right = Math.round(x) + BODY_HALF_WIDTH, bottom = Math.round(y);
      for (let ty = Math.floor(top / T); ty <= Math.floor((bottom - 1) / T); ty++) {
        for (let tx = Math.floor(left / T); tx <= Math.floor((right - 1) / T); tx++) {
          if (room.isSolidTile(tx, ty) && room.tileAt(tx, ty) !== '~') return true;
          // Water is theirs; a raised block (the ghost ship's cargo stacks) is not.
          if (room.raiseAt(tx, ty) > 0) return true;
        }
      }
      return room.props.some((prop) => room.propBlocks(prop, left, top, right, bottom));
    }
    return room.collides(Math.round(x) - BODY_HALF_WIDTH, Math.round(y) - BODY_HEIGHT, Math.round(x) + BODY_HALF_WIDTH, Math.round(y));
  }

  // Height off the ground mid-leap.
  get z() {
    if (!this.leap) return 0;
    if (this.leap.kind === 'rise') return 0;
    if (this.leap.kind === 'drop') {
      const k = Math.max(0, this.leap.t - DROP_WARN_SECONDS) / DROP_SECONDS;
      return Math.round(DROP_HEIGHT * (1 - k * k));
    }
    return Math.round(Math.sin((this.leap.t / this.leap.seconds) * Math.PI) * this.leap.height);
  }

  // Under the water, waiting for its tide (monsterHabits.js).
  get submerged() {
    return Boolean(this.tideWhen) && (this.surface ?? 0) < 1;
  }

  touches(player) {
    if (this.submerged || this.lurking || this.leap || this.cooldown > 0 || this.stunned > 0) return false;
    // One standing out of a pool (monsterHabits.js `tide`) is met from the bank: a couple of tiles off.
    return Math.hypot(this.x - player.x, this.y - player.y) < (this.tideWhen ? TOUCH_DISTANCE + 14 : TOUCH_DISTANCE);
  }

  // Its shadow in the sun (see shadows.js): in disguise, the disguise's.
  shadow() {
    if (this.submerged) return null;
    // Buried, up overhead or just coming out: no shadow of its own in the sun.
    if ((this.lurking && (this.behaviour === 'burrow' || this.behaviour === 'drop')) || this.leap?.kind) return null;
    if (this.lurking && this.look && !this.look.ownArt) return this.lookSprite ? { image: this.lookSprite, x: this.x, y: this.y } : null;
    const disguised = this.lurking && this.behaviour === 'disguise' && this.disguiseFrames;
    return { image: disguised ? this.disguiseFrames[0] : this.sprite, x: this.x, y: this.y };
  }

  draw(ctx, camera) {
    if (this.ghostAlpha === 0) return;
    if (this.cooldown > 0 && Math.floor(this.cooldown * 10) % 2 === 0) return;
    let x = Math.round(this.x) - camera.x;
    const y = Math.round(this.y) - camera.y;
    if (this.bits.length) drawBits(ctx, this.bits, camera);
    if (this.submerged) {
      drawSurfacing(ctx, this, x, y, this.time);
      return;
    }

    // In a hiding place the room gave it (hideouts.js): the scenery it passes
    // for, or only the tells of it under the ground or up overhead.
    if (this.lurking && ((this.look && !this.look.ownArt) || this.behaviour === 'burrow' || this.behaviour === 'drop')) {
      if (this.look) drawHideout(ctx, this.look, this.lookSprite, x, y, this.time);
      return;
    }
    // Coming up out of the ground: only as much of it as is out so far.
    if (this.leap?.kind === 'rise') {
      const h = this.sprite.height;
      const shown = Math.max(1, Math.round(h * Math.min(1, this.leap.t / this.leap.seconds)));
      ctx.drawImage(this.sprite, 0, 0, this.sprite.width, shown, x - Math.floor(this.sprite.width / 2), y - 1 - shown, this.sprite.width, shown);
      if (this.alert > 0) drawAlert(ctx, x, y - 1 - shown - 12);
      return;
    }
    // Up overhead and about to drop: its shadow on the floor where you stood,
    // growing as it comes; for the first moment, only that and the "!".
    if (this.leap?.kind === 'drop') {
      const k = Math.min(1, this.leap.t / this.leap.seconds);
      ctx.fillStyle = `rgba(0, 0, 0, ${(0.15 + 0.3 * k).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(x, y - 2, 3 + 5 * k, 1.5 + 1.5 * k, 0, 0, Math.PI * 2);
      ctx.fill();
      if (this.leap.t < DROP_WARN_SECONDS) {
        if (this.alert > 0) drawAlert(ctx, x, y - 34);
        return;
      }
    }

    // Still in disguise: stand stock-still, like the pillar it's pretending to be.
    if (this.lurking && this.behaviour === 'disguise' && this.disguiseFrames) {
      const frames = this.disguiseFrames;
      const telling = frames.length > 1 && this.time % TELL_EVERY_SECONDS < TELL_SECONDS;
      const frame = telling ? frames[1 + (Math.floor(this.time / TELL_EVERY_SECONDS) % (frames.length - 1))] : frames[0];
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(x - 7, y - 3, 14, 3);
      ctx.drawImage(frame, x - Math.floor(frame.width / 2), y - frame.height);
      return;
    }

    if (this.lurking && this.time % PEEK_EVERY_SECONDS < PEEK_SECONDS) x += this.peekSide * PEEK_DISTANCE;
    const lunge = this.lungeOffset();
    const top = this.drawBody(ctx, x + lunge.x, y + lunge.y, lunge.lift);
    if (this.alert > 0) drawAlert(ctx, x, top - 12);
  }

  // The enemy itself, its own way (GAITS), standing at (x, y): its shadow on
  // the ground, then the sprite lifted, turned or squashed. Returns the top of it.
  drawBody(ctx, x, y, extraLift = 0) {
    const t = this.time;
    const gait = GAITS[this.gait];
    const w = this.sprite.width;
    const h = this.sprite.height;
    // How far off the ground, turned (radians, about `pivot`), stretched and see-through.
    let lift = Math.round(Math.sin(t * 3) * 2) + 2;
    let angle = 0;
    let pivot = 'feet';
    let sx = 1;
    let sy = 1;
    let alpha = 1;
    let shadow = 1;
    const hopping = this.moving && this.stride < gait.moving;
    const hopArc = Math.sin((this.stride / gait.moving) * Math.PI);
    switch (this.gait) {
      case 'fly':
        lift = 12 + Math.round(Math.sin(t * 4) * 3);
        shadow = 0.6;
        break;
      case 'hop':
      case 'bound':
        lift = hopping ? Math.round(hopArc * gait.height) : 0;
        // Squashed for a moment as it lands.
        if (!hopping && this.moving && this.stride < gait.moving + 0.08) { sx = 1.15; sy = 0.87; }
        shadow = 1 - lift / 40;
        break;
      case 'roll':
        lift = 0;
        angle = Math.round(this.roll * 4 / Math.PI) * (Math.PI / 4);
        pivot = 'middle';
        break;
      case 'stomp':
        lift = hopping ? Math.round(hopArc * gait.height) : 0;
        if (!hopping && this.moving && this.stride < gait.moving + 0.1) { sx = 1.08; sy = 0.92; }
        break;
      case 'ooze':
        lift = 0;
        sx = 1 + Math.sin(t * 4) * 0.12;
        sy = 1 / sx;
        break;
      case 'dash':
        lift = 0;
        // Leaning into the dart.
        if (hopping) angle = 0.18 * this.direction;
        break;
      case 'swing':
        lift = 4;
        angle = Math.sin(t * 2.6) * 0.35;
        pivot = 'top';
        break;
      case 'float':
        lift = 6 + Math.round(Math.sin(t * 1.8) * 3);
        alpha = 0.7 + Math.sin(t * 5) * 0.2;
        shadow = 0.7;
        break;
      case 'waddle':
        angle = this.moving ? Math.sin(t * 7) * 0.14 : 0;
        lift = 0;
        break;
      default:
        break;
    }
    lift += this.z + extraLift;
    // What it's up to while nobody's fighting it (monsterFlavour.js): drawing only.
    const fl = this.flavourPose;
    if (fl) { x += fl.dx; lift += fl.lift; angle += fl.angle; sx *= fl.sx; sy *= fl.sy; }
    // Flattened (stunned): squashed to the boards, wobbling back up at the very end.
    if (this.stunned > 0) {
      const up = Math.min(1, Math.max(0, 1 - this.stunned / 0.6));
      sx = 1.45 - 0.45 * up;
      sy = 0.4 + 0.6 * up;
      angle = 0;
      lift = 0;
      pivot = 'feet';
    }
    // Rearing back before a lunge: squashed down, ready to spring.
    if (this.lunge && this.lunge.t < LUNGE_SECONDS * 0.3) { sx = 1.12; sy = 0.88; }
    // The shadow stays on the ground, smaller the higher it is.
    const sw = Math.max(4, Math.round(10 * shadow));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x - Math.floor(sw / 2), y - 3, sw, 3);

    const bottom = y - 2 - lift;
    ctx.save();
    ctx.globalAlpha = alpha * (this.ghostAlpha ?? 1);
    if (!angle && sx === 1 && sy === 1) {
      ctx.drawImage(this.sprite, x - Math.floor(w / 2), bottom - h);
    } else {
      const py = pivot === 'top' ? bottom - h : pivot === 'middle' ? bottom - h / 2 : bottom;
      ctx.translate(x, py);
      ctx.rotate(angle);
      ctx.scale(sx, sy);
      const oy = pivot === 'top' ? 0 : pivot === 'middle' ? -h / 2 : -h;
      ctx.drawImage(this.sprite, -Math.floor(w / 2), oy);
    }
    ctx.restore();
    return bottom - h;
  }
}

// A "!" in a little dark box.
function drawAlert(ctx, x, y) {
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x - 3, y, 6, 11);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 1, y + 2, 2, 5);
  ctx.fillRect(x - 1, y + 8, 2, 2);
}
