// The big regions of the world. Each room says which one it's in (`area`).
// A region's name shows on a title card when you walk into it from another
// region (or load a save there), not on every room. Its battles use the
// backdrop of the same name in src/battle/backdrops.js.
export const AREA_NAMES = {
  ruins: 'THE RUINS',
  // Chapter 2: the great ruined stair up the mountain, past the Ruins' door.
  stair: 'THE LONG STAIR',
  // The spire above the stair: climbs round its outside, caves through its inside.
  vigil: 'MOUNT VIGIL',
  // The village on the spire's shoulder, waiting for the Hero.
  rest: "HERALDS' REST",
};

// Regions out under the open sky: no dark vignette around the screen's edges
// (a room can ask for one back with `indoors: true`).
export const OUTDOOR_AREAS = new Set(['stair', 'vigil', 'rest']);

// Regions lit by their own lamps and fires (see src/overworld/lamplight.js):
// outdoors the night comes down deeper and every lamp and lit window keeps a
// warm pool of light; indoors the rooms are lit by their hearths and candles.
// A room can choose for itself with `lamplight: true` or `false`.
export const LAMPLIT_AREAS = new Set(['rest']);
