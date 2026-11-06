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
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'hearth',
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
  cutscenes: [{ x: 7, y: 8, w: 8, h: 3, scene: 'lantern_at_noon' }],

  // The oilskin, the tide table, the lifeboat, Haddock, a kettle on a stove, the lantern,
  // the SAVE crystal, ropes, buoys, barrels and a purse.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'c5_oilskin_hook', x: 2, y: 3, text: 'house_oilskin' },
    { sprite: 'c5_tide_board', x: 5, y: 3, text: 'house_tide_board' },
    { sprite: 'c5_lifebuoy_post', x: 8, y: 3, text: 'house_lifebuoy' },
    { sprite: 'cf_haddock', x: 12, y: 4, npc: 'haddock_house', animation: 'cf_haddock', speed: 0.5 },
    { sprite: 'stove', x: 15, y: 3, text: 'house_kettle' },
    { sprite: 'c5_rowboat', x: 4, y: 7, text: 'house_lifeboat' },
    { sprite: 'savepoint', x: 15, y: 8, save: true },
    { sprite: 'c5_lantern_post_lit', x: 11, y: 9, text: 'house_lantern', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_rope_coil', x: 6, y: 10, text: 'house_rope', walkable: true },
    { sprite: 'c5_buoys_pile', x: 2, y: 9, text: 'house_buoys' },
    { sprite: 'c5_barrels', x: 15, y: 5, text: 'house_barrels' },
    { sprite: 'gold_pouch', x: 16, y: 10, text: 'house_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { h: 'house_wall' },

  // None: a save room, with a walrus.
  npcs: [
  ],
};
