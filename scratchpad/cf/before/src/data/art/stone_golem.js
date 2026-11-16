// The STONE GOLEM, 24x22: a lumbering heap of cave stone that got up, with
// ice crystals growing out of its shoulders and arm, a cold blue light for
// eyes, and a crystal heart showing through a crack in its chest. In a room
// it lies curled up as a boulder (16x16, matching the boulder tile `O`) with
// a shard of ice on top, until you come close; now and then its eyes open,
// or the shard glints.
export const STONE_GOLEM_PALETTE = {
  k: '#1a1624', // outline
  S: '#a8a2b4', // stone, catching the light
  s: '#7f7990', // stone
  d: '#5e586c', // stone in shadow
  D: '#3e3a4a', // deep shadow, under the feet
  c: '#4f9fd8', // crystal, deep
  i: '#9fe0ff', // crystal
  I: '#eafaff', // crystal, catching the light
  e: '#7ff0ff', // eyes
  E: '#ffffff', // the glint in them
};

export const STONE_GOLEM_SPRITE = [
  '...I....................',
  '..kIk...................',
  '.kkiIk..................',
  'kIkciIk............k....',
  'kikcik..kkkkkkkk..kIk...',
  'kkkcikkkSSSSSSSSkkkiIk..',
  'kSSSkkSkSssssssSkSkkSSSk',
  'kSsssSskseEssEesksSsssSk',
  'kSssssskssssssssksssssSk',
  'kSsdksSskkkkkkkksSskdsSk',
  'kSsdkSsssSssssSsssSkdik.',
  'kssdkSsssssiisssssSkkiIk',
  'kssdkssssiIiiIisssskkcik',
  'kssdkssssssiisssssskdssk',
  'kSSSkdsssssddsssssdkSSSk',
  'kSssSkddddddddddddkSssSk',
  'kssssk.kkkkkkkkkk.kssssk',
  'kddddk.kSsskkssSk.kddddk',
  '.kkkk.kSssdkkdssSk.kkkk.',
  '......kssddkkddssk......',
  '......kdddDkkDdddk......',
  '......kkkkkkkkkkkk......',
];

// Curled up as a boulder, in the same stone as the boulder tile (see
// drawBoulder in src/overworld/tileset.js), with a shard of cave ice growing
// out of the top where the boulder tile has its moss.
export const STONE_GOLEM_BOULDER_PALETTE = {
  k: '#2e2a34', // outline
  s: '#7a7484', // stone
  S: '#9a94a4', // stone, catching the light
  d: '#5a5464', // stone in shadow
  c: '#4f9fd8', // crystal, deep
  i: '#9fe0ff', // crystal
  I: '#eafaff', // crystal, catching the light
  e: '#7ff0ff', // eyes
};

const boulder = (shard, eyes) => [
  shard[0],
  shard[1],
  '....kick.k......',
  '..kkkickkikkkk..',
  '..kssssssssssk..',
  '.kksSSSSssssskk.',
  '.kssSSSSssssssk.',
  eyes[0],
  eyes[1],
  '.kssssssssssssk.',
  '.ksssssssddddsk.',
  '.kkssssssddddkk.',
  '..kssssssssssk..',
  '..kkkkkkkkkkkk..',
  '................',
  '................',
];

const SHARD = ['.....k..........', '....kik.........'];
const CLOSED = ['.kssssssssssssk.', '.kssssssssssssk.'];

export const STONE_GOLEM_DISGUISE_SPRITES = {
  still: boulder(SHARD, CLOSED),
  // Two cold blue eyes open in the rock.
  look: boulder(SHARD, ['.kssskksskksssk.', '.kssseesseesssk.']),
  // The shard on top catches the light.
  glint: boulder(['.....I..........', '....kIk.........'], CLOSED),
};
