// THE WEIGHT GATE: in soundings_up, at the grille across the throat of the stair, with the brass
// sounding-weight (this scene plays only after soundings_the_weight, which gives it). The hero
// hangs it on the empty hook of the counterweight frame; the chain runs over its wheel and the
// grille goes up into the rock for good. The grille and empty-frame props go as this begins
// (`until`) and the full frame only comes after it (`after`), so actors stand in for all of them
// (the frame at 13.5: the middle of the 2-wide prop at x 13): the grille lifts away and the frame
// swaps to the full one when the weight goes on. Nobody walks. The hero never speaks.
export const SOUNDINGS_WEIGHT_GATE = {
  id: 'soundings_weight_gate',
  room: 'soundings_up',
  once: true,

  actors: [
    { id: 'gate_a', look: 'prop:gate_narrow', x: 11, y: 16 },
    { id: 'gate_b', look: 'prop:gate_narrow', x: 12, y: 16 },
    { id: 'frame', look: 'prop:sd_counterweight', x: 13.5, y: 17 },
    { id: 'frame_full', look: 'prop:sd_counterweight_full', x: 13.5, y: 17, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 19, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 19, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    // The hook, the weight going on it, the chain running over its wheel, the grille climbing into the rock
    // and daylight coming down the stair. (draft)
    { do: 'camera', to: { x: 13, y: 16 } },
    { do: 'wait', seconds: 0.5 },
    { do: 'act', who: 'player', act: 'lunge' },
    { do: 'leave', who: 'frame', instant: true },
    { do: 'appear', who: 'frame_full', instant: true },
    { do: 'sound', name: 'door' },
    { do: 'quake', amount: 1, seconds: 0.4 },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera', to: { x: 11, y: 15 } },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 1.2, seconds: 2 },
    { do: 'leave', who: 'gate_a' },
    { do: 'leave', who: 'gate_b' },
    { do: 'stage', shafts: [{ at: { x: 11.5, y: 16 }, w: 1.8, color: '214, 236, 232' }] },
    { do: 'wait', seconds: 2 },
    { do: 'camera' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{awed}It goes UP. Up is my favourite.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{proud}Finally. A direction I like.' },
  ],
};
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
