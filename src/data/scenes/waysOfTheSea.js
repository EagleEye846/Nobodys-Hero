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
// scene (haddock_shows_bell) waits for it. Haddock isn't here before you: he's
// come along the beach after you from the lifeboat house. The three walk a few
// steps in on the north side of the shore (Ves 3,8, Bramble 2,8, the hero 4,9),
// he comes in at the door behind them (1,10) with his "Hold up", and walks along
// row 12, under them, down to the tide bell post at the water's edge (the post is
// two tiles wide at 8..9, row 10; he stands just below it, 9.5,12, on the last of
// the sand, looking out at the sea). Then the three go down to him (Ves 5,12, the
// hero 7,13, Bramble 4,13, then a step back to 2,12 for the dry bit), clear of the
// way he leaves by in the bell scene (up x 6..7); that scene carries on from where
// this one leaves them. The gullion's patrol (row 15) is south of all of it.
export const WAYS_OF_THE_SEA = {
  id: 'ways_of_the_sea',
  room: 'gullrest_cove',
  once: true,

  actors: [
    // Off stage until he catches them up in the door.
    { id: 'haddock', look: 'prop:cf_haddock', x: 1, y: 10, portrait: 'haddock', centered: true, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // A few steps in, up on the north side of the shore.
    { do: 'walk', who: 'ves', to: { x: 3, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 2, y: 8 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 4, y: 9 }, pace: 48 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.4 },
    // Haddock, come along the beach after them, in at the door behind.
    { do: 'appear', who: 'haddock', at: { x: 1, y: 10 } },
    { do: 'say', who: 'haddock', text: '{proud}Hold up. Nobody goes near me sea without the lesson.' },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'wait', seconds: 0.3 },
    // Down past them along row 12, to the tide bell post at the water's edge.
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_down', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 2, y: 12 }, pace: 40, keep: true },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_right', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 5, y: 12 }, pace: 40, keep: true },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'walk', who: 'haddock', to: { x: 9.5, y: 12 }, pace: 40, keep: true },
    // Stood side on by the post, looking out at the sea (the first frame of his walk, held).
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_right', speed: 999, once: true },
    { do: 'wait', seconds: 0.6 },
    // The three go down to him.
    { do: 'walk', who: 'ves', to: { x: 5, y: 12 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 4, y: 13 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 7, y: 13 }, pace: 48 },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{surprised}...There\'s a LESSON?' },
    // He can't hear her: his head tips to one side. (draft)
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'emote', who: 'haddock', emote: '?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{smile}Thank you, miss. I do give a good one.' },
    { do: 'say', who: 'haddock', text: '{proud}One. The sea goes out, and the sea comes back. Every time.\n\nDon\'t argue with it. Lean on it.' },
    // He sets your feet apart in the wet sand: in, and out, in, and out, with the swell rocking the whole
    // view, and it is a lot harder than it looks. (draft)
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 0.8, seconds: 4.4 },
    { do: 'act', who: 'player', act: 'fidget' },
    { do: 'act', who: 'player', act: 'fidget' },
    { do: 'act', who: 'player', act: 'fidget' },
    { do: 'act', who: 'haddock', act: 'nod' },
    { do: 'say', who: 'haddock', text: '{proud}Two. Wind off the water\'s a different animal to wind off a hill.\n\nIt\'ll carry you, if ye ask it nicely.' },
    // Ves opens her umbrella to the sea and the wind lifts her onto her toes. (draft)
    { do: 'animate', who: 'ves', animation: 'ves_open_umbrella', speed: 0.14, once: true },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'whoosh' },
    { do: 'animate', who: 'ves', animation: 'ves_brace', speed: 0.3 },
    { do: 'act', who: 'ves', act: 'hop', wait: false },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{surprised}...That\'s rude.\n\n{glee}I like it.' },
    { do: 'animate', who: 'ves', animation: 'ves_close_umbrella', speed: 0.14, once: true },
    { do: 'wait', seconds: 0.5 },
    { do: 'animate', who: 'ves' },
    { do: 'say', who: 'haddock', text: '{smile}Now you, lad. Toes in.' },
    // A firm step back, away from the water. (No, thank you.)
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'act', who: 'bramble', act: 'shake' },
    { do: 'walk', who: 'bramble', to: { x: 2, y: 12 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'emote', who: 'haddock', emote: '?' },
    { do: 'say', who: 'bramble', text: '{shout}NO. Not today, not ever, not even a toe.\n\n{proud}I\'m in charge of the dry bit.' },
    { do: 'act', who: 'bramble', act: 'nod', wait: false },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{tender}Fair enough. Sea\'ll keep.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{laughing}He means it\'ll wait for you.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{worried}...That\'s worse.' },
    { do: 'act', who: 'bramble', act: 'shiver', wait: false },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'You and Ves have learned the ways of the sea.\n\nNew branches have grown on the skill tree: TIDE for you, and BREEZE for Ves.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
