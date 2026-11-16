// NEEDLE MEMORY (DRAFT, 2026-11-14): the Soundings bell (secret_soundings_bell), as you take the Fair Return's compass
// needle off the divers' helmet. The needle shows a piece of the night she went down, a hundred years ago: a star
// falling out of the sky onto her bow (the vision wreck_star, src/overworld/wreckVisions.js). One of three memories, one
// in each piece of the compass (glass_memory, card_memory), in any order; each stands on its own. The trigger is the
// whole room, once you carry the needle, so it plays as soon as the pickup's words close. The hero never speaks.
export const NEEDLE_MEMORY = {
  id: 'needle_memory',
  room: 'secret_soundings_bell',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 6, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // The needle swings on your palm and stops, pointing straight up; then the night itself, and no words
    // over it: the brig, the star coming down slow as a feather, the small blue light left where it struck. (draft)
    { do: 'sound', name: 'shimmer' },
    { do: 'stage', notes: { at: { x: 7, y: 6 }, seconds: 3 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'vision', hideText: true, name: 'wreck_star', mood: 'calm', fade: 1.2 },
    { do: 'wait', seconds: 3 },
    { do: 'vision', hideText: true, name: 'wreck_star', mood: 'fall' },
    { do: 'wait', seconds: 4.2 },
    { do: 'vision', hideText: true, name: 'wreck_star', mood: 'struck' },
    { do: 'sound', name: 'flare' },
    { do: 'wait', seconds: 2.4 },
    { do: 'vision' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{awed}A star. A real one. It came all the way down.' },
    { do: 'say', who: 'ves', text: '{surprised}...And it landed on a ship. The whole sea to pick from, and it picked a ship.' },
  ],
};
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
