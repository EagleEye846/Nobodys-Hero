// THE KEEPER IN THE DEEP: in the dark, a small warm fire, and an old man
// sitting by it with a lantern, ahead of you as always. He's friendly. He has
// never been down here. Halfway through, his lantern burns a wrong colour for
// a moment. Nobody says anything, and neither does the scene. Then he sends
// you on, and goes back to the fire, where he stays.
export const KEEPER_IN_THE_DEEP = {
  // Triggers in rooms name the scene by this id.
  id: 'keeper_in_the_deep',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_keepers_fire',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'keeper', look: 'prop:keeper', x: 23, y: 7, portrait: 'old_keeper', plays: 'keeper' },
  ],

  steps: [
    // His theme ("Minding the Fire", keeperTheme.js), as in the Pinefall: it
    // plays on by the fire, and the Deep's own song comes back when you leave.
    { do: 'music', song: 'keeper' },
    { do: 'walk', who: 'player', to: { x: 19, y: 7 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'camera', to: { x: 21, y: 7 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'say', text: 'A small, warm fire in the middle of all that dark. Somebody is sitting beside it, with a lantern at his knee.' },
    { do: 'say', who: 'keeper', face: 'surprised', text: 'Well now! Fancy meeting you down here. Mind your step, it\'s a long way to the bottom of anything.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'keeper', text: 'Never been down here myself. Dark, isn\'t it? I\'d never have found my way without the lamp.' },
    { do: 'wait', seconds: 1 },
    // The lantern: a wrong colour, for a moment. Nobody comments.
    { do: 'stage', spots: [{ at: { x: 23, y: 7 }, from: { x: 23, y: 7 }, color: '150, 255, 200', radius: 26 }], flicker: 0.8 },
    { do: 'wait', seconds: 0.8 },
    { do: 'stage', spots: [] },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'keeper', face: 'glee', text: 'Go on, then. You\'ve a light to see to. I\'ll just sit a while.' },
    { do: 'face', who: 'keeper', dir: 'down' },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera' },
  ],
};
