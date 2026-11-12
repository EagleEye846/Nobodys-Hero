import { indoors } from '../../audio/orchestrate.js';
import { MERROW_THEME } from './merrowTheme.js';

// "Bells Under Water (Indoors)": Merrow's song from inside the dry house
// and the ringers' loft. The same tune and sections as merrowTheme.js, note
// for note: the clarinet and the far music box, the flute, the harp's
// figure and bass, the violas, the vibes under the water, the glass, and
// the bells in the towers and the sea, further off through the walls. No
// violins, plucked strings, descant, choir or frame drum. C minor, 4/4 at
// 70, the same sections and loop as the outdoor song.
export const MERROW_INDOOR_THEME = indoors(MERROW_THEME, {
  title: 'Bells Under Water (Indoors)',
  keep: ['clarinet', 'box', 'flute', 'figure', 'harpBass', 'violas', 'under', 'glass', 'bell', 'waves'],
  muffle: 1800,
  soften: 0.8,
  tracks: { bell: { muffle: 1100 }, waves: { muffle: 900, volume: 0.06 } },
});
