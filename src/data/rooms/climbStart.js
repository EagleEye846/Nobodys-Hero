// THE START OF THE CLIMB: up the stair from the Goat Track. A quiet shelf of
// meadow with no enemies, where the great stair breaks off at a sheer cliff.
// A herald's waymark tells you about the mountain and Heralds' Rest. One of
// the six who came before camped here: a tent, a cold fire, and a pack with
// their Climbing Rope. An iron ring at the top of the cliff, beside where the
// stair fell away, is the first climb; above it the stair carries on north
// to the Sheer Face.
// Tile key (see src/overworld/tileset.js):
//   m  cliff top (solid)                           M  cliff face (solid)
//   ,  grass                                       s  the great stair
//   O  boulder (solid)                             T  pine tree (walk or hide behind) (solid)
export const CLIMB_START = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'climb_start',
  // The room's name, for the Room Editor.
  name: 'THE START OF THE CLIMB',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stair',
  // The song that plays here (a file in src/data/music/).
  music: 'stair',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    'mmmmmmmmsssmmmmmmmmm',
    'MMMMMMMMsssMMMMMMMMM',
    'mT,,,,,,sss,,,,,,,Tm',
    'm,,,,T,,sss,,,T,,,,m',
    'm,,,,,,,sss,,,,,,,,m',
    'mT,,,,,,sss,,,,,,,Tm',
    'm,,,,,,,sss,,,,,,,,m',
    'mmmmmmmmmmmmmmmmmmmm',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'mT,,,,,,OOO,,,,,,,Tm',
    'm,,,,,,,sss,,,,,,,,m',
    'm,,,,,,,sss,,,,,,,,m',
    'm,,,,,,,sss,,,,,,,,m',
    'mT,,,,,,sss,,,,,,,Tm',
    'm,,,,,,,sss,,,,,,,,m',
    'm,,T,,,,sss,,,,T,,,m',
    'mmmmmmmmsssmmmmmmmmm',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 9, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 8, y: 17, w: 3, h: 1, to: 'goat_track', spawn: { x: 18, y: 1 } },
    { x: 8, y: 0, w: 3, h: 1, to: 'sheer_face', spawn: { x: 9, y: 25 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  // A `grapple` ring is somewhere the Climbing Rope can take you.
  textFile: 'interactions/the_stair.txt',
  props: [
    { sprite: 'sign', x: 11, y: 11, text: 'climb_waymark' },
    // The camp of one of the six who came before.
    { sprite: 'tent', x: 2, y: 12, text: 'climb_tent' },
    { sprite: 'campfire_cold', x: 5, y: 13, text: 'climb_campfire' },
    { sprite: 'old_pack', x: 2, y: 14, text: 'climb_pack', gives: 'climbing_rope', taken: { text: 'climb_pack_empty' } },
    // The first climb: at the top of the cliff, beside where the stair broke off.
    { sprite: 'grapple_ring', x: 12, y: 6, grapple: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 8, y: 10, text: 'climb_broken_stair' },
    { x: 9, y: 10, text: 'climb_broken_stair' },
    { x: 10, y: 10, text: 'climb_broken_stair' },
  ],
  tileTexts: { T: 'stair_pine', M: 'climb_cliff' },

  // No enemies here: a quiet place to catch your breath before the climb.
  // A chough on the path up, watching for someone to laugh at.
  npcs: [
    { enemy: 'chough', x: 10, y: 4, patrol: [3, 16] },
  ],
};
