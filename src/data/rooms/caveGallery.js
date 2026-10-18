// THE SINGING GALLERY: the great chamber inside the spire, where the wind
// through the cracks makes the rock hum (that's the "bell" every climber
// hears, or one of them). A frozen lake in the middle, a forest of
// stalagmites, and a walled alcove reached by jumping up fallen blocks, with
// the Ice Pick in it. The heralds' Book of Arrivals waits on a stand by the
// way in. The way out is a cave mouth high on the far side, onto the Shoulder.
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   v  stalactite (walk under it)                 ^  stalagmite (solid)
//   x  ice crystals (they glow) (solid)           B  tall stone block (jump onto it from a low block)
//   b  low stone block (jump up onto it)          z  ice
//   D  doorway (walk through it; see `doors`)
export const CAVE_GALLERY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'cave_gallery',
  // The room's name, for the Room Editor.
  name: 'THE SINGING GALLERY',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'caves',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Underground: cave floor shows under anything standing here.
  cave: true,
  // How dark it is (0 to 1).
  dark: 0.5,
  // Darkens the screen's edges, like the Ruins.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkttkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKttKKk',
    'kqqqvqqqqqqqqvqqqqqqqqvqqqqqqvqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqq^qqqqqq^qqqqqqqqqqqqqq^qqqqqqxqqk',
    'kqqqqqqqqqqqqqqkkkkkkkkqqqqqqqqqqqqk',
    'kqqqqqxqqqqqqqkKKKKKKKKkqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqkKqqqqqqKkqqq^qqqqqqqk',
    'kqqvqqqqqqqqqqkKqqxqqqKkqqqqqqqvqqqk',
    'kqqqqqqqqq^qqqkKqqqqqqKkqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqkKKBBBBKKkqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqkkkkbbkkkkqqqqqxqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqq^qqqqqqqqqqqqqqqqqqqqqqqqqq^qqqqk',
    'kqqqqqqqvqqqqqqzzzzzzzqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqzzzzzzzzzqqqqqqqqqqqqk',
    'kqqqxqqqqqqqqqzzzzzzzzzqqqqqqqqqqvqk',
    'kqqqqqqqqqqqqqqzzzzzzzqqqqqqqxqqqqqk',
    'kqq^qqqqqq^qqqqqqqqqqqqqqqq^qqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqvqqqqqqqqqqqqqqqqqqvqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqDDqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 4, y: 23 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 4, y: 24, w: 2, h: 1, to: 'cave_entry', spawn: { x: 25, y: 3 } },
    { x: 31, y: 1, w: 2, h: 2, to: 'vigil_shoulder', spawn: { x: 7, y: 30 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    // An alcove in the middle, reached over fallen blocks: the Ice Pick.
    { sprite: 'chest', x: 18, y: 8, text: 'gallery_chest', gives: 'ice_pick', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'sign', x: 7, y: 23, text: 'gallery_sign' },
    { sprite: 'savepoint', x: 31, y: 4, save: true },
    { sprite: 'book_stand', x: 2, y: 4, text: 'gallery_book', notice: true },
    { sprite: 'campfire_cold', x: 30, y: 22, text: 'gallery_fire' },
    { sprite: 'old_pack', x: 32, y: 22, text: 'gallery_pack', gives: 'fanfare_fudge' },
    { sprite: 'cairn', x: 12, y: 20, text: 'gallery_cairn' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { K: 'cave_wall', v: 'cave_stalactite', '^': 'cave_stalagmite', x: 'cave_crystals', z: 'gallery_lake', b: 'vigil_block', B: 'vigil_block' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  // The Singing Gallery: the rimewing circling the crystals (the only one), a glintling lying in wait, and an ice moth.
  npcs: [
    { enemy: 'rimewing', x: 18, y: 13, patrol: [8, 28] },
    { enemy: 'glintling', x: 28, y: 20, patrol: [28, 28], behaviour: 'pounce', reach: 3 },
    { enemy: 'ice_moth', x: 20, y: 24, patrol: [12, 30] },
  ],
};
