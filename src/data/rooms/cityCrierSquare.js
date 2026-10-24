// THE CRIER'S SQUARE: where the city's news was read out, from the big stone
// in the middle. A Herald's Echo still stands up on it, crying the Hero's
// coming to nobody, the way it has every morning for longer than anyone
// remembers (the_crier).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   b  old stone step (jump up onto it; Ves can not)
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
export const CITY_CRIER_SQUARE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_crier_square',
  // The room's name, for the Room Editor.
  name: 'THE CRIER\'S SQUARE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "What They Built for Him" (valleyTheme.js).
  music: 'valley',
  // Its old flagstones crack under every landing, and give way in the end,
  // like the Ruins' floors (see OverworldScene.handleLanding).
  crumbles: true,
  // The paving round the crier's stone is split all the way round (`!`): to
  // get up to it, step on and jump before the slab goes (crumble.js). Each
  // slab goes on its own here (no `spread`), so there's always a way down.
  crumble: { spread: 0 },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    '##########################',
    '#WWWWWWWWWWWWWWWWWWWWWWWW#',
    '#........................#',
    '#........................#',
    '#...I................I...#',
    '#.........!!!!!!.........#',
    '#.........!bbbb!.........#',
    '..........!bbbb!..........',
    '..........!bbbb!..........',
    '#.........!bbbb!.........#',
    '#.........!!!!!!.........#',
    '#........................#',
    '#...I................I...#',
    '#........................#',
    '#........................#',
    '##########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'city_library', spawn: { x: 26, y: 8 } },
    { x: 25, y: 7, w: 1, h: 2, to: 'city_aqueduct', spawn: { x: 1, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 6, y: 5, w: 1, h: 6, scene: 'the_crier' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'plinth_empty', x: 3, y: 8, text: 'crier_plinth' },
    { sprite: 'plinth_empty', x: 22, y: 8, text: 'crier_plinth' },
    { sprite: 'notice_board', x: 17, y: 2, text: 'crier_board' },
    { sprite: 'street_lamp_dead', x: 9, y: 3, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 16, y: 13, text: 'dead_lamp' },
    { sprite: 'inscription', x: 13, y: 12, text: 'crier_inscription' },
    { sprite: 'gold_pouch', x: 12, y: 7, text: 'crier_purse', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 24, y: 2, text: 'crier_chest', gives: 'criers_mittens', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', '!': 'cracked_floor', I: 'city_pillar', b: 'crier_stone' },

  // Herald's Echoes, and a Lamp Mite.
  npcs: [
    { enemy: 'heralds_echo', x: 18, y: 11, patrol: [16, 22] },
    { enemy: 'lamp_mite', x: 8, y: 12, patrol: [6, 10] },
  ],
};
