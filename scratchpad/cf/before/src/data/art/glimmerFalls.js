// The Echo Falls (Chapter 4, the Glimmering): a sheet of glowing water pouring
// off a lip in the cave roof into the pool below. Drawn as a prop 4 tiles wide
// and 4 tall that stands on the pool's near edge, so the ledge behind it is
// hidden when you walk there (you walk behind the falls). Four frames of
// streaks sliding down, spray at the foot. Its name as an animation is
// `glow_falls`. Its own colours, on private characters, merged into
// PROP_PALETTE by props.js.

const COLORS = {
  a: '#0e3a4a', // deep teal
  b: '#17707e',
  c: '#1f9ea8',
  d: '#4fe0d0',
  e: '#b8fff0',
  f: '#ffffff',
  g: '#2a6a8a', // shadow behind the water
};
const REMAP = {};
export const GLOW_FALLS_PALETTE = {};
Object.entries(COLORS).forEach(([letter, color], i) => {
  const char = String.fromCharCode(0xe900 + i);
  REMAP[letter] = char;
  GLOW_FALLS_PALETTE[char] = color;
});
export const GLIMMER_FALLS_PALETTE_EXTRA = GLOW_FALLS_PALETTE;

const W = 64;
const H = 64;

function hash(a, b) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function falls(frame) {
  const rows = Array.from({ length: H }, () => Array(W).fill('.'));
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) rows[y][x] = REMAP[c]; };
  for (let x = 3; x < W - 3; x++) {
    // The sheet is narrower at the lip and bulges as it falls; ragged edges.
    const edge = Math.floor(hash(x, 1) * 2);
    const near = Math.min(x - 3, W - 4 - x);
    const bottom = H - 6 - (near < 3 ? 6 - near * 2 : 0) - edge;
    for (let y = 0; y < bottom; y++) {
      // A column of water: a base tone, and bright streaks that slide down.
      const phase = hash(x, 7) * 24;
      const t = (y + frame * 6 + phase) % 24;
      let c = near < 2 ? 'b' : (x % 3 === 0 ? 'b' : 'c');
      if (t < 4 && near >= 2) c = 'd';
      if (t < 1 && hash(x, 9) < 0.5 && near >= 3) c = 'e';
      if (y < 3) c = 'a';
      if (near < 1) c = 'a';
      set(x, y, c);
    }
  }
  // Spray and foam at the foot, bobbing with the frame.
  for (let i = 0; i < 46; i++) {
    const sx = 4 + Math.floor(hash(i, 3) * (W - 8));
    const lift = Math.floor(hash(i, 5 + frame) * 7);
    const sy = H - 3 - lift;
    set(sx, sy, hash(i, 11) < 0.5 ? 'e' : 'f');
    if (hash(i, 13) < 0.4) set(sx + 1, sy + 1, 'd');
  }
  for (let x = 4; x < W - 4; x++) {
    set(x, H - 2, hash(x + frame, 2) < 0.6 ? 'd' : 'e');
    if (hash(x, 4 + frame) < 0.5) set(x, H - 3, 'e');
  }
  return rows.map((r) => r.join(''));
}

export const GLIMMER_FALLS_PROP_SPRITES = {
  glow_falls: falls(0),
};
export const GLIMMER_FALLS_FOOTPRINTS = {
  glow_falls: 4,
};
// The glow it gives the cave (light pools on the ledge and the pool).
export const GLIMMER_FALLS_GLOWS = {
  glow_falls: [
    { dy: -34, bloom: 22, strength: 0.4, flicker: 0.15, color: '110, 220, 255' },
    { dy: -4, pool: 80, strength: 0.5, flicker: 0.1, color: '110, 220, 255' },
  ],
};
// As a moving prop: put `animation: 'glow_falls'` on it.
export const GLOW_FALLS_SPRITES = { f1: falls(0), f2: falls(1), f3: falls(2), f4: falls(3) };
