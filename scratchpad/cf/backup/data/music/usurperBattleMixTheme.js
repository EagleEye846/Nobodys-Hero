import { orchestrate, SAMPLE_DRUMS } from '../../audio/orchestrate.js';
import { USURPER_BATTLE_THEME } from './usurperBattleTheme.js';

// "The Usurper of Dawn", mixed: the original (usurperBattleTheme.js) exactly
// as it was, every synth still playing, with a real orchestra layered under
// it on the same notes (recordings, see orchestrate.js). The synths keep its
// sound (his lead, the toll, the organ, the choir); the recordings give it
// weight: violins and trumpets under the tunes, a brass section of horns,
// trombones and tuba, a solo violin with Ves's line, racing and chugging
// strings, basses, piano, and real drums on top of the drum machine.
export const USURPER_BATTLE_MIX_THEME = orchestrate(USURPER_BATTLE_THEME, {
  title: 'The Usurper of Dawn (Mix)',
  // The recordings add up: turned down to sit level with the original.
  volume: 0.8,
  layer: {
    lead: { sample: 'violins', volume: 0.26, attack: 0.02, release: 0.2, reverb: 0.35, pan: 0.15 },
    leadLow: { sample: 'trumpet', volume: 0.26, release: 0.15, reverb: 0.35, pan: -0.15 },
    brass: { sample: 'horns', volume: 0.28, octave: -1, release: 0.2, reverb: 0.35, pan: 0.1 },
    stab: { sample: 'trombone', volume: 0.24, release: 0.08, gate: 0.5, reverb: 0.3, pan: -0.1 },
    stabHigh: { sample: 'trumpet', volume: 0.18, release: 0.08, gate: 0.5, reverb: 0.3, pan: 0.1 },
    lowBrass: { sample: 'tuba', volume: 0.3, release: 0.25, reverb: 0.25, pan: -0.2 },
    horn: { sample: 'horns', volume: 0.3, release: 0.3, reverb: 0.4 },
    ves: { sample: 'violins', volume: 0.26, attack: 0.03, release: 0.3, reverb: 0.4, pan: -0.2 },
    violin: { sample: 'soloViolin', volume: 0.34, release: 0.3, reverb: 0.45, pan: 0.25 },
    race: { sample: 'violinsSpic', volume: 0.17, release: 0.06, reverb: 0.25, pan: 0.25, humanize: { time: 0.005, volume: 0.15 } },
    chug: { sample: 'cellosSpic', volume: 0.24, release: 0.06, gate: 0.6, reverb: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    lowStrings: { sample: 'cellos', volume: 0.3, release: 0.4, reverb: 0.3 },
    bass: { sample: 'bassSpic', volume: 0.3, release: 0.06, reverb: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    piano: { sample: 'piano', volume: 0.3, ring: true, reverb: 0.35, pan: -0.2, humanize: { time: 0.01, volume: 0.15 } },
    snare: SAMPLE_DRUMS.snare(0.28),
    crash: SAMPLE_DRUMS.crash(0.3),
    boom: SAMPLE_DRUMS.boom(0.45),
  },
});
