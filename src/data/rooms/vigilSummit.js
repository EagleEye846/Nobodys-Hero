// THE SUMMIT: the top of Mount Vigil. A round crown of snow above the clouds,
// nothing higher anywhere, and in the middle of it the old beacon: a great
// iron lamp cage on a tower of stone, cold, frost on every pane. No song
// here, only the wind (the 'peak' ambience). You arrive into a blizzard and
// thick fog, until the Usurper, his back to you at the edge, sweeps his arm
// out and stops it (summitArrival.js); it stays still after that.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              A  snowy cliff top (solid)
//   n  snow                                       i  trodden snow path
//   s  the great stair                            Q  snowy boulder (solid)
//   _  open sky (solid)
export const VIGIL_SUMMIT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_summit',
  // The room's name, for the Room Editor.
  name: "THE SUMMIT",
  // The region it's in (see src/data/areas.js).
  area: 'vigil',
  // No song: only the wind.
  music: null,
  ambience: 'peak',
  vista: { altitude: 1.0, heading: 0.5 },
  snowy: true,
  weather: 'whiteout',
  wind: 2.2,
  // Fog over everything (0 to 1), as thick as it gets.
  fog: 0.9,
  // The blizzard and fog stop for good once this scene has played.
  weatherUntil: 'summit_arrival',

  tiles: [
    '________________________________',
    '__________nnnnnnnnnnnn__________',
    '_______nnnnnnnnnnnnnnnnnn_______',
    '_____nnnnnnnnnnnnnnnnnnnnnn_____',
    '____nnnnnnnnnnnnnnnnnnnnnnnn____',
    '___nnnnnnnnnnnnnnnnnnnnnnnQnn___',
    '___nnQnnnnnnnnnnnnnnnnnnnnnnn___',
    '__nnnnnnnnnnnnnnnnnnnnnnnnnnnn__',
    '__nnnnnnnnnnnnninnnnnnnnnnnnnn__',
    '__nnnnnnnnnnnnninnnnnnnnnnnnnn__',
    '__nnnnnnnnnnnnninnnnnnnnnnnnnn__',
    '__nnnnnnnnnnnnninnnnnnnnnnnnQn__',
    '__nQnnnnnnnnnnninnnnnnnnnnnnnn__',
    '___nnnnnnnnnnnninnnnnnnnnnnnn___',
    '___nnnnnnnnnnnninnnnnnnnnnnnn___',
    '____nnnQnnnnnnninnnnnnnnnnnn____',
    '_____nnnnnnnnnninnnnnnnnQnn_____',
    '______nnnnnnnnninnnnnnnnnn______',
    '________AAAAAAsssAAAAAAAA_______',
    '________EEEEEEsssEEEEEEEE_______',
    '________EEEEEEsssEEEEEEEE_______',
    '________EEEEEEsssEEEEEEEE_______',
    '________EEEEEEsssEEEEEEEE_______',
    '________EEEEEEsssEEEEEEEE_______',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 15, y: 17 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back down to the Last Shelf.
    { x: 14, y: 23, w: 3, h: 1, to: 'vigil_owl_shelf', spawn: { x: 13, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // Up the stair: the storm, the figure at the edge, the sweep of his arm.
    { x: 13, y: 15, w: 5, h: 3, scene: 'summit_arrival' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'beacon_cold', x: 14, y: 7, text: 'summit_beacon' },
    { sprite: 'cairn', x: 8, y: 4, text: 'summit_cairn' },
    { sprite: 'cairn', x: 23, y: 4, text: 'summit_cairn' },
    { sprite: 'cairn', x: 5, y: 10, text: 'summit_cairn' },
    { sprite: 'cairn', x: 26, y: 13, text: 'summit_cairn' },
    // Her lantern, where he threw it down (summitArrival.js), there from then on.
    { sprite: 'mothers_lantern', x: 18, y: 9, text: 'summit_lantern', after: 'summit_arrival' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter).
  looks: [],
  tileTexts: { E: 'upper_rock', A: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', i: 'upper_snow', s: 'upper_stair', _: 'summit_sky' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  npcs: [],
};
