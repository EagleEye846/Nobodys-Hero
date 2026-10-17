// THE KNIFE EDGE: the Ice Face's climb carries on here. You arrive on a
// sliver of ledge and the rope hooks the next ring at once; a long zigzag
// pitch leads to a ledge with a crystal, then a second pitch with a long
// sideways catch that wants a full swing. Above, fallen blocks make steps
// up to the stair, and the stair goes on into the Cloud Walk.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              s  the great stair
//   n  snow                                       A  snowy cliff top (solid)
//   b  low stone block (jump up onto it)          Y  snow pine (walk or hide behind) (solid)
//   i  trodden snow path                          Q  snowy boulder (solid)
export const VIGIL_KNIFE_EDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_knife_edge',
  // The room's name, for the Room Editor.
  name: 'THE KNIFE EDGE',
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
  vista: { altitude: 0.76, heading: 0.273 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'snow',
  // How hard the wind blows the snow sideways.
  wind: 1.3,
  // Birds circling the spire.
  birds: 4,

  tiles: [
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnnEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnnEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAbAAAAAEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEbEEEEEEEEEEEE',
    'EEEEnYnnnnnnnnnnnnnnnnnYnnnnnnnnnnnnnnnYnEEE',
    'EEEEnniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiinnEEE',
    'EEEEnnnnnnnnQnnnnnnnnnnnnnnnnnQnnnnnnnnnnEEE',
    'EEEEAAAAAAAAEAAAAAAAAAAAAAAAAAEAAAAAAAAAAEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEnniiiiiiiiiiiiiiiiinnEEEEEEEEE',
    'EEEEEEEEEEEEEEnYnnnnnnnnnnnnnnnnnnnEEEEEEEEE',
    'EEEEEEEEEEEEEEAEAAAAAAAAAAAAAAAAAAAEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEnnnnnEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEnnnnnEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEnnnnnEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 23, y: 36 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 21, y: 37, w: 5, h: 1, to: 'vigil_ice_face', spawn: { x: 23, y: 9 } },
    { x: 31, y: 0, w: 3, h: 1, to: 'vigil_cloud_walk', spawn: { x: 13, y: 33 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    // The first ring is straight above where you arrive.
    { sprite: 'swing_ring', x: 23, y: 32 },
    { sprite: 'swing_ring', x: 25, y: 30 },
    { sprite: 'swing_ring', x: 23, y: 28 },
    { sprite: 'swing_ring', x: 25, y: 27 },
    { sprite: 'grapple_ring', x: 25, y: 25, grapple: true },
    { sprite: 'savepoint', x: 20, y: 25, save: true },
    { sprite: 'sign', x: 29, y: 25, text: 'knife_sign' },
    // Second pitch: a long catch sideways, which wants a full swing.
    { sprite: 'swing_ring', x: 24, y: 22 },
    { sprite: 'swing_ring', x: 28, y: 20 },
    { sprite: 'swing_ring', x: 26, y: 18 },
    { sprite: 'grapple_ring', x: 26, y: 16, grapple: true },
    { sprite: 'waymark', x: 10, y: 15, text: 'knife_waymark' },
    { sprite: 'chest', x: 7, y: 16, text: 'knife_chest', gives: 'herald_honeycake', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'cairn', x: 36, y: 14, text: 'knife_cairn' },
    { sprite: 'chough', x: 34, y: 10, text: 'ridge_chough', walkable: true },
    { sprite: 'tally_stone', x: 28, y: 10, text: 'knife_tally' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', Q: 'vigil_snow_boulder', n: 'vigil_snow', b: 'vigil_block' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
