import { music } from './music.js';
import { SETTINGS } from '../state/settings.js';
import { voiceOf } from '../engine/textLoader.js';

// Recorded lines: short barks that play over the start of a line while the
// text box (or speech bubble) still shows all of it, the way Undertale and
// Deltarune do it. Only King Peptup is voiced (the script, with which
// recording is which, is notes/docs/peptup-voice-lines.md).
//
// A line is voiced by its id:
//   in a text file, a `# voice: <id>` comment above the entry (textLoader.js
//   keeps it with the entry's words, see voiceOf);
//   in a cutscene, a `voice: '<id>'` on its say step.
// VOICE_LINES says which recording each id plays: assets/audio/voice/
// peptup/<n>.ogg. A number plays at the start of the line; a list is one per
// page (a cutscene's pages) or per bubble (a battle line written over several
// bubbles), `null` for a part with none; a list inside the list is two
// recordings one after the other. While one plays, the line's typing blips
// keep quiet. TEXT SOUNDS off in OPTIONS turns these off too.
//
// The recordings are made from the raw takes by notes/voice-preview/process.py
// (one command, at whichever strength of the old-TV sound).
const FOLDER = 'assets/audio/voice/peptup';

export const VOICE_LINES = {
  // His welcome (theKingsWelcome.js).
  rumbold_welcome_1: 1,
  rumbold_welcome_2: 2,
  rumbold_welcome_3: [null, 3],
  rumbold_welcome_4: 4,
  rumbold_welcome_5: 5,
  rumbold_welcome_7: 6,
  rumbold_welcome_8: 7,
  rumbold_welcome_18: 8,
  rumbold_welcome_19: 9,
  rumbold_welcome_20: [null, 10],
  rumbold_welcome_10: 11,
  rumbold_welcome_11: 12,
  rumbold_welcome_12: 13,
  rumbold_welcome_14: [null, 14],
  // Walking up to him in his hall (text/npcs/rumbold.txt).
  rumbold_hall_1: 15,
  rumbold_hall_2: 16,
  rumbold_hall_3: 17,
  // The duel scene (rumboldsDuel.js).
  rumbold_duel_1: 18,
  rumbold_duel_3: 19,
  rumbold_duel_8: 20,
  rumbold_duel_6: [21, 22],
  rumbold_duel_9: 23,
  // The fight (text/enemies/rumbold.txt). The show:
  rumbold_battle_1: 24,
  rumbold_battle_2: 25,
  rumbold_battle_3: 26,
  rumbold_battle_4: 27,
  rumbold_battle_6: 28,
  rumbold_battle_7: 29,
  rumbold_battle_13: 30,
  rumbold_battle_77: [null, 31],
  rumbold_battle_31: 32,
  rumbold_battle_33: 33,
  rumbold_battle_35: [null, 34],
  rumbold_battle_26: 35,
  rumbold_battle_30: 36,
  // Behind the curtain (Tuck doing the voice):
  rumbold_battle_16: 37,
  rumbold_battle_24: 37,
  rumbold_battle_25: 38,
  rumbold_battle_17: 39,
  rumbold_battle_19: 40,
  rumbold_battle_22: 41,
  rumbold_battle_38: 42,
  rumbold_battle_39: 43,
  rumbold_battle_41: [null, 44],
  // No strings (the last act):
  rumbold_battle_43: 46,
  rumbold_battle_44: [47, 48],
  rumbold_battle_45: [null, 49],
  rumbold_battle_78: [null, 50],
  rumbold_battle_79: 50,
  rumbold_battle_46: [null, 51],
  rumbold_battle_47: 52,
  rumbold_battle_49: 53,
  rumbold_battle_51: [null, 54],
  rumbold_battle_52: 55,
  rumbold_battle_53: [null, 56],
  rumbold_battle_55: [null, 57],
  rumbold_battle_80: 58,
  rumbold_battle_56: [null, 59],
  rumbold_battle_57: [null, 60],
  rumbold_battle_59: 61,
  rumbold_battle_87: [null, 62],
  rumbold_battle_61: [null, 63],
  rumbold_battle_62: 64,
  rumbold_battle_65: 65,
  rumbold_battle_66: [null, 66],
  rumbold_battle_68: 67,
  rumbold_battle_69: 68,
  rumbold_battle_83: [null, 69],
  rumbold_battle_72: 70,
  rumbold_battle_84: [null, 71],
  // His finale, as his head swells (rumboldAlive.js's tear).
  rumbold_finale: 72,
  // The end, spared (this ending can't happen at the moment; ready if it comes back):
  rumbold_battle_73: 73,
  rumbold_battle_74: 74,
  rumbold_battle_85: 75,
  // The end, beaten:
  rumbold_battle_75: 76,
  rumbold_battle_76: 77,
  rumbold_battle_86: [null, 78],
};

// The recordings for line `id` split into `count` parts (pages or bubbles):
// a list for each part, or null for a part with none. A line with more
// recordings than parts plays the rest after the last part's.
export function lineClips(id, count = 1) {
  const parts = Array.from({ length: count }, () => null);
  const spec = id ? VOICE_LINES[id] : null;
  if (spec == null || count < 1) return parts;
  const list = Array.isArray(spec) ? spec : [spec];
  list.forEach((clip, i) => {
    if (clip == null) return;
    const at = Math.min(i, count - 1);
    parts[at] = [...(parts[at] ?? []), ...[clip].flat()];
  });
  return parts;
}

// The recordings for an entry of a text file (its `# voice:` comment), or null.
export function textClips(text) {
  return lineClips(voiceOf(text), 1)[0];
}

const url = (clip) => `${FOLDER}/${clip}.ogg`;
let playing = null;
// For the checks: the last few recordings asked for, newest last.
export const VOICE_REQUESTS = [];

// Plays `clips` (a list, from lineClips), cutting short whatever was still
// playing. Gives back whether anything is playing now. Nothing plays with
// TEXT SOUNDS off, or while a cutscene is skipped through.
export function sayClips(clips) {
  stopVoice();
  if (!clips?.length || SETTINGS.textSounds === false || music.hushed) return false;
  VOICE_REQUESTS.push(clips.join('+'));
  if (VOICE_REQUESTS.length > 60) VOICE_REQUESTS.shift();
  playing = music.voice(clips.map(url));
  return Boolean(playing);
}

// Plays line `id` as it starts (a line with no words on screen: his scream).
export function sayLine(id) {
  return sayClips(lineClips(id, 1)[0]);
}

// The words moved on (the next page, the next bubble, the box shut): the
// recording fades out at once.
export function stopVoice() {
  playing?.stop();
  playing = null;
}

// Loads every recording ahead, so the first line isn't late.
let warmed = false;
export function warmVoices() {
  if (warmed || !music.ctx) return;
  warmed = true;
  const clips = new Set(Object.values(VOICE_LINES).flat(2).filter((clip) => clip != null));
  for (const clip of clips) music.loadVoice(url(clip));
}
