// BEYOND THE RUINS: through the old door at the end of the way out. The first
// room of the next region, waiting to be built: design it in the Room Editor.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            W  wall face (solid)
//   V  wall face with ivy (solid)                  .  floor
//   c  cracked floor (safe)                        R  fallen stones (solid)
//   D  doorway (walk through it; see `doors`)
export const BEYOND_RUINS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'beyond_ruins',
  // The room's name, for the Room Editor.
  name: 'BEYOND THE RUINS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'beyond',
  // The song that plays here (a file in src/data/music/).
  music: null,

  tiles: [
    '####################',
    '#VVWWWWWWDDWWWWWWVV#',
    '#VWWWWWWWDDWWWWWWWV#',
    '#..................#',
    '#..R...........c...#',
    '#..................#',
    '#.......c..........#',
    '#..............R...#',
    '#..................#',
    '#....c.............#',
    '#..................#',
    '#.R................#',
    '#..................#',
    '#..................#',
    '#########DDD########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 14, w: 3, h: 1, to: 'way_out', spawn: { x: 32, y: 4 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'sign', x: 12, y: 3, text: 'beyond_sign' },
    { sprite: 'savepoint', x: 5, y: 12, save: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: {},

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
