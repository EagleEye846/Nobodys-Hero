import { SONGS } from '../data/music/index.js';
import { HOLD, HIT } from './notation.js';

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
  // An enemy jumping out of hiding.
  ambush: [
    { midi: 76, wave: 'square', length: 0.06, volume: 0.05 },
    { midi: 88, wave: 'square', length: 0.12, volume: 0.05, delay: 0.06, slide: 4 },
  ],
  // A soft blip as cutscene text types out.
  type: [{ midi: 67, wave: 'triangle', length: 0.03, volume: 0.04 }],
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
// the notes and drum hits that start on it.
function compile(song) {
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

function playTone(ctx, channel, instrument, midi, time, seconds) {
  const { wave = 'square', volume, attack = 0.005, decay = 0.1, sustain = 0.7, release = 0.08, gate = 0.9, vibrato } = instrument;
  const end = time + seconds * gate;

  const osc = ctx.createOscillator();
  osc.type = wave;
  osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(volume, time + attack);
  envelope.gain.setTargetAtTime(volume * sustain, time + attack, decay);
  envelope.gain.setTargetAtTime(0, end, release / 3);
  osc.connect(envelope).connect(channel);

  if (vibrato) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = vibrato.rate;
    depth.gain.value = vibrato.depth;
    lfo.connect(depth).connect(osc.detune);
    lfo.start(time);
    lfo.stop(end + release * 2);
  }

  osc.start(time);
  osc.stop(end + release * 2);
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

// One channel per instrument, with an optional filter (to soften harsh waves)
// and echo, all into the song's bus.
function buildChannels(ctx, bus, instruments) {
  const channels = {};
  for (const [name, instrument] of Object.entries(instruments)) {
    const channel = ctx.createGain();
    if (instrument.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = instrument.filter.type;
      filter.frequency.value = instrument.filter.frequency;
      channel.connect(filter).connect(bus);
    } else {
      channel.connect(bus);
    }
    if (instrument.echo) {
      const delay = ctx.createDelay(2);
      const feedback = ctx.createGain();
      const wet = ctx.createGain();
      delay.delayTime.value = instrument.echo.time;
      feedback.gain.value = instrument.echo.feedback;
      wet.gain.value = instrument.echo.mix;
      channel.connect(delay);
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
    this.bus.connect(destination);
    this.channels = buildChannels(ctx, this.bus, song.instruments);
    ({ steps: this.steps, loopStart: this.loopStart } = compile(song));
    this.stepSeconds = 60 / song.bpm / song.stepsPerBeat;
    this.index = 0;
    this.nextTime = ctx.currentTime + 0.05;
    this.timer = setInterval(() => this.schedule(), TICK_MS);
    this.schedule();
  }

  schedule() {
    const now = this.ctx.currentTime;
    // If the tab was in the background, skip ahead rather than playing a backlog.
    if (this.nextTime < now - 0.2) this.nextTime = now;
    while (this.nextTime < now + LOOKAHEAD_SECONDS) {
      for (const event of this.steps[this.index]) this.play(event, this.nextTime);
      this.nextTime += this.stepSeconds;
      this.index = this.index + 1 >= this.steps.length ? this.loopStart : this.index + 1;
    }
  }

  play(event, time) {
    const instrument = this.song.instruments[event.track];
    const channel = this.channels[event.track];
    if (instrument.drum) DRUMS[instrument.drum](this.ctx, channel, this.noise, time, instrument.volume);
    else playTone(this.ctx, channel, instrument, event.midi, time, event.length * this.stepSeconds);
  }

  stop() {
    clearInterval(this.timer);
    this.bus.gain.setTargetAtTime(0, this.ctx.currentTime, FADE_SECONDS / 3);
    setTimeout(() => this.bus.disconnect(), (FADE_SECONDS + 1) * 1000);
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

  // Plays a song by name (looping), or stops the music with null.
  // Asking for the song that's already playing does nothing.
  play(name) {
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
