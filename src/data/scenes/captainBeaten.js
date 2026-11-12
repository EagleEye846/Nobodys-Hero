// CAPTAIN BEATEN: the fight won by force (ship_cabin). He sinks at the chart table with his hat on his chest, still saying "One more tide."
// He does not know he has lost, because he doesn't know there is anything to lose. The coat slides off him; the crew are quiet
// below. The stern door unlatches. The sad ending: it is gentler to talk to him (his talk route). Actors: captain (7,7), Ves (10,8),
// Bramble (10,6). The hero never speaks. DRAFT words, for the designer.
export const CAPTAIN_BEATEN = {
  id: 'captain_beaten',
  room: 'ship_cabin',
  once: true,

  actors: [
    { id: 'captain', look: 'enemy:captain_tarry', x: 7, y: 7, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: 'ghostShip' },
    { do: 'camera', to: { x: 9, y: 7 } },
    { do: 'face', who: 'captain', dir: 'left' },
    { do: 'say', text: 'The captain sinks down at the chart table with his hat held to his chest and his eyes shut.\n\n"Not yet," he says. "One more tide."' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The leaning stops, and the bell, and the cabin is very quiet. Through the floor there\'s no sound from the crew at all. Nobody says Aye.' },
    { do: 'say', who: 'bramble', text: '{worried}He doesn\'t even know he lost.' },
    { do: 'say', who: 'ves', text: '{thoughtful}No. He doesn\'t know there\'s anything to lose. ...That might be the worst of it.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'His greatcoat slides off his shoulders, onto the chart table, and then to the deck, and he doesn\'t notice it go. It lies at your feet, folded over once by itself, the best coat on the coast, with nobody in it.\n\n"One more tide," he says again, to the stern window, very softly, and begins to trace the course on the chart with his finger, from the beginning.' },
    { do: 'give', item: 'captains_greatcoat' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{thoughtful}We could have told him. If it had only been done the other way. ...I suppose we\'ll know next time.' },
    { do: 'say', text: 'At the west end of the cabin, the stern door has come unlatched. Beyond it you can smell the sea. Behind you, in the dark, the finger moves on the paper, and stops a thumb\'s width short of home, and starts again.' },
    { do: 'camera' },
  ],
};
