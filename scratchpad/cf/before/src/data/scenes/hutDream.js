// HUT DREAM: what you dream the first time you sleep in the lamplighter's
// cot. Nothing but black, and in it a great lantern swinging on its chain,
// glowing, with something inside it that isn't quite a flame (visions.js).
// Its song is "The Lantern Swings" (lanternTheme.js). Then someone you
// can't see screams, the lantern blazes up, and you wake (hutWake.js).
// Nobody explains it. It isn't meant to be understood yet.
// Plays while you sleep (the cot's `dream` in vigilLamplightersHut.js).
export const HUT_DREAM = {
  // Triggers in rooms name the scene by this id.
  id: 'hut_dream',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_lamplighters_hut',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,
  // The scene for waking up from this dream.
  wakeScene: 'hut_wake',

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'wait', seconds: 1.5 },
    { do: 'music', song: 'lantern' },
    { do: 'vision', name: 'lantern', mood: 'calm' },
    { do: 'wait', seconds: 9 },
    { do: 'say', text: '...' },
    { do: 'wait', seconds: 2.5 },
    { do: 'vision', name: 'lantern', mood: 'violent' },
    { do: 'say', text: 'No! Get away!', shake: true },
    { do: 'say', text: 'Help me!', shake: true },
    { do: 'vision', name: 'lantern', mood: 'flare' },
    { do: 'sound', name: 'flare' },
    { do: 'wait', seconds: 0.9 },
    { do: 'vision' },
    { do: 'music', song: null },
    { do: 'wait', seconds: 1.6 },
  ],
};
