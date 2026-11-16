// THE SCARF: in the middle of the rushes, trodden into the mud, Ves's scarf.
// Cream with a coral stripe, soaked through. Bramble finds it first.
export const THE_SCARF = {
  // Triggers in rooms name the scene by this id.
  id: 'the_scarf',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_rushes',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'bramble', to: { x: 9, y: 14 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'say', who: 'bramble', text: '{surprised}Sword! Here! There\'s something in the mud!' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{worried}It\'s a scarf. It\'s hers, isn\'t it. It\'s all trodden in.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{determined}Doesn\'t mean anything. You drop things. I drop things all the time.\n\n{sad}...Pick it up. She\'ll want it.' },
  ],
};
