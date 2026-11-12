import { music, sfx } from '../audio/music.js';
import { cellIn } from '../data/music/parts/chapter4.js';
import { hasGear } from '../data/gear.js';

// Singing crystals (Chapter 4's Glimmering, optional): a set of crystals that
// each ring a different note when you press Z on them. Ring them in the order
// of a tune and the cavern answers: they light up in turn, the whole tune
// plays back fuller, and the switch the set `opens` goes on for good (a gate
// answering to it opens, like a lever's: see the builders' guide).
//
// A prop opts in with `chime: { set: 'cavern', note: 0 }`: `set` names an
// entry below, `note` is which of the set's notes it rings (0 is the lowest).
// The set's `tune` is written as note numbers and matched to the crystals by
// pitch, so the order to ring them is whatever the tune says, and how tall
// each crystal stands is up to the room (taller for higher is the kind thing).
export const CHIME_SETS = {
  // The Fair Return's harmonium, in the crew's quarters (Chapter 5, the ghost ship): four keys, and the crew's
  // shanty "Port Tomorrow" (src/data/music/parts/ghostShip.js) as far as its first phrase: C C D Eb D C (60 60 62 63 62 60). A reed voice, the real clarinet; it plays itself now and
  // then (haunt.js `selfPlay`), the tune the crew sang for the pipes at the end of a watch. Opens the
  // bulkhead door to the gun deck.
  ship: {
    notes: [60, 62, 63, 67],
    tune: [60, 60, 62, 63, 62, 60],
    opens: 'ship_tune',
    sample: 'clarinet',
    octave: 0,
  },
  // The chapter's four-note tune (the first cell, in C: G C E D), for the
  // four crystals on the King's Road. G4 C5 D5 E5 are 67 72 74 76; the glock
  // rings an octave above.
  cavern: {
    notes: [67, 72, 74, 76],
    tune: cellIn('C5'),
    opens: 'cavern_song',
    sample: 'glock',
    octave: 1,
  },
  // The Whistle Gallery under Seam Nine (Chapter 4's secret, src/data/rooms/diggingsStarGallery.js):
  // the miners' end-of-shift whistle, B G E and F-sharp up (three long down, one short up: the
  // tune of src/data/music/starSeamTheme.js). Notes E4 F#4 G4 B4 (64 66 67 71), the glock an
  // octave above. Opens the gate to the Last Camp.
  seam: {
    notes: [64, 66, 67, 71],
    tune: [71, 67, 64, 66],
    opens: 'seam_tune',
    sample: 'glock',
    octave: 1,
  },
  // Chapter 5's Merrow: the three practice bells in the drowned square, rung the way the town's
  // tower rings in its song (merrowTheme.js: G4 C5 C5 D5 on the same 'chimes', no octave
  // shift, so they sound at the song's pitch). Opens the ringers' hall door.
  merrow: {
    notes: [67, 72, 74],
    tune: [67, 72, 72, 74],
    opens: 'merrow_peal',
    sample: 'chimes',
    octave: 0,
  },
};

// How long the lit crystals wait for the next note before the tune starts over.
const PATIENCE = 12;
// The gap between notes when the cavern plays the tune back.
const ANSWER_STEP = 0.62;
// The footsteps of someone carrying the Singing Shard: the cell, one note a step.
const STEP_NOTES = cellIn('C5');

export class Chimes {
  constructor(scene) {
    this.scene = scene;
    // How far along the tune each set is: how many of its notes in a row have been rung right.
    this.progress = new Map();
    // The cavern's answer, playing: { set, t, step, order } or null.
    this.answer = null;
    // Seconds since the last note rung right (the tune starts over after PATIENCE).
    this.idle = 0;
    this.stepCount = 0;
    this.warmed = false;
  }

  get props() {
    return this.scene.room.props.filter((p) => p.chime);
  }

  // Whether this set has been sung already (the switch it opens is on).
  solved(set) {
    return this.scene.room.isLeverOn(CHIME_SETS[set].opens);
  }

  // The crystals of a set, in the order the tune wants them rung.
  tuneOrder(set) {
    const { notes, tune } = CHIME_SETS[set];
    const crystals = this.props.filter((p) => p.chime.set === set);
    return tune.map((midi) => crystals.find((p) => notes[p.chime.note] === midi)).filter(Boolean);
  }

  // The note a crystal rings, with the set's voices: bright on top, a bowed
  // bell under it. `full` adds the harp and a cello, for the cavern's answer.
  sound(prop, { full = false } = {}) {
    const set = CHIME_SETS[prop.chime.set];
    const midi = set.notes[prop.chime.note];
    music.chime(set.sample, midi, { octave: set.octave, volume: full ? 0.26 : 0.3, seconds: 1.2 });
    music.chime('vibesBowed', midi, { volume: full ? 0.2 : 0.12, seconds: 1.6, attack: 0.04 });
    if (full) {
      music.chime('harp', midi, { volume: 0.22, seconds: 1.2 });
      music.chime('cellos', midi - 12, { volume: 0.16, seconds: 1.5, attack: 0.1 });
    }
  }

  light(prop, on) {
    prop.setOn(on);
  }

  // The tune forgotten: every crystal in the set dark.
  reset(name) {
    for (const crystal of this.props.filter((p) => p.chime.set === name)) this.light(crystal, false);
    this.progress.set(name, 0);
  }

  // Z on a crystal. Always takes the press (the room says nothing more).
  ring(prop) {
    const name = prop.chime.set;
    if (!this.warmed) {
      this.warmed = true;
      music.warm(CHIME_SETS[name].sample, 'vibesBowed', 'harp', 'cellos');
    }
    // The cavern is singing; wait for it.
    if (this.answer) return true;
    this.sound(prop);
    prop.ringing = 0.5;
    this.idle = 0;
    // Already sung: just a chime, whenever you like.
    if (this.solved(name)) return true;
    const order = this.tuneOrder(name);
    const done = this.progress.get(name) ?? 0;
    if (prop === order[done]) {
      this.light(prop, true);
      this.progress.set(name, done + 1);
      if (done + 1 === order.length) this.startAnswer(name, order);
      return true;
    }
    // Wrong: a dull clink, the lit ones go out, and this one shivers. If it
    // happens to be the tune's first note, the tune starts over from there.
    sfx('clink');
    prop.shake = 0.35;
    this.reset(name);
    if (prop === order[0]) {
      this.light(prop, true);
      this.progress.set(name, 1);
    }
    return true;
  }

  // All four right: they go dark, and the cavern plays the tune back one
  // crystal at a time, fuller than you played it.
  startAnswer(name, order) {
    this.reset(name);
    this.answer = { set: name, t: -0.9, step: 0, order };
  }

  update(dt) {
    this.idle += dt;
    if (this.idle > PATIENCE && !this.answer) {
      for (const [name, done] of this.progress) if (done) this.reset(name);
    }
    for (const prop of this.props) {
      if (prop.shake > 0) prop.shake = Math.max(0, prop.shake - dt);
      if (prop.ringing > 0) prop.ringing = Math.max(0, prop.ringing - dt);
    }
    const answer = this.answer;
    if (!answer) return;
    answer.t += dt;
    const { order, set } = answer;
    while (answer.step < order.length && answer.t >= answer.step * ANSWER_STEP) {
      const prop = order[answer.step++];
      this.sound(prop, { full: true });
      this.light(prop, true);
      prop.ringing = 0.7;
    }
    // Once the last has rung a moment: the crystals stay lit, and the cavern opens.
    if (answer.step >= order.length && answer.t >= (order.length - 1) * ANSWER_STEP + 0.9) {
      this.answer = null;
      this.finish(set, order);
    }
  }

  finish(set, order) {
    this.scene.room.flipLever(CHIME_SETS[set].opens);
    // A full chord under the last note, and the stone giving way.
    const root = CHIME_SETS[set].notes[0];
    [root, root + 5, root + 9, root + 12].forEach((midi, i) => {
      music.chime('harp', midi, { volume: 0.2, seconds: 2.4, release: 1.6, delay: i * 0.05 });
      music.chime('vibesBowed', midi, { volume: 0.14, seconds: 2.6, release: 1.8, delay: i * 0.05, attack: 0.08 });
    });
    sfx('door');
    for (const crystal of order) this.light(crystal, true);
    this.scene.say(this.scene.roomData.textFile, 'chime_answered');
  }

  // A step by someone carrying the Singing Shard in the Glimmering: one note
  // of the tune, quietly, for every step, round and round.
  footstep() {
    if (!hasGear('singing_shard') || this.scene.roomData.area !== 'glimmer') return;
    const midi = STEP_NOTES[this.stepCount++ % STEP_NOTES.length];
    music.chime('glock', midi, { octave: 1, volume: 0.07, seconds: 0.5, release: 0.6 });
  }
}
