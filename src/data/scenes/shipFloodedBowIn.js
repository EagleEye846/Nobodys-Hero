// SHIP FLOODED BOW IN (DRAFT): the west end of the flooded bow (ship_flooded_bow, trigger x 1-2, rows 9-10, once). The forepeak flooded to the beams,
// fifteen little decks standing in it, planks on cleats between them that move with the list, a cold light a long way off at the far end, and
// a laugh over the water. Ves (4,10) and Bramble (4,9) stand on the first island, on its east side, clear of the ghost boy (2,10) and the chalk (3,8),
// both of which only the lantern shows. The hero never speaks.
export const SHIP_FLOODED_BOW_IN = {
  id: 'ship_flooded_bow_in',
  room: 'ship_flooded_bow',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 4, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 4, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The deck goes down at the bow, and the sea has come up to meet it. Black water, level with the beams. Standing out of it, little decks the size of a bedroom, fifteen of them, with planks run between on cleats that shift when the ship does.\n\nA long way off, at the far end, there is a cold light. And over the water, light and glad and a little too close, someone is laughing.' },
    { do: 'say', who: 'bramble', text: '{scared}Nobody laughs like that in a place like this.' },
    { do: 'say', who: 'ves', text: '{bored}Which is how you know someone is enjoying themselves.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{thoughtful}The planks are on cleats. They will go where the ship tells them. I\'d like to know what she tells them before I put my foot on one.' },
  ],
};
