// THE HALL OF GLASS: the third ice cave, darker than the others, long and
// low, with a frozen pool, the upper hall reached up a ramp of fallen blocks,
// and golems and glintlings among the crystals. A false wall at the east end
// of the lower hall hides a chest. At the far end of the upper hall a black
// tunnel goes on into the mountain, into the Roost (iceCaveRoost.js), where
// something rustles.
// Tile key (see src/overworld/tileset.js):
//   k  cave rock overhead (solid)                 t  cave mouth (walk through it; see `doors`)
//   K  cave wall (solid)                          q  cave floor
//   G  false cave wall (walk through it: a secret) z  ice
//   v  stalactite (walk under it)                 ^  stalagmite (solid)
//   x  ice crystals (they glow) (solid)           D  doorway (walk through it; see `doors`)
//   b  low stone block (jump up onto it)          B  tall stone block (jump onto it from a low block)
export const ICE_CAVE_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ice_cave_hall',
  // The room's name, for the Room Editor.
  name: "THE HALL OF GLASS",
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'caves',
  // How dark it is (0 to 1): only the ice crystals, and your own light, light it.
  dark: 0.62,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Underground: cave floor shows under anything standing here.
  cave: true,
  // Darkens the screen's edges, like the Ruins.
  indoors: true,

  tiles: [
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkttkk',
    'kKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKttKk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqxqqqqqqqv^qqqqqqqqxqqqqqqq^qqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kkkkkkkkkkkkkkkkqqqqkkkkkkkkkkkkkkkk',
    'kKKKKKKKKKKKKKKKbBBbKKKKKKKKKKKKKKKk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqq^qqqqxqqqqqqqqqqqqqqqqqkGkkkkkk',
    'kqqqqqqqqqqqqqqqqqqqqqqqqqqqkGqqqqqk',
    'kqqqqqqqqqqqqqqqqqqqqqvqqqqqkqqqxqqk',
    'kqqqzzzzzzqqqqqqqqqqqqqqqqqqkqqqqqqk',
    'kqqzzzzzzzzqqqqqqqxqqqqqqqqqkkkkkkkk',
    'kqqqzzzzzzqqqqqqqqqqqqqqqqqqqqqqqqqk',
    'kqqqqqqqqqqqqqq^qqqqqqqqqqqqqqqqqqqk',
    'kDDkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 15 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 1, y: 16, w: 2, h: 1, to: 'ice_cave_grotto', spawn: { x: 32, y: 6 } },
    // The black tunnel, on into the bats' Roost.
    { x: 32, y: 1, w: 2, h: 2, to: 'ice_cave_roost', spawn: { x: 13, y: 18 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/ice_caves.txt',
  props: [
    { sprite: 'sign', x: 4, y: 14, text: 'hall_sign' },
    // Behind the false wall (30, 9..10): a hidden alcove.
    { sprite: 'chest', x: 32, y: 10, text: 'hall_chest', gives: 'crystal_cuirass', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // Up in the top hall, at the far end: a muff for Ves.
    { sprite: 'chest', x: 2, y: 3, text: 'hall_upper_chest', gives: 'icefox_muff', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { K: 'ice_wall', G: 'ice_wall', v: 'ice_stalactite', '^': 'ice_stalagmite', x: 'ice_crystals', z: 'ice_floor', b: 'ice_block', B: 'ice_block' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js).
  npcs: [
    // Golems pretending to be boulders, one in each hall.
    { enemy: 'stone_golem', x: 12, y: 10, patrol: [12, 12], behaviour: 'disguise' },
    { enemy: 'stone_golem', x: 24, y: 4, patrol: [24, 24], behaviour: 'disguise' },
    { enemy: 'glintling', x: 20, y: 12, patrol: [14, 24] },
    { enemy: 'glintling', x: 27, y: 14, patrol: [27, 27], behaviour: 'pounce', reach: 3 },
    { enemy: 'ice_moth', x: 8, y: 4, patrol: [4, 10], behaviour: 'wander' },
  ],
};
