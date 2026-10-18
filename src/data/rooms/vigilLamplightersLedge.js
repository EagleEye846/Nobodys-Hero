// THE LAMPLIGHTER'S LEDGE: a ledge in the cloud with a little hut on it, the
// furthest anyone knows the lamplighter got. Her last lamp is by the door.
// The stair goes on north into the cloud, up to the Gale Face (vigilGaleFace.js).
// Tile key (see src/overworld/tileset.js):
//   D  doorway (walk through it; see `doors`)      s  the great stair
//   _  open sky (the view shows through) (solid)   n  snow
//   i  trodden snow path                           Y  snow pine (walk or hide behind) (solid)
//   Q  snowy boulder (solid)                       a  log cabin wall (solid)
//   e  snowy cabin roof (solid)
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
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js): a gale driving
  // the snow sideways, thin enough to see the ground through.
  weather: 'gale',
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
  doors: [
    { x: 10, y: 21, w: 3, h: 1, to: 'vigil_wind_stair', spawn: { x: 27, y: 1 } },
    { x: 6, y: 9, w: 1, h: 1, to: 'vigil_lamplighters_hut', spawn: { x: 5, y: 7 } },
    // On up the stair, into the wind: the Gale Face.
    { x: 15, y: 0, w: 5, h: 1, to: 'vigil_gale_face', spawn: { x: 21, y: 53 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // Up the stair into the gale: Ves sees the hut and runs on ahead (vesSeesTheHut.js).
    { x: 9, y: 17, w: 5, h: 2, scene: 'ves_sees_the_hut' },
  ],

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
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud', e: 'ledge_roof', a: 'ledge_hut' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  // Both keep clear of the way Ves runs to the hut in vesSeesTheHut.js (up
  // from the stair at x 12, along row 11, up to the door at x 6).
  npcs: [
    { enemy: 'craghorn', x: 18, y: 9, patrol: [15, 21], behaviour: 'wander' },
    { enemy: 'chough', x: 5, y: 15, patrol: [2, 8] },
  ],
};
