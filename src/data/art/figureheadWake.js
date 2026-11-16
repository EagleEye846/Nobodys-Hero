import { Pix } from './ch5Kit.js';
import { FAIRWEATHER_PALETTE, figure as lady } from './fairweather.js';

// THE FIGUREHEAD WAKING (Chapter 5, the ship's perch): Madam Fairweather as she is in the overworld, the carved figurehead
// off the bow of the Fair Return, drawn big (136 x 112) with the things she is fixed to: the bowsprit coming out of the
// end of the deck planks, rising to pass behind her; the knee of timber at her back, her iron strap bolted to it, her gown
// running down into its gilt scroll; the heavy cutwater, bolted; the iron bobstay from the spar's end down to her foot.
// Dark water and foam round her base. Still dressed for the party: a paper lantern hung from the spar, a streamer gone
// slack on the bitts, a goblet tipped over on the cutwater.
//
// She is the same carving as in her fight (src/data/art/fairweather.js, `figure`: the painted mask, the one-block body,
// a mitten hand over the star, the other held open), turned round to face the way the ship goes (right, out to sea).
// Every clip below is that picture drawn a little differently:
//   sleep    dark: her mask turned back over her shoulder to the empty deck, eyes shut, the star a faint glimmer
//   shudder  she hears you: the wood creaks and shakes, the elbow splits, flakes of old paint come off
//   eyes     the painted eyes open (still on the deck), the light comes up under her hand
//   turn     her head comes round with a creak, full face, to you
//   hand     the open hand turns over, palm up, toward you
//   awake    looking at you, the light pulsing under her hand; a glance back at the empty deck, then at you again
//   laugh    delighted, shaking with it, the mask jolting
//   dark     after the fight: facing the deck, eyes shut, the star gone out
// The first 36 columns are empty: the picture is centred on the two-tile prop but the deck planks that end at
// the prop's left edge are the room's own tiles. (draft)
export const FIGUREHEAD_WAKE_PALETTE = {
  ...FAIRWEATHER_PALETTE,
  // rope
  q: '#6c5e44', Q: '#a8987a',
  // the dark water round her foot
  8: '#0b1a1e', 9: '#14292e', A: '#23484e',
  // fog lying on the water
  B: 'rgba(150, 190, 200, 0.26)', C: 'rgba(190, 222, 228, 0.4)',
  // the star's light in the air
  L: 'rgba(150, 210, 255, 0.14)', l: 'rgba(150, 210, 255, 0.3)',
};

const PAD = 36; // empty columns at the left (see above)
const DW = 100; // the picture's own width
const DH = 112;
const STAR = [72, 58]; // the shard in her breast (src/data/art/ghostShip.js lights it from here)
// Where her own picture (64 wide, drawn facing left) goes, turned round: her star (18, 34) lands on STAR.
const LADY_X = STAR[0] - (63 - 18);
const LADY_Y = STAR[1] - 34;
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const spar = (t) => [38 + (92 - 38) * t, 78 + (38 - 78) * t];

// The ship she is fixed to (drawn once): deck planks' end, spar, knee, cutwater, bobstay, and what's left of the party.
function shipParts() {
  const p = new Pix(DW, DH);
  // The bobstay: iron chain from the spar's end down to the foot of her stem.
  const chain = (x0, y0, x1, y1) => {
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      p.set(x, y, i % 3 === 0 ? 'J' : i % 3 === 1 ? 'j' : 'I');
      if (i % 3 === 0) p.set(x + 1, y, 'j');
    }
  };
  chain(91, 42, 74, 99);
  // The end of the deck: the planks run on and narrow into the heel of the spar.
  p.poly([[16, 64], [30, 64], [44, 76], [48, 88], [44, 100], [30, 112], [16, 112]], '3');
  p.rect(16, 64, 18, 2, '4');
  p.poly([[30, 64], [44, 76], [45, 78], [30, 66]], '5');
  for (const y of [80, 96]) p.rect(16, y, 20, 1, '2');
  for (const x of [24, 31]) { p.rect(x, 66, 1, 14, '2'); p.rect(x + 3, 82, 1, 14, '2'); p.rect(x, 98, 1, 14, '2'); }
  p.rect(16, 64, 2, 48, '4');
  // The bitts: two stout posts the spar is lashed down to.
  for (const x of [36, 42]) { p.rect(x, 66, 3, 12, '2'); p.rect(x, 66, 3, 2, '4'); p.set(x + 1, 67, 'J'); }
  // The bowsprit: a round spar, lit on top, rising to pass behind her.
  for (let i = 0; i <= 80; i++) {
    const [x, y] = spar(i / 80);
    p.ellipse(x, y, 4.2, 4.2, '4');
    p.ellipse(x, y + 2, 3, 1.8, '3');
    p.ellipse(x, y - 2.2, 2.6, 1.2, '5');
  }
  for (const t of [0.1, 0.45, 0.78]) {
    const [x, y] = spar(t);
    p.rect(x - 1, y - 5, 3, 9, 'I');
    p.set(x, y - 5, 'J'); p.set(x, y - 4, 'j');
  }
  // Lashing at the bitts: turns of rope.
  for (let k = 0; k < 4; k++) { const [x, y] = spar(0.04 + k * 0.025); p.line(x - 2, y - 4, x + 2, y + 4, 'Q'); p.line(x - 1, y - 4, x + 3, y + 4, 'q'); }
  // The tip: a cap of iron with a ring for the stay.
  p.rect(90, 35, 4, 7, 'I'); p.rect(91, 34, 2, 1, 'J'); p.ring(93, 44, 2, 2, 'J');
  // The knee: a curved timber at her back, rising out of the cutwater; her strap is bolted to it.
  const knee = [[48, 104], [51, 92], [54, 78], [58, 66], [61, 54]];
  for (let i = 0; i + 1 < knee.length; i++) {
    p.line(knee[i][0], knee[i][1], knee[i + 1][0], knee[i + 1][1], '3', 10);
    p.line(knee[i][0] - 3, knee[i][1], knee[i + 1][0] - 3, knee[i + 1][1], '2', 3);
    p.line(knee[i][0] + 3, knee[i][1], knee[i + 1][0] + 3, knee[i + 1][1], '4', 2);
  }
  // The cutwater: the heavy block she stands on, through-bolted, a gilt moulding along its top.
  p.rect(34, 96, 40, 10, '2');
  p.rect(34, 96, 40, 2, '4');
  p.rect(34, 96, 40, 1, 'c');
  p.rect(34, 104, 40, 2, '1');
  for (const x of [38, 48, 58, 68]) { p.ring(x, 100, 1.6, 1.6, 'J'); p.set(x, 100, 'I'); }
  p.outline('k');
  // What's left of the party. A paper lantern on a cord from the ring at the spar's end, still hung.
  const [lx, ly] = [94, 39];
  p.line(lx, ly + 4, lx, ly + 7, 'q');
  p.set(lx, ly + 7, 'b');
  p.rect(lx - 1, ly + 8, 3, 4, '$');
  p.line(lx + 1, ly + 8, lx + 1, ly + 11, '+');
  p.set(lx, ly + 9, '+'); p.set(lx - 2, ly + 9, '$'); p.set(lx + 2, ly + 9, '+'); p.set(lx - 2, ly + 10, '$'); p.set(lx + 2, ly + 10, '+');
  p.set(lx, ly + 12, 'b'); p.set(lx, ly + 13, '$');
  // A streamer knotted round a bitt, gone slack, trailing down the post.
  for (let y = 68; y < 80; y++) p.set(43 + Math.round(Math.sin(y * 0.6) * 0.8), y, Math.floor((y - 68) / 3) % 2 ? '*' : '&');
  p.rect(42, 68, 3, 1, '&');
  // A goblet, tipped over on the cutwater.
  for (const [x, y, c] of [[64, 94, 'b'], [66, 94, 'c'], [67, 94, 'c'], [68, 94, 'd'], [63, 95, 'a'], [64, 95, 'b'], [65, 95, 'c'], [66, 95, 'c']]) p.set(x, y, c);
  for (const [x, y] of [[62, 94], [63, 94], [65, 94], [69, 94], [62, 95], [67, 95], [68, 95], [64, 93], [65, 93], [66, 93], [67, 93], [68, 93]]) if (p.get(x, y) === '.') p.set(x, y, 'k');
  return p;
}
const SHIP = shipParts().rows();

// Dark water and foam round her base.
function waterBack(p, ph) {
  p.ellipse(54, 104, 36, 7, '8');
  p.ellipse(54, 102, 29, 5, '9');
  for (let k = 0; k < 3; k++) {
    const r = 18 + k * 8 + ((ph * 3) % 8);
    for (let a = 0; a < 6.28; a += 0.12) {
      const x = 54 + Math.cos(a) * r * 1.3;
      const y = 104 + Math.sin(a) * r * 0.2;
      if (hash(a * 9 + k + ph) > 0.35 && y < 110) p.put(x, y, 'A', ['.']);
    }
  }
}
function waterFront(p, ph) {
  for (let i = 0; i < 26; i++) {
    const x = 28 + i * 2.1 + Math.sin(ph * 1.3 + i) * 1.3;
    const y = 104 + Math.sin(i * 1.7 + ph * 1.1) * 1.6 + (i % 3);
    p.set(x, y, i % 4 === 0 ? 'F' : 'f');
    if (i % 3 === 0) p.set(x + 1, y + 1, 'f');
  }
  for (const [x, y] of [[40, 106], [52, 107], [64, 106], [72, 104]]) p.rect(x + Math.round(Math.sin(ph + x)), y, 4, 1, 'f');
}
// Fog lying on the water round her (only over what is empty: she is never hazed over).
function fogBands(p, density, shift) {
  if (density <= 0) return;
  for (const [y, ry, k] of [[96, 3, 0], [103, 3, 1], [109, 3, 2]]) {
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 34 + shift * (k % 2 ? -1 : 1) * 1.5 + k * 11) % 130) - 12;
      const rx = (14 + (i % 2) * 6 + k * 2) * Math.min(1, density);
      p.ellipse(cx, y, rx, ry * Math.min(1, density) + 0.5, k === 1 ? 'C' : 'B', ['.']);
    }
  }
}

// One picture. `o`: her pose (see `figure` in fairweather.js: look, mood, hand, far, elbow, leak, star, cracks, jolt...)
// plus dx/dy (a shake), ph (the water), fog (0 to 1), fogShift, peel (how far through falling the flakes of old
// paint are, 0 none), pulse (a ring of light), halo (0-3, the light in the air round the star).
function fig(over = {}) {
  const o = {
    look: 'deck', mood: 'shut', hand: 'down', star: 'dim', leak: 0, cracks: 1, elbow: 1, halo: 0,
    dx: 0, dy: 0, ph: 0, fog: 1, fogShift: 0, peel: 0, pulse: 0, ...over,
  };
  const p = new Pix(DW, DH);
  waterBack(p, o.ph);
  p.stamp(SHIP, 0, 0);
  // Her, turned round to face out to sea.
  const her = lady(o, true).map((row) => [...row].reverse().join(''));
  p.stamp(her, LADY_X + o.dx, LADY_Y + o.dy);
  waterFront(p, o.ph);
  // The glow in the air round her: a soft halo where there is nothing else.
  if (o.halo > 0) {
    const [sx, sy] = STAR;
    const r = [0, 14, 22, 30][o.halo];
    for (let y = 0; y < DH; y++) for (let x = 0; x < DW; x++) {
      if (p.get(x, y) !== '.') continue;
      const dist = Math.hypot((x - sx - o.dx) * 0.85, (y - sy - o.dy) * 1.1);
      if (dist < r * 0.55 && (x + y) % 2 === 0) p.set(x, y, 'l');
      else if (dist < r && (x + y) % 3 === 0) p.set(x, y, 'L');
    }
  }
  if (o.pulse) {
    const [sx, sy] = STAR;
    p.ring(sx + o.dx, sy + o.dy, o.pulse * 1.05, o.pulse * 0.9, 'l', 1.4);
  }
  fogBands(p, o.fog, o.fogShift);
  // Flakes of old paint coming away and falling: `peel` is how long they have been falling.
  if (o.peel) {
    const kinds = ['P', 'p', 'g', 'W', 'c', 'H'];
    for (let i = 0; i < 22; i++) {
      const bornAt = hash(i * 4.1) * 2.2;
      const t = o.peel - bornAt;
      if (t < 0) continue;
      const x = 46 + hash(i * 1.7) * 36 + Math.sin(t * 3 + i) * 2.2;
      const y0 = 28 + hash(i * 2.9) * 50;
      const y = y0 + t * (14 + hash(i * 5.3) * 10);
      if (y > 100) continue;
      p.set(x, y, kinds[i % kinds.length]);
      if (i % 3 === 0) p.set(x + 1, y, kinds[i % kinds.length]);
    }
  }
  // Nothing left of the end of the planks: those columns are the deck, which is the room's own.
  for (let y = 0; y < DH; y++) for (let x = 0; x < 16; x++) p.set(x, y, '.');
  return p.rows().map((row) => '.'.repeat(PAD) + row);
}

// Awake: full face to you, the light up under her hand.
const AWAKE = { look: 'front', mood: 'look', hand: 'up', star: 'lit', leak: 2, halo: 2, fog: 0.3 };

// ---- the clips ----
export const FIGUREHEAD_WAKE_SLEEP_SPRITES = {
  f1: fig({ ph: 0, fogShift: 0 }),
  f2: fig({ ph: 1.2, fogShift: 3 }),
  f3: fig({ ph: 2.4, fogShift: 6, star: 'lit', leak: 1 }),
  f4: fig({ ph: 3.6, fogShift: 9 }),
};
export const FIGUREHEAD_WAKE_SHUDDER_SPRITES = {
  f1: fig({ dx: 1, ph: 0.5, star: 'lit', leak: 1, halo: 1, peel: 0.3, fogShift: 2 }),
  f2: fig({ dx: -1, dy: 1, ph: 0.9, peel: 0.6, fogShift: 3, elbow: 2 }),
  f3: fig({ dx: 1, ph: 1.3, star: 'lit', leak: 1, halo: 1, peel: 0.9, fogShift: 4, elbow: 2, fall: 1 }),
  f4: fig({ dx: -1, dy: -1, ph: 1.7, peel: 1.2, fogShift: 5, elbow: 2, fall: 2, jolt: [1, 0] }),
  f5: fig({ dx: 2, ph: 2.1, star: 'lit', leak: 2, halo: 1, peel: 1.5, fogShift: 6, elbow: 2, fall: 3 }),
  f6: fig({ dx: -1, dy: 1, ph: 2.5, peel: 1.8, fogShift: 7, elbow: 2, fall: 4, jolt: [-1, 0] }),
};
export const FIGUREHEAD_WAKE_EYES_SPRITES = {
  f1: fig({ mood: 'shut', star: 'lit', leak: 1, halo: 1, elbow: 2, peel: 1.4, fog: 0.8, ph: 0 }),
  f2: fig({ mood: 'half', star: 'lit', leak: 1, halo: 2, elbow: 2, peel: 1.7, fog: 0.7, ph: 0.6 }),
  f3: fig({ mood: 'half', star: 'lit', leak: 2, halo: 2, elbow: 2, peel: 2.0, fog: 0.6, ph: 1.2 }),
  f4: fig({ mood: 'sad', star: 'lit', leak: 2, halo: 2, elbow: 2, peel: 2.2, fog: 0.5, ph: 1.8 }),
  f5: fig({ mood: 'sad', star: 'lit', leak: 3, halo: 3, elbow: 2, peel: 2.2, fog: 0.4, ph: 2.4, pulse: 8 }),
  f6: fig({ mood: 'sad', star: 'lit', leak: 3, halo: 3, elbow: 2, fog: 0.4, ph: 3, pulse: 14 }),
};
export const FIGUREHEAD_WAKE_TURN_SPRITES = {
  f1: fig({ ...AWAKE, look: 'deck', mood: 'sad', hand: 'down', elbow: 2, halo: 3, dx: 1, ph: 0.3 }),
  f2: fig({ ...AWAKE, look: 'deck', mood: 'look', hand: 'down', elbow: 2, halo: 3, dx: -1, ph: 0.6, jolt: [-1, 0] }),
  f3: fig({ ...AWAKE, mood: 'look', hand: 'down', elbow: 2, halo: 3, dx: 1, ph: 0.9, peel: 0.4, jolt: [1, 0] }),
  f4: fig({ ...AWAKE, mood: 'look', hand: 'down', elbow: 2, halo: 3, dx: -2, ph: 1.2, peel: 0.7 }),
  f5: fig({ ...AWAKE, mood: 'look', hand: 'down', elbow: 2, halo: 3, dx: 1, ph: 1.5, peel: 1.0, nod: 1 }),
  f6: fig({ ...AWAKE, mood: 'look', hand: 'down', elbow: 2, halo: 3, ph: 1.8, peel: 1.3, nod: 1 }),
};
export const FIGUREHEAD_WAKE_HAND_SPRITES = {
  f1: fig({ ...AWAKE, hand: 'down', elbow: 2, halo: 3, ph: 0, nod: 1 }),
  f2: fig({ ...AWAKE, hand: 'side', elbow: 2, halo: 3, ph: 0.5, dy: -1 }),
  f3: fig({ ...AWAKE, hand: 'side', elbow: 2, halo: 3, ph: 1, peel: 0.3 }),
  f4: fig({ ...AWAKE, hand: 'up', elbow: 2, halo: 3, ph: 1.5, dy: -1, peel: 0.6, leak: 3 }),
  f5: fig({ ...AWAKE, hand: 'up', elbow: 2, halo: 3, ph: 2, pulse: 10, leak: 3 }),
};
export const FIGUREHEAD_WAKE_AWAKE_SPRITES = {
  f1: fig({ ...AWAKE, ph: 0 }),
  f2: fig({ ...AWAKE, leak: 3, halo: 3, ph: 1, pulse: 9, dy: -1 }),
  f3: fig({ ...AWAKE, look: 'deck', mood: 'sad', leak: 2, halo: 3, ph: 2, pulse: 17 }),
  f4: fig({ ...AWAKE, leak: 1, halo: 2, ph: 3, dy: -1 }),
};
export const FIGUREHEAD_WAKE_LAUGH_SPRITES = {
  f1: fig({ ...AWAKE, mood: 'delight', leak: 3, halo: 3, ph: 0, dx: 1, jolt: [0, -1] }),
  f2: fig({ ...AWAKE, mood: 'delight', far: 'beckon', elbow: 2, leak: 3, halo: 3, ph: 0.8, dx: -1, dy: -1 }),
  f3: fig({ ...AWAKE, mood: 'delight', leak: 3, halo: 3, ph: 1.6, dx: 1, pulse: 12, jolt: [1, 0] }),
  f4: fig({ ...AWAKE, mood: 'delight', far: 'beckon', elbow: 2, leak: 3, halo: 3, ph: 2.4, dx: -1, dy: 1, jolt: [0, 1] }),
};
export const FIGUREHEAD_WAKE_DARK_SPRITES = {
  f1: fig({ mood: 'shut', star: 'out', fog: 1, ph: 0, elbow: 2 }),
  f2: fig({ mood: 'shut', star: 'out', fog: 1, ph: 1.5, fogShift: 4, elbow: 2 }),
  f3: fig({ mood: 'shut', star: 'out', fog: 1, ph: 3, fogShift: 8, elbow: 2 }),
};
