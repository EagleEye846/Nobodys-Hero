// GULPER SPARED: you won Old Gulper round (the tooth was wiggled loose, and came out in your
// hand with a small wet pop). He lays his chin on the rim of the bell and goes to sleep, and the
// tower is quiet for the first time in a hundred years. Gives the Gulper Tooth. He stays in the
// bell, dozing (the room's prop after this scene). No monsters. The hero never speaks. DRAFT.
export const GULPER_SPARED = {
  id: 'gulper_spared',
  room: 'merrow_belfry',
  once: true,

  actors: [
    { id: 'gulper', look: 'anim:mw_gulper_out', animation: 'mw_gulper_out', speed: 0.6, x: 14, y: 9, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'camera', to: { x: 14, y: 11 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The tooth is in your hand: as long as your arm, curved, pale as a candle, and still warm. It came out with a small, wet pop.\n\nOld Gulper works his jaw this way and that. Nothing hurts. He looks very surprised about it.' },
    { do: 'give', item: 'gulper_tooth' },
    { do: 'say', who: 'gulper', text: '"...Huh."\n\n"Keep it. I don\'t want it."' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{glee}He said keep it. We\'ve got an eel\'s tooth.' },
    { do: 'animate', who: 'gulper', animation: 'mw_gulper_doze', speed: 1.1 },
    { do: 'say', text: 'He lays his chin on the rim of the bell, carefully, so as not to ring it, and shuts his eye. The ropes stop swaying. For the first time in a hundred years, the tower is completely quiet.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}Nobody ring anything.' },
    { do: 'camera' },
    { do: 'music', song: 'merrow' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
