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
    { do: 'say', who: 'bramble', text: '{worried}I can see it moving. The water. It\'s going on its own.' },
    { do: 'say', who: 'ves', text: '{bored}Then don\'t tell me about it.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{thoughtful}...It\'s going to the low side. It does that. Whichever side\'s low. It\'ll go the other way if we lean her.' },
    { do: 'say', who: 'bramble', text: '{worried}Why would we lean her?' },
    { do: 'say', who: 'ves', text: '{thoughtful}I don\'t know, Bramble. But I\'d bet whatever we came down here for is under it.' },
  ],
};
