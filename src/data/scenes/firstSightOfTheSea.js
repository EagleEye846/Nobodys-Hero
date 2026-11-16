// FIRST SIGHT OF THE SEA: the clifftop above Gullrest, the last room of
// Sunnyside. The three walk to the telescope at the edge and the camera slides
// down off the cliff: the whole summer sea, the beach far below with its huts
// and bunting, and, out on the horizon, a green smudge of storm
// with a black spiky lighthouse standing in it (the Last Light). Bramble has
// never seen the sea. "...That's a big puddle."
// (The hero never speaks.)
//
// No monsters near: the one in the room keeps to the dunes at x 18 to 26.
export const FIRST_SIGHT_OF_THE_SEA = {
  id: 'first_sight_of_the_sea',
  room: 'sunny_sea_view',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 9, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 10, portrait: 'bramble', plays: 'bramble', hidden: true },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed. The camera does the describing: down off the cliff to the sea, to
    // Gullrest's bunting, out to the storm and the tower. Only what they say is left.
    { do: 'music', song: null },
    // They step in from where they were following (no pop).
    { do: 'appear', who: 'ves', instant: true },
    { do: 'appear', who: 'bramble', instant: true },
    { do: 'walk', who: 'player', to: { x: 11, y: 11 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 10, y: 11 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 12, y: 11 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'wait', seconds: 0.6 },
    // Down, and out.
    // "All of It, All at Once" (src/data/music/firstSeaTheme.js).
    { do: 'music', song: 'firstSea' },
    { do: 'camera', to: { x: 12, y: 21 } },
    { do: 'wait', seconds: 4.2 },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'say', who: 'bramble', text: '{awed}...That\'s a big puddle. A big puddle with opinions. I can hear it having them.' },
    { do: 'act', who: 'ves', act: 'sigh', wait: false },
    { do: 'say', who: 'ves', text: '{laughing}It\'s having them at you, mostly.' },
    { do: 'say', who: 'bramble', text: '{worried}It\'s rude is what it is.' },
    { do: 'wait', seconds: 0.8 },
    // Gullrest.
    { do: 'camera', to: { x: 6, y: 26 } },
    { do: 'wait', seconds: 3 },
    { do: 'say', who: 'ves', text: '{glee}Bunting. We\'re going to the bunting.' },
    // The horizon (west of the cliff path, so the path never stands in front of the tower).
    { do: 'camera', to: { x: 12, y: 21 } },
    { do: 'wait', seconds: 3.6 },
    { do: 'act', who: 'player', act: 'look' },
    { do: 'say', who: 'ves', text: '{surprised}...Is that a lighthouse? It looks like it bites.' },
    { do: 'say', who: 'bramble', text: '{worried}Is that where we\'re going?' },
    { do: 'say', who: 'ves', text: '{proud}Not today. Today is bunting. I\'ve decided.' },
    { do: 'camera' },
  ],
};
