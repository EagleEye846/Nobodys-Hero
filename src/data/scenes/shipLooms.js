// SHIP LOOMS (DRAFT, the secret way into the ghost ship): plays once, the moment the Fair Return's own fog bell (the lever
// `fog_bell`, on the fog-watch's stump on the Watch Rock, wreck_watch_rock 22..23,5) is first rung IN THE FOG (at high water:
// the bell only takes then, `onlyTide`). It is the bell's own scene. The note goes out; the fog wall at the end of the
// fog-watch's stones (31, rows 7-8) answers with eight bells and parts like a curtain, and behind it is a black hull with the
// stones running out to her side. Then it is over and you walk out to her yourself (the door at 33, rows 7-8, to ship_plank,
// where her gangway comes down: ship_boarding). Reworked 14 November (it used to be on the Wreck Yard slip's point).
// The hero stands at the bell (22..23, 6); Ves (20,7) and Bramble (20,9) stand back on the rock, clear of the pool (21,9), the
// ring (19,10) and the hook (26,6). No monsters on the rock. The hero never speaks.
export const SHIP_LOOMS = {
  id: 'ship_looms',
  room: 'wreck_watch_rock',
  once: true,
  // When it's over she lies alongside (the room's gs_hull_rock and her plank, `after` this).
  sees: ['ship_alongside'],

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 9, portrait: 'bramble', plays: 'bramble' },
    // Her, lying off the rock (the room's gs_hull_rock, x 36-43, rows 0-16), hidden until the fog parts.
    // Her: she sails in from the south, out of the fog, bow first, and comes to rest off the rock (the room's own
    // gs_hull_rock, x 36-43, rows 0-16, takes over once the scene is done: `sees: ship_alongside`).
    { id: 'ship', look: 'prop:gs_hull_rock', x: 39.5, y: 34, hidden: true, flat: true },
    // Her boarding plank, hauled up against the gap in her rail (hinged at x 36, rows 7-8), until it swings down onto the stones.
    { id: 'plank', look: 'prop:gs_gangway_up', x: 33.5, y: 9, hidden: true },
  ],

  steps: [
    // (draft) 2026-11-15: trimmed (the answering bell is heard, the fog parting and the brig gliding in are seen).
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'camera', to: { x: 33, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 1.2 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 1.2 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 2.2 },
    // From inside the fog, a bell answers yours: two strokes and a gap, two strokes and a gap, struck by nobody.
    { do: 'sound', name: 'toll' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'toll' },
    { do: 'wait', seconds: 1.6 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'sound', name: 'toll' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'toll' },
    { do: 'wait', seconds: 1.6 },
    // She glides down along the rock out of the fog, no wind and no oars, slowing, slowing, and stops dead by the stones.
    { do: 'appear', who: 'ship', instant: true },
    { do: 'sound', name: 'creak' },
    { do: 'walk', who: 'ship', to: { x: 39.5, y: 22 }, pace: 64 },
    { do: 'sound', name: 'creak' },
    { do: 'walk', who: 'ship', to: { x: 39.5, y: 17.5 }, pace: 30 },
    { do: 'walk', who: 'ship', to: { x: 39.5, y: 16 }, pace: 10 },
    { do: 'sound', name: 'shipGroan' },
    { do: 'quake', seconds: 0.8, amount: 1 },
    { do: 'wait', seconds: 0.8 },
    // Her plank: there against her side, then the line runs free and it swings down across the stones with a knock.
    { do: 'appear', who: 'plank' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'gangwayLetGo' },
    { do: 'animate', who: 'plank', animation: 'gs_gangway_swing', speed: 0.08, once: true },
    { do: 'wait', seconds: 1.12 },
    { do: 'sound', name: 'gangwayThump' },
    { do: 'quake', seconds: 0.3, amount: 1 },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'bramble', text: '{scared}It came when you RANG it. Why did it COME?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{surprised}...We rang. It came. I suppose that\'s what a bell\'s for. I just didn\'t think anybody was listening.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{smile}Well. She\'s left the door open. It would be rude not to. ...I\'d quite like to be rude.' },
    { do: 'camera' },
    { do: 'leave', who: 'ship', instant: true },
    { do: 'leave', who: 'plank', instant: true },
  ],
};
