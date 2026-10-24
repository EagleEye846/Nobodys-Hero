// THE CHAPEL WITH NO BELL: down the lane, built into the old hall's west wall.
// Pews, candles, an altar, and over it a bell frame with no bell. When the
// town stopped waiting for the Hero, they took the bell down and made it into
// pots. Old Tam keeps the place swept anyway.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
export const LASTHOME_CHAPEL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lasthome_chapel',
  // The room's name, for the Room Editor.
  name: 'THE CHAPEL WITH NO BELL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'lasthome',
  // "The Ones Who Stopped Waiting" (lasthomeTheme.js).
  music: 'lasthome',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#WWWWWWWWWWWW#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#.............',
    '#.............',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 12, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 13, y: 7, w: 1, h: 2, to: 'lasthome_square', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lasthome.txt',
  props: [
    { sprite: 'bell_frame_empty', x: 6, y: 2, text: 'chapel_bell_frame' },
    { sprite: 'chapel_altar', x: 6, y: 4, text: 'chapel_altar' },
    { sprite: 'chapel_candles', x: 3, y: 3, text: 'chapel_candles' },
    { sprite: 'chapel_candles', x: 10, y: 3, text: 'chapel_candles' },
    { sprite: 'pew', x: 3, y: 6, text: 'chapel_pew' },
    { sprite: 'pew', x: 3, y: 8, text: 'chapel_pew' },
    { sprite: 'pew', x: 3, y: 10, text: 'chapel_pew' },
    { sprite: 'pew', x: 8, y: 6, text: 'chapel_pew' },
    { sprite: 'pew', x: 8, y: 8, text: 'chapel_pew' },
    { sprite: 'pew', x: 8, y: 10, text: 'chapel_pew' },
    { sprite: 'lh_tam', x: 10, y: 11, npc: 'lh_tam' },
    { sprite: 'sign', x: 1, y: 12, text: 'chapel_board' },
  ],
  tileTexts: { W: 'chapel_wall', '#': 'chapel_wall' },

  // Nobody to fight.
  npcs: [],
};
