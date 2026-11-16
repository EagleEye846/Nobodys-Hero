// VES AND THE ASH: the ash heaps are taught here (ash_buried_road, the trigger at x 9, just
// before the gap in the rock spur where the heap is). Ves offers her umbrella; a line in brackets
// says how it works (src/overworld/ashRoad.js). No walks. One monster, far off past the crack. (draft)
export const VES_AND_THE_ASH = {
  id: 'ves_and_the_ash',
  room: 'ash_buried_road',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The road runs into a gap in the rock, and the gap is full: the wind has heaped the ash up in it, soft and grey, as high as your chest.' },
    { do: 'say', who: 'bramble', text: '{thinking}We could climb over it?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}You\'d go in up to your ears and we\'d have to plant you.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{smile}Stand behind it and point. I\'ll do the rest.' },
    { do: 'say', text: '(Face a heap of ash and press Z, and Ves gives it a gust from her umbrella. The wind carries the ash on ahead of it and drops it where the wind stops. Ash blown into a burning crack puts it out.)' },
  ],
};
