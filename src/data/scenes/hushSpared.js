// HUSH SPARED: Ves, her umbrella back in her hand, works out what the Hush
// is: lonely. It took the umbrella because it was the first thing anybody had
// left within its reach in a hundred years; it never hunted anyone; it only
// followed. It lies down in front of her (hush_lie_down, hushBeast.js); she
// lets it smell her hand; it gets up and walks off along the old wall into
// the dark, quieter. Then the two of you walk through the broken Gate
// together, into the dawn, under her umbrella. The end of Chapter 3:
// credits, and its card.
export const HUSH_SPARED = {
  // Triggers in rooms name the scene by this id.
  id: 'hush_spared',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_gate_foot',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 11, portrait: 'vesper', plays: 'vesper' },
    { id: 'hush', look: 'anim:hush_stand', x: 13, y: 8, animation: 'hush_stand', speed: 0.45 },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 1.2 },
    // Down onto its belly, slowly (6 frames, 2.7 seconds), then lying there, watching.
    { do: 'animate', who: 'hush', animation: 'hush_lie_down', speed: 0.45, once: true },
    { do: 'wait', seconds: 2.7 },
    { do: 'animate', who: 'hush', animation: 'hush_lying_free', speed: 0.9 },
    { do: 'say', text: 'The Hush lies down on the broken paving, very slowly, and watches her.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...It\'s not hunting us. It never was.\n\n{sad}It just followed. All the way from the wood. Because we were there.' },
    { do: 'walk', who: 'ves', to: { x: 12, y: 10 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{tender}You picked it up because I dropped it. Didn\'t you. Nobody\'s left you anything in a long, long time.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Ves holds out her hand. The Hush looks at it for a long while. Then it breathes on it, once, very softly, the way a horse does.' },
    { do: 'say', who: 'ves', text: '{smile}...There. Now you know what I smell like. Next time, you can just say hello.' },
    // Up again (6 frames, 2.4 seconds), and off along the wall.
    { do: 'animate', who: 'hush', animation: 'hush_get_up', speed: 0.4, once: true },
    { do: 'wait', seconds: 2.4 },
    { do: 'say', text: 'The Hush gets up.' },
    { do: 'animate', who: 'hush', animation: 'hush_prowl_free_right', speed: 0.3 },
    { do: 'walk', who: 'hush', to: { x: 24, y: 5 }, keep: true },
    { do: 'leave', who: 'hush' },
    { do: 'say', text: 'It goes off along the old wall into the shadows, as quietly as it came. After a while, somewhere in the valley, a bird starts singing again.' },
    { do: 'walk', who: 'ves', to: { x: 11, y: 10 } },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'ves', text: '{smile}Well. That\'s my umbrella back.\n\n{laughing}And my leg still hurts, and the Gate\'s in bits, and we haven\'t got a clue what\'s on the other side.' },
    { do: 'say', who: 'ves', text: '{smile}It makes a better crutch than the crutch, at least.' },
    { do: 'say', who: 'ves', text: '{smile}...Come on, then. I\'ve got an umbrella again, so you\'ve got no excuse for dawdling.' },
    { do: 'music', song: 'nobodysDawn' },
    { do: 'walk', who: 'player', to: { x: 13, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 14, y: 7 } },
    { do: 'walk', who: 'player', to: { x: 13, y: 4 } },
    { do: 'walk', who: 'ves', to: { x: 14, y: 4 } },
    { do: 'say', text: 'You go through the Hero\'s Gate together, Ves out in front with her umbrella up, into the dawn.' },
    { do: 'end_chapter', credits: { song: 'creditsSearch', text: 'credits_search.txt' }, card: 'chapter_end_search.txt' },
  ],
};
