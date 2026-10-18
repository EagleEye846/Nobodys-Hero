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

// Running: a long stride with the arms pumping, then a "pass" frame with the
// legs tucked under (drawn a pixel higher, for a bounce). Facing sideways, the
// head leans forward and the scarf streams out behind.

// One arm swung forward (up), the other back (down).
const RUN_BODY_FRONT = [
  '..kffffffk..',
  '.kcffffffck.',
  'ksccccccccck',
  'kcccccccccck',
  'kcccccccccsk',
  '.kcccccccck.',
];

const RUN_LEGS_FRONT_STRIDE = [
  '.kppppppppk.',
  '.kbbk..kppk.',
  '.......kbbk.',
];

const RUN_LEGS_FRONT_PASS = [
  '.kppppppppk.',
  '..kppkkppk..',
  '..kbbkkbbk..',
];

// The head pushed a pixel forward, leaning into the run.
const HEAD_LEFT_LEANING = HEAD_LEFT.map((row) => `${row.slice(1)}.`);

const RUN_BODY_LEFT_REACH = [
  '..kffffffk..',
  '..kccccffffk',
  '..kccccccck.',
  '.skccccccck.',
  '..kccccccck.',
  '..kccccccck.',
];

const RUN_BODY_LEFT_SWING = [
  '..kffffffk..',
  '..kccccfffk.',
  '..kccccccck.',
  '..kcccccsck.',
  '..kcccccsck.',
  '..kccccccck.',
];

const RUN_LEGS_LEFT_STRIDE = [
  '..kpppppppk.',
  '.kppk...kppk',
  'kbbk....kbbk',
];

const RUN_LEGS_LEFT_PASS = [
  '..kpppppppk.',
  '....kpppk...',
  '....kbbbk...',
];

export const PLAYER_RUN_SPRITES = {
  downStride: [...HEAD_DOWN, ...RUN_BODY_FRONT, ...RUN_LEGS_FRONT_STRIDE],
  downPass: [...HEAD_DOWN, ...BODY_FRONT, ...RUN_LEGS_FRONT_PASS],
  upStride: [...HEAD_UP, ...RUN_BODY_FRONT, ...RUN_LEGS_FRONT_STRIDE],
  upPass: [...HEAD_UP, ...BODY_FRONT, ...RUN_LEGS_FRONT_PASS],
  leftStride: [...HEAD_LEFT_LEANING, ...RUN_BODY_LEFT_REACH, ...RUN_LEGS_LEFT_STRIDE],
  leftPass: [...HEAD_LEFT_LEANING, ...RUN_BODY_LEFT_SWING, ...RUN_LEGS_LEFT_PASS],
};

// Hanging on to Ves's boot with one hand as she floats up a wind geyser
// (src/overworld/windGeyser.js): the other arm and both legs flailing in the
// wind, swapping between the two frames.
export const PLAYER_HANG_SPRITES = {
  hangA: [
    '.......kssk.',
    '.......kcck.',
    '.......kcck.',
    '...kkkkkcck.',
    '..khhhhhcck.',
    '.khhhhhhcck.',
    '.khhhhhhcck.',
    '.khsshhscck.',
    '.kssssssssk.',
    '.kseksskesk.',
    '.kssssssssk.',
    '..kssssssk..',
    'kkkffffffk..',
    'scccffffcck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kppppppppk.',
    'kbbpk..kppk.',
    'kbk....kppk.',
    '.......kbbk.',
    '............',
  ],
  // Floating side by side with Ves, holding her hand: once she's decided you
  // don't have to hang off her boot any more (vesHoldsYourHand.js). Your left
  // hand, out to her, is the 's' on the far left of the body.
  holdA: [
    '............',
    '............',
    '............',
    '...kkkkkk...',
    '..khhhhhhk..',
    '.khhhhhhhhk.',
    '.khhhhhhhhk.',
    '.khsshhsshk.',
    '.kssssssssk.',
    '.ksessssesk.',
    '.kssssssssk.',
    '..kssssssk..',
    'kkkffffffk..',
    'scccffffcck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kppppppppk.',
    'kbbpk..kppk.',
    'kbk....kppk.',
    '.......kbbk.',
    '............',
  ],
  holdB: [
    '............',
    '............',
    '............',
    '...kkkkkk...',
    '..khhhhhhk..',
    '.khhhhhhhhk.',
    '.khhhhhhhhk.',
    '.khsshhsshk.',
    '.kssssssssk.',
    '.ksessssesk.',
    '.kssssssssk.',
    '..kssssssk..',
    'kkkffffffk..',
    'scccffffcck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kppppppppk.',
    '.kppk..kpbbk',
    '.kppk....kbk',
    '.kbbk.......',
    '............',
  ],
  hangB: [
    '.......kssk.',
    '.......kcck.',
    '.......kcck.',
    '...kkkkkcck.',
    '..khhhhhcck.',
    '.khhhhhhcck.',
    '.khhhhhhcck.',
    '.khsshhscck.',
    '.kssssssssk.',
    '.kseksskesk.',
    '.kssssssssk.',
    '..kssssssk..',
    '..kffffffk..',
    '.kcffffffcck',
    '.kcccccccccs',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kppppppppk.',
    '.kppk..kpbbk',
    '.kppk....kbk',
    '.kbbk.......',
    '............',
  ],
};

// The hero's dive off the summit after Ves (usurperFalls.js), facing right:
// a crouch, the leap, stretched out over the drop, then head first, arms
// reaching ('player_dive'; play it `once`). 26x26.
export const PLAYER_DIVE_SPRITES = {
  crouch: [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........kkkkkk..........',
    '.........khhhhhhk.........',
    '........khhhhhhhhk........',
    '........khhhhhhhsk........',
    '........khhhhhhssk........',
    '........khhhhssesk........',
    '........khhhsssssk........',
    '..........ksssssk.........',
    '........kkffffffk.........',
    '.......skfffcccck.........',
    '.......kkccccccck.........',
    '........kccccccck.........',
    '........kpppppppk.........',
    '........kppkkkkppk........',
    '.......kbbk....kbbk.......',
    '..........................',
  ],
  leap: [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '................k.........',
    '...............kkk........',
    '...............ks.........',
    '............k.kc...k......',
    '..........kkkhkkkkckk.....',
    '.........kkhhhhkkcck......',
    '.........khhhhhhkkk.......',
    '........khhhhhhhhk........',
    '.........hhhhhhhhkk.......',
    '.....fkkkkhshshhsh........',
    '.....kkfffssssessk........',
    '....kkccfffsssesk.........',
    '.....pcccccffsskk.........',
    '....kppcccccfk.k..........',
    '...kpppppccckk............',
    '....bk.kppckk.............',
    '.......kpppk..............',
    '......kbkk................',
    '.......bk.................',
    '..........................',
    '..........................',
  ],
  arc: [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '.......f..................',
    '.....kkkk..kkkkk..........',
    '..kkkpccfk.hhhhhk.........',
    '..bpppccffkhhhhhhkkkkk....',
    '..kkppccffshhhhhhkccsk....',
    '....kpcccfsshhhhhkk.......',
    '..kkppcccfssshhhhkkk......',
    '..bpppcccfssshhhhkccsk....',
    '..kkkpcccfsseshhhkkkkk....',
    '.....kkkkkksssshk.........',
    '...........kkkkk..........',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
  ],
  dive: [
    '..........................',
    '........k.................',
    '.......bk.................',
    '......kkpkkk..............',
    '....bk.kpppkff............',
    '...kbkpkpccck.............',
    '....kpppcccff.............',
    '....kkpcccffk.............',
    '....kpcccccfk.kk..........',
    '.....kcccffsshhkk.........',
    '......kcffsshhhhk.........',
    '.......kfssshhhhhk........',
    '.......kkssshhhhhk........',
    '........ssehhhhhh.........',
    '........ksshhhhhkk........',
    '.........kshhhhkcck.......',
    '.........kkhhkkkkcsk......',
    '..........k..kckk.sk......',
    '..............kc..........',
    '...............kk.........',
    '...............kk.........',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
  ],
};
