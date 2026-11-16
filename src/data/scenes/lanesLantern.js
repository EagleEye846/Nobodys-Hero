// LANES LANTERN: the culvert under the drowned lane opens into a dry pocket of air, and in the
// middle of it a lantern is burning (lantern 4 of the chapter). Ves walks a few steps toward it,
// stops for a second, and says nothing. Then she goes on. Nobody asks who lit it, and nobody
// says. (The hero never speaks.) The walks stay on the pocket's floor (rows 8 to 10); the pocket
// has no monsters.
export const LANES_LANTERN = {
  id: 'lanes_lantern',
  room: 'lanes_bubble',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // The hero on row 9, so Ves passes above along row 8 and Bramble below on row 10.
    { do: 'walk', who: 'player', to: { x: 10, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    // The camera goes to the lantern: the pocket of air round it, the flame that doesn't lean. (draft)
    { do: 'camera', to: { x: 15, y: 7 } },
    { do: 'stage', spots: [{ at: { x: 15, y: 6 }, color: '255, 214, 140', radius: 38 }] },
    { do: 'wait', seconds: 1.6 },
    { do: 'camera' },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'walk', who: 'ves', to: { x: 10, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 14, y: 8 } },
    { do: 'face', who: 'ves', dir: 'up' },
    // Ves stops, and says nothing. (draft)
    { do: 'wait', seconds: 2.2 },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 10 } },
    { do: 'face', who: 'bramble', at: { x: 14, y: 7 } },
    { do: 'say', who: 'bramble', text: '{surprised}...It\'s not even wet.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'walk', who: 'ves', to: { x: 16, y: 9 } },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
