// THE DROWNED RAT: Saltcombe's inn, low-beamed and warm, the rain loud on the
// roof and louder in the gutters. A fire, a long counter with the innkeeper
// (a fat brown rat with a towel on his shoulder) polishing the same tankard,
// tables of fishers, a SAVE point. Haddock is sitting by the fire.
//
// Coming in, once the town meeting has been (town_meeting, in the hall), plays
// haddock_hums: Haddock, on a crate by the fire, hums a lullaby with his eyes
// shut. It's Corrie's tune (corrieLullaby); he never says so, and nobody asks
// twice. Then he mentions the lagoon: the lad's going to learn to swim. Bramble
// is not keen.
//
// Trail 3: in the corner under the stair, a tiny bunk, the rail notched in
// neat fives (the same hand as the tallies in the Deep). One short line, and
// nobody explains it.
//
// Puzzle-free. No monsters (an inn). Haddock is here until haddock_hums;
// then he's gone ahead to the lagoon, and only his mug is left.
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards
//   .  the boards behind the bar (crossways)   X  the hearth stones in front of the fire

// The side errand "A Shelf for the Tankard": the innkeeper has polished the same tankard since the
// storm came and will stop when it stops. After the chapter (the storm over) a bead of stormglass lies
// on the Reach's reef (reach_reef 17,12); bring it here and he puts the bead on the shelf and gives you
// the tankard. On every bit of him you can talk to (the innkeeper and his counter).
const SHELF_FOR_THE_TANKARD = [
  { needs: ['has:storm_glass'], take: 'storm_glass', set: ['q_shelf_asked', 'q_shelf_done'], give: 'polished_tankard', text: 'shelf_done' },
  { needs: ['q_shelf_done'], text: 'shelf_after', append: true },
  { needs: ['!q_shelf_asked'], set: 'q_shelf_asked', text: 'shelf_ask', append: true },
];

export const SALTCOMBE_INN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_inn',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED RAT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof, the room's talk and the fire.
  music: 'saltcombeIndoor',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfterIndoor' },
  // The inn's own talk and its fire, close (`inn`, not a tavern heard through a wall).
  ambience: 'inn',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_inn' },
  vesWell: true,
  indoors: true,

  tiles: [
    '####################',
    'hhhhhhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhhhhhh',
    '#ooooooooooo.......#',
    '#XXXXoooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '##oooooooooooooooo##',
    '########oo##########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 8, y: 13, w: 2, h: 1, to: 'saltcombe_quay', spawn: { x: 15, y: 6 } },
  ],

  // Haddock hums by the fire as you come in (he sits at 5..6, row 4; the scene's
  // walk is from the door up to row 7, clear of the tables), once the town meeting
  // has been. Before it, he sends you up to the hall (inn_hall_first, every time
  // until the meeting; never for a save already past his scene here).
  cutscenes: [
    { x: 7, y: 10, w: 4, h: 3, scene: 'haddock_hums', after: 'town_meeting' },
    { x: 7, y: 10, w: 4, h: 3, scene: 'inn_hall_first', until: ['town_meeting', 'haddock_hums'] },
    // The bunk under the stair (trail 3: the_bunk_tally), on the way along the bottom of the room
    // to it; only once Haddock's scene has been, so never before it or on top of it.
    { x: 13, y: 11, w: 3, h: 2, scene: 'the_bunk_tally', after: 'haddock_hums', until: ['the_light_answers', 'haddock_gone'] },
  ],

  // The fire, Haddock on his crate, the counter, tables, the bunk, the SAVE point.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'fireplace', x: 2, y: 3, text: 'inn_fire' },
    { sprite: 'cf_haddock_sit', x: 5, y: 4, npc: 'haddock_inn', animation: 'cf_haddock_sit', speed: 0.6, until: 'haddock_hums' },
    { sprite: 'hot_mug', x: 5, y: 4, text: 'inn_haddock_mug', after: 'haddock_hums', until: 'haddock_gone' },
    // After the chapter: the innkeeper keeps it filled, and nobody sits on the crate.
    { sprite: 'hot_mug', x: 5, y: 4, text: 'inn_haddock_mug_after', after: 'haddock_gone' },
    { sprite: 'cf_rat_innkeeper', x: 14, y: 3, npc: 'rat_innkeeper', animation: 'cf_rat_innkeeper', speed: 0.5, quest: SHELF_FOR_THE_TANKARD },
    { sprite: 'counter', x: 13, y: 4, npc: 'rat_innkeeper', quest: SHELF_FOR_THE_TANKARD },
    { sprite: 'counter', x: 14, y: 4, npc: 'rat_innkeeper', quest: SHELF_FOR_THE_TANKARD },
    { sprite: 'counter', x: 15, y: 4, npc: 'rat_innkeeper', quest: SHELF_FOR_THE_TANKARD },
    { sprite: 'c5_barrels', x: 17, y: 3, text: 'inn_casks' },
    { sprite: 'table', x: 9, y: 6, text: 'inn_table' },
    { sprite: 'chair', x: 8, y: 6, text: 'inn_chair' },
    { sprite: 'table', x: 13, y: 8, text: 'inn_table_b' },
    { sprite: 'cf_fisher_b', x: 11, y: 6, text: 'inn_fisher_b', animation: 'cf_fisher_b', speed: 0.5 },
    { sprite: 'cf_fisher_c', x: 15, y: 8, text: 'inn_fisher_c', animation: 'cf_fisher_c', speed: 0.55 },
    { sprite: 'c5_rope_coil', x: 2, y: 8, text: 'inn_rope', walkable: true },
    // Trail 3: the child's bunk in the corner, the rail notched in fives.
    { sprite: 'sc_bunk_tally', x: 16, y: 11, text: 'inn_bunk' },
    { sprite: 'bed', x: 16, y: 6, text: 'inn_bunks' },
    { sprite: 'savepoint', x: 2, y: 11, save: true },
    // The doorstop by the door (10,12): a heavy brass pear on an iron loop, which is the Fair Return's fog bell's tongue
    // (optional, secret). Before the bell has been found it is only a doorstop that hums; after (bell_found), pressing Z on
    // it, the innkeeper tells you whose it was and lets you take it (the gear `bell_clapper`).
    { sprite: 'gs_doorstop', x: 10, y: 12, text: 'inn_doorstop', walkable: true, until: 'bell_found' },
    { sprite: 'gs_doorstop', x: 10, y: 12, text: 'inn_doorstop_give', gives: 'bell_clapper', walkable: true, after: 'bell_found', taken: { gone: true } },
    // Lived in (2026-11-08): a window (the storm, then the sky), the inn's mugs on a rail, bottles
    // behind the bar, a sketch of the light, a wet oilskin by the fire and somebody's boots drying,
    // a rag rug and the cat's bowl. (Clear of haddock_hums: his walk down column 4 and along row 12
    // goes over the rug, which lies flat.)
    { sprite: 'in_window_storm', x: 7, y: 2, text: 'in_inn_window', until: 'the_light_answers' },
    { sprite: 'in_window_calm', x: 7, y: 2, text: 'in_inn_window', after: 'the_light_answers' },
    { sprite: 'in_mug_rail', x: 11, y: 2, text: 'in_inn_mugs' },
    { sprite: 'in_shelf_bottles', x: 15, y: 2, text: 'in_inn_bottles' },
    { sprite: 'in_sketch_light', x: 9, y: 2, text: 'in_inn_sketch' },
    { sprite: 'in_oilskin_peg', x: 1, y: 2, text: 'in_inn_oilskin' },
    { sprite: 'in_rug_red', x: 2, y: 5, text: 'in_inn_rug', walkable: true, flat: true },
    { sprite: 'in_boots', x: 1, y: 7, text: 'in_inn_boots' },
    { sprite: 'in_cat_bowl', x: 1, y: 5, text: 'in_inn_cat_bowl', walkable: true, flat: true },
    // Storm-battered (2026-11-09): coats steaming on a rail of pegs, a third table down the warm
    // end with a dozer at it, a bucket under the leak by the east wall (its drip in touches.js),
    // the herring crans nobody fills. All east of x 10 or west of x 4 below row 8, off every walk
    // of haddock_hums (the party's from the door to 6..8,7..8; Haddock's down x 4 and along row 12).
    { sprite: 'in_coat_pegs', x: 5, y: 2, text: 'in_inn_coats' },
    { sprite: 'table', x: 12, y: 10, text: 'in_inn_table_c' },
    { sprite: 'cf_fisher_a', x: 14, y: 10, text: 'in_inn_dozer', animation: 'cf_fisher_a', speed: 0.9 },
    { sprite: 'in_stool_mugs', x: 11, y: 10, text: 'in_inn_stool' },
    { sprite: 'sc_leak_bucket', x: 18, y: 8, text: 'in_inn_bucket' },
    { sprite: 'sc_herring_crans', x: 1, y: 9, text: 'in_inn_crans' },
    // (life pass 2026-11-14)
    { sprite: 'st_boot_planter', x: 8, y: 3, text: 'life_n_boot' },
    { sprite: 'st_price_board', x: 11, y: 3, text: 'life_n_menu' },
    { sprite: 'st_cat_loaf_b', x: 17, y: 9, text: 'life_n_cat', animation: 'st_cat_loaf_b', speed: 1.2 },
    { sprite: 'st_broom_bucket', x: 18, y: 10, text: 'life_n_broom' },
  ],
  tileTexts: { h: 'inn_wall' },
  // The inn's grey cat, asleep by the fire while it rains (drawn in src/data/touches.js): Z
  // strokes it, and it opens an eye. Gone out to the quay's sill once the storm's over.
  looks: [
    { x: 3, y: 4, text: 'inn_cat', pet: true },
  ],

  // None: an inn.
  npcs: [
  ],
};
