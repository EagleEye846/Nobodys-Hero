// THE HIGH SHELF: a ledge above the Cloud Bank, reached only on the wind
// from the bank below. Over a rockfall of the stair's blocks by jumping, past
// a crag (one throw of the rope, a chest), and down a stair onto the Cloud
// Bank's upper shelf, where the great stair goes on.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    E  ice-veined cliff face (solid)
//   n  snow                                       s  the great stair
//   Y  snow pine (walk or hide behind) (solid)    _  open sky (the view shows through) (solid)
//   b  low stone block (jump up onto it)          B  tall stone block (jump onto it from a low block)
export const VIGIL_HIGH_SHELF = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_high_shelf',
  // The room's name, for the Room Editor.
  name: 'THE HIGH SHELF',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 1.0, heading: 0.62 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // How hard the wind blows the snow sideways.
  wind: 2.0,
  // Birds circling the spire.
  birds: 2,

  tiles: [
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEnnnnnEEEEEEEEEEEEEE',
    'EEEEEEEEEEEnnnnnEEEEEEEEEEEEEE',
    'EEEEEEEEEEEAAAAAEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    '_nYnnnnnnnnnnnnnnbBbBbnnnnnYn_',
    '_nnnnnnnnnnnnnnnbBbBbBbnnnnnn_',
    '_nnnnnnnnnnnnnnnnbBbBbnnnnssn_',
    '_nnnnn_nnnnnnnnnbBbBbBbnnnssn_',
    '_nnnn___nnnnnnnnnbBbBbnnnnssn_',
    '__________________________ss__',
    '__________________________ss__',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 26, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 26, y: 13, w: 2, h: 1, to: 'vigil_cloud_bank', spawn: { x: 28, y: 3 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'lamp_cold', x: 2, y: 8, text: 'shelf_lamp' },
    // Over the rockfall by jumping; up the crag by one throw of the rope.
    { sprite: 'grapple_ring', x: 13, y: 3, grapple: true },
    { sprite: 'chest', x: 12, y: 2, text: 'shelf_chest', gives: 'herald_honeycake', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'sign', x: 9, y: 8, text: 'shelf_sign' },
    { sprite: 'chough', x: 25, y: 10, text: 'upper_chough', walkable: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud', b: 'shelf_rockfall', B: 'shelf_rockfall' },

  // No enemies here: the mountain itself is the challenge.
  // An upper loose step on the shelf.
  npcs: [
    { enemy: 'iceStep', x: 11, y: 10, patrol: [11, 11], behaviour: 'disguise', reach: 3 },
  ],
};
