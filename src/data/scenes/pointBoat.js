// POINT BOAT (DRAFT, the way to the Fair Return's bell): once, on the Wreck Yard slip, the first time you come up to the old
// boat on the point (wreck_slip 27..29, row 7) carrying the last page of her log (log_page_5: "down the steps under the old
// boat on the point"). Ves works it out, Bramble hears the boat breathing, and the three of you roll it off the fog-watch's
// steps. When it ends the boat lies keel-up at the water's edge (27,9) and the steps (27..28, row 7) go down into the cave under
// the point (wreck_under_point). Trigger: the shingle round the boat (x 25-30, rows 5-9). Ves and Bramble come from where they
// were following (`plays`); nobody walks. No monsters in the slip. The hero never speaks.
export const POINT_BOAT = {
  id: 'point_boat',
  room: 'wreck_slip',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 25, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 25, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed (the boat is looked at, the breathing is heard, the heave is acted).
    { do: 'camera', to: { x: 28, y: 7 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{proud}"The old boat on the point, and down the steps under it."\n\n{smile}This is the point. That is an old boat. I\'m only reading it out.' },
    { do: 'sound', name: 'whoosh' },
    { do: 'wait', seconds: 1 },
    { do: 'sound', name: 'whoosh' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'say', who: 'bramble', text: '{scared}It\'s BREATHING. The boat is breathing.' },
    { do: 'act', who: 'bramble', act: 'look', wait: false },
    { do: 'say', who: 'ves', text: '{determined}It\'s a draught, Bramble. ...Probably. Take the heavy end.' },
    // All three heave: the stones roll off and the boat goes over, down the shingle to the water.
    { do: 'act', who: 'ves', act: 'lunge', wait: false },
    { do: 'act', who: 'bramble', act: 'lunge', wait: false },
    { do: 'act', who: 'player', act: 'lunge' },
    { do: 'sound', name: 'crumble' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'thud' },
    { do: 'quake', seconds: 0.6, amount: 2 },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Where it lay, worn stone steps go down into the rock, into the dark. The air coming up them smells of the sea, and of a candle that went out a long time ago.' },
    { do: 'say', who: 'bramble', text: '{surprised}...Steps. Under a BOAT. Who puts steps under a boat?' },
    { do: 'say', who: 'ves', text: '{glee}Somebody who didn\'t want anyone going down them. Which is the best kind of steps.' },
    { do: 'camera' },
  ],
};
