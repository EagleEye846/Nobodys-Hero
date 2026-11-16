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
    { do: 'walk', who: 'player', to: { x: 7, y: 7 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 5, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 9, y: 6 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    // The camera looks round it instead of saying so: the laid table, the stopped clock, the coats. (draft)
    { do: 'camera', to: { x: 7, y: 5 } },
    { do: 'wait', seconds: 1.8 },
    { do: 'camera', to: { x: 13, y: 3 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera', to: { x: 9, y: 3 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'wait', seconds: 1.2 },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{worried}...Somebody\'s left the butter out.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{scared}I\'m not sitting down.' },
    { do: 'music', song: 'merrowIndoor' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
