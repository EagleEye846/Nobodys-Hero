// The KNOTLING, 20x20: a cross old stump, sawn off flat long ago, with its
// rings showing on top and one stubborn red-leafed shoot trying to grow back
// out of the rim. Its face is in the big knot-hole in its front: two glowing
// eyes, slanted down in the middle because it's always cross, and a frown
// cracked into the bark underneath. Moss round its bottom, and four stubby
// roots for feet.
export const KNOTLING_PALETTE = {
  k: '#1a0e06', // outline
  b: '#6a4a30', // bark
  B: '#3e2a1a', // the grooves in the bark
  r: '#d8b07a', // the sawn top
  R: '#a87a48', // its rings
  h: '#120806', // inside the knot-hole
  y: '#ffcf5a', // the glow of its eyes
  m: '#5e7a3a', // moss
  l: '#d8402a', // the shoot's leaves
  g: '#ff8a5a', // the shoot's leaves, catching the light
};

// The sawn top and the shoot growing out of it, the same in every pose.
const TOP = [
  '............lgl.....',
  '.............k......',
  '....kkkkkkkkkkkk....',
  '..kkrrrrrrrrrrrrkk..',
  '.krrRRRRRRRRRRRRrrk.',
  '.krRrrrrrRRrrrrrRrk.',
  '.krrRRRRRRRRRRRRrrk.',
  '.kbbkkrrrrrrrrkkbbk.',
  '.kbBbbkkkkkkkkbbBbk.',
];
// Its mossy bottom and its roots.
const ROOTS = [
  '.kmBbbbbbbbbbbbBbmk.',
  'kmmmbBbbbbbbbbBbmmmk',
  'kbbkkbBkkkkkkkBbkkbk',
  'kk..kbk......kbk..kk',
  '....kk........kk....',
];

// `eyes` are the two rows inside the knot-hole; `mouth` the two rows of the
// crack below it.
const knotling = (eyes, mouth) => [
  ...TOP,
  '.kbBbkkhhhhhhkkbBbk.',
  eyes[0],
  eyes[1],
  '.kbBbbkkhhhhkkbbBbk.',
  mouth[0],
  mouth[1],
  ...ROOTS,
];

const CROSS = ['.kbBkhyhhhhhhyhkBbk.', '.kbBkhyyhhhhyyhkBbk.'];
const SHUT = ['.kbBkhhhhhhhhhhkBbk.', '.kbBkhkkhhhhkkhkBbk.'];
const FROWN = ['.kbBbbbkkkkkkbbbBbk.', '.kbBbbkbbbbbbkbbBbk.'];
const FLAT = ['.kbBbbbbbbbbbbbbBbk.', '.kbBbbbkkkkkkbbbBbk.'];

export const KNOTLING_SPRITE = knotling(CROSS, FROWN);

// Out in a room it can pass for an ordinary stump: eyes shut, frown smoothed
// over. Now and then one eye glares out, or the frown comes back.
export const KNOTLING_DISGUISE_SPRITES = {
  still: knotling(SHUT, FLAT),
  glare: knotling(['.kbBkhhhhhhhhyhkBbk.', '.kbBkhkkhhhhyyhkBbk.'], FLAT),
  grumble: knotling(SHUT, FROWN),
};
