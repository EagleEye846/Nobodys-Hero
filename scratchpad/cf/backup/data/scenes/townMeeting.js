// TOWN MEETING: the town hall, the first time in. Saltcombe is all in here,
// arguing about the storm getting worse. Nobody will go out on the water any
// more. Somebody starts on "that winter" and is hushed (the board of winters
// stays unexplained: no name, no boy, no Corrie). Somebody says only Haddock
// still goes out, and he's at the Drowned Rat; the old badger at the stove
// sends you there. (The hero never speaks.)
//
// Mandatory: it plays as you come in at the door, and Haddock's scene at the
// inn (haddock_hums) waits for it, and the lagoon waits for that. A save
// already past the inn never gets it (the trigger's `until`).
//
// The party comes in at the door (the hero at 10,12, Ves and Bramble in the
// doorway behind) and walks up the middle to the hero 10,7, Ves 9,8, Bramble
// 11,8 (above the text box, between the benches). The three townsfolk stand
// in the open floor above the benches, the otter (7,6) and the stoat (13,6)
// either side and the vole (12,5) by the board; the badger stays at his stove.
// At the end the three go out down x 7, x 13 and x 12, along row 11 and out at the
// door, under the party.
export const TOWN_MEETING = {
  id: 'town_meeting',
  room: 'saltcombe_town_hall',
  once: true,

  actors: [
    { id: 'badger', look: 'prop:cf_fisher_d', x: 18, y: 5, plays: 'hall_badger', animation: 'cf_fisher_d', speed: 0.6 },
    { id: 'otter', look: 'prop:cf_fisher_a', x: 7, y: 6, animation: 'cf_fisher_a', speed: 0.45 },
    { id: 'vole', look: 'prop:cf_fisher_b', x: 12, y: 5, animation: 'cf_fisher_b', speed: 0.5 },
    { id: 'stoat', look: 'prop:cf_fisher_c', x: 13, y: 6, animation: 'cf_fisher_c', speed: 0.55 },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 12, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 11, y: 12, portrait: 'bramble', plays: 'bramble', hidden: true },
  ],

  steps: [
    // The whole town talking at once, under the rain (the room's own sounds come back as they leave).
    { do: 'ambience', name: 'town_meeting' },
    { do: 'appear', who: 'ves', at: { x: 10, y: 13 }, instant: true },
    { do: 'appear', who: 'bramble', at: { x: 11, y: 13 }, instant: true },
    { do: 'say', text: 'The town hall is full. Every bench has somebody on it, and somebody else standing on it. Everyone is talking at once, and all of it is about the weather.' },
    { do: 'walk', who: 'player', to: { x: 10, y: 7 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 10, y: 10 } },
    { do: 'walk', who: 'ves', to: { x: 9, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 8 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'otter', at: 'vole' },
    { do: 'face', who: 'stoat', at: 'vole' },
    { do: 'act', who: 'vole', act: 'lunge', wait: false },
    { do: 'say', who: 'vole', text: 'It\'s worse. I\'m not saying it to frighten anybody. I\'m saying it because it\'s worse.' },
    { do: 'say', who: 'otter', text: 'It\'s been worse every winter since we painted the red line.' },
    { do: 'face', who: 'stoat', at: 'otter' },
    { do: 'say', who: 'stoat', text: 'Same as that winter. When the boy...' },
    { do: 'face', who: 'otter', at: 'badger' },
    { do: 'face', who: 'vole', at: 'badger' },
    { do: 'face', who: 'stoat', at: 'badger' },
    { do: 'say', who: 'badger', text: 'We don\'t say that in here.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'Everybody looks at the board of winters. Then, very hard, at anything else.' },
    { do: 'face', who: 'otter', at: 'vole' },
    { do: 'face', who: 'vole', at: 'otter' },
    { do: 'act', who: 'vole', act: 'shake' },
    { do: 'say', who: 'vole', text: 'Well, I\'m not going out. Not past the point. Not in that.' },
    { do: 'say', who: 'otter', text: 'Nobody\'s going out. Nobody\'s been out since the herring.' },
    { do: 'face', who: 'stoat', at: 'vole' },
    { do: 'say', who: 'stoat', text: 'Haddock goes out.' },
    { do: 'say', who: 'vole', text: 'Haddock\'s a walrus. Haddock floats.' },
    { do: 'say', who: 'otter', text: 'He\'s down the Drowned Rat, if anybody wants to tell him to stop. Nobody\'s managed it in forty years.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{surprised}...Is it always like this?' },
    { do: 'face', who: 'badger', at: 'bramble' },
    { do: 'say', who: 'badger', text: 'Only on meeting nights. Biscuit?' },
    { do: 'say', who: 'ves', text: '{smile}And how often are meeting nights?' },
    { do: 'say', who: 'badger', text: 'Every night.' },
    { do: 'say', text: 'The meeting breaks up the way it always does. Nobody agrees, and everybody goes home to be right about it.' },
    { do: 'ambience' },
    // Out under the party: down the sides, along row 11, out of the door.
    { do: 'walk', who: 'otter', to: { x: 7, y: 11 }, wait: false },
    { do: 'walk', who: 'stoat', to: { x: 13, y: 11 } },
    { do: 'walk', who: 'otter', to: { x: 10, y: 11 }, wait: false },
    { do: 'walk', who: 'stoat', to: { x: 11, y: 11 } },
    { do: 'walk', who: 'vole', to: { x: 12, y: 11 }, wait: false },
    { do: 'walk', who: 'otter', to: { x: 10, y: 13 }, wait: false },
    { do: 'walk', who: 'stoat', to: { x: 11, y: 13 } },
    { do: 'leave', who: 'otter' },
    { do: 'leave', who: 'stoat' },
    { do: 'walk', who: 'vole', to: { x: 11, y: 11 } },
    { do: 'walk', who: 'vole', to: { x: 11, y: 13 } },
    { do: 'leave', who: 'vole' },
    { do: 'face', who: 'player', at: 'badger' },
    { do: 'face', who: 'ves', at: 'badger' },
    { do: 'face', who: 'bramble', at: 'badger' },
    { do: 'say', who: 'badger', text: 'If it\'s the sea you\'re after, Haddock\'s at the Drowned Rat, down on the quay. By the fire. He always is.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
