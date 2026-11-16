// TUCK SHOWS THE WAY: straight after the hall falls (the_hall_falls sends you
// here). The hall's doorway is wedged shut behind you, so Tuck brings you
// out into the square instead, past the folk who got out, and across to the
// toadstool beds in the south west corner. Behind them is a loose stone and
// the secret way to the Long Rope (belowtown_secret_way), which only the
// old diggers and Tuck remember. The hero doesn't speak. Bramble's still
// proud of his entrance.
// (Plays on arriving in the square, once the_hall_falls has been seen. It only
// ever happens in this one run of the chapter's end, so the square's usual
// folk can be left walking about.)
//
// Part two (tuck_shows_the_way_on) is the walk through the tunnel itself.
const ARRIVE = { x: 20, y: 19 };
// Where Tuck stops: below the toadstool beds, at the foot of the loose stone.
const STONE = { x: 3, y: 20 };

export const TUCK_SHOWS_THE_WAY = {
  // Triggers in rooms name the scene by this id.
  id: 'tuck_shows_the_way',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_square',
  once: true,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: ARRIVE.x - 2, y: ARRIVE.y, portrait: 'tuck' },
    { id: 'ves', look: 'prop:vesper_stand', x: ARRIVE.x + 1, y: ARRIVE.y, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: ARRIVE.x - 1, y: ARRIVE.y, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    // All of it is down on the square's bottom rows, where the camera can't
    // go any lower: the words go at the top so nobody talks from under them.
    { do: 'textbox', top: true },
    // You all come out of the doorway in a heap: Ves and Bramble step out
    // to either side of you, and everyone turns to Tuck.
    { do: 'walk', who: 'bramble', to: { x: ARRIVE.x - 1, y: ARRIVE.y }, wait: false },
    { do: 'walk', who: 'ves', to: { x: ARRIVE.x + 1, y: ARRIVE.y } },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'tuck', dir: 'right' },
    { do: 'say', who: 'tuck', text: '{shy}Not that way, sorry. The hall doorway\'s... a log, now.\n\nThere\'s a shorter way. We don\'t tell people.' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{grin}A secret way! Do I get to hold the torch?' },
    { do: 'say', who: 'ves', text: '{bored}You\'ve had enough of an entrance for one day.' },

    // Across the square, west along the bottom row, folk looking on.
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_left', speed: 0.16 },
    { do: 'walk', who: 'tuck', to: { x: 12, y: ARRIVE.y + 1 }, fast: true, keep: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 15, y: ARRIVE.y + 1 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 13, y: ARRIVE.y + 1 }, wait: false },
    // (The scene waits on Ves, whose walk is longest, so no walk is still
    // going when the next one starts.)
    { do: 'walk', who: 'ves', to: { x: 14, y: ARRIVE.y + 1 } },
    { do: 'walk', who: 'tuck', to: STONE, fast: true, keep: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 7, y: ARRIVE.y + 1 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 5, y: ARRIVE.y + 1 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 6, y: ARRIVE.y + 1 } },
    { do: 'animate', who: 'tuck' },

    // The loose stone.
    { do: 'face', who: 'tuck', dir: 'down' },
    { do: 'act', who: 'tuck', act: 'look' },
    { do: 'say', who: 'tuck', text: '{whisper}Behind the toadstools. The third stone along. Don\'t tell anyone I showed you.' },
    { do: 'sound', name: 'crumble' },
    { do: 'quake', amount: 1, seconds: 0.6 },
    { do: 'say', text: 'He leans on a stone that looks like all the rest. It swings in, and a dark, low passage opens up behind it.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Everyone in this town has a secret door, and not one of them could keep it quiet.' },

    // Into the dark.
    { do: 'stage', dim: 1, seconds: 1 },
    { do: 'wait', seconds: 1 },
    { do: 'goto', room: 'belowtown_secret_way', spawn: { x: 1, y: 4 } },
  ],
};

// The tunnel itself: short, a bit low, a few glow-worm lamps. Out the far end
// and on to the Long Rope, where the old scene picks up.
export const TUCK_SHOWS_THE_WAY_ON = {
  id: 'tuck_shows_the_way_on',
  room: 'belowtown_secret_way',
  once: true,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: 3, y: 4, portrait: 'tuck' },
    { id: 'ves', look: 'prop:vesper_stand', x: 0.5, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 1, y: 3, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'face', who: 'tuck', dir: 'right' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.16 },
    { do: 'walk', who: 'tuck', to: { x: 12, y: 4 }, keep: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 8, y: 4 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 9, y: 3 }, wait: false },
    // (Waits on Ves, the furthest back, so Bramble's at the low bit when he hits it.)
    { do: 'walk', who: 'ves', to: { x: 10, y: 3 } },
    // Low in the middle: he's tall enough to find out.
    { do: 'sound', name: 'thud' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'say', who: 'tuck', text: '{shy}Mind your head. It gets a bit low.' },
    { do: 'say', who: 'bramble', text: '{proud}...Meant to do that.' },
    { do: 'say', who: 'ves', text: "{bored}That's the second thing today." },
    { do: 'walk', who: 'tuck', to: { x: 20, y: 4 }, keep: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 16, y: 4 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 3 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 18, y: 3 } },
    { do: 'animate', who: 'tuck' },
    { do: 'say', who: 'tuck', text: "{smile}Nearly there. The rope's just through here." },
    { do: 'goto', room: 'belowtown_long_rope', spawn: { x: 9, y: 47 } },
  ],
};
