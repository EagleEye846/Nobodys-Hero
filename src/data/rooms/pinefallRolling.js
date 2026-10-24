// THE ROLLING STONES: past the woodcutters' camp, a second pen of bramble
// with two rocks and two plates, and the gate to the Turning Wood beyond the
// hedge. Which rock goes first matters: put the wrong one down and the
// other has no way through. (10 pushes
// at best, and two of the four first pushes leave it unsolvable.)
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   b  stump (jump up onto it)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_ROLLING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_rolling',
  // The room's name, for the Room Editor.
  name: 'THE ROLLING STONES',
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
    'LddddddddddddLdddddddddL',
    'LdddLddddddddddddddddLdL',
    'LddddddddddddddddddddddL',
    'Lddddddddddddddddyyyyyyy',
    'LddddddddLdddddddydLdddy',
    'LddddddddddddddddydddddL',
    'LZZZZZZZZZZZZZZZyyyZZZZL',
    'LddZdZdddddZdddddydddddL',
    'yydZdddZdddZdddddydddddL',
    'yydZddZZdddZddddLydddLdL',
    'LydZdZZZdddZdddddydddddL',
    'LydZdddddddZddLddydddddL',
    'LydZdddddZdZdddddydddddL',
    'LydZZZZbZZZZdddddyddLddL',
    'LyyyyyyyyyyyyyyyyydddddL',
    'LZZZZZZZZZZZZZZZZZZZZZZL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'pinefall_camp', spawn: { x: 30, y: 10 } },
    { x: 23, y: 4, w: 1, h: 2, to: 'pinefall_maze', spawn: { x: 1, y: 11 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The rocks, plates and reset stump are a push puzzle (see Prop: `rock`,
  // `button`, `rockReset`); the gate opens when every plate is down.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'sign', x: 2, y: 8, text: 'rolling_sign' },
    { sprite: 'gate_wide', x: 16, y: 7, text: 'pen_gate', opensWith: ['near_plate', 'far_plate'], openText: 'pen_gate_open' },
    { sprite: 'rock_stump', x: 12, y: 13, text: 'rock_stump', rockReset: true },
    { sprite: 'stone_button', x: 4, y: 8, text: 'stone_plate', button: 'near_plate' },
    { sprite: 'stone_button', x: 10, y: 10, text: 'stone_plate', button: 'far_plate' },
    { sprite: 'push_rock', x: 10, y: 9, text: 'push_rock', rock: true },
    { sprite: 'push_rock', x: 9, y: 12, text: 'push_rock', rock: true },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'pen_hedge', b: 'pen_stump' },

  // No enemies: the pen is enough to think about.
  npcs: [],
};
