import { indoors } from '../../audio/orchestrate.js';
import { WRACK_THEME } from './wrackTheme.js';

// "Low Tide, Green Sky (Indoors)": the Wrack Shore's song from inside the
// beached hulk, the shore heard through the planking. The same tune and
// sections as wrackTheme.js, note for note: the flute, the oboe and the
// clarinet, the solo violin's sky, the near and far harp ripples, the low
// harp and the piano under it, the violas, the drops and the far chimes, all
// softer and further off. No drums, no tremolo rain, no choir, no violins.
// D minor, 6/8 at 64, the same sections and loop as the outdoor song.
export const WRACK_INDOOR_THEME = indoors(WRACK_THEME, {
  title: 'Low Tide, Green Sky (Indoors)',
  keep: ['flute', 'oboe', 'clarinet', 'voice', 'ripple', 'rippleFar', 'low', 'piano', 'pad', 'drop', 'far'],
  muffle: 1600,
  soften: 0.8,
  volume: 1.15,
  tracks: { far: { muffle: 1000 }, rippleFar: { muffle: 1200 } },
});
