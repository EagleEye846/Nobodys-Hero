// THE GATE: the stair arrives at last at Heralds' Rest, under an arch of old
// timber with the village's name on it and bunting that never came down.
// Lamps, banners, a notice board a hundred years deep, and a snowman on
// lookout. The square is through the gate.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    s  the great stair
//   E  ice-veined cliff face (solid)              Y  snow pine (walk or hide behind) (solid)
//   n  snow                                       i  trodden snow path
//   Q  snowy boulder (solid)                      _  open sky (the view shows through) (solid)
//   l  swept cobble lane
export const REST_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_gate',
  // The room's name, for the Room Editor.
  name: 'THE GATE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'village',
  // The view off the mountain, and the weather.
  vista: { altitude: 0.9, heading: 0.9 },
  weather: 'flurry',
  snowy: true,
  birds: 5,

  tiles: [
    'AAAAAAAAAAAAsssssAAAAAAAAAAA',
    'EEEEEEEEEEEEsssssEEEEEEEEEEE',
    'AYnnnnnnnnnnsssssnnnnnnnnnYA',
    'AnnnnnnnnnnnilllinnnnnnnnnnA',
    'AnnnnnnnnnnnilllinnnnnnQnnnA',
    'AnnYnnnniiiiillliiiiiinnnnnA',
    'AnnnnnnnnnnnilllinnnnYnnnnnA',
    'AnnnnnQnnnnnilllinnnnnnnnnnA',
    'AnnnnnnnnnnnilllinnnnnnnnnnA',
    'AnnnnnnnnnnnilllinnnnnnnnnYA',
    'AnYnnnnnnnnnilllinnnnnnnnnnA',
    'AnnnnnnnnnnnilllinnnnnnnnnnA',
    'AnnnnnnnnnnnilllinnnnQnnnnnA',
    'AnnnnnQnnnnnilllinnnnnnnnnnA',
    'AnnnnnnnnnnnilllinnnnnnnnnnA',
    'AnnnYnnnnnnnillliiiiinnnYnnA',
    'AnnnnnnnnnnnsssssnnnnnnnnnnA',
    'AnnnnnnnnnnnsssssnnnnnnnnnnA',
    'AAAnnnnnnnnnsssssnnnnnnnnAAA',
    '___AAAAAAAAAsssssAAAAAAAA___',
    '____EEEEEEEEsssssEEEEEEE____',
    '____________sssss___________',
    '____________sssss___________',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 12, y: 22, w: 5, h: 1, to: 'vigil_cloud_walk', spawn: { x: 10, y: 1 } },
    { x: 12, y: 0, w: 5, h: 1, to: 'rest_square', spawn: { x: 22, y: 28 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    // The gate itself, across the path: you walk under it, but not through its posts.
    { sprite: 'rest_arch', x: 13, y: 9, text: 'gate_arch', walkable: true, solidSides: 7 },
    { sprite: 'street_lamp', x: 11, y: 12, text: 'gate_lamp', nightText: 'gate_lamp_night' },
    { sprite: 'street_lamp', x: 17, y: 12, text: 'gate_lamp', nightText: 'gate_lamp_night' },
    { sprite: 'banner_pole', x: 10, y: 6, text: 'gate_banner' },
    { sprite: 'banner_pole', x: 18, y: 6, text: 'gate_banner' },
    { sprite: 'sign', x: 10, y: 15, text: 'gate_sign' },
    { sprite: 'notice_board', x: 19, y: 14, text: 'gate_board', notice: true },
    { sprite: 'snowman', x: 4, y: 11, text: 'gate_snowman' },
    { sprite: 'savepoint', x: 8, y: 4, save: true },
    { sprite: 'bench', x: 20, y: 4, text: 'gate_bench' },
    { sprite: 'chough', x: 24, y: 16, text: 'ridge_chough', walkable: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', Q: 'vigil_snow_boulder', n: 'rest_snow', s: 'gate_stair', l: 'rest_lane' },

  // No enemies here: the mountain itself is the challenge (see notes/docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
