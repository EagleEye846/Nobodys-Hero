// TAPER'S HALLWAY: through the right door of her home. A mirror, a runner
// down the middle, your room through the doorway, and Taper's door, sealed.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            h  home wall (solid)
//   o  wooden floor                                r  rug
//   p  potted plant (solid)                        D  doorway (walk through it; see `doors`)
//   u  stairs down (walk through it; see `doors`)
export const TAPER_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'taper_hall',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S HALLWAY',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',

  tiles: [
    '######################',
    '#hhhhhhhDDhhhhhhhhhhh#',
    '#hhhhhhhDDhhhhhhhhhhh#',
    '#ooooooooooooooooooop#',
    'Dorrrrrrrrrrrrrrrrroo#',
    'Dorrrrrrrrrrrrrrrrroo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '##################uu##',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 4, w: 1, h: 2, to: 'taper_home', spawn: { x: 18, y: 7 } },
    { x: 8, y: 1, w: 2, h: 2, to: 'your_room', spawn: { x: 6, y: 9 } },
    { x: 18, y: 8, w: 2, h: 1, to: 'way_out', spawn: { x: 3, y: 4 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'mirror', x: 4, y: 3, text: 'hall_mirror' },
    { sprite: 'lamp', x: 12, y: 3, text: 'room_lamp' },
    { sprite: 'locked_door', x: 16, y: 3, text: 'hall_door' },
  ],

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
