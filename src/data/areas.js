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
  // Chapter 4: the sunny fields just past the Hero's Gate. Buttercups, a
  // brook, a lemonade stand. Everything is perfectly fine up here.
  sunnyside: 'SUNNYSIDE',
  // The bright crystal caves at the top of the buried kingdom: glowing moss,
  // great mushrooms, crystals in every colour, lit by their own light.
  glimmer: 'THE GLIMMERING',
  // The creature folk's town, built inside an old buried human city: carved
  // stone patched with creature-made wood, glow-worm lamps, and the Sunstone
  // shining from above.
  belowtown: 'BELOWTOWN',
  // Chapter 4: the creature folk's mines below Belowtown. Timber-propped
  // tunnels, plank walks and trestles, spoil heaps and dim old lamps.
  diggings: 'THE DIGGINGS',
  // A vast black lake under the mountain: pale stone shores, islands, glowing
  // reeds, and a sunken old hall standing in the water.
  stillwater: 'THE STILLWATER',
  // The bottom of everything. Black rock, very old, and mostly dark: you see
  // only as far as your light reaches.
  deep: 'THE DEEP',
  // Chapter 5: the coast. Gullrest is the sunny beach; from the Wrack Shore on
  // the green storm sits over everything (src/overworld/coastTiles.js).
  gullrest: 'GULLREST',
  wrack: 'THE WRACK SHORE',
  saltcombe: 'SALTCOMBE',
  lanes: 'THE SUNKEN LANES',
  wreck: 'THE WRECK YARD',
  // The brig Fair Return, lying on the yard's bar (src/data/rooms/ship*.js).
  ghostship: 'THE FAIR RETURN',
  merrow: 'MERROW',
  soundings: 'THE SOUNDINGS',
  isles: 'THE BEACON ISLES',
  haddock_light: "HADDOCK'S LIGHT",
  reach: 'THE STORM REACH',
  lastlight: 'THE LAST LIGHT',
};

// Regions out under the open sky: no dark vignette around the screen's edges
// (a room can ask for one back with `indoors: true`).
export const OUTDOOR_AREAS = new Set(['stair', 'vigil', 'rest', 'pinefall', 'hushwood', 'hollin', 'marsh', 'valley', 'sunnyside', 'gullrest']);

// Chapter 5's storm coast, lightest storm first. The green storm is worked out
// per area in lamplight.js (AREA_AMBIENT) and atmosphere.js (rain, lightning).
// They are lamplit rather than "outdoors": the storm hides the sun, so the
// time of day doesn't change them, and their lamps keep warm pools of light.
export const STORM_AREAS = ['wrack', 'saltcombe', 'lanes', 'wreck', 'ghostship', 'merrow', 'soundings', 'isles', 'haddock_light', 'reach', 'lastlight'];

// Regions lit by their own lamps and fires (see src/overworld/lamplight.js):
// outdoors the night comes down deeper and every lamp and lit window keeps a
// warm pool of light; indoors the rooms are lit by their hearths and candles.
// A room can choose for itself with `lamplight: true` or `false`.
// (The Glimmering is lamplit so its crystals and mushrooms glow, in a soft
// violet shade rather than the usual ember brown.)
export const LAMPLIT_AREAS = new Set(['rest', 'lasthome', 'belowtown', 'glimmer', 'diggings', 'stillwater', ...STORM_AREAS]);
