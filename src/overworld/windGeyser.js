import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { PLAYER_PALETTE, PLAYER_SPRITES, PLAYER_HANG_SPRITES } from '../data/art/player.js';
import { memberFrames, inParty } from '../characters/party.js';
import { sfx } from '../audio/music.js';
import { WORLD_STATE } from '../state/saveGame.js';

// Wind geysers: columns of wind roaring up out of the ground, for puzzles
// and for getting somewhere you can't climb to. A room lists them in
// `geysers`: { x, y, to, spawn }, the tile it blows from, the room it carries
// you up into and where you land there (tile coordinates, like a door).
//
// Only Ves can ride one: she opens her umbrella into the wind and goes up
// like a dandelion seed, and the hero grabs her boot and hangs on, flapping
// about, all the way up. Without her the wind just shoves you back off it.
//
// Updrafts are the small ones, for puzzles in a single room: `gusts` in the
// room's data, { x, y, to: { x, y } }. Step on one (with or without Ves) and
// it tosses you up in an arc and drops you on tile `to`, up on a block if
// that's where `to` is.

const COLUMN_HEIGHT = 74; // how high the swirl reaches, in pixels
const RIBBONS = 4;
const MOTES = 16;

// The colour of moving air: white, a touch of blue, with a blue-grey edge
// under each streak so it still shows up against snow.
const AIR = '240, 248, 255';
const AIR_SHADE = '150, 186, 218';
const AIR_EDGE = '96, 132, 172';

export const VES = 'vesper';

export class WindGeyser {
  constructor({ x, y, to, spawn }) {
    this.tx = x;
    this.ty = y;
    this.to = to;
    this.spawn = spawn;
    this.x = x * T + T / 2;
    this.y = (y + 1) * T - 3;
  }

  // Drawn with the room's people, so whoever's in front of it is in front.
  get sortY() {
    return this.y;
  }

  covers(tx, ty) {
    return tx === this.tx && ty === this.ty;
  }

  // `strength` scales it down: an updraft is a small, short puff of a thing.
  // `lean` ([dx, dy]) bends it the way the wind blows (a whirlwind's): over
  // to the side, taller blowing up, curling towards you blowing down.
  draw(ctx, camera, time = performance.now() / 1000, strength = this.small ? 0.5 : 1, lean = null) {
    const cx = this.x - camera.x;
    const base = this.y - camera.y;
    const height = COLUMN_HEIGHT * (0.6 + 0.4 * strength) * (lean && lean[1] < 0 ? 1.3 : 1);
    // How far a point `up` pixels up the column is bent over: more the higher it is.
    const bendX = (up) => (lean ? lean[0] * 16 * (up / height) ** 2 : 0);
    const bendY = (up) => (lean && lean[1] > 0 ? 10 * (up / height) ** 2 : 0);
    const dot = (x, y, a, shade = false, w = 1) => {
      if (a <= 0.02) return;
      const up = base - y;
      const px = Math.round(x + bendX(up));
      const py = Math.round(y + bendY(up));
      ctx.fillStyle = `rgba(${AIR_EDGE}, ${Math.min(1, a * 0.55).toFixed(3)})`;
      ctx.fillRect(px, py + 1, w, 1);
      ctx.fillStyle = `rgba(${shade ? AIR_SHADE : AIR}, ${Math.min(1, a).toFixed(3)})`;
      ctx.fillRect(px, py, w, 1);
    };
    // A soft glow of churned-up air inside the column, so it reads as a column
    // and not just streaks: a funnel, narrow at the ground and wide at the top.
    glowColumn(ctx, cx, base, height, strength, time, bendX, bendY);
    // A ring of wind spinning flat on the ground, brighter on the near side.
    for (let i = 0; i < 24; i++) {
      const a = time * 4.2 + (i / 24) * Math.PI * 2;
      const near = Math.sin(a) > 0;
      dot(cx + Math.cos(a) * 11, base + Math.sin(a) * 3.5, (near ? 1 : 0.5) * strength, !near, 2);
      dot(cx + Math.cos(-a * 0.8) * 6, base + Math.sin(-a * 0.8) * 2, 0.55 * strength, true, 2);
    }
    // Ribbons spiralling up, widening as they rise, fading out at the top.
    for (let r = 0; r < RIBBONS; r++) {
      for (let k = 0; k < height; k += 1) {
        const angle = time * 5.5 + k * 0.13 + (r / RIBBONS) * Math.PI * 2;
        const radius = 3 + k * 0.13;
        const near = Math.sin(angle) > 0;
        const fade = (1 - k / height) * (k < 6 ? k / 6 : 1);
        dot(cx + Math.cos(angle) * radius, base - k, (near ? 1 : 0.5) * fade * strength, !near, 2);
      }
    }
    // Snow and specks carried up on it, round and round.
    for (let i = 0; i < MOTES; i++) {
      const phase = (time * (0.35 + (i % 4) * 0.08) + i / MOTES) % 1;
      const angle = time * 3.2 + i * 1.7;
      const x = cx + Math.cos(angle) * (3 + phase * 9);
      const y = base - phase * height;
      const a = Math.sin(phase * Math.PI) * 0.9 * strength;
      dot(x, y, a);
      // Every few, a snowflake: a little cross.
      if (i % 5 === 0) {
        dot(x - 1, y, a * 0.6);
        dot(x + 1, y, a * 0.6);
        dot(x, y - 1, a * 0.6);
        dot(x, y + 1, a * 0.6);
      }
    }
  }
}

// The column's glow, swelling a little as the wind gusts.
function glowColumn(ctx, cx, base, height, strength, time, bendX = () => 0, bendY = () => 0) {
  const gust = 0.8 + 0.2 * Math.sin(time * 2.3);
  for (let k = 0; k < height; k += 2) {
    const half = 4 + k * 0.13;
    const a = 0.16 * (1 - k / height) * strength * gust;
    ctx.fillStyle = `rgba(${AIR}, ${a.toFixed(3)})`;
    ctx.fillRect(Math.round(cx - half + bendX(k)), Math.round(base - k - 1 + bendY(k)), Math.round(half * 2), 2);
  }
}

// An updraft (`gusts` in a room): a small geyser that tosses you to a tile in
// the same room.
export class Updraft extends WindGeyser {
  constructor({ x, y, to }) {
    super({ x, y, to: null, spawn: null });
    this.small = true;
    this.drop = to;
  }
}

// The toss itself: the hero up in an arc from one tile to another, landing on
// whatever floor is there. The scene moves the hero along it (see hop in
// overworldScene.js).
const HOP_SPEED = 95;       // pixels a second along the ground
const HOP_MIN_SECONDS = 0.55;
export function hopPath(from, to, floorFrom, floorTo) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  return {
    from, to, floorFrom, floorTo, t: 0,
    seconds: HOP_MIN_SECONDS + distance / HOP_SPEED,
    peak: 22 + distance * 0.18 + Math.max(floorFrom, floorTo),
  };
}

// Where the hero is `hop.t` seconds in: x, y and how far up off the lower of
// the two floors. Returns null once it's over.
export function hopAt(hop) {
  const k = Math.min(1, hop.t / hop.seconds);
  const base = Math.min(hop.floorFrom, hop.floorTo);
  const along = k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k);
  return {
    x: hop.from.x + (hop.to.x - hop.from.x) * along,
    y: hop.from.y + (hop.to.y - hop.from.y) * along,
    base,
    z: (hop.floorFrom - base) * (1 - k) + (hop.floorTo - base) * k + hop.peak * Math.sin(Math.PI * k),
    done: k >= 1,
  };
}

// When you step on a geyser: with Ves, the ride up; without her, a shove back.
export { heroFrames };

// Once Ves has offered you her hand (vesHoldsYourHand.js), you don't hang
// off her boot any more: the two of you float up side by side, holding hands.
export function holdingHands() {
  return (WORLD_STATE.seenScenes ?? []).includes('ves_holds_your_hand');
}
// Holding hands: where you float, from the top-left of her frame (her hand
// out at her right edge, yours out at your left).
export const HOLD_OFFSET = { x: 16, y: 7 };

export function canRide() {
  // (Not while she's hurt and riding on your back, with no umbrella.)
  return inParty(VES) && WORLD_STATE.carrying !== VES && Boolean(memberFrames(VES)?.floatA);
}

let heroSprites = null;
function heroFrames() {
  heroSprites ??= {
    hang: [makeSprite(PLAYER_HANG_SPRITES.hangA, PLAYER_PALETTE), makeSprite(PLAYER_HANG_SPRITES.hangB, PLAYER_PALETTE)],
    hold: [makeSprite(PLAYER_HANG_SPRITES.holdA, PLAYER_PALETTE), makeSprite(PLAYER_HANG_SPRITES.holdB, PLAYER_PALETTE)],
    stand: makeSprite(PLAYER_SPRITES.leftIdle, PLAYER_PALETTE),
    step: makeSprite(PLAYER_SPRITES.leftStep, PLAYER_PALETTE),
  };
  return heroSprites;
}

// The ride up (or, arriving, the drift down). The scene stops drawing the
// hero and Ves while it runs and draws this instead. Seconds from the start:
const RIDE = {
  walk: 0.6,   // they step into the wind: Ves to the middle, the hero beside her
  lift: 1.3,   // Ves opens her umbrella to it and floats up, slowing to a hover
  leap: 1.65,  // the hero leaps up in an arc and catches her boot
  dip: 1.95,   // she sinks a little with the weight, then steadies
  rise: 3.7,   // up, slowly at first, then faster and faster
  fade: 4.3,   // into the next room
};
// Arriving: drifting down until the hero's feet touch, they let go and step
// aside, and Ves floats down the last little way.
const LAND = { drift: 1.5, drop: 1.8, settle: 2.2, end: 2.4 };
const LIFT_HEIGHT = 22;   // how high Ves floats before the hero grabs on
const DIP = 3;            // how far she sinks when the hero's weight comes on
const RISE_HEIGHT = 260;  // how far up they go before the screen goes black
const HAND_X = 8;         // the hero's hand, in the hang frames
const BOOT_X = 6;         // Ves's boot, in the float frames
const BESIDE = 13;        // how far to her side the hero stands
const SWAY_SECONDS = 0.3;

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOut = (k) => 1 - (1 - k) * (1 - k);
const easeInOut = (k) => (k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k));
const phase = (t, from, to) => clamp01((t - from) / (to - from));

export class GeyserRide {
  // `geyser` to ride up from it; `landing` to drift down onto (x, y) on arrival.
  constructor({ geyser = null, from = null, landing = null }) {
    this.geyser = geyser;
    this.landing = landing;
    this.t = 0;
    this.done = false;
    this.ves = memberFrames(VES);
    this.hero = heroFrames();
    if (geyser) {
      this.start = from;
      this.x = geyser.x;
      this.y = geyser.y;
      sfx('flare');
    } else {
      this.x = landing.x - BESIDE;
      this.y = landing.y;
    }
  }

  get sortY() {
    return this.y + 1;
  }

  // How black the screen is (0 to 1), for the fade into the next room.
  get blackout() {
    if (this.geyser) return phase(this.t, RIDE.rise, RIDE.fade);
    return 1 - phase(this.t, 0, 0.5);
  }

  // Where the camera looks: at them, until they're well on their way up.
  get focus() {
    return { x: this.x + BESIDE / 2, y: this.y - Math.min(40, this.height * 0.4) };
  }

  update(dt) {
    this.t += dt;
    if (this.geyser && this.t >= RIDE.fade) this.done = true;
    if (this.landing && this.t >= LAND.end) this.done = true;
  }

  // How far up off the ground Ves's boots are.
  get height() {
    const t = this.t;
    if (this.landing) {
      if (t < LAND.drift) return LIFT_HEIGHT + 150 * (1 - easeOut(t / LAND.drift));
      if (t < LAND.drop) return LIFT_HEIGHT;
      return LIFT_HEIGHT * (1 - easeInOut(phase(t, LAND.drop, LAND.settle)));
    }
    if (t < RIDE.walk) return 0;
    if (t < RIDE.leap) return LIFT_HEIGHT * easeOut(phase(t, RIDE.walk, RIDE.lift));
    if (t < RIDE.dip) return LIFT_HEIGHT - DIP * Math.sin(Math.PI * phase(t, RIDE.leap, RIDE.dip));
    const k = phase(t, RIDE.dip, RIDE.rise);
    return LIFT_HEIGHT + RISE_HEIGHT * k * k * k;
  }

  // How hard the wind is swinging them about, 0 to 1: nothing on the
  // ground, building once they're both off it.
  get gusting() {
    if (this.landing) return 1 - phase(this.t, LAND.drift - 0.5, LAND.drift);
    return phase(this.t, RIDE.leap, RIDE.rise - 0.6);
  }

  draw(ctx, camera) {
    const t = this.t;
    const gust = this.gusting;
    const sway = Math.round(Math.sin(t / SWAY_SECONDS) * 3 * gust);
    // Stepping in: they walk from where the hero was onto the geyser.
    let x = this.x;
    let feet = this.y;
    let walking = false;
    if (this.geyser && t < RIDE.walk && this.start) {
      const k = easeInOut(t / RIDE.walk);
      x = this.start.x - BESIDE + (this.geyser.x - (this.start.x - BESIDE)) * k;
      feet = this.start.y + (this.geyser.y - this.start.y) * k;
      walking = true;
    }
    const height = this.height;
    const floating = height > 0.5;
    const hands = holdingHands();
    const float = hands ? ['floatHandA', 'floatHandB'] : ['floatA', 'floatB'];
    const ves = floating ? this.ves[Math.floor(t / 0.25) % 2 ? float[1] : float[0]]
      : walking ? this.ves[Math.floor(t / 0.15) % 2 ? 'downStep' : 'downIdle'] : this.ves.downIdle;
    const vesLeft = Math.round(x) - Math.floor(ves.width / 2) + sway - camera.x;
    const vesTop = Math.round(feet - height) - ves.height - camera.y;
    // Her shadow on the ground, shrinking as she rises.
    const shadow = clamp01(1 - height / 120);
    if (shadow > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${(0.35 * shadow).toFixed(3)})`;
      ctx.fillRect(Math.round(x) - 5 - camera.x, Math.round(feet) - 3 - camera.y, 10, 3);
    }
    ctx.drawImage(ves, vesLeft, vesTop);

    // The hero. Where they'd hang (off her boot, swung about more than she
    // is, flapping faster as the wind picks up) and where they stand (just
    // beside her); the leap and the drop go between the two in an arc.
    const flapSeconds = 0.16 - 0.07 * gust;
    // Holding hands, you float level with her, swaying as she does.
    const hang = (hands ? this.hero.hold : this.hero.hang)[Math.floor(t / (hands ? 0.3 : flapSeconds)) % 2];
    const swing = hands ? 0 : Math.round(Math.sin(t / SWAY_SECONDS + 0.9) * 4 * gust);
    const hangAt = hands ? { x: vesLeft + HOLD_OFFSET.x, y: vesTop + HOLD_OFFSET.y } : { x: vesLeft + BOOT_X - HAND_X + swing, y: vesTop + ves.height - 1 };
    const stand = walking && Math.floor(t / 0.15) % 2 ? this.hero.step : this.hero.stand;
    const standAt = { x: Math.round(x) + BESIDE - Math.floor(stand.width / 2) - camera.x, y: Math.round(feet) - stand.height - camera.y };
    // 0 standing, 1 hanging, in between mid-leap.
    let k;
    if (this.geyser) k = easeInOut(phase(t, RIDE.lift, RIDE.leap));
    else k = 1 - easeInOut(phase(t, LAND.drift, LAND.drop));
    if (k <= 0) {
      ctx.drawImage(stand, standAt.x, standAt.y);
    } else if (k >= 1) {
      ctx.drawImage(hang, hangAt.x, hangAt.y);
    } else {
      const arc = Math.sin(Math.PI * k) * 10;
      const frame = (hands ? this.hero.hold : this.hero.hang)[0];
      ctx.drawImage(frame, Math.round(standAt.x + (hangAt.x - standAt.x) * k), Math.round(standAt.y + (hangAt.y - standAt.y) * k - arc));
    }
  }
}
