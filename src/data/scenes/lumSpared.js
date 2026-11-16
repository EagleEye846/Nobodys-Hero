// LUM SPARED: its fire banked, the Lum puffs slow round smoke and decides you'll do. It gives you
// a brick from its hearth for the town, and goes back into the gap in the farmhouse wall. Gives the
// Hearth Brick. (The hero never speaks.) (draft)
export const LUM_SPARED = {
  id: 'lum_spared',
  room: 'ash_town_gate',
  once: true,

  actors: [
    { id: 'lum', look: 'enemy:the_lum', x: 11, y: 9, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 7, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'camera', to: { x: 10, y: 10 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The Lum\'s smoke goes up in slow round puffs, like an old man thinking with a pipe.' },
    { do: 'say', who: 'lum', text: '"...You swept my hearth."\n\n"Nobody\'s swept my hearth since the fire."' },
    { do: 'say', who: 'lum', text: '"Go on up, then. Take this. They\'ll know it. They\'ll know you came by my door and I let you."' },
    { do: 'walk', who: 'player', to: { x: 10, y: 10 }, pace: 48 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'It works a brick loose from its own hearth and holds it out. The brick is warm all the way through.' },
    { do: 'give', item: 'hearth_brick' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'bramble', text: '{grin}It\'s nice when they don\'t blow up.' },
    { do: 'say', who: 'ves', text: '{bored}Give it time.' },
    { do: 'walk', who: 'lum', to: { x: 13, y: 7 }, pace: 34 },
    { do: 'walk', who: 'lum', to: { x: 10, y: 6 }, pace: 34 },
    { do: 'leave', who: 'lum' },
    { do: 'say', text: 'The Lum stumps back across the yard and settles into the gap in the farmhouse wall, and stays there, a chimney again, breathing a thin grey thread into the sky.' },
    { do: 'camera' },
    { do: 'music', song: 'ash' },
  ],
};
