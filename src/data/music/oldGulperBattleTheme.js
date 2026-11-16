import { melody, midi, arpeggio, sustained, transpose, hits, repeat } from '../../audio/notation.js';
import { ORCHESTRA, timp, held, heldBars, onNotes, swellInto, T_POUND, T_ONE, RACE, RIPPLE } from './parts/usurper.js';
import { dots } from './parts/ghostShip.js';
import { stopdown } from './parts/chapter3.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Long in the Tooth": the fight with OLD GULPER, the giant, very old moray
// eel who nests in the fallen great bell of Merrow's drowned bell tower
// (src/data/enemies/old_gulper.js). He isn't evil. He's old, he's huge, he's
// been woken up, and he has toothache: one crooked front tooth is loose, and
// he keeps rubbing his jaw on the bell, which is what rings it. So the song
// is heavy, slow and grumpy at first, comic and sad rather than wicked; then,
// when he's properly awake (his second phase), it drops into double time and
// starts to bite.
//
// THE HOOK (8 bars, "OLD... GUL-per, DON'T... wake him"): it opens on the
// bells of Merrow (merrowTheme.js: the tower's peal, G C C D, the coast
// cell in C minor), sunk down into the low brass: G, C-C, D. Then his tooth:
// the D wobbles a semitone down and back (D, D flat, D), like a loose tooth
// being worried with a tongue, and sighs down to B. The cell again, a lift
// to G, a top A flat, the wobble once more, and home. Under it the bass
// walks the old lament down by semitones, C B B-flat A A-flat G (the "Hit the
// Road Jack" floor, which is what makes it sad and a bit funny at once),
// with one borrowed colour, the F MAJOR chord on the A (a proud old thing).
// The hook is on trombones and violas at pitch, horns and tuba an octave
// below; the second time trumpets and violins join an octave up.
//
// THE BELL: the great bell he sleeps in is a real tubular bell (chimes)
// pitched down an octave, tuned 35 cents flat and wavering, so it never
// quite agrees with the band. It bongs on the ONE every other bar, the
// groove's anchor: him rubbing his jaw. The town's own tower, far off and in
// tune (the same muffled chimes as Merrow's song, the same four notes), rings
// its peal twice in the loop, in gaps left for it.
//
// THE TOWN (B) is Merrow's own tune ("Bells Under Water", the clarinet's
// G C-C D Eb / D C) as a call, and his grumbling answer on low brass (the
// tooth's wobble), with the great bell on each answer: the drowned town
// poking at him, him grumbling back. Merrow's harp figure (C G D G Eb G D G)
// rocks under the calls.
//
// THE HUM (F, the pivot, about 60% in): the hero hums to him. It's the
// same town tune, slowed into a lullaby in E-flat major (Bb Eb Eb F G...),
// hummed by the choir behind closed lips (muffled), a harp rocking under it,
// the bell barely touched; then a solo violin and a flat little music box take
// it, and the drums creep back. It's still the fight: the pulse never stops.
// At the climax (G) the lullaby is blared out on trumpets and choir a step
// higher, in F major, over the double-time band.
//
// THE CHOMP (E): his jaws. A huge D-flat stab (the Neapolitan, the song's
// only menace chord) on the ONE, then nothing but the tooth's wobble on a
// solo violin in the gap, the pocket his crooked tooth props open; then the
// band snaps back with the wobble in 16ths on the brass. The chomps come
// quicker and quicker, three to a bar, four, and stop dead.
//
// Real recordings throughout (VSCO 2 CE and VCSL, both CC0): trumpets, horns,
// trombones, tuba, violins (legato, spiccato, tremolo), violas (and tremolo),
// cellos (legato, spiccato, tremolo), double basses, solo violin, clarinet,
// oboe, flute, harp, glockenspiel (the music box), tubular bells (the great
// bell and the town's tower), the game's choir, timpani, bass drums, snare,
// tom, tenor drum, cymbals, cymbal swell, gong; and the real sea (seaWaves).
//
// C minor (the climax a step up, in D minor), 4/4 at 150; one step a 16th,
// 16 to a bar, a bar 1.6 seconds. The first half sits in half time (the
// snare on THREE: heavy, about 75 a minute to the body); the drop doubles it.
// The intro plays once (4 bars, 6.4 s); then it loops from A, 104 bars,
// 2m46s (2m53s the first time through):
//
//   section  bars  loop time    what happens
//   intro     4    (once)       a wave breaks; a low drone; the great bell
//                               bongs; a grumpy groan sags on the trombone
//                               and tuba; the tuba mutters the cell
//   A        16    0:00-0:26    GRUMPY: THE HOOK on low brass and violas in
//                               half time, the bell every other bar, the
//                               lament bass lumbering; again with trumpets
//                               and violins on top and the cellos grinding
//                               the tooth's wobble
//   B        16    0:26-0:51    THE TOWN: Merrow's tune called on clarinet
//                               (then oboe and flute), answered by his
//                               grumbles on low brass and the bell; the
//                               town's peal rings in the last call's gap
//   C         8    0:51-1:04    THE RUB: the cell climbs on trumpets (Ab,
//                               Bb, C, G) as he rubs harder, the bell faster
//                               and faster, a snare roll, a swell; stops dead
//                               for the last beat
//   D        16    1:04-1:30    AWAKE (the drop; phase 2 starts here): gong,
//                               deep drum, BRAAAM; double time; the hook on
//                               every brass seat, the wobble grinding in 16ths;
//                               the choir and racing violins the second time
//   E         8    1:30-1:42    THE CHOMP: D-flat stabs, the wobble alone in
//                               the pocket, the band snapping back; faster
//                               chomps; stops dead
//   F        16    1:42-2:08    THE HUM (the pivot, 62% in): the town's tune
//                               as a lullaby in E-flat, hummed by the choir
//                               over a harp; then the solo violin and the
//                               music box; the drums creep back; it turns
//                               towards D minor
//   G        16    2:08-2:34    ALL AT ONCE, up a step (D minor): the hook
//                               on everything, then the lullaby blared on
//                               trumpets and choir in F major over the band
//   H         8    2:34-2:46    HOME: back in C minor, half time, the hook's
//                               opening sleepy on cellos and soft horns, a
//                               huge yawn, the town's peal; the tuba mutters
//                               the cell into A, as in the intro
//
// Phase 2 (AWAKE) starts the song at D (`musicFrom: 'D'` in old_gulper.js).
// None of his attacks is timed to the music.

const SONG = 'Long in the Tooth';
const BAR = 16;
const tune = (text) => melody(text, 2);    // each token an 8th
const s16 = (text) => melody(text, 1);     // each token a 16th
const rest = (bars) => Array(bars * BAR).fill('.');
const beat = (pattern, bars) => repeat(hits(pattern), bars);
const at = (bar, step = 0) => bar * BAR + step;
const cat = (...parts) => parts.flat();
const fit = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`${SONG} ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
// Leaves out notes more than `reach` semitones from any of an instrument's
// recordings (the doublings), with the holds after them.
const playable = (steps, set, reach = 2) => {
  const notes = SAMPLE_SETS[set].notes;
  let dropped = false;
  return steps.map((s) => {
    if (typeof s === 'number') {
      dropped = Math.min(...notes.map((n) => Math.abs(n - s))) > reach;
      return dropped ? '.' : s;
    }
    if (s === '-' && dropped) return '.';
    if (s === '.') dropped = false;
    return s;
  });
};
// Bell strokes [step, note], each held (for its waver) up to `length` steps.
const rings = (bars, events, length = 2 * BAR) => {
  const out = Array(bars * BAR).fill('.');
  for (const [step, note] of events) {
    out[step] = typeof note === 'number' ? note : midi(note);
    for (let i = 1; i < length && step + i < out.length && out[step + i] === '.'; i++) out[step + i] = '-';
  }
  return out;
};
// One bar with `note` struck at each of `steps`, each held `len` steps.
const stab = (note, steps, len = 3) => {
  const out = Array(BAR).fill('.');
  for (const s of steps) {
    out[s] = midi(note);
    for (let i = 1; i < len && s + i < BAR; i++) out[s + i] = '-';
  }
  return out;
};
// A note on the first step of each of `bars` (a cymbal, a drum: 'x').
const onBars = (length, list, what = 'x') => dots(length * BAR, list.map((b) => [at(b), what]));

// --- THE HOOK: the bells' cell sunk low, and the loose tooth. 8 bars. ---
const HOOK = tune(`
  G3 - C4 C4 D4 - - -       Eb4 - D4 Db4 D4 - B3 -
  G3 - C4 C4 D4 - - -       F4 - Eb4 D4 Eb4 - G4 -
  Ab4 - - - G4 - F4 -       Eb4 - D4 Db4 D4 - C4 -
  B3 - C4 D4 Eb4 - D4 -     C4 - - - - - . .
`);
const HOOK2 = cat(HOOK, HOOK);
// The lament floor: C B Bb A Ab G G C (the F major on the A is the colour).
const HOOK_CHORDS = 'Cm G Cm F Fm Cm G Cm';
const HOOK_ROOTS = 'C3 B2 Bb2 A2 Ab2 G2 G2 C3';
const HOOK_BASS = 'C2 B1 Bb1 A1 Ab1 G1 G1 C2';
const HOOK_TIMP = 'C B Bb A Ab G G C';
// The string pad under it (middle and top voices).
const HOOK_PAD_MID = tune('G4 - - - - - - -   G4 - - - - - - -   G4 - - - - - - -   A4 - - - - - - -   Ab4 - - - - - - -   G4 - - - - - - -   G4 - - - - - - -   G4 - - - - - - -');
const HOOK_PAD_TOP = tune('C5 - - - - - - -   B4 - - - - - - -   C5 - - - - - - -   C5 - - - - - - -   C5 - - - - - - -   C5 - - - - - - -   B4 - - - - - - -   C5 - - - - - - -');

// --- MERROW'S TUNE (merrowTheme.js, the clarinet's), 8 bars, as the calls. ---
const MERROW = tune(`
  G4 - C5 C5 D5 - Eb5 -     D5 - C5 - - - G4 -
  Eb4 - Ab4 Ab4 Bb4 - C5 -  Bb4 - Ab4 - G4 - - -
  C5 - F5 F5 G5 - Ab5 -     G5 - F5 - Eb5 - C5 -
  D5 - - Eb5 D5 - B4 -      G4 . . . . . . .
`);
// His grumbling answers, two bars each: the tooth's wobble, low.
const ANSWERS = [
  tune('Eb3 - D3 Db3 D3 - B2 -    C3 - - - - - . .'),
  tune('Db3 - C3 B2 C3 - Ab2 -    Bb2 - - - - - . .'),
  tune('Ab3 - G3 F#3 G3 - Eb3 -   F3 - - - - - . .'),
  tune('B2 - C3 D3 Eb3 - D3 -     D3 - Db3 D3 - - . .'),
];
const call = (i) => MERROW.slice(at(2 * i), at(2 * i + 2));
const CALLS = cat(call(0), rest(2), call(1), rest(2), call(2), rest(2), call(3), rest(2));
const REPLIES = cat(rest(2), ANSWERS[0], rest(2), ANSWERS[1], rest(2), ANSWERS[2], rest(2), ANSWERS[3]);
const B_CHORDS = 'Cm Cm G Cm Ab Eb Ab Eb Fm Eb Cm Fm G G G G';
const B_ROOTS = 'C2 C2 G1 C2 Ab1 Eb2 Ab1 Eb2 F1 Eb2 C2 F1 G1 G1 G1 G1';
const B_TIMP = 'C C G C Ab Eb Ab Eb F Eb C F G G G G';
// Merrow's harp figure: a G that never moves, C D Eb D on top. Under the calls.
const FIGURE = tune('C6 G5 D6 G5 Eb6 G5 D6 G5');
const FIGURES = cat(...[0, 1, 2, 3].map(() => cat(FIGURE, FIGURE, rest(2))));
// The town's tower, far off: G C C D, a half note apart, starting just off the beat.
const peal = (bars, from) => rings(bars, [[from, 'G4'], [from + 8, 'C5'], [from + 16, 'C5'], [from + 24, 'D5']], 8);

// --- THE RUB: the cell climbing, the wobble faster. 8 bars. ---
const CLIMB = tune(`
  Eb4 - Ab4 Ab4 Bb4 - - -   C5 - Bb4 A4 Bb4 - - -
  F4 - Bb4 Bb4 C5 - - -     D5 - C5 B4 C5 - - -
  G4 - C5 C5 D5 - - -       Eb5 - D5 C#5 D5 - - -
  D5 - Eb5 D5 Db5 D5 Eb5 D5   D5 - - - - - . .
`);
const C_CHORDS = 'Ab Ab Bb Bb Cm Cm G G';
const C_BASS = 'Ab1 Ab1 Bb1 Bb1 C2 C2 G1 G1';
const C_ROOTS = 'Ab2 Ab2 Bb2 Bb2 C3 C3 G2 G2';

// --- THE CHOMP: the tooth's wobble alone in the pocket, and in 16ths. ---
const POCKET = tune('. . C6 Db6 C6 B5 C6 -');
const WOB16 = s16('Eb4 D4 Db4 D4 B3 - . .   Eb4 D4 Db4 D4 C4 - - .');

// --- THE HUM: Merrow's tune slowed into a lullaby, in E-flat major. ---
const HUM = tune(`
  Bb4 - - - Eb5 - Eb5 -     F5 - - - G5 - - -
  F5 - - - Eb5 - C5 -       Bb4 - - - - - - -
  C5 - - - F5 - F5 -        G5 - - - Ab5 - - -
  G5 - - - F5 - D5 -        Eb5 - - - - - . .
`);
const HUM_CHORDS = 'Eb Eb Ab Bb Fm Bb Gm Cm';
// The second time it turns at the end, onto A (towards D minor).
const HUM_TURN = cat(HUM.slice(0, at(7)), tune('E5 - - - - - . .'));
const F_CHORDS = `${HUM_CHORDS} Eb Eb Ab Bb Fm Bb Gm A`;
const F_ROOTS = 'Eb2 Eb2 Ab2 Bb2 F2 Bb2 G2 C3 Eb2 Eb2 Ab2 Bb2 F2 Bb2 G2 A2';

// --- The climax, a step up: the hook in D minor, the lullaby in F. ---
const HOOK_UP = transpose(HOOK, 2);
const HUM_UP = transpose(HUM, 2);
const G_CHORDS = 'Dm A Dm G Gm Dm A Dm F F Bb C Gm C Am Dm';
const G_ROOTS = 'D3 C#3 C3 B2 Bb2 A2 A2 D3 F3 F3 Bb2 C3 G2 C3 A2 D3';
const G_BASS = 'D2 C#2 C2 B1 Bb1 A1 A1 D2 F2 F2 Bb1 C2 G1 C2 A1 D2';
const G_TIMP = 'D C# C B Bb A A D F F Bb C G C A D';

// --- Home: the hook's opening, sleepy, on the way back to C minor. ---
const SLEEPY = tune(`
  G3 - C4 C4 D4 - - -       Eb4 - D4 Db4 D4 - Bb3 -
  F3 - Bb3 Bb3 C4 - - -     Db4 - C4 B3 C4 - Ab3 -
  . . . . . . . .           . . . . . . . .
  . . . . . . . .           . . . . . . . .
`);
// The tuba muttering the cell, into A (the intro's last bar, and home's).
const MUTTER = tune('G2 - C3 C3 D3 - Db3 D3');

// --- Patterns (one bar, semitones above each note) ---
// The bass lumbering in half time, with a grumble a semitone under at the end.
const LUMBER = [0, '-', '-', '-', '-', '.', 0, '-', 0, '-', '-', '-', '.', '.', -1, '-'];
// The cellos grinding the wobble in 8ths, then in 16ths.
const GRIND8 = [0, '.', 0, '.', 1, '.', 0, '.', 0, '.', 0, '.', 1, '.', -1, '.'];
const GRIND16 = [0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 12, 0, -1];
// The basses driving 8ths in double time.
const DRIVE = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 12, '.', 0, '.'];
// The timpani pounding root and fifth: the fifth below where the drums
// reach it, otherwise the fifth above (five drums, F2 to E3).
const T_POUND_UP = T_POUND.map((p) => (p === -5 ? 7 : p));
const timpPound = (names) => names.split(/\s+/).filter(Boolean).flatMap((n) => timp(n, timp(n, [0])[0] - 5 >= 41 ? T_POUND : T_POUND_UP));
const T_HALF = [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.'];

// --- Drums ---
const K_HALF = 'x.........x.....';
const S_HALF = '........x.......';
const STOMP_HALF = '......x.......x.';
const FILL_HALF = '........x.x.xxxx';
const K_B = 'x.....x...x.....';
const STOMP_B = '....x.......x..x';
const K_DROP = 'x.....x...x..x..';
const S_DROP = '....x.......x...';
const FILL_DROP = '....x...x.x.xxxx';
const OFF8 = '..x...x...x...x.';
const EIGHTS = 'x.x.x.x.x.x.x.x.';
const SIXTEENTHS = 'xxxxxxxxxxxxxxxx';
const HEART = 'x..x............';
const ONE_AND_THREE = 'x.......x.......';
const snares = (pattern, fill, bars) => Array.from({ length: bars }, (_, i) => hits((i + 1) % 8 === 0 ? fill : pattern)).flat();

// ------------------------------------------------------------------ intro
const intro = fit('intro', {
  waves: dots(4 * BAR, [[0, 66]]),
  cellos: held(midi('C2'), 4 * BAR),
  lowTrem: held(midi('G2'), 4 * BAR),
  lowBell: rings(4, [[0, 'C3'], [at(2), 'C3']]),
  impact: dots(4 * BAR, [[0, 'x']]),
  // He groans awake: one long note that sags.
  yawn: cat(rest(1), held(midi('C3'), 24), Array(24).fill('.')),
  yawnLow: cat(rest(1), held(midi('C2'), 24), Array(24).fill('.')),
  timpRoll: cat(rest(2), held(midi('C3'), 2 * BAR)),
  tuba: cat(rest(3), MUTTER),
  swell: swellInto(4),
}, 4);

// ---------------------------------------------------- A: grumpy, the hook
const A = fit('A', {
  trombones: playable(HOOK2, 'trombone'),
  violas: HOOK2,
  hornsSoft: cat(transpose(HOOK, -12), rest(8)),
  horns: cat(rest(8), transpose(HOOK, -12)),
  tuba: cat(rest(8), transpose(HOOK, -12)),
  trumpets: cat(rest(8), transpose(HOOK, 12)),
  violins: cat(rest(8), transpose(HOOK, 12)),
  tremLo: cat(HOOK_PAD_MID, HOOK_PAD_MID),
  tremHi: cat(HOOK_PAD_TOP, HOOK_PAD_TOP),
  cellos: cat(heldBars(HOOK_ROOTS), rest(8)),
  pound: cat(rest(8), onNotes(HOOK_ROOTS, GRIND8)),
  basses: repeat(onNotes(HOOK_BASS, LUMBER), 2),
  timpani: repeat(timp(HOOK_TIMP, T_HALF), 2),
  kick: beat(K_HALF, 16),
  snare: snares(S_HALF, FILL_HALF, 16),
  stomp: beat(STOMP_HALF, 16),
  lowBell: rings(16, [0, 2, 4, 6, 8, 10, 12, 14].map((b) => [at(b), 'C3'])),
  impact: onBars(16, [0, 8]),
  crash: onBars(16, [0, 8]),
  waves: dots(16 * BAR, [[0, 64], [at(8), 62]]),
}, 16);

// ------------------------------------------- B: the town, and his answers
const B = fit('B', {
  clarinet: CALLS,
  oboe: playable(cat(rest(8), CALLS.slice(at(8))), 'oboe'),
  flute: playable(cat(rest(8), transpose(CALLS.slice(at(8)), 12)), 'flute'),
  harp: FIGURES,
  trombones: playable(REPLIES, 'trombone'),
  horns: REPLIES,
  tuba: transpose(REPLIES, -12),
  tremLo: sustained(B_CHORDS, BAR, 1, 4),
  tremHi: sustained(B_CHORDS, BAR, 2, 4),
  pound: cat(rest(8), transpose(onNotes(B_ROOTS.split(' ').slice(8).join(' '), GRIND8), 12)),
  basses: onNotes(B_ROOTS, LUMBER),
  timpani: timp(B_TIMP, T_HALF),
  kick: beat(K_B, 16),
  snare: snares(S_HALF, FILL_HALF, 16),
  stomp: beat(STOMP_B, 16),
  // The great bell on each of his answers.
  lowBell: rings(16, [2, 6, 10, 14].map((b) => [at(b), 'C3'])),
  // The town's tower, in the gap the last call leaves.
  peal: peal(16, at(13, 2)),
  crash: onBars(16, [0, 8]),
  waves: dots(16 * BAR, [[at(4), 61], [at(12), 63]]),
}, 16);

// --------------------------------------------- C: the rub, the build
const C = fit('C', stopdown({
  trumpets: CLIMB,
  violins: CLIMB,
  trombones: playable(transpose(CLIMB, -12), 'trombone'),
  horns: playable(transpose(CLIMB, -12), 'horns'),
  tremHi: sustained(C_CHORDS, BAR, 2, 4),
  tremLo: sustained(C_CHORDS, BAR, 1, 4),
  basses: onNotes(C_BASS, DRIVE),
  pound: cat(onNotes(C_ROOTS.split(' ').slice(0, 6).join(' '), GRIND8), onNotes('G2 G2', GRIND16)),
  roll: cat(beat(EIGHTS, 4), beat(SIXTEENTHS, 4)),
  kick: cat(beat(K_B, 6), beat('x...x...x...x...', 2)),
  timpRoll: cat(rest(6), held(midi('G2'), 2 * BAR)),
  // He rubs harder: the bell on every bar, then twice, then every beat.
  lowBell: rings(8, [
    [at(0), 'C3'], [at(1), 'C3'], [at(2), 'C3'], [at(3), 'C3'],
    [at(4), 'C3'], [at(4, 8), 'C3'], [at(5), 'C3'], [at(5, 8), 'C3'],
    [at(6), 'C3'], [at(6, 4), 'C3'], [at(6, 8), 'C3'], [at(6, 12), 'C3'], [at(7), 'C3'],
  ], 8),
  swell: cat(rest(6), swellInto(2)),
}), 8);

// ------------------------------------------------- D: AWAKE, the drop
const D = fit('D', {
  gong: dots(16 * BAR, [[0, 'x']]),
  impact: onBars(16, [0, 8]),
  braam: cat(held(midi('C2'), 12), Array(16 * BAR - 12).fill('.')),
  braamLow: cat(held(midi('C2'), 12), Array(16 * BAR - 12).fill('.')),
  trumpetsBig: transpose(HOOK2, 12),
  violins: transpose(HOOK2, 12),
  trombonesBig: playable(HOOK2, 'trombone'),
  violas: HOOK2,
  hornsBig: transpose(HOOK2, -12),
  tuba: transpose(HOOK2, -12),
  choir: HOOK2,
  race: repeat(arpeggio(HOOK_CHORDS, BAR, 4, RACE), 2),
  tremHi: cat(rest(8), heldBars('G5 G5 G5 A5 Ab5 G5 G5 G5')),
  pound: repeat(onNotes(HOOK_ROOTS, GRIND16), 2),
  basses: repeat(onNotes(HOOK_BASS, DRIVE), 2),
  timpani: repeat(timpPound(HOOK_TIMP), 2),
  kick: beat(K_DROP, 16),
  snare: snares(S_DROP, FILL_DROP, 16),
  taikoHigh: beat(OFF8, 16),
  crash: onBars(16, [0, 4, 8, 12]),
  lowBell: rings(16, [0, 2, 4, 6, 8, 10, 12, 14].map((b) => [at(b), 'C3'])),
}, 16);

// --------------------------------------------------- E: the chomp
const E = fit('E', {
  trumpetsBig: cat(stab('Ab4', [0]), transpose(WOB16, 12), stab('Ab4', [0]), transpose(WOB16, 12), stab('Ab4', [0]), stab('C5', [0, 6, 12]), stab('B4', [0, 6, 12]), stab('D5', [0, 4, 8])),
  trombonesBig: cat(stab('F3', [0]), WOB16, stab('F3', [0]), WOB16, stab('F3', [0]), stab('Eb3', [0, 6, 12]), stab('D3', [0, 6, 12]), stab('D3', [0, 4, 8])),
  hornsBig: cat(stab('Ab3', [0]), transpose(WOB16, -12), stab('Ab3', [0]), transpose(WOB16, -12), stab('Ab3', [0]), stab('C4', [0, 6, 12]), stab('B3', [0, 6, 12]), stab('B3', [0, 4, 8])),
  braam: cat(stab('Db2', [0], 8), rest(1), stab('Db2', [0], 8), rest(1), stab('Db2', [0], 8), stab('Ab2', [0, 6, 12]), stab('G2', [0, 6, 12]), stab('G2', [0, 4, 8])),
  braamLow: cat(stab('Db2', [0], 8), rest(1), stab('Db2', [0], 8), rest(1), stab('Db2', [0], 8), stab('Ab1', [0, 6, 12]), stab('G1', [0, 6, 12]), stab('G1', [0, 4, 8])),
  // The pocket: only the tooth, wobbling.
  soloViolin: cat(POCKET, rest(1), POCKET, rest(1), POCKET, rest(3)),
  tremHi: cat(stab('C6', [4], 12), rest(1), stab('C6', [4], 12), rest(1), stab('C6', [4], 12), rest(3)),
  basses: cat(stab('Db2', [0], 2), onNotes('C2', DRIVE), stab('Db2', [0], 2), onNotes('C2', DRIVE), stab('Db2', [0], 2), onNotes('Ab1', DRIVE), onNotes('G1', DRIVE), stab('G1', [0, 4, 8], 2)),
  pound: cat(rest(1), onNotes('C3', GRIND16), rest(1), onNotes('C3', GRIND16), rest(1), onNotes('Ab2', GRIND16), onNotes('G2', GRIND16), rest(1)),
  timpani: cat(stab('Db3', [0], 1), timpPound('C'), stab('Db3', [0], 1), timpPound('C'), stab('Db3', [0], 1), stab('Ab2', [0, 6, 12], 1), stab('G2', [0, 6, 12], 1), stab('G2', [0, 4, 8], 1)),
  kick: cat(hits('x...............'), hits(K_DROP), hits('x...............'), hits(K_DROP), hits('x...............'), hits('x.....x.....x...'), hits('x.....x.....x...'), hits('x...x...x.......')),
  snare: cat(rest(1), hits(S_DROP), rest(1), hits(S_DROP), rest(1), hits('....x.......x...'), hits('....x.......xxxx'), hits('x...x...x.......')),
  taikoHigh: cat(rest(1), hits(OFF8), rest(1), hits(OFF8), rest(1), hits(OFF8), hits(OFF8), rest(1)),
  crash: onBars(8, [0, 2, 4, 6]),
  impact: dots(8 * BAR, [[at(0), 'x'], [at(2), 'x'], [at(4), 'x'], [at(7), 'x'], [at(7, 4), 'x'], [at(7, 8), 'x']]),
  lowBell: rings(8, [[at(1), 'C3'], [at(3), 'C3'], [at(5), 'C3']]),
}, 8);

// ----------------------------------------------- F: the hum (the pivot)
const F = fit('F', {
  choirHum: cat(HUM, transpose(HUM_TURN, -12)),
  soloViolin: cat(rest(8), HUM_TURN),
  box: cat(rest(8), playable(transpose(HUM_TURN, 12), 'glock')),
  harp: arpeggio(F_CHORDS, BAR, 3, RIPPLE),
  cellosSoft: heldBars(F_ROOTS),
  pad: sustained(F_CHORDS, BAR, 1, 4),
  bellSoft: rings(16, [[0, 'C3'], [at(4), 'C3'], [at(8), 'C3'], [at(12), 'C3']]),
  heart: cat(beat(HEART, 12), rest(4)),
  stomp: cat(rest(8), beat(ONE_AND_THREE, 8)),
  roll: cat(rest(12), beat(EIGHTS, 2), beat(SIXTEENTHS, 2)),
  timpRoll: cat(rest(14), held(midi('A2'), 2 * BAR)),
  swell: cat(rest(14), swellInto(2)),
  waves: dots(16 * BAR, [[0, 65], [at(6), 60], [at(10), 62]]),
}, 16);

// --------------------------------------- G: all at once, a step up
const G = fit('G', {
  gong: dots(16 * BAR, [[0, 'x']]),
  impact: onBars(16, [0, 8]),
  trumpetsBig: cat(transpose(HOOK_UP, 12), HUM_UP),
  violins: cat(transpose(HOOK_UP, 12), HUM_UP),
  trombonesBig: cat(playable(HOOK_UP, 'trombone'), playable(transpose(HUM_UP, -12), 'trombone')),
  violas: cat(HOOK_UP, transpose(HUM_UP, -12)),
  hornsBig: cat(transpose(HOOK_UP, -12), transpose(HUM_UP, -24)),
  tuba: cat(transpose(HOOK_UP, -12), heldBars('F2 F2 Bb1 C2 G1 C2 A1 D2')),
  choir: cat(HOOK_UP, HUM_UP),
  box: cat(rest(8), playable(transpose(HUM_UP, 12), 'glock')),
  race: arpeggio(G_CHORDS, BAR, 4, RACE),
  pound: onNotes(G_ROOTS, GRIND16),
  basses: onNotes(G_BASS, DRIVE),
  timpani: timpPound(G_TIMP),
  kick: beat(K_DROP, 16),
  snare: snares(S_DROP, FILL_DROP, 16),
  taikoHigh: beat(OFF8, 16),
  crash: onBars(16, [0, 4, 8, 12]),
  lowBell: rings(16, [0, 2, 4, 6, 8, 10, 12, 14].map((b) => [at(b), 'D3'])),
}, 16);

// --------------------------------------------------- H: home
const H = fit('H', {
  cellos: SLEEPY,
  hornsSoft: transpose(SLEEPY, -12),
  tremLo: sustained('Bb Bb Ab Ab Fm Fm G G', BAR, 1, 3),
  // The yawn: one long note that sags, while the town's tower rings.
  yawn: cat(rest(4), held(midi('C3'), 24), Array(40).fill('.')),
  yawnLow: cat(rest(4), held(midi('C2'), 24), Array(40).fill('.')),
  lowTrem: cat(rest(4), held(midi('F2'), 2 * BAR), rest(2)),
  peal: peal(8, at(4, 2)),
  tuba: cat(rest(7), MUTTER),
  basses: cat(onNotes('Bb1 Bb1 Ab1 Ab1', LUMBER), rest(2), onNotes('G1 G1', LUMBER)),
  timpani: cat(timp('Bb Bb Ab Ab', T_HALF), timp('F F', T_ONE), timp('G G', T_HALF)),
  kick: cat(beat(K_HALF, 4), rest(2), beat(K_HALF, 1), hits('x...x...x...x...')),
  snare: cat(beat(S_HALF, 4), rest(2), beat(S_HALF, 1), hits(FILL_HALF)),
  stomp: cat(beat(STOMP_HALF, 4), rest(2), beat(STOMP_HALF, 2)),
  lowBell: rings(8, [[at(0), 'C3'], [at(2), 'C3'], [at(6), 'C3']]),
  waves: dots(8 * BAR, [[at(4), 67]]),
  swell: cat(rest(6), swellInto(2)),
}, 8);

export const OLD_GULPER_BATTLE_THEME = {
  title: SONG,
  bpm: 150,
  stepsPerBeat: 4,
  // Set to sit with the other chapter 5 fights (Dead Men's Weather, the Dowager Crab).
  volume: 1.05,

  instruments: {
    // The hook's seats.
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.32 },
    horns: { ...ORCHESTRA.horns, volume: 0.42 },
    hornsSoft: { ...ORCHESTRA.hornsSoft, volume: 0.34 },
    trombones: { ...ORCHESTRA.trombones, volume: 0.42 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.42 },
    // The same seats, louder, for the drop, the chomp and the climax.
    trumpetsBig: { ...ORCHESTRA.trumpets, volume: 0.42 },
    hornsBig: { ...ORCHESTRA.horns, volume: 0.54 },
    trombonesBig: { ...ORCHESTRA.trombones, volume: 0.54 },
    braam: { ...ORCHESTRA.braam, volume: 0.6 },
    braamLow: { ...ORCHESTRA.braamLow, volume: 0.6 },
    // His groan: a long low note that sags flat as it goes (a yawn).
    yawn: { sample: 'trombone', volume: 0.38, attack: 0.25, release: 0.8, sag: 140, reverb: 0.45, pan: -0.1 },
    yawnLow: { sample: 'tuba', volume: 0.36, attack: 0.3, release: 0.8, sag: 140, reverb: 0.4 },
    // Strings.
    violins: { ...ORCHESTRA.violins, volume: 0.28 },
    violas: { sample: 'violas', volume: 0.22, attack: 0.03, release: 0.3, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.08 } },
    cellos: { ...ORCHESTRA.cellos, volume: 0.34 },
    cellosSoft: { ...ORCHESTRA.cellos, volume: 0.15, attack: 0.4, release: 0.8, muffle: 2400 },
    pound: { ...ORCHESTRA.pound, volume: 0.28 },
    basses: { ...ORCHESTRA.basses, volume: 0.44 },
    race: { ...ORCHESTRA.race, volume: 0.18 },
    tremHi: { sample: 'violinsTrem', volume: 0.1, attack: 0.5, release: 0.8, reverb: 0.5, pan: 0.25, muffle: 3200 },
    tremLo: { sample: 'violasTrem', volume: 0.1, attack: 0.5, release: 0.8, reverb: 0.5, pan: -0.2, muffle: 3200 },
    lowTrem: { sample: 'cellosTrem', volume: 0.2, attack: 0.6, release: 0.8, reverb: 0.45, pan: -0.2 },
    pad: { sample: 'violas', volume: 0.08, attack: 1.0, release: 1.4, reverb: 0.65, pan: -0.1, muffle: 1800 },
    soloViolin: { sample: 'soloViolin', volume: 0.38, attack: 0.05, release: 0.4, reverb: 0.5, pan: 0.15, humanize: { time: 0.008, volume: 0.1 } },
    // The town: clarinet, then oboe and flute; Merrow's harp.
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.03, release: 0.3, reverb: 0.45, pan: -0.15, humanize: { time: 0.006, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.18, attack: 0.03, release: 0.3, reverb: 0.45, pan: 0.15, humanize: { time: 0.006, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.12, attack: 0.04, release: 0.4, reverb: 0.5, pan: 0.3 },
    harp: { sample: 'harp', volume: 0.12, ring: true, muffle: 4500, reverb: 0.55, pan: 0.3, humanize: { time: 0.01, volume: 0.18 } },
    // A music box, a little flat, under water.
    box: { sample: 'glock', volume: 0.1, ring: true, detune: -22, drift: 8, muffle: 3400, reverb: 0.7, pan: 0.25 },
    // The choir: open in the climax; behind closed lips (muffled) for the hum.
    choir: { sample: 'choir', volume: 0.24, attack: 0.06, release: 0.4, reverb: 0.5 },
    choirHum: { sample: 'choir', volume: 0.26, attack: 0.3, release: 0.8, muffle: 1100, reverb: 0.6, humanize: { time: 0.01, volume: 0.08 } },
    // THE GREAT BELL he sleeps in: a tubular bell an octave down, 35 cents
    // flat and wavering, muffled by the water. (Played below the chimes'
    // lowest recording on purpose: that is what makes it huge.)
    lowBell: { sample: 'chimes', volume: 0.34, ring: true, detune: -35, wow: { cents: 16, rate: 0.6 }, muffle: 2200, reverb: 0.6, pan: -0.1 },
    bellSoft: { sample: 'chimes', volume: 0.16, ring: true, detune: -35, wow: { cents: 16, rate: 0.6 }, muffle: 1500, reverb: 0.7, pan: -0.1 },
    // The town's tower, far off and in tune (as in "Bells Under Water").
    peal: { sample: 'chimes', volume: 0.13, ring: true, muffle: 2800, reverb: 0.85, pan: -0.35 },
    // The real sea.
    waves: { sample: 'seaWaves', volume: 0.12, ring: true, muffle: 1200, reverb: 0.3 },
    // Drums.
    timpani: { ...ORCHESTRA.timpani, volume: 0.55 },
    timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.45 },
    swell: { ...ORCHESTRA.swell, volume: 0.4 },
    kick: { ...ORCHESTRA.bassDrum, volume: 0.6 },
    snare: { ...ORCHESTRA.snare, volume: 0.36 },
    roll: { ...ORCHESTRA.roll, volume: 0.24 },
    stomp: { sample: 'tom', drum: 'sample', volume: 0.38, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.2 } },
    taikoHigh: { ...ORCHESTRA.taikoHigh, volume: 0.28 },
    heart: { sample: 'concertBassDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.35 },
    crash: { ...ORCHESTRA.crash, volume: 0.3 },
    gong: { ...ORCHESTRA.gong, volume: 0.5 },
    impact: { ...ORCHESTRA.impact, volume: 0.7 },
  },

  sections: { intro, A, B, C, D, E, F, G, H },

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  loopFrom: 1,
};
