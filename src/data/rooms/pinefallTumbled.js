// THE TUMBLED STONES: a clearing cut in two by a bramble hedge, with a gate
// in it that has no lever: its rope runs under the ground to a stone plate
// in a pen of bramble. There's one mossy rock in the pen. Push it onto the
// plate (hop over the stump to get in). The first of the Pinefall's rock
// puzzles, and the gentlest: a rock in a corner stays in a corner. (The pen
// takes 5 pushes at best.)
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   b  stump (jump up onto it)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_TUMBLED = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_tumbled',
  // The room's name, for the Room Editor.
  name: 'THE TUMBLED STONES',
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
    'LdddddddddddddddddddLddL',
    'LddLddddddddLddddddddddL',
    'Ldddddddddddddddyyyyyyyy',
    'LdddddddLdddddddyddddddy',
    'LdddddLdddddLdddyddddddL',
    'LdddddddddddddddydddLddL',
    'LZZZZZZZZZZZZZZyyyZZZZZL',
    'LdddZdddddddZdddyddddddL',
    'LdddZdZdZdddZdddydddLddL',
    'yyydZdddddddZdLdyddddddL',
    'ydydZddZddddZdddyddLdddL',
    'LdydZZbZZZZZZdddyddddLdL',
    'LdyyyyyyyyyyyyyyyddddddL',
    'LZZZZZZZZZZZZZZZZZZZZZZL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'pinefall_deadfall', spawn: { x: 28, y: 13 } },
    { x: 23, y: 3, w: 1, h: 2, to: 'pinefall_brook', spawn: { x: 1, y: 14 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The rocks, plates and reset stump are a push puzzle (see Prop: `rock`,
  // `button`, `rockReset`); the gate opens when every plate is down.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'sign', x: 1, y: 8, text: 'tumbled_sign' },
    { sprite: 'gate_wide', x: 15, y: 7, text: 'pen_gate', opensWith: ['plate'], openText: 'pen_gate_open' },
    { sprite: 'rock_stump', x: 13, y: 11, text: 'rock_stump', rockReset: true },
    { sprite: 'stone_button', x: 10, y: 9, text: 'stone_plate', button: 'plate' },
    { sprite: 'push_rock', x: 7, y: 9, text: 'push_rock', rock: true },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'pen_hedge', b: 'pen_stump' },

  // No enemies: the pen is enough to think about.
  npcs: [],
};
