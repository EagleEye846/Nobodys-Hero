// SHIP CABIN OPEN: the deck, the captain's door (ship_deck, trigger (12, rows 9-11) once you carry the Captain's Key). The key turns.
// The door's closed prop goes (`until` this scene) and its open one comes (`after`). Behind it the captain is still
// saying "Mr Pike?". Ves (13,9) and Bramble (13,11); the lantern's hook is at (13,12): both are clear of it. The hero never speaks. DRAFT.
export const SHIP_CABIN_OPEN = {
  id: 'ship_cabin_open',
  room: 'ship_deck',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 13, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 12, y: 10 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'click' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'door' },
    { do: 'say', text: 'The key turns. It turns the way a key does that\'s been turned a thousand times and never once all the way. The bolt goes back. The door swings in a hand\'s width on its own, and stops.' },
    { do: 'say', text: 'From the other side, nearer now, a man\'s voice says: "Mr Pike?" It is the voice of someone who has said the name so many times he has stopped expecting anything to come of it.' },
    { do: 'say', who: 'bramble', text: '{sad}He sounds so tired.' },
    { do: 'say', who: 'ves', text: '{smile}...It says CAPTAIN on the door. I\'d have liked it to say COOK.' },
    { do: 'say', who: 'ves', text: '{worried}Whoever\'s in there has been asking for a long time. I\'m not sure he\'ll like who answers.' },
    { do: 'face', who: 'ves', dir: 'left' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
