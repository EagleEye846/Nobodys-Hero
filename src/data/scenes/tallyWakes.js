// QUIRE WAKES (a secret, Chapter 3): the Registry, the hall at the end of the
// secret way behind the Old Street. A ledger the size of a door, shut on its
// stand in the middle of the hall. You walk up it (from the column past the
// save crystal) and it opens by itself, riffling its own pages, and stands up
// out of them: QUIRE, the Welcome Register, with the star in its binding,
// counting. It counts you. Then the fight (`tally`, src/data/enemies/tally.js),
// spared or beaten (`tally_spared`, `tally_beaten`). The hero never speaks.
// Every line is a (draft).
export const TALLY_WAKES = {
  // Triggers in rooms name the scene by this id.
  id: 'tally_wakes',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'registry_lair',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 9, y: 10, portrait: 'vesper_bare', plays: 'vesper' },
    { id: 'tally', look: 'enemy:tally', x: 18, y: 7, hidden: true },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 11, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'walk', who: 'ves', to: { x: 10, y: 10 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', text: 'A long hall of shelves, all the way up into the dark. At the heart of it, on a stand, a single ledger the size of a door lies shut. Its pages are moving. There isn\'t any wind.' },
    { do: 'say', who: 'ves', text: '{thoughtful}"The Welcome Register." That\'s what it says on the stand. "Kept for the Day. Every name, every night."' },
    { do: 'say', who: 'ves', text: '{bored}It\'s the list. Everyone who promised to be here when the Hero came. They counted it every night, to make sure nobody had forgotten.' },
    { do: 'say', who: 'ves', text: '{sad}...For how long, do you think?' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'At your side, the Fallen Star hums. Over on the stand, something answers it, a thin blue light, up through the binding of the book.' },
    { do: 'music', song: null },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 1, seconds: 1 },
    { do: 'say', text: 'The ledger opens. Pages riffle up out of it, then more pages, then a great deal of ink, and a book stands up out of the stand, hunched, with a face made of two open pages and two round spectacles shining like a star at the bottom of a well.' },
    { do: 'appear', who: 'tally' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'tally', text: 'Good morning.\n\nGood MORNING. Please keep to the line.', shake: true },
    { do: 'say', who: 'tally', text: 'One. Two.\n\n...Two. There are two.' },
    { do: 'say', who: 'ves', text: '{scared}...It\'s counting us.' },
    { do: 'say', who: 'tally', text: 'And that is... that is two.\n\nThat isn\'t on the list.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'tally', text: 'Seven thousand, four hundred and... no. From the top.\n\nAll present, all present, all present. And... you.\n\nYou are not on the list.' },
    { do: 'say', who: 'ves', text: '{determined}We\'re not on anybody\'s list. We\'ve noticed.' },
    { do: 'say', who: 'tally', text: 'That won\'t do. That won\'t do at all.\n\nI shall have to count you in.' },
    { do: 'say', who: 'ves', text: '{scared}...I don\'t like how it said "in."' },
    { do: 'battle', enemy: 'tally', who: 'tally', spared: 'tally_spared', defeated: 'tally_beaten' },
  ],
};
