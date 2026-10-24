// THE BRAMBLE GATE: a bramble hedge right across the wood, with an old
// woodcutters' gate in it worked by three levers. The sign gives the order:
// as the sun goes (east, noon, west). Pull one out of turn and they all
// drop back. Through the gate, north, into the Deadfall.
// Tile key (see src/overworld/tileset.js):
//   L  scarlet tree (walk or hide behind) (solid)
//   Z  bramble hedge (solid)
//   d  leaf litter
//   y  leaf path
export const PINEFALL_BRAMBLE_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'pinefall_bramble_gate',
  // The room's name, for the Room Editor.
  name: 'THE BRAMBLE GATE',
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
    'LLLLLLLLLLLLyyLLLLLLLLLLLL',
    'LdddddddddddyydddddddddddL',
    'LdddLdddddddyyddddLddddddL',
    'LdddddddddddyydddddddddddL',
    'LdddddddLdddyydddddddLdddL',
    'LdddddddddddyydddddddddddL',
    'LZZZZZZZZZZZyyyZZZZZZZZZZL',
    'LZZZZZZZZZZZyyyZZZZZZZZZZL',
    'LddddddddddddydddddddddddL',
    'LddLdddddddddyddddddddLddL',
    'LddddddddddddydddddddddddL',
    'LddddddddddddyddLddddddddL',
    'yddddddddddddydddddddddddL',
    'yyyyyyyyyyyyyydddddddddddL',
    'LddddddddddddddddddddddddL',
    'LdddddLddddddddddddLdddddL',
    'LddddddddLdddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 13 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 12, w: 1, h: 2, to: 'pinefall_landing', spawn: { x: 22, y: 9 } },
    { x: 12, y: 0, w: 2, h: 1, to: 'pinefall_deadfall', spawn: { x: 6, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/pinefall.txt',
  props: [
    { sprite: 'gate_wide', x: 12, y: 7, text: 'gate_gate', opensWith: ['east', 'noon', 'west'], inOrder: true, openText: 'gate_open', resetText: 'gate_reset' },
    { sprite: 'sign', x: 10, y: 11, text: 'gate_sign' },
    { sprite: 'lever', x: 21, y: 12, text: 'gate_lever', lever: 'east' },
    { sprite: 'lever', x: 13, y: 16, text: 'gate_lever', lever: 'noon' },
    { sprite: 'lever', x: 3, y: 11, text: 'gate_lever', lever: 'west' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble' },

  // A Burrhog trundles the low ground east of the path, below the east
  // lever; a Sapling stands among the trees up past the gate, pretending.
  npcs: [
    { enemy: 'burrhog', x: 18, y: 14, patrol: [15, 23] },
    { enemy: 'sapling', x: 17, y: 3, patrol: [17, 17], behaviour: 'disguise' },
  ],
};
