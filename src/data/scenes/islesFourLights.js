// ISLES FOUR LIGHTS: up out of the Soundings' stair and into the wind, the first look at the
// Beacon Isles: little lights on their rocks out across the water, one turning, one dark, and
// far off to the east a taller one with a warm window. Bramble finds out how much sea there is.
// (The hero never speaks.) The walks stay on the path below the cave (rows 6 to 8, x 5 to 10);
// the landing has no monsters.
export const ISLES_FOUR_LIGHTS = {
  id: 'isles_four_lights',
  room: 'isles_landing',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    // The camera goes out over the water, rock by rock: one lighthouse turning, one dark, then far off to the
    // east a taller one with a warm window low down. (draft)
    { do: 'camera', to: { x: 13, y: 5 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera', to: { x: 24, y: 5 } },
    { do: 'wait', seconds: 1.6 },
    { do: 'camera' },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 7 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.6 },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{scared}...It\'s all sea. Every way. Even behind.' },
    { do: 'walk', who: 'ves', to: { x: 7, y: 6 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{smile}Four lighthouses, by the look of it.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{proud}Three. That one\'s off.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{angry}Three and a half, then. Don\'t count at me. The sea isn\'t going anywhere.' },
    { do: 'say', who: 'ves', text: '{bored}The lit ones are burning green-white. I wouldn\'t look straight at one.' },
    { do: 'say', who: 'bramble', text: '{worried}That\'s what I\'m worried about.' },
    { do: 'act', who: 'bramble', act: 'shiver', wait: false },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
