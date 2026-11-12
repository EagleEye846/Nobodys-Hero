// MEET TAPER: Mother Taper is watering her flowers in the Flower Room when you
// come in, and takes you in hand. Her song plays while she talks. Then she
// goes up the stairs to her home, where she waits (text/npcs/mother_taper.txt).
export const MEET_TAPER = {
  // Triggers in rooms name the scene by this id.
  id: 'meet_taper',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'flower_room',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'taper', look: 'prop:taper', x: 10, y: 5, portrait: 'mother_taper', plays: 'mother_taper', animation: 'taper_watering' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: 'taper' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 1.4 },
    { do: 'emote', who: 'player', emote: '?' },
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'taper' },
    { do: 'emote', who: 'taper', emote: '!' },
    { do: 'walk', who: 'taper', to: { x: 10, y: 11 } },
    { do: 'say', who: 'taper', text: '{surprised}Oh! Mind the moonbells, they bruise if you look at them wrong.\n\nWell. You\'re not a weed, at least. Hold still.' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: 'Cold, a bit lost, roots showing. I\'ve seen worse come up through these flagstones.\n\nYou\'re not the Hero, are you? No. Well, the Hero\'s late. You\'ll do.' },
    { do: 'say', who: 'taper', text: 'I\'m Taper. I keep the flowers down here, and the little candles, and now apparently you.\n\n{glee}Hello, sprout. That\'s what you are, so that\'s what I\'ll call you.' },
    { do: 'say', who: 'taper', text: 'My house is up those stairs. There\'s soup, and a blanket that\'s seen better winters.\n\nDon\'t dawdle. I\'ve left the kettle on.' },
    { do: 'walk', who: 'taper', to: { x: 10, y: 3 } },
    { do: 'leave', who: 'taper' },
    { do: 'music', song: 'ruins' },
  ],
};
