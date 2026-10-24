// THE HERON FLATS: open mudflats, and herons standing in the reeds so still
// you'd take them for reeds. Ves knows. She's seen one move.
export const THE_HERON_FLATS = {
  // Triggers in rooms name the scene by this id.
  id: 'the_heron_flats',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_heron_flats',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 5, y: 6, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'ves', text: '{scared}Shh. Stop. Don\'t move.\n\nSee the reeds over there? Some of them aren\'t reeds.' },
    { do: 'say', who: 'bramble', text: '{thinking}They look like reeds.' },
    { do: 'say', who: 'ves', text: '{worried}That\'s what they WANT. One of them stood next to me for an hour yesterday. Then it opened its eye.\n\nGo wide round anything tall.' },
  ],
};
