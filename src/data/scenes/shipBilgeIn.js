// SHIP BILGE IN: down into the bilge (ship_bilge, trigger x 4, rows 4-6, just east of the ladder you came down).
// The lowest room, black water, a ghost boy bailing. Ves (2,6), Bramble (2,4). The hero never speaks. DRAFT words.
export const SHIP_BILGE_IN = {
  id: 'ship_bilge_in',
  room: 'ship_bilge',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The bottom of the ship. The planking sweats. A black, still sheet of water lies across the middle of the floor, the ballast water, a hundred years old, with the dark in it standing straight down.\n\nFrom somewhere across it comes a small, regular sound: scrape, slop. Scrape, slop. Somebody is bailing.' },
    { do: 'say', text: 'Under the water, toward the north side, a board stands up by the sump. On a nail on the board, something small and brass catches the light.' },
    { do: 'say', who: 'bramble', text: '{awed}There\'s something IN there. On a nail. It\'s shiny.' },
    { do: 'say', who: 'ves', text: '{angry}Then it can stay in there. I\'m not putting my arm in a hundred-year-old puddle.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'bramble', text: '{scared}...Who\'s bailing? Ves, who\'s BAILING?' },
    { do: 'say', who: 'ves', text: '{determined}Nobody. Nobody is. Keep walking.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
