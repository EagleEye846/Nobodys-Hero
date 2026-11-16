import { orchestrate, SAMPLE_DRUMS } from '../../audio/orchestrate.js';
import { USURPER_BATTLE_THEME } from './usurperBattleTheme.js';

// "The Usurper of Dawn", played by an orchestra (real recordings): the same
// piece as usurperBattleTheme.js, note for note. His tune goes to the
// violins, trumpets under it; the brass section is horns, trombones and a
// tuba; Ves's theme is the violins too, the solo line a solo violin; the racing and
// chugging strings, the basses and the piano are real. The toll, the music
// box, the organ, the choir and chant, and his timpani (they go lower than
// the recorded ones) stay as they were.
export const USURPER_BATTLE_ORCHESTRA_THEME = orchestrate(USURPER_BATTLE_THEME, {
  title: 'The Usurper of Dawn (Orchestra)',
  // Recordings come out louder than the synths: turned down to sit level with the original.
  volume: 0.74,
  swap: {
    lead: { sample: 'violins', volume: 0.4, attack: 0.02, release: 0.2, reverb: 0.35, pan: 0.1 },
    leadLow: { sample: 'trumpet', volume: 0.38, release: 0.15, reverb: 0.35, pan: -0.15 },
    brass: { sample: 'horns', volume: 0.42, octave: -1, release: 0.2, reverb: 0.35, pan: 0.1 },
    stab: { sample: 'trombone', volume: 0.35, release: 0.08, gate: 0.5, reverb: 0.3, pan: -0.1 },
    stabHigh: { sample: 'trumpet', volume: 0.28, release: 0.08, gate: 0.5, reverb: 0.3, pan: 0.1 },
    lowBrass: { sample: 'tuba', volume: 0.42, release: 0.25, reverb: 0.25, pan: -0.2 },
    horn: { sample: 'horns', volume: 0.45, release: 0.3, reverb: 0.4 },
    ves: { sample: 'violins', volume: 0.42, attack: 0.03, release: 0.3, reverb: 0.4, pan: -0.2 },
    violin: { sample: 'soloViolin', volume: 0.5, release: 0.3, reverb: 0.45, pan: 0.25 },
    race: { sample: 'violinsSpic', volume: 0.25, release: 0.06, reverb: 0.25, pan: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    chug: { sample: 'cellosSpic', volume: 0.35, release: 0.06, gate: 0.6, reverb: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    lowStrings: { sample: 'cellos', volume: 0.45, release: 0.4, reverb: 0.3 },
    bass: { sample: 'bassSpic', volume: 0.45, release: 0.06, reverb: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    piano: { sample: 'piano', volume: 0.45, ring: true, reverb: 0.35, pan: -0.2, humanize: { time: 0.01, volume: 0.15 } },
    snare: SAMPLE_DRUMS.snare(0.42),
    crash: SAMPLE_DRUMS.crash(0.45),
    boom: SAMPLE_DRUMS.boom(0.65),
  },
});
