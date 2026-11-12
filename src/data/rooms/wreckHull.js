// THE HULL: inside a great iron ship lying broken-backed on the shingle. The rain
// comes in through the holes in her plates. You come in at the bottom of her hold
// (west); the only way on is up and over her middle deck (the raised walkway that
// runs the height of the room, x 17 to 19), which stands two steps high (24 px) with
// the bilge water lapping all along its foot. A jump only gets you one step (12 px).
//
// THE PUZZLE (crate and jumps): one stretch of the walkway's foot is dry, at (16,7)
// and (16,8). Push the loose crate (5,13) there and it makes the missing step: jump
// onto it, then up onto the walkway. One way: push it east four times along row 13
// (the cargo at (5,10) stops it going straight north), north five times up column 9,
// then east seven times along row 8. The reset stump (2,17) puts it back. From the
// walkway you drop down into the east hold; the door out is at its east end. Coming back
// the other way, a low crate at the walkway's east foot (20,9) is the step back up, and you
// drop off its west side by the dry stretch at (16,7)-(16,8): you can always get back.
//
// In the east hold, cargo is stacked in steps: from the floor up a run of low crates
// (b) to the high stack (B) where the chest with the ANCHOR MAUL sits (27,12): the
// only way onto the stack is the low crate at (24,14) (crates hem the chest in on its other
// sides, so it can't be reached from the floor). A second stack (30,13) holds a purse, by
// way of the low crates at (29,12) and (30,12).
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   W  hull plate (solid)   w  porthole (solid)   .  iron deck
//   b  low cargo / deck (12 px)   B  high walkway / stack (24 px)   ~  bilge water (solid)
//   O  cargo crate (solid)   F  net heap (solid)   x  barnacles (solid)

export const WRECK_HULL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_hull',
  // The room's name, for the Room Editor.
  name: 'THE HULL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Under Her Ribs" (src/data/music/wreckHullsTheme.js): inside the beached wrecks.
  music: 'wreckHulls',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.3, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // Under her plates: less rain gets in, and the fog hangs low.
  atmosphere: { rain: 0.5, fog: 0.5 },
  skyline: false,
  // The cargo (b and B) draws as crates, not the walkway's iron: the west hold's
  // stack, the low crate at the walkway's east foot, and the east hold's stacks.
  cargo: [{ x: 2, y: 2, w: 2, h: 2 }, { x: 20, y: 9, w: 1, h: 1 }, { x: 22, y: 12, w: 10, h: 3 }],

  tiles: [
    '####################################',
    '#WWWWWWwWWWWWWWWWWWWWWWWwWWWWwWWWWW#',
    '#.B......::::~BBBBBB...............#',
    '#.Bb..:::::F.~BBBBBB.............O.#',
    '#......:::...~BBBBBB...............#',
    '#............~~~~BBB...............#',
    '#...............~BBB..:::..........#',
    '#................BBB.:::::.........#',
    '#................BBB..::::.........#',
    '#.F.............~BBBb...::..........',
    '#....O......::..~BBB................',
    '#..........:::..~BBB.......O.......#',
    '#............F..~BBB...b.BBBObb....#',
    '#...............~BBB...bb.BO..B....#',
    '................~BBB....bBB..OBF...#',
    '..::::..........~BBB..........x....#',
    '#:::::.x........~BBB.........::::..#',
    '#.:::.......O...~BBB..F.....::::O..#',
    '#::.............~BBB..........::...#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 14 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 14, w: 1, h: 2, to: 'wreck_gate', spawn: { x: 37, y: 10 } },
    { x: 35, y: 9, w: 1, h: 2, to: 'wreck_pumps', spawn: { x: 2, y: 5 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The puzzle: the loose crate and the stump that puts it back.
    { sprite: 'c5_crate', x: 5, y: 13, text: 'hull_crate', rock: true, step: true },
    { sprite: 'rock_stump', x: 2, y: 17, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 14, y: 9, text: 'hull_sign' },
    // The east hold's stacks: the Anchor Maul up top, and a purse on the other stack.
    { sprite: 'c5_chest', x: 27, y: 12, text: 'hull_chest', gives: 'anchor_maul', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 14, text: 'hull_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Odds and ends of a ship: barrels, rope, a hammock's worth of net, the ribs showing.
    { sprite: 'c5_barrels', x: 8, y: 2, text: 'hull_barrels' },
    { sprite: 'c5_barrel', x: 1, y: 11, text: 'hull_barrels' },
    { sprite: 'c5_rope_coil', x: 11, y: 15, text: 'hull_rope', walkable: true },
    { sprite: 'c5_anchor', x: 21, y: 3, text: 'hull_anchor' },
    { sprite: 'c5_crates_stack', x: 33, y: 13, text: 'hull_cargo' },
    { sprite: 'c5_lobster_pots', x: 27, y: 17, text: 'hull_pots' },
    { sprite: 'c5_figurehead', x: 21, y: 17, text: 'hull_figurehead' },
    // (2026-11-08) Up on her plates: a crewman's oilskin still on its peg, and a chart gone soft.
    { sprite: 'in_oilskin_peg', x: 5, y: 1, text: 'in_hull_oilskin' },
    { sprite: 'in_chart', x: 31, y: 1, text: 'in_hull_chart' },
    // Dressing (2026-11-08), kept off the crate's lanes (row 13 x 5 to 9, column 9, row 8 x 9
    // to 16) and the stacks: bilge pooling where the rain gets in, rust breaking out of her
    // plates, her own boat stowed keel-up in the east hold, lanterns the drowned still keep lit.
    { sprite: 'c5_rust_bloom', x: 2, y: 9, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 6, y: 16, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 30, y: 16, flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 25, y: 3 },
    { sprite: 'c5_lantern_hook', x: 1, y: 5 },
    { sprite: 'c5_lantern_hook', x: 34, y: 16 },
    { sprite: 'c5_planks_scatter', x: 12, y: 5, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 23, y: 9, flat: true, walkable: true },
    { sprite: 'c5_lantern_fallen', x: 14, y: 16, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 4, y: 4, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 10, y: 17, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 24, y: 17, flat: true, walkable: true },
    // (Second pass.) The shadow of her plates along the foot of the north wall, scuppers bleeding
    // rust down from it, a hammock still slung on its hooks and a lamp on a bracket; gratings over
    // the bilge, her anchor's chain heaped by it, a sack burst over the east hold's floor; and the
    // bilge spreading out from the walkway's foot onto the plates, barnacles along its edge.
    { sprite: 'wy_rail_shadow', x: 3, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 6, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 9, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 21, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 24, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 27, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 30, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 33, y: 2, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 4, y: 2, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 28, y: 2, flat: true, walkable: true },
    { sprite: 'wy_hammock', x: 11, y: 1 },
    { sprite: 'in_wall_lamp', x: 21, y: 1 },
    { sprite: 'wy_grating', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'wy_grating', x: 26, y: 7, flat: true, walkable: true },
    { sprite: 'wy_chain_pile', x: 22, y: 4, flat: true, walkable: true },
    { sprite: 'wy_cargo_spill', x: 31, y: 11, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick', x: 15, y: 11, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick_b', x: 15, y: 17, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick', x: 14, y: 6, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 16, y: 13, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 16, y: 18, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'hull_plate', W: 'hull_plate', w: 'hull_porthole', '~': 'hull_bilge', O: 'hull_cargo', F: 'hull_net', x: 'hull_barnacles', B: 'hull_walkway', b: 'hull_lowcargo' },

  // A limpet knight on sentry in the west hold (row 6, x 2 to 4: clear of the crate's
  // lanes, rows 8 and 13 and column 9, and of the door and stump), and an old diver
  // tramping the top of the east hold (row 5, x 30 to 32: clear of the door and the
  // stacks). No cutscenes in this room.
  npcs: [
    { enemy: 'limpet_knight', x: 3, y: 6, patrol: [2, 4], behaviour: 'patrol' },
    { enemy: 'old_diver', x: 31, y: 5, patrol: [30, 32], behaviour: 'patrol' },
  ],
};
