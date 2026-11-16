// THE TATTERWIGHT: crossing the Torn Clearing (pinefall_tatters). The forest
// goes quiet. Then the wind comes back, and doesn't leave: it goes round the
// clearing, picking up the leaves, the twigs, the scraps of Ves's coat, and
// stands up in the middle in the shape of what tore the trees. Then the
// fight, alone. Spared, tatterwight_spared plays; beaten,
// tatterwight_scattered. The trigger's a line across the clearing a few
// steps in from the maze, so you meet it on the way through.
export const THE_TATTERWIGHT = {
  // Triggers in rooms name the scene by this id.
  id: 'the_tatterwight',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'pinefall_tatters',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'tatterwight', look: 'enemy:tatterwight', x: 15, y: 9, hidden: true },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 9, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'The wind drops. Every leaf in the clearing goes still.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Then it comes back. It comes in from every side at once, and it doesn\'t go out again. It goes round.\n\nRound the clearing. Round you. Round and round.' },
    { do: 'camera', to: { x: 15, y: 8 } },
    { do: 'appear', who: 'tatterwight' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Leaves, and twigs, and three scraps of blue wool lift off the ground and go round with it. The blue of her coat.\n\nIn the middle of the clearing, the wind stands up.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'camera' },
    { do: 'battle', enemy: 'tatterwight', who: 'tatterwight', spared: 'tatterwight_spared', defeated: 'tatterwight_scattered' },
  ],
};
