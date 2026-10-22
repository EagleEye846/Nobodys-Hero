// THE WEATHERVANE SHELF: above the Gale Face, a high shelf broken into
// islands over the drop, with a cave in the rock at the back. Iron
// weathervanes stand on the islands; turning any of them turns the wind for
// the whole shelf (see weathervanes.js). Whirlwinds fling you downwind until
// something solid stops you, and snowdrifts heap up and blow away as the
// wind goes round. The way across: the south vane round to blow up; the
// east whirlwind up to the east island (the west one is snowed in while it
// blows up); the east vane round to blow left, and the long ride west; the
// west vane to blow up, and up to the north-west island; its vane to blow
// right, and across to the cave, stopped by the snow the wind heaps there.
// Every island has a way back (checked by a solver: no soft-locks).
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              t  a cave mouth
//   n  snow                                       s  the great stair
//   _  open sky (the view shows through) (solid)  Q  snowy boulder (solid)
export const VIGIL_WEATHERVANES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_weathervanes',
  // The room's name, for the Room Editor.
  name: 'THE WEATHERVANE SHELF',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'shelf',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 1.0, heading: 0.82 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'gale',
  // How hard the wind blows the snow (here, the way the weathervanes point).
  wind: 1.1,
  // Which way the wind blows before anyone turns a weathervane (see weathervanes.js).
  vaneWind: 'left',

  tiles: [
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEttEEEEEEEEEEEEEE',
    '_nQnnn___nnnnnnnnnnnn_________',
    '_nnnnn___nnnnnnnnnnnn_________',
    '_nnnnn___nnnnnnnnnnnn_________',
    '_nnnnn___nnnnnnnnnnnn_________',
    '______________________________',
    '________EEEEEEEEEEEEEE________',
    '______________________________',
    '_nnnnnQn______________Qnnnnnn_',
    '_Qnnnnnn______________nnnnnnn_',
    '_nnnnnnn______________nnnnnnn_',
    '_nnnnnnn______________nnnnnnQ_',
    '_nnnnnnn______________nnnnnnn_',
    '______________________________',
    '______________________________',
    '______________________________',
    '_____nnnnnnnnnnnnnnnnnnnn_____',
    '_____nnnnnnnnnnnnnnnnnnnn_____',
    '_____nnnnnnnnnnnnnnnnnnnn_____',
    '_____nnnnnnnnnnnnnnnnnnnn_____',
    '_____nnnnnnnnnnnnnnnnnnnn_____',
    '_____QQnnnnnnnnnnnnnnnnnQ_____',
    '______________ss______________',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 14, y: 23, w: 2, h: 1, to: 'vigil_gale_face', spawn: { x: 14, y: 1 } },
    // Into the ice caves.
    { x: 14, y: 1, w: 2, h: 1, to: 'ice_cave_throat', spawn: { x: 14, y: 18 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // Up the stair: Ves decides you'll hold her hand from now on (vesHoldsYourHand.js).
    { x: 13, y: 21, w: 3, h: 2, scene: 'ves_holds_your_hand' },
  ],

  // Whirlwinds (src/overworld/weathervanes.js): step in and you're flung downwind
  // until something solid stops you. The weathervanes turn the wind.
  whirls: [
    { x: 6, y: 18 },
    { x: 22, y: 18 },
    { x: 2, y: 12 },
    { x: 6, y: 12 },
    { x: 1, y: 4 },
    { x: 5, y: 5 },
    { x: 24, y: 12 },
    { x: 27, y: 10 },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'sign', x: 17, y: 21, text: 'shelf_sign' },
    { sprite: 'savepoint', x: 9, y: 20, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 5, y: 20, travel: 'weathervanes', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    // The weathervanes: turn any one, and they all turn, and the wind with them.
    { sprite: 'weathervane_up', x: 12, y: 19, vane: true },
    { sprite: 'weathervane_up', x: 4, y: 11, vane: true },
    { sprite: 'weathervane_up', x: 4, y: 2, vane: true },
    // A scarf for Ves, up beside the top-left vane (off row 4 and column 1:
    // that whirlwind's way across to the cave, and back down, must stay clear).
    { sprite: 'chest', x: 3, y: 2, text: 'vanes_chest', gives: 'gale_ribbon_scarf', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'weathervane_up', x: 25, y: 11, vane: true },
    // Snowdrifts: only there while the wind blows one of the ways listed.
    { sprite: 'snowdrift', x: 6, y: 13, drift: ['up'] },
    { sprite: 'snowdrift', x: 3, y: 13, drift: ['down'] },
    { sprite: 'snowdrift', x: 12, y: 4, drift: ['right'] },
    { sprite: 'snowdrift', x: 25, y: 12, drift: ['up', 'right'] },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  npcs: [],
};
