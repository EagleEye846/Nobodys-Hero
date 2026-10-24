// Old Ladle, the cistern's hob, who keeps the Old Drains' rest stop (see
// notes/docs/chapter-3-drains.md): a little old house-hob like the ones in
// Hollin's cottages, but kindly, in a faded blue nightcap and a damp apron,
// holding up his long tin ladle like a staff, with a sip of sweet water in
// its bowl. He's kept Hollin's water sweet for fifty years for a village that
// isn't there, because nobody told him to stop.
//
// Drawn like the props in props.js (rows of characters, standing on their
// tile's bottom edge), in PROP_PALETTE's colours only.

export const LADLE_PROP_SPRITES = {
  // In his nook, ladle up, a little drip of water in its bowl.
  ladle: [
    '..........kk..kk',
    '..........kM00Mk',
    '..........kMMMMk',
    '...........kOOk.',
    '.....E......kl..',
    '....EE......kl..',
    '...kkk......kl..',
    '..k77Jk.....kl..',
    '.k7777Jk....kl..',
    'k777777Jk...kl..',
    'kkkkkkkkkk..kl..',
    '.k*******k..kl..',
    '.k*fW*fW*k..kl..',
    '.k**%%%**k..kl..',
    '.kW*u%u*Wk..kl..',
    '..kWWWWWk..k*l..',
    '.k8WWSWWS8kk*l..',
    'k88xxxxxx88kkl..',
    'k8Xxxxxxxx8kkl..',
    '.kxxxXxxxXk.kl..',
    '.kxxxxxxXXk..k..',
    '..k))k.k))k.....',
    '.k)))k.k)))k....',
  ],
  // Behind his shop counter, bigger in the face. His eyes, for blinking, are
  // at (4, 9), (5, 9), (8, 9) and (9, 9).
  ladle_shop: [
    '......E...kk..kk',
    '.....EE...kM00Mk',
    '....kkk...kMMMMk',
    '...k77Jk...kOOk.',
    '...k77Jk....kl..',
    '..k7777Jk...kl..',
    '.k777777Jk..kl..',
    'kkkkkkkkkkkkkl..',
    'k***********kl..',
    'k***fW**fW**kl..',
    'k****%%%****kl..',
    'kW**u%%%u**Wkl..',
    '.kW***kk***Wkkl.',
    '.kWWWWWWWWWWk*l.',
    '.k8WWWSWWWW8k*l.',
    'k88WWSWWSWW88kl.',
    'k88xxWWWWxx88kl.',
    'k8Xxxxxxxxxx8kl.',
    'k8Xxxx0xxxXx8kl.',
    'k88xxxxxxxXX8kl.',
    '.kkkkkkkkkkkkkk.',
  ],
};

// Ladle's portrait, in the format of src/data/art/portraits.js (added there as
// `ladle`). Bushy white brows, a big nose, a beard down over his apron.
export const LADLE_PORTRAIT_PALETTE = {
  k: '#1e140e', // outline
  n: '#3f6fb5', // nightcap, faded blue
  N: '#30508a', // nightcap in shadow
  B: '#d8d0c0', // the bobble, gone grey
  s: '#e0a882', // skin
  S: '#b07a5a', // skin in shadow
  w: '#9a6a52', // wrinkles
  e: '#140c08', // eyes
  E: '#ffffff', // eye shine
  b: '#e88a7a', // rosy cheeks
  r: '#c8846a', // his big nose
  R: '#a0603e', // nose in shadow
  i: '#d8d0c0', // bushy brows
  h: '#f2eee4', // beard
  H: '#c8c0b0', // beard in shadow
  m: '#6a3a32', // mouth
  o: '#3a1e22', // open mouth
  a: '#f2e6c8', // apron
  A: '#cdb98f', // apron, damp
  g: '#2f6b45', // little green coat
  G: '#1f4a30', // coat in shadow
};

const LADLE_EXPRESSIONS = {
  laughing: { closed: true, patches: [[14, 10, 'ss'], [15, 9, 'esse'], [14, 21, 'ss'], [15, 20, 'esse'], [21, 13, 'mooooo'], [22, 14, 'mmmm']] },
  tender: { closed: true, patches: [[14, 10, 'ss'], [15, 9, 'esse'], [14, 21, 'ss'], [15, 20, 'esse'], [17, 5, 'bbb'], [17, 24, 'bbb']] },
  worried: { patches: [[12, 8, 'ssii'], [13, 9, 'iiii'], [12, 20, 'iiss'], [13, 19, 'iiii'], [21, 13, 'hmmmmh']] },
  sad: { patches: [[12, 8, 'ssii'], [13, 9, 'iiii'], [12, 20, 'iiss'], [13, 19, 'iiii'], [14, 10, 'ss'], [14, 21, 'ss'], [21, 13, 'hmmmmh'], [22, 13, 'm'], [22, 18, 'm']] },
  surprised: { patches: [[11, 8, 'iiii'], [11, 20, 'iiii'], [12, 8, 'ssss'], [12, 20, 'ssss'], [21, 13, 'hhmmhh'], [22, 15, 'oo']] },
  muddled: { patches: [[11, 20, 'iiii'], [12, 20, 'ssss'], [21, 13, 'hhmmmm']] },
};

export const LADLE_PORTRAIT = {
  palette: LADLE_PORTRAIT_PALETTE,
  eyes: [14, 15],
  expressions: LADLE_EXPRESSIONS,
  idle: [
    '................................',
    '...................kkk..........',
    '..............kkkkNNNkk.........',
    '...........kkknnnnnnnNNk........',
    '.........kknnnnnnnnnnnNNk.......',
    '........knnnnnnnnnnnnnnnNkkk....',
    '.......knnnnnnnnnnnnnnnnnNkBBk..',
    '......knnnnnnnnnnnnnnnnnnnkBBBk.',
    '......knnnnnnnnnnnnnnnnnnnkBBBk.',
    '.....kNNNNNNNNNNNNNNNNNNNNNkBk..',
    '.....kkkkkkkkkkkkkkkkkkkkkkkk...',
    '......kssssssssssssssssssssk....',
    '.....kssiiiissssssssiiiissssk...',
    '.....ksssiiiissssssiiiissssk....',
    '.....ksssseEssssssssseEssssk....',
    '.....ksssseessssssssseessssk....',
    '.....kwssssssssrrrrsssssswk.....',
    '....ksbbsssssrrrrrRsssssbbsk....',
    '....kssbbsssrrrrrRRssssbbssk....',
    '....kshhssssSrRRRRSssssshhsk....',
    '....khhhhhhsssssssssshhhhhhk....',
    '....khhhhhhhhmmmmmmhhhhhhhhk....',
    '...khhHhhhhhhhhhhhhhhhhhHhhhk...',
    '...khhhHhhhhhhhhhhhhhhhHhhhhk...',
    '...kkhhhHhhhhhhhhhhhhhHhhhhkk...',
    '..kggkhhhhHhhhhhhhhHhhhhhkgggk..',
    '.kgggkkhhhhhhHhhhhhhhhhkkgGggk..',
    '.kgGgaakkhhhhhhhhhhhkkaagggGgk..',
    'kggGaaaaakkkhhhhhkkkaaaaaGgggk..',
    'kgggaaAaaaaaakkkkaaaaaaAaaggGgk.',
    'kggGaaaaAaaaaaaaaaaaaaAaaaagggk.',
    'kgggaaaaaaaaaaaaaaaaaaaaaaaaggGk',
  ],
  blink: [
    '................................',
    '...................kkk..........',
    '..............kkkkNNNkk.........',
    '...........kkknnnnnnnNNk........',
    '.........kknnnnnnnnnnnNNk.......',
    '........knnnnnnnnnnnnnnnNkkk....',
    '.......knnnnnnnnnnnnnnnnnNkBBk..',
    '......knnnnnnnnnnnnnnnnnnnkBBBk.',
    '......knnnnnnnnnnnnnnnnnnnkBBBk.',
    '.....kNNNNNNNNNNNNNNNNNNNNNkBk..',
    '.....kkkkkkkkkkkkkkkkkkkkkkkk...',
    '......kssssssssssssssssssssk....',
    '.....kssiiiissssssssiiiissssk...',
    '.....ksssiiiissssssiiiissssk....',
    '.....ksssssssssssssssssssssk....',
    '.....ksssseessssssssseessssk....',
    '.....kwssssssssrrrrsssssswk.....',
    '....ksbbsssssrrrrrRsssssbbsk....',
    '....kssbbsssrrrrrRRssssbbssk....',
    '....kshhssssSrRRRRSssssshhsk....',
    '....khhhhhhsssssssssshhhhhhk....',
    '....khhhhhhhhmmmmmmhhhhhhhhk....',
    '...khhHhhhhhhhhhhhhhhhhhHhhhk...',
    '...khhhHhhhhhhhhhhhhhhhHhhhhk...',
    '...kkhhhHhhhhhhhhhhhhhHhhhhkk...',
    '..kggkhhhhHhhhhhhhhHhhhhhkgggk..',
    '.kgggkkhhhhhhHhhhhhhhhhkkgGggk..',
    '.kgGgaakkhhhhhhhhhhhkkaagggGgk..',
    'kggGaaaaakkkhhhhhkkkaaaaaGgggk..',
    'kgggaaAaaaaaakkkkaaaaaaAaaggGgk.',
    'kggGaaaaAaaaaaaaaaaaaaAaaaagggk.',
    'kgggaaaaaaaaaaaaaaaaaaaaaaaaggGk',
  ],
};
