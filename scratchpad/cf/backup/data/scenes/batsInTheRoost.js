// BATS IN THE ROOST: walking into the Roost at the end of the ice caves.
// The music cuts out. Then the squeaking starts, and the bats come, little
// ones swooping across in the dark: Ves's worst fear, from when she was lost
// in a cave as a girl (hutWake.js). She throws her umbrella up and freezes.
// The hero steps in front of her without a word. And the great bat that
// rules the Roost unfolds from the roof. Ves finds her nerve, just enough:
// the hero stayed with her at the hut, so she stays now. Then the fight.
// Plays once, just inside the Roost (iceCaveRoost.js). The actor `plays`
// Ves, so she steps out of following you, and back in where the scene leaves her.
export const BATS_IN_THE_ROOST = {
  // Triggers in rooms name the scene by this id.
  id: 'bats_in_the_roost',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'ice_cave_roost',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 18, portrait: 'vesper', plays: 'vesper' },
    { id: 'bat1', look: 'prop:small_bat', x: 3, y: 8, hidden: true, animation: 'small_bat', speed: 0.08 },
    { id: 'bat2', look: 'prop:small_bat', x: 3, y: 11, hidden: true, animation: 'small_bat', speed: 0.07 },
    { id: 'bat3', look: 'prop:small_bat', x: 24, y: 9, hidden: true, animation: 'small_bat', speed: 0.08 },
    { id: 'great_bat', look: 'enemy:great_bat', x: 13, y: 4, hidden: true, glow: 72 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 13, y: 16 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'walk', who: 'ves', to: { x: 14, y: 16 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'sound', name: 'squeak' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'squeak' },
    { do: 'emote', who: 'ves', emote: '!' },
    { do: 'say', who: 'ves', text: '{worried}...Did you hear that?' },
    { do: 'appear', who: 'bat1' },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'bat1', to: { x: 23, y: 6 }, fast: true },
    { do: 'leave', who: 'bat1' },
    { do: 'animate', who: 'ves', animation: 'ves_shield' },
    { do: 'say', who: 'ves', text: '{scared}No. No no no no. That was... that was a...' },
    { do: 'appear', who: 'bat2' },
    { do: 'appear', who: 'bat3' },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'bat2', to: { x: 22, y: 13 }, fast: true },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'bat3', to: { x: 4, y: 7 }, fast: true },
    { do: 'leave', who: 'bat2' },
    { do: 'leave', who: 'bat3' },
    { do: 'sound', name: 'squeak' },
    { do: 'say', who: 'ves', text: '{scared}Bats. It\'s full of bats. I can hear them up there, all of them, rustling.\n\n{scared}Just like when the lantern went out. Just like...' },
    { do: 'wait', seconds: 0.8 },
    { do: 'walk', who: 'player', to: { x: 14, y: 15 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{surprised}...You\'re standing in front of me.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'squeak' },
    { do: 'sound', name: 'door' },
    { do: 'camera', to: { x: 13, y: 7 } },
    { do: 'appear', who: 'great_bat' },
    { do: 'wait', seconds: 1 },
    { do: 'walk', who: 'great_bat', to: { x: 13, y: 8 } },
    { do: 'sound', name: 'squeak' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{scared}...That one\'s not a little one.' },
    { do: 'camera' },
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{determined}Okay. Okay. You stayed with me, back at the hut. So I\'m staying with you.\n\n{resolute}Umbrella up. Here we go.' },
    { do: 'battle', enemy: 'great_bat', who: 'great_bat', defeated: 'bat_defeated' },
  ],
};
