// THE SAIL LOCKER (Chapter 5, the ghost ship's DEEP PART, optional): where the sailmaker kept her spare canvas, rolled and roped in bales, and the
// halyards that belong to each sail. Four narrow alcoves along the north wall, each with a halyard lever at its back (3) and each mouth stopped
// by a loose BALE of canvas (it rolls with the list): the JIB's (x 5) and the FORE's (x 17) are stopped while she leans to STARBOARD and clear
// to PORT; the MAIN's (x 11) and the TOPSAIL's (x 23) the other way (clear to STARBOARD, stopped to PORT). The way on (east, the gate at 28, rows
// 8-9) opens only when the four halyards are hauled IN ORDER: main, jib, topsail, fore (an in-order gate: a wrong one resets all four). The order is
// told only in the lantern: the sailmaker's ghost at (14,8) and her chalk by the gate. So: lean her, haul one, lean her the other way, haul the next.
// Two tackles (3,6) and (26,10) turn her from the hall. You can never be shut in: nothing here blocks the hall, and the west door is always open.
// Scene ship_sail_locker_in (the west end, once). The west door (0, rows 8-9) is back to the orlop; the east door (29, rows 8-9) goes on, to the flooded bow.
// Tile key: # hull and bulkhead (solid)   W planking face (solid)   . locker floor
export const SHIP_SAIL_LOCKER = {
  id: 'ship_sail_locker',
  name: 'THE SAIL LOCKER',
  area: 'ghostship',
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

  // No tiles change here, but she leans, and the whole room with her.
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
    { sprite: 'gs_trim_line', x: 3, y: 6, text: 'locker_trim', listWheel: { to: 'toggle', port: 'locker_port', star: 'locker_star', busy: 'locker_busy', already: 'locker_already' } },
    { sprite: 'gs_trim_line', x: 26, y: 10, text: 'locker_trim', listWheel: { to: 'toggle', port: 'locker_port', star: 'locker_star', busy: 'locker_busy', already: 'locker_already' } },
    { sprite: 'lever', x: 5, y: 3, text: 'locker_jib', lever: 'sl_jib' },
    { sprite: 'lever', x: 11, y: 3, text: 'locker_main', lever: 'sl_main' },
    { sprite: 'lever', x: 17, y: 3, text: 'locker_fore', lever: 'sl_fore' },
    { sprite: 'lever', x: 23, y: 3, text: 'locker_tops', lever: 'sl_tops' },
    { sprite: 'gs_bale', x: 5, y: 4, text: 'locker_bale', loose: { port: [5, 11], star: [5, 4], seconds: 1.8 } },
    { sprite: 'gs_bale', x: 11, y: 4, text: 'locker_bale', loose: { port: [11, 4], star: [11, 11], seconds: 1.8 } },
    { sprite: 'gs_bale', x: 17, y: 4, text: 'locker_bale', loose: { port: [17, 11], star: [17, 4], seconds: 1.8 } },
    { sprite: 'gs_bale', x: 23, y: 4, text: 'locker_bale', loose: { port: [23, 4], star: [23, 11], seconds: 1.8 } },
    { sprite: 'gs_bulk_door', x: 28, y: 8, text: 'locker_gate', opensWith: ['sl_main', 'sl_jib', 'sl_tops', 'sl_fore'], inOrder: true, openText: 'locker_gate_open', resetText: 'locker_gate_reset' },
    { sprite: 'gs_bulk_door', x: 28, y: 9, text: 'locker_gate', opensWith: ['sl_main', 'sl_jib', 'sl_tops', 'sl_fore'], inOrder: true, openText: 'locker_gate_open', resetText: 'locker_gate_reset' },
    { sprite: 'gs_ghost_old', x: 14, y: 8, text: 'ghost_sailmaker', animation: 'gs_ghost_old', speed: 1.0, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_chalk', x: 26, y: 8, text: 'locker_chalk', flat: true, walkable: true, haunt: { kind: 'unseen' } },
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
  ],
  tileTexts: { '#': 'hold_wall', W: 'hold_wall' },
  // The deckhand patrols the south of the hall (row 10, x 13-16) and the powder monkey the north-east of it (row 6, x 19-22). Neither is in an alcove's column (x 5, 11, 17, 23), on a gate, a tackle, the bales' lanes or the scene's tiles (1-2, rows 8-9).

  npcs: [
    { enemy: 'ghost_deckhand', x: 14, y: 10, patrol: [13, 16], behaviour: 'patrol', lantern: 'flee' },
    { enemy: 'powder_monkey', x: 20, y: 6, patrol: [19, 22], behaviour: 'patrol', lantern: 'freeze' },
  ],
};
