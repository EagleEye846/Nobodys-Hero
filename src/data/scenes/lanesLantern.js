// LANES LANTERN: the culvert under the drowned lane opens into a dry pocket of air, and in the
// middle of it a lantern is burning (lantern 4 of the chapter). Ves walks a few steps toward it,
// stops for a second, and says nothing. Then she goes on. Nobody asks who lit it, and nobody
// says. (The hero never speaks.) The walks stay on the pocket's floor (rows 8 to 10); the pocket
// has no monsters.
export const LANES_LANTERN = {
  id: 'lanes_lantern',
  room: 'lanes_bubble',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // The hero on row 9, so Ves passes above along row 8 and Bramble below on row 10.
    { do: 'walk', who: 'player', to: { x: 10, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The culvert opens into air. A round pocket of it, dry as a cupboard, on the old lane under the water. All round, the flood stands up like glass, and a fish noses at the outside of it.\n\nIn the middle, on its post, a lantern is burning. The flame doesn\'t lean.' },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'walk', who: 'ves', to: { x: 10, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 14, y: 8 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 1.8 },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 10 } },
    { do: 'face', who: 'bramble', at: { x: 14, y: 7 } },
    { do: 'say', who: 'bramble', text: '{thinking}...It\'s not even wet.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'walk', who: 'ves', to: { x: 16, y: 9 } },
  ],
};
