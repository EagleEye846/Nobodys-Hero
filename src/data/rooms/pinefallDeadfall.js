// THE DEADFALL: giant trees lie where they fell, too high to climb from the
// ground (tall blocks). A stump (a low block) gets you up onto the biggest
// trunk, which runs the length of the room; walk along it, and out along the
// one that fell across it, to Ves's coral ribbon caught on a branch. The
// trunk is also the only way across to the east side.
// Tile key (see src/overworld/tileset.js):
//   B  tall block: a fallen trunk (jump onto it from a low block)
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   b  low block: a stump (jump onto it)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_DEADFALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_deadfall',
  // The room's name, for the Room Editor.
  name: 'THE DEADFALL',
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
    'LdddddddddddddBBdddddddddddddL',
    'LddddddddLddddBBdddddddddddddL',
    'LddLddddddddddBBBBBBBBBBBBBddL',
    'LdddddddddddddBBdddddddddddddL',
    'LdddddddddddddBBdddddddddddddL',
    'LdddddddddLdddBBdddddddddLdddL',
    'LdddddddddddddBBddddLddddddddL',
    'LdddLdddddddddBBdddddddddddddL',
    'LdddddddddddddBBddddddddZdddLL',
    'LdddddyyyyyyybBBddddddLddZdddL',
    'LdddddyyddddddBBdddddddddddddL',
    'LdddddyyddddddBBdddddddddddddy',
    'LdddddyyZZddddBBbyyyyyyyyyyyyy',
    'LdLdddyyddddddBBdddddddddddddL',
    'LdddddyydddLddBBdddddddddddddL',
    'LdddddyyddddddBBdddLdddddddLdL',
    'LLLLLLyyLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 17, w: 2, h: 1, to: 'pinefall_bramble_gate', spawn: { x: 12, y: 1 } },
    { x: 29, y: 12, w: 1, h: 2, to: 'pinefall_tumbled', spawn: { x: 1, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'ves_ribbon', x: 26, y: 3, text: 'deadfall_ribbon', gives: 'ves_ribbon', taken: { gone: true } },
    { sprite: 'old_pack', x: 2, y: 2, text: 'deadfall_pack', gives: 'pine_candy', taken: { text: 'deadfall_pack_empty' } },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', B: 'deadfall_trunk', b: 'deadfall_stump' },

  // A Russet lurks by the tree beside the path up from the gate; a Burrhog
  // rolls about the open ground past the trunks, below the ribbon.
  npcs: [
    { enemy: 'russet', x: 10, y: 8, patrol: [10, 10], behaviour: 'pounce' },
    { enemy: 'burrhog', x: 23, y: 7, patrol: [21, 27] },
  ],
};
