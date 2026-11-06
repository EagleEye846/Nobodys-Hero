// WAYS OF THE SEA: the cove at Gullrest, just before Haddock shows his bell.
// Nobody goes near his sea without the lesson. Two things: the tide (lean on
// it, don't argue with it) and the wind off the water (it carries you, if you
// ask nicely). The hero sways with the waves; Ves's umbrella catches the sea
// wind. Bramble flatly refuses, and appoints himself in charge of the dry bit.
// This is when the new skill branches grow: the hero's TIDE and Ves's BREEZE
// (`requires: 'ways_of_the_sea'` in src/data/skills.js). Bramble's own sea
// branch (CHILL) waits for the end of the chapter, when he stops refusing.
// (The hero never speaks.)
//
// Mandatory: it plays on the cove's west shore as you come in, and the bell
// scene (haddock_shows_bell) waits for it. Nobody walks; the same places as
// the bell scene, so that one carries straight on.
export const WAYS_OF_THE_SEA = {
  id: 'ways_of_the_sea',
  room: 'gullrest_cove',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock', x: 6, y: 8, portrait: 'haddock', plays: 'haddock_cove', centered: true, animation: 'cf_haddock', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'haddock', text: '{proud}Hold up. Nobody goes near my sea without the lesson.' },
    { do: 'say', who: 'ves', text: '{bored}There\'s a lesson.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{smile}Thank you, miss. I do give a good one.' },
    { do: 'say', who: 'haddock', text: '{proud}One. The sea goes out, and the sea comes back. Every time.\n\nDon\'t argue with it. Lean on it.' },
    { do: 'say', text: 'Haddock sets your feet apart in the wet sand and has you sway with the waves. In, and out. In, and out. It is a lot harder than it looks.' },
    { do: 'say', who: 'haddock', text: '{smile}There. Now it\'s pushing for you, not at you.' },
    { do: 'say', who: 'haddock', text: '{proud}Two. Wind off the water\'s a different animal to wind off a hill.\n\nIt\'ll carry you, if you ask it nicely.' },
    { do: 'say', text: 'Ves opens her umbrella to the sea. The wind gets under it at once and lifts her up onto her toes.' },
    { do: 'say', who: 'ves', text: '{surprised}...That\'s rude.' },
    { do: 'say', who: 'ves', text: '{smile}I like it.' },
    { do: 'say', who: 'haddock', text: '{smile}Now you, lad. Toes in.' },
    { do: 'say', who: 'bramble', text: '{scared}No.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'say', who: 'bramble', text: '{shout}NO. No thank you. Nope. Not today, not ever, not even a toe.' },
    { do: 'say', who: 'bramble', text: '{determined}I\'m going to stand here. On the dry bit.\n\nI\'m in charge of the dry bit.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{tender}Fair enough. Sea\'ll keep.' },
    { do: 'say', who: 'ves', text: '{bored}He means it\'ll wait for you.' },
    { do: 'say', who: 'bramble', text: '{worried}...That\'s worse.' },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'You and Ves have learned the ways of the sea.\n\nNew branches have grown on the skill tree: TIDE for you, and BREEZE for Ves.' },
  ],
};
