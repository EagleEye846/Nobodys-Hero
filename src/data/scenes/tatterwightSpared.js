// TATTERWIGHT SPARED: you took the scraps of Ves's coat back out of the whirl,
// and with nothing left to hold on to, the wind lets go. The clearing's quiet
// at last, and the Pinefall's waltz comes back in.
export const TATTERWIGHT_SPARED = {
  // Triggers in rooms name the scene by this id.
  id: 'tatterwight_spared',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'pinefall_tatters',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'tatterwight', look: 'enemy:tatterwight', x: 15, y: 9 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The TATTERWIGHT turns once more, slowly, as if it\'s looking for something it\'s lost.\n\nThen the leaves let go of each other.' },
    { do: 'leave', who: 'tatterwight' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'They come down all over the clearing like red snow. A breeze goes off between the trees, quite small, and doesn\'t come back.' },
    { do: 'say', text: 'You look down at your hand. Three scraps of blue wool.\n\nYou put them away carefully. They\'re hers.' },
    { do: 'music', song: 'pinefall' },
  ],
};
