// VES AT THE LAST FLIGHT (draft): the foot of the Last Flight, the first time
// you come up off the Way Up, once the light has gone up. The stair stops
// at a sheer face with rings in it, and no way round. Ves has a word about
// it, and then she's coming up after you. Short: the climb is the thing.
//
// Clearance: nothing lives on the Last Flight. Ves steps up beside you on
// row 33 and you both look up.
export const VES_AT_THE_LAST_FLIGHT = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_at_the_last_flight',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_last_flight',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 35, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 4, y: 33 } },
    { do: 'walk', who: 'ves', to: { x: 5, y: 33 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'camera', to: { x: 9, y: 18 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The stair just stops. The last flights have fallen away into the shaft.\n\nThere is only the face, with old iron rings hammered into it, all the way up.' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{bored}Rings. Of course it\'s rings.' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{determined}...No way round, either. Fine. You first. I\'m right behind you.' },
    { do: 'say', who: 'ves', text: '{bored}Don\'t fall on me.' },
    { do: 'wait', seconds: 0.3 },
  ],
};
