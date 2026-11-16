// CORRIE APPEARS: stepping into the lamp room (lastlight_lamp) from the door. The room is dark, the
// great lamp dead in the middle of it, and a small boy is sitting on its rim in an oilskin far too
// big for him, a driftwood staff across his knees, his back to them. Ves sees it first. Bramble asks
// the question. The boy turns, and his eyes are the colour of the sea. He doesn't speak; the storm
// does: the glass all round goes white. Then the fight. The hero never speaks.
//
// The boy is two actors, `corrie_back` and `corrie` (a swap between two pictures: `instant`), and
// the fight is on `corrie`. He sits on the lamp's rim (the lamp prop `ll_dead_lamp` is 4 wide at
// x 9-12, foot on row 8), so he is drawn behind the drum's top. The three spread out round the
// lamp's foot, up where the text box doesn't hide them: Ves to its left (7,8), Bramble to its
// right (14,8), the hero just below it (10,9). No monsters in this room, so nothing crosses the walk.
// (draft).
//
// After the fight: `corrie_falls` (src/data/scenes/tideHeldFinale.js) and the scenes after it, to the
// end of the chapter. There is no mercy bar for him, so no `spared`.
export const CORRIE_APPEARS = {
  // Triggers in rooms name the scene by this id.
  id: 'corrie_appears',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lastlight_lamp',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    // Hovering over the lamp's rim, bobbing, the coat stirring (coastFolk.js; redrawn 2026-11-15).
    { id: 'corrie_back', look: 'anim:cf_corrie_back', x: 10.5, y: 3.9, animation: 'cf_corrie_back', speed: 0.3 },
    { id: 'corrie', look: 'anim:cf_corrie', x: 10.5, y: 3.9, hidden: true, animation: 'cf_corrie', speed: 0.3 },
    { id: 'ves', look: 'prop:vesper_stand', x: 9, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 12, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'walk', who: 'ves', to: { x: 7, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 14, y: 8 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 10, y: 9 }, pace: 40 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    // The camera goes up to the great lamp, cold and cracked in the dark, and the small shape sitting on its
    // rim with its back to you, an oilskin far too big, a driftwood staff across its knees. (draft)
    { do: 'camera', to: { x: 10.5, y: 5 } },
    { do: 'stage', spots: [{ at: { x: 10.5, y: 4 }, color: '150, 210, 214', radius: 30 }] },
    { do: 'wait', seconds: 2 },
    { do: 'say', who: 'ves', text: '{surprised}...That\'s a child.' },
    { do: 'say', who: 'bramble', text: '{worried}...Hello?' },
    { do: 'wait', seconds: 1 },
    // He turns, and his eyes are the colour of the sea out there.
    { do: 'leave', who: 'corrie_back', instant: true },
    { do: 'appear', who: 'corrie', instant: true },
    { do: 'wait', seconds: 1.6 },
    { do: 'act', who: 'bramble', act: 'shiver', wait: false },
    { do: 'wait', seconds: 1.4 },
    // He rises, on nothing, and the storm rises with him: the glass all round goes white.
    { do: 'walk', who: 'corrie', to: { x: 10.5, y: 3.2 }, pace: 14, wait: false },
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 1.2, seconds: 1.6 },
    // (draft, 15 Nov 2026) They're frightened, and they say only what they see.
    { do: 'say', who: 'bramble', text: "{scared}Ves. Ves, he's FLOATING." },
    { do: 'say', who: 'ves', text: '{scared}Back. Get BACK.' },
    { do: 'stage', bolt: true },
    { do: 'wait', seconds: 0.8 },
    { do: 'stage', white: 1, seconds: 0.5 },
    { do: 'wait', seconds: 0.6 },
    { do: 'camera' },
    { do: 'battle', enemy: 'corrie', who: 'corrie', noRun: true, noRunText: 'corrie_no_run', defeated: 'corrie_falls' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
// (draft) 2026-11-15: Bramble and Ves frightened as he rises ("he's FLOATING", "Get BACK").
