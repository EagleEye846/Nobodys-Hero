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
  hook: [
    { midi: 79, wave: 'triangle', length: 0.18, volume: 0.05, slide: 14 },
    { midi: 100, wave: 'square', length: 0.05, volume: 0.04, delay: 0.26 },
    { midi: 95, wave: 'square', length: 0.04, volume: 0.03, delay: 0.31 },
  ],
};

// The sound effect names, for the Studio's pickers.
export const SOUND_NAMES = Object.keys(SFX);

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

  song.order.forEach((name, orderIndex) => {
    if (orderIndex === (song.loopFrom ?? 0)) loopStart = steps.length;
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

  return { steps, loopStart };
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

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(volume, time + attack);
  envelope.gain.setTargetAtTime(volume * sustain, time + attack, decay);
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
        const response = await fetch(new URL(`${name}/${midi}.ogg`, SAMPLE_ROOT));
        if (!response.ok) throw new Error(`Couldn't load the ${name} sample ${midi}.ogg`);
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
  gain.gain.setValueAtTime(attack ? 0 : volume, time);
  if (attack) gain.gain.linearRampToValueAtTime(volume, time + attack);
  const length = (buffer.duration - offset) / source.playbackRate.value;
  let stopAt = time + length;
  if (!ring) {
    const end = time + seconds * gate;
    gain.gain.setTargetAtTime(0, end, release / 3);
    stopAt = Math.min(stopAt, end + release * 2 + 0.05);
  }
  source.connect(gain).connect(channel);
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
    if (instrument.reverb) {
      if (!hall) {
        hall = makeHall(ctx);
        hall.connect(bus);
      }
      const send = ctx.createGain();
      send.gain.value = instrument.reverb;
      out.connect(send).connect(hall);
    }
    if (instrument.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = instrument.filter.type;
      filter.frequency.value = instrument.filter.frequency;
      if (instrument.filter.q) filter.Q.value = instrument.filter.q;
      out.connect(filter).connect(bus);
    } else {
      out.connect(bus);
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
  constructor(ctx, destination, noise, song) {
    this.ctx = ctx;
    this.noise = noise;
    this.song = song;
    this.bus = ctx.createGain();
    // A song can turn itself down (or up) as a whole with `volume`.
    this.bus.gain.value = song.volume ?? 1;
    this.bus.connect(destination);
    this.channels = buildChannels(ctx, this.bus, song.instruments);
    ({ steps: this.steps, loopStart: this.loopStart } = compile(song));
    this.stepSeconds = 60 / song.bpm / song.stepsPerBeat;
    this.index = 0;
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
// (checking a song for errors, or how loud it gets).
export async function renderSong(song, seconds, sampleRate = 44100) {
  const ctx = new OfflineAudioContext(2, Math.ceil(sampleRate * seconds), sampleRate);
  await loadSamples(ctx, song);
  const master = ctx.createGain();
  master.gain.value = MASTER_VOLUME * (song.volume ?? 1);
  master.connect(ctx.destination);
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
// `peak` is the summit: no song there, only the wind.
const AMBIENCES = {
  mountain: { wind: 0.55, birds: 0.6 },
  summit: { wind: 0.9, birds: 0.25 },
  peak: { wind: 1.6, whoosh: 1 },
  village: { wind: 0.3, birds: 0.4 },
  cave: { wind: 0.12, drips: 0.8, hum: 0.5 },
  hearth: { fire: 0.6 },
};
export const AMBIENCE_NAMES = Object.keys(AMBIENCES);

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
    this.ambience = null;
    this.ambienceWanted = null;
    this.muted = false;
    window.addEventListener('keydown', (event) => {
      this.unlock();
      if (event.code === MUTE_KEY) this.toggleMute();
    });
    window.addEventListener('pointerdown', () => this.unlock());
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
    this.sfxBus = this.ctx.createGain();
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

  startAmbience(name) {
    this.ambience?.stop();
    this.ambience = null;
    if (!name) return;
    const spec = AMBIENCES[name];
    if (!spec) throw new Error(`Unknown ambience '${name}'`);
    this.ambience = new Ambience(this.ctx, this.master, this.noise, spec);
  }

  // How far into the current song we are, in seconds (null if nothing's
  // playing, or sound isn't allowed yet). For timing things to the music.
  get songTime() {
    if (!this.current) return null;
    return Math.max(0, this.ctx.currentTime - this.current.startTime);
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
    this.current = song ? new SongPlayback(this.ctx, this.master, this.noise, song) : null;
  }

  // Plays a sound effect from SFX. Silent until the first key press, like the music.
  sfx(name) {
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

  // Plays a song by name (looping), or stops the music with null, with the
  // `ambience` of the place under it (none, if left out: battles and menus
  // are quiet places). Asking for the song that's already playing just
  // changes the ambience.
  play(name, ambience = null) {
    this.setAmbience(ambience);
    if (name === this.wanted && (this.current || !this.ctx)) return;
    this.wanted = name;
    if (this.ctx) this.start(name);
  }

  start(name) {
    this.current?.stop();
    this.current = null;
    if (!name) return;
    const song = SONGS[name];
    if (!song) throw new Error(`Unknown song '${name}'`);
    this.current = new SongPlayback(this.ctx, this.master, this.noise, song);
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
