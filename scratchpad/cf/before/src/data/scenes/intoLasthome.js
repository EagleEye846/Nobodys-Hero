// INTO LASTHOME: inside the great hall. A whole town under one broken roof,
// lamps at every corner, washing, a market, children, and nobody waiting for
// anybody.
export const INTO_LASTHOME = {
  // Triggers in rooms name the scene by this id.
  id: 'into_lasthome',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_square',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 20, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'walk', who: 'bramble', to: { x: 17, y: 18 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'camera', to: { x: 16, y: 10 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'Inside the great hall, under its broken roof, there\'s a whole town: cottages built against the old pillars, a cobbled square, a market, washing, smoke, and lamps lit at every corner.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{awed}It\'s a whole TOWN. Inside a HOUSE.' },
    { do: 'say', who: 'ves', text: '{surprised}Nobody\'s looking at us. Nobody\'s got trumpets. Nobody\'s even stopped what they\'re doing.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{tender}They\'re not waiting for anything. Look at them.\n\nThey\'re just living.' },
    { do: 'say', who: 'bramble', text: '{determined}Green door. On the left. Come on, Sword!' },
  ],
};
