// THE GUN DECK: a long deck of guns under the main deck, run out to their ports in the north wall, the shot racked,
// the kegs stowed. Two athwartships bulkheads cut it into three chambers, and each has ONE doorway, both on the north
// side: the first at x 13, the second at x 25, rows 3-4. This is the room that teaches the lean, and it does it loud.
// THE PUZZLE (careening guns, a timed dash): she lies to PORT here, always, when you come in (`list.own`), and at port
// a loose gun and its rack of shot sit jammed in front of each doorway (x 12 and x 24, rows 3-4). A tackle on a ring
// bolt in each chamber, (6,3), (19,3), (30,3), throws her over to STARBOARD, and the loose guns CAREEN the length of
// the deck to the south wall with a rumble and a jolt (shipList.js `careen`), and both doorways stand open. But she
// only holds for 2.5 seconds (`hold`): then a creak, a shudder, and she rolls back by herself, and the guns come
// thundering back up their lanes into the doorways. So: haul, and run for the gap before she rolls back. Caught in a
// gun's lane (x 12 or x 24) when it comes, you are knocked aside and lose a little HP; nothing worse. The powder monkey
// in the middle chamber patrols across the second lane: time a haul as it crosses, and the gun flattens it for a few
// seconds and you can walk past. Every chamber has its own tackle, so you can go either way, any time: nothing can
// shut you out, and nothing can shut you in (and a save loaded here starts at port, with the tackles in reach).
// Lantern: the gunner's mate, the powder boy and a man at a port; footprints along the whole deck; chalk and a handprint.
// Scene ship_gundeck_in (the west door's column, once).
// Tile key: # bulkhead (solid)   W planking face (solid)   . deck planks

import { SHIP_LIFE_PROPS } from '../lifeShip.js';

export const SHIP_GUNDECK = {
  id: 'ship_gundeck',
  name: 'THE GUN DECK',
  area: 'ghostship',
  // The shard at the bow calling to the Fallen Star (src/overworld/starPull.js): how near the bow, by the way there (0 to 1).
  starPull: 0.25,
  music: 'ghostShip',
  musicFrom: 'list',
  ambience: 'ghost_ship',
  vesWell: true,
  indoors: true,
  haunt: { whispers: ['...run out...', '...wait for the roll...', '...fire when she lifts...', '...is it morning...'] },
  playerStart: { x: 2, y: 6 },

  tiles: [
      '####################################',
      '####################################',
      '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
      '##................................##',
      '#..................................#',
      '#............#...........#.........#',
      '.............#...........#.........#',
      '.............#...........#.........#',
      '#............#...........#.........#',
      '#............#...........#.........#',
      '#............#...........#.........#',
      '##...........#...........#.......###',
      '####################################',
      '####################################',
      '####################################',
    ],

  // No tiles change here, but she leans, and the whole room with her. Her lean here is the room's own: port, every time you come in.
  list: { own: true },

  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'ship_quarters', spawn: { x: 27, y: 7 } },
    { x: 34, y: 6, w: 1, h: 2, to: 'ship_hold', spawn: { x: 3, y: 4 } },
  ],

  cutscenes: [{ x: 2, y: 3, w: 1, h: 9, scene: 'ship_gundeck_in' }],

  textFile: 'interactions/ghostship.txt',
  props: [
    // A save point in the first chamber, before the guns and the hold.
    { sprite: 'savepoint', x: 5, y: 8, save: true },
    { sprite: 'gs_gunport', x: 4, y: 2, text: 'gun_port' },
    { sprite: 'gs_gunport', x: 8, y: 2, text: 'gun_port' },
    { sprite: 'gs_gunport', x: 16, y: 2, text: 'gun_port' },
    { sprite: 'gs_gunport', x: 22, y: 2, text: 'gun_port' },
    { sprite: 'gs_gunport', x: 28, y: 2, text: 'gun_port' },
    { sprite: 'gs_gunport', x: 32, y: 2, text: 'gun_port' },
    { sprite: 'gs_cannon', x: 4, y: 3, text: 'gun_cannon' },
    { sprite: 'gs_cannon', x: 8, y: 3, text: 'gun_cannon' },
    { sprite: 'gs_cannon', x: 16, y: 3, text: 'gun_cannon' },
    { sprite: 'gs_cannon_l', x: 22, y: 3, text: 'gun_cannon' },
    { sprite: 'gs_cannon_l', x: 28, y: 3, text: 'gun_cannon' },
    { sprite: 'gs_cannon', x: 32, y: 3, text: 'gun_cannon' },
    { sprite: 'gs_tackle', x: 6, y: 3, text: 'gun_tackle', listWheel: { to: 'star', hold: 2.5, star: 'tackle_star', busy: 'tackle_busy', already: 'tackle_already' } },
    { sprite: 'gs_tackle', x: 19, y: 3, text: 'gun_tackle', listWheel: { to: 'star', hold: 2.5, star: 'tackle_star', busy: 'tackle_busy', already: 'tackle_already' } },
    { sprite: 'gs_tackle', x: 30, y: 3, text: 'gun_tackle', listWheel: { to: 'star', hold: 2.5, star: 'tackle_star', busy: 'tackle_busy', already: 'tackle_already' } },
    // The loose guns and their shot: in front of the doorways at port, down at the south wall at starboard. They careen.
    { sprite: 'gs_cannon', x: 12, y: 3, text: 'gun_loose', loose: { port: [12, 3], star: [12, 10], careen: true, seconds: 0.6 } },
    { sprite: 'gs_shot', x: 12, y: 4, text: 'gun_loose_shot', loose: { port: [12, 4], star: [12, 11], careen: true, seconds: 0.5 } },
    { sprite: 'gs_cannon_l', x: 24, y: 3, text: 'gun_loose', loose: { port: [24, 3], star: [24, 10], careen: true, seconds: 0.6 } },
    { sprite: 'gs_shot', x: 24, y: 4, text: 'gun_loose_shot', loose: { port: [24, 4], star: [24, 11], careen: true, seconds: 0.5 } },
    // The two doorways in the bulkheads, framed with the doorway's warm light so the way through reads at a glance.
    { sprite: 'gs_exit_door', x: 13, y: 4, walkable: true },
    { sprite: 'gs_exit_door', x: 25, y: 4, walkable: true },
    { sprite: 'gs_ladder', x: 34, y: 6, flat: true, walkable: true, text: 'gun_ladder' },
    { sprite: 'gs_ladder', x: 34, y: 7, flat: true, walkable: true, text: 'gun_ladder' },
    { sprite: 'gs_ghost_old', x: 9, y: 10, text: 'ghost_gunner', animation: 'gs_ghost_old', speed: 1.0, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_boy', x: 20, y: 8, text: 'ghost_powder_boy', animation: 'gs_ghost_boy', speed: 0.6, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_ghost_rail', x: 18, y: 3, text: 'ghost_at_port', animation: 'gs_ghost_rail', speed: 1.2, walkable: true, haunt: { kind: 'ghost' } },
    { sprite: 'gs_chalk', x: 29, y: 10, text: 'gun_chalk', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 3, y: 7, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 6, y: 6, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 10, y: 5, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 14, y: 4, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 17, y: 6, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 22, y: 9, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_a', x: 26, y: 10, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_prints_b', x: 31, y: 8, text: 'ghost_prints', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_handprint', x: 33, y: 5, text: 'gun_handprint', flat: true, walkable: true, haunt: { kind: 'unseen' } },
    { sprite: 'gs_shot', x: 4, y: 11, text: 'gun_shot' },
    { sprite: 'gs_shot', x: 18, y: 11, text: 'gun_shot' },
    { sprite: 'gs_shot', x: 29, y: 11, text: 'gun_shot' },
    { sprite: 'c5_barrels', x: 2, y: 4, text: 'gun_kegs' },
    { sprite: 'c5_barrel', x: 10, y: 11, text: 'gun_kegs' },
    { sprite: 'c5_barrel', x: 21, y: 4, text: 'gun_kegs' },
    { sprite: 'c5_crates_stack', x: 32, y: 10, text: 'gun_crates' },
    { sprite: 'gs_coil', x: 7, y: 8, flat: true, walkable: true, text: 'deck_coil' },
    { sprite: 'gs_coil', x: 28, y: 6, flat: true, walkable: true, text: 'deck_coil' },
    { sprite: 'gs_puddle', x: 15, y: 7, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 23, y: 5, flat: true, walkable: true },
    { sprite: 'gs_puddle', x: 11, y: 9, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 31, y: 6, flat: true, walkable: true },
    { sprite: 'in_wall_lamp', x: 11, y: 2, text: 'gun_lamp' },
    { sprite: 'gs_shadow_b', x: 27, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 16, y: 4, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 26, y: 10, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 24, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 2, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 10, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 16, y: 7, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 19, y: 3, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 27, y: 4, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 8, y: 11, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 8, y: 8, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 7, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 26, y: 4, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 10, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 19, y: 8, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 28, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 17, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 9, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 28, y: 5, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 7, y: 4, flat: true, walkable: true },
    { sprite: 'gs_net_drape', x: 18, y: 2, text: 'dress_net' },
    { sprite: 'gs_net_drape', x: 2, y: 2, text: 'dress_net' },
    { sprite: 'gs_sail_heap', x: 8, y: 7, flat: true, walkable: true, text: 'dress_sail' },
    { sprite: 'c5_ship_ribs', x: 2, y: 12, flat: true, walkable: true, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 10, y: 12, flat: true, walkable: true, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 18, y: 12, flat: true, walkable: true, text: 'bilge_ribs' },
    { sprite: 'c5_ship_ribs', x: 26, y: 12, flat: true, walkable: true, text: 'bilge_ribs' },
    // ART PASS 2 (decoration only: flat things are walked over, tall things stand on walls and rails)
    { sprite: 'gs_knee', x: 1, y: 2 },
    { sprite: 'gs_knee_r', x: 10, y: 2 },
    { sprite: 'gs_knee', x: 14, y: 2 },
    { sprite: 'gs_knee_r', x: 20, y: 2 },
    { sprite: 'gs_knee', x: 25, y: 2 },
    { sprite: 'gs_knee_r', x: 30, y: 2 },
    { sprite: 'gs_wall_lantern', x: 6, y: 2 },
    { sprite: 'gs_wall_lantern', x: 24, y: 2 },
    { sprite: 'gs_wall_lantern', x: 33, y: 2 },
    { sprite: 'gs_knee', x: 13, y: 7 },
    { sprite: 'gs_wall_lantern', x: 13, y: 6 },
    { sprite: 'gs_knee_r', x: 25, y: 6 },
    { sprite: 'gs_wall_lantern', x: 25, y: 8 },
    { sprite: 'gs_cutlass', x: 10, y: 9, flat: true, walkable: true },
    { sprite: 'gs_bucket', x: 6, y: 6, flat: true, walkable: true },
    { sprite: 'gs_barrel_staves', x: 22, y: 9, flat: true, walkable: true },
    { sprite: 'gs_sack_spill', x: 15, y: 8, flat: true, walkable: true },
    { sprite: 'gs_bottles', x: 31, y: 9, flat: true, walkable: true },
    { sprite: 'gs_crate_smashed', x: 34, y: 10, flat: true, walkable: true },
    { sprite: 'gs_lantern_smashed', x: 8, y: 5, flat: true, walkable: true },
    { sprite: 'gs_doll', x: 20, y: 9, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 28, y: 8, flat: true, walkable: true },
    { sprite: 'gs_weed_b', x: 4, y: 9, flat: true, walkable: true },
    { sprite: 'gs_net_heap', x: 16, y: 4, flat: true, walkable: true },
    // The life pass, round 2 (src/data/lifeShip.js): belongings, barnacles, weed, guttering lamps.
    ...(SHIP_LIFE_PROPS.ship_gundeck ?? []),
  ],
  tileTexts: { '#': 'gun_wall', W: 'gun_wall' },

  // The powder monkey patrols the middle chamber (row 7, x 16-24) and stops dead in the light: it walks across the second gun's lane (x 24), so a
  // gun sent careening as it crosses flattens it. The deckhand patrols the bow chamber (row 8, x 27-32) and flees the light. Neither stands on a doorway
  // (x 13 and x 25, rows 3-4), a tackle, the ladder or the scene's column (x 2), and neither rests in a lane.
  npcs: [
    { enemy: 'powder_monkey', x: 18, y: 7, patrol: [16, 24], behaviour: 'patrol', lantern: 'freeze' },
    { enemy: 'ghost_deckhand', x: 29, y: 8, patrol: [27, 32], behaviour: 'patrol', lantern: 'flee' },
  ],
};
