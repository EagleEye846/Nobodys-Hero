// THE SPIRAL STAIR: the great stair, found again. It winds up and round the
// spire in runs, each a few steps higher than the last, so climbing it turns
// the mountain a quarter turn under you. One run has fallen away into the
// drop and been bridged with planks. At the top the face goes sheer again:
// rings up to the last ledge, where fallen blocks make a stair of their own
// up to a shelf with a chest, and the stair runs on north into the Hollow.
// Tile key (see src/overworld/tileset.js):
//   M  cliff face (solid)                         s  the great stair
//   :  dirt path                                  ,  grass
//   m  cliff top (solid)                          b  low stone block (jump up onto it)
//   B  tall stone block (jump onto it from a low block)T  pine tree (walk or hide behind) (solid)
//   O  boulder (solid)                            g  plank bridge
//   _  open sky (the view shows through) (solid)
export const VIGIL_SPIRAL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_spiral',
  // The room's name, for the Room Editor.
  name: 'THE SPIRAL STAIR',
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
  vista: { altitude: 0.32, heading: 0.682 },
  // Birds circling the spire.
  birds: 5,

  tiles: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMsssMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMM,,,,,,,,,MMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMM,,,,,,,,,MMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMMmbmmmmmmmMMMMMMMMMMMMMMMMM:::MMM',
    'MMMMMMMMMMMMMBMMMMMMMMMMMMMMMMMMMMMMMM:::MMM',
    'MM,,:::::::::::::::::::::::::::::::::::::::,',
    'MM,T,,,,,,,T,,,,,,,,O,,,,,,,,T,,,,,,,,,,,,,,',
    'MMmMmmmmmmmMmmmmmmmmMmmmmmmmmMmmmmmmmmmmmmmm',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM,,,,sssssss,',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM,,T,,,,,,,,,',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMmmMmmssmmmmm',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMssssssssssMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMssssssssssMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMssmmmmmmmmMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMssssgggsssMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMssssgggsssMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMssmm___mmmMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMssssssssssMM___MMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMssssssssssMM___MMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMssmmmmmmmmMMMMMMMMMMMMMMMMMMMMM',
    'MMMssssssssssssMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMssssssssssssMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMmmsssmmmmmmmMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMsssMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 37 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 5, y: 39, w: 3, h: 1, to: 'vigil_ridge', spawn: { x: 31, y: 1 } },
    { x: 38, y: 0, w: 3, h: 1, to: 'vigil_hollow', spawn: { x: 14, y: 30 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    // The stair resumes: a tally of the six on a standing stone.
    { sprite: 'tally_stone', x: 9, y: 37, text: 'spiral_tally' },
    { sprite: 'sign', x: 16, y: 34, text: 'spiral_sign' },
    { sprite: 'savepoint', x: 33, y: 24, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 35, y: 25, travel: 'spiral', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    // From the landing, the face is sheer: swing up to the top ledge.
    { sprite: 'swing_ring', x: 38, y: 21 },
    { sprite: 'swing_ring', x: 40, y: 19 },
    { sprite: 'grapple_ring', x: 40, y: 17, grapple: true },
    // Up the fallen blocks to a shelf with a chest.
    { sprite: 'chest', x: 18, y: 12, text: 'spiral_chest', gives: 'herald_cloak', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'waymark', x: 36, y: 16, text: 'spiral_waymark' },
    { sprite: 'chough', x: 31, y: 29, text: 'ridge_chough', walkable: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 25, y: 32, text: 'spiral_gap' },
    { x: 26, y: 32, text: 'spiral_gap' },
    { x: 27, y: 32, text: 'spiral_gap' },
  ],
  tileTexts: { T: 'vigil_pine', M: 'vigil_rock', g: 'vigil_bridge', s: 'spiral_stair', b: 'vigil_block', B: 'vigil_block' },

  // No enemies here: the mountain itself is the challenge (see notes/docs/mountain-enemies.md
  // for the ones designed for it).
  // A chough on the long ledge, and a loose step pretending to be stair on the
  // bridge path (no snow creatures here: it's green and sunny this low down).
  npcs: [
    { enemy: 'chough', x: 12, y: 16, patrol: [4, 22] },
    { enemy: 'step', x: 25, y: 31, patrol: [25, 25], behaviour: 'disguise', reach: 3 },
  ],
};
