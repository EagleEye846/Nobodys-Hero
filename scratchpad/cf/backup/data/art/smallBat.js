// A little cave bat, flapping (the 'small_bat' animation, see
// src/engine/animations.js): they swarm through the Roost in the cutscene
// before the great bat (batsInTheRoost.js). Drawn in the prop palette's
// colours, so the first frame is also the `small_bat` prop (props.js).
export const SMALL_BAT_PALETTE = {
  k: '#120c1c', // outline
  Z: '#2a2630', // fur
  9: '#6a4a9a', // wings
  F: '#f0a0b8', // ears and eyes
  P: '#8a2f5e', // a roost plum
  R: '#c45a8a', // the plum's bloom
  d: '#7a4f2a', // its stalk
};

export const SMALL_BAT_SPRITES = {
  up: [
    'k..........k',
    'kk........kk',
    'k9k..kk..k9k',
    'k99kkZZkk99k',
    '.k99ZFZFZ99k',
    '..kk9ZZZ9kk.',
    '....kZZk....',
    '.....kk.....',
  ],
  down: [
    '............',
    '.....kk.....',
    '....kZZk....',
    '.kkkFZZFkkk.',
    'k999ZZZZ999k',
    'k99kk9Z9kk9k',
    'kk...kk...kk',
    'k..........k',
  ],
};

// The pup and the roost's little ones at rest, in the same colours.
// Hanging from the ice, wrapped up in their wings ('small_bat_hang'): 12x16,
// the bat at the top, so on a stalactite tile it hangs from the ice. It
// sways, and now and then blinks.
export const SMALL_BAT_HANG_SPRITES = {
  still: [
    '.....kk.....',
    '....kZZk....',
    '...k9ZZ9k...',
    '..k99ZZ99k..',
    '..k99ZZ99k..',
    '..k99ZZ99k..',
    '...kZZZZk...',
    '...kFZZFk...',
    '...kZkkZk...',
    '...kk..kk...',
    '............',
    '............',
    '............',
    '............',
    '............',
    '............',
  ],
  sway: [
    '.....kk.....',
    '....kZZk....',
    '....k9ZZ9k..',
    '...k99ZZ99k.',
    '...k99ZZ99k.',
    '...k99ZZ99k.',
    '....kZZZZk..',
    '....kFZZFk..',
    '....kZkkZk..',
    '....kk..kk..',
    '............',
    '............',
    '............',
    '............',
    '............',
    '............',
  ],
  blink: [
    '.....kk.....',
    '....kZZk....',
    '....k9ZZ9k..',
    '...k99ZZ99k.',
    '...k99ZZ99k.',
    '...k99ZZ99k.',
    '....kZZZZk..',
    '....kZZZZk..',
    '....kZkkZk..',
    '....kk..kk..',
    '............',
    '............',
    '............',
    '............',
    '............',
    '............',
  ],
  back: [
    '.....kk.....',
    '....kZZk....',
    '...k9ZZ9k...',
    '..k99ZZ99k..',
    '..k99ZZ99k..',
    '..k99ZZ99k..',
    '...kZZZZk...',
    '...kFZZFk...',
    '...kZkkZk...',
    '...kk..kk...',
    '............',
    '............',
    '............',
    '............',
    '............',
    '............',
  ],
};

// Perched on something, wings folded, ears up ('small_bat_perch'): sitting,
// squeaking, and nosing at whatever it's sitting by. The pup does this beside
// its mother in bat_defeated.
export const SMALL_BAT_PERCH_SPRITES = {
  sit: [
    '...k....k...',
    '..kFk..kFk..',
    '..kZZkkZZk..',
    '..kZFZZFZk..',
    '..kZZkkZZk..',
    '.k9kZZZZk9k.',
    'k99kZZZZk99k',
    'k9k.kZZk.k9k',
    'kk...kk...kk',
  ],
  squeak: [
    '..k......k..',
    '..kFk..kFk..',
    '..kZZkkZZk..',
    '..kZFZZFZk..',
    '..kZkFFkZk..',
    'k9kkZZZZkk9k',
    'k99kZZZZk99k',
    'k9k.kZZk.k9k',
    'kk...kk...kk',
  ],
  sit2: [
    '...k....k...',
    '..kFk..kFk..',
    '..kZZkkZZk..',
    '..kZFZZFZk..',
    '..kZZkkZZk..',
    '.k9kZZZZk9k.',
    'k99kZZZZk99k',
    'k9k.kZZk.k9k',
    'kk...kk...kk',
  ],
  nuzzle: [
    '....k....k..',
    '...kFk..kFk.',
    '...kZZkkZZk.',
    '...kZkZZkZk.',
    '...kZZkkZZk.',
    '..k9kZZZZk9k',
    '.k99kZZZZk99',
    '.k9k.kZZk.k9',
    '.kk...kk...k',
  ],
};

// The pup flying with a roost plum from its mother's winter store, held by
// the stalk in its feet ('small_bat_plum'): its peace offering to Ves in
// bat_defeated. 12x12.
export const SMALL_BAT_PLUM_SPRITES = {
  up: [
    'k..........k',
    'kk........kk',
    'k9k..kk..k9k',
    'k99kkZZkk99k',
    '.k99ZFZFZ99k',
    '..kk9ZZZ9kk.',
    '....kZZk....',
    '.....kk.....',
    '.....kd.....',
    '....kRPk....',
    '....kPPk....',
    '.....kk.....',
  ],
  down: [
    '............',
    '.....kk.....',
    '....kZZk....',
    '.kkkFZZFkkk.',
    'k999ZZZZ999k',
    'k99kk9Z9kk9k',
    'kk...kk...kk',
    'k..........k',
    '.....kd.....',
    '....kRPk....',
    '....kPPk....',
    '.....kk.....',
  ],
};
