// THE COLD BROOK: a brook off the mountain cuts the wood in two, and the
// lower bank has no way over. The only bridge is up on a shelf of rock:
// throw the rope at the ring, climb, cross, and rope down the far side.
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   M  cliff face (solid)
//   d  leaf litter
//   g  plank bridge
//   m  cliff top (solid)
//   y  leaf path
//   ~  brook (solid)
export const PINEFALL_BROOK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_brook',
  // The room's name, for the Room Editor.
  name: 'THE COLD BROOK',
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
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddddddLddd~~~dLdddddddddddL',
    'LdLdddddddddd~~~ddddddddddLddL',
    'LdddyyyyyyyyygggyyyyyyyyyddddL',
    'Ldddddydddddd~~~ddddddyddddddL',
    'LdddddydddLdd~~~dddLddyddddddL',
    'Ldddddydddddd~~~ddddddyddddddL',
    'Lmmmmmmmmmmmm~~~mmmmmmmmmmmmmL',
    'LMMMMMMMMMMMM~~~MMMMMMMMMMMMML',
    'LMMMMMMMMMMMM~~~MMMMMMMMMMMMML',
    'Ldddddydddddd~~~ddddddyddddddL',
    'LddLddydddddd~~~ddddddydddLddL',
    'Ldddddydddddd~~~ddddddyddddddL',
    'ydddddydddddd~~~ddddddyddddddy',
    'yyyyyyyyyyyyy~~~yyyyyyyyyyyyyy',
    'ydddddddddddd~~~dddddddddddddy',
    'Ldddddddddddd~~~dddddddddddddL',
    'LdLdddddddLdd~~~ddLddddddLdddL',
    'Ldddddddddddd~~~dddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 14 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 13, w: 1, h: 3, to: 'pinefall_tumbled', spawn: { x: 22, y: 3 } },
    { x: 29, y: 13, w: 1, h: 3, to: 'pinefall_camp', spawn: { x: 1, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'grapple_ring', x: 6, y: 6, grapple: true },
    { sprite: 'grapple_ring', x: 22, y: 6, grapple: true },
    { sprite: 'sign', x: 8, y: 12, text: 'brook_sign' },
  ],
  tileTexts: { L: 'scarlet_tree', '~': 'brook_water', M: 'brook_cliff', g: 'brook_bridge' },

  // A Sapling passes for a tree on the west bank; a Russet wanders the
  // east bank, below the path to the camp.
  npcs: [
    { enemy: 'sapling', x: 4, y: 12, patrol: [4, 4], behaviour: 'disguise' },
    { enemy: 'russet', x: 22, y: 17, patrol: [17, 27], behaviour: 'wander' },
  ],
};
