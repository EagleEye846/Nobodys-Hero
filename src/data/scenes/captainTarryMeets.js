// CAPTAIN TARRY MEETS: the captain's cabin (ship_cabin, trigger the column x 19, rows 3-11: stepping in from the east door). A tall man in
// a captain's coat at the chart table, back to you, a speaking-trumpet in his hand; the whole stern windows, grey with a dawn
// that isn't coming. He takes you for his mate, then for passengers, then for a mutiny. He gave his word to their families.
// Then the fight: enemy captain_tarry (his own song, ghostCaptainBattle; the backdrop ghostship_cabin), spared =
// captain_spared, defeated = captain_beaten. He stands at (7,7) by the chart table (10-11, row 5); the chart table, the desk and the
// bunk are all off the party's walk (the party stops at x 16-17). The hero never speaks. DRAFT words, for the designer.
// He is drawn at the crew's scale (art/ghostShip.js, the gs_captain_ animations): at the chart table with his back to you,
// a finger on the course (gs_captain_trace), turning round (gs_captain_turn), standing (gs_captain_idle), and the trumpet up
// (gs_captain_trumpet), which he holds into the fight. He stands at (9.5,6), just in front of the table's left end.
export const CAPTAIN_TARRY_MEETS = {
  id: 'captain_tarry_meets',
  room: 'ship_cabin',
  once: true,

  actors: [
    { id: 'captain', look: 'prop:gs_captain', x: 9.5, y: 6, animation: 'gs_captain_trace', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 16, y: 7 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 17, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 8 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', text: 'The cabin is the last room in the ship, and the whole of the stern is windows: tall panes with a grey light behind them that isn\'t dawn and isn\'t going to be. A narrow bunk, never slept in. A chart table. A desk with the log gone from it.\n\nAt the chart table, with his back to you, a tall man in a captain\'s coat stands with one finger on a map. A speaking-trumpet hangs from his other hand.' },
    { do: 'camera', to: { x: 11, y: 7 } },
    { do: 'say', who: 'captain', text: '"Mr Pike." He doesn\'t turn. "Mr Pike. Is that you? You\'ve been a long time. I said I\'d call when we raised the light."' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'bramble', text: '{surprised}He thinks we\'re somebody else.' },
    { do: 'say', who: 'ves', text: '{worried}Then let him think it. I don\'t want to find out what he\'s like surprised.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_turn', once: true, speed: 0.18 },
    { do: 'wait', seconds: 0.9 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_idle', speed: 0.45 },
    { do: 'say', who: 'captain', text: 'He turns. He looks at you a long time: the way a man looks at a letter he was expecting that has come in the wrong hand. His face is kind, and tired, and not quite finished at the edges.\n\n"Not Mr Pike." He looks at the stern windows, at the grey in them. "Passengers? No. No, we\'ve no passengers aboard. We\'ve... "\n\nHe straightens, the way a man does who has said a thing a great many times. "Tarry. Captain Tarry, master of the Fair Return. And you are aboard my ship."' },
    { do: 'say', who: 'captain', text: '"It\'s always just before dawn in there," he says, mildly. "It was just before dawn when it began. I do wish it would get on with it."' },
    { do: 'face', who: 'ves', at: 'player' },
    { do: 'say', who: 'ves', text: '{determined}...Captain. We only need to get through your ship. I\'d really rather not fight a ghost about it.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'captain', text: '"Through my ship." Something closes in his face, like a hatch. "Nobody leaves the Fair Return until she\'s in. I gave my word to their mothers."' },
    { do: 'say', who: 'bramble', text: '{worried}Nobody wants to leave. We only want to get by.' },
    { do: 'animate', who: 'captain', animation: 'gs_captain_trumpet', once: true, speed: 0.16 },
    { do: 'say', who: 'captain', text: '"Then you\'ll do it on my deck, and by my leave." He lifts the speaking-trumpet. "Mr Pike! Clear the cabin!"' },
    { do: 'sound', name: 'shipGroan' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'From far away, along the whole length of the ship, a voice that is not alive answers, flat as a plank: "Aye, Captain."\n\nThe deck leans.' },
    { do: 'camera' },
    { do: 'battle', enemy: 'captain_tarry', who: 'captain', spared: 'captain_spared', defeated: 'captain_beaten' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
