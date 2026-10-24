// The SAPLING, 16x20: a young tree spirit, not much taller than you. A thin
// trunk with a face in the bark (two hollow knots that glow when it looks at
// you), two twiggy arms, a crown of scarlet leaves, and roots for feet. In a
// room it stands among the trees with its eyes shut, a tree like any other,
// and only moves when nobody's looking.
export const SAPLING_PALETTE = {
  k: '#1c1008', // outline
  b: '#7a5436', // bark
  B: '#4e321e', // bark in shadow
  l: '#d8402a', // leaves
  L: '#962418', // leaves in shadow
  g: '#ff8a5a', // leaves, catching the light
  e: '#120a06', // its hollow eyes
  y: '#ffd25e', // the glow in them
};

// The crown, the same in every pose.
const CROWN = [
  '.....kkkkk......',
  '...kklglllkk....',
  '..klglllllLLk...',
  '.klgllllLlllLk..',
  '.kllllLlllLLLk..',
  'klglllllLlllLLk.',
  'klllLllllllLLLk.',
  '.kLlllLLlllLLk..',
  '..kkLLkbbkLLkk..',
];
// Its legs: roots, curled where they meet the ground.
const ROOTS = [
  '.....kbbBk......',
  '....kbbkBBk.....',
  '..kkbBk.kBBkk...',
  '.kBBkk...kkBBk..',
  '.kk.........kk..',
];

// `eyes` and `mouth` are the two rows of its face; `arms` up (awake) or down.
const sapling = (eyes, mouth, arms = 'up') => [
  ...CROWN,
  arms === 'up' ? 'kk...kbbBk...kk.' : '.....kbbBk......',
  arms === 'up' ? '.kk..kbbBk..kk..' : '.....kbbBk......',
  arms === 'up' ? '..kkkbbbBBkkk...' : '....kbbbBBk.....',
  eyes,
  mouth,
  arms === 'up' ? '....kbbbbBBk....' : '..kkkbbbbBBkk...',
  ...ROOTS,
];

export const SAPLING_SPRITE = sapling('....kbyebyBk....', '....kbbeeBBk....');

// Standing in the trees, pretending: eyes shut, then (now and then) one eye
// opens a crack, or its arms twitch.
export const SAPLING_DISGUISE_SPRITES = {
  still: sapling('....kbBbbBBk....', '....kbbbbBBk....', 'down'),
  peek: sapling('....kbBbyeBk....', '....kbbbbBBk....', 'down'),
  twitch: sapling('....kbBbbBBk....', '....kbbbbBBk....'),
};
