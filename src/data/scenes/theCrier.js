// THE CRIER: on the crier's stone in the middle of the square, a Herald's
// Echo: the shade of the town crier, still crying the Hero's coming to empty
// streets, every morning, the way it always has. It doesn't see you. Ves
// listens to the whole thing.
export const THE_CRIER = {
  // Triggers in rooms name the scene by this id.
  id: 'the_crier',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_crier_square',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'echo', look: 'enemy:heralds_echo', x: 12, y: 6 },
    { id: 'ves', look: 'prop:vesper_crutch', x: 4, y: 7, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'walk', who: 'ves', to: { x: 5, y: 8 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'echo', text: 'HEAR YE! HEAR YE!', shake: true },
    { do: 'say', who: 'echo', text: 'THE HERO COMES TODAY! TODAY THE HERO WALKS THROUGH THE GATE!\n\nPUT OUT THE FLAGS! RING THE BELLS! WEAR YOUR BEST! TODAY! TODAY!' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'echo', text: 'HEAR YE! HEAR YE!' },
    { do: 'say', who: 'ves', text: '{sad}It doesn\'t even know we\'re here.\n\nIt\'s been saying that every morning. For three hundred years. To nobody.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'ves', text: '{thoughtful}At home they ring the bell when anybody comes up the stairs. Just in case.\n\n{sad}I used to think that was hopeful. I don\'t know any more.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'echo', text: 'THE HERO COMES TODAY!' },
    { do: 'say', who: 'ves', text: '{determined}...Come on. Before it notices us. I don\'t want to be the one who tells it.' },
  ],
};
