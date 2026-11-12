// TUCK'S WHISPER: out in the square after the king's welcome. Tuck catches
// you up from the throne hall's doors, out of breath, and tells you the
// diggers' version: the Hero went down FIRST, to the very bottom, before he
// ever came to town. He says it all in a hurry and takes half of it back.
// Then the old snail by the east bench, who saw the Hero arrive as a
// hatchling, tells the first piece of the real story: the town fleeing up,
// one small person coming down the old stair (gone now; only its hand-rope,
// the Long Rope, is left) and asking which way was down.
// (Plays across row 8 of the square, outside the throne hall, once you've
// seen the_kings_welcome.)
export const TUCKS_WHISPER = {
  // Triggers in rooms name the scene by this id.
  id: 'tucks_whisper',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_square',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: 22, y: 5, portrait: 'tuck', hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 23, y: 9, portrait: 'vesper', plays: 'vesper' },
    // The old snail (bt_sq_snail), wherever he's got to on his stroll by the east bench.
    { id: 'snail', look: 'prop:bf_snail_elder', x: 30, y: 14, plays: 'bt_sq_snail' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 22, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 23, y: 9 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'appear', who: 'tuck', at: { x: 22, y: 5 } },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_down', speed: 0.14 },
    { do: 'walk', who: 'tuck', to: { x: 22, y: 8 }, fast: true, keep: true },
    { do: 'animate', who: 'tuck' },
    { do: 'face', who: 'tuck', dir: 'down' },
    { do: 'emote', who: 'tuck', emote: '...' },
    { do: 'act', who: 'tuck', act: 'look' },
    { do: 'say', who: 'tuck', text: '{shy}Um. Before you go down. His Majesty\'s story is... it\'s a good story.' },
    { do: 'say', who: 'tuck', text: '{whisper}The old diggers tell it different. They say the Hero went down FIRST. Before he ever came to town. All the way to the bottom.' },
    { do: 'say', who: 'tuck', text: '{whisper}Nobody\'s been down there since.' },
    { do: 'act', who: 'ves', act: 'nod' },
    { do: 'say', who: 'ves', text: '{thoughtful}So the king\'s close personal friend met him on the way back up.' },
    { do: 'act', who: 'tuck', act: 'startle' },
    { do: 'say', who: 'tuck', text: '{worried}I didn\'t say that. I didn\'t say anything. Sorry.' },
    { do: 'say', who: 'tuck', text: '{determined}...Be careful. Please.' },
    { do: 'face', who: 'tuck', dir: 'up' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_up', speed: 0.14 },
    { do: 'walk', who: 'tuck', to: { x: 22, y: 5 }, fast: true, keep: true },
    { do: 'animate', who: 'tuck' },
    { do: 'leave', who: 'tuck' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{bored}A close personal friend, and the Hero never once wrote.' },

    // The old snail on the east side of the square has been listening. He
    // was a hatchling when the Hero came through; he saw him arrive.
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.3 },
    { do: 'camera', who: 'snail' },
    // He draws breath (the whole of him swelling), clears his throat, and
    // takes his time about it.
    { do: 'act', who: 'snail', act: 'sigh' },
    { do: 'wait', seconds: 0.5 },
    { do: 'act', who: 'snail', act: 'nod' },
    { do: 'say', text: 'Over by the bench, a very old snail has been listening. He clears his throat. It takes a while.' },
    { do: 'say', who: 'snail', text: 'Diggers have it right, for once. I was a hatchling. I saw him come.' },
    { do: 'say', who: 'snail', text: 'The dark was coming up out of the Deep, then. The Sunstone going grey. Every family in town packing up and going UP.' },
    { do: 'say', who: 'snail', text: 'And down the old stair from the top comes one small person, with a sword dragging behind him, clank, clank, on every step.\n\nGoing the wrong way.' },
    { do: 'say', who: 'snail', text: 'Didn\'t stop. Didn\'t ask our names. Asked one thing: which way is down? And forty of us pointed.' },
    { do: 'say', who: 'ves', text: '{surprised}Forty of you pointed, and none of you went.' },
    { do: 'say', who: 'snail', text: '...No. We were very small, we said. He was smaller.' },
    { do: 'say', who: 'snail', text: 'The old stair\'s gone now. Fell in, not long after.\n\nThere\'s only its hand-rope left, hanging down from the top, and nobody\'s been up that in a hundred years.' },
    { do: 'say', who: 'snail', text: 'I saw him come back, too. But that\'s another day.' },
    { do: 'camera' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'ves', text: '{smile}He\'s good. He\'s doing it in instalments.' },
  ],
};
