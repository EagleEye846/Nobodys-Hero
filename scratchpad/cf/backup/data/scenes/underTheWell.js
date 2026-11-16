// UNDER THE WELL: you come up out of black water at the bottom of the well,
// still holding Bramble's hand. Far above, the round of sky; nothing looking
// down. And on the wall, fresh, Ves's chalk: an arrow, pointing on into the
// dark. She's alive, and she went on. (The end of the Hushwood.)
export const UNDER_THE_WELL = {
  // Triggers in rooms name the scene by this id.
  id: 'under_the_well',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hollin_well_bottom',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_sit', x: 9, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'wait', seconds: 2 },
    { do: 'say', who: 'bramble', text: '{tired}...pff. Pffff. Bleh.' },
    { do: 'say', who: 'bramble', text: '{scared}Are we dead?\n\n{thinking}...I don\'t think we\'re dead. Dead people aren\'t this wet.' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Far, far above, a little round of grey sky. Nothing is looking down. Not any more.' },
    { do: 'say', who: 'bramble', text: '{worried}It didn\'t follow. It just... looked. Like in Grandad\'s story.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{surprised}Sword. SWORD. The wall!' },
    { do: 'camera', to: { x: 9, y: 3 } },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'A chalk arrow on the wet stone, pointing on into the dark.\n\nIt\'s fresh.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{awed}She made it. She came down here, and she was alright enough to draw an arrow, and she went on.' },
    { do: 'say', who: 'bramble', text: '{grin}...You didn\'t let go. The whole way down.\n\n{proud}Neither did I. Obviously.' },
    { do: 'say', who: 'bramble', text: '{determined}Come on, Sword. Let\'s go and find your friend.' },
  ],
};
