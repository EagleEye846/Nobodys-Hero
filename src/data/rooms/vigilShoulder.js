// THE SHOULDER: out of the caves and into the snow, on the spire's broad
// shoulder. The heralds keep a camp here for climbers, with a fire that's
// always lit; the Keeper is waiting by it (keeperOnTheShoulder.js), friendly
// as ever, with advice for the ice above. A short rope climb up an ice face
// leads to a higher ledge, a plank bridge, a chest, and the stair north into
// the Ice Face.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              s  the great stair
//   i  trodden snow path                          n  snow
//   Y  snow pine (walk or hide behind) (solid)    g  plank bridge
//   Q  snowy boulder (solid)                      A  snowy cliff top (solid)
//   _  open sky (the view shows through) (solid)  t  cave mouth (walk through it; see `doors`)
export const VIGIL_SHOULDER = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_shoulder',
  // The room's name, for the Room Editor.
  name: 'THE SHOULDER',
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
  vista: { altitude: 0.55, heading: 0.5 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // Birds circling the spire.
  birds: 6,

  tiles: [
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEiiiEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEnnnYnnnnnnnnnnnnnnnnnnnnnYnngggnnnnnnnnYnE',
    'EEnniiiiiiiiiiiiiiiiiiiiiiiiiigggiiiiiiiinnE',
    'EEnnnnnnnnnnnnQnnnnnnnnnnnnnnngggnnnnnnnnnnE',
    'EEAAAAAAAAAAAAEAAAAAAAAAAAAAAA___AAAAAAAAAAE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEnYnnnnnnnnYnnnnnnnnYnnnnnnnnnnnnnnnnnnYnEE',
    'EEnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnEE',
    'EEnniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiinnnEE',
    'EEnnnnninnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnEE',
    'EEnnnnninnnnnnnnQnnnnnnnnnnnnnnnnQnnnnnnnnEE',
    'EEAAAAtttAAAAAAAEAAAAAAAAAAAAAAAAEAAAAAAAAEE',
    'EEEEEEtttEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEtttEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 30 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 6, y: 33, w: 3, h: 1, to: 'cave_gallery', spawn: { x: 31, y: 3 } },
    { x: 10, y: 0, w: 3, h: 1, to: 'vigil_ice_face', spawn: { x: 21, y: 34 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 14, y: 26, w: 2, h: 5, scene: 'keeper_on_the_shoulder' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    // The camp the heralds keep for climbers: a tent, a fire that still burns, soup.
    { sprite: 'tent', x: 24, y: 27, text: 'shoulder_tent' },
    { sprite: 'campfire', x: 27, y: 29, text: 'shoulder_fire', animation: 'campfire', speed: 0.14 },
    { sprite: 'hot_mug', x: 29, y: 29, text: 'shoulder_mug', gives: 'hot_cocoa', taken: { sprite: 'barrel', text: 'shoulder_mug_empty' } },
    { sprite: 'savepoint', x: 20, y: 29, save: true },
    { sprite: 'cairn', x: 36, y: 27, text: 'shoulder_cairn' },
    { sprite: 'waymark', x: 10, y: 27, text: 'shoulder_waymark' },
    { sprite: 'snowman', x: 38, y: 29, text: 'shoulder_snowman' },
    // The Keeper waits by the cairn until you have met him here (see keeperOnTheShoulder.js).
    // Up the ice face: three rings.
    { sprite: 'swing_ring', x: 18, y: 25 },
    { sprite: 'swing_ring', x: 20, y: 23 },
    { sprite: 'grapple_ring', x: 20, y: 21, grapple: true },
    { sprite: 'chest', x: 37, y: 20, text: 'shoulder_chest', gives: 'fur_lined_hood', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'sign', x: 13, y: 19, text: 'shoulder_sign' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 30, y: 22, text: 'vigil_drop' },
    { x: 31, y: 22, text: 'vigil_drop' },
    { x: 32, y: 22, text: 'vigil_drop' },
  ],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', Q: 'vigil_snow_boulder', g: 'vigil_bridge', t: 'shoulder_mouth', n: 'vigil_snow' },

  // No enemies here: the mountain itself is the challenge (see notes/docs/mountain-enemies.md
  // for the ones designed for it).
  // A frostbite disguised as a snow heap, well up from the Keeper's walk (rows 27 to 29).
  npcs: [
    { enemy: 'frostbite', x: 28, y: 20, patrol: [28, 28], behaviour: 'disguise', reach: 3 },
  ],
};
