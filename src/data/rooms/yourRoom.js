// YOUR ROOM: off Taper's hallway. She made it up for a guest long ago: a bed,
// a lamp, and a chest of toys that are all Hero costumes.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           o  wooden floorboards
//   h  papered wall with wood panelling (solid)   r  rug
//   D  doorway (walk through it; see `doors`)
export const YOUR_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'your_room',
  // The room's name, for the Room Editor.
  name: 'YOUR ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooorrrroooo#',
    '#oooorrrroooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######DD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 10, w: 2, h: 1, to: 'taper_hall', spawn: { x: 8, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'bed', x: 2, y: 3, text: 'room_bed' },
    { sprite: 'toy_chest', x: 6, y: 3, text: 'room_toys' },
    { sprite: 'lamp', x: 8, y: 3, text: 'room_lamp' },
    { sprite: 'drawer', x: 11, y: 3, text: 'room_drawer' },
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
  npcs: [],
};
