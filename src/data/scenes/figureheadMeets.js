// FIGUREHEAD MEETS (DRAFT, the superboss): the figurehead's perch (ship_figurehead_perch, the column x 18, rows 6-8, once). The carved woman on the bow
// wakes while you watch (art: src/data/art/figureheadWake.js): the wood shudders and sheds old paint, her carved eyes open and glow, her head jerks round to
// the party, her held-out hand turns palm up for a coin, the star in her breast flares. Then the fight: enemy fairweather (her song figureheadBattle, her
// title card and entrance come with the battle), spared = figurehead_spared, defeated = figurehead_beaten.
// The hero walks out to (21,7); Ves (20,6) and Bramble (20,8) beside him. She is the actor `figurehead` standing where the room's prop
// stands (24, row 8; the prop is gone once this scene starts, so only one of her is ever drawn). The hero never speaks. Words only for what you
// can't see; the rest is shown.
export const FIGUREHEAD_MEETS = {
  id: 'figurehead_meets',
  room: 'ship_figurehead_perch',
  once: true,

  actors: [
    { id: 'figurehead', look: 'anim:figurehead_wake_sleep', animation: 'figurehead_wake_sleep', speed: 0.7, x: 24.5, y: 8, plays: 'figurehead', centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 18, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 21, y: 7 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 20, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 20, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    // The camera goes out along the bowsprit to her and holds.
    { do: 'camera', to: { x: 24, y: 6 } },
    { do: 'wait', seconds: 1.6 },
    // (Only with the sword: it has hummed all the way here, starPull.js.)
    { do: 'say', wields: 'fallen_star', text: 'At your side, the Fallen Star is not humming. It is ringing, like a struck glass, and it will not stop.' },
    { do: 'say', who: 'bramble', text: '{awed}...She\'s so pretty.' },
    { do: 'say', who: 'ves', text: '{surprised}Everyone aboard faced the other way. Not one of them looked out here.' },
    { do: 'wait', seconds: 0.8 },
    // She wakes: the music stops, the wood groans, and she shudders, shedding old paint.
    { do: 'music' },
    { do: 'sound', name: 'creak' },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_shudder', speed: 0.08 },
    { do: 'quake', amount: 1, seconds: 2.4 },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'shipGroan' },
    { do: 'stage', haze: 0.5, seconds: 1.5 },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'crumble' },
    { do: 'stage', burst: { at: { x: 27, y: 6 }, power: 0.8 } },
    // Bramble backs up behind Ves; Ves opens the umbrella.
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'walk', who: 'bramble', to: { x: 19, y: 6 }, pace: 44, wait: false },
    { do: 'animate', who: 'ves', animation: 'ves_open_umbrella', speed: 0.14, once: true },
    { do: 'wait', seconds: 0.6 },
    { do: 'animate', who: 'ves', animation: 'ves_brace', speed: 0.3 },
    { do: 'face', who: 'bramble', dir: 'right' },
    // Her eyes open, and the star flares behind them.
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_eyes', speed: 0.32, once: true },
    { do: 'camera', to: { x: 26, y: 5 } },
    { do: 'wait', seconds: 1.1 },
    { do: 'sound', name: 'shimmer' },
    { do: 'stage', flicker: 1.6 },
    { do: 'wait', seconds: 1.6 },
    // Her head jerks round to look at you.
    { do: 'sound', name: 'creak' },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_turn', speed: 0.24, once: true },
    { do: 'wait', seconds: 0.7 },
    { do: 'sound', name: 'thunk' },
    { do: 'quake', amount: 1.4, seconds: 0.35 },
    { do: 'act', who: 'bramble', act: 'shiver', wait: false },
    { do: 'wait', seconds: 1 },
    // The held-out hand turns over: palm up, for a coin.
    { do: 'sound', name: 'creak' },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_hand', speed: 0.38, once: true },
    { do: 'wait', seconds: 1.5 },
    { do: 'sound', name: 'bell' },
    { do: 'stage', flicker: 0.9 },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_awake', speed: 0.4 },
    { do: 'wait', seconds: 1.2 },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_laugh', speed: 0.12 },
    { do: 'say', who: 'figurehead', text: 'Oh! A GUEST!' },
    { do: 'say', who: 'figurehead', text: 'Admission is a coin, dear. One small coin.\n\nThe night itself is free.' },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_awake', speed: 0.4 },
    { do: 'say', who: 'ves', text: '{bored}We\'re not here for the night.' },
    { do: 'animate', who: 'figurehead', animation: 'figurehead_wake_laugh', speed: 0.12 },
    { do: 'say', who: 'figurehead', text: 'Nobody is! And yet! Here we all are!' },
    { do: 'say', who: 'bramble', text: '{surprised}She\'s TALKING! Ves, the BOAT is talking!' },
    { do: 'say', who: 'ves', text: '{determined}Both of you. Stay where I can see you.' },
    { do: 'say', who: 'figurehead', text: 'Make a wish, dear! Everyone does!' },
    { do: 'camera' },
    { do: 'battle', enemy: 'fairweather', who: 'figurehead', spared: 'figurehead_spared', defeated: 'figurehead_beaten' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: she wakes on stage (new art), narration cut to what can't be seen.
