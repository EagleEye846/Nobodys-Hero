// THE SKY TURNS: the jetty at Gullrest, the end of the sunny part of the chapter.
// Haddock rows the three out in the Bother, round the headland (the point). As they
// pass its tip the sun doesn't set, it just stops being there: the light goes, the
// first rain comes, the sky turns green (the storm look: stage `sky`, `rain`), and one
// flash of lightning lights the whole sea with a clap of thunder behind it (`bolt`).
// The ride then ends on the shingle of the Wrack Shore (wrack_landing).
//
// The boat is the room's Bother (an NPC prop, `the_bother`) swapped for the rowing
// picture (`cf_haddock_row`, Haddock aboard at the stern end); the three ride on it
// (`hold`), spread out along it so each can be seen: Ves sat in the stern, Bramble sat
// amidships, and the hero standing in the bow. (The hero never speaks.)
//
// Haddock isn't on the pier before you: he went off "round the back way" from the cove
// (haddock_shows_bell), and comes in after you, at the door you came in by (1,8), with a
// ring of his handbell, and along the pier's top row to beside the boat (19.5,8). Bramble
// waits on the bottom row (17,9) and the hero and Ves at the end of the top row (22,8 and
// 21,8), so he passes nobody. The monsters are down on the south sand (rows 14 and 15).
//
// Plays once; afterwards the Bother is gone from the pier (prop `until`).
// There is no way back by boat: Gullrest is behind you, and nothing there is needed.
//
// Nothing stands on the pier or in the boat's way: the boat goes east along row 10
// (deep water) past the point.
export const THE_SKY_TURNS = {
  id: 'the_sky_turns',
  room: 'gullrest_jetty',
  once: true,

  actors: [
    // Off stage until he comes in off the beach after you.
    { id: 'haddock', look: 'prop:cf_haddock', x: 1, y: 8, portrait: 'haddock', centered: true, hidden: true },
    // The boat (4 tiles wide) is placed by its centre: the room's Bother is at x 23, 4 wide, so centre x 25.
    { id: 'boat', look: 'prop:cf_bother', x: 25, y: 9, portrait: 'haddock', plays: 'the_bother', centered: true, animation: 'cf_bother', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 19, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // The hero and Ves to the end of the pier's top row; Bramble hangs back
    // (it's very small): so the pier's bottom row is clear for Haddock.
    { do: 'walk', who: 'ves', to: { x: 21, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 9 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 22, y: 8 }, pace: 48 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.3 },
    // A handbell back along the beach: Haddock, the back way round, in at the door after
    // you, and along the pier to the boat.
    { do: 'appear', who: 'haddock', at: { x: 1, y: 8 } },
    { do: 'sound', name: 'bell' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'wait', seconds: 0.2 },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_right', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 19.5, y: 8 }, pace: 56, keep: true },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'face', who: 'player', at: 'haddock' },
    { do: 'say', who: 'haddock', text: '{laughing}Back way\'s got longer.' },
    { do: 'say', who: 'haddock', text: '{proud}Hop in. Sit still. Don\'t touch the oars.' },
    { do: 'say', who: 'bramble', text: '{worried}...It\'s very small.' },
    { do: 'say', who: 'ves', text: '{proud}Boats are meant to be small, Bramble. ...Probably.' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'say', who: 'bramble', text: '{worried}A boat is just a bridge that\'s given up.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{laughing}...That\'s not bad, actually.' },
    // Haddock walks the length of the pier and gets in: the empty boat becomes the rowing one.
    // (Down onto the bottom row, then along it, under the hero and Ves.)
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_right', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 20, y: 9 }, keep: true },
    { do: 'walk', who: 'haddock', to: { x: 22, y: 9 }, keep: true },
    { do: 'sound', name: 'splash' },
    { do: 'leave', who: 'haddock', instant: true },
    { do: 'animate', who: 'boat', animation: 'cf_haddock_row', speed: 0.35 },
    // The three hop aboard and spread out: Ves sits in the stern, Bramble amidships, the hero
    // stands in the bow (offsets are in pixels from the middle of the boat).
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 25, y: 9 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'boat', what: 'player', offset: { x: 25, y: -7 } },
    { do: 'sound', name: 'splash' },
    { do: 'toss', who: 'ves', to: { x: 25, y: 9 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'boat', what: 'ves', offset: { x: -26, y: -7 }, also: true },
    { do: 'animate', who: 'ves', animation: 'ves_sit', speed: 1.2 },
    // Bramble last, after a good long look at the water.
    { do: 'walk', who: 'bramble', to: { x: 22, y: 9 } },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'wait', seconds: 0.7 },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'bramble', to: { x: 25, y: 9 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'boat', what: 'bramble', offset: { x: 9, y: -7 }, also: true },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'boat', text: '{smile}Hold the sides. Round the point, and we\'ll see.' },
    // Off along the pier's end and out to sea, in the sun.
    { do: 'music', song: 'haddock' },
    { do: 'walk', who: 'boat', to: { x: 28, y: 10 }, keep: true },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{shout}It\'s moving. It\'s definitely MOVING.' },
    { do: 'say', who: 'ves', text: '{smile}I know. Sit still. ...It\'s quite good, isn\'t it?' },
    { do: 'walk', who: 'boat', to: { x: 36, y: 10 }, keep: true },
    { do: 'say', text: 'Gullrest shrinks behind you: a stripe of sand, a row of little red roofs, the bunting still flapping in the sun. The headland slides past on the left like a big sleeping animal.' },
    // The point. The sun goes; the first rain; the sky starts to turn.
    { do: 'music', song: null },
    { do: 'stage', sky: 0.4, dim: 0.06, rain: 0.35, seconds: 4 },
    { do: 'walk', who: 'boat', to: { x: 42, y: 10 }, keep: true },
    { do: 'say', text: 'Round the point, and the sun goes.\n\nIt doesn\'t set. It just stops being there, like a hand closing. The first drops hit the water in ones and twos, as if somebody were counting.' },
    { do: 'say', who: 'ves', text: '{surprised}...Is that the cloud from the cliff? It\'s got bigger.' },
    { do: 'say', who: 'boat', text: '{tired}Aye. Been sitting out there a good while. Don\'t look at it.' },
    { do: 'say', who: 'ves', text: '{determined}Looking at it.' },
    // The rain comes on in earnest, and the sky goes the colour of a dark bottle.
    { do: 'stage', sky: 0.9, dim: 0.16, rain: 1.1, seconds: 5 },
    { do: 'walk', who: 'boat', to: { x: 44, y: 10 }, keep: true },
    { do: 'say', text: 'The sea goes the colour of a dark bottle. Overhead the cloud rolls down into green, a low, sickly green like the inside of a pond, and the rain comes on in sheets.' },
    // One flash, and the thunder behind it.
    { do: 'wait', seconds: 0.8 },
    { do: 'stage', bolt: true },
    { do: 'wait', seconds: 0.25 },
    { do: 'say', text: 'For one frame the whole sea is white, and every wave stands still. Far off on the skyline, black against it: a tall, spiked tower.\n\nThen the dark comes down again, and the thunder after it.' },
    // The thunder.
    { do: 'quake', amount: 2, seconds: 0.4 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}It\'s GREEN.' },
    { do: 'say', who: 'ves', text: '{cold}And WET. Nobody said wet.' },
    { do: 'say', who: 'boat', text: '{determined}That\'s the Wrack, lad. Hold tight. I\'ll have you ashore.' },
    { do: 'wait', seconds: 1 },
    // The ride ends on the shingle of the Wrack Shore.
    { do: 'stage', dim: 1, seconds: 2.5 },
    { do: 'wait', seconds: 3 },
    { do: 'goto', room: 'wrack_landing', spawn: { x: 8, y: 11 } },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
