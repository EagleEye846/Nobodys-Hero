// THE FALLS FOOT: down the old steps beside the falls from the Outfall, where
// the conduit's water comes down into a pool and spreads out into the fen. The
// first bog: a strip you can hop, then a wider one with a log beside it to
// roll in. Ves's trail goes on across the mud (one boot print, then a drag),
// and on the far side stands the first lantern on its pole.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   #  the old city's stone, overhead (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ;  fen turf
//   U  stairs up
//   W  the old city's stone wall (solid)
export const MARSH_FALLS_FOOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_falls_foot',
  // The room's name, for the Room Editor.
  name: 'THE FALLS FOOT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js): the Lantern Marsh.
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.5,

  tiles: [
    '############################',
    '#WWUUWWWWWWWWWWWWWW$$$$$$$$#',
    '";;;;;;;%;;;;;%%;;;$$$$$$$$"',
    '";;;;;;;%;;;;;%%;;$$$$$$$$$"',
    '";;;;;;;%;;;;;%%;;$$$$$$$$$"',
    '";;;;;;;%;;;;;%%;;;;;;;;;;;"',
    '";;;;;;;%;;;;;%%;;;;;;;;;;;"',
    '";;;;;;;%;;;;;%%;;;;;;;;;;;"',
    '";;;;;;;%;;;;;%%;;;;;;;;;;;"',
    '";;;;;;;%;;;;;%%;;;;;;;;;;;;',
    '";;;;;;;%;;;;;%%;;;;;;;;;;;;',
    '";%;;;;;%;;;;;%%;;;;;;;;;;;"',
    '"%%%;;;;%;;;;;%%;;;;;;;;;;;"',
    '"%%%;;;;%;;;;;%%;;;;;;%%%%%"',
    '"%%%;;;;%;;;;;%%;;;;;;%%%%%"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 3, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 3, y: 1, w: 2, h: 1, to: 'drains_outfall', spawn: { x: 13, y: 13 } },
    { x: 27, y: 9, w: 1, h: 2, to: 'marsh_lantern_path', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 3, w: 2, h: 1, scene: 'into_the_marsh' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    // The falls, pouring down into the pool.
    { sprite: 'water_flow', x: 19, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 20, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 21, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 22, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 23, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 24, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 25, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'water_flow', x: 26, y: 1, text: 'falls', animation: 'water_flow', speed: 0.25 },
    { sprite: 'sign', x: 6, y: 3, text: 'falls_stone' },
    { sprite: 'drag_print', x: 5, y: 5, text: 'drag_print', walkable: true },
    { sprite: 'drag_print', x: 10, y: 7, text: 'drag_print_2', walkable: true },
    { sprite: 'drag_print', x: 17, y: 9, text: 'drag_print_3', walkable: true },
    { sprite: 'roll_log', x: 12, y: 9, text: 'bog_log', log: true },
    { sprite: 'marsh_lantern', x: 17, y: 7, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 24, y: 8, text: 'marsh_lantern', light: 60 },
    { sprite: 'gold_pouch', x: 1, y: 10, text: 'falls_purse', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', W: 'falls_cliff', '#': 'falls_cliff' },

  // A Bog Toad, dozing by the pool.
  npcs: [
    { enemy: 'bog_toad', x: 21, y: 11, patrol: [18, 25] },
  ],
};
