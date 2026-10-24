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
    { do: 'say', who: 'taper', text: '{surprised}Oh! Oh, goodness, mind the moonbells... No, no, you\'re alright.\n\nCome here. Let me look at you.' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: 'Not a scratch. Just cold, and a little lost. That I can fix.\n\nYou\'re not the Hero, are you? That\'s alright. I\'ve a soft spot for strays.' },
    { do: 'say', who: 'taper', text: 'I\'m Taper. I tend the flowers down here, and the little candles.\n\n{glee}And now, it seems, you. Hello, sprout.' },
    { do: 'say', who: 'taper', text: 'Come up to my house and get warm. There\'s soup on the fire, and a spare blanket.\n\nUp those stairs. I\'ll go ahead and stoke the fire.' },
    { do: 'walk', who: 'taper', to: { x: 10, y: 3 } },
    { do: 'leave', who: 'taper' },
    { do: 'music', song: 'ruins' },
  ],
};
