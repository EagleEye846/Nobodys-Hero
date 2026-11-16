// HUT WAKE: waking from the lantern dream (hutDream.js), with a start and in
// a cold sweat, sitting bolt upright in the cot. Ves has been up all night,
// sitting by the door. She sees your face, and tells you what she heard:
// nothing. Nobody said anything. Only the wind, and her mother's lamp creaking
// on its hook outside. To take your mind off it she tells you about the time
// she got lost in a cave as a little girl, in the dark with the bats; she's
// been terrified of them ever since. Then you get up.
// Plays straight after the dream (its `wakeScene`). The actor `plays` Ves from
// where she sat (`ahead`), and she falls back in behind you where it leaves her.
export const HUT_WAKE = {
  // Triggers in rooms name the scene by this id.
  id: 'hut_wake',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_lamplighters_hut',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 7, portrait: 'vesper', plays: 'vesper', ahead: true, animation: 'ves_sit', speed: 1.2 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'bed', pose: 'sitting' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'emote', who: 'player', emote: 'sweat' },
    { do: 'animate', who: 'ves' },
    { do: 'walk', who: 'ves', to: { x: 6, y: 7 }, fast: true },
    { do: 'walk', who: 'ves', to: { x: 8, y: 6 }, fast: true },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{worried}Hey. Hey! You were thrashing around like you were fighting someone off.' },
    { do: 'emote', who: 'player', emote: 'sweat' },
    { do: 'say', who: 'ves', text: '{worried}You\'re soaked through. You look like you\'ve seen a ghost.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}Did you hear something? I\'ve been sat by the door the whole time.\n\n{thoughtful}Nobody said anything. Just the wind. And her lamp outside, creaking on its hook.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{tender}...It was a dream, that\'s all. This place would give anyone bad dreams.\n\n{thoughtful}I used to get them all the time. After the cave.' },
    { do: 'emote', who: 'player', emote: '?' },
    { do: 'say', who: 'ves', text: '{smile}When I was little I went exploring in the caves under the Lookout. Mum told me not to. So obviously I did.\n\n{worried}Then my lantern went out. And in the dark there was this... rustling. All round me.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{scared}Bats. Hundreds of them. Their wings in my hair, and their tiny feet, and their horrible little faces.\n\n{scared}I screamed until Mum came and found me. She carried me all the way home.' },
    { do: 'say', who: 'ves', text: '{shy}I still can\'t go into a cave without my umbrella up. ...Don\'t laugh.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'ves', text: '{laughing}You\'re laughing on the inside. I can tell.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}Imagine being so scared of something that you went and dressed up as it. Just to scare everyone else.\n\n{smile}Somebody should write a book about someone like that. A really serious one.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{smile}Anyway. It\'s nearly light. Come on, up you get. Splash some snow on your face.' },
    { do: 'bed', pose: 'up' },
    { do: 'walk', who: 'player', to: { x: 9, y: 6 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', text: 'Your HP was fully restored. You don\'t feel very rested.' },
  ],
};
