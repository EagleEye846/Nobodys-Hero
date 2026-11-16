// The RINGER, 17x22: a living iron climbing ring, still on the peg it was
// hammered in with, glaring out of the top of its band with a scowl along the
// bottom and a frayed end of somebody's rope still knotted round it. In a
// room it hangs on the rock like any other grapple ring (16x16, matching
// `grapple_ring` in props.js) until you come close.
export const RINGER_PALETTE = {
  k: '#120c1c', // outline
  L: '#d0c8e0', // iron, catching the light
  M: '#8a8296', // iron
  O: '#5a5468', // iron in shadow
  r: '#a8603a', // rust
  y: '#ffd25e', // eyes
  p: '#120c1c', // pupils
  R: '#c8a06a', // rope
  Y: '#8a6a3a', // rope in shadow
};

export const RINGER_SPRITE = [
  '.......kkk.......',
  '......kLMOk......',
  '.......kMk.......',
  '.......kMk.......',
  '......kkkkk......',
  '....kkLLLLMkk....',
  '...kLkkLLLkkMk...',
  '..kLLyyLLMyyMMk..',
  '.kLLLpykkkpyMMMk.',
  '.kLLLkk...kkMMOk.',
  'kLLLLk.....kOOOOk',
  'kLLLk.......kRRRk',
  'kLLLk.......RYYRk',
  'kLLMk.......kRRRk',
  'kMMMMk.....kOOrOk',
  '.kMMMkk...kkOOOk.',
  '.kMrMMMkkkMMOOOk.',
  '..kMMMkkkkkMOOk..',
  '...kMkMMMMMkOk...',
  '....kkOOrOOkkR...',
  '......kkkkk..RY..',
  '..............R..',
];

// Hanging on the rock like the grapple rings round it. Now and then it opens
// an eye, or twitches.
const ring = (eyes) => [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.......kk.......',
  '......kMMk......',
  '......kOMk......',
  '.....kkOOkk.....',
  eyes[0],
  eyes[1],
  '...kOk....kOk...',
  '....kOkkkkOk....',
  '.....kkOOkk.....',
];

export const RINGER_DISGUISE_SPRITES = {
  still: ring(['....kMkkkkMk....', '...kMk....kMk...']),
  // An eye opens in the band, and looks at you.
  peek: ring(['....kykkkkMk....', '...kpk....kMk...']),
  // It can't help twitching.
  twitch: ring(['....kMkkkkMk....', '...kMk....kMk...']).map((row, i) => (i > 10 ? `.${row.slice(0, -1)}` : row)),
};
