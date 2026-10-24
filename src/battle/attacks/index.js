import { DUMMY_ATTACKS } from './dummy.js';
import { BUNNY_ATTACKS } from './bunny.js';
import { MOTH_ATTACKS } from './moth.js';
import { WAXLING_ATTACKS } from './waxling.js';
import { DUSKLING_ATTACKS } from './duskling.js';
import { COLUMNEON_ATTACKS } from './columneon.js';
import { TAPER_ATTACKS } from './taper.js';
import { STEP_ATTACKS } from './step.js';
import { CRAGHORN_ATTACKS } from './craghorn.js';
import { CHOUGH_ATTACKS } from './chough.js';
import { FROSTBITE_ATTACKS } from './frostbite.js';
import { RINGER_ATTACKS } from './ringer.js';
import { RIMEWING_ATTACKS } from './rimewing.js';
import { ICE_STEP_ATTACKS } from './iceStep.js';
import { STONE_GOLEM_ATTACKS } from './stone_golem.js';
import { ICE_MOTH_ATTACKS } from './ice_moth.js';
import { GLINTLING_ATTACKS } from './glintling.js';
import { GREAT_BAT_ATTACKS } from './great_bat.js';
import { USURPER_ATTACKS } from './usurper.js';
import { BURRHOG_ATTACKS } from './burrhog.js';
import { SAPLING_ATTACKS } from './sapling.js';
import { RUSSET_ATTACKS } from './russet.js';
import { KNOTLING_ATTACKS } from './knotling.js';
import { PUFFCAP_ATTACKS } from './puffcap.js';
import { HAYWARD_ATTACKS } from './hayward.js';
import { GLOAMWORM_ATTACKS } from './gloamworm.js';
import { SLIPJACK_ATTACKS } from './slipjack.js';
import { CLINKER_ATTACKS } from './clinker.js';
import { HOB_ATTACKS } from './hob.js';
import { GRIST_ATTACKS } from './grist.js';
import { SILTLING_ATTACKS } from './siltling.js';
import { WISP_ATTACKS } from './wisp.js';
import { BOG_TOAD_ATTACKS } from './bog_toad.js';
import { REED_STALKER_ATTACKS } from './reed_stalker.js';
import { LAMP_MITE_ATTACKS } from './lamp_mite.js';
import { CAIRN_HOUND_ATTACKS } from './cairn_hound.js';
import { HERALDS_ECHO_ATTACKS } from './heralds_echo.js';
import { HUSH_ATTACKS } from './the_hush.js';
import { WARDEN_ATTACKS } from './warden.js';
import { TATTERWIGHT_ATTACKS } from './tatterwight.js';

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
  ...DUSKLING_ATTACKS,
  ...COLUMNEON_ATTACKS,
  ...TAPER_ATTACKS,
  ...STEP_ATTACKS,
  ...CRAGHORN_ATTACKS,
  ...CHOUGH_ATTACKS,
  ...FROSTBITE_ATTACKS,
  ...RINGER_ATTACKS,
  ...RIMEWING_ATTACKS,
  ...ICE_STEP_ATTACKS,
  ...STONE_GOLEM_ATTACKS,
  ...ICE_MOTH_ATTACKS,
  ...GLINTLING_ATTACKS,
  ...GREAT_BAT_ATTACKS,
  ...USURPER_ATTACKS,
  ...BURRHOG_ATTACKS,
  ...SAPLING_ATTACKS,
  ...RUSSET_ATTACKS,
  ...KNOTLING_ATTACKS,
  ...PUFFCAP_ATTACKS,
  ...HAYWARD_ATTACKS,
  ...GLOAMWORM_ATTACKS,
  ...SLIPJACK_ATTACKS,
  ...CLINKER_ATTACKS,
  ...SILTLING_ATTACKS,
  ...HOB_ATTACKS,
  ...GRIST_ATTACKS,
  ...WISP_ATTACKS,
  ...BOG_TOAD_ATTACKS,
  ...REED_STALKER_ATTACKS,
  ...LAMP_MITE_ATTACKS,
  ...CAIRN_HOUND_ATTACKS,
  ...HERALDS_ECHO_ATTACKS,
  ...HUSH_ATTACKS,
  ...WARDEN_ATTACKS,
  ...TATTERWIGHT_ATTACKS,
};
