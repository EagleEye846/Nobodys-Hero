// GUBB'S CROSSING: the first time you step out onto the last board of the
// jetty. A slow, croaky voice is singing out on the black water. Gubb the
// ferryman, old and fat and green, in his punt, who hasn't had a passenger
// for a hundred years. The last one was very small, and didn't say much, and
// he gave him a sweet. (He doesn't know it was the Hero. Ves does the sums.)
// Then he gives you one too, and you hop aboard and he poles you across the
// whole width of the lake: the punt gliding (its east-facing frames,
// lake_punt_east), Gubb leaning on his pole, rings spreading out from the
// hull (lake_ripples) and the lantern's reflection wobbling under it
// (lake_glint_east), all held under the punt so they travel with it.
// The ride stops half way, to let Ves be unimpressed, and goes on. At the
// east landing you hop off, and the punt moors there (`sees: punt_east`
// swaps the west punt for the east one, see the room's props).
// (All the art is in src/data/art/lakeScenes.js and belowFolk.js.)
export const GUBB_CROSSING = {
  // Triggers in rooms name the scene by this id.
  id: 'gubb_crossing',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'stillwater_shore',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,
  // Marked as seen when it ends: the punt is on the east shore now.
  sees: ['punt_east'],

  // The punt (it takes the west one's place; `centered`: it stands on its
  // middle tile), Ves, and the two flat pictures on the water under the punt.
  actors: [
    { id: 'punt', look: 'prop:bf_punt', x: 16, y: 8, portrait: 'gubb', plays: 'gubb', centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'ripples', look: 'anim:lake_ripples', x: 16, y: 8, hidden: true, flat: true },
    { id: 'glint', look: 'anim:lake_glint_east', x: 16, y: 8, hidden: true, flat: true },
  ],

  steps: [
    { do: 'music', song: 'gubb' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.9 },
    { do: 'say', text: 'Out on the black water, a slow, croaky voice is singing to itself. It sounds as if it has been on the same verse for a very long time.' },
    { do: 'say', who: 'punt', face: 'singing', text: 'Hm-hmm... hm-hm-hmmm...' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'punt', text: 'Oh. Passengers.' },
    { do: 'say', who: 'punt', text: 'Haven\'t had passengers in a hundred years. Last one was very small. Didn\'t say much.' },
    { do: 'say', who: 'punt', text: 'Like your friend there.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'ves', text: '{surprised}A hundred years?\n\n{thoughtful}...Small. How small?' },
    { do: 'say', who: 'punt', text: 'Oh, so high. Boots too big, and a sword longer than he was.' },
    { do: 'say', who: 'ves', text: '{surprised}The Hero? You took the HERO across?' },
    { do: 'say', who: 'punt', text: 'Was that who it was? Ohh.\n\nI thought it was a lost child.' },
    { do: 'say', who: 'punt', face: 'solemn', text: 'Gave him a sweet.' },
    { do: 'wait', seconds: 0.7 },
    { do: 'say', who: 'ves', text: '{thoughtful}Which way did he go?' },
    { do: 'say', who: 'punt', face: 'solemn', text: 'Down, dear. Only ever down. I put him off at the far shore and he looked at the stair a long time, and then he went.' },
    { do: 'say', who: 'punt', face: 'solemn', text: 'I waited a bit. Folk come back for the punt, as a rule.' },
    { do: 'say', who: 'ves', text: '{bored}You waited a hundred years.' },
    { do: 'say', who: 'punt', text: 'Not waiting. Punting. They feel very alike from the inside.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'punt', text: 'Here. I keep a few. Don\'t tell the fish.' },
    { do: 'give', item: 'frog_toffee' },
    { do: 'say', who: 'punt', face: 'singing', text: 'Hop in. Mind the edges.\n\nThings live in the edges.' },

    // Aboard: a hop each, and Gubb turns the punt round to face east.
    // Gubb swings the punt round to head off.
    { do: 'animate', who: 'punt', animation: 'lake_punt_east', speed: 0.5 },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 16, y: 8 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'punt', what: 'player', offset: { x: 3, y: -10 } },
    { do: 'sound', name: 'splash' },
    { do: 'toss', who: 'ves', to: { x: 16, y: 8 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'punt', what: 'ves', offset: { x: 11, y: -10 }, also: true, behind: true },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    // The pictures on the water, riding under the punt.
    { do: 'appear', who: 'ripples' },
    { do: 'animate', who: 'ripples', animation: 'lake_ripples', speed: 0.34 },
    { do: 'hold', who: 'punt', what: 'ripples', offset: { x: 0, y: 14 }, also: true },
    { do: 'appear', who: 'glint' },
    { do: 'animate', who: 'glint', animation: 'lake_glint_east', speed: 0.3 },
    { do: 'hold', who: 'punt', what: 'glint', offset: { x: 0, y: 14 }, also: true },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'punt', face: 'singing', text: 'Hm-hmm... hm-hm-hmmm...' },

    // The first half: out from the jetty, over the black.
    { do: 'walk', who: 'punt', to: { x: 25, y: 8 }, keep: true },
    { do: 'say', text: 'The jetty shrinks behind you. The lake takes the lantern and hands it back, a little broken each time. It is very quiet. Somewhere a long way off, something drips, and the drip takes its time getting to you.' },
    { do: 'say', who: 'ves', text: '{bored}"Things live in the edges."\n\n{smile}Wonderful. Very reassuring.' },
    // The second half.
    { do: 'walk', who: 'punt', to: { x: 35, y: 8 }, keep: true },
    { do: 'say', who: 'punt', text: 'East shore. Mind the step.' },
    { do: 'say', who: 'punt', text: 'If you want the way back, I\'m here. I\'m usually here.' },

    // Off: let go of everyone, and a hop each onto the east jetty.
    { do: 'hold', who: 'punt' },
    { do: 'leave', who: 'ripples' },
    { do: 'leave', who: 'glint' },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 38, y: 8 }, height: 12, bounces: 0 },
    { do: 'toss', who: 'ves', to: { x: 39, y: 8 }, height: 12, bounces: 0 },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', who: 'ves', text: '{thoughtful}Down, dear. Only ever down.' },
    { do: 'say', who: 'ves', text: '{smile}Cheerful man.' },
    { do: 'music' },
  ],
};
