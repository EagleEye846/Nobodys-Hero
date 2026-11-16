// GLASS MEMORY (DRAFT, 2026-11-14): the attic in the drowned hamlet (secret_lanes_attic), as you take the Fair Return's
// compass glass off the sill. The glass shows a piece of the night she went down, a hundred years ago: the lighthouse
// on the headland ahead of her going dark (the vision wreck_light, src/overworld/wreckVisions.js). One of three memories,
// one in each piece of the compass (needle_memory, card_memory), in any order; each stands on its own. The trigger is the
// whole room, once you carry the glass, so it plays as soon as the pickup's words close. The hero never speaks.
export const GLASS_MEMORY = {
  id: 'glass_memory',
  room: 'secret_lanes_attic',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 7, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'You turn the glass over in your hand. For a moment it shows you the attic, very slightly larger than it is.\n\nThen it shows you somewhere else.' },
    { do: 'vision', name: 'wreck_light', mood: 'calm', fade: 1.2 },
    { do: 'wait', seconds: 2.5 },
    { do: 'say', text: 'Night, and a fog coming down on the sea. A brig under all her sail, running for home. Ahead of her, on a headland, a lighthouse swings its long slow arm across the water.' },
    { do: 'vision', name: 'wreck_light', mood: 'out' },
    { do: 'wait', seconds: 2.4 },
    { do: 'say', text: 'The light gutters. It flares, once. Then it goes out, and the dark closes over the place where it was.\n\nThe brig sails on into it.' },
    { do: 'vision' },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{awed}...There was a ship. In the glass. Did you see? There was a whole ship.' },
    { do: 'say', who: 'ves', text: '{thinking}And a lighthouse going out right in front of her. ...That\'s not a picture anybody keeps in a compass on purpose.' },
  ],
};
