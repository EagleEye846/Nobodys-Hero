// MERROW IN: the first time down the stair from the Sunken Lanes onto Merrow's top street
// (merrow_steps). The town is under the water below the street's rail, roofs and chimneys
// standing out of it, the bell tower across the water. A bell rings somewhere below, and there is
// nobody in any tower to ring it. Nobody walks (the trigger is the whole of row 4, just below
// the stair; no monsters in that room). The hero never speaks. DRAFT words, for the designer.
export const MERROW_IN = {
  id: 'merrow_in',
  room: 'merrow_steps',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 14, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 3, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    // The camera goes down over the rail to the town under the water. (draft)
    { do: 'camera', to: { x: 18, y: 12 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{awed}There\'s a whole town under there. With doors on.' },
    { do: 'say', who: 'ves', text: '{glee}And curtains.' },
    { do: 'wait', seconds: 0.6 },
    // Four slow strokes from somewhere down in the water, and the camera goes looking for the tower. (draft)
    { do: 'sound', name: 'drownedBell' },
    { do: 'quake', amount: 0.6, seconds: 1.4 },
    { do: 'camera', to: { x: 28, y: 12 } },
    { do: 'act', who: 'ves', act: 'look', wait: false },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'wait', seconds: 2 },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'say', who: 'ves', text: '{worried}...Nobody\'s up there. You can see right through the tower.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{worried}Then it\'s ringing itself. A bell should wait to be rung.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{determined}Over the roofs, then. Mind the slates. They look older than you.' },
    { do: 'face', who: 'ves', dir: 'right' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
