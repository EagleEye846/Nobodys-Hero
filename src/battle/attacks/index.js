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
import { SLAGLING_ATTACKS } from './slagling.js';
import { BLINDFISH_ATTACKS } from './blindfish.js';
import { OLM_ATTACKS } from './olm.js';
import { MURK_ATTACKS } from './murk.js';
import { GNAWER_ATTACKS } from './gnawer.js';
import { DANDY_LION_ATTACKS } from './dandy_lion.js';
import { HAYBOB_ATTACKS } from './haybob.js';
import { GLEAMSNAIL_ATTACKS } from './gleamsnail.js';
import { QUARTZLING_ATTACKS } from './quartzling.js';
import { DRILLBUG_ATTACKS } from './drillbug.js';
import { BUNTING_ATTACKS } from './bunting.js';
import { PRISMOTH_ATTACKS } from './prismoth.js';
import { MAGPIE_MOLE_ATTACKS } from './magpiemole.js';
import { FIDDLER_ATTACKS } from './fiddler.js';
import { KELPIE_FOAL_ATTACKS } from './kelpie_foal.js';
import { GULLION_ATTACKS } from './gullion.js';
import { NET_WRAITH_ATTACKS } from './net_wraith.js';
import { STORM_IMP_ATTACKS } from './storm_imp.js';
import { OLD_DIVER_ATTACKS } from './old_diver.js';
import { PINWHEEL_ATTACKS } from './pinwheel.js';
import { WRACKEEL_ATTACKS } from './wrackeel.js';
import { SHELLAC_ATTACKS } from './shellac.js';
import { MOONJELLY_ATTACKS } from './moonjelly.js';
import { LIMPET_KNIGHT_ATTACKS } from './limpet_knight.js';
import { DUNLIN_DANCER_ATTACKS } from './dunlin_dancer.js';
import { BELLBUOY_ATTACKS } from './bellbuoy.js';
import { SALT_SHADE_ATTACKS } from './salt_shade.js';
import { SANDCASTLE_ATTACKS } from './sandcastle.js';
import { DOWAGER_CRAB_ATTACKS } from './dowager_crab.js';
import { OLD_GULPER_ATTACKS } from './old_gulper.js';
import { SEED_SHEEP_ATTACKS } from './seed_sheep.js';
import { CAPBEE_ATTACKS } from './capbee.js';
import { CLOVER_SNAIL_ATTACKS } from './clover_snail.js';
import { RUMBOLD_ATTACKS } from './rumbold.js';
import { RUMBOLD_BROKEN_ATTACKS } from './rumboldBroken.js';
import { RUMBOLD_ALIVE_ATTACKS } from './rumboldAlive.js';
import { CORRIE_ATTACKS } from './corrie.js';
import { BARNACLE_BAT_ATTACKS } from './barnacle_bat.js';
import { WHELKLING_ATTACKS } from './whelkling.js';
import { GHOST_DECKHAND_ATTACKS } from './ghost_deckhand.js';
import { POWDER_MONKEY_ATTACKS } from './powder_monkey.js';
import { CAPTAIN_TARRY_ATTACKS } from './captain_tarry.js';
import { TALLY_ATTACKS } from './tally.js';
import { FAIRWEATHER_ATTACKS } from './fairweather.js';
import { PUDDING_ATTACKS } from './pudding.js';

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
  ...SLAGLING_ATTACKS,
  ...BLINDFISH_ATTACKS,
  ...OLM_ATTACKS,
  ...MURK_ATTACKS,
  ...GNAWER_ATTACKS,
  ...DANDY_LION_ATTACKS,
  ...HAYBOB_ATTACKS,
  ...GLEAMSNAIL_ATTACKS,
  ...QUARTZLING_ATTACKS,
  ...DRILLBUG_ATTACKS,
  ...BUNTING_ATTACKS,
  ...PRISMOTH_ATTACKS,
  ...MAGPIE_MOLE_ATTACKS,
  ...FIDDLER_ATTACKS,
  ...KELPIE_FOAL_ATTACKS,
  ...GULLION_ATTACKS,
  ...NET_WRAITH_ATTACKS,
  ...STORM_IMP_ATTACKS,
  ...OLD_DIVER_ATTACKS,
  ...PINWHEEL_ATTACKS,
  ...WRACKEEL_ATTACKS,
  ...SHELLAC_ATTACKS,
  ...MOONJELLY_ATTACKS,
  ...LIMPET_KNIGHT_ATTACKS,
  ...DUNLIN_DANCER_ATTACKS,
  ...BELLBUOY_ATTACKS,
  ...SALT_SHADE_ATTACKS,
  ...SANDCASTLE_ATTACKS,
  ...DOWAGER_CRAB_ATTACKS,
  ...OLD_GULPER_ATTACKS,
  ...SEED_SHEEP_ATTACKS,
  ...CAPBEE_ATTACKS,
  ...CLOVER_SNAIL_ATTACKS,
  ...RUMBOLD_ATTACKS,
  ...RUMBOLD_BROKEN_ATTACKS,
  ...RUMBOLD_ALIVE_ATTACKS,
  ...CORRIE_ATTACKS,
  ...BARNACLE_BAT_ATTACKS,
  ...WHELKLING_ATTACKS,
  ...GHOST_DECKHAND_ATTACKS,
  ...POWDER_MONKEY_ATTACKS,
  ...CAPTAIN_TARRY_ATTACKS,
  ...TALLY_ATTACKS,
  ...FAIRWEATHER_ATTACKS,
  ...PUDDING_ATTACKS,
};
