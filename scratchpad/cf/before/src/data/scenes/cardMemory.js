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
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'On the card, the one point with no letter, the one rubbed out by a thumb, catches the light. You look at it a little too long.' },
    { do: 'vision', name: 'wreck_shore', mood: 'calm', fade: 1.2 },
    { do: 'wait', seconds: 2 },
    { do: 'say', text: 'A shore at night, in a fog. Out on the water a brig is lying over on her side, her lantern low.' },
    { do: 'say', text: 'On the rocks at the water\'s edge a boy is standing alone, watching her. His coat is far too big for him: the hem drags on the stones and the sleeves hang past his hands. At his side, too long for him, a sword.' },
    { do: 'vision', name: 'wreck_shore', mood: 'sink' },
    { do: 'wait', seconds: 6.5 },
    { do: 'say', text: 'He doesn\'t call out. He doesn\'t run. He watches until she is gone.' },
    { do: 'vision' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{awed}...There was a boy. All on his own. Where were his people?' },
    { do: 'say', who: 'ves', text: '{thinking}Out on the rocks at night, by himself, with a sword. ...I\'d like to know who let him out.' },
  ],
};
