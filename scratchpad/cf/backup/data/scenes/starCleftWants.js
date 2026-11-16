// THE STAR CLEFT WANTS MORE (a secret, Chapter 3): the sword is held to the Old
// Street's sealed panel without all three torn leaves of the Welcome Register
// in the pack. The sword hums and the panel doesn't answer, because three
// columns on it are blank. (The hero never speaks. It plays every time: the trigger
// that opens the cleft, star_cleft_opens, comes first in the room's list.) (draft)
//
// With some of the leaves but not all (one or two), the ones you carry go into their
// columns for a moment, and their light shows a tiny picture cut under each bare
// numeral: where the missing leaf went (I, Names: Hollin Stores' shelf that walks;
// II, Hours: the toll board in the Far Shore's reeds; III, Seal: the pots in the Old
// Baths' stokehold). The steps pick themselves by what's in your pack (`has`, `lacks`,
// `holding`: see scenePlayer.js).
const NAMES = 'register_leaf_names';
const HOURS = 'register_leaf_hours';
const SEAL = 'register_leaf_seal';
const LEAVES = [NAMES, HOURS, SEAL];

// The little pictures under the bare numerals (draft).
const UNDER_I = 'Under I: a shelf of jars, with a pair of little feet under it.';
const UNDER_II = 'Under II: reeds, and a board on a post.';
const UNDER_III = 'Under III: a stack of pots, with a flame under them.';

export const STAR_CLEFT_WANTS = {
  // Triggers in rooms name the scene by this id.
  id: 'star_cleft_wants',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_old_street',
  // false: it plays every time you step on its trigger, not just the first time.
  once: false,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 26, y: 5, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 27, y: 3 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.5 },

    // No leaves at all.
    { do: 'say', lacks: LEAVES, text: 'The Fallen Star hums, a long way down, and the panel does not answer. Of the three columns ruled into the stone, the last of each is blank: a little torn-off strip of nothing, the width of a page. The cold blue line round the edge flickers, and goes out.' },
    { do: 'say', lacks: LEAVES, who: 'ves', text: '{thoughtful}It wants the pages that go in those. The sword gets you as far as the door, and then there\'s a form.' },
    { do: 'say', lacks: LEAVES, who: 'ves', text: '{bored}Three pages, numbered I, II, III. Somebody tore them out and went off with them, and a leaf is a leaf, it goes where the wind goes.' },
    // (draft) Plainer pointer: the pages themselves say where the next one went, and the KEEPSAKES page says what you hold.
    { do: 'say', lacks: LEAVES, who: 'ves', text: '{thoughtful}Any you\'ve found say where the next might be. Check your keepsakes. And if you haven\'t found one yet, think what you\'ve seen lying about, and then think what it was lying under.' },

    // (draft) One leaf of three: it goes into its column, and its light shows the other two pictures.
    { do: 'say', has: NAMES, lacks: [HOURS, SEAL], text: `The Fallen Star hums, a long way down. In your pack the Leaf of Names stirs, slips out, and lies flat in column I, its ruled lines running on into the stone's.\n\nColumns II and III stay bare. In the leaf's faint light you can make out something cut very small under each numeral. ${UNDER_II} ${UNDER_III}` },
    { do: 'say', has: HOURS, lacks: [NAMES, SEAL], text: `The Fallen Star hums, a long way down. In your pack the Leaf of Hours stirs, slips out, and lies flat in column II, its ruled lines running on into the stone's.\n\nColumns I and III stay bare. In the leaf's faint light you can make out something cut very small under each numeral. ${UNDER_I} ${UNDER_III}` },
    { do: 'say', has: SEAL, lacks: [NAMES, HOURS], text: `The Fallen Star hums, a long way down. In your pack the Leaf of the Seal stirs, slips out, and lies flat in column III, its ruled lines running on into the stone's.\n\nColumns I and II stay bare. In the leaf's faint light you can make out something cut very small under each numeral. ${UNDER_I} ${UNDER_II}` },
    { do: 'say', holding: [1, LEAVES], text: 'The cold blue line round the edge flickers, and goes out. The leaf curls off the stone and back into your hand.' },
    { do: 'say', holding: [1, LEAVES], who: 'ves', text: '{bored}One page in, two to go. It\'s a very particular wall.\n\n{thoughtful}Those little pictures under the bare ones. That\'s where the others went. I\'d put my crutch on it.' },

    // (draft) Two leaves of three: they go into their columns, and the light shows the last picture.
    { do: 'say', has: [NAMES, HOURS], lacks: SEAL, text: `The Fallen Star hums, a long way down. In your pack two leaves stir and slip out: the Leaf of Names into column I, the Leaf of Hours into column II, their ruled lines running on into the stone's.\n\nOnly column III stays bare. In the leaves' light you can make out something cut very small under its numeral. ${UNDER_III}` },
    { do: 'say', has: [NAMES, SEAL], lacks: HOURS, text: `The Fallen Star hums, a long way down. In your pack two leaves stir and slip out: the Leaf of Names into column I, the Leaf of the Seal into column III, their ruled lines running on into the stone's.\n\nOnly column II stays bare. In the leaves' light you can make out something cut very small under its numeral. ${UNDER_II}` },
    { do: 'say', has: [HOURS, SEAL], lacks: NAMES, text: `The Fallen Star hums, a long way down. In your pack two leaves stir and slip out: the Leaf of Hours into column II, the Leaf of the Seal into column III, their ruled lines running on into the stone's.\n\nOnly column I stays bare. In the leaves' light you can make out something cut very small under its numeral. ${UNDER_I}` },
    { do: 'say', holding: [2, LEAVES], text: 'The cold blue line round the edge flickers, and goes out. The leaves curl off the stone and back into your hand.' },
    { do: 'say', holding: [2, LEAVES], who: 'ves', text: '{smile}Two out of three. Clerks never let you off with two.\n\n{thoughtful}That little picture under the bare one. That\'s where the last page is, or I\'m a heron.' },

    { do: 'walk', who: 'player', to: { x: 27, y: 4 } },
  ],
};
