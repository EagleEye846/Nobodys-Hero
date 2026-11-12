import { indoors } from '../../audio/orchestrate.js';
import { GULLREST_THEME } from './gullrestTheme.js';

// "Bunting (Indoors)": Gullrest's song from inside the lifeboat house. The
// same tune and sections as gullrestTheme.js, note for note, with the band
// left out on the sand: the flute's hook, the oboe's tunes, the harp, the
// plucked bass and the soft violas pad, all softer and through a wall. No
// hand drum, shaker or claps, no piccolo gulls, no plucked-violin chop, no
// glock. The hidden clarinet (Haddock's motif in the bridge) stays: it was
// always somebody humming out of sight. G major, 4/4 at 108, the same
// sections and loop as the outdoor song (about 1m47s round).
export const GULLREST_INDOOR_THEME = indoors(GULLREST_THEME, {
  title: 'Bunting (Indoors)',
  keep: ['flute', 'oboe', 'harp', 'harpSoft', 'pad', 'bass', 'hidden'],
  muffle: 1700,
  soften: 0.8,
  tracks: { bass: { volume: 0.22 } },
});
