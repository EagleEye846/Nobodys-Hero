// THE OLD QUARRY: a hollow where someone cut stone a long time ago, on the
// way down to the Long Drop. Three rocks in a bramble pen, three plates, and
// a hedge gate between you and the ravine. The hardest of the Pinefall's
// rock puzzles: three of the five first pushes leave it unsolvable. (9
// pushes at best. You can box yourself in with your own rocks here; Z twice
// on a rock rolls them all home.)
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   b  stump (jump up onto it)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_QUARRY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_quarry',
  // The room's name, for the Room Editor.
  name: 'THE OLD QUARRY',
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
    'LdLddddddddydddddddddddL',
    'LddddddddddyyddLdddddddL',
    'LdZZZZZZZZZdyddddddddddL',
    'LdZdddZdddZdydddddddLddL',
    'LdZdddddddZdyddddddddddL',
    'LdZZdZdZdZZdyLdddddddddL',
    'LdZdddddddZdyddddddddddL',
    'LdZdddddddZdyddddddLdddL',
    'LdZZZZZZbZZdydLddddddddL',
    'LdddddyyyyyyyyyyyddddLdL',
    'LdddddddddddddddyddddddL',
    'LZZZZZZZZZZZZZZyyyZZZZZL',
    'LdddddddddddddddyddddddL',
    'LddLddddddddddddyddLdddL',
    'LdddddddLddyyyyyyddddddL',
    'LddddddddddyyddddddddLdL',
    'LLLLLLLLLLLyyLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 1 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 11, y: 0, w: 2, h: 1, to: 'pinefall_tatters', spawn: { x: 13, y: 16 } },
    { x: 11, y: 17, w: 2, h: 1, to: 'pinefall_ravine', spawn: { x: 11, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The rocks, plates and reset stump are a push puzzle (see Prop: `rock`,
  // `button`, `rockReset`); the gate opens when every plate is down.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'sign', x: 13, y: 2, text: 'quarry_sign' },
    { sprite: 'gate_wide', x: 15, y: 12, text: 'pen_gate', opensWith: ['west_plate', 'east_plate', 'low_plate'], openText: 'pen_gate_open' },
    { sprite: 'rock_stump', x: 9, y: 11, text: 'rock_stump', rockReset: true },
    { sprite: 'stone_button', x: 3, y: 4, text: 'stone_plate', button: 'west_plate' },
    { sprite: 'stone_button', x: 9, y: 4, text: 'stone_plate', button: 'east_plate' },
    { sprite: 'stone_button', x: 6, y: 8, text: 'stone_plate', button: 'low_plate' },
    { sprite: 'push_rock', x: 5, y: 5, text: 'push_rock', rock: true },
    { sprite: 'push_rock', x: 7, y: 5, text: 'push_rock', rock: true },
    { sprite: 'push_rock', x: 6, y: 7, text: 'push_rock', rock: true },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'pen_hedge', b: 'pen_stump' },

  // No enemies: the pen is enough to think about.
  npcs: [],
};
