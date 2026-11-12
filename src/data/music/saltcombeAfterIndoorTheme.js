import { indoors } from '../../audio/orchestrate.js';
import { SALTCOMBE_AFTER_THEME } from './saltcombeAfterTheme.js';

// "What the Tide Left (Indoors)": Saltcombe's after-the-storm song from
// inside the inn, the harbour office, the chandlery and the town hall (it
// takes over from "Salt and Rope (Indoors)" once the_light_answers has
// played). The same tune and sections as saltcombeAfterTheme.js, note for
// note: the felted piano rocking, its left hand, the tune on piano and
// fiddle and whistle, the violas in the sad part, the music box in the
// hush, and the sea further off behind the walls. No cellos, horn, choir,
// frame drum or glock. F major, 12/8 at 56, the same sections and loop as
// the outdoor song.
export const SALTCOMBE_AFTER_INDOOR_THEME = indoors(SALTCOMBE_AFTER_THEME, {
  title: 'What the Tide Left (Indoors)',
  keep: ['rock', 'left', 'piano', 'fiddle', 'whistle', 'violas', 'still', 'musicBox', 'bell', 'waves'],
  muffle: 2000,
  soften: 0.85,
  volume: 1.75,
  tracks: { waves: { muffle: 900, volume: 0.05 }, bell: { muffle: 1200 } },
});
