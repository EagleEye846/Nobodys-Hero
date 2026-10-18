// VES SEES THE HUT: up the last of the wind stair onto the Lamplighter's
// Ledge, into a gale. Ves can barely stand in it, braced behind her umbrella,
// and then through the snow she sees a roof, and a cold lamp by the door,
// like the ones her mother lit. She doesn't wait for you: she runs for it and
// goes in. You follow her in, and find her inside (vesInTheHut.js).
// Plays once, just up the stair (vigilLamplightersLedge.js). The actor `plays`
// Ves, so she steps out of following you; she leaves through the hut door, and
// `leavesAhead` keeps her out of sight on the ledge until the hut scene finds
// her, and keeps you from going back down the stair without her.
export const VES_SEES_THE_HUT = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_sees_the_hut',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_lamplighters_ledge',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,
  // Ves runs on ahead into the hut; she's there when you go in. Until then
  // you won't go back down without her (`blocked`, in upper_vigil.txt).
  leavesAhead: { who: 'vesper', until: 'ves_in_the_hut', blocked: 'ledge_not_without_her' },

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 11, y: 19, portrait: 'vesper', plays: 'vesper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'walk', who: 'player', to: { x: 11, y: 17 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'walk', who: 'ves', to: { x: 12, y: 17 } },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'animate', who: 'ves', animation: 'ves_brace' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{cold}It\'s coming straight through my coat. I can\'t see a thing.\n\n{exhausted}Don\'t let go of anything. Not me, not the rock, not anything.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'emote', who: 'ves', emote: '!' },
    { do: 'animate', who: 'ves' },
    { do: 'camera', to: { x: 6, y: 9 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{surprised}...A roof. There\'s a roof. Look, there\'s a hut!\n\n{surprised}And a lamp by the door. Her lamps all looked like that.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{determined}That\'s hers. It has to be.' },
    { do: 'camera', who: 'ves' },
    { do: 'walk', who: 'ves', to: { x: 12, y: 11 }, fast: true },
    { do: 'walk', who: 'ves', to: { x: 6, y: 11 }, fast: true },
    { do: 'walk', who: 'ves', to: { x: 6, y: 9 }, fast: true },
    { do: 'leave', who: 'ves' },
    { do: 'sound', name: 'door' },
    { do: 'wait', seconds: 0.8 },
    { do: 'camera' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 0.4 },
  ],
};
