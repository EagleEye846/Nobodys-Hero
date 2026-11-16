// Soft edges for Chapter 3: the Pinefall, the Hushwood and Hollin, the Old
// Drains, the Lantern Marsh, Lasthome's gate and the Dead City. The same pass
// the coast and Chapter 4's caves use (tileBlend.js), with each region's own
// colours and its own little things lying about:
//
//  - the Pinefall and the Hushwood: the pale paths fray into the leaf litter
//    instead of stopping on a ruled line, red leaves wander out over the
//    path's edges, the litter lies in big soft drifts (redder where the leaves
//    have piled, darker where the loam shows), with roots, twigs, toadstools
//    and clumps of fallen leaves; the bramble hedges bulge past their squares;
//    the rock cliffs get a ragged overhang and a foot with stones fallen from
//    it; the streams have ragged banks;
//  - Hollin: the same litter and paths, and leaves drifted over the cobbles;
//  - the Old Drains: grime and wet patches on the walkways and the drowned
//    slabs, puddles, silt and weed, and a soft shadow along the brickwork
//    (the water's stone edges stay straight: they are channels);
//  - the Lantern Marsh: fen turf and bog ragged into each other (only a few
//    pixels, so the bog still shows where it is), the fen water's banks ragged,
//    sedge, cotton-grass and puddles about;
//  - the Dead City: grass creeping over the paving's edges, the paving stained
//    and cracked, with rubble and weeds lying about.
//
// Only the room's picture changes, painted once when the room is built: no
// tile's solidity or height, and none of the lighting, the mist or the dark.
// Indoors it does nothing. A room can opt out with `softEdges: false`.

const LEAVES = ['#c0283a', '#e0483e', '#8a1a2e', '#a8323a', '#ff7a4a'];
const LOAM_LEAVES = ['#6a2030', '#8a2a34', '#52202a', '#a8323a'];

const WOOD = {
  // Shared by the Pinefall and the Hushwood: which letters are which ground.
  kinds: { d: 'litter', y: 'path', ':': 'dirt', ',': 'turf', '~': 'water', q: 'earth' },
  standing: 'L&"T',
  onFloor: 'Z',
  walls: 'm',
  faces: 'M',
  tops: 'm',
  natural: 'MmKk',
  amplitude: { 'litter|path': 4, 'earth|litter': 5, 'dirt|litter': 5, 'dirt|path': 4 },
};

const LOOKS = {
  pinefall: {
    ...WOOD,
    patches: { litter: ['#4c1a2c', 0.4, '#12080e', 0.42], earth: ['#3e2a26', 0.3, '#140c0c', 0.4], dirt: ['#4e3830', 0.3, '#1e1210', 0.4] },
    p: {
      ground: ['#2a1420'], hi: '#d8bc9c', lo: '#a8886a', crack: '#7a5e48', speck: ['#9a7e64', '#e8d4b8', '#6a5040'],
      turf: ['#4f8a4a'], turfHi: '#6aa65c', turfLo: '#3b6d38', flowers: ['#f2e6c8', '#ffd25e'],
      water: '#1b2350', wave: '#2c3a78', foam: '#8a9ad8', lip: '#1a0c14', deep: '#141a40', troughs: '#141a40',
      shallow: '#2c3a78', shallowHi: '#4a5aa0', glint: '#8a9ad8', wetLine: '#3a1a26', underHi: '#4a5aa0',
      weed: ['#3a1222', '#5a1e30'], weedHi: '#c0283a', fleck: '#8a9ad8', driftwood: '#4a2e28',
      leaves: LEAVES, litterLo: '#1a0c14', root: '#3e2a2e', rootHi: '#5a3e40', cap: '#c84a4a', stem: '#d8ccb0',
      deepRock: '#2a2430', deepRock2: '#16121a', rockLo: '#443e4c', rim: '#857e8e', rock: ['#6a6372', '#736c7c', '#625b6a'],
    },
    lists: { litter: ['leaves', 'twig', 'root', 'leaves', 'toadstool', 'leaves'], path: ['pebble', 'leaf', 'pebble', 'leaf', 'twig'], earth: ['root', 'pebble', 'stone'], dirt: ['root', 'pebble', 'leaf', 'stone'] },
    chance: { litter: 0.42, path: 0.3, earth: 0.3, dirt: 0.32 },
    edgeScatter: [{ on: 'path', from: 'litter', colors: LEAVES, chance: [0.11, 0.07, 0.04, 0.022, 0.012] }],
    hedge: { letters: 'Z', faces: '', dark: '#12060c', mid: '#2c0e1a', light: '#c8303c', top: '#3a1222', topHi: '#a01e30', topLo: '#2c0e1a' },
  },
  hushwood: {
    ...WOOD,
    patches: { litter: ['#3e2228', 0.38, '#100a0c', 0.42], earth: ['#3e2a26', 0.3, '#120c0c', 0.42], dirt: ['#4e3830', 0.3, '#1e1210', 0.4] },
    p: {
      ground: ['#261a1e'], hi: '#d8bc9c', lo: '#a8886a', crack: '#5a4434', speck: ['#9a7e64', '#e8d4b8', '#5e5664'],
      turf: ['#4f8a4a'], turfHi: '#6aa65c', turfLo: '#3b6d38', flowers: ['#f2e6c8'],
      water: '#1b2350', wave: '#2c3a78', foam: '#8a9ad8', lip: '#140c0e', deep: '#141a40', troughs: '#141a40',
      shallow: '#2c3a78', shallowHi: '#4a5aa0', glint: '#8a9ad8', wetLine: '#32201e', underHi: '#4a5aa0',
      weed: ['#2c3a2a', '#3e5a3a'], weedHi: '#5a7a4a', fleck: '#8a9ad8', driftwood: '#4a2e28',
      leaves: LOAM_LEAVES, litterLo: '#140c0e', root: '#3e2a2e', rootHi: '#5a3e40', cap: '#e0d8c0', stem: '#b8ac90',
      deepRock: '#1e1612', deepRock2: '#0e0a08', rockLo: '#2e221c', rim: '#56423a', rock: ['#3a2a24', '#40302a', '#4a3830'],
      topRock: '#1e1612',
    },
    lists: { litter: ['leaves', 'root', 'toadstool', 'twig', 'leaves', 'toadstool'], path: ['pebble', 'leaf', 'pebble', 'twig'], earth: ['root', 'pebble', 'stone', 'twig'], dirt: ['root', 'pebble', 'leaf', 'stone'] },
    chance: { litter: 0.4, path: 0.28, earth: 0.32, dirt: 0.32 },
    edgeScatter: [{ on: 'path', from: 'litter', colors: LOAM_LEAVES, chance: [0.1, 0.06, 0.035, 0.02, 0.01] }],
    hedge: { letters: 'Z', faces: '', dark: '#12060c', mid: '#2c0e1a', light: '#c8303c', top: '#3a1222', topHi: '#a01e30', topLo: '#2c0e1a' },
  },
  hollin: {
    kinds: { d: 'litter', y: 'path', ':': 'path', X: 'cobbles' },
    standing: 'L&"T',
    onFloor: 'Z',
    natural: '',
    patches: { litter: ['#3e2228', 0.36, '#100a0c', 0.4] },
    p: {
      ground: ['#261a1e'], hi: '#867e8c', lo: '#3a3440', gap: '#262028', crack: '#262028', speck: ['#9a7e64', '#6a5040'],
      turf: ['#4f8a4a'], turfHi: '#6aa65c', turfLo: '#3b6d38',
      water: '#1b2350', wave: '#2c3a78', foam: '#8a9ad8', lip: '#140c0e', deep: '#141a40', troughs: '#2a3040', glint: '#5a6a80', wetLine: '#32201e',
      weed: ['#3e5a3a', '#5a7a4a'], weedHi: '#6a8a5a', driftwood: '#4a2e28',
      leaves: LOAM_LEAVES, litterLo: '#140c0e', root: '#3e2a2e', rootHi: '#5a3e40', cap: '#e0d8c0', stem: '#b8ac90',
    },
    lists: { litter: ['leaves', 'root', 'toadstool', 'twig', 'leaves'], cobbles: ['leaf', 'weed', 'puddle', 'leaf'], path: ['pebble', 'leaf', 'twig'] },
    chance: { litter: 0.4, cobbles: 0.12, path: 0.26 },
    edgeScatter: [{ on: 'cobbles', from: 'litter', colors: LOAM_LEAVES, chance: [0.13, 0.08, 0.045, 0.022, 0.01] }],
    hedge: { letters: 'Z', faces: '', dark: '#12060c', mid: '#2c0e1a', light: '#c8303c', top: '#3a1222', topHi: '#a01e30', topLo: '#2c0e1a' },
  },
  drains: {
    // (Walkway and slabs are built: the water's edges stay straight, the floors get wear.)
    kinds: { q: 'pavers', '.': 'slabs' },
    natural: '',
    patches: { pavers: ['#3a2c28', 0.22, '#0a0808', 0.4, true], slabs: ['#34343e', 0.2, '#0c0c12', 0.4, true] },
    p: {
      ground: ['#1c1616'], hi: '#3a302c', lo: '#120e0e', crack: '#0c0a0a', speck: ['#3a3028', '#4a3e34', '#2a2420'],
      water: '#18222a', troughs: '#18222a', wave: '#3a4e58', glint: '#3a4e58', deep: '#0c1614',
      weed: ['#2e4a34', '#24382a'], weedHi: '#3a5a3e', driftwood: '#3a2a20', silt: '#3a3028',
    },
    lists: { pavers: ['puddle', 'silt', 'weed', 'crack', 'pebble', 'silt'], slabs: ['puddle', 'silt', 'crack', 'weed', 'rubble'] },
    chance: { pavers: 0.22, slabs: 0.24 },
  },
  marsh: {
    kinds: { ';': 'fen', '%': 'bog', $: 'water', ',': 'turf', ':': 'path', '.': 'slabs' },
    standing: '"',
    natural: '',
    // (Fen and bog wander only a little, so the bog still shows where it lies.)
    amplitude: { 'bog|fen': 3, 'fen|turf': 6, 'path|turf': 5, 'fen|path': 5 },
    patches: { fen: ['#46503e', 0.32, '#262c26', 0.42], bog: ['#2e3230', 0.22, '#121410', 0.45], slabs: ['#3a3a48', 0.18, '#14141c', 0.36, true] },
    p: {
      ground: ['#363c34'], hi: '#a5845a', lo: '#76583a', crack: '#17161e', speck: ['#5e5a6a', '#7a7c64', '#4a5244'],
      turf: ['#4f8a4a'], turfHi: '#6aa65c', turfLo: '#3b6d38',
      water: '#1c2628', wave: '#283438', foam: '#4a5a58', lip: '#121816', deep: '#141c1e', troughs: '#141c1e',
      shallow: '#283438', shallowHi: '#3e4c4c', glint: '#6a7a7a', wetLine: '#2c3230', underHi: '#3e4c4c',
      weed: ['#2e4030', '#3a5038'], weedHi: '#40583e', fleck: '#3e4c4c', driftwood: '#5e584c',
      sedge: ['#4a5244', '#525a48', '#5a6250'], cotton: '#e8e8dc',
    },
    lists: { fen: ['sedge', 'cotton', 'sedge', 'puddle', 'sedge'], bog: ['bubble', 'bubble', 'weed'], water: ['weedFloat', 'fleck'], slabs: ['weed', 'crack', 'silt'] },
    chance: { fen: 0.36, bog: 0.2, water: 0.08, slabs: 0.16 },
  },
  valley: {
    kinds: { '.': 'paving', ',': 'turf', ':': 'path' },
    natural: '',
    amplitude: { 'path|turf': 5 },
    patches: { paving: ['#4a4078', 0.2, '#241e3e', 0.36, true] },
    p: {
      ground: ['#3a3160'], hi: '#a5845a', lo: '#76583a', crack: '#1e1838', speck: ['#4a4080', '#5a4e8c', '#2a2448'],
      turf: ['#4a8446', '#4f8a4a'], turfHi: '#6aa65c', turfLo: '#3b6d38', flowers: ['#f2e6c8', '#ffd25e', '#f0a8c8'],
      water: '#1e2858', wave: '#34448a', deep: '#1a2450', troughs: '#1a2450', glint: '#8a9ad8',
      weed: ['#3b6d38', '#4f8a4a'], weedHi: '#6aa65c', driftwood: '#5a4e3a',
      rubbleHi: '#5a4e8c', rubble: '#413869', rubbleLo: '#1e1838',
    },
    lists: { paving: ['crack', 'rubble', 'weed', 'crack', 'tuft', 'rubble'], turf: ['tuft', 'flowers', 'clover', 'tuft', 'rubble'], path: ['pebble', 'tuft', 'pebble'] },
    chance: { paving: 0.3, turf: 0.32, path: 0.26 },
  },
  lasthome: {
    kinds: { X: 'cobbles', ',': 'turf' },
    natural: '',
    p: {
      ground: ['#262028'], hi: '#867e8c', lo: '#3a3440', gap: '#262028', crack: '#262028', speck: ['#6a6270'],
      turf: ['#4a8446', '#4f8a4a'], turfHi: '#6aa65c', turfLo: '#3b6d38', flowers: ['#f2e6c8', '#ffd25e'],
      water: '#2a3040', troughs: '#2a3040', glint: '#5a6a80', wave: '#5a6a80', weed: ['#3e5a3a', '#5a7a4a'], weedHi: '#6a8a5a',
    },
    lists: { cobbles: ['weed', 'puddle', 'weed'], turf: ['tuft', 'flowers', 'clover', 'tuft'] },
    chance: { cobbles: 0.1, turf: 0.32 },
  },
};

const LAND = new Set(['litter', 'path', 'turf', 'earth', 'dirt', 'fen', 'bog']);

// Is the pass on for this room (an outdoor Chapter 3 room)?
export function ch3BlendOn(room) {
  return Boolean(room && LOOKS[room.area] && !room.indoors && room.softEdges !== false);
}
const kindOf = (room, c) => (c == null ? null : LOOKS[room.area].kinds[c] ?? null);
// Does the pass draw the edge between this tile and the one beside it? (Then
// the tile leaves out its own straight edge there.)
export function ch3SoftEdge(room, tx, ty, dx, dy) {
  if (!ch3BlendOn(room)) return false;
  const a = kindOf(room, room.tileAt(tx, ty));
  const b = kindOf(room, room.tileAt(tx + dx, ty + dy));
  return Boolean(a && b && a !== b);
}

export function ch3BlendLook(room) {
  if (!ch3BlendOn(room)) return null;
  const cfg = LOOKS[room.area];
  // Nothing lies about on a ground with its own words (look at the bog and you read about the
  // bog, not a stray leaf), and nothing blows onto it either.
  const worded = new Set(Object.keys(room.tileTexts ?? {}).map((c) => cfg.kinds[c]).filter(Boolean));
  const lists = { ...cfg.lists };
  for (const k of worded) lists[k] = [];
  return {
    p: cfg.p,
    kind: (c) => kindOf(room, c),
    naturalWall: (c) => cfg.natural.includes(c),
    isLand: (k) => LAND.has(k),
    isWater: (k) => k === 'water',
    patches: cfg.patches,
    lists,
    chance: cfg.chance,
    standing: cfg.standing,
    onFloor: cfg.onFloor,
    walls: cfg.walls,
    faces: cfg.faces,
    tops: cfg.tops,
    hedge: cfg.hedge,
    edgeScatter: (cfg.edgeScatter ?? []).filter((r) => !worded.has(r.on)),
    amplitude: (a, b) => (cfg.amplitude ?? {})[[a, b].sort().join('|')] ?? 0,
    stamps: ch3Stamps,
  };
}

// The region's own little things, drawn at (x, y); roll picks a variant.
function ch3Stamps(p) {
  const f = (ctx, c, x, y, w = 1, h = 1) => { if (!c) return; ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const one = (list, roll) => (list && list.length ? list[Math.floor(roll * list.length) % list.length] : null);
  return {
    // A little drift of fallen leaves, a few lying every way.
    leaves(ctx, x, y, r) {
      const n = 4 + Math.floor(r * 4);
      for (let i = 0; i < n; i++) {
        const a = (i * 2.4 + r * 6) % 6.28;
        const dist = 1 + ((i * 7 + Math.floor(r * 11)) % 4);
        const lx = x + Math.round(Math.cos(a) * dist * 1.4);
        const ly = y + Math.round(Math.sin(a) * dist * 0.8);
        const c = one(p.leaves, (r * 7 + i * 0.37) % 1);
        f(ctx, p.litterLo, lx, ly + 1, 2, 1);
        f(ctx, c, lx, ly, 2, 1);
        if (i % 3 === 0) f(ctx, c, lx + 1, ly - 1, 1, 1);
      }
    },
    // One leaf on its own.
    leaf(ctx, x, y, r) {
      const c = one(p.leaves, r);
      f(ctx, c, x, y, 2, 1);
      f(ctx, c, x + 1, y + 1, 1, 1);
    },
    // A root breaking the surface and going back under.
    root(ctx, x, y, r) {
      const dir = r > 0.5 ? 1 : -1;
      const len = 7 + Math.floor(r * 6);
      let yy = y;
      for (let i = 0; i < len; i++) {
        if (i === 3 || i === 7) yy += dir;
        f(ctx, p.root, x - 4 + i, yy + 1, 1, 1);
        f(ctx, p.rootHi, x - 4 + i, yy, 1, 1);
      }
      f(ctx, p.root, x - 1, yy + 2, 2, 1);
    },
    // A pale toadstool or two.
    toadstool(ctx, x, y, r) {
      f(ctx, p.litterLo, x - 1, y + 3, 4, 1);
      f(ctx, p.stem, x, y + 1, 1, 2);
      f(ctx, p.cap, x - 1, y, 3, 1);
      if (r > 0.45) { f(ctx, p.stem, x + 3, y + 2, 1, 1); f(ctx, p.cap, x + 2, y + 1, 3, 1); }
    },
    // Silt washed up in a crescent.
    silt(ctx, x, y) {
      f(ctx, p.silt ?? p.lo, x - 2, y, 6, 1);
      f(ctx, p.silt ?? p.lo, x - 1, y + 1, 4, 1);
      f(ctx, p.lo, x - 1, y + 2, 4, 1);
    },
    // Broken bits of the old stone, each lit on top with its shadow under it.
    rubble(ctx, x, y, r) {
      const hi = p.rubbleHi ?? p.hi;
      const mid = p.rubble ?? p.speck?.[0] ?? p.lo;
      const lo = p.rubbleLo ?? p.crack ?? p.lo;
      f(ctx, lo, x - 2, y + 2, 5, 1);
      f(ctx, mid, x - 2, y, 4, 2);
      f(ctx, hi, x - 2, y, 3, 1);
      if (r > 0.4) { f(ctx, lo, x + 3, y + 3, 3, 1); f(ctx, mid, x + 3, y + 2, 2, 1); f(ctx, hi, x + 3, y + 2, 1, 1); }
      if (r > 0.7) f(ctx, mid, x - 4, y + 2, 1, 1);
    },
    // A tussock of sedge, leaning the same way.
    sedge(ctx, x, y, r) {
      const c = one(p.sedge, r);
      f(ctx, p.lip, x - 1, y + 2, 5, 1);
      f(ctx, c, x - 1, y - 1, 1, 3);
      f(ctx, c, x, y - 2, 1, 4);
      f(ctx, one(p.sedge, 1 - r), x + 1, y - 3, 1, 5);
      f(ctx, c, x + 2, y - 1, 1, 3);
    },
    // Cotton-grass, white in the mist.
    cotton(ctx, x, y, r) {
      f(ctx, one(p.sedge, r), x, y, 1, 3);
      f(ctx, one(p.sedge, r), x + 3, y + 1, 1, 2);
      f(ctx, p.cotton, x - 1, y - 1, 2, 1);
      f(ctx, p.cotton, x + 3, y, 2, 1);
    },
    // A slow bubble on the bog.
    bubble(ctx, x, y, r) {
      f(ctx, p.shallowHi, x, y, 2, 1);
      f(ctx, p.shallowHi, x - 1, y + 1, 1, 1);
      f(ctx, p.shallowHi, x + 2, y + 1, 1, 1);
      f(ctx, p.lip, x, y + 2, 2, 1);
      if (r > 0.6) f(ctx, p.shallowHi, x + 4, y + 2, 1, 1);
    },
  };
}
