// THE LONG DROP: the wood ends at a ravine that falls away in shelves. Rope
// down shelf by shelf (stand on a ring and face down). At the bottom the
// trees stop and there's only mist, flat and grey, with lights in it: the
// Lantern Marsh, which isn't built yet (no door south for now).
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   M  cliff face (solid)
//   d  leaf litter
//   m  cliff top (solid)
//   y  leaf path
export const PINEFALL_RAVINE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_ravine',
  // The room's name, for the Room Editor.
  name: 'THE LONG DROP',
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
    'LLLLLLLLLLLyyLLLLLLLLLLL',
    'LddddddddddyyddddddddddL',
    'LddLdddddddyyddddddLdddL',
    'LddddddddddyyddddddddddL',
    'LddddddddddyyddddddddddL',
    'LdddddddyyyyyddddddddddL',
    'LdddddddyddddddddddddddL',
    'LmmmmmmmmmmmmmmmmmmmmmmL',
    'LMMMMMMMMMMMMMMMMMMMMMML',
    'LMMMMMMMMMMMMMMMMMMMMMML',
    'LMMMMMMMMMMMMMMMMMMMMMML',
    'LdddddddyddddddddddddddL',
    'LdddddddyyyyyyyyyydddddL',
    'LdddLddddddddddddydddddL',
    'LddddddddddddddddydddLdL',
    'LdddddddddddLddddydddddL',
    'LdLddddddddddddddydddddL',
    'LddddddddddddddddydddddL',
    'LmmmmmmmmmmmmmmmmmmmmmmL',
    'LMMMMMMMMMMMMMMMMMMMMMML',
    'LMMMMMMMMMMMMMMMMMMMMMML',
    'LMMMMMMMMMMMMMMMMMMMMMML',
    'LddddddddddddddddydddddL',
    'LddddddddddddddddydddddL',
    'LddddddddyyyyyyyyydddddL',
    'LddLdddddddddddddddddddL',
    'LddddddddddddddddddddddL',
    'LdddddddddddddddddddLddL',
    'LddddddddddddddddddddddL',
    'LddddddddddddddddddddddL',
    'LdddddLddddddddddddddddL',
    'LdddddddddddddddLddddddL',
    'LddddddddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 1 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 11, y: 0, w: 2, h: 1, to: 'pinefall_tatters', spawn: { x: 13, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'grapple_ring', x: 8, y: 6, grapple: true },
    { sprite: 'grapple_ring', x: 17, y: 17, grapple: true },
    { sprite: 'sign', x: 12, y: 28, text: 'ravine_end' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 1, y: 32, text: 'ravine_mist' },
    { x: 2, y: 32, text: 'ravine_mist' },
    { x: 3, y: 32, text: 'ravine_mist' },
    { x: 4, y: 32, text: 'ravine_mist' },
    { x: 5, y: 32, text: 'ravine_mist' },
    { x: 6, y: 32, text: 'ravine_mist' },
    { x: 7, y: 32, text: 'ravine_mist' },
    { x: 8, y: 32, text: 'ravine_mist' },
    { x: 9, y: 32, text: 'ravine_mist' },
    { x: 10, y: 32, text: 'ravine_mist' },
    { x: 11, y: 32, text: 'ravine_mist' },
    { x: 12, y: 32, text: 'ravine_mist' },
    { x: 13, y: 32, text: 'ravine_mist' },
    { x: 14, y: 32, text: 'ravine_mist' },
    { x: 15, y: 32, text: 'ravine_mist' },
    { x: 16, y: 32, text: 'ravine_mist' },
    { x: 17, y: 32, text: 'ravine_mist' },
    { x: 18, y: 32, text: 'ravine_mist' },
    { x: 19, y: 32, text: 'ravine_mist' },
    { x: 20, y: 32, text: 'ravine_mist' },
    { x: 21, y: 32, text: 'ravine_mist' },
    { x: 22, y: 32, text: 'ravine_mist' },
  ],
  tileTexts: { L: 'scarlet_tree', M: 'ravine_cliff' },

  // No enemies in the Pinefall yet.
  npcs: [],
};
