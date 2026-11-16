// TAPER SPARED: you wouldn't fight her. She lets you go, gives you her
// candle, and goes home, where she'll be waiting.
export const TAPER_SPARED = {
  // Triggers in rooms name the scene by this id.
  id: 'taper_spared',
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
    { do: 'music', song: 'taper' },
    { do: 'say', who: 'taper', text: '{surprised}You put your hands down. Even now.\n\n{crying}Oh, sprout. You\'re kinder than this place deserves.' },
    { do: 'walk', who: 'taper', to: { x: 29, y: 5 } },
    { do: 'emote', who: 'taper', emote: '<3' },
    { do: 'say', who: 'taper', face: 'sad', text: 'I can\'t keep you in a pot forever. Things that grow need sky.\n\nI think I always knew that.' },
    { do: 'give', item: 'taper_stub' },
    { do: 'say', who: 'taper', text: 'Take my candle. It\'s only a stub, but it won\'t go out on you.\n\n{worried}If some other light ever calls to you out there... remember this one.' },
    { do: 'say', who: 'taper', text: '{crying}Go on, before I lose my nerve. Eat properly. Sleep when you\'re tired.\n\n{glee}And come home and visit. There will always be soup.' },
    { do: 'walk', who: 'taper', to: { x: 3, y: 4 } },
    { do: 'leave', who: 'taper' },
    { do: 'music', song: null },
  ],
};
