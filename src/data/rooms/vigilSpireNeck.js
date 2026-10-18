// THE SPIRE'S NECK: where the spire narrows below the summit, the last big
// climb. A pitch of rings up the face in a wind that gusts to the right
// (`climbWind`), onto a ledge cut in two by a crack in the mountain. Blocks of
// stone to jump up for a chest; a puff of wind (an updraft) to hop the
// crack; and on the far side a wind geyser that carries you and Ves up the
// last tall face to the top ledge, where the great stair goes on up. Rings on
// each ledge rope back down.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              A  snowy cliff top (solid)
//   n  snow                                       s  the great stair
//   Y  snow pine (solid)                          Q  snowy boulder (solid)
//   _  open sky: the crack (solid)                b  low stone block (jump onto it)
//   B  tall stone block (jump onto it from a low block)
export const VIGIL_SPIRE_NECK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_spire_neck',
  // The room's name, for the Room Editor.
  name: "THE SPIRE'S NECK",
  // The region it's in (see src/data/areas.js).
  area: 'vigil',
  music: 'vigilEpic',
  ambience: 'summit',
  // The outside of the spire: the left and right edges join up.
  wraps: true,
  vista: { altitude: 1.0, heading: 0.95 },
  snowy: true,
  weather: 'gale',
  wind: 1.6,
  birds: 3,
  // Gusts that shove you while you hang from a ring (see climbing.js).
  climbWind: { dir: 1, every: 4, lasts: 1.5, strength: 1.0 },

  tiles: [
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnEEEEE',
    'EEEEEEEEEEEEEEEEEEnYnnnnnnnnnnnnQnnnnnnEEEEE',
    'EEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnYnEEEEE',
    'EEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnEEEEE',
    'EEEEEEEEEEEEEEEEEEnnnnnnnnnnnnnnnnnnnnnEEEEE',
    'EEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnn__nnnnnnnEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnn__nnnnnYnEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnBBnnnnnnn__nnnnnnnEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnbnnnnnnnn__nnnnnnnEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnn__nnnnnnnEE',
    'EEEEEEEEEEEEEEEEEEEEEEnnnnnnnnnnn__nnnnnnnEE',
    'EEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAA__AAAAAAAEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE__EEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'EEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnnnnnnEEEEEEE',
    'EEEEEEEEnYnnnnnnnnnnnnnnnnnnnnYnnnnnnEEEEEEE',
    'EEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnnnnnnEEEEEEE',
    'EEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnnnnQnEEEEEEE',
    'EEEEEEEEnnnnnnnnnnnnnnnnnnnnnnnnnnnnnEEEEEEE',
    'EEEEEEEEAAAAAAAAAAAAsssAAAAAAAAAAAAAAEEEEEEE',
    'EEEEEEEEEEEEEEEEEEEEsssEEEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 21, y: 36 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back down to the Vane Gardens.
    { x: 20, y: 39, w: 3, h: 1, to: 'vigil_vane_gardens', spawn: { x: 15, y: 2 } },
    // On up to the Last Shelf.
    { x: 26, y: 0, w: 3, h: 1, to: 'vigil_owl_shelf', spawn: { x: 13, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Updrafts: step on one and it tosses you to tile `to` (over the crack).
  gusts: [
    { x: 32, y: 22, to: { x: 35, y: 22 } },
    { x: 35, y: 21, to: { x: 32, y: 21 } },
  ],

  // Wind geysers (src/overworld/windGeyser.js): with Ves, stepping in floats
  // you up into the room `to`, landing at `spawn`.
  geysers: [
    { x: 39, y: 22, to: 'vigil_spire_neck', spawn: { x: 34, y: 11 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'sign', x: 12, y: 35, text: 'neck_sign' },
    // The pitch: up and to the right, with the wind.
    { sprite: 'swing_ring', x: 14, y: 31 },
    { sprite: 'swing_ring', x: 18, y: 30 },
    { sprite: 'swing_ring', x: 22, y: 29 },
    { sprite: 'swing_ring', x: 26, y: 28 },
    { sprite: 'swing_ring', x: 29, y: 27 },
    { sprite: 'grapple_ring', x: 31, y: 24, grapple: true },
    // Up the blocks: a chest.
    { sprite: 'chest', x: 25, y: 21, text: 'neck_chest', gives: 'goblin_hotpot', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // Back down from the top ledge by rope.
    { sprite: 'grapple_ring', x: 24, y: 12, grapple: true },
    { sprite: 'waymark', x: 22, y: 9, text: 'neck_waymark' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter).
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', A: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'neck_crack', b: 'upper_block', B: 'upper_block' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  npcs: [],
};
