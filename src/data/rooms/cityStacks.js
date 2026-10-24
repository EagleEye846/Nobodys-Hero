// THE STACKS (a secret): the Drowned Library's cellar, under the floor in
// its south-west corner, where they kept the books nobody asked for. You
// don't find the way in: the floor finds it for you (a crumbling `drop`,
// see src/overworld/crumble.js). Dry, dark, books to the ceiling, and a
// chest pushed under the bottom shelf. A stair up takes you back.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
//   U  a stair up (the way back into the library)
export const CITY_STACKS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_stacks',
  // The room's name, for the Room Editor.
  name: 'THE STACKS',
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
    '######U#######',
    '#WWWWW.WWWWWW#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '##############',
  ],

  // Where the player starts, in tile coordinates (where you land, falling in).
  playerStart: { x: 3, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 0, w: 1, h: 1, to: 'city_library', spawn: { x: 2, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'bookshelf', x: 1, y: 2, text: 'stacks_shelf' },
    { sprite: 'bookshelf', x: 9, y: 2, text: 'stacks_shelf' },
    { sprite: 'bookshelf', x: 11, y: 2, text: 'stacks_shelf' },
    { sprite: 'book_heap', x: 4, y: 2, text: 'stacks_heap' },
    { sprite: 'book_heap', x: 8, y: 6, text: 'stacks_heap' },
    { sprite: 'book_heap', x: 2, y: 7, text: 'stacks_heap' },
    { sprite: 'chest', x: 12, y: 7, text: 'stacks_chest', gives: 'heros_offering', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 10, y: 5, text: 'stacks_purse', gold: 320, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'stacks_wall', '#': 'stacks_wall', U: 'stacks_stair' },

  // Nobody.
  npcs: [],
};
