// Soft edges for Chapter 4 underground: the Glimmering, Belowtown, the Diggings,
// the Stillwater and the Deep. The same pass the coast and Sunnyside use
// (tileBlend.js) with each region's colours: ragged edges where moss meets
// stone or the lake meets the shore, big soft patches running across the
// floor so a mine gallery isn't one flat brown, grit and cracks lying about,
// rough natural rock (a ragged overhang, fallen stones at the foot of a face)
// and a soft shadow along every wall.
//
// Only the room's picture changes, painted once when the room is built: no
// tile's solidity, and none of the lighting (the Deep stays as dark as its
// light radius says). A room can opt out with `softEdges: false`.
//
// Belowtown's walls are masonry, so they only throw the soft shadow; its
// grass and trodden earth creep over the paving instead of stopping in
// squares. Indoors (the hall, the inn, the sunken hall) only the water's edges
// go ragged, and the floor gets faint wear.

const LOOKS = {
  glimmer: {
    kinds: { '.': 'rockfloor', q: 'rockfloor', ',': 'turf', '~': 'water', j: 'shallows' },
    patches: { rockfloor: ['#7a6eb4', 0.32, '#3e3470', 0.42] },
    natural: '#kWKGVH',
    p: {
      ground: ['#5b4f94'], hi: '#7266ac', lo: '#463b7a', crack: '#3e3470', speck: ['#8678c4', '#3e3470', '#d4c8ff'],
      turf: ['#2c8a78', '#319080'], turfHi: '#3cc4a0', turfLo: '#1f6e66', flowers: ['#8affd8', '#e8fff4', '#ffc4ec'],
      water: '#1f90ac', wave: '#47d0e0', foam: '#b8f6ff', lip: '#1e1442', deep: '#1b6a8a', troughs: '#1b6a8a',
      shallow: '#3aa6b8', shallowHi: '#9af4ff', glint: '#e8fdff', wetLine: '#46c8dc', underHi: '#9af4ff',
      weed: ['#2f9e8a', '#1f7a6e'], weedHi: '#8affd8', fleck: '#d4c8ff', driftwood: '#8678c4',
      deepRock: '#1d1440', deepRock2: '#0c0620', rockLo: '#2f2460', rim: '#8a74d4', rock: ['#4b3d86', '#52438f', '#6a5aaa'], topRock: '#2c2058',
    },
    lists: { rockfloor: ['crack', 'barnacles', 'puddle', 'pebble', 'crack', 'barnacles'], turf: ['tuft', 'flowers', 'tuft', 'flowers'] },
  },
  belowtown: {
    kinds: { '.': 'flags', X: 'cobbles', ',': 'turf', ':': 'path' },
    natural: '',
    p: {
      ground: ['#8c7c6c'], hi: '#a89880', lo: '#6a5a50', gap: '#5a4c42', crack: '#5a4c42', speck: ['#9a7a58', '#6a5a50', '#b0a090'],
      turf: ['#4a7a40', '#4f8044'], turfHi: '#7ab868', turfLo: '#3c6634', flowers: ['#f2e8d0', '#a8f0c8'],
      path: ['#7a5c42'], driftwood: '#9a7a58', weed: ['#5f7a4a', '#3c6634'], weedHi: '#86a864',
      water: '#3a4a52', wave: '#6a8a94', foam: '#a8b8c0', lip: '#3a2c24', deep: '#2a363c', troughs: '#2a363c', glint: '#ffd27a', wetLine: '#6a5a50',
    },
    lists: { flags: ['crack', 'weed', 'crack', 'pebble'], cobbles: ['weed', 'pebble', 'crack'], path: ['pebble', 'pebble', 'tuft', 'twig'] },
  },
  diggings: {
    kinds: { '.': 'rockfloor', q: 'shingle', ';': 'shallows', '~': 'water' },
    patches: { rockfloor: ['#5c4a3c', 0.42, '#221a13', 0.5], shingle: ['#6a5a4a', 0.3, '#221a13', 0.4] },
    natural: '#kW',
    p: {
      ground: ['#3c3027'], hi: '#544438', lo: '#2a2019', crack: '#211812', speck: ['#6a5a4a', '#7a6a58', '#55473a', '#8a7a66'],
      turf: ['#3a4a36'], turfHi: '#5a6a48', turfLo: '#2a3426',
      water: '#1c2826', wave: '#2f4642', foam: '#7a9a8a', lip: '#2a2018', deep: '#141c1b', troughs: '#141c1b',
      shallow: '#2a3632', shallowHi: '#4a6a60', glint: '#7a9a8a', wetLine: '#4a3c2e', underHi: '#4a6a60',
      weed: ['#4c5a40', '#3a4632'], weedHi: '#6a7a52', fleck: '#b8743a', driftwood: '#85603a',
      deepRock: '#17110d', deepRock2: '#0a0705', rockLo: '#3a2c20', rim: '#6a5848', rock: ['#6a5848', '#5a4a3c', '#7a6a58'], topRock: '#221a14',
    },
    lists: { rockfloor: ['crack', 'pebble', 'stone', 'twig', 'barnacles', 'pebble', 'wet'], shingle: ['pebble', 'stone', 'pebble', 'twig'], shallows: ['ripple', 'pebble'], water: ['fleck'] },
    chance: { rockfloor: 0.34 },
  },
  stillwater: {
    kinds: { '.': 'rockfloor', q: 'shingle', ';': 'shallows', '~': 'water' },
    patches: { rockfloor: ['#6e7c96', 0.32, '#3c4760', 0.45] },
    natural: '#kW',
    p: {
      ground: ['#5b6882'], hi: '#6c7a94', lo: '#46526c', crack: '#3c4760', speck: ['#8896ae', '#9aa8c0', '#3c4760'],
      turf: ['#3f6a58'], turfHi: '#5f9a86', turfLo: '#2c5450',
      water: '#070d19', wave: '#1d3050', foam: '#7a8eb0', lip: '#2c3650', deep: '#04070f', troughs: '#0b1424',
      shallow: '#2c5068', shallowHi: '#6a9ab4', glint: '#7fa8c8', wetLine: '#8aa0c0', underHi: '#6a9ab4',
      weed: ['#3f6a58', '#2c5450'], weedHi: '#5f9a86', fleck: '#bcd6ee', driftwood: '#847f72',
      deepRock: '#0b1018', deepRock2: '#04060c', rockLo: '#2c3858', rim: '#4a5a82', rock: ['#8896b0', '#7a88a2', '#5f6e8c'], topRock: '#141c2c',
    },
    lists: { rockfloor: ['crack', 'wet', 'weed', 'pebble', 'crack', 'barnacles'], shingle: ['pebble', 'stone', 'weed', 'pebble'], shallows: ['ripple', 'weed', 'ripple'], water: ['fleck'] },
  },
  deep: {
    kinds: { '.': 'rockfloor', q: 'shingle', ';': 'shallows', '~': 'water' },
    patches: { rockfloor: ['#2a2634', 0.4, '#0f0d14', 0.5] },
    natural: '#kW',
    p: {
      ground: ['#1b1923'], hi: '#2a2634', lo: '#121017', crack: '#0b0a10', speck: ['#34304a', '#2a2736', '#454058'],
      turf: ['#1c2a2c'], turfHi: '#2f4a5e', turfLo: '#121c1e',
      water: '#04040a', wave: '#14182a', foam: '#3a4a64', lip: '#2d2a3c', deep: '#020205', troughs: '#0a0c16',
      shallow: '#0c0b14', shallowHi: '#2f4a5e', glint: '#5a8ea8', wetLine: '#2f4a5e', underHi: '#2f4a5e',
      weed: ['#1c2a2c', '#243438'], weedHi: '#2f4a5e', fleck: '#3a6a86', driftwood: '#2a2736',
      deepRock: '#07060b', deepRock2: '#020104', rockLo: '#201d2c', rim: '#34304a', rock: ['#2a2736', '#34304a', '#1c1926'], topRock: '#0f0d16',
    },
    lists: { rockfloor: ['crack', 'pebble', 'stone', 'barnacles', 'crack'], shingle: ['pebble', 'stone', 'pebble'], shallows: ['ripple'], water: ['fleck'] },
  },
};

const NATURAL = new Set(['turf', 'path', 'rockfloor', 'shingle']);
const SPREADS = new Set(['turf', 'path', 'shingle']);
const WET = new Set(['water', 'shallows']);

// Is the pass on for this room (outdoors, or indoors with only the water's edges)?
export function caveBlendOn(room) {
  return Boolean(room && LOOKS[room.area] && room.softEdges !== false);
}
const kindOf = (room, c) => (c == null ? null : LOOKS[room.area].kinds[c] ?? null);
// Does the pass draw the edge between this tile and the one beside it? (Then
// the tile leaves out its own straight edge there.)
export function caveSoftEdge(room, tx, ty, dx, dy) {
  if (!caveBlendOn(room)) return false;
  const a = kindOf(room, room.tileAt(tx, ty));
  const b = kindOf(room, room.tileAt(tx + dx, ty + dy));
  if (!a || !b || a === b) return false;
  const wet = (k) => k === 'water' || k === 'shallows';
  if (room.indoors) return wet(a) || wet(b);
  return true;
}

export function caveBlendLook(room) {
  if (!caveBlendOn(room)) return null;
  const cfg = LOOKS[room.area];
  const look = {
    p: cfg.p,
    kind: (c) => kindOf(room, c),
    naturalWall: (c) => !room.indoors && cfg.natural.includes(c),
    isLand: (k) => NATURAL.has(k),
    isWater: (k) => k === 'water',
    patches: cfg.patches,
    lists: cfg.lists,
    chance: cfg.chance,
    // Moss, grass, trodden earth and drifts of spoil or shingle wander well into the
    // floor round them (both are walkable, so the edge needn't say where you can go).
    amplitude: (a, b) => (a !== b && (SPREADS.has(a) || SPREADS.has(b)) && !WET.has(a) && !WET.has(b) ? 6 : 0),
  };
  if (room.indoors) Object.assign(look, { indoors: true, wetOnly: true });
  return look;
}
