// GUBB FERRIES YOU BACK: the same ride the other way, from the east jetty to
// the west one. The punt turns round to face west (bf_punt), and ends moored
// on the west shore (`unsees: punt_east`).
export const GUBB_FERRY_BACK = {
  // Triggers in rooms name the scene by this id.
  id: 'gubb_ferry_back',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'stillwater_shore',
  // false: it plays every time you step on its trigger, not just the first time.
  once: false,
  unsees: ['punt_east'],

  actors: [
    { id: 'punt', look: 'prop:bf_punt', x: 35, y: 8, portrait: 'gubb', plays: 'gubb_far', centered: true, animation: 'lake_punt_east', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 39, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'ripples', look: 'anim:lake_ripples', x: 35, y: 8, hidden: true, flat: true },
    { id: 'glint', look: 'anim:lake_glint', x: 35, y: 8, hidden: true, flat: true },
  ],

  steps: [
    { do: 'music', song: 'gubb' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', who: 'punt', face: 'singing', text: 'Hm-hmm... back we go.' },
    // Gubb swings the punt round to head off.
    { do: 'animate', who: 'punt', animation: 'bf_punt', speed: 0.5 },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 35, y: 8 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'punt', what: 'player', offset: { x: -3, y: -10 } },
    { do: 'sound', name: 'splash' },
    { do: 'toss', who: 'ves', to: { x: 35, y: 8 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'punt', what: 'ves', offset: { x: -11, y: -10 }, also: true, behind: true },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'appear', who: 'ripples' },
    { do: 'animate', who: 'ripples', animation: 'lake_ripples', speed: 0.34 },
    { do: 'hold', who: 'punt', what: 'ripples', offset: { x: 0, y: 14 }, also: true },
    { do: 'appear', who: 'glint' },
    { do: 'animate', who: 'glint', animation: 'lake_glint', speed: 0.3 },
    { do: 'hold', who: 'punt', what: 'glint', offset: { x: 0, y: 14 }, also: true },
    { do: 'wait', seconds: 0.6 },
    { do: 'walk', who: 'punt', to: { x: 16, y: 8 }, keep: true },
    { do: 'wait', seconds: 0.4 },
    { do: 'hold', who: 'punt' },
    { do: 'leave', who: 'ripples' },
    { do: 'leave', who: 'glint' },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 13, y: 8 }, height: 12, bounces: 0 },
    { do: 'toss', who: 'ves', to: { x: 12, y: 8 }, height: 12, bounces: 0 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'punt', face: 'singing', text: 'Mind the step.' },
    { do: 'music' },
  ],
};
