// MEET TAPER: Mother Taper is watering her flowers in the Flower Room when you
// come in, like Toriel finding you. Her song plays while she talks. Then she
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
    { do: 'say', who: 'taper', text: 'Oh! Oh, my. A little one, all alone down here.\n\nAre you hurt? Come, let me look at you.' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: 'You\'re not the Hero, are you? No... the Hero would have come long ago.\n\nNever mind that. Hero or not, you\'re cold, and that\'s enough for me.' },
    { do: 'say', who: 'taper', text: 'I\'m Taper. I look after the little candles of these halls. And my flowers.\n\nI suppose I\'ll look after you, too.' },
    { do: 'say', who: 'taper', text: 'The halls ahead can be unkind. Come home with me first, and get warm.\n\nIt\'s just up those stairs. I\'ll put the kettle on.' },
    { do: 'walk', who: 'taper', to: { x: 10, y: 3 } },
    { do: 'leave', who: 'taper' },
    { do: 'music', song: 'ruins' },
  ],
};
