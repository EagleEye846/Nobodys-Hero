import {
  melody, midi, rest as restBars, held, tight, emberNotes,
} from './parts/chapter6.js';

// "Six Cold Fires": the song for the six heroes' last camp, chapter 6's
// fourth area. Six camps one after another on the road to the ember lands,
// as if six heroes came one at a time over many years and each stopped in
// the same place: six fire rings gone cold, a cairn of six different
// stones, one thing left behind in each camp that says who they were. A
// jump climb to a lookout over the red glow, and a save point at a cold
// fire ring where Ves is quiet for once. Nothing much to solve here; the
// mood is the point. So the song is very quiet: six notes, each on a
// different instrument, one for each of them.
//
// ONE SONG, NOT SIX. The camps are six rooms in a row that you walk through
// one after another, and the game keeps a song going across a door when the
// next room asks for the same one. One song for all six rooms carries you
// along the row without a restart at every fire ring (at this quietness a
// restart is the loudest thing in the room). Instead the song itself has a
// section for each of the six: walk the row and you hear them one by one.
// If a camp ever wants its own music, lift that camp's section out into a
// song of its own.
//
// THE SIX NOTES: THE EMBER CELL (parts/chapter6.js) in G minor, G A Bb D,
// then Eb falling to D. Every bar is six beats long, one beat for each of
// them, the way "Five and a Line" (the boy's camp in chapter 4) keeps five
// and a stroke. Each note is on its own instrument, like six stones on one
// cairn:
//
//   1  harp          (G)
//   2  clarinet      (A)
//   3  flute         (Bb)
//   4  bowed vibes   (D)
//   5  solo violin   (Eb)
//   6  soft horn     (D, the landing)
//
// HOW IT GOES: each section is one camp, three bars. First the cairn: the
// six notes once, a beat each, each one left to ring a little into the
// next. Each camp the six instruments move round one place, so the hero
// whose camp it is lays the first stone. Then a breath, and that hero's
// instrument plays the six notes alone, its own way, and always lands on
// the fifth with the half step at the end:
//
//   camp 1  the harp       rolling up two octaves, plainly, a beat a note
//   camp 2  the clarinet   in G major (G A B D, Eb D): the hopeful one
//   camp 3  the flute      high and slow, an octave up
//   camp 4  the vibes      in C minor (C D Eb G, Ab G)
//   camp 5  the violin     in D minor, a long first note (D E F A, Bb A)
//   camp 6  the horn       low and slow, the last of them; then it starts
//                          again
//
// UNDER IT: almost nothing. Two soft violas hold G and D far back (an open
// fifth, cold, like the stones); a low piano note, muffled, at the start of
// each camp; a gust now and then. One ember, once, in the last camp. No
// chords, no pulse, no drums.
//
// G minor, 6/4 at 66 BPM; one step an 8th, 12 to a bar (a bar is about
// 5.5 seconds). The whole song loops, 18 bars, about 1m38s:
//
//   camp1   3 bars  0:00  the cairn, the harp first; the harp alone
//   camp2   3 bars  0:16  the cairn, the clarinet first; the clarinet alone
//   camp3   3 bars  0:33  the cairn, the flute first; the flute alone
//   camp4   3 bars  0:49  the cairn, the vibes first; the vibes alone
//   camp5   3 bars  1:05  the cairn, the violin first; the violin alone
//   camp6   3 bars  1:22  the cairn, the horn first; the horn alone

const BAR = 12;
const SECTION = 3 * BAR;
const quarters = (text) => melody(text, 2);   // each token a beat: 6 to a bar
const rest = (steps) => Array(steps).fill('.');
const fit = (name, section) => tight('Six Cold Fires', name, section, 3, BAR);

// The six of them, in the order they came.
const HEROES = ['harp', 'clarinet', 'flute', 'vibes', 'violin', 'horn'];

// The six notes, G A Bb D, Eb D.
const CELL = emberNotes('G4');

// Each one's own way of playing them (ten beats, from the start of the
// second bar's third beat to the end of the camp). All land on the fifth.
const ALONE = {
  harp: quarters('G3 D4 G4 A4 Bb4 D5 - Eb5 D5 -'),
  clarinet: quarters('G4 - A4 B4 - D5 - Eb5 D5 -'),
  flute: quarters('G5 - - A5 Bb5 - D6 Eb6 D6 -'),
  vibes: quarters('C5 - D5 Eb5 - G5 - Ab5 G5 -'),
  violin: quarters('D5 - - - E5 F5 A5 Bb5 A5 -'),
  horn: quarters('G3 - A3 Bb3 D4 - - Eb4 D4 -'),
};

// One camp: the cairn (note i on beat i, ringing three 8ths; the last held
// two beats into the second bar), then the hero alone from bar two, beat
// three.
function camp(first) {
  const tracks = Object.fromEntries(HEROES.map((name) => [name, rest(SECTION)]));
  CELL.forEach((note, i) => {
    const name = HEROES[(i + first) % HEROES.length];
    const at = i * 2;
    const length = i === CELL.length - 1 ? 6 : 3;
    tracks[name].splice(at, length, ...held(note, length));
  });
  const name = HEROES[first];
  tracks[name].splice(BAR + 4, ALONE[name].length, ...ALONE[name]);
  return tracks;
}

// Under it: the open fifth, the low note, a gust.
const cold = (note) => [...held(note, SECTION - 2), '.', '.'];
const ground = [midi('G2'), ...rest(SECTION - 1)];
const gust = (bar) => { const out = rest(SECTION); out[bar * BAR] = 60; return out; };
const ember = () => { const out = rest(SECTION); ['D6', 'G6', 'Bb6'].forEach((n, i) => { out[2 * BAR + 8 + i] = midi(n); }); return out; };

const section = (first, extra = {}) => fit(`camp${first + 1}`, {
  ...camp(first),
  violaLow: cold('G3'),
  violaHigh: cold('D4'),
  ground,
  ...extra,
});

export const CAMP_THEME = {
  title: 'Six Cold Fires',
  bpm: 66,
  stepsPerBeat: 2,
  // Quiet on purpose: a little under the area songs (about -28 on
  // tools/loudnessCheck.html, where the areas sit near -26.5).
  volume: 1.3,

  instruments: {
    // The six.
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.7, pan: -0.3, humanize: { time: 0.02, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.12, release: 1.2, reverb: 0.7, pan: -0.15, humanize: { time: 0.02, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.17, attack: 0.15, release: 1.2, reverb: 0.75, pan: 0.2, humanize: { time: 0.02, volume: 0.1 } },
    vibes: { sample: 'vibesBowed', volume: 0.16, attack: 0.3, release: 1.6, reverb: 0.75, pan: 0.35, humanize: { time: 0.02, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.17, attack: 0.3, release: 1.4, reverb: 0.75, pan: 0.1, humanize: { time: 0.02, volume: 0.1 } },
    horn: { sample: 'hornsSoft', volume: 0.13, attack: 0.4, release: 1.6, reverb: 0.75, pan: -0.05, muffle: 1800 },
    // The cold under it.
    violaLow: { sample: 'violas', volume: 0.06, attack: 2.2, release: 2.5, reverb: 0.7, pan: -0.25, muffle: 1000 },
    violaHigh: { sample: 'violas', volume: 0.05, attack: 2.5, release: 2.5, reverb: 0.7, pan: 0.25, muffle: 1000 },
    ground: { sample: 'grandPiano', volume: 0.14, ring: true, muffle: 700, reverb: 0.7, pan: 0 },
    wind: { sample: 'cymbalSwell', volume: 0.06, release: 0.8, reverb: 0.75, pan: 0.3, muffle: 1000 },
    embers: { sample: 'glass', volume: 0.035, ring: true, reverb: 0.7, pan: -0.35, humanize: { time: 0.01, volume: 0.2 } },
  },

  sections: {
    camp1: section(0, { wind: gust(1) }),
    camp2: section(1),
    camp3: section(2),
    camp4: section(3, { wind: gust(2) }),
    camp5: section(4),
    camp6: section(5, { embers: ember() }),
  },

  order: ['camp1', 'camp2', 'camp3', 'camp4', 'camp5', 'camp6'],
  loopFrom: 0,
};
