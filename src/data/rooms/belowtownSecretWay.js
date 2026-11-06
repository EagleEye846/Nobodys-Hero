// THE SECRET WAY: a short, low tunnel behind the toadstool beds in the south
// west corner of Belowtown Square, that comes out on the passage to the Long
// Rope. The folk dug it long ago so they could slip off and look at the rope
// without the whole town watching, and Tuck is one of the few who still knows
// it's there. You only ever walk it in one scene (tuck_shows_the_way_on), so it
// has no doors, only a few of the folk's things by the walls: the scene leads
// you along and out the far end.
//
// Tile key: # rock  W old carved stone  V stone wall hung with glow-worm lamps
//   . worn flagstone
export const BELOWTOWN_SECRET_WAY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_secret_way',
  // The room's name, for the Room Editor.
  name: 'THE SECRET WAY',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  // Quiet: the tunnel's the pause between the square and the goodbyes.
  music: null,
  ambience: 'belowtown',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '######################',
    '#WWWWWWWVWWWWWWWVWWWW#',
    '#WWWWWWWWWWWWWWWWWWWW#',
    '#....................#',
    '#....................#',
    '######################',
    '######################',
  ],

  // Where the player starts: the square end.
  playerStart: { x: 1, y: 4 },

  // No doors: the scene takes you out the far end, to the Long Rope.
  doors: [],

  // Arriving plays the walk through.
  cutscenes: [
    { x: 1, y: 4, w: 1, h: 1, scene: 'tuck_shows_the_way_on' },
  ],

  textFile: 'interactions/belowtown.txt',
  props: [
    // Set dressing: a back lane of little doors, tools left out, loose stones (walkable).
    { sprite: 'tiny_door', x: 7, y: 2, text: 'town_house_door' },
    { sprite: 'tiny_tools', x: 11, y: 2, text: 'bt_tiny_tools' },
    { sprite: 'tiny_door', x: 17, y: 2, text: 'town_house_door' },
    { sprite: 'floor_pebbles', x: 6, y: 3, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 12, y: 4, walkable: true, flat: true },
  ],
  tileTexts: { W: 'rope_face', '#': 'town_rock', V: 'town_lamps_wall' },

  // Nothing to fight: it's just the way through.
  npcs: [],
};
