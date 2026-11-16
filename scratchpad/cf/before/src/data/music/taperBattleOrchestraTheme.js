import { orchestrate, SAMPLE_DRUMS } from '../../audio/orchestrate.js';
import { TAPER_BATTLE_THEME } from './taperBattleTheme.js';

// "Keeper of the Small Flames", played by an orchestra (real recordings):
// the same piece as taperBattleTheme.js, note for note. The tune goes to a
// solo violin (it climbs higher than a trumpet can), with trumpets an octave
// under it; the strings, the racing arpeggios, the basses, the piano and the
// timpani are all real. Her music box, the bells, the organ and the choir
// stay as they were.
export const TAPER_BATTLE_ORCHESTRA_THEME = orchestrate(TAPER_BATTLE_THEME, {
  title: 'Keeper of the Small Flames (Orchestra)',
  // Recordings come out louder than the synths: turned down to sit level with the original.
  volume: 0.7,
  swap: {
    lead: { sample: 'soloViolin', volume: 0.55, release: 0.25, reverb: 0.4, pan: 0.15 },
    leadLow: { sample: 'trumpet', volume: 0.4, release: 0.15, reverb: 0.35, pan: -0.1 },
    strings: { sample: 'violins', volume: 0.35, attack: 0.05, release: 0.4, reverb: 0.35, pan: -0.25 },
    arp: { sample: 'violinsSpic', volume: 0.28, release: 0.06, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
    bass: { sample: 'cellosSpic', volume: 0.42, release: 0.06, reverb: 0.2, pan: -0.15, humanize: { time: 0.005, volume: 0.15 } },
    lowStrings: { sample: 'cellos', volume: 0.45, release: 0.4, reverb: 0.3 },
    piano: { sample: 'piano', volume: 0.5, ring: true, reverb: 0.35, humanize: { time: 0.01, volume: 0.15 } },
    timpani: { sample: 'timpani', volume: 0.6, ring: true, reverb: 0.3 },
    snare: SAMPLE_DRUMS.snare(0.4),
    crash: SAMPLE_DRUMS.crash(0.4),
    boom: SAMPLE_DRUMS.boom(0.7),
  },
});
