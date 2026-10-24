// THE WISP HOLLOW: the deepest of the mist. Lanterns at first, then a long
// stretch where every one has gone out and the boards fork and fork again, and
// most ways just end in the bog. Ves came this way, and at every turning she
// took she tied a strip of her coat round a reed: follow them (her_markers).
// Wisps drift all round, lit up like lanterns.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ;  fen turf
//   =  old duckboards
export const MARSH_WISP_HOLLOW = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_wisp_hollow',
  // The room's name, for the Room Editor.
  name: 'THE WISP HOLLOW',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.4,
  // Thick mist: you can only see a few steps, except near the lanterns (0 to 1;
  // see OverworldScene.drawMist).
  mist: 0.86,

  tiles: [
    '""""""""""""""""""""""""""""""""""',
    '"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"',
    '"%;;%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"',
    '"%;;%%%%%%%%%%%=============%%%%%"',
    '"%;;%%%%%%%%%%%=%%%%%=%%%%%%%;;;%"',
    '"%%%%======%%%%=%%%%%=%%%%%%%;;;%"',
    '"%%%%=%%%%=%%%%=%%%%%=%%%%========',
    '"%%%%=%%%%=%====%%%%%=%%%%=%%%%%%=',
    '==%%%=%%%%=%=%%=%%%%%=%%%%=%%%%%%"',
    '======%%%%=%=%%=%%%%%=%%%%=%%%%%%"',
    '"%%%%%%%%%=%%%%=%%%%%==========%%"',
    '"%%%%%%%%%=%%%%=%%%%%=%%%%%%%%=%%"',
    '"%%%%%%%%%======%%%%%=%%%%%%%%=%%"',
    '"%%%%%%$$%=%%%%%%%%%%=%%%%%%%%=%%"',
    '"%%%%%%$$%=%%$$$%%%%%====%%%%%%%%"',
    '"%%%%%%$$%=%%$$$%%%%%%%%%%%%%%%%%"',
    '"%%%%%%%%%%%%$$$%%%%%%%%%%%%%%%%%"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'marsh_jetty', spawn: { x: 28, y: 6 } },
    { x: 33, y: 6, w: 1, h: 2, to: 'marsh_heron_flats', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 9, y: 5, w: 2, h: 1, scene: 'her_markers' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'marsh_lantern', x: 1, y: 10, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 4, y: 7, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 6, y: 4, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 9, y: 4, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern_out', x: 11, y: 8, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern_out', x: 14, y: 11, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern_out', x: 16, y: 6, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern_out', x: 20, y: 2, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern_out', x: 22, y: 7, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern_out', x: 25, y: 11, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern', x: 27, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 31, y: 7, text: 'marsh_lantern', light: 60 },
    // Her strips of coat, at every turning she took.
    { sprite: 'coat_strip', x: 11, y: 13, text: 'hollow_strip' },
    { sprite: 'coat_strip', x: 14, y: 13, text: 'hollow_strip' },
    { sprite: 'coat_strip', x: 16, y: 2, text: 'hollow_strip' },
    { sprite: 'coat_strip', x: 20, y: 4, text: 'hollow_strip' },
    { sprite: 'coat_strip', x: 20, y: 11, text: 'hollow_strip' },
    { sprite: 'coat_strip', x: 27, y: 11, text: 'hollow_strip' },
    { sprite: 'gold_pouch', x: 30, y: 4, text: 'hollow_purse', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', '=': 'duckboards' },

  // Wisps, drifting about the dark stretch.
  npcs: [
    { enemy: 'wisp', x: 13, y: 9, patrol: [11, 14], behaviour: 'wander', light: 44 },
    { enemy: 'wisp', x: 18, y: 8, patrol: [16, 20], behaviour: 'wander', light: 44 },
    { enemy: 'wisp', x: 24, y: 13, patrol: [22, 27], behaviour: 'wander', light: 44 },
  ],
};
