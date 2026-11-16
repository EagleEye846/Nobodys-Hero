import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { WindGeyser, heroFrames, holdingHands, HOLD_OFFSET } from './windGeyser.js';
import { memberFrames } from '../characters/party.js';

// Weathervanes, whirlwinds and snowdrifts: a room whose wind you can turn.
//
// A room with `vaneWind` has a wind that blows one way, 'up', 'right', 'down'
// or 'left' (towards that edge of the screen). Every weathervane in it (a
// prop with `vane: true`) points that way; press Z on any of them and it
// swings round a quarter turn, clockwise, and the wind with it. Where it
// blows is remembered (WORLD_STATE.vaneWind), so it stays as you left it.
//
// Whirlwinds (the room's `whirls`: { x, y }) spin on one tile. Step into one
// and it flings you downwind, over anything you could walk on and over open
// sky, until the next tile is something solid (rock, a boulder, a pine, a
// drift that's there, a weathervane) or the edge of the room, and you land on
// the last tile before it. If that would leave you over the drop, it won't:
// it just spins you round and sets you back down.
//
// Snowdrifts are props with `drift`: the winds they're heaped up in (a list,
// like ['up', 'left']). While the wind blows one of those ways the drift is
// there, solid; otherwise it's blown away and you can walk through.

export const WIND_WAYS = ['up', 'right', 'down', 'left'];
export const WIND_STEP = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };

// Which way the wind blows in this room now, or null if it hasn't got one.
export function windIn(roomData) {
  if (!roomData.vaneWind) return null;
  return WORLD_STATE.vaneWind?.[roomData.id] ?? roomData.vaneWind;
}

// A quarter turn clockwise. Returns the new wind.
export function turnWind(roomData) {
  const now = windIn(roomData);
  const next = WIND_WAYS[(WIND_WAYS.indexOf(now) + 1) % WIND_WAYS.length];
  WORLD_STATE.vaneWind ??= {};
  WORLD_STATE.vaneWind[roomData.id] = next;
  return next;
}

// Every weathervane points the way the wind blows; every drift is there or not.
export function applyWind(room, wind) {
  for (const prop of room.allProps) {
    if (prop.vane) prop.setLook(`weathervane_${wind}`);
    if (prop.drift) prop.hidden = !prop.drift.includes(wind);
  }
}

// Where a whirlwind at tile (x, y) would set you down, blowing `wind`: a
// tile { x, y }, or null if it would leave you over the drop (or nowhere new).
export function whirlLanding(room, x, y, wind) {
  const [dx, dy] = WIND_STEP[wind];
  const blocked = (tx, ty) => {
    const char = room.tileAt(tx, ty);
    if (char === null) return true;
    if (char !== '_' && TILES[char]?.solid) return true;
    return room.props.some((prop) => !prop.hidden && !prop.walkable && tx * T >= prop.x && tx * T < prop.x + prop.width && ty * T === prop.y);
  };
  let tx = x;
  let ty = y;
  while (!blocked(tx + dx, ty + dy)) {
    tx += dx;
    ty += dy;
    // Round a spire the wind could go round for ever; it gives up after once.
    if (Math.abs(tx - x) > room.width) return null;
  }
  if (tx === x && ty === y) return null;
  if (room.tileAt(tx, ty) === '_') return null;
  // `alongX` is how far it carried you without wrapping round a spire's seam.
  return { x: room.wraps ? ((tx % room.width) + room.width) % room.width : tx, y: ty, alongX: tx };
}

// A whirlwind: a little spinning column of snow, like a wind geyser's small
// cousin, bent over the way the wind blows, with arrows of blown snow
// skimming along the ground that way, so you can see where it'll throw you.
// The overworld keeps `wind` up to date.
export class Whirl extends WindGeyser {
  constructor({ x, y }) {
    super({ x, y, to: null, spawn: null });
    this.small = true;
    this.wind = null;
  }

  draw(ctx, camera, time = performance.now() / 1000) {
    const lean = this.wind ? WIND_STEP[this.wind] : null;
    if (lean) this.drawArrows(ctx, camera, time, lean);
    // Spinning faster than an updraft, and a little taller.
    super.draw(ctx, camera, time * 1.6, 0.7, lean);
  }

  // Three chevrons running out from its foot along the wind, fading as they go.
  drawArrows(ctx, camera, time, [dx, dy]) {
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;
    for (let i = 0; i < 3; i++) {
      const k = (time * 0.9 + i / 3) % 1;
      const along = 8 + k * 22;
      const ax = Math.round(cx + dx * along);
      const ay = Math.round(cy + dy * along * 0.7);
      const a = Math.sin(k * Math.PI) * 0.8;
      // The chevron's two arms, swept back from its point.
      for (let j = 0; j <= 3; j++) {
        for (const side of [-1, 1]) {
          const px = ax - dx * j + (dy ? side * j : 0);
          const py = ay - dy * j + (dx ? side * j : 0);
          ctx.fillStyle = `rgba(96, 132, 172, ${(a * 0.6).toFixed(3)})`;
          ctx.fillRect(px, py + 1, 1, 1);
          ctx.fillStyle = `rgba(240, 248, 255, ${a.toFixed(3)})`;
          ctx.fillRect(px, py, 1, 1);
        }
      }
    }
  }
}

// Riding a whirlwind with Ves: like riding a wind geyser (windGeyser.js), she
// opens her umbrella to it and floats up, the hero leaps and catches her boot,
// and then the wind carries the two of them away downwind, swinging about,
// and sets them down where it stops. The hero is already moved to `to`; the
// scene draws this in place of them both until it's `done`.
const WHIRL_RIDE = { walk: 0.35, lift: 0.85, leap: 1.1 };
const WHIRL_LIFT = 22;
const WHIRL_SPEED = 120;   // pixels a second, carried along
const WHIRL_DROP = 0.35;   // the hero letting go and dropping to the ground
const WHIRL_SETTLE = 0.3;  // Ves floating down after
const HAND_X = 8;
const BOOT_X = 6;
const BESIDE = 13;

const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k));

export class WhirlRide {
  // `from` where the hero stood, `at` the whirlwind's middle, `to` where it
  // sets them down (all world pixels, at the feet).
  constructor({ from, at, to }) {
    this.from = from;
    this.at = at;
    this.to = to;
    this.t = 0;
    this.done = false;
    this.ves = memberFrames('vesper');
    this.hero = heroFrames();
    this.carry = Math.max(0.5, Math.hypot(to.x - at.x, to.y - at.y) / WHIRL_SPEED);
    this.landAt = WHIRL_RIDE.leap + this.carry;
    this.end = this.landAt + WHIRL_DROP + WHIRL_SETTLE;
    this.x = from.x;
    this.y = from.y;
  }

  get sortY() {
    return this.y + 1;
  }

  // Not a ride to another room: nothing to fade out for.
  get blackout() {
    return 0;
  }

  get focus() {
    return { x: this.x, y: this.y - 20 };
  }

  update(dt) {
    this.t += dt;
    this.place();
    if (this.t >= this.end) this.done = true;
  }

  // Where Ves is now (her feet, on the ground below her) and how high she floats.
  place() {
    const t = this.t;
    const { walk, lift, leap } = WHIRL_RIDE;
    const phase = (a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    if (t < walk) {
      const k = ease(t / walk);
      this.x = this.from.x - BESIDE + (this.at.x - (this.from.x - BESIDE)) * k;
      this.y = this.from.y + (this.at.y - this.from.y) * k;
      this.height = 0;
    } else if (t < leap) {
      this.x = this.at.x;
      this.y = this.at.y;
      this.height = WHIRL_LIFT * ease(phase(walk, lift));
    } else if (t < this.landAt) {
      const k = ease(phase(leap, this.landAt));
      this.x = this.at.x + (this.to.x - this.at.x) * k;
      this.y = this.at.y + (this.to.y - this.at.y) * k;
      // Up in a long arc over the drop.
      this.height = WHIRL_LIFT + Math.sin(Math.PI * k) * (18 + this.carry * 10);
    } else {
      // The hero lets go and drops; she drifts aside and floats down.
      this.x = this.to.x - BESIDE * phase(this.landAt, this.landAt + WHIRL_DROP);
      this.y = this.to.y;
      this.height = WHIRL_LIFT * (1 - ease(phase(this.landAt + WHIRL_DROP, this.end)));
    }
  }

  draw(ctx, camera) {
    const t = this.t;
    const { walk, lift, leap } = WHIRL_RIDE;
    const phase = (a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    this.height ??= 0;
    const { x, y, height } = this;
    const flying = t >= leap && t < this.landAt;
    const sway = flying ? Math.round(Math.sin(t / 0.3) * 3) : 0;
    const hands = holdingHands();
    const float = hands ? ['floatHandA', 'floatHandB'] : ['floatA', 'floatB'];
    const ves = height > 0.5 ? this.ves[Math.floor(t / 0.25) % 2 ? float[1] : float[0]]
      : t < walk ? this.ves[Math.floor(t / 0.15) % 2 ? 'downStep' : 'downIdle'] : this.ves.downIdle;
    const vesLeft = Math.round(x) - Math.floor(ves.width / 2) + sway - camera.x;
    const vesTop = Math.round(y - height) - ves.height - camera.y;
    const shadow = Math.max(0, 1 - height / 120);
    ctx.fillStyle = `rgba(0, 0, 0, ${(0.3 * shadow).toFixed(3)})`;
    ctx.fillRect(Math.round(x) - 5 - camera.x, Math.round(y) - 3 - camera.y, 10, 3);
    ctx.drawImage(ves, vesLeft, vesTop);

    // The hero: beside her, then leaping up onto her boot, hanging on and
    // flapping about, then dropping off onto the landing. Or, once she's
    // offered her hand, rising with her, side by side, holding hands.
    const hang = (hands ? this.hero.hold : this.hero.hang)[Math.floor(t / (hands ? 0.3 : 0.1)) % 2];
    const swing = flying && !hands ? Math.round(Math.sin(t / 0.3 + 0.9) * 4) : 0;
    const hangAt = hands ? { x: vesLeft + HOLD_OFFSET.x, y: vesTop + HOLD_OFFSET.y } : { x: vesLeft + BOOT_X - HAND_X + swing, y: vesTop + ves.height - 1 };
    const stand = this.hero.stand;
    const standX = t < this.landAt ? (t < walk ? this.from.x : this.at.x + BESIDE) : this.to.x;
    const standY = t < this.landAt ? (t < walk ? this.from.y : this.at.y) : this.to.y;
    const standAt = { x: Math.round(standX) - Math.floor(stand.width / 2) - camera.x, y: Math.round(standY) - stand.height - camera.y };
    const k = t < this.landAt ? ease(phase(lift, leap)) : 1 - ease(phase(this.landAt, this.landAt + WHIRL_DROP));
    if (k <= 0) ctx.drawImage(stand, standAt.x, standAt.y);
    else if (k >= 1) ctx.drawImage(hang, hangAt.x, hangAt.y);
    else {
      const arc = Math.sin(Math.PI * k) * 10;
      ctx.drawImage((hands ? this.hero.hold : this.hero.hang)[0], Math.round(standAt.x + (hangAt.x - standAt.x) * k), Math.round(standAt.y + (hangAt.y - standAt.y) * k - arc));
    }
  }
}
