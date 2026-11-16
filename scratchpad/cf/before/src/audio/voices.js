import { sfx } from './music.js';
import { SETTINGS } from '../state/settings.js';

// Talking voices: as someone's words type out, a soft blip every other
// letter, in a voice of their own (the `voice...` sounds in the SFX table in
// music.js). Spaces and punctuation are silent. Turned off with TEXT SOUNDS
// in OPTIONS. The hero never speaks, so has no voice; nor do signs, notes
// and the words of the world (a text box with no speaker).
//
// Who sounds like what goes by their id: an NPC id (as in text/npcs/), a
// portrait id, a cutscene actor's `portrait`, `plays` or own id, or a shop
// id. The first rule that matches wins; anyone else gets one of three plain
// voices, low, middling or high, always the same one for the same person.
const RULES = [
  [/^(vesper|ves)(_|$)/, 'voiceVes'],
  [/^bramble/, 'voiceBramble'],
  [/^(old_keeper|keeper)$/, 'voiceKeeper'],
  [/taper/, 'voiceTaper'],
  [/^(haddock|the_bother)/, 'voiceHaddock'],
  [/^corrie/, 'voiceCorrie'],
  [/^(rumbold|king)$/, 'voiceKing'],
  [/^usurper/, 'voiceUsurper'],
  // Kids, small folk and little critters.
  [/(kid|frogkid|^tuck$|^lh_wren$|cheer|^f1$)/, 'voiceSmall'],
  [/(bat|grig|^g1$|glowworm)/, 'voiceSqueak'],
  // The slow ones: snails, the tortoise, Slowly, the owl.
  [/(snail|tolliver|slowly|owl)/, 'voiceSlow'],
  // Moles, miners, smiths and guards: low and gruff.
  [/(mole|miner|mattock|sedge|winder|^m1$|forge|smith|hobnail|guard|goblin)/, 'voiceGruff'],
  // Old folk.
  [/(old_nan|nan_cinder|cinder_stall|mabb|mrs_pottle|^lh_tam$)/, 'voiceElder'],
  // Behind a counter.
  [/(shop|stall|stores|market|chandlery|rummage|innkeeper|vendor|haggler|clerk|marigold|ladle)/, 'voiceShop'],
];
const PLAIN = ['voiceLow', 'voiceMid', 'voiceHigh'];
// Nobody to hear: the honesty tin in Hollin keeps no shopkeeper.
const SILENT = new Set(['hollin_stores', 'player', 'hero']);

const chosen = new Map();
// The voice for speaker `id`, or null for none.
export function voiceFor(id) {
  if (typeof id !== 'string' || !id || SILENT.has(id)) return null;
  if (!chosen.has(id)) {
    const rule = RULES.find(([test]) => test.test(id));
    let hash = 0;
    for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    chosen.set(id, rule ? rule[1] : PLAIN[hash % PLAIN.length]);
  }
  return chosen.get(id);
}

// Letters (and digits) speak; spaces, stops, dashes and the like don't.
const SPOKEN = /[\p{L}\p{N}]/u;

// Blips for the letters of `text` from `from` up to `to` (not including it)
// that have just typed out. `counter` is an object kept for the page
// ({ letters: 0 } at its start), so every other letter speaks across frames.
// One blip a frame at most, so quick text is not a burst of them.
export function speak(voice, text, from, to, counter) {
  if (!voice || SETTINGS.textSounds === false) return;
  let due = false;
  for (let i = from; i < to; i++) {
    if (!SPOKEN.test(text[i] ?? '')) continue;
    if (counter.letters++ % 2 === 0) due = true;
  }
  if (due) sfx(voice);
}
