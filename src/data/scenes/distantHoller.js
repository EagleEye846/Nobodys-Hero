// A DISTANT HOLLER: crossing the Felled Run, you hear someone yelling,
// somewhere ahead in the Hushwood. Small, and furious, and not giving an
// inch. (It's Bramble, cornered in the Hollow Oak: see bramble_cornered.)
export const DISTANT_HOLLER = {
  // Triggers in rooms name the scene by this id.
  id: 'distant_holler',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_felled_run',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'GET OFF! GET OFF MY STUMP! I\'M WARNING YOU! I\'VE GOT A HATCHET!', shake: true },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: '...A BIG ONE!', shake: true },
    { do: 'wait', seconds: 0.4 },
  ],
};
