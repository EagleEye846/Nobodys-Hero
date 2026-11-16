// TUCK AT THE BRIDGE: you step off the light onto the far ledge and Tuck is
// already there, which is a problem, because the bridge wasn't. He's sorry.
// There turns out to be a very small ledge round the side, for very small
// people, that nobody ever mentions.
//
// Clearance: the two quartzlings and the snail keep to the corners and the
// south of the ledge; the scene's walks keep to row 8 from x 24 to 30.
export const TUCK_AT_THE_BRIDGE = {
  // Triggers in rooms name the scene by this id.
  id: 'tuck_at_the_bridge',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'glimmer_crystal_bridge',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: 27, y: 8, portrait: 'tuck', hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 22, y: 9, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 24, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 23, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'appear', who: 'tuck' },
    // He's waving as if he's been waiting a good while (tuck_wave).
    { do: 'animate', who: 'tuck', animation: 'tuck_wave', speed: 0.2 },
    { do: 'act', who: 'tuck', act: 'hop' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'tuck', text: '{smile}You made it! I knew you would. Um. I mean, I hoped.' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck', speed: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}You were here first.\n\nWe just built a bridge out of LIGHT to get here. {smile}How did YOU get here?' },
    { do: 'act', who: 'tuck', act: 'shiver' },
    { do: 'say', who: 'tuck', text: '{shy}There\'s, um. A ledge. Round the side. Quite a small one.' },
    { do: 'say', who: 'tuck', text: '{worried}It\'s for small people. I should have said.\n\nI didn\'t want to interrupt. You were concentrating.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{smile}A ledge. For small people.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{smile}Next time, tell the tall ones.' },
    { do: 'say', who: 'tuck', text: '{shy}Yes. Sorry. It\'s only a bit further. Please, this way.' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 30, y: 8 }, keep: true },
    { do: 'leave', who: 'tuck' },
    { do: 'wait', seconds: 0.4 },
  ],
};
