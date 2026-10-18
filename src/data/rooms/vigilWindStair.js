// THE WIND STAIR: a turn of the spire above the Broken Span where the wind
// comes up the rock in columns. Three bands of ledge with sheer ice between
// them: the wind carries you up from band to band (the middle band is blocked
// by boulders one way, so it's the long way round), and a ring on each band
// ropes back down. A notch one throw above the middle band has a chest.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    E  ice-veined cliff face (solid)
//   n  snow                                       i  trodden snow path
//   s  the great stair                            Y  snow pine (walk or hide behind) (solid)
//   Q  snowy boulder (solid)
export const VIGIL_WIND_STAIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_wind_stair',
  // The room's name, for the Room Editor.
  name: 'THE WIND STAIR',
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
  vista: { altitude: 1.0, heading: 0.66 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // How hard the wind blows the snow sideways.
  wind: 2.2,
  // Birds circling the spire.
  birds: 5,

  tiles: [
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'nnnYnnnnnQnnnnnnnnYnnnnnnnnnnnnnnYnnnnnnnnnn',
    'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
    'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnQnnnnnnnn',
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEAAAEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'nnnnnYnnnnnnnnnnnnnnnnnnnnnnnYnnnnnnnnQQnnnn',
    'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiQQiiii',
    'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnQQnnnn',
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'nnnQnnnnnYnnnnnnnnnnnnnnnnnnnnnnnnnnYnnnQnnn',
    'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
    'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
    'nnnnnnnnnnnnnQnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
    'AAAAAAAAAAAAAAAAAAAAsssAAAAAAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 21, y: 33 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 20, y: 35, w: 3, h: 1, to: 'vigil_broken_span', spawn: { x: 13, y: 2 } },
    { x: 26, y: 0, w: 3, h: 1, to: 'vigil_lamplighters_ledge', spawn: { x: 11, y: 19 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Wind geysers (src/overworld/windGeyser.js): with Ves, stepping in floats
  // you up into the room `to`, landing at `spawn`. Without her the wind holds you off.
  geysers: [
    { x: 30, y: 26, to: 'vigil_wind_stair', spawn: { x: 30, y: 16 } },
    { x: 8, y: 16, to: 'vigil_wind_stair', spawn: { x: 8, y: 7 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    // Up by the wind, band to band; a ring on each band ropes back down.
    { sprite: 'grapple_ring', x: 34, y: 17, grapple: true },
    { sprite: 'grapple_ring', x: 14, y: 8, grapple: true },
    // A notch one throw above the middle band.
    { sprite: 'grapple_ring', x: 24, y: 12, grapple: true },
    { sprite: 'chest', x: 25, y: 11, text: 'windstair_chest', gives: 'hot_cocoa', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'savepoint', x: 19, y: 15, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 22, y: 15, travel: 'wind_stair', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    { sprite: 'lamp_cold', x: 25, y: 6, text: 'windstair_lamp' },
    { sprite: 'lamp_cold', x: 17, y: 25, text: 'windstair_lamp_low' },
    { sprite: 'sign', x: 23, y: 26, text: 'windstair_sign' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud' },

  // No enemies here: the mountain itself is the challenge.
  // A chough on the top ledge, and a frostbite on the long lower path.
  npcs: [
    { enemy: 'chough', x: 25, y: 8, patrol: [17, 33] },
    { enemy: 'frostbite', x: 10, y: 27, patrol: [10, 10], behaviour: 'disguise', reach: 3 },
  ],
};
