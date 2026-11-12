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
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The post by the gate has a bracket on top, just the size of a ship\'s bell, and a notice: RING FOR PASSAGE. (NO KNOCKING.)\n\nYou hang the Bathtub Bell on the bracket.' },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 1.4 },
    { do: 'leave', who: 'gate_a' },
    { do: 'leave', who: 'gate_b' },
    { do: 'act', who: 'player', act: 'hop', wait: false },
    { do: 'say', text: 'It rings once, low and round, and every board in the gate rattles and sighs. Then the gate swings open on its own, like a door that has been waiting to be asked.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}A bell that opens a gate. Sensible. You can\'t lose a bell down your boot.' },
  ],
};
