import { DUMMY_ATTACKS } from './dummy.js';
import { BUNNY_ATTACKS } from './bunny.js';
import { MOTH_ATTACKS } from './moth.js';
import { WAXLING_ATTACKS } from './waxling.js';
import { SHADE_ATTACKS } from './shade.js';
import { COLUMNEON_ATTACKS } from './columneon.js';
import { TAPER_ATTACKS } from './taper.js';
import { STEP_ATTACKS } from './step.js';
import { CRAGHORN_ATTACKS } from './craghorn.js';
import { CHOUGH_ATTACKS } from './chough.js';
import { FROSTBITE_ATTACKS } from './frostbite.js';
import { RINGER_ATTACKS } from './ringer.js';
import { RIMEWING_ATTACKS } from './rimewing.js';
import { ICE_STEP_ATTACKS } from './iceStep.js';

// Every enemy's own attacks, by name. Each enemy has a file here with several
// distinct attacks and bullet art that looks like things from that enemy (pins
// and buttons for the dummy, wax and candles for the waxling...). An enemy's
// data file lists which of these it uses, and every enemy needs at least three.
//
// To give a new enemy its attacks: make <enemy>.js here exporting an object of
// pattern factories (see dummy.js for the shape), then add it below.
export const ENEMY_ATTACKS = {
  ...DUMMY_ATTACKS,
  ...BUNNY_ATTACKS,
  ...MOTH_ATTACKS,
  ...WAXLING_ATTACKS,
  ...SHADE_ATTACKS,
  ...COLUMNEON_ATTACKS,
  ...TAPER_ATTACKS,
  ...STEP_ATTACKS,
  ...CRAGHORN_ATTACKS,
  ...CHOUGH_ATTACKS,
  ...FROSTBITE_ATTACKS,
  ...RINGER_ATTACKS,
  ...RIMEWING_ATTACKS,
  ...ICE_STEP_ATTACKS,
};
