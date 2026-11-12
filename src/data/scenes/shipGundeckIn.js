// SHIP GUN DECK IN: through the bulkhead into the gun deck (ship_gundeck, trigger x 2 rows 3-11: where you arrive).
// Every gun run out and loaded, a hundred years waiting for the word. Ves (3,7), Bramble (3,5). The powder monkey and the
// deckhand are fifteen tiles off. The hero never speaks. DRAFT words.
export const SHIP_GUNDECK_IN = {
  id: 'ship_gundeck_in',
  room: 'ship_gundeck',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The gun deck goes away from you into the dark, long and low. Every gun is run out to its port. Every port has its lid up and the grey fog in it. Beside every gun, laid ready, is a match; and beside every match, a bucket, filled, and not a ripple on it.' },
    { do: 'say', who: 'bramble', text: '{scared}They\'re loaded.' },
    { do: 'say', who: 'ves', text: '{bored}Habit.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}A hundred years is a very long time to be ready for something. ...Come on. And don\'t touch the matches.' },
  ],
};
