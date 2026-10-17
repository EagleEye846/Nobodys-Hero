// THE GOAT TRACK: east of the Foot of the Stair, the way around the rockslide.
// A band of boulders cuts the meadow in two; the only way over is a run of the
// old stair that came down with the slide and landed on top of it. Jump onto
// its low end, up onto the tall blocks, and walk along it high above the
// boulders. A spur off it leads to a pack with a Climber's Jacket (armor). On
// the far side are a save point and a cairn, and the stair carries on north
// to the Start of the Climb.
// Tile key (see src/overworld/tileset.js):
//   ,  grass                                             :  dirt path
//   s  the great stair                                   M  cliff face (solid)
//   m  cliff top (solid)                         O  boulder (solid)
//   T  pine tree (walk or hide behind) (solid)   b  low stone block (jump up onto it)
//   B  tall stone block (jump onto it from a low block)
export const GOAT_TRACK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'goat_track',
  // The room's name, for the Room Editor.
  name: 'THE GOAT TRACK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stair',
  // The song that plays here (a file in src/data/music/).
  music: 'stair',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    'mmmmmmmmmmmmmmmmmsssmmmm',
    'MMMMMMMMMMMMMMMMMsssMMMM',
    'm,,,,T,,,,,,,,,,,sss,,Tm',
    'mT,,,,,,,,,,,,,,,sss,,,m',
    'm,,,,,,,,,,,,,O,,sss,,,m',
    'm,,,T,,,,,,,,,,,,sss,T,m',
    'm,,,,,,,,,,,,,,,,:::,,,m',
    'mOOOOOOOOOOOOOOOOObbOOOm',
    'mOOOOOOOBBBBBBBBBBBOOOOm',
    'mOOOOOObBOOOOOBOOOOOOOOm',
    'm,,,,,,:,,,,,OBO,,,,,,,m',
    'm,T,,,,:,,,,,,,,,,,,,T,m',
    'm,,,,,,:,,,,,,,,,O,,,,,m',
    '::::::::,,,,T,,,,,,,,,,m',
    '::::::,,,,,,,,,,,,,,,,,m',
    'm,,,O,,,,,,,,,,,T,,,,,,m',
    'm,T,,,,,,,,,,,,,,,,,O,Tm',
    'mmmmmmmmmmmmmmmmmmmmmmmm',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 13 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 13, w: 1, h: 2, to: 'beyond_ruins', spawn: { x: 22, y: 8 } },
    { x: 17, y: 0, w: 3, h: 1, to: 'climb_start', spawn: { x: 9, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/the_stair.txt',
  props: [
    { sprite: 'savepoint', x: 15, y: 3, save: true },
    { sprite: 'old_pack', x: 14, y: 10, text: 'goat_pack', gives: 'climbers_jacket' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 14, y: 4, text: 'goat_cairn' },
  ],
  tileTexts: { O: 'goat_rockslide', T: 'stair_pine', M: 'stair_cliff', b: 'goat_fallen_stair', B: 'goat_fallen_stair' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [
    { enemy: 'step', x: 5, y: 10, patrol: [5, 5], behaviour: 'disguise', reach: 1.5 },
    { enemy: 'craghorn', x: 14, y: 14, patrol: [9, 20] },
    { enemy: 'step', x: 9, y: 4, patrol: [9, 9], behaviour: 'disguise', reach: 3 },
    { enemy: 'craghorn', x: 6, y: 3, patrol: [3, 12], behaviour: 'wander' },
  ],
};
