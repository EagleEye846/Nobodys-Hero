// THE READING ROOM (a secret): behind the shelf that moves, in the Drowned
// Library. The water never got in here. A reading desk, a lamp, a book still
// open where somebody stopped reading, and in it, for a bookmark, a sword.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
export const CITY_READING_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_reading_room',
  // The room's name, for the Room Editor.
  name: 'THE READING ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // Quiet.
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '.............#',
    '#............#',
    '#............#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 1, to: 'city_library', spawn: { x: 26, y: 14 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'chest', x: 7, y: 3, text: 'reading_desk', gives: 'bookmark', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'bookshelf', x: 2, y: 2, text: 'reading_shelves' },
    { sprite: 'bookshelf', x: 10, y: 2, text: 'reading_shelves' },
    { sprite: 'lamp', x: 9, y: 3, text: 'reading_lamp' },
    { sprite: 'gold_pouch', x: 11, y: 7, text: 'reading_purse', gold: 260, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'armchair', x: 5, y: 4, text: 'reading_chair' },
  ],
  tileTexts: { W: 'reading_wall', '#': 'reading_wall' },

  // Nobody.
  npcs: [],
};
