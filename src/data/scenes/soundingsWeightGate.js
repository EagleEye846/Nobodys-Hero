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
    { do: 'say', text: 'The hook at the end of the chain is just the size of the weight\'s brass eye.' },
    { do: 'leave', who: 'frame', instant: true },
    { do: 'appear', who: 'frame_full', instant: true },
    { do: 'say', text: 'You hang the Brass Sounding-Weight on it.' },
    { do: 'sound', name: 'door' },
    { do: 'wait', seconds: 1.2 },
    { do: 'leave', who: 'gate_a' },
    { do: 'leave', who: 'gate_b' },
    { do: 'say', text: 'The chain runs over its wheel with a long iron sigh, and the grille climbs into the rock. Somewhere above, there is daylight. Not much. Enough.' },
    { do: 'say', who: 'bramble', text: '{awed}It goes UP. Up is my favourite.' },
    { do: 'say', who: 'ves', text: '{proud}Finally. A direction I like.' },
  ],
};
