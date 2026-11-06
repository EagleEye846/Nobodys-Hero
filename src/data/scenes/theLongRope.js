// THE LONG ROPE: goodbyes at the foot of the way home (belowtown_long_rope),
// straight after the hall comes down (the_hall_falls walks you here). Tuck
// and a few of the folk have come to see you off. A rope hangs down the face
// from a square of daylight a very long way up: the hand-rope of the old
// stair the Hero came down and went back up, still tied at the top after the
// steps fell in. The folk kept it for when the Hero came back. They never did. Tuck asks for two tugs on it from the
// top, so they'll know you made it. Then the scene's over and the climb is
// yours (the room's `rope`: src/overworld/ropeClimb.js).
export const THE_LONG_ROPE = {
  // Triggers in rooms name the scene by this id.
  id: 'the_long_rope',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_long_rope',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 9, y: 47, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 47, portrait: 'bramble', plays: 'bramble' },
    { id: 'tuck', look: 'prop:bf_tuck', x: 7, y: 41, portrait: 'tuck', plays: 'tuck' },
    { id: 'm1', look: 'prop:bf_mole_miner_a', x: 12, y: 42, plays: 'm1' },
    { id: 'f1', look: 'prop:bf_frog_kid_a', x: 13, y: 43, plays: 'f1' },
    { id: 'g1', look: 'prop:bf_glowworm', x: 5, y: 44, plays: 'g1' },
  ],

  steps: [
    // "Pull It Twice": already playing as you walk in (the room's song); it
    // carries on through the goodbyes and up the rope.
    { do: 'music', song: 'longRope' },
    // In from the passage, the three of you.
    { do: 'walk', who: 'bramble', to: { x: 10, y: 44 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 8, y: 44 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 9, y: 44 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    // Up the face to the daylight.
    { do: 'camera', to: { x: 9, y: 20 } },
    { do: 'say', text: 'A rope hangs down the face, from a square of daylight so far up it could be a star.' },
    { do: 'camera', who: 'player' },
    // The three of you stand at the very bottom of the room: words at the top.
    { do: 'textbox', top: true },

    // Tuck, with what's left of the king.
    { do: 'walk', who: 'tuck', to: { x: 8, y: 42 } },
    { do: 'face', who: 'tuck', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'tuck', text: '{shy}That\'s the Long Rope. It\'s all that\'s left of the old stair, the one the Hero came down. We kept it for when they came back.\n\n{sad}They never did.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}...Then somebody had better use it.' },
    { do: 'say', who: 'tuck', text: '{shy}Pull it twice when you\'re at the top. So we know you got there.' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{grin}Twice. Easy. I\'ll do it. Best pull in the camp.' },
    { do: 'say', who: 'ves', text: '{bored}You\'re the best at everything in the camp.' },
    { do: 'say', who: 'bramble', text: '{proud}Yep.' },
    // The folk wave you off.
    { do: 'act', who: 'f1', act: 'hop', wait: false },
    { do: 'act', who: 'm1', act: 'nod', wait: false },
    { do: 'act', who: 'g1', act: 'hop' },
    { do: 'say', who: 'tuck', text: '{smile}Goodbye. And thank you. For coming down.' },
    { do: 'act', who: 'ves', act: 'nod', wait: false },
    { do: 'act', who: 'player', act: 'nod' },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'The rope is waiting. Walk up to its foot and climb.' },
  ],
};
