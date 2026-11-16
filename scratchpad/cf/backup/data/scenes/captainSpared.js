// CAPTAIN SPARED: the end of the TALK (ship_cabin; the captain is told, plainly, and says "How long?"). He puts the trumpet down;
// his last order is to make port; the crew answer, not flat, and go ashore in the fog; he gives you his coat
// (`give captains_greatcoat`) and asks one thing: tell them in Saltcombe that the Fair Return is in, and that she was late.
// He fades by the stern window. The stern door at the west end opens (the cabin's `after`). Actors: captain (7,7), Ves (10,8),
// Bramble (10,6). The hero never speaks. DRAFT words, for the designer.
// He is the crew-scale figure (art/ghostShip.js, the gs_captain_ animations), by the chart table at (9.5,6): the trumpet put down,
// the hat to his chest while the crew go, the coat off and held out, the hat back on, then his back to you and gone in the light.
export const CAPTAIN_SPARED = {
  id: 'captain_spared',
  room: 'ship_cabin',
  once: true,

  actors: [
    { id: 'captain', look: 'prop:gs_captain', x: 9.5, y: 6, animation: 'gs_captain_idle', speed: 0.45 },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: 'ghostShip' },
    { do: 'camera', to: { x: 9, y: 7 } },
    { do: 'face', who: 'captain', dir: 'left' },
    { do: 'animate', who: 'captain', animation: 'gs_captain_set_down', once: true, speed: 0.2 },
    { do: 'say', text: 'He puts the speaking-trumpet down on the chart table. It makes a small, flat sound: the sound of a thing put down for good.' },
    { do: 'animate', who: 'captain', animation: 'gs_captain_idle_empty', speed: 0.45 },
    { do: 'wait', seconds: 0.7 },
    { do: 'say', who: 'captain', text: '"Mr Pike," he says, to the stern windows, quite quietly.' },
    { do: 'sound', name: 'drownedBell' },
    { do: 'say', text: 'From far off along the ship, a voice answers. It is not flat any more. It cracks in the middle.\n\n"Aye, Captain."' },
    { do: 'say', who: 'captain', text: '"Make port."' },
    { do: 'animate', who: 'captain', animation: 'gs_captain_hat_chest', once: true, speed: 0.22 },
    { do: 'wait', seconds: 1.0 },
    { do: 'sound', name: 'creak' },
    { do: 'say', text: 'Under your feet, through every deck, a long breath goes out of the Fair Return, like a crowd letting go. Then voices: dozens, from every hatch and ladder, not flat, not alike, young and old and cracked and glad: "Aye, sir. Aye. Aye aye. Aye, Captain."\n\nThen footsteps, going up. A great many, in no hurry, the way you walk when you are going home.' },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'bramble', text: '{awed}...They\'re going down the gangway. All of them.' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'ves', text: '{surprised}They were waiting for him. ...All this time, they were only waiting to be told.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_coat_off', once: true, speed: 0.28 },
    { do: 'say', who: 'captain', text: 'He takes off his greatcoat. He folds it, with a good deal of care, over his arm, the way a man does who has been lent a thing and means to give it back in the condition he found it. He holds it out to you.\n\n"It\'s the best coat on this coast," he says. "I\'ve no use for it. I shan\'t be cold again."' },
    { do: 'give', item: 'captains_greatcoat' },
    { do: 'wait', seconds: 0.4 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_bare_idle', speed: 0.45 },
    // (draft) 2026-11-14: his cutlass too (`give captains_cutlass`), laid across the coat.
    { do: 'say', who: 'captain', text: 'Then he unbuckles his sword belt, sheath and cutlass and all, and lays it across the folded coat.\n\n"And that. I carried it a long while and drew it as seldom as I could." He looks at it the way you look at a good dog you never took for walks. "It does what it\'s told. You\'ll find that\'s rare."' },
    { do: 'give', item: 'captains_cutlass' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'captain', text: '"One thing." He puts his hat on, straight. "When you get to Saltcombe. Tell them the Fair Return is in." He thinks. "Tell them we were late. I\'d not like them to think we weren\'t."' },
    { do: 'say', who: 'ves', text: '{smile}I\'ll tell them. A hundred years late, and not a scratch on her.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'animate', who: 'captain', animation: 'gs_captain_fade', once: true, speed: 0.7 },
    { do: 'say', text: '"That," he says, "is a great deal of lateness." And something moves in his face that is nearly a smile.\n\nHe turns to the stern windows. The grey in them has gone gold, at the very edge, the colour of a morning at last. He stands in it a moment with his hat straight and his back to you.\n\nThen the light is only light, and the cabin is only a room, and the chair by the window has stopped rocking.' },
    { do: 'leave', who: 'captain', instant: true },
    { do: 'sound', name: 'creak' },
    { do: 'say', text: 'At the west end of the cabin, the stern door has come unlatched. Beyond it you can smell the sea.' },
    { do: 'say', who: 'bramble', text: '{sad}Do you think he\'s gone home?' },
    { do: 'say', who: 'ves', text: '{hopeful}...I\'d like to think the stern windows are the way out.' },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
