// SOUNDINGS IN: the first steps into the sea caves, up out of the flooded tunnel from Merrow's
// sea gate. The sea comes right in under the hill, and Bramble, who is scared enough of the sea
// outside, finds it indoors too. Nobody walks; the trigger is column 4 of soundings_mouth, just
// inside the tunnel and the lane's gate (no monsters in that room). The hero never speaks.
export const SOUNDINGS_IN = {
  id: 'soundings_in',
  room: 'soundings_mouth',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 4, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    // The sea comes right in under the hill: the camera goes out over the black water, the walls
    // glowing green, the whole cave booming. (draft)
    { do: 'stage', spots: [{ at: { x: 9, y: 3 }, color: '120, 230, 170', radius: 34 }, { at: { x: 14, y: 8 }, color: '120, 230, 170', radius: 30 }] },
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 0.6, seconds: 3 },
    { do: 'camera', to: { x: 12, y: 6 } },
    { do: 'wait', seconds: 2.2 },
    { do: 'camera' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{laughing}It\'s very forward, the sea.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{determined}It\'s only a big puddle with a roof on. I\'m not scared of a puddle.' },
    { do: 'say', who: 'ves', text: '{smile}There\'s a chart on that board. Let\'s see what somebody made of it.' },
    { do: 'face', who: 'player', dir: 'right' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
