// VES HOLDS YOUR HAND: coming up onto the Weathervane Shelf. Islands over
// the drop, and whirlwinds flinging snow clean across it. Ves takes one look
// and decides that hanging off her boot isn't good enough any more: one bad
// gust and you'd be gone. From now on you hold her hand, and the two of you
// float side by side (holdingHands in windGeyser.js). You've kept up with
// her the whole way, and she doesn't want you dangling behind her like
// luggage: you're partners, equals, the way two friends roped together on a
// climb are. A big step in her growing up. A friendship, nothing romantic.
// Plays once, at the top of the stair (vigilWeathervanes.js). The actor `plays`
// Ves, so she steps out of following you, and back in where the scene leaves her.
export const VES_HOLDS_YOUR_HAND = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_holds_your_hand',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_weathervanes',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 14, y: 22, portrait: 'vesper', plays: 'vesper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'walk', who: 'ves', to: { x: 15, y: 21 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'camera', to: { x: 14, y: 11 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{worried}...Look at it. Little islands, with nothing underneath them. And those whirlwinds are throwing snow clean across the gap.' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{thoughtful}If one of those carries us out over the drop with you swinging off my boot...\n\n{scared}One bad gust. That\'s all it would take. You\'d just be gone.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'ves', text: '{determined}Right. New rule.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{determined}You grab my hand, not my boot. A boot\'s too easy to slip off. And we go up side by side, like climbers on a rope.\n\n{resolute}You\'ve kept up with me the whole way up this mountain. You shouldn\'t have to hang off anybody.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{smile}Good. Partners, then. Let\'s go.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{bored}...And no swinging your legs about up there. It\'s very distracting.' },
  ],
};
