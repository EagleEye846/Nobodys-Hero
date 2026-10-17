// LEAVE THE RUINS: you step through the old door for the first time. Chapter
// One is complete: the credits roll, and you go on into the world beyond. (After this, the door
// is just a door, both ways.)
export const LEAVE_RUINS = {
  // Triggers in rooms name the scene by this id.
  id: 'leave_ruins',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'way_out',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'The old door is heavy, and cold to the touch.\n\nYou push it open.' },
    { do: 'sound', name: 'door' },
    { do: 'walk', who: 'player', to: { x: 32, y: 2 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'end_chapter', room: 'beyond_ruins', spawn: { x: 10, y: 12 }, credits: true },
  ],
};
