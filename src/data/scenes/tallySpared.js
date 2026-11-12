// QUIRE SPARED (a secret, Chapter 3): you let it count you. It reads out the one
// word you wrote in its book, and it can finally close. The splinter of the
// Fallen Star in its binding comes loose and drifts into your hand (the
// `star_shard`, for Teasel's forge), and it settles back on its stand to rest.
// The hero never speaks. Every line is a (draft).
export const TALLY_SPARED = {
  // Triggers in rooms name the scene by this id.
  id: 'tally_spared',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'registry_lair',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 16, y: 10, portrait: 'vesper_bare', plays: 'vesper' },
    { id: 'tally', look: 'enemy:tally', x: 18, y: 7 },
  ],

  steps: [
    // The coda of its song: the count, slowly, and this time the fifth lands.
    { do: 'music', song: 'tallyBattle', section: 'present' },
    { do: 'walk', who: 'player', to: { x: 17, y: 9 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'tally', text: 'No-bod-y.\n\n...Nobody. Present.' },
    { do: 'say', text: 'It writes it down, slowly, in the margin, in a hand that keeps trying to be a number. Then it reads it out again, the way you say a word you\'ve just learned.' },
    { do: 'say', who: 'tally', text: 'And the lady.\n\nAnd the lady, with the... leg.' },
    { do: 'say', who: 'ves', text: '{surprised}Me? ...Vesper. With a V.\n\n{bored}Put "present." I\'m not going anywhere. I physically can\'t.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'tally', text: 'Two.\n\nTwo present.' },
    { do: 'say', who: 'tally', text: 'It comes out right.\n\nIt comes out RIGHT.' },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'Quire shuts its great cover very carefully, like a book at the end of a long night. As it goes, something pale slips out of the binding and drifts across the hall into your open hand.' },
    { do: 'give', item: 'star_shard' },
    { do: 'wait', seconds: 0.4 },
    { do: 'leave', who: 'tally' },
    { do: 'say', text: 'The Register settles down on its stand and doesn\'t move. Its pages go on riffling, very slowly now, the way somebody breathes in their sleep.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...A hundred years of getting the sum wrong, and all it wanted was somebody to say "here."' },
    { do: 'say', who: 'ves', text: '{bored}I\'m not going to be sentimental about a filing cabinet.\n\n{smile}...Leave the door open when we go. In case it wants to count the draught.' },
  ],
};
