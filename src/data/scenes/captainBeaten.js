// CAPTAIN BEATEN: the fight won by force (ship_cabin). He sinks at the chart table with his hat on his chest, still saying "One more tide."
// He does not know he has lost, because he doesn't know there is anything to lose. The coat slides off him; the crew are quiet
// below. The stern door unlatches. The sad ending: it is gentler to talk to him (his talk route). Actors: captain (7,7), Ves (10,8),
// Bramble (10,6). The hero never speaks. DRAFT words, for the designer.
// He is the crew-scale figure (art/ghostShip.js, the gs_captain_ animations), by the chart table at (9.5,6): hat to his chest
// and sinking (gs_captain_sink), the coat gone from him (its own prop, gs_captain_coat, at your feet), then turned back to
// the chart, tracing the course again from the beginning (gs_captain_trace_bare).
export const CAPTAIN_BEATEN = {
  id: 'captain_beaten',
  room: 'ship_cabin',
  once: true,

  actors: [
    { id: 'captain', look: 'prop:gs_captain', x: 9.5, y: 6, animation: 'gs_captain_idle', speed: 0.45 },
    { id: 'coat', look: 'prop:gs_captain_coat', x: 14, y: 7, flat: true, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: 'ghostShip' },
    { do: 'camera', to: { x: 9, y: 7 } },
    { do: 'face', who: 'captain', dir: 'left' },
    { do: 'animate', who: 'captain', animation: 'gs_captain_sink', once: true, speed: 0.22 },
    { do: 'say', text: 'The captain sinks down at the chart table with his hat held to his chest and his eyes shut.\n\n"Not yet," he says. "One more tide."' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The leaning stops, and the bell, and the cabin is very quiet. Through the floor there\'s no sound from the crew at all. Nobody says Aye.' },
    { do: 'say', who: 'bramble', text: '{sad}He doesn\'t even know he lost.' },
    { do: 'say', who: 'ves', text: '{sad}No. ...I think that\'s the worst bit.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_slump_bare', speed: 0.5 },
    { do: 'appear', who: 'coat' },
    { do: 'say', text: 'His greatcoat slides off his shoulders, onto the chart table, and then to the deck, and he doesn\'t notice it go. It lies at your feet, folded over once by itself, the best coat on the coast, with nobody in it.\n\n"One more tide," he says again, to the stern window, very softly, and begins to trace the course on the chart with his finger, from the beginning.' },
    { do: 'give', item: 'captains_greatcoat' },
    { do: 'leave', who: 'coat' },
    { do: 'animate', who: 'captain', animation: 'gs_captain_turn_back', once: true, speed: 0.25 },
    { do: 'wait', seconds: 1.0 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_trace_bare', speed: 0.5 },
    { do: 'wait', seconds: 0.5 },
    // (draft) 2026-11-14: his cutlass, left on the chart table (`give captains_cutlass`).
    { do: 'say', text: 'His cutlass lies on the chart table where he laid it down in the fight, right across the course line. His finger comes to it, and goes round it, and on.\n\nWhen you lift it away he doesn\'t look up. The finger simply carries on over the place where it was.' },
    { do: 'give', item: 'captains_cutlass' },
    { do: 'say', who: 'ves', text: '{thoughtful}We could have told him. If it had only been done the other way. ...I suppose we\'ll know next time.' },
    { do: 'say', text: 'At the west end of the cabin, the stern door has come unlatched. Beyond it you can smell the sea. Behind you, in the dark, the finger moves on the paper, and stops a thumb\'s width short of home, and starts again.' },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
