// TOWER LANE SOAKED: Bramble has been through the flooded grating on his own and lifted the bar,
// and the tower door stands open. Once everyone is together again and steps up to the door
// (the trigger, x 16 to 19, rows 7-8, waits for the bar: `when: 'tower_bar'`), he is soaked to
// the skin and very pleased with himself, and Ves pays him one dry compliment. He is NOT cured
// of the sea (that's the end of the chapter): he just did it. The hero never speaks. DRAFT.
export const TOWER_LANE_SOAKED = {
  id: 'tower_lane_soaked',
  room: 'merrow_tower_lane',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 15, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 19, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'say', text: 'Bramble is wet from his hair to his boots, and a bit further. Water runs out of his sleeves. There is weed on one ear.' },
    { do: 'say', who: 'bramble', text: '{sheepish}It went in my ears. Both of them.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{proud}I got the bar up, though. It was really heavy. I did it with my back.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{smile}...You were very quick. I\'ll give you that.' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'bramble', text: '{grin}I was SO quick.' },
    { do: 'act', who: 'bramble', act: 'shake', wait: false },
    { do: 'say', who: 'bramble', text: '{determined}I\'m not doing it again, though.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
