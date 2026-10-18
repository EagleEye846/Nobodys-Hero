// THE ICE CHIMNEY: up through the tunnel in the Roost's roof, unplugged now the
// Roost Mother is gone: a tall shaft of ice climbing up out of the caves,
// cold air pouring down it from the daylight at the top. Three chambers, one
// above another: a frozen waterfall to swing up by the rings in it, an ice
// block stair to a chest, and a short cliff to throw the rope up. Out at the
// top, into the wind (vigilVaneGardens.js).
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   E  frozen waterfall / ice cliff (solid)       z  ice
//   v  stalactite (walk under it)                 ^  stalagmite (solid)
//   x  ice crystals (they glow) (solid)           b  low ice block (jump up onto it)
//   B  tall ice block (jump onto it from a low block)
export const VIGIL_ICE_CHIMNEY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_ice_chimney',
  // The room's name, for the Room Editor.
  name: "THE ICE CHIMNEY",
  // The region it's in (see src/data/areas.js).
  area: 'vigil',
  music: 'caves',
  // How dark it is (0 to 1): the daylight from the top doesn't reach far.
  dark: 0.45,
  ambience: 'cave',
  cave: true,
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkttkkkkkkkkkkk',
    'kKKKKKKKKKKttKKKKKKKKKKk',
    'kqqqvqqqqqqqqqqqqqvqqqqk',
    'kqxqqqqqqqqqqqqqqqqqqxqk',
    'kqqqqqqqzzzzzzqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kqqqqqqqqqqqqqqqqqqqqqqk',
    'kqxqqqqbbqqqqqqqqqqqqxqk',
    'kqqqqqqbBBqqqqq^qqqqqqqk',
    'kqqqvqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqvqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kEEEEEEEEEEEEEEEEEEEEEEk',
    'kqqqqqqqqqqqqqqqqqqqqqqk',
    'kqxqqqqqqqqqqqqqqqqqqxqk',
    'kqqqqzzzzqqqqqq^qqqqqqqk',
    'kqqvqzzzzqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqvqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkttkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 25 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back down into the Roost.
    { x: 11, y: 27, w: 2, h: 1, to: 'ice_cave_roost', spawn: { x: 13, y: 4 } },
    // Out into the daylight, onto the Vane Gardens.
    { x: 11, y: 1, w: 2, h: 1, to: 'vigil_vane_gardens', spawn: { x: 6, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/ice_caves.txt',
  props: [
    // A save point at the bottom, for a breath after the Roost Mother.
    { sprite: 'savepoint', x: 16, y: 24, save: true },
    // The frozen waterfall: rings up it, from the bottom chamber.
    { sprite: 'swing_ring', x: 5, y: 19 },
    { sprite: 'swing_ring', x: 8, y: 18 },
    { sprite: 'swing_ring', x: 11, y: 17 },
    { sprite: 'grapple_ring', x: 14, y: 15, grapple: true },
    // Up the ice blocks: a chest.
    { sprite: 'chest', x: 9, y: 12, text: 'chimney_chest', gives: 'fanfare_fudge', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // A short cliff, one throw, up to the top chamber.
    { sprite: 'grapple_ring', x: 16, y: 6, grapple: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter).
  looks: [
    { x: 11, y: 3, text: 'chimney_daylight' },
    { x: 12, y: 3, text: 'chimney_daylight' },
  ],
  tileTexts: { K: 'ice_wall', E: 'chimney_ice', v: 'ice_stalactite', '^': 'ice_stalagmite', x: 'ice_crystals', b: 'ice_block', B: 'ice_block', z: 'ice_floor' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  npcs: [],
};
