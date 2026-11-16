// SHIP HOLD CHASE: the north aisle of the hold, at x 12 (ship_hold, trigger (12, rows 3-4), after ship_hold_in). The Bosun (a deckhand
// ghost, asleep at the south-west corner) lifts his head, sees the light and comes. Built up the way you'd meet it:
// the whistle closer, a creak, something dragged; the camera finds the shape in the corner; nobody's sure it was there
// before; it lifts its head and stands; THEN the run. The scene ends with the chase on (haunt `wake`). He hunts at 82 px/s: you can outrun him (run), put the
// lantern on him (he stops dead in its light), or hide in a gap in the stacks with the lantern out (the hold's `nooks`). Ves (11,3) and Bramble (11,4),
// behind you in the aisle (the trigger is the column they are next to). The hero never speaks. DRAFT.
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
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'whistle' },
    { do: 'say', text: 'The whistle again. Closer this time: behind you, back toward the ladder, somewhere down in the south aisle.\n\nThen, under it, a sound like something heavy being dragged a little way across the boards. And stopping.' },
    { do: 'say', who: 'bramble', text: '{scared}...That wasn\'t a kettle.' },
    { do: 'camera', to: { x: 5, y: 12 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'At the far end of the south aisle, against the crates, something is sitting on the floor. You can only just make it out: a knitted cap, a striped jersey, a swab laid across its knees.' },
    { do: 'say', who: 'ves', text: '{surprised}...Was that there before?' },
    { do: 'say', who: 'bramble', text: '{scared}I don\'t know. I don\'t KNOW.' },
    { do: 'haunt', dip: 1.4 },
    { do: 'wait', seconds: 1.0 },
    { do: 'say', text: 'The head lifts. Slowly, the way a sleeper\'s does when somebody says his name. It turns up the aisle, toward the lantern, and stays there.\n\nThen it gets to its feet.' },
    { do: 'sound', name: 'whistle' },
    { do: 'camera' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}It\'s looking at us. It\'s getting UP...' },
    { do: 'say', who: 'ves', text: '{determined}Don\'t stand there looking at it. RUN.' },
    { do: 'haunt', wake: 'bosun' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
