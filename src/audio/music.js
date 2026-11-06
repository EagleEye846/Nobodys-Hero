import { SETTINGS } from '../state/settings.js';
import { SONGS } from '../data/music/index.js';
import { HOLD, HIT } from './notation.js';
import { SAMPLE_SETS } from './sampleSets.js';

// Songs are synthesised live with the Web Audio API, chiptune style, from the
// note data in src/data/music/. Rooms, shops, menus and enemies pick a song by
// name: battleTheme.js is 'battle', and so on (see src/data/music/index.js).
// The 'waltz' isn't used anywhere yet: it's saved for a brighter area.

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
};

// The sound effect names, for the Studio's pickers.
export const SOUND_NAMES = [...Object.keys(SFX), 'farCheer'];

// A crowd cheering a very long way off (the light going up the root): lots of
// small voices, a breath of filtered noise, swelling and dying away in a big
// soft hall of echo. Quiet. Built on the spot, so it can't be a list of tones.
function farCheer(ctx, noise, bus) {
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
const LOOKAHEAD_SECONDS = 0.12;
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

  song.order.forEach((name, orderIndex) => {
    if (orderIndex === (song.loopFrom ?? 0)) loopStart = steps.length;
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

  return { steps, loopStart, starts };
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
        const response = await fetch(new URL(`${name}/${file}`, SAMPLE_ROOT));
        if (!response.ok) throw new Error(`Couldn't load the ${name} sample ${file}`);
        return [midi, await ctx.decodeAudioData(await response.arrayBuffer())];
      })).then((buffers) => cache.ready.set(name, new Map(buffers))));
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
function buildChannels(ctx, bus, instruments) {
  const channels = {};
  let hall = null;
  for (const [name, instrument] of Object.entries(instruments)) {
    const channel = ctx.createGain();
    // `pan` places it left (-1) or right (1), like seats in an orchestra.
    let out = channel;
    if (instrument.pan) {
      out = ctx.createStereoPanner();
      out.pan.value = instrument.pan;
      channel.connect(out);
    }
    // The channel's tone filter comes first, so its reverb and echo are
    // the filtered sound too (a muffled instrument has a muffled echo).
    if (instrument.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = instrument.filter.type;
      filter.frequency.value = instrument.filter.frequency;
      if (instrument.filter.q) filter.Q.value = instrument.filter.q;
      out.connect(filter);
      out = filter;
    }
    out.connect(bus);
    if (instrument.reverb) {
      if (!hall) {
        hall = makeHall(ctx);
        hall.connect(bus);
      }
      const send = ctx.createGain();
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
    this.channels = buildChannels(ctx, this.bus, song.instruments);
    let starts;
    ({ steps: this.steps, loopStart: this.loopStart, starts } = compile(song));
    this.stepSeconds = 60 / song.bpm / song.stepsPerBeat;
    this.index = (from && starts[from]) || 0;
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
      loading.catch((error) => console.error(`${song.title}: couldn't load its instruments:`, error)).then(begin);
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
      if (this.index + 1 < this.steps.length) this.index++;
      // A song with `loop: false` plays once, then lets its last notes ring out.
      else if (this.song.loop === false) this.ended = true;
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
    setTimeout(() => this.bus.disconnect(), (FADE_SECONDS + 1) * 1000);
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
  ({ steps: playback.steps, loopStart: playback.loopStart } = compile(song));
  playback.stepSeconds = 60 / song.bpm / song.stepsPerBeat;
  for (let time = 0, index = 0; time < seconds; time += playback.stepSeconds) {
    for (const event of playback.steps[index]) playback.play(event, time);
    if (index + 1 < playback.steps.length) index++;
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
  // a cuckoo somewhere far off. The Glimmering: soft chimes of crystal
  // ringing, slow drips, a gentle shimmer of a hum. Belowtown: a cosy murmur
  // of a town underground, small voices, a hammer a long way off, drips,
  // a fire crackling somewhere.
  meadow: { wind: 0.2, birds: 0.35, larks: 0.7, bees: 0.6, cuckoo: 0.7 },
  crystal: { wind: 0.05, chimes: 0.8, drips: 0.3, shimmer: 0.6 },
  belowtown: { murmur: 0.6, chatter: 0.5, hammer: 0.5, drips: 0.2, fire: 0.18, chimes: 0.15 },
  // The market: a busier murmur and more chatter, the smith far off. The forge: the hammer close, the fire loud, hardly anyone talking.
  belowtown_market: { murmur: 0.95, chatter: 0.95, hammer: 0.25, drips: 0.12, fire: 0.1, chimes: 0.15 },
  belowtown_forge: { murmur: 0.15, hammer: 1.7, drips: 0.1, fire: 0.55 },
  // The Diggings: picks tapping somewhere far down a drift, timbers creaking
  // under the weight, grit trickling, a deep rumble now and then.
  mine: { wind: 0.06, picks: 0.7, creaks: 0.6, grit: 0.5, rumble: 0.5, hum: 0.12 },
  // The Stillwater: nothing but slow drops falling a long way into the lake,
  // the faintest lap on the shore, and one deep note holding the whole cavern.
  lake: { slowdrips: 0.7, laps: 0.5, hum: 0.4, wind: 0.04 },
  // The Deep: almost nothing. Pressure, one slow drop, and far-off things.
  deep: { pressure: 0.8, slowdrips: 0.35, far: 0.6 },
  // Chapter 5, the coast. New layers: `surf` (waves breaking and hissing
  // back), `gulls` (cries, now and then), `rain` (a steady hiss on water;
  // `rainRoof` drums it on boards, `rainGlass` ticks it on a window),
  // `thunder` (rolls a long way off), `bell` (a buoy's bell tolling far over
  // the water), `boom` (the sea thumping in a cave mouth) and `tavern` (a
  // muffled room full of folk through a wall).
  // Gullrest: the happy beach. Gentle surf, a lot of gulls, a light breeze.
  beach: { surf: 0.5, gulls: 0.9, wind: 0.12 },
  // The storm shore (Wrack, the Lanes): rain on water, waves, far thunder.
  storm_shore: { rain: 0.7, surf: 0.7, thunder: 0.6, wind: 0.3 },
  // Saltcombe's boardwalks: rain on roofs, stilts creaking, a muffled tavern.
  stilt_town: { rainRoof: 0.6, surf: 0.3, creaks: 0.6, tavern: 0.5, thunder: 0.3, wind: 0.15 },
  // Inside a Saltcombe house or tavern: the rain only on the roof above.
  stilt_inside: { rainRoof: 0.25, tavern: 0.8, creaks: 0.35, fire: 0.3 },
  // The Wreck Yard: hulls groaning, a bell buoy far off, rain.
  wreck_yard: { rain: 0.6, creaks: 1.1, bell: 0.7, surf: 0.4, thunder: 0.4, wind: 0.25 },
  // The Soundings: a sea cave. Drips, and the sea booming a long way off.
  sea_cave: { slowdrips: 0.6, drips: 0.4, boom: 0.8, surf: 0.25, hum: 0.25 },
  // The Isles and the Reach: open sea. Wind, big waves, rain.
  open_sea: { wind: 1.1, surf: 1, rain: 0.8, thunder: 0.7 },
  // Haddock's Light, inside: a fire, rain on glass, the sea below.
  lighthouse: { rainGlass: 0.5, surf: 0.3, fire: 0.3, wind: 0.2, creaks: 0.25 },
  // The Last Light: wind howling round the tower, rain on glass, deep surf.
  last_light: { wind: 1.7, rainGlass: 0.8, surf: 0.9, boom: 0.4, thunder: 0.5 },
};
export const AMBIENCE_NAMES = Object.keys(AMBIENCES);

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
    if (spec.thunder) this.every(() => { if (!lightningOnScreen()) this.thunder(spec.thunder); }, 14 / spec.thunder, 34 / spec.thunder);
    if (spec.bell) this.every(() => this.buoyBell(spec.bell), 6 / spec.bell, 14 / spec.bell);
    if (spec.boom) this.every(() => this.boom(spec.boom), 5 / spec.boom, 13 / spec.boom);
    if (spec.tavern) this.startTavern(spec.tavern);
  }

  // Calls `fn` again and again, a random `min` to `max` seconds apart.
  every(fn, min, max) {
    const tick = () => {
      fn();
      this.timers.push(setTimeout(tick, (min + Math.random() * (max - min)) * 1000));
    };
    this.timers.push(setTimeout(tick, Math.random() * max * 500));
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

  // A fire: crackles of noise over a soft roar.
  startFire(level) {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    const gain = ctx.createGain();
    gain.gain.value = 0.012 * level;
    source.connect(filter).connect(gain).connect(this.bus);
    source.start();
    this.nodes.push(source);
    this.every(() => {
      const now = ctx.currentTime;
      const pop = ctx.createBufferSource();
      const hp = ctx.createBiquadFilter();
      const g = ctx.createGain();
      pop.buffer = this.noise;
      hp.type = 'highpass';
      hp.frequency.value = 2500;
      g.gain.setValueAtTime(0.05 * level, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      pop.connect(hp).connect(g).connect(this.bus);
      pop.start(now);
      pop.stop(now + 0.04);
    }, 0.08, 0.6);
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

  // A drop of water landing in a cave, and its echo.
  drip(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.21;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.42;
    pan.connect(this.bus);
    pan.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(this.bus);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const pitch = 900 + Math.random() * 900;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.6, now + 0.02);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, now + 0.12);
    gain.gain.setValueAtTime(0.05 * level, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain).connect(pan);
    osc.start(now);
    osc.stop(now + 0.2);
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

  // A crystal ringing: a bell-like note (the partials of a struck glass) from
  // a bright pentatonic scale, long and soft, with an echo.
  chime(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.33;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.45;
    pan.connect(this.bus);
    pan.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(this.bus);
    const scale = [1046.5, 1174.7, 1396.9, 1568, 1760, 2093, 2349.3];
    const root = scale[Math.floor(Math.random() * scale.length)];
    [[1, 1], [2.76, 0.4], [5.4, 0.16]].forEach(([ratio, amount]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = root * ratio;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02 * level * amount, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2 / ratio + 0.4);
      osc.connect(gain).connect(pan);
      osc.start(now);
      osc.stop(now + 2.7);
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

  // A smith's hammer, a long way off: a few bright clinks on metal, with the
  // stone of the cavern answering.
  hammer(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.26;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    pan.connect(this.bus);
    pan.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(this.bus);
    const strikes = 2 + Math.floor(Math.random() * 3);
    const pitch = 1100 + Math.random() * 500;
    for (let i = 0; i < strikes; i++) {
      const t = now + i * (0.42 + (i % 2) * 0.05);
      [[1, 1], [2.4, 0.35]].forEach(([ratio, amount]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = pitch * ratio * (i === strikes - 1 ? 0.9 : 1);
        gain.gain.setValueAtTime(0.03 * level * amount, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.connect(gain).connect(pan);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    }
  }

  // A tail of echoes behind a sound: `seconds` between them, each `keep` as loud, darkened by a lowpass.
  echoTail(source, seconds, keep, tone = 2400) {
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
  }

  // Picks on rock, far down some other tunnel: a few dull taps, a pause, an echo.
  pick(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 1900;
    tone.connect(pan);
    pan.connect(this.bus);
    this.echoTail(pan, 0.31, 0.38, 1500);
    const taps = 2 + Math.floor(Math.random() * 4);
    const pitch = 1300 + Math.random() * 700;
    let t = now;
    for (let i = 0; i < taps; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch * (0.94 + Math.random() * 0.12), t);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.55, t + 0.05);
      gain.gain.setValueAtTime(0.03 * level, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      osc.connect(gain).connect(tone);
      osc.start(t);
      osc.stop(t + 0.09);
      t += 0.42 + Math.random() * 0.16;
    }
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
  slowDrip(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    pan.connect(this.bus);
    this.echoTail(pan, 0.52 + Math.random() * 0.2, 0.5, 1400);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const pitch = 360 + Math.random() * 360;
    osc.frequency.setValueAtTime(pitch * 1.1, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.85, now + 0.2);
    gain.gain.setValueAtTime(0.05 * level, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain).connect(pan);
    osc.start(now);
    osc.stop(now + 0.3);
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
      this.echoTail(pan, 0.7, 0.4, 500);
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

  // A wave: noise that swells as it breaks (bright), then hisses back (dull).
  wave(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const seconds = 3.2 + Math.random() * 2.2;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.5;
    filter.frequency.setValueAtTime(260, now);
    filter.frequency.linearRampToValueAtTime(1500, now + seconds * 0.38);
    filter.frequency.linearRampToValueAtTime(300, now + seconds);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime((0.03 + Math.random() * 0.02) * level, now + seconds * 0.38);
    gain.gain.linearRampToValueAtTime(0.012 * level, now + seconds * 0.6);
    gain.gain.linearRampToValueAtTime(0, now + seconds);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    source.connect(filter).connect(gain).connect(pan).connect(this.bus);
    source.start(now, Math.random());
    source.stop(now + seconds + 0.1);
  }

  // A gull: a long falling cry, two or three times, a little nasal.
  gull(level) {
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

  // Rain, steady: `sea` hisses on water, `roof` drums low on boards, `glass`
  // ticks high on a window. A slow wander in the level keeps it alive.
  startRain(level, kind) {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = kind === 'roof' ? 'bandpass' : 'highpass';
    filter.frequency.value = kind === 'roof' ? 900 : kind === 'glass' ? 3800 : 2200;
    filter.Q.value = kind === 'roof' ? 0.5 : 0.7;
    const gain = ctx.createGain();
    const base = (kind === 'glass' ? 0.011 : 0.016) * level;
    gain.gain.value = base;
    source.connect(filter).connect(gain).connect(this.bus);
    source.start();
    this.nodes.push(source);
    this.every(() => gain.gain.setTargetAtTime(base * (0.7 + Math.random() * 0.6), ctx.currentTime, 1.6), 2, 5);
    // Fat drops on the wood or glass.
    if (kind !== 'sea') {
      this.every(() => {
        const now = ctx.currentTime;
        const tick = ctx.createBufferSource();
        const bp = ctx.createBiquadFilter();
        const g = ctx.createGain();
        tick.buffer = this.noise;
        bp.type = 'bandpass';
        bp.frequency.value = kind === 'glass' ? 4200 : 1300;
        bp.Q.value = 4;
        g.gain.setValueAtTime(0.03 * level, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        tick.connect(bp).connect(g).connect(this.bus);
        tick.start(now, Math.random());
        tick.stop(now + 0.04);
      }, 0.08, 0.5);
    }
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
    far.connect(pan).connect(this.bus);
    pan.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(this.bus);
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
  }

  // The sea thumping into the cave mouth: a low thud, then a washing hiss.
  boom(level) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    pan.connect(this.bus);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.9);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09 * level, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    osc.connect(gain).connect(pan);
    osc.start(now);
    osc.stop(now + 1.5);
    const wash = ctx.createBufferSource();
    wash.buffer = this.noise;
    wash.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, now);
    lp.frequency.linearRampToValueAtTime(240, now + 2.4);
    const wg = ctx.createGain();
    wg.gain.setValueAtTime(0, now);
    wg.gain.linearRampToValueAtTime(0.02 * level, now + 0.25);
    wg.gain.linearRampToValueAtTime(0, now + 2.6);
    wash.connect(lp).connect(wg).connect(pan);
    wash.start(now, Math.random());
    wash.stop(now + 2.7);
  }

  // A tavern through the wall: a dull murmur that swells and settles.
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
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : MASTER_VOLUME;
    this.master.connect(this.ctx.destination);
    // Songs and ambience go through the music volume, sound effects through
    // their own (both set in SETTINGS: see src/ui/settingsMenu.js).
    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = SETTINGS.music;
    this.musicBus.connect(this.master);
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
    if (this.wanted) this.start(this.wanted);
    if (this.ambienceWanted) this.startAmbience(this.ambienceWanted);
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

  thunderCue(delay = 0.5, level = 0.8) {
    if (!this.ctx || this.muted) return;
    rollThunder(this.ctx, this.noise, this.sfxBus, level, delay, true);
  }

  startAmbience(name) {
    this.ambience?.stop();
    this.ambience = null;
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
  sfx(name) {
    // Quiet while a cutscene is skipped through (ScenePlayer.skipThrough).
    if (this.hushed) return;
    if (name === 'farCheer') {
      if (this.ctx) farCheer(this.ctx, this.noise, this.sfxBus);
      return;
    }
    const tones = SFX[name];
    if (!tones) throw new Error(`Unknown sound effect '${name}'`);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const tone of tones) {
      const time = now + (tone.delay ?? 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = tone.wave;
      osc.frequency.setValueAtTime(frequency(tone.midi), time);
      if (tone.slide) osc.frequency.exponentialRampToValueAtTime(frequency(tone.midi + tone.slide), time + tone.length);
      gain.gain.setValueAtTime(tone.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + tone.length);
      osc.connect(gain).connect(this.sfxBus);
      osc.start(time);
      osc.stop(time + tone.length + 0.02);
    }
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
    this.current?.stop();
    this.current = null;
    if (!name) return;
    const song = SONGS[name];
    if (!song) throw new Error(`Unknown song '${name}'`);
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

  toggleMute() {
    this.muted = !this.muted;
    this.master?.gain.setTargetAtTime(this.muted ? 0 : MASTER_VOLUME, this.ctx.currentTime, 0.05);
  }
}

export const music = new MusicPlayer();

export function sfx(name) {
  music.sfx(name);
}
