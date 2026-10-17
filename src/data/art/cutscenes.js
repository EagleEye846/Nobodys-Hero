// Pictures for cutscenes (text/cutscenes/), painted in code as pixel art.
// Each one paints a PANEL_WIDTH x PANEL_HEIGHT picture with its top-left at
// (0, 0), in world pixels. `t` is seconds since the picture appeared, for
// flickering flames. A cutscene's text file names these in its [sections].
export const PANEL_WIDTH = 200;
export const PANEL_HEIGHT = 110;

const W = PANEL_WIDTH;
const H = PANEL_HEIGHT;

// Warm and faded, like an old storybook.
const C = {
  ink: '#0d0907',
  dark: '#1c1410',
  stone: '#3a2c22',
  stoneLit: '#5c4532',
  stoneHi: '#7a5c40',
  floor: '#2a1f18',
  wood: '#6b4423',
  cloth: '#a08668',
  stitch: '#5a4632',
  steel: '#c8c0b0',
  glow: '#ffcc66',
  flame: '#fff2c0',
  wax: '#e8d8b8',
  dust: '#6a5e54',
  robe: '#3a2a5e',
  robeHi: '#5a4890',
  pack: '#8a5a2a',
  bottle: '#5fc27a',
  cap: '#c0503a',
};

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// A soft, flickering circle of light. `seed` keeps neighbouring flames out of step.
function glow(ctx, x, y, radius, t, seed = 0) {
  const r = radius * (1 + Math.sin(t * 9 + seed * 2.3) * 0.04 + Math.sin(t * 23 + seed) * 0.03);
  ctx.fillStyle = C.glow;
  ctx.globalAlpha = 0.07;
  for (let ring = 4; ring >= 1; ring--) {
    ctx.beginPath();
    ctx.arc(x, y, (r * ring) / 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// A small lantern hanging by its hook from (x, y).
function lantern(ctx, x, y, t, seed = 0) {
  glow(ctx, x, y + 7, 24, t, seed);
  rect(ctx, x - 1, y, 2, 3, C.ink);
  rect(ctx, x - 4, y + 3, 8, 2, C.ink);
  rect(ctx, x - 3, y + 5, 6, 8, C.glow);
  rect(ctx, x - 3, y + 5, 1, 8, C.ink);
  rect(ctx, x + 2, y + 5, 1, 8, C.ink);
  const tall = Math.sin(t * 12 + seed * 5) > 0.3 ? 1 : 0;
  rect(ctx, x - 1, y + 8 - tall, 2, 4 + tall, C.flame);
  rect(ctx, x - 4, y + 13, 8, 2, C.ink);
}

function bricks(ctx, rows) {
  rect(ctx, 0, 0, W, H, C.dark);
  for (let row = 0; row < rows; row++) {
    for (let col = -1; col < W / 16 + 1; col++) {
      rect(ctx, col * 16 + (row % 2) * 8 + 1, row * 10 + 1, 14, 8, C.stone);
    }
  }
}

function floor(ctx, y) {
  rect(ctx, 0, y, W, H - y, C.floor);
  rect(ctx, 0, y, W, 1, C.stoneHi);
}

// A staircase climbing to a lit doorway, shared by `stair` and `stranger`.
function staircase(ctx, t) {
  rect(ctx, 0, 0, W, H, C.ink);
  glow(ctx, W / 2, 10, 54, t);
  rect(ctx, W / 2 - 12, 0, 24, 18, C.flame);
  for (let i = 0; i < 9; i++) {
    const width = 28 + i * 16;
    rect(ctx, W / 2 - width / 2, 18 + i * 10, width, 10, C.stone);
    rect(ctx, W / 2 - width / 2, 18 + i * 10, width, 2, C.stoneHi);
  }
}

export const PANELS = {
  // Nothing at all: just text on black.
  black() {},

  // A hall of pillars with lanterns hanging between them.
  ruins(ctx, t) {
    bricks(ctx, 9);
    for (let i = 0; i < 5; i++) {
      const x = 10 + i * 45;
      rect(ctx, x - 2, 16, 14, 4, C.stoneHi);
      rect(ctx, x, 20, 10, 70, C.stoneLit);
      rect(ctx, x, 20, 2, 70, C.stoneHi);
    }
    floor(ctx, 90);
    for (let i = 0; i < 4; i++) {
      const x = 37 + i * 45;
      rect(ctx, x, 0, 1, 30, C.ink);
      lantern(ctx, x, 30, t, i);
    }
  },

  // A carved stone tablet: a star, a stair, and lines of old writing.
  prophecy(ctx, t) {
    rect(ctx, 0, 0, W, H, C.dark);
    glow(ctx, W / 2, 50, 64, t);
    rect(ctx, 71, 12, 58, 4, C.stoneHi);
    rect(ctx, 66, 16, 68, 80, C.stoneHi);
    rect(ctx, 69, 18, 62, 78, C.stoneLit);
    // The star the Hero follows, and the stair they come down.
    rect(ctx, 99, 22, 2, 10, C.glow);
    rect(ctx, 95, 26, 10, 2, C.glow);
    for (let step = 0; step < 4; step++) rect(ctx, 88 + step * 6, 36 + step * 3, 6, 2, C.ink);
    [40, 52, 34, 48, 44, 30].forEach((width, i) => rect(ctx, W / 2 - width / 2, 54 + i * 6, width, 2, C.ink));
    floor(ctx, 96);
  },

  // Getting ready for the Hero: the training dummy, a weapon rack and Moss's pack.
  preparations(ctx, t) {
    bricks(ctx, 9);
    floor(ctx, 90);
    rect(ctx, 100, 0, 1, 12, C.ink);
    lantern(ctx, 100, 12, t);

    // Training dummy
    rect(ctx, 39, 60, 3, 30, C.wood);
    rect(ctx, 26, 46, 29, 4, C.cloth);
    rect(ctx, 33, 40, 15, 24, C.cloth);
    rect(ctx, 35, 27, 11, 12, C.cloth);
    for (let y = 42; y < 62; y += 4) rect(ctx, 40, y, 1, 2, C.stitch);
    rect(ctx, 37, 31, 2, 2, C.stitch);
    rect(ctx, 42, 31, 2, 2, C.stitch);

    // Weapon rack
    for (let i = 0; i < 4; i++) {
      rect(ctx, 95 + i * 7, 42, 2, 40, C.steel);
      rect(ctx, 93 + i * 7, 58, 6, 2, C.glow);
    }
    rect(ctx, 88, 52, 36, 3, C.wood);
    rect(ctx, 88, 80, 36, 3, C.wood);
    rect(ctx, 88, 52, 3, 38, C.wood);
    rect(ctx, 121, 52, 3, 38, C.wood);

    // Moss's pack, stuffed full
    rect(ctx, 146, 36, 5, 10, C.bottle);
    rect(ctx, 156, 40, 14, 6, C.glow);
    rect(ctx, 140, 46, 38, 44, C.pack);
    rect(ctx, 148, 46, 3, 44, C.ink);
    rect(ctx, 167, 46, 3, 44, C.ink);
    rect(ctx, 144, 62, 30, 2, C.ink);
  },

  // The Keeper on a ledge, holding a lantern high.
  beacon(ctx, t) {
    rect(ctx, 0, 0, W, H, C.dark);
    glow(ctx, 122, 26, 80, t);
    rect(ctx, 0, 80, W, 30, C.stone);
    rect(ctx, 0, 80, W, 2, C.stoneHi);
    for (let i = 0; i < 34; i++) {
      const width = 10 + Math.floor(i * 0.6);
      rect(ctx, 100 - width / 2, 46 + i, width, 1, i % 6 === 0 ? C.robeHi : C.robe);
    }
    rect(ctx, 94, 35, 12, 13, C.robe);
    rect(ctx, 94, 35, 12, 2, C.robeHi);
    rect(ctx, 96, 39, 8, 8, C.ink);
    rect(ctx, 97, 42, 1, 1, C.glow);
    rect(ctx, 102, 42, 1, 1, C.glow);
    // Arm raised, staff, and the lantern hanging from its crook.
    rect(ctx, 105, 34, 3, 16, C.robe);
    rect(ctx, 108, 16, 2, 64, C.wood);
    rect(ctx, 108, 16, 14, 2, C.wood);
    lantern(ctx, 121, 18, t);
  },

  // A century of waiting: a melted candle, dust, and tally marks on the wall.
  waiting(ctx, t) {
    bricks(ctx, 9);
    floor(ctx, 90);
    for (let group = 0; group < 14; group++) {
      const x = 92 + (group % 4) * 26;
      const y = 8 + Math.floor(group / 4) * 18;
      for (let i = 0; i < 4; i++) rect(ctx, x + i * 4, y, 1, 12, C.stoneHi);
      for (let k = 0; k < 16; k++) rect(ctx, x - 2 + k, y + 11 - Math.floor(k * 0.7), 1, 1, C.stoneHi);
    }
    // The candle, burned down to a stub.
    glow(ctx, 50, 66, 26, t);
    rect(ctx, 30, 88, 42, 3, C.wax);
    rect(ctx, 43, 74, 14, 15, C.wax);
    rect(ctx, 41, 78, 2, 8, C.wax);
    rect(ctx, 57, 76, 2, 11, C.wax);
    rect(ctx, 49, 70, 1, 4, C.ink);
    const tall = Math.sin(t * 11) > 0.4 ? 1 : 0;
    rect(ctx, 48, 65 - tall, 3, 5 + tall, C.flame);
    // Dust piling up in the corner.
    for (let i = 0; i < 6; i++) rect(ctx, 150 + i * 4, 90 - (6 - i) * 2, 50 - i * 4, (6 - i) * 2, C.dust);
  },

  // The staircase the Hero was meant to come down. Empty.
  stair(ctx, t) {
    staircase(ctx, t);
  },

  // The same staircase, with someone standing in the doorway.
  stranger(ctx, t) {
    staircase(ctx, t);
    rect(ctx, W / 2 - 2, 3, 4, 4, C.ink);
    rect(ctx, W / 2 - 3, 7, 6, 8, C.ink);
    rect(ctx, W / 2 - 3, 15, 2, 3, C.ink);
    rect(ctx, W / 2 + 1, 15, 2, 3, C.ink);
  },

  // Everyone in the Ruins at the foot of the stair, looking up at the figure
  // in the doorway, holding their breath.
  breath(ctx, t) {
    PANELS.stranger(ctx, t);
    // The doorway glimmers.
    glow(ctx, W / 2, 10, 22, t, 3);
    if (Math.sin(t * 3) > 0) {
      rect(ctx, W / 2 + 10, 2, 1, 5, C.flame);
      rect(ctx, W / 2 + 8, 4, 5, 1, C.flame);
    }
    rect(ctx, 0, 96, W, H - 96, C.floor);
    rect(ctx, 0, 96, W, 1, C.stoneHi);

    // Their eyes, all turned up to the doorway.
    const eyes = (x, y, gap, color = C.glow) => {
      rect(ctx, x, y, 1, 1, color);
      rect(ctx, x + gap, y, 1, 1, color);
    };

    // The Keeper, lantern on their staff.
    let x = 26;
    for (let i = 0; i < 22; i++) rect(ctx, x - 4 - i * 0.3, 86 + i, 8 + i * 0.6, 1, C.robe);
    rect(ctx, x - 6, 76, 12, 11, C.robe);
    rect(ctx, x - 6, 76, 12, 1, C.robeHi);
    rect(ctx, x - 4, 79, 8, 7, C.ink);
    eyes(x - 3, 80, 5);
    rect(ctx, x + 9, 68, 2, 42, C.wood);
    rect(ctx, x + 9, 68, 7, 2, C.wood);
    lantern(ctx, x + 15, 70, t, 1);

    // The training dummy.
    x = 62;
    rect(ctx, x - 1, 98, 3, 12, C.wood);
    rect(ctx, x - 13, 88, 27, 3, C.cloth);
    rect(ctx, x - 7, 84, 15, 15, C.cloth);
    rect(ctx, x - 5, 72, 11, 11, C.cloth);
    rect(ctx, x - 5, 72, 11, 1, C.wax);
    eyes(x - 3, 74, 5, C.stitch);
    rect(ctx, x - 1, 79, 3, 1, C.stitch);

    // A dust bunny, ears up.
    x = 90;
    rect(ctx, x - 4, 91, 2, 8, C.dust);
    rect(ctx, x + 3, 91, 2, 8, C.dust);
    rect(ctx, x - 6, 99, 13, 9, C.dust);
    rect(ctx, x - 7, 102, 15, 6, C.dust);
    eyes(x - 3, 101, 5, C.ink);

    // The lantern moth, hovering for a better look.
    x = 116;
    const y = 64 + Math.round(Math.sin(t * 4) * 2);
    const flap = Math.sin(t * 14) > 0 ? 7 : 4;
    rect(ctx, x - 1 - flap, y + 1, flap, 6, C.cloth);
    rect(ctx, x + 2, y + 1, flap, 6, C.cloth);
    rect(ctx, x - 1, y, 3, 9, C.stitch);
    eyes(x - 1, y + 1, 2);

    // Moss, pack and all.
    x = 148;
    rect(ctx, x - 12, 88, 24, 22, C.pack);
    rect(ctx, x - 8, 82, 16, 8, C.wax);
    rect(ctx, x - 14, 76, 28, 6, C.cap);
    rect(ctx, x - 10, 73, 20, 3, C.cap);
    rect(ctx, x - 8, 75, 3, 2, C.wax);
    rect(ctx, x + 5, 77, 3, 2, C.wax);
    eyes(x - 4, 84, 7, C.ink);

    // A waxling, flame flickering.
    x = 178;
    glow(ctx, x, 86, 12, t, 4);
    rect(ctx, x - 5, 92, 10, 18, C.wax);
    rect(ctx, x - 6, 94, 2, 6, C.wax);
    rect(ctx, x + 4, 96, 2, 7, C.wax);
    rect(ctx, x, 88, 1, 4, C.ink);
    rect(ctx, x - 1, 84 - (Math.sin(t * 13) > 0.3 ? 1 : 0), 3, 5, C.flame);
    eyes(x - 3, 96, 5, C.ink);
  },
};
