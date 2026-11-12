// PEPTUP'S DUEL: back in the throne hall once the light has gone up and the
// square has cheered. The king is on his throne, the folk crowd in behind you,
// and he is very loud and very bright and a little too pleased. He thanks you.
// He thanks you again, quieter, which is worse. Then he does the sum out loud
// (if just anybody can light the Sunstone, who needs a Hero? and who needs the
// Hero's friend?). The square has been calling you two "the Hero's friends",
// and the Hero, he says, has ONE friend. (He tells his story again, and it's
// different again: now he carried his sword, now it was fifty-eight years.)
// Then he calls a ROYAL DECREE: a duel, as a show. Ves points out
// that he's going to fight you from a chair.
//
// Then the battle `rumbold` (src/data/enemies/rumbold.js), which can't be run
// from. However it ends, `rumbold_spared` or `rumbold_defeated` plays next
// (rumboldAfter.js), and after them the hall comes down (theHallFalls.js).
//
// King Peptup may be voice-acted, the only character who is: each of his
// lines has a `voice: 'rumbold_duel_<n>'` on it (src/audio/voiceClips.js
// says which recording, if any, each one plays).
import { audienceActors, wave, hush, ON_THE_KING } from './hallFolk.js';

export const RUMBOLDS_DUEL = {
  // Triggers in rooms name the scene by this id.
  id: 'rumbolds_duel',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_throne',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 15, portrait: 'vesper', plays: 'vesper' },
    // The king (3 tiles wide) is cast from the middle of his footprint.
    { id: 'king', look: 'prop:bf_rumbold', x: 11, y: 7, portrait: 'rumbold', plays: 'rumbold', centered: true },
    ...audienceActors(),
  ],

  steps: [
    { do: 'music', song: 'peptup' },
    // (The trigger runs wall to wall: onto the aisle first, whichever side you
    // stepped in from, so nobody walks through the crowd.)
    { do: 'walk', who: 'player', to: { x: 12, y: 15 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 15 } },
    { do: 'walk', who: 'player', to: { x: 12, y: 12 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 12 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    // (Held a little low, so the text box doesn't sit on the two of you.)
    { do: 'camera', to: { x: 13, y: 10.5 } },
    { do: 'stage', spots: ON_THE_KING, dim: 0.2, seconds: 0.8, confetti: 2 },
    ...wave(0.06),
    { do: 'wait', seconds: 0.6 },

    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    { do: 'say', who: 'king', text: '{shouting}MY FRIENDS! What a day! What a SHOW!', voice: 'rumbold_duel_1' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'sound', name: 'burst' },
    ...hush(),
    ...wave(0.05),
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    { do: 'say', who: 'king', text: '{proud}Two strangers come down from the top... and do what only the Hero could do!', voice: 'rumbold_duel_2' },
    { do: 'say', who: 'king', text: '{laughing}I heard them out in the square! "THE HERO\'S FRIENDS!" Ha ha! Ha ha...', voice: 'rumbold_duel_7' },
    { do: 'wait', seconds: 0.5 },

    // Quieter, which is worse. The lights narrow; the hall stops cheering.
    { do: 'music' },
    ...hush(),
    { do: 'stage', spots: [{ onto: 'king', color: '255, 236, 190', radius: 36 }], dim: 0.5, seconds: 1.2 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold', speed: 0.6 },
    { do: 'wait', seconds: 1.4 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.2 },
    { do: 'say', who: 'king', text: '{sly}...What only the Hero could do.', voice: 'rumbold_duel_3' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'king', text: '{sly}The Hero has ONE friend. I came down that stair with him. I carried his SWORD.\n\nI was lost in the dark for fifty-eight years.', voice: 'rumbold_duel_8' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'king', text: '{sly}But if just anybody can light the Sunstone... what does anybody need a Hero for?\n\nAnd if nobody needs a Hero...', voice: 'rumbold_duel_4' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'king', text: '{sly}...what does anybody need the Hero\'s FRIEND for?', voice: 'rumbold_duel_5' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold', speed: 0.6 },
    // (The frog child at the front looks round for an answer; a mole along
    // the row shakes its head at him.)
    { do: 'act', who: 'kid', act: 'look', wait: false },
    { do: 'act', who: 'a2', act: 'shake', wait: false },
    { do: 'say', text: 'Nobody in the hall moves. Near the front, a frog child asks what\'s going on, and is hushed.' },
    { do: 'act', who: 'ves', act: 'look' },

    // The roar.
    { do: 'stage', spots: ON_THE_KING, dim: 0.25, seconds: 0.3, confetti: 3 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.12 },
    { do: 'say', who: 'king', text: '{outraged}BY ROYAL DECREE!\n\n{shouting}A DUEL! The finest show Belowtown has ever SEEN!', shake: true, voice: 'rumbold_duel_6' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.3, once: true },
    { do: 'sound', name: 'boom' },
    { do: 'quake', amount: 2, seconds: 0.6 },
    ...wave(0.04),
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{bored}He\'s going to fight us.\n\n{glee}...From a chair.' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    { do: 'say', who: 'king', text: '{proud}The Hero\'s friend does not GET UP for anybody!', voice: 'rumbold_duel_9' },
    { do: 'stage', spots: ON_THE_KING, dim: 0.4, seconds: 0.8 },
    ...hush(),
    { do: 'animate', who: 'king', animation: 'bf_rumbold', speed: 0.6 },
    { do: 'wait', seconds: 0.6 },
    // He never moves: the lunge is left out (`still`), and there's no running.
    { do: 'battle', enemy: 'rumbold', who: 'king', still: true, noRun: true, noRunText: 'duel_no_run', spared: 'rumbold_spared', defeated: 'rumbold_defeated' },
  ],
};
