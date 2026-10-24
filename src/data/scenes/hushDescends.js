// HUSH DESCENDS: out of the broken gateway comes the Hush, Ves's umbrella in
// its jaws, the way it's come after them all down the mountain: quietly, on
// all fours, head low (the hush_prowl walk, hushBeast.js). It stops, and
// stands there breathing, and looks at them, and doesn't run. The last fight
// (the_hush): in the middle of it Ves gets her umbrella back.
export const HUSH_DESCENDS = {
  // Triggers in rooms name the scene by this id.
  id: 'hush_descends',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_gate_foot',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 8, y: 12, portrait: 'vesper_bare', plays: 'vesper' },
    { id: 'hush', look: 'anim:hush_prowl', x: 13, y: 5, hidden: true, animation: 'hush_prowl', speed: 0.3 },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'appear', who: 'hush' },
    // It walks down out of the gateway, slowly, its walk kept going.
    { do: 'walk', who: 'hush', to: { x: 13, y: 8 }, keep: true },
    { do: 'animate', who: 'hush', animation: 'hush_wait', speed: 0.6 },
    { do: 'say', text: 'Out of the broken gateway, very slowly, comes the Hush. A boar as big as a cart, black as a chimney, its hackles up along its back and its tusks like hooks, and quite silent. All the birds in the valley stop at once.' },
    { do: 'say', text: 'It has Ves\'s umbrella in its jaws, shut, held carefully, the way a dog holds an egg.' },
    { do: 'say', who: 'ves', text: '{scared}...' },
    { do: 'say', who: 'ves', text: '{determined}Give it back.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'The Hush doesn\'t move. It only looks at her, the way it has looked at everyone it has ever followed.' },
    { do: 'say', who: 'ves', text: '{determined}I said give it BACK.' },
    { do: 'battle', enemy: 'the_hush', who: 'hush', spared: 'hush_spared', defeated: 'hush_defeated' },
  ],
};
