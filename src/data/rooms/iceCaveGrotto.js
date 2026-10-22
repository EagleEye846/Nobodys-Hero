// THE GOBLIN'S GROTTO: the second ice cave, a great round cavern with a
// frozen pool in it, and a goblin who has set up shop here behind a stall of
// crates, trading with the very few climbers who ever come this far (see
// SHOPS.cave_goblin). A save crystal. In the darkest corner, a chest you
// only see once your own light falls on it (`seenInLight`). On to the east.
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   G  false cave wall (walk through it: a secret) z  ice
//   v  stalactite (walk under it)                 ^  stalagmite (solid)
//   x  ice crystals (they glow) (solid)           D  doorway (walk through it; see `doors`)
//   b  low stone block (jump up onto it)          B  tall stone block (jump onto it from a low block)
export const ICE_CAVE_GROTTO = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ice_cave_grotto',
  // The room's name, for the Room Editor.
  name: "THE GOBLIN'S GROTTO",
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'caves',
  // How dark it is (0 to 1): only the ice crystals, and your own light, light it.
  dark: 0.5,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Underground: cave floor shows under anything standing here.
  cave: true,
  // Darkens the screen's edges, like the Ruins.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKk',
    'kqqqxqqqqqqqqqqvqqqqqqqqqqqqqxqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqq^qqqqqqqqqqqqqqqqqqq^qqqqqqqqqt',
    'kqqqqqqqqqzzzzzzzqqqqqqqqqqqqqqqqt',
    'kqqqqqqqqzzzzzzzzzqqqqqqqqqqqqqqqk',
    'kqqvqqqqqqzzzzzzzqqqqqqqqvqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqq^qqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqxqqqqqqqqqqqqqqqqqqqxqqqqqk',
    'kqqq^qqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkkkDDkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 14 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 15, w: 2, h: 1, to: 'ice_cave_throat', spawn: { x: 25, y: 3 } },
    { x: 33, y: 5, w: 1, h: 2, to: 'ice_cave_hall', spawn: { x: 2, y: 15 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/ice_caves.txt',
  props: [
    { sprite: 'savepoint', x: 12, y: 13, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 9, y: 13, travel: 'grotto', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true, light: 30 },
    // The goblin's stall: crates for a counter, a lamp, and the goblin behind it.
    { sprite: 'crates', x: 21, y: 12, text: 'grotto_stall' },
    { sprite: 'crates', x: 23, y: 12, text: 'grotto_stall' },
    { sprite: 'barrel', x: 25, y: 11, text: 'grotto_barrel' },
    { sprite: 'goblin_shop', x: 22, y: 11, shop: 'cave_goblin' },
    { sprite: 'lamp', x: 20, y: 11, text: 'grotto_lamp' },
    // In the darkest corner: only there once your own light reaches it.
    { sprite: 'chest', x: 2, y: 14, text: 'grotto_chest', gives: 'aurora_scarf', seenInLight: true, taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
  ],
  tileTexts: { K: 'ice_wall', G: 'ice_wall', v: 'ice_stalactite', '^': 'ice_stalagmite', x: 'ice_crystals', z: 'ice_floor', b: 'ice_block', B: 'ice_block' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js).
  npcs: [
    // Kept well away from Rimble's stall and the save crystal.
    { enemy: 'glintling', x: 28, y: 4, patrol: [25, 31], behaviour: 'pounce', reach: 3 },
    { enemy: 'ice_moth', x: 6, y: 6, patrol: [2, 8], behaviour: 'wander' },
  ],
};
