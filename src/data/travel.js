import { WORLD_STATE } from '../state/saveGame.js';

// Travel by green updraft: a warm green wind curling up beside a save point
// in some of the places you pass through. You find them just by getting
// there: being in a room (walking in, travelling, or loading a save) finds
// every updraft at or behind it on the chapter's ROUTE, so a save made deep
// in the caves still has all the ones on the way up. You travel from save
// points: after saving, with Ves along (she rides the wind on her umbrella
// with you hanging off her boot, like a wind geyser), the TRAVEL list offers
// every updraft you've found in this chapter, and carries you to the one you
// pick. Only places in the chapter you're on (each one's `chapter`).
//
// Each one is a `travel_draft` prop in its room, with `travel` naming its id
// here, and a "!" over it until you've pressed Z on one (Ves explains them, once). `x`, `y` are its tile, which
// is also where you land when you travel to it. In route order: the list
// shows them in this order. Their descriptions are in
// text/interactions/travel.txt, one section per id.
export const TRAVEL_DRAFTS = [
  { id: 'spiral', name: 'Spiral Stair', room: 'vigil_spiral', x: 35, y: 25, chapter: 2 },
  { id: 'heralds_rest', name: "Heralds' Rest", room: 'rest_square', x: 27, y: 16, chapter: 2 },
  { id: 'wind_stair', name: 'Wind Stair', room: 'vigil_wind_stair', x: 22, y: 15, chapter: 2 },
  { id: 'weathervanes', name: 'Weathervanes', room: 'vigil_weathervanes', x: 7, y: 21, chapter: 2 },
  { id: 'grotto', name: "Goblin's Grotto", room: 'ice_cave_grotto', x: 14, y: 13, chapter: 2 },
  { id: 'owl_shelf', name: 'Last Shelf', room: 'vigil_owl_shelf', x: 10, y: 8, chapter: 2 },
];

// Each chapter's rooms in the order you climb through them, for working out
// which updraft you'd have passed to get where you are. Heralds' Rest's
// houses and shops count as its square; rooms not listed find nothing.
const ROUTE = {
  2: [
    'beyond_ruins', 'goat_track', 'climb_start', 'sheer_face', 'vigil_ridge', 'vigil_spiral', 'vigil_hollow',
    'cave_entry', 'cave_gallery', 'vigil_shoulder', 'vigil_ice_face', 'vigil_knife_edge', 'vigil_cloud_walk',
    'rest_gate', 'rest_square', 'rest_lookout', 'vigil_second_cairn', 'vigil_cloud_bank', 'vigil_high_shelf',
    'vigil_broken_span', 'vigil_wind_stair', 'vigil_lamplighters_ledge', 'vigil_lamplighters_hut',
    'vigil_gale_face', 'vigil_weathervanes', 'ice_cave_throat', 'ice_cave_grotto', 'ice_cave_hall', 'ice_cave_roost',
    'vigil_ice_chimney', 'vigil_vane_gardens', 'vigil_spire_neck', 'vigil_owl_shelf', 'vigil_summit',
  ],
};
const SAME_AS = { rest_lookout: 'rest_lookout', rest_gate: 'rest_gate' };
function routeIndex(chapter, roomId) {
  const route = ROUTE[chapter] ?? [];
  const id = SAME_AS[roomId] ?? (roomId.startsWith('rest_') ? 'rest_square' : roomId);
  return route.indexOf(id);
}

// Being in `roomId` finds every updraft of this chapter at or behind it on
// the route. Returns the ones that were new.
export function catchUpDrafts(roomId) {
  const chapter = WORLD_STATE.chapter ?? 1;
  const here = routeIndex(chapter, roomId);
  if (here < 0) return [];
  return TRAVEL_DRAFTS.filter((draft) => draft.chapter === chapter && routeIndex(chapter, draft.room) <= here && findDraft(draft.id));
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
