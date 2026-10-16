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
};
