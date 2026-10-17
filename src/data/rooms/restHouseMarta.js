// MARTA'S: the knitter's cottage. Every scarf in the village came from this
// room, and so did the one that goes all the way round the square. Her hare,
// Button, has the chair by the fire.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         r  rug
//   D  doorway (walk through it; see `doors`)
export const REST_HOUSE_MARTA = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_house_marta',
  // The room's name, for the Room Editor.
  name: 'MARTA\'S',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Indoors.
  indoors: true,

  tiles: [
    '############',
    '#hhhhhhhhhh#',
    '#hhhhhhhhhh#',
    '#oooooooooo#',
    '#oorrrrrroo#',
    '#oorrrrrroo#',
    '#oorrrrrroo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#####DD#####',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 5, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 5, y: 9, w: 2, h: 1, to: 'rest_square', spawn: { x: 5, y: 25 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    { sprite: 'fireplace', x: 4, y: 2, text: 'marta_fire', animation: 'fireplace', speed: 0.2 },
    { sprite: 'armchair', x: 3, y: 5, text: 'marta_chair' },
    { sprite: 'bed', x: 8, y: 3, text: 'marta_bed' },
    { sprite: 'bookshelf', x: 1, y: 2, text: 'marta_patterns' },
    { sprite: 'drawer', x: 9, y: 2, text: 'marta_drawer', gives: 'pine_candy' },
    { sprite: 'toy_chest', x: 1, y: 7, text: 'marta_basket' },
    { sprite: 'snow_hare', x: 6, y: 5, npc: 'marta_hare' },
    { sprite: 'side_table', x: 8, y: 7, text: 'marta_table' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { r: 'marta_rug', h: 'marta_wall' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
