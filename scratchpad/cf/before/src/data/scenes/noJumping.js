// NO JUMPING: out of the hut's back door with Ves on your back, at the first
// strip of bog. You'd have hopped it this morning.
export const NO_JUMPING = {
  // Triggers in rooms name the scene by this id.
  id: 'no_jumping',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_jetty',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 5, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{scared}That\'s bog. That\'s a stripe of bog.\n\n{furious}Don\'t you DARE jump.' },
    { do: 'say', who: 'bramble', text: '{grin}I can jump it. I can jump anything. Watch.' },
    { do: 'say', text: '(Press Q to go on as Bramble. He can hop the bog, and there are logs on the far sides for him to roll in.)' },
    { do: 'say', who: 'ves', text: '{worried}Bramble, be careful!\n\n{shy}...He\'s very loud, isn\'t he. I like him.' },
  ],
};
