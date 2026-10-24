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
  // Chapter 3: the scarlet forest below the clouds, on the mountain's far side.
  pinefall: 'THE PINEFALL',
  // Below the Long Drop: the old, quiet wood where the beast lives.
  hushwood: 'THE HUSHWOOD',
  // The woodcutters' old village at the bottom of the Hushwood, empty for fifty years.
  hollin: 'HOLLIN',
  // Under Hollin's well: the village's brick cistern and culverts, built down
  // onto the old city's great stone water-conduit, which carries the
  // mountain's water on under the wood to where it breaks out into the marsh.
  drains: 'THE OLD DRAINS',
  // Where the conduit's broken mouth spills out under the trees: a flat grey
  // fen of reeds and mist, with old lanterns on poles marking the one safe
  // path. Where Ves came down.
  marsh: 'THE LANTERN MARSH',
  // Past the fen: the long valley, and in it the half-sunk city the prophecy
  // was meant to end in.
  valley: 'THE HOLLOW VALLEY',
  // The living town built inside the old city's biggest hall, by the people
  // who stopped waiting for the Hero.
  lasthome: 'LASTHOME',
};

// Regions out under the open sky: no dark vignette around the screen's edges
// (a room can ask for one back with `indoors: true`).
export const OUTDOOR_AREAS = new Set(['stair', 'vigil', 'rest', 'pinefall', 'hushwood', 'hollin', 'marsh', 'valley']);

// Regions lit by their own lamps and fires (see src/overworld/lamplight.js):
// outdoors the night comes down deeper and every lamp and lit window keeps a
// warm pool of light; indoors the rooms are lit by their hearths and candles.
// A room can choose for itself with `lamplight: true` or `false`.
export const LAMPLIT_AREAS = new Set(['rest', 'lasthome']);
