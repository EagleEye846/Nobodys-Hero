// The FROZEN STEP: the Loose Step's brother, the top step of the Long Stair,
// frozen into a block of ice while it waited. In battle (16x16) it's the
// same weathered stone block with a carved face, but glazed in ice, with
// snow piled on top instead of moss and icicles hanging off its chin. In a
// room it sits in the snow pretending to be a snow-topped block (16x28, the
// size of a low block, `b`, up the mountain), and now and then it opens its
// eyes or glances about.
export const ICE_STEP_PALETTE = {
  k: '#120c1c', // outline
  w: '#f4f8fc', // snow on top
  W: '#d2dceb', // snow in shadow
  S: '#c8d8e8', // lit edge of the tread, iced over
  s: '#a8b4c0', // stone under ice
  d: '#8494a6', // stone in shadow
  D: '#5a6478', // deep shadow, feet
  c: '#6e7a8c', // cracks
  i: '#bfe6ff', // ice
  I: '#7fb6dc', // ice in shadow
  e: '#e8f6ff', // eye whites
  p: '#2a5a8a', // pupils, gone blue with cold
};

export const ICE_STEP_SPRITE = [
  '..wwww....wwwww.',
  '.kwwwWkkkkwwWwkk',
  'kSSSSSSSSSSSSSSk',
  'kSissssssssssidk',
  'kssssssssssssddk',
  'kkkkkkkkkkkkkkdk',
  'ksisssssssssssdk',
  'kssepssssssepsdk',
  'ksseessssssseedk',
  'kssssssssssssidk',
  'kssskkkkkkksssdk',
  'kssskiiiiiksddik',
  'kdisscsssssdcddk',
  'kddddddcddddddDk',
  '.kkDDkiIkiIDDkk.',
  '..kkk..i..i.kkk.',
];

// Lying in wait as a snow-topped block. The top face and front face match a
// low block in the snow (see drawBlock in src/overworld/tileset.js).
const ICE_STEP_DISGUISE_TOP = [
  'kkkkkkkkkkkkkkkk',
  'kwwwwwwwwwwwwwWk',
  'kWwwwwwwwwwwwwWk',
  'kwwwwWwwwwwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwwwWwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwWwwwwwwwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwWwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwwwwwwWk',
  'kwwwwwwwwwwwwwwk',
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
  'kDiDDDDDiDDDDiDk',
  'kkikkkkkkkkkkikk',
];

export const ICE_STEP_DISGUISE_SPRITES = {
  still: [...ICE_STEP_DISGUISE_TOP, ...face(['kddddddddddddddk', 'kDDDDDDDDDDDDDDk'], 'kDDDDDDDDDDDDDDk')],
  // Eyes snap open, glaring.
  glare: [...ICE_STEP_DISGUISE_TOP, ...face(['kdddeeddddeedddk', 'kDDDepDDDDepDDDk'], 'kDDDDkkkkkkDDDDk')],
  // A sideways glance.
  glance: [...ICE_STEP_DISGUISE_TOP, ...face(['kdddeeddddeedddk', 'kDDDpeDDDDpeDDDk'], 'kDDDDDDDDDDDDDDk')],
};
