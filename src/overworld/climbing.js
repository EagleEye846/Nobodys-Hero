import { TILE_SIZE as T } from '../config.js';
import { sfx } from '../audio/music.js';
import { skillBonus } from '../characters/progress.js';

// Climbing with the Climbing Rope (src/data/gear.js).
//
// A short cliff with an iron ring at the top (a `grapple_ring` prop, on the
// open tile at the top edge) is one throw: face it from below and press Z,
// and you're hauled up. Stand on that ring and face down to climb back down.
//
// A steep face is too tall for one throw. Rings are hammered into the rock
// (`swing_ring` props, on the cliff tiles) in a route up it. Hook the lowest
// one (straight above you, close enough to throw to) and you hang from it,
// swinging gently side to side. Hold left or right along with the swing to
// pump it higher (holding against it slows you down): the higher you swing,
// the farther you fling. Press Z at the right moment and you fling yourself
// to the next ring: for a ring up to the side, at the top of the swing toward
// it; for one straight above, as you pass the bottom. Mistime it, or let go
// with X, and you fall back to where you started. The last ring is the
// clifftop's `grapple_ring`, which hauls you up over the edge.

// The hook flying up and catching, or the rope being tied off to go down.
const HOOK_SECONDS = 0.35;
const TIE_SECONDS = 0.2;
// How fast you're hauled along the rope, in pixels per second.
const CLIMB_SPEED = 55;
// The tallest cliff one throw reaches, and the tallest you can rope down, in tiles.
const MAX_THROW_TILES = 4;
const MAX_RAPPEL_TILES = 14;
// The first ring of a steep face: straight above you, at most this many tiles up.
const MAX_FIRST_RING_TILES = 3;

// The swing: rope length (ring to hands, pixels), and how long a swing there
// and back takes (seconds).
const ROPE_LENGTH = 18;
// With momentum the rope stretches, up to this many pixels longer at a full
// swing (and no further). The stretch also adds this much to how far you can
// reach a ring straight above you (less for one off to the side), which makes
// the higher rings easier to catch.
const MAX_STRETCH = 12;
const SWING_SECONDS = 1.5;
// How far it swings each way (radians): gently when you first hook on, up to
// as high as you can pump it.
const MIN_SWING = 0.35;
const MAX_SWING = 1.55;
// Per second: how fast pumping (holding the way you're swinging) raises the
// swing, how fast holding against it lowers it, and how fast it dies away
// if you hold nothing.
const PUMP_RATE = 1.8;
const BRAKE_RATE = 1.2;
const SWING_DECAY = 0.06;
// How much of the swing you keep when you catch the next ring: chain catches
// quickly and your momentum carries you on.
const SWING_KEPT = 0.9;
// A ring can be reached from this far away (pixels between rings), from the
// gentlest swing to the highest, and only if it's no lower than the one you're on.
// Reach grows faster the more momentum you have, so the last bit of pumping
// to a full swing pays off most.
const MIN_REACH = 30;
const MAX_REACH = 100;
// How close (radians) the swing has to be to the right moment for a grab,
// from the gentlest swing to the highest. Bigger is more forgiving: with more
// momentum the window opens wider, wide enough that it lasts longer even
// though you're moving faster.
const MIN_GRAB_WINDOW = 0.22;
const MAX_GRAB_WINDOW = 0.75;
// A ring this far to the side (pixels) wants the very top of the swing.
const FULL_SWING_DX = 24;
// A fling this far (pixels) takes LEAP_SECONDS and arcs LEAP_ARC high; longer
// flings take longer and arc higher.
const LEAP_DISTANCE = 45;
const LEAP_SECONDS = 0.22;
const LEAP_ARC = 8;
const FALL_GRAVITY = 520;
// From your hands, holding the rope, down to your feet.
const HANDS_TO_FEET = 13;

// Where the rope ties on: a clifftop ring just above the edge, or the middle
// of a ring in the rock face.
function anchor(ring) {
  return { x: ring.x + T / 2, y: ring.y + (ring.swing ? T / 2 : T - 3) };
}

// How far along the swing is from gentlest (0) to highest (1).
const momentum = (swing) => (swing - MIN_SWING) / (MAX_SWING - MIN_SWING);
// How much longer the rope is, swinging this high.
const stretch = (swing) => MAX_STRETCH * momentum(swing);

const tileOf = (prop) => ({ x: Math.round(prop.x / T), y: Math.round(prop.y / T) });

// The climb you could start from where the player stands and faces, or null:
//   { kind: 'haul', ring, to (tile), up }  one throw up a short cliff, or down any cliff
//   { kind: 'swing', ring }                the first ring of a steep face
// The throw is forgiving about where you stand: the ring's own column first,
// then one column either side (the rope swings you in under it).
export function findClimb(room, player) {
  if (player.ground > 0 || (player.facing !== 'up' && player.facing !== 'down')) return null;
  const [tx, ty] = player.tilePosition();
  for (const column of [tx, tx - 1, tx + 1]) {
    const plan = findClimbIn(room, player.facing === 'up', column, ty);
    if (plan) return plan;
  }
  return null;
}

// Whether a ring is close above the player (within a few tiles, a column or
// two to the side) that findClimb didn't give a climb to: for telling the
// player why Z did nothing.
export function ringNear(room, player) {
  if (player.facing !== 'up') return false;
  const [tx, ty] = player.tilePosition();
  return room.props.some((prop) => {
    if (!prop.swing && !prop.grapple) return false;
    const ring = tileOf(prop);
    return Math.abs(ring.x - tx) <= 2 && ty - ring.y >= 1 && ty - ring.y <= MAX_THROW_TILES + 2;
  });
}

function findClimbIn(room, up, tx, ty) {
  const step = up ? -1 : 1;
  let y = ty + step;
  if (!room.isSolidTile(tx, y)) return null;
  let tiles = 0;
  // Rock all the way to the edge of the room: nothing to haul up to or down
  // onto, but a steep face can still have rings in it.
  let edge = false;
  for (; room.isSolidTile(tx, y); tiles++, y += step) {
    if (room.tileAt(tx, y) === null) {
      edge = true;
      break;
    }
  }
  const open = !edge && room.raiseAt(tx, y) === 0;
  const topRing = (rx, ry) => room.props.find((prop) => prop.grapple && !prop.swing && tileOf(prop).x === rx && tileOf(prop).y === ry);

  if (!up) {
    const ring = topRing(tx, ty);
    return ring && open && tiles <= MAX_RAPPEL_TILES ? { kind: 'haul', ring, to: { x: tx, y }, up: false } : null;
  }
  const top = topRing(tx, y);
  if (top && open && tiles <= MAX_THROW_TILES) return { kind: 'haul', ring: top, to: { x: tx, y }, up: true };
  const first = room.props
    .filter((prop) => prop.swing && tileOf(prop).x === tx && ty - tileOf(prop).y >= 1 && ty - tileOf(prop).y <= MAX_FIRST_RING_TILES)
    .sort((a, b) => b.y - a.y)[0];
  return first ? { kind: 'swing', ring: first } : null;
}

// One climb, from the throw to the top (or a fall back to the start). The
// overworld updates it until it's `done`, and draws its rope.
export class Climb {
  // `carry` is the swing to start with (from a climb carried on through a
  // door, see OverworldScene): hooked on, you're already swinging that high.
  constructor(plan, player, room, carry = null) {
    this.player = player;
    this.room = room;
    this.carry = carry;
    // The swing you had when it ended, for a room that carries the climb on.
    this.momentum = null;
    // Where a fall lands you: where you started.
    this.start = { x: player.x, y: player.y };
    this.done = false;
    player.moving = false;
    sfx('hook');
    if (plan.kind === 'haul') this.haul(plan.ring, plan.to, plan.up, plan.up ? HOOK_SECONDS : TIE_SECONDS);
    else this.reel(plan.ring);
  }

  // Hauled along the rope to a tile: up over a clifftop, or down to the foot of a cliff.
  haul(ring, tile, up, ready) {
    this.state = {
      name: 'haul', ring, up, ready, t: 0,
      from: { x: this.player.x, y: this.player.y },
      dest: { x: tile.x * T + T / 2, y: (tile.y + 1) * T },
    };
  }

  // The hook catches a ring in the face, and you're reeled up to hang from it.
  reel(ring) {
    this.state = {
      name: 'reel', ring, up: true, ready: HOOK_SECONDS, t: 0,
      from: { x: this.player.x, y: this.player.y },
      dest: this.hangPoint(ring, 0),
    };
  }

  hang(ring, phase, swing = MIN_SWING) {
    this.state = { name: 'hang', ring, phase, swing };
    this.placeHanging();
  }

  // Where your feet are, hanging from `ring` with the rope at `angle`.
  hangPoint(ring, angle, swing = MIN_SWING) {
    const a = anchor(ring);
    const rope = ROPE_LENGTH + stretch(swing);
    return {
      x: a.x + Math.sin(angle) * rope,
      y: a.y + Math.cos(angle) * rope + HANDS_TO_FEET,
    };
  }

  get swingAngle() {
    return this.state.swing * Math.sin(this.state.phase);
  }

  // How close to the right moment a grab has to be, swinging as high as you are.
  get grabWindow() {
    return MIN_GRAB_WINDOW + (MAX_GRAB_WINDOW - MIN_GRAB_WINDOW) * momentum(this.state.swing);
  }

  // How far you could fling yourself, swinging as high as you are.
  get reach() {
    const k = momentum(this.state.swing);
    return MIN_REACH + (MAX_REACH - MIN_REACH) * k * k;
  }

  // Left or right held along with the swing pumps it higher; against it, lower.
  pump(dt, input) {
    const state = this.state;
    const held = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    // Which way you're swinging right now: +1 right, -1 left.
    const moving = Math.sign(Math.cos(state.phase));
    let change = -SWING_DECAY;
    // Strong Arms (a skill) pumps the swing up faster.
    if (held && held === moving) change = PUMP_RATE * (1 + skillBonus('swingPower'));
    else if (held) change = -BRAKE_RATE;
    state.swing = Math.max(MIN_SWING, Math.min(MAX_SWING, state.swing + change * dt));
  }

  // On a gusty face (the room's `climbWind`: { dir, every, lasts, strength }),
  // a gust (`this.gust`, set by the overworld while one blows) shoves your
  // swing: swinging the way it blows (dir 1 right, -1 left) it carries you
  // higher, for free; swinging into it, it pushes you back down.
  blow(dt) {
    if (!this.gust) return;
    const state = this.state;
    const moving = Math.sign(Math.cos(state.phase));
    const push = moving === this.gust.dir ? this.gust.strength : -this.gust.strength * 0.6;
    state.swing = Math.max(MIN_SWING, Math.min(MAX_SWING, state.swing + push * dt));
  }

  placeHanging() {
    const point = this.hangPoint(this.state.ring, this.swingAngle, this.state.swing);
    this.player.x = Math.round(point.x);
    this.player.y = Math.round(point.y);
  }

  update(dt, input) {
    const { player } = this;
    const state = this.state;
    player.facing = 'up';

    if (state.name === 'haul' || state.name === 'reel') {
      state.t += dt;
      const hauling = state.t - state.ready;
      if (hauling <= 0) return;
      player.moving = true;
      player.animationTime += dt;
      const length = Math.max(1, Math.hypot(state.dest.x - state.from.x, state.dest.y - state.from.y));
      const progress = Math.min(1, hauling / (length / CLIMB_SPEED));
      // Swing in under the rope first, then along it.
      const sideways = state.name === 'haul' ? Math.min(1, progress * 5) : progress;
      player.x = Math.round(state.from.x + (state.dest.x - state.from.x) * sideways);
      player.y = Math.round(state.from.y + (state.dest.y - state.from.y) * progress);
      if (progress < 1) return;
      player.moving = false;
      if (state.name === 'reel') this.hang(state.ring, 0, this.carry ?? MIN_SWING);
      else this.finish(state.dest, state.up ? 'up' : 'down');
      return;
    }

    if (state.name === 'hang') {
      state.phase += (Math.PI * 2 / SWING_SECONDS) * dt;
      this.pump(dt, input);
      this.blow(dt);
      this.placeHanging();
      if (input.wasPressed('confirm')) this.grab();
      else if (input.wasPressed('cancel')) this.fall();
      return;
    }

    if (state.name === 'leap') {
      state.t += dt;
      state.phase += (Math.PI * 2 / SWING_SECONDS) * dt;
      const k = Math.min(1, state.t / (LEAP_SECONDS * state.scale));
      const to = this.hangPoint(state.ring, state.swing * Math.sin(state.phase), state.swing);
      player.x = Math.round(state.from.x + (to.x - state.from.x) * k);
      player.y = Math.round(state.from.y + (to.y - state.from.y) * k - Math.sin(Math.PI * k) * LEAP_ARC * state.scale);
      if (k < 1) return;
      // The clifftop ring: over the edge. Any other: hang on and keep swinging.
      if (state.ring.swing) this.hang(state.ring, state.phase, state.swing);
      else this.haul(state.ring, tileOf(state.ring), true, 0);
      return;
    }

    if (state.name === 'fall') {
      state.vy += FALL_GRAVITY * dt;
      player.y += state.vy * dt;
      const k = Math.min(1, (player.y - state.from.y) / Math.max(1, this.start.y - state.from.y));
      player.x = Math.round(state.from.x + (this.start.x - state.from.x) * k);
      if (player.y < this.start.y) return;
      sfx('hit');
      this.finish(this.start, 'up');
    }
  }

  // Z while swinging: fling yourself to the ring the swing is carrying you
  // towards, if the moment's right and you're swinging high enough to reach
  // it. Otherwise you've let go.
  grab() {
    const { swing } = this.state;
    const best = this.target();
    if (!best || best.off >= this.grabWindow) {
      this.fall();
      return;
    }
    sfx('hook');
    this.momentum = Math.max(MIN_SWING, swing * SWING_KEPT);
    const from = anchor(this.state.ring);
    const to = anchor(best.prop);
    this.state = {
      name: 'leap', ring: best.prop, phase: this.state.phase, t: 0,
      scale: Math.max(1, Math.hypot(to.x - from.x, to.y - from.y) / LEAP_DISTANCE),
      swing: Math.max(MIN_SWING, swing * SWING_KEPT),
      from: { x: this.player.x, y: this.player.y },
    };
  }

  // The ring within reach that the swing is nearest the right moment for,
  // as { prop, off } (off: radians from that moment), or null.
  target() {
    const { ring, swing } = this.state;
    const from = anchor(ring);
    const angle = this.swingAngle;
    const reach = this.reach;
    let best = null;
    for (const prop of this.room.props) {
      if (prop === ring || !(prop.swing || prop.grapple)) continue;
      const to = anchor(prop);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.hypot(dx, dy);
      // The stretch helps most with rings straight above.
      const upward = Math.max(0, -dy) / Math.max(1, distance);
      if (dy > 1 || distance > reach + stretch(swing) * upward) continue;
      const wanted = swing * Math.max(-1, Math.min(1, dx / FULL_SWING_DX));
      const off = Math.abs(angle - wanted);
      if (!best || off < best.off) best = { prop, off };
    }
    return best;
  }

  // While hanging: brackets around the ring you'd catch, dim while it's
  // within reach, bright when pressing Z now would catch it.
  drawTarget(ctx, camera, project = (x) => x - camera.x) {
    if (this.state.name !== 'hang') return;
    const best = this.target();
    if (!best) return;
    const ready = best.off < this.grabWindow;
    const a = anchor(best.prop);
    const cx = Math.round(project(a.x));
    const cy = Math.round(a.y - camera.y);
    const r = ready ? 6 : 7;
    ctx.save();
    ctx.fillStyle = ready ? '#ffe14d' : 'rgba(255, 225, 77, 0.45)';
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      // Each corner: a short arm along and a short arm down (or up) from it.
      const x = cx + sx * r;
      const y = cy + sy * r;
      ctx.fillRect(sx > 0 ? x - 2 : x, y, 3, 1);
      ctx.fillRect(x, sy > 0 ? y - 2 : y, 1, 3);
    }
    ctx.restore();
  }

  fall() {
    sfx('back');
    this.state = { name: 'fall', vy: 0, from: { x: this.player.x, y: this.player.y } };
  }

  finish(point, facing) {
    const { player } = this;
    player.x = Math.round(point.x);
    player.y = Math.round(point.y);
    player.remainderX = player.remainderY = 0;
    player.ground = 0;
    player.z = 0;
    player.moving = false;
    player.facing = facing;
    this.done = true;
  }

  // The rope, from its ring to your hands (flying out to the ring at first).
  // `project` turns a world x into a screen x (round a spire, it bends).
  drawRope(ctx, camera, project = (x) => x - camera.x) {
    const { state, player } = this;
    if (state.name === 'fall') return;
    const ring = anchor(state.ring);
    const end = { x: project(ring.x), y: ring.y - camera.y };
    const hands = { x: project(player.x), y: player.y - HANDS_TO_FEET - camera.y };
    let tip = end;
    if (state.up && state.t < state.ready) {
      const flown = state.t / state.ready;
      tip = { x: hands.x + (end.x - hands.x) * flown, y: hands.y + (end.y - hands.y) * flown };
    }
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#3a2410';
    ctx.beginPath();
    ctx.moveTo(Math.round(hands.x) + 1.5, Math.round(hands.y));
    ctx.lineTo(Math.round(tip.x) + 1.5, Math.round(tip.y));
    ctx.stroke();
    ctx.strokeStyle = '#d8b070';
    ctx.beginPath();
    ctx.moveTo(Math.round(hands.x) + 0.5, Math.round(hands.y));
    ctx.lineTo(Math.round(tip.x) + 0.5, Math.round(tip.y));
    ctx.stroke();
    // The hook, while it flies.
    if (tip !== end) {
      ctx.fillStyle = '#8a8296';
      ctx.fillRect(Math.round(tip.x) - 1, Math.round(tip.y) - 1, 3, 3);
    }
    ctx.restore();
  }
}
