// The big regions of the world. Each room says which one it's in (`area`).
// A region's name shows on a title card when you walk into it from another
// region (or load a save there), not on every room. Its battles use the
// backdrop of the same name in src/battle/backdrops.js.
export const AREA_NAMES = {
  ruins: 'THE RUINS',
  // The next region, past the Ruins' door. Rename it when you know what it is.
  beyond: 'BEYOND THE RUINS',
};
