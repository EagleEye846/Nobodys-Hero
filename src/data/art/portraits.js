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
  k: '#120c1c', // outline
  u: '#7a3a6e', // umbrella
  U: '#552650', // umbrella ribs and shade
  p: '#d0a050', // the patch on it, and her mittens
  P: '#a87a34', // mitten, in shadow
  g: '#5a3e2e', // umbrella shaft
  h: '#2e2244', // hair
  H: '#4e4072', // hair, catching the light
  n: '#ffffff', // a snowflake in her hair
  s: '#f4d6bc', // skin
  S: '#d8aa92', // skin in shadow
  e: '#2a2040', // eyes
  E: '#ffffff', // eye shine
  i: '#6f9fdc', // irises, winter blue
  b: '#f0a0a8', // blush
  m: '#8a4a5a', // mouth
  o: '#4a2a3a', // open mouth
  t: '#8fd0ff', // tears
  c: '#3e4c80', // coat, evening blue
  C: '#2a3462', // coat folds
  w: '#ece4f4', // scarf
  W: '#b8b0d4', // scarf folds
};
// Ves's face, under her umbrella. Her eyes and mouth do the talking; her
// brows (none at rest) come out for the big feelings.
const VES_EXPRESSIONS = {
  glee: { closed: true, patches: [[15, 9, 'ssss'], [15, 19, 'ssss'], [16, 9, 'skks'], [16, 19, 'skks'], [17, 9, 'kssk'], [17, 19, 'kssk'], [20, 12, 'smmmms'], [21, 12, 'smooms']] },
  laughing: { closed: true, patches: [[15, 9, 'ssss'], [15, 19, 'ssss'], [16, 9, 'skks'], [16, 19, 'skks'], [17, 9, 'kssk'], [17, 19, 'kssk'], [20, 12, 'mmmmmm'], [21, 12, 'moooom'], [18, 8, 'bbbb'], [18, 20, 'bbbb']] },
  sad: { patches: [[13, 11, 'hh'], [14, 9, 'hh'], [13, 19, 'hh'], [14, 21, 'hh'], [16, 9, 'eeie'], [16, 19, 'eeie'], [20, 12, 'ssmmss'], [21, 12, 'smssms']] },
  crying: { patches: [[13, 11, 'hh'], [14, 9, 'hh'], [13, 19, 'hh'], [14, 21, 'hh'], [16, 9, 'eeie'], [16, 19, 'eeie'], [18, 9, 't'], [19, 9, 't'], [18, 22, 't'], [19, 22, 't'], [22, 9, 't'], [20, 12, 'smmmms'], [21, 12, 'smooms']] },
  worried: { patches: [[13, 11, 'hh'], [14, 9, 'hh'], [13, 19, 'hh'], [14, 21, 'hh'], [20, 12, 'ssssss'], [21, 12, 'smsmms']] },
  surprised: { patches: [[14, 9, 'kkkk'], [14, 19, 'kkkk'], [15, 9, 'eEie'], [15, 19, 'eEie'], [16, 9, 'eiie'], [16, 19, 'eiie'], [17, 9, 'eiie'], [17, 19, 'eiie'], [20, 12, 'ssmmss'], [21, 12, 'ssooss']] },
  scared: { patches: [[14, 9, 'kkkk'], [14, 19, 'kkkk'], [15, 9, 'eEie'], [15, 19, 'eEie'], [16, 9, 'eiie'], [16, 19, 'eiie'], [17, 9, 'eiie'], [17, 19, 'eiie'], [13, 11, 'hh'], [13, 19, 'hh'], [20, 12, 'ssssss'], [21, 12, 'msmsms']] },
  determined: { patches: [[13, 9, 'hh'], [14, 11, 'hh'], [13, 21, 'hh'], [14, 19, 'hh'], [20, 12, 'ssssss'], [21, 12, 'smmmms']] },
  angry: { patches: [[13, 9, 'hh'], [14, 11, 'hh'], [13, 21, 'hh'], [14, 19, 'hh'], [15, 9, 'kkkk'], [15, 19, 'kkkk'], [16, 9, 'keik'], [16, 19, 'keik'], [17, 9, 'eiie'], [17, 19, 'eiie'], [18, 8, 'bbbb'], [18, 20, 'bbbb'], [20, 12, 'smmmms'], [21, 12, 'mssssm']] },
  praying: { closed: true, patches: [[15, 9, 'ssss'], [15, 19, 'ssss'], [16, 9, 'ssss'], [16, 19, 'ssss'], [17, 9, 'kkkk'], [17, 19, 'kkkk'], [20, 12, 'ssssss'], [21, 12, 'ssmmss']] },
  shy: { patches: [[16, 9, 'eeEi'], [16, 19, 'eeEi'], [17, 9, 'eeii'], [17, 19, 'eeii'], [18, 8, 'bbbb'], [18, 20, 'bbbb'], [20, 12, 'ssssss'], [21, 12, 'ssmmss']] },
  thoughtful: { patches: [[16, 9, 'eeEi'], [16, 19, 'eeEi'], [17, 9, 'eeii'], [17, 19, 'eeii'], [20, 12, 'ssssss'], [21, 12, 'sssmms']] },
  hopeful: { patches: [[13, 9, 'hhhh'], [13, 19, 'hhhh'], [16, 9, 'eEEe'], [16, 19, 'eEEe'], [20, 12, 'smssms'], [21, 12, 'ssmmss']] },
  exhausted: { patches: [[15, 9, 'ssss'], [15, 19, 'ssss'], [16, 9, 'kkkk'], [16, 19, 'kkkk'], [17, 9, 'eiie'], [17, 19, 'eiie'], [20, 12, 'ssssss'], [21, 12, 'smmmms']] },
  cold: { closed: true, patches: [[15, 9, 'ssss'], [15, 19, 'ssss'], [16, 9, 'kssk'], [16, 19, 'kssk'], [17, 9, 'skks'], [17, 19, 'skks'], [18, 8, 'bbbb'], [18, 20, 'bbbb'], [19, 15, 'bb'], [20, 12, 'ssssss'], [21, 12, 'msmsms']] },
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
    eyes: [15, 16, 17],
    expressions: VES_EXPRESSIONS,
    idle: [
      '........................kk......',
      '...............kkkkkkkkkuukkkkkk',
      '.............kkuuuuuuUuuuuuuUuuu',
      '...........kkppuuuuuUuuuuuuuuUuu',
      '..........kuuppuuuUuuuuuuuuuuuuU',
      '..........kuuuuuUUuuuuuuuuuuuuuu',
      '..........kUUkUUUkUUUkUUUkUUUkUU',
      '..........kkkkkkkkkkkk......g...',
      '.........khhhHHhhhhhhhk.....g...',
      '........khhhHHhhhhhhhhhk....g...',
      '.......khhhHhhhhhhhhhhhhk...g...',
      '......khhhhhhhhhhhhhhnhhhk..g...',
      '.....khhhhsshhhhhhhhsshhhhk.g...',
      '.....khhsssssshhhhsssssshhk.g...',
      '.....khsssssssssssssssssshk.g...',
      '.....khsskkkksssssskkkksshk.g...',
      '.....khsseEiesssssseEiesshk.g...',
      '.....khsseiiesssssseiiesshk.g...',
      '.....khsbbsssssssssssssbbhk.g...',
      '.....khsssssssssssssssssshk.g...',
      '.....khsssssssmssmssssssshk.g...',
      '.....khssssssssmmsssssssshk.g...',
      '.....khhSssssssssssssssShhk.g...',
      '.....khhkSssssssssssssSkhhkkpk..',
      '.....khhhkkkkSSSSSSkkkkhhhkpppk.',
      '....kchhhkwwwwwWwwwwwwkhhhkpPpk.',
      '...kccchhkwwwwwWWwwwwwkhhcckkk..',
      '..kcccccckwwwwwWWwwwwwkcccccck..',
      '.kccccccCckwwWwwwwWwwkcCccccccck',
      '.kcccccccCCkwwwWwwwwkCCcccccccck',
      'kccccccccCCCkwwWwwwkCCCcccccccck',
      'cccccccccCCCkwwwwwkCCCcccccccccc',
    ],
    blink: [
      '........................kk......',
      '...............kkkkkkkkkuukkkkkk',
      '.............kkuuuuuuUuuuuuuUuuu',
      '...........kkppuuuuuUuuuuuuuuUuu',
      '..........kuuppuuuUuuuuuuuuuuuuU',
      '..........kuuuuuUUuuuuuuuuuuuuuu',
      '..........kUUkUUUkUUUkUUUkUUUkUU',
      '..........kkkkkkkkkkkk......g...',
      '.........khhhHHhhhhhhhk.....g...',
      '........khhhHHhhhhhhhhhk....g...',
      '.......khhhHhhhhhhhhhhhhk...g...',
      '......khhhhhhhhhhhhhhnhhhk..g...',
      '.....khhhhsshhhhhhhhsshhhhk.g...',
      '.....khhsssssshhhhsssssshhk.g...',
      '.....khsssssssssssssssssshk.g...',
      '.....khsssssssssssssssssshk.g...',
      '.....khsskkkksssssskkkksshk.g...',
      '.....khsssssssssssssssssshk.g...',
      '.....khsbbsssssssssssssbbhk.g...',
      '.....khsssssssssssssssssshk.g...',
      '.....khsssssssmssmssssssshk.g...',
      '.....khssssssssmmsssssssshk.g...',
      '.....khhSssssssssssssssShhk.g...',
      '.....khhkSssssssssssssSkhhkkpk..',
      '.....khhhkkkkSSSSSSkkkkhhhkpppk.',
      '....kchhhkwwwwwWwwwwwwkhhhkpPpk.',
      '...kccchhkwwwwwWWwwwwwkhhcckkk..',
      '..kcccccckwwwwwWWwwwwwkcccccck..',
      '.kccccccCckwwWwwwwWwwkcCccccccck',
      '.kcccccccCCkwwwWwwwwkCCcccccccck',
      'kccccccccCCCkwwWwwwkCCCcccccccck',
      'cccccccccCCCkwwwwwkCCCcccccccccc',
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
