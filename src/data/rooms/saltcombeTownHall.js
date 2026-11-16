// THE TOWN HALL: the big house at the top of the market, one long room with
// benches, a stove and the town's memory on the walls. A painting of
// Saltcombe in summer (blue sky: once). A board of winters, painted year by
// year, with one line ruled under in red: the winter the storm came. "It
// came the winter the boy went out." That is all anybody here will say about
// it, and nobody names him (it's Corrie; the hall never says so).
//
// Puzzle-free. No monsters. An old badger keeps the stove going and offers
// biscuits instead of answers.
//
// The first time in, the whole town is here arguing about the storm (scene
// town_meeting), and it sends you on to Haddock at the Drowned Rat.
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards
//   .  the platform's boards (crossways)   X  the stove's hearth stones   I  a roof post (solid)

export const SALTCOMBE_TOWN_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_town_hall',
  // The room's name, for the Room Editor.
  name: 'THE TOWN HALL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof.
  music: 'saltcombeIndoor',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfterIndoor' },
  ambience: 'stilt_inside',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_stilt_inside' },
  vesWell: true,
  indoors: true,

  tiles: [
    '######################',
    'hhhhhhhhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhhhhhhhh',
    '#oooooo........oooXXX#',
    '#oooooo........oooXXX#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#ooIooooooooooooooIoo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '##########oo##########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 10, y: 13, w: 2, h: 1, to: 'saltcombe_market', spawn: { x: 17, y: 7 } },
  ],

  // The town meeting plays as you come in (the walk is up the middle, x 10..11, to row 8). It
  // comes before the inn: a save already past Haddock's scene there never gets it.
  cutscenes: [{ x: 9, y: 11, w: 4, h: 2, scene: 'town_meeting', until: 'haddock_hums' }],

  // The board of winters, the summer painting, notices, benches, the stove and the badger.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'sc_winters_board', x: 10, y: 4, text: 'hall_winters', notice: true },
    { sprite: 'sc_summer_painting', x: 4, y: 4, text: 'hall_painting' },
    { sprite: 'notice_board', x: 15, y: 3, text: 'hall_notices' },
    { sprite: 'bookshelf', x: 1, y: 3, text: 'hall_shelf' },
    { sprite: 'stove', x: 19, y: 3, text: 'hall_stove' },
    { sprite: 'cf_fisher_d', x: 18, y: 5, text: 'hall_badger', cast: 'hall_badger', animation: 'cf_fisher_d', speed: 0.6 },
    { sprite: 'bench', x: 5, y: 8, text: 'hall_bench' },
    { sprite: 'bench', x: 14, y: 8, text: 'hall_bench' },
    { sprite: 'bench', x: 5, y: 10, text: 'hall_bench' },
    { sprite: 'bench', x: 14, y: 10, text: 'hall_bench' },
    { sprite: 'c5_lantern_post_lit', x: 8, y: 3, text: 'hall_lamp', animation: 'c5_lantern_post_lit', speed: 0.26 },
    { sprite: 'c5_lantern_post_lit', x: 13, y: 3, text: 'hall_lamp', animation: 'c5_lantern_post_lit', speed: 0.28 },
    { sprite: 'c5_harbour_bell', x: 1, y: 11, text: 'hall_bell' },
    { sprite: 'gold_pouch', x: 20, y: 12, text: 'hall_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Lived in (2026-11-08): two windows (the storm, then the sky), a wet oilskin by the shelf,
    // a calendar, the badger's tea on a stool by the stove, wet boots by the door.
    { sprite: 'in_window_storm', x: 6, y: 2, text: 'in_hall_window', until: 'the_light_answers' },
    { sprite: 'in_window_calm', x: 6, y: 2, text: 'in_hall_window', after: 'the_light_answers' },
    { sprite: 'in_window_storm', x: 17, y: 2, text: 'in_hall_window', until: 'the_light_answers' },
    { sprite: 'in_window_calm', x: 17, y: 2, text: 'in_hall_window', after: 'the_light_answers' },
    { sprite: 'in_oilskin_peg', x: 3, y: 2, text: 'in_hall_oilskin' },
    { sprite: 'in_calendar', x: 12, y: 2, text: 'in_hall_calendar' },
    { sprite: 'in_stool_mug', x: 19, y: 5, text: 'in_hall_tea' },
    { sprite: 'in_boots', x: 9, y: 12, text: 'in_hall_boots' },
    // Storm-battered (2026-11-09): the lectern by the board and the lifeboat's model, the rush
    // matting down the aisle (flat, under the meeting's walk up x 10..11), chairs stacked by the
    // east wall, a bucket under the leak (its drip in touches.js), a lamp on a stool in the dark
    // corner. Off every town_meeting walk (x 7, 10..13 and row 11) and stand (7,6 12,5 13,6).
    { sprite: 'sc_lectern', x: 9, y: 4, text: 'hall_lectern' },
    { sprite: 'sc_model_boat', x: 1, y: 6, text: 'hall_model_boat' },
    { sprite: 'sc_runner', x: 10, y: 12, text: 'in_hall_runner', walkable: true, flat: true },
    { sprite: 'sc_chairs_stacked', x: 20, y: 8, text: 'in_hall_chairs' },
    { sprite: 'sc_leak_bucket', x: 16, y: 6, text: 'in_hall_bucket' },
    { sprite: 'in_lamp_stool', x: 20, y: 10, text: 'in_hall_lamp_stool' },
    // The badger's biscuit tins by the warm side, sandbags kept by the door for when the quay floods.
    { sprite: 'in_tins_crate', x: 17, y: 11, text: 'in_hall_biscuits' },
    { sprite: 'c5_sandbags', x: 5, y: 12, text: 'in_hall_sandbags' },
    // (life pass 2026-11-14)
    { sprite: 'st_cat_loaf_b', x: 18, y: 4, text: 'life_h_cat', animation: 'st_cat_loaf_b', speed: 1.2 },
  ],
  tileTexts: { h: 'hall_wall', I: 'in_hall_post', X: 'in_hall_hearth' },

  // None.
  npcs: [
  ],
};
