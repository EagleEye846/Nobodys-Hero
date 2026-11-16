import { orchestrate, SAMPLE_DRUMS } from '../../audio/orchestrate.js';
import { BAT_BATTLE_THEME } from './batBattleTheme.js';

// "Brave in the Dark", played by an orchestra (real recordings): the same
// piece as batBattleTheme.js, note for note. The violins take the tune, with
// trumpets and trombones under it; Ves's theme is a solo violin; the
// fluttering strings, the basses, the piano and the timpani are real. The
// cave's sounds (the pings and echoes, the squeaks, the wings, the ice), the
// trembling flute, the music box, the bells and the choir stay as they were.
export const BAT_BATTLE_ORCHESTRA_THEME = orchestrate(BAT_BATTLE_THEME, {
  title: 'Brave in the Dark (Orchestra)',
  // Recordings come out louder than the synths: turned down to sit level with the original.
  volume: 0.72,
  swap: {
    lead: { sample: 'violins', volume: 0.4, attack: 0.03, release: 0.25, reverb: 0.35, pan: -0.1 },
    leadLow: { sample: 'trumpet', volume: 0.38, release: 0.15, reverb: 0.35, pan: 0.1 },
    lowBrass: { sample: 'trombone', volume: 0.4, release: 0.2, reverb: 0.3, pan: -0.15 },
    ves: { sample: 'soloViolin', volume: 0.55, release: 0.3, reverb: 0.45, pan: 0.15 },
    flutter: { sample: 'violinsSpic', volume: 0.28, release: 0.06, reverb: 0.25, pan: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    tremolo: { sample: 'cellosSpic', volume: 0.22, release: 0.06, reverb: 0.25, pan: -0.3 },
    tremoloHigh: { sample: 'violinsSpic', volume: 0.2, release: 0.06, reverb: 0.25, pan: 0.35 },
    strings: { sample: 'violins', volume: 0.35, attack: 0.05, release: 0.4, reverb: 0.35 },
    padLow: { sample: 'cellos', volume: 0.2, attack: 0.15, release: 0.5, reverb: 0.4, pan: -0.3 },
    padHigh: { sample: 'violins', volume: 0.16, attack: 0.15, release: 0.5, reverb: 0.4, pan: 0.3 },
    piano: { sample: 'piano', volume: 0.5, ring: true, reverb: 0.55, humanize: { time: 0.01, volume: 0.15 } },
    bass: { sample: 'bassSpic', volume: 0.45, release: 0.06, reverb: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    lowStrings: { sample: 'cellos', volume: 0.45, release: 0.4, reverb: 0.3 },
    timpani: { sample: 'timpani', volume: 0.6, ring: true, reverb: 0.3 },
    snare: SAMPLE_DRUMS.snare(0.4),
    crash: SAMPLE_DRUMS.crash(0.4),
    boom: SAMPLE_DRUMS.boom(0.5),
  },
});
