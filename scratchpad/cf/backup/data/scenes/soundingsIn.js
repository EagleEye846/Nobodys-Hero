// SOUNDINGS IN: the first steps into the sea caves, up out of the flooded tunnel from Merrow's
// sea gate. The sea comes right in under the hill, and Bramble, who is scared enough of the sea
// outside, finds it indoors too. Nobody walks; the trigger is column 4 of soundings_mouth, just
// inside the tunnel and the lane's gate (no monsters in that room). The hero never speaks.
export const SOUNDINGS_IN = {
  id: 'soundings_in',
  room: 'soundings_mouth',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 4, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The tunnel climbs up out of the water and comes out in a cave. The sea comes in with it, right into the hill: white at the mouth, black further in, booming.\n\nHere and there the walls glow green, like old bottles with a light behind them.' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{scared}It\'s INSIDE now. The sea. It got in.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{laughing}It\'s very forward, the sea.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{determined}It\'s only a big puddle with a roof on. I\'m not scared of a puddle.' },
    { do: 'say', who: 'ves', text: '{smile}There\'s a chart on that board. Somebody measured all this. Let\'s see what they thought of it.' },
    { do: 'face', who: 'player', dir: 'right' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
