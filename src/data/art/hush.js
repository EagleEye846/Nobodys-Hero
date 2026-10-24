// THE HUSH, the beast of the Hushwood, in battle (src/data/enemies/the_hush.js).
// A demon boar on all fours, too big for the stage: its rump runs off the
// right edge, its head comes in low toward you. Black as the inside of a
// chimney, a hump of shoulders higher than its head, a cape of jagged
// bristles down its back, a horn hooking up and back off a brow like a
// shelf of bone, tusks curving up past its snout, spit hanging off its jaw,
// one ember of an eye sunk deep under the brow. Something that doesn't mind
// axes: three woodcutters' axes are buried in its hump (one snapped short),
// arrows sit in its shoulder to the feathers, a boar-spear is snapped off in
// its flank, and a steel trap is still clamped on its foreleg, its chain
// broken. In its jaws, crosswise, Ves's umbrella, furled: her mother's,
// plum, with its hooked handle. 76x64, drawn at double size like every
// enemy.
//   HUSH_SPRITE        hunting, the umbrella in its jaws, the eye narrow
//   HUSH_LOOSE_SPRITE  the umbrella knocked loose
//   HUSH_FREE_SPRITE   head up a little, jaws parted, the eye wide
//   HUSH_REAR_SPRITE   its entrance: head right down, hackles up, umbrella in its jaws
//   HUSH_ROAR_SPRITE   the rage: head flung up, jaws wide, every bristle up

export const HUSH_PALETTE = {
  k: '#0a0610', // outline
  Z: '#120d16', // bristles, the mane
  z: '#2a2030', // bristles, a lighter streak
  x: '#4a3c52', // bristle tips, catching the light
  a: '#1e1622', // hide in shadow
  b: '#2e2432', // hide
  c: '#433846', // hide, lit
  d: '#5e5060', // the light along its hump
  u: '#5a3a2e', // the umber shag on its chest
  U: '#3a241e', // umber in shadow
  i: '#d6c9a8', // tusks, horns, hooves
  I: '#8e7f62', // bone in shadow
  j: '#f4ecd6', // bone, lit
  n: '#5e3c3c', // the snout
  N: '#341e22', // nostrils, the clefts of its hooves
  m: '#12060a', // mouth
  p: '#6a1e2c', // gums and tongue
  y: '#a8b8c4', // spit, hanging
  r: '#8a5a58', // old scars
  e: '#e8862c', // its eyes, embers
  E: '#fff0b0', // eyeshine
  o: '#7a2c14', // the glow round its eyes
  s: '#100406', // the dark round its eyes
  g: '#7e8694', // axe steel
  G: '#4c5260', // steel in shadow
  w: '#cdd4de', // a bright nick on the edge
  R: '#6e3420', // rust
  h: '#6a4426', // old wood: axe handles, a spear shaft
  l: '#9a6a3e', // wood, lit
  f: '#b8ae96', // arrow fletching
  q: '#7a3a5e', // the umbrella, plum
  Q: '#5a2846', // its folds
  T: '#9a5a80', // its folds, lit
  H: '#c08a4e', // the umbrella's handle
};

// Hunting, with the umbrella in its jaws: head low, the eyes narrow.
export const HUSH_SPRITE = [
  '....................................k.......................................',
  '...................................kk.....k.................................',
  '...................................kk.k..kk.................................',
  '..............................k...kk.kk..kk.................................',
  '.............................kk.k.kk.kk.kk..k...............................',
  '.............................kkkZkhhkk..kk.kk..k............................',
  '............................kk.kZZzhlk.kzk.kk.kk............................',
  '............................kZkzZZzhlk.kk.kk..kk............................',
  '..........................kkzZzZZzhhzZkzk.kk.kk.............................',
  '.........................kZZzZzZZhlZzZZzZkzk.kk...k.........................',
  '.........................kZzZZzZZhlZzZZzZZzZkzk..kk.......................k.',
  '........................kZZzZZZZzhhzZZzZZZzZZzk..kk......................kk.',
  '.......................kzZZZZzZZhlZzZZzZZzZZZzk.kk..............kkkk.....kk.',
  '.......................kZZzZZZZhlZZZZZZZZzZZzZkkzk...k.....k....khhk..k.kk.k',
  '......................kZZZZZwgghhZZZZZZZZZZZzk.kzk..kk....kk.k.khlkk.kZkzk.k',
  '......................kZZZZZGggggGZZZZZZZZZZzZklzk..kk....kkkk.klkzkkzZZzZkk',
  '.....................kZZZZZZGGGGGRddcZZZZZZZZZlzk..kk....kk.kZkhhZk.kzZZzZZk',
  '....................kZZZZZZZGGGGRGdddddccZZZZZhhk..kk..kkzZkzZhlZzZkzZZzZZZk',
  '...................kZZZZZddddddddddddddcZZZZZZhlk.kzk.kZZzZZzZhlZzZZzZZzZZzk',
  '...................kZZZZZcddddddddddccccccccZhlZk.kzk.kZZzwgghhZZZZZZZZZZZzk',
  '..................kbccccccccccccccccccccccwgghhkZkZzkkzZzZGggggGZZZZZZZZZZZk',
  '.................kbbbcccciiiffZZccccccccccGggggGkZzk.kZZZZGGGGGRZZZZZZZZZZZk',
  '.................kbbbbiiiiiihfZZcccccccccbGGGGGRkZzZkZZZZZGGGGRGccccccZZZZZk',
  '................kbbbbiiiiihhfiiiccccccbbbbGGGGRGZZZZZZZZZZZZZZZZccccccccbbZk',
  '................kbbbiiiihhibbbbbbbbbbbbbbbbbbbbZZZZZZZZZZZccccccccccccccbZZk',
  '................kbbjiihhbbbbbbbbbbbbbbbbbbbbbbZZZZZZZZZccccccccccccccccbbbbk',
  '...............kbbbjiiIbbbbbbbffIbbbbbbbbbbbbbbbbbZZZZZbccccccccccccbbbbbbbk',
  '...............kbbjiiiIbbbbbIhhfIbbbbbbbbbbbbbbbbZZZZZZbbbbbbbbbbbbbbbbbbbbk',
  '...............kbbjiiIbbbbbhhIfbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiiIbbbhhIIbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbbIIbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIIbbbabbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIbbaaabbbbbbbbbbbbbbrbbbbbbbbbbbbbbhbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIaaaaabbbbbbbbbbbbbbbbrbbbbbbbbrbblbbbbbbbbbbbbbbk',
  '.............kkbbjiiIbbbIIIaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbk',
  '..........kkkbbbbjiiIbbbIIaaaaabbbbbbbbbbbbbbbbbbbrbbbbbbbhlbbbbbbbbbbbbbbbk',
  '........kkbbbbbbbiiiIrbbIIbaaaabbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbk',
  '...k..kkbbbbbbbbbbiiibbbIIbbbbabbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbk',
  '..k..kbbbbbbbbbbbaaaaarabbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbk',
  '.kikkbbbbbaaaaaaaZZZZZZbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbbk',
  '.kiikbbbbbbZZZZZZbbbbbrbbbbbbbbbbbbbbbrbbbbbbbbbbbbgGGbbbbbbbbbbbbbbbbbbbbbk',
  '.kiibbbesbbbsssssssbbbbbbbbbbbbbbbbbbbbbraaaaaaaaaaaGGaaaaaabbbbbbbbbbbbbbbk',
  'kiiibbbbbbbbsssssssobbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbk',
  'kjiibbbbbbbosEeeeesbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbk',
  'kjikbbbbbbbbsssssssbbbbrbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbk',
  'kijbbbbbbbbiibbobbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbk',
  'kinnnnbbbbbIIbbbbbbbbbbbrbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbak',
  'kinnnnbbbbbIIIbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaak',
  '.kNnnnbbbbbbIIbbbbbbbbHHbrbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakaabaaaaak',
  '.knNnnbbbbbbIIbbbbbbbbbbHbbbbbbbbbbkaaaaaaaaaaaaaaaaaaaaaaaaaaakkk.kaaaaaaak',
  '.kNnnnjjbbbbIIIIbbbbbbbbHbbbbbbbbbk.kaaaaaaaaakkkkkkkaaaaaaabbk....kaaaaaaak',
  'kTnnnnTTTTTTTTqqqqqbbbbHbbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  'kqnnnnqqqqqqqqqqqqqhhhHaabbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  'kkkkkmmmjmmmjmmmjmmmaaaabbbbbbbbbbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.....kaiIIyIiiiiaaaaaaawGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.....kaaaayiiiiiaaaaaaakGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '......kkkkykkkkkkkkkkkk.kkgbgbgbgbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '..........y............kGGGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '..........y............kkkGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '..........y...............kbbbbbbbk..kGaaaaak..........kbbbbbbk......kaaaaak',
  '..........................kbbbbbbkk..kaaaaaak..........kbbbbbbk......kaaaaak',
  '...........................kiiiik.....kiiiik............kiiiik........kiiiik',
  '...........................kiiNik.....kiiNik............kiiNik........kiiNik',
  '...........................kkkkkk.....kkkkkk............kkkkkk........kkkkkk',
];

// The umbrella knocked loose: still hunting, head low, jaws open and empty.
export const HUSH_LOOSE_SPRITE = [
  '....................................k.......................................',
  '...................................kk.....k.................................',
  '...................................kk.k..kk.................................',
  '..............................k...kk.kk..kk.................................',
  '.............................kk.k.kk.kk.kk..k...............................',
  '.............................kkkZkhhkk..kk.kk..k............................',
  '............................kk.kZZzhlk.kzk.kk.kk............................',
  '............................kZkzZZzhlk.kk.kk..kk............................',
  '..........................kkzZzZZzhhzZkzk.kk.kk.............................',
  '.........................kZZzZzZZhlZzZZzZkzk.kk...k.........................',
  '.........................kZzZZzZZhlZzZZzZZzZkzk..kk.......................k.',
  '........................kZZzZZZZzhhzZZzZZZzZZzk..kk......................kk.',
  '.......................kzZZZZzZZhlZzZZzZZzZZZzk.kk..............kkkk.....kk.',
  '.......................kZZzZZZZhlZZZZZZZZzZZzZkkzk...k.....k....khhk..k.kk.k',
  '......................kZZZZZwgghhZZZZZZZZZZZzk.kzk..kk....kk.k.khlkk.kZkzk.k',
  '......................kZZZZZGggggGZZZZZZZZZZzZklzk..kk....kkkk.klkzkkzZZzZkk',
  '.....................kZZZZZZGGGGGRddcZZZZZZZZZlzk..kk....kk.kZkhhZk.kzZZzZZk',
  '....................kZZZZZZZGGGGRGdddddccZZZZZhhk..kk..kkzZkzZhlZzZkzZZzZZZk',
  '...................kZZZZZddddddddddddddcZZZZZZhlk.kzk.kZZzZZzZhlZzZZzZZzZZzk',
  '...................kZZZZZcddddddddddccccccccZhlZk.kzk.kZZzwgghhZZZZZZZZZZZzk',
  '..................kbccccccccccccccccccccccwgghhkZkZzkkzZzZGggggGZZZZZZZZZZZk',
  '.................kbbbcccciiiffZZccccccccccGggggGkZzk.kZZZZGGGGGRZZZZZZZZZZZk',
  '.................kbbbbiiiiiihfZZcccccccccbGGGGGRkZzZkZZZZZGGGGRGccccccZZZZZk',
  '................kbbbbiiiiihhfiiiccccccbbbbGGGGRGZZZZZZZZZZZZZZZZccccccccbbZk',
  '................kbbbiiiihhibbbbbbbbbbbbbbbbbbbbZZZZZZZZZZZccccccccccccccbZZk',
  '................kbbjiihhbbbbbbbbbbbbbbbbbbbbbbZZZZZZZZZccccccccccccccccbbbbk',
  '...............kbbbjiiIbbbbbbbffIbbbbbbbbbbbbbbbbbZZZZZbccccccccccccbbbbbbbk',
  '...............kbbjiiiIbbbbbIhhfIbbbbbbbbbbbbbbbbZZZZZZbbbbbbbbbbbbbbbbbbbbk',
  '...............kbbjiiIbbbbbhhIfbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiiIbbbhhIIbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbbIIbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIIbbbabbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIbbaaabbbbbbbbbbbbbbrbbbbbbbbbbbbbbhbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIaaaaabbbbbbbbbbbbbbbbrbbbbbbbbrbblbbbbbbbbbbbbbbk',
  '.............kkbbjiiIbbbIIIaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbk',
  '..........kkkbbbbjiiIbbbIIaaaaabbbbbbbbbbbbbbbbbbbrbbbbbbbhlbbbbbbbbbbbbbbbk',
  '........kkbbbbbbbiiiIrbbIIbaaaabbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbk',
  '...k..kkbbbbbbbbbbiiibbbIIbbbbabbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbk',
  '..k..kbbbbbbbbbbbaaaaarabbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbk',
  '.kikkbbbbbaaaaaaaZZZZZZbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbbk',
  '.kiikbbbbbbZZZZZZbbbbbrbbbbbbbbbbbbbbbrbbbbbbbbbbbbgGGbbbbbbbbbbbbbbbbbbbbbk',
  '.kiibbbesbbbsssssssbbbbbbbbbbbbbbbbbbbbbraaaaaaaaaaaGGaaaaaabbbbbbbbbbbbbbbk',
  'kiiibbbbbbbbsssssssobbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbk',
  'kjiibbbbbbbosEeeeesbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbk',
  'kjikbbbbbbbbsssssssbbbbrbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbk',
  'kijbbbbbbbbiibbobbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbk',
  'kinnnnbbbbbIIbbbbbbbbbbbrbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbak',
  'kinnnnbbbbbIIIbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaak',
  '.kNnnnbbbbbbIIbbbbbbbbbbbrbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakaabaaaaak',
  '.knNnnbbbbbbIIbbbbbbbbbbbbbbbbbbbbbkaaaaaaaaaaaaaaaaaaaaaaaaaaakkk.kaaaaaaak',
  '.kNnnnjjbbbbIIIIbbbbbbbbbbbbbbbbbbk.kaaaaaaaaakkkkkkkaaaaaaabbk....kaaaaaaak',
  '..nnnniijbbbbIIIIIbbbbbbbbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '..nnnniiiiiiiaaIIIIIaaaaabbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '...kkmmmjmmmjmmmjmmmaaaabbbbbbbbbbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.....kaiIIyIiiiiaaaaaaawGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.....kaaaayiiiiiaaaaaaakGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '......kkkkykkkkkkkkkkkk.kkgbgbgbgbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '..........y............kGGGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '..........y............kkkGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '..........y...............kbbbbbbbk..kGaaaaak..........kbbbbbbk......kaaaaak',
  '..........................kbbbbbbkk..kaaaaaak..........kbbbbbbk......kaaaaak',
  '...........................kiiiik.....kiiiik............kiiiik........kiiiik',
  '...........................kiiNik.....kiiNik............kiiNik........kiiNik',
  '...........................kkkkkk.....kkkkkk............kkkkkk........kkkkkk',
];

// Free of the umbrella (its last phases): head up, ears pricked, eyes wide.
export const HUSH_FREE_SPRITE = [
  '....................................k.....k.................................',
  '...................................kk..k.kk.................................',
  '..............................k....kk.kk.kk.................................',
  '.............................kk.k.kk..k.kk..k...............................',
  '.............................kkkk.kk.kk.kk.kk...k...........................',
  '............................kk.kkkhhkhZkzk.kk..kk...........................',
  '............................kZkk.kzhlzZZzkkk...kk...........................',
  '..........................kkzZzZkZkhlzZZk.kk..kk............................',
  '.........................kZZzZzZZzhhzZZzZkzk..kk..k.........................',
  '.........................kZZzZzZZhlZzZZzZZzk.kzk.kk.......................k.',
  '........................kzZzZZzZZhlZzZZzZZzk.kk..kk......................kk.',
  '........................kZZzZZZZzhhzZZzZZZzZkzk.kk.......................kk.',
  '.......................kzZZZZzZZhlZzZZzZZzZZZzk.kk...k.....k....kkkk..k.kk.k',
  '......................kZZZzZZZZhlZZZZZZZZzZZZzZkzk..kk....kk.k..khhk.kk.kk.k',
  '......................kZZZZZwgghhZZZZZZZZZZZzZZZzk..kk....kkkk..klzZkzZkzZkk',
  '.....................kZZZZZZGggggGZZZZZZZZZZzZZlzk.kk....kk.kk.klZzZZzZZzZZk',
  '.....................kZZZZZZGGGGGRddcZZZZZZZZZlzk..kk...kzZkzkkhhZzZzZZZzZZk',
  '....................kZZZZZZZGGGGRGdddddccZZZZZhhk.kzk..kZzZZk.klZzZZzZZzZZZk',
  '...................kZZZZZddddddddddddddcZZZZZZhlk.kzk..kZzZzZkhlZzZZzZZzZZzk',
  '...................kZZZZZiiiiiZZddddccccccccZhlZZkZzk.kZZZwgghhZZZZZZZZZZZzk',
  '..................kbcciiiiiiiiZZccccccccccwgghhkZZzZkkZZzZGggggGZZZZZZZZZZZk',
  '.................kbbbiiiiiIiffiiccccccccccGggggGkZzk.kZZZZGGGGGRZZZZZZZZZZZk',
  '.................kbbiiiiIIichfcccccccccccbGGGGGRkZzZkZZZZZGGGGRGccccccZZZZZk',
  '................kbbjiiiIbbhhfcccccccccbbbbGGGGRGZZZZZZZZZZZZZZZZccccccccbbZk',
  '................kbbjiiIbhhbbbbIIIbbbbbbbbbbbbbbZZZZZZZZZZZccccccccccccccbZZk',
  '................kbjiiihhbbbbIIIIIbbbbbbbbbbbbbZZZZZZZZZccccccccccccccccbbbbk',
  '...............kbbjiiIbbbbbIIIffbbbbbbbbbbbbbbbbbbZZZZZbccccccccccccbbbbbbbk',
  '...............kbjiiiIbbbbIIIhhfbbbbbbbbbbbbbbbbbZZZZZZbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbbIhhbfbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbhhIbbbabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIbbaaabbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbIIaaaaabbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbk',
  '.............kkbbjiiIbbbIIIaaaaabbbbbbbbbbbbbbrbbbbbbbbbbbbbbhbbbbbbbbbbbbbk',
  '..........kkkbbbbjiiIbbbIIaaaaabbbbbbbbbbbbbbbbbrbbbbbbbbrbblbbbbbbbbbbbbbbk',
  '........kkbbbbbbbiiiIrbbIIbaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbk',
  '...k..kkbbbbbbbbbbiiibbbIIbbbbabbbbbbbbbbbbbbbbbbbrbbbbbbbhlbbbbbbbbbbbbbbbk',
  '..k..kbbbbbbbbbbbaaaaarabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbk',
  '.kikkbbbbbaaaaaaaZZZZZZbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbk',
  '.kiikbbbbbbZZZZZZbbbbbrbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbk',
  '.kiibbbesbbbseEEeesbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbbk',
  'kiiibbbbbbbbseeeeesobbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbgGGbbbbbbbbbbbbbbbbbbbbbk',
  'kjiibbbbbbboseeesesbbbbbbbbbbbbbbbbbbbbbraaaaaaaaaaaGGaaaaaabbbbbbbbbbbbbbbk',
  'kjikbbbbbbbbseeeeesbbbbrbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbk',
  'kijbbbbbbbbiibbobbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbk',
  'kinnnnbbbbbIIbbbbbbbbbbbrbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbk',
  'kinnnnbbbbbIIIbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbk',
  '.kNnnnbbbbbbIIbbbbbbbbbbbrbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbak',
  '.knNnnbbbbbbIIbbbbbbbbbbbbbbbUbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaak',
  '.kNnnnjjbbbbIIIIbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakaabaaaaak',
  '..nnnniijbbbbIIIIIbbbbbbbbbbbbbbbbbkaaaaaaaaaaaaaaaaaaaaaaaaaaakkk.kaaaaaaak',
  '..nnnniiiiiiiaaIIIIIaaaaabbbbbbbbbk.kaaaaaaaaakkkkkkkaaaaaaabbk....kaaaaaaak',
  '...kkmmmjmmmjmmmjmmmaaaabbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '.....kaiIIyIiiiiaaaaaaaabbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '.....kaaaayiiiiiaaaaaaakbbbbbbbbbbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '......kkkkykkkkkkkkkkkkwGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '..........y............kGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '..........y.............kkgbgbgbgbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '..........y............kGGGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '.......................kkkGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '..........................kbbbbbbbk..kGaaaaak..........kbbbbbbk......kaaaaak',
  '..........................kbbbbbbkk..kaaaaaak..........kbbbbbbk......kaaaaak',
  '...........................kiiiik.....kiiiik............kiiiik........kiiiik',
  '...........................kiiNik.....kiiNik............kiiNik........kiiNik',
  '...........................kkkkkk.....kkkkkk............kkkkkk........kkkkkk',
];

// Head right down, hackles up, the umbrella still in its jaws: how it meets you.
export const HUSH_REAR_SPRITE = [
  '...............................k....k..k..k.................................',
  '..............................kk.k.kk.kk.kk..k..............................',
  '..............................k.kk.kk.kk.kk.kk..k...........................',
  '.............................kk.kkkk.kk.kk..kk.kk...........................',
  '.............................kZkk.kk.kk.kk.kk..kk...........................',
  '...........................kkzZzZkhhkhZkzk.kk.kk............................',
  '..........................kZZzZzZZzhlzZZzkkzk.kk...k........................',
  '..........................kZzZZzZZzhlZZZk.kzkkzk..kk.......................k',
  '.........................kzZzZzZZzhhzZZzZkzk.kzk..k.......................kk',
  '.........................kZZzZzZZhlZzZZzZZzZkZk..kk.......................k.',
  '........................kzZzZZzZZhlZzZZzZZzZZzk..kk...k.....k............kk.',
  '........................kZZzZZZZzhhzZZzZZZzZZzk.kzk..kk....kk....k.k..k..kZk',
  '.......................kzZZZZzZZhlZzZZzZZzZZZzk.kzk..kk....kk.k.khkk.kk.kzZk',
  '......................kZZZzZZZZhlZZZZZZZZzZZZzZkzk..kk....kk.kk.khhk.kk.kzZk',
  '......................kZZZZZwgghhZZZZZZZZZZZzZZZzk..kk....kk.kkkhlzkkzZkzZZk',
  '.....................kZZZZZZGggggGZZZZZZZZZZzZZlzk.kzk..kkzZkk.klZk.kzZZzZZk',
  '.....................kZZZZZZGGGGGRddcZZZZZZZZZlzZk.kzk.kZZzZzZkhhzZkzZZZzZZk',
  '....................kZZZZZZZGGGGRGdddddccZZZZZhhk.kZk..kZzZZzZhlZzZZzZZzZZZk',
  '...................kZZZZZddddddddddddddcZZZZZZhlk.kzk.kZZzZZzZhlZzZZzZZzZZzk',
  '...................kZZZZZcddddddddddccccccccZhlZZkZzk.kZZzwgghhZZZZZZZZZZZzk',
  '..................kbccccccccccccccccccccccwgghhkZZZzZkZZzZGggggGZZZZZZZZZZZk',
  '.................kbbbcccccccffccccccccccccGggggGkZzZZZZZZZGGGGGRZZZZZZZZZZZk',
  '.................kbbbbbccccchfcccccccccccbGGGGGRkZzZZZZZZZGGGGRGccccccZZZZZk',
  '................kbbbbbbbbbhhfcccccccccbbbbGGGGRGZZZZZZZZZZZZZZZZccccccccbbZk',
  '................kbbbbbbbhhiiiiZZbbbbbbbbbbbbbbbZZZZZZZZZZZccccccccccccccbZZk',
  '................kbbbbbhhiiiiiiZZbbbbbbbbbbbbbbZZZZZZZZZccccccccccccccccbbbbk',
  '...............kbbbbbiiiiiIiiiffbbbbbbbbbbbbbbbbbbZZZZZbccccccccccccbbbbbbbk',
  '...............kbbbbiiiiiIbbbhhfbbbbbbbbbbbbbbbbbZZZZZZbbbbbbbbbbbbbbbbbbbbk',
  '...............kbbbjiiiIIbbhhbfbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbk',
  '...............kbbbjiiIbbhhbbbIIIbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbbjiiiIbbbbbIIIIIbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...............kbbjiiIbbbbbIIIIbbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbk',
  '...............kbjiiiIbbbbIIIbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbhbbbbbbbbbbbbbk',
  '...............kbjiiIbbbbbIIbbbbbbbbbbbbbbbbbbbbrbbbbbbbbrbblbbbbbbbbbbbbbbk',
  '................kjiiIbbbbIIIbbbabbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbk',
  '................kjiiIbbbbIIbbaaabbbbbbbbbbbbbbbbbbrbbbbbbbhlbbbbbbbbbbbbbbbk',
  '................kjiiIbbbbIIaaaaabbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbk',
  '.............kkkbjiiIbbbIIIaaaaabbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbk',
  '..........kkkbbbbjiiIbbbIIaaaaabbbbbrbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbk',
  '........kkbbbbbbbiiiIrbbIIbaaaabbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbbk',
  '...k..kkbbbbbbbbbbiiibbbIIbbbbabbbbbbbrbbbbbbbbbbbbgGGbbbbbbbbbbbbbbbbbbbbbk',
  '..k..kbbbbbbbbbbbaaaaarabbbbbbbbbbbbbbbbraaaaaaaaaaaGGaaaaaabbbbbbbbbbbbbbbk',
  '.kikkbbbbbaaaaaaaZZZZZZbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbk',
  '.kiikbbbbbbZZZZZZbbbbbrbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbk',
  '.kiibbbesbbbsssssssbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbk',
  'kiiibbbbbbbbsssssssobbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbk',
  'kjiibbbbbbbosEeeeesbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbak',
  'kjikbbbbbbbbsssssssbbbbrbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaak',
  'kijbbbbbbbbiibbobbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakaabaaaaak',
  'kinnnnbbbbbIIbbbbbbbbbbbrbbbbbbbbbbkaaaaaaaaaaaaaaaaaaaaaaaaaaakkk.kaaaaaaak',
  'kinnnnbbbbbIIIbbbbbbbbbbbbbbbbbbbbk.kaaaaaaaaakkkkkkkaaaaaaabbk....kaaaaaaak',
  '.kNnnnbbbbbbIIbbbbbbbbHHbrbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '.knNnnbbbbbbIIbbbbbbbbbbHbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '.kNnnnjjbbbbIIIIbbbbbbbbHbbbbbbbbbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  'kTnnnnTTTTTTTTqqqqqbbbbHGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  'kqnnnnqqqqqqqqqqqqqhhhHGGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  'kkkkkmmmjmmmjmmmjmmmaaakgkgbgbgbgbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.....kaiiIyIiiiiaaaaaaaGGGGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '.....kaaaayiiiiiaaaaaaakkkGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '......kkkkykkkkkkkkkkkk...kbbbbbbbk..kGaaaaak..........kbbbbbbk......kaaaaak',
  '..........y...............kbbbbbbkk..kaaaaaak..........kbbbbbbk......kaaaaak',
  '..........y................kiiiik.....kiiiik............kiiiik........kiiiik',
  '..........y................kiiNik.....kiiNik............kiiNik........kiiNik',
  '...........................kkkkkk.....kkkkkk............kkkkkk........kkkkkk',
];

// Reared up and roaring, jaws wide: the rage, when the umbrella's taken off it.
export const HUSH_ROAR_SPRITE = [
  '..............................k.k..k...k..k..k..............................',
  '.............................kZkk.kk..kk.kk.kk...k..........................',
  '...........................k.kZzk.kk..kk.kk.kk..kk..........................',
  '..........................kkkzZk.kk..kk.kk.kk...k...........................',
  '..........................k.kZzk.kk..kk.kk.kk..kk...........................',
  '.........................kzkzZzZkzhkkhZkzZkzk..kk...........................',
  '.........................kZZzZzZZzkhlzZZzZZzk.kzk..k........................',
  '........................kzZzZZzZZzZhlZZZzZZzk.kk..kk.......................k',
  '........................kZZzZZzZzZhhzZZzZZzk.kzk..k.......................kk',
  '.......................kzZZZZzZZzhlZzZZzZZzk.kzk.kk...k...................k.',
  '......................kZZZzZZzZZzhlZzZZzZZzZkZzk.kk..kk.....k....k.......kk.',
  '......................kZZZZZZZZZZhhzZZzZZZzZZzk.kzk..kk....kk...kk.k..k..kZk',
  '.....................kZZZZZZZZZZhlZzZZzZZzZZZzk.kzk.kk.....kk.k.khkk.kk.kzZk',
  '.....................kZZZZZZZZZhlZZZZZZZZzZZZzZkzk..kk....kk.kZkkhhk.kk.kzZk',
  '....................kZZZZZZZwgghhZZZZZZZZZZZzZZZzk.kzk..k.kk.kZZhlzkkzZkzZZk',
  '...................kZZZZZbbbGggggGZZZZZZZZZZzZZlzk.kzk.kZkzZkzZhlZk.kzZZzZZk',
  '...................kZZZZZbddGGGGGRddcZZZZZZZZZlzZkkZk..kZZzZzZZhhzZkzZZZzZZk',
  '..................kiiiIdddddGGGGRGdddddccZZZZZhhk.kzk.kzZzZZzZhlZzZZzZZzZZZk',
  '..................kiiIcdddbIIIIbdddddddcZZZZZZhlk.kzk.kZZzZZzZhlZzZZzZZzZZzk',
  '.................kiiiIccbbIIIbbbbbddccccccccZhlZZkZzZkzZZzwgghhZZZZZZZZZZZzk',
  '.................kiiIcbbbbIIbbbbbbbbccccccwgghhkZZZzZZZZzZGggggGZZZZZZZZZZZk',
  '.................kiiIbbbbIIIffbabbbbbcccccGggggGkZzZZZZZZZGGGGGRZZZZZZZZZZZk',
  '.................kiiIbbbbIIbhfaabbbbbccccbGGGGGRkZzZZZZZZZGGGGRGccccccZZZZZk',
  '................kjiiIbbbbIhhfaaabbbbbbbbbbGGGGRGZZZZZZZZZZZZZZZZccccccccbbZk',
  '.............kkkbjiiIbbbhhIaaaaabbbbbbbbbbbbbbbZZZZZZZZZZZccccccccccccccbZZk',
  '..........kkkbbbbjiiIbhhIIaaaaabbbbbbbbbbbbbbbZZZZZZZZZccccccccccccccccbbbbk',
  '........kkbbbbbbbiiiIrbbIIbaaaffbbbbbbbbbbbbbbbbbbZZZZZbccccccccccccbbbbbbbk',
  '......kkbbbbbbbbbbiiibbbIIbbbhhfbbbbbbbbbbbbbbbbbZZZZZZbbbbbbbbbbbbbbbbbbbbk',
  '.....kbbbbbbbbbbbaaaaarabbbhhbfbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbk',
  '....kbbbbbaaaaaaaZZZZZZbbhhbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '....kbbbbbbZZZZZZbbbbbrbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk',
  '...kbbbesbbbseEEeesbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbk',
  '...kbbbbbbbbseeeeesobbbbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbhbbbbbbbbbbbbbk',
  '...kbbbbbbboseeesesbbbbbbbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbbrbblbbbbbbbbbbbbbbk',
  '...kbbbbbbbbseeeeesbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbk',
  '..kbbbbbbbbbbbbobbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbrbbbbbbbhlbbbbbbbbbbbbbbbk',
  '.knnnnbbbbbbbbbbbbbbbbbbrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbk',
  '.knnnnbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbk',
  '.kNnnnbbbbbbbbbbbbbbbbbbbrbbbbbbbbbbrbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbk',
  'kinNnnbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhlbbbbbbbbbbbbbbbbbbbk',
  'kjNnnnbbbbbbbbbbbbbbbaaaabbbbbbbbbbbbbrbbbbbbbbbbbbgGGbbbbbbbbbbbbbbbbbbbbbk',
  'kjnnnnbbbbbbbbaaaaaaaaaaabbbbbbbbbbbbbbbraaaaaaaaaaaGGaaaaaabbbbbbbbbbbbbbbk',
  'kinnnnbaaaaiimmmmmmmmaaaabbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbk',
  'kijiamjmjmjmjmjmjmjmmaaauuuuuubaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbk',
  'kiijammmmmmymmmmymmmmaaauUuUuUbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbk',
  '.kijiammmmmymmmmymmmaaaauUuUuUbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbk',
  '.kiijjmmmmmymmmymmmmaaaauUUUuUbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbak',
  '..kiiimmmmmymmmymmmmaaaaUUbbUUbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaak',
  '..kiiiimmmmympppppppaaakbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakaabaaaaak',
  '...kIiiipipipiaiIiIiaak.kbbbbbbbbbbkaaaaaaaaaaaaaaaaaaaaaaaaaaakkk.kaaaaaaak',
  '....kIIIIiiiiiiiaIIIaak.kbbbbbbbbbk.kaaaaaaaaakkkkkkkaaaaaaabbk....kaaaaaaak',
  '.....kaiiIIIiiiikkkkkkk.kbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '.....kkkkkkkkkkk........kbbbbbbbbbk.kaaaaaaaak.......kbbbbbbbbk....kaaaaaaak',
  '........................kbbbbbbbbbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.......................kGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.......................kGGGGGGGGGGGkkaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '........................kkgbgbgbgbk.kaaaaaaaak........kbbbbbbbk.....kaaaaaak',
  '.......................kGGGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '.......................kkkGGGGGGGGGk.kaaaaaak.........kbbbbbbbk.....kaaaaaak',
  '..........................kbbbbbbbk..kGaaaaak..........kbbbbbbk......kaaaaak',
  '..........................kbbbbbbkk..kaaaaaak..........kbbbbbbk......kaaaaak',
  '...........................kiiiik.....kiiiik............kiiiik........kiiiik',
  '...........................kiiNik.....kiiNik............kiiNik........kiiNik',
  '...........................kkkkkk.....kkkkkk............kkkkkk........kkkkkk',
];

// --- Its animations in battle (see `anim` in src/battle/battleScene.js),
// worked out from whichever of the sprites above it's in. It breathes, slow,
// its great shoulders rising and falling and its bristles stirring; it
// crouches and drops its head before it comes at you; a hit makes it flinch
// and shut its eyes. Beaten, it sinks low and its head goes down, and it
// goes (the battle fades it); spared, it lowers its head, shuts its eyes, and
// is gone. At the start of the fight (`intro`) it drops its head and raises
// its hackles; enraged, every attack starts with it flinging its head up and roaring.
const WIDTH = 76;
const HOOVES = 58; // from this row down, its hooves: planted, whatever the rest does
const HEAD = { from: 0, to: 26, top: 12, down: 59 }; // the head's columns, and the rows it spans
const grid = (rows) => rows.map((row) => row.split(''));
const flat = (cells) => cells.map((row) => row.join(''));

// The pixels in a box (columns x0-x1, rows y0-y1) moved down `by` rows (up,
// if negative), within the box; what's uncovered is filled from beside it.
function shifted(rows, x0, x1, y0, y1, by) {
  const g = grid(rows);
  for (let y = y0; y <= y1; y++) {
    const src = y - by;
    for (let x = x0; x <= x1; x++) g[y][x] = src >= y0 && src <= y1 ? rows[src][x] : '.';
  }
  return flat(g);
}
// Its eyes shut: the dark round them, where they were.
const shut = (rows) => rows.map((row) => row.replace(/[eE]/g, 's'));
// The bristles stirred: the lit tips go dark and the streaks catch the light.
const stirred = (rows) => rows.map((row) => row.replace(/[xz]/g, (c) => (c === 'x' ? 'Z' : 'x')));
// Breathing in: everything above the hooves rises a pixel.
const breathing = (rows) => shifted(rows, 0, WIDTH - 1, 0, HOOVES - 1, -1);
// Crouched: everything above the hooves sinks `by` pixels, its legs bending.
const crouched = (rows, by) => shifted(rows, 0, WIDTH - 1, 0, HOOVES - 1, by);
// Its head dropped `by` pixels, down into its shoulders.
const headDown = (rows, by) => shifted(rows, HEAD.from, HEAD.to, HEAD.top, HEAD.down, by);
const jolted = (rows, dx) => rows.map((row) => (dx > 0 ? `.${row.slice(0, -1)}` : `${row.slice(1)}.`));

// `rear` is the threat pose to use: with the umbrella (HUSH_REAR_SPRITE)
// for its entrance, roaring (HUSH_ROAR_SPRITE) for the rage, where each
// attack starts with it roaring instead of crouching.
export function hushAnim(rows, { rear = null, roaring = false } = {}) {
  const breathIn = breathing(rows);
  const crouch = crouched(rows, 2);
  const crouchLow = headDown(crouched(rows, 3), 2);
  const low = crouched(rows, 4);
  const anim = {
    idle: { fps: 3, frames: [rows, rows, stirred(rows), breathIn, breathIn, stirred(breathIn), rows, shut(rows), rows] },
    windup: { fps: 8, frames: [crouch, crouchLow, crouchLow, crouch] },
    hurt: { fps: 12, frames: [jolted(shut(rows), 1), jolted(shut(rows), 1), shut(rows)] },
    death: { fps: 5, frames: [jolted(shut(rows), 1), shut(low), shut(headDown(low, 2)), shut(headDown(low, 4)), shut(headDown(low, 4))] },
    spared: { fps: 3, frames: [rows, headDown(rows, 1), headDown(rows, 2), shut(headDown(rows, 2)), shut(headDown(rows, 4)), shut(headDown(rows, 4))] },
  };
  if (rear) {
    // Rearing: a crouch, then right up, held, bristles stirring, and down.
    const up = [crouch, crouch, rear, rear, stirred(rear), rear, stirred(rear), rear, crouch, rows];
    if (roaring) anim.windup = { fps: 8, frames: [crouch, rear, rear, stirred(rear), rear, crouch] };
    else anim.intro = { fps: 7, frames: up };
  }
  return anim;
}
