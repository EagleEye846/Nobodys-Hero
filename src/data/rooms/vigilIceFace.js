// THE ICE FACE: the hardest climbing on the mountain begins. Two pitches of
// rings up the ice to a high ledge, then a third that goes straight up over
// the top of the room: the climb carries on into the Knife Edge without a
// pause (the door at the top is a climbing door, so you arrive already
// swinging from the next ring, with the swing you had).
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              n  snow
//   A  snowy cliff top (solid)                    i  trodden snow path
//   Y  snow pine (walk or hide behind) (solid)    Q  snowy boulder (solid)
//   s  the great stair
export const VIGIL_ICE_FACE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_ice_face',
  // The room's name, for the Room Editor.
  name: 'THE ICE FACE',
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
  vista: { altitude: 0.66, heading: 0.273 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // How hard the wind blows the snow sideways.
  wind: 1.6,
  // Birds circling the spire.
  birds: 3,

  tiles: [
    'EEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEAAAEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEnniiiiiiiiiiiiiiiiiiiiiiinnEEEEEEE',
    'EEEEEEEEEEnYnnnnnnnnnnnnnnnnnnnnnnnYnEEEEEEE',
    'EEEEEEEEEEAEAAAAAAAAAAAAAAAAAAAAAAAEAEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEnnnnnnnnnnnQnEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEnnnnnnnnnnnnnEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEAAAAAAAAAAAAAEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEnYnnnnnnnnnnnnnnnnnYnEEEEEEEEEEE',
    'EEEEEEEEEEEEnniiiiiiiiiiiiiiiiinnEEEEEEEEEEE',
    'EEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnEEEEEEEEEEE',
    'EEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnEEEEEEEEEEE',
    'EEEEEEEEEEEEAAAAAAAAsssAAAAAAAAAAEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 21, y: 34 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 20, y: 35, w: 3, h: 1, to: 'vigil_shoulder', spawn: { x: 11, y: 1 } },
    { x: 22, y: 0, w: 3, h: 1, to: 'vigil_knife_edge', spawn: { x: 23, y: 35 }, climb: true },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    { sprite: 'sign', x: 16, y: 33, text: 'iceface_sign' },
    { sprite: 'savepoint', x: 28, y: 33, save: true },
    // First pitch.
    { sprite: 'swing_ring', x: 20, y: 27 },
    { sprite: 'swing_ring', x: 22, y: 25 },
    { sprite: 'grapple_ring', x: 22, y: 23, grapple: true },
    // Second pitch: a long sideways catch.
    { sprite: 'swing_ring', x: 18, y: 19 },
    { sprite: 'swing_ring', x: 22, y: 17 },
    { sprite: 'swing_ring', x: 20, y: 15 },
    { sprite: 'grapple_ring', x: 20, y: 13, grapple: true },
    { sprite: 'chest', x: 33, y: 12, text: 'iceface_chest', gives: 'ringers_mittens', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // The third pitch starts here and finishes in the Knife Edge.
    { sprite: 'swing_ring', x: 23, y: 6 },
    { sprite: 'swing_ring', x: 23, y: 3 },
    { sprite: 'grapple_ring', x: 23, y: 0, grapple: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', Q: 'vigil_snow_boulder', n: 'vigil_snow' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
