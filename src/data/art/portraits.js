// Face portraits shown in the dialogue box when an NPC talks.
// Keyed by the NPC's id (the `npc` of their prop, and their file in text/npcs/).
// Each has an idle face and a blinking one, 32x32, drawn at 3x.
//
// They can also have `expressions`: other moods, each a few changes to the idle
// face as [row, column, pixels] (so they always match it). `eyes` lists the
// rows of the eyes: blinking shows the blink face there, unless the expression
// is `closed` (its eyes are already shut). Dialogue picks one by starting a
// page with its name in braces: "{sad}I miss them." (see src/ui/textbox.js).

const KEEPER_PALETTE = {
  k: '#120c1c', // outline
  h: '#3a2a5e', // hood
  H: '#5a4890', // hood, lit by the lantern
  d: '#1a1230', // shadow at the hood's rim
  f: '#07040c', // the dark inside the hood
  e: '#ffd25e', // glowing eyes
  E: '#fff2c0', // eye shine
  g: '#8a7230', // eyes, dimmed
  G: '#ff9a3a', // eyes, burning
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
  o: '#4a2a2a', // open mouth
  t: '#8fd0ff', // tears
  a: '#ff8a4a', // flame, flaring
  w: '#b08a50', // flame, guttering
  s: '#8a8090', // smoke
};

// Taper's flame, by mood: her candle shows how she feels.
const FLAME = {
  flaring: [
    [0, 0, '..............kaak..............'],
    [1, 0, '.............kaank..............'],
    [2, 0, '.............kaanak.............'],
    [3, 0, '.............kanNak.............'],
  ],
  guttering: [
    [0, 0, '................................'],
    [1, 0, '................................'],
    [2, 0, '................................'],
    [3, 0, '...............kwk..............'],
    [4, 0, '..............kwnwk.............'],
    [5, 0, '..............kwnwk.............'],
  ],
  out: [
    [0, 0, '...............s................'],
    [1, 0, '................s...............'],
    [2, 0, '...............s................'],
    [3, 0, '................s...............'],
    [4, 0, '...............s................'],
    [5, 0, '................................'],
    [6, 0, '..............kkkk..............'],
  ],
};

// Her brows (she has none at rest), mouths and cheeks.
const SAD_BROWS = [[12, 13, 'ee'], [13, 11, 'ee'], [12, 18, 'ee'], [13, 20, 'ee']];
const CROSS_BROWS = [[12, 11, 'ee'], [13, 13, 'ee'], [12, 19, 'ee'], [13, 18, 'ee']];
const FROWN = [[18, 14, 'xmmmx'], [19, 14, 'mxxxm']];
const NO_BLUSH = [[17, 11, 'xx'], [17, 20, 'xx']];

const TAPER_EXPRESSIONS = {
  glee: {
    closed: true,
    patches: [
      [14, 11, 'xeex'], [15, 11, 'exxe'], [14, 18, 'xeex'], [15, 18, 'exxe'],
      [18, 13, 'mxxxxxm'], [19, 14, 'mooom'],
    ],
  },
  mild_anger: {
    patches: [[13, 12, 'ee'], [13, 19, 'ee'], [18, 14, 'xxxxx'], [19, 14, 'mmmmm']],
  },
  angry: {
    patches: [...FLAME.flaring, ...CROSS_BROWS, [14, 12, 'ee'], [14, 19, 'ee'], ...FROWN],
  },
  sad: {
    patches: [...SAD_BROWS, [14, 12, 'xx'], [14, 19, 'xx'], ...FROWN],
  },
  crying: {
    patches: [...SAD_BROWS, [14, 12, 'xx'], [14, 19, 'xx'], ...FROWN, [16, 13, 't'], [16, 19, 't'], [17, 13, 't'], [17, 19, 't'], [18, 12, 't'], [18, 20, 't']],
  },
  worried: {
    patches: [...SAD_BROWS, [18, 14, 'xxxxx'], [19, 14, 'xmmmx']],
  },
  surprised: {
    patches: [[13, 12, 'ee'], [13, 19, 'ee'], [18, 14, 'xxoxx'], [19, 14, 'xxoxx']],
  },
  exhausted: {
    patches: [...FLAME.guttering, ...NO_BLUSH, [14, 11, 'eeee'], [15, 11, 'xeex'], [14, 18, 'eeee'], [15, 18, 'xeex'], [18, 14, 'xxxxx'], [19, 14, 'xxoxx']],
  },
  beaten: {
    closed: true,
    patches: [...FLAME.out, ...SAD_BROWS, ...NO_BLUSH, [14, 11, 'xxxx'], [15, 11, 'eeex'], [14, 18, 'xxxx'], [15, 18, 'xeee'], [18, 14, 'xxxxx'], [19, 14, 'xmmmx']],
  },
};

// The Keeper's face is lost in his hood: only his eyes show how he feels.
const KEEPER_EXPRESSIONS = {
  glee: { closed: true, patches: [[16, 10, 'fef'], [17, 10, 'efe'], [16, 19, 'fef'], [17, 19, 'efe']] },
  mild_anger: { patches: [[16, 11, 'ff'], [16, 19, 'ff']] },
  angry: { patches: [[16, 11, 'Gf'], [17, 11, 'fG'], [16, 19, 'fG'], [17, 19, 'Gf']] },
  sad: { patches: [[16, 11, 'fe'], [17, 11, 'ef'], [16, 19, 'ef'], [17, 19, 'fe']] },
  worried: { patches: [[16, 11, 'fE'], [16, 19, 'Ef']] },
  surprised: { patches: [[15, 11, 'eE'], [15, 19, 'Ee']] },
  sly: { patches: [[16, 19, 'ff']] },
  exhausted: { patches: [[16, 11, 'ff'], [17, 11, 'gg'], [16, 19, 'ff'], [17, 19, 'gg']] },
  beaten: { patches: [[16, 11, 'ff'], [17, 11, 'gg'], [16, 19, 'ff'], [17, 19, 'ff']] },
};

const VES_PALETTE = {
  k: '#1a1020', // outline
  u: '#8a3f78', // umbrella
  U: '#5e2852', // umbrella ribs and shade
  p: '#e0aa48', // mittens and the patch on the umbrella
  P: '#b07c2c', // mitten, in shadow
  g: '#5a3e2e', // umbrella shaft
  h: '#4a2a26', // hair, warm chestnut
  H: '#7c4a36', // hair, catching the light
  r: '#e8685a', // her coral ribbon
  R: '#b84a44', // ribbon, in shadow
  s: '#f7d4b4', // skin
  S: '#e0ae90', // skin in shadow
  e: '#2a1a2a', // eyes
  E: '#ffffff', // eye shine
  i: '#4f8fd8', // irises, winter blue
  I: '#9cc8f4', // irises, lit
  b: '#f29a9a', // blush
  m: '#a8485a', // mouth
  o: '#5a2a36', // open mouth
  t: '#9ad8ff', // tears
  T: '#e6f6ff', // tears, welling
  c: '#3e4f8e', // coat, evening blue
  C: '#2c3868', // coat folds
  w: '#f4ecdc', // scarf, cream
  W: '#e0705a', // scarf stripe, coral
  n: '#ffffff', // snow
};

// Ves's face: a girl of about sixteen under her umbrella. She feels things
// strongly, so her face goes a long way either side of her gentle smile:
// beaming and laughing, tender, resolute, furious, sobbing.
const VES_EXPRESSIONS = {
  smile: { patches: [[16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'smssms'], [20, 13, 'ssmmss']] },
  glee: { closed: true, patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 11, 'kkk'], [14, 18, 'kkk'], [15, 11, 'sss'], [15, 18, 'sss'], [15, 10, 'k'], [15, 14, 'k'], [15, 17, 'k'], [15, 21, 'k'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'mmmmmm'], [20, 13, 'smooms']] },
  laughing: { closed: true, patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 11, 'kkk'], [14, 18, 'kkk'], [15, 11, 'sss'], [15, 18, 'sss'], [15, 10, 'k'], [15, 14, 'k'], [15, 17, 'k'], [15, 21, 'k'], [11, 11, 'sss'], [11, 18, 'sss'], [10, 18, 'hhh'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'mmmmmm'], [20, 13, 'moooom']] },
  tender: { patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'kkkk'], [14, 18, 'kkkk'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'smssms'], [20, 13, 'ssmmss']] },
  sad: { patches: [[11, 11, 'ssh'], [12, 11, 'hh'], [11, 18, 'hss'], [12, 19, 'hh'], [14, 11, 'eii'], [14, 18, 'eii'], [19, 13, 'ssmmss'], [20, 13, 'smssms']] },
  crying: { patches: [[11, 11, 'ssh'], [12, 11, 'hh'], [11, 18, 'hss'], [12, 19, 'hh'], [14, 11, 'eTi'], [14, 18, 'eTi'], [16, 11, 't'], [17, 11, 't'], [16, 20, 't'], [17, 20, 't'], [18, 10, 't'], [18, 21, 't'], [19, 13, 'smmmms'], [20, 13, 'mossom']] },
  sobbing: { closed: true, patches: [[11, 11, 'ssh'], [12, 11, 'hh'], [11, 18, 'hss'], [12, 19, 'hh'], [13, 10, 'ssss'], [13, 18, 'ssss'], [14, 11, 'sss'], [14, 18, 'sss'], [15, 10, 'kkkk'], [15, 18, 'kkkk'], [16, 10, 'tt'], [17, 11, 't'], [18, 11, 't'], [16, 20, 'tt'], [17, 20, 't'], [18, 20, 't'], [19, 10, 't'], [19, 21, 't'], [19, 13, 'smmmms'], [20, 13, 'moooom']] },
  worried: { patches: [[11, 11, 'ssh'], [12, 11, 'hh'], [11, 18, 'hss'], [12, 19, 'hh'], [19, 13, 'ssssss'], [20, 13, 'smsmms']] },
  surprised: { patches: [[12, 10, 'kkkk'], [12, 18, 'kkkk'], [13, 10, 'seEi'], [13, 18, 'eEis'], [14, 11, 'eii'], [14, 18, 'eii'], [11, 11, 'sss'], [11, 18, 'sss'], [10, 18, 'hhh'], [19, 13, 'ssmmss'], [20, 13, 'smooms']] },
  scared: { patches: [[12, 10, 'kkkk'], [12, 18, 'kkkk'], [13, 10, 'seEi'], [13, 18, 'eEis'], [14, 11, 'eii'], [14, 18, 'eii'], [11, 11, 'ssh'], [12, 11, 'hh'], [11, 18, 'hss'], [12, 19, 'hh'], [19, 13, 'msmsms'], [20, 13, 'ssssss']] },
  determined: { patches: [[11, 11, 'hss'], [12, 12, 'hh'], [11, 18, 'ssh'], [12, 18, 'hh'], [19, 13, 'ssssss'], [20, 13, 'smmmms']] },
  resolute: { patches: [[11, 11, 'hss'], [12, 12, 'hh'], [11, 18, 'ssh'], [12, 18, 'hh'], [13, 10, 'skkk'], [13, 18, 'kkks'], [14, 11, 'kEi'], [14, 18, 'eEk'], [19, 13, 'ssssss'], [20, 13, 'smmmms']] },
  angry: { patches: [[11, 11, 'hss'], [12, 12, 'hh'], [11, 18, 'ssh'], [12, 18, 'hh'], [14, 11, 'kEi'], [14, 18, 'eEk'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'smmmms'], [20, 13, 'mssssm']] },
  furious: { patches: [[11, 11, 'hss'], [12, 12, 'hh'], [11, 18, 'ssh'], [12, 18, 'hh'], [12, 11, 'khh'], [12, 18, 'hhk'], [14, 11, 'kik'], [14, 18, 'kik'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'mmmmmm'], [20, 13, 'mommom']] },
  praying: { closed: true, patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 11, 'sss'], [14, 18, 'sss'], [15, 10, 'kkkk'], [15, 18, 'kkkk'], [19, 13, 'ssssss'], [20, 13, 'ssmmss']] },
  shy: { patches: [[14, 11, 'eeE'], [14, 18, 'eeE'], [15, 11, 'eei'], [15, 18, 'eei'], [16, 10, 'bbb'], [16, 19, 'bbb'], [17, 10, 'bb'], [17, 20, 'bb'], [19, 13, 'ssssss'], [20, 13, 'sssmms']] },
  thoughtful: { patches: [[14, 11, 'Eie'], [14, 18, 'Eie'], [11, 18, 'sss'], [10, 18, 'hhh'], [19, 13, 'ssssss'], [20, 13, 'ssmmms']] },
  hopeful: { patches: [[11, 11, 'sss'], [11, 18, 'sss'], [10, 18, 'hhh'], [14, 11, 'EEi'], [14, 18, 'EEi'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'msssms'], [20, 13, 'smmmms']] },
  exhausted: { patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'kkkk'], [14, 18, 'kkkk'], [19, 13, 'ssssss'], [20, 13, 'smmmms']] },
  cold: { closed: true, patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 11, 'kss'], [14, 18, 'ssk'], [15, 10, 'sskk'], [15, 18, 'kkss'], [17, 16, 'b'], [18, 15, 'bb'], [16, 10, 'bbb'], [16, 19, 'bbb'], [19, 13, 'ssssss'], [20, 13, 'msmsms']] },
};

const GRETA_PALETTE = {
  k: '#1a1020', // outline
  '1': '#b08858', // fur
  D: '#7a5a3a', // dark fur
  '2': '#e2c69c', // muzzle and cheeks
  N: '#d08a8a', // nose
  e: '#1e1420', // eyes
  E: '#ffffff', // eye shine
  W: '#f4f1ea', // flour
  r: '#c43b3b', // dress, herald red
  R: '#8e2a2e', // dress folds
  a: '#ece4d4', // apron
  A: '#c8bfae', // apron creases
  m: '#5a3a2e', // mouth
  o: '#3a2224', // open mouth
  b: '#e89a8a', // blush
  t: '#9ad8ff', // tears
  L: '#9a9aa8', // ladle
};

// Greta, who keeps the inn and has kept Ves fed for eight years: kind,
// floury, and not to be argued with.
const GRETA_EXPRESSIONS = {
  smile: { patches: [[20, 13, 'm2222m'], [21, 14, 'mmmm']] },
  glee: { closed: true, patches: [[13, 11, '11'], [13, 19, '11'], [14, 11, 'kk'], [14, 19, 'kk'], [15, 10, 'k11k'], [15, 18, 'k11k'], [20, 13, 'mmmmmm'], [21, 14, 'moom']] },
  surprised: { patches: [[12, 11, 'kk'], [12, 19, 'kk'], [13, 11, 'eE'], [13, 19, 'eE'], [20, 13, '2mm222'], [21, 14, 'moom']] },
  worried: { patches: [[11, 12, 'D'], [12, 11, 'D'], [11, 19, 'D'], [12, 20, 'D'], [20, 13, '222222'], [21, 14, 'mmmm']] },
  sad: { patches: [[11, 12, 'D'], [12, 11, 'D'], [11, 19, 'D'], [12, 20, 'D'], [14, 11, 'ee'], [14, 19, 'ee'], [20, 13, '22mm22'], [21, 13, 'm2222m']] },
  crying: { patches: [[11, 12, 'D'], [12, 11, 'D'], [11, 19, 'D'], [12, 20, 'D'], [14, 11, 'ee'], [14, 19, 'ee'], [16, 11, 't'], [17, 11, 't'], [16, 20, 't'], [17, 20, 't'], [20, 13, '2mmmm2'], [21, 13, 'mooomm']] },
  stern: { patches: [[11, 10, 'DD'], [12, 12, 'D'], [11, 20, 'DD'], [12, 19, 'D'], [13, 11, 'kk'], [13, 19, 'kk'], [20, 13, '222222'], [21, 14, 'mmmm']] },
  tender: { closed: true, patches: [[13, 11, '11'], [13, 19, '11'], [14, 11, '11'], [14, 19, '11'], [15, 11, 'kk'], [15, 19, 'kk'], [20, 13, 'm2222m'], [21, 14, 'mmmm']] },
};

export const PORTRAITS = {
  old_keeper: {
    palette: KEEPER_PALETTE,
    eyes: [15, 16, 17],
    expressions: KEEPER_EXPRESSIONS,
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
    eyes: [14, 15],
    expressions: TAPER_EXPRESSIONS,
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
  vesper: {
    palette: VES_PALETTE,
    eyes: [13, 14, 15],
    expressions: VES_EXPRESSIONS,
    idle: [
      '...................kkkkuuuUuuuuu',
      '................kkkuuuuuUUuuuuuu',
      '..............kkuuuuuuuUuuuuuuuu',
      '............kkuuuuuppUUuuuuuuuuu',
      '..........kkhuuuuuuuUuuuuuuuuuuu',
      '.........khhUuuUuuUUuUuuUuuUuuUu',
      '........khhhhHHHHHhhrRkRrkkgkkkk',
      '........khhHHHhhhhhhhhrkk.kgk...',
      '.......khhhhhhhhhhhhhhhhk.kgk...',
      '......khhhhhhhhhhhhsshhhhkkgk...',
      '......khhhhhhhhhhhhshhhhhkkgk...',
      '......khhhhhhhsssshhhhhhhkkgk...',
      '......khhhssssssssssshhhhkkgk...',
      '......khhhkkkksssskkkkhhhkkgk...',
      '......khhhseEisssseEishhhkkgk...',
      '......khhhseiIsssseiIshhhkkgk...',
      '......khhhsbbssssssbbshhhkkgk...',
      '......khhhssssssSssssshhhkkgk...',
      '......khhhsssssSsssssshhhkkgk...',
      '......khhhhsssmssmssshhhhkkgk...',
      '......khhhhssssmmsssshhhhkkgk...',
      '......khhhhhsssssssshhhhhkkgk...',
      '......khhhhhhSSSSSShhhhhhkkgk...',
      '......khhhkkhsssssshkkhhhkpppk..',
      '......khhhwwwwwwwwwwwwhhhkpPpk..',
      '...kkkhhhhwWwwwwwwwwWwhhhhkkk...',
      '..kcccchhhcwwwwwwwwwwchhhcccck..',
      '..kcccchhhcccccccwwWcchhhcccck..',
      '..kcccccccccccccccwWCcccccccck..',
      '..kcCcccccccccccccwwCccccccCck..',
      '..kccCcccccccccccccWwcccccccck..',
      '..kcccccccccccccccccccccccccck..',
    ],
    blink: [
      '...................kkkkuuuUuuuuu',
      '................kkkuuuuuUUuuuuuu',
      '..............kkuuuuuuuUuuuuuuuu',
      '............kkuuuuuppUUuuuuuuuuu',
      '..........kkhuuuuuuuUuuuuuuuuuuu',
      '.........khhUuuUuuUUuUuuUuuUuuUu',
      '........khhhhHHHHHhhrRkRrkkgkkkk',
      '........khhHHHhhhhhhhhrkk.kgk...',
      '.......khhhhhhhhhhhhhhhhk.kgk...',
      '......khhhhhhhhhhhhsshhhhkkgk...',
      '......khhhhhhhhhhhhshhhhhkkgk...',
      '......khhhhhhhsssshhhhhhhkkgk...',
      '......khhhssssssssssshhhhkkgk...',
      '......khhhsssssssssssshhhkkgk...',
      '......khhhsssssssssssshhhkkgk...',
      '......khhhkkkksssskkkkhhhkkgk...',
      '......khhhsbbssssssbbshhhkkgk...',
      '......khhhssssssSssssshhhkkgk...',
      '......khhhsssssSsssssshhhkkgk...',
      '......khhhhsssmssmssshhhhkkgk...',
      '......khhhhssssmmsssshhhhkkgk...',
      '......khhhhhsssssssshhhhhkkgk...',
      '......khhhhhhSSSSSShhhhhhkkgk...',
      '......khhhkkhsssssshkkhhhkpppk..',
      '......khhhwwwwwwwwwwwwhhhkpPpk..',
      '...kkkhhhhwWwwwwwwwwWwhhhhkkk...',
      '..kcccchhhcwwwwwwwwwwchhhcccck..',
      '..kcccchhhcccccccwwWcchhhcccck..',
      '..kcccccccccccccccwWCcccccccck..',
      '..kcCcccccccccccccwwCccccccCck..',
      '..kccCcccccccccccccWwcccccccck..',
      '..kcccccccccccccccccccccccccck..',
    ],
  },
  herald_greta: {
    palette: GRETA_PALETTE,
    eyes: [13, 14, 15],
    expressions: GRETA_EXPRESSIONS,
    idle: [
      '................................',
      '................................',
      '................................',
      '........kk.....kk.....kk........',
      '.......k11kkkkk11kkkkk11k.......',
      '......k1111DDDDDDDDDD1111k......',
      '.....k1111DDDDDDDDDDWW1111k.....',
      '.....k111DDDDDDDDDDDDWDD11k.....',
      '......k11DDDDDDDDDDDDDD11k......',
      '......k111DDDDDDDDDDDD111k......',
      '......k111111111111111111k......',
      '.....k11111111111111111111k.....',
      '.....k11111111111111111111k.....',
      '.....k11111kk111111kk11111k.....',
      '.....k11111eE222222eE11111k.....',
      '.....k11111ee222222ee11111k.....',
      '.....k11111D22222222D11111k.....',
      '......k1W122222NN22222111k......',
      '......k11WW2222kk22222211k......',
      '.......k1bb2222222222bb1k.......',
      '........k1222m2222m2221k........',
      '.........k1222mmmm2221k.........',
      '..........k1222222221k..........',
      '...........kkkk11kkkk...........',
      '........kkkrrrrrrrrrrkkk........',
      '......kkrrrrraaaaaarrrrrkk......',
      '.....krrrrrraaaaaaaarrrrrrk.....',
      '....krrrrraaAaaaaaaaaarrrrrk....',
      '...krrrrrraaaaaaaaaAaarrrrrrk...',
      '..krrrrrrRaaaaaaaaaaaaaRrrrrrk..',
      '..krrrrrraaaaaaaaaaaaaarrrrrrk..',
      '.krrrrrraaaaaaaaaaaaaaaarrrrrrk.',
    ],
    blink: [
      '................................',
      '................................',
      '................................',
      '........kk.....kk.....kk........',
      '.......k11kkkkk11kkkkk11k.......',
      '......k1111DDDDDDDDDD1111k......',
      '.....k1111DDDDDDDDDDWW1111k.....',
      '.....k111DDDDDDDDDDDDWDD11k.....',
      '......k11DDDDDDDDDDDDDD11k......',
      '......k111DDDDDDDDDDDD111k......',
      '......k111111111111111111k......',
      '.....k11111111111111111111k.....',
      '.....k11111111111111111111k.....',
      '.....k11111111111111111111k.....',
      '.....k11111112222221111111k.....',
      '.....k11111kk222222kk11111k.....',
      '.....k11111D22222222D11111k.....',
      '......k1W122222NN22222111k......',
      '......k11WW2222kk22222211k......',
      '.......k1bb2222222222bb1k.......',
      '........k1222m2222m2221k........',
      '.........k1222mmmm2221k.........',
      '..........k1222222221k..........',
      '...........kkkk11kkkk...........',
      '........kkkrrrrrrrrrrkkk........',
      '......kkrrrrraaaaaarrrrrkk......',
      '.....krrrrrraaaaaaaarrrrrrk.....',
      '....krrrrraaAaaaaaaaaarrrrrk....',
      '...krrrrrraaaaaaaaaAaarrrrrrk...',
      '..krrrrrrRaaaaaaaaaaaaaRrrrrrk..',
      '..krrrrrraaaaaaaaaaaaaarrrrrrk..',
      '.krrrrrraaaaaaaaaaaaaaaarrrrrrk.',
    ],
  },
};

// The names of every expression any portrait has, for the Studio's pickers.
export const EXPRESSION_NAMES = [...new Set(Object.values(PORTRAITS).flatMap((art) => Object.keys(art.expressions ?? {})))];

// An expression's face (and blink): the idle (and blink) rows with its changes.
export function expressionRows(art, name) {
  const expression = art.expressions?.[name];
  if (!expression) return { idle: art.idle, blink: art.blink };
  const apply = (rows, patches) => {
    const out = [...rows];
    for (const [row, col, pixels] of patches) out[row] = out[row].slice(0, col) + pixels + out[row].slice(col + pixels.length);
    return out;
  };
  const idle = apply(art.idle, expression.patches);
  if (expression.closed) return { idle, blink: idle };
  // Blinking: the expression everywhere but the eyes, which shut as usual.
  const eyes = new Set(art.eyes ?? []);
  return { idle, blink: apply(art.blink, expression.patches.filter(([row]) => !eyes.has(row))) };
}
