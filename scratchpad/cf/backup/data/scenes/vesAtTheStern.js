// VES AT THE STERN (DRAFT, 2026-11-14): the captain's cabin (ship_cabin), once he has been talked down or beaten
// (captain_spared / captain_beaten). Going west toward the stern door, you find Ves has stopped at the stern windows
// (gs_stern_window, 3..7, row 2). A quiet beat: one honest line about the crew waiting to be told they could stop, one
// about her mum (who lit lamps for twenty years for a Hero who never came: chapterFourOpens), and a dry way out of it.
// The hero walks up and stands with her; he never speaks. Bramble stays by the chart table, giving them room.
// The trigger (shipCabin.js) is the column at x 6, rows 3-11: on the way to the stern door, the ring (3,9) or the
// windows. Ves stands at (4,3), the hero at (6,3), both facing the glass; Bramble stays where he is. Clear of the bunk (2,4),
// the chart table (10,5), the hatch (8-9,10) and the lantern post (7,4).
export const VES_AT_THE_STERN = {
  id: 'ves_at_the_stern',
  room: 'ship_cabin',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 7, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 8, y: 7, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'ves', to: { x: 4, y: 5 } },
    { do: 'walk', who: 'ves', to: { x: 4, y: 3 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'camera', to: { x: 5, y: 4 } },
    { do: 'wait', seconds: 0.6 },
    // Spared: the light in the windows has gone gold. Beaten: still grey.
    { do: 'say', text: 'Ves has stopped at the stern windows. The glass has gone gold at the very edge, like a morning that has finally made up its mind.', after: 'captain_spared' },
    { do: 'say', text: 'Ves has stopped at the stern windows. The glass is grey, the grey just before a morning, the same as it has been for a very long time.', until: 'captain_spared' },
    { do: 'walk', who: 'player', to: { x: 6, y: 4 } },
    { do: 'walk', who: 'player', to: { x: 6, y: 3 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}All of them. Waiting all that time, because nobody told them they could stop.', after: 'captain_spared' },
    { do: 'say', who: 'ves', text: '{thoughtful}They\'re still down there, waiting. Because nobody\'s told them they can stop.', until: 'captain_spared' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{sad}...Mum waited for things too. Nobody told her she could stop, either.' },
    { do: 'wait', seconds: 1.0 },
    { do: 'face', who: 'ves', at: 'player' },
    { do: 'say', who: 'ves', text: '{bored}...Anyway. These windows want a clean, and I am not doing it. Come on, before Bramble tries on the hat.' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'camera' },
  ],
};
