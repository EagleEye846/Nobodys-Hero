// The Lantern Hall: north of the Ruins entrance. A long hall of lantern pillars
// and a great rug, haunted by a lantern moth. Tile key is in startRoom.js.
export const LANTERN_HALL = {
  id: 'lantern_hall',
  name: 'LANTERN HALL',
  area: 'ruins',
  music: 'ruins',

  tiles: [
    '######################',
    '#WWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWW#',
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

  playerStart: { x: 10, y: 14 },

  doors: [{ x: 10, y: 15, w: 2, h: 1, to: 'ruins_entrance', spawn: { x: 24, y: 3 } }],

  textFile: 'interactions/the_ruins.txt',
  props: [
    { sprite: 'sign', x: 5, y: 3, text: 'hall_plaque' },
    { sprite: 'savepoint', x: 16, y: 13, save: true },
  ],

  // The moth and the waxling patrol close together, so they often fight as a
  // pair; the shade drifts nearby and can join them.
  npcs: [
    { art: 'moth', enemy: 'moth', x: 10, y: 8, patrol: [7, 14] },
    { art: 'waxling', enemy: 'waxling', x: 9, y: 11, patrol: [6, 13] },
    { art: 'shade', enemy: 'shade', x: 16, y: 5, patrol: [13, 19] },
  ],
};
