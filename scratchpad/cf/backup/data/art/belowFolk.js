// The Below Folk (Chapter 4, "The First"): the creature people of Belowtown
// and the fields above it. Tuck the shy dormouse page, King Peptup the
// Resplendent (a big painted wooden marionette man on a hinge, and his throne), Hobnail
// the mole smith, Marigold the hare with her lemonade stand, Ferryman Gubb,
// and the Belowtown crowd: lamplighter, miners, postman, innkeeper, sleeper,
// frog kids, an old snail, a market shrew, a guard, and heads for a crowd.
//
// Everything here is drawn like the props in props.js: rows of characters,
// standing on the tile's bottom edge, centred, a person about 16 wide. They
// are built with a few small shape helpers (ellipses, lines, a one-pixel
// outline pass) and then touched up by hand, so a pose and its variants stay
// the same figure. All the colours are in BF_PALETTE below; it's merged into
// PROP_PALETTE (props.js) under spare private characters, so the sprites
// here work as props, as cutscene looks ('prop:bf_tuck') and as animations
// ('bf_tuck', 'bf_tuck_walk_down' ...: see src/engine/animations.js).
//
// Also here, for the dialogue box: the faces of Tuck, King Peptup, Hobnail,
// Marigold and Gubb (PORTRAITS in portraits.js: 'tuck', 'rumbold', 'hobnail',
// 'marigold', 'gubb').

// --- The colours ---
// Written with plain letters here; each letter is swapped for a private
// character when the sprites are built (see `remap`), so none of them can
// clash with a letter another art file has already used in PROP_PALETTE.
const LOCAL_COLORS = {
  k: '#120c1c', // outline
  // Tuck, the dormouse
  F: '#dda46a', // fur
  f: '#b27c4a', // fur in shadow
  b: '#f6dfb4', // belly and muzzle
  p: '#ea9c9c', // inside the ears, blushes
  e: '#1a1020', // eyes
  w: '#ffffff', // shine
  n: '#d86a78', // noses
  r: '#b02a3c', // royal red (the tabard)
  R: '#7e1a2e', // tabard in shadow
  g: '#f0c050', // gold
  G: '#bf8a26', // gold in shadow
  // King Peptup, painted wood
  W: '#e2aa62', // wood, lit
  X: '#b87c3e', // wood
  Y: '#7e4e24', // wood in shadow
  y: '#573318', // wood grain and joins
  c: '#f6eedb', // face paint, cream
  C: '#d9ccb0', // face paint in shadow
  d: '#2c2632', // black paint (stripes, pupils)
  o: '#ee7e8c', // rosy painted cheeks
  q: '#cc2a3c', // painted lips
  v: '#a81c34', // velvet
  V: '#6c0f24', // velvet in shadow
  m: '#f4f1ea', // ermine
  M: '#2a2630', // ermine tails
  h: '#dfae48', // brass hinges and nails
  l: '#b4e0ee', // glass eyes
  L: '#5a96b8', // glass eyes in shadow
  // Hobnail, the mole
  a: '#4c465c', // mole velvet
  A: '#6e6882', // mole velvet, lit
  P: '#eaa8a0', // pink snout and hands
  Q: '#c27a7a', // pink in shadow
  B: '#8c5a2a', // leather apron
  T: '#5a3a1e', // dark leather, boots
  S: '#bcc4d4', // steel
  s: '#8a8498', // steel in shadow
  z: '#2c3a48', // smoked glass
  O: '#ff8c1a', // hot iron and embers
  E: '#fff0a0', // white-hot
  // Marigold, the hare
  H: '#e8cfa6', // hare fur
  J: '#c49a68', // hare fur in shadow
  u: '#f4d460', // sun bonnet
  U: '#d4a034', // bonnet in shadow
  i: '#f4f1ea', // apron and cloth
  I: '#cfc8bc', // apron in shadow
  t: '#79b8e2', // sky-blue dress
  K: '#4f86b4', // dress in shadow
  x: '#ffe85a', // lemons
  // Gubb, the cave frog
  j: '#8aa874', // frog skin
  N: '#b6cf98', // frog, lit
  D: '#587350', // frog in shadow
  Z: '#e6e8bc', // pale belly
  '1': '#cdb98a', // oatmeal smock
  '2': '#a28c62', // smock in shadow
  '3': '#6a4a2a', // pole wood
  // Belowtown folk
  '4': '#ffe066', // glow-worm light
  '5': '#a7e88a', // glow-worm body glow
  '6': '#6fb85a', // glow-worm body
  '7': '#3c7a3c', // glow-worm, dark
  '8': '#e8b830', // hard hats
  '9': '#b88a1a', // hard hat in shadow
  '0': '#6c5a7a', // beetle shell, plum
  '!': '#4a3a58', // beetle shell, dark
  '@': '#9a86ae', // beetle shell, lit
  '#': '#8a9a58', // toad skin
  '$': '#6a7a3e', // toad in shadow
  '%': '#c8d0a0', // toad belly
  '&': '#8a6a98', // bat fur
  '*': '#5a4670', // bat fur in shadow
  '(': '#c8b0d4', // bat ears and wings inside
  ')': '#d8a05a', // snail shell
  '-': '#a46a30', // shell spiral
  '+': '#e8d4bc', // snail skin
  '=': '#c4b09a', // snail skin in shadow
  ';': '#a89a8a', // shrew fur
  ':': '#7e7266', // shrew fur in shadow
  '<': '#3a8a9a', // newt skin
  '>': '#256270', // newt in shadow
  '?': '#e87a3a', // newt belly orange
  '/': '#9aa4b4', // helmet iron
  '[': '#6c7484', // helmet in shadow
  ']': '#e0585a', // red (toys, scarves)
  '^': '#5a8ad8', // blue (toys, shirts)
  '_': '#fff2c0', // lamplight
  '{': '#6a8a3a', // moss
  '|': '#4a3a2a', // dark mud, boots
  '}': '#d0d6e6', // pale blue-white
  '~': '#c8a0d8', // lilac
  // The glow inside the living king, and a lighter fur for Tuck
  '`': '#fff6c8', // glow, white-gold core
  ',': '#ffd070', // glow, gold
  "'": '#f2c690', // fur, lit
  '"': '#fff0d6', // tail tip, whiskers
  '\\': '#93603a', // Tuck's darker back fur
  // King Peptup's new clothes and varnish: royal blue doublet, deep purple
  // cape, brighter wood, painted blue eyes and a jewel red
  'ä': '#3b5bd6', // royal blue doublet and hose
  'ö': '#26398f', // blue in shadow
  'ü': '#6f8cf0', // blue, lit
  'à': '#6a35a8', // deep purple cape
  'á': '#42206e', // purple in shadow
  'â': '#8d58c8', // purple, lit
  'ã': '#f7cf92', // varnished wood, highlight
  'å': '#2f86f0', // painted irises
  'æ': '#1b4aa8', // irises in shadow
  'ç': '#ff4a5e', // jewel red
  // King Peptup as the folk see him: a man (skin, greying hair, white gloves)
  'è': '#f0c49a', // skin
  'é': '#cf9470', // skin in shadow
  'ê': '#fbdcb8', // skin, lit
  'ì': '#9a8676', // greying hair
  'í': '#5e4c42', // hair in shadow, brows, moustache
  // Grig, the cave cricket who keeps the stall in the Deep
  'ò': '#8a5a3a', // cricket shell
  'ó': '#b8824e', // shell, lit
  'ô': '#4e301c', // shell in shadow, legs
  'õ': '#e0c088', // pale belly, pack canvas
};

// Local letter -> private character, so a sprite's rows go straight into
// PROP_PALETTE (and BF_PALETTE) without clashing with any other art file.
const REMAP = {};
export const BF_PALETTE = {};
Object.entries(LOCAL_COLORS).forEach(([letter, color], i) => {
  const char = String.fromCharCode(0xe400 + i);
  REMAP[letter] = char;
  BF_PALETTE[char] = color;
});
const remap = (rows) => rows.map((row) => [...row].map((ch) => REMAP[ch] ?? ch).join(''));
// What props.js merges into PROP_PALETTE.
export const BF_PALETTE_EXTRA = BF_PALETTE;

// --- Shape helpers ---
// A little canvas of characters ('.' is see-through). Shapes go on in order,
// later ones over earlier; `outline` finishes the figure with a one-pixel
// dark edge.
class Cv {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  get(x, y) { return this.g[y]?.[x]; }
  px(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h && c !== undefined) this.g[y][x] = c;
    return this;
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c);
    return this;
  }
  // A filled ellipse about (cx, cy), shaded from the upper left: `hi` where it
  // faces the light, `lo` where it turns away.
  ell(cx, cy, rx, ry, c, hi = null, lo = null) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const n = (x - cx) / rx;
        const m = (y - cy) / ry;
        if (n * n + m * m > 1) continue;
        const v = -0.6 * n - 0.8 * m;
        this.px(x, y, hi && v > 0.5 ? hi : lo && v < -0.45 ? lo : c);
      }
    }
    return this;
  }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
    return this;
  }
  // Rows of characters stamped on at (x, y); '.' leaves what's there.
  stamp(rows, x, y) {
    rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') this.px(x + i, y + j, ch); }));
    return this;
  }
  // Every empty cell touching a filled one (up, down, left, right) becomes `c`.
  outline(c = 'k') {
    const keep = this.g.map((row) => [...row]);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (keep[y][x] !== '.') continue;
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (keep[y + dy]?.[x + dx] ?? '.') !== '.')) this.g[y][x] = c;
      }
    }
    return this;
  }
  rows() { return this.g.map((row) => row.join('')); }
  // The same figure, reversed left to right.
  mirrored() { return this.g.map((row) => [...row].reverse().join('')); }
}

const done = (cv) => remap(cv.rows());
// The private character a colour letter of this file turns into, for art
// files that draw on top of these sprites (rumboldBattle.js).
export const bfChar = (letter) => REMAP[letter];
const flip = (rows) => rows.map((row) => [...row].reverse().join(''));

// Every prop and look in this file, by name (merged into PROP_SPRITES).
export const BF_PROP_SPRITES = {};

// =====================================================================
// TUCK, the dormouse page
// =====================================================================
// A dormouse the size of a loaf, a good deal shorter than the hero: round
// golden fur with a cream muzzle, great round ears with pink insides, big
// glossy dark eyes and a fat fluffy tail with a cream tip. He's a royal page
// in a red-and-gold tabard cut for somebody three times his size (the collar
// slips off one shoulder and the hem pools round his feet), and a little red
// page's cap with a gold feather. Drawn by hand, row by row, so every frame
// is the same mouse. 14 wide, 16 tall.
// dir: 'down' (facing you), 'up' (away), 'right'. step: 0 or 1, the two
// walking frames (he bobs and the hem swishes). blink, ear, tail: the little
// movements of his idle animation.
const TUCK_DOWN = [
  '.kkk..kgk.kkk.',
  'kF\'FkkrrkkF\'Fk',
  'kppFkrrrRkFppk',
  'kpppkgggGkpppk',
  '.kFFFFFFFFFFk.',
  '.kFFFFFFFFFFk.',
  '.kFweFFFFweFk.',
  '.kFeebbbbeeFk.',
  '.kpewbnnbewpk.',
  '..kFFbbbbFFk..',
  '.kgggbbbbggk..',
  '..krrfbbfrRk..',
  '.krrrgrrrrRRk.',
  'kgGgGgGgGgGgGk',
  'kRrrfFFfrrrrRk',
  '.kkkkkkkkkkkk.',
];
const TUCK_UP = [
  '.kkk..kgk.kkk.',
  'kF\'FkkrrkkF\'Fk',
  'kFFFkrrrRkFFFk',
  'kFFFkgggGkFFFk',
  '.kFFFFFFFFFFk.',
  '.kF\'FFffFFFFk.',
  '.kFFFFffFFFFk.',
  '.kFFFFffFFFfk.',
  '.kFFFFffFFFfk.',
  '..kFFFffFFfk..',
  '.kggggggggggk.',
  '..krrgrrgrRk..',
  '.krrggggggrRk.',
  'kgGgGgGgGgGgGk',
  'kRrrrrrrrrrrRk',
  '.kkkkkkkkkkkk.',
];
const TUCK_RIGHT = [
  '...kkk...kgk..',
  '..kF\'Fk.krrk..',
  '..kppFkrrrrRk.',
  '..kpppkgggGGk.',
  '.kFppFFFFFFFFk',
  '.kF\'FFFFFweFFk',
  '.kFFFFFFFeeFbk',
  '.kFFFFFFFewbnk',
  '..kFFFFFpFbbbk',
  '...kFFFFFFbbk.',
  '...kggggggggk.',
  '..krrrrrbbbRk.',
  '.krrrrrrrrrRRk',
  'kgGgGgGgGgGgGk',
  'kRrrfFrrrfFrRk',
  '.kkkkkkkkkkkk.',
];
// His tail beside the hem (rows 9 to 15 of the front and back, from column 9)
// and behind him in profile (from column 0), tip up.
function tuckFigure(dir, { step = 0, blink = false, ear = 0, tail = 0 } = {}) {
  const src = dir === 'down' ? TUCK_DOWN : dir === 'up' ? TUCK_UP : TUCK_RIGHT;
  const g = src.map((row) => [...row]);
  const set = (x, y, ch) => { if (y >= 0 && y < 16 && x >= 0 && x < 14) g[y][x] = ch; };
  const put = (x, y, str) => [...str].forEach((ch, i) => { if (ch !== '.') set(x + i, y, ch); });
  const front = dir === 'down';
  const side = dir === 'right';
  // The fat tail.
  const tl = tail ? 1 : 0;
  if (side) {
    put(1, 9 + tl, 'k"k'); put(0, 10, `k"'Fk`); put(0, 11, "kF'Fk"); put(0, 12, "kF'Fk"); put(0, 13, "kF'Fk"); put(0, 14, 'kfFfk'); put(1, 15, 'kkk');
  } else {
    put(9, 10, tl ? '..kkk' : '..k"k'); put(9, 11, tl ? `k"'Fk` : `.k"'k`); put(9, 12, "kF'Fk"); put(9, 13, "kF'Fk"); put(9, 14, 'kfFfk'); put(10, 15, 'kkk');
  }
  // An ear twitch: the left ear flops down a row.
  if (ear) {
    const x0 = side ? 2 : 0;
    for (let y = 3; y >= 0; y--) for (let x = x0; x < x0 + 5; x++) g[y + 1][x] = g[y][x];
    for (let x = x0; x < x0 + 5; x++) g[0][x] = '.';
  }
  if (blink) {
    if (front) [3, 4, 9, 10].forEach((x) => { set(x, 6, 'F'); set(x, 8, 'F'); set(x, 7, 'e'); });
    else if (side) { [8, 9].forEach((x) => { set(x, 5, 'F'); set(x, 6, 'e'); set(x, 7, 'F'); }); }
  }
  // Walking: he bobs down a row, and the feet swap.
  if (step) {
    for (let y = 8; y >= 0; y--) g[y + 1] = [...g[y]];
    g[0] = [...'..............'];
    if (front) put(1, 14, 'RrfFfrrfFfrR');
    else if (side) put(1, 14, 'RrrFfrrrFfrR');
    // The tail stays put.
    if (!side) { put(9, 10, '..k"k'); put(9, 11, `.k"'k`); }
  }
  return { rows: () => g.map((row) => row.join('')) };
}

export const BF_TUCK_SPRITES = {
  a: done(tuckFigure('down')),
  b: done(tuckFigure('down', { blink: true })),
  c: done(tuckFigure('down', { ear: 1 })),
  d: done(tuckFigure('down', { tail: 1 })),
};
export const BF_TUCK_WALK_DOWN_SPRITES = { a: done(tuckFigure('down')), b: done(tuckFigure('down', { step: 1 })) };
export const BF_TUCK_WALK_UP_SPRITES = { a: done(tuckFigure('up')), b: done(tuckFigure('up', { step: 1 })) };
export const BF_TUCK_WALK_RIGHT_SPRITES = { a: done(tuckFigure('right')), b: done(tuckFigure('right', { step: 1 })) };
export const BF_TUCK_WALK_LEFT_SPRITES = { a: flip(BF_TUCK_WALK_RIGHT_SPRITES.a), b: flip(BF_TUCK_WALK_RIGHT_SPRITES.b) };

Object.assign(BF_PROP_SPRITES, {
  bf_tuck: done(tuckFigure('down')),
  bf_tuck_back: done(tuckFigure('up')),
  bf_tuck_side: done(tuckFigure('right')),
});

// Tuck hanging from the king's strings like a marionette himself: limp, small
// and scared, paws pulled up by the wrists, his feet off the ground. 16 wide,
// 22 tall. sway: how far his hem swings (-2 to 2); kick: a foot jerked up;
// down: head hung, eyes shut. The strings are drawn by the caller (see
// rumboldBattle.js); the points they tie to are TUCK_STRUNG_ANCHORS.
export const TUCK_STRUNG_ANCHORS = { head: [8, 1], wristL: [2, 8], wristR: [13, 8] };
function tuckStrungFigure({ sway = 0, kick = 0, down = false } = {}) {
  const c = new Cv(16, 22);
  const sw = (y) => Math.round((sway * Math.max(0, y - 10)) / 9);
  // The tabard hangs straight down, a gold hem and a gold collar.
  for (let y = 12; y <= 18; y++) {
    const half = 2.6 + 0.4 * (y - 12);
    const x0 = Math.round(8 - half) + sw(y);
    const x1 = Math.round(8 + half) - 1 + sw(y);
    for (let x = x0; x <= x1; x++) c.px(x, y, x >= x1 - 1 ? 'R' : 'r');
  }
  for (let x = 0; x < 16; x++) if (c.get(x, 16) !== '.') c.px(x, 16, x % 3 === 1 ? 'G' : 'g');
  c.px(7 + sw(13), 13, 'g'); c.px(9 + sw(13), 13, 'g'); c.px(8 + sw(14), 14, 'g');
  c.rect(5, 12, 6, 1, 'g'); c.px(4, 13, 'g'); c.rect(6, 13, 4, 1, 'G');
  // Little legs and feet dangling, one kicking.
  c.rect(6 + sw(19), 19 - kick, 2, 2, 'F'); c.px(6 + sw(20), 21 - kick, 'f'); c.px(7 + sw(20), 21 - kick, 'f');
  c.rect(9 + sw(19), 19, 2, 2, 'F'); c.px(9 + sw(20), 21, 'f'); c.px(10 + sw(20), 21, 'f');
  // The tail hangs limp at the back.
  c.ell(13 + sw(17), 17, 1.1, 2.2, 'F', "'", 'f'); c.px(13 + sw(19), 19, '"');
  // Arms pulled up by the wrists.
  c.line(5, 12, 2, 8, 'F'); c.line(5, 13, 2, 9, 'f'); c.line(11, 12, 13, 8, 'F'); c.line(11, 13, 13, 9, 'f');
  c.ell(2, 7.5, 1.3, 1.3, 'b'); c.ell(13, 7.5, 1.3, 1.3, 'b');
  // Ears and head, tipped forward; the cap is slipping and the feather is the
  // top string's knot.
  const hy = down ? 1 : 0;
  c.ell(3.8, 5.4 + hy, 2.7, 2.7, 'F', "'", 'f'); c.ell(12.2, 5.4 + hy, 2.7, 2.7, 'F', "'", 'f');
  c.ell(4, 5.9 + hy, 1.6, 1.7, 'p'); c.ell(12, 5.9 + hy, 1.6, 1.7, 'p');
  c.ell(8, 8.4 + hy, 4.6, 3.8, 'F', "'", 'f');
  c.ell(8, 10.4 + hy, 2.4, 1.3, 'b');
  c.ell(8, 4.9 + hy, 2.6, 1.7, 'r', 'r', 'R'); c.rect(6, 6 + hy, 5, 1, 'g');
  c.px(8, 3 + hy, 'g'); c.px(8, 2 + hy, 'g'); c.px(8, 1 + hy, '"');
  if (down) {
    c.rect(5, 8 + hy, 2, 1, 'e'); c.rect(10, 8 + hy, 2, 1, 'e'); c.px(5, 9 + hy, 'l'); c.px(11, 9 + hy, 'l');
  } else {
    // Huge scared eyes, glossy, brows pushed up in the middle.
    c.rect(5, 7, 2, 3, 'e'); c.rect(10, 7, 2, 3, 'e'); c.px(5, 7, 'w'); c.px(10, 7, 'w'); c.px(6, 9, 'w'); c.px(11, 9, 'w');
    c.px(5, 6, 'f'); c.px(6, 5, 'f'); c.px(11, 6, 'f'); c.px(10, 5, 'f');
  }
  c.px(7, 10 + hy, 'n'); c.px(8, 10 + hy, 'n');
  c.px(7, 11 + hy, 'R'); c.px(8, 11 + hy, 'R');
  return c.outline();
}
export const BF_TUCK_STRUNG_SPRITES = {
  a: done(tuckStrungFigure()),
  b: done(tuckStrungFigure({ sway: 1 })),
  c: done(tuckStrungFigure({ sway: -1, kick: 1 })),
  d: done(tuckStrungFigure({ down: true })),
  e: done(tuckStrungFigure({ down: true, sway: 1 })),
};
BF_PROP_SPRITES.bf_tuck_strung = BF_TUCK_STRUNG_SPRITES.a;

// =====================================================================
// KING PEPTUP THE RESPLENDENT
// =====================================================================
// A tall, lanky carved wooden marionette man, a ventriloquist's dummy blown up
// to king size: a big, friendly head of varnished honey wood (painted arched
// brows, bright blue painted eyes, a long pointed nose, a curly moustache, rosy
// cheek dots and a wide painted smile on a hinged jaw: the slot lines run down
// from the corners), a long neck, narrow shoulders, long thin limbs with ball
// joints at the elbows, wrists and knees, a royal blue doublet with gold
// buttons, a short deep purple cape with ermine, striped hose and pointed
// shoes, a gold jewelled crown with a dark rim (so it stands out from the
// gold of the throne), and a sceptre. The folk think he is a man, the old
// Hero's lost friend: Tuck made that up. Look twice and he's wood. 48 wide, 56
// tall (his arms go out to the edges in the big gesture); seated in the
// battle, the cushion's front hides his knees and his long shins end on the step.
// The same figure can be drawn hollow, with a light inside him showing at his
// eye holes, jaw, neck and joints (`glow`, 0 to 3): the king come alive.
const RW = 48;
const RH = 56;

// A rectangle and its mirror image across the figure's middle.
function both(c, x, y, w, h, col) {
  c.rect(x, y, w, h, col);
  c.rect(RW - x - w, y, w, h, col);
}
function bothPx(c, x, y, col) {
  c.px(x, y, col);
  c.px(RW - 1 - x, y, col);
}

// The cape: deep purple, ermine down its front edges and round the hem.
// `back`: seen from behind.
function rumboldCape(c, back) {
  for (let y = 27; y < 47; y++) {
    const x0 = Math.round(17 - ((y - 27) * 4) / 19);
    const x1 = RW - 1 - x0;
    for (let x = x0; x <= x1; x++) {
      const k = (x - x0) % 7;
      c.px(x, y, x - x0 < 2 || x1 - x < 2 ? 'á' : k === 3 ? 'â' : k === 5 ? 'á' : 'à');
    }
  }
  // The ermine hem.
  for (let x = 0; x < RW; x++) {
    if (c.get(x, 46) === '.') continue;
    c.px(x, 45, 'm'); c.px(x, 46, x % 4 === 1 ? 'M' : 'm');
  }
  if (!back) {
    // Ermine down both front edges, tails every so often, and the moths' work.
    for (let y = 29; y < 45; y++) {
      const x0 = Math.round(17 - ((y - 27) * 4) / 19);
      for (let k = 0; k < 2; k++) { c.px(x0 + k, y, 'm'); c.px(RW - 1 - x0 - k, y, 'm'); }
      if (y % 5 === 1) { c.px(x0, y, 'M'); c.px(x0, y + 1, 'M'); c.px(RW - 1 - x0, y, 'M'); c.px(RW - 1 - x0, y + 1, 'M'); }
    }
    [[16, 33], [31, 37], [15, 41]].forEach(([x, y]) => c.px(x, y, 'á'));
  } else {
    // From behind: a plain cape with a few folds.
    for (let x = 8; x < RW - 8; x += 4) c.px(x, 46, 'M');
    [[16, 38], [30, 33], [29, 42]].forEach(([x, y]) => c.px(x, y, 'á'));
  }
}

// A ball joint: a carved wooden ball with a brass pin. With `glow` (0 to 3) it
// is a dark gap instead, with light leaking out of it: the hollow, living king.
function joint(c, x, y, glow = null) {
  if (glow === null) {
    c.ell(x, y, 1.6, 1.6, 'W', 'ã', 'X');
    c.px(x, y, 'h');
    return;
  }
  c.rect(x - 1, y - 1, 3, 3, 'y');
  if (glow >= 1) c.px(x, y, glow >= 3 ? '`' : ',');
  if (glow >= 2) { c.px(x - 1, y, ','); c.px(x + 1, y, ','); }
  if (glow >= 3) { c.px(x, y - 1, ','); c.px(x, y + 1, ','); }
}

// A dark eye hole (5x5) with the light showing in it (glow 0 to 3).
function socket(c, x, y, glow) {
  c.rect(x, y + 1, 5, 3, 'd');
  c.rect(x + 1, y, 3, 5, 'd');
  if (glow >= 3) { c.rect(x + 1, y + 1, 3, 3, ','); c.rect(x + 2, y + 1, 1, 3, '`'); c.px(x, y + 2, ','); c.px(x + 4, y + 2, ','); }
  else if (glow === 2) { c.rect(x + 1, y + 2, 3, 1, ','); c.px(x + 2, y + 2, '`'); }
  else if (glow === 1) c.px(x + 2, y + 2, ',');
}

// The crown: gold with red and blue jewels, 20 wide, on a ring of dark so it
// stands out from the gold of the throne behind it.
function crownCv(cdx, cdy) {
  const crown = new Cv(RW, RH);
  for (let i = 0; i < 5; i++) {
    const x0 = 14 + i * 4;
    const tall = i === 2 ? 0 : i % 2 ? 1 : 2;
    [tall + 2, tall, tall, tall + 2].forEach((top, k) => {
      for (let y = top; y <= 5; y++) crown.px(x0 + k + cdx, y + cdy, y === 5 || k >= 2 ? 'G' : 'g');
    });
    crown.px(x0 + 1 + cdx, tall + cdy, 'g');
  }
  // The band: jewels set in it.
  crown.rect(14 + cdx, 4 + cdy, 20, 1, 'g');
  crown.px(17 + cdx, 4 + cdy, 'ç'); crown.px(18 + cdx, 4 + cdy, 'ç');
  crown.px(23 + cdx, 4 + cdy, 'ä'); crown.px(24 + cdx, 4 + cdy, 'ä');
  crown.px(29 + cdx, 4 + cdy, 'ç'); crown.px(30 + cdx, 4 + cdy, 'ç');
  crown.px(23 + cdx, 3 + cdy, 'ü');
  // A ball on each tip.
  [[15, 2], [19, 0], [23, 0], [27, 0], [31, 2]].forEach(([x, y], i) => { if (i !== 2) crown.px(x + cdx + (i < 2 ? 0 : 1), y - 1 + cdy, 'ç'); });
  // A ring of dark round it all.
  const ring = new Cv(RW, RH);
  ring.g = crown.g.map((row) => [...row]);
  ring.outline('k');
  return ring;
}

// The head, crown and neck. jaw: how far the lower jaw has dropped (0 to 3).
// askew: the jammed look (eyes wrong, crown slipped, head tilted). glow: null
// for the painted face; 0 to 3 for the hollow one, with light in its eye
// holes, its open jaw and its neck. `crownOut`: a canvas to draw the crown on
// instead of the head (for the pieces).
function rumboldHead(c, { jaw = 0, dx = 0, askew = false, blink = false, laugh = false, brow = null, glow = null } = {}, crownOut = null) {
  const ox = dx; // the whole head sways sideways a pixel
  const tilt = askew ? 1 : 0;
  const hollow = glow !== null;
  // A long neck: a wooden post with rings and a ball joint where the head sits.
  if (!hollow) {
    c.rect(22, 23, 4, 5, 'X'); c.rect(22, 23, 1, 5, 'W'); c.rect(25, 23, 1, 5, 'Y');
    c.rect(22, 25, 4, 1, 'y');
    c.ell(23.5, 23, 2.2, 1.4, 'W', 'ã', 'X'); c.px(23, 23, 'h'); c.px(24, 23, 'h');
  } else {
    c.rect(22, 23, 4, 5, 'Y');
    if (glow >= 1) c.rect(22, 25, 4, 1, glow >= 3 ? '`' : ',');
    if (glow >= 2) c.rect(22, 24, 4, 1, ',');
  }
  // Small carved ears.
  [[12.5 + ox, 13.5 + tilt], [34.5 + ox, 13.5]].forEach(([x, y]) => { c.ell(x, y, 1.7, 2.6, 'W', 'ã', 'X'); c.px(x, y, 'y'); });
  // The head: a big carved head, varnished wood, a long narrow chin.
  c.ell(23.5 + ox, 15.8 + tilt, 7.8, 8, 'W', null, 'X');
  c.ell(23.5 + ox, 10.5 + tilt, 10.2, 7.6, 'W', 'ã', 'X');
  // Grain in the wood and a polished highlight on the brow and cheek.
  [[17, 7], [18, 7], [19, 8]].forEach(([x, y]) => c.px(x + ox, y + tilt, 'ã'));
  [[16, 12], [16, 13], [29, 20], [30, 19], [20, 22], [21, 22], [27, 22], [31, 11], [31, 12], [32, 12]].forEach(([x, y]) => c.px(x + ox, y + tilt, 'X'));
  [[26, 7], [27, 7], [28, 7], [15, 17], [32, 16], [22, 21]].forEach(([x, y]) => c.px(x + ox, y + tilt, 'Y'));
  // Carved locks of hair at the temples, under the crown.
  c.ell(15.4 + ox, 9.5 + tilt, 1.6, 3.6, 'Y', 'X', 'y');
  c.ell(31.6 + ox, 9.5 + tilt, 1.6, 3.6, 'Y', 'X', 'y');
  // Painted eyes: big and bright, a dark lid line, a blue iris, a black pupil
  // and a strong white shine.
  const eye = (x, y, look, shut) => {
    if (hollow) { socket(c, x, y, glow); return; }
    if (shut === 'happy') { c.px(x, y + 3, 'd'); c.px(x + 1, y + 2, 'd'); c.px(x + 2, y + 1, 'd'); c.px(x + 3, y + 2, 'd'); c.px(x + 4, y + 3, 'd'); return; }
    if (shut) { c.rect(x, y + 3, 5, 1, 'd'); c.px(x - 1, y + 2, 'd'); c.px(x + 5, y + 2, 'd'); return; }
    c.rect(x, y + 1, 5, 3, 'w'); c.rect(x + 1, y, 3, 5, 'w');
    const ix = x + 1 + look;
    c.rect(ix, y + 1, 3, 3, 'å'); c.rect(ix, y + 3, 3, 1, 'æ');
    c.px(ix + 1, y + 2, 'd'); c.px(ix + 1, y + 1, 'd');
    c.px(ix, y + 1, 'w');
    c.rect(x + 1, y - 1, 3, 1, 'd'); c.px(x, y, 'd'); c.px(x + 4, y, 'd');
  };
  if (askew) {
    // One eye popped up and sideways, the other rolled down.
    eye(17 + ox, 8 + tilt, -1);
    eye(26 + ox, 11 + tilt, 1);
  } else {
    eye(17 + ox, 9 + tilt, 0, blink ? true : laugh ? 'happy' : false);
    eye(26 + ox, 9 + tilt, 0, blink ? true : laugh ? 'happy' : false);
  }
  // Painted brows: high arches (low and cross when he's cross).
  const bt = askew ? tilt : tilt;
  if (brow === 'cross') {
    [[17, 7], [18, 7], [19, 8], [20, 8]].forEach(([x, y]) => { c.px(x + ox, y + bt, 'd'); c.px(47 - x + ox, y + bt, 'd'); });
  } else {
    [[16, 8], [17, 7], [18, 6], [19, 6], [20, 6], [21, 7]].forEach(([x, y]) => { c.px(x + ox, y + bt + (askew && x > 20 ? 0 : 0), 'd'); c.px(47 - x + ox, y + bt, 'd'); });
  }
  // The nose: a long, pointed carved peg, shaded on the far side and under the tip.
  c.rect(23 + ox, 10 + tilt, 2, 4, 'W'); c.rect(24 + ox, 10 + tilt, 1, 4, 'X');
  c.rect(23 + ox, 10 + tilt, 1, 3, 'ã');
  c.rect(22 + ox, 14 + tilt, 4, 2, 'W'); c.rect(25 + ox, 14 + tilt, 1, 2, 'X'); c.px(22 + ox, 14 + tilt, 'ã'); c.px(23 + ox, 14 + tilt, 'ã');
  c.rect(22 + ox, 16 + tilt, 4, 1, 'X'); c.px(25 + ox, 16 + tilt, 'Y'); c.px(23 + ox, 17 + tilt, 'Y'); c.px(24 + ox, 17 + tilt, 'Y');
  // Small rosy painted cheeks.
  c.ell(15.8 + ox, 14.5 + tilt, 1.4, 1.5, 'o'); c.ell(31.2 + ox, 14.5 + tilt, 1.4, 1.5, 'o');
  // The showman's moustache: thick under the nose, the ends swept out and curled up.
  [[19, 17], [20, 17], [21, 17], [22, 17], [17, 18], [18, 18], [19, 18], [20, 18], [16, 17], [16, 16], [15, 16]].forEach(([x, y]) => { c.px(x + ox, y + tilt, 'd'); c.px(47 - x + ox, y + tilt, 'd'); });
  // The mouth: a wide painted smile on a hinged jaw. The jaw slot lines run down
  // from the corners; when the jaw drops, a dark slot opens (never a skull).
  const open = jaw;
  const mx = (x, y, ch) => c.px(x + ox, y + tilt, ch);
  const cav = (y, deep) => (hollow && glow >= 1 ? (glow >= 3 ? (y === 22 ? ',' : '`') : ',') : deep ? 'd' : 'y');
  mx(18, 19, 'q'); mx(29, 19, 'q'); mx(19, 20, 'q'); mx(20, 20, 'q'); mx(27, 20, 'q'); mx(28, 20, 'q');
  for (let x = 21; x <= 26; x++) { mx(x, 21, 'q'); }
  mx(17, 18, 'v'); mx(30, 18, 'v');
  if (open === 0) {
    for (let x = 22; x <= 25; x++) mx(x, 22, 'v');
  } else {
    // Clear the closed chin and drop the jaw.
    for (let y = 22; y <= 25; y++) for (let x = 19; x <= 28; x++) c.px(x + ox, y + tilt, '.');
    for (let y = 22; y <= 21 + open; y++) for (let x = 20; x <= 27; x++) mx(x, y, cav(y, y > 22));
    const ly = 22 + open;
    for (let x = 21; x <= 26; x++) mx(x, ly, 'q');
    [6, 5, 3.5].forEach((hw, r) => {
      const y = ly + 1 + r;
      for (let x = Math.round(23.5 - hw); x <= Math.round(23.5 + hw - 1); x++) mx(x, y, x < 22 ? 'W' : 'X');
    });
    c.px(21 + ox, ly + 1 + tilt, 'ã'); c.px(20 + ox, ly + 1 + tilt, 'ã');
  }
  // The jaw slot lines, with a brass pin where the jaw hinges.
  for (let y = 20; y <= 23 + open; y++) { mx(18, y, 'y'); mx(29, y, 'y'); }
  mx(18, 18, hollow ? (glow >= 1 ? ',' : 'y') : 'h'); mx(29, 18, hollow ? (glow >= 1 ? ',' : 'y') : 'h');
  if (laugh) { for (let i = 0; i < 2; i++) { c.px(10 + ox, 11 + i, 'o'); c.px(37 + ox, 11 + i, 'o'); } }
  // The crown, riding on his brow, a size too big.
  const crown = crownCv(ox + (askew ? 3 : 0), askew ? 3 : 0);
  if (crownOut) crownOut.stamp(crown.rows(), 0, 0);
  else c.stamp(crown.rows(), 0, 0);
}

// The back of his head: bare varnished wood, grain and nails, the crown on top.
function rumboldHeadBack(c) {
  c.rect(22, 23, 4, 5, 'X'); c.rect(22, 25, 4, 1, 'y');
  c.ell(12.5, 13.5, 1.7, 2.6, 'W', 'ã', 'X'); c.ell(34.5, 13.5, 1.7, 2.6, 'W', 'ã', 'X');
  c.ell(23.5, 15.8, 7.8, 8, 'X', null, 'Y');
  c.ell(23.5, 10.5, 10.2, 7.6, 'X', 'W', 'Y');
  for (let y = 8; y <= 23; y += 2) c.line(17, y, 30, y + (y % 4 ? 1 : 0), 'y');
  c.line(23, 7, 23, 23, 'Y');
  c.px(18, 15, 'h'); c.px(29, 15, 'h'); c.px(23, 22, 'h');
  c.stamp(crownCv(0, 0).rows(), 0, 0);
}

// His arms, as a left arm drawn in left-arm coordinates (the right one is the
// mirror image): shoulder `s`, elbow `e`, wrist `w`, and which way the hand
// points (`dir`: d, u or l). A thin blue sleeve to the elbow, then bare wood: a
// forearm, ball joints at the elbow and wrist, and a carved mitten of a hand.
// Long arms: the hands hang to his knees.
const ARMS = {
  hip: { s: [18, 28], e: [13, 33], w: [17, 37], dir: 'd' },
  hang: { s: [18, 28], e: [14, 34], w: [14, 41], dir: 'd' },
  sag: { s: [18, 28], e: [13, 34], w: [15, 40], dir: 'd' },
  up: { s: [18, 28], e: [11, 29], w: [8, 22], dir: 'u', open: true },
  snap: { s: [18, 28], e: [13, 32], w: [13, 25], dir: 'u', open: true },
  sceptre: { s: [18, 28], e: [13, 33], w: [10, 37], dir: 'd' },
  out: { s: [18, 28], e: [10, 28], w: [4, 24], dir: 'l', open: true },
  half: { s: [18, 28], e: [12, 29], w: [8, 25], dir: 'l', open: true },
};

function rumboldArm(kind, glow, human = false) {
  const a = ARMS[kind];
  const c = new Cv(RW, RH);
  if (human) return humanArm(c, a);
  const [sx, sy] = a.s;
  const [ex, ey] = a.e;
  const [wx, wy] = a.w;
  // Forearm: bare wood, a thin rod.
  const flat = Math.abs(wx - ex) > Math.abs(wy - ey);
  c.line(ex, ey, wx, wy, 'W');
  if (flat) c.line(ex, ey + 1, wx, wy + 1, 'X'); else c.line(ex + 1, ey, wx + 1, wy, 'X');
  // Sleeve: royal blue, two wide, a gold trim at the shoulder.
  c.line(sx, sy, ex, ey, 'ä'); c.line(sx + 1, sy, ex + 1, ey, 'ö');
  if (Math.abs(ex - sx) > Math.abs(ey - sy)) { c.line(sx, sy - 1, ex, ey - 1, 'ü'); c.line(sx, sy + 1, ex, ey + 1, 'ö'); }
  else c.line(sx - 1, sy, ex - 1, ey, 'ü');
  c.line(sx - 1, sy, sx + 2, sy, 'g');
  joint(c, ex, ey, glow);
  // The hand: a 3x3 carved mitten with the fingers cut in.
  const [hx, hy] = a.dir === 'd' ? [wx - 1, wy + 1] : a.dir === 'u' ? [wx - 1, wy - 3] : [wx - 3, wy - 1];
  c.rect(hx, hy, 3, 3, 'W'); c.rect(hx + 2, hy, 1, 3, 'X'); c.rect(hx, hy + 2, 3, 1, 'X'); c.px(hx, hy, 'ã');
  if (a.dir === 'd') { c.px(hx + 1, hy + 2, 'y'); c.px(hx - 1, hy + 1, 'W'); if (a.open) c.px(hx + 2, hy + 2, 'y'); }
  else if (a.dir === 'u') { c.px(hx + 1, hy, 'y'); c.px(hx, hy - 1, 'W'); c.px(hx + 2, hy - 1, 'W'); c.px(hx + 3, hy + 1, 'W'); }
  else { c.px(hx, hy + 1, 'y'); c.px(hx - 1, hy, 'W'); c.px(hx - 1, hy + 2, 'W'); c.px(hx + 1, hy + 3, 'W'); }
  joint(c, wx, wy, glow);
  return c;
}

// The arm as the folk see it: blue sleeve all the way to a white glove, no
// joints showing.
function humanArm(c, a) {
  const [sx, sy] = a.s;
  const [ex, ey] = a.e;
  const [wx, wy] = a.w;
  c.line(sx, sy, ex, ey, 'ä'); c.line(sx + 1, sy, ex + 1, ey, 'ö');
  if (Math.abs(ex - sx) > Math.abs(ey - sy)) { c.line(sx, sy - 1, ex, ey - 1, 'ü'); c.line(sx, sy + 1, ex, ey + 1, 'ö'); }
  else c.line(sx - 1, sy, ex - 1, ey, 'ü');
  const flat = Math.abs(wx - ex) > Math.abs(wy - ey);
  c.line(ex, ey, wx, wy, 'ä');
  if (flat) c.line(ex, ey + 1, wx, wy + 1, 'ö'); else c.line(ex + 1, ey, wx + 1, wy, 'ö');
  c.line(sx - 1, sy, sx + 2, sy, 'g');
  // A gold cuff, then the glove.
  c.px(wx, wy, 'g');
  const [hx, hy] = a.dir === 'd' ? [wx - 1, wy + 1] : a.dir === 'u' ? [wx - 1, wy - 3] : [wx - 3, wy - 1];
  c.rect(hx, hy, 3, 3, 'm'); c.rect(hx + 2, hy, 1, 3, 'I'); c.rect(hx, hy + 2, 3, 1, 'I');
  if (a.dir === 'd') c.px(hx + 1, hy + 3, 'm');
  else if (a.dir === 'u') { c.px(hx, hy - 1, 'm'); c.px(hx + 2, hy - 1, 'm'); }
  else { c.px(hx - 1, hy, 'm'); c.px(hx - 1, hy + 2, 'm'); }
  return c;
}

// His head as the folk see it: a man's head, a sensible size, greying hair,
// small dark eyes, rosy cheeks, a curled moustache over a closed smile, and a
// small jewelled crown. The mouth never moves. (He's wood underneath: the
// battle shows it.) `laugh` squeezes his eyes shut; `dx` sways it a pixel.
function kingHead(c, { dx = 0, blink = false, laugh = false } = {}) {
  const x = (n) => n + dx;
  c.rect(x(22), 25, 4, 3, 'è'); c.rect(x(25), 25, 1, 3, 'é');
  c.ell(x(23.5), 19.6, 5.4, 4.6, 'ì', null, 'í');
  c.ell(x(23.5), 21.2, 4.3, 4.4, 'è', 'ê', 'é');
  c.px(x(18), 21, 'è'); c.px(x(29), 21, 'é');
  c.rect(x(19), 16, 10, 2, 'ì'); c.px(x(19), 18, 'ì'); c.px(x(28), 18, 'ì'); c.px(x(19), 19, 'í'); c.px(x(28), 19, 'í');
  c.rect(x(20), 19, 2, 1, 'í'); c.rect(x(26), 19, 2, 1, 'í');
  if (blink) { c.rect(x(20), 20, 2, 1, 'é'); c.rect(x(26), 20, 2, 1, 'é'); }
  else if (laugh) { c.rect(x(20), 20, 2, 1, 'd'); c.rect(x(26), 20, 2, 1, 'd'); }
  else { c.px(x(21), 20, 'd'); c.px(x(26), 20, 'd'); c.px(x(20), 20, 'm'); c.px(x(27), 20, 'm'); }
  c.px(x(24), 21, 'é'); c.px(x(24), 22, 'é'); c.px(x(23), 22, 'é');
  c.px(x(20), 22, 'o'); c.px(x(27), 22, 'o');
  c.rect(x(21), 23, 6, 1, 'í'); c.px(x(20), 23, 'í'); c.px(x(27), 23, 'í'); c.px(x(19), 22, 'í'); c.px(x(28), 22, 'í');
  c.px(x(23), 24, 'q'); c.px(x(24), 24, 'q');
  c.stamp(kingCrown(dx).rows(), 0, 0);
}

// The back of that head: hair, and the crown.
function kingHeadBack(c) {
  c.rect(22, 25, 4, 3, 'é');
  c.ell(23.5, 20.6, 4.6, 5, 'ì', null, 'í');
  c.px(18, 21, 'è'); c.px(29, 21, 'é');
  c.stamp(kingCrown(0).rows(), 0, 0);
}

// A small crown, 12 wide: five gold points, jewels in the band, a dark ring.
function kingCrown(dx) {
  const cr = new Cv(RW, RH);
  [[18, 12], [21, 11], [23, 9], [25, 11], [28, 12]].forEach(([px, py]) => {
    cr.rect(px + dx, py, 2, 15 - py, 'g'); cr.rect(px + 1 + dx, py, 1, 15 - py, 'G');
  });
  cr.rect(18 + dx, 15, 12, 2, 'g'); cr.rect(18 + dx, 16, 12, 1, 'G');
  cr.px(20 + dx, 15, 'ç'); cr.px(23 + dx, 15, 'ä'); cr.px(24 + dx, 15, 'ä'); cr.px(27 + dx, 15, 'ç');
  cr.px(23 + dx, 8, 'ç'); cr.px(24 + dx, 8, 'ç');
  const ring = new Cv(RW, RH);
  ring.g = cr.g.map((row) => [...row]);
  ring.outline('k');
  return ring;
}

const fromRows = (rows) => {
  const c = new Cv(rows[0].length, rows.length);
  rows.forEach((row, j) => [...row].forEach((ch, i) => { c.g[j][i] = ch; }));
  return c;
};

// pose: 'idle', 'gesture' (arms out wide), 'jam' (arms limp), 'half' (arms
// starting to rise), or { l, r } with an ARMS name for each arm.
const POSES = {
  idle: { l: 'hip', r: 'sceptre' },
  gesture: { l: 'out', r: 'out' },
  half: { l: 'half', r: 'half' },
  jam: { l: 'hang', r: 'sag' },
};

// His clothes in layers, so he can be drawn whole or come apart: the robe
// (cape, doublet, collar, sceptre), the legs and the two arms.
function rumboldLayers(pose, glow = null, back = false, human = false) {
  const p = typeof pose === 'string' ? POSES[pose] : pose;
  const robe = new Cv(RW, RH);
  const legs = new Cv(RW, RH);
  rumboldCape(robe, back);
  // From behind, as the folk see him: no control rod.
  if (back && human) {
    robe.rect(18, 27, 12, 2, 'm');
    return { robe, legs, armL: new Cv(RW, RH), armR: new Cv(RW, RH) };
  }
  if (back) {
    // A control rod through a slot in the back of the cape: the giveaway.
    robe.rect(23, 28, 2, 12, 'W'); robe.px(23, 28, 'X'); robe.rect(22, 27, 4, 1, 'h'); robe.rect(21, 26, 6, 1, 'Y'); robe.px(23, 40, 'y');
    robe.rect(18, 27, 12, 2, 'm');
    return { robe, legs, armL: new Cv(RW, RH), armR: new Cv(RW, RH) };
  }
  // The doublet under the cape's open front: royal blue, gold buttons, belted,
  // with a short flared skirt.
  for (let y = 28; y <= 37; y++) {
    const x0 = y <= 33 ? 19 : y <= 35 ? 20 : 18;
    for (let x = x0; x <= 47 - x0; x++) robe.px(x, y, x - x0 < 2 ? 'ü' : 47 - x0 - x < 2 ? 'ö' : 'ä');
  }
  robe.rect(23, 29, 1, 7, 'G');
  if (glow === null) [30, 32, 34].forEach((y) => { robe.px(23, y, 'g'); robe.px(24, y, 'h'); });
  else if (glow >= 1) {
    // A seam down the middle of him, with light leaking out of it.
    robe.rect(23, 29, glow >= 2 ? 2 : 1, 8, ',');
    if (glow >= 3) robe.rect(23, 30, 1, 6, '`');
  }
  robe.rect(20, 35, 8, 1, 'd'); robe.rect(22, 35, 4, 1, 'g'); robe.px(23, 35, 'h');
  for (let x = 18; x <= 29; x++) robe.px(x, 37, x % 2 ? 'g' : 'G');
  // Ermine collar over the narrow shoulders, a gold clasp.
  robe.rect(19, 27, 10, 1, 'm'); robe.rect(18, 28, 12, 1, 'm'); robe.rect(19, 29, 10, 1, 'm');
  [20, 27].forEach((x) => { robe.px(x, 29, 'M'); robe.px(x + 1, 28, 'M'); });
  robe.px(23, 29, 'g'); robe.px(24, 29, 'g'); robe.px(23, 28, 'h');
  if (p.r === 'sceptre') {
    // The sceptre: a gold stick with a red jewel and a star on top.
    robe.rect(37, 19, 1, 29, 'h'); robe.rect(38, 19, 1, 29, 'G');
    robe.ell(37.5, 16, 2.6, 2.6, 'g', 'g', 'G'); robe.px(37, 16, 'ç'); robe.px(38, 16, 'ç');
    robe.px(34, 15, 'g'); robe.px(41, 15, 'g'); robe.px(37, 12, 'g'); robe.px(38, 12, 'g');
  }
  // Legs: long and thin, carved wood in striped hose, a ball joint at each
  // knee, pointed shoes with a brass buckle.
  [21, 25].forEach((x, side) => {
    for (let y = 38; y <= 53; y++) {
      const blue = ((y - 38) >> 1) % 2 === 0;
      const lit = blue ? 'ü' : 'c';
      const shade = blue ? 'ö' : 'C';
      legs.px(x, y, side ? shade : lit);
      legs.px(x + 1, y, side ? lit : shade);
    }
    if (!human) joint(legs, side ? 26 : 21, 46, glow);
  });
  // Pointed shoes: the left one's toe curls to the left, the right one's right.
  [[19, 22, 16], [25, 28, 31]].forEach(([a, b, tip], side) => {
    legs.rect(a, 54, 4, 1, 'd');
    for (let x = Math.min(a, tip); x <= Math.max(b, tip); x++) legs.px(x, 55, 'd');
    legs.px(tip, 54, 'd');
    legs.px(side ? a + 1 : b - 1, 54, 'h');
    legs.px(side ? tip - 1 : tip + 1, 55, 'X');
  });
  const armL = rumboldArm(p.l, glow, human);
  const armR = fromRows(rumboldArm(p.r, glow, human).mirrored());
  return { robe, legs, armL, armR };
}

function rumboldFigure(pose = 'idle', head = {}, back = false) {
  const glow = head.glow ?? null;
  const parts = rumboldLayers(pose, glow, back);
  const c = new Cv(RW, RH);
  [parts.robe, parts.legs, parts.armL, parts.armR].forEach((p) => c.stamp(p.rows(), 0, 0));
  if (!back) rumboldHead(c, head); else rumboldHeadBack(c);
  return c.outline();
}

// The king as Belowtown sees him, in the overworld and the cutscenes: a tall
// man, nothing wooden showing. head: { dx, blink, laugh }.
function kingFigure(pose = 'idle', head = {}, back = false) {
  const parts = rumboldLayers(pose, null, back, true);
  const c = new Cv(RW, RH);
  [parts.robe, parts.legs, parts.armL, parts.armR].forEach((p) => c.stamp(p.rows(), 0, 0));
  if (!back) kingHead(c, head); else kingHeadBack(c);
  return c.outline();
}

// The king in pieces (rows of RW characters, each outlined): the robe, the
// legs, each arm, the head, and the crown on its own. Used by the break-up in
// the battle (rumboldBattle.js).
export function rumboldParts(pose = 'jam', head = {}) {
  const parts = rumboldLayers(pose, head.glow ?? null, false);
  const h = new Cv(RW, RH);
  const crown = new Cv(RW, RH);
  rumboldHead(h, head, crown);
  const out = {};
  Object.entries({ robe: parts.robe, legs: parts.legs, armL: parts.armL, armR: parts.armR, head: h, crown }).forEach(([k, v]) => { out[k] = done(v.outline()); });
  return out;
}

// One figure, as rows in BF_PALETTE (pose: see rumboldLayers; head: the
// options of rumboldHead). For the battle's frames of the living king.
export const rumboldRows = (pose, head) => done(rumboldFigure(pose, head));

// Talking: his head sways and his free hand rises and falls. The mouth never
// opens: nothing on him moves like a puppet's until the fight.
export const BF_RUMBOLD_SPRITES = {
  a: done(kingFigure('idle', { dx: 0 })),
  b: done(kingFigure('idle', { dx: 1 })),
  c: done(kingFigure('idle', { dx: 0, blink: true })),
  d: done(kingFigure('idle', { dx: -1 })),
};
export const BF_RUMBOLD_TALK_SPRITES = {
  a: done(kingFigure('idle')),
  b: done(kingFigure({ l: 'half', r: 'sceptre' }, { dx: 1 })),
  c: done(kingFigure({ l: 'half', r: 'sceptre' })),
  d: done(kingFigure('idle', { dx: -1 })),
  e: done(kingFigure('idle', { blink: true })),
  f: done(kingFigure({ l: 'half', r: 'sceptre' }, { dx: 1 })),
};
export const BF_RUMBOLD_GESTURE_SPRITES = {
  a: done(kingFigure('half')),
  b: done(kingFigure('gesture', { laugh: true })),
  c: done(kingFigure('gesture', { laugh: true, dx: 1 })),
};
export const BF_RUMBOLD_JAMMED_SPRITES = {
  a: done(rumboldFigure('jam', { jaw: 3, askew: true })),
  b: done(rumboldFigure('jam', { jaw: 3, askew: true, dx: 1 })),
};

Object.assign(BF_PROP_SPRITES, {
  bf_rumbold: done(kingFigure('idle')),
  bf_rumbold_back: done(kingFigure('idle', {}, true)),
  bf_rumbold_gesture: done(kingFigure('gesture', { laugh: true })),
  bf_rumbold_jammed: done(rumboldFigure('jam', { jaw: 3, askew: true })),
});

// His head on its own, what Tuck carries out of the falling hall: the faceless
// wooden head from the fight (peptupPuppet.js), not the painted man.
function rumboldHeadProp() {
  // His head as it really is, the way the fight showed it: an egg of pale
  // wood with no face at all, a crack across the brow, and the crown slipped
  // down over one side. 18 wide, 17 tall.
  const c = new Cv(18, 17);
  c.ell(9, 10, 6.6, 6.4, 'W', 'ã', 'X');
  c.ell(9, 13.5, 5.2, 2.6, 'X', null, 'Y');
  c.line(5, 7, 8, 10, 'y'); c.line(8, 10, 7, 12, 'y');
  [[12, 9], [13, 12], [6, 14]].forEach(([x, y]) => c.px(x, y, 'X'));
  // The neck peg, snapped off.
  c.rect(8, 15, 3, 2, 'Y'); c.px(8, 16, 'y'); c.px(10, 16, 'y');
  // The crown, slipped and tilted.
  const cr = new Cv(18, 17);
  [[8, 1], [11, 0], [14, 1]].forEach(([x, y]) => { cr.rect(x, y, 2, 4 - y, 'g'); cr.px(x + 1, y + 1, 'G'); });
  cr.rect(7, 3, 10, 2, 'g'); cr.rect(7, 4, 10, 1, 'G'); cr.px(10, 3, 'ç'); cr.px(14, 3, 'ç');
  c.stamp(cr.rows(), 0, 0);
  return done(c.outline());
}
BF_PROP_SPRITES.bf_rumbold_head = rumboldHeadProp();

// =====================================================================
// THE THRONE (and what's behind the curtain)
// =====================================================================
// A great carved chair on two steps, its high back arched and gilded, a red
// velvet cushion, in front of a heavy red curtain hung from a gold pelmet.
// Off to the right the curtain hangs a little too full, with a draught under
// the hem: that's where Tuck sits. 64 wide (four tiles), 64 tall.
// bf_throne: the curtain closed (a little tail tip and two toes show under it
// now and then). bf_throne_revealed: the curtain pulled back, Tuck on a stool
// in the dark niche, a wooden control bar in his paws, strings and a lever
// running into the back of the king's chair.
const TW = 64;
const TH = 64;

function throneBase(c, { open = false, sway = 0 } = {}) {
  // The curtain, from a gold pelmet to the floor, with deep folds.
  for (let y = 3; y < 62; y++) {
    for (let x = 1; x < TW - 1; x++) {
      const fold = (x + (y > 30 ? sway : 0)) % 7;
      c.px(x, y, fold === 0 || fold === 6 ? 'V' : fold === 3 ? 'v' : 'v');
      if (fold === 2 && y % 9 < 4) c.px(x, y, 'V');
    }
  }
  // Pelmet.
  c.rect(0, 0, TW, 3, 'g');
  for (let x = 0; x < TW; x++) c.px(x, 3, x % 4 < 2 ? 'g' : 'G');
  for (let x = 0; x < TW; x += 4) c.px(x, 4, 'G');
  for (let x = 4; x < TW; x += 12) { c.rect(x, 5, 1, 2, 'g'); c.px(x, 7, 'G'); }
  // The hem on the floor.
  c.rect(1, 61, TW - 2, 2, 'g');
  for (let x = 1; x < TW - 1; x += 3) c.px(x, 62, 'G');
  if (open) {
    // The right-hand curtain drawn back to the pillar, a tie-back cord round it.
    c.rect(37, 5, 27 - 3, 57, 'M');
    for (let y = 5; y < 61; y++) { c.rect(56, y, 7, 1, 'v'); if ((y % 7) < 3) c.px(58, y, 'V'); c.px(56, y, 'V'); c.px(62, y, 'V'); }
    c.rect(55, 34, 9, 2, 'g'); c.px(54, 35, 'h'); c.px(54, 36, 'g'); c.px(53, 37, 'g');
    // The back wall of the niche: a dark floor line.
    c.rect(37, 58, 19, 3, 'd');
  }
  // Two steps up to the throne.
  c.rect(2, 60, 40, 3, 's'); c.rect(2, 60, 40, 1, 'S'); c.rect(4, 57, 36, 3, 'S'); c.rect(4, 57, 36, 1, 'h');
  c.rect(4, 59, 36, 1, 's');
}

function throneChair(c) {
  // Legs, with carved paw feet.
  [[8, 11], [33, 36]].forEach(([a, b]) => { c.rect(a, 52, 4, 6, 'Y'); c.rect(a - 1, 56, 6, 2, 'g'); c.px(a + 1, 56, 'G'); });
  // The back: a tall arch, gilded round the edge.
  c.ell(22, 18, 13, 9, 'X', 'W', 'Y');
  c.rect(9, 18, 26, 34, 'X'); c.rect(9, 18, 3, 34, 'W'); c.rect(32, 18, 3, 34, 'Y');
  for (let y = 12; y < 52; y++) { c.px(9, y, 'g'); c.px(34, y, 'G'); }
  // The gold trim round the top of the arch.
  for (let a = 0; a <= 18; a++) {
    const ang = Math.PI * (a / 18);
    c.px(Math.round(22 - Math.cos(ang) * 12.5), Math.round(18 - Math.sin(ang) * 8.5), 'g');
  }
  // Crown carved at the top of the back, picked out in gold.
  c.rect(18, 15, 8, 3, 'g'); c.px(18, 14, 'g'); c.px(22, 13, 'g'); c.px(21, 14, 'g'); c.px(23, 14, 'g'); c.px(25, 14, 'g'); c.rect(18, 18, 8, 1, 'G');
  c.px(22, 16, 'v'); c.px(20, 16, 'l'); c.px(24, 16, 'l');
  // A padded velvet back, buttoned.
  c.rect(14, 22, 16, 22, 'v'); c.rect(27, 22, 3, 22, 'V'); c.rect(14, 22, 16, 1, 'V');
  [[18, 27], [26, 27], [22, 33], [18, 39], [26, 39]].forEach(([x, y]) => { c.px(x, y, 'h'); c.px(x, y + 1, 'V'); });
  // Arms and gold knobs.
  [[5, 9], [35, 39]].forEach(([a], i) => {
    c.rect(a, 38, 5, 14, 'X'); c.rect(a, 38, 1, 14, 'W'); c.rect(a + 4, 38, 1, 14, 'Y');
    c.ell(a + 2, 37, 3, 2, 'g', 'g', 'G');
  });
  // The seat cushion with a gold fringe.
  c.rect(8, 44, 28, 7, 'v'); c.rect(8, 44, 28, 1, 'V'); c.rect(8, 50, 28, 2, 'g');
  for (let x = 8; x < 36; x += 2) c.px(x, 52, 'G');
  c.rect(30, 45, 6, 5, 'V');
}

function throneCloset(c, frame) {
  // The curtain's too full on the right, and the draught shifts it.
  if (frame === 0) return;
  const bulge = frame === 1 ? 1 : -1;
  for (let y = 26; y < 61; y++) {
    const x0 = 44 + Math.round(Math.sin((y - 26) / 6) * bulge);
    c.px(x0, y, 'V'); c.px(x0 + 1, y, 'v'); c.px(x0 + 8, y, 'V');
  }
  if (frame === 2) {
    // A dormouse tail tip, and two toes, under the hem.
    c.px(52, 61, 'f'); c.px(53, 61, 'F'); c.px(54, 62, 'b');
    c.px(48, 62, 'F'); c.px(49, 62, 'f');
  }
}

function throneFigure(kind, frame = 0) {
  const c = new Cv(TW, TH);
  throneBase(c, { open: kind !== 'closed', sway: kind === 'closed' && frame === 1 ? 1 : 0 });
  if (kind === 'open' || kind === 'empty') {
    // 'empty': the stool with nobody on it and the control bar dropped.
    if (kind === 'open') tuckBehind(c, frame); else emptyStool(c);
    throneChair(c);
  } else {
    throneChair(c);
    throneCloset(c, frame);
  }
  return c.outline();
}

// The stool in the niche, empty: the control bar dropped across the seat, its
// strings trailing off over the edge.
function emptyStool(c) {
  const cx = 47;
  c.rect(cx - 6, 54, 13, 2, 'X'); c.rect(cx - 6, 54, 13, 1, 'W'); c.rect(cx - 5, 56, 2, 4, 'Y'); c.rect(cx + 4, 56, 2, 4, 'Y');
  c.rect(cx - 5, 52, 11, 2, 'W'); c.rect(cx - 5, 53, 11, 1, 'X'); c.px(cx - 5, 52, 'h'); c.px(cx + 5, 52, 'h');
  [[cx - 4, 51], [cx - 3, 50], [cx, 51], [cx + 1, 50], [cx + 3, 51], [cx + 4, 50]].forEach(([x, y]) => c.px(x, y, 'i'));
}

// Tuck on a stool in the niche behind the chair, working his control bar.
function tuckBehind(c, frame) {
  const cx = 47;
  const y = 36 + (frame === 1 ? 1 : 0);
  const bx = frame === 1 ? 1 : 0;
  // The strings go on first, so he sits in front of them.
  [[cx - 6 + bx, y + 9, 36, 28], [cx - 2 + bx, y + 9, 36, 30], [cx + 2 + bx, y + 9, 36, 33]].forEach(([x0, y0, x1, y1]) => c.line(x0, y0, x1, y1, 'i'));
  // The stool.
  c.rect(cx - 6, 54, 13, 2, 'X'); c.rect(cx - 6, 54, 13, 1, 'W'); c.rect(cx - 5, 56, 2, 4, 'Y'); c.rect(cx + 4, 56, 2, 4, 'Y');
  // The tabard, pooled round the stool.
  c.rect(cx - 5, y + 10, 11, 8, 'r'); c.rect(cx + 3, y + 10, 3, 8, 'R'); c.rect(cx - 7, y + 16, 15, 3, 'r'); c.rect(cx - 7, y + 18, 15, 1, 'g');
  c.rect(cx - 2, y + 9, 5, 1, 'g'); c.px(cx, y + 12, 'g'); c.px(cx - 1, y + 13, 'g'); c.px(cx + 1, y + 13, 'g');
  // Ears, head, big glossy eyes looking up at his puppet, the page's cap and
  // its feather tipped over one ear.
  c.ell(cx - 5, y + 2.6, 3, 3, 'F', "'", 'f'); c.ell(cx + 5, y + 2.6, 3, 3, 'F', "'", 'f');
  c.ell(cx - 5, y + 3, 1.7, 1.8, 'p'); c.ell(cx + 5, y + 3, 1.7, 1.8, 'p');
  c.ell(cx, y + 5.6, 5.4, 4.5, 'F', "'", 'f');
  c.ell(cx, y + 7.8, 2.7, 1.6, 'b');
  c.ell(cx, y + 2.2, 4.2, 2.4, 'r', 'r', 'R'); c.rect(cx - 4, y + 3, 9, 1, 'g'); c.px(cx - 5, y + 3, 'G');
  c.line(cx + 2, y, cx + 5, y - 3, 'g'); c.line(cx + 3, y, cx + 6, y - 3, 'g'); c.px(cx + 6, y - 4, '"');
  c.rect(cx - 4, y + 4, 3, 4, 'e'); c.rect(cx + 2, y + 4, 3, 4, 'e');
  c.px(cx - 4, y + 4, 'w'); c.px(cx - 3, y + 4, 'w'); c.px(cx + 2, y + 4, 'w'); c.px(cx + 3, y + 4, 'w'); c.px(cx - 2, y + 7, 'w'); c.px(cx + 4, y + 7, 'w');
  c.px(cx - 1, y + 8, 'n'); c.px(cx, y + 8, 'n');
  // Tongue poking out, he's concentrating.
  c.px(cx + 1, y + 10, 'p');
  // Brows pulled down.
  c.px(cx - 4, y + 3, 'f'); c.px(cx - 3, y + 3, 'f'); c.px(cx + 3, y + 3, 'f'); c.px(cx + 4, y + 3, 'f');
  // His tail on the stool beside him, tip up.
  c.ell(cx + 7, y + 14, 1.8, 3, 'F', "'", 'f'); c.px(cx + 7, y + 11, '"'); c.px(cx + 8, y + 12, '"');
  // The control bar: a wooden handle across his paws, strings up and left to
  // the back of the chair, where the king's cape hangs.
  c.rect(cx - 7 + bx, y + 9, 14, 2, 'W'); c.rect(cx - 7 + bx, y + 10, 14, 1, 'X');
  c.px(cx - 7 + bx, y + 9, 'h'); c.px(cx + 6 + bx, y + 9, 'h');
  c.rect(cx - 6 + bx, y + 11, 2, 2, 'F'); c.rect(cx + 4 + bx, y + 11, 2, 2, 'F');
  // And a lever: a long handle going into the back of the chair, a knob on the end.
  c.line(cx - 8, y + 14, 37, y + 21, 'W'); c.line(cx - 8, y + 15, 37, y + 22, 'Y');
  c.ell(cx - 9, y + 14, 1.5, 1.5, 'q');
}

BF_PROP_SPRITES.bf_throne = done(throneFigure('closed', 0));
BF_PROP_SPRITES.bf_throne_revealed = done(throneFigure('open', 0));
export const BF_THRONE_SPRITES = {
  a: done(throneFigure('closed', 0)),
  b: done(throneFigure('closed', 1)),
  c: done(throneFigure('closed', 2)),
  d: done(throneFigure('closed', 0)),
};
export const BF_THRONE_REVEALED_SPRITES = {
  a: done(throneFigure('open', 0)),
  b: done(throneFigure('open', 1)),
};
// The curtain pulled back and the stool empty: Tuck has let go (the living king).
export const BF_THRONE_EMPTY_SPRITES = { a: done(throneFigure('empty', 0)) };

// =====================================================================
// HOBNAIL, the mole smith
// =====================================================================
// A grumpy old mole: velvet-grey, round-shouldered, a pink snout, tiny eyes
// under a permanent scowl, singed whiskers with burnt tips, and a pair of tiny
// smoked-glass goggles pushed up on his forehead. A leather apron, soot, and
// huge pink digging hands, tongs in one and a hammer in the other.
// 16 wide, 23 tall. blink / twitch / tap: his idle's little movements.
function hobnailFigure(dir, { blink = false, twitch = 0, tap = 0 } = {}) {
  const c = new Cv(16, 23);
  const front = dir === 'down';
  // Stubby legs and big dark boots.
  c.rect(4, 19, 3, 3, 'a'); c.rect(9, 19, 3, 3, 'a');
  c.rect(3, 21, 4, 2, 'T'); c.rect(9, 21, 4, 2, 'T');
  c.px(3, 22, 'B'); c.px(12, 22, 'B');
  // Round shoulders and the body: a dark woolly shirt under a leather apron.
  c.ell(8, 14, 6.4, 5.6, 'a', 'A', null);
  if (front) {
    c.rect(4, 12, 8, 8, 'B'); c.rect(4, 12, 1, 8, 'T'); c.rect(11, 12, 1, 8, 'T');
    c.rect(5, 12, 1, 2, 'T'); c.rect(10, 12, 1, 2, 'T');
    // A pocket full of tools, and soot.
    c.rect(6, 16, 4, 3, 'T'); c.px(6, 15, 'S'); c.px(8, 15, 'S'); c.px(9, 14, 's');
    c.px(7, 13, 'd'); c.px(10, 18, 'd'); c.px(5, 19, 'd');
  } else {
    // From behind: apron strings in a bow, a dark shirt, soot.
    c.rect(4, 12, 8, 7, 'a'); c.rect(4, 15, 8, 1, 'T'); c.px(8, 16, 'T'); c.px(7, 17, 'T'); c.px(9, 17, 'T');
    c.px(6, 13, 'd'); c.px(10, 17, 'd'); c.px(3, 13, 'A');
  }
  // The head: no neck at all.
  c.ell(8, 6.5, 5.3, 4.6, 'a', 'A', null);
  if (front) {
    // Pink snout.
    c.ell(8, 9.2, 1.8, 2.1, 'P', 'P', 'Q');
    c.px(7, 10, 'Q'); c.px(9, 10, 'Q'); c.px(8, 8, 'A');
    // Tiny eyes under a heavy scowl.
    if (blink) { c.px(5, 7, 'k'); c.px(6, 7, 'k'); c.px(10, 7, 'k'); c.px(11, 7, 'k'); }
    else { c.px(5, 7, 'w'); c.px(6, 7, 'e'); c.px(10, 7, 'e'); c.px(11, 7, 'w'); c.px(5, 6, 'd'); c.px(6, 6, 'd'); c.px(10, 6, 'd'); c.px(11, 6, 'd'); c.px(4, 5, 'd'); c.px(12, 5, 'd'); }
    // Singed whiskers: grey, and black at the burnt ends.
    const w = twitch ? 1 : 0;
    c.px(4, 9, 'A'); c.px(3, 9 + w, 'A'); c.px(2, 9 + w, 'd'); c.px(4, 10, 'A'); c.px(3, 11 - w, 'd');
    c.px(12, 9, 'A'); c.px(13, 9 + w, 'A'); c.px(14, 9 + w, 'd'); c.px(12, 10, 'A'); c.px(13, 11 - w, 'd');
  } else {
    c.ell(8, 6, 3, 2, 'A');
  }
  // Goggles shoved up on the forehead: brass rings, dark smoked glass, a strap.
  c.rect(3, 4, 10, 1, 'T');
  [[5.5, 2.8], [10.5, 2.8]].forEach(([x, y]) => { c.ell(x, y, 1.9, 1.7, 'h'); c.ell(x, y, 1.1, 0.9, 'z'); c.px(x - 1, y - 1, 'l'); });
  c.px(8, 3, 'h');
  if (front) {
    // Huge pink digging hands, claws pointing down. Tongs in one (a glowing
    // bar in their jaws) and a hammer resting in the other.
    c.ell(2.6, 15.5, 2.3, 2.5, 'P', 'P', 'Q'); c.px(1, 18, 'Q'); c.px(3, 18, 'Q');
    c.ell(13.4, 15.5, 2.3, 2.5, 'P', 'P', 'Q'); c.px(12, 18, 'Q'); c.px(14, 18, 'Q');
    // Tongs: two long arms from the left hand, the bar glowing in the tips.
    c.line(3, 18, 1, 22, 's'); c.line(4, 18, 3, 22, 's'); c.px(2, 22, 'O'); c.px(1, 22, 'E'); c.px(3, 22, 'O');
    // The hammer, over his right shoulder, head high.
    const th = tap ? 1 : 0;
    c.line(13, 15, 14, 8 + th, 'X'); c.rect(12, 5 + th, 4, 3, 's'); c.rect(12, 5 + th, 4, 1, 'S'); c.px(15, 6 + th, 'T');
    c.px(13, 15, 'P'); c.px(14, 15, 'P');
  } else {
    c.ell(2.6, 15, 2.6, 2.4, 'P'); c.ell(13.4, 15, 2.6, 2.4, 'P');
    c.line(13, 14, 14, 8, 'X'); c.rect(12, 5, 4, 3, 's');
  }
  return c.outline();
}

export const BF_HOBNAIL_SPRITES = {
  a: done(hobnailFigure('down')),
  b: done(hobnailFigure('down', { blink: true })),
  c: done(hobnailFigure('down', { twitch: 1 })),
  d: done(hobnailFigure('down', { tap: 1 })),
};

// Hobnail at his anvil, side on, hammering a glowing bar. 32 wide (two tiles):
// the stump and anvil at the right, the forge's glow on the bar, sparks.
function hobnailForge(phase) {
  const c = new Cv(32, 26);
  // The tree-stump the anvil sits on, and the anvil.
  c.rect(19, 19, 11, 7, 'X'); c.rect(19, 19, 11, 1, 'W'); c.rect(28, 20, 2, 6, 'Y'); c.px(22, 22, 'y'); c.px(25, 24, 'y'); c.px(21, 24, 'y');
  c.rect(17, 14, 15, 3, 's'); c.rect(17, 14, 15, 1, 'S'); c.px(16, 14, 's'); c.px(15, 14, 's'); c.px(14, 15, 's');
  c.rect(21, 17, 7, 2, 's'); c.rect(20, 18, 9, 1, 'S');
  // The bar on the anvil: dull to white-hot.
  c.rect(19, 13, 10, 1, 'O'); c.rect(21, 13, 6, 1, 'E');
  // Hobnail, facing right: hunched, hammer arm up or down.
  c.rect(5, 21, 3, 3, 'a'); c.rect(10, 21, 3, 3, 'a'); c.rect(4, 24, 5, 2, 'T'); c.rect(10, 24, 5, 2, 'T');
  c.ell(9, 15, 6.4, 6, 'a', 'A');
  c.rect(8, 13, 8, 8, 'B'); c.rect(8, 13, 1, 8, 'T'); c.rect(15, 13, 1, 8, 'T'); c.rect(10, 17, 4, 3, 'T'); c.px(11, 16, 'S'); c.px(7, 16, 'd');
  c.ell(11.5, 8, 5.3, 4.6, 'a', 'A');
  c.ell(15.5, 10, 2.2, 1.6, 'P', 'P', 'Q'); c.px(16, 10, 'Q');
  c.px(13, 8, 'e'); c.px(12, 7, 'k'); c.px(13, 7, 'k'); c.px(14, 6, 'k');
  c.px(15, 11, 'S'); c.px(16, 12, 'S'); c.px(17, 12, 'd'); c.px(17, 10, 'S'); c.px(18, 9, 'd');
  c.rect(8, 4, 8, 1, 'T');
  c.ell(10.5, 3.4, 2, 1.7, 'h'); c.ell(10.5, 3.4, 1.1, 0.9, 'z'); c.px(9, 2, 'l');
  // The hammer arm: wound up over his shoulder, or down on the bar.
  if (phase === 0) {
    c.line(13, 14, 12, 7, 'P'); c.line(14, 14, 13, 7, 'P'); c.ell(12.5, 6.5, 2, 1.8, 'P');
    c.line(12, 6, 8, 1, 'X'); c.rect(5, 0, 5, 3, 's'); c.rect(5, 0, 5, 1, 'S');
  } else {
    c.line(13, 14, 18, 10, 'P'); c.line(13, 15, 18, 11, 'P'); c.ell(18.5, 10.5, 2, 1.8, 'P');
    c.line(19, 10, 22, 11, 'X'); c.rect(22, 10, 5, 3, 's'); c.rect(22, 10, 5, 1, 'S');
  }
  // The other hand holds the bar down with tongs.
  c.ell(14, 18, 2.4, 2.2, 'P'); c.line(15, 17, 20, 14, 's'); c.line(15, 18, 20, 15, 's');
  // Sparks on the strike.
  if (phase === 1) {
    [[22, 8, 'E'], [25, 7, 'O'], [28, 9, 'E'], [24, 5, 'O'], [29, 6, 'E'], [20, 7, 'O'], [27, 12, 'O']].forEach(([x, y, col]) => c.px(x, y, col));
  }
  if (phase === 2) [[23, 11, 'O'], [26, 10, 'O'], [24, 9, 'E']].forEach(([x, y, col]) => c.px(x, y, col));
  return c.outline();
}
export const BF_HOBNAIL_FORGE_SPRITES = { a: done(hobnailForge(0)), b: done(hobnailForge(1)), c: done(hobnailForge(2)), d: done(hobnailForge(0)) };

Object.assign(BF_PROP_SPRITES, {
  bf_hobnail: done(hobnailFigure('down')),
  bf_hobnail_back: done(hobnailFigure('up')),
  bf_hobnail_forge: done(hobnailForge(0)),
});

// =====================================================================
// MARIGOLD, the hare with the lemonade stand
// =====================================================================
// Tall ears poking up through a yellow sun bonnet (one flopped, one up), big
// round happy eyes, a sky-blue dress and a white apron with a lemon in the
// pocket. 16 wide, 24 tall. wave: an arm up; blink.
function marigoldFigure(dir, { wave = 0, blink = false, flop = 0 } = {}) {
  const c = new Cv(16, 24);
  const front = dir === 'down';
  // Feet.
  c.rect(5, 22, 3, 2, 'H'); c.rect(9, 22, 3, 2, 'H'); c.rect(4, 23, 4, 1, 'J'); c.rect(9, 23, 4, 1, 'J');
  // The dress, a bell.
  for (let y = 13; y <= 22; y++) {
    const half = 3 + (y - 13) * 0.4;
    for (let x = Math.round(8 - half); x < Math.round(8 + half); x++) c.px(x, y, 't');
    c.px(Math.round(8 + half) - 1, y, 'K');
  }
  c.rect(4, 22, 9, 1, 'K');
  if (front) {
    // The apron, with a lemon in the pocket and a bow at the waist.
    c.rect(6, 15, 5, 7, 'i'); c.rect(10, 15, 1, 7, 'I'); c.rect(6, 19, 5, 2, 'I'); c.rect(7, 20, 3, 1, 'x'); c.px(8, 20, 'u');
    c.rect(5, 15, 7, 1, 'I'); c.px(5, 14, 'i'); c.px(11, 14, 'i');
  } else {
    c.rect(6, 15, 5, 1, 'i'); c.px(8, 16, 'i'); c.px(7, 17, 'i'); c.px(9, 17, 'i'); c.px(8, 18, 'i');
  }
  // Arms: one at her side, one up waving (or holding a jug).
  c.rect(3, 14, 2, 5, 'H'); c.rect(3, 14, 2, 1, 't');
  if (wave) {
    c.rect(12, 8 + wave, 2, 6 - wave, 'H'); c.rect(12, 13, 2, 1, 't'); c.px(12, 7 + wave, 'J'); c.px(13, 7 + wave, 'H');
  } else {
    c.rect(12, 14, 2, 5, 'H'); c.rect(12, 14, 2, 1, 't');
  }
  // Head with ears: two long ones, the left flopped over.
  c.ell(8, 8.6, 4.8, 4.2, 'H', 'H', 'J');
  const ex = [4, 11];
  if (flop) {
    c.line(4, 4, 1, 1, 'H'); c.line(5, 4, 2, 1, 'H'); c.line(1, 1, 0, 4, 'H'); c.line(2, 1, 1, 5, 'J');
  } else {
    c.rect(ex[0], 0, 2, 5, 'H'); c.rect(ex[0] + 1, 1, 1, 3, 'p');
  }
  c.rect(ex[1], 0, 2, 5, 'H'); c.rect(ex[1], 1, 1, 3, 'p');
  c.px(ex[0], 2, 'p');
  // The sun bonnet: a yellow brim round the face, a bow under the chin.
  c.ell(8, 5.2, 5.6, 3.1, 'u', 'u', 'U');
  c.rect(2, 5, 2, 6, 'u'); c.rect(12, 5, 2, 6, 'U'); c.px(2, 11, 'U'); c.px(13, 11, 'U');
  c.rect(4, 4, 8, 1, 'u');
  c.px(4, 4, 'U'); c.px(11, 4, 'U'); c.px(7, 3, 'x'); c.px(8, 3, 'u'); c.px(9, 3, 'x');
  if (front) {
    // The face, in the bonnet's frame.
    c.rect(4, 6, 8, 5, 'H');
    c.rect(3, 6, 1, 5, 'u'); c.rect(12, 6, 1, 5, 'U');
    if (blink) { c.rect(5, 8, 2, 1, 'k'); c.rect(9, 8, 2, 1, 'k'); }
    else { c.rect(5, 7, 1, 2, 'e'); c.rect(10, 7, 1, 2, 'e'); c.px(5, 7, 'k'); c.px(10, 7, 'k'); c.px(5, 8, 'e'); c.px(10, 8, 'e'); }
    // A pale hare's muzzle with a pink nose, and a little smile.
    c.rect(6, 9, 4, 2, 'i'); c.px(7, 9, 'n'); c.px(8, 9, 'n'); c.px(6, 10, 'I'); c.px(9, 10, 'I'); c.px(7, 10, 'k'); c.px(8, 10, 'k');
    c.px(4, 9, 'p'); c.px(11, 9, 'p');
    // The ribbon bow under her chin.
    c.px(6, 12, 'u'); c.px(7, 12, 'U'); c.px(8, 12, 'U'); c.px(9, 12, 'u'); c.px(5, 12, 'u'); c.px(10, 12, 'u');
  } else {
    c.rect(4, 6, 8, 5, 'u'); c.rect(11, 6, 1, 5, 'U');
    c.px(7, 11, 'U'); c.px(8, 11, 'U'); c.px(6, 12, 'u'); c.px(9, 12, 'u');
  }
  return c.outline();
}
export const BF_MARIGOLD_SPRITES = {
  a: done(marigoldFigure('down', { wave: 0 })),
  b: done(marigoldFigure('down', { wave: 0, blink: true })),
  c: done(marigoldFigure('down', { wave: 1 })),
  d: done(marigoldFigure('down', { wave: 2, flop: 1 })),
};
// Her stand: a plank counter with a striped awning, a pitcher, cups, a pyramid
// of lemons and a hand-lettered sign. Two tiles wide; she stands behind it.
function lemonadeStand(frame) {
  const c = new Cv(32, 30);
  // The awning: yellow and white stripes, scalloped.
  for (let y = 0; y < 6; y++) for (let x = 0; x < 32; x++) c.px(x, y, Math.floor(x / 4) % 2 ? 'i' : 'u');
  for (let x = 0; x < 32; x++) c.px(x, 6, Math.floor(x / 4) % 2 ? 'I' : 'U');
  for (let x = 0; x < 32; x += 4) { c.rect(x, 7, 4, 1, Math.floor(x / 4) % 2 ? 'i' : 'u'); c.rect(x + 1, 8, 2, 1, Math.floor(x / 4) % 2 ? 'I' : 'U'); }
  // Posts.
  c.rect(1, 8, 2, 22, 'X'); c.rect(29, 8, 2, 22, 'X'); c.rect(1, 8, 1, 22, 'W'); c.rect(29, 8, 1, 22, 'W');
  // The counter, with a plank front.
  c.rect(0, 18, 32, 3, 'W'); c.rect(0, 18, 32, 1, 'h'); c.rect(0, 20, 32, 1, 'X');
  c.rect(1, 21, 30, 9, 'X'); c.rect(1, 21, 30, 1, 'Y');
  for (let x = 6; x < 31; x += 7) c.rect(x, 22, 1, 8, 'Y');
  c.rect(3, 28, 26, 2, 'Y');
  // The sign, tacked to the front: painted stripes for letters, a lemon.
  c.rect(7, 23, 18, 5, 'i'); c.rect(7, 27, 18, 1, 'I');
  for (let x = 9; x < 21; x += 2) c.rect(x, 24, 1, 3, 'u');
  c.ell(22.5, 25.4, 1.8, 1.6, 'x'); c.px(23, 23, 'g');
  // On the counter: a glass pitcher of pale lemonade, a pyramid of lemons, cups.
  c.rect(4, 11, 6, 7, 'l'); c.rect(4, 11, 1, 7, 'w'); c.rect(4, 14, 6, 4, 'x'); c.rect(10, 12, 2, 4, 'l'); c.rect(3, 10, 8, 1, 'l');
  c.rect(5, 12 + (frame % 2), 1, 1, 'w');
  [[17, 16], [20, 16], [23, 16], [18, 13], [21, 13], [19, 10]].forEach(([x, y]) => { c.ell(x + 1, y + 1, 1.8, 1.6, 'x'); c.px(x, y, 'w'); c.px(x + 2, y + 2, 'u'); });
  c.px(20, 9, 'g'); c.px(21, 10, 'g');
  [[26, 15], [29, 15]].forEach(([x]) => { c.rect(x - 1, 15, 3, 3, 'i'); c.rect(x - 1, 15, 3, 1, 'x'); });
  // A bumble bee that has found the lemons.
  const bx = 12 + frame * 2;
  c.px(bx, 8 + (frame % 2), 'x'); c.px(bx + 1, 8 + (frame % 2), 'd'); c.px(bx + 2, 8 + (frame % 2), 'x'); c.px(bx + 1, 7 + (frame % 2), 'w');
  return c.outline();
}
export const BF_LEMONADE_STAND_SPRITES = { a: done(lemonadeStand(0)), b: done(lemonadeStand(1)), c: done(lemonadeStand(2)), d: done(lemonadeStand(3)) };
Object.assign(BF_PROP_SPRITES, {
  bf_marigold: done(marigoldFigure('down')),
  bf_marigold_back: done(marigoldFigure('up')),
  bf_lemonade_stand: done(lemonadeStand(0)),
});

// =====================================================================
// FERRYMAN GUBB, the cave frog
// =====================================================================
// Old, round and pale, in an oatmeal fisherman's smock with a rope belt, big
// sleepy eyes on top of a wide flat head, a throat sac that swells when he
// sings, and a long pole taller than he is. 20 wide, 26 tall (the pole goes
// right to the top). mood: 'content', 'sleepy', 'sing'.
function gubbCv(mood = 'content', bob = 0) {
  const c = new Cv(20, 26);
  // The pole, in his right hand.
  c.rect(17, 0, 2, 26, '3'); c.rect(17, 0, 1, 26, 'X'); c.px(18, 5, 'Y'); c.px(18, 14, 'Y'); c.px(17, 9, '2'); c.px(17, 20, '2');
  c.rect(16, 0, 4, 1, '3');
  // Big webbed feet.
  c.rect(2, 23, 6, 3, 'j'); c.rect(11, 23, 6, 3, 'j');
  [[2, 25], [4, 25], [6, 25], [11, 25], [13, 25], [15, 25]].forEach(([x, y]) => c.px(x, y, 'D'));
  c.rect(1, 24, 1, 2, 'j'); c.rect(8, 24, 1, 2, 'D');
  // The belly, in a smock.
  c.ell(9.5, 17 + bob, 8.2, 6.8, '1', '1', '2');
  c.rect(4, 19 + bob, 11, 1, '3'); c.px(9, 20 + bob, '3'); c.px(10, 21 + bob, '3'); c.px(8, 21 + bob, '3');
  // A patch on the smock, and fish scales on the front.
  c.rect(11, 14 + bob, 3, 3, '2'); c.px(11, 14 + bob, 'T');
  c.px(5, 16 + bob, '2'); c.px(6, 17 + bob, '2'); c.px(7, 24 - 6 + bob, '2');
  // The head, and the throat sac.
  const sing = mood === 'sing';
  c.ell(9.5, 8 + bob, 7.2, 4.6, 'j', 'N', 'D');
  c.ell(9.5, 12.6 + bob, sing ? 4.2 : 3, sing ? 2.6 : 1.8, 'Z', 'Z', 'N');
  // Eyes on top, heavy lidded.
  [[5.5, 4.2], [13.5, 4.2]].forEach(([x, y]) => {
    c.ell(x, y + bob, 2.8, 2.5, 'N', 'N', 'j');
    if (mood === 'sleepy') { c.rect(x - 2, y + bob, 5, 1, 'D'); c.rect(x - 2, y + bob + 1, 5, 1, 'D'); }
    else {
      c.rect(x - 1, y + bob, 2, 2, 'e'); c.px(x - 1, y + bob, 'w');
      c.rect(x - 2, y - 2 + bob, 5, 1, 'j'); c.rect(x - 3, y - 2 + bob, 6, 1, 'D');
    }
  });
  // A wide mouth, a little smile.
  c.px(2, 11 + bob, 'k'); c.px(3, 11 + bob, 'k');
  if (sing) {
    c.ell(9.5, 10.6 + bob, 3.2, 1.8, 'd'); c.rect(8, 11 + bob, 3, 1, 'q');
  } else {
    for (let x = 4; x <= 15; x++) c.px(x, 10 + bob + (x < 6 || x > 13 ? -1 : 0), 'k');
    c.px(3, 9 + bob, 'k'); c.px(16, 9 + bob, 'k');
  }
  c.px(8, 8 + bob, 'D'); c.px(11, 8 + bob, 'D');
  // Bushy white brows and a few warts.
  c.rect(3, 2 + bob, 4, 1, 'i'); c.rect(12, 2 + bob, 4, 1, 'i'); c.px(7, 2 + bob, 'i'); c.px(12, 2 + bob, 'i');
  c.px(4, 8 + bob, 'D'); c.px(15, 7 + bob, 'D'); c.px(10, 6 + bob, 'D');
  // His hands: the near one round the pole, the other on his belly.
  c.ell(16.5, 15 + bob, 2.2, 2, 'j', 'N', 'D'); c.rect(17, 14 + bob, 2, 1, 'N');
  c.ell(3, 17 + bob, 2.2, 2, 'j', 'N', 'D');
  return c;
}
// From behind: the same round old frog, no face, his smock's back and the rope.
function gubbBack() {
  const c = gubbCv('sleepy', 0);
  for (let y = 9; y <= 15; y++) for (let x = 2; x <= 16; x++) if (c.get(x, y) !== '.' && c.get(x, y) !== '1') c.px(x, y, y < 12 ? 'j' : '1');
  c.rect(4, 10, 10, 1, 'D'); c.rect(7, 13, 4, 1, '2'); c.rect(8, 14, 2, 4, '2');
  return c;
}
const gubbRows = (mood, bob) => done(gubbCv(mood, bob).outline());
export const BF_GUBB_SPRITES = {
  a: gubbRows('content', 0),
  b: gubbRows('content', 1),
  c: gubbRows('sleepy', 0),
  d: gubbRows('sing', 0),
};

// The punt: a flat-bottomed river boat with a turned-up bow, a lantern on a
// post, and Gubb standing at the stern with his pole in the water. 48 wide
// (three tiles), 34 tall. frame: the boat rocks a little, the ripples move.
function puntFigure(frame) {
  const boat = new Cv(48, 34);
  const c = boat;
  const dy = frame % 2; // rocking
  // The hull.
  for (let y = 20; y < 27; y++) {
    const x0 = Math.round(2 + (y - 20) * 1.3);
    const x1 = Math.round(46 - (y - 20) * 1.6);
    for (let x = x0; x <= x1; x++) c.px(x, y + dy, y === 20 ? 'W' : y > 24 ? 'Y' : (x + y) % 9 === 0 ? 'y' : 'X');
  }
  c.px(1, 18 + dy, 'W'); c.px(1, 19 + dy, 'W'); c.px(2, 19 + dy, 'W'); c.px(0, 17 + dy, 'W');
  for (let y = 21; y < 25; y++) c.px(Math.round(2 + (y - 20) * 1.3) + 1, y + dy, 'W');
  for (let x = 4; x < 45; x += 8) c.px(x, 22 + dy, 'h');
  c.rect(14, 20 + dy, 1, 6, 'y'); c.rect(32, 20 + dy, 1, 6, 'y');
  // The lantern on a post at the bow, and its glow.
  c.rect(5, 9 + dy, 1, 11, 'Y'); c.rect(3, 7 + dy, 5, 1, 'h'); c.rect(3, 8 + dy, 5, 4, 'g'); c.rect(4, 9 + dy, 3, 2, '4'); c.px(5, 9 + dy, '_');
  c.rect(3, 12 + dy, 5, 1, 'h'); c.px(5, 6 + dy, 'h');
  // A basket of fish.
  c.rect(16, 16 + dy, 6, 4, 'T'); c.rect(16, 16 + dy, 6, 1, 'B'); c.px(18, 15 + dy, 'j'); c.px(19, 15 + dy, 'N'); c.px(20, 14 + dy, 'N');
  // Gubb at the stern, behind the boat's side so it covers his feet; his
  // pole goes on down into the water.
  const out = new Cv(48, 40);
  out.stamp(gubbCv(frame === 2 ? 'sing' : 'content', 0).rows(), 24, dy);
  out.line(41, 26, 44, 39, '3'); out.line(42, 26, 45, 39, 'X');
  out.stamp(boat.rows(), 0, 6);
  out.outline();
  // Water: dark, with light ripples that move.
  for (let y = 34; y < 40; y++) for (let x = 0; x < 48; x++) {
    if (out.get(x, y) !== '.') continue;
    out.px(x, y, (x + frame * 3 + y) % 8 < 2 ? 'l' : y > 36 ? 'd' : 'L');
  }
  return out;
}
export const BF_PUNT_SPRITES = { a: done(puntFigure(0)), b: done(puntFigure(1)), c: done(puntFigure(2)), d: done(puntFigure(3)) };
Object.assign(BF_PROP_SPRITES, {
  bf_gubb: gubbRows('content', 0),
  bf_gubb_back: done(gubbBack().outline()),
  bf_punt: done(puntFigure(0)),
});

// =====================================================================
// THE BELOWTOWN FOLK (overworld people, no portraits)
// =====================================================================
// Each has an idle animation (`bf_<name>`, frames a, b, c ...) and a still
// prop of the same name; the ones you might see from behind have a _back.

// --- The glow-worm lamplighter ---
// A tall pale-green worm, standing up in segments, a lit tail that glows and
// pulses, little feelers, a long pole with a hook for the lamps. 16 wide, 24 tall.
// glow: 0, 1 or 2, how bright the tail is.
function glowwormCv(glow = 1, dir = 'down', sway = 0) {
  const c = new Cv(16, 24);
  const front = dir === 'down';
  // The pole, with a hook and a spark of flame at the top.
  c.rect(13, 3, 1, 21, 'X'); c.rect(13, 3, 1, 21, 'X'); c.px(14, 21, 'Y'); c.px(14, 12, 'Y');
  c.px(12, 2, 'X'); c.px(12, 1, 'X'); c.px(13, 0, 'X'); c.px(11, 1, 'X');
  c.px(11, 3, 'h'); c.px(12, 3, 'h'); c.px(11, 4, '4');
  // Tail: the lamp end, curled forward and glowing.
  const halo = glow === 2 ? 3.4 : glow === 1 ? 2.8 : 2.4;
  c.ell(7 + sway, 20, halo + 0.6, halo, '5');
  c.ell(7 + sway, 20, 2.1, 2.1, '4', '_', '4');
  c.px(6 + sway, 19, '_'); c.px(7 + sway, 19, '_');
  // Body segments, each a little smaller than the one above.
  c.ell(7 + sway, 15, 3.3, 3, '6', '5', '7');
  c.ell(7 + sway, 11, 3.6, 3, '6', '5', '7');
  c.rect(4 + sway, 13, 7, 1, '7'); c.rect(5 + sway, 17, 5, 1, '7');
  // The head: round, with a wide happy face.
  c.ell(7 + sway, 6, 4, 3.8, '6', '5', '7');
  // Feelers with bulbs.
  c.line(5 + sway, 3, 3, 0, '6'); c.line(9 + sway, 3, 11, 0, '6'); c.px(3, 0, '5'); c.px(11, 0, '5');
  if (front) {
    c.px(5 + sway, 6, 'e'); c.px(9 + sway, 6, 'e'); c.px(5 + sway, 5, 'w'); c.px(9 + sway, 5, 'w');
    c.px(5 + sway, 8, 'k'); c.px(6 + sway, 9, 'k'); c.px(7 + sway, 9, 'k'); c.px(8 + sway, 9, 'k'); c.px(9 + sway, 8, 'k');
    c.px(4 + sway, 8, 'p'); c.px(10 + sway, 8, 'p');
    // Tiny arms: one up on the pole.
    c.px(10 + sway, 11, '6'); c.px(11, 10, '6'); c.px(12, 10, '6'); c.px(4 + sway, 12, '6'); c.px(3 + sway, 13, '6');
  } else {
    c.px(10 + sway, 11, '6'); c.px(11, 10, '6'); c.px(12, 10, '6');
  }
  return c.outline();
}
export const BF_GLOWWORM_SPRITES = {
  a: done(glowwormCv(1, 'down', 0)),
  b: done(glowwormCv(2, 'down', 0)),
  c: done(glowwormCv(1, 'down', 1)),
  d: done(glowwormCv(0, 'down', 0)),
};

// --- Mole miners ---
// A mole's face, shared by the miners and the crowd: velvet all over (no bare
// face), a long pink snout running down the middle and poking out past the
// chin, pale whiskers either side, and eyes so tiny they're barely there.
// (A big pink snout filling the face read as a person's face with hair round it.)
function moleFace(c, cy, fur, { blink = false, cheer = false } = {}) {
  c.rect(7, cy + 1, 3, 1, fur[1]);
  c.rect(7, cy + 2, 3, 2, 'P'); c.px(7, cy + 3, 'Q'); c.px(9, cy + 3, 'Q');
  c.px(8, cy + 4, 'P'); c.px(8, cy + 5, 'n');
  // Whiskers sticking right out past the sides of the head.
  c.px(2, cy + 2, 'S'); c.px(1, cy + 1, 'S'); c.px(2, cy + 3, 'S'); c.px(1, cy + 4, 'S');
  c.px(14, cy + 2, 'S'); c.px(15, cy + 1, 'S'); c.px(14, cy + 3, 'S'); c.px(15, cy + 4, 'S');
  if (cheer) { c.px(7, cy + 4, 'q'); c.px(9, cy + 4, 'q'); }
  if (blink || cheer) { c.px(5, cy, 'k'); c.px(6, cy, 'k'); c.px(10, cy, 'k'); c.px(11, cy, 'k'); }
  else { c.px(6, cy, 'e'); c.px(10, cy, 'e'); c.px(5, cy, 'w'); c.px(11, cy, 'w'); }
}
// Stocky little moles in hard hats with a lamp on the front, pickaxes on their shoulders.
// look: 'a' grey with a yellow hat, 'b' plum-dark with a red hat and a blue neckerchief.
function moleMinerCv(look, { swing = 0, blink = false, broom = null } = {}) {
  const c = new Cv(16, 22);
  const fur = look === 'a' ? ['a', 'A'] : ['*', '&'];
  const hat = look === 'a' ? ['8', '9'] : [']', 'q'];
  c.rect(4, 19, 3, 3, fur[0]); c.rect(9, 19, 3, 3, fur[0]); c.rect(3, 21, 4, 1, 'k'); c.rect(9, 21, 4, 1, 'k');
  c.rect(4, 21, 3, 1, '|'); c.rect(9, 21, 3, 1, '|');
  c.ell(8, 14.5, 5.8, 5.2, look === 'a' ? '^' : 'i', look === 'a' ? '}' : 'i', look === 'a' ? 'K' : 'I');
  // Braces and a belt.
  c.rect(5, 10, 1, 8, 'T'); c.rect(10, 10, 1, 8, 'T'); c.rect(4, 17, 8, 1, 'T'); c.px(8, 17, 'h');
  c.ell(8, 7.5, 5, 4.2, fur[0], fur[1], null);
  moleFace(c, 7, fur, { blink });
  if (look === 'b') { c.rect(5, 11, 6, 1, 't'); c.px(8, 12, 't'); }
  // The hard hat and its lamp.
  c.ell(8, 3.8, 5, 2.6, hat[0], hat[0], hat[1]);
  c.rect(2, 5, 12, 1, hat[1]); c.rect(7, 1, 2, 3, hat[0]);
  c.rect(7, 2, 2, 2, 'h'); c.px(7, 3, '4'); c.px(8, 3, '4');
  // Big pink hands; the pickaxe on the shoulder.
  c.ell(2.8, 15, 2.6, 2.4, 'P', 'P', 'Q'); c.ell(13.2, 15, 2.6, 2.4, 'P', 'P', 'Q');
  c.px(1, 17, 'S'); c.px(2, 18, 'S'); c.px(3, 17, 'S'); c.px(4, 18, 'S'); c.px(12, 18, 'S'); c.px(13, 17, 'S'); c.px(14, 18, 'S'); c.px(15, 17, 'S');
  // Sweeping instead: a straw broom held out, its head on the floor.
  if (broom !== null) {
    const hx = broom ? 5 : 10;
    c.line(13, 15, hx + 1, 19, 'X');
    c.rect(hx - 1, 19, 5, 3, 'g'); c.rect(hx - 1, 21, 5, 1, 'G'); c.px(hx + 1, 19, 'T'); c.px(hx, 20, 'G'); c.px(hx + 2, 20, 'G');
    return c.outline();
  }
  const sx = swing ? 2 : 0;
  c.line(13, 15, 14, 7 - swing, 'X');
  c.rect(11 + sx, 4 - swing, 6, 1, 's'); c.px(11 + sx, 5 - swing, 'S'); c.px(16, 5 - swing, 'S'); c.px(11, 3 - swing, 'S');
  return c.outline();
}
export const BF_MOLE_MINER_A_SPRITES = { a: done(moleMinerCv('a')), b: done(moleMinerCv('a', { blink: true })), c: done(moleMinerCv('a', { swing: 1 })), d: done(moleMinerCv('a')) };
export const BF_MOLE_MINER_B_SPRITES = { a: done(moleMinerCv('b')), b: done(moleMinerCv('b')), c: done(moleMinerCv('b', { blink: true })), d: done(moleMinerCv('b', { swing: 1 })) };

// --- The beetle postman ---
// A round plum-coloured beetle standing on its back legs in a blue postman's
// cap, a bulging satchel with letters poking out, six little legs, feelers.
function beetleCv({ wiggle = 0, blink = false } = {}) {
  const c = new Cv(16, 22);
  // Legs.
  c.rect(4, 19, 2, 3, '!'); c.rect(10, 19, 2, 3, '!'); c.rect(3, 21, 3, 1, '!'); c.rect(10, 21, 3, 1, '!');
  c.px(1, 14 + wiggle, '!'); c.px(2, 15, '!'); c.px(13, 15, '!'); c.px(14, 14 + wiggle, '!'); c.px(1, 17, '!'); c.px(14, 17, '!'); c.px(2, 18, '!'); c.px(13, 18, '!');
  // The shell: a big shiny dome with a line down the middle.
  c.ell(8, 14.5, 6.2, 6, '0', '@', '!');
  c.line(8, 10, 8, 20, '!');
  c.px(5, 12, '@'); c.px(4, 13, '@'); c.px(11, 17, '!');
  // The satchel strap and the bag with letters sticking out.
  c.line(3, 10, 12, 19, 'T'); c.line(4, 10, 13, 19, 'T');
  c.rect(9, 15, 6, 5, 'B'); c.rect(9, 15, 6, 1, 'T'); c.px(12, 17, 'h');
  c.rect(10, 13, 3, 3, 'i'); c.px(11, 14, 'n'); c.rect(12, 12, 2, 2, 'i');
  // Head, feelers, a cap.
  c.ell(8, 7, 4, 3.4, '0', '@', '!');
  if (blink) { c.px(6, 7, 'k'); c.px(10, 7, 'k'); } else { c.rect(5, 6, 2, 2, 'w'); c.px(6, 7, 'e'); c.rect(9, 6, 2, 2, 'w'); c.px(9, 7, 'e'); }
  c.px(7, 9, 'k'); c.px(8, 9, 'k'); c.px(5, 8, 'p'); c.px(11, 8, 'p');
  c.line(5, 4, 3, 1 - wiggle, '!'); c.line(11, 4, 13, 1 - wiggle, '!'); c.px(3, 1 - wiggle, '0'); c.px(13, 1 - wiggle, '0');
  c.ell(8, 3.4, 4.4, 2, '^', '}', 'K'); c.rect(3, 4, 11, 1, 'K'); c.rect(6, 2, 4, 1, 'g'); c.px(8, 2, 'h');
  return c.outline();
}
export const BF_BEETLE_POSTMAN_SPRITES = { a: done(beetleCv()), b: done(beetleCv({ wiggle: 1 })), c: done(beetleCv({ blink: true })), d: done(beetleCv({ wiggle: 1 })) };

// --- The toad who keeps The Mossy Pillow ---
// A wide warty toad in a big white apron, a tuft of moss growing on her head
// (the inn's name), a wooden ladle held up like a sceptre. 16 wide, 22 tall.
function toadCv({ stir = 0, blink = false } = {}) {
  const c = new Cv(16, 22);
  c.rect(3, 19, 4, 3, '#'); c.rect(9, 19, 4, 3, '#'); c.rect(2, 21, 5, 1, '$'); c.rect(9, 21, 5, 1, '$');
  c.ell(8, 14.5, 7, 5.6, '#', '#', '$');
  c.ell(8, 15, 4.4, 4, '%', '%', null);
  // The apron over it, with a stain.
  c.rect(4, 12, 8, 8, 'i'); c.rect(11, 12, 1, 8, 'I'); c.rect(5, 17, 3, 2, 'I'); c.px(9, 15, 'x'); c.rect(3, 12, 1, 2, 'i'); c.rect(12, 12, 1, 2, 'i');
  c.rect(5, 12, 1, 1, 'T'); c.rect(10, 12, 1, 1, 'T');
  // Head: wide, eyes up on top, a big mouth.
  c.ell(8, 7, 6, 3.6, '#', '#', '$');
  [[5, 4], [11, 4]].forEach(([x, y]) => { c.ell(x, y, 2.2, 2, '%', '%', '#'); if (blink) c.rect(x - 1, y, 3, 1, '$'); else { c.rect(x - 1, y, 2, 2, 'e'); c.px(x - 1, y, 'w'); } });
  c.px(2, 8, 'k'); for (let x = 3; x <= 13; x++) c.px(x, 9 + (x < 5 || x > 11 ? -1 : 0), 'k'); c.px(13, 8, 'k');
  c.px(4, 9, 'p'); c.px(12, 9, 'p'); c.px(3, 5, '$'); c.px(12, 6, '$'); c.px(7, 6, '$');
  // The moss.
  c.ell(8, 1.8, 3.4, 1.8, '{', '{', '{'); c.px(6, 1, 'g'); c.px(9, 0, 'g'); c.px(10, 2, 'g');
  // Arms: one ladle up, the other on her hip.
  c.ell(2, 14, 1.8, 2, '#'); c.rect(2, 14, 2, 3, '#');
  c.ell(14, 12, 1.8, 2, '#');
  const lx = 14 + (stir ? 1 : 0);
  c.line(lx, 11, lx, 2 + stir, 'X'); c.ell(lx, 1.5 + stir, 2, 1.6, 'S', 'S', 's'); c.px(lx, 1 + stir, 's');
  return c.outline();
}
export const BF_TOAD_INNKEEPER_SPRITES = { a: done(toadCv()), b: done(toadCv({ stir: 1 })), c: done(toadCv({ blink: true })), d: done(toadCv({ stir: 1 })) };

// --- A bat, asleep ---
// Hanging upside down from a beam by its feet, wrapped in its wings like a
// cocoon, ears pointing down, face tucked in, eyes shut, a snore. The beam
// is on the sprite, and the Zzz drifts up (frames). 16 wide, 24 tall; stands
// so the beam meets the ceiling at its top edge.
function batCv(z = 0, sway = 0) {
  const c = new Cv(16, 24);
  // The beam, and the feet holding on.
  c.rect(0, 0, 16, 3, 'X'); c.rect(0, 0, 16, 1, 'W'); c.rect(0, 2, 16, 1, 'Y'); c.px(4, 1, 'y'); c.px(11, 1, 'y');
  c.rect(6 + sway, 3, 1, 2, '*'); c.rect(9 + sway, 3, 1, 2, '*');
  // The wrapped body: a long fur cocoon, the wings folded over.
  c.ell(8 + sway, 11, 4.6, 6.4, '&', '(', '*');
  c.line(8 + sway, 6, 8 + sway, 16, '*'); c.px(6 + sway, 9, '(');
  c.px(5 + sway, 12, '*'); c.px(11 + sway, 13, '*');
  // The head at the bottom: ears down, eyes shut, a tiny snub nose, a smile.
  c.ell(8 + sway, 18, 3.6, 3, '(', '(', '&');
  // Long ears, hanging down and out.
  [[1, 0], [-1, 15]].forEach(([d, o]) => {
    const ex = (x) => (d > 0 ? x : o - x) + sway;
    [[4, 19], [5, 19], [3, 20], [4, 20], [3, 21], [4, 21], [3, 22]].forEach(([x, y]) => c.px(ex(x), y, '&'));
    c.px(ex(4), 20, '('); c.px(ex(4), 21, '(');
  });
  c.px(5 + sway, 17, 'k'); c.px(6 + sway, 17, 'k'); c.px(10 + sway, 17, 'k'); c.px(11 + sway, 17, 'k');
  c.px(8 + sway, 19, 'n'); c.px(7 + sway, 20, 'k'); c.px(8 + sway, 20, 'k'); c.px(9 + sway, 20, 'k');
  c.outline();
  // The Zzz: a little Z that drifts up and fades (the later frames climb).
  const zs = [[11, 12, 'w'], [12, 8, '}'], [12, 5, '}']];
  const n = z + 1;
  zs.slice(0, n).forEach(([x, y, col], i) => {
    const yy = y - (z - i);
    c.rect(x, yy, 3, 1, col); c.px(x + 1, yy + 1, col); c.rect(x, yy + 2, 3, 1, col);
  });
  return c;
}
export const BF_BAT_SLEEPER_SPRITES = { a: done(batCv(0, 0)), b: done(batCv(1, 0)), c: done(batCv(2, 0)), d: done(batCv(1, 1)) };

// --- Frog children ---
// Little cave frogs, big eyes, a bit round. a: has a red ball it bounces. b:
// a saucepan for a helmet and a wooden sword (it has a crush on the Hero).
function frogKidCv(kind, frame = 0) {
  const c = new Cv(16, 18);
  const hop = frame === 1 ? 2 : 0;
  c.rect(3, 16 - hop, 3, 2, 'j'); c.rect(10, 16 - hop, 3, 2, 'j'); c.rect(2, 17 - hop, 1, 1, 'D'); c.rect(13, 17 - hop, 1, 1, 'D');
  c.ell(8, 12.5 - hop, 5.2, 4.4, kind === 'a' ? '^' : ']', kind === 'a' ? '}' : ']', kind === 'a' ? 'K' : 'q');
  c.rect(4, 13 - hop, 8, 1, kind === 'a' ? 'K' : 'q');
  c.ell(8, 7 - hop, 5.4, 3.6, 'j', 'N', 'D');
  c.ell(8, 10.2 - hop, 2.6, 1.3, 'Z');
  [[5, 4], [11, 4]].forEach(([x, y]) => { c.ell(x, y - hop, 2.4, 2.2, 'N'); c.rect(x - 1, y - hop, 2, 2, 'e'); c.px(x - 1, y - hop, 'w'); });
  c.px(3, 9 - hop, 'p'); c.px(13, 9 - hop, 'p');
  for (let x = 5; x <= 11; x++) c.px(x, 9 - hop + (x < 6 || x > 10 ? -1 : 0), 'k');
  if (kind === 'a') {
    // A red ball held up high in one hand; on the hop it's tossed off the palm.
    const ballY = frame === 1 ? 2.5 : 4.5 - hop;
    c.ell(3, 13 - hop, 1.8, 1.8, 'j');
    c.line(12, 12 - hop, 13, 8 - hop, 'j'); c.ell(13.5, 7.5 - hop, 1.6, 1.4, 'j', 'N', 'D');
    c.ell(13.5, ballY, 2, 2, ']', 'p', 'q'); c.px(13, ballY - 1, 'w');
  } else {
    // The saucepan helmet, and the sword.
    c.ell(8, 2.6 - hop, 4.6, 2, 's', 'S', 's'); c.rect(3, 3 - hop, 10, 1, 's'); c.px(13, 3 - hop, 'T'); c.px(14, 3 - hop, 'T'); c.px(2, 3 - hop, 'T');
    c.px(8, 0 - hop, 'T'); c.px(8, 1 - hop, 's');
    c.ell(13, 13 - hop, 1.8, 1.8, 'j'); c.ell(3, 13 - hop, 1.8, 1.8, 'j');
    c.line(14, 12 - hop, 14, 3 - hop - (frame === 1 ? 1 : 0), 'W'); c.px(14, 2 - hop, 'S'); c.rect(12, 11 - hop, 5, 1, 'T');
    c.px(14, 3 - hop, 'w');
  }
  return c.outline();
}
export const BF_FROG_KID_A_SPRITES = { a: done(frogKidCv('a', 0)), b: done(frogKidCv('a', 1)), c: done(frogKidCv('a', 0)), d: done(frogKidCv('a', 0)) };
export const BF_FROG_KID_B_SPRITES = { a: done(frogKidCv('b', 0)), b: done(frogKidCv('b', 0)), c: done(frogKidCv('b', 1)), d: done(frogKidCv('b', 0)) };

// --- The snail elder ---
// A very, very old snail: an enormous swirled shell, a long white beard, tiny
// round spectacles on his eyestalks, a cane. Slow. 22 wide, 20 tall.
function snailCv(wave = 0, blink = false) {
  const c = new Cv(22, 20);
  // The foot, a long low slug of a thing trailing slime.
  c.ell(10, 17.5, 10, 2.4, '+', '+', '=');
  c.px(0, 18, '='); c.px(1, 18, '=');
  c.rect(0, 19, 4, 1, 'L');
  // The shell, with its spiral.
  c.ell(12, 9.5, 8.2, 8, ')', ')', '-');
  for (let a = 0; a < 40; a++) {
    const t = a / 40;
    const r = 7.6 * (1 - t);
    const ang = t * Math.PI * 4.2;
    c.px(Math.round(12 + Math.cos(ang) * r), Math.round(9.5 + Math.sin(ang) * r), '-');
  }
  c.px(12, 9, '9'); c.px(11, 9, '9');
  c.px(7, 4, 'x'); c.px(8, 3, 'x'); c.px(6, 5, 'x');
  // The head, low, with a long white beard to the ground.
  c.ell(4, 13, 3.4, 4, '+', '+', '=');
  c.rect(2, 15, 5, 4, 'i'); c.rect(3, 19, 3, 1, 'i'); c.px(2, 16, 'I'); c.px(5, 17, 'I'); c.px(4, 18, 'I');
  c.px(5, 14, 'k'); c.px(6, 14, 'k'); c.px(3, 12, 'k'); c.px(3, 13, '+');
  // The eyestalks, in spectacles, one drifting.
  c.line(2, 10, 1 - wave, 5, '+'); c.line(5, 10, 6 + wave, 4, '+');
  [[1 - wave, 4], [6 + wave, 3]].forEach(([x, y]) => { c.ell(x, y, 1.8, 1.8, 'h'); c.px(x, y, blink ? 'k' : 'e'); c.px(x - 1, y - 1, 'w'); });
  c.px(3 - wave, 4, 'h'); c.px(4 - wave, 4, 'h');
  // A cane, held by a little arm.
  c.line(9, 12, 9, 19, 'X'); c.px(8, 11, 'X'); c.px(9, 11, 'X'); c.px(7, 11, 'X'); c.px(8, 12, '+');
  return c.outline();
}
export const BF_SNAIL_ELDER_SPRITES = { a: done(snailCv(0)), b: done(snailCv(1)), c: done(snailCv(1, true)), d: done(snailCv(0)) };

// --- The shrew who keeps the market stall ---
// A long-nosed, jumpy little shrew in a striped apron and a flat cap, a tray of
// toadstools and a ledger tucked under her arm. 16 wide, 21 tall.
function shrewCv({ twitch = 0, blink = false } = {}) {
  const c = new Cv(16, 21);
  c.rect(5, 18, 2, 3, ';'); c.rect(9, 18, 2, 3, ';'); c.rect(4, 20, 3, 1, 'T'); c.rect(9, 20, 3, 1, 'T');
  c.ell(8, 14, 5, 4.8, ';', ';', ':');
  // Striped apron.
  c.rect(4, 11, 8, 8, 'i');
  for (let x = 4; x < 12; x += 2) c.rect(x, 11, 1, 8, ']');
  c.rect(4, 11, 8, 1, 'I');
  // Head, a long pointed snout, big round ears.
  c.ell(8, 6.5, 4, 3.4, ';', ';', ':');
  c.ell(4, 4.2, 1.8, 1.8, ';'); c.px(4, 4, 'p'); c.ell(12, 4.2, 1.8, 1.8, ';'); c.px(12, 4, 'p');
  c.rect(8, 7 + twitch, 6, 3, ';'); c.px(14, 8 + twitch, 'n'); c.px(15, 8 + twitch, 'k');
  c.px(13, 9 + twitch, ':'); c.px(14, 10, 'S'); c.px(15, 10, 'S');
  if (blink) { c.px(6, 6, 'k'); c.px(7, 6, 'k'); } else { c.px(6, 6, 'e'); c.px(6, 5, 'k'); c.px(7, 5, 'k'); }
  // Flat cap.
  c.rect(4, 2, 7, 2, 'T'); c.rect(4, 4, 9, 1, 'T'); c.px(5, 2, 'B');
  // The tray: a plank with toadstools on it, held in front.
  c.rect(1, 14, 14, 2, 'W'); c.rect(1, 15, 14, 1, 'Y');
  [[3, 11], [7, 12], [12, 11]].forEach(([x, y], i) => { c.rect(x - 1, y, 3, 2, i === 1 ? 'u' : ']'); c.px(x, y, 'i'); c.px(x, y + 2, 'Z'); });
  c.ell(2, 15, 1.5, 1.5, ';'); c.ell(14, 15, 1.5, 1.5, ';');
  return c.outline();
}
export const BF_SHREW_STALLKEEPER_SPRITES = { a: done(shrewCv()), b: done(shrewCv({ twitch: 1 })), c: done(shrewCv({ blink: true })), d: done(shrewCv({ twitch: 1 })) };

// --- The cave cricket who keeps the stall in the Deep ---
// Grig: a lanky, humpbacked cave cricket with two long feelers that never
// stop testing the air, one big bent hind leg, a pack on her back far too
// tall for her (a rolled blanket, a kettle, a coil of rope), and a little
// lantern in her hand that she holds out to see your face. 16 wide, 22 tall.
// `feel` swings the feelers, `sway` the lantern, `blink` shuts the eyes.
function cricketCv({ feel = 0, blink = false, sway = 0 } = {}) {
  const c = new Cv(16, 22);
  // The pack, behind her right shoulder: a rolled blanket on top, a kettle.
  c.rect(9, 5, 6, 3, '1'); c.rect(9, 5, 6, 1, 'i'); c.px(11, 6, ']'); c.px(13, 6, '^');
  c.rect(10, 8, 5, 8, 'õ'); c.rect(14, 8, 1, 8, '2'); c.rect(10, 15, 5, 1, '2');
  c.rect(11, 10, 3, 2, 'S'); c.px(11, 10, 'i'); c.px(14, 10, 's'); c.px(12, 9, 's');
  c.line(10, 8, 10, 15, 'ô'); c.line(13, 12, 13, 15, 'B');
  // The big hind leg: up and back at the knee, down to the foot.
  c.line(10, 15, 14, 12, 'ô'); c.line(14, 12, 15, 17, 'ô'); c.rect(13, 18, 3, 1, 'ô'); c.line(15, 17, 15, 18, 'ó');
  // Body and legs.
  c.rect(4, 17, 1, 4, 'ô'); c.rect(8, 17, 1, 4, 'ô'); c.rect(3, 21, 3, 1, 'ô'); c.rect(7, 21, 3, 1, 'ô');
  c.ell(7, 14, 4.6, 4.4, 'ò', 'ó', 'ô');
  c.rect(4, 14, 7, 3, 'õ'); c.rect(4, 14, 7, 1, 'ó');
  // Strap across the chest.
  c.line(5, 10, 10, 15, 'B');
  // Head, a big round forehead, big eyes.
  c.ell(6.5, 7.5, 3.6, 3.3, 'ò', 'ó', 'ô');
  if (blink) { c.px(4, 8, 'k'); c.px(5, 8, 'k'); c.px(8, 8, 'k'); c.px(9, 8, 'k'); }
  else { c.rect(4, 7, 2, 2, 'e'); c.rect(8, 7, 2, 2, 'e'); c.px(4, 7, 'w'); c.px(8, 7, 'w'); }
  c.px(6, 10, 'k'); c.px(7, 10, 'k');
  // The feelers: long and curved, swinging.
  c.line(5, 5, 3 + feel, 2, 'ô'); c.line(3 + feel, 2, 1 + feel * 2, 0, 'ô');
  c.line(8, 5, 10 - feel, 2, 'ô'); c.line(10 - feel, 2, 12 - feel * 2, 0, 'ô');
  // The lantern in her front hand, held out to the left.
  c.line(4, 12, 2 + sway, 12, 'ô');
  c.rect(0 + sway, 12, 3, 1, 'T'); c.rect(0 + sway, 13, 3, 3, '_'); c.px(1 + sway, 14, '4'); c.rect(0 + sway, 16, 3, 1, 'T'); c.px(1 + sway, 11, 'T');
  return c.outline();
}
export const BF_GRIG_SPRITES = { a: done(cricketCv()), b: done(cricketCv({ feel: 1 })), c: done(cricketCv({ blink: true, sway: 1 })), d: done(cricketCv({ feel: 1, sway: 1 })) };

// --- The mole crowd ---
// Four moles' heads and shoulders, for a crowd to stand behind a rail and cheer:
// each is 16 wide and 14 tall; the frames are paws down, and paws up. The
// variants: a plain grey mole, one in a flat cap, one in a hard hat, one with
// a bow and a lantern.
function crowdCv(kind, up) {
  const c = new Cv(16, 14);
  const lift = up ? 1 : 0;
  const fur = kind === 'b' ? ['*', '&'] : ['a', 'A'];
  c.ell(8, 12, 7, 4, kind === 'c' ? 'i' : kind === 'd' ? 't' : kind === 'b' ? '8' : '^', null, null);
  c.rect(2, 11, 12, 3, kind === 'c' ? 'I' : kind === 'd' ? 'K' : kind === 'b' ? '9' : 'K');
  c.ell(8, 6.5 - lift, 5, 4.4, fur[0], fur[1], null);
  // Eyes squeezed shut and a wide open cheer when the paws are up.
  moleFace(c, 6 - lift, fur, { cheer: up });
  if (kind === 'b') { c.rect(3, 2 - lift, 10, 2, 'T'); c.ell(8, 2 - lift, 4, 1.6, 'T'); c.rect(2, 3 - lift, 5, 1, 'B'); }
  if (kind === 'c') { c.ell(8, 2.6 - lift, 4.6, 2.2, '8', '8', '9'); c.rect(2, 4 - lift, 12, 1, '9'); c.px(8, 1 - lift, '4'); c.px(8, 2 - lift, '4'); }
  if (kind === 'd') { c.px(2, 4 - lift, ']'); c.px(3, 3 - lift, ']'); c.px(3, 5 - lift, ']'); c.px(4, 4 - lift, 'q'); c.px(5, 4 - lift, ']'); c.px(6, 3 - lift, ']'); c.px(6, 5 - lift, ']'); }
  // Paws up in the air, claws spread.
  if (up) {
    c.ell(1.5, 5, 1.8, 2.2, 'P'); c.ell(14.5, 5, 1.8, 2.2, 'P'); c.px(0, 2, 'S'); c.px(2, 2, 'S'); c.px(13, 2, 'S'); c.px(15, 2, 'S'); c.line(2, 8, 4, 11, '^'); c.line(13, 8, 11, 11, '^');
  } else {
    c.ell(2, 12, 1.8, 1.8, 'P'); c.ell(14, 12, 1.8, 1.8, 'P');
    c.px(1, 10, 'S'); c.px(3, 10, 'S'); c.px(13, 10, 'S'); c.px(15, 10, 'S');
  }
  return c.outline();
}
export const BF_MOLE_CROWD_SPRITES = { a: done(crowdCv('a', false)), b: done(crowdCv('a', true)) };
export const BF_MOLE_CROWD_B_SPRITES = { a: done(crowdCv('b', true)), b: done(crowdCv('b', false)) };
export const BF_MOLE_CROWD_C_SPRITES = { a: done(crowdCv('c', false)), b: done(crowdCv('c', true)) };
export const BF_MOLE_CROWD_D_SPRITES = { a: done(crowdCv('d', true)), b: done(crowdCv('d', false)) };

// --- The newt guard ---
// A skinny newt in a helmet two sizes too big (it slips down over his eyes), a
// spear taller than the pole it's meant to be, a tabard in the king's red with
// a gold crown on it, an orange belly, a long tail. 16 wide, 26 tall.
function newtCv({ slip = 0, blink = false, dir = 'down' } = {}) {
  const c = new Cv(16, 26);
  const front = dir === 'down';
  // Spear, taller than him, the point glinting.
  c.rect(14, 3, 1, 23, 'X'); c.rect(14, 3, 1, 23, 'X'); c.rect(13, 0, 3, 4, 'S'); c.px(14, 0, 'w'); c.px(14, 1, 'S'); c.px(13, 3, 's'); c.px(15, 3, 's');
  c.px(14, 5, 'r'); c.px(15, 6, 'r'); c.px(13, 6, 'r');
  // Tail curling out behind.
  [[4, 24], [3, 24], [2, 23], [1, 22], [1, 21], [2, 20]].forEach(([x, y]) => c.px(x, y, '>'));
  // Legs and feet.
  c.rect(5, 21, 2, 4, '<'); c.rect(9, 21, 2, 4, '<'); c.rect(4, 24, 3, 2, '>'); c.rect(9, 24, 3, 2, '>');
  // Body: the king's tabard over a thin orange belly.
  c.ell(8, 16, 4, 5.4, '<', '<', '>');
  if (front) {
    c.ell(8, 16, 2.4, 4.4, '?', '?', '?');
    c.rect(5, 12, 6, 9, 'r'); c.rect(10, 12, 1, 9, 'R'); c.rect(5, 20, 6, 1, 'g');
    c.px(7, 15, 'g'); c.px(8, 15, 'g'); c.px(7, 16, 'g'); c.px(8, 16, 'g'); c.px(6, 14, 'g'); c.px(9, 14, 'g');
  } else {
    c.rect(5, 12, 6, 9, 'r'); c.rect(5, 20, 6, 1, 'g'); c.px(7, 15, 'g'); c.px(8, 15, 'g'); c.px(6, 14, 'g'); c.px(9, 14, 'g');
  }
  // Skinny arms, one gripping the spear.
  c.rect(3, 12, 2, 6, '<'); c.rect(11, 12, 3, 2, '<'); c.rect(13, 12, 2, 3, '<');
  // The head, narrow and flat, under the helmet.
  c.ell(8, 8.6, 3.6, 3, '<', '<', '>');
  if (front) {
    if (blink) { c.px(6, 9, 'k'); c.px(10, 9, 'k'); } else { c.px(6, 9, 'e'); c.px(10, 9, 'e'); c.px(5, 9, 'w'); c.px(9, 9, 'w'); }
    c.px(7, 11, 'k'); c.px(8, 11, 'k'); c.px(9, 11, 'k'); c.px(6, 10, '?'); c.px(10, 10, '?');
  }
  // The helmet: far too big, riding down over his brow (and lower when it slips).
  const sy = slip;
  c.ell(8, 4 + sy, 6.2, 3.6, '/', '}', '[');
  c.rect(1, 6 + sy, 14, 2, '[');
  c.rect(1, 6 + sy, 14, 1, '/');
  c.px(8, 0 + sy, 'r'); c.px(7, 1 + sy, 'r'); c.px(9, 1 + sy, 'r');
  c.px(5, 3 + sy, '}'); c.px(4, 4 + sy, '}');
  return c.outline();
}
export const BF_NEWT_GUARD_SPRITES = { a: done(newtCv()), b: done(newtCv({ slip: 1 })), c: done(newtCv({ slip: 2 })), d: done(newtCv({ slip: 1, blink: true })) };

Object.assign(BF_PROP_SPRITES, {
  bf_glowworm: done(glowwormCv(1)),
  bf_glowworm_back: done(glowwormCv(1, 'up')),
  bf_mole_miner_a: done(moleMinerCv('a')),
  bf_mole_miner_b: done(moleMinerCv('b')),
  bf_beetle_postman: done(beetleCv()),
  bf_toad_innkeeper: done(toadCv()),
  bf_bat_sleeper: done(batCv(0, 0)),
  bf_frog_kid_a: done(frogKidCv('a', 0)),
  bf_frog_kid_b: done(frogKidCv('b', 0)),
  bf_snail_elder: done(snailCv(0)),
  bf_shrew_stallkeeper: done(shrewCv()),
  bf_grig: done(cricketCv()),
  bf_mole_crowd: done(crowdCv('a', false)),
  bf_mole_crowd_b: done(crowdCv('b', false)),
  bf_mole_crowd_c: done(crowdCv('c', false)),
  bf_mole_crowd_d: done(crowdCv('d', false)),
  bf_newt_guard: done(newtCv()),
  bf_newt_guard_back: done(newtCv({ dir: 'up' })),
});

// --- Town life: a sweeper, a ball, chalk squares, party scraps ---
// The mole who sweeps the market (the broom swings one way, then the other),
// the red ball the kids kick about, hopscotch squares drawn in chalk, and the
// confetti and streamers left on the floor after a party. The floor ones lie
// flat (the room marks them `flat`) so people walk over them.
export const BF_MOLE_SWEEPER_SPRITES = { a: done(moleMinerCv('b', { broom: 0 })), b: done(moleMinerCv('b', { broom: 1 })), c: done(moleMinerCv('b', { broom: 1, blink: true })), d: done(moleMinerCv('b', { broom: 0 })) };
function ballCv(spin = 0) {
  const c = new Cv(6, 6);
  c.ell(2.5, 2.5, 2.3, 2.3, ']', 'p', 'q');
  c.px(spin ? 3 : 1, spin ? 3 : 1, 'w'); c.px(spin ? 1 : 3, spin ? 2 : 3, 'R');
  return c.outline();
}
export const BF_BALL_SPRITES = { a: done(ballCv(0)), b: done(ballCv(1)) };
function chalkCv(kind) {
  const c = new Cv(16, 16);
  const box = (x, y, w, h) => { c.rect(x, y, w, 1, 'c'); c.rect(x, y + h - 1, w, 1, 'c'); c.rect(x, y, 1, h, 'c'); c.rect(x + w - 1, y, 1, h, 'c'); };
  if (kind === 'a') { box(2, 1, 12, 14); c.px(5, 4, 'C'); c.px(6, 4, 'C'); c.px(6, 5, 'C'); c.px(6, 6, 'C'); c.px(5, 7, 'C'); c.px(6, 7, 'C'); }
  else if (kind === 'b') { box(0, 1, 8, 14); box(8, 1, 8, 14); c.px(3, 4, 'C'); c.px(4, 4, 'C'); c.px(4, 5, 'C'); c.px(3, 6, 'C'); c.px(4, 7, 'C'); c.px(11, 4, 'C'); c.px(12, 4, 'C'); c.px(11, 5, 'C'); c.px(12, 6, 'C'); c.px(11, 7, 'C'); }
  else { box(2, 1, 12, 14); c.line(5, 4, 10, 9, 'C'); c.line(10, 4, 5, 9, 'C'); }
  return c.rows();
}
const scatter = (spots) => { const c = new Cv(16, 16); spots.forEach(([x, y, col, h]) => { c.px(x, y, col); if (h) c.px(x + 1, y, col); }); return c.rows(); };
export const BF_STREAMER_SPRITES = {
  a: done({ rows: () => scatter([[1, 5, 'q', 1], [3, 6, 'q', 1], [5, 7, 'q'], [6, 8, 'g', 1], [8, 8, 'g', 1], [10, 7, 'g'], [11, 6, 'l', 1], [13, 5, 'l', 1], [2, 11, 'o', 1], [4, 12, 'o'], [8, 12, 'q', 1], [11, 11, 'q']]) }),
};
const confetti = (seed) => { const cols = ['q', 'g', 'l', 'o', '8', 'L', 'q']; const spots = []; let n = seed; for (let i = 0; i < 16; i++) { n = (n * 73 + 41) % 251; const x = n % 15; n = (n * 73 + 41) % 251; const y = 1 + (n % 14); spots.push([x, y, cols[i % cols.length], i % 4 === 0]); } return done({ rows: () => scatter(spots) }); };
Object.assign(BF_PROP_SPRITES, {
  bf_mole_sweeper: done(moleMinerCv('b', { broom: 0 })),
  bf_ball: done(ballCv(0)),
  bf_chalk_a: done({ rows: () => chalkCv('a') }),
  bf_chalk_b: done({ rows: () => chalkCv('b') }),
  bf_chalk_x: done({ rows: () => chalkCv('x') }),
  bf_confetti_a: confetti(7),
  bf_confetti_b: confetti(19),
  bf_streamer: BF_STREAMER_SPRITES.a,
});

// =====================================================================
// FACES, for the dialogue box
// =====================================================================
// In exactly the format of the portraits in portraits.js: 32x32, an idle face
// and a blinking one, and `expressions`, each a few changes to the idle face
// as [row, column, pixels]; `eyes` are the rows the eyes are on. Each face is
// drawn from a few settings (its eyes, brows, mouth and so on) and every
// expression is the same face with other settings, so they always match; the
// patches are worked out from the differences.

// The rows that differ between two faces.
const differingRows = (a, b) => a.map((row, i) => (row === b[i] ? -1 : i)).filter((i) => i >= 0);
// The patches that turn `base` into `rows`: one per row that changed, from the
// first changed column to the last.
function patchesFor(base, rows) {
  const out = [];
  rows.forEach((row, y) => {
    if (row === base[y]) return;
    let x0 = 0;
    while (row[x0] === base[y][x0]) x0++;
    let x1 = row.length - 1;
    while (row[x1] === base[y][x1]) x1--;
    out.push([y, x0, row.slice(x0, x1 + 1)]);
  });
  return out;
}
// Draw a face with `draw`, from `base` settings, and every expression as
// settings laid over the base. `closed` expressions have their eyes shut
// already (or covered), so they don't blink.
function makePortrait(palette, draw, base, expressions) {
  const idle = draw(base);
  const blink = draw({ ...base, blink: true });
  const out = {};
  for (const [name, settings] of Object.entries(expressions)) {
    const rows = draw({ ...base, ...settings });
    out[name] = { patches: patchesFor(idle, rows), ...(settings.closed ? { closed: true } : {}) };
  }
  return { palette, eyes: differingRows(idle, blink), expressions: out, idle, blink };
}
// A shape and its mirror image across the middle of a 32 wide face.
const mir = (x) => 31 - x;
function faceBoth(c, x, y, w, h, col) {
  c.rect(x, y, w, h, col);
  c.rect(mir(x) - w + 1, y, w, h, col);
}
function faceBothPx(c, x, y, col) {
  c.px(x, y, col);
  c.px(mir(x), y, col);
}

// --- Tuck ---
// The dormouse: huge round ears with pink insides, big glossy dark eyes, a pale
// muzzle with a tiny pink nose, a little red page's cap with a gold feather,
// and the royal collar of a tabard far too big for him, slipping off one
// shoulder.
const TUCK_PORTRAIT_PALETTE = {
  k: '#1a1020', // outline
  F: '#dda46a', // fur
  f: '#b27c4a', // fur in shadow
  "'": '#f2c690', // fur, lit
  '"': '#fff0d6', // whiskers, feather tip
  b: '#f6dfb4', // muzzle
  p: '#ea9c9c', // pink: ears and blush
  P: '#c9707c', // pink in shadow (inside the ears)
  e: '#1a1020', // eyes
  E: '#4a2a3c', // eyes, the lighter lower half
  w: '#ffffff', // eye shine
  n: '#d86a78', // nose
  r: '#b02a3c', // tabard, cap
  R: '#7e1a2e', // tabard in shadow
  g: '#f0c050', // gold
  G: '#bf8a26', // gold in shadow
  t: '#8fd0ff', // a tear
  s: '#d6efff', // sweat
  m: '#7a4a4a', // mouth
  o: '#5a2a36', // open mouth
};
function tuckFace(f) {
  const c = new Cv(32, 32);
  // The collar of the tabard, hanging off his shoulders: the left side has
  // slipped right down, showing a bare furry shoulder.
  for (let y = 25; y < 32; y++) {
    const half = 8 + (y - 25) * 2.6;
    for (let x = Math.round(16 - half); x < Math.round(16 + half); x++) c.px(x, y, x > 20 + (y - 25) ? 'R' : 'r');
  }
  c.rect(11, 25, 10, 1, 'g'); c.line(10, 25, 4, 29, 'g'); c.line(21, 25, 27, 29, 'g'); c.line(10, 26, 5, 30, 'G'); c.line(21, 26, 26, 30, 'G');
  c.rect(13, 28, 6, 1, 'g'); c.px(14, 27, 'g'); c.px(17, 27, 'g'); c.px(15, 26, 'g'); c.px(16, 26, 'g'); c.rect(14, 29, 4, 1, 'G');
  c.ell(5, 30, 3.5, 2.5, 'F', "'", 'f');
  c.rect(12, 24, 8, 2, 'F');
  // Ears: big and round, pink inside.
  const ears = f.ears ?? 'up';
  const e = { up: [6, 8, 5.2], down: [5, 12, 4.8], perk: [6, 6, 5.4], flat: [6, 10, 4.4] }[ears];
  [[e[0], e[1]], [mir(e[0]), e[1]]].forEach(([x, y]) => {
    c.ell(x, y, e[2], e[2], 'F', "'", 'f');
    c.ell(x, y + 0.6, e[2] - 1.9, e[2] - 1.7, 'p', 'p', 'P');
  });
  // Head, cheek fluff, muzzle.
  c.ell(15.5, 15.5, 10.8, 9.2, 'F', "'", 'f');
  c.ell(5.5, 20, 2.4, 2.2, 'F'); c.ell(25.5, 20, 2.4, 2.2, 'F');
  c.ell(15.5, 20.6, 5.2, 3.8, 'b');
  // The cap, tipped over to one side, a gold band and a drooping feather.
  c.ell(15, 7.2, 6.6, 3.6, 'r', 'r', 'R');
  c.rect(9, 9, 13, 2, 'g'); c.rect(10, 11, 11, 1, 'G'); c.px(9, 10, 'G'); c.px(21, 10, 'g');
  c.line(19, 5, 24, 1, 'g'); c.line(20, 6, 25, 2, 'g'); c.line(25, 2, 27, 3, '"'); c.px(26, 1, '"'); c.px(24, 2, 'G');
  // Whiskers.
  [[4, 21], [3, 22], [2, 21], [27, 21], [28, 22], [29, 21]].forEach(([x, y]) => c.px(x, y, '"'));
  // Eyes: huge, glossy, with a big shine and a small one.
  const look = f.look ?? 0;
  const y = f.eyeY ?? 14;
  [8, 19].forEach((x, i) => {
    if (f.blink || f.eyes === 'shut') { c.rect(x, y + 3, 5, 1, 'k'); c.px(x - 1, y + 2, 'k'); c.px(x + 5, y + 2, 'k'); return; }
    if (f.eyes === 'happy') { c.px(x, y + 4, 'k'); c.px(x + 1, y + 3, 'k'); c.px(x + 2, y + 2, 'k'); c.px(x + 3, y + 3, 'k'); c.px(x + 4, y + 4, 'k'); c.px(x + 2, y + 3, 'k'); return; }
    if (f.eyes === 'wide') {
      c.rect(x - 1, y, 7, 6, 'w'); c.rect(x, y - 1, 5, 8, 'w'); c.rect(x + 1, y - 1, 3, 1, 'k');
      const ix = x + 1 + look;
      c.rect(ix, y + 1, 3, 4, 'e'); c.rect(ix + 1, y, 1, 6, 'e'); c.px(ix, y + 1, 'w');
      return;
    }
    c.rect(x, y, 5, 6, 'e'); c.rect(x + 1, y - 1, 3, 1, 'e'); c.rect(x + 1, y + 6, 3, 1, 'e');
    c.rect(x, y + 4, 5, 2, 'E'); c.rect(x + 1, y + 6, 3, 1, 'E');
    // The shine slides about with where he's looking.
    const sx = x + 1 + (look < 0 ? -1 : look > 0 ? 1 : 0);
    c.rect(sx, y + 1, 2, 2, 'w'); c.px(x + 3 + (look > 0 ? 1 : 0), y + 4, 'w');
    if (f.eyes === 'down') { c.rect(x - 1, y - 1, 7, 3, 'f'); c.rect(x - 1, y + 2, 7, 1, 'k'); }
    if (f.eyes === 'determined') { c.rect(x - 1, y - 1, 7, 2, 'f'); c.rect(x + (i ? 0 : 1), y + 1, 4, 1, 'f'); }
    if (f.tear && i === 0) { c.px(x + 1, y + 7, 't'); c.px(x + 1, y + 8, 't'); c.px(x, y + 9, 't'); c.px(x + 1, y + 9, 't'); }
  });
  // Brows.
  if (f.brow === 'worried') { [[7, 13], [8, 12], [9, 11], [10, 11]].forEach(([x, yy]) => faceBothPx(c, x, yy, 'f')); }
  if (f.brow === 'down') { [[7, 11], [8, 12], [9, 12], [10, 13]].forEach(([x, yy]) => faceBothPx(c, x, yy, 'f')); }
  if (f.brow === 'up') { [[8, 11], [9, 10], [10, 10], [11, 11]].forEach(([x, yy]) => faceBothPx(c, x, yy, 'f')); }
  // Nose and mouth.
  c.px(15, 19, 'n'); c.px(16, 19, 'n'); c.px(15, 20, 'n'); c.px(16, 20, 'n'); c.px(15, 19, 'w');
  const m = f.mouth ?? 'small';
  if (m === 'small') { c.px(14, 23, 'm'); c.px(15, 23, 'm'); c.px(16, 23, 'm'); c.px(17, 23, 'm'); c.px(15, 21, 'b'); c.px(16, 21, 'b'); }
  if (m === 'smile') { [[12, 22], [13, 23], [14, 24], [15, 24], [16, 24], [17, 24], [18, 23], [19, 22]].forEach(([x, yy]) => c.px(x, yy, 'm')); c.rect(15, 25, 2, 1, 'p'); }
  if (m === 'open') { c.ell(15.5, 24, 2.6, 2.4, 'o'); c.rect(14, 25, 3, 1, 'n'); }
  if (m === 'o') { c.ell(15.5, 24, 1.8, 2.2, 'o'); }
  if (m === 'frown') { [[12, 25], [13, 24], [14, 23], [15, 23], [16, 23], [17, 23], [18, 24], [19, 25]].forEach(([x, yy]) => c.px(x, yy, 'm')); }
  if (m === 'wobble') { [[13, 24], [14, 23], [15, 23], [16, 24], [17, 24], [18, 23], [19, 23]].forEach(([x, yy]) => c.px(x, yy, 'm')); }
  if (m === 'firm') { c.rect(13, 23, 6, 1, 'm'); c.px(12, 22, 'm'); c.px(19, 22, 'm'); }
  if (m === 'tiny') { c.px(15, 23, 'm'); c.px(16, 23, 'm'); }
  // Blush, sweat.
  if (f.blush) { c.ell(6.5, 20, 2.6, 1.6, 'p'); c.ell(25.5, 20, 2.6, 1.6, 'p'); }
  if (f.sweat) { c.px(28, 9, 's'); c.px(27, 10, 's'); c.px(28, 10, 's'); c.px(28, 11, 's'); c.px(29, 10, 's'); c.px(28, 12, 's'); }
  if (f.paw) {
    // A little paw up beside his mouth, fingers curled, and a whisper in the air.
    c.ell(23.5, 23, 3.6, 3, 'F', "'", 'f'); c.px(21, 21, 'f'); c.px(22, 20, 'f'); c.px(24, 20, 'f');
    c.rect(20, 23, 2, 1, 'f'); c.ell(26, 28, 2.6, 3, 'r');
    c.px(22, 23, 'f'); c.px(23, 22, 'F'); c.px(24, 22, 'F');
  }
  return c.outline('k').rows().map((row) => row);
}
const TUCK_EXPRESSIONS = {
  // Shy: looking off to the side, a little blush, a tiny mouth.
  shy: { eyes: 'down', look: -1, blush: true, mouth: 'tiny', ears: 'down' },
  smile: { eyes: 'happy', mouth: 'smile', blush: true },
  worried: { brow: 'worried', mouth: 'wobble', sweat: true, ears: 'down' },
  scared: { eyes: 'wide', brow: 'worried', mouth: 'open', sweat: true, ears: 'flat' },
  surprised: { eyes: 'wide', brow: 'up', mouth: 'o', ears: 'perk' },
  sad: { eyes: 'down', brow: 'worried', mouth: 'frown', tear: true, ears: 'down' },
  determined: { eyes: 'determined', brow: 'down', mouth: 'firm' },
  // Whisper: a paw by his mouth, eyes darting aside.
  whisper: { look: 1, paw: true, mouth: 'tiny', ears: 'perk' },
};
export const TUCK_PORTRAIT = makePortrait(TUCK_PORTRAIT_PALETTE, tuckFace, { eyes: 'normal', mouth: 'small', blush: true }, TUCK_EXPRESSIONS);

// --- King Peptup ---
// The face of a carved wooden marionette man: varnished honey wood (never white
// paint), painted arched brows, big bright painted eyes, a long pointed carved
// nose, a curled showman's moustache, rosy cheek dots, a wide painted smile on
// a hinged jaw (the slot lines run down from the corners to the jaw pins), carved
// locks of hair, and a gold crown with jewels. Royal blue doublet, a deep
// purple cape with ermine.
const RUMBOLD_PORTRAIT_PALETTE = {
  k: '#1a1020',
  // His face as the folk see it (every expression but jammed and alive).
  S: '#f0c49a', // skin
  s: '#cf9470', // skin in shadow
  T: '#fbdcb8', // skin, lit
  A: '#9a8676', // greying hair
  a: '#5e4c42', // hair in shadow, brows, moustache
  W: '#e8b068', // wood
  X: '#bf7e3c', // wood in shadow
  Y: '#7e4e24', // dark wood
  y: '#573318', // grain, joins, the dark slot
  H: '#f8d498', // varnish highlight
  d: '#2c2632', // black paint
  o: '#ee7e8c', // rosy cheeks
  O: '#d84a64', // cheeks, deeper
  q: '#c82838', // lips
  v: '#8c1424', // lips in shadow
  l: '#3a8cf0', // painted irises
  L: '#1b4aa8', // irises in shadow
  w: '#ffffff', // eye whites and shines
  g: '#f0c050', // gold
  G: '#bf8a26', // gold in shadow
  h: '#dfae48', // brass hinge pins
  r: '#ff4a5e', // jewel red
  B: '#3b5bd6', // royal blue
  b: '#26398f', // blue in shadow
  u: '#6a35a8', // deep purple cape
  U: '#42206e', // purple in shadow
  m: '#f4f1ea', // ermine
  M: '#2a2630', // ermine tails
  '`': '#fff6c8', // the light inside, core
  ',': '#ffd070', // the light inside
};
// The man Belowtown sees: skin, greying hair, a curled moustache, a crown.
// Nothing wooden about him until the fight (jammed and alive are the wood).
function kingFace(f) {
  const c = new Cv(32, 32);
  for (let y = 26; y < 32; y++) for (let x = 0; x < 32; x++) c.px(x, y, x < 2 || x > 29 ? 'U' : (x + y) % 7 === 0 ? 'U' : 'u');
  c.rect(10, 29, 12, 3, 'B'); c.rect(19, 29, 3, 3, 'b'); c.rect(15, 29, 1, 3, 'G');
  c.rect(5, 26, 22, 3, 'm'); c.rect(8, 29, 16, 1, 'm');
  [7, 11, 20, 24].forEach((x) => { c.px(x, 28, 'M'); c.px(x, 29, 'M'); });
  c.px(15, 28, 'g'); c.px(16, 28, 'g'); c.px(15, 29, 'h'); c.px(16, 29, 'h');
  // Neck, hair behind, the face, ears.
  c.rect(13, 22, 6, 4, 'S'); c.rect(17, 22, 2, 4, 's');
  c.ell(15.5, 12.5, 10.4, 9.4, 'A', null, 'a');
  c.ell(15.5, 15.2, 7.8, 8.6, 'S', 'T', 's');
  c.ell(6.8, 15, 1.4, 2.3, 'S'); c.ell(24.2, 15, 1.4, 2.3, 's');
  // Greying hair: a fringe under the crown, and the sides over the ears.
  c.rect(7, 5, 18, 3, 'A'); c.rect(7, 7, 3, 2, 'A'); c.rect(22, 7, 3, 2, 'a');
  c.ell(7.4, 10.5, 1.5, 3.6, 'A', 'A', 'a'); c.ell(23.6, 10.5, 1.5, 3.6, 'a');
  [[11, 6], [15, 6], [19, 6]].forEach(([x, y]) => c.px(x, y, 'a'));
  // Brows: arched, or down and in when he's cross, or one up.
  const archL = [[9, 9], [10, 8], [11, 8], [12, 8], [13, 9]];
  const crossL = [[9, 8], [10, 8], [11, 9], [12, 9], [13, 10]];
  const brows = f.brow === 'angry' ? crossL : archL;
  brows.forEach(([x, y]) => { c.px(x, y, 'a'); c.px(mir(x), y + (f.brow === 'one' ? -1 : 0), 'a'); });
  // Eyes: small and bright, a blue iris, a dark lid line.
  const eye = (x, mode, px = 1, py = 0) => {
    if (mode === 'shut') { c.rect(x, 12, 4, 1, 'd'); return; }
    if (mode === 'happy') { c.px(x, 12, 'd'); c.px(x + 1, 11, 'd'); c.px(x + 2, 11, 'd'); c.px(x + 3, 12, 'd'); return; }
    const top = mode === 'wide' ? 10 : 11;
    c.rect(x, top, 4, 13 - top, 'w');
    const ix = x + Math.min(2, px);
    c.rect(ix, 11 + Math.min(1, py), 2, 2, 'l'); c.px(ix + (px > 0 ? 1 : 0), 12, 'd');
    c.rect(x, top - 1, 4, 1, 'd');
    if (mode === 'half') { c.rect(x, 11, 4, 1, 's'); c.rect(x, 10, 4, 1, 'S'); c.rect(x, 11, 4, 1, 'd'); }
  };
  if (f.blink) { eye(9, 'shut'); eye(19, 'shut'); }
  else if (f.eyes === 'sly') { eye(9, 'half', 2, 1); eye(19, 'normal', 2, 1); }
  else { eye(9, f.eyes ?? 'normal', f.px ?? 1, f.py ?? 0); eye(19, f.eyes ?? 'normal', f.px ?? 1, f.py ?? 0); }
  // Nose.
  c.rect(15, 13, 2, 3, 'S'); c.rect(16, 13, 1, 3, 's'); c.rect(14, 16, 4, 1, 's'); c.px(15, 13, 'T');
  // Rosy cheeks.
  const cheek = f.cheek ?? 'o';
  c.ell(9.5, 17, 1.6, 1.1, cheek); c.ell(21.5, 17, 1.6, 1.1, cheek);
  // The moustache, ends curled up.
  c.rect(11, 18, 10, 1, 'a'); c.rect(12, 19, 8, 1, 'a');
  [[10, 18], [9, 17], [8, 16]].forEach(([x, y]) => { c.px(x, y, 'a'); c.px(mir(x), y, 'a'); });
  // The mouth: a closed smile, or open when he laughs or shouts.
  const open = Math.min(f.open ?? 0, 4);
  const lift = f.sly ? 1 : 0;
  if (open >= 2) {
    const h = Math.min(open - 1, 3);
    c.rect(13, 20, 6, 1, 'q'); c.rect(13, 21, 6, h, 'y'); c.rect(14, 21, 4, 1, 'w'); c.rect(13, 21 + h, 6, 1, 'q');
  } else if (f.mouth === 'flat') {
    c.rect(13, 21, 6, 1, 'v');
  } else {
    c.rect(14, 21, 4, 1, 'q'); c.px(13, 20, 'q'); c.px(18, 20 - lift, 'q'); c.px(15, 22, 's'); c.px(16, 22, 's');
  }
  if (f.lines) { c.px(1, 17, 'H'); c.px(0, 15, 'H'); c.px(30, 17, 'H'); c.px(31, 15, 'H'); }
  if (f.rays) { [[1, 4], [0, 8], [30, 4], [31, 8], [2, 1], [29, 1]].forEach(([x, y]) => c.px(x, y, 'g')); }
  // The crown, on a ring of dark.
  const crown = new Cv(32, 32);
  for (let i = 0; i < 6; i++) {
    const x0 = 4 + i * 4;
    const tall = i === 2 || i === 3 ? 0 : 1;
    [tall + 2, tall, tall, tall + 2].forEach((top, k) => {
      for (let y = top; y <= 4; y++) crown.px(x0 + k, y, y === 4 || k >= 2 ? 'G' : 'g');
    });
  }
  [[7, 3], [8, 3], [23, 3], [24, 3]].forEach(([x, y]) => crown.px(x, y, 'r'));
  [[15, 3], [16, 3]].forEach(([x, y]) => crown.px(x, y, 'B'));
  const ring = new Cv(32, 32);
  ring.g = crown.g.map((row) => [...row]);
  ring.outline('k');
  c.stamp(ring.rows(), 0, 0);
  return c.outline('k').rows();
}

function rumboldFace(f) {
  if (!f.askew && f.glow === undefined) return kingFace(f);
  const c = new Cv(32, 32);
  const hollow = f.glow !== undefined;
  const glow = f.glow ?? 0;
  const tilt = f.askew ? 1 : 0;
  // Shoulders: the purple cape, a blue doublet, an ermine collar and a gold clasp.
  for (let y = 26; y < 32; y++) for (let x = 0; x < 32; x++) c.px(x, y, x < 2 || x > 29 ? 'U' : (x + y) % 7 === 0 ? 'U' : 'u');
  c.rect(10, 29, 12, 3, 'B'); c.rect(19, 29, 3, 3, 'b'); c.rect(15, 29, 1, 3, 'G');
  c.rect(5, 26, 22, 3, 'm'); c.rect(8, 29, 16, 1, 'm');
  [7, 11, 20, 24].forEach((x) => { c.px(x, 28, 'M'); c.px(x, 29, 'M'); });
  c.px(15, 28, 'g'); c.px(16, 28, 'g'); c.px(15, 29, 'h'); c.px(16, 29, 'h');
  // The neck: a wooden post with a ring.
  c.rect(13, 24, 6, 4, 'X'); c.rect(13, 24, 1, 4, 'W'); c.rect(18, 24, 1, 4, 'Y'); c.rect(13, 26, 6, 1, 'y');
  if (hollow && glow >= 1) c.rect(13, 26, 6, 1, glow >= 3 ? '`' : ',');
  // Small carved ears.
  c.ell(3.2, 12.5 + tilt, 1.9, 3, 'W', 'H', 'X'); c.px(3, 12 + tilt, 'y');
  c.ell(28.8, 12.5, 1.9, 3, 'W', 'H', 'X'); c.px(28, 12, 'y');
  // The head: varnished wood, a big brow and a long narrow chin.
  c.ell(15.5, 15.5 + tilt, 8.8, 9.2, 'W', null, 'X');
  c.ell(15.5, 10 + tilt, 11.6, 7.6, 'W', 'H', 'X');
  // Varnish shine, grain and a few old knots.
  [[7, 7], [8, 7], [7, 8], [9, 6], [6, 11]].forEach(([x, y]) => c.px(x, y + tilt, 'H'));
  [[5, 12], [5, 13], [26, 14], [10, 22], [11, 23], [21, 23], [24, 17], [25, 17]].forEach(([x, y]) => c.px(x, y + tilt, 'X'));
  [[19, 6], [20, 6], [21, 6], [26, 11], [6, 19], [14, 24]].forEach(([x, y]) => c.px(x, y + tilt, 'Y'));
  // Carved locks of hair at the temples, under the crown.
  c.ell(5, 8.5 + tilt, 1.9, 3.6, 'Y', 'X', 'y'); c.ell(26, 8.5 + tilt, 1.9, 3.6, 'Y', 'X', 'y');
  // Big painted eyes (7x6): white, a blue iris, a black pupil, a strong shine.
  const eye = (x, y, mode, px = 1, py = 0) => {
    if (hollow) {
      c.rect(x, y + 1, 7, 4, 'd'); c.rect(x + 1, y, 5, 6, 'd');
      if (glow >= 3) { c.rect(x + 1, y + 1, 5, 4, ','); c.rect(x + 2, y + 2, 3, 2, '`'); }
      else if (glow >= 1) c.rect(x + 2, y + 2, 3, 2, ',');
      return;
    }
    if (mode === 'shut') { c.rect(x, y + 3, 7, 1, 'd'); c.px(x - 1, y + 2, 'd'); c.px(x + 7, y + 2, 'd'); return; }
    if (mode === 'happy') { [[0, 3], [1, 2], [2, 1], [3, 1], [4, 1], [5, 2], [6, 3]].forEach(([i, j]) => c.px(x + i, y + j, 'd')); return; }
    c.rect(x, y + 1, 7, 4, 'w'); c.rect(x + 1, y, 5, 6, 'w');
    const ix = x + 1 + px;
    const iy = y + 1 + py;
    c.rect(ix, iy, 4, 4, 'l'); c.rect(ix, iy + 3, 4, 1, 'L');
    c.rect(ix + 1, iy + 1, 2, 2, 'd');
    c.px(ix, iy, 'w'); c.px(ix + 1, iy, 'w'); c.px(ix, iy + 1, 'w');
    c.rect(x + 1, y - 1, 5, 1, 'd'); c.px(x, y, 'd'); c.px(x + 6, y, 'd');
    if (mode === 'half') { c.rect(x, y, 7, 2, 'X'); c.rect(x + 1, y + 2, 5, 1, 'd'); c.px(x, y + 1, 'd'); c.px(x + 6, y + 1, 'd'); }
    if (mode === 'wide') c.rect(x + 1, y - 2, 5, 1, 'd');
  };
  const ey = 9 + tilt;
  if (f.blink) { eye(7, ey, 'shut'); eye(18, ey, 'shut'); }
  else if (f.askew) { eye(7, ey - 1, 'normal', 0, 0); eye(18, ey + 2, 'normal', 2, 1); }
  else if (f.eyes === 'sly') { eye(7, ey, 'half', 2, 1); eye(18, ey, 'normal', 2, 1); }
  else { eye(7, ey, f.eyes ?? 'normal', f.px ?? 1, f.py ?? 0); eye(18, ey, f.eyes ?? 'normal', f.px ?? 1, f.py ?? 0); }
  // Painted brows: arched (slanted down and in when he is cross).
  const brow = f.brow;
  const archL = [[6, 7], [7, 6], [8, 6], [9, 6], [10, 6], [11, 7]];
  const crossL = [[6, 6], [7, 6], [8, 7], [9, 7], [10, 8], [11, 8]];
  const drawL = (pts, y0 = 0) => pts.forEach(([x, y]) => c.px(x, y + y0 + tilt, 'd'));
  const drawR = (pts, y0 = 0) => pts.forEach(([x, y]) => c.px(mir(x), y + y0 + tilt, 'd'));
  if (brow === 'angry') { drawL(crossL); drawR(crossL); }
  else if (brow === 'one') { drawL(archL); drawR(archL, -1); }
  else { drawL(archL); drawR(archL); }
  // The nose: a long, pointed carved peg, shaded on the far side and under the tip.
  c.rect(15, 10 + tilt, 2, 4, 'W'); c.rect(16, 10 + tilt, 1, 4, 'X'); c.rect(15, 10 + tilt, 1, 3, 'H');
  c.rect(14, 14 + tilt, 4, 3, 'W'); c.rect(17, 14 + tilt, 1, 3, 'X'); c.px(14, 14 + tilt, 'H'); c.px(15, 14 + tilt, 'H');
  c.rect(14, 17 + tilt, 4, 1, 'X'); c.px(17, 17 + tilt, 'Y'); c.px(15, 18 + tilt, 'Y'); c.px(16, 18 + tilt, 'Y');
  // Rosy round cheeks.
  const cheek = f.cheek ?? 'o';
  c.ell(5.8, 15.8 + tilt, 1.9, 1.8, cheek); c.ell(25.2, 15.8 + tilt, 1.9, 1.8, cheek);
  // The showman's moustache: thick, the ends swept out and curled up.
  for (let x = 9; x <= 14; x++) { c.px(x, 18 + tilt, 'd'); c.px(mir(x), 18 + tilt, 'd'); }
  [[7, 19], [8, 19], [9, 19], [10, 19], [6, 18], [5, 17], [5, 16]].forEach(([x, y]) => { c.px(x, y + tilt, 'd'); c.px(mir(x), y + tilt, 'd'); });
  // The mouth: a wide painted smile (lips curling up at the corners). The jaw
  // drops on its hinges and a dark slot opens (never a skull).
  const open = Math.min(f.open ?? 1, 4);
  const my = (x, y, ch) => c.px(x, y + tilt, ch);
  const lift = f.sly ? 1 : 0;
  const cav = (y, deep) => (hollow && glow >= 1 ? (glow >= 3 ? (y === 23 ? ',' : '`') : ',') : deep ? 'd' : 'y');
  my(8, 20, 'q'); my(23, 20 - lift, 'q'); my(9, 21, 'q'); my(10, 21, 'q'); my(21, 21 - lift, 'q'); my(22, 21 - lift, 'q');
  for (let x = 11; x <= 20; x++) my(x, 22, 'q');
  if (f.mouth === 'flat') { for (let x = 8; x <= 23; x++) my(x, 21, 'q'); }
  my(7, 19, 'v'); my(24, 19, 'v');
  if (open === 0) {
    for (let x = 13; x <= 18; x++) my(x, 23, 'v');
  } else {
    for (let y = 23; y <= 28; y++) for (let x = 10; x <= 21; x++) c.px(x, y + tilt, '.');
    for (let y = 23; y <= 22 + open; y++) for (let x = 11; x <= 20; x++) my(x, y, cav(y, y > 23));
    const ly = 23 + open;
    for (let x = 11; x <= 20; x++) my(x, ly, 'q');
    [7, 6, 4].forEach((hw, r) => {
      for (let x = Math.round(15.5 - hw); x <= Math.round(15.5 + hw - 1); x++) my(x, ly + 1 + r, x < 14 ? 'W' : 'X');
    });
    my(10, ly + 1, 'H'); my(11, ly + 1, 'H');
  }
  // The jaw slot lines, with a brass pin where the jaw hinges.
  for (let y = 21; y <= 25 + open; y++) { my(8, y, 'y'); my(23, y, 'y'); }
  my(7, 20, hollow && glow >= 1 ? ',' : 'h'); my(24, 20, hollow && glow >= 1 ? ',' : 'h');
  if (f.crack) { c.line(16, 5, 14, 10, 'y'); c.line(14, 10, 15, 12, 'y'); }
  if (f.lines) { c.px(1, 17, 'H'); c.px(0, 15, 'H'); c.px(30, 17, 'H'); c.px(31, 15, 'H'); }
  if (f.rays) { [[1, 4], [0, 8], [30, 4], [31, 8], [2, 1], [29, 1]].forEach(([x, y]) => c.px(x, y, 'g')); }
  // The crown: gold with jewels on a ring of dark, so it stands out from the throne.
  const dx = f.askew ? 2 : 0;
  const dy = f.askew ? 2 : 0;
  const crown = new Cv(32, 32);
  for (let i = 0; i < 6; i++) {
    const x0 = 4 + i * 4;
    const tall = i === 2 || i === 3 ? 0 : 1;
    [tall + 2, tall, tall, tall + 2].forEach((top, k) => {
      for (let y = top; y <= 4; y++) crown.px(x0 + k + dx, y + dy + (f.askew && x0 < 12 ? 1 : 0), y === 4 || k >= 2 ? 'G' : 'g');
    });
  }
  const cj = (x, y, ch) => crown.px(x + dx, y + dy + (f.askew && x < 12 ? 1 : 0), ch);
  [[7, 3], [8, 3], [23, 3], [24, 3]].forEach(([x, y]) => cj(x, y, 'r'));
  [[15, 3], [16, 3]].forEach(([x, y]) => cj(x, y, 'B'));
  const ring = new Cv(32, 32);
  ring.g = crown.g.map((row) => [...row]);
  ring.outline('k');
  c.stamp(ring.rows(), 0, 0);
  return c.outline('k').rows();
}
const RUMBOLD_EXPRESSIONS = {
  laughing: { eyes: 'happy', open: 4, cheek: 'O', closed: true },
  proud: { eyes: 'half', open: 0, brow: 'arch', px: 1, py: 1 },
  shouting: { eyes: 'wide', open: 6, brow: 'angry', cheek: 'O', rays: true },
  sly: { eyes: 'sly', open: 1, brow: 'one', sly: true },
  outraged: { eyes: 'wide', open: 4, brow: 'angry', cheek: 'O', lines: true, px: 0, py: 1 },
  // His jaw stuck half open, one eye askew, the crown slipped, a crack.
  jammed: { askew: true, open: 5, crack: true, closed: true },
  // Alive on his own: the light inside him showing through his eye holes and
  // his open jaw.
  alive: { glow: 3, open: 4, closed: true },
};
export const RUMBOLD_PORTRAIT = makePortrait(RUMBOLD_PORTRAIT_PALETTE, rumboldFace, { open: 0 }, RUMBOLD_EXPRESSIONS);

// --- Hobnail ---
// A grumpy old mole: velvet-grey, a big pink snout, beady eyes under a heavy
// scowl, singed whiskers, goggles pushed up on his forehead, a leather apron.
const HOBNAIL_PORTRAIT_PALETTE = {
  k: '#1a1020',
  a: '#4c465c', // fur
  A: '#6e6882', // fur, lit
  P: '#eaa8a0', // snout
  Q: '#c27a7a', // snout in shadow
  e: '#0e0a14', // eyes
  w: '#ffffff', // glints
  S: '#cfd6e4', // whiskers
  d: '#1c1620', // soot, burnt ends, brows
  h: '#d9a441', // goggles' brass
  z: '#2c3a48', // smoked glass
  l: '#b4e0ee', // a glint on it
  T: '#5a3a1e', // dark leather
  B: '#8c5a2a', // apron
  m: '#3a1a22', // mouth
  t: '#f4f1ea', // teeth
  s: '#8a8498', // steel
  u: '#8a6a6a', // a smudge
  R: '#8a7a64', // woolly shirt
  r: '#675848', // shirt in shadow
};
function hobnailFace(f) {
  const c = new Cv(32, 32);
  // Shoulders: a woolly shirt and the leather apron's bib and straps.
  for (let y = 26; y < 32; y++) for (let x = 2; x < 30; x++) c.px(x, y, (x + y) % 5 === 0 ? 'r' : x < 8 || x > 23 ? 'r' : 'R');
  c.rect(9, 27, 14, 5, 'B'); c.rect(9, 27, 14, 1, 'T'); c.line(9, 26, 6, 31, 'T'); c.line(22, 26, 25, 31, 'T');
  c.px(13, 29, 's'); c.px(14, 29, 's'); c.px(15, 30, 'S'); c.px(18, 29, 'd'); c.px(12, 31, 'd');
  c.ell(16, 25, 5, 2, 'A');
  // The head, wide and low, no neck.
  c.ell(16, 15.5, 12, 9.6, 'a', 'A', null);
  // Goggles, pushed up (or pulled down when he squints).
  const down = f.goggles;
  c.rect(4, down ? 9 : 5, 24, 1, 'T');
  const gy = down ? 13 : 5.2;
  [[9.5, gy], [22.5, gy]].forEach(([x, y]) => { c.ell(x, y, 4.6, 3.8, 'h'); c.ell(x, y, 3.2, 2.6, 'z'); c.px(x - 2, y - 1, 'l'); c.px(x - 1, y - 1, 'l'); });
  c.rect(14, gy - 1, 4, 2, 'h');
  // Brows: heavy, always scowling.
  const brow = f.brow ?? 'grumpy';
  if (!down) {
    if (brow === 'grumpy') { for (let i = 0; i < 6; i++) { c.px(7 + i, 10 + (i >> 1), 'd'); c.px(7 + i, 11 + (i >> 1), 'd'); c.px(24 - i, 10 + (i >> 1), 'd'); c.px(24 - i, 11 + (i >> 1), 'd'); } }
    if (brow === 'angry') { for (let i = 0; i < 6; i++) { c.rect(6 + i, 10 + i, 2, 2, 'd'); c.rect(24 - i, 10 + i, 2, 2, 'd'); } }
    if (brow === 'raised') { for (let i = 0; i < 6; i++) { c.rect(6 + i, 10 + (i >> 2), 2, 2, 'd'); c.rect(25 - i, 10 + (i >> 2), 2, 2, 'd'); } c.px(16, 9, 'd'); }
  }
  // Tiny beady eyes.
  const exs = [9, 21];
  if (!down) exs.forEach((x) => {
    if (f.blink || f.eyes === 'shut') c.rect(x, 15, 3, 1, 'd');
    else if (f.eyes === 'wide') { c.rect(x, 13, 4, 3, 'w'); c.rect(x + 1, 14, 2, 2, 'e'); }
    else { c.rect(x, 14, 3, 2, 'e'); c.px(x, 14, 'w'); }
  });
  // The snout: big, pink, with deep nostrils.
  c.ell(16, 20.6, 3.9, 4.6, 'P', 'P', 'Q');
  c.rect(13, 21, 2, 2, 'Q'); c.rect(17, 21, 2, 2, 'Q'); c.px(15, 20, 'A'); c.px(14, 19, 'A'); c.px(16, 24, 'Q');
  if (f.snarl) { c.px(12, 18, 'Q'); c.px(19, 18, 'Q'); c.px(11, 19, 'Q'); c.px(20, 19, 'Q'); }
  // Whiskers, singed: pale, black and curled at the tips.
  [[0, 0], [1, 2]].forEach(([dy], i) => { });
  [[12, 19, -1], [12, 22, -1], [19, 19, 1], [19, 22, 1]].forEach(([x, y, d]) => {
    for (let i = 0; i < 6; i++) c.px(x + d * i, y + (i > 3 ? (d < 0 ? 1 : 1) * (y === 19 ? -1 : 1) : 0), i > 3 ? 'd' : 'S');
  });
  // A soot smudge on the cheek.
  c.px(6, 19, 'd'); c.px(7, 20, 'd'); c.px(6, 21, 'u'); c.px(25, 17, 'u'); c.px(26, 18, 'd');
  // The mouth.
  const mouth = f.mouth ?? 'frown';
  if (mouth === 'frown') { c.px(12, 25, 'm'); c.rect(13, 24, 6, 1, 'm'); c.px(19, 25, 'm'); }
  if (mouth === 'grunt') { c.rect(13, 24, 6, 2, 'm'); c.px(14, 24, 't'); c.px(17, 24, 't'); c.rect(11, 24, 1, 1, 'm'); c.rect(20, 24, 1, 1, 'm'); }
  if (mouth === 'snarl') { c.rect(11, 23, 10, 3, 'm'); [12, 14, 17, 19].forEach((x) => c.rect(x, 23, 2, 1, 't')); [13, 18].forEach((x) => c.rect(x, 25, 2, 1, 't')); }
  if (mouth === 'flat') { c.rect(12, 24, 8, 1, 'm'); }
  if (mouth === 'smirk') { c.rect(12, 25, 6, 1, 'm'); c.px(18, 24, 'm'); c.px(19, 23, 'm'); }
  return c.outline('k').rows();
}
const HOBNAIL_EXPRESSIONS = {
  // A grunt: eyes shut, mouth open round, chewing it over.
  grunt: { eyes: 'shut', mouth: 'grunt', closed: true },
  // Squinting through the goggles pulled down.
  squint: { goggles: true, mouth: 'flat', closed: true },
  // Barely impressed: a brow up a hair, the corner of his mouth too.
  impressed: { brow: 'raised', eyes: 'wide', mouth: 'smirk' },
  angry: { brow: 'angry', mouth: 'snarl', snarl: true, eyes: 'wide' },
};
export const HOBNAIL_PORTRAIT = makePortrait(HOBNAIL_PORTRAIT_PALETTE, hobnailFace, { brow: 'grumpy', mouth: 'frown' }, HOBNAIL_EXPRESSIONS);

// --- Marigold ---
// A hare in a yellow sun bonnet with her long ears poking out through it,
// round bright eyes, buck teeth, and a blue dress and white apron.
const MARIGOLD_PORTRAIT_PALETTE = {
  k: '#1a1020',
  H: '#e8cfa6', // fur
  J: '#c49a68', // fur in shadow
  p: '#f2a0a0', // pink: ears and cheeks
  e: '#2a1a2a', // eyes
  w: '#ffffff', // shine and teeth
  n: '#d86a78', // nose
  u: '#f4d460', // bonnet
  U: '#d4a034', // bonnet in shadow
  x: '#fff0a0', // bonnet, lit
  q: '#a8485a', // mouth
  o: '#5a2a36', // open mouth
  t: '#79b8e2', // dress
  K: '#4f86b4', // dress in shadow
  i: '#f4f1ea', // apron
  I: '#cfc8bc', // apron in shadow
  y: '#ffe45a', // a lemon
  s: '#d6efff', // sweat
};
function marigoldFace(f) {
  const c = new Cv(32, 32);
  // Dress and apron.
  for (let y = 26; y < 32; y++) for (let x = Math.round(16 - 7 - (y - 26) * 1.8); x < Math.round(16 + 7 + (y - 26) * 1.8); x++) c.px(x, y, 't');
  c.rect(11, 27, 10, 5, 'i'); c.rect(11, 27, 1, 5, 'I'); c.line(11, 26, 9, 28, 'i'); c.line(20, 26, 22, 28, 'i');
  c.ell(16, 30, 2, 1.4, 'y'); c.px(15, 29, 'w');
  // The ears: long, up through the bonnet.
  const e = f.ears ?? 'up';
  const earUp = (x, bend) => {
    if (bend) {
      c.rect(x, 3, 4, 8, 'H'); c.rect(x + 1, 4, 2, 6, 'p'); c.rect(x - 2, 1, 5, 3, 'H'); c.rect(x - 1, 2, 3, 1, 'p'); c.rect(x - 3, 3, 2, 2, 'H');
    } else {
      c.rect(x, 0, 4, 11, 'H'); c.rect(x + 1, 1, 2, 9, 'p'); c.rect(x, 0, 1, 11, 'H'); c.px(x + 3, 0, 'J'); c.rect(x + 3, 2, 1, 8, 'J');
      c.rect(x + 1, 0, 2, 1, 'H');
    }
  };
  earUp(8, e === 'bent');
  earUp(20, false);
  // The head and the bonnet around it.
  c.ell(16, 17, 9.6, 8.2, 'H', 'H', 'J');
  c.ell(16, 11, 12.6, 6.4, 'u', 'x', 'U');
  c.rect(3, 11, 4, 12, 'u'); c.rect(25, 11, 4, 12, 'U'); c.rect(3, 11, 1, 12, 'x');
  c.rect(7, 22, 18, 1, 'U');
  // The face inside the brim.
  c.ell(16, 17.5, 8.4, 6, 'H', 'H', 'J');
  c.rect(7, 13, 18, 2, 'H');
  c.rect(7, 12, 18, 1, 'U');
  // A pale muzzle, so she reads as a hare and not a girl in a hat.
  c.ell(16, 21, 4.6, 3.4, 'i');
  // Bow under her chin.
  c.rect(12, 25, 8, 1, 'u'); c.rect(10, 24, 3, 3, 'u'); c.rect(19, 24, 3, 3, 'u'); c.rect(15, 24, 2, 3, 'U'); c.px(10, 26, 'U'); c.px(21, 26, 'U');
  // Eyes: big and round.
  const ey = f.eyeY ?? 14;
  [10, 19].forEach((x) => {
    if (f.blink || f.eyes === 'shut') { c.rect(x, ey + 3, 3, 1, 'e'); return; }
    if (f.eyes === 'happy') { c.px(x, ey + 3, 'e'); c.px(x + 1, ey + 2, 'e'); c.px(x + 2, ey + 3, 'e'); return; }
    if (f.eyes === 'wide') { c.ell(x + 1, ey + 2.5, 2.2, 2.8, 'w'); c.rect(x + 1, ey + 2, 2, 2, 'e'); return; }
    c.rect(x, ey, 3, 5, 'e'); c.rect(x + 1, ey - 1, 1, 1, 'e'); c.rect(x + 1, ey + 5, 1, 1, 'e');
    c.px(x, ey + 1, 'w'); c.px(x + 1, ey + 1, 'w'); c.px(x, ey + 2, 'w'); c.px(x + 2, ey + 4, 'w');
  });
  // Brows.
  if (f.brow === 'up') { faceBothPx(c, 9, ey - 2, 'J'); faceBothPx(c, 10, ey - 3, 'J'); faceBothPx(c, 11, ey - 3, 'J'); faceBothPx(c, 12, ey - 2, 'J'); }
  if (f.brow === 'one') { [[9, ey - 2], [10, ey - 3], [11, ey - 3], [12, ey - 2]].forEach(([x, y]) => c.px(x, y, 'J')); [[19, ey - 1], [20, ey - 1], [21, ey - 1], [22, ey - 1]].forEach(([x, y]) => c.px(x, y, 'J')); }
  // Nose, teeth, mouth.
  c.rect(15, 18, 2, 2, 'n'); c.px(14, 18, 'n'); c.px(17, 18, 'n');
  const m = f.mouth ?? 'smile';
  // A hare's split lip: a little Y under the nose, two front teeth.
  const lip = () => { c.px(15, 20, 'q'); c.px(16, 20, 'q'); c.px(13, 21, 'q'); c.px(18, 21, 'q'); };
  if (m === 'smile') { lip(); c.rect(15, 21, 2, 2, 'w'); c.px(14, 22, 'I'); c.px(17, 22, 'I'); c.px(15, 23, 'I'); c.px(16, 23, 'I'); }
  if (m === 'open') { c.ell(16, 22.5, 3.2, 2.4, 'o'); c.rect(15, 21, 2, 2, 'w'); c.rect(15, 24, 2, 1, 'n'); c.px(13, 21, 'q'); c.px(18, 21, 'q'); c.px(12, 20, 'q'); c.px(19, 20, 'q'); }
  if (m === 'o') { c.ell(16, 23, 2, 2.4, 'o'); c.rect(15, 21, 2, 1, 'w'); }
  if (m === 'hm') { c.px(15, 20, 'q'); c.px(16, 20, 'q'); c.rect(13, 22, 4, 1, 'q'); c.px(17, 21, 'q'); c.px(18, 20, 'q'); c.rect(15, 21, 2, 1, 'w'); }
  if (f.blush !== false) { c.ell(7, 20, 2.4, 1.5, 'p'); c.ell(25, 20, 2.4, 1.5, 'p'); }
  if (f.sweat) { c.px(28, 12, 's'); c.px(27, 13, 's'); c.px(28, 13, 's'); c.px(28, 14, 's'); }
  return c.outline('k').rows();
}
const MARIGOLD_EXPRESSIONS = {
  chatty: { mouth: 'open', brow: 'up' },
  puzzled: { mouth: 'hm', brow: 'one', ears: 'bent', blush: false },
  startled: { eyes: 'wide', mouth: 'o', brow: 'up', sweat: true, blush: false },
};
export const MARIGOLD_PORTRAIT = makePortrait(MARIGOLD_PORTRAIT_PALETTE, marigoldFace, { mouth: 'smile', eyes: 'normal' }, MARIGOLD_EXPRESSIONS);

// --- Ferryman Gubb ---
// An old cave frog: wide, pale and kind, heavy-lidded eyes on top of his head,
// bushy white brows, a mouth right across his face and a throat sac that swells
// when he sings, over an oatmeal smock.
const GUBB_PORTRAIT_PALETTE = {
  k: '#1a1020',
  j: '#8aa874', // skin
  N: '#b6cf98', // skin, lit
  D: '#587350', // skin in shadow
  Z: '#e6e8bc', // belly and throat
  e: '#1a1020', // eyes
  w: '#ffffff', // glints
  i: '#f4f1ea', // white brows
  m: '#3a2a2a', // mouth line
  o: '#5a2a36', // open mouth
  q: '#c8506a', // tongue
  '1': '#cdb98a', // smock
  '2': '#a28c62', // smock in shadow
  '3': '#6a4a2a', // rope
  d: '#f0c050', // a sung note
};
function gubbFace(f) {
  const c = new Cv(32, 32);
  // The smock, and a rope round the collar.
  for (let y = 27; y < 32; y++) for (let x = 3; x < 29; x++) c.px(x, y, x > 22 ? '2' : '1');
  c.rect(10, 27, 12, 1, '3'); c.px(9, 28, '3'); c.px(22, 28, '3'); c.px(15, 28, '3'); c.px(16, 29, '3'); c.px(20, 30, '2');
  // The throat sac.
  const sing = f.sac;
  c.ell(16, sing ? 26 : 25, sing ? 7 : 5, sing ? 4.4 : 3, 'Z', 'Z', 'N');
  // The head: wide and flat.
  c.ell(16, 17, 13.4, 8.2, 'j', 'N', 'D');
  // Eye bulges on top.
  const eyeBulge = (x) => {
    c.ell(x, 9, 4.6, 4.4, 'N', 'N', 'j');
    const shut = f.blink || f.eyes === 'shut';
    if (shut) { c.rect(x - 3, 10, 7, 1, 'D'); c.rect(x - 3, 11, 7, 1, 'D'); return; }
    if (f.eyes === 'happy') { c.px(x - 2, 10, 'k'); c.px(x - 1, 9, 'k'); c.px(x, 9, 'k'); c.px(x + 1, 9, 'k'); c.px(x + 2, 10, 'k'); return; }
    c.rect(x - 1, 8, 3, 3, 'e'); c.px(x - 1, 8, 'w');
    // Heavy lids: how far down they come.
    const lid = f.lid ?? 2;
    for (let y = 5; y < 5 + lid; y++) c.rect(x - 4, y, 9, 1, 'j');
    c.rect(x - 4, 5 + lid, 9, 1, 'D');
  };
  eyeBulge(9); eyeBulge(22);
  // Bushy white brows over them.
  const bd = f.brow === 'low' ? 1 : 0;
  c.rect(4, 3 + bd, 8, 1, 'i'); c.rect(5, 2 + bd, 5, 1, 'i'); c.rect(19, 3 + bd, 8, 1, 'i'); c.rect(21, 2 + bd, 5, 1, 'i'); c.px(3, 4 + bd, 'i'); c.px(27, 4 + bd, 'i');
  // Nostrils, a few warts.
  c.px(14, 14, 'D'); c.px(17, 14, 'D'); c.px(7, 16, 'D'); c.px(25, 15, 'D'); c.px(11, 13, 'D'); c.px(21, 12, 'D'); c.px(28, 18, 'D');
  // The mouth, right across his face.
  const m = f.mouth ?? 'smile';
  if (m === 'smile') { for (let x = 4; x <= 27; x++) c.px(x, 21 - Math.floor((((x - 15.5) / 12) ** 2) * 3.4), 'm'); c.px(3, 17, 'm'); c.px(28, 17, 'm'); }
  if (m === 'flat') { for (let x = 4; x <= 27; x++) c.px(x, 20, 'm'); }
  if (m === 'doze') { for (let x = 6; x <= 25; x++) c.px(x, 20, 'm'); c.ell(16, 21.6, 2.6, 1.6, 'o'); }
  if (m === 'sing') { c.ell(16, 21, 8, 3.8, 'o'); c.ell(16, 22.4, 4.4, 1.6, 'q'); c.rect(8, 18, 16, 1, 'm'); c.px(7, 19, 'm'); c.px(24, 19, 'm'); }
  if (f.note) { c.rect(28, 3, 1, 5, 'd'); c.rect(26, 7, 3, 2, 'd'); c.px(29, 3, 'd'); c.px(30, 4, 'd'); }
  if (f.zzz) { c.rect(26, 4, 3, 1, 'w'); c.px(27, 5, 'w'); c.rect(26, 6, 3, 1, 'w'); }
  return c.outline('k').rows();
}
const GUBB_EXPRESSIONS = {
  sleepy: { eyes: 'shut', mouth: 'doze', zzz: true, closed: true },
  singing: { eyes: 'happy', mouth: 'sing', sac: true, note: true, closed: true },
  solemn: { eyes: 'normal', lid: 1, mouth: 'flat', brow: 'low' },
};
export const GUBB_PORTRAIT = makePortrait(GUBB_PORTRAIT_PALETTE, gubbFace, { eyes: 'normal', mouth: 'smile', lid: 2 }, GUBB_EXPRESSIONS);

// How many tiles wide the big ones stand (see PROP_FOOTPRINTS in props.js).
export const BF_FOOTPRINTS = {
  bf_rumbold: 3,
  bf_rumbold_back: 3,
  bf_rumbold_gesture: 3,
  bf_rumbold_jammed: 3,
  bf_throne: 4,
  bf_throne_revealed: 4,
  bf_hobnail_forge: 2,
  bf_lemonade_stand: 2,
  bf_punt: 3,
  bf_snail_elder: 2,
};
