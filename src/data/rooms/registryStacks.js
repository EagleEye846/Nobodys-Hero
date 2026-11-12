// THE SILENT STACKS (a secret, Chapter 3): the registry's long stacks, shelves
// of ledgers going up out of sight, and something going up and down the
// skylights above them: the Hush's shadow. When it comes over, tuck into an
// alcove between the shelves and keep still. If it sees you, back to the
// start. (The Last Street's timing, among books.)
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
export const REGISTRY_STACKS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'registry_stacks',
  // The room's name, for the Room Editor.
  name: 'THE SILENT STACKS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // The Hush's stalking music (hushStalkTheme.js).
  music: 'hushStalk',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  gloom: 0.4,
  // The Hush's shadow going over the skylights (see src/overworld/hushwood.js).
  hush: { path: [[2, 5], [41, 5, 1], [41, 9], [2, 9, 1]], speed: 54, radius: 34, start: 0.3 },

  tiles: [
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#..........................................#',
    '#.I...........I...............I.......I....#',
    '#.........................J.................',
    '#.................I.........................',
    '#.......J..................................#',
    '#.....................I.........I........J.#',
    '#....I......J..............................#',
    '################..##########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 11, w: 2, h: 1, to: 'registry_cellar', spawn: { x: 7, y: 3 } },
    { x: 43, y: 6, w: 1, h: 2, to: 'registry_waiting', spawn: { x: 1, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    // Alcoves along the top aisle and the bottom one: the only places to keep still.
    { sprite: 'alcove', x: 6, y: 4, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 13, y: 4, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 20, y: 4, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 27, y: 4, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 34, y: 4, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 41, y: 4, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 9, y: 10, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 24, y: 10, text: 'stacks_alcove', hide: true },
    { sprite: 'alcove', x: 36, y: 10, text: 'stacks_alcove', hide: true },
    { sprite: 'bookshelf', x: 9, y: 4, text: 'stacks_shelves' },
    { sprite: 'bookshelf', x: 16, y: 4, text: 'stacks_shelves' },
    { sprite: 'bookshelf', x: 23, y: 4, text: 'stacks_shelves' },
    { sprite: 'bookshelf', x: 30, y: 4, text: 'stacks_shelves' },
    { sprite: 'bookshelf', x: 37, y: 4, text: 'stacks_shelves' },
    { sprite: 'book_heap', x: 12, y: 9, text: 'stacks_heap' },
    { sprite: 'book_heap', x: 29, y: 8, text: 'stacks_heap' },
    { sprite: 'water_mark', x: 20, y: 7, text: 'water_mark', walkable: true },
    { sprite: 'scorch_mark', x: 40, y: 7, text: 'cleft_scorch', walkable: true, light: 14 },
    { sprite: 'sign', x: 40, y: 9, text: 'stacks_sign' },
    // The claw marks on the shelves: it's been in here too.
    { sprite: 'bristle_tuft', x: 26, y: 5, text: 'bristle_tuft', walkable: true },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', I: 'city_pillar', J: 'city_pillar' },

  // Nothing else goes down these aisles. Nothing dares.
  npcs: [],
};
