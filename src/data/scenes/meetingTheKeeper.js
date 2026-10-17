// MEETING THE KEEPER: made in Ruins Studio (tools/).
export const MEETING_THE_KEEPER = {
  // Triggers in rooms name the scene by this id.
  id: 'meeting_the_keeper',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'ruins_entrance',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'keeper', look: 'prop:keeper', x: 9, y: 15, portrait: 'old_keeper', plays: 'old_keeper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'appear', who: 'keeper', at: { x: 9, y: 14 } },
    { do: 'walk', who: 'keeper', to: { x: 7, y: 12 } },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'emote', who: 'keeper', emote: '!' },
    { do: 'say', who: 'keeper', text: 'Ah... there you are.\n\nI saw a light flicker at the top of the stair. I thought perhaps... no. Never mind.' },
    { do: 'emote', who: 'keeper', emote: '...' },
    { do: 'say', who: 'keeper', text: 'Let me look at you. Small. Lost. A little singed around the edges.\n\nNot quite what the old stone promised. But you\'re here, and that is something.' },
    { do: 'say', who: 'keeper', text: 'Forgive my manners. They call me the Keeper.\n\nI tend the lantern, and the lantern tends the dark.\n\nIt has been that way for a hundred years.' },
    { do: 'say', who: 'keeper', text: 'The Ruins are not kind to strangers. But I will help you, as best an old man can.\n\nStay where my light can find you. You\'ll be safe there.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'keeper', text: 'And if the shadows whisper to you... don\'t listen. They\'re only jealous of the light.' },
  ],
};
