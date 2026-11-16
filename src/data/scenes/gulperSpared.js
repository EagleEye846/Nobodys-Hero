// GULPER SPARED: you won Old Gulper round (the tooth was wiggled loose, and came out in your
// hand with a small wet pop). He lays his chin on the rim of the bell and goes to sleep, and the
// tower is quiet for the first time in a hundred years. Gives the Gulper Tooth. He stays in the
// bell, dozing (the room's prop after this scene). No monsters. The hero never speaks. DRAFT.
export const GULPER_SPARED = {
  id: 'gulper_spared',
  room: 'merrow_belfry',
  once: true,

  actors: [
    { id: 'tooth', look: 'anim:tf_tooth', x: 14, y: 10, hidden: true },
    { id: 'gulper', look: 'anim:mw_gulper_out', animation: 'mw_gulper_out', speed: 0.6, x: 14, y: 9, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'camera', to: { x: 14, y: 11 } },
    { do: 'wait', seconds: 0.6 },
    // He works his jaw this way and that, and nothing hurts. (draft)
    { do: 'act', who: 'gulper', act: 'shake' },
    { do: 'emote', who: 'gulper', emote: '?', wait: false },
    { do: 'act', who: 'gulper', act: 'shake' },
    // The tooth pops out into your hand. (draft)
    { do: 'appear', who: 'tooth', at: { x: 14, y: 10 }, instant: true },
    { do: 'sound', name: 'clink' },
    { do: 'toss', who: 'tooth', to: { x: 14, y: 12 }, height: 30, bounces: 0 },
    { do: 'leave', who: 'tooth', instant: true },
    { do: 'give', item: 'gulper_tooth' },
    { do: 'say', who: 'gulper', text: '"...Huh."\n\n"Keep it. I don\'t want it."' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{glee}He said keep it. We\'ve got an eel\'s tooth.' },
    // Chin on the rim, so as not to ring it; quiet. (draft)
    { do: 'animate', who: 'gulper', animation: 'mw_gulper_doze', speed: 1.1 },
    { do: 'wait', seconds: 2 },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}Nobody ring anything.' },
    { do: 'camera' },
    { do: 'music', song: 'merrow' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
