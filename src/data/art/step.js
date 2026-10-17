// The LOOSE STEP: the forty-third step of the Long Stair, knocked loose in the
// rockslide. In battle (16x16) it's a block of weathered stone with a carved
// face, moss on top and stubby stone feet. In a room it lies in the grass
// pretending to be a fallen block (16x28, the size of a low block, `b`), and
// now and then it opens its eyes or glances about, which gives it away.
export const STEP_PALETTE = {
  k: '#120c1c', // outline
  S: '#c8c0b0', // lit edge of the tread
  s: '#a8a092', // stone
  d: '#8a8274', // stone in shadow
  D: '#5a5448', // deep shadow, feet
  c: '#6e675a', // cracks
  g: '#6aa65c', // moss
  G: '#3b6d38', // moss in shadow
  e: '#f2ecff', // eye whites
  p: '#120c1c', // pupils
};

export const STEP_SPRITE = [
  '...gg......gGg..',
  '.kkgGkkkkkkGgkk.',
  'kSSSSSSSSSSSSSSk',
  'kSssssssssssssdk',
  'kssssssssssssddk',
  'kkkkkkkkkkkkkkdk',
  'ksssssssssssssdk',
  'kssepssssssepsdk',
  'ksseessssssseedk',
  'ksssssssssssssdk',
  'kssskkkkkkksssdk',
  'kssskssssssksddk',
  'kdssscsssssdcddk',
  'kddddddcddddddDk',
  '.kkDDkkkkkkDDkk.',
  '..kkk......kkk..',
];

// Lying in wait. The top face and front face match a low stone block outdoors
// (see drawBlock in src/overworld/tileset.js).
const STEP_DISGUISE_TOP = [
  'kkkkkkkkkkkkkkkk',
  'ksssssssssssssSk',
  'ksssssssssssssSk',
  'kssssdssssssssSk',
  'ksssssssssssssSk',
  'ksssssssssssssSk',
  'ksssssssssgsssSk',
  'kssssssssggsssSk',
  'ksssssssssssssSk',
  'ksssssssssssssSk',
  'kssssssssssdssSk',
  'ksssssssssssssSk',
  'ksssssssssssssSk',
  'ksssssssssssssSk',
  'ksssssssssssssSk',
  'kSSSSSSSSSSSSSSk',
];
const face = (eyes, mouth) => [
  'kDDDDDDDDDDDDDDk',
  'kddddDddddddDddk',
  'kDDDDDDDDDDDDDDk',
  eyes[0],
  eyes[1],
  'kDDDDDDDDDDDDDDk',
  'kddDdddddDddddDk',
  mouth,
  'kDDDDDDDDDDDDDDk',
  'kddddDddddDdddDk',
  'kDDDDDDDDDDDDDDk',
  'kkkkkkkkkkkkkkkk',
];

export const STEP_DISGUISE_SPRITES = {
  still: [...STEP_DISGUISE_TOP, ...face(['kddddddddddddddk', 'kDDDDDDDDDDDDDDk'], 'kDDDDDDDDDDDDDDk')],
  // Eyes snap open, glaring.
  glare: [...STEP_DISGUISE_TOP, ...face(['kdddeeddddeedddk', 'kDDDepDDDDepDDDk'], 'kDDDDkkkkkkDDDDk')],
  // A sideways glance.
  glance: [...STEP_DISGUISE_TOP, ...face(['kdddeeddddeedddk', 'kDDDpeDDDDpeDDDk'], 'kDDDDDDDDDDDDDDk')],
};
