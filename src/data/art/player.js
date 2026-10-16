// Placeholder player art, 12x18. Swap for a sprite sheet in assets/sprites/ later.
export const PLAYER_PALETTE = {
  k: '#120c1c', // outline
  h: '#5b3a29', // hair
  s: '#f1c49a', // skin
  e: '#1b1428', // eyes
  f: '#e8743b', // scarf
  c: '#3e7bd6', // shirt
  p: '#2b2f4a', // pants
  b: '#6b3f2a', // shoes
};

const HEAD_DOWN = [
  '...kkkkkk...',
  '..khhhhhhk..',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.khsshhsshk.',
  '.kssssssssk.',
  '.ksessssesk.',
  '.kssssssssk.',
  '..kssssssk..',
];

const HEAD_UP = [
  '...kkkkkk...',
  '..khhhhhhk..',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.kshhhhhhsk.',
  '..kssssssk..',
];

const HEAD_LEFT = [
  '...kkkkkk...',
  '..khhhhhhk..',
  '.khhhhhhhhk.',
  '.khhhhhhhhk.',
  '.kshhhhhhhk.',
  '.ksshhhhhhk.',
  '.ksesshhhhk.',
  '.kssssshhhk.',
  '..ksssssk...',
];

const BODY_FRONT = [
  '..kffffffk..',
  '.kcffffffck.',
  'kcccccccccck',
  'kcccccccccck',
  'ksccccccccsk',
  '.kcccccccck.',
];

const BODY_LEFT = [
  '..kffffffk..',
  '..kccccfffk.',
  '..kccccccck.',
  '..kcccsccck.',
  '..kcccsccck.',
  '..kccccccck.',
];

const LEGS_FRONT_IDLE = [
  '.kppppppppk.',
  '.kppk..kppk.',
  '.kbbk..kbbk.',
];

const LEGS_FRONT_STEP = [
  '.kppppppppk.',
  '.kbbk..kppk.',
  '.......kbbk.',
];

const LEGS_LEFT_IDLE = [
  '..kpppppppk.',
  '...kppkppk..',
  '...kbbkbbk..',
];

const LEGS_LEFT_STEP = [
  '..kpppppppk.',
  '..kppk.kppk.',
  '.kbbk...kbbk',
];

export const PLAYER_SPRITES = {
  downIdle: [...HEAD_DOWN, ...BODY_FRONT, ...LEGS_FRONT_IDLE],
  downStep: [...HEAD_DOWN, ...BODY_FRONT, ...LEGS_FRONT_STEP],
  upIdle: [...HEAD_UP, ...BODY_FRONT, ...LEGS_FRONT_IDLE],
  upStep: [...HEAD_UP, ...BODY_FRONT, ...LEGS_FRONT_STEP],
  leftIdle: [...HEAD_LEFT, ...BODY_LEFT, ...LEGS_LEFT_IDLE],
  leftStep: [...HEAD_LEFT, ...BODY_LEFT, ...LEGS_LEFT_STEP],
};
