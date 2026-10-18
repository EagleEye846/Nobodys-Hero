// THE SHEER FACE: north of the Start of the Climb, the first steep face, too
// tall for one throw of the rope. Rings are hammered into the rock in a route
// up it: hook the lowest, then swing and time Z to catch each next one (see
// src/overworld/climbing.js). The lower face is an easy zigzag ending in a
// straight-up catch; halfway is a ledge to rest and save on; the upper face
// adds a long sideways catch that needs a big swing. Above, the stair carries
// on north onto Mount Vigil (vigilRidge.js). No enemies: the climb is the challenge here.
// Tile key (see src/overworld/tileset.js):
//   m  cliff top (solid)                           M  cliff face (solid)
//   ,  grass                                       s  the great stair
//   T  pine tree (walk or hide behind) (solid)
export const SHEER_FACE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sheer_face',
  // The room's name, for the Room Editor.
  name: 'THE SHEER FACE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stair',
  // The song that plays here (a file in src/data/music/).
  music: 'stair',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    'mmmmmmmmsssmmmmmmmmm',
    'mT,,,,,,sss,,,,,,,Tm',
    'm,,,,,,,sss,,,,,,,,m',
    'mmmmmmmmmmmmmmmmmmmm',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'mT,,,,,,,,,,,,,,,,Tm',
    'm,,,,,,,,,,,,,,,,,,m',
    'mmmmmmmmmmmmmmmmmmmm',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMM',
    'mT,,,,,,,,,,,,,,,,Tm',
    'm,,,,,,,,,,,,,,,,,,m',
    'm,,T,,,,sss,,,,T,,,m',
    'm,,,,,,,sss,,,,,,,,m',
    'mmmmmmmmsssmmmmmmmmm',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 9, y: 25 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 8, y: 26, w: 3, h: 1, to: 'climb_start', spawn: { x: 9, y: 1 } },
    { x: 8, y: 0, w: 3, h: 1, to: 'vigil_ridge', spawn: { x: 21, y: 32 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  // swing_rings are hammered into the face; a grapple_ring tops each face.
  textFile: 'interactions/the_stair.txt',
  props: [
    { sprite: 'sign', x: 7, y: 23, text: 'face_notice' },
    // The lower face: a zigzag, then straight up over the edge.
    { sprite: 'swing_ring', x: 10, y: 19 },
    { sprite: 'swing_ring', x: 8, y: 17 },
    { sprite: 'swing_ring', x: 10, y: 15 },
    { sprite: 'swing_ring', x: 12, y: 13 },
    { sprite: 'grapple_ring', x: 12, y: 11, grapple: true },
    // The ledge halfway up.
    { sprite: 'savepoint', x: 3, y: 11, save: true },
    // The upper face: up, a long catch sideways (pump the swing high first),
    // up, then over the edge.
    { sprite: 'swing_ring', x: 6, y: 8 },
    { sprite: 'swing_ring', x: 8, y: 6 },
    { sprite: 'swing_ring', x: 12, y: 6 },
    { sprite: 'swing_ring', x: 13, y: 4 },
    { sprite: 'grapple_ring', x: 13, y: 2, grapple: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 8, y: 0, text: 'climb_stair_onward' },
    { x: 9, y: 0, text: 'climb_stair_onward' },
    { x: 10, y: 0, text: 'climb_stair_onward' },
  ],
  tileTexts: { T: 'stair_pine', M: 'face_rock' },

  // No enemies: the climb is the challenge here.
  // A chough on the ledge at the foot of the face.
  npcs: [
    { enemy: 'chough', x: 16, y: 23, patrol: [14, 18] },
  ],
};
