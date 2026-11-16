// CARD MEMORY (DRAFT, 2026-11-14): the tidy cave on the Beacon Isles (secret_isles_cave), as you take the Fair Return's
// compass card from between the rows of shells. The card shows a piece of the night she went down, a hundred years
// ago: a boy alone on the rocks, watching her go (the vision wreck_shore, src/overworld/wreckVisions.js). Who he is is
// never said: only what can be seen (a coat far too big for him, a sword too long for him). One of three memories, one in
// each piece of the compass (glass_memory, needle_memory), in any order; each stands on its own. The trigger is the
// whole room, once you carry the card, so it plays as soon as the pickup's words close. The hero never speaks.
export const CARD_MEMORY = {
  id: 'card_memory',
  room: 'secret_isles_cave',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 8, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // The card's one rubbed-out point catches the light and holds you a moment too long; then the shore at
    // night and the boy on the rocks, with no words over it. (draft)
    { do: 'sound', name: 'shimmer' },
    { do: 'wait', seconds: 1.2 },
    { do: 'vision', hideText: true, name: 'wreck_shore', mood: 'calm', fade: 1.2 },
    { do: 'wait', seconds: 3.4 },
    { do: 'vision', hideText: true, name: 'wreck_shore', mood: 'sink' },
    { do: 'wait', seconds: 7 },
    { do: 'vision' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{awed}...There was a boy. All on his own. Where were his people?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Out on the rocks at night, by himself, with a sword. ...I\'d like to know who let him out.' },
  ],
};
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
