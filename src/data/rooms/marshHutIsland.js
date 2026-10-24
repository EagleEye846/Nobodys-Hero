// THE STILT HUT: an island of turf out in the fen, and standing in the water
// beside it on its stilts, a little hut, with smoke coming out of the thatch
// and firelight in the window. Somebody built it to live out here, a long time
// ago. Somebody's lit a fire in it now.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   1  stilt hut wall (solid)
//   2  stilt hut thatch (solid)
//   3  stilt hut window (solid)
//   4  stilt hut door (walk in)
//   9  the stilts under the hut, in the water (solid)
//   ;  fen turf
//   =  old duckboards
export const MARSH_HUT_ISLAND = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_hut_island',
  // The room's name, for the Room Editor.
  name: 'THE STILT HUT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.4,

  tiles: [
    '""""""""""""""""""""""""""',
    '"$$$$$$$$$2222222$$$$$$$$"',
    '"$$$$$$$$$2222222$$$$$$$$"',
    '"$$$$$$$$$1314131$$$$$$$$"',
    '"$$$$$$$$$999=999$$$$$$$$"',
    '"$$$$;;;;;;;;;;;;;"""$$$$"',
    '"$$$$;;;;;;;;;;;;;"""$$$$"',
    '=====;;;;;;;;;;;;;;;;$$$$"',
    '=====;;;;;;;;;;;;;;;;$$$$"',
    '"$$$$;;;;;;;;;;;;;;;;$$$$"',
    '"$$$$;;;;;;;;;;;;;;;;$$$$"',
    '"$$$$;""";;;;;;;;;;;;$$$$"',
    '"$$$$;""";;;;;;;;;;";$$$$"',
    '"$$$$$$$$$$$$$$$$$$$$$$$$"',
    '"$$$$$$$$$$$$$$$$$$$$$$$$"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'marsh_sunken_road', spawn: { x: 30, y: 7 } },
    { x: 13, y: 3, w: 1, h: 1, to: 'marsh_hut', spawn: { x: 6, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 7, y: 5, w: 1, h: 6, scene: 'the_stilt_hut' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'marsh_lantern', x: 12, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 14, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'drag_print', x: 9, y: 8, text: 'drag_print', walkable: true },
    { sprite: 'drag_print', x: 12, y: 6, text: 'drag_print_2', walkable: true },
    { sprite: 'campfire_cold', x: 16, y: 10, text: 'hut_old_fire' },
    { sprite: 'sign', x: 6, y: 6, text: 'hut_post' },
    { sprite: 'roll_log', x: 9, y: 11, text: 'hut_log' },
    { sprite: 'chest', x: 5, y: 12, text: 'hut_island_chest', gives: 'reedwoven_coat', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { '"': 'reeds', $: 'fen_water', '1': 'hut_outside', '2': 'hut_thatch', '3': 'hut_window', '9': 'hut_stilts' },

  // Nobody about.
  npcs: [],
};
