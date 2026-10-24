// THE WARDEN OF THE GATE, for battle: the colossal stone statue of the
// prophesied Hero that the old city built to greet him, before the Hero's
// Gate. Its stone sword raised high in welcome, its other hand held out
// open, a carved garland of flowers over its chest and the city's sun on
// it, standing on a plinth carved with the prophecy. Three hundred years of
// moss. Its eyes are open now. The same purple-grey slab stone as the Dead
// City (and its overworld self, warden_asleep in deadcity.js).
//
// It breaks as the fight goes on (its `phases` in src/data/enemies/warden.js):
//   WARDEN_SPRITE            whole, the garland on, both eyes lit (56x80)
//   WARDEN_CRACKED_SPRITE    cracks across its chest, face and blade, half
//                            the garland fallen away
//   WARDEN_CRUMBLING_SPRITE  the blade snapped off, a bite out of its
//                            shoulder and head, one eye gone dark, cracks
//                            everywhere
//   WARDEN_FALLEN_SPRITE     beaten: a heap of great blocks, its head at the
//                            front with its eyes shut, its arm still holding
//                            up the hilt (56x36)
//
export const WARDEN_PALETTE = {
  k: '#120c1c', // outline
  w: '#c8bce8', // stone, a lit edge
  T: '#9284c0', // stone, lit
  t: '#6e60a2', // stone
  S: '#5a4890', // stone in shadow
  s: '#4a3a7a', // stone, deep shadow
  d: '#33265a', // its cloak and the plinth, in shadow
  c: '#1c1430', // cracks
  e: '#e8f8ff', // its eyes, lit
  E: '#7fc8e8', // the eyes' glow
  P: '#e8b4c4', // the carved garland's flowers (painted once)
  p: '#c07890', // flowers in shadow
  q: '#8a4a66', // flowers, deep
  G: '#8ab870', // moss, and the garland's leaves
  g: '#4f7a4a', // moss in shadow
  Y: '#f0d890', // old gilding, catching the light
  y: '#c8a050', // old gilding
};

export const WARDEN_SPRITE = [
  '.......kwk..............................................',
  '.......kwwk.............................................',
  '......kwTTwk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '..kkkkkwtttkkkkk........................................',
  '.kwTTTTTTTTTTTTTk.......................................',
  '.kTSSSSSSSSSSSSSk.......................................',
  '..kkkkkkwkkkkkkk........................................',
  '.....kwTttTTk...........................................',
  '.....kTttttSk...........kkkkkkkk........................',
  '.....kTttttSk..........kTtttttttk.......................',
  '.....kTkttkkk.........kTSSSSSSSStk......................',
  '......kwkkwTk........kTSSSkkkkkSStk.....................',
  '......kTTTtSk........ktkkkwTTTTkkSk.....................',
  '......kTttttTk......kTkwTTtttttTTkk.....................',
  '.......kTtttSk......kkwttttttttttTkk....................',
  '.......kTtttSk.......kTtSSSttSSStSk.....................',
  '.......kTttttTk.....kwttttttttttttTk....................',
  '........kTtttSk.....kTttteEttteEttSk....................',
  '........kTttttTk.....kTttttttttttSk.....................',
  '........kTttttkk.....kTtttttSttttSk.....................',
  '.........kkttkwTk....kTttttttttttSk.....................',
  '.........kwkkwtSk.....kTtttSSSttSk......................',
  '..........kwTtttTk....kTSttttttSSk......................',
  '..........kTtttttTk....kkkkttkkkk......k................',
  '...........kTttttSkkk...kwTkkwTk....kkkwkkk.............',
  '............kTttSPkwTkkkkTtTTtSkkkkkwTPkwTTk............',
  '............kktSPppkTkTttTttttkTtttwSPppkTSTk...........',
  '............kwTSkppkTkwTkkkkkkkwTTkTSkppkTSSk...........',
  '............kTktTkkGkkTttTTTTTTtttSkGGkkwkTSk...........',
  '............kTTktTkkkTkTtttttttttSkTkkwTSSkTk...........',
  '.............kTkgkkkPPpkTttyttttSPpPkkSSSSSk............',
  '..............kTtkwTkppkTSyStySSSkppkwTSSSSk............',
  '..............ktswttTkkkkPPYYPykGkkkwSkSSSSTk...........',
  '..............ktsTtttTTTkypYYPpPkwTTSSTTSSSSk...........',
  '.............kTSsTttttttTkykkykkwttSSSSkSSSSTkkk........',
  '.............ktSsktttttttTTTyTTTtttSSSkTkwTTTTTTkkkkkk..',
  '.............ktSStkSSSSSSSSSSSSSSSSSSkTskTSSSSSSwTTTTTk.',
  '.............ktSSswTTTTTTkYYYkwTTTTTTktstTSSSSSSTSSSSSTk',
  '.............ktSSskkkkkkkkkkkkkkkkkkkktsskkSSSSSTSSSSSk.',
  '............kTSSswTTTTTTTTTTTTTTTTTTTTktsttkTSSSkSSSSk..',
  '............ktSSsTtttttttttttttttttSSSktssskkkkkkkkkk...',
  '............ktSSsTtttttttttttttttttSSSktsssk............',
  '............ktSswttttttttttttttttttSSSSktgsk............',
  '............ktSsTttttttttttttttttttSSSSktssk............',
  '...........kTSSsTttttttttttttttttttSSSSktsstk...........',
  '...........ktSskkkkkkkkkkkkkkkkkkkkkkkkkktssk...........',
  '...........ktSSttttwTTTTTkTtttwTTTTTkTtttsssk...........',
  '...........ktSSSSSsTtttttktSSsTttttSktssssssk...........',
  '...........ktSSSSSsTtttttktSSsTttttSktssssssk...........',
  '..........kTSSSSSSskSSSSSktSSskSSSSSktsssssstk..........',
  '..........ktSSSSSswTTTTTTktSSswTTTTTgktssssssk..........',
  '..........ktssssssTtgttttktsssTttttSSktssssssk..........',
  '.kkkkkkkkkkkkkkkkkTSSSSSSSkkkkTSSSSSSSkkkkkkkkkkkkkkkkk.',
  'kwTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTgTTTk',
  'kTSSggSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSgSSSSk',
  '.kkTttttttttttttttttttttttttttttttttttttttttttttttttkkk.',
  '..ktSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSssssssssssssssssssk..',
  '..ktSSSSsSSSSSsSSSSSsSSSSSsSSSSSsSSSsSssSSsSssSSsSsssk..',
  '..ktSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSssSssSssSssSssSsssk..',
  '..ktsssssssssssssssssssssssssssssssssssssssssssssssssk..',
];

export const WARDEN_CRACKED_SPRITE = [
  '.......kwk..............................................',
  '.......kwwk.............................................',
  '......kwTTwk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTck............................................',
  '......kwTcck............................................',
  '......kwTcwk............................................',
  '......kwcctk............................................',
  '......kwcwtk............................................',
  '......kwwTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '......kwTTtk............................................',
  '..kkkkkwtttkkkkk........................................',
  '.kwTTTTTTTTTTTTTk.......................................',
  '.kTSSSSSSSSSSSSSk.......................................',
  '..kkkkkkwkkkkkkk........................................',
  '.....kwTttTTk...........................................',
  '.....kTttttSk...........kkkkkkkk........................',
  '.....kTttttSk..........kTtttttttk.......................',
  '.....kTkttkkk.........kTSSSSSSSStk......................',
  '......kwkkwTk........kTSSSkkkkkScck.....................',
  '......kTTTtSk........ktkkkwTTTTkcwk.....................',
  '......kTttttTk......kTkwTTtttttcckk.....................',
  '.......kTtttSk......kkwttttttttcwTkk....................',
  '.......kTtttSk.......kTtSSSttSSctSk.....................',
  '.......kTttttTk.....kwtttttttttwctTk....................',
  '........kTtttSk.....kTttteEttteEctSk....................',
  '........kTttttTk.....kTtttttttttwSk.....................',
  '........kTttttkk.....kTtttttSttttSk.....................',
  '.........kkttkwTk....kTttttttttttSk.....................',
  '.........kwkkwtSk.....kTtttSSSttSk......................',
  '..........kwTtttTk....kTSttttttSSk......................',
  '..........kTtttttTk....kkkkttkkkk......k................',
  '...........kTttttSkkk...kwTkkwTk....kkkwkkk.............',
  '............kTttSPkwTkkkkTtTTtSkkkkkwTTSTTTk............',
  '............kktSPppkTkTttTttttkTtttwSSSSSSSTk...........',
  '............kwTSkppkTkwTkkkckkkwTTkTSSSwkTSSk...........',
  '............kTktTkkGkkTttTcwTTTtttSTSSwSSkTSk...........',
  '............kTTktTkkkTkTtcctttttttSkSwSSSSkTk...........',
  '.............kTkgkkkPPpkTcwytttttttTkkSSSSSk............',
  '..............kTtkwTkppkcwyStytttttSTTTSSSSk............',
  '..............ktswttTkkkccPYYtyttttSSSkSSSSTk...........',
  '..............ktsTtttTTTwcpYYttttttSSSTTSSSSk...........',
  '.............kTSsTttttttTcckTytttttSSSSkSSSSTkkk........',
  '.............ktSsktttttttwcTyttttttSSSkTkwTTTTTTkkkkkk..',
  '.............ktSStkSSSSSScwSSSSSSSSSSkTskTSSSSSSwTTTTTk.',
  '.............ktSSswTTTTTcwYYYkwTTTTTTktstTSSSSSSTSSSSSTk',
  '.............ktSSskkkkkcwkkkkkkkkkkkkktsskkSSSSSTSSSSSk.',
  '............kTSSswTTTTcwTTTTTTTTTTTTTTktsttkTSSSkSSSSk..',
  '............ktSSsTttttwttttttttttttSSSktssskkkkkkkkkk...',
  '............ktSSsTtttttttttttttttttSSSktsssk............',
  '............ktSswttttttttttttttttttSSSSktgsk............',
  '............ktSsTttttttttttttttttttSSSSktssk............',
  '...........kTSSsTttttttttttttttttttSSSSktsstk...........',
  '...........ktSskkkkkkkkkkkkkkkkkkkkkkkkkktssk...........',
  '...........ktSSttttwTTTTTkTtttwTTTTTkTtttsssk...........',
  '...........ktSSSSSsTtttttktSSsTttttSktssssssk...........',
  '...........ktSSSSSsTtttttktSSsTttttSktssssssk...........',
  '..........kTSSSSSSskSSSSSktSSskSSSSSktsssssstk..........',
  '..........ktSSSSSswTTTTTTktSSswTTTTTgktssssssk..........',
  '..........ktssssssTtgttttktsssTttttSSktssssssk..........',
  '.kkkkkkkkkkkkkkkkkTSSSSSSSkkkkTSSSSSSSkkkkkkkkkkkkkkkkk.',
  'kwTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTgTTTk',
  'kTSSggSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSgSSSSk',
  '.kkTttttttttttttttttttttttttttttttttttttttttttttttttkkk.',
  '..ktSSSSSSSSSSSSSSSScSSSSSSSSSSSSSSssssssssssssssssssk..',
  '..ktSSSSsSSSSSsSSSSSsccSSSsSSSSSsSSSsSssSSsSssSSsSsssk..',
  '..ktSSSSSSSSSSSSSSSSSwScSSSSSSSSSSSssSssSssSssSssSsssk..',
  '..ktssssssssssssssssssccsssssssssssssssssssssssssssssk..',
];

export const WARDEN_CRUMBLING_SPRITE = [
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '........................................................',
  '.......k.kk.............................................',
  '......kwkwwk............................................',
  '......kwwTtk............................................',
  '......kwTTtk............................................',
  '......kwTctk............................................',
  '......kwTctk............................................',
  '......kwcctk............................................',
  '......kwcwtk............................................',
  '......kwcTtk............................................',
  '......kwwTtk............................................',
  '......kwTTtk............................................',
  '..kkkkkwtttkkkkk........................................',
  '.kwTTTTTTTTTTTTTk.......................................',
  '.kTSSSSSSSSSSSSSk.......................................',
  '..kkkkkkwkkkkkkk........................................',
  '.....kwTttTTk...........................................',
  '.....kTttttSk...........kkkkkkkk........................',
  '.....kTttttSk..........kTtttttttk.......................',
  '.....kTkttkkk.........kTSSSSSSSStk......................',
  '......kwkkwTk........kTSSSkkkkkSck......................',
  '......kTTTtSk........ktkkkwTTTTkck......................',
  '......kTttttTk......kTkwTTtttttcck......................',
  '.......kTtttSk......kkwttttttttcwk......................',
  '.......kTtttSk.......kTtSSSttSSctTk.....................',
  '.......kTtttcTk.....kwtttttttttwctTk....................',
  '........kTttcck.....kTttteEtttccctSk....................',
  '........kTttwcTk.....kTtttttttttwSk.....................',
  '........kTtttckk.....kTtttttSttttSk.....................',
  '.........kkttccTk....kTttttttttttSk.....................',
  '.........kwkkwcSk.....kTtttSSSttSk......................',
  '..........kwTtctTk....kTSttttctSSk......................',
  '..........kTtcwttTk....kkkkttckkk......k................',
  '...........kTctttSkkk...kwTkcwTk....kkkwk...............',
  '............kwttttkwTkkkkTtTctSkkkkkwTTSk...............',
  '............kkttttkTtkTttTttwtkTtttwSSSSk...............',
  '............kwTttttkTkwTkkkckkkwTTkTSSSwTkkk............',
  '............kTkttttkTkTttTcwTTTtttSTScwSSkwTk...........',
  '............kTTkttkwtkTttcctttttttSkcwSSSSkTk...........',
  '.............kTkgkkkkwtttcwytttttttTckSSSSSk............',
  '..............kTtkwTTtttcwyttytttttcwTTSSSSk............',
  '..............ktswttttttcctYYtyttttcSSkSSSSTk...........',
  '..............ktsTttttttwctYYtttttcwSSTTSSSSk...........',
  '.............kTSsTtttttttccttyttttccSSSkSSSSTkkk........',
  '.............ktSsktttttttwctytttttwcSSkTkwTTTTTTkkkkkk..',
  '.............ktSStkSSSSSScwSSSSSSSScckTskTSSSSSSwTTTTTk.',
  '.............ktSSswTTTTTcwYYYkwTTTTwcktstTSSSScSTSSSSSTk',
  '.............ktSSskkkkkcwkkkkkkkkkkccktsskkSSSwccSSSSSk.',
  '............kTSSswTTTTcwTTTTTTTTTTTcwTktsttkTSSwwcSSSk..',
  '............ktSSsTttttwtttttttttttccSSktssskkkkkkkkkk...',
  '............ktSSsTttttttttttttttttcwSSktsssk............',
  '............ktSswttttttttttttttttccSSSSktgsk............',
  '............ktSsTttttttttttttttttcwSSSSktssk............',
  '...........kTSSsTtttttcttttttttttwtSSSSktsstk...........',
  '...........ktSskkkkkkkwckkkkkkkkkckkkkkkktssk...........',
  '...........ktSSttttwTTTcTkTtttwTTccTkTtttsssk...........',
  '...........ktSSSSSsTtttwcktSSsTttwcSktssssssk...........',
  '...........ktSSSSSsTttttcktSSsTtttccktssssssk...........',
  '..........kTSSSSSSskSSSccktSSskSSSwcktsssssstk..........',
  '..........ktSSSSSswTTTTcwktSSswTTTTwgktssssssk..........',
  '..........ktssssssTtgttctktsssTttttSSktssssssk..........',
  '.kkkkkkkkkkkkkkkkkTSSSSwSSkkkkTSSSSSSSkkkkkkkkkkkk......',
  'kwTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTk.....',
  'kTSSggSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSScSSSSSSSSSg.....',
  '.kkTttttttttttttttttttttttttttttttttttttwccttttttkk.....',
  '..ktSSSSSSSSSSSSSSSScSSSSSSSSSSSSSSsssssswccsssssstk....',
  '..ktSSSSsSSSSSsSSSSSsccSSSsSSSSSsSSSsSssSSwScsSSsSstk...',
  '..ktSSSSSSSSSSSSSSSSSwScSSSSSSSSSSSssSssSssScsSssSsstk..',
  '..ktssssssssssssssssssccssssssssssssssssssscwssssssssk..',
];

export const WARDEN_FALLEN_SPRITE = [
  '...............................................kk.......',
  '..............................................kwwk......',
  '..............................................kwTwk.....',
  '.....................k........................kwTtk.....',
  '..................kkkTk.......................kwTtk.....',
  '................kkTttskkkkkkk.................kwTtk.....',
  '..............kkTtSSSSkwTTTTTkkkkkkkk.......kkkwttkkkk..',
  '.............kTtSSSSSSkTtttttTTTTTTTTk.....kwTTkkkTTTTk.',
  '.............ktSSSSSSSSkTttgttttttttSk.....kTSSwTkTSSSk.',
  '.............ktSSSSSSSSkTtttttttttttSk......kkwtttkkkk..',
  '..............ktSSSSSSkkTtttttttttttSk......kwktttSk....',
  '..............ktSSSSskwTttttttttttttSk.....kwtTkkSk.....',
  '...............ktssskwttttsSttsStttSk.....kwtttTTk......',
  '...............ktkkkkTtttttttttttttSk....kwttttSk.......',
  '................k..kkTtttttttttttttSkkkk.kTtttSk........',
  '..........kkkkkkkkkTtTtttSSSSSSSSSSwTTTTkwttttSk........',
  '......kkkkTttttttttSskSSSwTTTTTTTTcttttSwttttSk.........',
  '.....kTtttSSSSSSSSSswTTTTttttttttccttttSTtttSkkkkk......',
  '......ktSSSSSSSScSSsTttttttttttttcwttttSTtttkTttttk.....',
  '......ktSSSSSSgSccSsTttttttttyttyctttttSkkkkTSSSSsk.....',
  '......ktSSSSSSSSwcSsTtttttttttYYccttttttkTttSSSSSsk.....',
  '......ktSSSSSSSSScSsktttttttttYYcwttttgtktSSSSSSSsk.....',
  '......ktSSsSSsSSSccStkSSSSSStyttccttttttktSSSSSSSsk.....',
  '......ktSSSSSSSsswcsTttttttkTtttwcttttttktSSSSSSSsk.....',
  '......ktSSssssswwwwTSkkkkkkSkTtttcctkkkkktSSSSSSsk......',
  '.....kktsswwwwwTkkTSkwTTTTTkkTSSkwckTttttSSSsSSsSk......',
  '...kkwwwwwTkkkkkTtkkwttttttTkkkkTtwtSSSSSSSSSSSSsk......',
  '..kwwTttkkkTttttsswTttttttttTTkktssssSSSSSSSSgSSsk......',
  '...kwtkkTttkkkkkkkTttttttttttSk.kkkkktssssssSSSSsk......',
  '....kk.kkkkkkkkkkkTttcctttcctSkkkkkk.kkkkkkktssssk......',
  '..kkkkkwTTTTTTTTTTTtttttSttttkwTTTTTkkkkkkkkkkkkk.......',
  '.kwTTTTttttttStttSkttttttttttkTtttttTTTTTTTTTTTTkkkkkk..',
  '.kTtStttttttSkTtttTktttSSSttSkTttttttSttttttttttTTTTTTk.',
  'kwtSkTtttttSktkTtttTkkttttSSkwttttttSkTtttttttttttSkTSk.',
  'kTSktkTtttttTkwtttttTTkkkkkkkTtttttSktkTtttttttttSktkTTk',
  'kTSTkwSSSSSSSTSSSSSSSSTTTTk.kTSSSSSSTkwSSSSSSSSSSSTkwSSk',
];

// --- Its animations in battle (see `anim` in src/battle/battleScene.js),
// worked out from whichever of the sprites above it's in, so every frame
// lines up with it. Stone doesn't breathe: it stands, its eyes' light coming
// and going, and now and then the sword arm grinds up a hair and settles. It
// lifts the sword to strike, its eyes flaring; a hit jolts it and knocks
// chips off; and beaten, cracks run all through it, its eyes go out, and
// pieces of it fall away.
const ARM_BOTTOM = 44; // the raised arm and the sword: columns 0-17, rows 0-44
const ARM_RIGHT = 17;
const EYE_ROW = 37;

// A seeded random, so the cracks fall the same way every time.
function seeded(seed) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}
const grid = (rows) => rows.map((row) => row.split(''));
const flat = (cells) => cells.map((row) => row.join(''));

// The sword arm lifted `by` pixels.
function lifted(rows, by) {
  const g = grid(rows);
  for (let y = 0; y <= ARM_BOTTOM - by; y++) {
    for (let x = 0; x <= ARM_RIGHT; x++) g[y][x] = rows[y + by][x];
  }
  return flat(g);
}
// Its eyes: 'dim' (just the glow), 'flare' (lit, and the light spilling round them), or 'out'.
function eyes(rows, how) {
  const g = grid(rows);
  for (let y = EYE_ROW - 1; y <= EYE_ROW + 1; y++) {
    for (let x = 0; x < g[y].length; x++) {
      const c = rows[y][x];
      if (how === 'dim' && c === 'e') g[y][x] = 'E';
      if (how === 'out' && (c === 'e' || c === 'E')) g[y][x] = 'c';
      if (how === 'flare') {
        if (c === 'E') g[y][x] = 'e';
        if (y === EYE_ROW && (c === 'e' || c === 'E')) {
          for (const dx of [-1, 1]) if (g[y][x + dx] === 't' || g[y][x + dx] === 'T') g[y][x + dx] = 'E';
        }
      }
    }
  }
  return flat(g);
}
// Moved sideways, the jolt of a hit.
const jolted = (rows, dx) => rows.map((row) => (dx > 0 ? `.${row.slice(0, -1)}` : `${row.slice(1)}.`));
// Cracks: `count` short random walks across its stone, from a seed.
function cracked(rows, count, seed, length = 11) {
  const g = grid(rows);
  const rand = seeded(seed);
  const stone = (c) => 'wTtSsd'.includes(c);
  for (let i = 0; i < count; i++) {
    let x = Math.floor(rand() * g[0].length);
    let y = 18 + Math.floor(rand() * (g.length - 26));
    for (let step = 0; step < length; step++) {
      if (g[y]?.[x] !== undefined && stone(g[y][x])) g[y][x] = 'c';
      x += Math.floor(rand() * 3) - 1;
      y += rand() < 0.7 ? 1 : -1;
    }
  }
  return flat(g);
}
// Pieces broken away: blocks of it gone, and the new edges outlined.
function broken(rows, count, seed) {
  const g = grid(rows);
  const rand = seeded(seed);
  for (let i = 0; i < count; i++) {
    // Somewhere on its edge: a lit or outlined pixel next to empty space.
    for (let tries = 0; tries < 200; tries++) {
      const x = Math.floor(rand() * g[0].length);
      const y = 20 + Math.floor(rand() * 52);
      if (g[y][x] === '.' || !(g[y][x - 1] === '.' || g[y][x + 1] === '.' || g[y - 1]?.[x] === '.')) continue;
      const size = 3 + Math.floor(rand() * 4);
      for (let yy = y; yy < y + size && yy < g.length; yy++) for (let xx = x - 1; xx < x + size - 1 && xx < g[0].length; xx++) if (xx >= 0) g[yy][xx] = '.';
      break;
    }
  }
  const out = g.map((row) => [...row]);
  for (let y = 0; y < g.length; y++) {
    for (let x = 0; x < g[0].length; x++) {
      if (g[y][x] === '.' || g[y][x] === 'k') continue;
      if (g[y][x - 1] === '.' || g[y][x + 1] === '.' || g[y - 1]?.[x] === '.' || g[y + 1]?.[x] === '.') out[y][x] = 'k';
    }
  }
  return flat(out);
}

// The sword gone from its hand (it falls in pieces), and the new edges outlined.
function disarmed(rows) {
  return broken(rows.map((row, y) => (y < 34 ? `${'.'.repeat(14)}${row.slice(14)}` : row)), 0, 0);
}

// Everything it does, standing as `rows`.
export function wardenAnim(rows, seed = 1) {
  const up1 = lifted(rows, 1);
  const up2 = lifted(rows, 2);
  return {
    chips: ['#9284c0', '#6e60a2', '#5a4890', '#4a3a7a', '#8ab870'],
    idle: { fps: 2, frames: [rows, rows, eyes(rows, 'dim'), rows, rows, up1, up1, rows] },
    windup: { fps: 9, frames: [up1, up2, eyes(up2, 'flare'), eyes(up2, 'flare'), eyes(up2, 'flare'), up1] },
    hurt: { fps: 14, frames: [jolted(cracked(rows, 3, seed + 7, 4), 1), jolted(rows, -1), rows] },
    death: {
      fps: 6,
      frames: [
        cracked(rows, 4, seed + 20),
        cracked(rows, 9, seed + 20),
        eyes(cracked(rows, 14, seed + 20), 'dim'),
        cracked(rows, 20, seed + 20),
        eyes(cracked(rows, 26, seed + 20), 'out'),
        eyes(cracked(rows, 26, seed + 20), 'dim'),
        eyes(cracked(rows, 32, seed + 20), 'out'),
        eyes(broken(cracked(rows, 34, seed + 20), 4, seed + 40), 'out'),
        eyes(broken(cracked(rows, 36, seed + 20), 8, seed + 40), 'out'),
        eyes(disarmed(broken(cracked(rows, 38, seed + 20), 12, seed + 40)), 'out'),
        eyes(disarmed(broken(cracked(rows, 40, seed + 20), 16, seed + 40)), 'out'),
        eyes(disarmed(broken(cracked(rows, 42, seed + 20), 20, seed + 40)), 'out'),
      ],
    },
  };
}
