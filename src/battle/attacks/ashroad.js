import { ASHLING_ATTACKS } from './ashling.js';
import { SOOT_GULL_ATTACKS } from './soot_gull.js';
import { CHARCUR_ATTACKS } from './charcur.js';
import { MILESTONE_ATTACKS } from './milestone.js';
import { THE_LUM_ATTACKS } from './the_lum.js';

// Chapter 6's Ash Road: every monster's attacks there, in one place, so the
// list in index.js only needs the one line.
export const ASHROAD_ATTACKS = {
  ...ASHLING_ATTACKS,
  ...SOOT_GULL_ATTACKS,
  ...CHARCUR_ATTACKS,
  ...MILESTONE_ATTACKS,
  ...THE_LUM_ATTACKS,
};
