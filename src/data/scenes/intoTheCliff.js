// INTO THE CLIFF: the first steps down inside the cliff spur, under the Sea
// View's cave mouth. Cold and dim after the sun, a grey light from below, a lantern, the sea breathing
// somewhere below. Bramble, scared of the sea, would like it to stay where it is.
// Nobody walks; the trigger is a strip across the second step down in
// sunny_cliff_cave (the room's monsters keep to the pool's deep water and the
// sand floor, well below). The hero never speaks.
export const INTO_THE_CLIFF = {
  id: 'into_the_cliff',
  room: 'sunny_cliff_cave',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 2, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 11, y: 2, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed (the sea breathing is heard, not described).
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 0.6, seconds: 1.4 },
    { do: 'act', who: 'bramble', act: 'shiver', wait: false },
    { do: 'wait', seconds: 1.2 },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}...Why is the sea downstairs?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'face', who: 'player', at: 'ves' },
    { do: 'say', who: 'ves', text: '{laughing}It heard you call it a puddle. It\'s come up to have a word.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'act', who: 'bramble', act: 'nod', wait: false },
    { do: 'say', who: 'bramble', text: '{determined}Then I\'m staying upstairs of it.' },
  ],
};
