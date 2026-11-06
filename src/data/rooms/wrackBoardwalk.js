// THE BOARDWALK: a plank path on stilts, zigzagging up the face of the headland toward
// Saltcombe, two boards wide, with rails on the sea side and the green sea churning below. A
// save crystal on the second flight, and a few lamps. Puzzle-free and no monsters. At the
// top (x 23 to 24, row 2), the path runs on up into Saltcombe's quay.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   o  wet boards   f  rail (solid)
//   ~  sea (solid)   x  barnacle rock (solid)

export const WRACK_BOARDWALK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_boardwalk',
  // The room's name, for the Room Editor.
  name: 'THE BOARDWALK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  vesWell: true,

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '############~~~~~~~~~~foof~~~~~#',
    '############~~~~~~~~~~foof~~~~~#',
    '############fffffffffffoof~~~~~#',
    '############ooooooooooooof~~~~~#',
    '############ooooooooooooof~~~~~#',
    '############ooffffffffffff~~~~~#',
    '############oof~~~~~~~~~~~~~~~~#',
    '############ooffffffffffffff~~~#',
    '############ooooooooooooooof~~~#',
    '############ooooooooooooooof~~~#',
    '############fffffffffffffoof~~~#',
    '############~~~~~~~~xx~~foof~~~#',
    '############~~~~~~~~~x~~foof~~~#',
    '############fffffffffffffoof~~~#',
    '############foooooooooooooof~~~#',
    '############foooooooooooooof~~~#',
    '############foofffffffffffff~~~#',
    '############foof~~~~~~~~~~~~~~~#',
    '############foof~~~~~~~~~~~~~~~#',
    '#WWWWWWWWWWWfoof~~~~~~~~~~~~~~~#',
    'ooooooooooooooof~~~~~~~~~~~~~~~#',
    'ooooooooooooooof~~~~~~~~~~~~~~~#',
    '#fffffffffffffff~~~~~~~~~~~~~~~#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 22, w: 1, h: 2, to: 'wrack_bathtub', spawn: { x: 38, y: 8 } },
    // Up the top flight into Saltcombe (the quay's pier).
    { x: 23, y: 2, w: 2, h: 1, to: 'saltcombe_quay', spawn: { x: 5, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    { sprite: 'savepoint', x: 20, y: 17, save: true },
    { sprite: 'street_lamp', x: 15, y: 22, text: 'walk_lamp' },
    { sprite: 'street_lamp', x: 27, y: 14, text: 'walk_lamp' },
    { sprite: 'street_lamp', x: 14, y: 8, text: 'walk_lamp' },
    { sprite: 'sign', x: 6, y: 22, text: 'walk_sign' },
    { sprite: 'sign', x: 22, y: 5, text: 'walk_sign_top' },
    { sprite: 'c5_buoys_pile', x: 4, y: 24, text: 'landing_buoy' },
    { sprite: 'gold_pouch', x: 20, y: 11, text: 'walk_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'walk_sea', x: 'landing_rock', f: 'walk_rail' },

  // None: a save room.
  npcs: [
  ],
};
