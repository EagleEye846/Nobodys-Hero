// QUIRE BEATEN (a secret, Chapter 3): the Register comes apart, every page of
// it, all its figures spilling out of it across the hall, and the wish it made
// on the star (that the count would come out right) breaks with it: its first
// page comes down last, with the wish on it. The splinter of the
// Fallen Star falls out of its binding onto the flagstones; you pick it up (the
// `star_shard`). What's left is a heap of paper on the stand. The hero never
// speaks. Every line is a (draft).
export const TALLY_BEATEN = {
  // Triggers in rooms name the scene by this id.
  id: 'tally_beaten',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'registry_lair',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 16, y: 10, portrait: 'vesper_bare', plays: 'vesper' },
    { id: 'tally', look: 'enemy:tally', x: 18, y: 7 },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 17, y: 9 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'tally', text: 'It was... it was seven thousand.\n\nIt was... I had them all...' },
    { do: 'sound', name: 'thud' },
    { do: 'leave', who: 'tally' },
    { do: 'say', text: 'Quire goes up in a gust of loose pages, all its figures spilling out of it, ink and old paper going every way across the hall at once. Nothing on any of them adds up.' },
    { do: 'say', text: 'The last page to come down is the first one. WELCOME, in a big round hand, and under it, in a small cramped one, a single line: LET THE COUNT COME OUT RIGHT.\n\nThe ink has gone grey.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'Something pale falls out of the binding and rings on the flagstones, still humming at the sword. You pick it up.' },
    { do: 'give', item: 'star_shard' },
    { do: 'say', who: 'ves', text: '{bored}Well. It wanted to count us in, and now it doesn\'t have to count anything.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...That one was only ever going to get the number wrong, wasn\'t it. I don\'t love it.' },
    { do: 'say', who: 'ves', text: '{determined}We got the shard. Teasel will know what to do with it. Let\'s go before the paper settles. I hate paper.' },
  ],
};
