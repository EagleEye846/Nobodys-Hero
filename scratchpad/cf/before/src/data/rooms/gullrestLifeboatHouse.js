// THE LIFEBOAT HOUSE: Gullrest's big red-doored boathouse, a lifeboat on a cradle
// (the DAISY, never launched, polished weekly), a kettle, a SAVE point and
// Haddock's chalk tide table. Two quiet marks of the trail: a child's patched
// oilskin on a peg (Bramble notices, nobody explains it) and, on a post just inside
// the doors, a lantern that is lit at noon (scene lantern_at_noon; Haddock:
// "Council does them. Probably."). Haddock is still offended about the lightman
// gag for the whole of this room (his words are in text/npcs/haddock_house.txt).
// No monsters (a save room).
// Tile key (see src/overworld/coastTiles.js, gullrest, indoors):
//   #  wall top (solid)   h  painted board wall (solid)   o  floor boards

export const GULLREST_LIFEBOAT_HOUSE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'gullrest_lifeboat_house',
  // The room's name, for the Room Editor.
  name: 'THE LIFEBOAT HOUSE',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song heard from indoors (src/data/music/gullrestIndoorTheme.js), and the sounds of the place under it.
  music: 'gullrestIndoor',
  // The stove, the sea just outside the big doors, a gull on the roof.
  ambience: 'beach_inside',
  vesWell: true,
  indoors: true,

  tiles: [
    '##################',
    'hhhhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhhhh',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '########oo########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 8, y: 11, w: 2, h: 1, to: 'gullrest_beach', spawn: { x: 31, y: 6 } },
  ],

  // The lantern scene plays as you come in (the lantern post is at 11, 9).
  // The child's oilskin (2,3): the three go over to it the first time you walk to that end of the
  // room (oilskin_on_the_peg; x 3 to 5, rows 4 to 6, apart from the lantern's by the doors).
  cutscenes: [
    { x: 7, y: 8, w: 8, h: 3, scene: 'lantern_at_noon', until: 'ways_of_the_sea' },
    { x: 3, y: 4, w: 3, h: 3, scene: 'oilskin_on_the_peg', until: ['the_light_answers', 'haddock_gone'] },
  ],

  // The oilskin, the tide table, the lifeboat, Haddock, a kettle on a stove, the lantern,
  // the SAVE crystal, ropes, buoys, barrels and a purse.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'c5_oilskin_hook', x: 2, y: 3, text: 'house_oilskin' },
    { sprite: 'c5_tide_board', x: 5, y: 3, text: 'house_tide_board' },
    { sprite: 'c5_lifebuoy_post', x: 8, y: 3, text: 'house_lifebuoy' },
    // In here from when he walks in off the beach (meet_haddock) until he follows you out to the cove (ways_of_the_sea).
    { sprite: 'cf_haddock', x: 12, y: 4, npc: 'haddock_house', animation: 'cf_haddock', speed: 0.5, after: 'meet_haddock', until: 'ways_of_the_sea' },
    { sprite: 'in_stove_kettle', x: 15, y: 3, text: 'house_kettle' },
    { sprite: 'c5_rowboat', x: 4, y: 7, text: 'house_lifeboat' },
    { sprite: 'savepoint', x: 15, y: 8, save: true },
    { sprite: 'c5_lantern_post_lit', x: 11, y: 9, text: 'house_lantern', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_rope_coil', x: 6, y: 10, text: 'house_rope', walkable: true },
    { sprite: 'c5_buoys_pile', x: 2, y: 9, text: 'house_buoys' },
    { sprite: 'c5_barrels', x: 15, y: 5, text: 'house_barrels' },
    { sprite: 'gold_pouch', x: 16, y: 10, text: 'house_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Lived in (2026-11-08): on the wall a knot board, a shelf of tins over Haddock's corner, a
    // window, a sketch of a boat; a net being mended in the corner, his tea on a stool, boots by
    // the door. (Clear of lantern_at_noon's walks, rows 6-10 between x 8 and 10.)
    { sprite: 'in_knot_board', x: 9, y: 2, text: 'in_house_knots' },
    { sprite: 'in_shelf_tins', x: 12, y: 2, text: 'in_house_shelf' },
    { sprite: 'in_window_calm', x: 3, y: 2, text: 'in_house_window' },
    { sprite: 'in_sketch_boat', x: 16, y: 2, text: 'in_house_sketch' },
    { sprite: 'in_net_mending', x: 1, y: 5, text: 'in_house_net' },
    { sprite: 'in_stool_mug', x: 14, y: 4, text: 'in_house_tea', after: 'meet_haddock', until: 'ways_of_the_sea' },
    { sprite: 'in_boots', x: 7, y: 10, text: 'in_house_boots' },
    // Dressing (second pass): lamps on the wall, a rug by the boat, odds and ends in the corners.
    { sprite: 'in_wall_lamp', x: 7, y: 2, text: 'in_house_lamp' },
    { sprite: 'in_wall_lamp', x: 14, y: 2, text: 'in_house_lamp' },
    { sprite: 'in_rug_blue', x: 8, y: 6, flat: true, walkable: true },
    { sprite: 'in_tins_crate', x: 16, y: 6, text: 'in_house_crate' },
    { sprite: 'in_sea_chest_small', x: 1, y: 8, text: 'in_house_chest' },
    { sprite: 'c5_oar_stuck', x: 1, y: 10, text: 'in_house_oar' },
    // (life pass 2026-11-14)
    { sprite: 'st_cat_loaf_b', x: 13, y: 6, text: 'life_g_cat', animation: 'st_cat_loaf_b', speed: 1.2 },
    { sprite: 'st_broom_bucket', x: 4, y: 9, text: 'life_g_broom' },
    { sprite: 'st_boot_planter', x: 12, y: 10, text: 'life_g_boot' },
    { sprite: 'st_tin_box', x: 1, y: 3, text: 'life_g_tin' },
  ],
  tileTexts: { h: 'house_wall' },

  // None: a save room, with a walrus.
  npcs: [
  ],
};
