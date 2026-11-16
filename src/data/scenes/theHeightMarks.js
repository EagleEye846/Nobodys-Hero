// THE HEIGHT MARKS (Hero trail 5): on the top landing of Haddock's Light's stair, the marks
// scratched in the whitewash (c5_height_marks, 6..7, row 3): a row of small ones climbing, and one
// on its own a little higher, and the row stops partway. Bramble measures himself against them;
// Ves notices the lone one was only measured once. Nobody says whose they are. The hero never
// speaks. The Z read (stair_marks, haddock_light.txt) is unchanged.
//
// The trigger (haddockLightStair.js) is x 11 to 12, rows 4 to 6: the landing, on the way west
// to Corrie's room. Everyone first steps to x 11..12 on rows 5..6 (under the barrels at 9..10,
// row 4), then along to the marks: the hero 6,4, Bramble backed up against them at 7,4, Ves 8,5.
// No monsters. Until the end of the chapter (the_light_answers).
//
// (draft).
export const THE_HEIGHT_MARKS = {
  id: 'the_height_marks',
  room: 'haddock_light_stair',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 13, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'ves', to: { x: 12, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 12, y: 5 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 11, y: 5 } },
    { do: 'walk', who: 'ves', to: { x: 8, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 7, y: 5 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 6, y: 5 } },
    { do: 'walk', who: 'player', to: { x: 6, y: 4 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 8, y: 5 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 7, y: 4 } },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    // The camera holds on the whitewash: a row of small marks climbing, one on its own a little higher, and
    // the row stopping partway. (draft)
    { do: 'camera', to: { x: 6, y: 3 } },
    { do: 'wait', seconds: 2.2 },
    { do: 'camera' },
    // Bramble backs up against the wall to be measured.
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'say', who: 'bramble', text: '{proud}Look. I\'m taller than all of them.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{smile}Heels down.' },
    { do: 'act', who: 'bramble', act: 'sigh' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{surprised}The one on its own only got measured the once.\n\n{bored}Didn\'t stay long enough to grow, then.' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{thinking}...The little ones stopped, though.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
