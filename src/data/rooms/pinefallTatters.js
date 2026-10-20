// THE TORN CLEARING: a ring of trees round trampled leaves. Deep claw marks
// in the bark, some higher than a person. Scraps of evening-blue wool from
// Ves's coat. Something big was here, and so was she. (The midboss's
// clearing, when there is one.) South, the wood ends.
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_TATTERS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_tatters',
  // The room's name, for the Room Editor.
  name: 'THE TORN CLEARING',
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
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LdddddddddddddLddddddddddddL',
    'LdddddddLdddddddddddLddddddL',
    'LddLdddddddddddddddddddddddL',
    'LdddddddddddddddddddddddLddL',
    'LddddddZZddddddddddddddddddL',
    'LddddddddddddddddddddddddddL',
    'LddddddddddddddddddddddddddL',
    'yddddddddddddddddddddddddddL',
    'yyyyyyyddddddddddddddddddddL',
    'LddddddddddddddddddddddddLdL',
    'LddddddddddddddddddddddddddL',
    'LddddddddddddddddddZZZdddddL',
    'LddddddddddddyyddddddddddddL',
    'LdddLddddddddyyddddddddLdddL',
    'LdddddddddLddyydddLddddddddL',
    'LddddddddddddyyddddddddddddL',
    'LLLLLLLLLLLLLyyLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'pinefall_maze', spawn: { x: 33, y: 11 } },
    { x: 13, y: 17, w: 2, h: 1, to: 'pinefall_ravine', spawn: { x: 11, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'wool_scrap', x: 12, y: 8, text: 'tatters_scrap' },
    { sprite: 'wool_scrap', x: 17, y: 11, text: 'tatters_scrap_2' },
    { sprite: 'wool_scrap', x: 9, y: 12, text: 'tatters_scrap_3' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 8, y: 2, text: 'tatters_claws' },
    { x: 20, y: 2, text: 'tatters_claws' },
    { x: 25, y: 10, text: 'tatters_claws_high' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'tatters_brush' },

  // No enemies in the Pinefall yet.
  npcs: [],
};
