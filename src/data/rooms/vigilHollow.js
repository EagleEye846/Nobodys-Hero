// THE HOLLOW: a wide ledge where the first snow lies in patches, and the way
// on is a cave mouth in the face: the spire is hollow, and the heralds' route
// goes through it. A spur round the other way, up one throw of the rope,
// has a chest. One of the six camped here, by the sign.
// Tile key (see src/overworld/tileset.js):
//   M  cliff face (solid)                         ,  grass
//   T  pine tree (walk or hide behind) (solid)    m  cliff top (solid)
//   t  cave mouth (walk through it; see `doors`)  n  snow
//   :  dirt path                                  O  boulder (solid)
//   s  the great stair
export const VIGIL_HOLLOW = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_hollow',
  // The room's name, for the Room Editor.
  name: 'THE HOLLOW',
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
  vista: { altitude: 0.42, heading: 0.25 },
  // Birds circling the spire.
  birds: 4,

  tiles: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MM,T,,,,,,,MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MM,,,,,,,,,MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMmmmmmmmmmMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMttMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMttMMMMMM',
    'MM,T,,nn,T,,,,,,,,,,,,,,T,,,,,,,,,nn,,,T,MMM',
    'MM,,::::::::::::::::::::::::::::::::n::,,MMM',
    'MM,,:::::::::::,,,,,nnn,,,,,,,,,,,,,,,,,,MMM',
    'MM,,,,,,,,,,,,,,,,O,,,,,,,,,,,O,,,,,,,,,,MMM',
    'MMmmmmmmmmmmsssssmMmmmmmmmmmmmMmmmmmmmmmmMMM',
    'MMMMMMMMMMMMsssssMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 30 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 12, y: 31, w: 5, h: 1, to: 'vigil_spiral', spawn: { x: 39, y: 1 } },
    { x: 36, y: 24, w: 2, h: 1, to: 'cave_entry', spawn: { x: 3, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/mount_vigil.txt',
  props: [
    { sprite: 'sign', x: 16, y: 29, text: 'hollow_sign' },
    { sprite: 'savepoint', x: 28, y: 29, save: true },
    // A short throw up to a spur with a chest.
    { sprite: 'grapple_ring', x: 8, y: 22, grapple: true },
    { sprite: 'chest', x: 5, y: 22, text: 'hollow_chest', gives: 'snowmelt_tea', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'waymark', x: 33, y: 29, text: 'hollow_waymark' },
    { sprite: 'campfire_cold', x: 13, y: 26, text: 'hollow_fire' },
    { sprite: 'old_pack', x: 11, y: 28, text: 'hollow_pack', gives: 'herald_honeycake' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { T: 'vigil_pine', M: 'vigil_rock', n: 'vigil_first_snow', t: 'hollow_mouth', O: 'vigil_boulder' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  // A craghorn grazing in the bottom of the hollow.
  npcs: [
    { enemy: 'craghorn', x: 5, y: 27, patrol: [3, 8] },
  ],
};
