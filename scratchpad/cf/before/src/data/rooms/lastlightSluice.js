// THE SLUICE ROOM: where the tower's great sluice is worked. The gate itself stands in the east wall
// (it lets the sea up into the lamp's cisterns), and beside it, on the wall, is the CRANK: an
// iron wheel the size of a cartwheel with a handle as long as your arm. It is stiff, and it will not
// stay up on its own: whoever works it has to stay on it. (It matters later: this is the room the
// finale comes back to, with the sea behind them.) The floor in front of the crank is left clear
// for that scene (x 19-28, rows 4-10); nothing stands in it.
//   - THE PUZZLE (a TRIO): a counterweight grille across the passage (the divider at x 18, the grille
//     on 18,8 and 18,9). It is hauled up by three weights, and each weight hangs from its own plate.
//     The hero's plate is beside the grille (17,9); Bramble's is in a little bricked room in the
//     north-west that only a small body fits into (the gap at 3,6; E steers him); Ves's is across the
//     room on the south side (13,13; Q steers her). With all three held the grille rises; step off
//     the plate into the grille. R brings the others after. Once through a door, it stays open.
//   - The stump (3,14) puts everyone back at the door.
//   - Doors: the stair (2-3, row 16, bottom left); the gallery (29, rows 11-12, east wall).
//   - Purse 250 in the south-east corner. A pair of monsters in the north-west.
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   H  lamp niche   6  slit window   .  flagstones   o  a door
// (draft).

import { LIFE5_PROPS } from '../lifePass5.js';

export const LASTLIGHT_SLUICE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_sluice',
  // The room's name, for the Room Editor.
  name: 'THE SLUICE ROOM',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  music: 'lastlight',
  ambience: 'last_light',
  indoors: true,
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
  vesWell: true,

  tiles: [
    '##############################',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhhHhhhhh6hhhhhhhhHhhhhh6h#',
    '#q...h.q..........h.ooooooo.q#',
    '#....h............h..ooooooo.#',
    '#..q.h............h...:::::..#',
    '#hh.hh.........q..h....:::...#',
    '#..:..............h.....::...#',
    '#..::..........::::::...::...#',
    '#...::.......:::.......::....#',
    '#....:......::....h...::.....#',
    '#....::....::.....h..::......o',
    '#.....:::::.......h.::.......o',
    '#..q....:.........h.:.......q#',
    '#.qq....::........h.........q#',
    '#q.......:........hqq......qq#',
    '##oo##########################',
  ],

  // Where the player starts, in tile coordinates: in from the stair.
  playerStart: { x: 2, y: 15 },

  doors: [
    // Down the stair.
    { x: 2, y: 16, w: 2, h: 1, to: 'lastlight_stair', spawn: { x: 2, y: 3 } },
    // On to the gallery.
    { x: 29, y: 11, w: 1, h: 2, to: 'lastlight_gallery', spawn: { x: 1, y: 11 } },
  ],

  // The end of the chapter (tideHeldFinale.js): back in by the east door after the fight, Haddock at the crank.
  cutscenes: [
    { x: 28, y: 11, w: 1, h: 1, scene: 'the_crank', after: 'corrie_falls' },
  ],

  textFile: 'interactions/lastlight.txt',
  props: [
    // THE CRANK and the sluice gate it works, in the east wall. Floor in front (x 19-28, rows 4-10) stays clear.
    { sprite: 'c5_crank_wheel', x: 24, y: 3, text: 'sluice_crank', animation: 'c5_crank_wheel', speed: 0.5 },
    { sprite: 'c5_sluice_gate', x: 27, y: 3, text: 'sluice_gate' },
    { sprite: 'c5_lantern_post_unlit', x: 20, y: 3, text: 'sluice_lamp' },
    // The weight grille, and its three plates (each with a wheel on its chain).
    { sprite: 'gate_narrow', x: 18, y: 8, text: 'sluice_grille', opensWith: ['sl_h', 'sl_v', 'sl_b'], openText: 'sluice_grille_open' },
    { sprite: 'gate_narrow', x: 18, y: 9, text: 'sluice_grille', opensWith: ['sl_h', 'sl_v', 'sl_b'] },
    { sprite: 'c5_sluice_wheel', x: 17, y: 8, text: 'sluice_wheel_hero' },
    { sprite: 'treadle', x: 17, y: 9, text: 'sluice_plate_hero', treadle: 'sl_h', who: 'hero' },
    { sprite: 'c5_sluice_wheel', x: 2, y: 3, text: 'sluice_wheel_bramble' },
    { sprite: 'treadle', x: 2, y: 4, text: 'sluice_plate_bramble', treadle: 'sl_b', who: 'bramble' },
    { sprite: 'c5_stone_gap', x: 3, y: 6, text: 'sluice_gap', gap: true },
    { sprite: 'c5_sluice_wheel', x: 13, y: 12, text: 'sluice_wheel_ves' },
    { sprite: 'treadle', x: 13, y: 13, text: 'sluice_plate_ves', treadle: 'sl_v', who: 'vesper' },
    { sprite: 'rock_stump', x: 3, y: 14, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 16, y: 10, text: 'sluice_sign' },
    // Stores along the south wall.
    { sprite: 'c5_barrels', x: 21, y: 14, text: 'sluice_barrels' },
    { sprite: 'c5_crate', x: 25, y: 14, text: 'sluice_crate' },
    { sprite: 'c5_rope_coil', x: 8, y: 14, text: 'sluice_rope', walkable: true, flat: true },
    // The sea in the walls: it weeps out round the sluice gate and stands in puddles, the
    // crank's iron bleeds rust onto the boards, the floor is cracking, the stones are coming
    // loose, and one lamp still burns on its hook by the stair.
    { sprite: 'c5_puddle', x: 26, y: 5, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 22, y: 8, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 23, y: 4, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 27, y: 7, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 6, y: 12, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 12, y: 7, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 16, y: 3, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 1, y: 7, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 10, y: 15, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 1, y: 11 },
    // The working tower (2026-11-08b): pipes along the north wall on their brackets, one with a
    // valve and gauge going down into the floor, the tide's old marks scratched beside them, a chain
    // on a hook; a riser, a chain and a caged green lamp on the divider; the oil and coal stores along
    // the south wall (drums, one tipped and leaking, a split coal sack); a drain grating in the path;
    // the sea seeping out under the sluice gate, and kelp dragged in from the east door.
    // Walls and the south wall only: the crank's floor, the plates' ways and the grille stay clear.
    { sprite: 'll_tide_marks', x: 7, y: 2, text: 'll_tide_marks' },
    { sprite: 'll_chain_hook', x: 10, y: 2, text: 'll_chain_hook' },
    { sprite: 'll_pipes_run', x: 13, y: 2, text: 'll_pipes' },
    { sprite: 'll_pipes_end', x: 15, y: 2, text: 'll_pipes' },
    { sprite: 'll_lamp_bracket', x: 18, y: 5, text: 'll_lamp_bracket' },
    { sprite: 'll_chain_hook', x: 18, y: 11, text: 'll_chain_hook' },
    { sprite: 'll_pipe_riser', x: 18, y: 14, text: 'll_pipes' },
    { sprite: 'll_drum_tipped', x: 11, y: 15, text: 'll_drum_tipped' },
    { sprite: 'll_coal_spill', x: 13, y: 15, flat: true, walkable: true },
    { sprite: 'll_drums', x: 15, y: 15, text: 'll_drums' },
    { sprite: 'll_oil_spill', x: 6, y: 13, flat: true, walkable: true },
    { sprite: 'll_drums', x: 23, y: 15, text: 'll_drums' },
    { sprite: 'coal_heap', x: 6, y: 15, text: 'll_coal' },
    { sprite: 'll_coal_spill', x: 7, y: 14, flat: true, walkable: true },
    { sprite: 'c5_crates_stack', x: 26, y: 15, text: 'sluice_crate' },
    { sprite: 'll_grating', x: 9, y: 10, flat: true, walkable: true },
    { sprite: 'll_grating', x: 22, y: 12, flat: true, walkable: true },
    { sprite: 'll_seep', x: 27, y: 4, flat: true, walkable: true },
    { sprite: 'll_kelp_drag', x: 26, y: 12, flat: true, walkable: true },
    { sprite: 'gold_pouch', x: 28, y: 14, text: 'sluice_pouch', gold: 250, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    ...(LIFE5_PROPS['lastlight_sluice'] ?? []),
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', o: 'll_door', '.': 'll_floor' },

  // A salt shade and a storm imp in the north-west corner of the west half (x 8-13, rows 4-5), clear
  // of the closet (x 1-5), the way from the stair door to the plates (rows 7-15), the hero's plate and
  // the grille, and well away from the clear floor in front of the crank. Gone once the sea has been
  // through the tower (`until`: the end of the chapter).
  npcs: [
    { enemy: 'salt_shade', x: 9, y: 4, patrol: [8, 11], behaviour: 'wander', until: 'corrie_falls' },
    { enemy: 'storm_imp', x: 11, y: 5, patrol: [10, 13], behaviour: 'wander', until: 'corrie_falls' },
  ],
};
