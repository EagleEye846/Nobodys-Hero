// THE GLITTERING THROAT: through the cave mouth at the back of the
// Weathervane Shelf, the first of the ice caves. A long throat of rock lit
// only by the ice crystals growing out of it, a frozen pool to skate across,
// and stone golems that lie among the boulders pretending to be boulders.
// A false wall at the west end hides a little alcove with a chest in it
// (the only tell: a thin pale crack down the rock). On to the north-east.
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   G  false cave wall (walk through it: a secret) z  ice
//   v  stalactite (walk under it)                 ^  stalagmite (solid)
//   x  ice crystals (they glow) (solid)           D  doorway (walk through it; see `doors`)
//   b  low stone block (jump up onto it)          B  tall stone block (jump onto it from a low block)
export const ICE_CAVE_THROAT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ice_cave_throat',
  // The room's name, for the Room Editor.
  name: "THE GLITTERING THROAT",
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'caves',
  // How dark it is (0 to 1): only the ice crystals, and your own light, light it.
  dark: 0.55,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Underground: cave floor shows under anything standing here.
  cave: true,
  // Darkens the screen's edges, like the Ruins.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkttkkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKttKKk',
    'kqqqvqqqqqxqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqq^qqqqqqqqqxqqqqk',
    'kqqzzzzqqqqqqqqqqqqqqqqqqqqqqk',
    'kqzzzzzzqqqqkkkkkkkqqqqqqvqqqk',
    'kqzzzzzzzqqqKKKKKKKqqqqqqqqqqk',
    'kqqzzzzzqqqqqqqxqqqqqq^qqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkqqqqqqqqqqqqqqkkkkkkkk',
    'kKKKKKKKqqqqv^qqqqqqqqKKKKKKKk',
    'kqqqxqkkqqqqqqqqqqqqqqqqqqqxqk',
    'kqqqqqGGqqqqqqqqqqq^qqqqqqqqqk',
    'kqqqqqkqqqqqxqqqqqqqqqqvqqqqqk',
    'kkkkkkkqqqqqqqqqqqqqqqqqqqqqqk',
    'kKKKKKKqqq^qqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqxqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkDDkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 18 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 14, y: 19, w: 2, h: 1, to: 'vigil_weathervanes', spawn: { x: 14, y: 2 } },
    { x: 25, y: 1, w: 2, h: 2, to: 'ice_cave_grotto', spawn: { x: 16, y: 14 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/ice_caves.txt',
  props: [
    { sprite: 'sign', x: 17, y: 17, text: 'throat_sign' },
    // Behind the false wall (6..7, 13): a hidden alcove.
    { sprite: 'chest', x: 2, y: 13, text: 'throat_chest', gives: 'coldlight_lantern', taken: { sprite: 'chest_open', text: 'chest_empty' } },
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
    // A golem lying among the stalagmites, pretending to be a boulder.
    { enemy: 'stone_golem', x: 20, y: 13, patrol: [20, 20], behaviour: 'disguise' },
    // Ice moths, drawn to the crystals' glow.
    { enemy: 'ice_moth', x: 16, y: 9, patrol: [12, 20], behaviour: 'wander' },
    { enemy: 'ice_moth', x: 24, y: 15, patrol: [21, 27] },
  ],
};
