// THE DEN TALLY: in the Last Light's secret den, behind the gallery's false wall, the tally marks
// cut into the back wall over the gap (c5_height_marks, 4..5, row 2): neat at the start, then
// they stop. Bramble asks why; Ves says it ran out of wall, and Bramble points out it didn't.
// Nobody says whose den it is. The hero never speaks. The Z read (den_tally, lastlight.txt) is
// unchanged.
//
// The trigger (secretLastlightDen.js) is x 3 to 5, rows 4 to 5: where you come in through the gap
// (4,6; you arrive on 4,5). The hero stops under the marks (4,3), Bramble beside him on the puddle
// (5,3, flat), Ves at 3,4; clear of the bed (2,3), the tin (6,3), the boat (2,5) and the books
// (6,5). No monsters. Until the end of the chapter (the_light_answers).
//
// (draft).
export const THE_DEN_TALLY = {
  id: 'the_den_tally',
  room: 'secret_lastlight_den',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 4, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 5, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 4, y: 3 } },
    { do: 'walk', who: 'bramble', to: { x: 5, y: 3 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 3, y: 4 } },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', text: 'Cut into the back wall, in fives: tally marks. Very neat at the start. Then they stop.' },
    { do: 'say', who: 'bramble', text: '{surprised}Somebody lived in here?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Somebody small. Who didn\'t want finding, maybe.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'bramble', text: '{worried}...Why\'d they stop?' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{bored}Ran out of wall, probably.' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{thinking}There\'s loads of wall.' },
    { do: 'emote', who: 'ves', emote: '...' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
