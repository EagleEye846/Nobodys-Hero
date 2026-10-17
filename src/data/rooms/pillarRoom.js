// PILLAR ROOM: made in Ruins Studio (tools/).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                         W  wall face (solid)
//   .  floor                                    r  rug
//   D  doorway (walk through it; see `doors`)   I  tall pillar (walk or hide behind) (solid)
export const PILLAR_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pillar_room',
  // The room's name, for the Room Editor.
  name: 'PILLAR ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'ruins',

  tiles: [
    '####################',
    '#WWWWWWWWDDDWWWWWWW#',
    '#WWWWWWWWDDDWWWWWWW#',
    '#.......I...I......#',
    '#..................#',
    '#..................#',
    '#....I....I...I....#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#....I........I....#',
    '#........rrr.......#',
    '#.......IrrrI......#',
    '#########DDD########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 14, w: 3, h: 1, to: 'lantern_hall', spawn: { x: 10, y: 3 } },
    { x: 9, y: 1, w: 3, h: 2, to: 'flower_room', spawn: { x: 10, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { I: 'ruins_pillars' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [
    { enemy: 'columneon', x: 10, y: 6, patrol: [8, 12], behaviour: 'disguise', reach: 3 },
  ],
};
