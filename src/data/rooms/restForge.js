// TILDA'S FORGE: the smithy of Heralds' Rest, where the fire has been kept lit
// every day for a hundred years in case the Hero needed a sword in a hurry.
// Tilda cooks on it too, so it smells of hot iron and fresh bread. Talk to
// her to shop (src/data/shops.js: rest_forge).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         D  doorway (walk through it; see `doors`)
export const REST_FORGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_forge',
  // The room's name, for the Room Editor.
  name: "TILDA'S FORGE",
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Indoors: the screen's edges darken, like the Ruins.
  indoors: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######DD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 6, y: 11, w: 2, h: 1, to: 'rest_square', spawn: { x: 16, y: 25 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    // The forge itself, which is also the oven.
    { sprite: 'fireplace', x: 1, y: 2, text: 'forge_fire', animation: 'fireplace', speed: 0.18 },
    { sprite: 'counter', x: 5, y: 5, text: 'forge_counter' },
    { sprite: 'counter', x: 6, y: 5, text: 'forge_counter' },
    { sprite: 'counter', x: 7, y: 5, text: 'forge_counter' },
    // Tilda, behind the counter: talk to her to shop.
    { sprite: 'herald_smith', x: 6, y: 4, shop: 'rest_forge' },
    { sprite: 'anvil', x: 10, y: 4, text: 'forge_anvil' },
    { sprite: 'stove_pot', x: 12, y: 2, text: 'forge_pot' },
    { sprite: 'barrel', x: 12, y: 8, text: 'forge_barrel' },
    { sprite: 'crates', x: 1, y: 8, text: 'forge_crates' },
    { sprite: 'crates', x: 2, y: 9, text: 'forge_crates' },
    { sprite: 'sign', x: 9, y: 8, text: 'forge_sign' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { h: 'forge_wall' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
