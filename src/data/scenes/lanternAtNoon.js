// LANTERN AT NOON: inside Gullrest's lifeboat house, a lantern on a post by
// the big doors is lit in full daylight. Haddock (still offended about the
// lightman gag, for the whole of this room) gives the plain excuse: "Council
// does them. Probably." Nobody solves it; nobody says who lights it. (The
// hero never speaks.) Nobody walks anywhere: the three stand where they are.
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
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'Just inside the big doors, a lantern hangs on a post. It is lit. Sunlight is pouring in through the doorway behind it, and the little flame doesn\'t seem to mind at all.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...That\'s lit. It\'s noon.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_talk', speed: 0.18 },
    { do: 'say', who: 'haddock', text: '{offended}Council does them.\n\nProbably.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'ves', text: '{bored}Which council?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'say', who: 'bramble', text: '{thinking}Does the council live here?' },
    { do: 'say', who: 'haddock', text: '{eh}...Probably.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
  ],
};
