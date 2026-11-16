// CLAPPER FITTED (DRAFT): once, back on the Watch Rock with the bell's tongue (the gear `bell_clapper`, the Drowned Rat's
// doorstop), coming up onto the rock in front of the bell (x 19-24, rows 6-9, after bell_found). You hang the tongue back in
// it; the tongue leaves your pack. From here the bell is the lever `fog_bell`, which only takes in the fog (at high water).
// The words on the bell and a look out to sea say it (narration), and Ves guesses it: the fog comes in with the tide out here. The hero walks to the bell (23,6); Ves and Bramble come
// from where they were following. No monsters on the rock. The hero never speaks.
export const CLAPPER_FITTED = {
  id: 'clapper_fitted',
  room: 'wreck_watch_rock',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 18, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'camera', to: { x: 23, y: 5 } },
    { do: 'walk', who: 'player', to: { x: 23, y: 6 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'You reach up into the bell\'s mouth and hang the brass tongue back on its iron eye. It goes on with a small, final click, as if it had only been waiting to be asked.' },
    { do: 'take', item: 'bell_clapper' },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The bell hangs still. The tongue inside it doesn\'t touch the sides. It is as if the whole bell were holding its breath.' },
    { do: 'say', who: 'ves', text: '{surprised}...Nothing. IN FOG, it says. So not before, I suppose.' },
    { do: 'say', who: 'bramble', text: '{angry}So we wait for FOG. On a ROCK. In the SEA.' },
    { do: 'say', text: 'Far out past the rock, out where the tide comes in from, the air over the sea has gone grey at the edges.' },
    { do: 'say', who: 'ves', text: '{smile}On a rock. In the sea. Yes.\n\n{determined}Watch the water. I think the fog comes in with it.' },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
