// The LAMP MITES, 30x24: a little swarm of dusty grey-gold moths, no
// bigger than your thumbnail, that nest in the dead street lamps of the old
// city. One big fluffy one in the middle (the boldest, with round black eyes
// and a fuzzy ruff), and three smaller ones fussing round it, with motes of
// dust hanging in the air between them. In a room they can hide inside a
// dead street lamp (the "In disguise" behaviour, 12x34): an old
// iron lamp post with dark, dusty glass, until eyes glint in the glass, or
// one of them crawls out over the top.
export const LAMP_MITE_PALETTE = {
  k: '#1a1620', // outline
  w: '#c8bca8', // wings, dusty pale
  W: '#8a7e70', // the pattern on their wings
  f: '#e8dcc0', // their fluff
  F: '#b0a088', // fluff in shadow, and their little bodies
  e: '#101010', // eyes
  E: '#fff4d0', // the glint in an eye
  a: '#6a5e50', // feathery antennae
  m: '#5a3a3a', // a small mouth
  d: '#d8c890', // dust, hanging in the air
  i: '#4a4458', // the lamp's old iron
  I: '#6a6278', // iron, where the light catches it
  G: '#2a3038', // the lamp's dark glass
  g: '#5a6a70', // a dull shine on the glass
};

export const LAMP_MITE_SPRITE = [
  'a.....a.......................',
  '.a...a........................',
  'kwkfkwk...d...................',
  'kwefewk.......................',
  'kWkfkWk..................d....',
  '.k.k.k..aa..........aa........',
  '.........aa........aa.........',
  '......kk..a..kkkk..a..kk......',
  '......kwkk.akffffka.kkwk......',
  '....d.kwwwkkffffffkkwwwk...d..',
  '......kwWwwkfEffEfkwwWwk......',
  '......kwWWwkfeffefkwWWwk......',
  '......kwwWwkffffffkwWwwk......',
  '......kwwwwkfFmmFfkwwwwa.....a',
  '.......kwWwwkFffFkwwWwk.a...a.',
  '.d.....kwwWwkFFFFkwWwwkkwkfkwk',
  '........kwwwkFFFFkwwwk.kwefewk',
  '........kwWwkkFFkkwWwk.kWkfkWk',
  '.........kkk.kFFk.kkk...k.k.k.',
  '..a...a......kkkk.............',
  '..kwfwk.......................',
  '..kwewk..............d......d.',
  '...kfk.......d................',
  '..............................',
];

// Their street-lamp disguise: how it stands (still), and the two tells that
// flash by now and then (eyes glint in the glass; one crawls out on top).
export const LAMP_MITE_DISGUISE_SPRITES = {
  still: [
    '.....kk.....',
    '....kiik....',
    '...kiiiik...',
    '..kkkkkkkk..',
    '..kGgGGgGk..',
    '..kgGGgGGk..',
    '..kGGgGGgk..',
    '..kgGGGgGk..',
    '..kkkkkkkk..',
    '...kiiiik...',
    '....kiik....',
    '....kiIk....',
    '...kkiIkkk..',
    '...kiiIiik..',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk.d..',
    '...kiiIik...',
    '..kiiiiIik..',
    '.kkkkkkkkkk.',
  ],
  eyes: [
    '.....kk.....',
    '....kiik....',
    '...kiiiik...',
    '..kkkkkkkk..',
    '..kGgGGgGk..',
    '..kgEeEeGk..',
    '..kGGgGGgk..',
    '..kgGGGgGk..',
    '..kkkkkkkk..',
    '...kiiiik...',
    '....kiik....',
    '....kiIk....',
    '...kkiIkkk..',
    '...kiiIiik..',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk.d..',
    '...kiiIik...',
    '..kiiiiIik..',
    '.kkkkkkkkkk.',
  ],
  peek: [
    '.....kka.a..',
    '....kiiwfw..',
    '...kiiiik...',
    '..kkkkkkkk..',
    '..kGgGGgGk..',
    '..kgGGgGGk..',
    '..kGGgGGgk..',
    '..kgGGGgGk..',
    '..kkkkkkkk..',
    '...kiiiik...',
    '....kiik....',
    '....kiIk....',
    '...kkiIkkk..',
    '...kiiIiik..',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk....',
    '....kiIk.d..',
    '...kiiIik...',
    '..kiiiiIik..',
    '.kkkkkkkkkk.',
  ],
};
