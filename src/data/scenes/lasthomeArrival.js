// LASTHOME ARRIVAL: at the gate of the great hall, Thistle, who keeps it.
// Everyone up the mountain asked if you were the Hero. Thistle doesn't. Ves
// can't believe it.
export const LASTHOME_ARRIVAL = {
  // Triggers in rooms name the scene by this id.
  id: 'lasthome_arrival',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_gate',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'thistle', look: 'prop:lh_thistle', x: 14, y: 5, portrait: 'thistle', plays: 'lh_thistle' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 9, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 11, y: 7 } },
    { do: 'walk', who: 'bramble', to: { x: 10, y: 8 } },
    { do: 'walk', who: 'thistle', to: { x: 13, y: 7 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'face', who: 'thistle', dir: 'left' },
    { do: 'say', who: 'thistle', text: '{surprised}Evening. You\'re off the fen. Nobody comes off the fen.\n\n{thoughtful}...Is she hurt?' },
    { do: 'say', who: 'bramble', text: '{determined}Her leg. The Hush got it. She needs a doctor. Have you got a doctor? Has she got to pay?' },
    { do: 'say', who: 'thistle', text: '{smile}Healer\'s on the left as you go in. Green door. Bryony. Nobody pays Bryony. Bryony wouldn\'t know what to do with it.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{surprised}...Aren\'t you going to ask?' },
    { do: 'say', who: 'thistle', text: '{thoughtful}Ask what, love?' },
    { do: 'say', who: 'ves', text: '{shy}If they\'re the Hero. Everyone asks. Everyone up the mountain asks, all the time.' },
    { do: 'say', who: 'thistle', text: '{laughing}The Hero! Ha! No, no. We stopped asking that here a long time ago. My great-great-gran stopped.' },
    { do: 'say', who: 'thistle', text: '{smile}You\'re somebody carrying a hurt girl to my gate at suppertime. That\'s all I need to know about you.\n\nWipe your feet.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{laughing}...Oh. Oh, I like it here.' },
  ],
};
