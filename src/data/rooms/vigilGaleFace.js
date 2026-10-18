// THE GALE FACE: north of the Lamplighter's Ledge, the biggest climb on the
// mountain: three pitches of rings up a sheer face of the spire, in a wind
// that comes in gusts. A gust shoves your swing (see `climbWind` and blow in
// climbing.js): swing the way it blows and it carries you higher for free;
// swing into it and it pushes you back. The first pitch traverses right,
// with the wind; the second goes straight up; the third traverses all the
// way back left, into it. At the top a stair goes on up to the Weathervane
// Shelf. A ring on each ledge lets you rope back down.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              A  snowy cliff top (solid)
//   n  snow                                       s  the great stair
//   Y  snow pine (walk or hide behind) (solid)    Q  snowy boulder (solid)
export const VIGIL_GALE_FACE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_gale_face',
  // The room's name, for the Room Editor.
  name: 'THE GALE FACE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The outside of the spire: the left and right edges join up, and the room is drawn bent round the mountain.
  wraps: true,
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 1.0, heading: 0.74 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'gale',
  // How hard the wind blows the snow sideways.
  wind: 1.4,
  // Birds circling the spire.
  birds: 4,
  // Gusts that shove you while you hang from a ring (see climbing.js): `dir` 1
  // blows to the right; every `every` seconds, for `lasts` seconds, as hard as
  // `strength` (pumping the swing yourself is 1.8).
  climbWind: { dir: 1, every: 4, lasts: 1.6, strength: 1.1 },

  tiles: [
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEnnnnnnnsssnnnnnnnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEnYnnnnnnnnnnnnnnnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEnnnnnnnnnnnnnQnnnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEnnnnnnnnnnnnnnnnnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEAAAAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnYnnnnnnnnnnnnnnnnEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnnnnnQnnnnnnnnnnnEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnEEE',
    'EEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnYEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnQnEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnnEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnnEEEEEEEEE',
    'EEEEEEEEEEYnnnnnnnnnnnnnnnnnnnnnnnnEEEEEEEEE',
    'EEEEEEEEEEnnnnnnnnnnnnnnnnnnnnQnnnnEEEEEEEEE',
    'EEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnYEEEEEEEEE',
    'EEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnnEEEEEEEEE',
    'EEEEEEEEEEAAAAAAAAAAsssAAAAAAAAAAAAEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 21, y: 53 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 20, y: 55, w: 3, h: 1, to: 'vigil_lamplighters_ledge', spawn: { x: 17, y: 1 } },
    { x: 13, y: 0, w: 3, h: 1, to: 'vigil_weathervanes', spawn: { x: 14, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'sign', x: 14, y: 50, text: 'gale_sign' },
    { sprite: 'savepoint', x: 26, y: 50, save: true },
    // At the top of the climb: a poncho for Ves.
    { sprite: 'chest', x: 23, y: 9, text: 'gale_chest', gives: 'cragwool_poncho', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // First pitch: a long traverse to the right, with the wind behind you.
    { sprite: 'swing_ring', x: 16, y: 46 },
    { sprite: 'swing_ring', x: 20, y: 45 },
    { sprite: 'swing_ring', x: 24, y: 45 },
    { sprite: 'swing_ring', x: 28, y: 44 },
    { sprite: 'swing_ring', x: 31, y: 43 },
    { sprite: 'swing_ring', x: 31, y: 41 },
    { sprite: 'grapple_ring', x: 31, y: 39, grapple: true },
    // Second pitch: straight up, zigzagging.
    { sprite: 'swing_ring', x: 34, y: 34 },
    { sprite: 'swing_ring', x: 36, y: 32 },
    { sprite: 'swing_ring', x: 34, y: 30 },
    { sprite: 'swing_ring', x: 36, y: 29 },
    { sprite: 'grapple_ring', x: 36, y: 27, grapple: true },
    // Third pitch: the long traverse back to the left, into the wind.
    { sprite: 'swing_ring', x: 32, y: 22 },
    { sprite: 'swing_ring', x: 28, y: 21 },
    { sprite: 'swing_ring', x: 25, y: 20 },
    { sprite: 'swing_ring', x: 22, y: 20 },
    { sprite: 'swing_ring', x: 19, y: 19 },
    { sprite: 'swing_ring', x: 16, y: 18 },
    { sprite: 'swing_ring', x: 13, y: 17 },
    { sprite: 'swing_ring', x: 13, y: 15 },
    { sprite: 'swing_ring', x: 13, y: 13 },
    { sprite: 'grapple_ring', x: 13, y: 11, grapple: true },
    // Rings to rope back down by, one on each ledge.
    { sprite: 'grapple_ring', x: 23, y: 11, grapple: true },
    { sprite: 'grapple_ring', x: 38, y: 27, grapple: true },
    { sprite: 'grapple_ring', x: 33, y: 39, grapple: true },
    { sprite: 'waymark', x: 17, y: 9, text: 'gale_waymark' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // A craghorn on the first ledge, and a ringer posing as a ring on the second.
  npcs: [
    { enemy: 'craghorn', x: 32, y: 25, patrol: [26, 39] },
    { enemy: 'ringer', x: 32, y: 37, patrol: [32, 32], behaviour: 'disguise', reach: 3 },
  ],
};
