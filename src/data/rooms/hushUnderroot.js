// THE UNDERROOT: a dead giant of a tree came down here long ago, and the
// way on goes under it, through the tunnels its roots left in the earth. It's
// dark: only your candle shows anything. Ves came through here too, and drew
// chalk arrows on the root walls at the turns; they only show up in your
// light. A tangle, not a corridor (a maze, with loops),
// with treasure in its dead ends and a Knotling pretending to be a root.
// Tile key (see src/overworld/tileset.js):
//   K  cave wall (solid)
//   k  cave rock (solid)
//   q  cave floor
export const HUSH_UNDERROOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_underroot',
  // The room's name, for the Room Editor.
  name: 'THE UNDERROOT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.85,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqkqqqkk',
    'kqqqkKKKKKKKKKKKKKKKqKKqkqkqKKkk',
    'kqqqkqqqqqqqqqqqqqqqqqqqkqkqqqkk',
    'kqqqkqqKKKkKKqKKKqKqqqKKKqkqkqkk',
    'kqqqkqqqqqkqqqqqqqqqKqqqqqkqkqkk',
    'kqKqkKKKkqkqqqKKKKKqqqkqKqKKKqkk',
    'kqqqkqqqkqkqkqqqqqqqkqkqqqqqqqkk',
    'kqKqkKKqkqkqkqKKkKKKKqKKKKKKkqkk',
    'kqqqkqqqkqkqkqqqkqqqqqqqqqqqkqkk',
    'KKkqkqKKKqkqkKKqKqkqKKkKKKKqKqKK',
    'qqkqkqqqqqkqkqqqqqkqqqkqqqqqqqqq',
    'qqKqkqkKKKkqKKkKqKKKkqkqkqKqkqqq',
    'kqqqkqkqqqkqqqkqqqqqkqkqkqqqkqkk',
    'kqkKKKKqkqKKkqKqkKkqkqKqKKkqkqkk',
    'kqkqqqqqkqqqkqqqKqkqkqqqqqkqkqkk',
    'kqKqkKKKKKKqkqKqqqkqKKKKKqKKKqkk',
    'kqqqKqqqqqqqkqqqqqkqqqqqqqqqqqkk',
    'kqKqqqKKKKKKkKKKKqkKKKKqKKKKKKkk',
    'kqqqkqqqqqqqkqqqqqkqqqqqqqqqqqkk',
    'kKKKKKKKKKKqKqqqKKKqkKKKKKKKKqkk',
    'kqqqqqqqqqqqqqkqqqqqkqqqqqqqqqkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 30, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 31, y: 11, w: 1, h: 2, to: 'hush_kiln', spawn: { x: 1, y: 9 } },
    { x: 0, y: 11, w: 1, h: 2, to: 'hush_gorge', spawn: { x: 34, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Ves's chalk at the turns (seen only in your light), and what's hidden in the
  // dead ends.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'chalk_rock_down', x: 29, y: 10, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_up', x: 24, y: 17, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_up', x: 22, y: 15, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_up', x: 28, y: 11, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_up', x: 20, y: 9, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_up', x: 20, y: 4, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_down', x: 2, y: 1, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_down', x: 2, y: 2, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_down', x: 3, y: 4, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_down', x: 1, y: 6, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'chalk_rock_down', x: 3, y: 8, text: 'underroot_chalk', seenInLight: true },
    { sprite: 'sign', x: 29, y: 10, text: 'underroot_sign' },
    { sprite: 'chest', x: 13, y: 11, text: 'underroot_chest', gives: 'kiln_jerkin', seenInLight: true, taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 29, y: 1, text: 'underroot_pouch', gold: 140, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { K: 'underroot_wall', k: 'underroot_wall' },

  // A Knotling sits in a dead end, passing for a root.
  npcs: [
    { enemy: 'knotling', x: 27, y: 15, patrol: [27, 27], behaviour: 'disguise' },
    // Gloamworms, hanging their lights along the two long tunnels.
    { enemy: 'gloamworm', x: 14, y: 3, patrol: [7, 22] },
    { enemy: 'gloamworm', x: 7, y: 21, patrol: [2, 12] },
  ],
};
