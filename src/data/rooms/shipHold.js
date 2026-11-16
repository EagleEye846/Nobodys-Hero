// THE HOLD: the Fair Return's cargo hold, the biggest room in her and the darkest: stacks of crates and sacks to the beams,
// a row of barrels, chains, and between the stacks two long AISLES (the north, rows 3-4, and the south, rows 13-14)
// joined by five passages: the west (x 2-3), x 11-12, the channel (x 20-21), x 28-29 and the east (x 34-35). No lean
// here and nothing to turn: every way is open. THE CHASE is the room. The Bosun, a ghost sailor asleep at his post in
// the south-west, wakes when you pass x 12 (ship_hold_chase) and hunts you at 82 px/s (walking is 70, running 130).
// Three ways to live through it:
//   * run: he is slower than you running, and the way out is at the east end
//   * the lantern: he stops dead in its light (lantern: 'freeze')
//   * HIDE: eight NOOKS, gaps a body wide in the faces of the stacks along both aisles (north (8,5) (16,5) (25,5) (32,5),
//     south (7,12) (16,12) (25,12) (31,12)), each a dark slot with a shadow in it. Step in, stand still and put the
//     lantern OUT, and he loses you: he stops, wonders where you went, and walks slowly back to his post (haunt.js
//     `nooks`). For a few seconds he can't see you at all; after that, in the dark he only notices you close to, but
//     with the lantern lit he sees it from anywhere.
// Caught, it is a fight with a deckhand. After the chase (later visits) he is awake at his post, prowling, not asleep.
// Leave by the east: up to the deck hatch (34-35, row 3), down to the bilge (34-35, row 14). The way up to the gun deck
// is the ladder at the NW (2-3, row 3). A boarded door in the west wall (1,8), with a ring only the lantern shows (3,10),
// is the purser's locker (the secret).
// Scenes: ship_hold_in (just under the NW ladder, once: she lurches to port, the dark closes in), ship_hold_chase
// (across every aisle east, once, after ship_hold_in: the Bosun wakes).
// Tile key: # hull and bulkhead (solid)   W planking face (solid)   . hold floor   B cargo stacks (24 high, drawn as crates: too tall to climb)

import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_HOLD = {
  id: 'ship_hold',
  name: 'THE HOLD',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.25,
  music: 'ghostShip',
  musicFrom: 'list',
  ambience: 'ghost_ship_deep',
  vesWell: true,
  indoors: true,
  // The haunting: whispers, the lights going low; `chaseSong` is what plays while something is after you (haunt.js).
  cargo: [{ x: 4, y: 5, w: 16, h: 8 }, { x: 22, y: 5, w: 12, h: 8 }],
  // `nooks`: the gaps in the stacks you can hide in (lantern out, standing still: haunt.js).
  haunt: { whispers: ['...hold her steady...', '...is it morning...', '...Day forty-one...', '...nobody leaves...'], chaseSong: 'ghostShipChase',
    nooks: [[8, 5], [16, 5], [25, 5], [32, 5], [7, 12], [16, 12], [25, 12], [31, 12]] },
  playerStart: { x: 3, y: 4 },

  tiles: [
      '######################################',
      '######################################',
      '##WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW##',
      '##..................................##',
      '##..................................##',
      '##..BBBB.BB..BBB.BB...BBB.BB..BB.B..##',
      '##..BBBBBBB..BBBBBBB..BBBBB...BBBB..##',
      '##..BBBBBBB..BBBBBBB..BBBBBB...BBB..##',
      '#...BBBBBBB..BBBBBBB..BBBBBB..BBBB..##',
      '##..BBBBBBB..BBBBBBB..BBBBBB..BBBB..##',
      '##..BBBBBBB..BBBBBBB..BBBBBB..BBBB..##',
      '##..BBBBBBB..BBBBBBB..BBBBBB..BBBB..##',
      '##..BBB.BBB...BB.BBB..BBB.BB..B.BB..##',
      '##..................................##',
      '##..................................##',
      '######################################',
      '######################################',
      '######################################',
    ],

  // Nothing leans in here any more (no wheel, nothing loose): the list is kept only so she still creaks.
  list: {},

  doors: [
    { x: 2, y: 3, w: 2, h: 1, to: 'ship_gundeck', spawn: { x: 33, y: 6 } },
    { x: 34, y: 3, w: 2, h: 1, to: 'ship_deck', spawn: { x: 29, y: 12 } },
    { x: 34, y: 14, w: 2, h: 1, to: 'ship_bilge', spawn: { x: 3, y: 5 } },
    { x: 1, y: 8, w: 1, h: 1, to: 'secret_ship_post', spawn: { x: 6, y: 7 } },
  ],

  // ship_hold_in covers the tile you arrive on (3,4), so it plays as you come off the ladder.
  // ship_hold_chase has three lines, one across each way east: the north aisle (x 12), the
  // middle aisle (x 11-12, row 6) and the west aisle (x 2-3, row 7). You can't slip past it.
  cutscenes: [
    { x: 2, y: 4, w: 3, h: 2, scene: 'ship_hold_in' },
    { x: 12, y: 3, w: 1, h: 2, scene: 'ship_hold_chase', after: 'ship_hold_in' },
    { x: 11, y: 6, w: 2, h: 1, scene: 'ship_hold_chase', after: 'ship_hold_in' },
    { x: 2, y: 7, w: 2, h: 1, scene: 'ship_hold_chase', after: 'ship_hold_in' },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    // The nooks: a dark gap in the face of each stack, a body wide (see `nooks` above).
    { sprite: 'gs_nook', x: 8, y: 5, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 16, y: 5, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 25, y: 5, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 32, y: 5, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 7, y: 12, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 16, y: 12, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 25, y: 12, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_nook', x: 31, y: 12, text: 'hold_nook', flat: true, walkable: true },
    { sprite: 'gs_ladder', x: 2, y: 3, flat: true, walkable: true, text: 'hold_ladder_up' },
    { sprite: 'gs_ladder', x: 3, y: 3, flat: true, walkable: true, text: 'hold_ladder_up' },
    { sprite: 'gs_ladder', x: 34, y: 3, flat: true, walkable: true, text: 'hold_ladder_deck' },
    { sprite: 'gs_ladder', x: 35, y: 3, flat: true, walkable: true, text: 'hold_ladder_deck' },
    { sprite: 'gs_bilge_hatch_open', x: 34, y: 14, flat: true, walkable: true, text: 'hold_hatch_bilge' },
    { sprite: 'gs_bilge_hatch_open', x: 35, y: 14, flat: true, walkable: true, text: 'hold_hatch_bilge' },
    { sprite: 'gs_side_door_low', x: 1, y: 8, text: 'hold_boarded', opensWith: ['post_door'], openText: 'hold_boarded_open', openLook: 'gs_side_door_low_open', ajarLook: 'gs_side_door_low_ajar' },
    { sprite: 'gs_ghost_ring', x: 3, y: 10, text: 'hold_ring', lever: 'post_door', flat: true, walkable: true, haunt: { kind: 'unseen', glint: true } },
    { sprite: 'gs_ghost_old', x: 30, y: 4, text: 'ghost_hold_old', animation: 'gs_ghost_old', speed: 1.0, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_boy', x: 8, y: 13, text: 'ghost_hold_boy', animation: 'gs_ghost_boy', speed: 0.7, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_chalk', x: 12, y: 2, text: 'hold_chalk', walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 5, y: 4, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 3, y: 7, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 3, y: 9, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_handprint', x: 5, y: 2, text: 'hold_handprint', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'c5_crates_stack', x: 7, y: 3, text: 'hold_crates' },
    { sprite: 'c5_barrels', x: 10, y: 4, text: 'hold_barrels' },
    { sprite: 'c5_barrels', x: 27, y: 4, text: 'hold_barrels' },
    { sprite: 'c5_crates_stack', x: 31, y: 3, text: 'hold_crates' },
    { sprite: 'c5_crate', x: 14, y: 14, text: 'hold_crates' },
    { sprite: 'c5_barrel', x: 26, y: 14, text: 'hold_barrels' },
    { sprite: 'c5_barrels', x: 7, y: 14, text: 'hold_barrels' },
    { sprite: 'wy_chain_pile', x: 18, y: 13, text: 'hold_chain', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 13, y: 4, flat: true, walkable: true, text: 'deck_coil' },
    { sprite: 'gs_coil', x: 25, y: 13, flat: true, walkable: true, text: 'deck_coil' },
    { sprite: 'gs_puddle', x: 9, y: 7, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 31, y: 8, flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 21, y: 8, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 28, y: 14, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 16, y: 14, flat: true, walkable: true },
    { sprite: 'in_wall_lamp', x: 17, y: 2, text: 'hold_lamp' },
    { sprite: 'gs_shadow_b', x: 34, y: 12, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 34, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 3, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 28, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 7, y: 14, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 2, y: 4, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 3, y: 11, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 13, y: 3, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 25, y: 13, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 3, y: 4, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 20, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 5, y: 13, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 3, y: 13, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 2, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 29, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 33, y: 3, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 21, y: 12, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 27, y: 6, flat: true, walkable: true },
    { sprite: 'gs_net_drape', x: 10, y: 2, text: 'dress_net' },
    { sprite: 'gs_net_drape', x: 3, y: 2, text: 'dress_net' },
    { sprite: 'c5_ship_ribs', x: 3, y: 15, flat: true, walkable: true, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 11, y: 15, flat: true, walkable: true, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 19, y: 15, flat: true, walkable: true, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 27, y: 15, flat: true, walkable: true, text: 'bilge_ribs' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_knee', x: 5, y: 2 },
    { sprite: 'gs_knee_r', x: 8, y: 2 },
    { sprite: 'gs_knee', x: 12, y: 2 },
    { sprite: 'gs_knee_r', x: 16, y: 2 },
    { sprite: 'gs_knee', x: 20, y: 2 },
    { sprite: 'gs_knee_r', x: 24, y: 2 },
    { sprite: 'gs_knee', x: 28, y: 2 },
    { sprite: 'gs_knee_r', x: 32, y: 2 },
    { sprite: 'gs_wall_lantern', x: 10, y: 2 },
    { sprite: 'gs_wall_lantern', x: 22, y: 2 },
    { sprite: 'gs_wall_lantern', x: 30, y: 2 },
    { sprite: 'gs_knee', x: 6, y: 15 },
    { sprite: 'gs_knee_r', x: 18, y: 15 },
    { sprite: 'gs_knee', x: 31, y: 15 },
    { sprite: 'gs_wall_lantern', x: 12, y: 15 },
    { sprite: 'gs_wall_lantern', x: 26, y: 15 },
    { sprite: 'gs_web_l', x: 2, y: 14, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 8, y: 4, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 25, y: 13, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 14, y: 4, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 33, y: 13, flat: true, walkable: true },
    { sprite: 'gs_crate_smashed', x: 20, y: 14, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 6, y: 13, flat: true, walkable: true },
    { sprite: 'gs_net_heap', x: 27, y: 4, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 21, y: 13, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 17, y: 4, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 11, y: 13, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 30, y: 14, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 3, y: 13, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 22, y: 4, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_hold ?? []),
  ],
  tileTexts: { '#': 'hold_wall', W: 'hold_wall', B: 'hold_stack' },

  // The Bosun sleeps at (4,13) until ship_hold_chase wakes him; after that scene (a later visit) he is awake at his post from the start, and only notices
  // you close to in the dark, or your lantern from anywhere (haunt.js `nooks`). Both share one key, so beaten once he stays beaten. The powder monkey
  // patrols the east end of the south aisle (row 14, x 27-32). None stands on a door, a nook, the passages or the scenes' rows.
  npcs: [
    { enemy: 'ghost_deckhand', key: 'ship_hold:bosun', x: 4, y: 13, patrol: [4, 4], behaviour: 'chase', lantern: 'freeze', dormant: true, quiet: true, chaseSpeed: 82, sight: 600, name: 'bosun', until: 'ship_hold_chase' },
    { enemy: 'ghost_deckhand', key: 'ship_hold:bosun', x: 4, y: 13, patrol: [4, 4], behaviour: 'chase', lantern: 'freeze', quiet: true, chaseSpeed: 82, sight: 600, name: 'bosun', after: 'ship_hold_chase' },
    { enemy: 'powder_monkey', x: 28, y: 14, patrol: [27, 32], behaviour: 'patrol', lantern: 'freeze' },
  ],
};
