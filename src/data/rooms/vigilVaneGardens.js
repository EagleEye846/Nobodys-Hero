// THE VANE GARDENS: out of the Ice Chimney onto terraces of snow high on the
// spire, where the old heralds planted weathervanes like a garden. Turn any
// vane and the wind turns for the whole place (weathervanes.js). A whirlwind
// on the lower terrace flings you across the sky to an island, but snow
// heaps up round the island's wind geyser while it blows that way; turn the
// wind, and the geyser carries you and Ves up the tall face to the top
// terrace, and on up the great stair. A ring on the top terrace ropes back down.
// The way across: the lower vane round to blow right; the whirlwind over
// to the island; the island's vane round once (to blow down); the geyser up;
// the stair.
// Tile key (see src/overworld/tileset.js):
//   s  the great stair                 _  open sky (the view shows through) (solid)
//   n  snow                            A  snowy cliff top (solid)
//   E  ice-veined cliff face (solid)   Y  snow pine (walk or hide behind) (solid)
//   Q  snowy boulder (solid)           t  cave mouth (walk through it; see `doors`)
export const VIGIL_VANE_GARDENS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_vane_gardens',
  // The room's name, for the Room Editor.
  name: 'THE VANE GARDENS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigilEpic',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 1, heading: 0.88 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'gale',
  // How hard the wind blows the snow sideways.
  wind: 1.2,
  // Which way the wind blows before anyone turns a weathervane (see weathervanes.js).
  vaneWind: 'left',

  tiles: [
    'EEEEEEEEEEEEEEsssEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEsssEEEEEEEEEEEEE',
    '___nnnnnnnnnnnnnnnnnnnnnnnn___',
    '___nYnnnnnnnnnnnnnnnnnnnnYn___',
    '___nnnnnnnnnnnnnnnnnnnnnnnn___',
    '___nnnnnnnnnnnnnnnnnnnnnnnn___',
    '___nnnnnnnnnnnnnnnnnnnnnnnn___',
    '___AAAAAAAAAAAAAAAAAAAAAAAA___',
    '___EEEEEEEEEEEEEEEEEEEEEEEE___',
    '___EEEEEEEEEEEEEEEEEEEEEEEE___',
    '___EEEEEEEEEEEEEEEEEEEEEEEE___',
    '___EEEEEEEEEEEEEEEEEEEEEEEE___',
    '___EEEEEEEEEEEEEEEEEEEEEEEE___',
    '_nnnnnnnnnnnn_______nnnnnnnn__',
    '_nnnnnnnnnnnn_______nnnnnnnn__',
    '_nnnnnnnnnnnn_______nnnnnnnQ__',
    '_Qnnnnnnnnnnn_______nnnnnnnn__',
    '_nnnnnnnnnnnn_______nnnnnnnn__',
    '_nnnnnnnnnnnn_______nnnnnnnn__',
    '_nnnnnnnnnnnn_______nnnnnnnn__',
    '_nnnnnnnnnYnn_________________',
    '_nQnnnnnnnnnn_________________',
    '_nnnnnnnnnnnn_________________',
    '_AAAAAttAAAAA_________________',
    '_EEEEEttEEEEE_________________',
    '_EEEEEttEEEEE_________________',
    '_EEEEEttEEEEE_________________',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 26, w: 2, h: 1, to: 'vigil_ice_chimney', spawn: { x: 11, y: 3 } },
    { x: 14, y: 0, w: 3, h: 1, to: 'vigil_spire_neck', spawn: { x: 21, y: 36 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Wind geysers (src/overworld/windGeyser.js): with Ves, stepping in floats
  // you up into the room `to`, landing at `spawn`. Without her the wind holds you off.
  geysers: [
    { x: 24, y: 18, to: 'vigil_vane_gardens', spawn: { x: 22, y: 4 } },
  ],

  // Whirlwinds (src/overworld/weathervanes.js): step in and you're flung downwind
  // until something solid stops you. The weathervanes turn the wind.
  whirls: [
    { x: 12, y: 15 },
    { x: 20, y: 16 },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'sign', x: 9, y: 22, text: 'gardens_sign' },
    { sprite: 'weathervane_up', x: 4, y: 14, vane: true },
    { sprite: 'weathervane_up', x: 24, y: 14, vane: true },
    { sprite: 'weathervane_up', x: 20, y: 4, vane: true },
    { sprite: 'snowdrift', x: 23, y: 18, drift: ['right'] },
    { sprite: 'snowdrift', x: 25, y: 18, drift: ['right'] },
    { sprite: 'snowdrift', x: 24, y: 17, drift: ['right'] },
    { sprite: 'snowdrift', x: 24, y: 19, drift: ['right'] },
    { sprite: 'grapple_ring', x: 6, y: 6, grapple: true },
    { sprite: 'chest', x: 8, y: 5, text: 'gardens_chest', gives: 'hot_cocoa', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'savepoint', x: 10, y: 4, save: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', A: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud', t: 'gardens_cave' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [],
};
