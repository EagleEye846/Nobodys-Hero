// THE RIDGE: the first room of Mount Vigil, above the Sheer Face. The spire
// begins here: the room wraps round the mountain, and walking along a ledge
// turns the whole mountain under you, with the valleys turning behind. Three
// ledges climb it, joined by short rope climbs (two swings, one throw, two
// swings), a rockfall crossed over the top of fallen blocks, and a plank
// bridge where the top ledge fell away. The great stair picks up again at the
// top and winds on into the Spiral Stair.
// Tile key (see src/overworld/tileset.js):
//   M  cliff face (solid)                         s  the great stair
//   :  dirt path                                  ,  grass
//   g  plank bridge                               T  pine tree (walk or hide behind) (solid)
//   m  cliff top (solid)                          _  open sky (the view shows through) (solid)
//   b  low stone block (jump up onto it)          B  tall stone block (jump onto it from a low block)
//   O  boulder (solid)
export const VIGIL_RIDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_ridge',
  // The room's name, for the Room Editor.
  name: 'THE RIDGE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',
  // The outside of the spire: the left and right edges join up, and the room is drawn bent round the mountain.
  wraps: true,
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 0.2, heading: 0.0 },
  // Birds circling the spire.
  birds: 6,

  tiles: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMMMMMMMMMM',
    'MMMMMMMMM,,,:::::::ggg:::::::::::::::::::,,,',
    'MMMMMMMMM,,T,,,,,,,ggg,,,T,,,,,,,,,,,,,,,,,T',
    'MMMMMMMMMmmMmmmmmmm___mmmMmmmmmmmmmmmmmmmmmM',
    'MMMMMMMMMMMMMMMMMMM___MMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMM___MMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMM,,,,,,:::::::::::::bBBBBb:::::::::::,,,MM',
    'MMM,T,,,,,,,,,,,,T,,,,OOOOOO,,,,,T,,,,,,,,MM',
    'MMMmMmmmmmmmmmmmmMmmmmMMMMMMmmmmmMmmmmmmmmMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMM,T,,,,,,T,,,,,,,,,,,,,T,,,,,,,,,,,T,MMM',
    'MMMMM,,,::O::::::::::::::::::::::::::,,,,MMM',
    'MMMMMmmmmmMmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMM,,T,,,,:::::::::::::,T,MMMMMMMM',
    'MMMMMMMMMMMMM,,,,,,,,:,,,,,,,,,,,,,,MMMMMMMM',
    'MMMMMMMMMMMMMmmmmmmmsssmmmmmmmmmmmmmMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMsssMMMMMMMMMMMMMMMMMMMMM',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 21, y: 32 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 20, y: 33, w: 3, h: 1, to: 'sheer_face', spawn: { x: 9, y: 1 } },
    { x: 30, y: 0, w: 3, h: 1, to: 'vigil_spiral', spawn: { x: 6, y: 37 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    // The stair ends; a herald's waymark points up.
    { sprite: 'waymark', x: 24, y: 31, text: 'ridge_waymark' },
    { sprite: 'sign', x: 29, y: 31, text: 'ridge_notice' },
    // Face 1: zigzag up to the second ledge.
    { sprite: 'swing_ring', x: 32, y: 27 },
    { sprite: 'swing_ring', x: 30, y: 26 },
    { sprite: 'grapple_ring', x: 30, y: 24, grapple: true },
    // A chest at the west end of the ledge, past the boulder.
    { sprite: 'chest', x: 7, y: 24, text: 'ridge_chest', gives: 'frostberry_jam', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // Face 2: a single throw.
    { sprite: 'grapple_ring', x: 8, y: 18, grapple: true },
    { sprite: 'savepoint', x: 14, y: 18, save: true },
    // Face 3: rings to the top ledge.
    { sprite: 'swing_ring', x: 38, y: 14 },
    { sprite: 'swing_ring', x: 40, y: 12 },
    { sprite: 'grapple_ring', x: 40, y: 10, grapple: true },
    { sprite: 'cairn', x: 36, y: 9, text: 'ridge_cairn' },
    { sprite: 'chough', x: 23, y: 9, text: 'ridge_chough', walkable: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 20, y: 11, text: 'ridge_gap' },
    { x: 21, y: 11, text: 'ridge_gap' },
    { x: 19, y: 11, text: 'ridge_gap' },
  ],
  tileTexts: { T: 'vigil_pine', M: 'vigil_rock', g: 'vigil_bridge', O: 'vigil_boulder' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
