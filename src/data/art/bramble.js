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
  // Big and toothy.
  grin: { patches: [[20, 14, 'smmmmmmms'], [21, 14, 'smEEEEEms'], [22, 14, 'ssmmmmmss']] },
  // Laughing, eyes squeezed shut.
  glee: { closed: true, patches: [[14, 12, 'sss'], [15, 12, 'sks'], [16, 12, 'ksk'], [17, 12, 'sss'], [14, 22, 'sss'], [15, 22, 'sks'], [16, 22, 'ksk'], [17, 22, 'sss'], [20, 14, 'smmmmmmms'], [21, 14, 'smoooooms'], [22, 14, 'ssmnnnmss'], [19, 10, 'bbb'], [19, 24, 'bbb'], [18, 10, 'b'], [18, 26, 'b']] },
  // Chin up, eyes shut, very pleased with himself.
  proud: { closed: true, patches: [[14, 12, 'sss'], [15, 12, 'sss'], [16, 12, 'kkk'], [17, 12, 'sss'], [14, 22, 'sss'], [15, 22, 'sss'], [16, 22, 'kkk'], [17, 22, 'sss'], [13, 12, 'kk'], [13, 23, 'kk'], [18, 17, 'SsS'], [20, 14, 'ssssssssm'], [21, 14, 'smmmmmmms'], [22, 14, 'sssssssss']] },
  // Brows down, mouth set.
  determined: { patches: [[13, 12, 'kk'], [13, 23, 'kk'], [14, 12, 'kkk'], [14, 22, 'kkk'], [14, 14, 'k'], [14, 22, 'k'], [20, 14, 'sssssssss'], [21, 14, 'ssmmmmmss'], [22, 14, 'sssssssss']] },
  // Glaring, teeth gritted.
  angry: { patches: [[13, 11, 'kk'], [13, 24, 'kk'], [14, 12, 'skk'], [14, 22, 'kks'], [15, 12, 'eEk'], [15, 22, 'kEi'], [20, 14, 'smmmmmmms'], [21, 14, 'sEkEkEkEs'], [22, 14, 'smmmmmmms'], [19, 11, 'bb'], [19, 24, 'bb'], [18, 10, 'b'], [18, 26, 'b']] },
  // HOLLERING: eyes screwed up, mouth enormous.
  shout: { closed: true, patches: [[14, 12, 'sss'], [15, 12, 'kss'], [16, 12, 'skk'], [17, 12, 'kss'], [14, 22, 'sss'], [15, 22, 'ssk'], [16, 22, 'kks'], [17, 22, 'ssk'], [13, 11, 'kk'], [13, 24, 'kk'], [19, 14, 'smmmmmmms'], [20, 14, 'mooooooom'], [21, 14, 'monnnnnom'], [22, 14, 'smmmmmmms']] },
  // Eyes wide, mouth an O.
  surprised: { patches: [[13, 12, 'kkk'], [13, 22, 'kkk'], [14, 12, 'EeE'], [14, 22, 'EeE'], [15, 12, 'EeE'], [15, 22, 'EeE'], [16, 12, 'sss'], [16, 22, 'sss'], [17, 12, 'sss'], [17, 22, 'sss'], [20, 14, 'sssmmmsss'], [21, 14, 'ssmooomss'], [22, 14, 'ssmooomss'], [23, 14, 'sssmmmsss']] },
  // Eyes wide, brows up, mouth wobbling, a bead of sweat.
  scared: { patches: [[12, 12, 'ss'], [12, 23, 'ss'], [13, 12, 'kkk'], [13, 22, 'kkk'], [14, 12, 'EeE'], [14, 22, 'EeE'], [15, 12, 'EeE'], [15, 22, 'EeE'], [16, 12, 'sss'], [16, 22, 'sss'], [17, 12, 'sss'], [17, 22, 'sss'], [20, 14, 'sssssssss'], [21, 14, 'ssmsmsmss'], [22, 14, 'sssmsmsss'], [14, 26, 't'], [15, 26, 't']] },
  // Brows up in the middle, mouth wobbling.
  worried: { patches: [[13, 13, 'kk'], [13, 22, 'kk'], [14, 12, 'kss'], [14, 22, 'ssk'], [20, 14, 'sssssssss'], [21, 14, 'ssmsmsmss'], [22, 14, 'sssmsmsss']] },
  // Eyes down, a frown.
  sad: { patches: [[13, 13, 'kk'], [13, 22, 'kk'], [14, 12, 'kss'], [14, 22, 'ssk'], [15, 12, 'kkk'], [15, 22, 'kkk'], [20, 14, 'sssssssss'], [21, 14, 'sssmmmsss'], [22, 14, 'ssmsssmss']] },
  // Tears running down both cheeks.
  crying: { patches: [[13, 13, 'kk'], [13, 22, 'kk'], [14, 12, 'kss'], [14, 22, 'ssk'], [15, 12, 'kkk'], [15, 22, 'kkk'], [16, 12, 'iTi'], [16, 22, 'iTi'], [18, 12, 't'], [19, 12, 't'], [20, 11, 't'], [18, 24, 't'], [19, 24, 't'], [20, 25, 't'], [20, 14, 'sssssssss'], [21, 14, 'ssmmmmmss'], [22, 14, 'smoooooms'], [23, 14, 'ssmmmmmss']] },
  // Caught out: looking away, red in the face, a drop of sweat.
  sheepish: { patches: [[13, 13, 'kk'], [13, 22, 'kk'], [15, 12, 'Eie'], [15, 22, 'Eie'], [11, 27, 't'], [12, 27, 't'], [20, 14, 'sssssssms'], [21, 14, 'smmmmmmss'], [22, 14, 'sssssssss'], [19, 10, 'bbb'], [19, 24, 'bbb'], [18, 10, 'b'], [18, 26, 'b']] },
  // Half-shut eyes slid sideways, and a smirk.
  sly: { patches: [[14, 12, 'sss'], [15, 12, 'kkk'], [16, 12, 'iie'], [17, 12, 'iie'], [14, 22, 'sss'], [15, 22, 'kkk'], [16, 22, 'iie'], [17, 22, 'iie'], [13, 22, 'kk'], [20, 14, 'sssssssms'], [21, 14, 'ssmmmmmss'], [22, 14, 'sssssssss']] },
  // Looking off to one side, mouth pulled over.
  thinking: { patches: [[13, 22, 'kk'], [15, 12, 'iEe'], [15, 22, 'iEe'], [16, 12, 'iie'], [16, 22, 'iie'], [20, 14, 'sssssssss'], [21, 14, 'sssssmmms'], [22, 14, 'sssssssss']] },
  // Heavy eyelids, flat mouth.
  bored: { patches: [[14, 12, 'sss'], [15, 12, 'kkk'], [16, 12, 'iIi'], [17, 12, 'eii'], [14, 22, 'sss'], [15, 22, 'kkk'], [16, 22, 'iIi'], [17, 22, 'eii'], [20, 14, 'sssssssss'], [21, 14, 'sssmmmsss'], [22, 14, 'sssssssss']] },
  // Eyes shining, mouth a little o.
  awed: { patches: [[13, 12, 'kkk'], [13, 22, 'kkk'], [14, 12, 'eEi'], [14, 22, 'eEi'], [15, 12, 'iEI'], [15, 22, 'iEI'], [16, 12, 'eiE'], [16, 22, 'eiE'], [17, 12, 'sss'], [17, 22, 'sss'], [20, 14, 'sssssssss'], [21, 14, 'sssmomsss'], [22, 14, 'ssssmssss'], [19, 11, 'bb'], [19, 24, 'bb'], [18, 10, 'b'], [18, 26, 'b']] },
  // Eyes nearly shut, shadows under them.
  tired: { patches: [[14, 12, 'sss'], [15, 12, 'sss'], [16, 12, 'kkk'], [17, 12, 'eii'], [14, 22, 'sss'], [15, 22, 'sss'], [16, 22, 'kkk'], [17, 22, 'eii'], [20, 14, 'sssssssss'], [21, 14, 'sssmmmsss'], [22, 14, 'sssssssss'], [18, 12, 'S'], [18, 24, 'S']] },
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
// drain grating): on hands and knees, the hatchet strapped across his back.
// 16x13, two frames each way ('bramble_crawl_left', _right, _down, _up);
// Player.currentFrame shows them while he squeezes through.
export const BRAMBLE_CRAWL_LEFT_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_LEFT_SPRITES = {
  a: [
    '........kk......',
    '.......kMSk.....',
    '.......kMSk.....',
    '...kk.k.kOk.....',
    '..k-+kk+klk.....',
    '.k+-+-++-lkkkk..',
    'k-+-++-+kl33U3kk',
    'k+C+C++kU33U33Uk',
    'kCkCC+kZUUZUUZUk',
    'kCCC*kU33U33UDDk',
    '.kkkkk3kkkkkkDwk',
    '.kCCk.kCk..kDD)k',
    '.kkk..kkk..k)))k',
  ],
  b: [
    '........kk......',
    '.......kMSk.....',
    '.......kMSk.....',
    '...kk.k.kOk.....',
    '..k-+kk+klk.....',
    '.k+-+-++-lkkkk..',
    'k-+-++-+kl33U3kk',
    'k+C+C++kU33U33Uk',
    'kCkCC+kZUUZUUZUk',
    'kCCC*kU33U33UDDk',
    '.kkkkk3kkkkkkDwk',
    '...kCCk..kDDk)k.',
    '...kkkk..k)))k..',
  ],
};
export const BRAMBLE_CRAWL_RIGHT_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_RIGHT_SPRITES = {
  a: [
    '......kk........',
    '.....kSMk.......',
    '.....kSMk.......',
    '.....kOk.k.kk...',
    '.....klk+kk+-k..',
    '..kkkkl-++-+-+k.',
    'kk3U33lk+-++-+-k',
    'kU33U33Uk++C+C+k',
    'kUZUUZUUZk+CCkCk',
    'kDDU33U33Uk*CCCk',
    'kwDkkkkkk3kkkkk.',
    'k)DDk..kCk.kCCk.',
    'k)))k..kkk..kkk.',
  ],
  b: [
    '......kk........',
    '.....kSMk.......',
    '.....kSMk.......',
    '.....kOk.k.kk...',
    '.....klk+kk+-k..',
    '..kkkkl-++-+-+k.',
    'kk3U33lk+-++-+-k',
    'kU33U33Uk++C+C+k',
    'kUZUUZUUZk+CCkCk',
    'kDDU33U33Uk*CCCk',
    'kwDkkkkkk3kkkkk.',
    '.k)kDDk..kCCk...',
    '..k)))k..kkkk...',
  ],
};
export const BRAMBLE_CRAWL_DOWN_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_DOWN_SPRITES = {
  a: [
    '...........kk...',
    '...k.k.kk.kMSk..',
    '..k-k+k-+kkMSk..',
    '.k+-+++-+-+klk..',
    '.k-+-++-+++-+k..',
    '.k+C+C++C+C++k..',
    '.kCCkCCCkCCCkk..',
    '.k*CCCUCCC*Ck...',
    '..kkCCCCCCCkk...',
    '.k33kUZUUZUk3k..',
    '.kCCk33U33UkCk..',
    '.kCCkkkkkkkkCCk.',
    '..kk........kk..',
  ],
  b: [
    '...........kk...',
    '...k.k.kk.kMSk..',
    '..k-k+k-+kkMSk..',
    '.k+-+++-+-+klk..',
    '.k-+-++-+++-+k..',
    '.k+C+C++C+C++k..',
    '.kCCkCCCkCCCkk..',
    '.k*CCCUCCC*Ck...',
    '..kkCCCCCCCkk...',
    '.k3kUZUUZUk33k..',
    '.kCkU33U33kCCk..',
    '.kCCkkkkkkkkCCk.',
    '..kk........kk..',
  ],
};
export const BRAMBLE_CRAWL_UP_PALETTE = BRAMBLE_PALETTE;
export const BRAMBLE_CRAWL_UP_SPRITES = {
  a: [
    '............kk..',
    '...k.k.kk..kMSk.',
    '..k-k+k-+k.kMSk.',
    '.k+-+++-+-kklk..',
    '.k-+-++-+++lk...',
    '.k+/++-++/lk3k..',
    '.k3U33U33lU33k..',
    '.kUZUUZUlZUUZk..',
    '.k3U33UlU33U3k..',
    '..kDDDlDDwDDk...',
    '..kDDkkkkDDDk...',
    '.k)))k..k)))Lk..',
    '.kLLLk..kLLLk...',
  ],
  b: [
    '............kk..',
    '...k.k.kk..kMSk.',
    '..k-k+k-+k.kMSk.',
    '.k+-+++-+-kklk..',
    '.k-+-++-+++lk...',
    '.k+/++-++/lk3k..',
    '.k3U33U33lU33k..',
    '.kUZUUZUlZUUZk..',
    '.k3U33UlU33U3k..',
    '..kDDDlDDwDDk...',
    '..kDDDkkkDDDk...',
    '..k)))Lk.k)))k..',
    '..kLLLk..kLLLk..',
  ],
};
