// FIGUREHEAD BEATEN (DRAFT): the fight won by force (ship_figurehead_perch). The pink goes out of the cracks, then the white; she stops laughing in
// the middle of a breath, her wish (that the night would never end) breaks, and the east goes a shade paler. The shard comes loose into the hero's palm (`give star_shard_wreck`). Ves (20,6) and Bramble (20,8) stand on the bowsprit.
// The hero never speaks.
export const FIGUREHEAD_BEATEN = {
  id: 'figurehead_beaten',
  room: 'ship_figurehead_perch',
  once: true,

  actors: [
    { id: 'figurehead', look: 'anim:figurehead_wake_laugh', animation: 'figurehead_wake_laugh', speed: 0.12, x: 24.5, y: 8, plays: 'figurehead', centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: 'ghostShip' },
    { do: 'camera', to: { x: 24, y: 6 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_dark', speed: 0.9 },
    { do: 'stage', haze: 0.4, seconds: 2 },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'The quiet afterwards is enormous. Out past the bowsprit, low over the sea, the sky has gone a shade paler.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'The splinter of star-metal works loose from the wood, a hair at a time, and falls. You catch it. It is warm, and it is humming a note the sword knows.' },
    { do: 'give', item: 'star_shard_wreck' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'bramble', text: '{sad}I think she was lonely.' },
    { do: 'say', who: 'ves', text: '{bored}A hundred years of party, and she never once let anybody leave.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{smile}...Still. Nobody ever turned round to say good evening to her. I\'d have been a bit loud too.' },
    { do: 'leave', who: 'figurehead', instant: true },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
