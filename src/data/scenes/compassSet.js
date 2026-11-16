// COMPASS SET (DRAFT, the quest for the ghost ship's deep part): the captain's cabin (ship_cabin, the tile in front of the binnacle (11,10), once), with the
// glass, the needle and the card from the three secret places along the coast, once Tarry has been dealt with. The hero sets them in the binnacle's
// bowl; the needle swings and stops, pointing down through the floor at the painted hatch. The way down opens (the hatch's door waits on this scene).
// Ves (13,9) and Bramble (13,11) stand clear of the chair's places (7,9), (12,10), (18,9) and the hatch (8-9, 10). The hero never speaks.
export const COMPASS_SET = {
  id: 'compass_set',
  room: 'ship_cabin',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 13, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', text: 'You set the glass in the bowl of the binnacle. It fits like a word on the tip of the tongue. The needle goes on its pivot, the card under it.\n\nFor a moment nothing at all. Then the needle swings, once round, and again, and stops. It is not pointing north. It is pointing straight down, through the planking, at a square of floor painted over to match.' },
    { do: 'sound', name: 'creak' },
    { do: 'say', who: 'bramble', text: '{awed}It knows where it wants to go.' },
    { do: 'say', who: 'ves', text: '{surprised}It\'s pointing DOWN. Compasses don\'t point down. ...I have nothing clever to say about that, and I\'d like it noted.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'shipGroan' },
    { do: 'say', text: 'Under your feet, very faintly, from a long way forward and a long way down, someone laughs.' },
    { do: 'say', who: 'bramble', text: '{scared}...Something heard it too.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
