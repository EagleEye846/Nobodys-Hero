// THE LAMPLIGHTER'S LEDGE: a ledge in the cloud with a little hut on it, the
// furthest anyone knows the lamplighter got. Her last lamp is by the door.
// The stair goes on north into the cloud, towards the summit (not built yet).
// Tile key (see src/overworld/tileset.js):
//   n  snow                                       i  trodden snow path
//   s  the great stair                            Y  snow pine (walk or hide behind) (solid)
//   Q  snowy boulder (solid)                      _  open sky (the view shows through) (solid)
//   e  snowy cabin roof (solid)                   a  log cabin wall (solid)
//   D  doorway (walk through it; see `doors`)
export const VIGIL_LAMPLIGHTERS_LEDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_lamplighters_ledge',
  // The room's name, for the Room Editor.
  name: 'THE LAMPLIGHTER\'S LEDGE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 1.0, heading: 0.7 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'snow',
  // How hard the wind blows the snow sideways.
  wind: 1.2,

  tiles: [
    '_______________sssss____',
    '_______________sssss____',
    '_______________sssss____',
    '___nnnnnnnnnnnniiiiinnn_',
    '__nYnnnnnnnnnnniiiiinnn_',
    '__nnnnnnnnnnnnniiiiinYn_',
    '_nneeeeeeennnnnnnnnnnnn_',
    '_nneeeeeeennnnnnnnnnnnn_',
    '_nnaaaaaaannnnnnnnnnnnn_',
    '_nnaaaDaaannnQnnnnnnnnn_',
    '_nnnnnnnnnnnnnnnnnnnnnn_',
    '_nnnnnnnnnnnnnnnnnnnnnn_',
    '_nnnnnnnnnnnnnnnnnnYnnn_',
    '_nnnnnnnnnnnnnnnnnnnnnn_',
    '_nnnnnnnnnnnnnnnnnnnnnn_',
    '_nnnnnnnnnnnnnnnnnnnn___',
    '_nnnQnnnnnnnnnnnnnnnn___',
    '_nnnnnnnnnnnnnnnnnnnn___',
    '_nnnnnnnnnnnnnnnnnnn____',
    '__________sss___________',
    '__________sss___________',
    '__________sss___________',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 19 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 10, y: 21, w: 3, h: 1, to: 'vigil_wind_stair', spawn: { x: 27, y: 1 } },
    { x: 6, y: 9, w: 1, h: 1, to: 'vigil_lamplighters_hut', spawn: { x: 5, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'lamp_cold', x: 8, y: 10, text: 'ledge_lamp' },
    { sprite: 'crates', x: 2, y: 9, text: 'ledge_woodpile' },
    { sprite: 'sign', x: 14, y: 5, text: 'ledge_sign' },
    { sprite: 'snowman', x: 17, y: 16, text: 'ledge_snowman' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 15, y: 0, text: 'ledge_onward' },
    { x: 16, y: 0, text: 'ledge_onward' },
    { x: 17, y: 0, text: 'ledge_onward' },
    { x: 18, y: 0, text: 'ledge_onward' },
    { x: 19, y: 0, text: 'ledge_onward' },
  ],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud', e: 'ledge_roof', a: 'ledge_hut' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between; `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js).
  npcs: [
    { enemy: 'craghorn', x: 10, y: 14, patrol: [3, 18], behaviour: 'wander' },
  ],
};
