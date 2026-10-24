// THE DROWNED LIBRARY: the old city's library, flooded once and drained again,
// its books in heaps along the shelves. By the way through, three levers, with
// a carving over each (a sun rising, a sun high, a moon); pull them in the
// right order. The order's on an inscription in the old city's writing, and
// only Ves can read it. And one shelf in the east room isn't fixed to the
// wall: behind it, the Reading Room (a secret).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   W  the old city's stone wall (solid)
export const CITY_LIBRARY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_library',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED LIBRARY',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "What They Built for Him" (valleyTheme.js).
  music: 'valley',
  // Its old flagstones crack under every landing, and give way in the end,
  // like the Ruins' floors (see OverworldScene.handleLanding). The corner
  // by the purse has sunk (`!`): stand on it and it drops you into the
  // Stacks below, a secret (a `drop`, see crumble.js), not a game over.
  crumbles: true,
  crumble: { drops: [{ x: 1, y: 15, w: 4, h: 2, to: 'city_stacks', spawn: { x: 3, y: 4 } }] },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#...................W......#',
    '#...................W......#',
    '#...................W......#',
    '#W.WWWWWWW..WWWWWW..W......#',
    '#...................W......#',
    '#...................W......#',
    '............................',
    '............................',
    '#...................W......#',
    '#W.WWWWWWW..WWWWWW..W......#',
    '#...................W......#',
    '#...................W......#',
    '#W.WWWWWWW..WWWWWW..W.......',
    '#!!!!...............W......#',
    '#!!!!...............W......#',
    '############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'city_colonnade', spawn: { x: 28, y: 7 } },
    { x: 27, y: 8, w: 1, h: 2, to: 'city_crier_square', spawn: { x: 1, y: 7 } },
    { x: 27, y: 14, w: 1, h: 1, to: 'city_reading_room', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'gate_narrow', x: 20, y: 8, text: 'library_gate', opensWith: ['dawn', 'noon', 'night'], inOrder: true, openText: 'library_gate_open', resetText: 'library_gate_reset' },
    { sprite: 'gate_narrow', x: 20, y: 9, text: 'library_gate', opensWith: ['dawn', 'noon', 'night'], inOrder: true },
    { sprite: 'lever', x: 16, y: 7, text: 'lever_noon', lever: 'noon' },
    { sprite: 'lever', x: 17, y: 10, text: 'lever_night', lever: 'night' },
    { sprite: 'lever', x: 13, y: 9, text: 'lever_dawn', lever: 'dawn' },
    { sprite: 'inscription', x: 6, y: 12, text: 'library_inscription' },
    { sprite: 'book_heap', x: 4, y: 4, text: 'book_heap' },
    { sprite: 'book_heap', x: 15, y: 16, text: 'book_heap' },
    { sprite: 'bookshelf', x: 8, y: 15, text: 'library_shelf' },
    { sprite: 'bookshelf', x: 12, y: 2, text: 'library_shelf' },
    // The shelf that moves (it's a rock you can push), hiding the Reading Room's
    // door.
    { sprite: 'bookshelf', x: 26, y: 14, text: 'library_loose_shelf', rock: true },
    { sprite: 'gold_pouch', x: 2, y: 16, text: 'library_purse', gold: 160, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 19, y: 16, text: 'library_chest', gives: 'vellum_canopy', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { W: 'library_shelves', '#': 'city_wall', '!': 'cracked_floor' },

  // Two Herald's Echoes, still crying the news in the stacks.
  npcs: [
    { enemy: 'heralds_echo', x: 5, y: 8, patrol: [3, 9] },
    { enemy: 'heralds_echo', x: 24, y: 4, patrol: [22, 26] },
  ],
};
