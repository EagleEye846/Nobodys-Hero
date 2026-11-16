// DIGGINGS QUAKE: as you go into the passage past the rockfall, the roof
// grumbles. Grit comes down, a timber ticks, the screen shakes for a second
// and a bit, and then it stops, as if nothing had been said. Ves has an
// opinion about it. (No walking in it, so it's safe whatever the rocks are
// doing: the scene only shakes, drops a little dust, and talks.)
export const DIGGINGS_QUAKE = {
  // Triggers in rooms name the scene by this id.
  id: 'diggings_quake',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'diggings_cave_in',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 8, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    // The roof clears its throat: grit sifts down, a puff of dust comes off
    // the beam, Ves ducks and looks up, and then it all goes quiet.
    { do: 'quake', amount: 3, seconds: 1.3 },
    { do: 'sound', name: 'crumble' },
    { do: 'stage', rubble: 1.8, rubbleAmount: 0.4, haze: 0.5, seconds: 0.4 },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'act', who: 'player', act: 'crouch' },
    { do: 'wait', seconds: 0.7 },
    { do: 'stage', burst: { at: { x: 12, y: 7 }, power: 0.9 } },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.6 },
    { do: 'act', who: 'ves', act: 'stand', wait: false },
    { do: 'act', who: 'player', act: 'stand' },
    { do: 'act', who: 'ves', act: 'look' },
    { do: 'stage', haze: 0, seconds: 2.5 },
    { do: 'say', text: 'Somewhere over the passage, the roof clears its throat. A fine rain of grit comes down, a timber ticks, and then it all goes quiet, very deliberately.' },
    { do: 'say', who: 'ves', text: '{surprised}...That was the roof saying something.\n\n{bored}I\'d like it to say less.' },
  ],
};
