// THE LUM WAKES: the mini-boss at the end of the Ash Road (ash_town_gate, the trigger at x 4 as
// you come in). A burnt farmhouse by the road has a gap in its end wall where the chimney stood,
// and the chimney is standing out in the yard on its own (13,7). It breathes, turns round, and tells
// you nobody goes up to the town. Then the fight (src/data/enemies/the_lum.js): spared, lum_spared;
// beaten, lum_beaten. The party walks in along the road (rows 9-11); no monsters in this room. (draft)
export const THE_LUM_WAKES = {
  id: 'the_lum_wakes',
  room: 'ash_town_gate',
  once: true,

  actors: [
    { id: 'lum', look: 'enemy:the_lum', x: 13, y: 7, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'ves', to: { x: 7, y: 10 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 6, y: 11 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 8, y: 11 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'camera', to: { x: 11, y: 8 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'A farmhouse by the road, burnt to its walls. In its end wall there\'s a gap where the chimney ought to be.' },
    { do: 'say', text: 'The chimney is standing out in the yard on its own, a little way from the house, as if it had stepped out for some air.' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{thinking}...Why is the chimney over there?' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{bored}Got tired of the house, probably.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 2, seconds: 0.3 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', text: 'The chimney breathes out. A long grey breath goes up out of its pot, and down in its hearth something red opens like an eye.' },
    { do: 'say', who: 'lum', text: '"Hm."\n\n"Visitors."' },
    { do: 'say', who: 'lum', text: '"Nobody goes up to the town. Not since the fire. Not on my watch."' },
    { do: 'say', who: 'ves', text: '{surprised}It talks.' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}Everything out here talks. I don\'t like it.' },
    { do: 'say', who: 'lum', text: '"Off my road."' },
    { do: 'camera', to: { x: 10, y: 10 } },
    { do: 'walk', who: 'lum', to: { x: 11, y: 9 }, pace: 40 },
    { do: 'battle', enemy: 'the_lum', who: 'lum', spared: 'lum_spared', defeated: 'lum_beaten' },
  ],
};
