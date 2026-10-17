// THE RUINS: made in Ruins Studio (tools/).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                         W  wall face (solid)
//   .  floor                                    r  rug
//   p  potted plant (solid)                     F  flower bed (solid)
//   D  doorway (walk through it; see `doors`)   S  statue (walk or hide behind) (solid)
export const START_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ruins_entrance',
  // The room's name, for the Room Editor.
  name: 'THE RUINS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'ruins',

  tiles: [
    '##############################',
    '#WWWWWWWWWWWW##WWWWWWWWWDDWWW#',
    '#WWWWWWWWWWWW##WWWWWWWWWDDWWW#',
    '#............##........S.....#',
    '#.p..........##..FF.........p#',
    '#............##..............#',
    '#...rrrrrr...##..............#',
    '#...rrrrrr...##......pp......#',
    '#...rrrrrr...##..............#',
    '#...rrrrrr...................#',
    '#............................#',
    '#............##..............#',
    '#............##..............#',
    '#............##......pp......#',
    '#............##..............#',
    '#.p..........##..............#',
    '#............##.............p#',
    '#............##..............#',
    '#............##..............#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 24, y: 1, w: 2, h: 2, to: 'lantern_hall', spawn: { x: 10, y: 14 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 10, w: 6, h: 6, scene: 'meeting_the_keeper' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'sign', x: 6, y: 3, text: 'welcome_sign' },
    { sprite: 'sign', x: 21, y: 3, text: 'east_sign' },
    { sprite: 'merchant', x: 11, y: 5, shop: 'ruins_shop' },
    { sprite: 'savepoint', x: 3, y: 12, save: true },
    { sprite: 'keeper', x: 9, y: 15, npc: 'old_keeper' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: {},

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [
    { art: 'dummy', enemy: 'dummy', x: 21, y: 11, patrol: [18, 24] },
    { art: 'bunny', enemy: 'bunny', x: 20, y: 16, patrol: [16, 26] },
    { art: 'waxling', enemy: 'waxling', x: 21, y: 5, patrol: [16, 26] },
    { art: 'bunny', enemy: 'bunny', x: 24, y: 8, patrol: [16, 27] },
  ],
};
