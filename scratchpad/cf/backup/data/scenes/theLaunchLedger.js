// THE LAUNCH-LEDGER (Hero trail 4): in the harbour office, the ledger open on the clerk's desk
// (sc_ledger_desk, 5..6, row 4) at the page gone soft with handling: one small boat, one passenger,
// no name, bound north-east toward the smoke, and no time in. Bramble notices the empty box; Ves
// notices somebody keeps turning to it. The clerk is listening and says nothing. Nobody explains
// it. The hero never speaks. The Z read (office_ledger, saltcombe.txt) is unchanged.
//
// The trigger (saltcombeHarbourOffice.js) is the row inside the door (x 4 to 9, row 7): anyone
// coming in walks up through it. The hero stops at the desk (5,5), Bramble at its other end (6,5),
// Ves a step back (4,6); clear of the stove (1,6), the book pile (3,7) and the bench (9..10,8).
// No monsters. Until the end of the chapter (the ending puts you down in here at 6,8).
//
// (draft).
export const THE_LAUNCH_LEDGER = {
  id: 'the_launch_ledger',
  room: 'saltcombe_harbour_office',
  once: true,

  actors: [
    { id: 'clerk', look: 'prop:cf_clerk_puffin', x: 6, y: 3, portrait: 'harbour_clerk', plays: 'harbour_clerk', animation: 'cf_clerk_puffin', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 6, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'bramble', to: { x: 6, y: 5 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 4, y: 6 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 5, y: 5 } },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', text: 'The launch-ledger lies open on the desk, at a page gone soft as cloth. Boats, crews, times out and times in.\n\nAnd one line in much older ink:\n\nONE SMALL BOAT. ONE PASSENGER.\nNAME: (left blank)\nBOUND: NORTH-EAST, TOWARD THE SMOKE.' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{thinking}There\'s no time in. All the other boats have got a time in.' },
    { do: 'say', who: 'ves', text: '{smile}Clerks. Leave one box empty and they can\'t sleep.' },
    { do: 'emote', who: 'clerk', emote: '...' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{thoughtful}...Somebody keeps opening it at this page, though.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{worried}Maybe they\'re just slow.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
