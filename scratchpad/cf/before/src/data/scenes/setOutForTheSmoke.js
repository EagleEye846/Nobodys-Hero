// SET OUT FOR THE SMOKE: the hand-off from Chapter 5 to Chapter 6 (a placeholder; how the
// chapter really begins is still to be decided). After the end of Chapter 5, in the Saltcombe
// harbour office, there's Haddock's chart on its board with a pencil line out to the north-east. Press Z
// on it once and it says what setting out leaves behind (the ghost ship, Orla's forge); press Z
// again and this plays: a few words, then on to the bare seabed and the start of Chapter 6
// (ash_road_opens). Nothing in the room moves. (draft)
export const SET_OUT_FOR_THE_SMOKE = {
  id: 'set_out_for_the_smoke',
  room: 'saltcombe_harbour_office',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 5, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'say', who: 'bramble', text: '{thinking}That\'s where the smoke is. Where the line goes.' },
    { do: 'say', who: 'ves', text: '{determined}That\'s where the boy\'s boat went. So that\'s where we\'re going. Obviously.' },
    { do: 'say', who: 'bramble', text: '{worried}...Is it far?' },
    { do: 'say', who: 'ves', text: '{smile}Everything\'s far. Bring your bell.' },
    { do: 'stage', dim: 1, seconds: 2.5 },
    { do: 'wait', seconds: 2.7 },
    // On to Chapter 6: its card, then the bare seabed under the old slip.
    { do: 'end_chapter', chapter: 5, card: 'chapter_start_ash.txt', room: 'ash_seabed', spawn: { x: 5, y: 5 } },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
