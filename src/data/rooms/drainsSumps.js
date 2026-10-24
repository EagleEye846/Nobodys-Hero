// THE SETTLING SUMPS: a dark brick hall where Hollin's water stood to let its
// silt settle, and two deep sumps across the far end of it, between you and
// the way on. A cask will wedge in a sump for you to step on, and roll over
// one that's already wedged; but a cask rolls till something stops it, and the
// only things in here to stop one are the brick piers and the other casks. So
// each cask has to be stopped in just the right places to line it up with the
// way across. Your candle shows the way, a little. (Nine pushes at
// best.)
// Tile key (see src/overworld/tileset.js):
//   K  brick culvert wall (solid)
//   k  dark overhead (solid)
//   q  wet brick walkway
//   ~  deep black water (solid, until a cask sinks into it)
export const DRAINS_SUMPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_sumps',
  // The room's name, for the Room Editor.
  name: 'THE SETTLING SUMPS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js): drips, and Ves's chalk.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.8,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kqqqqqqqqqqqqqq~KKK~KKKKKk',
    'kqqqqqKqKqqqqqq~KKK~KKqKKk',
    'kqqKqqqqqqqqqqq~qqq~qqqqqq',
    'kqqKqqqqqqqqqqq~KKK~KKKKKk',
    'kqKKqqqqqqqqqqq~KKK~KKKKKk',
    'qqqqqqqqqqqqqqq~KKK~KKKKKk',
    'qqqqqqqqqqqqqqq~KKK~KKKKKk',
    'kqqqqqqqqqqqqKq~KKK~KKKKKk',
    'kqqqqqqqqqKqqqq~KKK~KKKKKk',
    'kqqqqKqKqKqqqqq~KKK~KKKKKk',
    'kqqqqqqqqqqqqqq~KKK~KKKKKk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'drains_ladle', spawn: { x: 20, y: 8 } },
    { x: 25, y: 4, w: 1, h: 1, to: 'drains_conduit', spawn: { x: 1, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Ves's arrow shows only in your light.
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'cask', x: 3, y: 11, text: 'cask', log: true },
    { sprite: 'cask', x: 7, y: 7, text: 'cask', log: true },
    { sprite: 'cask', x: 9, y: 8, text: 'cask', log: true },
    { sprite: 'rock_stump', x: 1, y: 12, text: 'rock_stump', rockReset: true },
    { sprite: 'chalk_rock_right', x: 1, y: 9, text: 'sumps_chalk', seenInLight: true },
    { sprite: 'sign', x: 1, y: 3, text: 'sumps_sign', light: 16 },
    { sprite: 'gold_pouch', x: 14, y: 12, text: 'sumps_purse', gold: 180, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 22, y: 3, text: 'sumps_chest', gives: 'sweet_water', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'silt_heap', x: 12, y: 12, text: 'silt_heap' },
  ],
  tileTexts: { K: 'sumps_wall', k: 'sumps_wall', '~': 'sumps_trench' },

  // A Gloamworm hanging its lights along the back of the hall.
  npcs: [
    { enemy: 'gloamworm', x: 11, y: 2, patrol: [9, 13] },
  ],
};
