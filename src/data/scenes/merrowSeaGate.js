// MERROW SEA GATE: at Merrow's iron sea gate (merrow_sea_gate), with the Gulper Tooth in your
// bag (this plays only after gulper_spared or gulper_beaten). The gate is a great fish's head
// with its mouth open; the bars are its teeth, and one is missing. The tooth goes in the empty
// socket and the jaws swing open on the flooded tunnel to the Soundings. The shut gate prop goes
// when this scene begins (`until`); the actor here stands in for it, and goes during the scene.
// The walks stay in x 15 to 20, rows 5-6 (the moonjelly is on row 10). The hero never speaks. DRAFT.
export const MERROW_SEA_GATE_SCENE = {
  id: 'merrow_sea_gate',
  room: 'merrow_sea_gate',
  once: true,

  actors: [
    { id: 'gate', look: 'prop:mw_sea_gate', x: 17.5, y: 4 },
    { id: 'ves', look: 'prop:vesper_stand', x: 15, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 17, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'Up close, the sea gate is a fish: a great iron head with its mouth wide open, and the bars across the tunnel are its teeth. One tooth at the front is missing. Its socket is just the shape of the one in your bag.\n\nYou fit the Gulper Tooth into the socket. It goes in with a clunk.' },
    { do: 'sound', name: 'door' },
    { do: 'quake', seconds: 0.5 },
    { do: 'wait', seconds: 1.2 },
    { do: 'leave', who: 'gate' },
    { do: 'act', who: 'player', act: 'hop', wait: false },
    { do: 'say', text: 'Somewhere in the wall, chains take up. The iron jaws grind apart, slowly, and stay open. Behind them the flooded tunnel runs on under the cliff.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{thinking}So the eel had the key in his mouth. The whole time.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}No wonder it hurt.' },
  ],
};
