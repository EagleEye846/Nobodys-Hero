// The FROSTBITE, 20x16: a snowdrift that got up and walked. A hump of snow
// with two round blue eyes, stubby arms held out for a hug, and a wide grin
// of icicles. In a room it lies low as a heap of snow (18x12) until you come
// close; now and then its eyes open, or the grin shows.
export const FROSTBITE_PALETTE = {
  k: '#3a4a6a', // outline (dark blue, so the snow reads against snow)
  w: '#f4f8fc', // snow
  W: '#d4e0ee', // snow in shadow
  S: '#aebfd8', // deep shadow
  e: '#4fa8e8', // eyes
  E: '#bfe6ff', // the glint in them
  m: '#2a3450', // inside the grin
  i: '#bfe6ff', // icicle teeth
  I: '#e8f6ff', // icicles, catching the light
};

export const FROSTBITE_SPRITE = [
  '.......kkkkkk.......',
  '.....kkwwwwwwkk.....',
  '....kwwwwwwwwwwk....',
  '...kwwwwwwwwwwwWk...',
  '..kwwkkwwwwwwkkwWk..',
  '..kwkeekwwwwkeekWk..',
  '.kwwkEekwwwwkEekWWk.',
  '.kwwwkkwwwwwwkkwWWk.',
  '.kwwwwkkkkkkkkwwWWk.',
  'kwkwwkIiIiIiIikwWkWk',
  'kwwkwwkiImiImikWkWWk',
  '.kwwkwwkmimmikwkWWk.',
  '..kwwwwwkkkkkwwWWSk.',
  '.kwwwwwwwwwwwWWWSSSk',
  'kwwWwwwWwwwWWWSWSSSk',
  '.kkkkkkkkkkkkkkkkkk.',
];

// Lying low as a heap of snow.
const heap = (eyes, mouth) => [
  '..................',
  '......kkkkkk......',
  '....kkwwwwwWkk....',
  '...kwwwwwwwwWWk...',
  '..kwwwwwwwwwWWWk..',
  eyes,
  '.kwwwwwwwwwwWWWSk.',
  mouth,
  'kwwwwwwwwwwWWWSSSk',
  'kwwWwwwwwwWWWSWSSk',
  'kwwwwwWwwwwWWSSSSk',
  '.kkkkkkkkkkkkkkkk.',
];

export const FROSTBITE_DISGUISE_SPRITES = {
  still: heap('..kwwwwwwwwwWWWWk.', 'kwwwwwwwwwwWWWWSSk'),
  // Two blue eyes open in the snow.
  look: heap('..kwwekwwwekWWWWk.', 'kwwwwwwwwwwWWWWSSk'),
  // A grin of icicles.
  grin: heap('..kwwekwwwekWWWWk.', 'kwwwmimimimWWWWSSk'),
};
