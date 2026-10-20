// WHERE YOU FELL: the first room of Chapter 3. A clearing at the foot of a
// great scarlet tree, its crown snapped off where something fell down through
// it: you. Ves's mustard mitten is in the leaves beside you, the first thing of
// hers you find. A save point, and the path out east.
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_LANDING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_landing',
  // The room's name, for the Room Editor.
  name: 'WHERE YOU FELL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'pinefall',
  // The song that plays here: none at first, only the forest; once you've
  // met the Keeper at the woodcutters' fire, the Pinefall's waltz.
  music: null,
  musicAfter: { scene: 'keeper_at_the_fire', song: 'pinefall' },
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'forest',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLL',
    'LLLddddddddddddddddddLLL',
    'LddddddddddddddddddddddL',
    'LddddLdZZZddZddddLdddddL',
    'LddddddZZZdZZddddddddddL',
    'LdddddddddddddddddddLddL',
    'LdddddddddLddddddddddddL',
    'LddddddddddddddddddddddL',
    'LddLddddddyddddddddddddy',
    'Ldddddddddyyyyyyyyyyyyyy',
    'LdddddddddyyyddddddddddL',
    'LddddddddddddddddddLdddL',
    'LddddddLdddddddddddddddL',
    'LddddddddddddddLddddddLL',
    'LLddddddddddddddddddddLL',
    'LLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 23, y: 8, w: 1, h: 2, to: 'pinefall_bramble_gate', spawn: { x: 1, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'ves_mitten', x: 13, y: 10, text: 'landing_mitten', gives: 'ves_mitten', taken: { gone: true } },
    { sprite: 'savepoint', x: 4, y: 12, save: true },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 10, y: 6, text: 'landing_great_tree' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'landing_crown' },

  // No enemies in the Pinefall yet.
  npcs: [],
};
