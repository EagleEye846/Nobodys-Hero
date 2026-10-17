// THE CLOUD WALK: above the clouds now, the valleys gone under a white sea.
// A last turn round the spire: a ramp of stair, a bridge, one more face of
// rings, and a swept stair between lamps and banners up to the gate of
// Heralds' Rest. The heralds come this far down to keep it tidy.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              s  the great stair
//   n  snow                                       Y  snow pine (walk or hide behind) (solid)
//   i  trodden snow path                          Q  snowy boulder (solid)
//   A  snowy cliff top (solid)                    g  plank bridge
//   _  open sky (the view shows through) (solid)
export const VIGIL_CLOUD_WALK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_cloud_walk',
  // The room's name, for the Room Editor.
  name: 'THE CLOUD WALK',
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
  vista: { altitude: 0.86, heading: 0.705 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // Birds circling the spire.
  birds: 8,

  tiles: [
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEsssssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEnYnnnnnnnnnnYnnnnnnnnnnnnnnnnnnnnnYnnnnnnn',
    'EEnniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiin',
    'EEnnnnnnnnnnnnnnnnnnnnnnnnnQnnnnnnnnnnnnnnnn',
    'EEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEnniiiiiigggiiiiiinnE',
    'EEEEEEEEEEEEEEEEEEEEEEEEnYnnnnnngggnnnnnnnnE',
    'EEEEEEEEEEEEEEEEEEEEEEEEAEAAAAAA___AAAsssssE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEsssssE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEsssssE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEsssssE',
    'EEnYnnnnnnnnnnnnnnnnYnnnnnnnnnnnnnnnnnnnnYnE',
    'EEnniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiinnE',
    'EEnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnE',
    'EEnnnnnnnQnnnnnnnnnnnnnnnnQnnnnnnnnQnnnnnnnE',
    'EEAAAAAAAEAAsssAAAAAAAAAAAEAAAAAAAAEAAAAAAAE',
    'EEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 13, y: 33 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 12, y: 35, w: 3, h: 1, to: 'vigil_knife_edge', spawn: { x: 32, y: 1 } },
    { x: 8, y: 0, w: 5, h: 1, to: 'rest_gate', spawn: { x: 14, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    { sprite: 'waymark', x: 16, y: 31, text: 'cloud_waymark' },
    { sprite: 'savepoint', x: 6, y: 31, save: true },
    { sprite: 'sign', x: 30, y: 30, text: 'cloud_sign' },
    { sprite: 'snowman', x: 37, y: 30, text: 'cloud_snowman' },
    // Rings up the last face.
    { sprite: 'swing_ring', x: 26, y: 20 },
    { sprite: 'swing_ring', x: 24, y: 18 },
    { sprite: 'grapple_ring', x: 24, y: 16, grapple: true },
    { sprite: 'chest', x: 40, y: 16, text: 'cloud_chest', gives: 'rest_soup', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'street_lamp', x: 6, y: 13, text: 'cloud_lamp', nightText: 'cloud_lamp_night' },
    { sprite: 'street_lamp', x: 14, y: 13, text: 'cloud_lamp', nightText: 'cloud_lamp_night' },
    { sprite: 'banner_pole', x: 5, y: 16, text: 'cloud_banner' },
    { sprite: 'banner_pole', x: 15, y: 16, text: 'cloud_banner' },
    { sprite: 'chough', x: 22, y: 14, text: 'ridge_chough', walkable: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 32, y: 24, text: 'vigil_drop' },
    { x: 33, y: 24, text: 'vigil_drop' },
    { x: 34, y: 24, text: 'vigil_drop' },
  ],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', Q: 'vigil_snow_boulder', n: 'vigil_snow', g: 'vigil_bridge', s: 'cloud_stair' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
