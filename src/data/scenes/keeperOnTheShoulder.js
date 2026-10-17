// THE KEEPER ON THE SHOULDER: out of the caves and into the snow, and there he
// is, by the heralds' fire, a long way from his lantern hall. He's pleased to
// see you, full of advice for the ice above, and vague about how he got here
// first. After this he's gone from the Ruins, and waiting in Heralds' Rest.
export const KEEPER_ON_THE_SHOULDER = {
  // Triggers in rooms name the scene by this id.
  id: 'keeper_on_the_shoulder',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_shoulder',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'keeper', look: 'prop:keeper', x: 31, y: 28, portrait: 'old_keeper', hidden: true },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.5 },
    { do: 'camera', to: { x: 27, y: 28 } },
    { do: 'appear', who: 'keeper', at: { x: 31, y: 28 } },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'wait', seconds: 0.6 },
    { do: 'emote', who: 'keeper', emote: '!' },
    { do: 'say', who: 'keeper', text: '{surprised}Well now. Look who the mountain let through.\n\n{glee}Come to the fire, come to the fire. You\'re blue at the edges.' },
    { do: 'walk', who: 'keeper', to: { x: 24, y: 29 } },
    { do: 'walk', who: 'player', to: { x: 22, y: 29 } },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'keeper', text: 'You\'ll be wondering how an old man got up here ahead of you.\n\n{sly}There are more ways up a mountain than the front stair, little one. I\'ve had a hundred years to find the quiet ones.' },
    { do: 'emote', who: 'keeper', emote: '...' },
    { do: 'say', who: 'keeper', face: 'sad', text: 'I came this way once before. A long time ago, with a lantern that was new. I didn\'t get much further than this fire.\n\nThe ice above is cruel to anyone who hurries.' },
    { do: 'say', who: 'keeper', text: 'So, some advice, from someone who learned it the cold way.\n\nOn the ice faces, swing high before you throw. Hold the way you\'re swinging and let it build; the rope reaches further than you\'d think when you\'ve got your weight behind it.' },
    { do: 'say', who: 'keeper', text: 'When the rings run out at the top of a face, don\'t stop. The climb carries on over the edge. Trust the rope.\n\n{glee}And when you can\'t see the valley any more, that\'s not the mountain ending. That\'s you above the weather.' },
    { do: 'say', who: 'keeper', text: 'The heralds are up there, you know. Still. Soup on, beds made, trumpets polished.\n\n{sly}They\'ll ask if you\'re the Hero. Let them wonder a while. It\'s the most fun they\'ve had in a century.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'keeper', face: 'sly', text: 'I\'ll see you in the village. Save me a seat by their fountain.\n\nStay where the light can find you, up there. The dark gets very big above the clouds.' },
    { do: 'face', who: 'keeper', dir: 'right' },
    { do: 'walk', who: 'keeper', to: { x: 34, y: 27 } },
    { do: 'leave', who: 'keeper' },
    { do: 'camera' },
  ],
};
