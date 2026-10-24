// THE FAR SHORE: the end of the marsh. The ground rises out of the fen, dry
// turf at last, and far off in the dusk to the east, the broken towers of a
// city in a valley, with lights in some of its windows (far_shore). The path
// goes on east, down into the valley.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ,  grass
//   :  dirt path
//   ;  fen turf
//   =  old duckboards
export const MARSH_FAR_SHORE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_far_shore',
  // The room's name, for the Room Editor.
  name: 'THE FAR SHORE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.25,

  tiles: [
    '""""""""""""""""""""""""""""',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '=====;;;;;;;;;;;;;;;,,,,::::',
    '=====;;;;;;;;;;;;;;;,,,,::::',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '"%%%%;;;;;;;;;;;;;;;,,,,:::"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'marsh_watergate', spawn: { x: 28, y: 7 } },
    { x: 27, y: 6, w: 1, h: 2, to: 'valley_road', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 14, y: 1, w: 1, h: 13, scene: 'far_shore' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'marsh_lantern', x: 5, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'sign', x: 25, y: 7, text: 'shore_end' },
    { sprite: 'cairn', x: 18, y: 4, text: 'shore_cairn' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 26, y: 2, text: 'shore_view' },
    { x: 26, y: 3, text: 'shore_view' },
    { x: 26, y: 4, text: 'shore_view' },
    { x: 26, y: 5, text: 'shore_view' },
    { x: 26, y: 6, text: 'shore_view' },
    { x: 26, y: 7, text: 'shore_view' },
    { x: 26, y: 8, text: 'shore_view' },
    { x: 26, y: 9, text: 'shore_view' },
    { x: 26, y: 10, text: 'shore_view' },
    { x: 26, y: 11, text: 'shore_view' },
    { x: 26, y: 12, text: 'shore_view' },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', '=': 'duckboards', ',': 'shore_grass', ':': 'shore_path' },

  // Nobody.
  npcs: [],
};
