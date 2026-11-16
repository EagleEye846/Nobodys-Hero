import { indoors } from '../../audio/orchestrate.js';
import { SALTCOMBE_THEME } from './saltcombeTheme.js';

// "Salt and Rope (Indoors)": Saltcombe's song from inside the inn, the
// harbour office, the chandlery and the town hall. The same tune and
// sections as saltcombeTheme.js, note for note, with most of the town left
// out on the boardwalks: the tune (flute, then clarinet, the oboe in the
// market and by the fire), the harp, the reed breathing, the walking bass
// and the soft pad, all softer and through a wall. No oom-pah-pah, no
// hand drum, no glock, no thirds or countermelodies. The wrong note, the
// drips off the eaves, the door-on-the-storm hiss and the quay clock stay,
// further off. F major, 3/4 at 88, the same sections and loop as the
// outdoor song (about 1m38s round).
export const SALTCOMBE_INDOOR_THEME = indoors(SALTCOMBE_THEME, {
  title: 'Salt and Rope (Indoors)',
  keep: ['flute', 'clarinet', 'oboe', 'reed', 'harp', 'harpSoft', 'pad', 'bass', 'wrong', 'drop', 'rain', 'clock'],
  muffle: 1700,
  soften: 0.8,
  tracks: { bass: { volume: 0.2 }, clock: { muffle: 900, volume: 0.1 }, rain: { muffle: 1200 } },
});
