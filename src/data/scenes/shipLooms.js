// SHIP LOOMS (DRAFT, the secret way into the ghost ship): the cove's far east point (wreck_slip, the trigger at x 29-30,
// rows 6-8), once the old fog bell (the lever `fog_bell`, 29,4) has been rung. The bell's one long note, an answer out of the fog (eight
// bells, in pairs), and the brig Fair Return slides in against the point and lays her plank on the shingle. The first time it is
// said at length; after that (any time, `once: false`) the same thing quick. Then the party goes up the plank (goto ship_plank).
// Ves (28,9) and Bramble (28,6) stand on the shingle, clear of the pouch (28,5), the bell and the upturned boat (27,7). The hero never speaks.
export const SHIP_LOOMS = {
  id: 'ship_looms',
  room: 'wreck_slip',
  once: false,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 28, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 28, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'sound', name: 'bell', until: 'ship_boarding' },
    { do: 'wait', seconds: 0.8, until: 'ship_boarding' },
    { do: 'say', text: 'The fog has come in to the end of the shingle and stopped, like something waiting for a word. The bell you rang is still humming on its post.\n\nThen, from a long way out in the grey, something answers it. Not an echo. Eight bells, struck slowly, in pairs.', until: 'ship_boarding' },
    { do: 'say', who: 'bramble', text: '{scared}That isn\'t us. We only rang it the once.', until: 'ship_boarding' },
    { do: 'say', who: 'ves', text: '{bored}I\'d call that an answer. Rude of it, to speak up before the bell had finished.', until: 'ship_boarding' },
    { do: 'quake', seconds: 1.2 },
    { do: 'sound', name: 'shipGroan' },
    { do: 'say', text: 'The fog at the point leans in, and thickens, and is a wall. A great black side comes out of it without a sound: masts, ropes, gilt on a name. She settles against the end of the shingle as gently as a hand laid on a table.\n\nA plank slides out from her rail and rests on the stones. Nobody pushed it.' },
    { do: 'say', text: 'At your side, the Fallen Star is humming. It has been pointing at this fog since the mast.', until: 'ship_boarding' },
    { do: 'say', who: 'bramble', text: '{worried}...You\'re going to go aboard her, aren\'t you.', until: 'ship_boarding' },
    { do: 'say', who: 'ves', text: '{thoughtful}Of course he is. She doesn\'t go anywhere, and there is no other reason for anything out here to look like a prize. They always have a prize.', until: 'ship_boarding' },
    { do: 'say', who: 'ves', text: '{bored}Plank. Up. Mind the gap.', after: 'ship_boarding' },
    { do: 'walk', who: 'player', to: { x: 30, y: 7 } },
    { do: 'stage', dim: 1, seconds: 1.0 },
    { do: 'goto', room: 'ship_plank', spawn: { x: 2, y: 8 } },
  ],
};
