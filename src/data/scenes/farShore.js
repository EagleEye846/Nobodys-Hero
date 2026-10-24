// FAR SHORE: the end of the marsh. Dry ground at last, and far off in the
// dusk to the east, a valley, and the broken towers of a city in it, and
// lights in its windows. Ves has gone quiet on your back. She's (not) asleep.
export const FAR_SHORE = {
  // Triggers in rooms name the scene by this id.
  id: 'far_shore',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_far_shore',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 7, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 18, y: 7 } },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'camera', to: { x: 25, y: 7 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'The fen ends. The ground goes on east and down, into a long valley, and far off in it, in the dusk, there are towers. Broken ones. And lights in some of the windows.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{awed}Windows. Real ones. Somebody lives down there.\n\n{grin}Ves! Ves, look!' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{thinking}...Is she asleep?' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'ves', text: '{exhausted}...\'m not asleep. I\'m resting my eyes.\n\n...Are we nearly there?' },
    { do: 'say', who: 'bramble', text: '{tired}Nearly.\n\n{determined}Nearly. It means nearly there.' },
  ],
};
