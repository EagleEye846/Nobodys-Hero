// THE CAPTAIN'S CABIN: the great cabin under the poop, at the stern. A narrow bunk nobody has slept in, a chart table
// with a course line that stops short, a desk with the log open on it, a rocking chair that is rocking, and three
// portraits on the bulkhead whose eyes follow you. The stern door at the west end (to the Watch Rock) is shut until the
// captain's been dealt with (captain_spared or captain_beaten). The scene captain_tarry_meets (the column at x 19, once)
// is the captain turning round, and the fight (enemy captain_tarry, backdrop ghostship_cabin, song ghostCaptainBattle).
// The chair is somewhere else each time you come back, or after the lantern's been out a while (haunt.js).
// You come in by the east door (25, rows 6-7) from the deck (11,10). The stern door (west, row 6-7) is the way OUT of the ship: onto the
// Watch Rock (wreck_watch_rock 29,8), where she lies off the fog-watch's stones. THE DEEP PART (optional, the superboss's way): a hatch in the floor at
// (8-9, 10), painted over, shut (a gate, `orlop_hatch`) until the captain's been dealt with AND you have found the iron ring at (3,9),
// which only the lantern shows. The hatch goes down to the orlop (ship_orlop).
// Tile key: # hull and bulkhead (solid)   W planking face (solid)   . cabin floor

import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_CABIN = {
  id: 'ship_cabin',
  name: 'THE CAPTAIN\'S CABIN',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.5,
  music: 'ghostShip',
  ambience: 'ghost_ship',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...Mr Pike...', '...one more tide...', '...Day forty-one...', '...I promised them...'] },
  playerStart: { x: 23, y: 7 },

  tiles: [
      '##########################',
      '##########################',
      '#WWWWWWWWWWWWWWWWWWWWWWWW#',
      '###......................#',
      '#........................#',
      '#........................#',
      '..........................',
      '..........................',
      '#........................#',
      '#........................#',
      '#........................#',
      '###......................#',
      '##########################',
      '##########################',
    ],

  // No tiles change here, but she leans, and the whole room with her.
  list: {},

  doors: [
    { x: 25, y: 6, w: 1, h: 2, to: 'ship_deck', spawn: { x: 12, y: 10 } },
    { x: 0, y: 6, w: 1, h: 2, to: 'wreck_watch_rock', spawn: { x: 29, y: 8 }, after: ['captain_spared', 'captain_beaten'], notYet: 'cabin_stern_shut' },
    { x: 8, y: 10, w: 2, h: 1, to: 'ship_orlop', spawn: { x: 3, y: 4 }, after: 'compass_set', notYet: 'cabin_hatch_shut' },
  ],

  // THE QUEST: the binnacle (11,9). Stand in front of it (11,10) with the compass glass, needle and card, once the captain is dealt with: scene compass_set, and the hatch's way opens.
  cutscenes: [
    { x: 19, y: 3, w: 1, h: 9, scene: 'captain_tarry_meets' },
    { x: 11, y: 10, w: 1, h: 1, scene: 'compass_set', gear: ['compass_glass', 'compass_needle', 'compass_card'], after: ['captain_spared', 'captain_beaten'] },
    // (2026-11-14) Ves at the stern windows (ves_at_the_stern, once), after the captain: the column at x 6, on the way west
    // to the stern door, the ring (3,9) or the windows. Off the binnacle's tile (11,10) and the hatch (8-9,10).
    { x: 6, y: 3, w: 1, h: 9, scene: 'ves_at_the_stern', after: ['captain_spared', 'captain_beaten'] },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'gs_bunk', x: 2, y: 4, text: 'cabin_bunk' },
    // With some of the three pieces, Z here says which you have and hints at the rest (`pieces`, see lookWithPieces).
    { sprite: 'gs_binnacle', x: 11, y: 9, text: 'cabin_binnacle', pieces: 'compass_pieces', until: 'compass_set', notice: 'stays' },
    { sprite: 'gs_binnacle_set', x: 11, y: 9, text: 'cabin_binnacle_set', after: 'compass_set' },
    // The way down (secret): a hatch painted over to match the boards, and its ring, only in the lantern's light.
    { sprite: 'gs_hatch_shut', x: 8, y: 10, text: 'cabin_hatch_painted', opensWith: ['orlop_hatch'], openText: 'cabin_hatch_open', until: 'compass_set' },
    // Once the compass is set and its needle points at it, the hatch can't hide any more: a faint cold light along its edges
    // and a "!" that stays, and its words point at the iron ring that lifts it. (15 Nov 2026)
    { sprite: 'gs_hatch', x: 8, y: 10, text: 'cabin_hatch_found', opensWith: ['orlop_hatch'], openText: 'cabin_hatch_open', after: 'compass_set', notice: 'stays', glow: [{ dx: 16, dy: -6, bloom: 16, strength: 0.8, flicker: 0.2, color: '170, 215, 255' }, { dx: 16, dy: -4, pool: 58, strength: 0.75, flicker: 0.2, color: '150, 200, 255' }] },
    { sprite: 'gs_ghost_ring', x: 3, y: 9, text: 'cabin_ring', lever: 'orlop_hatch', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    // Once the captain's been dealt with (2026-11-14), his own book lies shut on the chart table, left out for you: the
    // CAPTAIN'S BOOK (gear captains_book: where the compass's pieces went, the hatch, the figurehead). Take it, and it's the table again.
    { sprite: 'gs_chart_table', x: 10, y: 5, text: 'cabin_chart', until: ['captain_spared', 'captain_beaten'] },
    { sprite: 'gs_chart_table_book', x: 10, y: 5, text: 'cabin_chart_book', gives: 'captains_book', notice: true, after: ['captain_spared', 'captain_beaten'], taken: { sprite: 'gs_chart_table', text: 'cabin_chart' } },
    { sprite: 'gs_log_desk', x: 15, y: 3, text: 'cabin_desk' },
    { sprite: 'gs_trunk', x: 22, y: 3, text: 'cabin_trunk' },
    { sprite: 'gs_chair', x: 18, y: 9, text: 'cabin_chair', animation: 'gs_chair', speed: 1.4, haunt: { kind: 'shift', at: [[18, 9], [7, 9], [12, 10]] } },
    { sprite: 'gs_portrait_wife', x: 11, y: 2, text: 'cabin_portrait_wife', haunt: { kind: 'eyes', eyes: [[5, 9], [9, 9]] } },
    { sprite: 'gs_portrait_boy', x: 13, y: 2, text: 'cabin_portrait_boy', haunt: { kind: 'eyes', eyes: [[5, 9], [9, 9]] } },
    { sprite: 'gs_portrait_captain', x: 20, y: 2, text: 'cabin_portrait_captain', haunt: { kind: 'eyes', eyes: [[5, 9], [9, 9]] } },
    { sprite: 'in_barometer', x: 18, y: 2, text: 'cabin_barometer' },
    { sprite: 'in_chart', x: 22, y: 2, text: 'cabin_chart_wall' },
    { sprite: 'in_bottle_ship', x: 24, y: 5, text: 'cabin_bottle_ship' },
    { sprite: 'in_wall_lamp', x: 16, y: 2, text: 'cabin_lamp' },
    { sprite: 'in_rug_blue', x: 8, y: 7, flat: true, walkable: true },
    { sprite: 'in_boots', x: 4, y: 8, text: 'cabin_boots', flat: true, walkable: true },
    { sprite: 'gs_chalk', x: 5, y: 10, text: 'cabin_chalk', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 5, y: 5, text: 'cabin_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 6, y: 6, text: 'cabin_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 8, y: 7, text: 'cabin_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 9, y: 8, text: 'cabin_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 7, y: 9, text: 'cabin_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 5, y: 8, text: 'cabin_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_puddle', x: 14, y: 7, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 20, y: 6, flat: true, walkable: true },
    { sprite: 'gs_coil', x: 22, y: 10, flat: true, walkable: true, text: 'deck_coil' },
    { sprite: 'gs_shadow_b', x: 6, y: 8, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 6, y: 4, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 5, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 6, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 15, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 17, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 19, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 21, y: 10, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 3, y: 9, flat: true, walkable: true },
    { sprite: 'gs_post_lantern', x: 7, y: 4, text: 'dress_lantern' },
    { sprite: 'gs_post_lantern', x: 22, y: 8, text: 'dress_lantern' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_stern_window', x: 3, y: 2, text: 'cabin_window' },
    { sprite: 'gs_stern_window', x: 6, y: 2, text: 'cabin_window' },
    { sprite: 'gs_knee', x: 1, y: 2 },
    { sprite: 'gs_knee_r', x: 9, y: 2 },
    { sprite: 'gs_knee', x: 12, y: 2 },
    { sprite: 'gs_knee_r', x: 24, y: 2 },
    { sprite: 'gs_wall_lantern', x: 14, y: 2 },
    { sprite: 'gs_wall_lantern', x: 17, y: 2 },
    { sprite: 'gs_web_l', x: 3, y: 3, flat: true, walkable: true },
    { sprite: 'gs_web_r', x: 24, y: 3, flat: true, walkable: true },
    { sprite: 'gs_web_l', x: 3, y: 11, flat: true, walkable: true },
    { sprite: 'gs_web_r', x: 24, y: 11, flat: true, walkable: true },
    { sprite: 'gs_tricorn', x: 6, y: 6, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 12, y: 8, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 16, y: 6, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 20, y: 6, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 4, y: 6, flat: true, walkable: true },
    { sprite: 'gs_lantern_smashed', x: 21, y: 7, flat: true, walkable: true },
    { sprite: 'gs_bucket', x: 5, y: 10, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 14, y: 10, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_cabin ?? []),
  ],
  tileTexts: { '#': 'cabin_wall', W: 'cabin_wall' },

  // None: this is the captain's room (the fight starts from the scene).
  npcs: [

  ],
};
