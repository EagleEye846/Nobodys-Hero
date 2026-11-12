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
    { do: 'say', text: 'The stair comes down out of the rain onto a street, and the street stops at a rail, and past the rail is Merrow.\n\nMost of it is under the water. The water is green and very clear: you can see down into it, the cobbles, the doorsteps, a cart with its shafts in the air. The roofs stand out of it in rows, chimneys and all. Across the water, a bell tower.' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}There\'s a whole town under there. With doors on.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}Towns do tend to have doors.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'drownedBell' },
    { do: 'act', who: 'ves', act: 'look', wait: false },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Somewhere down under the water, a bell rings. Four strokes, slow and even. Then nothing.' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'say', who: 'bramble', text: '{worried}...Who\'s ringing it?' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{thoughtful}Nobody. You can see right through the top of the tower.' },
    { do: 'say', who: 'bramble', text: '{worried}Then it\'s doing it on its own. A bell should wait to be rung.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}Over the roofs, then. Mind the slates. They\'re older than you are.' },
    { do: 'face', who: 'ves', dir: 'right' },
  ],
};
