// LANTERN AT NOON: inside Gullrest's lifeboat house, a lantern on a post by
// the big doors is lit in full daylight. Haddock (still offended about the
// lightman gag, for the whole of this room) gives the plain excuse: "Council
// does them. Probably." Nobody solves it; nobody says who lights it. (The
// hero never speaks.) The three walk a few steps in (up where the text box
// doesn't hide them), then turn back to the lantern by the doors.
export const LANTERN_AT_NOON = {
  id: 'lantern_at_noon',
  room: 'gullrest_lifeboat_house',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock', x: 13, y: 4, portrait: 'haddock', plays: 'haddock_house', centered: true, animation: 'cf_haddock', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed (the camera shows the lit lantern; no description line).
    // (All on the door's side of the lantern post at 11,9, so nobody walks through it.)
    { do: 'walk', who: 'ves', to: { x: 9, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 8 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 10, y: 7 }, pace: 48 },
    { do: 'wait', seconds: 0.4 },
    // Something's off: they look back at the doors.
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'camera', to: { x: 11, y: 9 } },
    { do: 'wait', seconds: 1.6 },
    { do: 'emote', who: 'ves', emote: '!', wait: false },
    { do: 'say', who: 'ves', text: '{surprised}...That\'s lit. It\'s noon.' },
    { do: 'camera' },
    { do: 'face', who: 'ves', at: 'haddock' },
    { do: 'face', who: 'player', at: 'haddock' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_talk', speed: 0.18 },
    { do: 'say', who: 'haddock', text: '{offended}Council does \'em.\n\nProbably.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{thinking}Does the council live here?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'emote', who: 'haddock', emote: '?' },
    { do: 'say', who: 'haddock', text: '{eh}...Probably.' },
    { do: 'act', who: 'ves', act: 'shake', wait: false },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
  ],
};
