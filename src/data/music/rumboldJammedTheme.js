import { melody, transpose, hits, HOLD, REST } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi } from './parts/usurper.js';
import { cellIn, FIRST_STEPS_MINOR } from './parts/chapter4.js';
import { RUMBOLD_HOOK, RUMBOLD_HOOK_CHORDS, TUCK_TUNE, TUCK_CHORDS } from './rumboldTheme.js';

// "Behind the Curtain": the second half of the duel with King Peptup
// (rumboldTheme.js). Mid-fight the king's jaw jams half open, his voice
// keeps going, and the curtain behind the throne slips: Tuck the dormouse on
// his little stool, both hands on the levers, mouthing the words. From here
// you spare the king by talking to Tuck. So this is sparing music: the
// show's tune running down like a wound-up toy, and under it, then instead
// of it, the small true tune of the one who was doing the voice.
//
// The battle swaps to it with the phase's `music` (as the Hush's fight hands
// over to "Nobody's Dawn"): `music: 'rumboldJammed'` on the phase that starts
// when the jaw jams.
//
// THE SHOW, RUNNING DOWN: the king's hook (the first eight bars of "The
//   Resplendent Hour") at less than half the speed, on the calliope's pipe
//   and a piano, both going flatter every two bars (12 cents, then 30, 55,
//   85) like a music box whose spring is giving out. Notes drop out as it
//   goes, until only the first note of each bar is left, and the ta-da
//   never comes. The oom-pah under it limps and lags. The jaw clacks once,
//   and then once more, quietly, and that's all.
// TUCK'S TUNE: the same four notes, minor, with his stammer at the front
//   (D, D-G Bb A), on a clarinet, close and in tune, the harp answering like
//   a music box, a solo violin holding his hand. It ends on G MAJOR.
// THE VOICE: the king's cell on the broken pipe, and Tuck answering it in
//   his own small voice, back and forth, like the TALK in the fight. Each
//   time the pipe comes back it is a little less flat, as if the show were
//   learning to listen.
// THE TUNE, WHOLE: the king's hook at last in tune and in one piece, played
//   kindly, not shouted: a solo violin with Tuck's clarinet under it, the harp
//   rolling, a music box on top. The ta-da comes this time, softly.
// WINDING DOWN: the music box alone with the king's first three notes,
//   stuck, going round and round (F Bb D, F Bb D...) in threes against the
//   fours of the bar, while a second box a quarter-tone flat takes over note
//   by note. It never gets to the fourth note. (That stuck, flat box is what
//   wakes up in "No Strings".)
// The strings under all of it are warm and in tune the whole way: whatever
// the show was, the folk listening were real.
//
// Bb major, then G minor to G major, then home to Bb. 66 BPM, one step a
// 16th, so a bar is 3.6 seconds. The clunk plays once (3.6s); then it loops,
// 36 bars, 2m11s:
//
//   intro   1 bar   the jaw jams: a clack, a low thud, a sour chord let go
//   A       8 bars  0:00 the show running down: the hook slowed, flattening,
//                   falling apart over a limping oom-pah and soft strings
//   B       8 bars  0:29 Tuck: his tune on the clarinet, the harp's music
//                   box answering, a solo violin; the broken pipe tries the
//                   cell twice, softer each time; G major to finish
//   C       8 bars  0:58 the voice: the pipe calls the king's cell, Tuck
//                   answers it, three times, the pipe less flat each time;
//                   then Tuck alone, climbing to a D major chord
//   D       8 bars  1:27 the tune, whole: the king's hook in tune, gently, on
//                   solo violin and clarinet, harp and music box; the ta-da
//   E       4 bars  1:56 winding down: the music box stuck on three notes,
//                   going flat, a last clack, and back to the show at A

// --- Helpers. ---
const BAR = 16;
const r16 = (text) => melody(text, 1);
const r8 = (text) => melody(text, 2);
const rest = (bars) => Array(bars * BAR).fill(REST);
const at = (bars, track) => [...rest(bars), ...track];
const barsOf = (track, from, to) => track.slice(from * BAR, to * BAR);
const held = (name, steps) => [typeof name === 'number' ? name : midi(name), ...Array(steps - 1).fill(HOLD)];
const R = REST;
const H = HOLD;
function section(bars, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => {
    if (steps.length > bars * BAR) throw new Error(`Behind the Curtain: '${name}' is ${steps.length} steps, longer than ${bars} bars`);
    return [name, [...steps, ...Array(bars * BAR - steps.length).fill(REST)]];
  }));
}

// Chords as in rumboldTheme.js: R root, T third, F fifth, '+' an octave up, '-' one down.
const QUALITY = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7], dim: [0, 3, 6] };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m|7|dim)?$/);
  if (!m) throw new Error(`Behind the Curtain: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''] };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
function comp(chords, pattern, low) {
  return chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
    const parts = bar.split(',');
    const each = BAR / parts.length;
    return parts.flatMap((symbol, i) => {
      const chord = chordOf(symbol);
      const slice = pattern.slice(i * each, (i + 1) * each);
      if (i > 0 && slice[0] === H) slice[0] = pattern[0];
      return slice.map((p) => (p === R || p === H ? p : inBand(chord.root, low) + chord.tones['RTF'.indexOf(p[0])] + (p.endsWith('+') ? 12 : p.endsWith('-') ? -12 : 0)));
    });
  });
}
const holdBar = (p) => [p, ...Array(BAR - 1).fill(H)];

// --- The show, running down. Each pair of bars keeps fewer of its notes:
// all of them, then three in four, then every other one, then only the first. ---
const HOOK8 = barsOf(RUMBOLD_HOOK, 0, 8);
const HOOK8_CH = RUMBOLD_HOOK_CHORDS.split(' ').slice(0, 8).join(' ');
function fallApart(track) {
  const out = [];
  for (let b = 0; b < track.length / BAR; b++) {
    const stage = Math.floor(b / 2);
    let n = 0;
    let dropped = false;
    for (const s of barsOf(track, b, b + 1)) {
      if (typeof s === 'number') {
        const keep = stage === 0 || (stage === 1 && n % 4 !== 3) || (stage === 2 && n % 2 === 0) || (stage === 3 && n === 0);
        n++;
        dropped = !keep;
        out.push(keep ? s : R);
      } else out.push(s === H && dropped ? R : s);
    }
  }
  // The ta-da never comes: the last bar's top note is gone too.
  return out;
}
const RUNDOWN = fallApart(HOOK8);
// Split across four instruments, two bars each, each a little flatter.
const stageOf = (track, stage) => track.map((s, i) => (Math.floor(i / (2 * BAR)) === stage ? s : (typeof s === 'number' || s === H ? R : s)));

// The oom-pah, limping: the oom on one, the pah late, gaps growing.
const LIMP = ['R-', H, R, R, R, R, R, R, 'F-', H, R, R, R, R, R, R];
const oom = fallApart(comp(HOOK8_CH, LIMP, 46));

// --- Tuck. ---
const TUCK = r8(TUCK_TUNE);
// The harp answering in the long notes of his tune.
const ANSWER = r8(`
  . . . . . . . . | . . . . . . G5 D5 | . . . . . . . . | . . . . . . A4 F#4 |
  . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . B4 D5 G5 B5 . . |
`);
// The broken pipe trying the cell, minor, flat; then softer.
const [c0, c1, c2, c3] = cellIn('G4', FIRST_STEPS_MINOR);
const TRY = [c0, R, c1, R, c2, R, c3, H, H, H, R, R, R, R, R, R];

// --- The voice: the pipe calls, Tuck answers. ---
const CALL = barsOf(RUMBOLD_HOOK, 0, 1);                       // F Bb D C
const ANSWER_BAR = r8('D5 . D5 G5 - Bb5 A5 -');               // D, D-G Bb A
const VOICE_CH = 'Bb Gm Bb Gm Bb Gm Cm D';
const VOICE_END = r8('G4 - Bb4 C5 - Eb5 D5 - | - - F#5 - A5 - D6 -');
// Bars 0, 2 and 4 the pipe (flattest first); bars 1, 3, 5 and the end Tuck.
const callOn = (bar) => [...rest(bar), ...CALL];
const VOICE_TUCK = [...rest(1), ...ANSWER_BAR, ...rest(1), ...ANSWER_BAR, ...rest(1), ...ANSWER_BAR, ...VOICE_END];
// The harp rolling up each chord in 8ths.
const ROLL = ['R', R, 'F', R, 'R+', R, 'T+', R, 'F+', R, 'T+', R, 'R+', R, 'F', R];

// --- The tune, whole: the hook's first eight bars, in tune. ---
const HOOK_KIND = barsOf(RUMBOLD_HOOK, 0, 8);
// The ta-da, softly: the harp spreads a Bb chord under the last bar.
const SOFT_TADA = r16('Bb3 D4 F4 Bb4 D5 F5 Bb5 - - - - - - - - -');

// --- Winding down: the first three notes of the cell, stuck, in threes.
// Two boxes play them, one in tune and one a quarter-tone flat; the flat one
// takes over note by note, and in the last bar the notes thin out. ---
const STUCK = [midi('F6'), midi('Bb6'), midi('D7')];
function stuckBox() {
  const tuned = [];
  const sour = [];
  for (let i = 0; i < 4 * BAR; i += 2) {
    const bar = Math.floor(i / BAR);
    const k = i / 2;
    const play = bar < 3 || k % 2 === 0;
    const flat = bar === 0 ? false : bar === 1 ? k % 3 === 2 : bar === 2 ? k % 2 === 1 : true;
    const note = play ? STUCK[k % 3] : R;
    tuned.push(...(flat || !play ? [R, R] : [note, H]));
    sour.push(...(flat && play ? [note, H] : [R, R]));
  }
  // It stops short of the fourth note, every time.
  return { tuned: [...tuned.slice(0, -4), R, R, R, R], sour: [...sour.slice(0, -4), R, R, R, R] };
}
const BOX = stuckBox();

// The player stretches a note from the nearest recording, so any note inside
// an instrument's whole span keeps its written pitch. Only a note more than
// three semitones beyond the lowest or highest recording moves by octaves,
// to inside it.
const near = (n, notes) => n >= Math.min(...notes) - 3 && n <= Math.max(...notes) + 3;

const FLAT = (cents) => -cents / 1200;
const pipe = (cents, volume) => ({ sample: 'recorder', octave: FLAT(cents), volume, attack: 0.03, release: 0.3, reverb: 0.45, pan: 0.25, humanize: { time: 0.02, volume: 0.15 } });
const toy = (cents, volume) => ({ sample: 'grandPiano', octave: FLAT(cents), volume, release: 0.4, reverb: 0.45, pan: -0.15, humanize: { time: 0.02, volume: 0.15 } });

const song = {
  title: 'Behind the Curtain',
  bpm: 66,
  stepsPerBeat: 4,
  volume: 1.83,

  instruments: {
    // The jaw, once more, and the thud of it jamming.
    clack: { sample: 'claps', drum: 'sample', volume: 0.32, ring: true, reverb: 0.2 },
    thud: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.35 },
    // The show, running down: pipe and piano, flatter and flatter.
    pipe0: pipe(12, 0.2),
    pipe1: pipe(30, 0.18),
    pipe2: pipe(55, 0.16),
    pipe3: pipe(85, 0.14),
    toy0: toy(12, 0.22),
    toy1: toy(30, 0.2),
    toy2: toy(55, 0.18),
    toy3: toy(85, 0.16),
    tuba: { sample: 'tuba', volume: 0.26, attack: 0.02, release: 0.3, reverb: 0.3, humanize: { time: 0.04, volume: 0.2 } },
    // Tuck.
    tuck: { sample: 'clarinet', volume: 0.36, attack: 0.06, release: 0.5, reverb: 0.5, pan: -0.05, humanize: { time: 0.014, volume: 0.1 } },
    harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.55, pan: 0.2, echo: { time: 0.45, feedback: 0.25, mix: 0.2 }, humanize: { time: 0.01, volume: 0.12 } },
    soloViolin: { sample: 'soloViolin', volume: 0.3, attack: 0.15, release: 0.7, reverb: 0.55, pan: 0.15, humanize: { time: 0.014, volume: 0.1 } },
    // The strings under it all, in tune.
    violas: { sample: 'violas', volume: 0.2, attack: 0.5, release: 1, reverb: 0.5, pan: -0.1 },
    cellos: { sample: 'cellos', volume: 0.22, attack: 0.5, release: 1, reverb: 0.5, pan: -0.25 },
    // The music box, in tune and a quarter-tone flat; the harp rolling.
    box: { sample: 'glock', volume: 0.15, ring: true, reverb: 0.55, pan: 0.2, echo: { time: 0.45, feedback: 0.25, mix: 0.25 } },
    boxSour: { sample: 'glock', octave: FLAT(45), volume: 0.16, ring: true, reverb: 0.55, pan: -0.2, echo: { time: 0.45, feedback: 0.3, mix: 0.3 } },
    harpRoll: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.5, pan: -0.2, humanize: { time: 0.012, volume: 0.15 } },
    // The sour chord, let go.
    sour: { sample: 'violins', octave: FLAT(40), volume: 0.18, attack: 0.02, release: 1.2, reverb: 0.5, pan: 0.2 },
  },

  sections: {
    // The jaw jams: a clack, a low thud, a sour chord let go.
    intro: section(1, {
      clack: hits('x....... ........'),
      thud: hits('..x..... ........'),
      sour: [...r16('. . D5 - - - - - - - . . . . . .')],
      cellos: [...r16('. . Bb2 - - - - - - - - - . . . .')],
    }),

    // The show running down over a limping oom-pah and soft strings.
    A: section(8, {
      ...Object.fromEntries([0, 1, 2, 3].flatMap((k) => [[`pipe${k}`, stageOf(RUNDOWN, k)], [`toy${k}`, transpose(stageOf(RUNDOWN, k), -12)]])),
      tuba: oom,
      violas: comp(HOOK8_CH, holdBar('T'), 55),
      cellos: comp(HOOK8_CH, holdBar('R'), 43),
      clack: [...rest(2), ...hits('........ ......x.'), ...rest(2), ...hits('........ ..x.....'), ...rest(2)],
    }),

    // Tuck: his tune on the clarinet, the harp answering, a solo violin; the
    // broken pipe tries the cell twice, softer each time. G major.
    B: section(8, {
      tuck: TUCK,
      harp: ANSWER,
      soloViolin: at(4, comp(TUCK_CHORDS.split(' ').slice(4).join(' '), holdBar('T'), 62)),
      violas: comp(TUCK_CHORDS, holdBar('F'), 50),
      cellos: comp(TUCK_CHORDS, holdBar('R'), 43),
      pipe3: [...rest(1), ...TRY, ...rest(6)],
      toy3: [...rest(5), ...transpose(TRY, -12).map((s, i) => (i > 6 && typeof s === 'number' ? R : s)), ...rest(2)],
    }),

    // The voice: the pipe calls the king's cell, Tuck answers, three times,
    // the pipe a little less flat each time; then Tuck alone, up to D major.
    C: section(8, {
      pipe3: callOn(0),
      pipe2: callOn(2),
      pipe1: callOn(4),
      toy2: transpose(callOn(2), -12),
      toy1: transpose(callOn(4), -12),
      tuck: VOICE_TUCK,
      harpRoll: at(1, comp(VOICE_CH.split(' ').slice(1).join(' '), ROLL, 50)),
      soloViolin: at(6, comp('Cm D', holdBar('T'), 62)),
      violas: comp(VOICE_CH, holdBar('F'), 50),
      cellos: comp(VOICE_CH, holdBar('R'), 43),
      clack: hits('........ ........ ........ ......x.'),
    }),

    // The tune, whole: the king's hook in tune and kind, on solo violin and
    // Tuck's clarinet; the harp rolling; the music box on top; the ta-da.
    D: section(8, {
      soloViolin: HOOK_KIND,
      tuck: transpose(HOOK_KIND, -12),
      box: at(4, transpose(barsOf(HOOK_KIND, 4, 8), 24)),
      harpRoll: [...comp(HOOK8_CH.split(' ').slice(0, 7).join(' '), ROLL, 46), ...SOFT_TADA],
      violas: comp(HOOK8_CH, holdBar('T'), 55),
      cellos: comp(HOOK8_CH, holdBar('R'), 43),
      tuba: comp(HOOK8_CH, ['R-', H, H, H, R, R, R, R, R, R, R, R, R, R, R, R], 46),
    }),

    // Winding down: the music box stuck on three notes, going flat; a last
    // clack; back to the show.
    E: section(4, {
      box: BOX.tuned,
      boxSour: BOX.sour,
      cellos: held('Bb2', 3 * BAR),
      violas: [...rest(1), ...held('F3', 2 * BAR)],
      sour: at(3, r16('D5 - - - - - - - . . . . . . . .')),
      clack: at(3, hits('........ ......x.')),
      thud: at(3, hits('........ .......x')),
    }),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};

for (const tracks of Object.values(song.sections)) {
  for (const [name, steps] of Object.entries(tracks)) {
    const instrument = song.instruments[name];
    if (!instrument?.sample || instrument.drum) continue;
    const { notes } = SAMPLE_SETS[instrument.sample];
    tracks[name] = steps.map((s) => (typeof s === 'number' ? [s, s - 12, s + 12].find((n) => near(n, notes)) ?? s : s));
  }
}

export const RUMBOLD_JAMMED_THEME = song;
