// TOWER LANE GRATE: coming up the lane under Merrow's bell tower (merrow_tower_lane). The
// tower's door is barred from inside. Beside it, at the waterline, is an old flood grating with
// half its bars rusted away: a hole about the size of a ten-year-old, and full of sea. Ves
// points out whose size that is; Bramble is scared and says so. Then it's over to the player
// (E steers Bramble). The trigger is the whole of column 12; the walks stay in x 13 to 17, rows
// 8 to 10 (the room's monsters are east of x 26). The hero never speaks. DRAFT words.
export const TOWER_LANE_GRATE = {
  id: 'tower_lane_grate',
  room: 'merrow_tower_lane',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 16, y: 8 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 14, y: 9 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 15, y: 10 } },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    // The hero pushes the oak door and it doesn't so much as rattle; then the camera goes to the rusted grating
    // at the waterline. (draft)
    { do: 'camera', to: { x: 17, y: 6 } },
    { do: 'act', who: 'player', act: 'lunge' },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.5 },
    { do: 'act', who: 'player', act: 'shake' },
    { do: 'camera', to: { x: 20, y: 7 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{smile}That\'s a Bramble-sized hole.' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}It\'s a SEA-sized hole. It\'s full of sea!' },
    { do: 'say', who: 'ves', text: '{proud}It\'ll come up to your chin. I measured it with my eyes. Be quick.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{determined}...I\'m going to be SO quick.' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', text: 'Only Bramble will fit through the grating. (E steers him.)' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
