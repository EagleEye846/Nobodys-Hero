// THE FOOT OF THE STAIR: through the old door out of the Ruins, the first room
// of Chapter 2. Daylight, a meadow at the foot of the mountain, and the great
// stair rising out of view between the cliffs, buried by a rockslide. A goat
// track leads off east around it (to the Goat Track). A low block and a tall
// one make a first little climb to a ledge, with something left behind on it.
// Tile key (see src/overworld/tileset.js):
//   m  cliff top (solid)                           M  cliff face (solid)
//   ,  grass                                       :  dirt path
//   s  the great stair                             O  boulder (solid)
//   T  pine tree (walk or hide behind) (solid)     D  doorway (walk through it; see `doors`)
//   b  low stone block (jump onto it)              B  tall stone block (jump onto it from a low block)
export const BEYOND_RUINS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'beyond_ruins',
  // The room's name, for the Room Editor.
  name: 'THE FOOT OF THE STAIR',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stair',
  // The song that plays here (a file in src/data/music/).
  music: 'stair',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    'mmmmmmmmmmsssmmmmmmmmmmm',
    'MMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMOOOMMMMMMMMMMM',
    'm,,,,,,,,,sss,,,,,,,,BBm',
    'mT,O,,,,,,sss,,,,,,,,b,m',
    'm,,,,,,,,,sss,,,,,,,,,,m',
    'm,,,,,T,,,:::,,,,,,,,,Tm',
    'mT,,,,,,,,:::,,,,,O,,,,m',
    'm,,,,,,,,,:::,,,,,,,,:::',
    'm,,T,,,,,,:::,,,,,,,T:::',
    'mT,,,,,,,,:::,,,,,,,,,,m',
    'm,,,,,,O,,:::,,,,,,,,,Tm',
    'm,,,,,,,,,:::,,,,,,,,,,m',
    'mmmmmmmmmmDDDmmmmmmmmmmm',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 10, y: 13, w: 3, h: 1, to: 'way_out', spawn: { x: 32, y: 4 } },
    { x: 23, y: 8, w: 1, h: 2, to: 'goat_track', spawn: { x: 1, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_stair.txt',
  props: [
    { sprite: 'sign', x: 9, y: 6, text: 'stair_tally' },
    // Up on the ledge in the corner: jump onto the low block, then up onto the
    // tall ledge beside it, and reach across.
    { sprite: 'old_pack', x: 22, y: 3, text: 'stair_pack', gives: 'climbers_ration' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 10, y: 2, text: 'stair_rockslide' },
    { x: 11, y: 2, text: 'stair_rockslide' },
    { x: 12, y: 2, text: 'stair_rockslide' },
  ],
  tileTexts: { O: 'stair_boulder', T: 'stair_pine', M: 'stair_cliff', b: 'stair_block', B: 'stair_tall_block' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); a disguised
  // LOOSE STEP lies in the grass looking like a fallen block.
  npcs: [
    { enemy: 'step', x: 17, y: 10, patrol: [17, 17], behaviour: 'disguise', reach: 3 },
    { enemy: 'craghorn', x: 16, y: 5, patrol: [14, 20] },
  ],
};
