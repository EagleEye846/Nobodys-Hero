// The Lantern Hall: north of the Ruins entrance. A long hall of lantern pillars
// and a great rug, haunted by a lantern moth. Tile key is in startRoom.js.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                W  wall face (solid)
//   .  floor                           r  rug
//   P  pillar with a lantern (solid)   D  doorway (walk through it; see `doors`)
export const LANTERN_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lantern_hall',
  // The room's name, for the Room Editor.
  name: 'LANTERN HALL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'ruins',

  tiles: [
    '######################',
    '#WWWWWWWWWDDWWWWWWWWW#',
    '#WWWWWWWWWDDWWWWWWWWW#',
    '#....................#',
    '#..P..............P..#',
    '#....................#',
    '#.....rrrrrrrrrr.....#',
    '#..P..rrrrrrrrrr..P..#',
    '#.....rrrrrrrrrr.....#',
    '#.....rrrrrrrrrr.....#',
    '#..P..rrrrrrrrrr..P..#',
    '#.....rrrrrrrrrr.....#',
    '#....................#',
    '#..P..............P..#',
    '#....................#',
    '##########DD##########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 14 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 10, y: 15, w: 2, h: 1, to: 'ruins_entrance', spawn: { x: 24, y: 3 } },
    { x: 10, y: 1, w: 2, h: 2, to: 'pillar_room', spawn: { x: 10, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'sign', x: 5, y: 3, text: 'hall_plaque' },
    { sprite: 'savepoint', x: 16, y: 13, save: true },
    { sprite: 'gate', x: 10, y: 3, text: 'hall_gate', opensWith: ['west', 'east', 'heart'], inOrder: true, openText: 'hall_gate_open', resetText: 'hall_gate_reset' },
    { sprite: 'sign', x: 13, y: 3, text: 'hall_riddle' },
    { sprite: 'lantern_post', x: 5, y: 11, text: 'hall_lantern', lever: 'west' },
    { sprite: 'lantern_post', x: 16, y: 11, text: 'hall_lantern', lever: 'east' },
    { sprite: 'lantern_post', x: 10, y: 13, text: 'hall_lantern', lever: 'heart' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { F: 'flower_beds' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [
    { art: 'moth', enemy: 'moth', x: 10, y: 8, patrol: [7, 14] },
    { art: 'waxling', enemy: 'waxling', x: 9, y: 11, patrol: [6, 13] },
    { art: 'shade', enemy: 'shade', x: 16, y: 5, patrol: [13, 19] },
  ],
};
