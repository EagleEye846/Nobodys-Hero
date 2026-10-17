// Face portraits shown in the dialogue box when an NPC talks, Undertale style.
// Keyed by the NPC's id (the `npc` of their prop, and their file in text/npcs/).
// Each has an idle face and a blinking one, 32x32, drawn at 3x.

const KEEPER_PALETTE = {
  k: '#120c1c', // outline
  h: '#3a2a5e', // hood
  H: '#5a4890', // hood, lit by the lantern
  d: '#1a1230', // shadow at the hood's rim
  f: '#07040c', // the dark inside the hood
  e: '#ffd25e', // glowing eyes
  E: '#fff2c0', // eye shine
  r: '#4a3a7a', // robe
  R: '#33265a', // robe folds
};

const TAPER_PALETTE = {
  k: '#120c1c', // outline
  x: '#f2e6c8', // wax
  X: '#cdb98f', // wax in shadow
  j: '#fff8e6', // wax, catching the light
  n: '#ffcc66', // flame
  N: '#fff2c0', // flame's heart
  e: '#3a2a3a', // eyes
  E: '#ffffff', // eye shine
  u: '#f0a8a0', // blush
  m: '#8a4a4a', // smile
  q: '#7a3a5e', // shawl
  Q: '#5a2846', // shawl folds
};

export const PORTRAITS = {
  old_keeper: {
    palette: KEEPER_PALETTE,
    idle: [
      '................................',
      '...............kk...............',
      '..............khhk..............',
      '............kkhhhhkk............',
      '..........kkHHHhhhhhkk..........',
      '.........kHHHHHhhhhhhhk.........',
      '........kHHHHHHHhhhhhhhk........',
      '.......kHHHHHHHHhhhhhhhhk.......',
      '......kHHHHHHHHHhhhhhhhhhk......',
      '......kHHHHHHHHHhhhhhhhhhk......',
      '.....kHHHHHHHddddddhhhhhhhk.....',
      '.....kHHHHHdddffffdddhhhhhk.....',
      '.....kHHHHHdffffffffdhhhhhk.....',
      '.....kHHHHddffffffffddhhhhk.....',
      '.....kHHHHdffffffffffdhhhhk.....',
      '.....kHHHddffffffffffddhhhk.....',
      '.....kHHHddeEffffffEeddhhhk.....',
      '.....khHHdfeeffffffeefdhhhk.....',
      '.....khhHdffffffffffffdhhhk.....',
      '.....khhhddffffffffffddhhhk.....',
      '.....khhhddffffffffffddhhhk.....',
      '.....khhhhdffffffffffdhhhhk.....',
      '......khhhddffffffffddhhhk......',
      '......khhhhdffffffffdhhhhk......',
      '.......khhhdddffffdddhhhk.......',
      '......krhhhhhddddddhhhhhrk......',
      '.....krrrhhhhhhhhhhhhhhrrrk.....',
      '....krrrrRhhhhhhhhhhhhRrrrrk....',
      '...krrrrrRrrhhhhhhhhrrRrrrrrk...',
      '..krrrrrrRrrrrrrrrrrrrRrrrrrrk..',
      '..krrrrrrRrrrrrrrrrrrrRrrrrrrk..',
      '.krrrrrrrRrrrrrrrrrrrrRrrrrrrrk.',
    ],
    blink: [
      '................................',
      '...............kk...............',
      '..............khhk..............',
      '............kkhhhhkk............',
      '..........kkHHHhhhhhkk..........',
      '.........kHHHHHhhhhhhhk.........',
      '........kHHHHHHHhhhhhhhk........',
      '.......kHHHHHHHHhhhhhhhhk.......',
      '......kHHHHHHHHHhhhhhhhhhk......',
      '......kHHHHHHHHHhhhhhhhhhk......',
      '.....kHHHHHHHddddddhhhhhhhk.....',
      '.....kHHHHHdddffffdddhhhhhk.....',
      '.....kHHHHHdffffffffdhhhhhk.....',
      '.....kHHHHddffffffffddhhhhk.....',
      '.....kHHHHdffffffffffdhhhhk.....',
      '.....kHHHddffffffffffddhhhk.....',
      '.....kHHHddffffffffffddhhhk.....',
      '.....khHHdffffffffffffdhhhk.....',
      '.....khhHdffffffffffffdhhhk.....',
      '.....khhhddffffffffffddhhhk.....',
      '.....khhhddffffffffffddhhhk.....',
      '.....khhhhdffffffffffdhhhhk.....',
      '......khhhddffffffffddhhhk......',
      '......khhhhdffffffffdhhhhk......',
      '.......khhhdddffffdddhhhk.......',
      '......krhhhhhddddddhhhhhrk......',
      '.....krrrhhhhhhhhhhhhhhrrrk.....',
      '....krrrrRhhhhhhhhhhhhRrrrrk....',
      '...krrrrrRrrhhhhhhhhrrRrrrrrk...',
      '..krrrrrrRrrrrrrrrrrrrRrrrrrrk..',
      '..krrrrrrRrrrrrrrrrrrrRrrrrrrk..',
      '.krrrrrrrRrrrrrrrrrrrrRrrrrrrrk.',
    ],
  },
  mother_taper: {
    palette: TAPER_PALETTE,
    idle: [
      '...............knk..............',
      '..............knnk..............',
      '.............knnnnk.............',
      '.............knNNnk.............',
      '.............knNNnk.............',
      '.............knNNnk.............',
      '.............kknnkk.............',
      '...........kkxxkkxxkk...........',
      '..........kxxxxxxxxXXk..........',
      '.........kxjjxxxxxxXXXk.........',
      '.........kxjxxxxxxxxXXk.........',
      '........kxjxxxxxxxxxxXXk........',
      '........kxjxxxxxxxxxxXXk........',
      '........kxxxxxxxxxxxxxXXk.......',
      '.......kxxxxEexxxxxEexXXk.......',
      '........kxxxeexxxxxeexXXk.......',
      '........kxxxxxxxxxxxxxXXk.......',
      '........kxxuuxxxxxxxuuXXk.......',
      '........kxxxxxmxxxmxxXkk........',
      '........kxxxxxxmmmxxXXk.........',
      '.........kkxxxxxxxxXXk..........',
      '........kkkkxxxxxxxXkkkk........',
      '.......kqqqqxxxxxxxXqqqqk.......',
      '......kqqqqqxxxxxxxxqqqqqk......',
      '.....kqqqQqqxxxxxxxxqqQqqqk.....',
      '....kqqqqQqqqqqqqqqqqqQqqqqk....',
      '...kqqqqqQqqqqqqqqqqqqQqqqqqk...',
      '..kqqqqqQqqqqqqqqqqqqqqQqqqqqk..',
      '.kqqqqqqQqqqqqqqqqqqqqqQqqqqqqk.',
      'kqqqqqqqQqqqqqqqqqqqqqqQqqqqqqqk',
      'qqqqqqqQqqqqqqqqqqqqqqqqQqqqqqqq',
      'qqqqqqqQqqqqqqqqqqqqqqqqQqqqqqqq',
    ],
    blink: [
      '...............knk..............',
      '..............knnk..............',
      '.............knnnnk.............',
      '.............knNNnk.............',
      '.............knNNnk.............',
      '.............knNNnk.............',
      '.............kknnkk.............',
      '...........kkxxkkxxkk...........',
      '..........kxxxxxxxxXXk..........',
      '.........kxjjxxxxxxXXXk.........',
      '.........kxjxxxxxxxxXXk.........',
      '........kxjxxxxxxxxxxXXk........',
      '........kxjxxxxxxxxxxXXk........',
      '........kxxxxxxxxxxxxxXXk.......',
      '.......kxxxxxxxxxxxxxxXXk.......',
      '........kxxxeeexxxeeexXXk.......',
      '........kxxxxxxxxxxxxxXXk.......',
      '........kxxuuxxxxxxxuuXXk.......',
      '........kxxxxxmxxxmxxXkk........',
      '........kxxxxxxmmmxxXXk.........',
      '.........kkxxxxxxxxXXk..........',
      '........kkkkxxxxxxxXkkkk........',
      '.......kqqqqxxxxxxxXqqqqk.......',
      '......kqqqqqxxxxxxxxqqqqqk......',
      '.....kqqqQqqxxxxxxxxqqQqqqk.....',
      '....kqqqqQqqqqqqqqqqqqQqqqqk....',
      '...kqqqqqQqqqqqqqqqqqqQqqqqqk...',
      '..kqqqqqQqqqqqqqqqqqqqqQqqqqqk..',
      '.kqqqqqqQqqqqqqqqqqqqqqQqqqqqqk.',
      'kqqqqqqqQqqqqqqqqqqqqqqQqqqqqqqk',
      'qqqqqqqQqqqqqqqqqqqqqqqqQqqqqqqq',
      'qqqqqqqQqqqqqqqqqqqqqqqqQqqqqqqq',
    ],
  },
};
