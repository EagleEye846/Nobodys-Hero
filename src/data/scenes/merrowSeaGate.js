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
    // They see the gap in the iron teeth first, and only then think of the tooth in the bag. (draft)
    { do: 'camera', to: { x: 17, y: 4 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'emote', who: 'bramble', emote: '?' },
    { do: 'say', who: 'bramble', text: '{surprised}It\'s got a tooth missing. Right at the front.' },
    { do: 'face', who: 'ves', at: 'player' },
    { do: 'wait', seconds: 0.5 },
    { do: 'emote', who: 'ves', emote: '!' },
    { do: 'say', who: 'ves', text: '{bored}...We have a tooth.' },
    // The tooth goes into the empty socket; the chains take up; the jaws grind apart. (draft)
    { do: 'wait', seconds: 0.4 },
    { do: 'act', who: 'player', act: 'lunge' },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'door' },
    { do: 'quake', amount: 1, seconds: 0.5 },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 1.6, seconds: 2.2 },
    { do: 'stage', burst: { at: { x: 17, y: 4 }, power: 0.8 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'leave', who: 'gate' },
    { do: 'wait', seconds: 1.6 },
    { do: 'camera' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{surprised}It fit! That old eel was walking round with a key in his mouth!' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{laughing}No wonder it hurt.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
