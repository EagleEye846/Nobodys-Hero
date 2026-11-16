// VES AND THE WIND: at the second cairn, the first wind geyser. Crossing the
// terrace towards the sheer face, Ves sees the snow at its foot falling
// upwards. Early on she doesn't want anyone with her: she's curt, bored,
// a little rude, and only lets you come because you're there. (That's the
// start of her growing up the mountain: compare the hut, vesInTheHut.js.)
// Plays once, on the band across the terrace (vigilSecondCairn.js); she's
// following you the whole time, so the actor here is only her face in the textbox.
export const VES_AND_THE_WIND = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_and_the_wind',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_second_cairn',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 14, portrait: 'vesper', hidden: true },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{bored}Stop. ...The snow\'s falling up.\n\n{bored}Of course it is.' },
    { do: 'camera', to: { x: 5, y: 12 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{thoughtful}Mum used to say the mountain breathes up here. Long slow breaths, straight up the rock.\n\n{bored}I thought it was a bedtime story. Turns out it\'s a draught.' },
    { do: 'say', who: 'ves', text: '{bored}I\'m going up it. You can come or not. Honestly, I don\'t mind which.' },
    { do: 'camera' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{bored}...Fine. When I lift, grab my boot. The boot. Not my coat, not my scarf, and not my hair.\n\n{angry}And don\'t kick. And don\'t talk.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'ves', text: '{bored}Good. You\'re already better at the not-talking than most people.' },
  ],
};
