// (draft) story text, for Patrick to review.
//
// HADDOCK IN THE EYE (reach_eye, the column across the middle of the rock, x 20; once). The
// storm opens and goes quiet, and Haddock, on his crate, talks a little: the sea taking a
// breath, one line that might be about Corrie (he never says the name again after his
// lighthouse), and the three sent on up with a joke. Nothing about the night the light went
// out, and nothing about who is in the tower.
//
// Haddock is the room's prop (`haddock_reach`, sitting on a crate at 22,7); the actor plays
// it, so he stays sitting where he is. Ves and Bramble step in from following you. Nobody walks.
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
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'haddock', text: "{tired}Quiet bit. Always is, in the middle. The sea's taking a breath." },
    { do: 'say', who: 'bramble', text: '{worried}Is it going to let it out?' },
    { do: 'say', who: 'haddock', text: '{smile}Oh, aye. All over us.' },
    { do: 'say', who: 'ves', text: '{bored}Lovely.' },
    { do: 'say', who: 'haddock', text: '{eh}Lovely, she says. It is, miss. Look at it.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'For a moment there is nothing at all: no rain, no wind. The sea lies flat and green all the way round, and straight overhead there is a round hole in the cloud, full of stars.' },
    { do: 'say', who: 'haddock', text: "{tender}He'd have liked this. ...The quiet." },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'haddock', text: "{determined}Right. Up you go, the three of you, and careful. I'll be at the bottom with the Bother. Shout if you want me." },
    { do: 'say', who: 'bramble', text: "{thinking}...You won't hear." },
    { do: 'say', who: 'haddock', text: "{proud}I'll hear you, lad. Everyone hears you." },
    { do: 'stage', notes: { at: { x: 22, y: 6 }, seconds: 3 } },
    { do: 'say', text: 'He shuts his eyes and hums a bar of his old tune, low, under the moustache. Then he stops, and looks at the tower, and says nothing else.' },
  ],
};
