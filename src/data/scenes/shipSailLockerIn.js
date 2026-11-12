// SHIP SAIL LOCKER IN (DRAFT): the west end of the sail locker (ship_sail_locker, trigger x 1-2, rows 8-9, once). Canvas in bales to the beams, four
// alcoves along the north wall, a halyard in each, nobody to say which is which. Ves hints that the order is somewhere the lantern finds. Ves (3,10) and
// Bramble (3,8) stand clear of the tackle (3,6) and the hall's other rows. The hero never speaks.
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
    { do: 'say', text: 'Canvas, rolled and roped and stacked to the beams: the sailmaker\'s whole life in bales. Needles as long as your arm hang from the deckhead on a cord, a sail-hook beside them. Four narrow alcoves run along the north wall, and at the back of each, a halyard hangs, with nothing to say which sail it belongs to.\n\nAt the far end of the hall, a gate. It does not look as if it will open for being asked.' },
    { do: 'say', who: 'bramble', text: '{worried}They all look the same. How would anybody know which one to pull?' },
    { do: 'say', who: 'ves', text: '{thoughtful}You write it down. Where nobody will rub it out. People who sew in the dark write things where a light finds them.' },
    { do: 'say', who: 'bramble', text: '{scared}...I do not like where this is going, and I\'m not sure I want the light on.' },
    { do: 'say', who: 'ves', text: '{bored}Of course you don\'t. Keep it on.' },
  ],
};
