// OLD GULPER: up from the porch into Merrow's drowned bell tower (merrow_belfry). The ropes
// hang down from the dark and the great bell lies on its side in the flood. It rings by itself,
// and then the one who rings it comes out: Old Gulper, a very old moray eel with toothache, who
// rubs his sore jaw on the bell. Then the fight. Spared: gulper_spared. Beaten: gulper_beaten.
// Both give the Gulper Tooth (the key to the sea gate).
// The trigger is the whole of row 17 (the porch step). The party walks in to row 12; the
// bell's room prop goes when this scene starts (`until`), and the actor `bell` stands in its
// place until he comes out. No monsters in this room. The hero never speaks. DRAFT words.
export const OLD_GULPER_SCENE = {
  id: 'old_gulper',
  room: 'merrow_belfry',
  once: true,

  actors: [
    { id: 'bell', look: 'prop:mw_great_bell', x: 14, y: 9 },
    { id: 'gulper', look: 'anim:mw_gulper_out', animation: 'mw_gulper_out', speed: 0.6, x: 14, y: 9, hidden: true, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 18, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 18, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 14, y: 12 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 12, y: 12 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 12 } },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    // The water to the knee, the ropes swaying with nobody on them, the great bell on its side. (draft)
    { do: 'camera', to: { x: 14, y: 10 } },
    { do: 'wait', seconds: 1.4 },
    // It rings by itself: the bell shudders and the water goes to rings.
    { do: 'sound', name: 'bell' },
    { do: 'act', who: 'bell', act: 'shiver', wait: false },
    { do: 'quake', amount: 1.2, seconds: 0.9 },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'ves', text: '{surprised}Bells don\'t do that. ...Do bells do that?' },
    { do: 'sound', name: 'thud' },
    { do: 'leave', who: 'bell', instant: true },
    { do: 'appear', who: 'gulper', instant: true },
    { do: 'quake', amount: 2, seconds: 0.3 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'wait', seconds: 0.5 },
    // He rubs his sore jaw along the rim. It rings. He winces. (draft)
    { do: 'sound', name: 'bell' },
    { do: 'act', who: 'gulper', act: 'shake', wait: false },
    { do: 'wait', seconds: 0.9 },
    { do: 'say', who: 'gulper', text: '"Mmmrrf."\n\n"Visitors. In MY tower."' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{shout}It\'s an EEL. I SAID there\'d be eels!' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{determined}You did. Well done. Stand behind me.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'gulper', text: '"Go and visit somewhere else."\n\n"Before I bite you."' },
    { do: 'camera' },
    { do: 'battle', enemy: 'old_gulper', who: 'gulper', spared: 'gulper_spared', defeated: 'gulper_beaten' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
