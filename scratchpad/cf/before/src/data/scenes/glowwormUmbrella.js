// GLOW-WORM UMBRELLA: the bottom of the lake's stair, and the dark. A few
// glow-worms drift down and settle on Ves's umbrella, and stay: from here
// on, in the Deep, your light never goes out entirely while she's with you
// (`glowworms` on the Deep's rooms; see OverworldScene.lightReach). A candle
// still lights further. The worms come down one at a time out of the dark
// (worm_drift, src/data/art/ch4Moves.js, held on Ves so it goes where she
// stands) and sit glowing on the umbrella; she looks up as the first lands.
export const GLOWWORM_UMBRELLA = {
  // Triggers in rooms name the scene by this id.
  id: 'glowworm_umbrella',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_first_dark',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 2, portrait: 'vesper', plays: 'vesper' },
    // The worms coming down on her, drawn over her and lit in the dark.
    { id: 'worms', look: 'anim:worm_drift', x: 8, y: 2, hidden: true, glow: 30 },
  ],

  steps: [
    { do: 'wait', seconds: 0.6 },
    { do: 'hold', who: 'ves', what: 'worms' },
    { do: 'appear', who: 'worms', instant: true },
    { do: 'animate', who: 'worms', animation: 'worm_drift', speed: 0.55, once: true },
    { do: 'wait', seconds: 0.9 },
    { do: 'act', who: 'ves', act: 'look' },
    { do: 'say', text: 'Something small and green drifts down out of the dark and lands on Ves\'s umbrella. Then another. Then rather a lot.' },
    { do: 'animate', who: 'ves', glow: 38 },
    { do: 'act', who: 'ves', act: 'hop' },
    { do: 'say', who: 'ves', text: '{surprised}...Oh. Hello.\n\n{proud}Glow-worms. They like the umbrella. Well, obviously. It\'s a very good umbrella.' },
    { do: 'say', text: '(While Ves is with you in the Deep, the glow-worms light the way a little. A candle still lights it further.)' },
  ],
};
