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
    { do: 'camera', to: { x: 14, y: 11 } },
    { do: 'say', text: 'Inside, the tower is full of water to the knee, and of the sound of water. The bell ropes hang down out of the dark with their striped grips, swaying a little, though nobody is pulling them.\n\nIn the middle of the floor, fallen from somewhere high above, the great bell lies on its side in the flood. You could keep a cart in it.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'bell' },
    { do: 'quake', seconds: 0.4 },
    { do: 'wait', seconds: 1.0 },
    { do: 'say', text: 'The bell rings. On its own: one long, low note that you feel in your teeth. The water round it shivers into rings.' },
    { do: 'say', who: 'bramble', text: '{scared}It did it again. By itself!' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{thoughtful}Not by itself.' },
    { do: 'sound', name: 'thud' },
    { do: 'leave', who: 'bell', instant: true },
    { do: 'appear', who: 'gulper', instant: true },
    { do: 'quake', amount: 2, seconds: 0.3 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'Something shifts in the mouth of the bell. An eye opens, as big as a dinner plate and as pale. Then the rest of him comes out, and keeps coming: an eel the green of an old penny, with a jaw like a coal scuttle and one tooth at the front sticking out sideways.\n\nHe rubs his jaw along the rim of the bell. It rings. He winces.' },
    { do: 'say', who: 'gulper', text: '"Mmmrrf."\n\n"Visitors. In MY tower."' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}It\'s an EEL. I SAID there\'d be eels!' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}You did. Well done. Stand behind me.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'gulper', text: '"Go and visit somewhere else."\n\n"Before I bite you."' },
    { do: 'camera' },
    { do: 'battle', enemy: 'old_gulper', who: 'gulper', spared: 'gulper_spared', defeated: 'gulper_beaten' },
  ],
};
