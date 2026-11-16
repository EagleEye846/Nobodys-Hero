// SHIP ORLOP IN (DRAFT, the deep part of the ghost ship): the foot of the hatch ladder (ship_orlop, trigger x 2-4, rows 4-5, once). The cable tier: the
// cold, the coils, three chambers in a row, and from far forward a laugh that stops when you listen. No puzzle in this room. Ves (4,6) and Bramble (2,6)
// stand in the first chamber's west end, clear of the monster's row (11) and the open gate (10, rows 6-7). The hero never speaks.
export const SHIP_ORLOP_IN = {
  id: 'ship_orlop_in',
  room: 'ship_orlop',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 4, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The ladder ends in a low dark, close and cold and smelling of tar. Cable lies in coils taller than Bramble. Pigs of ballast iron are stowed where somebody wanted them a hundred years ago. Three chambers in a row, and in each bulkhead a single low door, its gate swung back and chocked open.\n\nThis is the lowest honest room in the ship. The bilge is above it, not below. It was only ever meant for things nobody needed in a hurry.' },
    { do: 'say', who: 'ves', text: '{surprised}Who paints a hatch shut? ...To keep something in, or to keep something out?' },
    { do: 'say', who: 'bramble', text: '{scared}Can I vote for neither?' },
    { do: 'say', who: 'ves', text: '{smile}We\'ll find out. That\'s the worst thing about hatches.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Far forward, through three bulkheads, something laughs. Light and sweet and quick. It stops, the way a sound does when you turn your head to it.' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}Did you hear that?' },
    { do: 'say', who: 'ves', text: '{worried}Yes. ...Please don\'t make me say it was the wind. I\'m running out of winds.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
