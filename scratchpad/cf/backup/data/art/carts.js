// The Diggings (Chapter 4): mine carts and the track they run on.
//
// Two kinds of art live here.
//
// 1. Props, drawn like the ones in props.js (rows of characters, standing on
//    their tile's bottom edge, centred), all in PROP_PALETTE's own colours:
//    the cart (empty, side-on and end-on), the rail lever (both ways), the
//    wooden barricade and what's left of it.
//
// 2. The track itself. Rails lie flat on the floor, so they aren't props:
//    rows of glyphs in a room's `rails` field say where they go (see
//    src/overworld/carts.js), and railTile() below paints one tile of it
//    from the arms it has (which of the tile's four edges it joins). Rails
//    are two steel strips on wooden sleepers; curves are true quarter-circle
//    arcs, so a cart rolling round one looks right. A switch shows the way
//    it's set by drawing the open route bright and the shut branch as a
//    dim, stopped-off stub, with a little arrow pointing the way out.

// --- Props --------------------------------------------------------------

export const CARTS_PROP_SPRITES = {
  // An empty mine cart seen side-on (it's rolling left or right). Wheels on
  // the rails, a flared iron bucket, a rusty band, a pale rim.
  mine_cart: [
    '................',
    '................',
    '................',
    '................',
    '.kkkkkkkkkkkkkk.',
    'kZZZZZZZZZZZZZZk',
    'kSSSSSSSSSSSSSSk',
    'kMMMMMMMMMMMMMMk',
    '.kMOMMMMMMMMOMk.',
    '.k[[[[[[[[[[[[k.',
    '.kMMMMMMMMMMMMk.',
    '.kOOOOOOOOOOOOk.',
    '..kkkkkkkkkkkk..',
    '..kSMk.kkkkSMk..',
    '..kMOk.kSMkMOk..',
    '...kk...kk.kk...',
  ],

  // The same cart end-on (it's rolling up or down the screen): you see the
  // one end of the bucket and a wheel poking out each side.
  mine_cart_v: [
    '................',
    '................',
    '................',
    '..kkkkkkkkkkkk..',
    '.kZZZZZZZZZZZZk.',
    '.kSSSSSSSSSSSSk.',
    '.kMMMMMMMMMMMMk.',
    '.kMMOMMMMMMOMMk.',
    '.k[[[[[[[[[[[[k.',
    '.kMMMMMMMMMMMMk.',
    '.kOOOOOOOOOOOOk.',
    '..kkkkkkkkkkkk..',
    'kSMk........kSMk',
    'kMOk........kMOk',
    '.kk..........kk.',
    '................',
  ],

  // A track switch's lever, the way it sits when the switch is "off": a
  // stand with a red-knobbed arm leaning left. (Pull it, Z, and it's `_on`.)
  rail_lever: [
    '................',
    '................',
    '.kkk............',
    'k343k...........',
    'k333k...........',
    '.kUk............',
    '..kSk...........',
    '...kSk..........',
    '....kSk...kkk...',
    '.....kSkkkMMMk..',
    '......kZkMOOOk..',
    '......kMkkkkkk..',
    '.....kkMkkkkk...',
    '..kkkMMMMMMMkk..',
    '..kMMMOOOOOOMk..',
    '...kkkkkkkkkk...',
  ],

  // ...and pulled over: the arm leaning right.
  rail_lever_on: [
    '................',
    '................',
    '............kkk.',
    '...........k343k',
    '...........k333k',
    '............kUk.',
    '...........kSk..',
    '..........kSk...',
    '...kkk...kSk....',
    '..kMMMkkkSk.....',
    '..kOOOMkZk......',
    '..kkkkkkMk......',
    '...kkkkkMkk.....',
    '..kkMMMMMMMkkk..',
    '..kMOOOOOOMMMk..',
    '...kkkkkkkkkk...',
  ],

  // A wooden barricade nailed across the track: two posts, three planks and
  // a brace. A cart sent down the line on its own goes straight through it.
  barricade: [
    '................',
    '.kkk........kkk.',
    '.klk........klk.',
    '.klkkkkkkkkkklk.',
    '.klwwwwwwwwwwlk.',
    '.klbbbbbbbbbblk.',
    '.klkkkkkkkkkklk.',
    '.klkL......kLlk.',
    '.klkkkkkkkkkklk.',
    '.klwwwwwwwwwwlk.',
    '.klbbbbbbbbbblk.',
    '.klkkkkkkkkkklk.',
    '.klLvvvvvvvvLlk.',
    '.klkkkkkkkkkklk.',
    '.kLk........kLk.',
    '.kkk........kkk.',
  ],

  // What's left of it: planks and splinters on the floor. You can walk over it.
  barricade_smashed: [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '..........kk....',
    '..kk.....kwwk...',
    '.kwwkk...kbbk...',
    '.kbbwwk..kkk.kk.',
    '..kkkbbk...kwwk.',
    '...kk.kkk..kbbk.',
    '.kLk..kvk...kk..',
    '.kkk..kkk.......',
  ],
};

// How many rows at the top of a cart sprite are its far side and inside: when
// someone rides, they're drawn between those rows and the near wall.
export const CART_BACK_ROWS = { mine_cart: 6, mine_cart_v: 5 };

// --- Particles (src/overworld/carts.js draws these) ---------------------

export const CART_FX_COLORS = {
  y: '#ffe66e', // a spark
  o: '#ff9a2e', // a spark, cooling
  r: '#d8501e', // an ember
  g: '#8a8296', // dust
  d: '#5a5468', // dust, darker
  w: '#c08a4e', // a plank splinter
  l: '#8a5a32', // a plank splinter, dark
};

export const CART_FX_SPRITES = {
  spark_a: ['y'],
  spark_b: ['o'],
  spark_c: ['r'],
  dust_a: ['.g.', 'ggg', '.g.'],
  dust_b: ['gd', 'dg'],
  splinter_a: ['ww', 'wl'],
  splinter_b: ['wlw'],
};

// --- The track ----------------------------------------------------------

// The track's colours.
const RAIL = {
  steelLight: [200, 208, 226],
  steel: [150, 158, 178],
  steelDark: [92, 96, 116],
  tie: [107, 74, 42],
  tieLight: [138, 94, 52],
  dimSteel: [84, 80, 100],
  dimSteelDark: [60, 56, 74],
  dimTie: [66, 50, 38],
  beam: [90, 58, 30],
  hazard: [240, 192, 80],
  hazardDark: [42, 38, 48],
  arrow: [255, 214, 102],
  arrowEdge: [18, 12, 28],
};

const ARM_EDGE = { L: [0, 8], R: [16, 8], U: [8, 0], D: [8, 16] };
const OPPOSITE = { L: 'R', R: 'L', U: 'D', D: 'U' };

// Straight rails sit at 4-5 and 10-11 across the tile (centre-line at 8), and
// sleepers every four pixels, so tiles join up with no seams.
const isRailOffset = (v) => (v >= 4 && v <= 5) || (v >= 10 && v <= 11);
const isTieOffset = (v) => v >= 3 && v <= 12;

// The centre-lines are quarter circles of radius 8 about a tile corner; the
// rails are at radius 4-6 and 10-12 from it, the sleepers radial lines.
const TIE_ANGLES = [Math.PI / 12, Math.PI / 4, (5 * Math.PI) / 12];

// What one pixel of a route is: 0 nothing, 1 sleeper, 2 near rail, 3 far rail.
// `route` is [armA, armB] (a curve or a straight); `reach` shortens a straight
// that stops (a dead-end stub): how many pixels from the `from` edge it runs.
function routePixel(route, x, y, reach) {
  const [a, b] = route;
  const px = x + 0.5;
  const py = y + 0.5;
  if (OPPOSITE[a] === b) {
    const horizontal = a === 'L' || a === 'R';
    const along = horizontal ? x : y;
    const across = horizontal ? y : x;
    if (reach != null) {
      const from = reach.from;
      const dist = from === 'L' || from === 'U' ? along : 15 - along;
      if (dist > reach.length) return 0;
    }
    if (isRailOffset(across)) return across <= 5 ? 2 : 3;
    if (isTieOffset(across) && along % 4 >= 1 && along % 4 <= 2) return 1;
    return 0;
  }
  const kx = a === 'R' || b === 'R' ? 16 : 0;
  const ky = a === 'D' || b === 'D' ? 16 : 0;
  const dx = Math.abs(px - kx);
  const dy = Math.abs(py - ky);
  const d = Math.hypot(dx, dy);
  if ((d >= 4 && d < 6) || (d >= 10 && d < 12)) return d < 8 ? 2 : 3;
  if (d >= 3 && d <= 13) {
    // The angle from the horizontal edge, 0 to 90 degrees.
    const angle = Math.atan2(dy, dx);
    if (TIE_ANGLES.some((t) => Math.abs(angle - t) * d < 1)) return 1;
  }
  return 0;
}

// Paints one tile of track on a 16x16 canvas.
//   arms:   which edges the tile joins, e.g. 'LR', 'LD', 'LRD' (a junction)
//   route:  for a junction, the [from, to] pair that's open right now
//   stub:   a dead end: the one arm runs to a buffer stop
//   arrow:  for a switchable junction, the arm an arrow points out of
export function railTile({ arms, route = null, stub = false, arrow = null }) {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(16, 16);
  const put = (x, y, [r, g, b]) => {
    const i = (y * 16 + x) * 4;
    image.data[i] = r;
    image.data[i + 1] = g;
    image.data[i + 2] = b;
    image.data[i + 3] = 255;
  };
  const paint = (path, dim, reach = null) => {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const what = routePixel(path, x, y, reach);
        if (!what) continue;
        if (what === 1) put(x, y, dim ? RAIL.dimTie : ((x + y) % 3 ? RAIL.tie : RAIL.tieLight));
        else put(x, y, dim ? (what === 2 ? RAIL.dimSteel : RAIL.dimSteelDark) : (what === 2 ? RAIL.steelLight : RAIL.steel));
      }
    }
  };
  const underline = (path) => {
    // A darker line under each rail, so they stand off the sleepers.
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if (routePixel(path, x, y, null) !== 3) continue;
        if (routePixel(path, x, y, null) === 3 && !(x < 15 && routePixel(path, x + 1, y, null) === 3 && y < 15 && routePixel(path, x, y + 1, null) === 3)) {
          put(x, y, RAIL.steelDark);
        }
      }
    }
  };
  if (stub) {
    const arm = arms[0];
    const other = OPPOSITE[arm];
    paint([arm, other], false, { from: arm, length: 13 });
    // The buffer stop, across the end of the line.
    const along = (i) => (arm === 'L' || arm === 'U' ? i : 15 - i);
    for (let i = 14; i <= 15; i++) {
      for (let j = 3; j <= 12; j++) {
        const [x, y] = arm === 'L' || arm === 'R' ? [along(i), j] : [j, along(i)];
        const stripe = Math.floor((j + 1) / 2) % 2 === 0;
        put(x, y, i === 14 ? (stripe ? RAIL.hazard : RAIL.hazardDark) : RAIL.beam);
      }
    }
  } else if (route) {
    // The open route bright; the other arm a dim stub, stopped short of the middle.
    const shut = arms.split('').find((a) => !route.includes(a));
    if (shut) paint([shut, OPPOSITE[shut]], true, { from: shut, length: 5 });
    paint(route, false);
    underline(route);
  } else if (arms.length === 4) {
    paint(['L', 'R'], false);
    paint(['U', 'D'], false);
  } else {
    paint([arms[0], arms[1]], false);
    underline([arms[0], arms[1]]);
  }
  ctx.putImageData(image, 0, 0);
  if (arrow) drawArrow(ctx, arrow);
  return canvas;
}

// A little arrow on the tile's sleepers, a bright triangle pointing out the way
// the cart will go (drawn pointing right, then turned to point toward the arm).
function drawArrow(ctx, toward) {
  const turns = { R: 0, D: 1, L: 2, U: 3 }[toward];
  const cells = [];
  for (let row = -3; row <= 3; row++) {
    for (let i = 0; i < 4 - Math.abs(row); i++) cells.push([-2 + i, row]);
  }
  ctx.save();
  ctx.translate(8, 8);
  ctx.rotate((turns * Math.PI) / 2);
  ctx.fillStyle = `rgb(${RAIL.arrowEdge.join(',')})`;
  for (const [x, y] of cells) {
    for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.fillRect(x + ox, y + oy, 1, 1);
  }
  ctx.fillStyle = `rgb(${RAIL.arrow.join(',')})`;
  for (const [x, y] of cells) ctx.fillRect(x, y, 1, 1);
  ctx.restore();
}
