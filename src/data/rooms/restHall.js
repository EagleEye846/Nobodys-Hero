// THE HALL OF HERALDS: the long hall built for the Hero's welcome feast. The
// table is laid (and relaid, every week, for a hundred years), the Hero's
// chair stands at its head, the trumpets hang polished on their racks, and
// the fanfare band rehearses in the corner. The Book of Arrivals on its
// stand records everyone who ever came up the stair.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         r  rug
//   D  doorway (walk through it; see `doors`)
export const REST_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_hall',
  // The room's name, for the Room Editor.
  name: 'THE HALL OF HERALDS',
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
    '####################',
    '#hhhhhhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhhhhhh#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#ooooorrrrrrrrooooo#',
    '#ooooorrrrrrrrooooo#',
    '#ooooorrrrrrrrooooo#',
    '#ooooorrrrrrrrooooo#',
    '#ooooorrrrrrrrooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#########DD#########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 9, y: 13 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 9, y: 14, w: 2, h: 1, to: 'rest_square', spawn: { x: 22, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    // The feast table, laid for the Hero, and the Hero's chair at its head.
    { sprite: 'hero_chair', x: 9, y: 4, text: 'hall_chair' },
    { sprite: 'long_table', x: 8, y: 6, text: 'hall_table' },
    { sprite: 'chair', x: 7, y: 7, text: 'hall_chairs' },
    { sprite: 'chair', x: 12, y: 7, text: 'hall_chairs' },
    { sprite: 'trumpet_rack', x: 2, y: 2, text: 'hall_trumpets' },
    { sprite: 'trumpet_rack', x: 15, y: 2, text: 'hall_trumpets' },
    { sprite: 'book_stand', x: 17, y: 10, text: 'hall_book', notice: true },
    { sprite: 'fireplace', x: 4, y: 2, text: 'hall_fire', animation: 'fireplace', speed: 0.2 },
    { sprite: 'fireplace', x: 12, y: 2, text: 'hall_fire', animation: 'fireplace', speed: 0.22 },
    // The fanfare band, rehearsing. They have had a hundred years of practice.
    { sprite: 'herald', x: 3, y: 10, npc: 'herald_band_1' },
    { sprite: 'herald', x: 3, y: 12, npc: 'herald_band_2' },
    { sprite: 'herald_kid', x: 5, y: 11, npc: 'herald_band_3' },
    { sprite: 'herald', x: 15, y: 12, npc: 'herald_conductor' },
    { sprite: 'banner_pole', x: 1, y: 6, text: 'hall_banner' },
    { sprite: 'banner_pole', x: 18, y: 6, text: 'hall_banner' },
    { sprite: 'sign', x: 13, y: 12, text: 'hall_sign' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { r: 'hall_rug', h: 'hall_wall' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
