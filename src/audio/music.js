import { SETTINGS } from '../state/settings.js';
import { SONGS } from '../data/music/index.js';
import { HOLD, HIT } from './notation.js';
import { SAMPLE_SETS } from './sampleSets.js';
import { EXTRA_AMBIENCES, EXTRA_EXTRAS, EXTRA_SFX, EXTRA_FEEL, EXTRA_ECHO } from './roomAmbience.js';

// Songs are synthesised live with the Web Audio API, chiptune style, from the
// note data in src/data/music/. Rooms, shops, menus and enemies pick a song by
// name: battleTheme.js is 'battle', and so on (see src/data/music/index.js).
// The 'waltz' isn't used anywhere yet: it's saved for a brighter area.

// The real footstep recordings (assets/audio/sfx/steps/), by set: a tone's
// `clip` can be a list, and one is picked at random each time.
const steps = (name, count) => Array.from({ length: count }, (_, i) => `steps/${name}${i + 1}`);
const STEP_SETS = {
  rock: steps('rock', 5), wood: steps('wood', 5), carpet: steps('carpet', 5), grass: steps('grass', 5),
  gravel: steps('gravel', 6), wade: steps('wade', 4), tink: steps('tink', 3),
};

// Short sound effects, synthesised on the spot. Each is a list of tones:
// { midi, wave, length (seconds), volume, delay (seconds), slide (semitones over the tone) }.
const SFX = {
  move: [{ midi: 84, wave: 'square', length: 0.035, volume: 0.03 }],
  select: [
    { midi: 79, wave: 'square', length: 0.045, volume: 0.035 },
    { midi: 86, wave: 'square', length: 0.06, volume: 0.035, delay: 0.045 },
  ],
  back: [
    { midi: 74, wave: 'square', length: 0.05, volume: 0.03 },
    { midi: 67, wave: 'square', length: 0.06, volume: 0.03, delay: 0.04 },
  ],
  error: [
    { midi: 58, wave: 'square', length: 0.08, volume: 0.035 },
    { midi: 55, wave: 'square', length: 0.1, volume: 0.035, delay: 0.08 },
  ],
  // A crystal struck wrong (the Glimmering's singing crystals): a short,
  // dull clink with no ring to it, and a soft low thud under it.
  clink: [
    { midi: 61, wave: 'triangle', length: 0.07, volume: 0.05, slide: -3 },
    { midi: 44, wave: 'sine', length: 0.14, volume: 0.05, slide: -2, delay: 0.01 },
  ],
  hurt: [{ midi: 50, wave: 'sawtooth', length: 0.2, volume: 0.08, slide: -14 }],
  hit: [{ midi: 64, wave: 'square', length: 0.12, volume: 0.06, slide: -18 }],
  graze: [{ midi: 98, wave: 'triangle', length: 0.03, volume: 0.035 }],
  slash: [{ midi: 91, wave: 'sawtooth', length: 0.07, volume: 0.035, slide: -30 }],
  heal: [72, 76, 79, 84].map((midi, i) => ({ midi, wave: 'triangle', length: 0.1, volume: 0.07, delay: i * 0.06 })),
  levelUp: [72, 76, 79, 84, 88].map((midi, i) => ({ midi, wave: 'square', length: 0.12, volume: 0.04, delay: i * 0.07 })),
  save: [
    { midi: 88, wave: 'sine', length: 0.5, volume: 0.08 },
    { midi: 95, wave: 'sine', length: 0.6, volume: 0.06, delay: 0.12 },
  ],
  door: [{ midi: 43, wave: 'triangle', length: 0.25, volume: 0.12, slide: -5 }],
  // Going in or out through a real door, by what it's made of (see
  // doorSound in src/audio/doorSounds.js): a wooden house door opening and
  // shutting, a heavy iron hatch in a hull (the latch, the hinge groaning,
  // the clang as it swings to), an iron gate (the catch, a squeal, a clank),
  // and a cave mouth, with no door at all: two steps on rock and a trickle
  // of grit. Real recordings from Kenney's CC0 "RPG Audio" and "Impact
  // Sounds" (assets/audio/sfx/, see assets/audio/samples/README.md).
  doorWood: [{ clip: 'doorWood', volume: 0.42 }],
  doorHatch: [{ clip: 'doorHatch', volume: 0.42 }],
  doorGate: [{ clip: 'doorGate', volume: 0.4 }],
  doorCave: [{ clip: 'doorCave', volume: 0.45 }],
  // Added 9 November 2026 (chapter 4's sound pass). The great doors of King
  // Peptup's hall: the wooden door again, slowed right down, so it's big and
  // heavy. The little wooden door at the back of the hall that goes down to
  // the mines, a timber door with an iron latch: the latch, then the door.
  doorHall: [{ clip: 'doorWood', volume: 0.5, rate: 0.72 }],
  doorMine: [{ clip: 'doorWood', volume: 0.38, rate: 0.9 }, { clip: 'doorGate', volume: 0.12, rate: 1.2 }],
  // King Peptup's hall cheering, all at once (the welcome show): a real crowd
  // cheering and clapping (assets/audio/sfx/crowdCheer.ogg, public domain: see
  // assets/audio/samples/README.md). It's the hall's own noise, so it plays
  // with the music and the place (PLACE_SOUNDS), and dips under his voice.
  crowdCheer: [{ clip: 'crowdCheer', volume: 0.13 }],
  // A bat (or a lot of bats): two quick, very high chirps.
  squeak: [
    { midi: 100, wave: 'square', length: 0.04, volume: 0.03, slide: 5 },
    { midi: 104, wave: 'square', length: 0.05, volume: 0.03, delay: 0.07, slide: 6 },
  ],
  // An enemy jumping out of hiding.
  ambush: [
    { midi: 76, wave: 'square', length: 0.06, volume: 0.05 },
    { midi: 88, wave: 'square', length: 0.12, volume: 0.05, delay: 0.06, slide: 4 },
  ],
  // Your soul coming out of you before a story battle, once per blink.
  soul: [
    { midi: 81, wave: 'square', length: 0.07, volume: 0.05 },
    { midi: 93, wave: 'square', length: 0.14, volume: 0.04, delay: 0.05 },
  ],
  // A flame flaring up: a low rush rising.
  flare: [
    { midi: 38, wave: 'sawtooth', length: 1.1, volume: 0.06, slide: 14 },
    { midi: 50, wave: 'triangle', length: 0.9, volume: 0.05, delay: 0.1, slide: 12 },
  ],
  // Something huge landing: a deep thump, and the ground giving.
  thud: [
    { midi: 33, wave: 'sine', length: 0.5, volume: 0.22, slide: -10 },
    { midi: 40, wave: 'triangle', length: 0.25, volume: 0.1, slide: -12 },
    { midi: 28, wave: 'sawtooth', length: 0.18, volume: 0.05, slide: -6 },
  ],
  // Landing flat on your face, cartoon style: a wet squash that sags, then a
  // rubbery little pop as the shape comes back.
  squish: [
    { midi: 52, wave: 'sawtooth', length: 0.16, volume: 0.07, slide: -16 },
    { midi: 38, wave: 'sine', length: 0.22, volume: 0.12, slide: -8 },
    { midi: 64, wave: 'triangle', length: 0.14, volume: 0.06, slide: 20, delay: 0.17 },
    { midi: 88, wave: 'sine', length: 0.08, volume: 0.05, slide: -22, delay: 0.3 },
  ],
  // A big log jamming home in a crack: a hard wooden knock, and the rock
  // taking the weight.
  thunk: [
    { midi: 47, wave: 'square', length: 0.07, volume: 0.1, slide: -12 },
    { midi: 36, wave: 'sine', length: 0.45, volume: 0.24, slide: -9 },
    { midi: 55, wave: 'triangle', length: 0.12, volume: 0.1, slide: -18 },
    { midi: 29, wave: 'sawtooth', length: 0.3, volume: 0.05, slide: -5, delay: 0.04 },
  ],
  // A long, silly whistle, rising and wobbling, with the echo of it going on
  // up through the rock after.
  whistle: [
    { midi: 84, wave: 'sine', length: 0.55, volume: 0.08, slide: 9 },
    { midi: 93, wave: 'sine', length: 0.6, volume: 0.07, slide: -4, delay: 0.5 },
    { midi: 89, wave: 'sine', length: 0.45, volume: 0.07, slide: 10, delay: 1.0 },
    { midi: 84, wave: 'sine', length: 0.5, volume: 0.035, slide: 9, delay: 1.45 },
    { midi: 93, wave: 'sine', length: 0.6, volume: 0.03, slide: -4, delay: 1.95 },
    { midi: 89, wave: 'sine', length: 0.9, volume: 0.025, slide: 10, delay: 2.45 },
    { midi: 84, wave: 'sine', length: 0.6, volume: 0.012, slide: 9, delay: 3.1 },
    { midi: 93, wave: 'sine', length: 0.9, volume: 0.01, slide: -4, delay: 3.6 },
  ],
  // Something sweeping in on the air.
  whoosh: [
    { midi: 60, wave: 'triangle', length: 0.45, volume: 0.05, slide: 15 },
    { midi: 79, wave: 'sine', length: 0.4, volume: 0.03, delay: 0.1, slide: -10 },
  ],
  // One of the bursts as a boss goes down.
  burst: [
    { midi: 55, wave: 'square', length: 0.09, volume: 0.05, slide: -20 },
    { midi: 86, wave: 'sawtooth', length: 0.06, volume: 0.03, slide: -24 },
  ],
  // And the last great one.
  boom: [
    { midi: 31, wave: 'sine', length: 1.2, volume: 0.24, slide: -8 },
    { midi: 43, wave: 'sawtooth', length: 0.5, volume: 0.07, slide: -18 },
    { midi: 74, wave: 'square', length: 0.25, volume: 0.04, slide: -30 },
    { midi: 91, wave: 'triangle', length: 0.8, volume: 0.03, delay: 0.05, slide: -12 },
  ],
  // A soft blip as cutscene text types out.
  type: [{ midi: 67, wave: 'triangle', length: 0.03, volume: 0.04 }],
  // A great bronze bell, struck once, ringing on.
  bell: [
    { midi: 57, wave: 'sine', length: 2.6, volume: 0.12 },
    { midi: 64, wave: 'sine', length: 2.2, volume: 0.07, delay: 0.01 },
    { midi: 76, wave: 'triangle', length: 1.2, volume: 0.05, delay: 0.01 },
    { midi: 83, wave: 'sine', length: 0.5, volume: 0.04, delay: 0.02 },
  ],
  // Riding a green updraft somewhere else (src/data/travel.js): a bright
  // little jingle climbing up and away, with a breath of wind under it.
  travel: [
    ...[72, 76, 79, 84, 88, 91].map((midi, i) => ({ midi, wave: 'triangle', length: 0.14, volume: 0.06, delay: i * 0.07 })),
    { midi: 96, wave: 'sine', length: 0.9, volume: 0.05, delay: 0.45 },
    { midi: 103, wave: 'sine', length: 0.7, volume: 0.03, delay: 0.55 },
    { midi: 48, wave: 'triangle', length: 0.8, volume: 0.04, slide: 12 },
  ],
  // Settling into a bed: a soft falling chime.
  rest: [88, 83, 79, 76].map((midi, i) => ({ midi, wave: 'sine', length: 0.35, volume: 0.06, delay: i * 0.18 })),
  // A grappling hook: the whoosh of the throw, then the clink as it catches.
  // A rock scraping a tile along the ground, and a stone button going down.
  // The Hushwood: Bramble's hatchet biting into a trunk, and a log going into a brook.
  chop: [
    { midi: 52, wave: 'square', length: 0.06, volume: 0.07, slide: -10 },
    { midi: 40, wave: 'triangle', length: 0.18, volume: 0.1, slide: -6, delay: 0.05 },
  ],
  splash: [
    { midi: 84, wave: 'sawtooth', length: 0.16, volume: 0.025, slide: -30 },
    { midi: 45, wave: 'triangle', length: 0.2, volume: 0.08, slide: -8, delay: 0.04 },
  ],
  push: [
    { midi: 36, wave: 'sawtooth', length: 0.2, volume: 0.05, slide: -3 },
    { midi: 31, wave: 'triangle', length: 0.18, volume: 0.08, delay: 0.04 },
  ],
  // A cart's wheels over the joints in the rail: dry, short, two pitches.
  clack: [{ midi: 52, wave: 'square', length: 0.03, volume: 0.022, slide: -6 }],
  clack2: [{ midi: 57, wave: 'square', length: 0.025, volume: 0.018, slide: -6 }],
  click: [
    { midi: 60, wave: 'square', length: 0.05, volume: 0.05 },
    { midi: 79, wave: 'triangle', length: 0.12, volume: 0.05, delay: 0.05 },
  ],
  // Light reaching a prism: a small, high glassy ping.
  ping: [
    { midi: 93, wave: 'sine', length: 0.7, volume: 0.05 },
    { midi: 105, wave: 'sine', length: 0.3, volume: 0.02, delay: 0.005 },
  ],
  // Light reaching a crystal eye: a round crystal dong that rings on.
  dong: [
    { midi: 69, wave: 'sine', length: 1.8, volume: 0.09 },
    { midi: 81, wave: 'sine', length: 1.3, volume: 0.05, delay: 0.005 },
    { midi: 88, wave: 'triangle', length: 0.6, volume: 0.03, delay: 0.01 },
    { midi: 100, wave: 'sine', length: 0.25, volume: 0.02, delay: 0.01 },
  ],
  // A bridge of light forming: a quick shimmer up.
  shimmer: [
    { midi: 84, wave: 'sine', length: 0.5, volume: 0.035 },
    { midi: 88, wave: 'sine', length: 0.5, volume: 0.035, delay: 0.06 },
    { midi: 91, wave: 'sine', length: 0.5, volume: 0.035, delay: 0.12 },
    { midi: 96, wave: 'sine', length: 0.8, volume: 0.035, delay: 0.18 },
  ],
  // An old plank bridge taking your weight: a low, dry creak.
  creak: [
    { midi: 47, wave: 'sawtooth', length: 0.16, volume: 0.018, slide: 4 },
    { midi: 54, wave: 'triangle', length: 0.1, volume: 0.02, delay: 0.07, slide: -5 },
  ],
  // The Fair Return's gangway let go (ship_boarding): the hoist line running out through its block, the plank groaning
  // off her side. Then landing on the quay: a heavy plank slapped flat on wet stones, a dull knock and a low thump under it.
  gangwayLetGo: [{ clip: 'rope', volume: 0.5, rate: 0.8 }, { clip: 'timber', volume: 0.22, rate: 1.25, delay: 0.15 }],
  gangwayThump: [
    { clip: 'chopHit', volume: 0.75, rate: 0.5 },
    { clip: 'counter', volume: 0.5, rate: 0.55, delay: 0.01 },
    { midi: 31, wave: 'sine', length: 0.45, volume: 0.2, slide: -8 },
    { clip: 'chopHit', volume: 0.25, rate: 0.62, delay: 0.24 },
  ],
  // The Fair Return taking a list, or settling: the real timber creak under a long low groan (shipList.js).
  shipGroan: [
    { clip: 'timber', volume: 0.4 },
    { midi: 38, wave: 'sawtooth', length: 1.1, volume: 0.012, slide: -2.5 },
    { midi: 45, wave: 'triangle', length: 0.8, volume: 0.012, delay: 0.3, slide: -3 },
  ],
  // A gull getting up off its post: a few soft wingbeats.
  flutter: [
    { midi: 62, wave: 'triangle', length: 0.07, volume: 0.022, slide: 6 },
    { midi: 60, wave: 'triangle', length: 0.07, volume: 0.02, delay: 0.11, slide: 6 },
    { midi: 61, wave: 'triangle', length: 0.07, volume: 0.016, delay: 0.22, slide: 6 },
    { midi: 59, wave: 'triangle', length: 0.07, volume: 0.011, delay: 0.33, slide: 6 },
  ],
  // A crab bolting for its hole: tiny dry clicks.
  scuttle: [
    { midi: 96, wave: 'square', length: 0.015, volume: 0.008 },
    { midi: 98, wave: 'square', length: 0.015, volume: 0.007, delay: 0.05 },
    { midi: 95, wave: 'square', length: 0.015, volume: 0.007, delay: 0.1 },
    { midi: 97, wave: 'square', length: 0.015, volume: 0.006, delay: 0.15 },
  ],
  // An enemy throwing itself at you: a quick rush, and the thump as it hits.
  pounce: [
    { midi: 72, wave: 'sawtooth', length: 0.08, volume: 0.025, slide: -18 },
    { midi: 38, wave: 'triangle', length: 0.16, volume: 0.09, delay: 0.05, slide: -7 },
  ],
  hook: [
    { midi: 79, wave: 'triangle', length: 0.18, volume: 0.05, slide: 14 },
    { midi: 100, wave: 'square', length: 0.05, volume: 0.04, delay: 0.26 },
    { midi: 95, wave: 'square', length: 0.04, volume: 0.03, delay: 0.31 },
  ],
  // A flagstone dropping away under you (the Dead City): a crack, then the
  // stone going down into the dark, and a rattle of grit after it.
  crumble: [
    { midi: 57, wave: 'square', length: 0.05, volume: 0.05, slide: -12 },
    { midi: 34, wave: 'sawtooth', length: 0.26, volume: 0.07, slide: -9, delay: 0.04 },
    { midi: 44, wave: 'triangle', length: 0.1, volume: 0.04, slide: -6, delay: 0.2 },
    { midi: 49, wave: 'triangle', length: 0.08, volume: 0.03, slide: -4, delay: 0.3 },
  ],
  // Winning a fight: a short, plain fanfare (the battle song stops for it).
  // A quick pickup up to a held chord, in the minor of the battle songs but
  // ending on a lifted (major) third, so it's a relief rather than a party.
  // About a second and a half.
  victory: [
    ...[67, 70, 74].map((midi, i) => ({ midi, wave: 'square', length: 0.09, volume: 0.04, delay: i * 0.09 })),
    { midi: 79, wave: 'square', length: 0.7, volume: 0.045, delay: 0.27, hold: 0.25 },
    { midi: 74, wave: 'triangle', length: 0.8, volume: 0.05, delay: 0.27, hold: 0.25 },
    { midi: 71, wave: 'triangle', length: 0.8, volume: 0.045, delay: 0.27, hold: 0.25 },
    { midi: 43, wave: 'triangle', length: 0.9, volume: 0.09, delay: 0.27, hold: 0.2 },
    { midi: 91, wave: 'sine', length: 0.5, volume: 0.018, delay: 0.62 },
  ],
  // Low on HP while dodging: a soft, low double beat, like a heart.
  heartbeat: [
    { midi: 33, wave: 'sine', length: 0.12, volume: 0.11, slide: -3 },
    { midi: 31, wave: 'sine', length: 0.14, volume: 0.07, slide: -3, delay: 0.17 },
  ],
  // The end of chapter 5 (tideHeldFinale.js). The lamp room's glass going: a hard crack,
  // then high bright pieces raining.
  shatter: [
    { noise: 'highpass', frequency: 3000, q: 0.7, length: 0.18, volume: 0.2 },
    { noise: 'bandpass', frequency: 6000, q: 1.4, length: 0.9, volume: 0.09, delay: 0.06, sweep: 0.6 },
    ...[0.08, 0.15, 0.21, 0.3, 0.38, 0.5, 0.63].map((delay, i) => ({ midi: 96 + ((i * 5) % 9), wave: 'triangle', length: 0.07, volume: 0.03, delay })),
  ],
  // Bubbles coming up out of the water and breaking: small rising blips.
  bubbles: [0, 0.14, 0.31, 0.4, 0.62].map((delay, i) => ({ midi: 70 + ((i * 7) % 12), wave: 'sine', length: 0.06, volume: 0.035, slide: 9, delay })),
  // Coughing up the sea: two rough barks of breath.
  cough: [
    { noise: 'bandpass', frequency: 700, q: 1.1, length: 0.16, volume: 0.16, attack: 0.01 },
    { noise: 'bandpass', frequency: 520, q: 1.1, length: 0.2, volume: 0.13, attack: 0.01, delay: 0.3 },
  ],
  // A gasp: a sharp breath in, out of the water.
  gasp: [{ noise: 'bandpass', frequency: 1500, q: 0.9, length: 0.45, volume: 0.12, sweep: 1.8, attack: 0.05 }],
  // Going into the sea head first: the splash, and the rush of the water closing over.
  plunge: [{ clip: 'paddle', volume: 0.55 }, { clip: 'tideRush', volume: 0.3, delay: 0.03 }, { noise: 'lowpass', frequency: 300, q: 0.7, length: 0.9, volume: 0.18, delay: 0.05 }],
  // The game over's words coming up one letter at a time: a low, dull tone.
  toll: [{ midi: 41, wave: 'triangle', length: 0.09, volume: 0.035, slide: -2 }],
  // Pulling the Fallen Star out of its stone: our own little jingle. A
  // rising run that turns at the top (D, F#, A, then G, B up to a long D),
  // a low D under it, and the star's glints after.
  starGet: [
    ...[62, 66, 69, 67, 71].map((midi, i) => ({ midi, wave: 'square', length: 0.1, volume: 0.045, delay: i * 0.11 })),
    { midi: 74, wave: 'square', length: 0.75, volume: 0.05, delay: 0.55 },
    { midi: 74, wave: 'triangle', length: 0.8, volume: 0.06, delay: 0.55, slide: 0.3 },
    { midi: 50, wave: 'triangle', length: 0.9, volume: 0.08, delay: 0.55 },
    ...[98, 102, 105, 103].map((midi, i) => ({ midi, wave: 'sine', length: 0.12, volume: 0.03, delay: 0.8 + i * 0.12 })),
  ],

  // --- The reforge show (src/overworld/reforgeShow.js): the Fallen Star on a smith's anvil. ---
  // One blow of the hammer: a real anvil (assets/audio/under/anvil1-3.ogg, one picked
  // each time) with a thud under it, a spray of sparks over it, and a ring up high.
  // Teasel's is bright, Hobnail's is slow and heavy (the recording slowed, and a rumble),
  // Orla's has the hiss of sea water on hot metal after it.
  forgeHitBright: [
    { clip: ['../under/anvil1', '../under/anvil2', '../under/anvil3'], volume: 1.1, rate: 1.12 },
    { midi: 38, wave: 'sine', length: 0.22, volume: 0.2, slide: -8 },
    { noise: 'highpass', frequency: 4200, q: 0.8, length: 0.2, volume: 0.1 },
    { midi: 98, wave: 'sine', length: 0.9, volume: 0.025, delay: 0.02 },
  ],
  forgeHitHeavy: [
    { clip: ['../under/anvil1', '../under/anvil2', '../under/anvil3'], volume: 1.2, rate: 0.7 },
    { clip: ['../under/anvil2', '../under/anvil3'], volume: 0.55, rate: 0.55, delay: 0.03 },
    { midi: 29, wave: 'sine', length: 0.7, volume: 0.32, slide: -10 },
    { noise: 'lowpass', frequency: 320, q: 0.8, length: 0.5, volume: 0.22 },
    { midi: 91, wave: 'sine', length: 1.2, volume: 0.02, delay: 0.03 },
  ],
  forgeHitHiss: [
    { clip: ['../under/anvil1', '../under/anvil2', '../under/anvil3'], volume: 1.0, rate: 0.96 },
    { midi: 36, wave: 'sine', length: 0.25, volume: 0.18, slide: -8 },
    { noise: 'highpass', frequency: 6500, q: 0.5, length: 1.1, volume: 0.1, delay: 0.05, sweep: 0.55 },
    { noise: 'bandpass', frequency: 3200, q: 0.7, length: 0.7, volume: 0.07, delay: 0.08 },
    { midi: 100, wave: 'sine', length: 1.0, volume: 0.02, delay: 0.02 },
  ],
  // The forge flaring up: a roar rising out of the coals.
  forgeFlare: [
    { noise: 'lowpass', frequency: 300, q: 0.7, length: 1.3, volume: 0.2, attack: 0.45, sweep: 6 },
    { midi: 34, wave: 'sine', length: 1.2, volume: 0.16, attack: 0.4, slide: 12 },
    { noise: 'bandpass', frequency: 1800, q: 0.6, length: 0.6, volume: 0.05, delay: 0.3 },
  ],
  // The shard coming down: a glassy run falling to a point.
  forgeShard: [108, 105, 103, 100, 96, 91].map((midi, i) => ({ midi, wave: 'sine', length: 0.45, volume: 0.035, delay: i * 0.16 })),
  // The shard going into the blade: a bell of light, a soft anvil under it, a breath of wind.
  forgeSink: [
    { midi: 76, wave: 'sine', length: 2.6, volume: 0.1 },
    { midi: 83, wave: 'sine', length: 2.2, volume: 0.06 },
    { midi: 100, wave: 'triangle', length: 1.4, volume: 0.04 },
    { clip: ['../under/anvil1', '../under/anvil2'], volume: 0.45, rate: 1.35 },
    { noise: 'highpass', frequency: 5000, q: 0.5, length: 1.2, volume: 0.06, attack: 0.15, sweep: 2 },
  ],
  // The new name coming up: a few high stars.
  forgeName: [91, 95, 98, 103, 107].map((midi, i) => ({ midi, wave: 'sine', length: 1.1, volume: 0.03, delay: i * 0.09 })),

  // --- The small things (added 8 November 2026). ---
  // A tone can be a breath of filtered noise instead of a note: `noise` is the
  // filter ('bandpass', 'lowpass' or 'highpass') at `frequency` Hz with `q`,
  // and `sweep` moves the filter (x2 is up an octave) over the tone. `attack`
  // (seconds) fades a tone in instead of starting it at full volume.
  //
  // Footsteps, one per ground (see FOOTSTEPS below). Only yours, and very soft.
  stepDirt: [{ noise: 'lowpass', frequency: 900, q: 0.7, length: 0.06, volume: 0.07 }],
  stepStone: [
    { noise: 'bandpass', frequency: 1900, q: 2.2, length: 0.03, volume: 0.025 },
    { noise: 'lowpass', frequency: 320, q: 0.8, length: 0.05, volume: 0.025 },
  ],
  stepWood: [
    { noise: 'bandpass', frequency: 850, q: 3, length: 0.045, volume: 0.07 },
    { midi: 50, wave: 'sine', length: 0.06, volume: 0.016, slide: -3 },
  ],
  stepGrass: [
    // A soft, low brush: no hiss on top (the old high one grated).
    { noise: 'lowpass', frequency: 1100, q: 0.6, length: 0.07, volume: 0.022, attack: 0.01 },
    { noise: 'lowpass', frequency: 450, q: 0.7, length: 0.05, volume: 0.02 },
  ],
  stepLeaves: [
    { noise: 'bandpass', frequency: 2800, q: 1.4, length: 0.025, volume: 0.05 },
    { noise: 'bandpass', frequency: 2200, q: 1.4, length: 0.025, volume: 0.04, delay: 0.018 },
    { noise: 'bandpass', frequency: 3400, q: 1.6, length: 0.03, volume: 0.035, delay: 0.04 },
  ],
  stepSnow: [
    { noise: 'bandpass', frequency: 3800, q: 0.7, length: 0.09, volume: 0.03, sweep: 0.6 },
    { noise: 'lowpass', frequency: 600, q: 0.7, length: 0.08, volume: 0.045 },
  ],
  stepSand: [{ noise: 'bandpass', frequency: 2200, q: 0.6, length: 0.09, volume: 0.03, sweep: 0.75, attack: 0.012 }],
  // Wading or squelching: only a soft, low tick of mud, no splash.
  stepWet: [
    { noise: 'lowpass', frequency: 500, q: 1.2, length: 0.08, volume: 0.05 },
    { noise: 'bandpass', frequency: 1200, q: 4, length: 0.03, volume: 0.025, delay: 0.02 },
  ],
  // Jumping: a little push of air. Landing: a soft thump.
  jump: [
    { noise: 'bandpass', frequency: 1300, q: 1.2, length: 0.09, volume: 0.035, sweep: 2, attack: 0.02 },
    { midi: 70, wave: 'triangle', length: 0.06, volume: 0.012, slide: 5 },
  ],
  land: [
    { noise: 'lowpass', frequency: 420, q: 0.9, length: 0.09, volume: 0.1 },
    { midi: 40, wave: 'sine', length: 0.08, volume: 0.04, slide: -6 },
  ],
  // Walking into a wall: a dull little bump, once each time you push into it.
  bump: [
    { noise: 'lowpass', frequency: 260, q: 1, length: 0.06, volume: 0.09 },
    { midi: 36, wave: 'sine', length: 0.07, volume: 0.03, slide: -4 },
  ],
  // Gold: a few coins clinking into your purse.
  coins: [
    ...[96, 100, 98, 103].map((midi, i) => ({ midi, wave: 'triangle', length: 0.05, volume: 0.03, delay: i * 0.055 + (i % 2) * 0.01 })),
    { midi: 103, wave: 'sine', length: 0.3, volume: 0.016, delay: 0.17 },
  ],
  // Buying something: the coins counted out, and the till's little bell.
  buy: [
    ...[98, 94, 100].map((midi, i) => ({ midi, wave: 'triangle', length: 0.045, volume: 0.028, delay: i * 0.05 })),
    { midi: 91, wave: 'sine', length: 0.45, volume: 0.04, delay: 0.16 },
    { midi: 103, wave: 'sine', length: 0.25, volume: 0.015, delay: 0.165 },
  ],
  // Picking something up: a quick bright "got it".
  pickup: [
    { midi: 79, wave: 'triangle', length: 0.06, volume: 0.045 },
    { midi: 86, wave: 'triangle', length: 0.07, volume: 0.045, delay: 0.06 },
    { midi: 91, wave: 'triangle', length: 0.16, volume: 0.04, delay: 0.12 },
    { midi: 98, wave: 'sine', length: 0.3, volume: 0.02, delay: 0.13 },
  ],
  // Opening things (remade 13 November 2026): short, crisp game sounds made
  // here, not recordings. Chirpy square and triangle blips and little pops of
  // noise, so they read as "you got something", not as the real object.
  // (The old recorded versions are kept in assets/audio/sfx/: chest, pouch,
  // pack and storage.)
  // A treasure chest: a tick of the latch, the lid's quick pop, then a little
  // chime running up (C E G C, ringing out on a high E). It's its own "got
  // it"; the `pickup` ding still plays after it (see overworldScene.js).
  chest: [
    { midi: 88, wave: 'square', length: 0.022, volume: 0.088 },
    { midi: 57, wave: 'square', length: 0.07, volume: 0.132, slide: -12, delay: 0.025 },
    { noise: 'lowpass', frequency: 1600, q: 0.8, length: 0.06, volume: 0.704, delay: 0.025 },
    ...[72, 76, 79, 84].map((midi, i) => ({ midi, wave: 'square', length: 0.055, volume: 0.075, delay: 0.09 + i * 0.038 })),
    { midi: 88, wave: 'triangle', length: 0.4, volume: 0.132, delay: 0.242 },
    { midi: 96, wave: 'sine', length: 0.45, volume: 0.048, delay: 0.245 },
  ],
  // A coin pouch: a small soft "pomf" as it's picked up (the coins jingle
  // over it, as `coins`).
  pouch: [
    { noise: 'lowpass', frequency: 1500, q: 0.9, length: 0.08, volume: 0.85, sweep: 0.35 },
    { midi: 60, wave: 'triangle', length: 0.075, volume: 0.136, slide: -9 },
  ],
  // An old pack, a bundle: a rounder, lower "pomf" as it flops open, and a
  // second smaller one as it settles. (`pickup` plays its chime over it.)
  pack: [
    { noise: 'lowpass', frequency: 1100, q: 1, length: 0.11, volume: 0.96, sweep: 0.3 },
    { midi: 52, wave: 'triangle', length: 0.1, volume: 0.16, slide: -10 },
    { noise: 'lowpass', frequency: 900, q: 1, length: 0.06, volume: 0.48, sweep: 0.4, delay: 0.1 },
    { midi: 55, wave: 'triangle', length: 0.05, volume: 0.08, slide: -7, delay: 0.1 },
  ],
  // The storage chest: a deeper "ka-thunk" of the lid, and two soft notes up
  // (G to D) as it opens on what you've kept.
  storage: [
    { midi: 84, wave: 'square', length: 0.02, volume: 0.084 },
    { midi: 45, wave: 'square', length: 0.09, volume: 0.144, slide: -12, delay: 0.03 },
    { noise: 'lowpass', frequency: 800, q: 0.9, length: 0.1, volume: 1.08, delay: 0.03 },
    { midi: 67, wave: 'triangle', length: 0.1, volume: 0.144, delay: 0.13 },
    { midi: 74, wave: 'triangle', length: 0.3, volume: 0.144, delay: 0.2 },
  ],
  // Chapter 5's third wave of battle moves (8 November 2026). The ones that
  // are something real being handled are real recordings (assets/audio/sfx/,
  // Kenney's CC0 "RPG Audio", see assets/audio/samples/README.md); the rest
  // are made here, like the other battle sounds.
  // The hero's COUNTER: a blade drawn and held ready, and a thin ring off it.
  counter: [
    { clip: 'counter', volume: 0.9 },
    { midi: 93, wave: 'triangle', length: 0.4, volume: 0.028, delay: 0.12 },
    { midi: 100, wave: 'sine', length: 0.3, volume: 0.014, delay: 0.13 },
  ],
  // SIDESTEP: two quick light steps aside, and a breath of air.
  sidestep: [
    { clip: 'sidestep', volume: 0.6 },
    { noise: 'bandpass', frequency: 1800, q: 1, length: 0.16, volume: 0.05, sweep: 0.5, attack: 0.03, delay: 0.04 },
  ],
  // DUCK UNDER: a low swoop of air going over your head.
  duck: [
    { noise: 'bandpass', frequency: 900, q: 1.2, length: 0.35, volume: 0.11, sweep: 0.4, attack: 0.08 },
    { midi: 55, wave: 'triangle', length: 0.3, volume: 0.04, slide: -9 },
  ],
  // STALL: everything winding down, like a music box running out.
  stall: [70, 67, 63, 58].map((midi, i) => ({ midi, wave: 'triangle', length: 0.16 + i * 0.06, volume: 0.045, slide: -1.5, delay: i * (0.1 + i * 0.04) })),
  // WEAKEN: a sour chord sagging flat.
  weaken: [
    { midi: 62, wave: 'sawtooth', length: 0.5, volume: 0.022, slide: -4, attack: 0.03 },
    { midi: 65, wave: 'sawtooth', length: 0.5, volume: 0.018, slide: -5, attack: 0.03 },
    { midi: 50, wave: 'triangle', length: 0.55, volume: 0.06, slide: -5, attack: 0.02 },
  ],
  // TRUCE: the sword lowered, and two soft notes settling.
  truce: [
    { noise: 'bandpass', frequency: 2600, q: 2, length: 0.12, volume: 0.03, sweep: 0.6 },
    { midi: 74, wave: 'sine', length: 0.4, volume: 0.05, delay: 0.08 },
    { midi: 69, wave: 'sine', length: 0.6, volume: 0.045, delay: 0.3 },
  ],
  // Ves's TWIRL: the umbrella spun, the air round it going whup-whup.
  twirl: [0, 0.13, 0.26].map((delay, i) => ({ noise: 'bandpass', frequency: 1100 + i * 250, q: 1.4, length: 0.13, volume: 0.09 - i * 0.015, sweep: 1.6, attack: 0.03, delay })),
  // LIFT: an updraft rising under the party.
  lift: [
    { noise: 'bandpass', frequency: 500, q: 1, length: 0.55, volume: 0.1, sweep: 4, attack: 0.2 },
    { midi: 67, wave: 'sine', length: 0.5, volume: 0.025, slide: 12, attack: 0.1 },
  ],
  // HOT SOUP: the ladle knocking the pot, and the steam off it.
  soup: [
    { clip: 'soup', volume: 0.4 },
    { noise: 'highpass', frequency: 5000, q: 0.7, length: 0.6, volume: 0.025, attack: 0.15, delay: 0.15 },
  ],
  // CHARGE: static building up in the umbrella's ribs.
  charge: [
    { midi: 55, wave: 'sawtooth', length: 0.45, volume: 0.025, slide: 19, attack: 0.05 },
    ...[0.15, 0.25, 0.32, 0.38, 0.43].map((delay) => ({ noise: 'highpass', frequency: 4500, q: 1, length: 0.02, volume: 0.06, delay })),
  ],
  // WINDBREAK: the umbrella snapped open in front of everyone.
  umbrella: [
    { clip: 'umbrella', volume: 0.7 },
    { midi: 48, wave: 'triangle', length: 0.12, volume: 0.06, slide: -4, delay: 0.17 },
  ],
  // Bramble's NOTCH: his knife cutting a notch, quick and neat.
  notch: [{ clip: 'notch', volume: 0.45 }],
  // RALLY: a gruff little "come on!" of a fanfare.
  rally: [
    { midi: 62, wave: 'square', length: 0.07, volume: 0.035 },
    { midi: 67, wave: 'square', length: 0.07, volume: 0.035, delay: 0.08 },
    { midi: 74, wave: 'square', length: 0.22, volume: 0.035, delay: 0.16 },
    { midi: 50, wave: 'triangle', length: 0.3, volume: 0.06, delay: 0.16 },
  ],
  // POCKET SAND: a handful thrown, fssht, and the grains pattering.
  sandThrow: [
    { noise: 'highpass', frequency: 2500, q: 0.7, length: 0.22, volume: 0.09, sweep: 1.5, attack: 0.02 },
    ...[0.18, 0.23, 0.27, 0.33, 0.36, 0.42].map((delay, i) => ({ noise: 'bandpass', frequency: 3200 + (i % 3) * 600, q: 5, length: 0.015, volume: 0.06 - i * 0.006, delay })),
  ],
  // LOOK OUT!: two sharp, high warning notes.
  lookOut: [
    { midi: 84, wave: 'square', length: 0.07, volume: 0.035, slide: 2 },
    { midi: 88, wave: 'square', length: 0.12, volume: 0.035, slide: 3, delay: 0.1 },
  ],
  // SHAKE IT OFF: a coat shaken out, twice.
  shake: [{ clip: 'shake', volume: 0.55 }],
  // Coming back from the PAUSED card: a soft "on again".
  unpause: [
    { midi: 72, wave: 'triangle', length: 0.06, volume: 0.035 },
    { midi: 79, wave: 'triangle', length: 0.12, volume: 0.035, delay: 0.06 },
  ],
  // The tide turning: a big real wave, slowed and darkened, swelling in
  // (cut from the seaWaves recordings, see assets/audio/samples/README.md).
  tideRush: [{ clip: 'tideRush', volume: 0.4 }],
  // A small, close splash of real water (a wave's break, pitched up): Bramble's
  // swimming lesson.
  paddle: [{ clip: 'paddle', volume: 0.35 }],
  // "Splash. Splash splash. SPLASH.": Bramble going in.
  splashes: [{ clip: 'paddle', volume: 0.3 }, { clip: 'paddle', volume: 0.28, delay: 0.32 }, { clip: 'paddle', volume: 0.3, delay: 0.5 }, { clip: 'paddle', volume: 0.45, delay: 0.95 }],
  // A bell rung under the water, somewhere below Merrow's street: four slow,
  // even strokes, dull and far off, with no bright ring left in them.
  drownedBell: [0, 1.3, 2.6, 3.9].flatMap((delay) => [
    { midi: 50, wave: 'sine', length: 1.6, volume: 0.09, delay, slide: -0.3 },
    { midi: 57, wave: 'sine', length: 1.1, volume: 0.035, delay: delay + 0.01 },
    { midi: 62, wave: 'triangle', length: 0.5, volume: 0.012, delay: delay + 0.01 },
  ]),
  // Shingle underfoot: a crunch of pebbles shifting.
  stepShingle: [
    { noise: 'bandpass', frequency: 2600, q: 2.5, length: 0.025, volume: 0.05 },
    { noise: 'bandpass', frequency: 1900, q: 3, length: 0.03, volume: 0.04, delay: 0.02 },
    { noise: 'lowpass', frequency: 500, q: 0.8, length: 0.05, volume: 0.03 },
  ],
  // Added 9 November 2026: real footsteps for chapter 4's grounds (see
  // FOOTSTEPS below and groundUnder in src/overworld/footfall.js). Each is a
  // real recording, one picked at random from its set each step
  // (assets/audio/sfx/steps/, cut from CC0 packs: see
  // assets/audio/samples/README.md). Levelled a little over the old made
  // ones, so they're heard. `rate` plays a set lower or higher.
  stepRock: [{ clip: STEP_SETS.rock, volume: 0.145 }],
  stepPaving: [{ clip: STEP_SETS.rock, volume: 0.13, rate: 1.08 }],
  // Crystal underfoot: the step on rock, and a faint glassy tink with it.
  // (No glass tink on every step any more: too busy, 2026-11-10.)
  stepCrystal: [{ clip: STEP_SETS.rock, volume: 0.13 }],
  stepGravel: [{ clip: STEP_SETS.gravel, volume: 0.07 }],
  stepDirtReal: [{ clip: STEP_SETS.gravel, volume: 0.055, rate: 0.85 }],
  stepPlanks: [{ clip: STEP_SETS.wood, volume: 0.1 }],
  // Trestle planks over a drop: hollower, lower.
  stepTrestle: [{ clip: STEP_SETS.wood, volume: 0.1, rate: 0.86 }],
  stepRug: [{ clip: STEP_SETS.carpet, volume: 0.07 }],
  stepMoss: [{ clip: STEP_SETS.carpet, volume: 0.06, rate: 0.9 }],
  stepAsh: [{ clip: STEP_SETS.carpet, volume: 0.06, rate: 0.8 }],
  stepMeadow: [{ clip: STEP_SETS.grass, volume: 0.09 }],
  stepWade: [{ clip: STEP_SETS.wade, volume: 0.075 }],
  // A lever or switch thrown: a clunk and the catch clicking home.
  lever: [
    { midi: 48, wave: 'square', length: 0.03, volume: 0.03, slide: -5 },
    { noise: 'lowpass', frequency: 600, q: 1, length: 0.05, volume: 0.08 },
    { midi: 67, wave: 'triangle', length: 0.035, volume: 0.03, delay: 0.07 },
    { noise: 'bandpass', frequency: 3000, q: 3, length: 0.02, volume: 0.04, delay: 0.07 },
  ],
  // The pause menu: a soft page turning up, and back down.
  menuOpen: [
    { noise: 'bandpass', frequency: 1800, q: 1.2, length: 0.09, volume: 0.03, sweep: 1.8, attack: 0.03 },
    { midi: 76, wave: 'triangle', length: 0.05, volume: 0.025, delay: 0.02 },
    { midi: 83, wave: 'triangle', length: 0.08, volume: 0.025, delay: 0.07 },
  ],
  menuClose: [
    { noise: 'bandpass', frequency: 3000, q: 1.2, length: 0.08, volume: 0.025, sweep: 0.55, attack: 0.02 },
    { midi: 81, wave: 'triangle', length: 0.05, volume: 0.022, delay: 0.01 },
    { midi: 74, wave: 'triangle', length: 0.07, volume: 0.022, delay: 0.06 },
  ],
  // Putting on a weapon or armor: a buckle done up, a little ring of metal.
  // (Now only for gear with no sound of its own: see below.)
  equip: [
    { noise: 'highpass', frequency: 4500, q: 0.7, length: 0.05, volume: 0.03 },
    { midi: 86, wave: 'triangle', length: 0.1, volume: 0.03, delay: 0.02 },
    { midi: 98, wave: 'sine', length: 0.25, volume: 0.018, delay: 0.03 },
  ],
  // --- Equipping, by what the thing is (added 13 November 2026; which
  // weapon or armor gets which is in src/audio/equipSounds.js). All made
  // here, game-style: short blips and puffs of noise, under half a second.
  // A sword going home in its sheath: a quick bright slide, a click, and a
  // high metal "shing" ringing off (two notes not quite in tune, like steel).
  equipSword: [
    { noise: 'highpass', frequency: 2500, q: 0.7, length: 0.1, volume: 0.07, sweep: 2.2, attack: 0.03 },
    { midi: 91, wave: 'square', length: 0.02, volume: 0.04, delay: 0.1 },
    { midi: 100, wave: 'triangle', length: 0.35, volume: 0.05, delay: 0.1 },
    { midi: 106.4, wave: 'sine', length: 0.3, volume: 0.025, delay: 0.1 },
  ],
  // A knife or a thin blade: the same, shorter and higher, a little "tsing".
  equipDagger: [
    { noise: 'highpass', frequency: 4000, q: 0.7, length: 0.06, volume: 0.06, sweep: 1.8, attack: 0.02 },
    { midi: 96, wave: 'square', length: 0.015, volume: 0.035, delay: 0.06 },
    { midi: 105, wave: 'triangle', length: 0.22, volume: 0.045, delay: 0.06 },
    { midi: 111.3, wave: 'sine', length: 0.2, volume: 0.02, delay: 0.06 },
  ],
  // The Fallen Star: the sword's shing, with a few stars running up after it.
  equipStar: [
    { noise: 'highpass', frequency: 2500, q: 0.7, length: 0.1, volume: 0.07, sweep: 2.2, attack: 0.03 },
    { midi: 91, wave: 'square', length: 0.02, volume: 0.04, delay: 0.1 },
    { midi: 100, wave: 'triangle', length: 0.35, volume: 0.045, delay: 0.1 },
    ...[91, 95, 98, 103].map((midi, i) => ({ midi, wave: 'sine', length: 0.35, volume: 0.03, delay: 0.17 + i * 0.05 })),
  ],
  // A hammer, a maul, a stone fist: set down hard, a low "clunk" with a
  // bang of metal on top and a small bounce after.
  equipHeavy: [
    { midi: 43, wave: 'square', length: 0.1, volume: 0.07, slide: -8 },
    { midi: 31, wave: 'triangle', length: 0.22, volume: 0.13, slide: -5 },
    { noise: 'lowpass', frequency: 600, q: 0.9, length: 0.12, volume: 0.6 },
    { midi: 70, wave: 'square', length: 0.04, volume: 0.035 },
    { midi: 77.5, wave: 'square', length: 0.03, volume: 0.02 },
    { midi: 40, wave: 'square', length: 0.05, volume: 0.035, slide: -5, delay: 0.12 },
    { noise: 'lowpass', frequency: 500, q: 0.9, length: 0.05, volume: 0.25, delay: 0.12 },
  ],
  // An axe or a hatchet: a hollow wooden "thunk", and a little "tok" after.
  equipAxe: [
    { midi: 64, wave: 'square', length: 0.018, volume: 0.03 },
    { midi: 53, wave: 'triangle', length: 0.1, volume: 0.12, slide: -9 },
    { noise: 'bandpass', frequency: 700, q: 2.5, length: 0.05, volume: 0.3 },
    { midi: 60, wave: 'triangle', length: 0.05, volume: 0.06, slide: -6, delay: 0.1 },
    { noise: 'bandpass', frequency: 1000, q: 3, length: 0.03, volume: 0.15, delay: 0.1 },
  ],
  // A spear, a pole, a pike, a fork, a hook: a swish round, then the butt
  // knocked on the ground, "tok".
  equipPole: [
    { noise: 'bandpass', frequency: 700, q: 1.2, length: 0.15, volume: 0.22, sweep: 3, attack: 0.08 },
    { midi: 57, wave: 'triangle', length: 0.07, volume: 0.1, slide: -7, delay: 0.15 },
    { noise: 'bandpass', frequency: 1200, q: 2, length: 0.035, volume: 0.2, delay: 0.15 },
  ],
  // A bow: the string plucked, a springy "twang" dropping a little.
  equipBow: [
    { noise: 'highpass', frequency: 3000, q: 0.7, length: 0.02, volume: 0.06 },
    { midi: 67, wave: 'triangle', length: 0.22, volume: 0.09, slide: -2.5 },
    { midi: 79, wave: 'square', length: 0.08, volume: 0.025, slide: -2 },
  ],
  // A sling: two quick whirls and a click as the stone sits in the pouch.
  equipSling: [
    { noise: 'bandpass', frequency: 1300, q: 1.6, length: 0.07, volume: 0.27, sweep: 1.8, attack: 0.03 },
    { noise: 'bandpass', frequency: 1600, q: 1.6, length: 0.07, volume: 0.27, sweep: 1.8, attack: 0.03, delay: 0.08 },
    { midi: 76, wave: 'square', length: 0.025, volume: 0.06, delay: 0.16 },
    { midi: 83, wave: 'triangle', length: 0.08, volume: 0.06, delay: 0.18 },
  ],
  // A staff: a wooden "tok", and a little twinkle of magic.
  equipStaff: [
    { midi: 55, wave: 'triangle', length: 0.08, volume: 0.11, slide: -6 },
    { noise: 'bandpass', frequency: 850, q: 2.5, length: 0.04, volume: 0.25 },
    ...[88, 93, 100].map((midi, i) => ({ midi, wave: 'sine', length: 0.25, volume: 0.03, delay: 0.06 + i * 0.045 })),
  ],
  // A lantern: a glassy "tink", and the flame catching with a soft "fwoom".
  equipLantern: [
    { midi: 96, wave: 'triangle', length: 0.08, volume: 0.045 },
    { midi: 103, wave: 'sine', length: 0.3, volume: 0.025 },
    { noise: 'lowpass', frequency: 500, q: 1, length: 0.28, volume: 0.45, sweep: 3, attack: 0.1, delay: 0.05 },
    { midi: 76, wave: 'triangle', length: 0.2, volume: 0.03, attack: 0.08, delay: 0.1 },
  ],
  // A shield or a buckler: a round metal "bonk" that rings for a moment.
  equipShield: [
    { midi: 57, wave: 'square', length: 0.08, volume: 0.045, slide: -2 },
    { midi: 45, wave: 'triangle', length: 0.18, volume: 0.12 },
    { noise: 'lowpass', frequency: 900, q: 1, length: 0.06, volume: 0.35 },
    { midi: 69.5, wave: 'triangle', length: 0.3, volume: 0.04 },
    { midi: 76.2, wave: 'sine', length: 0.25, volume: 0.02 },
  ],
  // Gauntlets: two little metal "clink-clank"s as they go on.
  equipGauntlets: [
    { midi: 81, wave: 'square', length: 0.035, volume: 0.048 },
    { noise: 'bandpass', frequency: 3200, q: 3, length: 0.03, volume: 0.216 },
    { midi: 48, wave: 'triangle', length: 0.06, volume: 0.084, slide: -5 },
    { midi: 76, wave: 'square', length: 0.04, volume: 0.048, delay: 0.09 },
    { noise: 'bandpass', frequency: 2600, q: 3, length: 0.035, volume: 0.216, delay: 0.09 },
    { midi: 88.4, wave: 'sine', length: 0.18, volume: 0.024, delay: 0.09 },
  ],
  // A bell: struck once, a clear "ding" with a not-quite-in-tune overtone.
  equipBell: [
    { midi: 84, wave: 'square', length: 0.02, volume: 0.025 },
    { midi: 84, wave: 'sine', length: 0.7, volume: 0.07 },
    { midi: 91.2, wave: 'sine', length: 0.45, volume: 0.03 },
    { midi: 96, wave: 'triangle', length: 0.25, volume: 0.02 },
  ],
  // A trumpet: a little two-note "ta-taa".
  equipHorn: [
    { midi: 72, wave: 'square', length: 0.06, volume: 0.04, attack: 0.008 },
    { midi: 79, wave: 'square', length: 0.18, volume: 0.04, attack: 0.01, delay: 0.08 },
    { midi: 79, wave: 'triangle', length: 0.18, volume: 0.04, delay: 0.08 },
  ],
  // A book: three pages flicked, and the cover shut with a soft "plop".
  equipBook: [
    ...[0, 0.035, 0.07].map((delay, i) => ({ noise: 'bandpass', frequency: 2600 + i * 300, q: 1.2, length: 0.03, volume: 0.12, delay })),
    { midi: 50, wave: 'triangle', length: 0.07, volume: 0.1, slide: -6, delay: 0.12 },
    { noise: 'lowpass', frequency: 900, q: 1, length: 0.05, volume: 0.3, delay: 0.12 },
  ],
  // Ves's umbrella parts: a quick "fwip" as it opens and two little clicks
  // of the ribs locking.
  equipUmbrella: [
    { noise: 'bandpass', frequency: 1100, q: 1.3, length: 0.11, volume: 0.325, sweep: 2.6, attack: 0.05 },
    { midi: 88, wave: 'square', length: 0.02, volume: 0.052, delay: 0.11 },
    { midi: 95, wave: 'square', length: 0.02, volume: 0.046, delay: 0.145 },
    { midi: 76, wave: 'triangle', length: 0.14, volume: 0.052, delay: 0.11 },
  ],
  // Clothes: a soft rustle, "ffsh-ffsh", and a tiny blip as it's on.
  equipCloth: [
    { noise: 'bandpass', frequency: 2400, q: 0.8, length: 0.07, volume: 0.238, sweep: 0.7, attack: 0.025 },
    { noise: 'bandpass', frequency: 1900, q: 0.8, length: 0.08, volume: 0.238, sweep: 0.7, attack: 0.025, delay: 0.075 },
    { midi: 76, wave: 'triangle', length: 0.06, volume: 0.06, delay: 0.15 },
  ],
  // A coat, a jacket, leathers: a heavier swish round the shoulders and a
  // soft "fwump" as it settles.
  equipCoat: [
    { noise: 'bandpass', frequency: 1300, q: 0.7, length: 0.13, volume: 0.204, sweep: 0.6, attack: 0.04 },
    { noise: 'lowpass', frequency: 500, q: 1, length: 0.08, volume: 0.54, delay: 0.12 },
    { midi: 55, wave: 'triangle', length: 0.07, volume: 0.084, slide: -6, delay: 0.12 },
    { midi: 67, wave: 'triangle', length: 0.06, volume: 0.036, delay: 0.17 },
  ],
  // Chain mail: a quick shiver of little links, and the weight landing.
  equipMail: [
    ...[0, 0.025, 0.045, 0.07, 0.09, 0.115].map((delay, i) => ({ noise: 'bandpass', frequency: 4200 + (i % 3) * 900, q: 5, length: 0.02, volume: 0.286 - i * 0.02, delay })),
    ...[93, 98, 95].map((midi, i) => ({ midi, wave: 'square', length: 0.015, volume: 0.026, delay: 0.01 + i * 0.04 })),
    { midi: 45, wave: 'triangle', length: 0.08, volume: 0.117, slide: -6, delay: 0.12 },
    { noise: 'lowpass', frequency: 700, q: 1, length: 0.05, volume: 0.325, delay: 0.12 },
  ],
  // A breastplate, a cuirass, a diver's plate: "clank-clank", two plates
  // buckled to.
  equipPlate: [
    { midi: 64, wave: 'square', length: 0.04, volume: 0.045 },
    { midi: 76.3, wave: 'triangle', length: 0.18, volume: 0.035 },
    { noise: 'lowpass', frequency: 800, q: 1, length: 0.06, volume: 0.35 },
    { midi: 60, wave: 'square', length: 0.045, volume: 0.045, delay: 0.09 },
    { midi: 72.3, wave: 'triangle', length: 0.25, volume: 0.035, delay: 0.09 },
    { noise: 'lowpass', frequency: 700, q: 1, length: 0.06, volume: 0.35, delay: 0.09 },
  ],
  // Crystal armour: a glassy clink of plates, with a cold sparkle on top.
  equipCrystal: [
    { midi: 64, wave: 'square', length: 0.035, volume: 0.048 },
    { noise: 'lowpass', frequency: 900, q: 1, length: 0.05, volume: 0.36 },
    ...[96, 103, 100].map((midi, i) => ({ midi, wave: 'triangle', length: 0.25, volume: 0.042, delay: 0.05 + i * 0.05 })),
  ],
  // Bark armour: like the axes, a dry wooden "tok-tok".
  equipWood: [
    { midi: 57, wave: 'triangle', length: 0.07, volume: 0.11, slide: -7 },
    { noise: 'bandpass', frequency: 900, q: 2.5, length: 0.04, volume: 0.28 },
    { midi: 52, wave: 'triangle', length: 0.08, volume: 0.1, slide: -7, delay: 0.09 },
    { noise: 'bandpass', frequency: 750, q: 2.5, length: 0.04, volume: 0.25, delay: 0.09 },
  ],
  // Mittens and a muff: two soft pats, a little blip on each.
  equipMitts: [
    { noise: 'lowpass', frequency: 1600, q: 1, length: 0.045, volume: 0.35 },
    { midi: 67, wave: 'triangle', length: 0.045, volume: 0.04 },
    { noise: 'lowpass', frequency: 1800, q: 1, length: 0.045, volume: 0.35, delay: 0.08 },
    { midi: 71, wave: 'triangle', length: 0.05, volume: 0.04, delay: 0.08 },
  ],
  // A hat or a hood: a soft "pomf" on the head and a little blip up.
  equipHat: [
    { noise: 'lowpass', frequency: 1400, q: 1, length: 0.07, volume: 0.4, sweep: 0.5 },
    { midi: 72, wave: 'triangle', length: 0.08, volume: 0.05, slide: 5, delay: 0.03 },
  ],
  // A metal helmet: a hollow "tonk".
  equipHelm: [
    { midi: 57, wave: 'triangle', length: 0.14, volume: 0.11 },
    { midi: 71.4, wave: 'square', length: 0.05, volume: 0.035 },
    { midi: 83.2, wave: 'triangle', length: 0.22, volume: 0.03 },
    { noise: 'lowpass', frequency: 1000, q: 1, length: 0.04, volume: 0.25 },
  ],
  // Goggles: the strap snapped, and a tink off the glass.
  equipGoggles: [
    { midi: 81, wave: 'square', length: 0.03, volume: 0.06, slide: -12 },
    { noise: 'highpass', frequency: 3000, q: 0.7, length: 0.02, volume: 0.09 },
    { midi: 100, wave: 'triangle', length: 0.15, volume: 0.06, delay: 0.06 },
  ],
  // Boots and waders: two quick stomps.
  equipBoots: [
    { midi: 45, wave: 'triangle', length: 0.07, volume: 0.12, slide: -7 },
    { noise: 'lowpass', frequency: 600, q: 1, length: 0.06, volume: 0.4 },
    { midi: 43, wave: 'triangle', length: 0.08, volume: 0.12, slide: -7, delay: 0.12 },
    { noise: 'lowpass', frequency: 550, q: 1, length: 0.06, volume: 0.4, delay: 0.12 },
  ],
  // A belt: a quick "zzip" through the loops, and a tug as it's knotted.
  equipBelt: [
    { noise: 'bandpass', frequency: 1500, q: 1.3, length: 0.08, volume: 0.234, sweep: 2, attack: 0.02 },
    { midi: 55, wave: 'triangle', length: 0.05, volume: 0.104, slide: -5, delay: 0.09 },
    { midi: 79, wave: 'square', length: 0.02, volume: 0.039, delay: 0.09 },
  ],
  // The cork float: a cork popping, "pok!", and a little bob up.
  equipCork: [
    { midi: 70, wave: 'square', length: 0.035, volume: 0.06, slide: 12 },
    { noise: 'bandpass', frequency: 1800, q: 2, length: 0.025, volume: 0.3 },
    { midi: 79, wave: 'triangle', length: 0.1, volume: 0.075, slide: 3, delay: 0.06 },
  ],
  // A box of words coming up, and turning to the next page: tiny ticks.
  textOpen: [
    { midi: 72, wave: 'triangle', length: 0.035, volume: 0.02 },
    { noise: 'bandpass', frequency: 3000, q: 1.5, length: 0.03, volume: 0.02 },
  ],
  page: [{ midi: 79, wave: 'triangle', length: 0.025, volume: 0.016 }],
  // A battle: an enemy beaten puffs away; one spared goes with a soft
  // sparkle; running away is a quick scamper of feet.
  vanish: [
    { noise: 'bandpass', frequency: 1500, q: 0.8, length: 0.35, volume: 0.05, sweep: 0.4 },
    { midi: 74, wave: 'square', length: 0.06, volume: 0.025, slide: -12 },
    { midi: 62, wave: 'triangle', length: 0.18, volume: 0.03, slide: -10, delay: 0.05 },
  ],
  spare: [
    ...[84, 88, 91, 96].map((midi, i) => ({ midi, wave: 'sine', length: 0.3, volume: 0.03, delay: i * 0.07 })),
    { noise: 'highpass', frequency: 6000, q: 0.7, length: 0.4, volume: 0.012, attack: 0.1 },
  ],
  flee: [0, 0.07, 0.14, 0.21, 0.28].map((delay, i) => ({ noise: 'bandpass', frequency: 1400 + (i % 2) * 400, q: 2, length: 0.035, volume: 0.11 - i * 0.015, delay })),
  // --- The older battle moves (added 8 November 2026, d): every SPELL in
  // the party's lists and every one of the hero's spells now makes a sound
  // (which one is in src/audio/moveSounds.js). The ones that are something
  // real (cloth, wood, a hatchet, marbles, rain, a fire) are real
  // recordings in assets/audio/sfx/ (Kenney's CC0 "RPG Audio" and "Impact
  // Sounds", and the game's own CC0 rain and public-domain fire, see
  // assets/audio/samples/README.md); the magic is made here.
  // Ves's umbrella snapped shut: the silk folding, the ribs clicking home.
  umbrellaShut: [{ clip: 'umbrellaShut', volume: 0.5 }],
  // Ves's coat held up (COVER), and someone diving into leaves (HIDE).
  coat: [{ clip: 'coat', volume: 0.55 }],
  rustle: [{ clip: 'rustle', volume: 0.55 }],
  // BRACE and HOLD FAST: feet planted, the umbrella's catch set.
  brace: [{ clip: 'brace', volume: 0.55 }, { noise: 'lowpass', frequency: 300, q: 0.7, length: 0.2, volume: 0.12 }],
  // STAND FIRM and I'VE GOT YOU: two heavy steps forward.
  standFirm: [{ clip: 'standFirm', volume: 0.5 }],
  // Rain called down (RAIN DANCE, MONSOON, DOWNPOUR): a gust of real rain.
  rainBurst: [{ clip: 'rainBurst', volume: 0.45 }, { midi: 76, wave: 'sine', length: 0.5, volume: 0.025, delay: 0.1 }, { midi: 83, wave: 'sine', length: 0.6, volume: 0.02, delay: 0.25 }],
  // FIRESIDE: a fire catching, and a warm chord under it.
  fireside: [{ clip: 'fireFlare', volume: 0.5 }, ...[57, 64, 69, 73].map((midi, i) => ({ midi, wave: 'triangle', length: 0.9, volume: 0.035, attack: 0.15, delay: 0.1 + i * 0.05 }))],
  // FLURRY (and the hero's Hush): snow, soft and slow, glinting.
  flurry: [
    { noise: 'highpass', frequency: 3500, q: 0.6, length: 0.9, volume: 0.06, attack: 0.35 },
    ...[93, 98, 91, 96].map((midi, i) => ({ midi, wave: 'sine', length: 0.25, volume: 0.03, delay: 0.1 + i * 0.17 })),
  ],
  // SLEET and HAILSTORM: a sting of ice, the hiss and the ticks of it landing.
  sleet: [
    { noise: 'highpass', frequency: 2400, q: 0.8, length: 0.45, volume: 0.13, sweep: 1.6, attack: 0.04 },
    ...[0.1, 0.16, 0.21, 0.29, 0.34, 0.42].map((delay, i) => ({ noise: 'bandpass', frequency: 4200 + (i % 3) * 600, q: 6, length: 0.025, volume: 0.12, delay })),
  ],
  // ZEPHYR and COOL CHANGE: a warm wind swelling, and a chime in it.
  zephyr: [
    { noise: 'bandpass', frequency: 500, q: 0.9, length: 0.9, volume: 0.14, sweep: 2.2, attack: 0.35 },
    { midi: 79, wave: 'sine', length: 0.6, volume: 0.035, delay: 0.3 },
    { midi: 86, wave: 'sine', length: 0.7, volume: 0.03, delay: 0.45 },
  ],
  // UPDRAFT, BILLOW: the umbrella flung open, and the wind rising under it.
  updraft: [{ clip: 'umbrella', volume: 0.45 }, { noise: 'bandpass', frequency: 400, q: 1, length: 0.7, volume: 0.13, sweep: 3, attack: 0.2, delay: 0.08 }],
  // HEADWIND: the air going thick: a low wind leaning in.
  headwind: [{ noise: 'lowpass', frequency: 420, q: 1.2, length: 1, volume: 0.2, sweep: 0.7, attack: 0.3 }, { midi: 43, wave: 'sine', length: 0.9, volume: 0.05, attack: 0.3, slide: -2 }],
  // DOWNDRAFT, WINDSHEAR: the wind brought down hard (a swoop down, a thump).
  downdraft: [
    { noise: 'bandpass', frequency: 2400, q: 1.2, length: 0.35, volume: 0.13, sweep: 0.2, attack: 0.05 },
    { midi: 40, wave: 'sine', length: 0.3, volume: 0.16, slide: -8, delay: 0.3 },
  ],
  windshear: [
    { noise: 'bandpass', frequency: 1800, q: 2, length: 0.25, volume: 0.14, sweep: 2.4, attack: 0.02 },
    { midi: 88, wave: 'sawtooth', length: 0.08, volume: 0.025, slide: -24, delay: 0.12 },
  ],
  // THUNDERCLAP, SUPERCELL: the umbrella cracking open like thunder.
  thunderclap: [
    { noise: 'lowpass', frequency: 1600, q: 0.7, length: 0.35, volume: 0.32 },
    { noise: 'lowpass', frequency: 160, q: 1, length: 1.2, volume: 0.3, attack: 0.05, delay: 0.05 },
    { midi: 31, wave: 'sine', length: 0.8, volume: 0.12, slide: -5 },
  ],
  // WHITEOUT, CYCLONE, HURRICANE, WHIRL: everything going round.
  whiteout: [0, 0.22, 0.44].map((delay, i) => ({ noise: 'bandpass', frequency: 500 + i * 250, q: 1, length: 0.6, volume: 0.14, sweep: 2.4, attack: 0.25, delay })),
  // AURORA, DAYBREAK, CLEAR SKIES: light pouring down, a bright chord opening.
  aurora: [74, 78, 81, 86, 90].map((midi, i) => ({ midi, wave: 'sine', length: 1 - i * 0.08, volume: 0.04, attack: 0.08, delay: i * 0.09 })),
  // SHEET LIGHTNING (and the hero's Chain, Spark): a crackle jumping across.
  zap: [
    { midi: 88, wave: 'sawtooth', length: 0.05, volume: 0.04, slide: -12 },
    { noise: 'highpass', frequency: 3000, q: 1, length: 0.12, volume: 0.12 },
    { midi: 84, wave: 'square', length: 0.04, volume: 0.035, slide: -14, delay: 0.09 },
    { noise: 'highpass', frequency: 3600, q: 1, length: 0.09, volume: 0.1, delay: 0.1 },
  ],
  // STILL AIR (and the hero's Soothe): the wind just stopping, and a hush.
  stillAir: [
    { noise: 'bandpass', frequency: 700, q: 0.8, length: 0.7, volume: 0.13, sweep: 0.3 },
    { midi: 69, wave: 'sine', length: 1.1, volume: 0.04, attack: 0.3, delay: 0.4 },
    { midi: 76, wave: 'sine', length: 1, volume: 0.03, attack: 0.3, delay: 0.5 },
  ],
  // CALL OUT: Ves shouting a warning, two sharp notes (as LOOK OUT!).
  // Bramble's HOLLER and WAR CRY: a gruff shout, all breath.
  holler: [
    { noise: 'bandpass', frequency: 750, q: 3, length: 0.35, volume: 0.2, sweep: 1.3, attack: 0.03 },
    { midi: 50, wave: 'sawtooth', length: 0.32, volume: 0.03, slide: 3, attack: 0.03 },
  ],
  // WAR CRY: his hatchet banged on a stump, twice, and the shout.
  warCry: [{ clip: 'woodKnock', volume: 0.5 }, { noise: 'bandpass', frequency: 750, q: 3, length: 0.3, volume: 0.17, sweep: 1.3, attack: 0.03, delay: 0.45 }],
  // CHOP, FELL, SPLINTERS, THE BIG ONE: his hatchet biting in.
  chopHit: [{ clip: 'chopHit', volume: 0.55 }],
  splinters: [0, 0.14, 0.3].map((delay) => ({ clip: 'chopHit', volume: 0.45, delay })),
  bigOne: [{ noise: 'bandpass', frequency: 600, q: 1, length: 0.5, volume: 0.12, sweep: 2.5, attack: 0.4 }, { clip: 'chopHit', volume: 0.6, delay: 0.45 }, { midi: 33, wave: 'sine', length: 0.4, volume: 0.15, slide: -8, delay: 0.47 }],
  // TIMBER!: a trunk creaking, going, and coming down.
  timber: [{ clip: 'timber', volume: 0.55 }],
  // BISCUIT: a rummage in a pocket.
  biscuit: [{ clip: 'rummage', volume: 0.6 }],
  // SLINGSHOT: the elastic's twang, and plink.
  slingshot: [{ midi: 62, wave: 'triangle', length: 0.12, volume: 0.06, slide: 7 }, { clip: 'conker', volume: 0.5, delay: 0.16 }],
  // CONKERS: a conker whirled and let go, again and again.
  conkers: [0, 0.16, 0.3, 0.46].map((delay, i) => ({ clip: 'conker', volume: 0.5 - i * 0.05, delay })),
  // MARBLES: a pocketful across the floor.
  marbles: [{ clip: 'marbles', volume: 0.5 }],
  // WHISTLE: two fingers in, one short, sharp whistle.
  whistleShort: [{ midi: 91, wave: 'sine', length: 0.32, volume: 0.075, slide: 3 }, { midi: 94, wave: 'sine', length: 0.25, volume: 0.06, slide: -2, delay: 0.3 }],
  // COUNT TO TEN: a big breath in, and out.
  breath: [
    { noise: 'bandpass', frequency: 1200, q: 0.8, length: 0.6, volume: 0.1, sweep: 1.4, attack: 0.4 },
    { noise: 'bandpass', frequency: 900, q: 0.8, length: 0.9, volume: 0.09, sweep: 0.6, attack: 0.05, delay: 0.65 },
  ],
  // CANNONBALL: a run up and SPLASH.
  cannonball: [{ clip: 'paddle', volume: 0.5 }, { clip: 'tideRush', volume: 0.25, delay: 0.02 }],
  // HAND UP: a rope thrown and hauled on.
  rope: [{ clip: 'rope', volume: 0.55 }],
  // THREE CHEERS and SING-ALONG: hip hip (three rising cheers), and a tune.
  cheers: [0, 0.32, 0.64].map((delay, i) => ({ noise: 'bandpass', frequency: 900 + i * 150, q: 2.5, length: 0.22, volume: 0.16, sweep: 1.5, attack: 0.03, delay })),
  singAlong: [67, 69, 71, 74, 71, 72].map((midi, i) => ({ midi, wave: 'triangle', length: 0.18, volume: 0.05, delay: i * 0.16 })),
  // The hero's calming spells. LULL: a few soft falling notes, like a
  // lullaby; PACIFY: a gentle chord settling; SERENADE: a little tune.
  lull: [84, 81, 77, 74].map((midi, i) => ({ midi, wave: 'sine', length: 0.4, volume: 0.05, delay: i * 0.16 })),
  pacify: [
    ...[65, 69, 72].map((midi, i) => ({ midi, wave: 'triangle', length: 1, volume: 0.04, attack: 0.1, delay: i * 0.06 })),
    { midi: 77, wave: 'sine', length: 1.1, volume: 0.03, attack: 0.2, delay: 0.25 },
  ],
  serenade: [72, 76, 79, 77, 76, 72].map((midi, i) => ({ midi, wave: 'sine', length: 0.24, volume: 0.05, delay: i * 0.17 })),
  // LOW WATER and UNDERTOW: the tide going out (a real wave, slowed).
  lowWater: [{ clip: 'tideRush', volume: 0.35 }],
  // The hero's attack spells, as they're cast (the hit lands after).
  ember: [{ clip: 'fireFlare', volume: 0.45 }, { midi: 45, wave: 'sawtooth', length: 0.5, volume: 0.04, slide: 12 }],
  comet: [{ noise: 'bandpass', frequency: 3000, q: 1, length: 0.5, volume: 0.12, sweep: 0.25, attack: 0.05 }, { midi: 36, wave: 'sine', length: 0.45, volume: 0.16, slide: -9, delay: 0.45 }],
  starfall: [96, 93, 91, 88, 84].map((midi, i) => ({ midi, wave: 'sine', length: 0.2, volume: 0.04, delay: i * 0.07 })),
  siphon: [{ midi: 60, wave: 'triangle', length: 0.6, volume: 0.05, slide: 12, attack: 0.4 }, { noise: 'bandpass', frequency: 900, q: 2, length: 0.6, volume: 0.08, sweep: 2, attack: 0.4 }],
  blade: [{ noise: 'bandpass', frequency: 2600, q: 1.5, length: 0.2, volume: 0.15, sweep: 0.4, attack: 0.02 }, { midi: 95, wave: 'triangle', length: 0.15, volume: 0.03, slide: -5, delay: 0.03 }],
  sunburst: [67, 71, 74, 79, 83].map((midi, i) => ({ midi, wave: 'triangle', length: 0.3, volume: 0.045, delay: i * 0.05 })),
  nova: [{ midi: 84, wave: 'sine', length: 0.6, volume: 0.05, slide: -12, attack: 0.2 }, { midi: 28, wave: 'sine', length: 1, volume: 0.2, slide: -4, delay: 0.25 }, { noise: 'lowpass', frequency: 900, q: 0.7, length: 0.8, volume: 0.2, delay: 0.25 }],
  brine: [{ clip: 'paddle', volume: 0.45 }, { clip: 'paddle', volume: 0.35, delay: 0.12 }],
  // Small sounds of a place, now and then over its ambience (AMBIENT_EXTRAS):
  // a bird calling somewhere off in the trees, a twig snapping far off in the
  // dark wood, a pebble skittering down in a cave, a frog in the fen, and the
  // boards of a warm room settling.
  birdCall: [
    { midi: 88, wave: 'sine', length: 0.16, volume: 0.02, slide: 2, attack: 0.03 },
    { midi: 84, wave: 'sine', length: 0.24, volume: 0.017, slide: -2, delay: 0.2, attack: 0.03 },
    { midi: 88, wave: 'sine', length: 0.12, volume: 0.012, slide: 2, delay: 0.62, attack: 0.02 },
    { midi: 84, wave: 'sine', length: 0.2, volume: 0.01, slide: -2, delay: 0.78, attack: 0.03 },
  ],
  twig: [
    { noise: 'bandpass', frequency: 2400, q: 3, length: 0.025, volume: 0.12 },
    { noise: 'bandpass', frequency: 1700, q: 3, length: 0.03, volume: 0.075, delay: 0.035 },
  ],
  pebble: [0, 0.09, 0.15, 0.26, 0.31].map((delay, i) => ({ noise: 'bandpass', frequency: 2600 - i * 250, q: 5, length: 0.02, volume: 0.13 - i * 0.02, delay })),
  frog: [
    { midi: 45, wave: 'square', length: 0.09, volume: 0.012, slide: 3 },
    { midi: 45, wave: 'square', length: 0.12, volume: 0.012, slide: 4, delay: 0.16 },
  ],
  settle: [
    { midi: 45, wave: 'sawtooth', length: 0.22, volume: 0.009, slide: 3, attack: 0.05 },
    { noise: 'bandpass', frequency: 700, q: 6, length: 0.25, volume: 0.06, sweep: 1.3, attack: 0.06 },
  ],
  // Voices: a tap every other letter as someone's words type out in the
  // text box (who gets which is in src/audio/voices.js). Kept plain and
  // grounded, not cute: a soft, low, short tone with a breath of noise on
  // its front edge, held a moment so it carries, and speakers told apart by
  // pitch alone, all within about two octaves. (Squeaky, buzzy, musical
  // blips made the game feel too whimsical.) Nudged a little each time (SFX_FEEL).
  voiceVes: [{ midi: 57, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1700, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceBramble: [{ midi: 60, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1900, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceKeeper: [{ midi: 45, wave: 'triangle', length: 0.06, hold: 0.018, volume: 0.08 }, { noise: 'bandpass', frequency: 1100, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceTaper: [{ midi: 55, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1500, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceHaddock: [{ midi: 43, wave: 'triangle', length: 0.055, hold: 0.018, volume: 0.085 }, { noise: 'bandpass', frequency: 1000, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceCorrie: [{ midi: 59, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1800, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceKing: [{ midi: 50, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1300, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceUsurper: [{ midi: 41, wave: 'triangle', length: 0.055, hold: 0.018, volume: 0.085 }, { noise: 'bandpass', frequency: 900, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceSmall: [{ midi: 62, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 2000, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceSqueak: [{ midi: 64, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 2200, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceSlow: [{ midi: 48, wave: 'triangle', length: 0.06, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1200, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceGruff: [{ midi: 45, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.085 }, { noise: 'bandpass', frequency: 1100, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceElder: [{ midi: 53, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1400, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceShop: [{ midi: 54, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1500, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceLow: [{ midi: 48, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1300, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceMid: [{ midi: 52, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1500, q: 1.2, length: 0.02, volume: 0.03 }],
  voiceHigh: [{ midi: 57, wave: 'triangle', length: 0.045, hold: 0.018, volume: 0.075 }, { noise: 'bandpass', frequency: 1700, q: 1.2, length: 0.02, volume: 0.03 }],
};

// How some sound effects behave each time they're played: `vary` (semitones)
// shifts each one a little up or down and a little softer or louder, so ones
// heard over and over don't grate; `gap` (seconds) is the least time between
// two of it; `pan` throws it a random way, left or right, up to that far.
const SFX_FEEL = {
  stepDirt: { vary: 2, gap: 0.08 },
  stepStone: { vary: 2, gap: 0.08 },
  stepWood: { vary: 2, gap: 0.08 },
  stepGrass: { vary: 2, gap: 0.08 },
  stepLeaves: { vary: 3, gap: 0.08 },
  stepSnow: { vary: 2, gap: 0.08 },
  stepSand: { vary: 2, gap: 0.08 },
  stepWet: { vary: 2, gap: 0.08 },
  stepShingle: { vary: 2.5, gap: 0.08 },
  stepRock: { vary: 1.5, gap: 0.08 },
  stepPaving: { vary: 1.5, gap: 0.08 },
  stepCrystal: { vary: 1.5, gap: 0.08 },
  stepGravel: { vary: 1.5, gap: 0.08 },
  stepDirtReal: { vary: 1.5, gap: 0.08 },
  stepPlanks: { vary: 1.5, gap: 0.08 },
  stepTrestle: { vary: 1.5, gap: 0.08 },
  stepRug: { vary: 1.5, gap: 0.08 },
  stepMoss: { vary: 1.5, gap: 0.08 },
  stepAsh: { vary: 1.5, gap: 0.08 },
  stepMeadow: { vary: 1.5, gap: 0.08 },
  stepWade: { vary: 1.5, gap: 0.08 },
  crowdCheer: { vary: 0.6 },
  paddle: { vary: 2, pan: 0.3 },
  sidestep: { vary: 1 },
  notch: { vary: 1 },
  shake: { vary: 1 },
  jump: { vary: 1, gap: 0.1 },
  land: { vary: 1.5, gap: 0.1 },
  bump: { vary: 1, gap: 0.45 },
  coins: { vary: 0.5, gap: 0.1 },
  pouch: { vary: 1.5, gap: 0.1 },
  pack: { vary: 1, gap: 0.1 },
  textOpen: { vary: 0.5, gap: 0.08 },
  page: { vary: 1, gap: 0.05 },
  lever: { vary: 0.5 },
  voiceVes: { vary: 0.4, gap: 0.04 },
  voiceBramble: { vary: 0.4, gap: 0.035 },
  voiceKeeper: { vary: 0.4, gap: 0.05 },
  voiceTaper: { vary: 0.4, gap: 0.04 },
  voiceHaddock: { vary: 0.4, gap: 0.045 },
  voiceCorrie: { vary: 0.4, gap: 0.05 },
  voiceKing: { vary: 0.4, gap: 0.04 },
  voiceUsurper: { vary: 0.4, gap: 0.05 },
  voiceSmall: { vary: 0.4, gap: 0.035 },
  voiceSqueak: { vary: 0.4, gap: 0.035 },
  voiceSlow: { vary: 0.4, gap: 0.07 },
  voiceGruff: { vary: 0.4, gap: 0.04 },
  voiceElder: { vary: 0.4, gap: 0.045 },
  voiceShop: { vary: 0.4, gap: 0.04 },
  voiceLow: { vary: 0.4, gap: 0.04 },
  voiceMid: { vary: 0.4, gap: 0.04 },
  voiceHigh: { vary: 0.4, gap: 0.04 },
  birdCall: { vary: 3, pan: 0.8 },
  twig: { vary: 3, pan: 0.9 },
  pebble: { vary: 3, pan: 0.8 },
  frog: { vary: 2, pan: 0.8 },
  settle: { vary: 3, pan: 0.6 },
};

// Which footstep for each kind of ground (see groundUnder in
// src/overworld/footfall.js). Ground not here makes no sound.
const FOOTSTEPS = {
  dust: 'stepDirt', floor: 'stepStone', block: 'stepStone', boards: 'stepWood', bridge: 'stepWood', duckboards: 'stepWood',
  grass: 'stepGrass', leaves: 'stepLeaves', snow: 'stepSnow', sand: 'stepSand', shallows: 'stepWet', bog: 'stepWet',
  shingle: 'stepShingle',
  // Chapter 4's grounds (added 9 November 2026), all real recordings.
  rock: 'stepRock', paving: 'stepPaving', crystal: 'stepCrystal', gravel: 'stepGravel', dirt: 'stepDirtReal',
  planks: 'stepPlanks', trestle: 'stepTrestle', rug: 'stepRug', moss: 'stepMoss', ash: 'stepAsh',
  meadow: 'stepMeadow', wade: 'stepWade',
};

// The small sounds a place makes now and then over its ambience, by ambience
// name: one of these every 20 to 50 seconds or so.
const AMBIENT_EXTRAS = {
  mountain: ['birdCall'], village: ['birdCall'], forest: ['birdCall', 'birdCall', 'twig'], meadow: ['birdCall'],
  hushwood: ['twig'], hush: ['twig'],
  marsh: ['frog'],
  cave: ['pebble'], mine: ['pebble'], sea_cave: ['pebble'], cliff_cave: ['pebble'],
  mine_quiet: ['pebble'], mine_flooded: ['pebble'], deep_stair: ['pebble'],
  hearth: ['settle'], belowtown_inn: ['settle'], inn: ['settle'], calm_inn: ['settle'], beach_inside: ['settle'], drowned_house: ['settle'], calm_drowned_house: ['settle'], calm_shed: ['settle'],
};

// Jingles the music dips under so they're heard (the song comes back after):
// how far down it goes (a share of its volume) and for how long (seconds).
const DUCKS = {
  starGet: { depth: 0.2, seconds: 2.2 },
  heal: { depth: 0.7, seconds: 0.5 },
  save: { depth: 0.55, seconds: 1 },
  pickup: { depth: 0.6, seconds: 0.6 },
  chest: { depth: 0.55, seconds: 1 },
};
// A recorded line of speech (voice()): how loud it plays (the recordings are
// all levelled the same, -16 LUFS, by notes/voice-preview/process.py), and
// how far the music dips under it while it plays. That puts a line about 9 dB
// over his typing blips, 8 to 12 dB over his hall and fight songs, and still
// just over No Strings at its loudest.
const VOICE_LEVEL = 0.85;
const VOICE_DUCK = 0.55;

// Sound effects that are part of the place rather than something you did (a
// crowd cheering): they play with the music and the ambience, at the music's
// volume, and dip under a line of speech like the music does.
const PLACE_SOUNDS = new Set(['crowdCheer']);

// The sound effect names, for the Studio's pickers.
export const SOUND_NAMES = [...Object.keys(SFX), 'farCheer'];

// --- Echo: sounds in the world ring a little in a cave or a hull. ---
// A room's `echo` flag ('cave', 'cavern', 'tunnel', 'pocket', 'hull', or
// false for none) says how it rings;
// left out, it goes by the room's ambience (ECHO_BY_AMBIENCE). Only the
// sounds of things in the world ring (footsteps, doors, levers, chests,
// splashes: ECHOED), never the menus or the words; and only while a place's
// ambience is playing, so battles and menus are dry. Kept subtle: a short
// tail under the sound, never a second copy of it.
//   cave  a long, dark tail off rock (about a second and a half)
//   hull  a short, boxy ring off iron plates, with a few hard early reflections
// Added 9 November 2026, for chapter 4's caves of every size:
//   cavern  a huge space (the Stillwater, the bottom of the Deep, the Landing):
//           a long, soft, dark tail, near three seconds
//   tunnel  a narrow drift or a cut stair: a short ring and a few quick
//           reflections off the near walls
//   pocket  a hollow the size of a cupboard: a tight, bright little ring
const ECHOES = {
  cave: { seconds: 1.6, decay: 3.2, tone: 2600, wet: 0.2, early: [] },
  cavern: { seconds: 2.9, decay: 1.8, tone: 2000, wet: 0.24, early: [] },
  tunnel: { seconds: 0.9, decay: 5.2, tone: 2400, wet: 0.17, early: [0.009, 0.018, 0.029] },
  pocket: { seconds: 0.45, decay: 9, tone: 3200, wet: 0.13, early: [0.004, 0.008, 0.013] },
  hull: { seconds: 0.7, decay: 5, tone: 1800, wet: 0.16, early: [0.011, 0.023, 0.037, 0.052] },
};
const ECHO_BY_AMBIENCE = {
  cave: 'cave', sea_cave: 'cave', cliff_cave: 'cave', mine: 'cave', lake: 'cave', deep: 'cave', crystal: 'cave',
  crystal_falls: 'cavern', mine_quiet: 'tunnel', mine_flooded: 'cave', lake_hall: 'cavern', deep_stair: 'tunnel',
  deep_fire: 'cave', root_waking: 'cavern', lake_jetty: 'cavern',
  hulk_storm: 'hull', calm_hulk: 'hull', ghost_ship: 'hull', ghost_ship_deep: 'hull',
};
const ECHO_PREFIXES = ['step', 'door'];
const ECHOED = new Set([
  'jump', 'land', 'bump', 'shipGroan', 'chest', 'storage', 'pouch', 'pack', 'coins', 'lever', 'push', 'splash', 'creak', 'clack', 'click',
  'crumble', 'chop', 'thunk', 'thud', 'gangwayThump', 'pebble', 'squeak', 'flutter', 'scuttle', 'pounce', 'hook', 'paddle', 'splashes', 'whistle', 'settle',
]);
const echoes = (name) => ECHOED.has(name) || ECHO_PREFIXES.some((start) => name.startsWith(start));

// The ring of a room, as an impulse response: noise dying away, darkened,
// with a hull's hard early reflections at the front.
function echoResponse(ctx, { seconds, decay, tone, early }) {
  const length = Math.round(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let low = 0;
    const smooth = Math.exp((-2 * Math.PI * tone) / ctx.sampleRate);
    for (let i = 0; i < length; i++) {
      const t = i / ctx.sampleRate;
      // A one-pole lowpass on the noise: rock and iron swallow the top.
      low = low * smooth + (Math.random() * 2 - 1) * (1 - smooth);
      data[i] = low * Math.exp(-decay * t) * Math.min(1, t / 0.008);
    }
    for (const [k, at] of early.entries()) {
      const i = Math.round((at + channel * 0.003) * ctx.sampleRate);
      if (i < length) data[i] += 0.5 / (k + 1);
    }
  }
  return buffer;
}

// A crowd cheering a very long way off (the light going up the root): a real
// crowd cheering (assets/audio/under/cheerFar.ogg, cut from two public-domain
// recordings: see assets/audio/samples/README.md), heard through a great deal
// of rock: darkened, and swelling and dying away in a big soft hall of echo.
// Quiet. Until it has loaded, the made one below.
function farCheer(ctx, noise, bus) {
  loadRecording(ctx, 'assets/audio/under/cheerFar.ogg').then((buffer) => {
    if (!buffer) {
      madeFarCheer(ctx, noise, bus);
      return;
    }
    const now = ctx.currentTime;
    const hall = makeHall(ctx, 2.4);
    hall.connect(bus);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = 0.94;
    const far = ctx.createBiquadFilter();
    far.type = 'lowpass';
    far.frequency.value = 1100;
    const swell = ctx.createGain();
    swell.gain.setValueAtTime(0.0001, now);
    swell.gain.exponentialRampToValueAtTime(0.11, now + 1);
    swell.gain.setTargetAtTime(0.0001, now + buffer.duration * 0.7, 0.7);
    const dry = ctx.createGain();
    dry.gain.value = 0.3;
    source.connect(far).connect(swell);
    swell.connect(hall);
    swell.connect(dry).connect(bus);
    source.start(now);
  });
}

// The made far cheer: lots of small voices, a breath of filtered noise,
// swelling and dying away in a big soft hall of echo.
function madeFarCheer(ctx, noise, bus) {
  const now = ctx.currentTime;
  const seconds = 3.2;
  const hall = makeHall(ctx, 2.4);
  const wet = ctx.createGain();
  wet.gain.value = 1;
  hall.connect(wet).connect(bus);
  const swell = ctx.createGain();
  swell.gain.setValueAtTime(0.0001, now);
  swell.gain.exponentialRampToValueAtTime(0.5, now + 1.1);
  swell.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
  swell.connect(hall);
  // The roar of many people: noise through a vowelly band.
  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 900;
  band.Q.value = 1.4;
  const body = ctx.createGain();
  body.gain.value = 0.05;
  source.connect(band).connect(body).connect(swell);
  source.start(now);
  source.stop(now + seconds + 0.1);
  // A scatter of small voices, each a little wobbly whoop that rises.
  for (let i = 0; i < 16; i++) {
    const start = now + 0.1 + Math.random() * 1.6;
    const length = 0.35 + Math.random() * 0.6;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const pitch = 330 + Math.random() * 420;
    osc.frequency.setValueAtTime(pitch, start);
    osc.frequency.exponentialRampToValueAtTime(pitch * (1.1 + Math.random() * 0.3), start + length * 0.7);
    const vowel = ctx.createBiquadFilter();
    vowel.type = 'bandpass';
    vowel.frequency.value = 700 + Math.random() * 700;
    vowel.Q.value = 3;
    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0.0001, start);
    voice.gain.exponentialRampToValueAtTime(0.012, start + length * 0.3);
    voice.gain.exponentialRampToValueAtTime(0.0001, start + length);
    osc.connect(vowel).connect(voice).connect(swell);
    osc.start(start);
    osc.stop(start + length + 0.05);
  }
}

const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

const MASTER_VOLUME = 0.5;
// How far ahead notes are booked. With the bigger 'playback' sound buffers
// (see unlock) and a busy frame now and then (a room loading), 0.12 s could
// run out and notes landed late: a stutter. A quarter second rides those out.
const LOOKAHEAD_SECONDS = 0.25;
const TICK_MS = 25;
const FADE_SECONDS = 0.4;
const MUTE_KEY = 'KeyM';

// Flattens a song's sections (in order) into one list of steps, each holding
// the notes and drum hits that start on it. Exported for the tools, which use
// it to check a song for mistakes without playing it.
export function compile(song) {
  const steps = [];
  let loopStart = 0;
  // Where each section begins (a scene can start a song part way in).
  const starts = {};
  // A song's `coda` (added 11 November 2026, for Quire's song): section names
  // that come after the loop, never part of it. Only a scene or a fight asking
  // for one by name (`from`) gets there; it plays once and rings out. The loop
  // goes round at `loopEnd`, where the coda begins.
  let loopEnd = 0;

  [...song.order, ...(song.coda ?? [])].forEach((name, orderIndex) => {
    if (orderIndex === (song.loopFrom ?? 0)) loopStart = steps.length;
    if (orderIndex === song.order.length) loopEnd = steps.length;
    starts[name] ??= steps.length;
    const section = song.sections[name];
    if (!section) throw new Error(`${song.title}: no section called '${name}'`);

    const tracks = Object.entries(section);
    const [firstTrack, firstEvents] = tracks[0];
    for (const [track, events] of tracks) {
      if (!song.instruments[track]) throw new Error(`${song.title}: no instrument for track '${track}'`);
      if (events.length !== firstEvents.length) {
        throw new Error(`${song.title}, section ${name}: '${track}' is ${events.length} steps but '${firstTrack}' is ${firstEvents.length}`);
      }
    }

    for (let i = 0; i < firstEvents.length; i++) {
      const starting = [];
      for (const [track, events] of tracks) {
        const event = events[i];
        const drum = Boolean(song.instruments[track].drum);
        if (typeof event === 'number' && drum) throw new Error(`${song.title}, section ${name}: '${track}' is a drum but has a note at step ${i}`);
        if (event === HIT && !drum) throw new Error(`${song.title}, section ${name}: '${track}' plays notes but has a drum hit ('x') at step ${i}`);
        if (typeof event === 'number') {
          let length = 1;
          while (events[i + length] === HOLD) length++;
          starting.push({ track, midi: event, length });
        } else if (event === HIT) {
          starting.push({ track });
        }
      }
      steps.push(starting);
    }
  });

  if (!song.coda?.length) loopEnd = steps.length;
  return { steps, loopStart, loopEnd, starts };
}

function makeNoise(ctx) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// Custom waveforms from a list of harmonic strengths (1st, 2nd, 3rd...), for
// richer tones like piano, choir and bells. Made once per sound and reused.
const periodicWaves = new WeakMap();
function periodicWave(ctx, harmonics) {
  if (!periodicWaves.has(ctx)) periodicWaves.set(ctx, new Map());
  const cache = periodicWaves.get(ctx);
  const key = harmonics.join(',');
  if (!cache.has(key)) {
    const real = new Float32Array(harmonics.length + 1);
    const imag = new Float32Array([0, ...harmonics]);
    cache.set(key, ctx.createPeriodicWave(real, imag));
  }
  return cache.get(key);
}

// Plays one note. Besides the basics (wave, volume, envelope, gate, vibrato),
// an instrument can have:
//   voices     layered oscillators [{ wave, harmonics, detune (cents), octave, level }],
//              detuned against each other for a full section of strings or brass
//   harmonics  a custom waveform (see periodicWave) instead of `wave`
//   sweep      { from, to, time, q }: a lowpass that opens as the note starts (brass)
//   bend       { cents, time }: starts sharp and slides onto the note (timpani)
//   click      a little burst of noise at the start, this loud (a hammer, a bow)
//   breath     { level, frequency, q }: air or bow noise under the whole note (flute, violin)
// A vibrato can have a `delay` (seconds): it blooms in after the note starts,
// the way a real player's does.
function playTone(ctx, channel, instrument, midi, time, seconds, noise) {
  const {
    wave = 'square', volume, attack = 0.005, decay = 0.1, sustain = 0.7, release = 0.08, gate = 0.9,
    vibrato, voices, harmonics, sweep, bend, click, breath,
  } = instrument;
  const end = time + seconds * gate;
  const stopAt = end + release * 2 + 0.05;

  // A note shorter than its attack only swells part of the way before it
  // lets go (otherwise the release would land inside the ramp, and the
  // note would swell up after it ended, never fade, and click off).
  const envelope = ctx.createGain();
  const attackEnd = Math.min(time + attack, end);
  const reached = attack > 0 ? volume * Math.min(1, (attackEnd - time) / attack) : volume;
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(reached, attackEnd);
  if (attackEnd < end) envelope.gain.setTargetAtTime(volume * sustain, attackEnd, decay);
  envelope.gain.setTargetAtTime(0, end, release / 3);
  envelope.connect(channel);

  let input = envelope;
  if (sweep) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = sweep.q ?? 1;
    filter.frequency.setValueAtTime(sweep.from, time);
    filter.frequency.exponentialRampToValueAtTime(sweep.to, time + sweep.time);
    filter.connect(envelope);
    input = filter;
  }

  const layers = voices ?? [{ wave, harmonics, level: 1 }];
  for (const layer of layers) {
    const osc = ctx.createOscillator();
    const shape = layer.harmonics ?? (voices ? null : harmonics);
    if (shape) osc.setPeriodicWave(periodicWave(ctx, shape));
    else osc.type = layer.wave ?? wave;
    osc.frequency.value = 440 * 2 ** ((midi + 12 * (layer.octave ?? 0) - 69) / 12);
    const detune = layer.detune ?? 0;
    osc.detune.setValueAtTime(detune + (bend?.cents ?? 0), time);
    if (bend) osc.detune.linearRampToValueAtTime(detune, time + bend.time);
    const level = ctx.createGain();
    level.gain.value = layer.level ?? 1 / layers.length;
    osc.connect(level).connect(input);

    if (vibrato) {
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = vibrato.rate;
      depth.gain.setValueAtTime(vibrato.delay ? 0 : vibrato.depth, time);
      if (vibrato.delay) depth.gain.linearRampToValueAtTime(vibrato.depth, time + vibrato.delay);
      lfo.connect(depth).connect(osc.detune);
      lfo.start(time);
      lfo.stop(stopAt);
    }
    osc.start(time);
    osc.stop(stopAt);
  }

  if (breath && noise) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const level = ctx.createGain();
    source.buffer = noise;
    source.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = breath.frequency ?? 1800;
    filter.Q.value = breath.q ?? 1;
    level.gain.value = breath.level;
    source.connect(filter).connect(level).connect(input);
    source.start(time, Math.random() * 0.5);
    source.stop(stopAt);
  }

  if (click && noise) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    gain.gain.setValueAtTime(volume * click, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
    source.connect(filter).connect(gain).connect(channel);
    source.start(time);
    source.stop(time + 0.04);
  }
}

// --- Real instruments: recordings from assets/audio/samples/ (see
// sampleSets.js). An instrument with `sample: 'violins'` plays them instead of
// a synth. Notes between the recorded ones play the nearest one, retuned. Its
// own settings:
//   volume     as for a synth
//   attack     seconds to fade in (default: none, the recording's own attack)
//   release    seconds to fade out after the note ends (default 0.25)
//   ring       true to let every note ring out to the end of its recording
//              (a piano with the pedal down, a harp, drums), ignoring its length
//   offset     seconds to skip at the start of each recording (a slow bow)
//   octave     plays everything this many octaves up or down
//   muffle     a lowpass at this many Hz: dampened, far off (800 is behind a wall)
// Added 11 November 2026, for the ghost ship, where the tunes are remembered
// wrong; a recording can be played out of tune:
//   detune     cents, on every note (a music box gone flat: -25)
//   drift      up to this many cents off, at random, a different amount each note
//   wow        { cents, rate (Hz) }: the pitch wavers slowly up and down, like a
//              warped music box or an old cylinder
//   sag        cents the note sinks by over its written length (a voice giving
//              up on a note; a spring running down)
// An unpitched set (a drum, a cymbal) goes on a drum track: give it
// `drum: 'sample'` and write its hits with 'x'.
const SAMPLE_ROOT = new URL('../../assets/audio/samples/', import.meta.url);
const sampleBuffers = new WeakMap();

const sampleSetsIn = (song) => [...new Set(Object.values(song.instruments).map((i) => i.sample).filter(Boolean))];

// Loads (once per audio context) every recording a song needs. Resolves when
// they're ready; returns null if they already are, so playback can start
// straight away.
export function loadSamples(ctx, song) {
  if (!sampleBuffers.has(ctx)) sampleBuffers.set(ctx, { ready: new Map(), loading: new Map() });
  const cache = sampleBuffers.get(ctx);
  const needed = sampleSetsIn(song).filter((name) => !cache.ready.has(name));
  if (!needed.length) return null;
  return Promise.all(needed.map((name) => {
    if (!cache.loading.has(name)) {
      const set = SAMPLE_SETS[name];
      if (!set) throw new Error(`${song.title}: no sample set called '${name}'`);
      cache.loading.set(name, Promise.all(set.notes.map(async (midi) => {
        // Recordings are .ogg, unless an uploaded set says otherwise (`ext`).
        const file = `${midi}.${set.ext ?? 'ogg'}`;
        // A fetch the server drops is tried again a couple of times (15 Nov 2026).
        for (let attempt = 1; ; attempt++) {
          try {
            const response = await fetch(new URL(`${name}/${file}`, SAMPLE_ROOT));
            if (!response.ok) throw new Error(`Couldn't load the ${name} sample ${file}`);
            return [midi, await ctx.decodeAudioData(await response.arrayBuffer())];
          } catch (error) {
            if (attempt >= 3) throw error;
            await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
          }
        }
      })).then((buffers) => cache.ready.set(name, new Map(buffers)), (error) => {
        // A set that failed is forgotten, so the next song that wants it asks again. (Before,
        // the failed promise stayed in the cache: one dropped fetch left that instrument
        // silent in every song for the rest of the session.)
        cache.loading.delete(name);
        throw error;
      }));
    }
    return cache.loading.get(name);
  }));
}

// The recorded note nearest `midi` in a set.
function nearestNote(notes, midi) {
  return notes.reduce((best, note) => (Math.abs(note - midi) < Math.abs(best - midi) ? note : best), notes[0]);
}

// Plays one note (or, with no `midi`, one hit) from an instrument's recordings.
function playSample(ctx, channel, instrument, midi, time, seconds) {
  const buffers = sampleBuffers.get(ctx)?.ready.get(instrument.sample);
  if (!buffers) return;
  const { volume, attack = 0, release = 0.25, gate = 1, ring = false, offset = 0, octave = 0 } = instrument;
  const set = SAMPLE_SETS[instrument.sample];
  const note = midi == null ? set.notes[0] : nearestNote(set.notes, midi + 12 * octave);
  const buffer = buffers.get(note);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  if (midi != null) source.playbackRate.value = 2 ** ((midi + 12 * octave - note) / 12);
  // Out of tune (`detune`, `drift`, `sag`, `wow`: see above).
  const { detune = 0, drift = 0, sag = 0, wow = null } = instrument;
  const cents = detune + (drift ? (Math.random() * 2 - 1) * drift : 0);
  if (cents || sag) source.detune.setValueAtTime(cents, time);
  if (sag) source.detune.linearRampToValueAtTime(cents - sag, time + seconds);
  const gain = ctx.createGain();
  const length = (buffer.duration - offset) / source.playbackRate.value;
  // A note that lets go before its attack is done only swells part way
  // (as in playTone), so the release doesn't land inside the ramp.
  const end = time + seconds * gate;
  const attackEnd = ring ? time + attack : Math.min(time + attack, end);
  gain.gain.setValueAtTime(attack ? 0 : volume, time);
  if (attack) gain.gain.linearRampToValueAtTime(volume * Math.min(1, (attackEnd - time) / attack), attackEnd);
  let stopAt = time + length;
  if (!ring) {
    gain.gain.setTargetAtTime(0, end, release / 3);
    stopAt = Math.min(stopAt, end + release * 2 + 0.05);
  }
  // `muffle` (Hz): played through a lowpass, dampened, as if from behind a wall.
  if (instrument.muffle) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = instrument.muffle;
    filter.Q.value = 0.5;
    source.connect(filter).connect(gain).connect(channel);
  } else source.connect(gain).connect(channel);
  if (wow) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    // A little slower or quicker each note, so no two notes waver alike.
    lfo.frequency.value = wow.rate * (0.8 + Math.random() * 0.4);
    depth.gain.value = wow.cents;
    lfo.connect(depth).connect(source.detune);
    lfo.start(time);
    lfo.stop(stopAt);
  }
  source.start(time, offset);
  source.stop(stopAt);
}

const DRUMS = {
  // A sine wave that drops in pitch.
  kick(ctx, channel, noise, time, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain).connect(channel);
    osc.start(time);
    osc.stop(time + 0.2);
  },
  // A burst of filtered noise with a little body underneath.
  snare(ctx, channel, noise, time, volume) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    filter.type = 'highpass';
    filter.frequency.value = 1200;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
    source.connect(filter).connect(gain).connect(channel);
    source.start(time);
    source.stop(time + 0.15);

    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = 'triangle';
    body.frequency.value = 190;
    bodyGain.gain.setValueAtTime(volume * 0.6, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    body.connect(bodyGain).connect(channel);
    body.start(time);
    body.stop(time + 0.1);
  },
  // A longer, sizzling hi-hat for off-beats.
  openHat(ctx, channel, noise, time, volume) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
    source.connect(filter).connect(gain).connect(channel);
    source.start(time);
    source.stop(time + 0.17);
  },
  // A big orchestral bass drum: a deep, booming thud.
  boom(ctx, channel, noise, time, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(90, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.35);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);
    osc.connect(gain).connect(channel);
    osc.start(time);
    osc.stop(time + 0.95);
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const thud = ctx.createGain();
    source.buffer = noise;
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    thud.gain.setValueAtTime(volume * 0.8, time);
    thud.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    source.connect(filter).connect(thud).connect(channel);
    source.start(time);
    source.stop(time + 0.16);
  },
  // A crash cymbal, washing away for a couple of seconds.
  crash(ctx, channel, noise, time, volume) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    source.loop = true;
    filter.type = 'highpass';
    filter.frequency.value = 4500;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 2.2);
    source.connect(filter).connect(gain).connect(channel);
    source.start(time);
    source.stop(time + 2.3);
  },
  // A tiny tick of bright noise.
  hat(ctx, channel, noise, time, volume) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    source.connect(filter).connect(gain).connect(channel);
    source.start(time);
    source.stop(time + 0.05);
  },
};

// Lets go of `nodes` (disconnects them) once the sound engine's clock has
// passed `at`. An echo is a loop (a delay feeding itself), and a loop left
// connected keeps the sound engine working on it for ever, long after it has
// died away to nothing: left alone, every drip and pick in a cave added one
// more, until the sound crackled. (Checked against the clock, not just a
// timer, so a pause doesn't cut a tail short.)
function releaseAt(ctx, at, nodes) {
  const check = () => {
    if (ctx.state === 'closed') return;
    const left = at - ctx.currentTime;
    if (left > 0) {
      setTimeout(check, Math.max(100, left * 1000));
      return;
    }
    for (const node of nodes) node.disconnect();
  };
  setTimeout(check, Math.max(100, (at - ctx.currentTime) * 1000));
}

// How long an echo loop (`seconds` between repeats, each `keep` as loud)
// takes to fall 80 dB, to silence.
const echoSeconds = (seconds, keep) => seconds * Math.ceil(Math.log(1e-4) / Math.log(keep));

// A concert hall's reverb: a convolver with a few seconds of decaying noise.
function makeHall(ctx, seconds = 2.6) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  }
  const hall = ctx.createConvolver();
  hall.buffer = impulse;
  return hall;
}

// One channel per instrument, with an optional filter (to soften harsh waves),
// echo and `reverb` (how much goes into the hall), all into the song's bus.
function buildChannels(ctx, bus, instruments, graph = []) {
  const channels = {};
  let hall = null;
  for (const [name, instrument] of Object.entries(instruments)) {
    const channel = ctx.createGain();
    graph.push(channel);
    // `pan` places it left (-1) or right (1), like seats in an orchestra.
    let out = channel;
    if (instrument.pan) {
      out = ctx.createStereoPanner();
      out.pan.value = instrument.pan;
      channel.connect(out);
      graph.push(out);
    }
    // The channel's tone filter comes first, so its reverb and echo are
    // the filtered sound too (a muffled instrument has a muffled echo).
    if (instrument.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = instrument.filter.type;
      filter.frequency.value = instrument.filter.frequency;
      if (instrument.filter.q) filter.Q.value = instrument.filter.q;
      // A shelf or peaking filter's boost or cut, in dB (a piano brightened
      // with a treble shelf: { type: 'highshelf', frequency: 2500, gain: 5 }).
      if (instrument.filter.gain) filter.gain.value = instrument.filter.gain;
      out.connect(filter);
      out = filter;
      graph.push(filter);
    }
    out.connect(bus);
    if (instrument.reverb) {
      if (!hall) {
        hall = makeHall(ctx);
        hall.connect(bus);
        graph.push(hall);
      }
      const send = ctx.createGain();
      graph.push(send);
      send.gain.value = instrument.reverb;
      out.connect(send).connect(hall);
    }
    if (instrument.echo) {
      const delay = ctx.createDelay(2);
      const feedback = ctx.createGain();
      const wet = ctx.createGain();
      delay.delayTime.value = instrument.echo.time;
      feedback.gain.value = instrument.echo.feedback;
      wet.gain.value = instrument.echo.mix;
      out.connect(delay);
      delay.connect(feedback).connect(delay);
      delay.connect(wet).connect(bus);
      graph.push(delay, feedback, wet);
    }
    channels[name] = channel;
  }
  return channels;
}

// A song while it plays: schedules notes slightly ahead of time so they land
// exactly on the beat, and loops forever until stopped.
class SongPlayback {
  // `from`: the name of a section to start at, instead of the beginning.
  constructor(ctx, destination, noise, song, from = null) {
    this.ctx = ctx;
    this.noise = noise;
    this.song = song;
    this.bus = ctx.createGain();
    // A song can turn itself down (or up) as a whole with `volume`.
    this.bus.gain.value = song.volume ?? 1;
    this.bus.connect(songOutput(ctx, song, destination));
    // Every node of its mixing desk, to let go of when it stops.
    this.graph = [];
    this.channels = buildChannels(ctx, this.bus, song.instruments, this.graph);
    let starts;
    ({ steps: this.steps, loopStart: this.loopStart, loopEnd: this.loopEnd, starts } = compile(song));
    this.stepSeconds = 60 / song.bpm / song.stepsPerBeat;
    // (`from` can also be a step number: carrying on from the same place in
    // the song's indoor or outdoor twin, see MusicPlayer.start.)
    this.index = typeof from === 'number' ? (from < this.steps.length ? from : 0) : (from && starts[from]) || 0;
    this.ended = false;
    // Until it starts, it's at the very beginning (see songTime).
    this.startTime = Infinity;
    const begin = () => {
      if (this.stopped) return;
      this.nextTime = ctx.currentTime + 0.05;
      this.startTime = this.nextTime;
      this.timer = setInterval(() => this.schedule(), TICK_MS);
      this.schedule();
    };
    // A song with real instruments waits for their recordings to load (only
    // the first time); one without starts straight away.
    const loading = loadSamples(ctx, song);
    if (loading) {
      loading.catch((error) => {
        console.error(`${song.title}: couldn't load its instruments:`, error);
        // Start anyway, and keep asking for what's missing: each note looks its recording up as
        // it plays, so the instrument comes in as soon as the set arrives.
        const again = (left) => setTimeout(() => {
          if (this.stopped || left <= 0) return;
          loadSamples(ctx, song)?.catch(() => again(left - 1));
        }, 2500);
        again(4);
      }).then(begin);
    } else {
      begin();
    }
  }

  schedule() {
    const now = this.ctx.currentTime;
    // If the tab was in the background, skip ahead rather than playing a backlog.
    if (this.nextTime < now - 0.2) this.nextTime = now;
    while (!this.ended && this.nextTime < now + LOOKAHEAD_SECONDS) {
      for (const event of this.steps[this.index]) {
        try {
          this.play(event, this.nextTime);
        } catch (error) {
          // A broken note mustn't stop the music: skip it, and say so once.
          if (!this.warned) console.error(`${this.song.title}: skipped a note on '${event.track}':`, error);
          this.warned = true;
        }
      }
      this.nextTime += this.stepSeconds;
      // (In a coda, it runs on to the very end; before it, round at loopEnd.)
      const inCoda = this.index >= this.loopEnd;
      if (this.index + 1 < (inCoda ? this.steps.length : this.loopEnd)) this.index++;
      // A song with `loop: false` plays once, then lets its last notes ring
      // out; so does a coda.
      else if (this.song.loop === false || inCoda) this.ended = true;
      else this.index = this.loopStart;
    }
  }

  play(event, time) {
    let instrument = this.song.instruments[event.track];
    const channel = this.channels[event.track];
    // `humanize` { time, volume }: each note lands a touch late and a little
    // softer, at random, up to these amounts, like a person playing.
    const human = instrument.humanize;
    if (human) {
      time += Math.random() * (human.time ?? 0);
      instrument = { ...instrument, volume: instrument.volume * (1 - Math.random() * (human.volume ?? 0)) };
    }
    if (instrument.sample) playSample(this.ctx, channel, instrument, event.midi, time, (event.length ?? 1) * this.stepSeconds);
    else if (instrument.drum) DRUMS[instrument.drum](this.ctx, channel, this.noise, time, instrument.volume);
    else playTone(this.ctx, channel, instrument, event.midi, time, event.length * this.stepSeconds, this.noise);
  }

  stop() {
    this.stopped = true;
    clearInterval(this.timer);
    this.bus.gain.setTargetAtTime(0, this.ctx.currentTime, FADE_SECONDS / 3);
    // Once it has faded, let go of the whole song: its bus and every channel,
    // hall and echo loop (an echo loop left connected runs for ever).
    releaseAt(this.ctx, this.ctx.currentTime + FADE_SECONDS + 1, [this.bus, ...(this.graph ?? [])]);
  }
}

// Plays the first `seconds` of a song into an offline recording, without
// making a sound, and resolves with the AudioBuffer. For tests and tools
// Where a song's bus goes: straight out, or, for a song with `limit` (the
// trailers' songs), through a compressor that squashes its loudest moments,
// a gain that brings the rest up to meet them, and a soft clipper that
// rounds off whatever still pokes over, so the whole thing can be loud and
// dense without the hits ever clipping. The same for playing and for rendering.
function songOutput(ctx, song, destination) {
  if (!song.limit) return destination;
  const squash = ctx.createDynamicsCompressor();
  squash.threshold.value = -8;
  squash.knee.value = 4;
  squash.ratio.value = 8;
  squash.attack.value = 0.001;
  squash.release.value = 0.1;
  const makeup = ctx.createGain();
  makeup.gain.value = song.limit === true ? 1.2 : song.limit;
  // The clipper: a tanh curve over twice the full range (its input is
  // halved first), so a peak twice full scale still comes out just under 1.
  const half = ctx.createGain();
  half.gain.value = 0.5;
  const clip = ctx.createWaveShaper();
  const curve = new Float32Array(4097);
  for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(2.5 * ((i / (curve.length - 1)) * 2 - 1));
  clip.curve = curve;
  clip.oversample = '4x';
  squash.connect(makeup);
  makeup.connect(half);
  half.connect(clip);
  clip.connect(destination);
  return squash;
}

// (checking a song for errors, or how loud it gets).
export async function renderSong(song, seconds, sampleRate = 44100) {
  const ctx = new OfflineAudioContext(2, Math.ceil(sampleRate * seconds), sampleRate);
  await loadSamples(ctx, song);
  const master = ctx.createGain();
  master.gain.value = MASTER_VOLUME * (song.volume ?? 1);
  master.connect(songOutput(ctx, song, ctx.destination));
  const playback = Object.create(SongPlayback.prototype);
  Object.assign(playback, { ctx, song, noise: makeNoise(ctx), bus: master });
  playback.channels = buildChannels(ctx, master, song.instruments);
  ({ steps: playback.steps, loopStart: playback.loopStart, loopEnd: playback.loopEnd } = compile(song));
  playback.stepSeconds = 60 / song.bpm / song.stepsPerBeat;
  // (A song's coda is never rendered: it's only reached by name.)
  for (let time = 0, index = 0; time < seconds; time += playback.stepSeconds) {
    for (const event of playback.steps[index]) playback.play(event, time);
    if (index + 1 < playback.loopEnd) index++;
    // A song with `loop: false` plays once; the rest of the recording is its last notes ringing out.
    else if (song.loop === false) break;
    else index = playback.loopStart;
  }
  return ctx.startRendering();
}

// --- Ambience: the sounds of a place, under the music. ---
// A room asks for one by name (`ambience` in its data). Each is a mix of
// layers: `wind` (filtered noise that gusts and dies), `birds` (little
// chirps, now and then, from one side or the other), `drips` (water falling
// in a cave, with an echo), `hum` (the low note of a big hollow space),
// `fire` (a crackle) and `whoosh` (great gusts that rush past from one side
// to the other, for the very top). Levels are 0 to 1 (wind can go higher).
// Chapter 4's underground adds: `picks` (far-off tapping of picks on rock),
// `creaks` (old timber settling), `grit` (a trickle of dust and chips),
// `rumble` (something big shifting a long way off), `laps` (water lapping a
// shore), `slowdrips` (big, slow drops, a long echo), `pressure` (the low
// drone of a great deal of rock overhead) and `far` (soft sounds from a very
// long way off).
// `peak` is the summit: no song there, only the wind.
const AMBIENCES = {
  mountain: { wind: 0.55, birds: 0.6 },
  summit: { wind: 0.9, birds: 0.25 },
  peak: { wind: 1.6, whoosh: 1 },
  village: { wind: 0.3, birds: 0.4 },
  cave: { wind: 0.12, drips: 0.8, hum: 0.5 },
  hearth: { fire: 0.6 },
  // The Pinefall: a soft wind in the leaves, and a lot of birds.
  forest: { wind: 0.3, birds: 0.9 },
  // The Lantern Marsh: low wind over flat water, the hum of the fog, a drip
  // now and then, no birds.
  marsh: { wind: 0.25, hum: 0.35, drips: 0.3 },
  // The Hushwood: the old wood, where the birds have mostly stopped. And
  // `hush`, where the beast is near: no birds at all, just a low hum.
  hushwood: { wind: 0.22, birds: 0.18, drips: 0.12 },
  hush: { wind: 0.12, hum: 0.3 },
  // Chapter 4. Sunnyside: a warm breeze, skylarks high up, a bee going by,
  // a cuckoo somewhere far off.
  meadow: { wind: 0.2, birds: 0.35, larks: 0.7, bees: 0.6, cuckoo: 0.7 },
  // Chapter 4's underground, redone 9 November 2026 with real recordings (see
  // assets/audio/samples/README.md). New layers: `timbers` (real old timbers
  // creaking), `carts` (a cart rattling by on the rails down another drift),
  // `boats` (a moored boat's boards creaking as it rocks) and `lakeLap` (real
  // water lapping a long way across a still lake; through `muffle` if the
  // place has one). `drips`, `slowdrips`, `picks`, `hammer` (now a real anvil)
  // and `chimes` (now real wine glasses sounding) are real recordings too, and
  // a `recording` can be a list, each with a `lowpass` and a `wander`.
  //
  // The Glimmering: water dripping everywhere, more water somewhere far off
  // (heard through the rock), and the faint hum of the crystals: glasses
  // sounding, now and then, and a glassy shimmer under it all. The Echo Falls
  // has the falls themselves, close.
  crystal: { drips: 0.6, slowdrips: 0.2, lakeLap: 0.45, chimes: 0.12, shimmer: 0.3, wind: 0.04, muffle: 700 },
  crystal_falls: { lapping: 0.55, lakeLap: 0.6, drips: 0.5, chimes: 0.12, shimmer: 0.3 },
  // Belowtown: the town talking (a real room full of folk, `market.ogg`, far
  // enough off that no words come through), the smith's anvil across the
  // town, drips, a fire somewhere, a crystal now and then. The market: the
  // same talk, closer and busier, the smith further off (smaller and softer
  // than Saltcombe's town hall full for the meeting). The forge: the anvil
  // right there, the fire roaring, the town only through the wall.
  belowtown: { recording: { url: 'assets/audio/under/market.ogg', level: 0.028, wander: 0.3 }, hammer: 0.4, drips: 0.2, fire: 0.15, chimes: 0.05 },
  belowtown_market: { recording: { url: 'assets/audio/under/market.ogg', level: 0.045, wander: 0.25 }, hammer: 0.25, drips: 0.12, fire: 0.1, chimes: 0.05 },
  belowtown_forge: { recording: { url: 'assets/audio/under/market.ogg', level: 0.014, lowpass: 600 }, hammer: 1.4, fire: 0.85, drips: 0.1 },
  // The Mossy Pillow: its fire, a few folk talking low at the long table,
  // the old boards. The Hall of the Visit: damp and quiet, the town faint
  // through the walls. The Secret Way and the Long Rope: a passage out of
  // town, dripping, the town further and further behind (and at the rope,
  // the draught coming down from the daylight).
  belowtown_inn: { fire: 0.6, recording: { url: 'assets/audio/under/market.ogg', level: 0.02, lowpass: 800, wander: 0.3 }, drips: 0.08 },
  belowtown_indoors: { recording: { url: 'assets/audio/under/market.ogg', level: 0.012, lowpass: 500 }, drips: 0.35, slowdrips: 0.15 },
  belowtown_tunnel: { recording: { url: 'assets/audio/under/market.ogg', level: 0.009, lowpass: 450 }, drips: 0.35, grit: 0.15 },
  long_rope: { wind: 0.3, drips: 0.3, slowdrips: 0.15, recording: { url: 'assets/audio/under/market.ogg', level: 0.007, lowpass: 450 } },
  // King Peptup's hall, full: a real audience waiting for a show, hushed,
  // talking low (`hall.ogg`), and the lanterns. In the welcome show (the
  // scene asks for each): `throne_hush` as the lights go down, only a
  // whisper; `throne_show` the whole hall excited (and each cheer is the
  // crowdCheer sound); `silent` when the Sunstone gutters and nobody makes a
  // sound at all. After the light goes up, the square has `belowtown_party`.
  throne_hall: { recording: { url: 'assets/audio/under/hall.ogg', level: 0.028, wander: 0.2 }, fire: 0.12, drips: 0.06 },
  throne_hush: { recording: { url: 'assets/audio/under/hall.ogg', level: 0.011, lowpass: 900 } },
  throne_show: { recording: { url: 'assets/audio/under/hall.ogg', level: 0.05, wander: 0.3 } },
  silent: {},
  belowtown_party: { recording: [{ url: 'assets/audio/under/hall.ogg', level: 0.04, wander: 0.35 }, { url: 'assets/audio/under/market.ogg', level: 0.02 }], fire: 0.2, chimes: 0.05, drips: 0.1 },
  // Half the town crowded onto the road at the gate to see who fell in (into_belowtown asks for it).
  belowtown_crowd: { recording: [{ url: 'assets/audio/under/hall.ogg', level: 0.035, wander: 0.3 }, { url: 'assets/audio/under/market.ogg', level: 0.018 }], hammer: 0.3, drips: 0.15, fire: 0.12 },
  // The hall coming down (the_hall_falls asks for each): the folk all
  // shouting at once as they run (chapter 5's big real crowd, darkened), the
  // rock grinding and settling, grit pouring, the timbers groaning; then, once
  // they're all out, only the rock and the weight; and at last, the dust
  // settling in the quiet.
  hall_falling: { recording: { url: 'assets/audio/crowd.ogg', level: 0.085, lowpass: 1400, wander: 0.3 }, rumble: 1.2, grit: 1.2, timbers: 0.8 },
  hall_straining: { rumble: 1, grit: 1, timbers: 1 },
  hall_settled: { grit: 0.35, drips: 0.15 },
  // The Diggings: picks somewhere far down a drift, timbers creaking under
  // the weight, now and then a cart rattling by on the rails, grit trickling,
  // a deep rumble, a drip. The old workings (the Old Seam, Seam Nine): quiet,
  // the picks a long way off, the old props creaking. The Flooded Drift: the
  // water standing in the workings, dripping and lapping.
  mine: { picks: 0.7, timbers: 0.7, carts: 0.5, grit: 0.5, rumble: 0.45, drips: 0.2, hum: 0.1, wind: 0.05 },
  mine_quiet: { timbers: 0.6, picks: 0.2, grit: 0.4, drips: 0.35, rumble: 0.35, hum: 0.1 },
  mine_flooded: { picks: 0.4, timbers: 0.6, grit: 0.3, rumble: 0.3, drips: 0.7, slowdrips: 0.3, lakeLap: 0.5 },
  // The Stillwater: slow drops falling a long way into the lake, the water
  // lapping at the shore a long way across, and one deep note holding the
  // whole cavern. At a jetty (`lake_jetty`), a boat's boards creak as it
  // rocks. The Sunken Hall: the water standing among the pillars. The Stair:
  // the lake fading away above, and the weight of the Deep coming up.
  lake: { slowdrips: 0.6, lakeLap: 0.85, hum: 0.35, wind: 0.04 },
  lake_jetty: { slowdrips: 0.6, lakeLap: 0.9, boats: 0.4, hum: 0.35, wind: 0.04 },
  lake_hall: { slowdrips: 0.8, lakeLap: 0.5, drips: 0.2, hum: 0.45 },
  deep_stair: { slowdrips: 0.4, lakeLap: 0.35, pressure: 0.4, muffle: 600 },
  // The Deep: almost nothing. Pressure (a low hum), one slow drop far off,
  // and far-off things. At the Keeper's fire, the fire too. As the light goes
  // up the root (the_light_goes_up asks for it): the whole rock rumbling and
  // shedding grit.
  deep: { pressure: 0.8, slowdrips: 0.35, far: 0.6 },
  deep_fire: { pressure: 0.6, slowdrips: 0.3, far: 0.4, fire: 0.4 },
  root_waking: { rumble: 1.4, grit: 1.2, pressure: 0.6, slowdrips: 0.3 },
  // Chapter 5, the coast. New layers: `surf` (real recorded waves breaking and hissing
  // back, see wave()), `gulls` (cries, now and then), `rain` (storm rain out in the
  // open; `drizzle` a lighter rain, `rainRoof` rain drumming on the boards
  // overhead, `rainGlass` rain on a window: all real recordings, see startRain),
  // `thunder` (rolls a long way off), `bell` (a buoy's bell tolling far over
  // the water), `boom` (the sea thumping in a cave mouth) and `tavern` (a
  // muffled room full of folk through a wall).
  // Added 8 November 2026: `rigging` (halyards knocking on masts and a rope
  // creaking at a mooring), `shutters` (a gust leaning on the shutters or the
  // window frames, rattling them: for indoors in the storm), `lapping` (a real
  // recording of water slopping over stone, looped: the drowned streets) and
  // `muffle` (a number in Hz, not a layer: the sea, the bell and the far boom
  // are heard through a wall or rock, so they go through a lowpass at that).
  // Gullrest: the happy beach. Gentle surf, a lot of gulls, a light breeze.
  beach: { surf: 0.5, gulls: 0.9, wind: 0.12 },
  // The storm shore (Wrack, the Lanes): rain on water, waves, far thunder.
  storm_shore: { rain: 0.75, surf: 0.75, thunder: 0.6, wind: 0.3 },
  // Saltcombe's boardwalks: rain on roofs, stilts creaking, a muffled tavern,
  // the boats' rigging knocking and creaking at their moorings, a bell buoy far out.
  stilt_town: { rainRoof: 0.45, drizzle: 0.45, surf: 0.3, creaks: 0.6, tavern: 0.5, thunder: 0.3, wind: 0.15, rigging: 0.6, bell: 0.3 },
  // Inside a Saltcombe house or tavern: the rain only on the roof above, the
  // odd gust rattling the shutters, thunder through the walls.
  stilt_inside: { rainRoof: 0.25, tavern: 0.8, creaks: 0.35, fire: 0.3, shutters: 0.5, thunder: 0.22 },
  // The Fair Return (the ghost ship): her own timbers, a moored hull's boards, rigging, a far bell, the drip
  // of fog off the yards, very little wind. Heard through the hull (muffled a little), never loud.
  ghost_ship: { timbers: 0.9, boats: 0.35, rigging: 0.35, drips: 0.3, slowdrips: 0.25, bell: 0.28, wind: 0.08, hum: 0.2, muffle: 900 },
  // Up in her rigging (ship_rigging): the wind, the rigging creaking all round you, the hull groaning far below, the bell off in the fog.
  ghost_ship_high: { wind: 0.4, rigging: 0.6, timbers: 0.35, boats: 0.2, drips: 0.15, bell: 0.22, hum: 0.12, muffle: 2400 },
  ghost_ship_deep: { timbers: 0.8, boats: 0.3, slowdrips: 0.4, drips: 0.25, hum: 0.3, rumble: 0.25, bell: 0.2, muffle: 700 },
  // The Wreck Yard: hulls groaning, a bell buoy far off, a fine rain in the fog.
  wreck_yard: { drizzle: 0.8, rain: 0.3, creaks: 1.1, bell: 0.7, surf: 0.4, thunder: 0.4, wind: 0.25, rigging: 0.45 },
  // Inside a hulk in the storm: rain drumming on the deck overhead, the plates
  // groaning, gusts banging at the hatches, the sea and the bell through iron.
  hulk_storm: { rainRoof: 0.35, creaks: 1, bell: 0.3, surf: 0.35, shutters: 0.4, drips: 0.3, thunder: 0.25, muffle: 650 },
  // The Soundings: a sea cave. Drips, and the sea booming a long way off.
  // The boom is the real sea, slowed and darkened, with the cave's long echo.
  sea_cave: { slowdrips: 0.6, drips: 0.45, boom: 0.8, surf: 0.25, hum: 0.25, muffle: 1100 },
  // The sunny cliff cave under the Sea View: drips, the surf close by through
  // the holes in the rock, a soft boom below, a gull or two outside. (Its song,
  // "The Sea Downstairs", has far waves of its own, so the near surf is sparse.)
  cliff_cave: { drips: 0.5, slowdrips: 0.25, surf: 0.25, boom: 0.3, gulls: 0.2, wind: 0.08 },
  // The Isles and the Reach: open sea. Wind, big waves, rain.
  open_sea: { wind: 1.1, surf: 1, rain: 0.85, thunder: 0.7 },
  // Haddock's Light, inside: a fire, rain on glass, the sea below.
  // (The sea is heard through the walls, and gusts shake the window frames.)
  lighthouse: { rainGlass: 0.5, surf: 0.3, fire: 0.3, wind: 0.2, creaks: 0.25, shutters: 0.45, thunder: 0.22, muffle: 800 },
  // The Last Light: wind howling round the tower, rain on glass, deep surf.
  last_light: { wind: 1.7, rainGlass: 0.7, surf: 0.9, boom: 0.4, thunder: 0.5, shutters: 0.55, muffle: 800 },
  // After the storm (rooms' `calmAfter`): the open sea lying down, a breeze,
  // a few gulls come back; and inside the Last Light, only the sea far below
  // and the old tower settling.
  calm_sea: { surf: 0.8, wind: 0.3, gulls: 0.35 },
  calm_tower: { surf: 0.45, creaks: 0.25, slowdrips: 0.3, wind: 0.12 },
  calm_lighthouse: { surf: 0.3, fire: 0.3, creaks: 0.25, wind: 0.1 },
  // The mainland after the storm. The shore (Wrack, the Lanes): small waves, a
  // breeze, the gulls back, water dripping off everything. Saltcombe outside:
  // the stilts creaking, the tavern still going through the wall, gulls, eaves
  // dripping; inside, only the tavern, the boards and the fire. The Wreck Yard:
  // the hulls still groaning and the bell buoy tolling, but no rain; `calm_hulk`
  // is inside one of them, the sea slapping the plates and drips in the dark.
  calm_shore: { surf: 0.6, gulls: 0.45, wind: 0.2, drips: 0.25 },
  // Chapter 6's Ash Road: a low wind over the ash and the odd crackle of the cracks; the
  // bare seabed below it, the sea a long way off now, just a murmur.
  ash_waste: { wind: 0.4, fire: 0.07, hum: 0.08 },
  ash_seabed: { surf: 0.18, wind: 0.3, gulls: 0.08, muffle: 900 },
  calm_stilt_town: { surf: 0.3, creaks: 0.5, tavern: 0.5, gulls: 0.35, drips: 0.3, wind: 0.1, rigging: 0.35, bell: 0.2 },
  calm_stilt_inside: { tavern: 0.8, creaks: 0.35, fire: 0.3 },
  calm_wreck_yard: { creaks: 1, bell: 0.55, surf: 0.4, gulls: 0.3, drips: 0.3, wind: 0.2, rigging: 0.3 },
  calm_hulk: { creaks: 0.9, bell: 0.35, surf: 0.3, drips: 0.45, muffle: 650 },
  // Merrow, the drowned town: the sea in its streets, lapping at doorsteps and
  // slopping round the walls (a real recording, see `lapping`), rain on the
  // flood, the open sea further off, thunder. After the storm: the same water
  // gone quiet, gulls back, the eaves dripping.
  drowned_town: { lapping: 0.8, rain: 0.45, drizzle: 0.35, surf: 0.3, thunder: 0.5, wind: 0.28, creaks: 0.25 },
  calm_drowned_town: { lapping: 0.65, surf: 0.35, gulls: 0.35, drips: 0.3, wind: 0.14 },
  // Inside Merrow's flooded bell tower: the water slopping round the fallen
  // bell, drips off the beams, the storm muffled through the stone and the
  // louvres rattling; after it, only the water and the drips.
  drowned_inside: { lapping: 0.5, drips: 0.4, slowdrips: 0.3, rainRoof: 0.18, shutters: 0.35, thunder: 0.2, creaks: 0.25, muffle: 800 },
  calm_drowned_inside: { lapping: 0.45, drips: 0.4, slowdrips: 0.3, creaks: 0.2 },
  // Added 8 November 2026 (c). The Drowned Rat, Saltcombe's inn: the room's
  // own talk (not a tavern through a wall: this is the tavern), the fire close
  // and crackling, the rain loud on the roof, gusts at the shutters. After the
  // storm, the same room, quieter and drier.
  inn: { tavern: 0.55, murmur: 0.5, chatter: 0.45, fire: 0.85, rainRoof: 0.4, creaks: 0.3, shutters: 0.45, thunder: 0.2 },
  calm_inn: { tavern: 0.45, murmur: 0.4, chatter: 0.35, fire: 0.8, creaks: 0.3 },
  // The town hall full for the meeting (the town_meeting scene asks for it): a
  // real room full of people all talking at once, too far off for any words
  // (`recording`, cut from a CC0 crowd recording, see assets/audio/samples/README.md),
  // a few voices nearer, the stove, and the rain on the roof.
  town_meeting: { recording: { url: 'assets/audio/crowd.ogg', level: 0.07 }, chatter: 0.7, fire: 0.35, rainRoof: 0.25, creaks: 0.3, shutters: 0.35, thunder: 0.2 },
  // Gullrest's lifeboat house: the stove ticking over, the sea just outside
  // the big doors, a gull or two on the roof, the old boards.
  beach_inside: { fire: 0.4, surf: 0.4, gulls: 0.3, creaks: 0.2, wind: 0.06, muffle: 900 },
  // An empty house in a drowned place (Merrow's open house and ringers' loft,
  // the Lanes' attic): nobody talking, no fire. The rain on the roof, the
  // shutters, the flood slopping somewhere below through the floor and the
  // walls, the house settling. After the storm, only the water and the drips.
  drowned_house: { rainRoof: 0.3, shutters: 0.4, lapping: 0.25, creaks: 0.4, thunder: 0.2, drips: 0.15, muffle: 800 },
  calm_drowned_house: { lapping: 0.25, creaks: 0.35, drips: 0.3, muffle: 800 },
  // Haddock's shed, after him: the stove gone cold, the boards, the sea and
  // the rigging out on the quay through the walls, and the town's talk faint
  // from the inn.
  calm_shed: { creaks: 0.4, surf: 0.3, rigging: 0.2, tavern: 0.25, gulls: 0.15, drips: 0.2, muffle: 800 },
  // Chapter 5's credits: faint real waves breaking on a beach, far below the
  // song. `recording` loops a real recording (this one is CC0, "Ocean Waves
  // on a Tropical Beach" from Wikimedia Commons, cut to a seamless 50 s).
  credits_sea: { recording: { url: 'assets/audio/waves.ogg', level: 0.22 } },
};

// Room by room mixes for chapters 4 to 6, their far-off one-shots and how they ring
// (src/audio/roomAmbience.js).
Object.assign(AMBIENCES, EXTRA_AMBIENCES);
Object.assign(AMBIENT_EXTRAS, EXTRA_EXTRAS);
Object.assign(SFX, EXTRA_SFX);
Object.assign(SFX_FEEL, EXTRA_FEEL);
Object.assign(ECHO_BY_AMBIENCE, EXTRA_ECHO);

// Real recordings for `recording` layers, fetched once and kept.
const recordings = new Map();
// How many gull calls there are in assets/audio/gulls/ (1.ogg, 2.ogg...).
const GULL_CALLS = 5;
// The rain recordings (assets/audio/rain/), by the kind of rain a layer asks
// for, with how loud each plays at level 1 (they're levelled differently, so
// these set them level with each other, under the songs and the waves) and,
// for rain heard through a roof, a lowpass.
const RAIN_FILES = {
  sea: { name: 'storm', gain: 0.1 },
  drizzle: { name: 'drizzle', gain: 0.2 },
  roof: { name: 'roof', gain: 0.07, lowpass: 3200 },
  glass: { name: 'glass', gain: 0.085 },
};
// How loud the fire recording plays at level 1.
const FIRE_GAIN = 0.14;
function loadRecording(ctx, url) {
  if (!recordings.has(url)) {
    recordings.set(url, fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .catch(() => null));
  }
  return recordings.get(url);
}
export const AMBIENCE_NAMES = Object.keys(AMBIENCES);

// An ambience playing into `destination` on any context (for the tools: how
// loud a place is next to its song). Call `.stop()` on what it gives back.
export function ambienceOn(ctx, destination, name) {
  if (!AMBIENCES[name]) throw new Error(`Unknown ambience '${name}'`);
  return new Ambience(ctx, destination, makeNoise(ctx), AMBIENCES[name]);
}

// Set by a room whose lightning is on screen (every frame it draws): while it
// is fresh, the ambience's random thunder keeps quiet and each flash cues its own.
let lastLightning = -1e9;
const lightningOnScreen = () => performance.now() - lastLightning < 600;

// One roll of thunder, `delay` seconds from now. With `crack`, it opens with a
// sharp clap close by (the lightning's own), then the long roll.
function rollThunder(ctx, noise, bus, level, delay, crack) {
  const now = ctx.currentTime + delay;
  const seconds = 3.5 + Math.random() * 3;
  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 130;
  filter.Q.value = 1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.07 * level, now + (crack ? 0.08 : 0.5));
  for (let k = 1; k < 4; k++) gain.gain.linearRampToValueAtTime((0.03 + Math.random() * 0.04) * level, now + 0.5 + k * seconds * 0.17);
  gain.gain.linearRampToValueAtTime(0, now + seconds);
  const pan = ctx.createStereoPanner();
  pan.pan.value = Math.random() * 1.2 - 0.6;
  source.connect(filter).connect(gain).connect(pan).connect(bus);
  source.start(now, Math.random());
  source.stop(now + seconds + 0.1);
  if (crack) {
    const snap = ctx.createBufferSource();
    snap.buffer = noise;
    const band = ctx.createBiquadFilter();
    band.type = 'lowpass';
    band.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.22 * level, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    snap.connect(band).connect(g).connect(pan);
    snap.start(now, Math.random());
    snap.stop(now + 0.5);
  }
}

class Ambience {
  constructor(ctx, destination, noise, spec) {
    this.ctx = ctx;
    this.noise = noise;
    this.spec = spec;
    this.bus = ctx.createGain();
    this.bus.gain.setValueAtTime(0, ctx.currentTime);
    this.bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    this.bus.connect(destination);
    this.timers = [];
    this.nodes = [];
    // Things heard through a wall or a cliff go through `muffled` (see `muffle`).
    this.muffled = this.bus;
    if (spec.muffle) {
      this.muffled = ctx.createBiquadFilter();
      this.muffled.type = 'lowpass';
      this.muffled.frequency.value = spec.muffle;
      this.muffled.Q.value = 0.5;
      this.muffled.connect(this.bus);
    }
    if (spec.wind) this.startWind(spec.wind);
    if (spec.hum) this.startHum(spec.hum);
    if (spec.fire) this.startFire(spec.fire);
    if (spec.whoosh) this.every(() => this.whoosh(spec.whoosh), 3 / spec.whoosh, 8 / spec.whoosh);
    if (spec.birds) this.every(() => this.chirp(spec.birds), 2.5 / spec.birds, 7 / spec.birds);
    if (spec.drips) this.every(() => this.drip(spec.drips), 0.8 / spec.drips, 3.5 / spec.drips);
    if (spec.picks) this.every(() => this.pick(spec.picks), 5 / spec.picks, 15 / spec.picks);
    if (spec.creaks) this.every(() => this.creak(spec.creaks), 7 / spec.creaks, 19 / spec.creaks);
    if (spec.grit) this.every(() => this.grit(spec.grit), 4 / spec.grit, 12 / spec.grit);
    if (spec.rumble) this.every(() => this.rumble(spec.rumble), 18 / spec.rumble, 40 / spec.rumble);
    if (spec.laps) this.every(() => this.lap(spec.laps), 3.5 / spec.laps, 9 / spec.laps);
    if (spec.slowdrips) this.every(() => this.slowDrip(spec.slowdrips), 3.2 / spec.slowdrips, 8 / spec.slowdrips);
    if (spec.far) this.every(() => this.farOff(spec.far), 9 / spec.far, 24 / spec.far);
    if (spec.pressure) this.startPressure(spec.pressure);
    if (spec.larks) this.every(() => this.lark(spec.larks), 4 / spec.larks, 11 / spec.larks);
    if (spec.bees) this.every(() => this.bee(spec.bees), 5 / spec.bees, 14 / spec.bees);
    if (spec.cuckoo) this.every(() => this.cuckoo(spec.cuckoo), 9 / spec.cuckoo, 24 / spec.cuckoo);
    if (spec.chimes) this.every(() => this.chime(spec.chimes), 1.2 / spec.chimes, 4.5 / spec.chimes);
    if (spec.shimmer) this.startShimmer(spec.shimmer);
    if (spec.murmur) this.startMurmur(spec.murmur);
    if (spec.chatter) this.every(() => this.chatter(spec.chatter), 2 / spec.chatter, 7 / spec.chatter);
    if (spec.hammer) this.every(() => this.hammer(spec.hammer), 4 / spec.hammer, 11 / spec.hammer);
    if (spec.surf) this.every(() => this.wave(spec.surf), 3.5 / spec.surf, 8 / spec.surf);
    if (spec.gulls) this.every(() => this.gull(spec.gulls), 3 / spec.gulls, 9 / spec.gulls);
    if (spec.rain) this.startRain(spec.rain, 'sea');
    if (spec.rainRoof) this.startRain(spec.rainRoof, 'roof');
    if (spec.rainGlass) this.startRain(spec.rainGlass, 'glass');
    if (spec.drizzle) this.startRain(spec.drizzle, 'drizzle');
    if (spec.thunder) this.every(() => { if (!lightningOnScreen()) this.thunder(spec.thunder); }, 14 / spec.thunder, 34 / spec.thunder);
    if (spec.bell) this.every(() => this.buoyBell(spec.bell), 6 / spec.bell, 14 / spec.bell);
    if (spec.boom) this.every(() => this.boom(spec.boom), 5 / spec.boom, 13 / spec.boom);
    if (spec.tavern) this.startTavern(spec.tavern);
    if (spec.recording) this.startRecording(spec.recording);
    if (spec.timbers) this.every(() => this.timber(spec.timbers), 6 / spec.timbers, 16 / spec.timbers);
    if (spec.carts) this.every(() => this.cart(spec.carts), 14 / spec.carts, 34 / spec.carts);
    if (spec.boats) this.every(() => this.boat(spec.boats), 6 / spec.boats, 15 / spec.boats);
    if (spec.lakeLap) this.startLakeLap(spec.lakeLap);
    if (spec.rigging) this.every(() => this.rigging(spec.rigging), 2.5 / spec.rigging, 7 / spec.rigging);
    if (spec.shutters) this.every(() => this.shutters(spec.shutters), 9 / spec.shutters, 22 / spec.shutters);
    if (spec.lapping) this.startLapping(spec.lapping);
  }

  // A real recording (assets/audio/<path>.ogg), played once: at `gain`, at
  // `rate` (its speed), thrown up to `pan` to one side or the other (or at
  // `side`, -1 to 1; `sweep` carries it across to the other side as it plays),
  // through a `lowpass` (Hz) if it has one, fading in over `attack` seconds,
  // `delay` seconds from now, with an `echo` ([seconds apart, how much each
  // keeps, its tone]) if it has one.
  clip(path, { gain, rate = 1, pan = 0, side = null, sweep = false, lowpass = null, attack = 0, delay = 0, echo = null }) {
    const { ctx } = this;
    loadRecording(ctx, `assets/audio/${path}.ogg`).then((buffer) => {
      if (!buffer || this.stopped) return;
      const at = ctx.currentTime + delay;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = rate;
      let node = source;
      if (lowpass) {
        const soft = ctx.createBiquadFilter();
        soft.type = 'lowpass';
        soft.frequency.value = lowpass;
        node = node.connect(soft);
      }
      const level = ctx.createGain();
      if (attack) {
        level.gain.setValueAtTime(0.0001, at);
        level.gain.exponentialRampToValueAtTime(gain, at + attack);
      } else level.gain.value = gain;
      const panner = ctx.createStereoPanner();
      const from = side ?? (Math.random() * 2 - 1) * pan;
      panner.pan.setValueAtTime(from, at);
      if (sweep) panner.pan.linearRampToValueAtTime(-from, at + buffer.duration / rate);
      node.connect(level).connect(panner).connect(this.bus);
      source.start(at);
      if (echo) this.echoTail(panner, ...echo, at + buffer.duration / rate);
    });
  }

  // Calls `fn` again and again, a random `min` to `max` seconds apart.
  // (Each keeps one place in `timers` for its next call, so the list doesn't
  // grow the longer you stay.)
  every(fn, min, max) {
    const slot = this.timers.length;
    const tick = () => {
      fn();
      this.timers[slot] = setTimeout(tick, (min + Math.random() * (max - min)) * 1000);
    };
    this.timers[slot] = setTimeout(tick, Math.random() * max * 500);
  }

  // Wind: noise through a low band, rising and falling in long gusts.
  startWind(level) {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 320;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.02 * level;
    source.connect(filter).connect(gain).connect(this.bus);
    source.start();
    this.nodes.push(source);
    // Gusts: the level and the pitch of the wind wander.
    const gust = () => {
      const now = ctx.currentTime;
      const strength = 0.012 + Math.random() * 0.045 * level;
      const seconds = 2 + Math.random() * 4;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(strength, now, seconds / 3);
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.setTargetAtTime(220 + Math.random() * 400, now, seconds / 2);
    };
    this.every(gust, 1.5, 4);
    // A thin whistle over the top, for the high places.
    if (level > 0.6) {
      const whistle = ctx.createBiquadFilter();
      whistle.type = 'bandpass';
      whistle.frequency.value = 1400;
      whistle.Q.value = 12;
      const wgain = ctx.createGain();
      wgain.gain.value = 0.006 * level;
      const src2 = ctx.createBufferSource();
      src2.buffer = this.noise;
      src2.loop = true;
      src2.connect(whistle).connect(wgain).connect(this.bus);
      src2.start();
      this.nodes.push(src2);
      this.every(() => {
        const now = ctx.currentTime;
        whistle.frequency.setTargetAtTime(900 + Math.random() * 1200, now, 1.2);
        wgain.gain.setTargetAtTime(Math.random() * 0.012 * level, now, 1.5);
      }, 2, 6);
    }
  }

  // A great gust rushing past: noise that swells and falls away over a few
  // seconds, its pitch sweeping up then down, crossing from one ear to the other.
  whoosh(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 1.8 + Math.random() * 2.2;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(900 + Math.random() * 700, now + seconds * 0.45);
    filter.frequency.linearRampToValueAtTime(200, now + seconds);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime((0.05 + Math.random() * 0.05) * level, now + seconds * 0.4);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    const pan = ctx.createStereoPanner();
    const from = Math.random() < 0.5 ? -0.9 : 0.9;
    pan.pan.setValueAtTime(from, now);
    pan.pan.linearRampToValueAtTime(-from, now + seconds);
    source.connect(filter).connect(gain).connect(pan).connect(this.bus);
    source.start(now, Math.random() * 1);
    source.stop(now + seconds + 0.1);
  }

  // The low note of a hollow mountain, swelling and fading.
  startHum(level) {
    const { ctx } = this;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 55;
    const gain = ctx.createGain();
    gain.gain.value = 0.02 * level;
    osc.connect(gain).connect(this.bus);
    osc.start();
    this.nodes.push(osc);
    this.every(() => {
      const now = ctx.currentTime;
      gain.gain.setTargetAtTime((0.008 + Math.random() * 0.03) * level, now, 3);
      osc.frequency.setTargetAtTime(50 + Math.random() * 14, now, 4);
    }, 4, 9);
  }

  // A fire: a real one (a public-domain recording of a fire crackling in an
  // open fireplace, looped: assets/audio/fire.ogg, see
  // assets/audio/samples/README.md). The crackle as it is, and the same
  // recording slowed right down and darkened under it for the fire's roar.
  startFire(level) {
    const { ctx } = this;
    loadRecording(ctx, 'assets/audio/fire.ogg').then((buffer) => {
      if (!buffer || this.stopped) return;
      const layer = (rate, volume, lowpass, offset) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.playbackRate.value = rate;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = lowpass;
        const gain = ctx.createGain();
        gain.gain.value = volume * level;
        source.connect(filter).connect(gain).connect(this.bus);
        source.start(ctx.currentTime, buffer.duration * offset);
        this.nodes.push(source);
        return gain;
      };
      const crackle = layer(1, FIRE_GAIN, 7000, Math.random());
      layer(0.5, FIRE_GAIN * 0.9, 600, Math.random());
      // It flares and settles.
      this.every(() => crackle.gain.setTargetAtTime(FIRE_GAIN * level * (0.7 + Math.random() * 0.5), ctx.currentTime, 0.8), 1.5, 4);
    });
  }

  // A bird somewhere off to one side: two or three quick rising notes.
  chirp(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    pan.connect(this.bus);
    const notes = 2 + Math.floor(Math.random() * 3);
    const base = 2200 + Math.random() * 1400;
    for (let i = 0; i < notes; i++) {
      const t = now + i * (0.09 + Math.random() * 0.06);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * (0.9 + Math.random() * 0.2), t);
      osc.frequency.exponentialRampToValueAtTime(base * 1.4, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(base * 1.1, t + 0.09);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.028 * level, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      osc.connect(gain).connect(pan);
      osc.start(t);
      osc.stop(t + 0.12);
    }
  }

  // A drop of water landing in a cave, and its echo: a real one (one of six
  // single drops cut from a CC0 recording of water dripping in a basement,
  // assets/audio/under/drip1-6.ogg: see assets/audio/samples/README.md),
  // picked at random, a little higher or lower each time.
  drip(level) {
    this.clip(`under/drip${1 + Math.floor(Math.random() * 6)}`, {
      gain: (0.08 + Math.random() * 0.06) * level, rate: 0.85 + Math.random() * 0.35, pan: 0.7, echo: [0.21, 0.42, 3200],
    });
  }

  // A skylark high overhead: a long, bubbling run of tiny notes that climbs
  // and wanders, two or three seconds of it.
  lark(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    pan.connect(this.bus);
    let pitch = 2600 + Math.random() * 600;
    const seconds = 1.6 + Math.random() * 1.6;
    for (let t = 0; t < seconds; t += 0.045 + Math.random() * 0.03) {
      pitch = Math.max(2300, Math.min(4200, pitch + (Math.random() - 0.42) * 420));
      const at = now + t;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, at);
      osc.frequency.linearRampToValueAtTime(pitch * (0.92 + Math.random() * 0.2), at + 0.04);
      const swell = Math.sin((t / seconds) * Math.PI);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.011 * level * (0.4 + swell), at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
      osc.connect(gain).connect(pan);
      osc.start(at);
      osc.stop(at + 0.06);
    }
  }

  // A bee going by: a low buzz that swells, wavers and fades, crossing from
  // one side to the other.
  bee(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 2 + Math.random() * 2;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 150 + Math.random() * 40;
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 9 + Math.random() * 4;
    const depth = ctx.createGain();
    depth.gain.value = 12;
    vibrato.connect(depth).connect(osc.frequency);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 520;
    filter.Q.value = 2.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.014 * level, now + seconds * 0.5);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    const pan = ctx.createStereoPanner();
    const from = Math.random() < 0.5 ? -0.8 : 0.8;
    pan.pan.setValueAtTime(from, now);
    pan.pan.linearRampToValueAtTime(-from, now + seconds);
    osc.connect(filter).connect(gain).connect(pan).connect(this.bus);
    osc.start(now);
    vibrato.start(now);
    osc.stop(now + seconds + 0.1);
    vibrato.stop(now + seconds + 0.1);
  }

  // A cuckoo, far off: two soft round notes, the second a minor third down,
  // and now and then the pair again.
  cuckoo(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    const soften = ctx.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = 1400;
    soften.connect(pan).connect(this.bus);
    const calls = Math.random() < 0.5 ? 2 : 1;
    for (let c = 0; c < calls; c++) {
      [[700, 0], [560, 0.3]].forEach(([freq, offset]) => {
        const t = now + c * 0.95 + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.03, t);
        osc.frequency.exponentialRampToValueAtTime(freq, t + 0.05);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03 * level, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
        osc.connect(gain).connect(soften);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    }
  }

  // A crystal ringing: a real wine glass sounding (the `glass` set, VCSL's
  // CC0 recordings), on a note from a bright pentatonic scale, swelling in
  // softly and long, with an echo: the faint hum of a cave full of crystal.
  chime(level) {
    const note = [79, 81, 84, 86, 88, 91][Math.floor(Math.random() * 6)];
    const sample = [75, 78, 82, 86].reduce((best, n) => (Math.abs(n - note) < Math.abs(best - note) ? n : best));
    this.clip(`samples/glass/${sample}`, {
      gain: 0.03 * Math.min(1, level * 2.5), rate: 2 ** ((note - sample) / 12), pan: 0.8, attack: 0.9, echo: [0.45, 0.25, 3000],
    });
  }

  // The faint glassy hum of a cave full of crystal: slightly different notes
  // beating against each other, slowly swelling.
  startShimmer(level) {
    const { ctx } = this;
    const gain = ctx.createGain();
    gain.gain.value = 0.004 * level;
    gain.connect(this.bus);
    [[330, 1], [331.6, 1], [494, 0.5]].forEach(([freq, part]) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = part;
      osc.connect(g).connect(gain);
      osc.start();
      this.nodes.push(osc);
    });
    this.every(() => {
      gain.gain.setTargetAtTime((0.002 + Math.random() * 0.006) * level, ctx.currentTime, 2.5);
    }, 3, 8);
  }

  // The low murmur of a town: noise through a mouth-shaped band, rising and
  // falling as if many people were talking a long way off.
  startMurmur(level) {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 480;
    filter.Q.value = 1.4;
    const gain = ctx.createGain();
    gain.gain.value = 0.012 * level;
    source.connect(filter).connect(gain).connect(this.bus);
    source.start();
    this.nodes.push(source);
    this.every(() => {
      const now = ctx.currentTime;
      gain.gain.setTargetAtTime((0.006 + Math.random() * 0.016) * level, now, 0.5);
      filter.frequency.setTargetAtTime(380 + Math.random() * 320, now, 0.6);
    }, 0.5, 1.6);
  }

  // Someone speaking in the distance: two to four soft syllables, each a short
  // buzz through a vowel-ish band, the pitch drifting.
  chatter(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    const far = ctx.createBiquadFilter();
    far.type = 'lowpass';
    far.frequency.value = 1100;
    far.connect(pan).connect(this.bus);
    const syllables = 2 + Math.floor(Math.random() * 3);
    let pitch = 110 + Math.random() * 130;
    for (let i = 0; i < syllables; i++) {
      const t = now + i * (0.14 + Math.random() * 0.08);
      pitch *= 0.92 + Math.random() * 0.2;
      const osc = ctx.createOscillator();
      const vowel = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = pitch;
      vowel.type = 'bandpass';
      vowel.frequency.value = 500 + Math.random() * 500;
      vowel.Q.value = 3;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.02 * level, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      osc.connect(vowel).connect(gain).connect(far);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  // A smith's hammer on his anvil: a real one (three strikes cut from a CC0
  // recording, assets/audio/under/anvil1-3.ogg), two to four blows, the last
  // one softer, with the stone of the cavern answering. Heard from across
  // the town (under 1) it's softened; close up (the forge) it's bright.
  hammer(level) {
    const strikes = 2 + Math.floor(Math.random() * 3);
    const near = level >= 1;
    const rate = 0.92 + Math.random() * 0.14;
    for (let i = 0; i < strikes; i++) {
      const last = i === strikes - 1;
      this.clip(`under/anvil${1 + Math.floor(Math.random() * 3)}`, {
        gain: 0.05 * level * (last ? 0.7 : 1), rate: rate * (last ? 0.97 : 1),
        pan: near ? 0.3 : 0.6, lowpass: near ? null : 2400, echo: [0.26, near ? 0.25 : 0.35, 2400],
        delay: i * (0.42 + (i % 2) * 0.05),
      });
    }
  }

  // A tail of echoes behind a sound: `seconds` between them, each `keep` as loud, darkened by a lowpass.
  // `ends` (the sound engine's clock) is when the sound itself is over: the
  // loop is let go of once its last echo has died away after that.
  echoTail(source, seconds, keep, tone = 2400, ends = this.ctx.currentTime + 2) {
    const { ctx } = this;
    const delay = ctx.createDelay(2);
    delay.delayTime.value = seconds;
    const feedback = ctx.createGain();
    feedback.gain.value = keep;
    const dark = ctx.createBiquadFilter();
    dark.type = 'lowpass';
    dark.frequency.value = tone;
    source.connect(delay);
    delay.connect(dark).connect(feedback).connect(delay);
    dark.connect(this.bus);
    releaseAt(ctx, ends + echoSeconds(seconds, keep) + 0.2, [source, delay, dark, feedback]);
  }

  // Picks on rock, far down some other tunnel: a few dull blows, a pause, an
  // echo. Real ones (assets/audio/under/pick1-5.ogg, from Kenney's CC0
  // "Impact Sounds"), softened by the distance.
  pick(level) {
    const taps = 2 + Math.floor(Math.random() * 4);
    const rate = 0.85 + Math.random() * 0.25;
    const side = Math.random() * 1.6 - 0.8;
    let t = 0;
    for (let i = 0; i < taps; i++) {
      this.clip(`under/pick${1 + Math.floor(Math.random() * 5)}`, {
        gain: (0.06 + Math.random() * 0.02) * level, rate, side, lowpass: 1900, echo: [0.31, 0.38, 1500], delay: t,
      });
      t += 0.42 + Math.random() * 0.16;
    }
  }

  // Old timbers taking the weight: a real creak (assets/audio/under/creak1-4.ogg,
  // from Kenney's CC0 "RPG Audio" and a CC0 tree creaking), slowed and darkened.
  timber(level) {
    this.clip(`under/creak${1 + Math.floor(Math.random() * 4)}`, {
      gain: (0.04 + Math.random() * 0.025) * level, rate: 0.6 + Math.random() * 0.25, pan: 0.6, lowpass: 1600, echo: [0.29, 0.3, 1200],
    });
  }

  // A cart going by on the rails, somewhere down another drift: the wheels
  // clacking over the joints, the iron box rattling (assets/audio/under/cart1-3.ogg,
  // made from Kenney's CC0 "Impact Sounds"), passing from one side to the other.
  cart(level) {
    this.clip(`under/cart${1 + Math.floor(Math.random() * 3)}`, {
      gain: 0.05 * level, rate: 0.85 + Math.random() * 0.25, pan: 0.8, sweep: true, lowpass: 1500, echo: [0.34, 0.35, 1200],
    });
  }

  // A boat at a jetty, rocking: its boards creak (the same creaks, slowed right
  // down: assets/audio/under/boat1-3.ogg).
  boat(level) {
    this.clip(`under/boat${1 + Math.floor(Math.random() * 3)}`, {
      gain: (0.035 + Math.random() * 0.02) * level, rate: 0.85 + Math.random() * 0.2, pan: 0.7, lowpass: 1800, echo: [0.45, 0.3, 1200],
    });
  }

  // Old timber taking the weight: a low, slow groan that bends in pitch.
  creak(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 0.9 + Math.random() * 1.3;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const base = 70 + Math.random() * 60;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.linearRampToValueAtTime(base * (0.8 + Math.random() * 0.5), now + seconds);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 7;
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(260 + Math.random() * 500, now + seconds);
    // A shudder in it, as the grain gives.
    const shake = ctx.createOscillator();
    const shakeDepth = ctx.createGain();
    shake.frequency.value = 17 + Math.random() * 12;
    shakeDepth.gain.value = 7;
    shake.connect(shakeDepth).connect(osc.frequency);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.02 * level, now + seconds * 0.35);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    osc.connect(filter).connect(gain).connect(pan).connect(this.bus);
    osc.start(now);
    shake.start(now);
    osc.stop(now + seconds + 0.05);
    shake.stop(now + seconds + 0.05);
  }

  // Grit and little chips of rock running down a wall: a patter of tiny ticks.
  grit(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    pan.connect(this.bus);
    const ticks = 6 + Math.floor(Math.random() * 12);
    let t = now;
    for (let i = 0; i < ticks; i++) {
      const tick = ctx.createBufferSource();
      const band = ctx.createBiquadFilter();
      const g = ctx.createGain();
      tick.buffer = this.noise;
      band.type = 'bandpass';
      band.frequency.value = 2200 + Math.random() * 2600;
      band.Q.value = 2;
      g.gain.setValueAtTime((0.012 + Math.random() * 0.02) * level, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      tick.connect(band).connect(g).connect(pan);
      tick.start(t, Math.random());
      tick.stop(t + 0.03);
      t += 0.02 + Math.random() * 0.09 * (1 + i / ticks);
    }
  }

  // Something very big settling, a long way off: a low swell with no edge to it.
  rumble(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 2.5 + Math.random() * 2.5;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 90;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime((0.05 + Math.random() * 0.04) * level, now + seconds * 0.4);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    source.connect(filter).connect(gain).connect(pan).connect(this.bus);
    source.start(now, Math.random());
    source.stop(now + seconds + 0.1);
  }

  // A lap of water on stone: soft noise swelling and ebbing, once.
  lap(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 1.2 + Math.random() * 1.2;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(520, now + seconds * 0.4);
    filter.frequency.linearRampToValueAtTime(240, now + seconds);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime((0.014 + Math.random() * 0.01) * level, now + seconds * 0.4);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    source.connect(filter).connect(gain).connect(pan).connect(this.bus);
    source.start(now, Math.random());
    source.stop(now + seconds + 0.1);
  }

  // One heavy drop in a huge space: low, round, and a long way to the echo.
  // The same real drops as `drips`, slowed right down and darkened.
  slowDrip(level) {
    this.clip(`under/drip${1 + Math.floor(Math.random() * 6)}`, {
      gain: (0.1 + Math.random() * 0.04) * level, rate: 0.48 + Math.random() * 0.14, pan: 0.7, lowpass: 2200,
      echo: [0.52 + Math.random() * 0.2, 0.5, 1400],
    });
  }

  // Far-off things: a muffled thud, or a long soft note sliding down and gone.
  farOff(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() < 0.5 ? -0.85 : 0.85;
    pan.connect(this.bus);
    if (Math.random() < 0.5) {
      const source = ctx.createBufferSource();
      source.buffer = this.noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 130;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.07 * level, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      source.connect(filter).connect(gain).connect(pan);
      source.start(now, Math.random());
      source.stop(now + 0.7);
      this.echoTail(pan, 0.7, 0.4, 500, now + 0.7);
      return;
    }
    const seconds = 3.5 + Math.random() * 2;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const from = 150 + Math.random() * 90;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(from * 0.94, now + seconds);
    const vibrato = ctx.createOscillator();
    const depth = ctx.createGain();
    vibrato.frequency.value = 4.5;
    depth.gain.value = 0.6;
    vibrato.connect(depth).connect(osc.frequency);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.012 * level, now + seconds * 0.45);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    osc.connect(gain).connect(pan);
    osc.start(now);
    vibrato.start(now);
    osc.stop(now + seconds + 0.1);
    vibrato.stop(now + seconds + 0.1);
  }

  // A wave: a real one, recorded breaking on a beach (the seaWaves set, cut
  // from a CC0 field recording), picked at random, a little to one side. In
  // a storm only the bigger ones come in.
  wave(level) {
    const { ctx } = this;
    const stormy = this.spec.rain || this.spec.thunder;
    const pick = stormy ? 64 + Math.floor(Math.random() * 4) : 60 + Math.floor(Math.random() * 6);
    loadRecording(ctx, `assets/audio/samples/seaWaves/${pick}.ogg`).then((buffer) => {
      if (!buffer || this.stopped) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = 0.94 + Math.random() * 0.12;
      const gain = ctx.createGain();
      gain.gain.value = (0.05 + Math.random() * 0.025) * level;
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 1.2 - 0.6;
      source.connect(gain).connect(pan).connect(this.muffled);
      source.start();
    });
  }

  // A gull: a real one (a herring gull's calls, cut from a CC0 field
  // recording into assets/audio/gulls/, see assets/audio/samples/README.md),
  // picked at random, from somewhere overhead; now and then a second one
  // answers further off. Until the calls have loaded, a made one.
  gull(level) {
    const { ctx } = this;
    const pick = 1 + Math.floor(Math.random() * GULL_CALLS);
    loadRecording(ctx, `assets/audio/gulls/${pick}.ogg`).then((buffer) => {
      if (this.stopped) return;
      if (!buffer) {
        this.madeGull(level);
        return;
      }
      const cry = (delay, loud, rate) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = rate;
        const gain = ctx.createGain();
        gain.gain.value = 0.035 * level * loud;
        const pan = ctx.createStereoPanner();
        pan.pan.value = Math.random() * 1.6 - 0.8;
        source.connect(gain).connect(pan).connect(this.bus);
        source.start(ctx.currentTime + delay);
      };
      cry(0, 0.75 + Math.random() * 0.25, 0.92 + Math.random() * 0.16);
      if (Math.random() < 0.35) cry(0.4 + Math.random() * 0.6, 0.45, 0.85 + Math.random() * 0.2);
    });
  }

  // A made gull, for before the real ones load: a long falling cry, two or
  // three times, a little nasal.
  madeGull(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.8 - 0.9;
    pan.connect(this.bus);
    const cries = 2 + Math.floor(Math.random() * 3);
    const base = 1250 + Math.random() * 500;
    for (let i = 0; i < cries; i++) {
      const t = now + i * (0.32 + Math.random() * 0.1);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const band = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(base * 0.85, t);
      osc.frequency.linearRampToValueAtTime(base * 1.25, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(base * 0.7, t + 0.3);
      band.type = 'bandpass';
      band.frequency.value = base * 1.5;
      band.Q.value = 2.2;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.02 * level, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      osc.connect(band).connect(gain).connect(pan);
      osc.start(t);
      osc.stop(t + 0.36);
    }
  }

  // Rain: real recordings (assets/audio/rain/, cut from CC0 and public-domain
  // recordings, see assets/audio/samples/README.md), looped without a seam.
  // `sea` is storm rain out in the open (on water, on the shore), `drizzle` a
  // lighter rain, `roof` rain drumming on the boards overhead (heard from
  // inside, so its top is softened), `glass` rain against a window. Two
  // copies of each, far apart in the loop and at a hair's different speed,
  // so the loop never lines up with itself; the level wanders slowly, the
  // way rain comes and goes in gusts.
  startRain(level, kind) {
    const { ctx } = this;
    const file = RAIN_FILES[kind];
    loadRecording(ctx, `assets/audio/rain/${file.name}.ogg`).then((buffer) => {
      if (!buffer || this.stopped) return;
      const gain = ctx.createGain();
      const base = file.gain * level;
      gain.gain.value = base;
      let out = gain;
      if (file.lowpass) {
        const soft = ctx.createBiquadFilter();
        soft.type = 'lowpass';
        soft.frequency.value = file.lowpass;
        soft.Q.value = 0.5;
        gain.connect(soft);
        out = soft;
      }
      out.connect(this.bus);
      [[0, 1, -0.35], [0.5, 0.97, 0.35]].forEach(([at, rate, side]) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.playbackRate.value = rate;
        const half = ctx.createGain();
        half.gain.value = 0.6;
        const pan = ctx.createStereoPanner();
        pan.pan.value = side;
        source.connect(half).connect(pan).connect(gain);
        source.start(ctx.currentTime, buffer.duration * at);
        this.nodes.push(source);
      });
      this.every(() => gain.gain.setTargetAtTime(base * (0.75 + Math.random() * 0.45), ctx.currentTime, 2), 3, 7);
    });
  }

  // Thunder a long way off: a low roll that builds, shudders and dies.
  // (Rooms with lightning on screen turn this timer off and cue thunder from
  // each flash instead: see MusicPlayer.thunderCue.)
  thunder(level) {
    rollThunder(this.ctx, this.noise, this.bus, level, 0, false);
  }

  // A buoy's bell, tolled by the swell a long way over the water: a dull
  // iron note with a wobble, and a long echo.
  buoyBell(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    const far = ctx.createBiquadFilter();
    far.type = 'lowpass';
    far.frequency.value = 1500;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.46;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.4;
    far.connect(pan).connect(this.muffled);
    pan.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(this.muffled);
    const root = 330 + Math.random() * 40;
    const strikes = 1 + Math.floor(Math.random() * 2);
    for (let n = 0; n < strikes; n++) {
      const t = now + n * (0.9 + Math.random() * 0.5);
      [[1, 1], [2.4, 0.5], [4.1, 0.22]].forEach(([ratio, amount]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = root * ratio;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.022 * amount * level, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4 / ratio);
        osc.connect(gain).connect(far);
        osc.start(t);
        osc.stop(t + 2.6);
      });
    }
    // Its echo loop, let go of once the last strike has rung out and died away.
    releaseAt(ctx, now + 1.4 * strikes + 2.6 + echoSeconds(0.46, 0.4) + 0.2, [far, pan, delay, feedback]);
  }

  // The sea thumping into the cave mouth: a low thud, and the wave itself (a
  // real one from the seaWaves set, slowed and darkened so it sounds big and
  // far in) rolling round the rock with a long, hollow echo.
  boom(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    pan.connect(this.bus);
    // (The wave in it is a recording slowed to 0.6: up to about 15 seconds.)
    this.echoTail(pan, 0.34 + Math.random() * 0.12, 0.42, 520, now + 15);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(64, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.9);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07 * level, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    osc.connect(gain).connect(pan);
    osc.start(now);
    osc.stop(now + 1.5);
    const pick = 64 + Math.floor(Math.random() * 4);
    loadRecording(ctx, `assets/audio/samples/seaWaves/${pick}.ogg`).then((buffer) => {
      if (!buffer || this.stopped) return;
      const wave = ctx.createBufferSource();
      wave.buffer = buffer;
      wave.playbackRate.value = 0.6 + Math.random() * 0.12;
      const dark = ctx.createBiquadFilter();
      dark.type = 'lowpass';
      dark.frequency.value = 460;
      dark.Q.value = 0.6;
      const wg = ctx.createGain();
      wg.gain.value = 0.045 * level;
      wave.connect(dark).connect(wg).connect(pan);
      wave.start();
    });
  }

  // Rigging in a harbour: a halyard knocking on a mast (two or three dull
  // wooden knocks, the gap set by the swell), or now and then a mooring rope
  // creaking tight. Off to one side, a little way off.
  rigging(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    const far = ctx.createBiquadFilter();
    far.type = 'lowpass';
    far.frequency.value = 2600;
    far.connect(pan).connect(this.bus);
    if (Math.random() < 0.35) {
      // A rope drawn tight: a thin, rising creak.
      const seconds = 0.5 + Math.random() * 0.6;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const base = 190 + Math.random() * 90;
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.linearRampToValueAtTime(base * (1.15 + Math.random() * 0.25), now + seconds);
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.Q.value = 9;
      band.frequency.setValueAtTime(800, now);
      band.frequency.linearRampToValueAtTime(1100 + Math.random() * 400, now + seconds);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.012 * level, now + seconds * 0.6);
      g.gain.linearRampToValueAtTime(0, now + seconds);
      osc.connect(band).connect(g).connect(far);
      osc.start(now);
      osc.stop(now + seconds + 0.05);
      return;
    }
    const knocks = 2 + Math.floor(Math.random() * 2);
    const pitch = 520 + Math.random() * 260;
    for (let k = 0; k < knocks; k++) {
      const t = now + k * (0.28 + Math.random() * 0.22);
      const tap = ctx.createBufferSource();
      tap.buffer = this.noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = pitch * 2.2;
      bp.Q.value = 3;
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.04 * level, t);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      tap.connect(bp).connect(tg).connect(far);
      tap.start(t, Math.random());
      tap.stop(t + 0.06);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch * (k ? 0.97 : 1), t);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.022 * level * (k ? 0.75 : 1), t);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      osc.connect(og).connect(far);
      osc.start(t);
      osc.stop(t + 0.1);
    }
  }

  // Indoors in the storm: a gust leaning on the shutters (or a window frame,
  // or a hatch). A dull push of wind through the wall, and the shutters
  // rattling on their hooks while it lasts; now and then one bangs.
  shutters(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 1.6 + Math.random() * 1.6;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    pan.connect(this.bus);
    const push = ctx.createBufferSource();
    push.buffer = this.noise;
    push.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(180, now);
    lp.frequency.linearRampToValueAtTime(420, now + seconds * 0.4);
    lp.frequency.linearRampToValueAtTime(160, now + seconds);
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0, now);
    pg.gain.linearRampToValueAtTime(0.05 * level, now + seconds * 0.4);
    pg.gain.linearRampToValueAtTime(0, now + seconds);
    push.connect(lp).connect(pg).connect(pan);
    push.start(now, Math.random());
    push.stop(now + seconds + 0.1);
    // The rattle: quick wooden ticks bunched in the strongest part of the gust.
    const ticks = 4 + Math.floor(Math.random() * 6);
    const tone = 700 + Math.random() * 400;
    for (let k = 0; k < ticks; k++) {
      const t = now + seconds * (0.2 + 0.45 * (k / ticks)) + Math.random() * 0.05;
      const tick = ctx.createBufferSource();
      tick.buffer = this.noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = tone * (0.9 + Math.random() * 0.2);
      bp.Q.value = 5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.03 * level * (0.5 + Math.random() * 0.5), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      tick.connect(bp).connect(g).connect(pan);
      tick.start(t, Math.random());
      tick.stop(t + 0.04);
    }
    if (Math.random() < 0.3) {
      // One bangs back against its frame.
      const t = now + seconds * 0.5;
      const thud = ctx.createBufferSource();
      thud.buffer = this.noise;
      const lp2 = ctx.createBiquadFilter();
      lp2.type = 'lowpass';
      lp2.frequency.value = 320;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.09 * level, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      thud.connect(lp2).connect(g).connect(pan);
      thud.start(t, Math.random());
      thud.stop(t + 0.2);
    }
  }

  // A gust outside, cued by the screen when the rain is blown over (see
  // drawRain in atmosphere.js): a rush of wind rising and falling with it.
  // Not indoors (a muffled ambience): there the `shutters` layer does it.
  gust(strength) {
    if (this.stopped || this.spec.muffle) return;
    this.whoosh(0.45 + 0.5 * Math.min(1, strength));
  }

  // Water slopping round stone in a drowned street: a real recording ("Water
  // over rocks as tide recedes", public domain, Wikimedia Commons; see
  // assets/audio/samples/README.md), looped, softened, its level drifting so
  // the loop never sits still. Two copies, one each side, a long way apart in
  // the loop and at slightly different speeds, so they never line up.
  startLapping(level) {
    const { ctx } = this;
    loadRecording(ctx, 'assets/audio/streetLap.ogg').then((buffer) => {
      if (!buffer || this.stopped) return;
      [[-0.55, 0], [0.55, buffer.duration * 0.47]].forEach(([side, offset], i) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.playbackRate.value = i ? 0.93 : 1;
        const soft = ctx.createBiquadFilter();
        soft.type = 'lowpass';
        soft.frequency.value = 2400;
        const gain = ctx.createGain();
        const base = 0.075 * level;
        gain.gain.value = base;
        const pan = ctx.createStereoPanner();
        pan.pan.value = side;
        source.connect(soft).connect(gain).connect(pan).connect(this.bus);
        source.start(ctx.currentTime, offset);
        this.nodes.push(source);
        this.every(() => gain.gain.setTargetAtTime(base * (0.55 + Math.random() * 0.6), ctx.currentTime, 2.2), 3, 7);
      });
    });
  }

  // A tavern through the wall: a dull murmur that swells and settles.
  // A real recording, looped: `{ url, level }`. Fetched the first time it's
  // wanted and kept, so the next time it starts straight away.
  // (Added 9 November 2026: `recording` can be a list of them, each with an
  // optional `lowpass` (Hz: a crowd heard through a wall) and `rate`; and
  // `wander` lets its level drift up and down by that share, slowly, the way
  // a crowd's talk comes and goes, starting somewhere random in the loop.)
  startRecording(spec) {
    if (Array.isArray(spec)) {
      for (const one of spec) this.startRecording(one);
      return;
    }
    const { url, level = 1, lowpass = null, rate = 1, wander = 0 } = spec;
    loadRecording(this.ctx, url).then((buffer) => {
      if (!buffer || this.stopped) return;
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.playbackRate.value = rate;
      const gain = this.ctx.createGain();
      gain.gain.value = level;
      let out = gain;
      if (lowpass) {
        const soft = this.ctx.createBiquadFilter();
        soft.type = 'lowpass';
        soft.frequency.value = lowpass;
        gain.connect(soft);
        out = soft;
      }
      source.connect(gain);
      out.connect(this.bus);
      source.start(this.ctx.currentTime, wander ? Math.random() * buffer.duration : 0);
      this.nodes.push(source);
      if (wander) this.every(() => gain.gain.setTargetAtTime(level * (1 - wander + Math.random() * wander * 2), this.ctx.currentTime, 2.5), 3, 8);
    });
  }

  // Water lapping at the shore of a great still lake, a long way across: a
  // real recording of small waves on a river (assets/audio/under/lake.ogg,
  // CC0: see assets/audio/samples/README.md), darkened, two copies far apart
  // in the loop, one each side, coming and going.
  startLakeLap(level) {
    const { ctx } = this;
    loadRecording(ctx, 'assets/audio/under/lake.ogg').then((buffer) => {
      if (!buffer || this.stopped) return;
      [[-0.5, 0, 1], [0.5, buffer.duration * 0.5, 0.94]].forEach(([side, offset, rate]) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.playbackRate.value = rate;
        const soft = ctx.createBiquadFilter();
        soft.type = 'lowpass';
        soft.frequency.value = 1100;
        const gain = ctx.createGain();
        const base = 0.03 * level;
        gain.gain.value = base;
        const pan = ctx.createStereoPanner();
        pan.pan.value = side;
        source.connect(soft).connect(gain).connect(pan).connect(this.muffled);
        source.start(ctx.currentTime, offset);
        this.nodes.push(source);
        this.every(() => gain.gain.setTargetAtTime(base * (0.5 + Math.random() * 0.7), ctx.currentTime, 2.5), 3, 8);
      });
    });
  }

  startTavern(level) {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 1.1;
    const gain = ctx.createGain();
    gain.gain.value = 0.014 * level;
    source.connect(filter).connect(gain).connect(this.bus);
    source.start();
    this.nodes.push(source);
    this.every(() => {
      const now = ctx.currentTime;
      gain.gain.setTargetAtTime((0.007 + Math.random() * 0.016) * level, now, 0.4);
      filter.frequency.setTargetAtTime(300 + Math.random() * 240, now, 0.5);
    }, 0.6, 1.8);
  }

  // The weight of a great deal of rock overhead: two very low notes a hair
  // apart, so they slowly beat against each other.
  startPressure(level) {
    const { ctx } = this;
    const gain = ctx.createGain();
    gain.gain.value = 0.02 * level;
    gain.connect(this.bus);
    for (const freq of [38, 39.7, 57.3]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = freq > 50 ? 0.35 : 1;
      osc.connect(g).connect(gain);
      osc.start();
      this.nodes.push(osc);
    }
    this.every(() => gain.gain.setTargetAtTime((0.014 + Math.random() * 0.012) * level, ctx.currentTime, 5), 8, 16);
  }

  stop() {
    this.stopped = true;
    for (const timer of this.timers) clearTimeout(timer);
    const now = this.ctx.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setTargetAtTime(0, now, 0.4);
    setTimeout(() => {
      for (const node of this.nodes) { try { node.stop(); } catch { /* already stopped */ } }
      this.bus.disconnect();
    }, 2000);
  }
}

// Browsers only allow sound after the player presses something, so music
// starts on the first key press. M mutes and unmutes.
class MusicPlayer {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.current = null;
    this.wanted = null;
    // The song that last started, for the "now playing" label (src/ui/nowPlaying.js):
    // { title, at } with `at` from performance.now().
    this.nowPlaying = null;
    this.ambience = null;
    this.ambienceWanted = null;
    // The room's own `echo` flag (undefined: by its ambience), and the ring playing now.
    this.roomEcho = undefined;
    this.echoKind = null;
    this.muted = false;
    window.addEventListener('keydown', (event) => {
      this.unlock();
      if (event.code === MUTE_KEY) this.toggleMute();
    });
    window.addEventListener('pointerdown', () => this.unlock());
  }

  // How loud the music is this moment (its RMS level, about 0 to 0.1 for our
  // songs), whatever the music volume is set to. 0 before the sound starts.
  loudness() {
    if (!this.meter) return 0;
    this.meter.getFloatTimeDomainData(this.meterData);
    let sum = 0;
    for (const v of this.meterData) sum += v * v;
    return Math.sqrt(sum / this.meterData.length) / Math.max(0.05, SETTINGS.music);
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    // 'playback': bigger sound buffers, so a busy moment (an orchestra, the
    // ambience layers, the cave echo) doesn't crackle. Sounds start a few
    // hundredths of a second later, which nobody notices in a game like this.
    try {
      this.ctx = new AudioContext({ latencyHint: 'playback' });
    } catch {
      this.ctx = new AudioContext();
    }
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : MASTER_VOLUME;
    // A safety limiter before the speakers: when a song, the ambience layers
    // and sounds all peak together they can add up past full scale, and
    // that clips (a crackle). This only catches those peaks.
    this.limiter = this.ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -3;
    this.limiter.knee.value = 0;
    this.limiter.ratio.value = 20;
    this.limiter.attack.value = 0.002;
    this.limiter.release.value = 0.12;
    this.master.connect(this.limiter).connect(this.ctx.destination);
    // Songs and ambience go through the music volume, sound effects through
    // their own (both set in SETTINGS: see src/ui/settingsMenu.js).
    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = SETTINGS.music;
    // The dip under a jingle (DUCKS) happens here, after the music volume.
    this.duckBus = this.ctx.createGain();
    this.musicBus.connect(this.duckBus);
    this.duckBus.connect(this.master);
    // A meter on the music, for things in the world that move with it (the
    // Deep's crystals swell with its song: see loudness()).
    this.meter = this.ctx.createAnalyser();
    this.meter.fftSize = 1024;
    this.meterData = new Float32Array(this.meter.fftSize);
    this.musicBus.connect(this.meter);
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = SETTINGS.sounds;
    this.sfxBus.connect(this.master);
    this.noise = makeNoise(this.ctx);
    // The echo (see ECHOES): echoed sounds go to the sound effects' volume
    // as they are, and through this too.
    this.echoSend = this.ctx.createGain();
    this.echoSend.gain.value = 0;
    this.echoVerb = this.ctx.createConvolver();
    this.echoSend.connect(this.echoVerb).connect(this.sfxBus);
    if (this.wanted) this.start(this.wanted);
    if (this.ambienceWanted) this.startAmbience(this.ambienceWanted);
  }

  // The room's `echo` flag: 'cave', 'hull', false (none), or undefined (by
  // its ambience). See ECHOES.
  setEcho(flag) {
    this.roomEcho = flag;
    this.updateEcho();
  }

  // Rings the way the place does now (dry with no ambience: battles, menus).
  updateEcho() {
    if (!this.ctx) return;
    const name = this.ambienceWanted;
    const kind = !name ? null : this.roomEcho === undefined ? ECHO_BY_AMBIENCE[name] ?? null : this.roomEcho || null;
    if (kind === this.echoKind) return;
    this.echoKind = kind;
    const now = this.ctx.currentTime;
    this.echoSend.gain.cancelScheduledValues(now);
    if (!kind) {
      this.echoSend.gain.setTargetAtTime(0, now, 0.05);
      // Once it has faded, drop the echo's response, so it stops working away
      // on silence (a long echo left loaded costs the sound engine every frame).
      clearTimeout(this.echoOffTimer);
      this.echoOffTimer = setTimeout(() => {
        if (!this.echoKind) this.echoVerb.buffer = null;
      }, 400);
      return;
    }
    if (!ECHOES[kind]) throw new Error(`Unknown echo '${kind}'`);
    this.echoVerb.buffer = echoResponse(this.ctx, ECHOES[kind]);
    this.echoSend.gain.setValueAtTime(ECHOES[kind].wet, now);
  }

  // The ambience that's playing (or should be, once sound is allowed).
  get ambienceName() {
    return this.ambienceWanted;
  }

  // Plays the sounds of a place under the music (see AMBIENCES), or none.
  setAmbience(name) {
    if (name === this.ambienceWanted) return;
    this.ambienceWanted = name;
    if (this.ctx) this.startAmbience(name);
  }

  // Lightning on screen takes over the ambience's thunder: call it each frame
  // lightning is drawn, and the random rolls stop; each flash cues one instead.
  syncThunder() {
    lastLightning = performance.now();
  }

  // The thunder after a flash, `delay` seconds on: the further off the storm,
  // the longer the wait and the softer the opening clap (none past 1.5 s, only
  // the roll). It's part of the weather, so it follows the music volume.
  thunderCue(delay = 0.5, level = 0.8) {
    if (!this.ctx || this.muted) return;
    rollThunder(this.ctx, this.noise, this.musicBus, level, delay, delay < 1.5);
  }

  // A gust of wind on screen (the rain blown over): the ambience rushes with it.
  gustCue(strength = 1) {
    if (!this.ctx || this.muted) return;
    this.ambience?.gust?.(strength);
  }

  startAmbience(name) {
    this.ambience?.stop();
    this.ambience = null;
    this.updateEcho();
    this.scheduleExtra(name);
    if (!name) return;
    const spec = AMBIENCES[name];
    if (!spec) throw new Error(`Unknown ambience '${name}'`);
    this.ambience = new Ambience(this.ctx, this.musicBus, this.noise, spec);
  }

  // How far into the current song we are, in seconds (null if nothing's
  // playing, or sound isn't allowed yet). For timing things to the music.
  get songTime() {
    if (!this.current) return null;
    return Math.max(0, this.ctx.currentTime - this.current.startTime);
  }

  // Where we are in the current song's beat: { beats, bpm } with `beats` the
  // count since it began (a fraction, so 8.5 is half way through the ninth
  // beat), or null with no song playing or no sound yet. Things that swell
  // with the music use this (see src/overworld/beatPulse.js).
  beatPosition() {
    const song = this.current;
    if (!song || !this.ctx || this.ctx.state !== 'running' || !Number.isFinite(song.startTime)) return null;
    const seconds = this.ctx.currentTime - song.startTime;
    if (seconds < 0) return null;
    return { beats: (seconds * song.song.bpm) / 60, bpm: song.song.bpm };
  }

  // The name of the song that's playing (or should be, once sound is allowed).
  get songName() {
    return this.wanted;
  }

  // Plays a song object directly, rather than one from SONGS by name. Used by
  // the tools (tools/) to preview songs as they're written. Call it from a
  // click or key press, since browsers only allow sound after one.
  playSong(song) {
    this.unlock();
    this.wanted = null;
    this.current?.stop();
    this.current = song ? new SongPlayback(this.ctx, this.musicBus, this.noise, song) : null;
  }

  // Plays a sound effect from SFX. Silent until the first key press, like the music.
  // (`bus` is where it goes: the sound effects' own volume, unless it's part of a place.)
  sfx(name, bus = this.sfxBus) {
    // Quiet while a cutscene is skipped through (ScenePlayer.skipThrough).
    if (this.hushed) return;
    if (name === 'farCheer') {
      if (this.ctx) farCheer(this.ctx, this.noise, this.sfxBus);
      return;
    }
    const tones = SFX[name];
    if (!tones) throw new Error(`Unknown sound effect '${name}'`);
    if (!this.ctx) return;
    if (PLACE_SOUNDS.has(name) && bus === this.sfxBus) bus = this.musicBus;
    const now = this.ctx.currentTime;
    if (DUCKS[name] && bus === this.sfxBus) this.duck(DUCKS[name].depth, DUCKS[name].seconds);
    // (See SFX_FEEL: a gap between two of it, and a little difference each time.)
    const feel = SFX_FEEL[name];
    if (feel?.gap) {
      this.lastSfx ??= {};
      if (now - (this.lastSfx[name] ?? -1e9) < feel.gap) return;
      this.lastSfx[name] = now;
    }
    const shift = feel?.vary ? (Math.random() * 2 - 1) * feel.vary : 0;
    const loud = feel?.vary ? 1 - Math.random() * 0.3 : 1;
    let out = bus;
    if (feel?.pan) {
      out = this.ctx.createStereoPanner();
      out.pan.value = (Math.random() * 2 - 1) * feel.pan;
      out.connect(bus);
    }
    // Ringing off the walls of a cave or a hull (see ECHOES).
    if (this.echoKind && echoes(name)) {
      const dry = out;
      out = this.ctx.createGain();
      out.connect(dry);
      out.connect(this.echoSend);
    }
    for (const tone of tones) {
      const time = now + (tone.delay ?? 0);
      // A real recording (assets/audio/sfx/<clip>.ogg), played as it is, a
      // touch higher or lower each time. A list of clips plays one of them,
      // picked at random; `rate` plays it slower (under 1) or faster.
      if (tone.clip) {
        const ctx = this.ctx;
        const clip = Array.isArray(tone.clip) ? tone.clip[Math.floor(Math.random() * tone.clip.length)] : tone.clip;
        loadRecording(ctx, `assets/audio/sfx/${clip}.ogg`).then((buffer) => {
          if (!buffer) return;
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.playbackRate.value = (tone.rate ?? 1) * 2 ** (shift / 12);
          const level = ctx.createGain();
          level.gain.value = tone.volume * loud;
          source.connect(level).connect(out);
          source.start(Math.max(time, ctx.currentTime));
        });
        continue;
      }
      const gain = this.ctx.createGain();
      const volume = tone.volume * loud;
      if (tone.attack) {
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(volume, time + tone.attack);
      } else gain.gain.setValueAtTime(volume, time);
      // `hold`: stays at full that long before dying away.
      if (tone.hold) gain.gain.setValueAtTime(volume, time + Math.max(tone.hold, tone.attack ?? 0));
      gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.max(tone.length, (tone.attack ?? 0) + 0.01));
      gain.connect(out);
      if (tone.noise) {
        // A breath of noise through a filter, from somewhere new in the buffer each time.
        const source = this.ctx.createBufferSource();
        source.buffer = this.noise;
        const filter = this.ctx.createBiquadFilter();
        filter.type = tone.noise;
        const hz = tone.frequency * 2 ** (shift / 12);
        filter.frequency.setValueAtTime(hz, time);
        if (tone.sweep) filter.frequency.exponentialRampToValueAtTime(hz * tone.sweep, time + tone.length);
        filter.Q.value = tone.q ?? 1;
        source.connect(filter).connect(gain);
        source.start(time, Math.random() * 0.8);
        source.stop(time + tone.length + 0.02);
        continue;
      }
      const osc = this.ctx.createOscillator();
      osc.type = tone.wave;
      osc.frequency.setValueAtTime(frequency(tone.midi + shift), time);
      if (tone.slide) osc.frequency.exponentialRampToValueAtTime(frequency(tone.midi + shift + tone.slide), time + tone.length);
      osc.connect(gain);
      osc.start(time);
      osc.stop(time + tone.length + 0.02);
    }
  }

  // One soft footstep on `ground` (as groundUnder in src/overworld/footfall.js
  // names it), or nothing on ground with no sound of its own.
  footstep(ground) {
    const name = FOOTSTEPS[ground];
    if (name) this.sfx(name);
  }

  // Now and then, a small sound of the place over its ambience (AMBIENT_EXTRAS),
  // as long as that ambience is still playing. It's part of the place, so it
  // follows the music volume, like the ambience.
  scheduleExtra(name) {
    clearTimeout(this.extraTimer);
    this.extraTimer = null;
    const list = AMBIENT_EXTRAS[name];
    if (!list) return;
    this.extraTimer = setTimeout(() => {
      if (this.ambienceWanted !== name) return;
      if (!this.muted && this.ctx?.state === 'running') this.sfx(list[Math.floor(Math.random() * list.length)], this.musicBus);
      this.scheduleExtra(name);
    }, (20 + Math.random() * 30) * 1000);
  }

  // A recorded line of speech (src/audio/voiceClips.js): the recordings at
  // `urls`, one after another, on the sound effects' volume, with the music
  // dipped a little under it. Gives back { stop() }, which fades it out at
  // once, or null when there's no sound (or a scene is being skipped).
  voice(urls) {
    if (this.hushed || !this.ctx) return null;
    const ctx = this.ctx;
    const level = ctx.createGain();
    level.gain.value = VOICE_LEVEL;
    level.connect(this.sfxBus);
    let stopped = false;
    const next = (i) => {
      if (stopped || i >= urls.length) return;
      this.loadVoice(urls[i]).then((buffer) => {
        if (stopped || !buffer) return;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(level);
        source.onended = () => next(i + 1);
        source.start();
        this.duck(VOICE_DUCK, buffer.duration);
      });
    };
    next(0);
    return {
      stop: () => {
        if (stopped) return;
        stopped = true;
        level.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
        setTimeout(() => level.disconnect(), 400);
      },
    };
  }

  // Fetches a recorded line ahead of time (the same store as the other
  // recordings), so it's ready when it's needed.
  loadVoice(url) {
    return this.ctx ? loadRecording(this.ctx, url) : Promise.resolve(null);
  }

  // One struck note from a set of real recordings (src/audio/sampleSets.js),
  // for things in the world that ring: the Glimmering's singing crystals.
  // `delay` seconds from now, `octave` shifts it, `seconds` is how long it's
  // held before it lets go. The recordings load the first time (see `warm`).
  chime(sample, midi, { volume = 0.2, seconds = 1.6, release = 1.2, delay = 0, octave = 0, attack = 0 } = {}) {
    if (!this.ctx) return;
    const instrument = { sample, volume, release, octave, attack };
    const play = () => playSample(this.ctx, this.sfxBus, instrument, midi, this.ctx.currentTime + delay, seconds);
    const loading = loadSamples(this.ctx, { title: 'chime', instruments: { chime: instrument } });
    if (loading) loading.then(play, () => {});
    else play();
  }

  // A breath of air through a bellows (the Fair Return's harmonium): soft noise in a reedy band, swelling in and
  // out over `seconds`.
  bellows({ seconds = 0.9, volume = 0.05, delay = 0, tone = 900 } = {}) {
    if (!this.ctx) return;
    const { ctx } = this;
    const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = tone;
    band.Q.value = 0.8;
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + seconds * 0.25);
    gain.gain.linearRampToValueAtTime(0, start + seconds);
    source.connect(band).connect(gain).connect(this.sfxBus);
    source.start(start);
    source.stop(start + seconds + 0.05);
  }

  // Loads recordings ahead of time, so a chime rings the moment it's struck.
  warm(...samples) {
    if (!this.ctx) return;
    const instruments = Object.fromEntries(samples.map((sample, i) => [`warm${i}`, { sample }]));
    loadSamples(this.ctx, { title: 'warm', instruments })?.catch(() => {});
  }

  // Plays a song by name (looping), or stops the music with null, with the
  // `ambience` of the place under it (none, if left out: battles and menus
  // are quiet places). Asking for the song that's already playing just
  // changes the ambience.
  // With `from`, the name of one of the song's sections, it starts there (and
  // starts again even if it was already playing): a scene cutting to the best part.
  play(name, ambience = null, from = null) {
    this.setAmbience(ambience);
    if (!from && name === this.wanted && (this.current || !this.ctx)) return;
    this.wanted = name;
    if (this.ctx) this.start(name, from);
  }

  start(name, from = null) {
    const before = this.current;
    this.current?.stop();
    this.current = null;
    if (!name) return;
    const song = SONGS[name];
    if (!song) throw new Error(`Unknown song '${name}'`);
    // Going in or out of a door between a song and its indoor twin (the same
    // tune, note for note: indoors() in orchestrate.js), it carries on from
    // the same place instead of starting again at the top.
    const tune = (other) => other.tuneOf ?? other.title;
    if (!from && before && !before.ended && Number.isFinite(before.startTime) && before.song !== song && tune(before.song) === tune(song)) {
      from = before.index;
    }
    this.current = new SongPlayback(this.ctx, this.musicBus, this.noise, song, from);
    this.nowPlaying = { title: song.title, at: performance.now() };
  }

  // Turns the music or the sound effects up or down (`kind` is 'music' or
  // 'sounds', `value` 0 to 1), straight away.
  setVolume(kind, value) {
    SETTINGS[kind] = Math.max(0, Math.min(1, value));
    const bus = kind === 'music' ? this.musicBus : this.sfxBus;
    bus?.gain.setTargetAtTime(SETTINGS[kind], this.ctx.currentTime, 0.03);
  }

  // The music (and the sounds of the place) dips to `depth` of its volume
  // for `seconds`, then comes back up, so a jingle over it is heard.
  duck(depth, seconds) {
    if (!this.duckBus) return;
    const gain = this.duckBus.gain;
    const now = this.ctx.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(depth, now + 0.06);
    gain.setValueAtTime(depth, now + seconds);
    gain.linearRampToValueAtTime(1, now + seconds + 0.6);
  }

  // A fight won: the battle song stops and the victory jingle plays. (The
  // room's own song starts again when you're back in it.)
  victory() {
    this.play(null);
    this.sfx('victory');
  }

  // Everything holds while the game's paused (the window lost focus) and
  // carries on where it was.
  setPaused(paused) {
    if (!this.ctx) return;
    if (paused && this.ctx.state === 'running') this.ctx.suspend();
    else if (!paused && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.master?.gain.setTargetAtTime(this.muted ? 0 : MASTER_VOLUME, this.ctx.currentTime, 0.05);
  }
}

export const music = new MusicPlayer();

export function sfx(name) {
  music.sfx(name);
}
