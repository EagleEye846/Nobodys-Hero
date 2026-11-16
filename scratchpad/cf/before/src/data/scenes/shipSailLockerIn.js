// SHIP SAIL LOCKER IN (DRAFT): the west end of the sail locker (ship_sail_locker, trigger x 1-2, rows 8-9, once). Canvas in bales to the beams, four
// alcoves along the north wall, a halyard in each. Nobody knows the order: it is in the world (the board by the gate, the names chalked at the alcoves'
// mouths, and the sailmaker going round them humming). Ves (3,10) and Bramble (3,8) stand clear of the save crystal (4,6) and the hall's other rows. The hero never speaks.
export const SHIP_SAIL_LOCKER_IN = {
  id: 'ship_sail_locker_in',
  room: 'ship_sail_locker',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'Canvas, rolled and roped and stacked to the beams: the sailmaker\'s whole life in bales. Needles as long as your arm hang from the deckhead on a cord, a sail-hook beside them. Four narrow alcoves run along the north wall, and at the back of each, a rope hangs, and on the boards at each alcove\'s mouth a word is chalked, big.\n\nAt the far end of the hall, a gate. It does not look as if it will open for being asked.' },
    { do: 'say', who: 'bramble', text: '{thinking}They all look the same. How would anybody know which one to pull?' },
    { do: 'say', who: 'ves', text: '{proud}Pull one and find out. That\'s how I learn most things.' },
    { do: 'say', who: 'bramble', text: '{shout}That\'s how you learn things WRONG.' },
    { do: 'say', who: 'ves', text: '{worried}...Quickly, though. I\'d like to be quick in here.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
