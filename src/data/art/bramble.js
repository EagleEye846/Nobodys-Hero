// Bramble in the world: the woodcutters' kid, about ten. His frames are 16x21:
// about the hero's size, with his hair sticking up and the hatchet over his
// shoulder poking up higher still. He's drawn in the prop palette
// (src/data/art/props.js) plus a few colours of his own (BRAMBLE_PALETTE_EXTRA
// below): merge those into PROP_PALETTE and any of these can be a prop.
//
// Rust-orange hair that won't lie flat, with a red leaf caught in it. Freckles
// and big dark eyes. An old red-and-black flannel shirt, far too big for him:
// the sleeves rolled up to the elbow and the tails hanging past his hips.
// Patched trousers, and boots a size too big. And the hatchet, a real
// woodcutter's one with a long handle, carried up on his shoulder.
//
// Like the hero (player.js) and Ves (vesper.js): down, up and left, each idle
// and mid-step, and running (a long stride, then a "pass" with the legs tucked
// under). Right is left mirrored. He's a kid, so he bounces: on every step he
// pops up a pixel and the hatchet lags a beat behind him, and on the "pass" of
// a run both his feet are off the ground.

// His colours that the prop palette doesn't have yet.
export const BRAMBLE_PALETTE_EXTRA = {
  '+': '#b4501e', // hair, rust orange
  '-': '#e88a3c', // hair, catching the light
  '/': '#8a3418', // hair, in shadow
  '*': '#d0906a', // freckles
  ')': '#3a2418', // boots
};

// Everything he's drawn in, on its own, so his animations (at the bottom) work
// without the prop palette. These match PROP_PALETTE's colours exactly.
export const BRAMBLE_PALETTE = {
  k: '#120c1c', // outline
  C: '#f2d6b0', // skin
  3: '#c43b3b', // flannel, red
  U: '#8a2a2a', // flannel stripes, dark red
  Z: '#2a2630', // flannel stripes, black
  D: '#7a5a3a', // trousers
  w: '#c08a4e', // the patches on them
  L: '#5a3a1e', // boot soles and heels
  S: '#b8c0d0', // hatchet, the edge
  M: '#8a8296', // hatchet, steel
  O: '#5a5468', // hatchet, steel in shadow
  l: '#8a5a32', // hatchet handle
  '+': '#b4501e', // hair, rust orange
  '-': '#e88a3c', // hair, catching the light
  '/': '#8a3418', // hair, in shadow
  '*': '#d0906a', // freckles
  ')': '#3a2418', // boots
};

export const BRAMBLE_FRAMES = {
  // Facing you, the hatchet up on his shoulder in one fist.
  downIdle: [
    '................',
    '..kk.....k.k.kk.',
    '.kSMk..kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '..klk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCk33UC3U3k..',
    '..kCCk33U33U3kk.',
    '.kUUkZUUZUUZUUk.',
    '..kkkU33U33UkUk.',
    '...k3U33U33UkCk.',
    '...kUkUkkUkZkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  // A hop: up a pixel, one boot off the ground, the hatchet a beat behind.
  downStep: [
    '.........k.k.kk.',
    '..kk...kk-k-k33k',
    '.kSMk.k-+k+-+U3k',
    'kSSMkk+-+++-+kk.',
    'kSMOk+-++++-+-k.',
    '.kkkk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCkUUZCUZUk..',
    '..kCCk33U33U3kk.',
    '.kU3kU33U33U33k.',
    '..kkkZUUZUUZkUk.',
    '...k3U33U33UkCk.',
    '...k3k3kk3kUkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..kDDk...',
    '.........k))Lk..',
  ],
  // From behind: the hatchet on the same side, the leaf on the other.
  upIdle: [
    '................',
    '..kk..kk.k.k....',
    '.kSMkk33kk-k-k..',
    'kSSMkU3-+k+-+k..',
    'kSMOkk+-+++-+-k.',
    '.kkkk++-+++-+++k',
    '..klk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCk33U33U3k..',
    '..kCCk33U33U3kk.',
    '.kUUkZUUZUUZUUk.',
    '..kkkU33U33UkUk.',
    '...k3U33U33UkCk.',
    '...kUkUkkUkZkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  upStep: [
    '......kk.k.k....',
    '..kk.k33kk-k-k..',
    '.kSMkU3-+k+-+k..',
    'kSSMkk+-+++-+-k.',
    'kSMOk++-+++-+++k',
    '.kkkk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCkUUZUUZUk..',
    '..kCCk33U33U3kk.',
    '.kU3kU33U33U33k.',
    '..kkkZUUZUUZkUk.',
    '...k3U33U33UkCk.',
    '...k3k3kk3kUkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..kDDk...',
    '.........k))Lk..',
  ],
  // Side on, reaching up to the hatchet behind his head.
  leftIdle: [
    '................',
    '.......k.kk..kk.',
    '......kk-k3kkMSk',
    '....kk-+k+U3kMSS',
    '...k+-+++-+-kMSk',
    '..k-+-++-+++kkkk',
    '..k+-+-++-++klk.',
    '..k+C+C++-++klk.',
    '..kCkCC++-++klk.',
    '.kCCkCC*++/+klk.',
    '..kCCC*CC++/klk.',
    '...kkUCCkkkkklk.',
    '....kk33U3kkCCk.',
    '...k3U33UkkCCk..',
    '...kUZUUZUUk....',
    '...k3U33U33k....',
    '...k3U33U33k....',
    '...kUkUkZUkk....',
    '....kDDwDDk.....',
    '....kDDkDDk.....',
    '...k))Lk)Lk.....',
  ],
  leftStep: [
    '.......k.kk.....',
    '......kk-k3k.kk.',
    '....kk-+k+U3kMSk',
    '...k+-+++-+-kMSS',
    '..k-+-++-+++kMSk',
    '..k+-+-++-++kkkk',
    '..k+C+C++-++klk.',
    '..kCkCC++-++klk.',
    '.kCCkCC*++/+klk.',
    '..kCCC*CC++/klk.',
    '...kkUCCkkkkklk.',
    '....kkUUZUkkCCk.',
    '...k3U33UkkCCkk.',
    '...k3U33U3Uk....',
    '...kUZUUZUUk....',
    '...k3U33U33k....',
    '...k3k3kU3kk....',
    '....kDDwDDDk....',
    '....kDDkkDDk....',
    '...kDDk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  // Running.
  // Running: his free arm pumping, the hatchet jolting up.
  downStride: [
    '..kk............',
    '.kSMk....k.k.kk.',
    'kSSMk..kk-k-k33k',
    'kSMOk.k-+k+-+U3k',
    '.kkkkk+-+++-+kk.',
    '..klk+-++++-+-k.',
    '..klk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCk33UC3U3k..',
    '..kCCk33U33U3kk.',
    '.kUUkZUUZUUkCCk.',
    '..kkkU33U33kUk..',
    '...k3U33U33U3k..',
    '...kUkUkkUkZkk..',
    '...kDDDDDwDDk...',
    '..k))Lk..kDDk...',
    '.........k))Lk..',
  ],
  // Both feet off the ground.
  downPass: [
    '.........k.k.kk.',
    '..kk...kk-k-k33k',
    '.kSMk.k-+k+-+U3k',
    'kSSMkk+-+++-+kk.',
    'kSMOk+-++++-+-k.',
    '.kkkk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCkUUZCUZUk..',
    '..kCCk33U33U3kk.',
    '.kU3kU33U33U33k.',
    '..kkkZUUZUUZkUk.',
    '...k3U33U33UkCk.',
    '...k3k3kk3kUkCk.',
    '...kDDDDDwDDk...',
    '....kDwkkDDk....',
    '....k)Lkk)Lk....',
    '................',
  ],
  upStride: [
    '..kk............',
    '.kSMk.kk.k.k....',
    'kSSMkk33kk-k-k..',
    'kSMOkU3-+k+-+k..',
    '.kkkkk+-+++-+-k.',
    '..klk++-+++-+++k',
    '..klk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCk33U33U3k..',
    '..kCCk33U33U3kk.',
    '.kUUkZUUZUUkCCk.',
    '..kkkU33U33kUk..',
    '...k3U33U33U3k..',
    '...kUkUkkUkZkk..',
    '...kDDDDDwDDk...',
    '..k))Lk..kDDk...',
    '.........k))Lk..',
  ],
  upPass: [
    '......kk.k.k....',
    '..kk.k33kk-k-k..',
    '.kSMkU3-+k+-+k..',
    'kSSMkk+-+++-+-k.',
    'kSMOk++-+++-+++k',
    '.kkkk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCkUUZUUZUk..',
    '..kCCk33U33U3kk.',
    '.kU3kU33U33U33k.',
    '..kkkZUUZUUZkUk.',
    '...k3U33U33UkCk.',
    '...k3k3kk3kUkCk.',
    '...kDDDDDwDDk...',
    '....kDwkkDDk....',
    '....k)Lkk)Lk....',
    '................',
  ],
  // Leaning into it.
  leftStride: [
    '..............kk',
    '......k.kk...kMS',
    '.....kk-k3k..kMS',
    '...kk-+k+U3k.kMS',
    '..k+-+++-+-k.kkk',
    '.k-+-++-+++k.klk',
    '.k+-+-++-++k.klk',
    '.k+C+C++-++k.klk',
    '.kCkCC++-++k.klk',
    'kCCkCC*++/+k.klk',
    '.kCCC*CC++/k.klk',
    '..kkUCCkkkkk.klk',
    '....kk33U3kkCCk.',
    '...k3U33UkkCCk..',
    '..kCUZUUZUUk....',
    '..kU3U33U33k....',
    '...k3U33U33k....',
    '...kUkUkZUkk....',
    '....kDDwDDDk....',
    '..kkDDk..kDDk...',
    '.k))Lk....k))k..',
  ],
  leftPass: [
    '......k.kk......',
    '.....kk-k3k...kk',
    '...kk-+k+U3k.kMS',
    '..k+-+++-+-k.kMS',
    '.k-+-++-+++k.kMS',
    '.k+-+-++-++k.kkk',
    '.k+C+C++-++k.klk',
    '.kCkCC++-++k.klk',
    'kCCkCC*++/+k.klk',
    '.kCCC*CC++/k.klk',
    '..kkUCCkkkkk.klk',
    '....kkUUZUkkCCkk',
    '...k3U33UkkCCklk',
    '...k3U33U3Uk....',
    '...kUZUUZUUk....',
    '...k3U33U33k....',
    '...k3k3kU3kk....',
    '....kDDwDDk.....',
    '.....kDDDk......',
    '.....k))Lk......',
    '................',
  ],
};

// Poses for cutscenes, each a prop of its own (spread these into PROP_SPRITES).
// They're 16 wide like his frames but as tall as each pose needs (the jump is
// 18 wide, for the arm he's holding out). Like every prop, they stand on their
// bottom row.
export const BRAMBLE_PROP_SPRITES = {
  // Standing, facing you (his downIdle).
  bramble_stand: [
    '................',
    '..kk.....k.k.kk.',
    '.kSMk..kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '..klk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCk33UC3U3k..',
    '..kCCk33U33U3kk.',
    '.kUUkZUUZUUZUUk.',
    '..kkkU33U33UkUk.',
    '...k3U33U33UkCk.',
    '...kUkUkkUkZkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  // Standing, facing away (his upIdle).
  bramble_stand_back: [
    '................',
    '..kk..kk.k.k....',
    '.kSMkk33kk-k-k..',
    'kSSMkU3-+k+-+k..',
    'kSMOkk+-+++-+-k.',
    '.kkkk++-+++-+++k',
    '..klk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCk33U33U3k..',
    '..kCCk33U33U3kk.',
    '.kUUkZUUZUUZUUk.',
    '..kkkU33U33UkUk.',
    '...k3U33U33UkCk.',
    '...kUkUkkUkZkCk.',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  // Up on the stump with the pack all round him: feet braced, the hatchet
  // raised high, yelling at them to get off.
  bramble_cornered: [
    '..kk............',
    '.kSMk...........',
    'kSSMk...........',
    'kSMOk...........',
    '.kkkk....k.k.kk.',
    '..klk..kk-k-k33k',
    '..klk.k-+k+-+U3k',
    '..klkk+-+++-+kk.',
    '.kCCk+-++++-+-k.',
    '.kCCk++-+-+++-k.',
    '.kClk+C+CC+C+Ck.',
    'kCklkCCkkCkkCCk.',
    'kUklkCCkCCCkCCk.',
    'k3klk*C*C)C*C*k.',
    'kUklkkCC)U)CCkk.',
    'k3kCCk33UC3U3k..',
    '.kU3CCCUU33U33k.',
    '..kUkkkUZUUZUUk.',
    '..k33U33U33U33k.',
    '..k33U33U33U3k..',
    '..kUkZkkZkUkUk..',
    '..kDDDDDDwDDDk..',
    '.kDDwk...kDDDk..',
    'k))Lk.....k))Lk.',
  ],
  // Chopping, facing left: the hatchet swung up and back...
  bramble_chop_a: [
    '.........kkk....',
    '........kSSMk...',
    '........kSMOk...',
    '.........kkklk..',
    '.......k.k.kCCk.',
    '.....kk-k-3kCCk.',
    '....k+-+kU3kCk..',
    '...k+-+++-+kCk..',
    '..k-+-++-++kCk..',
    '..k+-+-++-+kUk..',
    '..k+C+C++-+k3k..',
    '..kCkCC++-+kUk..',
    '.kCCkCC*++/k3k..',
    '..kCCC*CC++k3k..',
    '...kkUCCkkkkUk..',
    '....kk33U33U3k..',
    '...k3U33U33U3k..',
    '...kUZUUZUUZk...',
    '...k3U33U33Uk...',
    '...k3k3kU3kUk...',
    '...kDDDwDDDDk...',
    '..kDDk...kDDk...',
    '.k))Lk...k))Lk..',
  ],
  // ...and down in front of him. (Together they're the bramble_chop animation.)
  bramble_chop_b: [
    '................',
    '................',
    '................',
    '................',
    '.........k.kk...',
    '.......kk-k3k...',
    '......k-+kU3k...',
    '.....k+-+++-+k..',
    '....k-+-++-+++k.',
    '....k+-+-++-++k.',
    '....k+C+C++-++k.',
    '....kCkCC++-+k..',
    '...kCCkCC*++/k..',
    '....kCCC*CC++k..',
    '.....kkUCCkkkk..',
    '....kkkUU33U3k..',
    '..kkCCk3U33U3k..',
    '.kCCCkkUZUUZUk..',
    'klkkk.k3U33U3k..',
    'kSMk..k3k3kU3k..',
    'kSSMk.kDDDwDDk..',
    '.kSSk.kDDk.kDDk.',
    '..kk.k))Lk.k))Lk',
  ],
  // Crouched low, facing left: hiding in the leaves, or squeezing through a
  // gap the hero won't fit.
  bramble_crouch: [
    '............kk..',
    '...........kMSk.',
    '...........kMSS.',
    '......k.kk.kMSk.',
    '.....kk-k3kkkkk.',
    '...kk-+k+U3kklk.',
    '..k+-+++-+-k3lk.',
    '.k-+-++-+++k33k.',
    '.k+-+-++-++kUUZk',
    '.k+C+C++-++k33Uk',
    '.kCkCC++-++k33Uk',
    'kCCkCC*++/kkUUZk',
    '.kCCC*CC++kk33k.',
    '..kkUCCkkkCCk3k.',
    '...kCCkkZkCCkUk.',
    '..kDDDDDDwDDDDk.',
    '.k))LLk))))LLk..',
    '..kkkk.kkkkkk...',
  ],
  // HOLLERING: hands cupped round his mouth, eyes screwed shut.
  bramble_holler: [
    '.kk......k.k.kk.',
    'kSMk...kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '....k++-+-+++-k.',
    '....k+C+CC+C+Ck.',
    '....kCkCCCCCkCk.',
    '....kCCkCCCkCCk.',
    '....k*kC)))Ck*k.',
    '...kCkC)UUU)CkCk',
    '..kCkkC)))))Ckk.',
    '..kCk.kC)))Ck.kk',
    '.kUk3kkkkkkkk3Uk',
    '.kZkUZUkZkUZUUk.',
    '..k33U33U33U3k..',
    '..k33U33U33U3k..',
    '..kUkZkkZkUkUk..',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  // Sat on the ground, boots out in front, hands on his knees.
  bramble_sit: [
    '.kk......k.k.kk.',
    'kSMk...kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '..klk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kkUkkUZCUZkkZk',
    '..k3kU33U33U3kUk',
    '..k3kU33U33U3kUk',
    '..kUkZUUZUUZUkUk',
    '.kDCCDDDDwDDCCDk',
    '.kDDDk....kDDDk.',
    '.k)L)k....k)L)k.',
    '..kkk......kkk..',
  ],
  // Mid-dive (into the well), one arm up and the one on the left held out to
  // the side, holding the hero's hand.
  bramble_jump: [
    '..........k.k.kk..',
    '........kk-k-k33k.',
    '.......k-+k+-+U3kk',
    '......k+-+++-+kkCk',
    '.....k+-++++-+-kCk',
    '.....k++-+-+++-kCk',
    '.....k+C+CC+C+CkCk',
    '.....kCkCCCCCkCkUk',
    '.....kCCkCCCkCCkUk',
    '.....k*C*CCC*C*k3k',
    '.kkkkkkCCC)CCCkk3k',
    'kCCCUkUUZCUZUUkUUk',
    '.kkkkU33U33U33U3k.',
    '....kU33U33U33U3k.',
    '.....kUUZUUZUUZk..',
    '.....k3kUkkUk3k...',
    '.....kDDDDDwDDk...',
    '.....kDDkkkDDk....',
    '....k))Lk.k))Lk...',
    '.....kkk...kkk....',
  ],
};

// His face, for the dialogue box: in exactly the format of the portraits in
// src/data/art/portraits.js (add it to PORTRAITS as 'bramble'). 32x32, with
// the hatchet up over his shoulder the way Ves has her umbrella. He's loud and
// feels everything all the way, so his face goes a long way: a big toothy
// grin, laughing with his eyes shut, smug, gritting his teeth, HOLLERING,
// scared stiff, sobbing. Each expression is a few changes to the idle face, as
// [row, column, pixels], so they always match it; `eyes` are the rows his
// eyes are on, for blinking.
const BRAMBLE_PORTRAIT_PALETTE = {
  k: '#1a1020', // outline
  h: '#b4501e', // hair, rust orange
  H: '#e88a3c', // hair, catching the light
  d: '#7a3016', // hair, in shadow
  l: '#e0402e', // the leaf in his hair
  L: '#8a2020', // leaf, in shadow
  s: '#f7d4b4', // skin
  S: '#e0ae90', // skin in shadow
  f: '#c8805a', // freckles
  e: '#24141a', // eyes
  E: '#ffffff', // eye shine, and the whites of his eyes
  i: '#5a3420', // eyes, dark brown
  I: '#8a5a34', // eyes, lit
  b: '#f29a9a', // blush
  m: '#a8485a', // mouth
  o: '#5a2a36', // open mouth
  n: '#e06a6a', // tongue
  t: '#9ad8ff', // tears and sweat
  T: '#e6f6ff', // tears, welling
  r: '#c43b3b', // flannel, red
  R: '#7a2222', // flannel stripes, dark red
  z: '#2a1a20', // flannel stripes, black
  c: '#e8dcc0', // his vest, under the flannel
  g: '#8a5a32', // hatchet handle
  G: '#b8c0d0', // hatchet, steel
  M: '#7a7a8a', // hatchet, steel in shadow
};

const BRAMBLE_EXPRESSIONS = {
  // Each mood changes his brows (rows 12-13, which stay put when he blinks), his eyes and his
  // mouth, so it reads at a glance in the dialogue box. Grin: brows up, eyes crinkled, a big toothy grin.
  grin: { patches: [[12, 11, 'dkkkh'], [12, 21, 'hkkks'], [16, 11, 'skkks'], [16, 21, 'skkks'], [17, 11, 'sssss'], [17, 21, 'sssss'], [20, 13, 'smmmmmmmmms'], [21, 13, 'smEEEEEEEms'], [22, 13, 'ssmmmmmmmss']] },
  // Laughing: brows up, eyes squeezed into ^ ^, mouth wide open, cheeks red.
  glee: { closed: true, patches: [[12, 11, 'dkkkh'], [12, 21, 'hkkks'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'sskss'], [15, 21, 'sskss'], [16, 11, 'sksks'], [16, 21, 'sksks'], [17, 11, 'sssss'], [17, 21, 'sssss'], [20, 13, 'smmmmmmmmms'], [21, 13, 'smoooooooms'], [22, 13, 'ssmonnnomss'], [23, 13, 'kssmmmmmssk'], [19, 10, 'bbb'], [19, 24, 'bbb']] },
  // Brows up, eyes shut, very pleased with himself: a lopsided smirk.
  proud: { closed: true, patches: [[12, 11, 'dkkkh'], [12, 21, 'hkkks'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'sssss'], [15, 21, 'sssss'], [16, 11, 'skkks'], [16, 21, 'skkks'], [17, 11, 'ksssk'], [17, 21, 'ksssk'], [19, 13, 'sssssssssms'], [20, 13, 'ssssssssmss'], [21, 13, 'ssmmmmmmsss'], [19, 10, 'bbb'], [19, 24, 'bbb']] },
  // Brows slanted down at the middle, lids lowered, mouth set in a line.
  determined: { patches: [[12, 11, 'dkssh'], [12, 21, 'hdsks'], [13, 11, 'sskks'], [13, 21, 'skkss'], [15, 11, 'skkks'], [15, 21, 'skkks'], [16, 11, 'seEis'], [16, 21, 'seEis'], [17, 11, 'siIis'], [17, 21, 'siIis'], [20, 13, 'sssssssssss'], [21, 13, 'ssmmmmmmmss']] },
  // Brows slanted hard, a narrowed glare, teeth gritted, red in the face.
  angry: { patches: [[12, 11, 'dkssh'], [12, 21, 'hdsks'], [13, 11, 'sskks'], [13, 21, 'skkss'], [15, 11, 'skkks'], [15, 21, 'skkks'], [16, 11, 'seEis'], [16, 21, 'seEis'], [17, 11, 'sieis'], [17, 21, 'sieis'], [20, 13, 'smmmmmmmmms'], [21, 13, 'smEkEkEkEms'], [22, 13, 'smmmmmmmmms'], [19, 10, 'bbb'], [19, 24, 'bbb']] },
  // HOLLERING: brows down, eyes screwed into > <, mouth enormous.
  shout: { closed: true, patches: [[12, 11, 'dkssh'], [12, 21, 'hdsks'], [13, 11, 'sskks'], [13, 21, 'skkss'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'skkss'], [15, 21, 'sskks'], [16, 11, 'sskks'], [16, 21, 'skkss'], [17, 11, 'skkss'], [17, 21, 'sskks'], [19, 13, 'ssmmmmmmmss'], [20, 13, 'smoooooooms'], [21, 13, 'smoonnnooms'], [22, 13, 'ssmonnnomss'], [23, 13, 'kssmmmmmssk'], [19, 10, 'bbb'], [19, 24, 'bbb']] },
  // Brows shot up, eyes wide white with tiny pupils, mouth an O.
  surprised: { patches: [[12, 11, 'dkkkh'], [12, 21, 'hkkks'], [15, 11, 'sEEEs'], [15, 21, 'sEEEs'], [16, 11, 'sEeEs'], [16, 21, 'sEeEs'], [17, 11, 'sEEEs'], [17, 21, 'sEEEs'], [20, 13, 'ssssmmmssss'], [21, 13, 'sssmooomsss'], [22, 13, 'sssmooomsss'], [23, 13, 'kssssmssssk']] },
  // Brows up in the middle, eyes wide white, mouth wobbling, sweat.
  scared: { patches: [[12, 11, 'dsskh'], [12, 21, 'hksss'], [13, 11, 'skkss'], [13, 21, 'sskks'], [15, 11, 'sEEEs'], [15, 21, 'sEEEs'], [16, 11, 'sEeEs'], [16, 21, 'sEeEs'], [17, 11, 'sEEEs'], [17, 21, 'sEEEs'], [20, 13, 'sssssssssss'], [21, 13, 'ssmsmsmsmss'], [22, 13, 'smsmsmsmsms'], [14, 26, 't'], [15, 26, 't'], [16, 26, 't']] },
  // Brows up in the middle, a frown, a bead of sweat.
  worried: { patches: [[12, 11, 'dsskh'], [12, 21, 'hksss'], [13, 11, 'skkss'], [13, 21, 'sskks'], [20, 13, 'sssssssssss'], [22, 13, 'ssmsssssmss'], [13, 26, 't'], [14, 26, 't']] },
  // Brows up in the middle, eyes cast down, a frown.
  sad: { patches: [[12, 11, 'dsskh'], [12, 21, 'hksss'], [13, 11, 'skkss'], [13, 21, 'sskks'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'skkks'], [15, 21, 'skkks'], [16, 11, 'seiis'], [16, 21, 'seiis'], [17, 11, 'siiis'], [17, 21, 'siiis'], [20, 13, 'sssssssssss'], [21, 13, 'ssssmmmssss'], [22, 13, 'sssmsssmsss']] },
  // Sad brows, eyes swimming, tears down both cheeks, mouth open.
  crying: { patches: [[12, 11, 'dsskh'], [12, 21, 'hksss'], [13, 11, 'skkss'], [13, 21, 'sskks'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'skkks'], [15, 21, 'skkks'], [16, 11, 'sTTTs'], [16, 21, 'sTTTs'], [17, 11, 'siiis'], [17, 21, 'siiis'], [18, 11, 'ftfss'], [18, 21, 'sstsf'], [20, 13, 'ssssmmmssss'], [21, 13, 'sssmooomsss'], [22, 13, 'ssmsssssmss'], [19, 12, 't'], [20, 12, 't'], [21, 11, 't'], [19, 23, 't'], [20, 24, 't'], [21, 24, 't']] },
  // Caught out: brows up, eyes slid away, a crooked smile, red in the face, sweat.
  sheepish: { patches: [[12, 11, 'dsskh'], [12, 21, 'hksss'], [13, 11, 'skkss'], [13, 21, 'sskks'], [15, 11, 'sEies'], [15, 21, 'sEies'], [16, 11, 'sIiis'], [16, 21, 'sIiis'], [17, 11, 'sssss'], [17, 21, 'sssss'], [20, 13, 'sssssssssms'], [21, 13, 'ssmmmmmmmss'], [11, 27, 't'], [12, 27, 't'], [19, 10, 'bbb'], [19, 24, 'bbb']] },
  // One brow up, eyes half shut and slid sideways, a smirk.
  sly: { patches: [[12, 21, 'hkkks'], [13, 11, 'skkks'], [14, 11, 'sssss'], [15, 11, 'skkks'], [15, 21, 'sssss'], [16, 11, 'ssiie'], [16, 21, 'ssiie'], [17, 11, 'sssss'], [17, 21, 'ssiis'], [20, 13, 'sssssssssms'], [21, 13, 'sssmmmmmmss']] },
  // One brow up, eyes rolled up to the side, mouth pushed over: hmm.
  thinking: { patches: [[12, 21, 'hkkks'], [13, 11, 'skkks'], [14, 11, 'sssss'], [15, 11, 'skkks'], [15, 21, 'sseEs'], [16, 11, 'sseEs'], [16, 21, 'ssiis'], [17, 11, 'ssiis'], [17, 21, 'sssss'], [20, 13, 'sssssssssss'], [21, 13, 'ssssssmmmss']] },
  // Brows flat and low, lids half down, a flat mouth off to one side.
  bored: { patches: [[13, 11, 'skkks'], [13, 21, 'skkks'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'skkks'], [15, 21, 'skkks'], [16, 11, 'seiIs'], [16, 21, 'seiIs'], [17, 11, 'sssss'], [17, 21, 'sssss'], [20, 13, 'sssssssssss'], [21, 13, 'ssssmmmmmss']] },
  // Brows up, eyes big and shining, mouth a little o, blushing.
  awed: { patches: [[12, 11, 'dkkkh'], [12, 21, 'hkkks'], [15, 11, 'seEEs'], [15, 21, 'seEEs'], [16, 11, 'sEiIs'], [16, 21, 'sEiIs'], [17, 11, 'seiEs'], [17, 21, 'seiEs'], [20, 13, 'sssssssssss'], [21, 13, 'ssssmomssss'], [22, 13, 'sssssmsssss'], [19, 10, 'bbb'], [19, 24, 'bbb']] },
  // Brows sagging, eyes nearly shut, shadows under them, mouth hanging open.
  tired: { patches: [[12, 11, 'dsskh'], [12, 21, 'hksss'], [13, 11, 'skkss'], [13, 21, 'sskks'], [14, 11, 'sssss'], [14, 21, 'sssss'], [15, 11, 'sssss'], [15, 21, 'sssss'], [16, 11, 'skkks'], [16, 21, 'skkks'], [18, 11, 'SSSss'], [18, 21, 'ssSSS'], [20, 13, 'sssssssssss'], [21, 13, 'ssssmmmssss'], [22, 13, 'ssssmomssss'], [23, 13, 'kssssmssssk']] },
};

export const BRAMBLE_PORTRAIT = {
  palette: BRAMBLE_PORTRAIT_PALETTE,
  eyes: [14,  15,  16,  17],
  expressions: BRAMBLE_EXPRESSIONS,
  idle: [
    '................................',
    '.kk...........k......k..........',
    'kGGkk........khk....khk..k......',
    'kGGMMkkk..k..khHk..khHk.khk.....',
    'kGGMMMgk.khk.khhhkkhHhkkhhk.kkk.',
    'kGGMMkkk.khhkhHhhhhhhhhhHhkklllk',
    'kGGkkkgkkhHhhHhhhhhHhhhhhhhklLlk',
    '.kk..kgkhhHhhhhhhhHhhhhhhHhhkLlk',
    '.....kgkhHhhhhhhhHhhhhhhHhhhhkk.',
    '.....kgkhhhhhhhhhhhhhhhhhhhhhhk.',
    '.....kgkhhhhhdhhhhdhhhhdhhhhdhk.',
    '.....kgkhhhhdshhhdsshhhdshhhhshk',
    '......kgkhhdssshdsssshdssshdshhk',
    '......kgkhdsssssssssssssssdhhk..',
    '......kgkhsskkkssssssskkksshhk..',
    '......kgkhsseEissssssseEisshhk..',
    '......kgkhssiIisssssssiIisshhk..',
    '......kgkhsseiissssssseiisshkk..',
    '......kgkhsfsfssssSssssfsfshk...',
    '......kgkksbbsssssssssssbbsk....',
    '.......kgksssssmsssssmsssssk....',
    '.......kgkksssssmmmmmsssssk.....',
    '.......kgk.ksssssssssssssk......',
    '.......kgk..kkssssssssskk.......',
    '.......kgk....kkSsssSkk.........',
    '.......kgkkkrrrkSSssSkrrrkk.....',
    '.......kgkrrRrrkkSSSSkkrRrrrkk..',
    '.....kkkgkRrrrRrkkcckkrRrrRrrrk.',
    '...kkzzzkgkzzzzzzkcckzzzzzzzzzzk',
    '..krrrrRkgkRrrrRrrkkrrRrrrRrrrrk',
    '.krrrrrRkgkRrrrRrrrrrrRrrrRrrrrk',
    'krrrrrrRkgkRrrrRrrrrrrRrrrRrrrrk',
  ],
  // Blinking: his eyes shut.
  blink: [
    '................................',
    '.kk...........k......k..........',
    'kGGkk........khk....khk..k......',
    'kGGMMkkk..k..khHk..khHk.khk.....',
    'kGGMMMgk.khk.khhhkkhHhkkhhk.kkk.',
    'kGGMMkkk.khhkhHhhhhhhhhhHhkklllk',
    'kGGkkkgkkhHhhHhhhhhHhhhhhhhklLlk',
    '.kk..kgkhhHhhhhhhhHhhhhhhHhhkLlk',
    '.....kgkhHhhhhhhhHhhhhhhHhhhhkk.',
    '.....kgkhhhhhhhhhhhhhhhhhhhhhhk.',
    '.....kgkhhhhhdhhhhdhhhhdhhhhdhk.',
    '.....kgkhhhhdshhhdsshhhdshhhhshk',
    '......kgkhhdssshdsssshdssshdshhk',
    '......kgkhdsssssssssssssssdhhk..',
    '......kgkhssssssssssssssssshhk..',
    '......kgkhssssssssssssssssshhk..',
    '......kgkhsskkkssssssskkksshhk..',
    '......kgkhssssssssssssssssshkk..',
    '......kgkhsfsfssssSssssfsfshk...',
    '......kgkksbbsssssssssssbbsk....',
    '.......kgksssssmsssssmsssssk....',
    '.......kgkksssssmmmmmsssssk.....',
    '.......kgk.ksssssssssssssk......',
    '.......kgk..kkssssssssskk.......',
    '.......kgk....kkSsssSkk.........',
    '.......kgkkkrrrkSSssSkrrrkk.....',
    '.......kgkrrRrrkkSSSSkkrRrrrkk..',
    '.....kkkgkRrrrRrkkcckkrRrrRrrrk.',
    '...kkzzzkgkzzzzzzkcckzzzzzzzzzzk',
    '..krrrrRkgkRrrrRrrkkrrRrrrRrrrrk',
    '.krrrrrRkgkRrrrRrrrrrrRrrrRrrrrk',
    'krrrrrrRkgkRrrrRrrrrrrRrrrRrrrrk',
  ],
};

// Animations (src/engine/animations.js finds any NAME_SPRITES whose frames are
// all the same size, and names it in snake_case): 'bramble_chop' swings the
// hatchet up and down, and 'bramble_holler_anim' bounces up on his toes as he
// yells. Both use BRAMBLE_PALETTE.
export const BRAMBLE_CHOP_SPRITES = {
  chop_a: BRAMBLE_PROP_SPRITES.bramble_chop_a,
  chop_b: BRAMBLE_PROP_SPRITES.bramble_chop_b,
};

export const BRAMBLE_HOLLER_ANIM_SPRITES = {
  holler_a: [
    '................',
    '.kk......k.k.kk.',
    'kSMk...kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '....k++-+-+++-k.',
    '....k+C+CC+C+Ck.',
    '....kCkCCCCCkCk.',
    '....kCCkCCCkCCk.',
    '....k*kC)))Ck*k.',
    '...kCkC)UUU)CkCk',
    '..kCkkC)))))Ckk.',
    '..kCk.kC)))Ck.kk',
    '.kUk3kkkkkkkk3Uk',
    '.kZkUZUkZkUZUUk.',
    '..k33U33U33U3k..',
    '..k33U33U33U3k..',
    '..kUkZkkZkUkUk..',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
  // Up on his toes.
  holler_b: [
    '.kk......k.k.kk.',
    'kSMk...kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '....k++-+-+++-k.',
    '....k+C+CC+C+Ck.',
    '....kCkCCCCCkCk.',
    '....kCCkCCCkCCk.',
    '....k*kC)))Ck*k.',
    '...kCkC)UUU)CkCk',
    '..kCkkC)))))Ckk.',
    '..kCk.kC)))Ck.kk',
    '.kUk3kkkkkkkk3Uk',
    '.kZkUZUkZkUZUUk.',
    '..k33U33U33U3k..',
    '..k33U33U33U3k..',
    '..kUkZkkZkUkUk..',
    '...kDDDDDwDDk...',
    '...kDwk..kDDk...',
    '...kDwk..kDDk...',
    '..k))Lk..k))Lk..',
  ],
};

// CRAWLING through a gap only he fits (a kid gap in a hedge, a cat flap, a
// drain grating, a torn hull plate): not on hands and knees (that read as a
// grown-up) but crouched right down and scurrying, a small, scrappy kid with
// his own standing head, knees up by his chin and a hand out to the ground.
// Left and right are 16x17, down and up 16x17; two frames each way
// ('bramble_crawl_left', _right, _down, _up). Player.currentFrame shows them
// while he squeezes through. (The old hands-and-knees frames are in
// notes/bugfix-backup-2026-11-13/.)
// Side on: hunched over, the hatchet tucked flat behind his head, one hand
// down in front; then the hand reaching on and the other foot forward.
export const BRAMBLE_CRAWL_LEFT_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_LEFT_SPRITES = {
  a: [
    '.......k.kk.....',
    '......kk-k3k....',
    '....kk-+k+U3k...',
    '...k+-+++-+-k...',
    '..k-+-++-+++k...',
    '..k+-+-++-++kkk.',
    '..k+C+C++-++kSMk',
    '..kCkCC++-++kMOk',
    '.kCCkCC*++/+kkkk',
    '..kCCC*CC++/klk.',
    '...kkUCCkkkklk..',
    '..k3U33U33Ulk3k.',
    '.kCk3ZUUZUUZUUk.',
    '.kCkU33U33U33Uk.',
    '.kCkkDDDDwDDDDk.',
    '.kCCkDwkkkDDDDk.',
    '..kkk))Lk.k))Lk.',
  ],
  b: [
    '.......k.kk.....',
    '......kk-k3k....',
    '....kk-+k+U3k...',
    '...k+-+++-+-k...',
    '..k-+-++-+++k...',
    '..k+-+-++-++kkk.',
    '..k+C+C++-++kSMk',
    '..kCkCC++-++kMOk',
    '.kCCkCC*++/+kkkk',
    '..kCCC*CC++/klk.',
    '...kkUCCkkkklk..',
    '.kk3U33U33Ulk3k.',
    'kCCk3ZUUZUUZUUk.',
    'kCkkU33U33U33Uk.',
    '.k.kDDDDwDDDDk..',
    '...kDDkkkDwDk...',
    '..k))Lk.k))Lk...',
  ],
};
// The same, the other way (left mirrored).
export const BRAMBLE_CRAWL_RIGHT_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_RIGHT_SPRITES = {
  a: [
    '.....kk.k.......',
    '....k3k-kk......',
    '...k3U+k+-kk....',
    '...k-+-+++-+k...',
    '...k+++-++-+-k..',
    '.kkk++-++-+-+k..',
    'kMSk++-++C+C+k..',
    'kOMk++-++CCkCk..',
    'kkkk+/++*CCkCCk.',
    '.klk/++CC*CCCk..',
    '..klkkkkCCUkk...',
    '.k3klU33U33U3k..',
    '.kUUZUUZUUZ3kCk.',
    '.kU33U33U33UkCk.',
    '.kDDDDwDDDDkkCk.',
    '.kDDDDkkkwDkCCk.',
    '.kL))k.kL))kkk..',
  ],
  b: [
    '.....kk.k.......',
    '....k3k-kk......',
    '...k3U+k+-kk....',
    '...k-+-+++-+k...',
    '...k+++-++-+-k..',
    '.kkk++-++-+-+k..',
    'kMSk++-++C+C+k..',
    'kOMk++-++CCkCk..',
    'kkkk+/++*CCkCCk.',
    '.klk/++CC*CCCk..',
    '..klkkkkCCUkk...',
    '.k3klU33U33U3kk.',
    '.kUUZUUZUUZ3kCCk',
    '.kU33U33U33UkkCk',
    '..kDDDDwDDDDk.k.',
    '...kDwDkkkDDk...',
    '...kL))k.kL))k..',
  ],
};
// Coming towards you: squatting low, the hatchet still in his fist, hands by his boots.
export const BRAMBLE_CRAWL_DOWN_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_DOWN_SPRITES = {
  a: [
    '................',
    '..kk.....k.k.kk.',
    '.kSMk..kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '..klk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCk33U33U3k..',
    '.kUUkZUUZUUZUUk.',
    '.kCkkDDDDwDDDkk.',
    '.kCkDDkkkkDDkCk.',
    '..kk))Lk.k))Lkk.',
  ],
  b: [
    '................',
    '..kk.....k.k.kk.',
    '.kSMk..kk-k-k33k',
    'kSSMk.k-+k+-+U3k',
    'kSMOkk+-+++-+kk.',
    '.kkkk+-++++-+-k.',
    '..klk++-+-+++-k.',
    '..klk+C+CC+C+Ck.',
    '..klkCCkCCCkCCk.',
    '..klkCCkCCCkCCk.',
    '..klk*C*CCC*C*k.',
    '..klkkCCCUCCCkk.',
    '..kCCk33U33U3k..',
    '.kUUkZUUZUUZUUk.',
    '..kkkDDDDwDDDkk.',
    '..kDDkkkkkDDkCk.',
    '.k))Lk...k))Lkk.',
  ],
};
// Going away: the same from behind.
export const BRAMBLE_CRAWL_UP_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_UP_SPRITES = {
  a: [
    '................',
    '..kk..kk.k.k....',
    '.kSMkk33kk-k-k..',
    'kSSMkU3-+k+-+k..',
    'kSMOkk+-+++-+-k.',
    '.kkkk++-+++-+++k',
    '..klk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCk33U33U3k..',
    '.kUUkZUUZUUZUUk.',
    '.kCkkDDDDwDDDkk.',
    '.kCkDDkkkkDDkCk.',
    '..kk))Lk.k))Lkk.',
  ],
  b: [
    '................',
    '..kk..kk.k.k....',
    '.kSMkk33kk-k-k..',
    'kSSMkU3-+k+-+k..',
    'kSMOkk+-+++-+-k.',
    '.kkkk++-+++-+++k',
    '..klk+++-+++/+k.',
    '..klk+-+++++++k.',
    '..klk/++-++-+/k.',
    '..klk+/++++/++k.',
    '..klkC+/++/++Ck.',
    '..klkkCCCCCCCkk.',
    '..kCCk33U33U3k..',
    '.kUUkZUUZUUZUUk.',
    '..kkkDDDDwDDDkk.',
    '..kDDkkkkkDDkCk.',
    '.k))Lk...k))Lkk.',
  ],
};

// Sat in the grass, hands on his knees, a slow breath: his head dips a pixel
// and comes back up ('bramble_sit'; the end of Chapter 4: out_into_the_light).
export const BRAMBLE_SIT_SPRITES = {
  still: BRAMBLE_PROP_SPRITES.bramble_sit,
  breath: [
    '................',
    ...BRAMBLE_PROP_SPRITES.bramble_sit.slice(0, 11),
    ...BRAMBLE_PROP_SPRITES.bramble_sit.slice(12),
  ],
};

// Fidgets while he waits for you ('bramble_idle'): a yawn and a scratch of the
// head. Two columns wider than his walking frames, for the arm (see
// src/overworld/idles.js).
export const BRAMBLE_IDLE_SPRITES = {
  yawn_a: [
    '..................',
    '...kk.....k.k.kk..',
    '..kSMk..kk-k-k33k.',
    '.kSSMk.k-+k+-+U3k.',
    '.kSMOkk+-+++-+kk..',
    '..kkkk+-++++-+-k..',
    '...klk++-+-+++-k..',
    '...klk+C+CC+C+Ck..',
    '...klkCCCCCCCCCk..',
    '...klkCCkCCCkCCk..',
    '...klk*C*CCC*C*k..',
    '...klkkCCkUkCCkk..',
    '...kCCk33UC3U3k...',
    '...kCCk33U33U3kk..',
    '..kUUkZUUZUUZUUk..',
    '...kkkU33U33UkUk..',
    '....k3U33U33UkCk..',
    '....kUkUkkUkZkCk..',
    '....kDDDDDwDDk....',
    '....kDwk..kDDk....',
    '...k))Lk..k))Lk...',
  ],
  yawn_b: [
    '..................',
    '...kk.....k.k.kk..',
    '..kSMk..kk-k-k33k.',
    '.kSSMk.k-+k+-+U3k.',
    '.kSMOkk+-+++-+kk..',
    '..kkkk+-++++-+-k..',
    '...klk++-+-+++-k..',
    '...klk+C+CC+C+Ck..',
    '...klkCCCCCCCCCk..',
    '...klkCCkCCCkCCk..',
    '...klk*C*kUk*C*k..',
    '...klkkCCkUkCCkk..',
    '...kCCk33UC3U3k...',
    '...kCCk33U33U3kk..',
    '..kUUkZUUZUUZUUk..',
    '...kkkU33U33UkUk..',
    '....k3U33U33UkCk..',
    '....kUkUkkUkZkCk..',
    '....kDDDDDwDDk....',
    '....kDwk..kDDk....',
    '...k))Lk..k))Lk...',
  ],
  scratch_a: [
    '..................',
    '...kk.....k.k.kk..',
    '..kSMk..kk-k-k33k.',
    '.kSSMk.k-+k+-+U3k.',
    '.kSMOkk+-+++-+kkkk',
    '..kkkk+-++++-+-kCk',
    '...klk++-+-+++-kCk',
    '...klk+C+CC+C+CkCk',
    '...klkCCkCCCkCCk3k',
    '...klkCCkCCCkCCkUk',
    '...klk*C*CCC*C*k3k',
    '...klkkCCCUCCCkkUk',
    '...kCCk33UC3U3k.3k',
    '...kCCk33U33U3kkUk',
    '..kUUkZUUZUUZUUUUk',
    '...kkkU33U33Uk....',
    '....k3U33U33Uk....',
    '....kUkUkkUkZk....',
    '....kDDDDDwDDk....',
    '....kDwk..kDDk....',
    '...k))Lk..k))Lk...',
  ],
  scratch_b: [
    '..................',
    '...kk.....k.k.kk..',
    '..kSMk..kk-k-k33k.',
    '.kSSMk.k-+k+-+U3kk',
    '.kSMOkk+-+++-+kkCk',
    '..kkkk+-++++-+-kCk',
    '...klk++-+-+++-kCk',
    '...klk+C+CC+C+CkUk',
    '...klkCCkCCCkCCk3k',
    '...klkCCkCCCkCCkUk',
    '...klk*C*CCC*C*k3k',
    '...klkkCCCUCCCkkUk',
    '...kCCk33UC3U3k.3k',
    '...kCCk33U33U3kkUk',
    '..kUUkZUUZUUZUUUUk',
    '...kkkU33U33Uk....',
    '....k3U33U33Uk....',
    '....kUkUkkUkZk....',
    '....kDDDDDwDDk....',
    '....kDwk..kDDk....',
    '...k))Lk..k))Lk...',
  ],
};
