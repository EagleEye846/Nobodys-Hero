// CORRIE APPEARS: stepping into the lamp room (lastlight_lamp) from the door. The room is dark, the
// great lamp dead in the middle of it, and a small boy is sitting on its rim in an oilskin far too
// big for him, a driftwood staff across his knees, his back to them. Ves sees it first. Bramble asks
// the question. The boy turns, and his eyes are the colour of the sea. He doesn't speak; the storm
// does: the glass all round goes white. Then the fight. The hero never speaks.
//
// The boy is two actors, `corrie_back` and `corrie` (a swap between two pictures: `instant`), and
// the fight is on `corrie`. He sits on the lamp's rim (the lamp prop `ll_dead_lamp` is 4 wide at
// x 9-12, foot on row 8), so he is drawn behind the drum's top. No monsters in this room, so
// nothing crosses the walk.
// (draft) story text, for Patrick to review.
//
// After the fight: the finale pass adds `defeated: 'corrie_defeated'` (and the scenes after it) to
// the battle step below. There is no mercy bar for him, so no `spared`.
export const CORRIE_APPEARS = {
  // Triggers in rooms name the scene by this id.
  id: 'corrie_appears',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lastlight_lamp',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'corrie_back', look: 'prop:cf_corrie_back', x: 10.5, y: 3.9 },
    { id: 'corrie', look: 'prop:cf_corrie', x: 10.5, y: 3.9, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 9, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'walk', who: 'player', to: { x: 10, y: 10 } },
    { do: 'walk', who: 'ves', to: { x: 9, y: 11 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 11 } },
    { do: 'say', text: 'The lamp room is dark. The glass all round it is black with the storm, and the great lamp stands in the middle, cold and cracked.\n\nSomething small is sitting on the rim of it.' },
    { do: 'say', text: 'A boy. His oilskin is so big that the sleeves hang past his hands, and across his knees lies a staff of driftwood. He has his back to you.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...That\'s a child.' },
    { do: 'say', who: 'bramble', text: '{worried}Why\'s he on his own?' },
    { do: 'wait', seconds: 0.8 },
    // He turns.
    { do: 'leave', who: 'corrie_back', instant: true },
    { do: 'appear', who: 'corrie', instant: true },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'He turns. His eyes are the colour of the sea out there.' },
    { do: 'wait', seconds: 1.2 },
    // He doesn't speak. The storm does.
    { do: 'stage', bolt: true },
    { do: 'stage', white: 1, seconds: 0.5 },
    { do: 'say', text: 'He does not say a word. The storm says it for him: the glass all round goes white.' },
    { do: 'camera' },
    { do: 'battle', enemy: 'corrie', who: 'corrie', noRun: true, noRunText: 'corrie_no_run' },
  ],
};
