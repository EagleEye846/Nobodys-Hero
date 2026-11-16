// GULPER BEATEN: Old Gulper sinks back into his bell until only the tip of his tail hangs over
// the rim, and the crooked tooth, knocked clean out, skids across the water and bumps your boot.
// From inside the bell comes a long, grateful snore. Gives the Gulper Tooth. He stays in the
// bell, snoring (the room's prop after this scene). No monsters. The hero never speaks. DRAFT.
export const GULPER_BEATEN = {
  id: 'gulper_beaten',
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
    { do: 'animate', who: 'gulper', animation: 'mw_gulper_snore', speed: 0.9 },
    { do: 'wait', seconds: 0.8 },
    // The knocked-out tooth skids across the water and bumps your boot. (draft)
    { do: 'appear', who: 'tooth', at: { x: 14, y: 10 }, instant: true },
    { do: 'sound', name: 'clink' },
    { do: 'toss', who: 'tooth', to: { x: 14, y: 13 }, height: 26, bounces: 2 },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'act', who: 'player', act: 'crouch' },
    { do: 'leave', who: 'tooth', instant: true },
    { do: 'act', who: 'player', act: 'stand' },
    { do: 'give', item: 'gulper_tooth' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'bell' },
    { do: 'emote', who: 'bramble', emote: '?', wait: false },
    { do: 'say', who: 'bramble', text: '{surprised}...He\'s asleep. He\'s just gone to sleep.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{proud}Best night he\'s had in years, by the sound of it. You\'re welcome.' },
    { do: 'camera' },
    { do: 'music', song: 'merrow' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
