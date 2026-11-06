// SOUNDINGS IN: the first steps into the sea caves from the cliff lane. The sea comes right in
// under the hill, and Bramble, who is scared enough of the sea outside, finds it indoors too.
// Nobody walks; the trigger is a column just inside the west door of soundings_mouth (no
// monsters in that room). The hero never speaks.
export const SOUNDINGS_IN = {
  id: 'soundings_in',
  room: 'soundings_mouth',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The cliff lane ducks under an overhang and comes out in a cave. The sea comes in with it, right into the hill: white at the mouth, black further in, booming.\n\nHere and there the walls glow green, like old bottles with a light behind them.' },
    { do: 'say', who: 'bramble', text: '{scared}It\'s INSIDE now. The sea. It got in.' },
    { do: 'say', who: 'ves', text: '{bored}It does that. It\'s very forward.' },
    { do: 'say', who: 'bramble', text: '{worried}It\'s only a big puddle with a roof on. I\'m not scared of a puddle.' },
    { do: 'say', who: 'ves', text: '{thoughtful}There\'s a chart on that board. Somebody measured all this. Let\'s see what they thought of it.' },
  ],
};
