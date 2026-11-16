import { indoors } from '../../audio/orchestrate.js';
import { LANES_THEME } from './lanesTheme.js';

// "Half-Drowned Church (Indoors)": the Sunken Lanes' song from up in the
// attic, the church across the water heard through the roof. The same
// hymn and sections as lanesTheme.js, note for note: the hymn on vibes and
// the far music box, the sung hymn, the solo violin, the lullaby from under
// the water, the harp's water and bass, the violas and the organ key, all
// softer and further off. No horns or foghorn, no choir pad, no violins.
// D minor, 4/4 at 58, the same sections and loop as the outdoor song.
export const LANES_INDOOR_THEME = indoors(LANES_THEME, {
  title: 'Half-Drowned Church (Indoors)',
  keep: ['hymn', 'box', 'sing', 'voice', 'under', 'underHum', 'harpMotif', 'bass', 'water', 'violas', 'key', 'glass', 'drop', 'bell'],
  muffle: 1500,
  soften: 0.8,
  volume: 1.05,
  tracks: { bell: { muffle: 1000 } },
});
