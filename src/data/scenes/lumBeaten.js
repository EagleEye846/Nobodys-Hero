// LUM BEATEN: the Lum sinks down, its fire low and red. Gruff to the last, it gives you a brick
// from its own hearth so the town will know you came past its door, and goes back into the gap in
// the farmhouse wall, a chimney again. Gives the Hearth Brick. (The hero never speaks.) (draft)
export const LUM_BEATEN = {
  id: 'lum_beaten',
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
    { do: 'say', text: 'The Lum settles down onto its hearthstones. Its fire has gone low and red, and a brick slides off its stack into the ash.' },
    { do: 'say', who: 'lum', text: '"Hm."\n\n"You\'ll go up anyway. Your sort always do."' },
    { do: 'say', who: 'lum', text: '"Then take this. They\'ll know it, up there. They\'ll know you came past my door."' },
    { do: 'walk', who: 'player', to: { x: 10, y: 10 }, pace: 48 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'It works a brick loose from its own hearth and holds it out. The brick is warm all the way through.' },
    { do: 'give', item: 'hearth_brick' },
    { do: 'face', who: 'ves', at: 'lum' },
    { do: 'say', who: 'ves', text: '{thoughtful}It wasn\'t keeping us out. It was keeping them in. Safe, I mean.' },
    { do: 'walk', who: 'lum', to: { x: 13, y: 7 }, pace: 34 },
    { do: 'walk', who: 'lum', to: { x: 10, y: 6 }, pace: 34 },
    { do: 'leave', who: 'lum' },
    { do: 'say', text: 'The Lum stumps back across the yard and settles into the gap in the farmhouse wall, and stays there, a chimney again, breathing a thin grey thread into the sky.' },
    { do: 'camera' },
    { do: 'music', song: 'ash' },
  ],
};
