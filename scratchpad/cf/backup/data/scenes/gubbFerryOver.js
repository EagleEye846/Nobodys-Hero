// GUBB FERRIES YOU OVER: the short ride from the west jetty to the east
// landing, every time after the first. Same punt, same glide, same rings and
// reflection, and Gubb singing to himself instead of explaining. (The story
// crossing is gubb_crossing.) It ends with the punt moored on the east shore
// (`sees: punt_east`).
export const GUBB_FERRY_OVER = {
  // Triggers in rooms name the scene by this id.
  id: 'gubb_ferry_over',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'stillwater_shore',
  // false: it plays every time you step on its trigger, not just the first time.
  once: false,
  sees: ['punt_east'],

  actors: [
    { id: 'punt', look: 'prop:bf_punt', x: 16, y: 8, portrait: 'gubb', plays: 'gubb', centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'ripples', look: 'anim:lake_ripples', x: 16, y: 8, hidden: true, flat: true },
    { id: 'glint', look: 'anim:lake_glint_east', x: 16, y: 8, hidden: true, flat: true },
  ],

  steps: [
    { do: 'music', song: 'gubb' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'punt', face: 'singing', text: 'Hm-hmm... over we go.' },
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
    { do: 'appear', who: 'ripples' },
    { do: 'animate', who: 'ripples', animation: 'lake_ripples', speed: 0.34 },
    { do: 'hold', who: 'punt', what: 'ripples', offset: { x: 0, y: 14 }, also: true },
    { do: 'appear', who: 'glint' },
    { do: 'animate', who: 'glint', animation: 'lake_glint_east', speed: 0.3 },
    { do: 'hold', who: 'punt', what: 'glint', offset: { x: 0, y: 14 }, also: true },
    { do: 'wait', seconds: 0.6 },
    { do: 'walk', who: 'punt', to: { x: 35, y: 8 }, keep: true },
    { do: 'wait', seconds: 0.4 },
    { do: 'hold', who: 'punt' },
    { do: 'leave', who: 'ripples' },
    { do: 'leave', who: 'glint' },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 38, y: 8 }, height: 12, bounces: 0 },
    { do: 'toss', who: 'ves', to: { x: 39, y: 8 }, height: 12, bounces: 0 },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'punt', face: 'singing', text: 'Mind the step.' },
    { do: 'music' },
  ],
};
