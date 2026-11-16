// THE ORLOP (Chapter 5, the ghost ship's DEEP PART, optional): the cable tier under the captain's cabin, where the anchor cables lie in their
// coils and the ballast pigs are stowed. You come down the hatch from the cabin. NO PUZZLE here: a quiet walk, a breath between the cabin
// and the sail locker. Three chambers cut by two bulkheads (x 10 and x 21), each with one doorway (rows 6-7), and both gates stand open,
// chocked back against the bulkhead and never shut. What there is: the cable-hand's ghost coiling a cable that is not there, his chalk,
// a powder monkey in the first chamber and a deckhand in the third, a purse on a nail in the third chamber (29,11), and THE SECRET: the
// little cuddy in the south-east corner of the middle chamber (x 19-20, rows 10-11), where the cable-hand kept his things: a purse that
// only the lantern shows (20,11), and his letter.
// Scene ship_orlop_in (the west end, once). The ladder up (2-3, row 3) is back to the cabin; the east door (31, rows 6-7) goes on to the sail locker.
// Tile key: # hull and bulkhead (solid)   W planking face (solid)   . orlop floor
import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_ORLOP = {
  id: 'ship_orlop',
  name: 'THE ORLOP',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.6,
  music: 'ghostShip',
  musicFrom: 'list',
  ambience: 'ghost_ship_deep',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...pay out the cable...', '...she\'s dragging...', '...hold, hold...', '...is the cuddy shut...'] },
  playerStart: { x: 3, y: 4 },

  tiles: [
      '################################',
      '################################',
      '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
      '#.........#..........#.........#',
      '#.........#..........#.........#',
      '#.........#..........#.........#',
      '#...............................',
      '#...............................',
      '#.........#..........#.........#',
      '#.........#..........#.........#',
      '#.........#.......#..#.........#',
      '#.........#.......#..#.........#',
      '################################',
      '################################',
    ],

  // Nothing leans in here any more: the list is kept only so she still creaks.
  list: {},

  doors: [
    { x: 2, y: 3, w: 2, h: 1, to: 'ship_cabin', spawn: { x: 8, y: 9 } },
    { x: 31, y: 6, w: 1, h: 2, to: 'ship_sail_locker', spawn: { x: 2, y: 8 } },
  ],

  cutscenes: [
    { x: 2, y: 4, w: 3, h: 2, scene: 'ship_orlop_in' },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'gs_ladder', x: 2, y: 3, flat: true, walkable: true, text: 'orlop_ladder' },
    { sprite: 'gs_ladder', x: 3, y: 3, flat: true, walkable: true, text: 'orlop_ladder' },
    // The two gates, swung back against their bulkheads and chocked open for good (where they always stood).
    { sprite: 'gs_side_door_open', x: 10, y: 7, text: 'orlop_gate', walkable: true },
    { sprite: 'gs_side_door_open', x: 21, y: 7, text: 'orlop_gate', walkable: true },
    // Ballast pigs stowed along the walls, lashed: nothing rolls in here.
    { sprite: 'gs_pig', x: 6, y: 11, text: 'orlop_pig' },
    { sprite: 'gs_pig', x: 16, y: 3, text: 'orlop_pig' },
    { sprite: 'gs_pig', x: 23, y: 11, text: 'orlop_pig' },
    // THE SECRET, in the cuddy: the cable-hand's purse (only in the lantern) and his letter.
    { sprite: 'gold_pouch', x: 20, y: 11, text: 'orlop_cuddy_purse', gold: 70, haunt: { kind: 'unseen' }, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gs_letter_dropped', x: 19, y: 11, text: 'orlop_cuddy_letter', flat: true, walkable: true },
    { sprite: 'gs_ghost_old', x: 14, y: 8, text: 'ghost_orlop', animation: 'gs_ghost_old', speed: 1.1, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_chalk', x: 5, y: 8, text: 'orlop_chalk', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 4, y: 6, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 13, y: 8, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 16, y: 10, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_handprint', x: 22, y: 2, text: 'hold_handprint', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gold_pouch', x: 29, y: 11, text: 'orlop_purse', gold: 130, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_barrels', x: 3, y: 8, text: 'hold_barrels' },
    { sprite: 'c5_crates_stack', x: 8, y: 4, text: 'hold_crates' },
    { sprite: 'c5_barrels', x: 17, y: 4, text: 'hold_barrels' },
    { sprite: 'c5_crate', x: 12, y: 5, text: 'hold_crates' },
    { sprite: 'c5_barrels', x: 24, y: 4, text: 'hold_barrels' },
    { sprite: 'wy_chain_pile', x: 9, y: 9, text: 'hold_chain', flat: true, walkable: true },
    { sprite: 'wy_chain_pile', x: 15, y: 11, text: 'hold_chain', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 2, y: 10, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 29, y: 6, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 24, y: 8, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 12, y: 9, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_wall_lantern', x: 4, y: 2 },
    { sprite: 'gs_wall_lantern', x: 8, y: 2 },
    { sprite: 'gs_wall_lantern', x: 13, y: 2 },
    { sprite: 'gs_wall_lantern', x: 17, y: 2 },
    { sprite: 'gs_wall_lantern', x: 24, y: 2 },
    { sprite: 'gs_wall_lantern', x: 28, y: 2 },
    { sprite: 'gs_knee', x: 3, y: 2 },
    { sprite: 'gs_knee_r', x: 6, y: 2 },
    { sprite: 'gs_knee_r', x: 12, y: 2 },
    { sprite: 'gs_knee_r', x: 16, y: 2 },
    { sprite: 'gs_knee', x: 23, y: 2 },
    { sprite: 'gs_knee', x: 27, y: 2 },
    { sprite: 'gs_puddle', x: 7, y: 7, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 14, y: 6, flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 25, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 5, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 12, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 26, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 17, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 8, y: 8, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 23, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 15, y: 5, flat: true, walkable: true },
    { sprite: 'gs_net_heap', x: 11, y: 11, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 27, y: 11, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 2, y: 11, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 16, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 6, y: 10, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 9, y: 11, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 24, y: 11, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 25, y: 5, flat: true, walkable: true },
    { sprite: 'gs_web_l', x: 1, y: 11, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 13, y: 4, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 4, y: 4, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_orlop ?? []),
  ],
  tileTexts: { '#': 'hold_wall', W: 'hold_wall' },
  // The powder monkey patrols the first chamber's south wall (row 11, x 7-9); the deckhand patrols the third chamber (row 9, x 24-29). Neither is on a doorway or the scene's tiles (2-4, rows 4-5, and Ves and Bramble at row 6).

  npcs: [
    { enemy: 'powder_monkey', x: 8, y: 11, patrol: [7, 9], behaviour: 'patrol', lantern: 'freeze' },
    { enemy: 'ghost_deckhand', x: 26, y: 9, patrol: [24, 29], behaviour: 'patrol', lantern: 'flee' },
  ],
};
