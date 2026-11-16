// THE OILSKIN ON THE PEG (Hero trail 2): in Gullrest's lifeboat house, the child's yellow oilskin
// on its own peg in the north-west corner (c5_oilskin_hook, 2,3). The first time you walk over to
// that end of the room, the three go up to it and Bramble and Ves notice it. Nobody explains it;
// Ves's last line is a nudge at the crayon list in Haddock's Light (1. BIG COAT. 2. A BOAT.).
// The hero never speaks. The Z read (house_oilskin, gullrest.txt) is unchanged.
//
// The trigger (gullrestLifeboatHouse.js) is x 3 to 5, rows 4 to 6, away from lantern_at_noon's
// (by the doors, rows 8 to 10), so the two can't run into each other; that one leaves you at
// 10,7, outside both. The hero goes up to row 4 and along under the peg (2,4), Bramble beside him
// (3,4), Ves a step back (4,5): all north of the lifeboat (4..6, row 7) and clear of the net
// (1..2, row 5).
// No monsters in here. Until the end of the chapter (the_light_answers).
//
// (draft).
export const OILSKIN_ON_THE_PEG = {
  id: 'oilskin_on_the_peg',
  room: 'gullrest_lifeboat_house',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 5, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 3, y: 4 } },
    { do: 'walk', who: 'player', to: { x: 2, y: 4 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 3, y: 4 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 4, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'On a peg of its own hangs a child\'s oilskin. Yellow, patched at both elbows, the hem let down twice.\n\nThe peg has been dusted. The coat hasn\'t been moved.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{thinking}Whose is that?' },
    { do: 'say', who: 'ves', text: '{smile}Somebody small. With a lot of elbows.' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{proud}They let the hem down. So they were growing. ...I worked that out.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{thoughtful}...And then it stayed on the peg.' },
    { do: 'act', who: 'bramble', act: 'fidget' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{smile}Don\'t. Next you\'ll want a boat.' },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{sheepish}...I wasn\'t going to.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
