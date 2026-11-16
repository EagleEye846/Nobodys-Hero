// What the party holds in battle, drawn the same pixel size as their sprites
// (src/battle/partyMoves.js swings, raises and points these from their hands).
// Every weapon is drawn pointing straight up, and `grip` is the pixel it's
// held by: it turns about that point.
//
// The hero's sword (any weapon he has that isn't the Fallen Star is shown as a
// plain sword), the Fallen Star (longer, star-metal, a star set in its guard),
// Ves's umbrella furled (for jabs and swings) and open (side on: a shield, a
// sail, a canopy held up to the sky), and Bramble's hatchet, its blade facing
// forward. Then the things they pull out of their pockets, and the bush
// Bramble hides in.

const K = '#120c1c';

export const KIT_WEAPONS = {
  sword: {
    grip: { x: 3, y: 9.5 },
    palette: { k: K, w: '#eef3fa', W: '#b8c0d0', y: '#c9a04a', b: '#6b3f2a' },
    rows: [
      '..kk..',
      '.kwWk.',
      '.kwWk.',
      '.kwWk.',
      '.kwWk.',
      '.kwWk.',
      '.kwWk.',
      '.kwWk.',
      'kyyyyk',
      '.kbbk.',
      '.kbbk.',
      '..kk..',
    ],
  },
  // The Fallen Star: pale star-metal with a blue edge, a glint halfway up, and a
  // white star in a gold guard.
  star: {
    grip: { x: 4, y: 13 },
    palette: { k: K, s: '#eaf6ff', g: '#9ad8ff', G: '#ffffff', Y: '#f0c050' },
    rows: [
      '...kk...',
      '..kGgk..',
      '..ksgk..',
      '..ksgk..',
      '..ksgk..',
      '..kGgk..',
      '..ksgk..',
      '..ksgk..',
      '..ksgk..',
      '..ksgk..',
      '.kksgkk.',
      'kYYGGYYk',
      '.kkYYkk.',
      '..kkkk..',
      '..kYYk..',
      '...kk...',
    ],
  },
  // Ves's umbrella, furled: the steel tip, the plum silk wound tight round the
  // shaft with a gold tie, and the hooked gold handle.
  umbrella: {
    grip: { x: 2, y: 14 },
    palette: { k: K, S: '#b8c0d0', q: '#7a3a5e', Q: '#5a2846', d: '#7a4f2a', 4: '#f0c050' },
    rows: [
      '..k..',
      '.kSk.',
      '.kqk.',
      'kqQqk',
      'kqQqk',
      'kQqQk',
      'kqQqk',
      'kq4qk',
      '.kqk.',
      '.kdk.',
      '.kdk.',
      '.kdk.',
      '.kdk.',
      '.kdk.',
      '.k4k.',
      '.k44k',
      '..kk.',
    ],
  },
  // Open, side on: the dome, its ribs and the patch, then the shaft and hook.
  umbrellaOpen: {
    grip: { x: 7, y: 13 },
    palette: { k: K, S: '#b8c0d0', q: '#7a3a5e', Q: '#5a2846', p: '#a8608a', d: '#7a4f2a', 4: '#f0c050' },
    rows: [
      '.......k.......',
      '.....kkSkk.....',
      '...kkppppqkk...',
      '..kpppqqqq4qk..',
      '.kqqQqqqqqQqqk.',
      'kqQqqqQqqqqQqqk',
      'kkQkkQkkkQkkQkk',
      '......kdk......',
      '......kdk......',
      '......kdk......',
      '......kdk......',
      '......kdk......',
      '......kdk......',
      '......k4k......',
      '......k44k.....',
      '.......kk......',
    ],
  },
  // Bramble's hatchet: a long handle, the head forward of it, its edge bright.
  axe: {
    grip: { x: 1, y: 10.5 },
    palette: { k: K, l: '#8a5a32', L: '#5a3a1e', M: '#8a8296', S: '#e6ecf4', O: '#5a5468' },
    rows: [
      'kkkkkk..',
      'kOkMMSk.',
      'kOkMMSSk',
      'kOkMMSSk',
      'kkkMMSk.',
      'klkkkk..',
      'klk.....',
      'klk.....',
      'kLk.....',
      'klk.....',
      'klk.....',
      'kLk.....',
      'kkk.....',
    ],
  },
};

// Things pulled out of a pocket: food, a candle (its flame flickers between
// two), anything else (a little flask), and Ves's soup.
export const KIT_ITEMS = {
  food: {
    palette: { k: K, T: '#d9a35a', t: '#f4d79a', r: '#b0703a' },
    rows: [
      '.kkkkk.',
      'kTtTtTk',
      'ktTTTtk',
      'kTTrTTk',
      '.kkkkk.',
    ],
  },
  candle: {
    palette: { k: K, y: '#ffd25e', Y: '#fff2a0', E: '#ece4d4', e: '#c8bca8' },
    rows: [
      '...y...',
      '..yYy..',
      '...k...',
      '.kkkkk.',
      '.kEEek.',
      '.kEEek.',
      '.kEEek.',
      '.kkkkk.',
    ],
  },
  other: {
    palette: { k: K, c: '#a8784a', B: '#7fd0ff', b: '#3f8fd0', z: '#ffffff' },
    rows: [
      '..kkk..',
      '..kck..',
      '.kkkkk.',
      'kBzBBBk',
      'kBBBBbk',
      'kbBBbbk',
      '.kkkkk.',
    ],
  },
  soup: {
    palette: { k: K, G: '#4a74b0', J: '#30508a', s: '#ece4d4' },
    rows: [
      '..s.s..',
      '.s.s...',
      '.kkkkk.',
      '.kGGJk.',
      '.kGGJk.',
      '.kGGJk.',
      '.kkkkk.',
    ],
  },
};

// The bush Bramble dives into (HIDE): leafy and round, a few red leaves like
// the one in his hair. Drawn by partyMoves.js from these circles (x, y,
// radius) on a 24x14 grid, lit from the top left.
export const KIT_BUSH = {
  w: 24,
  h: 14,
  blobs: [[6, 9, 5.5], [12, 6.5, 6.5], [18, 9, 5.5], [9, 10, 5], [15, 10, 5]],
  colors: { outline: K, dark: '#1f4a30', mid: '#2f6b45', light: '#4a9a5a', shine: '#8ad07a', berry: '#e0402e' },
  berries: [[8, 6], [15, 4], [19, 8], [11, 10]],
};
