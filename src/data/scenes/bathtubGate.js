// BATHTUB GATE: at the pinch at the east end of the Dowager's beach, with the Bathtub Bell in
// your bag (this scene plays only after dowager_beaten or dowager_spared). A post with a
// bracket stands by the gate: the bell hangs on it, rings once, and the gate swings open
// onto the boardwalk. The two gate props in the room go when this scene begins (`until`);
// the actors here are the same two gates, which swing away during it. (The hero never speaks.)
export const BATHTUB_GATE = {
  id: 'bathtub_gate',
  room: 'wrack_bathtub',
  once: true,

  actors: [
    { id: 'gate_a', look: 'prop:gate_narrow', x: 37, y: 8 },
    { id: 'gate_b', look: 'prop:gate_narrow', x: 37, y: 9 },
    { id: 'ves', look: 'prop:vesper_stand', x: 33, y: 9, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed (the camera goes to the gate; the bell, the rattle and the swing
    // are heard and seen).
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'A notice on the post by the gate: RING FOR PASSAGE. (NO KNOCKING.)' },
    { do: 'act', who: 'player', act: 'hop' },
    { do: 'sound', name: 'bell' },
    { do: 'camera', to: { x: 37, y: 9 } },
    { do: 'wait', seconds: 1 },
    { do: 'quake', amount: 1, seconds: 0.6 },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.5 },
    { do: 'leave', who: 'gate_a' },
    { do: 'leave', who: 'gate_b' },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{smile}A bell that opens a gate. I like that. You can\'t lose a bell down your boot.' },
  ],
};
