// SHIP HOLD CHASE: the north aisle of the hold, at x 12 (ship_hold, trigger (12, rows 3-4), after ship_hold_in). The Bosun (a deckhand
// ghost, asleep at the south-west corner) lifts his head, sees the light and comes. The scene ends with the chase on
// (haunt `wake`): no sudden sound, only the whistle again, close. He hunts at 82 px/s: you can outrun him (run), put the
// lantern on him (he stops dead in its light), or turn her once you're past the barrels so they roll into the aisle behind
// you. Ves (11,3) and Bramble (11,4), behind you in the aisle (the trigger is the column they are next to). The hero never speaks. DRAFT.
export const SHIP_HOLD_CHASE = {
  id: 'ship_hold_chase',
  room: 'ship_hold',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 11, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 11, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'haunt', dip: 2.0 },
    { do: 'wait', seconds: 0.7 },
    { do: 'sound', name: 'whistle' },
    { do: 'say', text: 'Behind you, back toward the ladder and down in the dark of the south aisle, the whistle sounds again: closer, one long note going up. Something that has been sitting very still for a hundred years lifts its head.\n\nA knitted cap. A striped jersey. A swab in one hand. He has seen the light, the way a drowning man sees a lamp on the shore. He gets to his feet.' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}He\'s COMING.' },
    { do: 'say', who: 'ves', text: '{determined}Walk. No: run. Don\'t stop to look at him. If he gets close, put the lantern on him: in the old stories, they stop dead in the light.' },
    { do: 'say', who: 'bramble', text: '{scared}And if that\'s only a story?' },
    { do: 'say', who: 'ves', text: '{determined}Then turn the ship. This room is full of things that roll.' },
    { do: 'haunt', wake: 'bosun' },
  ],
};
