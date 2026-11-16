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
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'The needle swings on your palm, round and round, and stops. It is pointing straight up.' },
    { do: 'vision', name: 'wreck_star', mood: 'calm', fade: 1.2 },
    { do: 'wait', seconds: 2 },
    { do: 'say', text: 'Night, and fog on the sea. A brig a long way out, her stern lantern small and yellow.' },
    { do: 'vision', name: 'wreck_star', mood: 'fall' },
    { do: 'wait', seconds: 4.2 },
    { do: 'vision', name: 'wreck_star', mood: 'struck' },
    { do: 'sound', name: 'flare' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', text: 'Out of the sky, slow as a feather, came a light: white, burning, falling toward the sea. It came down at her bow, and struck.\n\nWhere it struck, a small blue light is left. It does not go out.' },
    { do: 'say', wields: 'fallen_star', text: 'At your hip, the Fallen Star hums the whole time the needle is in your hand.' },
    { do: 'vision' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{awed}A star. A real one. It came all the way down.' },
    { do: 'say', who: 'ves', text: '{surprised}...And it landed on a ship. The whole sea to pick from, and it picked a ship.' },
  ],
};
