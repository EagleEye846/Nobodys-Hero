// THE GROUND GIVES: the middle of the Soft Field, in the sun. Ves walks ahead
// into it, turns, swings her umbrella down and PLANTS it in the grass, hand on
// hip, a little flick of her hair (sunny_ves_proud). "Look at this. Look at
// us." Then a pause. A crack: a sound like a very large biscuit breaking.
// Cracks spread across the grass from the umbrella tip (sunny_cracks: a flat
// picture on the ground under everyone). "...Did I do that?" The turf sags and
// breaks into slabs that drop away, buttercups going down with them
// (sunny_turf_fall), the music cuts dead, the screen shakes. Then the fall:
// straight down a dark shaft past roots and crystals, Ves's umbrella thrown
// open to slow them, flipping inside out (the 'shaft' vision, src/overworld/
// shaftVision.js), and on into the Glimmering (glimmer_landing, where
// soft_landing plays). It saves there: there's no going back up.
export const THE_GROUND_GIVES = {
  // Triggers in rooms name the scene by this id.
  id: 'the_ground_gives',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'sunny_soft_field',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // Ves, in her proud pose; the cracks and the breaking turf, flat on the
  // ground under everyone, centred on the spot she plants her umbrella (they
  // stand one tile below it: the pictures are drawn up from their feet).
  actors: [
    { id: 'ves', look: 'anim:sunny_ves_proud', x: 27, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'cracks', look: 'anim:sunny_cracks', x: 27, y: 10, hidden: true, flat: true },
    { id: 'turf', look: 'anim:sunny_turf_fall', x: 27, y: 10, hidden: true, flat: true },
  ],

  steps: [
    // The hero wanders out into the field; Ves strides on past, ahead.
    { do: 'walk', who: 'player', to: { x: 24, y: 10 } },
    { do: 'walk', who: 'ves', to: { x: 27, y: 9 } },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.4 },
    // The umbrella swings down (0.22s), PLANTS (a thud, a puff of dust), and
    // she settles into the pose, with a flick of her hair.
    { do: 'animate', who: 'ves', animation: 'sunny_ves_proud', speed: 0.22, once: true },
    { do: 'wait', seconds: 0.22 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.9 },
    { do: 'say', who: 'ves', text: '{proud}Look at this. Look at us.\n\nSun, grass, nothing trying to eat us.' },
    { do: 'say', who: 'ves', text: '{glee}I could get used to this.\n\nI could get used to this IMMEDIATELY.' },
    // A pause. Birdsong. A crack.
    { do: 'wait', seconds: 1.6 },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.7 },
    { do: 'say', text: 'Somewhere under the grass, a sound like a very large biscuit breaking.' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'appear', who: 'cracks' },
    { do: 'animate', who: 'cracks', animation: 'sunny_cracks', speed: 0.3, once: true },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 1, seconds: 1.2 },
    { do: 'wait', seconds: 0.6 },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'ves', text: '{surprised}...Did I do that?' },
    { do: 'sound', name: 'crumble' },
    { do: 'wait', seconds: 0.9 },
    // The field gives way under both of them. The music cuts dead.
    { do: 'music', song: null },
    { do: 'leave', who: 'cracks' },
    { do: 'appear', who: 'turf' },
    { do: 'animate', who: 'turf', animation: 'sunny_turf_fall', speed: 0.45, once: true },
    { do: 'quake', amount: 3, seconds: 3 },
    { do: 'sound', name: 'crumble' },
    { do: 'act', who: 'ves', act: 'startle', wait: false },
    { do: 'act', who: 'player', act: 'startle' },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'boom' },
    // And they fall: down the shaft (the 'shaft' vision), and Ves's scream over it.
    { do: 'vision', name: 'shaft', mood: 'drop', fade: 0.5 },
    { do: 'say', who: 'ves', text: '{scared}I take it back!\n\nI TAKE IT BACK!', shake: true },
    { do: 'wait', seconds: 4.6 },
    // No going back up: it saves by itself at the bottom.
    { do: 'goto', room: 'glimmer_landing', spawn: { x: 13, y: 8 }, save: true },
  ],
};
