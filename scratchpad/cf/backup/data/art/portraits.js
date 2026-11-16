// Face portraits shown in the dialogue box when an NPC talks.
// Keyed by the NPC's id (the `npc` of their prop, and their file in text/npcs/).
// Each has an idle face and a blinking one, 32x32, drawn at 3x.
//
// They can also have `expressions`: other moods, each a few changes to the idle
// face as [row, column, pixels] (so they always match it). `eyes` lists the
// rows of the eyes: blinking shows the blink face there, unless the expression
// is `closed` (its eyes are already shut). Dialogue picks one by starting a
// page with its name in braces: "{sad}I miss them." (see src/ui/textbox.js).
import { BRAMBLE_PORTRAIT } from './bramble.js';
import { CINDER_PORTRAIT } from './hushwood.js';
import { LADLE_PORTRAIT } from './ladle.js';
import { BRYONY_PORTRAIT, THISTLE_PORTRAIT } from './lasthome.js';
import { SLOWLY_PORTRAIT } from './deadcity.js';
import { TUCK_PORTRAIT, RUMBOLD_PORTRAIT, HOBNAIL_PORTRAIT, MARIGOLD_PORTRAIT, GUBB_PORTRAIT } from './belowFolk.js';
import { GORSE_PORTRAIT } from './ashLife.js';
import { HADDOCK_PORTRAIT, HADDOCK_HATLESS_PORTRAIT, ORLA_PORTRAIT, CORRIE_PORTRAIT, TANSY_PORTRAIT, WRASSE_PORTRAIT, CRAB_PORTRAIT, RAT_PORTRAIT, PUFFIN_PORTRAIT } from './coastFolk.js';
import { WY_COOK_PORTRAIT } from './wreckYard.js';

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
  // Each mood changes her eyes (rows 12-16: lid line, eyes, cheeks) and her mouth (rows 19-21),
  // so it reads at a glance in the dialogue box. Happy: eyes crinkled from below, a wide closed smile.
  smile: { patches: [[15, 10, 'skkk'], [15, 18, 'kkks'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'smssssms'], [20, 12, 'ssmmmmss']] },
  // Eyes shut in happy arcs, mouth wide open.
  glee: { closed: true, patches: [[13, 10, 'skks'], [13, 18, 'skks'], [14, 10, 'kssk'], [14, 18, 'kssk'], [15, 10, 'ssss'], [15, 18, 'ssss'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'smmmmmms'], [20, 12, 'smooooms'], [21, 12, 'ssmbbmss']] },
  // Eyes squeezed into > <, a big open laugh, tears of laughter at the corners.
  laughing: { closed: true, patches: [[13, 10, 'kkss'], [13, 18, 'sskk'], [14, 10, 'sskk'], [14, 18, 'kkss'], [15, 10, 'kkss'], [15, 18, 'sskk'], [16, 10, 'tbbs'], [16, 18, 'sbbt'], [19, 12, 'smmmmmms'], [20, 12, 'moooooom'], [21, 12, 'smobboms']] },
  // Lids lowered softly, a gentle smile, blushing.
  tender: { patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'kkkk'], [14, 18, 'kkkk'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'ssssssss'], [20, 12, 'smssssms'], [21, 12, 'ssmmmmss']] },
  // Lids tilted down at the outsides, eyes cast down, a small frown.
  sad: { patches: [[12, 10, 'sskk'], [12, 18, 'kksh'], [13, 10, 'kkss'], [13, 18, 'sskk'], [14, 10, 'seii'], [14, 18, 'eiis'], [19, 12, 'ssssssss'], [21, 12, 'ssmssmss']] },
  // Sad lids, eyes brimming, tears down both cheeks, a wobbling open mouth.
  crying: { patches: [[12, 10, 'sskk'], [12, 18, 'kksh'], [13, 10, 'kkss'], [13, 18, 'sskk'], [14, 10, 'sTTi'], [14, 18, 'TTis'], [16, 10, 'tbbs'], [16, 18, 'sbbt'], [19, 12, 'ssssssss'], [20, 12, 'ssmmmmss'], [21, 12, 'smossoms'], [17, 10, 't'], [18, 10, 't'], [17, 21, 't'], [18, 21, 't']] },
  // Eyes screwed shut, streams of tears, mouth wide.
  sobbing: { closed: true, patches: [[12, 10, 'sskk'], [12, 18, 'kksh'], [13, 10, 'kkss'], [13, 18, 'sskk'], [14, 10, 'ssss'], [14, 18, 'ssss'], [15, 10, 'kkkk'], [15, 18, 'kkkk'], [16, 10, 'tttb'], [16, 18, 'bttt'], [19, 12, 'smmmmmms'], [20, 12, 'moooooom'], [21, 12, 'smmmmmms'], [17, 11, 't'], [18, 11, 't'], [17, 20, 't'], [18, 20, 't'], [19, 11, 't'], [19, 20, 't']] },
  // Sad lids, a grimace, a bead of sweat.
  worried: { patches: [[12, 10, 'sskk'], [12, 18, 'kksh'], [13, 10, 'kkss'], [13, 18, 'sskk'], [15, 10, 'seii'], [15, 18, 'eiis'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'ssssssss'], [20, 12, 'sssmmmss'], [21, 12, 'ssmsssms'], [13, 23, 't'], [14, 23, 't']] },
  // Lids up, whites showing round tiny pupils, mouth a little o.
  surprised: { patches: [[12, 10, 'kkkk'], [12, 18, 'kkkh'], [13, 10, 'sEEE'], [13, 18, 'EEEs'], [14, 10, 'sEeE'], [14, 18, 'EeEs'], [15, 10, 'sEEE'], [15, 18, 'EEEs'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'sssmmsss'], [20, 12, 'ssmoomss'], [21, 12, 'sssmmsss'], [11, 11, 'sss'], [11, 18, 'sss']] },
  // Wide white eyes, a shaking mouth, sweat.
  scared: { patches: [[12, 10, 'kkkk'], [12, 18, 'kkkh'], [13, 10, 'sEEE'], [13, 18, 'EEEs'], [14, 10, 'sEeE'], [14, 18, 'EeEs'], [15, 10, 'sEEE'], [15, 18, 'EEEs'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'ssssssss'], [20, 12, 'smsmmsms'], [21, 12, 'msmssmsm'], [11, 11, 'ssh'], [11, 18, 'hss'], [12, 23, 't'], [13, 23, 't'], [14, 23, 't']] },
  // Lids slanted down hard at the middle, eyes narrowed, mouth set in a line.
  determined: { patches: [[12, 10, 'kkss'], [12, 18, 'sskk'], [13, 10, 'skkk'], [13, 18, 'kkks'], [14, 10, 'sskE'], [14, 18, 'Ekss'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'ssssssss'], [20, 12, 'smmmmmms']] },
  // A lighter slant and a set mouth with one corner tucked up: here we go.
  resolute: { patches: [[12, 10, 'ksss'], [12, 18, 'sssk'], [13, 10, 'skkk'], [13, 18, 'kkks'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'sssssssm'], [20, 12, 'ssmmmmms']] },
  // Hard slant, narrowed eyes, a scowl, red cheeks.
  angry: { patches: [[12, 10, 'kkss'], [12, 18, 'sskk'], [13, 10, 'skkk'], [13, 18, 'kkks'], [14, 10, 'sskE'], [14, 18, 'Ekss'], [19, 12, 'ssssssss'], [20, 12, 'smmmmmms'], [21, 12, 'msssssms']] },
  // Hard slant, tiny pupils, teeth bared.
  furious: { patches: [[12, 10, 'kkss'], [12, 18, 'sskk'], [13, 10, 'skkk'], [13, 18, 'kkks'], [14, 10, 'ssEk'], [14, 18, 'kEss'], [15, 10, 'sEeE'], [15, 18, 'EeEs'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'mmmmmmmm'], [20, 12, 'mEEEEEEm'], [21, 12, 'smmmmmms']] },
  // Eyes closed, mouth soft.
  praying: { closed: true, patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'ssss'], [14, 18, 'ssss'], [15, 10, 'kkkk'], [15, 18, 'kkkk'], [19, 12, 'ssssssss']] },
  // Dry and unimpressed: both lids half down, eyes slid sideways, a flat mouth pushed to one side.
  bored: { patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'kkkk'], [14, 18, 'kkkk'], [15, 10, 'ssei'], [15, 18, 'seis'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'ssssssss'], [20, 12, 'sssmmmms']] },
  // Eyes glancing down and away, a big blush, a tiny mouth, a drop of sweat.
  shy: { patches: [[14, 10, 'ssei'], [14, 18, 'seis'], [15, 10, 'ssiI'], [15, 18, 'siIs'], [16, 10, 'bbbb'], [16, 18, 'bbbb'], [19, 12, 'ssssssss'], [20, 12, 'ssssmmss'], [17, 10, 'bb'], [17, 20, 'bb'], [12, 23, 't']] },
  // One brow and eye raised looking up, the other narrowed, a small "hmm" mouth off to the side.
  thoughtful: { patches: [[12, 18, 'kkkh'], [13, 10, 'ssss'], [13, 18, 'eEis'], [14, 10, 'kkkk'], [14, 18, 'eiIs'], [15, 10, 'seEi'], [15, 18, 'ssss'], [16, 10, 'ssss'], [16, 18, 'ssss'], [19, 12, 'ssssssss'], [20, 12, 'sssssmms']] },
  // Smug, never gushing: eyes shut pleased, cheeks pink, a closed smirk that climbs on one side. ({proud} is written all through her lines.)
  proud: { closed: true, patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'kkkk'], [14, 18, 'kkkk'], [15, 10, 'ksss'], [15, 18, 'sssk'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'ssssssms'], [20, 12, 'smmmmmss']] },
  // Brows lifted, eyes big and sparkling, a soft smile.
  hopeful: { patches: [[12, 10, 'shhs'], [12, 18, 'shhs'], [14, 10, 'sEEi'], [14, 18, 'EEis'], [15, 10, 'seiE'], [15, 18, 'eiEs'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'ssssssss'], [20, 12, 'smssssms'], [21, 12, 'ssmmmmss'], [11, 11, 'sss'], [11, 18, 'sss']] },
  // Heavy lids, shadows under the eyes, mouth hanging open, sweat.
  exhausted: { patches: [[13, 10, 'ssss'], [13, 18, 'ssss'], [14, 10, 'kkkk'], [14, 18, 'kkkk'], [16, 10, 'SSSs'], [16, 18, 'sSSS'], [19, 12, 'ssssssss'], [20, 12, 'ssmmmsss'], [21, 12, 'ssmssmss'], [13, 23, 't'], [14, 23, 't']] },
  // Eyes squeezed shut against the wind, teeth chattering, red nose.
  cold: { closed: true, patches: [[13, 10, 'kkss'], [13, 18, 'sskk'], [14, 10, 'sskk'], [14, 18, 'kkss'], [15, 10, 'kkss'], [15, 18, 'sskk'], [16, 10, 'bbbs'], [16, 18, 'sbbb'], [19, 12, 'ssssssss'], [20, 12, 'smEEEEms'], [21, 12, 'ssmmmmss'], [17, 16, 'b'], [18, 15, 'bb']] },
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
  // Ves without her umbrella (lost in the Lantern Marsh, chapter 3): the same
  // face and moods, her hair and coral bow showing instead.
  vesper_bare: {
    palette: VES_PALETTE,
    eyes: [13, 14, 15],
    expressions: VES_EXPRESSIONS,
    idle: [
      '................................',
      '...........kkkkkkkkkk...........',
      '.........kkhhhhhhhhhhkk.........',
      '........khhhhHHHHHhhhhhk........',
      '.......khhhHHHhhhhHHhhhhkkk.kk..',
      '.......khhhhhhhhhhhhhhhkrrRkRrk.',
      '.......khhhhhhhhhhhhhhhkrRRkRRk.',
      '......khhhhhhhhhhhhhhhhhkkkrk.k.',
      '......khhhhhhhhhhhhhhhhhhk.krk..',
      '......khhhhhhhhhhhhsshhhhk......',
      '......khhhhhhhhhhhhshhhhhk......',
      '......khhhhhhhsssshhhhhhhk......',
      '......khhhssssssssssshhhhk......',
      '......khhhkkkksssskkkkhhhk......',
      '......khhhseEisssseEishhhk......',
      '......khhhseiIsssseiIshhhk......',
      '......khhhsbbssssssbbshhhk......',
      '......khhhssssssSssssshhhk......',
      '......khhhsssssSsssssshhhk......',
      '......khhhhsssmssmssshhhhk......',
      '......khhhhssssmmsssshhhhk......',
      '......khhhhhsssssssshhhhhk......',
      '......khhhhhhSSSSSShhhhhhk......',
      '......khhhkkhsssssshkkhhhk......',
      '......khhhwwwwwwwwwwwwhhhk......',
      '...kkkhhhhwWwwwwwwwwWwhhhhkkk...',
      '..kcccchhhcwwwwwwwwwwchhhcccck..',
      '..kcccchhhcccccccwwWcchhhcccck..',
      '..kcccccccccccccccwWCcccccccck..',
      '..kcCcccccccccccccwwCccccccCck..',
      '..kccCcccccccccccccWwcccccccck..',
      '..kcccccccccccccccccccccccccck..',
    ],
    blink: [
      '................................',
      '...........kkkkkkkkkk...........',
      '.........kkhhhhhhhhhhkk.........',
      '........khhhhHHHHHhhhhhk........',
      '.......khhhHHHhhhhHHhhhhkkk.kk..',
      '.......khhhhhhhhhhhhhhhkrrRkRrk.',
      '.......khhhhhhhhhhhhhhhkrRRkRRk.',
      '......khhhhhhhhhhhhhhhhhkkkrk.k.',
      '......khhhhhhhhhhhhhhhhhhk.krk..',
      '......khhhhhhhhhhhhsshhhhk......',
      '......khhhhhhhhhhhhshhhhhk......',
      '......khhhhhhhsssshhhhhhhk......',
      '......khhhssssssssssshhhhk......',
      '......khhhsssssssssssshhhk......',
      '......khhhsssssssssssshhhk......',
      '......khhhkkkksssskkkkhhhk......',
      '......khhhsbbssssssbbshhhk......',
      '......khhhssssssSssssshhhk......',
      '......khhhsssssSsssssshhhk......',
      '......khhhhsssmssmssshhhhk......',
      '......khhhhssssmmsssshhhhk......',
      '......khhhhhsssssssshhhhhk......',
      '......khhhhhhSSSSSShhhhhhk......',
      '......khhhkkhsssssshkkhhhk......',
      '......khhhwwwwwwwwwwwwhhhk......',
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
  // Bramble, the woodcutters' kid (src/data/art/bramble.js).
  bramble: BRAMBLE_PORTRAIT,
  // Nan Cinder, the charcoal burner (src/data/art/hushwood.js).
  nan_cinder: CINDER_PORTRAIT,
  // Old Ladle, the cistern's hob in the Old Drains (src/data/art/ladle.js).
  ladle: LADLE_PORTRAIT,
  // Bryony, Lasthome's healer, and Thistle, who keeps its gate (src/data/art/lasthome.js).
  bryony: BRYONY_PORTRAIT,
  thistle: THISTLE_PORTRAIT,
  // Slowly, the old tortoise of the Dead City's bathhouse (src/data/art/deadcity.js).
  slowly: SLOWLY_PORTRAIT,
  // The Below Folk (Chapter 4: src/data/art/belowFolk.js): Tuck the page, King Peptup,
  // Hobnail the smith, Marigold the hare and Ferryman Gubb.
  tuck: TUCK_PORTRAIT,
  rumbold: RUMBOLD_PORTRAIT,
  hobnail: HOBNAIL_PORTRAIT,
  marigold: MARIGOLD_PORTRAIT,
  gubb: GUBB_PORTRAIT,
  // The Coast Folk (Chapter 5: src/data/art/coastFolk.js): Haddock the lightman, Orla
  // the smith, Corrie, Mrs. Tansy, Mrs. Wrasse, the Cockle Stall's crab, the Drowned
  // Rat's innkeeper and the harbour clerk.
  haddock: HADDOCK_PORTRAIT,
  // The same face for Haddock's other places (one NPC id per room, so each room has its own words).
  haddock_house: HADDOCK_PORTRAIT,
  haddock_cove: HADDOCK_PORTRAIT,
  haddock_jetty: HADDOCK_PORTRAIT,
  haddock_wrack: HADDOCK_PORTRAIT,
  haddock_wreck: HADDOCK_PORTRAIT,
  haddock_inn: HADDOCK_PORTRAIT,
  haddock_lagoon: HADDOCK_PORTRAIT,
  haddock_lookout: HADDOCK_PORTRAIT,
  haddock_reach: HADDOCK_PORTRAIT,
  haddock_reach_foot: HADDOCK_PORTRAIT,
  haddock_light: HADDOCK_PORTRAIT,
  // Hat gone and soaked, at the crank.
  haddock_hatless: HADDOCK_HATLESS_PORTRAIT,
  orla: ORLA_PORTRAIT,
  corrie: CORRIE_PORTRAIT,
  tansy: TANSY_PORTRAIT,
  wrasse: WRASSE_PORTRAIT,
  cockle: CRAB_PORTRAIT,
  rat_innkeeper: RAT_PORTRAIT,
  harbour_clerk: PUFFIN_PORTRAIT,
  // Gorse, the scavenger from Hearth (src/data/art/ashLife.js).
  gorse: GORSE_PORTRAIT,
  // The ghost cook in the Wreck Yard's galley (src/data/art/wreckYard.js).
  ghost_cook: WY_COOK_PORTRAIT,
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
