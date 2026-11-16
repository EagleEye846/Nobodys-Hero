// TATTERWIGHT SCATTERED: beaten, the wind comes apart all at once. The
// scraps of Ves's coat come down with the leaves, and you pick them up.
export const TATTERWIGHT_SCATTERED = {
  // Triggers in rooms name the scene by this id.
  id: 'tatterwight_scattered',
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
    { do: 'leave', who: 'tatterwight' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Leaves rain down over the clearing, and twigs, and dust. Then nothing. Not a breath of wind.' },
    { do: 'say', text: 'Three scraps of blue wool come down last, turning over and over.\n\nYou catch them, and put them away carefully. They\'re hers.' },
    { do: 'music', song: 'pinefall' },
  ],
};
