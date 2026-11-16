// THE FLOODED BOW (Chapter 5, the ghost ship's DEEP PART, optional): the forepeak, under the forecastle, flooded to the beams. Six little
// raised decks (islands) stand in black water, joined by planks on cleats ('o'). The FINALE of the lean, and she does it herself: SHE LURCHES
// BY HERSELF here (shipList.js `list.lurch`), every 3 seconds of play once the water is still, with a creak and a shudder a second before.
// Each time she goes over, the planks that were dry sink under and the others come up. (The old version, three tackles and nine islands,
// is in notes/backup-2026-11-14/ship/.)
// THE PUZZLE (crossing in rhythm, two turns of her): you come in at the west island, and she always lies to PORT when you come in (`list.own`).
//   West island (x 1-3, rows 8-11) --plank A, row 10, dry to PORT--> middle island (x 8-10, rows 9-11)
//   middle --plank B, x 9 rows 5-8, dry to STARBOARD--> north island (x 7-11, rows 3-4) --plank C, row 4, always dry--> north-east island (x 14-16, rows 3-5)
//   north-east --plank D, x 15 rows 6-8, dry to PORT--> the east island (x 13-16, rows 9-11): the ring (14,10) and the gate (17, rows 9-10).
// So: cross A at once, wait on the middle island for her to roll, cross B, walk on, wait for her to roll back, cross D. Plank B is four tiles
// long, and she does not wait: dawdle on it and the water comes up over you, and washes you to the nearest island (a little HP). A side plank
// (x 9, rows 12-13, always dry) goes south from the middle island to the south island (x 6-12, rows 14-15), with a purse and two monsters.
// Chalk in plain sight on the islands says which plank comes up which way. Every island is always dry and she never stops rolling, so every
// island can always be reached again, from either end: nobody can be shut in.
// Scene ship_flooded_bow_in (the west end, once). Tile key: # hull and bulkhead (solid)   W planking face (solid)   . deck   o plank on cleats
// ~ black water (solid)
import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_FLOODED_BOW = {
  id: 'ship_flooded_bow',
  name: 'THE FLOODED BOW',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.9,
  music: 'ghostShip',
  musicFrom: 'list',
  ambience: 'ghost_ship_deep',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...water\'s up to the forepeak...', '...she\'s bowed down...', '...hold the bow up...', '...who is laughing...'] },
  playerStart: { x: 2, y: 9 },

  tiles: [
      '##################',
      '##################',
      '#WWWWWWWWWWWWWWWW#',
      '#~~~~~~.....~~...#',
      '#~~~~~~.....oo...#',
      '#~~~~~~~~~~~~~...#',
      '#~~~~~~~~~~~~~~o~#',
      '#~~~~~~~~~~~~~~o~#',
      '#...~~~~~~~~~~~o~#',
      '....~~~~...~~.....',
      '....oooo...~~.....',
      '#...~~~~...~~....#',
      '#~~~~~~~~o~~~~~~~#',
      '#~~~~~~~~o~~~~~~~#',
      '#~~~~~.......~~~~#',
      '#~~~~~.......~~~~#',
      '##################',
      '##################',
    ],

  // The STARBOARD map (a space is "same as the port map above"): plank B comes up, planks A and D go under.
  // Her lean is the room's own (port each time you come in), and she lurches by herself; the water washes you off a plank after 0.25 s.
  list: { own: true, lurch: { every: 3, warn: 1, first: 3 }, creep: 0.8, wait: 0.25, star: [
        '                  ',
        '                  ',
        '                  ',
        '                  ',
        '                  ',
        '         o        ',
        '         o     ~  ',
        '         o     ~  ',
        '         o     ~  ',
        '                  ',
        '    ~~~~          ',
        '                  ',
        '                  ',
        '                  ',
        '                  ',
        '                  ',
        '                  ',
        '                  ',
      ] },

  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'ship_sail_locker', spawn: { x: 27, y: 8 } },
    { x: 17, y: 9, w: 1, h: 2, to: 'ship_figurehead_perch', spawn: { x: 2, y: 7 } },
  ],

  cutscenes: [
    { x: 1, y: 9, w: 2, h: 2, scene: 'ship_flooded_bow_in' },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'gs_bulk_door_top', x: 17, y: 9, text: 'bow_gate', opensWith: ['bow_ring'], openText: 'bow_gate_open' },
    { sprite: 'gs_side_door', x: 17, y: 10, text: 'bow_gate', opensWith: ['bow_ring'], openText: 'bow_gate_open', openLook: 'gs_side_door_open', ajarLook: 'gs_side_door_ajar' },
    // The ring that lifts the gate's bar, on the east island, in plain sight.
    { sprite: 'gs_ghost_ring', x: 14, y: 10, text: 'bow_ring', lever: 'bow_ring', flat: true, walkable: true },
    { sprite: 'gs_ghost_boy', x: 1, y: 8, text: 'ghost_bow_boy', animation: 'gs_ghost_boy', speed: 0.7, walkable: true, haunt: { kind: 'ghost' } },
    // Chalk in plain sight at the head of each plank that moves.
    { sprite: 'gs_chalk_go_east', x: 2, y: 11, text: 'bow_chalk', flat: true, walkable: true },
    { sprite: 'gs_chalk_go_north', x: 9, y: 9, text: 'bow_chalk_star', flat: true, walkable: true },
    { sprite: 'gs_chalk_go_south', x: 15, y: 5, text: 'bow_chalk_port', flat: true, walkable: true },
    { sprite: 'gs_handprint', x: 16, y: 11, text: 'hold_handprint', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    // Two purses, off the way: the north island's west end, the south island's west end.
    { sprite: 'gold_pouch', x: 7, y: 3, text: 'bow_purse', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 6, y: 15, text: 'bow_purse', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Cargo, in corners nobody needs to walk through.
    { sprite: 'c5_barrels', x: 11, y: 3, text: 'hold_barrels' },
    { sprite: 'c5_crate', x: 16, y: 3, text: 'hold_crates' },
    { sprite: 'c5_barrel', x: 1, y: 11, text: 'hold_barrels' },
    { sprite: 'c5_crates_stack', x: 12, y: 15, text: 'hold_crates' },
    { sprite: 'c5_barrel', x: 16, y: 9, text: 'hold_barrels' },
    { sprite: 'wy_chain_pile', x: 8, y: 11, text: 'hold_chain', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 15, y: 11, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_coil', x: 8, y: 3, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'gs_lantern_smashed', x: 8, y: 15, flat: true, walkable: true },
    { sprite: 'gs_wall_lantern', x: 4, y: 2 },
    { sprite: 'gs_wall_lantern', x: 9, y: 2 },
    { sprite: 'gs_wall_lantern', x: 15, y: 2 },
    { sprite: 'gs_knee', x: 2, y: 2 },
    { sprite: 'gs_knee', x: 7, y: 2 },
    { sprite: 'gs_knee_r', x: 12, y: 2 },
    { sprite: 'gs_puddle', x: 2, y: 10, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 9, y: 10, flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 14, y: 11, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 8, y: 6, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 4, y: 12, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 12, y: 12, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 13, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 10, y: 11, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 7, y: 14, flat: true, walkable: true },
    { sprite: 'gs_weed_a', x: 1, y: 10, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 11, y: 14, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 7, y: 15, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 10, y: 4, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 13, y: 11, flat: true, walkable: true },
    { sprite: 'gs_net_heap', x: 10, y: 15, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 14, y: 3, flat: true, walkable: true },
    { sprite: 'gs_cutlass', x: 10, y: 3, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 3, y: 8, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 16, y: 4, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_flooded_bow ?? []),
  ],
  tileTexts: { '#': 'hold_wall', W: 'hold_wall', '~': 'bow_water', o: 'bow_plank' },
  // Both on the south island (the side way, off the route): a deckhand patrols its south edge (row 15, x 7-9) and the powder monkey its north-east
  // (row 14, x 10-12). Neither is on a plank, the side plank's landing (9,14), a purse, or the scene's tiles (the west island).
  npcs: [
    { enemy: 'ghost_deckhand', x: 8, y: 15, patrol: [7, 9], behaviour: 'patrol', lantern: 'flee' },
    { enemy: 'powder_monkey', x: 11, y: 14, patrol: [10, 12], behaviour: 'patrol', lantern: 'freeze' },
  ],
};
