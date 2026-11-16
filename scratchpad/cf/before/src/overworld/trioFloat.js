import { makeSprite } from '../engine/sprite.js';
import { PLAYER_PALETTE, PLAYER_HANG_SPRITES } from '../data/art/player.js';
import { BRAMBLE_PALETTE } from '../data/art/bramble.js';
import { memberFrames, inParty } from '../characters/party.js';

// The party floating on the wind: Ves under her open umbrella, the hero holding
// her hand, and (when he's in the party) Bramble hanging off her boot by one
// fist, his legs dangling and kicking. Used by the seed clouds' tosses
// (OverworldScene.hop) and by the wind geyser rides (windGeyser.js), so the
// rides match.

// Where the hero floats, from the top-left of Ves's frame (her free hand out at
// her right edge, his out at his left): the same as the hand-in-hand ride.
export const HOLD = { x: 16, y: 7 };
// Bramble hangs below her; his fist is the left of his frame, so these put it
// on the toe of her left boot (which sways a pixel between her two frames).
const BOOT_FIST = [4, 2];
export const BRAMBLE_DROP = 21; // how far his boots hang below her feet

export function brambleHere() {
  return inParty('bramble');
}

// Hanging by his left hand from her boot, the other arm hanging, boots
// dangling. Full size: the same head and body as when he stands
// (BRAMBLE_FRAMES.downIdle), just with the arm up. Two frames: legs straight,
// then one swung out.
const DANGLE = {
  a: [
    '.kCCk...........',
    '.kCCk...........',
    '.k33k....k.k.kk.',
    '.kU3k..kk-k-k33k',
    '.kU3k.k-+k+-+U3k',
    '.k3Ukk+-+++-+kk.',
    '.kU3k+-++++-+-k.',
    '.k3Uk++-+-+++-k.',
    '.kU3k+C+CC+C+Ck.',
    '.k3UkCCkCCCkCCk.',
    '.kU3kCCkCCCkCCk.',
    '.k3Uk*C*CCC*C*k.',
    '.kU3kkCCCUCCCkk.',
    '..kUU33U33U33k..',
    '..kk3U33U33UkUk.',
    '...k3U33U33UkUk.',
    '...kZUUZUUZUkCk.',
    '...kUkUkkUkZkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '...kDDk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  b: [
    '.kCCk...........',
    '.kCCk...........',
    '.k33k....k.k.kk.',
    '.kU3k..kk-k-k33k',
    '.kU3k.k-+k+-+U3k',
    '.k3Ukk+-+++-+kk.',
    '.kU3k+-++++-+-k.',
    '.k3Uk++-+-+++-k.',
    '.kU3k+C+CC+C+Ck.',
    '.k3UkCCkCCCkCCk.',
    '.kU3kCCkCCCkCCk.',
    '.k3Uk*C*CCC*C*k.',
    '.kU3kkCCCUCCCkk.',
    '..kUU33U33U33k..',
    '..kk3U33U33UkUk.',
    '...k3U33U33UkUk.',
    '...kZUUZUUZUkCk.',
    '...kUkUkkUkZkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '...kDDk...kDDk..',
    '..k))Lk...k))Lk.',
  ],
};

let made = null;
function sprites() {
  made ??= {
    hold: [makeSprite(PLAYER_HANG_SPRITES.holdA, PLAYER_PALETTE), makeSprite(PLAYER_HANG_SPRITES.holdB, PLAYER_PALETTE)],
    dangle: [makeSprite(DANGLE.a, BRAMBLE_PALETTE), makeSprite(DANGLE.b, BRAMBLE_PALETTE)],
  };
  return made;
}

// Bramble hanging off a boot. `vesLeft`, `vesFeet`: the top-left x and bottom y
// of her frame on screen; `t` seconds on, for the kicking and the swing.
export function drawDangle(ctx, vesLeft, vesFeet, t, vesFrame = 0) {
  const kick = sprites().dangle[Math.floor(t / 0.28) % 2];
  const swing = Math.round(Math.sin(t / 0.45 + 1.2));
  ctx.drawImage(kick, vesLeft + BOOT_FIST[vesFrame] + swing, vesFeet - 1);
}

// The hero's frame, level with her, holding hands.
export function holdFrame(t) {
  return sprites().hold[Math.floor(t / 0.3) % 2];
}

// Floating on a toss from a seed cloud (or any hop): at the hero's spot, lifted
// off the ground a little, swaying. `at()` says where, from the scene.
export class FloatTrio {
  // `body` is the hero (x, y, ground, z, sortY); `hop` gives how far along.
  constructor(body, hop, withBramble) {
    this.body = body;
    this.hop = hop;
    this.withBramble = withBramble;
    this.ves = memberFrames('vesper');
    this.start = performance.now() / 1000;
  }

  get sortY() {
    return this.body.sortY + 1;
  }

  draw(ctx, camera) {
    const { body, hop } = this;
    const t = performance.now() / 1000 - this.start;
    const k = Math.min(1, hop.t / hop.seconds);
    // Lifted off the ground over the first and last bit, so the dangling boy
    // clears the grass when they're up.
    const lift = (this.withBramble ? BRAMBLE_DROP + 3 : 6) * Math.min(1, k * 10, (1 - k) * 10);
    const frame = Math.floor(t / 0.25) % 2;
    const ves = this.ves[frame ? 'floatHandB' : 'floatHandA'];
    const sway = Math.round(Math.sin(t / 0.5) * 1.5);
    const feet = Math.round(body.y - body.ground - Math.max(0, body.z) - lift);
    const width = HOLD.x + 12;
    const left = Math.round(body.x) - Math.floor(width / 2) + sway - camera.x;
    const top = feet - ves.height - camera.y;
    // The shadow stays on the floor under them.
    ctx.fillStyle = `rgba(0, 0, 0, ${(0.3 * Math.max(0.25, 1 - (lift + Math.max(0, body.z)) / 60)).toFixed(3)})`;
    ctx.fillRect(Math.round(body.x) - 6 - camera.x, Math.round(body.y - body.ground) - 3 - camera.y, 12, 3);
    ctx.drawImage(ves, left, top);
    ctx.drawImage(holdFrame(t), left + HOLD.x, top + HOLD.y + Math.round(Math.sin(t / 0.5 + 0.8)));
    if (!this.withBramble) return;
    // Up in the air he hangs off her boot; just off the ground (taking off,
    // landing) he stands beside her instead of dangling with his feet in the grass.
    if (lift >= BRAMBLE_DROP) drawDangle(ctx, left, top + ves.height, t, frame);
    else {
      const kid = memberFrames('bramble').downIdle;
      ctx.drawImage(kid, left - kid.width + 4, Math.round(body.y - body.ground - Math.max(0, body.z)) - kid.height - camera.y);
    }
  }
}
