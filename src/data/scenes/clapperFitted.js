// CLAPPER FITTED (DRAFT): once, back on the Watch Rock with the bell's tongue (the gear `fog_bell_tongue`, the Drowned Rat's
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
    // (draft) 2026-11-15: staged and trimmed (the tongue going on is a click; the camera looks out to the grey).
    { do: 'camera', to: { x: 23, y: 5 } },
    { do: 'walk', who: 'player', to: { x: 23, y: 6 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.4 },
    { do: 'act', who: 'player', act: 'hop' },
    { do: 'take', item: 'fog_bell_tongue' },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'ves', text: '{surprised}...Nothing. IN FOG, it says. So not before, I suppose.' },
    { do: 'say', who: 'bramble', text: '{angry}So we wait for FOG. On a ROCK. In the SEA.' },
    // Far out past the rock, where the tide comes in from, the air over the sea has gone grey at the edges.
    { do: 'camera', to: { x: 33, y: 8 } },
    { do: 'wait', seconds: 2.4 },
    { do: 'camera', to: { x: 23, y: 5 } },
    { do: 'say', who: 'ves', text: '{smile}On a rock. In the sea. Yes.\n\n{determined}Watch the water. I think the fog comes in with it.' },
    { do: 'camera' },
  ],
};
