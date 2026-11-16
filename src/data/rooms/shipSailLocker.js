// THE SAIL LOCKER (Chapter 5, the ghost ship's DEEP PART, optional): where the sailmaker kept her spare canvas, rolled and roped in bales, and the
// halyards that belong to each sail. Four narrow alcoves along the north wall, each with a halyard lever at its back (row 3): from the west door,
// JIB (x 5), MAIN (x 11), FORE (x 17), TOPS'L (x 23). Nothing leans in here and nothing blocks the alcoves.
// THE PUZZLE (a rope order): the way on (east, the gate at 29, rows 8-9) opens only when the four halyards are hauled IN ORDER: main, jib,
// topsail, fore (an in-order gate: a wrong one and all four go slack, start again). Readable without the lantern, three ways:
//   * each alcove's name is chalked big on the boards at its mouth (row 5), in plain sight
//   * a board on a post by the gate (27,6), with a lamp beside it, has the order chalked on it
//   * the sailmaker's ghost goes about her work: she drifts from alcove to alcove IN THE ORDER, waits at each, and hums its name as she
//     gets there ("...main...", "...jib..."), then goes back to her stool and starts again (haunt.js `drift`). Follow her round.
// You can never be shut in: nothing here blocks the hall, and the west door is always open.
// Scene ship_sail_locker_in (the west end, once). The west door (0, rows 8-9) is back to the orlop; the east door (29, rows 8-9) goes on, to the flooded bow.
// Tile key: # hull and bulkhead (solid)   W planking face (solid)   . locker floor
import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_SAIL_LOCKER = {
  id: 'ship_sail_locker',
  name: 'THE SAIL LOCKER',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.75,
  music: 'ghostShip',
  musicFrom: 'list',
  ambience: 'ghost_ship_deep',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...main first...', '...she luffs if you haul the fore early...', '...mind the jib...', '...one more stitch...'] },
  playerStart: { x: 2, y: 8 },

  tiles: [
      '##############################',
      '##############################',
      '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
      '#####.#####.#####.#####.######',
      '#####.#####.#####.#####.######',
      '#............................#',
      '#............................#',
      '#............................#',
      '..............................',
      '..............................',
      '#............................#',
      '#............................#',
      '##############################',
      '##############################',
    ],

  // Nothing leans in here any more: the list is kept only so she still creaks.
  list: {},

  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'ship_orlop', spawn: { x: 30, y: 6 } },
    { x: 29, y: 8, w: 1, h: 2, to: 'ship_flooded_bow', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [
    { x: 1, y: 8, w: 2, h: 2, scene: 'ship_sail_locker_in' },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    // A save point at the west end, after the captain and the orlop.
    { sprite: 'savepoint', x: 4, y: 6, save: true },
    { sprite: 'lever', x: 5, y: 3, text: 'locker_jib', lever: 'sl_jib' },
    { sprite: 'lever', x: 11, y: 3, text: 'locker_main', lever: 'sl_main' },
    { sprite: 'lever', x: 17, y: 3, text: 'locker_fore', lever: 'sl_fore' },
    { sprite: 'lever', x: 23, y: 3, text: 'locker_tops', lever: 'sl_tops' },
    // Each alcove's name, chalked big at its mouth, in plain sight.
    { sprite: 'gs_chalk_jib', x: 5, y: 5, text: 'locker_tag_jib', flat: true, walkable: true },
    { sprite: 'gs_chalk_main', x: 11, y: 5, text: 'locker_tag_main', flat: true, walkable: true },
    { sprite: 'gs_chalk_fore', x: 17, y: 5, text: 'locker_tag_fore', flat: true, walkable: true },
    { sprite: 'gs_chalk_tops', x: 23, y: 5, text: 'locker_tag_tops', flat: true, walkable: true },
    // The bales, stacked and roped along the south wall where they belong.
    { sprite: 'gs_bale', x: 5, y: 11, text: 'locker_bale' },
    { sprite: 'gs_bale', x: 11, y: 11, text: 'locker_bale' },
    { sprite: 'gs_bale', x: 17, y: 11, text: 'locker_bale' },
    { sprite: 'gs_bale', x: 23, y: 11, text: 'locker_bale' },
    { sprite: 'gs_bulk_door_top', x: 29, y: 8, text: 'locker_gate', opensWith: ['sl_main', 'sl_jib', 'sl_tops', 'sl_fore'], inOrder: true, openText: 'locker_gate_open', resetText: 'locker_gate_reset' },
    { sprite: 'gs_side_door', x: 29, y: 9, text: 'locker_gate', opensWith: ['sl_main', 'sl_jib', 'sl_tops', 'sl_fore'], inOrder: true, openText: 'locker_gate_open', resetText: 'locker_gate_reset', openLook: 'gs_side_door_open', ajarLook: 'gs_side_door_ajar' },
    // The sailmaker, going about her work: her stool, then the alcoves in the order the gate wants, humming each one's name.
    { sprite: 'gs_ghost_old', x: 9, y: 7, text: 'ghost_sailmaker', animation: 'gs_ghost_old', speed: 1.0, walkable: true,
      haunt: { kind: 'ghost', drift: { at: [[9, 7], [11, 5], [5, 5], [23, 5], [17, 5]], stay: 2.6, speed: 20, hum: ['...one more stitch...', '...main...', '...jib...', "...tops'l...", '...and the fore, last...'] } } },
    // The order, chalked on a board on a post by the gate, with a lamp beside it (in plain sight).
    { sprite: 'gs_owners_board', x: 27, y: 6, text: 'locker_chalk' },
    { sprite: 'gs_post_lantern', x: 28, y: 6, text: 'dress_lantern' },
    { sprite: 'gs_handprint', x: 2, y: 5, text: 'hold_handprint', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 8, y: 7, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 20, y: 9, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_sail_heap', x: 8, y: 10, text: 'locker_sails', flat: true, walkable: true },
    { sprite: 'gs_sail_heap', x: 21, y: 11, text: 'locker_sails', flat: true, walkable: true },
    { sprite: 'gs_net_heap', x: 13, y: 5, text: 'locker_needle', flat: true, walkable: true },
    { sprite: 'in_stool_mug', x: 9, y: 6, text: 'locker_stool' },
    { sprite: 'c5_barrels', x: 2, y: 10, text: 'hold_barrels' },
    { sprite: 'c5_crates_stack', x: 26, y: 5, text: 'hold_crates' },
    { sprite: 'gold_pouch', x: 27, y: 11, text: 'locker_purse', gold: 140, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gs_coil', x: 15, y: 6, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 24, y: 7, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_wall_lantern', x: 3, y: 2 },
    { sprite: 'gs_wall_lantern', x: 8, y: 2 },
    { sprite: 'gs_wall_lantern', x: 14, y: 2 },
    { sprite: 'gs_wall_lantern', x: 20, y: 2 },
    { sprite: 'gs_wall_lantern', x: 26, y: 2 },
    { sprite: 'gs_knee_r', x: 4, y: 2 },
    { sprite: 'gs_knee', x: 9, y: 2 },
    { sprite: 'gs_knee_r', x: 12, y: 2 },
    { sprite: 'gs_knee_r', x: 16, y: 2 },
    { sprite: 'gs_knee', x: 21, y: 2 },
    { sprite: 'gs_knee', x: 25, y: 2 },
    { sprite: 'gs_puddle', x: 6, y: 8, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 16, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 10, y: 8, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 22, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 4, y: 10, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 12, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 18, y: 7, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 7, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 19, y: 5, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 1, y: 11, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 25, y: 6, flat: true, walkable: true },
    { sprite: 'gs_web_l', x: 1, y: 4, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 10, y: 11, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 14, y: 11, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 15, y: 10, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_sail_locker ?? []),
  ],
  tileTexts: { '#': 'hold_wall', W: 'hold_wall' },
  // The deckhand patrols the south of the hall (row 10, x 13-16) and the powder monkey the north-east of it (row 7, x 19-22). Neither is in an alcove's
  // column (x 5, 11, 17, 23), on row 5 where the sailmaker walks, on the gate or the scene's tiles (1-3, rows 8-10).

  npcs: [
    { enemy: 'ghost_deckhand', x: 14, y: 10, patrol: [13, 16], behaviour: 'patrol', lantern: 'flee' },
    { enemy: 'powder_monkey', x: 20, y: 7, patrol: [19, 22], behaviour: 'patrol', lantern: 'freeze' },
  ],
};
