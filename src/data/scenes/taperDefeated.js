// TAPER DEFEATED: you fought her until her flame went out. Her home is cold
// and empty after this (see the "Shows up" settings in taperHome.js).
export const TAPER_DEFEATED = {
  // Triggers in rooms name the scene by this id.
  id: 'taper_defeated',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'way_out',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'taper', look: 'prop:taper', x: 32, y: 4, portrait: 'mother_taper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'taper', text: 'Heh... look at you. Such strong roots...\n\nStronger than any of them...' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: 'Go on, then, sprout. Grow somewhere bright.\n\nJust... not toward that light. Promise me...' },
    { do: 'sound', name: 'back' },
    { do: 'leave', who: 'taper' },
    { do: 'wait', seconds: 1.5 },
  ],
};
