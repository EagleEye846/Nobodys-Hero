// SHIP FLOODED BOW IN (DRAFT): the west end of the flooded bow (ship_flooded_bow, trigger x 1-2, rows 9-10, once). The forepeak flooded to the beams,
// six little decks standing in it, planks on cleats between them, a cold light a long way off at the far end, and a laugh over the water. The ship
// lurching by herself starts after this scene (the room's clock waits for scenes). Ves (3,10) and Bramble (3,8) stand on the first island, clear of
// plank A (row 10, x 4-7), the ghost boy (1,8) and the chalk (2-3, 11). The hero never speaks.
export const SHIP_FLOODED_BOW_IN = {
  id: 'ship_flooded_bow_in',
  room: 'ship_flooded_bow',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The deck goes down at the bow, and the sea has come up to meet it. Black water, level with the beams. Standing out of it, little decks the size of a bedroom, six of them, with planks run between them on cleats, some above the water and some under it.\n\nA long way off, at the far end, there is a cold light. And over the water, light and glad and a little too close, someone is laughing.' },
    { do: 'say', who: 'bramble', text: '{scared}Nobody laughs like that in a place like this.' },
    { do: 'say', who: 'ves', text: '{bored}Someone\'s having a lovely time. That makes one of us.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{smile}...After you. No, really. After you.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
