import { WORLD_STATE } from '../state/saveGame.js';

// Travel by green updraft: a warm green wind curling up beside a save point
// in some of the places you pass through. You find them just by getting
// there: being in a room (walking in, travelling, or loading a save) finds
// the updraft in it, and every updraft at or behind it on the chapter's ROUTE,
// so a save made deep in the caves still has all the ones on the way up. You
// travel from save points: after saving, with Ves along (she rides the wind on
// her umbrella with you hanging off her boot, like a wind geyser; hand in hand
// once she's offered you her hand), the TRAVEL list offers every updraft
// you've found in this chapter, and carries you to the one you pick. Only
// places in the chapter you're on (each one's `chapter`).
//
// Each one is a `travel_draft` prop in its room, with `travel` naming its id
// here, and a "!" over it until you've pressed Z on one (Ves explains them, once). `x`, `y` are its tile, which
// is also where you land when you travel to it. In route order: the list
// shows them in this order. Their descriptions are in
// text/interactions/travel.txt, one section per id.
export const TRAVEL_DRAFTS = [
  { id: 'spiral', name: 'Spiral Stair', room: 'vigil_spiral', x: 40, y: 25, chapter: 2 },
  { id: 'heralds_rest', name: "Heralds' Rest", room: 'rest_square', x: 27, y: 16, chapter: 2 },
  { id: 'wind_stair', name: 'Wind Stair', room: 'vigil_wind_stair', x: 22, y: 15, chapter: 2 },
  { id: 'weathervanes', name: 'Weathervanes', room: 'vigil_weathervanes', x: 5, y: 20, chapter: 2 },
  { id: 'grotto', name: "Goblin's Grotto", room: 'ice_cave_grotto', x: 9, y: 13, chapter: 2 },
  { id: 'owl_shelf', name: 'Last Shelf', room: 'vigil_owl_shelf', x: 11, y: 10, chapter: 2 },

  // Chapter 4, under the ground. None up in Sunnyside: the way down is a fall.
  { id: 'glimmer_landing', name: 'Glimmering Landing', room: 'glimmer_landing', x: 27, y: 10, chapter: 4 },
  { id: 'quiet_grotto', name: 'Quiet Grotto', room: 'glimmer_tuck', x: 24, y: 10, chapter: 4 },
  { id: 'belowtown', name: 'Belowtown Square', room: 'belowtown_square', x: 16, y: 8, chapter: 4 },
  { id: 'old_seam', name: 'Old Seam', room: 'diggings_old_seam', x: 2, y: 5, chapter: 4 },
  { id: 'stillwater_shore', name: 'Stillwater Shore', room: 'stillwater_shore', x: 2, y: 6, chapter: 4 },
  { id: 'far_shore', name: 'Far Shore', room: 'stillwater_far_shore', x: 10, y: 7, chapter: 4 },
  { id: 'heros_camp', name: "Hero's Camp", room: 'deep_heros_camp', x: 20, y: 6, chapter: 4 },

  // Chapter 5, down the coast.
  { id: 'windmill', name: 'Windmill', room: 'sunny_windmill', x: 35, y: 8, chapter: 5 },
  { id: 'sea_view', name: 'Sea View', room: 'sunny_sea_view', x: 16, y: 8, chapter: 5 },
  { id: 'boardwalk', name: 'Boardwalk', room: 'wrack_boardwalk', x: 21, y: 16, chapter: 5 },
  { id: 'wreck_slip', name: 'Wreck Yard Slip', room: 'wreck_slip', x: 7, y: 5, chapter: 5 },
  { id: 'way_down', name: 'Way Down', room: 'lanes_down', x: 9, y: 5, chapter: 5 },
  { id: 'orlas_forge', name: "Orla's Forge", room: 'isles_forge', x: 16, y: 7, chapter: 5 },
  { id: 'haddocks_light', name: "Haddock's Light", room: 'haddock_light_door', x: 10, y: 7, chapter: 5 },
  { id: 'tower_foot', name: 'Foot of the Tower', room: 'lastlight_foot', x: 6, y: 6, chapter: 5 },
];

// Each chapter's rooms in the order you come through them, for working out
// which updraft you'd have passed to get where you are. Heralds' Rest's
// houses and shops count as its square; rooms not listed find only the
// updraft in them, if any.
//
// A chapter that isn't one straight road has more than one line: the main
// way, and a line for each side way (its own rooms after the main way's
// rooms up to where it turns off). Being in a room finds every updraft at or
// behind it on any line it's on.
const CH4_MAIN = [
  'sunny_gate_field', 'sunny_lane', 'sunny_brook', 'sunny_soft_field',
  'glimmer_landing', 'glimmer_shelf', 'glimmer_prism_hall', 'glimmer_geode', 'glimmer_echo_falls', 'glimmer_vug',
  'glimmer_tuck', 'glimmer_crystal_bridge', 'glimmer_kings_road',
  'belowtown_gate', 'belowtown_market', 'belowtown_square', 'belowtown_inn', 'belowtown_forge', 'belowtown_hall_of_the_visit', 'belowtown_throne',
  'diggings_pithead', 'diggings_cart_yard', 'diggings_switchback', 'diggings_old_seam', 'diggings_trestle',
  'diggings_flooded_drift', 'diggings_cave_in', 'diggings_lift',
  'stillwater_shore', 'stillwater_isles', 'stillwater_reeds', 'stillwater_sunken_hall', 'stillwater_far_shore', 'stillwater_stair_down',
  'deep_first_dark', 'deep_hidden_vug', 'deep_crawl', 'deep_heros_camp', 'deep_keepers_fire', 'deep_root', 'deep_way_up', 'deep_last_flight',
  'belowtown_collapse', 'belowtown_secret_way', 'belowtown_long_rope',
];
// Off the Old Seam: Seam Nine and the star's workings past it.
const CH4_STAR_SEAM = [
  ...CH4_MAIN.slice(0, CH4_MAIN.indexOf('diggings_old_seam') + 1),
  'diggings_lost_seam', 'diggings_star_scorch', 'diggings_star_spill', 'diggings_star_siding', 'diggings_star_glass',
  'diggings_star_gallery', 'diggings_star_camp', 'diggings_star_pool',
];
const CH5_MAIN = [
  'sunny_gate_field', 'sunny_lane', 'sunny_brook', 'sunny_soft_field', 'sunny_hayfields', 'sunny_dandelion_hill',
  'sunny_windmill', 'sunny_orchard', 'sunny_mill_pond', 'sunny_last_farm', 'sunny_cliff_meadow', 'sunny_sea_view',
  'sunny_cliff_cave', 'sunny_cliff_hollow',
  'gullrest_cliff_steps', 'gullrest_beach', 'gullrest_lifeboat_house', 'gullrest_cove', 'gullrest_jetty',
  'wrack_landing', 'wrack_headland', 'wrack_pools', 'wrack_gaps', 'wrack_dunes', 'wrack_tide_clock', 'wrack_bathtub', 'wrack_boardwalk',
  'saltcombe_quay', 'saltcombe_harbour_office', 'saltcombe_inn', 'saltcombe_market', 'saltcombe_chandlery',
  'saltcombe_town_hall', 'saltcombe_lagoon', 'saltcombe_lookout',
  'wreck_gate', 'wreck_hull', 'wreck_pumps', 'wreck_fog', 'wreck_galley', 'wreck_mast', 'wreck_slip',
  'wreck_under_point', 'wreck_watch_rock',
  'lanes_fork', 'lanes_causeway', 'lanes_sluices', 'lanes_hamlet', 'lanes_mill', 'lanes_bubble', 'lanes_down',
  'merrow_steps', 'merrow_rooftops', 'merrow_square', 'merrow_house', 'merrow_high_street', 'merrow_tower_lane',
  'merrow_belfry', 'merrow_sea_gate',
  'soundings_mouth', 'soundings_echo_hall', 'soundings_tide_stair', 'soundings_three_wells', 'soundings_drowned_chapel',
  'soundings_weight_room', 'soundings_up',
  'isles_landing', 'isles_east_light', 'isles_old_lightroom', 'isles_bridge', 'isles_forge', 'isles_west_light', 'isles_gannet_stack', 'isles_causeway',
  'haddock_light_door', 'haddock_light_parlour', 'haddock_light_stair', 'haddock_light_corries_room',
  'reach_first_rock', 'reach_reef', 'reach_wreck', 'reach_eye', 'reach_foot',
  'lastlight_foot', 'lastlight_stair', 'lastlight_sluice', 'lastlight_gallery', 'lastlight_upper', 'lastlight_lamp', 'lastlight_balcony',
];
// The Fair Return, off the Wreck Yard (the way out to her is past the slip).
const CH5_SHIP = [
  ...CH5_MAIN.slice(0, CH5_MAIN.indexOf('wreck_watch_rock') + 1),
  'ship_plank', 'ship_deck', 'ship_quarters', 'ship_gundeck', 'ship_hold', 'ship_bilge', 'ship_rigging', 'ship_cabin',
  'ship_orlop', 'ship_sail_locker', 'ship_flooded_bow', 'ship_figurehead_perch',
];
const ROUTE = {
  2: [
    'beyond_ruins', 'goat_track', 'climb_start', 'sheer_face', 'vigil_ridge', 'vigil_spiral', 'vigil_hollow',
    'cave_entry', 'cave_gallery', 'vigil_shoulder', 'vigil_ice_face', 'vigil_knife_edge', 'vigil_cloud_walk',
    'rest_gate', 'rest_square', 'rest_lookout', 'vigil_second_cairn', 'vigil_cloud_bank', 'vigil_high_shelf',
    'vigil_broken_span', 'vigil_wind_stair', 'vigil_lamplighters_ledge', 'vigil_lamplighters_hut',
    'vigil_gale_face', 'vigil_weathervanes', 'ice_cave_throat', 'ice_cave_grotto', 'ice_cave_hall', 'ice_cave_roost',
    'vigil_ice_chimney', 'vigil_vane_gardens', 'vigil_spire_neck', 'vigil_owl_shelf', 'vigil_summit',
  ],
  4: [CH4_MAIN, CH4_STAR_SEAM],
  5: [CH5_MAIN, CH5_SHIP],
};
// Secret rooms count as the room you find them from.
const ALIASES = {
  secret_sunny_burrow: 'sunny_orchard', secret_gull_hoard: 'gullrest_cove', secret_wrack_hulk: 'wrack_dunes',
  secret_haddocks_shed: 'saltcombe_harbour_office', secret_wreck_pocket: 'wreck_fog', secret_lanes_attic: 'lanes_hamlet', secret_lanes_door: 'lanes_sluices',
  secret_merrow_ringers: 'merrow_square', secret_soundings_bell: 'soundings_echo_hall', secret_isles_cave: 'isles_bridge',
  secret_lastlight_den: 'lastlight_gallery', secret_ship_post: 'ship_hold',
  // The optional ring climbs (2026-11-14).
  wreck_chain_cliff: 'wreck_gate', reach_needle: 'reach_foot',
};
const SAME_AS = { rest_lookout: 'rest_lookout', rest_gate: 'rest_gate' };
function placeOf(roomId) {
  if (ALIASES[roomId]) return ALIASES[roomId];
  return SAME_AS[roomId] ?? (roomId.startsWith('rest_') ? 'rest_square' : roomId);
}
// A chapter's lines: one straight road is a single list of rooms.
function routeLines(chapter) {
  const route = ROUTE[chapter] ?? [];
  return typeof route[0] === 'string' ? [route] : route;
}
// Whether being in `roomId` means you've passed the updraft in `draftRoom`.
function passed(chapter, draftRoom, roomId) {
  if (draftRoom === roomId) return true;
  const here = placeOf(roomId);
  const there = placeOf(draftRoom);
  return routeLines(chapter).some((line) => {
    const at = line.indexOf(here);
    const from = line.indexOf(there);
    return at >= 0 && from >= 0 && from <= at;
  });
}

// Being in `roomId` finds the updraft in it and every one of this chapter at
// or behind it on the route. Returns the ones that were new.
export function catchUpDrafts(roomId) {
  const chapter = WORLD_STATE.chapter ?? 1;
  return TRAVEL_DRAFTS.filter((draft) => draft.chapter === chapter && passed(chapter, draft.room, roomId) && findDraft(draft.id));
}

export function travelDraft(id) {
  return TRAVEL_DRAFTS.find((draft) => draft.id === id) ?? null;
}

// The ones you've found in the chapter you're on, in route order.
export function foundDrafts() {
  const found = WORLD_STATE.travelDrafts ?? [];
  const chapter = WORLD_STATE.chapter ?? 1;
  return TRAVEL_DRAFTS.filter((draft) => found.includes(draft.id) && draft.chapter === chapter);
}

// The one in a room, if it has one.
export function draftIn(roomId) {
  return TRAVEL_DRAFTS.find((draft) => draft.room === roomId) ?? null;
}

// Finds one. Returns true if it's new.
export function findDraft(id) {
  WORLD_STATE.travelDrafts ??= [];
  if (WORLD_STATE.travelDrafts.includes(id)) return false;
  WORLD_STATE.travelDrafts.push(id);
  return true;
}

// For the checks (tools/preview.html): every chapter's route rooms and aliases.
export const TRAVEL_ROUTES = { ROUTE, ALIASES };
