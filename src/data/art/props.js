// Prop and NPC art. Signs are one tile (16x16); characters can be taller or
// wider and are drawn standing on their tile.
export const PROP_PALETTE = {
  k: '#120c1c', // outline
  // Sign
  w: '#c08a4e', // wood
  d: '#7a4f2a', // carved text
  t: '#6b4423', // post
  // Old Keeper
  h: '#3a2a5e', // hood
  H: '#5a4890', // hood highlight
  f: '#120c1c', // face in shadow
  e: '#ffd25e', // glowing eyes
  r: '#4a3a7a', // robe
  R: '#33265a', // robe folds
  s: '#6b4423', // staff
  n: '#ffcc66', // lantern
  N: '#fff2c0', // lantern flame
  // Moss the merchant
  c: '#c0503a', // mushroom cap
  C: '#f2d6b0', // cap spots
  m: '#e8d8b8', // body
  B: '#8a5a2a', // pack
  p: '#4a2a14', // pack straps and mouth
  g: '#5fc27a', // bottle
  y: '#ffd25e', // scroll
  // Save point
  a: '#fff2c0', // crystal heart
  A: '#ffcc66', // crystal
  o: '#ff8c1a', // crystal edge
};

export const PROP_SPRITES = {
  sign: [
    '................',
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kwwwwwwwwwwwwk.',
    '.kwddddddddddwk.',
    '.kwwwwwwwwwwwwk.',
    '.kwddddddddwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kkkkkkkkkkkkkk.',
    '......kttk......',
    '......kttk......',
    '......kttk......',
    '......kttk......',
    '......kttk......',
    '.....kkkkkk.....',
    '................',
  ],

  // The Old Keeper: tall and thin, hooded, leaning on a staff with a lantern on top.
  keeper: [
    '.k..............',
    'kkk.............',
    'knk.............',
    'kNk.............',
    'kkk...kkkk......',
    '.s...kHhhhk.....',
    '.s..kHhhhhhk....',
    '.s..khffffhk....',
    '.s..kfeffefk....',
    '.s..khffffhk....',
    '.s..kkhffhkk....',
    '.s.krrkkkkrrk...',
    'ksskrrrrrrrrrk..',
    '.s.krrrrrrrrrk..',
    '.s.krRrrrrrRrk..',
    '.s.krRrrrrrRrk..',
    '.s.krRrrrrrRrk..',
    '.skrrRrrrrrRrrk.',
    '.skrrRrrrrrRrrk.',
    '.skrrRrrrrrRrrk.',
    '.skrrRrrrrrRrrk.',
    '.skrRrrrrrrrRrk.',
    '.skRRRRRRRRRRRk.',
    '.kkkkkkkkkkkkkk.',
  ],

  // Moss: a little mushroom-capped merchant with an overstuffed pack.
  merchant: [
    '.....kkk..kk....',
    '.....kgk.kyyk...',
    '....kkgkkkyyk...',
    '...kBBBBBBBBBk..',
    '...kBpBBBBBpBk..',
    '...kkkkkkBBBk...',
    '..kcCccCckBBk...',
    '.kcccccCcckBk...',
    'kccCcccccCck....',
    'kkkkkkkkkkkk....',
    '.kmmmmmmmmk.....',
    '.kmemmmmemk.....',
    '.kmmmmmmmmk.....',
    '.kmmmppmmmk.....',
    '..kmmmmmmk......',
    '..kmk..kmk......',
    '..kkk..kkk......',
  ],

  // A save point: a floating, glowing crystal.
  savepoint: [
    '................',
    '.......kk.......',
    '......kAak......',
    '.....kAaaAk.....',
    '....kAaaaaAk....',
    '...kAaaaaaaAk...',
    '..koAaaaaaaAok..',
    '...koAaaaaAok...',
    '....koAaaAok....',
    '.....koAAok.....',
    '......kook......',
    '.......kk.......',
    '................',
    '................',
    '................',
    '................',
  ],
};
