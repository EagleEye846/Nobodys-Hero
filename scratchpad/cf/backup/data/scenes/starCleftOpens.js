// THE STAR CLEFT OPENS (a secret, Chapter 3): at the Old Street, where a piece
// of the Fallen Star once lay in the steps, a trail of faint star-light goes
// along the street to a narrow cleft between two houses, sealed with a carved
// panel. Walk up to it with the sword and the sword hums, the star-light along
// the street runs up the cleft like a struck match, and the panel lets go. The
// way into the Registry (src/data/rooms/registryCleft.js). The hero never speaks.
// Every line is a (draft).
export const STAR_CLEFT_OPENS = {
  // Triggers in rooms name the scene by this id.
  id: 'star_cleft_opens',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_old_street',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 26, y: 5, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 27, y: 3 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'At your side, the Fallen Star begins to hum. Not the quiet note it keeps to itself. A held one, getting higher.' },
    { do: 'sound', name: 'shimmer' },
    // (draft) The three torn leaves, from your pack: the Names, the Hours and the Seal.
    { do: 'say', text: 'In your pack, three torn pages begin to stir. They lift out, one at a time, pale at the torn edges, and go flat against the carved panel, each into a column of its own that has been left blank. The ruled lines on them run on into the lines on the stone.' },
    { do: 'say', text: 'The scorch in the old step behind you lights up, pale blue. Then the next mark along the street, and the next, like a row of struck matches, running past your feet and up into the cleft.' },
    { do: 'say', who: 'ves', text: '{surprised}...It\'s doing that on its own, isn\'t it. You aren\'t doing that.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 1, seconds: 1.4 },
    { do: 'say', text: 'The carved panel across the cleft shudders. A hairline of light runs down the middle of it, and it lets go, both halves, and swings back into the dark.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Somebody cut a door into the side of this street and sealed it up, and nobody ever mentioned it.' },
    { do: 'say', who: 'ves', text: '{bored}A secret door that only opens for a sword. I\'d say that\'s rude, but it\'s mostly just efficient.' },
    { do: 'say', who: 'ves', text: '{determined}Whatever knocked that piece off the steps is in there. It\'s still humming at us. Come on. I\'ll hold your coat.' },
    { do: 'say', who: 'ves', text: '{smile}...Figure of speech. I\'m using both hands for the crutch.' },
  ],
};
