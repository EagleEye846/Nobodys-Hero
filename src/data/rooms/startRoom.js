// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)     W  wall face (solid)
//   .  floor                r  rug
//   p  potted plant (solid)
export const START_ROOM = {
  tiles: [
    '##############################',
    '#WWWWWWWWWWWW##WWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWW##WWWWWWWWWWWWWW#',
    '#............##..............#',
    '#.p..........##.............p#',
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

  // Each text entry is one page of the textbox. Use \n for line breaks (3 lines max).
  props: [
    {
      sprite: 'sign',
      x: 6,
      y: 3,
      text: [
        'Welcome to the prototype.\nUse the arrow keys to walk.',
        'Hold X or Shift to run.\nPress Z to read signs.',
      ],
    },
    {
      sprite: 'sign',
      x: 21,
      y: 3,
      text: ['This is the east room.\nA rogue dummy haunts it.\nTouch it and it attacks!'],
    },
  ],

  // Enemies wandering the room. Touching one starts a battle.
  // x/y and the patrol bounds are tile coordinates; `enemy` picks the battle stats.
  npcs: [{ art: 'dummy', enemy: 'dummy', x: 21, y: 11, patrol: [18, 24] }],
};
