// THE BUNK TALLY (Hero trail 3): in the Drowned Rat, the little bunk under the stair
// (sc_bunk_tally, 16..17, row 11), its rail notched in fives. Bramble counts and runs out of
// fingers; Ves has seen that hand before, in the Deep (the Hero's camp in chapter 4, where Bramble
// wasn't, as far as anyone knew), and says only what she said there: "Somebody who liked things in
// rows." The hero never speaks. The Z read (inn_bunk, saltcombe.txt) is unchanged.
//
// Only after haddock_hums (`after`), so it can never come before or into the inn's own scenes
// (inn_hall_first, haddock_hums: both on the doorway trigger, 7..10, rows 10..12); its trigger is
// further east (x 13 to 15, rows 11 to 12), on the way along the bottom of the room to the bunk.
// The hero stops at the bunk's east end (17,12), Bramble at its west end (16,12), Ves behind them
// (15,12); the dozing fisher (14,10) and his table (12..13,10) are above that row. Down there the
// text box would hide them, so it goes to the top. No monsters. Until the end of the chapter.
//
// (draft).
export const THE_BUNK_TALLY = {
  id: 'the_bunk_tally',
  room: 'saltcombe_inn',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'textbox', top: true },
    { do: 'walk', who: 'player', to: { x: 17, y: 12 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 15, y: 12 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 12 } },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', text: 'Under the stair there\'s a bunk so small it can only have been a child\'s.\n\nThe rail along the front is notched from one end to the other, in fives.' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{thinking}Five, ten, fifteen, twenty...' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'bramble', text: '{surprised}...I\'ve run out of fingers. Twice.' },
    { do: 'emote', who: 'ves', emote: '...' },
    { do: 'say', who: 'ves', text: '{surprised}...Hang on. Haven\'t we seen that before? Scratched in the rock, down in the Deep.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{thinking}Whose?' },
    { do: 'say', who: 'ves', text: '{smile}No idea. Somebody who liked rows.' },
    { do: 'textbox', top: false },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
