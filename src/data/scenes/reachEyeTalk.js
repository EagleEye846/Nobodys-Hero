// (draft).
//
// HADDOCK IN THE EYE (reach_eye, the column across the middle of the rock, x 20; once). The
// storm opens and goes quiet, and Haddock, on his crate, talks a little: the sea taking a
// breath, one line that might be about Corrie (he never says the name again after his
// lighthouse), and the three sent on up with a joke. Nothing about the night the light went
// out, and nothing about who is in the tower.
//
// Haddock is the room's prop (`haddock_reach`, sitting on a crate at 22,7); the actor plays
// it, so he stays sitting where he is. Ves and Bramble step in from following you, and the three
// gather in front of his crate (the hero 21,8, Ves 20,7, Bramble 20,9): from anywhere on the
// trigger column, so nobody talks to him from five rows away. They look up at the hole in the
// cloud when he tells them to.
export const REACH_EYE_TALK = {
  id: 'reach_eye_talk',
  room: 'reach_eye',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock_sit', x: 22, y: 7, portrait: 'haddock', plays: 'haddock_reach', animation: 'cf_haddock_sit', speed: 0.6 },
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 19, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'ves', to: { x: 20, y: 7 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 20, y: 9 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 21, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'haddock', text: "{tired}Quiet bit. Always is, in the middle. The sea's taking a breath." },
    { do: 'say', who: 'ves', text: '{bored}Lovely.' },
    { do: 'say', who: 'haddock', text: "{eh}Lovely, she says. It is, miss. Look at it." },
    // They look up at the hole in the cloud: no rain, no wind, the sea flat and green all the way round,
    // pale silver sky in the ring overhead. (draft)
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'stage', white: 0.22, seconds: 2.5 },
    { do: 'wait', seconds: 3 },
    { do: 'say', who: 'haddock', text: "{tender}He'd have liked this. ...The quiet." },
    { do: 'stage', notes: { at: { x: 22, y: 6 }, seconds: 3 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 2 },
    { do: 'stage', white: 0, seconds: 1.5 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'haddock', text: "{determined}Right. Up you go, the three of you, and careful. I'll be at the bottom with the Bother. Shout if you want me." },
    { do: 'say', who: 'bramble', text: "{sly}...You won't hear." },
    { do: 'say', who: 'haddock', text: "{proud}I'll hear you, lad. Everyone hears you." },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
