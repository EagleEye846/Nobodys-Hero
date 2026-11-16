// The WISP, 26x29: a marsh light, a soft green-gold flame with a tail
// that curls away under it like smoke. It wears the tin lid off an old
// lantern as a hat, a bit crooked, so it looks more like the real ones on
// the path. Big round eyes, a small wobbly mouth, and a few faint glints
// hanging round it. In a room it can stand on a pole as a "lantern" (the
// "In disguise" behaviour, 16x31), until it blinks, or its flame
// flickers green and gives it away.
export const WISP_PALETTE = {
  k: '#0c1418', // outline
  g: '#bfe8a0', // its flame, pale green
  G: '#6aae7a', // flame at the edges
  y: '#f4f0b0', // its glow, nearly white-gold
  w: '#ffffff', // the shine in its eyes
  e: '#0c1418', // its eyes
  m: '#3a5a4a', // its mouth
  t: '#6a7676', // the tin lid it wears
  T: '#9aa8a8', // the lid, catching the light
  h: '#cfeec0', // glints hanging round it
  Y: '#e8c860', // the glow inside the "lantern"
  p: '#6a5038', // the wooden pole
  P: '#4a3626', // pole in shadow
  r: '#5a6a48', // reeds at the foot of the pole
};

export const WISP_SPRITE = [
  '.............k............',
  '............kTk...........',
  '...........kkTkk..........',
  '.........kktTtttkk........',
  '.......kktTtttttttkk......',
  '......kttTttttttttttk.....',
  '.....kTTTTTTTTTTTTTTTk....',
  '......kkkGGGgggggGkkk..h..',
  '.......kGGgggggggggk......',
  '......kGGgggyyyyywwgk.....',
  '..h..kGGgggyyyyyyyywgk....',
  '.....kGGggweyyyyweyygk....',
  '....kGGGggeeyyyyeeyygGk...',
  '....kGGGggeeyyyyeeyygGk...',
  '....kGGGggyyyyyyyyyygGk...',
  '....kGGGggyyyyyyyyyygGk...',
  '....kGGGggyyymymyyyygGk...',
  '.....kGGgggyyymyyyyggk..h.',
  '.....kGGGgggyyyyyyggGk....',
  '...h..kGGGgggggggggGk.....',
  '.......kGGGGgggggGGk......',
  '........kGGGGGGGGGk.......',
  '.........kkkgGgkkk........',
  '............kgGgk....h....',
  '............kggGk.........',
  '.....h.......kgGGkk.......',
  '..............kgGGGkk.....',
  '...............kkgGGgk....',
  '.................kkkk.....',
];

// Its lantern-on-a-pole disguise: how it stands (still), and the two tells
// that flash by now and then (it blinks; its flame goes green).
export const WISP_DISGUISE_SPRITES = {
  still: [
    '......kkkk......',
    '.....kTTTTk.....',
    '...kkttttttkk...',
    '..kTTTTTTTTTTk..',
    '...ktYYYYYYtk...',
    '...ktYYyYYYtk...',
    '...ktYYyyYYtk...',
    '...ktYYyyYYtk...',
    '...ktYYyyYYtk...',
    '...ktYYyyYYtk...',
    '...ktYYYYYYtk...',
    '..kTTTTTTTTTTk..',
    '...kkkkpPkkkk...',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '...k..kpPk......',
    '..krk.kpPk..k...',
    '..krk.kpPk.krk..',
    '..krk.kpPk.krk..',
    '...krkkpPkkrrk..',
    '...krkkpPkkrk...',
    '...krPPPPPPrk...',
    '....kkkkkkkk....',
  ],
  eyes: [
    '......kkkk......',
    '.....kTTTTk.....',
    '...kkttttttkk...',
    '..kTTTTTTTTTTk..',
    '...ktYYYYYYtk...',
    '...ktYYyYYYtk...',
    '...ktYYyyYYtk...',
    '...ktYeyyeYtk...',
    '...ktYYyyYYtk...',
    '...ktYYyyYYtk...',
    '...ktYYYYYYtk...',
    '..kTTTTTTTTTTk..',
    '...kkkkpPkkkk...',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '...k..kpPk......',
    '..krk.kpPk..k...',
    '..krk.kpPk.krk..',
    '..krk.kpPk.krk..',
    '...krkkpPkkrrk..',
    '...krkkpPkkrk...',
    '...krPPPPPPrk...',
    '....kkkkkkkk....',
  ],
  flicker: [
    '......kkkk......',
    '.....kTTTTk.....',
    '...kkttttttkk...',
    '..kTTTTTTTTTTk..',
    '...ktGGGGGGtk...',
    '...ktGGgGGGtk...',
    '...ktGGggGGtk...',
    '...ktGGggGGtk...',
    '...ktGGggGGtk...',
    '...ktGGggGGtk...',
    '...ktGGGGGGtk...',
    '..kTTTTTTTTTTk..',
    '...kkkkpPkkkk...',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '......kpPk......',
    '...k..kpPk......',
    '..krk.kpPk..k...',
    '..krk.kpPk.krk..',
    '..krk.kpPk.krk..',
    '...krkkpPkkrrk..',
    '...krkkpPkkrk...',
    '...krPPPPPPrk...',
    '....kkkkkkkk....',
  ],
};
