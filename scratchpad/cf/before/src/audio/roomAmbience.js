// Room by room sound for chapters 4, 5 and 6, on top of the area ambiences in src/audio/music.js
// (AMBIENCES). Until 14 November 2026 a whole area shared one ambience; now rooms that differ
// (a cart yard against an air shaft, the dunes against the boardwalk, an orchard against the
// cinder field) have a mix of their own, and every ambience has a small far-off sound now and
// then (a gull, a creak, a drip, a caw).
//
// Nothing here makes a new kind of sound: every layer is one music.js already has, and each
// recording is one already in assets/audio (the waves are the real recorded ones, `surf`,
// `boom` and `lapping`; the gulls, drips, creaks, boat boards, picks and carts are all
// recordings too, see assets/audio/samples/README.md). All of it sits under the music.
//
// How it's used: music.js merges EXTRA_AMBIENCES into AMBIENCES, EXTRA_EXTRAS into
// AMBIENT_EXTRAS, EXTRA_SFX into SFX, EXTRA_FEEL into SFX_FEEL and EXTRA_ECHO into
// ECHO_BY_AMBIENCE; and OverworldScene's `ambience` getter looks a room up in ROOM_AMBIENCE
// before falling back to its own `ambience` (a room's `calmAfter` and `ambienceAfter` still win).

// A room's own ambience, by room id.
export const ROOM_AMBIENCE = {
  // Chapter 4. The Glimmering: the landing and King's Road have the daylight draught, the prism
  // hall and bridge ring, the little pockets drip, the shelf and the chimney are open.
  glimmer_landing: 'crystal_landing',
  glimmer_kings_road: 'crystal_ringing',
  glimmer_prism_hall: 'crystal_ringing',
  glimmer_crystal_bridge: 'crystal_ringing',
  glimmer_vug: 'crystal_pocket',
  glimmer_geode: 'crystal_pocket',
  glimmer_tuck: 'crystal_pocket',
  glimmer_shelf: 'crystal_high',
  glimmer_chimney: 'crystal_high',
  // The Diggings: carts in the yard and on the switchback, the air shaft and lift drawing a
  // draught and groaning, the pithead and trestle with a bit of the surface in them, the cave-in
  // shifting.
  diggings_cart_yard: 'mine_yard',
  diggings_switchback: 'mine_yard',
  diggings_air_shaft: 'mine_shaft',
  diggings_lift: 'mine_shaft',
  diggings_pithead: 'mine_pit',
  diggings_trestle: 'mine_pit',
  diggings_cave_in: 'mine_slip',
  // The Stillwater's reed maze: the water close, the lake a long way off.
  stillwater_reeds: 'lake_reeds',
  // The Deep.
  deep_crawl: 'deep_tight',
  deep_heros_camp: 'deep_camp',
  deep_hidden_vug: 'deep_vug',
  deep_way_up: 'deep_draught',
  deep_root: 'deep_root',
  // Chapter 5, before the storm ends (each room's `calmAfter` still has its own calm ambience).
  gullrest_cove: 'beach_cove',
  gullrest_cliff_steps: 'beach_steps',
  gullrest_jetty: 'beach_jetty',
  saltcombe_quay: 'stilt_quay',
  saltcombe_market: 'stilt_market',
  saltcombe_lagoon: 'stilt_lagoon',
  saltcombe_lookout: 'stilt_lookout',
  wrack_dunes: 'storm_dunes',
  wrack_pools: 'storm_pools',
  wrack_boardwalk: 'storm_boardwalk',
  wrack_headland: 'storm_headland',
  wreck_fog: 'wreck_fog',
  wreck_mast: 'wreck_mast',
  wreck_watch_rock: 'wreck_watch',
  wreck_chain_cliff: 'wreck_cliff',
  lanes_hamlet: 'storm_lanes',
  lanes_mill: 'storm_lanes',
  lanes_causeway: 'storm_lanes',
  lanes_sluices: 'storm_sluice',
  soundings_three_wells: 'sea_cave_wells',
  soundings_echo_hall: 'sea_cave_hall',
  isles_gannet_stack: 'open_gannets',
  isles_bridge: 'open_bridge',
  reach_needle: 'open_needle',
  reach_reef: 'open_reef',
  reach_wreck: 'open_wreck',
  reach_eye: 'storm_eye',
  // Chapter 6. The Ash Road.
  ash_waystation: 'ash_station',
  ash_orchard: 'ash_orchard',
  ash_cinder_field: 'ash_cinder',
  ash_drift_cut: 'ash_cut',
  ash_storm_flats: 'ash_flats',
  ash_tideline: 'ash_shore',
  ash_town_gate: 'ash_gate',
  ash_buried_road: 'ash_buried',
};

// The mixes (see AMBIENCES in music.js for what each layer is, and the numbers).
export const EXTRA_AMBIENCES = {
  // The Glimmering.
  crystal_landing: { drips: 0.5, slowdrips: 0.2, lakeLap: 0.4, chimes: 0.1, shimmer: 0.25, wind: 0.14, muffle: 900 },
  crystal_ringing: { drips: 0.4, slowdrips: 0.2, lakeLap: 0.3, chimes: 0.28, shimmer: 0.45, wind: 0.04, muffle: 700 },
  crystal_pocket: { drips: 0.95, slowdrips: 0.3, lakeLap: 0.15, chimes: 0.06, shimmer: 0.22, muffle: 650 },
  crystal_high: { drips: 0.35, slowdrips: 0.15, lakeLap: 0.5, chimes: 0.1, shimmer: 0.3, wind: 0.2, muffle: 800 },
  // The Diggings.
  mine_yard: { picks: 0.5, timbers: 0.5, carts: 1, grit: 0.4, rumble: 0.3, drips: 0.15, hum: 0.1, wind: 0.05 },
  mine_shaft: { wind: 0.45, timbers: 0.9, rumble: 0.35, grit: 0.4, drips: 0.1, hum: 0.2 },
  mine_pit: { wind: 0.22, picks: 0.5, timbers: 0.8, carts: 0.45, grit: 0.3, drips: 0.1, hum: 0.08 },
  mine_slip: { rumble: 0.9, grit: 0.9, timbers: 0.85, drips: 0.15, hum: 0.1 },
  // The Stillwater's reeds.
  lake_reeds: { slowdrips: 0.4, lakeLap: 1, boats: 0.15, hum: 0.3, wind: 0.05 },
  // The Deep.
  deep_tight: { pressure: 0.9, slowdrips: 0.3, grit: 0.25, far: 0.4 },
  deep_camp: { pressure: 0.55, slowdrips: 0.3, far: 0.5, hum: 0.1 },
  deep_vug: { pressure: 0.4, slowdrips: 0.4, shimmer: 0.2, chimes: 0.08, far: 0.3 },
  deep_draught: { pressure: 0.5, wind: 0.2, slowdrips: 0.3, far: 0.4 },
  deep_root: { pressure: 0.8, slowdrips: 0.35, far: 0.5, rumble: 0.2 },
  // Gullrest: the cove has the sea cave breathing in it, the steps are windy, the jetty's boards creak.
  beach_cove: { surf: 0.45, gulls: 0.7, boom: 0.25, wind: 0.1 },
  beach_steps: { surf: 0.35, gulls: 1, wind: 0.3 },
  beach_jetty: { surf: 0.5, gulls: 0.8, boats: 0.55, creaks: 0.3, wind: 0.15 },
  // Saltcombe, before the storm ends.
  stilt_quay: { rainRoof: 0.3, drizzle: 0.5, surf: 0.45, boats: 0.55, creaks: 0.5, rigging: 0.7, bell: 0.35, thunder: 0.3, wind: 0.15, tavern: 0.2 },
  stilt_market: { rainRoof: 0.5, drizzle: 0.35, surf: 0.2, creaks: 0.4, tavern: 0.7, murmur: 0.3, chatter: 0.3, thunder: 0.3, rigging: 0.3, wind: 0.1 },
  stilt_lagoon: { drizzle: 0.45, surf: 0.5, lapping: 0.3, boats: 0.7, rigging: 0.55, creaks: 0.4, bell: 0.3, thunder: 0.3, wind: 0.15 },
  stilt_lookout: { drizzle: 0.5, rainRoof: 0.2, surf: 0.5, wind: 0.5, bell: 0.4, rigging: 0.3, thunder: 0.4 },
  // The Wrack Shore.
  storm_dunes: { rain: 0.6, surf: 0.5, thunder: 0.5, wind: 0.7 },
  storm_pools: { rain: 0.75, surf: 0.45, lapping: 0.25, thunder: 0.6, wind: 0.25, drips: 0.2 },
  storm_boardwalk: { rain: 0.6, surf: 0.6, creaks: 0.5, rigging: 0.2, thunder: 0.6, wind: 0.35 },
  storm_headland: { rain: 0.8, surf: 1, boom: 0.3, thunder: 0.7, wind: 0.7 },
  // The Wreck Yard.
  wreck_fog: { drizzle: 1, creaks: 1.2, bell: 0.85, rigging: 0.5, surf: 0.3, wind: 0.15, thunder: 0.3 },
  wreck_mast: { drizzle: 0.5, creaks: 0.9, rigging: 0.95, bell: 0.5, surf: 0.4, wind: 0.5, thunder: 0.4 },
  wreck_watch: { drizzle: 0.6, rain: 0.2, creaks: 0.5, bell: 1, surf: 0.6, wind: 0.5, thunder: 0.4 },
  wreck_cliff: { drizzle: 0.6, creaks: 0.7, surf: 0.65, boom: 0.2, bell: 0.4, wind: 0.5, rigging: 0.3, thunder: 0.4 },
  // The Sunken Lanes.
  storm_lanes: { rain: 0.5, lapping: 0.6, surf: 0.35, thunder: 0.5, wind: 0.28, creaks: 0.2 },
  storm_sluice: { rain: 0.6, lapping: 0.9, surf: 0.25, thunder: 0.5, wind: 0.3 },
  // The Soundings.
  sea_cave_wells: { slowdrips: 0.9, drips: 0.3, boom: 0.5, lapping: 0.35, hum: 0.3, muffle: 1000 },
  sea_cave_hall: { slowdrips: 0.6, drips: 0.7, boom: 0.4, bell: 0.25, hum: 0.35, muffle: 1100 },
  // The Beacon Isles and the Reach.
  open_gannets: { wind: 0.9, surf: 1, gulls: 1.2, rain: 0.6, thunder: 0.5 },
  open_bridge: { wind: 1.2, surf: 0.8, creaks: 0.5, rigging: 0.3, rain: 0.8, thunder: 0.6 },
  open_needle: { wind: 1.4, surf: 0.9, rain: 0.9, thunder: 0.8 },
  open_reef: { wind: 1, surf: 1.1, boom: 0.5, rain: 0.8, thunder: 0.6 },
  open_wreck: { wind: 0.9, surf: 0.9, creaks: 0.7, rigging: 0.4, rain: 0.8, thunder: 0.6 },
  // The Eye: the wind has dropped and the rain thinned to nothing; only the sea, and the storm
  // grumbling all round the edge.
  storm_eye: { wind: 0.25, surf: 0.7, rain: 0.08, thunder: 0.3, gulls: 0.12 },
  // The Ash Road.
  ash_station: { wind: 0.25, fire: 0.2, creaks: 0.3, hum: 0.08 },
  ash_orchard: { wind: 0.4, timbers: 0.5, fire: 0.05, hum: 0.08 },
  ash_cinder: { wind: 0.35, fire: 0.32, hum: 0.14, grit: 0.2 },
  ash_cut: { wind: 0.55, grit: 0.5, fire: 0.05, hum: 0.08 },
  ash_flats: { wind: 0.9, grit: 0.6, rumble: 0.4, whoosh: 0.3, hum: 0.1 },
  ash_shore: { wind: 0.35, surf: 0.3, gulls: 0.1, fire: 0.04, muffle: 1400 },
  ash_gate: { wind: 0.3, timbers: 0.35, creaks: 0.4, fire: 0.05, hum: 0.1 },
  ash_buried: { wind: 0.35, grit: 0.4, timbers: 0.2, fire: 0.06, hum: 0.08 },
};

// The small sounds a place makes now and then over its ambience (one every 20 to 50 seconds),
// by ambience name. All recordings but the caw and the cinder pop. `farGull`, `farCreak`,
// `farDrip`, `farBoat`, `farPick` and `farCart` are in EXTRA_SFX below. Ambiences that already
// have extras in music.js (the mine and cave ones' `pebble`) are given theirs again with more.
const ROCK = ['pebble', 'farDrip'];
export const EXTRA_EXTRAS = {
  crystal: ['farDrip', 'farDrip', 'pebble'],
  crystal_falls: ['farDrip', 'pebble'],
  crystal_landing: ['farDrip', 'pebble'],
  crystal_ringing: ['farDrip', 'pebble'],
  crystal_pocket: ['farDrip', 'farDrip', 'pebble'],
  crystal_high: ['farDrip', 'pebble'],
  mine: ['farPick', 'farCart', 'pebble'],
  mine_yard: ['farPick', 'farCart', 'pebble'],
  mine_shaft: ['farCreak', 'pebble'],
  mine_pit: ['farPick', 'farCart', 'farCreak'],
  mine_slip: ['farCreak', 'pebble', 'pebble'],
  mine_quiet: ['farCreak', 'pebble', 'farDrip'],
  mine_flooded: ['farDrip', 'farCreak', 'pebble'],
  lake: ['farDrip', 'farBoat'],
  lake_reeds: ['farDrip', 'farBoat'],
  lake_jetty: ['farBoat', 'farDrip'],
  lake_hall: ['farDrip', 'pebble'],
  deep_stair: ROCK,
  deep: ['farDrip', 'pebble', 'farCreak'],
  deep_tight: ['pebble', 'pebble', 'farDrip'],
  deep_camp: ['pebble', 'farCreak', 'settle'],
  deep_vug: ['farDrip', 'farDrip', 'pebble'],
  deep_draught: ROCK,
  deep_root: ['pebble', 'farCreak', 'farDrip'],
  deep_fire: ['pebble', 'settle'],
  belowtown_tunnel: ROCK,
  belowtown_indoors: ['farDrip', 'settle'],
  long_rope: ['farDrip', 'pebble'],
  // Chapter 5.
  beach: ['farGull'],
  beach_cove: ['farGull', 'farDrip'],
  beach_steps: ['farGull'],
  beach_jetty: ['farBoat', 'farGull'],
  storm_shore: ['farGull', 'farCreak'],
  storm_dunes: ['farGull'],
  storm_pools: ['farGull', 'farDrip'],
  storm_boardwalk: ['farCreak', 'farGull'],
  storm_headland: ['farGull'],
  storm_lanes: ['farCreak', 'farDrip'],
  storm_sluice: ['farDrip', 'farCreak'],
  stilt_town: ['farBoat', 'farGull'],
  stilt_quay: ['farBoat', 'farBoat', 'farGull'],
  stilt_market: ['farCreak', 'farGull'],
  stilt_lagoon: ['farBoat', 'farGull'],
  stilt_lookout: ['farGull', 'farCreak'],
  wreck_yard: ['farCreak', 'farBoat', 'farGull'],
  wreck_fog: ['farCreak', 'farBoat'],
  wreck_mast: ['farCreak', 'farGull'],
  wreck_watch: ['farCreak', 'farGull'],
  wreck_cliff: ['farCreak', 'farGull'],
  hulk_storm: ['farCreak', 'farDrip'],
  calm_hulk: ['farCreak', 'farDrip'],
  calm_wreck_yard: ['farCreak', 'farBoat', 'farGull'],
  sea_cave: ROCK,
  sea_cave_wells: ROCK,
  sea_cave_hall: ROCK,
  cliff_cave: ROCK,
  open_sea: ['farGull'],
  open_gannets: ['farGull'],
  open_bridge: ['farCreak', 'farGull'],
  open_needle: ['farGull'],
  open_reef: ['farGull'],
  open_wreck: ['farCreak', 'farGull'],
  storm_eye: ['farGull', 'farBoat'],
  calm_sea: ['farGull'],
  calm_shore: ['farGull', 'farDrip'],
  calm_stilt_town: ['farBoat', 'farGull'],
  drowned_town: ['farCreak', 'farDrip'],
  calm_drowned_town: ['farGull', 'farDrip'],
  lighthouse: ['settle', 'farCreak'],
  last_light: ['farCreak', 'settle'],
  calm_tower: ['farCreak', 'farDrip'],
  // Chapter 6.
  ash_waste: ['farCaw', 'emberPop', 'pebble'],
  ash_station: ['emberPop', 'farCaw', 'settle'],
  ash_orchard: ['farCaw', 'farCreak', 'emberPop'],
  ash_cinder: ['emberPop', 'emberPop', 'farCaw'],
  ash_cut: ['pebble', 'farCaw'],
  ash_flats: ['farCaw', 'pebble'],
  ash_shore: ['farGull', 'pebble'],
  ash_gate: ['farCreak', 'farCaw'],
  ash_buried: ['farCaw', 'emberPop', 'pebble'],
  ash_seabed: ['farGull', 'pebble'],
};

// The small sounds themselves. Recordings are from assets/audio/gulls, /under (see the README
// there); the gap in each is quiet, so even at 20 seconds apart they stay a surprise.
export const EXTRA_SFX = {
  farGull: [{ clip: ['../gulls/1', '../gulls/2', '../gulls/3', '../gulls/4', '../gulls/5'], volume: 0.03, rate: 0.9 }],
  farCreak: [{ clip: ['../under/creak1', '../under/creak2', '../under/creak3', '../under/creak4'], volume: 0.045, rate: 0.7 }],
  farDrip: [{ clip: ['../under/drip1', '../under/drip2', '../under/drip3', '../under/drip4', '../under/drip5', '../under/drip6'], volume: 0.07, rate: 0.9 }],
  farBoat: [{ clip: ['../under/boat1', '../under/boat2', '../under/boat3'], volume: 0.04, rate: 0.9 }],
  farPick: [{ clip: ['../under/pick1', '../under/pick2', '../under/pick3', '../under/pick4', '../under/pick5'], volume: 0.04, rate: 0.85 }],
  farCart: [{ clip: ['../under/cart1', '../under/cart2', '../under/cart3'], volume: 0.04, rate: 0.85 }],
  // A crow a long way off over the burnt ground: two hoarse notes, each falling, the second softer.
  farCaw: [
    { midi: 64, wave: 'sawtooth', length: 0.2, volume: 0.007, slide: -4, attack: 0.02 },
    { noise: 'bandpass', frequency: 1500, q: 2.5, length: 0.2, volume: 0.03, sweep: 0.7, attack: 0.02 },
    { midi: 62, wave: 'sawtooth', length: 0.22, volume: 0.005, slide: -4, delay: 0.34, attack: 0.02 },
    { noise: 'bandpass', frequency: 1300, q: 2.5, length: 0.22, volume: 0.02, sweep: 0.7, delay: 0.34, attack: 0.02 },
  ],
  // A cinder cracking in the heat, and a flake of it settling.
  emberPop: [
    { noise: 'bandpass', frequency: 3400, q: 2, length: 0.02, volume: 0.09 },
    { noise: 'bandpass', frequency: 2300, q: 3, length: 0.025, volume: 0.05, delay: 0.06 },
    { noise: 'bandpass', frequency: 1500, q: 4, length: 0.03, volume: 0.03, delay: 0.12 },
  ],
};

// Each one a little different every time, thrown to one side, like the others.
export const EXTRA_FEEL = {
  farGull: { vary: 2, pan: 0.9 },
  farCreak: { vary: 2, pan: 0.8 },
  farDrip: { vary: 3, pan: 0.8 },
  farBoat: { vary: 2, pan: 0.8 },
  farPick: { vary: 2, pan: 0.8 },
  farCart: { vary: 1, pan: 0.9 },
  farCaw: { vary: 3, pan: 0.9 },
  emberPop: { vary: 3, pan: 0.7 },
};

// How the new rooms ring (see ECHOES in music.js), where the area's ambience rang already.
export const EXTRA_ECHO = {
  crystal_landing: 'cave', crystal_ringing: 'cave', crystal_pocket: 'pocket', crystal_high: 'cave',
  mine_yard: 'cave', mine_shaft: 'cave', mine_pit: 'cave', mine_slip: 'tunnel',
  lake_reeds: 'cavern', deep_tight: 'tunnel', deep_camp: 'cave', deep_vug: 'pocket', deep_draught: 'tunnel', deep_root: 'cave',
  sea_cave_wells: 'cave', sea_cave_hall: 'cavern',
};

// ---------------------------------------------------------------------------------------------
// Chapters 1 to 3 (the second life pass, 15 November 2026). Room by room, like the rest. The old
// area ambiences ('forest', 'mountain', 'marsh', 'cave'...) are still what a room without an entry
// here plays. Rooms whose ambience says the beast is near ('hush': Hollin's streets, the Hush's
// quiet hollows, the dead city's last street) are left exactly as they were on purpose.
//
// Natural sound is real: the new `forestEve` bed (a summer evening in a German wood, birds and
// leaves) and the four `bird1` to `bird4` one-shots cut from it are CC0, see
// assets/audio/samples/README.md. Water is the real `lapping` and `lakeLap` recordings, fire the
// real fire, drips and creaks the real ones. The wind is still the synth wind (no free recording
// of a mountain wind that was not a gale turned up), at levels that suit each place.
// ---------------------------------------------------------------------------------------------
const WOOD = (level, lowpass = null, wander = 0.3) => ({ url: 'assets/audio/under/forestEve.ogg', level, ...(lowpass ? { lowpass } : {}), wander });
const FOLK = (level, lowpass = 700) => ({ url: 'assets/audio/under/market.ogg', level, lowpass, wander: 0.3 });
const HALLFOLK = (level, lowpass = 900) => ({ url: 'assets/audio/under/hall.ogg', level, lowpass, wander: 0.3 });

Object.assign(ROOM_AMBIENCE, {
  // Chapter 1: the Ruins. A courtyard open to the sky; a long hall; a garden; stone rooms; a house.
  ruins_entrance: 'r_ruins_yard',
  way_out: 'r_ruins_way',
  flower_room: 'r_ruins_garden',
  pillar_room: 'r_ruins_hall',
  lantern_hall: 'r_ruins_hall',
  taper_hall: 'r_taper_house',
  taper_home: 'r_taper_house',
  taper_kitchen: 'r_taper_kitchen',
  // Chapter 2: the Long Stair and Mount Vigil.
  goat_track: 'r_stair_goat',
  climb_start: 'r_stair_climb',
  sheer_face: 'r_stair_sheer',
  vigil_hollow: 'r_vigil_hollow',
  vigil_ridge: 'r_vigil_ridge',
  vigil_shoulder: 'r_vigil_ridge',
  vigil_owl_shelf: 'r_vigil_owl',
  vigil_vane_gardens: 'r_vigil_vanes',
  vigil_weathervanes: 'r_vigil_weathervanes',
  vigil_second_cairn: 'r_vigil_ridge',
  vigil_high_shelf: 'r_vigil_high',
  vigil_lamplighters_ledge: 'r_vigil_ledge',
  vigil_lamplighters_hut: 'r_vigil_hut',
  vigil_gale_face: 'r_vigil_gale',
  vigil_cloud_bank: 'r_vigil_cloud',
  vigil_cloud_walk: 'r_vigil_cloud',
  vigil_knife_edge: 'r_vigil_gale',
  vigil_broken_span: 'r_vigil_span',
  vigil_ice_face: 'r_vigil_cloud',
  vigil_ice_chimney: 'r_ice_chimney',
  vigil_spire_neck: 'r_vigil_gale',
  vigil_spiral: 'r_vigil_cloud',
  vigil_wind_stair: 'r_vigil_gale',
  cave_entry: 'r_ice_mouth',
  cave_gallery: 'r_ice_hall',
  ice_cave_grotto: 'r_ice_grotto',
  ice_cave_hall: 'r_ice_hall',
  ice_cave_roost: 'r_ice_roost',
  ice_cave_throat: 'r_ice_mouth',
  rest_gate: 'r_rest_gate',
  rest_square: 'r_rest_square',
  rest_inn: 'r_rest_inn',
  rest_hall: 'r_rest_hall',
  rest_forge: 'r_rest_forge',
  rest_chapel: 'r_rest_chapel',
  rest_belltower: 'r_rest_belltower',
  rest_stores: 'r_rest_stores',
  rest_house_marta: 'r_rest_house',
  rest_house_pottle: 'r_rest_house',
  rest_lookout: 'r_rest_lookout',
  // Chapter 3: the Pinefall's red wood, with real birds.
  pinefall_landing: 'r_pine_floor',
  pinefall_bramble_gate: 'r_pine_floor',
  pinefall_brook: 'r_pine_brook',
  pinefall_camp: 'r_pine_camp',
  pinefall_deadfall: 'r_pine_dead',
  pinefall_maze: 'r_pine_floor',
  pinefall_quarry: 'r_pine_quarry',
  pinefall_ravine: 'r_pine_ravine',
  pinefall_rolling: 'r_pine_floor',
  pinefall_tatters: 'r_pine_tatters',
  pinefall_tumbled: 'r_pine_dead',
  // Hollin, empty for fifty years: no birds (the Hush is near), just the place.
  hollin_gate: 'r_hollin_gate',
  hollin_lane: 'r_hollin_street',
  hollin_mill: 'r_hollin_mill',
  hollin_stores: 'r_hollin_inside',
  hollin_backroom: 'r_hollin_inside',
  hollin_lookout: 'r_hollin_lookout',
  hollin_well: 'r_hollin_well',
  hollin_well_bottom: 'r_hollin_well_bottom',
  // The Hushwood: the old wood, the birds a long way off and thin.
  hush_hollow_oak: 'r_hush_oak',
  hush_felled_run: 'r_hush_wood',
  hush_gorge: 'r_hush_gorge',
  hush_kid_gap: 'r_hush_wood',
  hush_leaning_pines: 'r_hush_pines',
  hush_millrace: 'r_hush_race',
  hush_mist_edge: 'r_hush_mist',
  hush_notched: 'r_hush_wood',
  hush_sawpit: 'r_hush_sawpit',
  hush_starfall: 'r_hush_starfall',
  hush_treadles: 'r_hush_treadles',
  hush_windfall: 'r_hush_pines',
  hush_kiln: 'r_hush_kiln',
  hush_underroot: 'r_hush_roots',
  hush_rummage: 'r_hush_rummage',
  // The Old Drains.
  drains_cistern: 'r_drains_cistern',
  drains_conduit: 'r_drains_conduit',
  drains_culvert: 'r_drains_culvert',
  drains_gratings: 'r_drains_gratings',
  drains_ladle: 'r_drains_ladle',
  drains_outfall: 'r_drains_outfall',
  drains_stair: 'r_drains_stair',
  drains_sumps: 'r_drains_sumps',
  drains_vault: 'r_drains_vault',
  drains_weir: 'r_drains_weir',
  // The Lantern Marsh: real water over a still fen, the birds far off.
  marsh_clerks_islet: 'r_marsh_islet',
  marsh_falls_foot: 'r_marsh_falls',
  marsh_far_shore: 'r_marsh_shore',
  marsh_heron_flats: 'r_marsh_flats',
  marsh_hut: 'r_marsh_hut',
  marsh_hut_island: 'r_marsh_hutisland',
  marsh_jetty: 'r_marsh_jetty',
  marsh_lantern_path: 'r_marsh_path',
  marsh_rushes: 'r_marsh_rushes',
  marsh_sunken_road: 'r_marsh_road',
  marsh_tollhouse: 'r_marsh_toll',
  marsh_watergate: 'r_marsh_watergate',
  marsh_wisp_hollow: 'r_marsh_wisp',
  // Lasthome.
  lasthome_gate: 'r_lasthome_gate',
  lasthome_square: 'r_lasthome_square',
  lasthome_inn: 'r_lasthome_inn',
  lasthome_chapel: 'r_lasthome_chapel',
  lasthome_healer: 'r_lasthome_healer',
  // The Dead City and the Registry.
  city_gate_foot: 'r_city_gate',
  city_old_street: 'r_city_street',
  city_colonnade: 'r_city_colonnade',
  city_forum: 'r_city_forum',
  city_crier_square: 'r_city_crier',
  city_statue_court: 'r_city_court',
  city_aqueduct: 'r_city_aqueduct',
  city_baths: 'r_city_baths',
  city_sculptors_yard: 'r_city_yard',
  city_library: 'r_city_library',
  city_stacks: 'r_city_library',
  city_reading_room: 'r_city_library',
  registry_cellar: 'r_registry_cellar',
  registry_cleft: 'r_registry_cleft',
  registry_counting: 'r_registry_hall',
  registry_lair: 'r_registry_lair',
  registry_waiting: 'r_registry_hall',
  baths_stokehold: 'r_stokehold',
});

Object.assign(EXTRA_AMBIENCES, {
  // Chapter 1.
  r_ruins_yard: { recording: WOOD(0.08, 3500), wind: 0.1 },
  r_ruins_way: { recording: WOOD(0.05, 2500), wind: 0.2 },
  r_ruins_garden: { recording: WOOD(0.13), wind: 0.06 },
  r_ruins_hall: { hum: 0.2, drips: 0.25, wind: 0.05 },
  r_taper_house: { fire: 0.3, creaks: 0.2, recording: WOOD(0.02, 600) },
  r_taper_kitchen: { fire: 0.5, creaks: 0.15, recording: WOOD(0.02, 600) },
  // Chapter 2.
  r_stair_goat: { wind: 0.5, birds: 0.15 },
  r_stair_climb: { wind: 0.55, birds: 0.1 },
  r_stair_sheer: { wind: 0.85, whoosh: 0.15 },
  r_vigil_hollow: { wind: 0.3, birds: 0.12, timbers: 0.08 },
  r_vigil_ridge: { wind: 0.5, birds: 0.12, whoosh: 0.06 },
  r_vigil_owl: { wind: 0.4, timbers: 0.2, birds: 0.1 },
  r_vigil_vanes: { wind: 0.5, creaks: 0.4 },
  r_vigil_weathervanes: { wind: 0.65, creaks: 0.6, whoosh: 0.15 },
  r_vigil_high: { wind: 0.7, whoosh: 0.1 },
  r_vigil_ledge: { wind: 0.5, creaks: 0.2 },
  r_vigil_hut: { fire: 0.45, timbers: 0.3, wind: 0.2, muffle: 900 },
  r_vigil_gale: { wind: 1, whoosh: 0.3 },
  r_vigil_cloud: { wind: 0.7, whoosh: 0.12 },
  r_vigil_span: { wind: 0.8, creaks: 0.3 },
  r_ice_chimney: { wind: 0.35, drips: 0.3, hum: 0.3 },
  r_ice_mouth: { wind: 0.2, drips: 0.55, hum: 0.3, muffle: 1200 },
  r_ice_hall: { drips: 0.7, slowdrips: 0.2, hum: 0.5, shimmer: 0.12, muffle: 900 },
  r_ice_grotto: { drips: 0.5, slowdrips: 0.35, hum: 0.35, shimmer: 0.18, muffle: 800 },
  r_ice_roost: { drips: 0.4, hum: 0.3, far: 0.4, wind: 0.08, muffle: 800 },
  r_rest_gate: { wind: 0.25, birds: 0.2, recording: FOLK(0.01, 500) },
  r_rest_square: { wind: 0.2, birds: 0.1, hammer: 0.12, recording: FOLK(0.016, 600) },
  r_rest_inn: { fire: 0.65, creaks: 0.2, recording: FOLK(0.022, 800) },
  r_rest_hall: { fire: 0.2, recording: HALLFOLK(0.02) },
  r_rest_forge: { fire: 0.6, hammer: 0.9, recording: FOLK(0.01, 500) },
  r_rest_chapel: { hum: 0.25, creaks: 0.2, wind: 0.05 },
  r_rest_belltower: { wind: 0.5, bell: 0.25, creaks: 0.3 },
  r_rest_stores: { creaks: 0.3, wind: 0.05 },
  r_rest_house: { fire: 0.38, creaks: 0.22 },
  r_rest_lookout: { wind: 0.55, birds: 0.1 },
  // The Pinefall.
  r_pine_floor: { recording: WOOD(0.2), wind: 0.12 },
  r_pine_brook: { lapping: 0.3, recording: WOOD(0.14), wind: 0.08 },
  r_pine_camp: { fire: 0.3, recording: WOOD(0.14) },
  r_pine_dead: { wind: 0.22, creaks: 0.2, recording: WOOD(0.08, 2500) },
  r_pine_quarry: { wind: 0.2, grit: 0.2, recording: WOOD(0.08) },
  r_pine_ravine: { wind: 0.3, lapping: 0.15, recording: WOOD(0.1) },
  r_pine_tatters: { recording: WOOD(0.16), wind: 0.15, creaks: 0.15 },
  // Hollin.
  r_hollin_gate: { wind: 0.18, hum: 0.25, creaks: 0.3 },
  r_hollin_street: { wind: 0.15, hum: 0.25, shutters: 0.4 },
  r_hollin_mill: { lapping: 0.45, timbers: 0.5, hum: 0.15 },
  r_hollin_inside: { creaks: 0.3, hum: 0.15, drips: 0.1 },
  r_hollin_lookout: { wind: 0.3, hum: 0.12, creaks: 0.15 },
  r_hollin_well: { drips: 0.5, slowdrips: 0.2, hum: 0.3, muffle: 1000 },
  r_hollin_well_bottom: { drips: 0.6, slowdrips: 0.35, hum: 0.35, lapping: 0.2, muffle: 900 },
  // The Hushwood.
  r_hush_oak: { recording: WOOD(0.09, 1500), wind: 0.15, creaks: 0.15 },
  r_hush_wood: { recording: WOOD(0.06, 900), wind: 0.2, drips: 0.1 },
  r_hush_gorge: { wind: 0.35, lapping: 0.3, recording: WOOD(0.04, 900) },
  r_hush_pines: { wind: 0.3, creaks: 0.3, recording: WOOD(0.05, 900) },
  r_hush_race: { lapping: 0.8, timbers: 0.3, wind: 0.12 },
  r_hush_mist: { wind: 0.15, hum: 0.3, drips: 0.2, recording: WOOD(0.04, 800) },
  r_hush_sawpit: { recording: WOOD(0.06, 900), wind: 0.2, creaks: 0.15 },
  r_hush_starfall: { hum: 0.3, shimmer: 0.18, wind: 0.1, recording: WOOD(0.04, 900) },
  r_hush_treadles: { recording: WOOD(0.06, 900), wind: 0.2, timbers: 0.25 },
  r_hush_kiln: { fire: 0.45, creaks: 0.15, recording: WOOD(0.05, 900) },
  r_hush_roots: { drips: 0.4, slowdrips: 0.3, hum: 0.35, grit: 0.1, muffle: 900 },
  r_hush_rummage: { creaks: 0.3, drips: 0.2, hum: 0.2, muffle: 1000 },
  // The Old Drains: real water in every one.
  r_drains_cistern: { slowdrips: 0.8, lapping: 0.3, hum: 0.4, muffle: 900 },
  r_drains_conduit: { lapping: 0.55, drips: 0.4, hum: 0.3, muffle: 1100 },
  r_drains_culvert: { lapping: 0.7, drips: 0.3, hum: 0.25, muffle: 1200 },
  r_drains_gratings: { lapping: 0.35, drips: 0.5, hum: 0.3, creaks: 0.15, muffle: 1000 },
  r_drains_ladle: { drips: 0.4, hum: 0.5, creaks: 0.15, muffle: 900 },
  r_drains_outfall: { lapping: 0.65, wind: 0.25, drips: 0.15, muffle: 2400 },
  r_drains_stair: { drips: 0.5, slowdrips: 0.3, hum: 0.35, muffle: 900 },
  r_drains_sumps: { slowdrips: 0.6, lapping: 0.4, hum: 0.4, muffle: 800 },
  r_drains_vault: { slowdrips: 0.7, hum: 0.45, drips: 0.2, muffle: 800 },
  r_drains_weir: { lapping: 1, hum: 0.35, drips: 0.15, muffle: 1300 },
  // The Lantern Marsh.
  r_marsh_islet: { lakeLap: 0.4, hum: 0.25, wind: 0.15, recording: WOOD(0.06, 2000) },
  r_marsh_falls: { lapping: 0.9, lakeLap: 0.3, hum: 0.2 },
  r_marsh_shore: { lakeLap: 0.55, wind: 0.2, hum: 0.2, recording: WOOD(0.08, 2500) },
  r_marsh_flats: { lakeLap: 0.45, wind: 0.25, recording: WOOD(0.09, 2800) },
  r_marsh_hut: { fire: 0.4, lakeLap: 0.2, creaks: 0.3, muffle: 900 },
  r_marsh_hutisland: { lakeLap: 0.5, creaks: 0.25, hum: 0.2, recording: WOOD(0.07, 2500) },
  r_marsh_jetty: { lakeLap: 0.6, boats: 0.45, creaks: 0.25, hum: 0.2, recording: WOOD(0.05, 2000) },
  r_marsh_path: { lakeLap: 0.4, hum: 0.35, drips: 0.25, recording: WOOD(0.04, 1500) },
  r_marsh_rushes: { lakeLap: 0.45, wind: 0.3, recording: WOOD(0.08, 2800) },
  r_marsh_road: { lakeLap: 0.5, drips: 0.2, hum: 0.3, recording: WOOD(0.05, 1800) },
  r_marsh_toll: { drips: 0.3, lakeLap: 0.3, creaks: 0.35, hum: 0.3, muffle: 1000 },
  r_marsh_watergate: { lapping: 0.7, lakeLap: 0.35, creaks: 0.3, hum: 0.2 },
  r_marsh_wisp: { hum: 0.4, drips: 0.2, lakeLap: 0.3, far: 0.35 },
  // Lasthome.
  r_lasthome_gate: { wind: 0.2, hammer: 0.1, birds: 0.15, recording: FOLK(0.012, 600) },
  r_lasthome_square: { wind: 0.15, hammer: 0.3, birds: 0.15, recording: FOLK(0.03, 900) },
  r_lasthome_inn: { tavern: 0.5, murmur: 0.5, chatter: 0.3, fire: 0.7, creaks: 0.3 },
  r_lasthome_chapel: { hum: 0.25, creaks: 0.25, wind: 0.05 },
  r_lasthome_healer: { fire: 0.4, creaks: 0.2, recording: FOLK(0.008, 500) },
  // The Dead City.
  r_city_gate: { wind: 0.5, creaks: 0.2, hum: 0.1 },
  r_city_street: { wind: 0.3, creaks: 0.3, shutters: 0.3, hum: 0.1 },
  r_city_colonnade: { wind: 0.35, creaks: 0.2, hum: 0.15 },
  r_city_forum: { wind: 0.3, hum: 0.15, creaks: 0.2 },
  r_city_crier: { wind: 0.3, hum: 0.2, shutters: 0.3 },
  r_city_court: { wind: 0.25, lapping: 0.3, hum: 0.1 },
  r_city_aqueduct: { lapping: 0.6, wind: 0.45, hum: 0.1 },
  r_city_baths: { lapping: 0.45, drips: 0.3, hum: 0.3, muffle: 1100 },
  r_city_yard: { wind: 0.2, grit: 0.2, creaks: 0.15, hum: 0.2 },
  r_city_library: { hum: 0.35, creaks: 0.3, drips: 0.1, muffle: 1200 },
  r_registry_cellar: { drips: 0.3, hum: 0.4, slowdrips: 0.2, muffle: 1000 },
  r_registry_cleft: { wind: 0.4, hum: 0.25 },
  r_registry_hall: { hum: 0.35, creaks: 0.25, muffle: 1200 },
  r_registry_lair: { hum: 0.5, rumble: 0.2, far: 0.3, muffle: 900 },
  r_stokehold: { fire: 0.5, hum: 0.2, creaks: 0.25, drips: 0.15 },
});

// The far-off one-shots: a real bird in the wood, creaks, drips, a pebble.
Object.assign(EXTRA_EXTRAS, {
  r_ruins_yard: ['farBird', 'pebble'], r_ruins_way: ['farBird', 'pebble'], r_ruins_garden: ['farBird', 'farBird'],
  r_ruins_hall: ['farDrip', 'pebble', 'settle'], r_taper_house: ['settle', 'farCreak'], r_taper_kitchen: ['settle', 'farCreak'],
  r_stair_goat: ['pebble'], r_stair_climb: ['pebble'], r_stair_sheer: ['pebble'],
  r_vigil_hollow: ['farCreak', 'pebble'], r_vigil_vanes: ['farCreak'], r_vigil_weathervanes: ['farCreak', 'farCreak'],
  r_vigil_hut: ['settle', 'farCreak'], r_vigil_span: ['farCreak', 'pebble'],
  r_ice_chimney: ['farDrip', 'pebble'], r_ice_mouth: ['farDrip', 'pebble'], r_ice_hall: ['farDrip', 'farDrip', 'pebble'],
  r_ice_grotto: ['farDrip', 'pebble'], r_ice_roost: ['pebble', 'farDrip'],
  r_rest_gate: ['farCreak'], r_rest_square: ['farCreak'], r_rest_inn: ['settle', 'farCreak'], r_rest_hall: ['settle'],
  r_rest_forge: ['settle'], r_rest_chapel: ['settle', 'farCreak'], r_rest_belltower: ['farCreak'], r_rest_stores: ['settle', 'farCreak'],
  r_rest_house: ['settle'],
  r_pine_floor: ['farBird', 'farBird', 'twig'], r_pine_brook: ['farBird', 'twig'], r_pine_camp: ['farBird', 'settle'],
  r_pine_dead: ['farBird', 'twig', 'farCreak'], r_pine_quarry: ['farBird', 'pebble'], r_pine_ravine: ['farBird', 'pebble'],
  r_pine_tatters: ['farBird', 'farCreak', 'twig'],
  r_hollin_gate: ['farCreak', 'twig'], r_hollin_street: ['farCreak', 'twig'], r_hollin_mill: ['farCreak', 'farDrip'],
  r_hollin_inside: ['settle', 'farCreak'], r_hollin_lookout: ['farCreak', 'twig'], r_hollin_well: ['farDrip', 'pebble'],
  r_hollin_well_bottom: ['farDrip', 'pebble'],
  r_hush_oak: ['twig', 'farBird'], r_hush_wood: ['twig'], r_hush_gorge: ['twig', 'pebble'], r_hush_pines: ['twig', 'farCreak'],
  r_hush_race: ['farCreak', 'twig'], r_hush_mist: ['twig', 'farDrip'], r_hush_sawpit: ['twig', 'farCreak'],
  r_hush_starfall: ['twig'], r_hush_treadles: ['twig', 'farCreak'], r_hush_kiln: ['settle', 'twig'],
  r_hush_roots: ['pebble', 'farDrip'], r_hush_rummage: ['settle', 'farCreak'],
  r_drains_cistern: ['farDrip', 'farDrip', 'pebble'], r_drains_conduit: ['farDrip', 'pebble'], r_drains_culvert: ['farDrip', 'pebble'],
  r_drains_gratings: ['farDrip', 'farCreak'], r_drains_ladle: ['farCreak', 'farDrip'], r_drains_outfall: ['farDrip', 'farBird'],
  r_drains_stair: ['farDrip', 'pebble'], r_drains_sumps: ['farDrip', 'pebble'], r_drains_vault: ['farDrip', 'pebble'],
  r_drains_weir: ['farDrip', 'pebble'],
  r_marsh_islet: ['frog', 'farBird'], r_marsh_falls: ['frog', 'farDrip'], r_marsh_shore: ['frog', 'farBird'],
  r_marsh_flats: ['frog', 'farBird', 'farBird'], r_marsh_hut: ['settle', 'frog'], r_marsh_hutisland: ['frog', 'farCreak', 'farBird'],
  r_marsh_jetty: ['farBoat', 'frog', 'farCreak'], r_marsh_path: ['frog', 'farDrip'], r_marsh_rushes: ['frog', 'farBird'],
  r_marsh_road: ['frog', 'farDrip'], r_marsh_toll: ['farCreak', 'farDrip', 'frog'], r_marsh_watergate: ['farCreak', 'frog'],
  r_marsh_wisp: ['frog', 'farDrip'],
  r_lasthome_gate: ['farBird', 'farCreak'], r_lasthome_square: ['farBird', 'farCreak'], r_lasthome_inn: ['settle'],
  r_lasthome_chapel: ['settle', 'farCreak'], r_lasthome_healer: ['settle'],
  r_city_gate: ['farCreak', 'pebble'], r_city_street: ['farCreak', 'pebble'], r_city_colonnade: ['farCreak', 'pebble'],
  r_city_forum: ['farCreak', 'pebble'], r_city_crier: ['farCreak', 'pebble'], r_city_court: ['farDrip', 'pebble'],
  r_city_aqueduct: ['farDrip', 'pebble'], r_city_baths: ['farDrip', 'farDrip'], r_city_yard: ['farCreak', 'pebble'],
  r_city_library: ['settle', 'farCreak'], r_registry_cellar: ['farDrip', 'pebble'], r_registry_cleft: ['pebble'],
  r_registry_hall: ['settle', 'farCreak'], r_registry_lair: ['pebble', 'farCreak'], r_stokehold: ['settle', 'farDrip'],
});

// A real bird, cut from the CC0 evening wood, a long way off. Never the same one twice running.
EXTRA_SFX.farBird = [{ clip: ['../under/bird1', '../under/bird2', '../under/bird3', '../under/bird4'], volume: 0.06, rate: 1 }];
EXTRA_FEEL.farBird = { vary: 2, pan: 0.9 };

// How the cave rooms ring.
Object.assign(EXTRA_ECHO, {
  r_ice_mouth: 'cave', r_ice_hall: 'cavern', r_ice_grotto: 'cave', r_ice_roost: 'cave', r_ice_chimney: 'tunnel',
  r_hollin_well: 'tunnel', r_hollin_well_bottom: 'cave', r_hush_roots: 'tunnel',
  r_drains_cistern: 'cavern', r_drains_conduit: 'tunnel', r_drains_culvert: 'tunnel', r_drains_gratings: 'tunnel', r_drains_ladle: 'cave',
  r_drains_stair: 'tunnel', r_drains_sumps: 'cave', r_drains_vault: 'cavern', r_drains_weir: 'cave',
  r_marsh_toll: 'cave', r_registry_cellar: 'cave', r_registry_lair: 'cavern', r_city_baths: 'cave',
});
