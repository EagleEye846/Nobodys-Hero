// TO THE WRECK YARD: Haddock rows the three out of Saltcombe to the ship graveyard.
//
// This scene is only the casting off, so it plays in ANY room: a Saltcombe trigger
// (the lookout or the quay) can name it as it stands. Nobody walks and nothing is
// placed in the room: Haddock speaks from out of sight (a hidden actor with his
// face), the view fades to black, and it ends with a `goto` to the Wreck Yard's
// jetty. Arriving there steps you onto the trigger of `wreck_crossing`
// (src/data/scenes/wreckCrossing.js): the ride itself, on board, plays once, with
// the boat coming in out of the fog. Later trips just fade across.
//
// Repeatable (`once: false`): Haddock will row you over as often as you like.
// The way home is the slip at the far side (wreck_slip, scene `wreck_slip_home`).
export const TO_THE_WRECK_YARD = {
  id: 'to_the_wreck_yard',
  // Where it's tried out in the preview; in the game it plays wherever the trigger is.
  room: 'wreck_gate',
  once: false,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock', x: 1, y: 1, portrait: 'haddock', hidden: true },
    { id: 'ves_voice', look: 'prop:vesper_stand', x: 1, y: 1, portrait: 'vesper', hidden: true },
  ],

  steps: [
    { do: 'say', who: 'haddock', text: '{proud}The Wreck Yard, is it? Right. In ye get. Sit still, and don\'t touch the oars.', until: 'haddock_gone' },
    // After the chapter, Ves rows ((draft)).
    { do: 'say', who: 'ves_voice', text: "{proud}The Wreck Yard. In you get. Nobody touch the oars.", after: 'haddock_gone' },
    { do: 'stage', dim: 1, seconds: 1.6 },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 1.8 },
    { do: 'goto', room: 'wreck_gate', spawn: { x: 9, y: 10 } },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
