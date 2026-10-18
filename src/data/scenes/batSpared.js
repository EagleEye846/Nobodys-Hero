// BAT SPARED: after you calm the great bat instead of beating it. It folds
// its wings, looks at the two of you for a long moment, and goes back up
// into the dark of the roof to sleep. Ves works out that it was only
// frightened for its home, the way she was frightened of it. And she
// realises she didn't run.
// Plays straight after the fight in the Roost (the `spared` of batsInTheRoost.js).
export const BAT_SPARED = {
  // Triggers in rooms name the scene by this id.
  id: 'bat_spared',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'ice_cave_roost',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 14, y: 16, portrait: 'vesper', plays: 'vesper' },
    { id: 'great_bat', look: 'enemy:great_bat', x: 13, y: 8, glow: 72 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'The great bat folds its wings, and looks at the two of you for a long, long moment.' },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'great_bat', to: { x: 13, y: 3 } },
    { do: 'leave', who: 'great_bat' },
    { do: 'wait', seconds: 1 },
    { do: 'music', song: 'caves' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'ves', text: '{surprised}...It\'s going. It\'s just... going back to sleep.' },
    { do: 'say', who: 'ves', text: '{thoughtful}It wasn\'t hunting us. We walked into its home in the dark, and it was frightened.\n\n{thoughtful}Same as me.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{smile}...I didn\'t run. Did you see? My knees were going like anything, but I didn\'t run.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'ves', text: '{shy}...Don\'t tell anyone about my knees.' },
  ],
};
