// HADDOCK SHOWS THE BELL: the cove at Gullrest, the first tide puzzle. The
// sea fills the whole middle of the cove. Haddock is at the tide bell on the
// west shore (ways_of_the_sea walked him down to it, just east of the post,
// at the water's edge, and brought the three down to him). He rings his own handbell, tells the party the post's bell is
// its twin and the tide listens to both, then goes off "the back way" to wait
// at the jetty (he leaves the cove for good). Ringing the post is the puzzle.
// (The hero never speaks.)
//
// Haddock walks from below the post (9.5,12) round its west side to (6.5,11),
// then up the shore (x 6..7) to the north-west dune (6.5,3), clear of the three
// (the hero 7,13, Ves 5,12, Bramble 2,12). The party only turns on the spot (the
// camera looks across the cove first). No monsters on the west shore.
export const HADDOCK_SHOWS_BELL = {
  id: 'haddock_shows_bell',
  room: 'gullrest_cove',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock', x: 9.5, y: 12, portrait: 'haddock', plays: 'haddock_cove', centered: true, animation: 'cf_haddock', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'camera', to: { x: 17, y: 9 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The cove is a bowl of pale sandstone, and the sea fills the whole middle of it, right up to the shore. On the far side, the beach carries on east. Between here and there: a great deal of very blue water.' },
    { do: 'camera' },
    { do: 'say', who: 'haddock', text: '{proud}Cove tide. Easy as breathing.\n\nSee that post? Bell\'s the twin of mine.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_bell', speed: 0.3 },
    { do: 'sound', name: 'bell' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'wait', seconds: 1.4 },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{proud}Ring the one or ring the other. Same note, same listeners. Out she goes.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}A tide that takes requests.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{smile}Aye, requests. Polite ones.' },
    { do: 'say', who: 'bramble', text: '{thinking}Does it come back if I ring it again?' },
    { do: 'say', who: 'haddock', text: '{smile}Every time. Very well trained.' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}...What if it doesn\'t like me?' },
    { do: 'say', who: 'haddock', text: '{smile}Likes everyone. Keeps its distance, is all.' },
    { do: 'say', who: 'haddock', text: '{proud}I\'ll go round the back way and meet you at the jetty.\n\nTwice, for manners.' },
    // He goes, slowly, up the shore and out of sight behind the dune.
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_up', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 6.5, y: 11 }, pace: 40, keep: true },
    { do: 'walk', who: 'haddock', to: { x: 6.5, y: 3 }, wait: false, keep: true },
    { do: 'wait', seconds: 0.5 },
    // The three of them watch him go.
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 3 },
    { do: 'leave', who: 'haddock' },
    { do: 'wait', seconds: 0.2 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'player', dir: 'right' },
  ],
};
