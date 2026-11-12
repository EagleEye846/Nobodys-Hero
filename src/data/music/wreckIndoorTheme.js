import { indoors } from '../../audio/orchestrate.js';
import { WRECK_THEME } from './wreckTheme.js';

// "Fog Bell (Indoors)": the Wreck Yard's song from inside a hull (the galley,
// the pump room, the pocket in the wreck), the yard heard through the iron.
// The same tune and sections as wreckTheme.js, note for note: the oboe and
// the clarinet, the flute and the bowed vibes in the fog, the harp's drip and
// its bass, the low strings sul tasto, the creak, the far music box and the
// bell buoy, all softer and further off. No drums (the ambience's own hull
// creaks do the knocking in here), no violins, no swell, no choir.
// E minor, 3 + 3 + 2 at 66, the same sections and loop as the outdoor song.
export const WRECK_INDOOR_THEME = indoors(WRECK_THEME, {
  title: 'Fog Bell (Indoors)',
  keep: ['oboe', 'clarinet', 'flute', 'fog', 'drip', 'harpBass', 'tasto', 'tastoHigh', 'creak', 'box', 'bell'],
  muffle: 1500,
  soften: 0.8,
  volume: 1.2,
  tracks: { bell: { muffle: 900 }, box: { muffle: 1400 } },
});
