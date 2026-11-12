// CORRIE'S ROOM: the little room at the top of the tower, where a small boy slept. It is kept
// tidy as if he is coming back: the bed made with sheets that are new, a toy boat on the floor
// (BOTHER II on its side), and, pinned to the wall with two red-headed pins, a drawing in
// wax crayon: a lighthouse, and two small figures under it, one labelled ME and one THE HERO.
// A sea chest at the foot of the bed holds the Lightman's Coat. PUZZLE-FREE, no monsters; the
// song is the lullaby. Z on the things is all there is: nobody explains any of it.
// Tile key (see src/overworld/coastTiles.js, haddock_light, indoors):
//   #  wall top (solid)   h  white brick (solid)   6  lit window   o  boards

export const HADDOCK_LIGHT_CORRIES_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'haddock_light_corries_room',
  // The room's name, for the Room Editor.
  name: "CORRIE'S ROOM",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'haddock_light',
  // "Come In, Little Boat", a music box.
  music: 'corrieLullaby',
  ambience: 'lighthouse',
  // After the chapter (the_light_answers): no storm on the windows, as in the Isles' old lightroom.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_lighthouse' },
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  // Round, like the tower: the corners are cut off.
  tiles: [
    '############',
    '##hhhhhhhh##',
    '#hhhh66hhhh#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '#oooooooooo#',
    '##oooooooo##',
    '#####oo#####',
  ],

  // Where the player starts, in tile coordinates: just in from the door.
  playerStart: { x: 5, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back down the stair.
    { x: 5, y: 10, w: 2, h: 1, to: 'haddock_light_stair', spawn: { x: 2, y: 4 } },
  ],

  // The drawing, ME and THE HERO (trail 5: me_and_the_hero), just inside the door.
  cutscenes: [
    { x: 4, y: 8, w: 4, h: 1, scene: 'me_and_the_hero', until: ['the_light_answers', 'haddock_gone'] },
  ],

  // The made bed, the drawing, the toy boat, the chest.
  textFile: 'interactions/haddock_light.txt',
  props: [
    { sprite: 'bed', x: 1, y: 4, text: 'room_bed' },
    { sprite: 'c5_child_drawing', x: 7, y: 2, text: 'room_drawing' },
    { sprite: 'c5_toy_boat', x: 3, y: 7, text: 'room_boat' },
    { sprite: 'c5_chest', x: 9, y: 4, text: 'room_chest', gives: 'lightmans_coat', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    // (2026-11-08) A rag rug by the bed, laid straight.
    { sprite: 'in_rug_blue', x: 1, y: 5, text: 'in_room_rug', walkable: true, flat: true },
    // (2026-11-08b) Kept ready: a lamp left lit on a stool by the bed, his books piled by the
    // chest, a geranium on the floor under the window.
    { sprite: 'in_lamp_stool', x: 3, y: 4, text: 'in_lamp' },
    { sprite: 'in_book_pile', x: 10, y: 7, text: 'in_books' },
    { sprite: 'in_plant_pot', x: 4, y: 3, text: 'in_plant' },
  ],
  tileTexts: { '#': 'room_wall', h: 'room_wall', 6: 'room_window', o: 'room_floor' },

  // Nobody to fight in a child's room.
  npcs: [],
};
