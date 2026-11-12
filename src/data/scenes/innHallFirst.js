// INN, HALL FIRST: into the Drowned Rat before the town meeting. Haddock opens
// one eye and sends you up to the hall; the innkeeper adds why he doesn't go.
// Plays every time you come in until the meeting (town_meeting), and never
// for a save already past the inn (haddock_hums). (The hero never speaks.)
//
// Nobody walks: the party stays in the doorway and the box is over the room.
export const INN_HALL_FIRST = {
  id: 'inn_hall_first',
  room: 'saltcombe_inn',
  once: false,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock_sit', x: 6, y: 4, portrait: 'haddock', plays: 'haddock_inn', centered: true, animation: 'cf_haddock_sit', speed: 0.6 },
    { id: 'rat', look: 'prop:cf_rat_innkeeper', x: 14, y: 3, portrait: 'rat_innkeeper', plays: 'rat_innkeeper', animation: 'cf_rat_innkeeper', speed: 0.5 },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh? Oh, it\'s you lot.\n\n{smile}Meeting up at the hall, top of the market. They\'ll want a look at you. Go on. I\'ll be here.' },
    { do: 'say', who: 'rat', text: '{wry}He doesn\'t go to the meetings. He won one once, and they\'ve never forgiven him.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_sit', speed: 0.6 },
  ],
};
