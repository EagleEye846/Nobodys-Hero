// THE WAITING ROOM (a secret, Chapter 3): the last room before the Registry,
// where those who had come to be counted waited their turn on long benches
// under a board of numbers. Nothing here hunts anyone. A save crystal stands in the
// middle of it (the Register's doors are through the arch on the east wall).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
export const REGISTRY_WAITING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'registry_waiting',
  // The room's name, for the Room Editor.
  name: 'THE WAITING ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "Counted Every Night" (registryArchiveTheme.js): the way in to the Registry.
  music: 'registryArchive',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  gloom: 0.2,

  tiles: [
    '######################',
    '#WWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWW#',
    '#..J...............I.#',
    '#....................#',
    '......................',
    '#....................#',
    '#..I..............J..#',
    '#....................#',
    '######################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 5, w: 1, h: 1, to: 'registry_stacks', spawn: { x: 34, y: 6 } },
    { x: 21, y: 5, w: 1, h: 1, to: 'registry_lair', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'savepoint', x: 10, y: 5, save: true },
    { sprite: 'bench', x: 5, y: 3, text: 'waiting_bench' },
    { sprite: 'bench', x: 8, y: 3, text: 'waiting_bench' },
    { sprite: 'bench', x: 13, y: 3, text: 'waiting_bench' },
    { sprite: 'bench', x: 16, y: 3, text: 'waiting_bench' },
    { sprite: 'bench', x: 5, y: 7, text: 'waiting_bench' },
    { sprite: 'bench', x: 8, y: 7, text: 'waiting_bench' },
    { sprite: 'bench', x: 13, y: 7, text: 'waiting_bench' },
    { sprite: 'bench', x: 16, y: 7, text: 'waiting_bench' },
    { sprite: 'inscription', x: 10, y: 3, text: 'waiting_board' },
    { sprite: 'sign', x: 19, y: 4, text: 'waiting_sign' },
    { sprite: 'book_heap', x: 2, y: 8, text: 'stacks_heap' },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', I: 'city_pillar', J: 'city_pillar' },

  // Nobody waiting. Everybody was seen to.
  npcs: [],
};
