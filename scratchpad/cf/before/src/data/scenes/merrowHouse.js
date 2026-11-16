// MERROW HOUSE: in through the one door standing open on the drowned square (merrow_house).
// Inside it is dry. The table is laid for four, the chairs pushed back, the clock stopped, the
// coats on their pegs. Nobody. Played quietly: one line from Bramble, one from Ves, and nothing
// is explained. Nobody walks far (the trigger is just inside the door; no monsters here).
// The hero never speaks. DRAFT words, for the designer.
export const MERROW_HOUSE_SCENE = {
  id: 'merrow_house',
  room: 'merrow_house',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 6, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'It is dry in here. Not a drop on the floor, though the door was standing open onto the flood.' },
    { do: 'walk', who: 'player', to: { x: 7, y: 7 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 5, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 9, y: 6 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'The table is laid for four. Plates, cups, a loaf on its board, the butter out. The chairs are pushed back from it, all four of them, the way chairs are when people have only just got up.\n\nThe clock in the corner says ten to seven, and isn\'t going. Four coats hang on the pegs, and a small hat.' },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'wait', seconds: 1.6 },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{worried}...Somebody\'s left the butter out.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{scared}I\'m not sitting down.' },
    { do: 'music', song: 'merrowIndoor' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
