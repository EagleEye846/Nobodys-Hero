// THE DEAD CITY: out of Lasthome's far door, into the empty part of the old
// city. Flags rotted to threads on every roof, dead lamps, and the street
// running on toward the Gate. Ves on her crutch, looking at it all.
export const THE_DEAD_CITY = {
  // Triggers in rooms name the scene by this id.
  id: 'the_dead_city',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_old_street',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 1, y: 7, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'ves', to: { x: 4, y: 7 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'A long street of shut doors and dead lamps, running on east. On every roof, a flagpole, and on every flagpole, a rag that was a flag once.' },
    { do: 'say', who: 'ves', text: '{thoughtful}They decorated. The whole city. For him.\n\n{sad}It\'s like Heralds\' Rest, but everyone\'s gone home.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{determined}Right. The umbrella. The Gate.\n\n{smile}You do the climbing. I\'ll do the clever bits.' },
    { do: 'say', text: '(Press Q to switch between you and Ves. She can\'t climb or push, but she can reach things you can\'t, and read the old city\'s writing.)' },
  ],
};
