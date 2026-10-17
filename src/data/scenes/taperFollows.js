// TAPER FOLLOWS: as you start down the way out, Taper comes down the stairs
// after you, worried, and hurries on ahead to the door. She's waiting there
// when you arrive (a prop in wayOut.js that shows up after this scene).
export const TAPER_FOLLOWS = {
  // Triggers in rooms name the scene by this id.
  id: 'taper_follows',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'way_out',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'taper', look: 'prop:taper', x: 2, y: 1, portrait: 'mother_taper', hidden: true },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'door' },
    { do: 'appear', who: 'taper' },
    { do: 'walk', who: 'taper', to: { x: 2, y: 3 }, fast: true },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'emote', who: 'taper', emote: '!' },
    { do: 'say', who: 'taper', text: 'Sprout? Oh, there you are. I turned around and you were gone.\n\nThis hall... this hall only goes one place.' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: 'Wait here for me, would you? Just for a moment.\n\nThere\'s something I have to do.' },
    { do: 'walk', who: 'taper', to: { x: 8, y: 5 }, fast: true },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'walk', who: 'taper', to: { x: 24, y: 5 }, fast: true },
    { do: 'leave', who: 'taper' },
    { do: 'wait', seconds: 0.4 },
  ],
};
