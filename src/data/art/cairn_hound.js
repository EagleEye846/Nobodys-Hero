// The CAIRN HOUND, 32x28: a dog built of stacked stones, sitting up
// very straight the way a good dog sits, facing you. Flat slabs for ears, a
// round stone head with warm amber eyes, its tongue out, a collar of moss
// with an old brass tag on it (the name's worn off), round pebble paws, and
// a tail of little stones curling up behind. In a room it can sit as a
// cairn by the road (the "In disguise" behaviour, 16x16), a heap of
// flat stones with moss at the foot, until two eyes open in it, or the top
// stone hops (it's wagging).
export const CAIRN_HOUND_PALETTE = {
  k: '#16141c', // outline
  s: '#9a94a6', // stone in the light (the old city's purple-grey)
  S: '#6e6880', // stone
  d: '#48425a', // stone in shadow, and the cracks between
  y: '#f0c060', // its eyes, warm amber
  e: '#3a2a10', // its pupils
  m: '#6a8a44', // moss
  M: '#46602e', // moss in shadow
  t: '#d8a838', // the brass tag on its collar
  r: '#d86a7a', // its tongue
};

export const CAIRN_HOUND_SPRITE = [
  '...kk....................kk.....',
  '..kSdk..................kdSk....',
  '..kSSdk................kdSSk....',
  '..kSSSdk.kkkkkkkkkkkk.kdSSSk....',
  '...kSSSdksssssssssssskdSSSk.....',
  '...kkSSkssSSSSSSSSSSsskSSkk.....',
  '.....ksSSSSSSSSSSSSSSSSsk.......',
  '....ksSSkkSSSSSSSSSSkkSSsk......',
  '....kSSkyykSSSSSSSSkyykSSk......',
  '....kSSkyekSSdSSdSSkeykSSk......',
  '....kdSSkkSSSSSSSSSSkkSSdk......',
  '.....kdSSSSSSkkkkSSSSSSdk.......',
  '......kdSSSSkkddkkSSSSdk........',
  '......kkdSSSkskkskSSSdkk........',
  '.......kmMmMmkrrkmMmMmk.........',
  '......kmMmMmMmmmmMmMmMmk........',
  '.....ksSSkMmMttttMmMkSSsk.....kk',
  '....ksSSSSkkkkttkkkkSSSSsk...ksk',
  '....kmMSSSdkSsSSsSkdSSSSSk..ksdk',
  '...ksMmmSSdksSSSSskdSSSSSsk.kkk.',
  '...kSSSSSSdkSSSSSSkdSSSSSSk.kk..',
  '..kSSSSSSSdkSSddSSkdSSSSSSSksk..',
  '..kSSSSSSdkkSSddSSkkdSSSSSksSk..',
  '..kdSSSSddkksSddSskkddSSSkSSk...',
  '..kkddddkkskSSSSSSkskkddddkk....',
  '...kksSSkksSSkddkSSskkSSskk.....',
  '...kSSSSSkSSSSkkSSSSkSSSSSk.....',
  '...kkkkkkkkkkkkkkkkkkkkkkkk.....',
];

// Its cairn disguise: how it sits (still), and the two tells that flash by
// now and then (its eyes open; the top stone hops, because it's wagging).
export const CAIRN_HOUND_DISGUISE_SPRITES = {
  still: [
    '................',
    '.....kssk.......',
    '....kSSSdk......',
    '....kkkkkk......',
    '...kssSSSSk.....',
    '..kSSSSSSSdk....',
    '..kkkkkkkkkk....',
    '.ksSSSSSSSSdk...',
    '.kSSSSSSSSSSdk..',
    '.kSSSSSSSSSdddk.',
    '.kkkkkkkkkkkkkk.',
    'kssSSkksSSSSkSdk',
    'kSSSdkSSSSSdkSSk',
    'kSSddkSSSSddkSdk',
    'kkkkkkkkkkkkkkkk',
    '.mMm........mMm.',
  ],
  eyes: [
    '................',
    '.....kssk.......',
    '....kSSSdk......',
    '....kkkkkk......',
    '...kssSSSSk.....',
    '..kSSSSSSSdk....',
    '..kkkkkkkkkk....',
    '.ksSyeSSyeSdk...',
    '.kSSSSSSSSSSdk..',
    '.kSSSSSSSSSdddk.',
    '.kkkkkkkkkkkkkk.',
    'kssSSkksSSSSkSdk',
    'kSSSdkSSSSSdkSSk',
    'kSSddkSSSSddkSdk',
    'kkkkkkkkkkkkkkkk',
    '.mMm........mMm.',
  ],
  wag: [
    '......kk........',
    '.....kssk.......',
    '....kSSSdk......',
    '....kkkkkk......',
    '...kssSSSSk.....',
    '..kSSSSSSSdk....',
    '..kkkkkkkkkk....',
    '.ksSSSSSSSSdk...',
    '.kSSSSSSSSSSdk..',
    '.kSSSSSSSSSdddk.',
    '.kkkkkkkkkkkkkk.',
    'kssSSkksSSSSkSdk',
    'kSSSdkSSSSSdkSSk',
    'kSSddkSSSSddkSdk',
    'kkkkkkkkkkkkkkkk',
    '.mMm........mMm.',
  ],
};
