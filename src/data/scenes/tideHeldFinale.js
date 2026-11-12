// THE END OF CHAPTER 5 ("The Tide Held"): everything after the Corrie fight, in five scenes that
// hand on to each other with a `goto` onto a one-tile trigger (`after` the scene before), as the
// end of chapter 4 did:
//
//   corrie_falls        the lamp room (lastlight_lamp): the `defeated` of corrie_appears's battle step.
//                       The storm in the glass goes quiet; Corrie on the floor, small, the oilskin round
//                       him like a tent. His two lines; Ves's one. Then the sea behind him stands up:
//                       his last wave knocks the hero and Ves down. Bramble, alone and terrified, a long
//                       moment; then "My turn." (no joke), and he wades in and pulls them out one at a
//                       time. Where Corrie was, only the oilskin. It marks `my_turn` seen (`sees`), which
//                       is what wakes Bramble's CHILL branch (skills.js) and lets Nova show in the tree.
//   the_crank           the sluice room (lastlight_sluice, from the east door): the tower is flooding from
//                       below and the crank won't stay up on its own. Haddock is there: he came up after
//                       all. He takes the crank and sends them off. Out by the west grille.
//   the_light_answers   the stair (lastlight_stair, the top landing): the sea comes down the stair behind
//                       them and up from below, and the hero's light answers. The player holds Z (the
//                       `press` step) to hold the sea back; the hero learns NOVA. It marks `haddock_gone`
//                       seen (`sees`): the world after him (his shed opens; he is gone from his rooms and
//                       the Bother's rides are Ves's, rowing). Too late for him: nobody says so.
//   the_bell            the foot of the tower (reach_foot), the storm gone: Haddock's bell floating in the
//                       shallows by the door; Bramble picks it up and keeps it. In the Bother, tied up,
//                       his ledger: today's date, and one word.
//   the_tide_held       the balcony (lastlight_balcony) at dawn: the sea pulled back farther than anyone
//                       has seen, the carved slip, the smoke to the north-east (nobody explains it); Ves's
//                       one line; far off across the sand, one lantern quietly lights (nobody sees who,
//                       nobody remarks on it). Then the credits ("Found"), the card, and on in Saltcombe,
//                       in the harbour office, where the back door now stands open.
//
// The hero never speaks. Haddock is a lightman, never anything else.
// (draft).

// --- 1. Corrie falls (lastlight_lamp) ---------------------------------------------------------------
// After the fight you stand where corrie_appears left you (10,10). The lamp prop `ll_dead_lamp` is 4
// wide at x 9-12, its foot on row 8; Corrie sits on the floor in front of it (10.5, 9). The wave comes
// up out of the floor behind the lamp (its foot on row 7), so it stands behind both. No monsters here.
export const CORRIE_FALLS = {
  id: 'corrie_falls',
  room: 'lastlight_lamp',
  once: true,
  // Bramble's CHILL waits for this (skills.js reads it from the seen scenes).
  sees: ['my_turn'],

  actors: [
    { id: 'wave', look: 'anim:tf_wave', x: 10.5, y: 7, hidden: true },
    { id: 'corrie', look: 'anim:tf_corrie_sit', x: 10.5, y: 9, portrait: 'corrie', animation: 'tf_corrie_sit', speed: 0.6 },
    { id: 'oilskin', look: 'anim:tf_oilskin', x: 10.5, y: 9, animation: 'tf_oilskin', speed: 0.7, hidden: true, flat: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 11, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    // Everyone is down at the bottom of the room, where the camera can't go lower: words at the top.
    { do: 'textbox', top: true },
    { do: 'walk', who: 'ves', to: { x: 8, y: 11 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 13, y: 11 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 10, y: 11 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'The storm in the glass goes quiet. Not all at once: like a breath, let out.' },
    { do: 'say', text: 'The boy is sitting on the floor in front of the lamp. He is very small. The oilskin stands round him like a tent.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'corrie', text: '{small}...I was going to stop it. Like the Hero would\'ve.' },
    { do: 'say', who: 'corrie', text: '{small}The light went out. I couldn\'t see the way home.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'ves', text: '{sad}...He kept it lit after. Every night.' },
    { do: 'wait', seconds: 1.6 },

    // His last wave: the sea behind him stands up.
    { do: 'appear', who: 'wave', instant: true },
    { do: 'animate', who: 'wave', animation: 'tf_wave', speed: 0.2, once: true },
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 1, seconds: 1.2 },
    { do: 'emote', who: 'bramble', emote: '!' },
    // (Long enough for it to stand right up and pitch over them: six frames at 0.2.)
    { do: 'wait', seconds: 1.15 },
    { do: 'stage', white: 1 },
    { do: 'sound', name: 'boom' },
    { do: 'sound', name: 'splash' },
    { do: 'quake', amount: 4, seconds: 1 },
    { do: 'stage', flood: 0.7 },
    { do: 'leave', who: 'wave', instant: true },
    { do: 'leave', who: 'corrie', instant: true },
    { do: 'appear', who: 'oilskin', instant: true },
    // The hero and Ves knocked flat, back toward the door; Bramble, small, was under it.
    { do: 'appear', who: 'player', at: { x: 10, y: 12 } },
    { do: 'animate', who: 'player', animation: 'finale_hero_dive', speed: 0.05, once: true },
    { do: 'appear', who: 'ves', at: { x: 8, y: 12 } },
    { do: 'animate', who: 'ves', animation: 'finale_ves_dive', speed: 0.05, once: true },
    { do: 'wait', seconds: 0.4 },
    { do: 'stage', white: 0, seconds: 1.8 },
    // Awash, not drowned: a sheen along the bottom, so the two of them still show lying in it.
    { do: 'stage', flood: 0.07, seconds: 3.5 },
    { do: 'wait', seconds: 2.2 },
    { do: 'say', text: 'The water goes back out as fast as it came, and leaves the floor awash.\n\nYou are down in it. So is Ves. Neither of you is getting up.' },

    // Bramble, alone.
    { do: 'camera', who: 'bramble' },
    // The room goes dark round him; only the grey light off the glass finds him.
    { do: 'stage', dim: 0.3, seconds: 2.2 },
    { do: 'stage', spots: [{ onto: 'bramble', color: '190, 226, 236', radius: 24, from: { x: 12, y: 1 } }] },
    { do: 'emote', who: 'bramble', emote: 'sweat' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'say', text: 'Bramble is the only one still standing. The water is round his knees. It is cold, and it is the sea.' },
    { do: 'wait', seconds: 2.4 },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'bramble', text: '{determined}My turn.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'stage', dim: 0, seconds: 1.4 },
    { do: 'stage', spots: [] },

    // He wades in and pulls them out, one at a time.
    { do: 'walk', who: 'bramble', to: { x: 11, y: 12 }, pace: 18 },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'player' },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'act', who: 'player', act: 'shake' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'walk', who: 'bramble', to: { x: 9, y: 12 }, pace: 18 },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'ves' },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'act', who: 'ves', act: 'shake' },
    { do: 'wait', seconds: 1 },
    { do: 'camera' },

    // Where he was.
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Where the boy was, there is only the oilskin, lying empty in the wet.' },
    { do: 'wait', seconds: 1.2 },
    // What the storm left: the Stormglass Blade (weapons.js, "dropped by Corrie").
    { do: 'say', text: 'In a fold of it lies a sliver of storm-green glass, long as a blade. It is cold right through, and it hums like the sea in a shell.' },
    { do: 'give', item: 'stormglass_blade' },
    { do: 'wait', seconds: 1 },

    // And under them, the tower lets the sea in.
    { do: 'quake', amount: 2, seconds: 1.6 },
    { do: 'sound', name: 'crumble' },
    { do: 'say', text: 'Far down in the tower, something gives with a long iron groan. The floor shudders.\n\nThe sea is coming in from below.' },
    { do: 'walk', who: 'player', to: { x: 10, y: 13 }, fast: true },
    { do: 'walk', who: 'ves', to: { x: 10, y: 12 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 12 }, fast: true },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 13 }, fast: true, wait: false },
    { do: 'stage', dim: 1, seconds: 0.6 },
    { do: 'wait', seconds: 0.7 },
    { do: 'textbox', top: false },
    { do: 'goto', room: 'lastlight_sluice', spawn: { x: 28, y: 11 } },
  ],
};

// --- 2. The crank (lastlight_sluice) ----------------------------------------------------------------
// In by the east door (28,11). The crank `c5_crank_wheel` is at (24,3) with the sluice gate beside it
// (27,3); the floor in front (x 19-28, rows 4-10) is clear. Haddock leans on it at (24,4), his back to
// you. The way out is the weight grille in the divider (18, rows 8-9), open since the puzzle; then out
// of sight down the west side. The room's monsters are gone once corrie_falls has played (`until`).
export const THE_CRANK = {
  id: 'the_crank',
  room: 'lastlight_sluice',
  once: true,

  actors: [
    // His hat gone, both flippers up on the handle, leaning on it (tideFinale.js).
    { id: 'haddock', look: 'anim:tf_haddock_strain', x: 24, y: 4, portrait: 'haddock_hatless', animation: 'tf_haddock_strain', speed: 0.45 },
    { id: 'ves', look: 'prop:vesper_stand', x: 28, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 27, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'stage', flood: 0.1 },
    { do: 'stage', dim: 0, seconds: 0.6 },
    { do: 'stage', flood: 0.26, seconds: 24 },
    { do: 'walk', who: 'player', to: { x: 25, y: 9 }, fast: true },
    { do: 'walk', who: 'ves', to: { x: 23, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 26, y: 8 }, fast: true },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'The sluice room is filling. Sea wells up through the grates in the floor, black and cold, and in the east wall the great gate groans on its chain. Water spits round its edges.' },
    { do: 'say', text: 'Beside it, the crank is trying to turn back by itself. Somebody is leaning on it with all his weight, hat gone, moustache dripping.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'Haddock.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{surprised}You said you hate stairs.' },
    { do: 'say', who: 'haddock', text: '{eh}Eh? Couldn\'t hear you.' },
    // The crank slips back a quarter turn; he leans into it, and it holds.
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 2, seconds: 0.5 },
    { do: 'act', who: 'haddock', act: 'lunge' },
    { do: 'say', text: 'The crank jerks back a quarter turn. He leans into it, and it stops.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'haddock', text: '{determined}Go on. I\'ve minded worse.' },
    { do: 'music', song: 'haddock' },
    { do: 'wait', seconds: 1 },
    { do: 'walk', who: 'ves', to: { x: 23, y: 6 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{angry}You great stubborn lump.' },
    { do: 'say', who: 'haddock', text: '{tender}Thank you, miss. I\'ve kept trim.' },
    { do: 'wait', seconds: 1.2 },
    // He looks back over his shoulder: he can't let go of it to turn round.
    { do: 'animate', who: 'haddock', animation: 'tf_haddock_look', speed: 0.6 },
    { do: 'say', who: 'haddock', text: '{proud}Swim properly, lad. Like I showed you.' },
    { do: 'say', who: 'bramble', text: '{sad}...I will.' },
    { do: 'animate', who: 'haddock', animation: 'tf_haddock_strain', speed: 0.45 },
    { do: 'act', who: 'haddock', act: 'lunge' },
    { do: 'wait', seconds: 1 },

    // They go: across the floor and out through the grille, Bramble last.
    { do: 'walk', who: 'ves', to: { x: 20, y: 9 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 19, y: 9 } },
    { do: 'walk', who: 'player', to: { x: 15, y: 9 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 19, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 16, y: 9 } },
    { do: 'leave', who: 'ves' },
    { do: 'walk', who: 'bramble', to: { x: 19, y: 9 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1.4 },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 9 } },
    { do: 'stage', dim: 1, seconds: 0.8 },
    { do: 'wait', seconds: 0.9 },
    { do: 'goto', room: 'lastlight_stair', spawn: { x: 2, y: 3 } },
  ],
};

// --- 3. The light answers (lastlight_stair) ---------------------------------------------------------
// In at the top landing (2,3), out of the sluice room's door. Along landing D (rows 2-4) toward the
// east gap down. The room's monsters (landing C) are gone once corrie_falls has played. The water is
// the stage's `flood`; the `press` step is the player holding the sea back.
export const THE_LIGHT_ANSWERS = {
  id: 'the_light_answers',
  room: 'lastlight_stair',
  once: true,
  // The world without him from here on (his shed, his rooms, the Bother's rides).
  sees: ['haddock_gone'],

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'stage', dim: 0, seconds: 0.5 },
    { do: 'walk', who: 'ves', to: { x: 8, y: 2 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 7, y: 4 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 9, y: 3 }, fast: true },
    // Above them, the sluice gives. Nobody says what that means.
    { do: 'sound', name: 'boom' },
    { do: 'quake', amount: 4, seconds: 1.4 },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'music', song: null },
    { do: 'stage', flood: 0.35, seconds: 1.2 },
    { do: 'sound', name: 'splash' },
    { do: 'say', text: 'Above them, a long iron groan, and then a roar.\n\nThe sea comes down the stair behind them, and up the stair below them, and there is nowhere left that it isn\'t.' },
    { do: 'stage', flood: 0.62, seconds: 2.4 },
    { do: 'walk', who: 'ves', to: { x: 9, y: 2 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 9, y: 4 } },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'And something in you answers it.' },
    // The player holds it.
    { do: 'press', seconds: 3, text: 'Hold back the sea.', glow: 'player' },
    { do: 'stage', white: 1 },
    { do: 'stage', glow: null },
    { do: 'stage', flood: 0 },
    { do: 'sound', name: 'flare' },
    { do: 'learn', skill: 'nova' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'White. Your light, all of it, all at once: it swallows the stair, and the sea stands still in it like a wall of glass.' },
    { do: 'say', text: 'You learned NOVA.\n\nIt is in your SPELLS now.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Down. Down and down, all three of you, and out.' },
    { do: 'wait', seconds: 1 },
    { do: 'goto', room: 'reach_foot', spawn: { x: 20, y: 19 } },
  ],
};

// --- 4. The bell (reach_foot) -----------------------------------------------------------------------
// Out of the tower's door onto the forecourt (20,19). The storm has gone (the room's `calmAfter`).
// The bell floats in the shallows south of the forecourt (20,23); the Bother is tied up at the landing
// (5,23, the empty boat now) with his ledger in her. No monsters in this room.
export const THE_BELL = {
  id: 'the_bell',
  room: 'reach_foot',
  once: true,

  actors: [
    { id: 'bell', look: 'anim:c5_handbell_float', x: 20, y: 23, animation: 'c5_handbell_float', speed: 0.4 },
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 19, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 21, y: 19, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'time', of: 0.94 },
    { do: 'stage', white: 1 },
    { do: 'stage', white: 0, seconds: 3 },
    { do: 'walk', who: 'ves', to: { x: 18, y: 20 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 21, y: 20 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 20, y: 20 } },
    { do: 'wait', seconds: 2 },
    { do: 'say', text: 'Quiet.\n\nNo wind. No rain. The sea lies down against the rocks and breathes, slow, like something asleep.' },
    { do: 'wait', seconds: 1.6 },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'say', text: 'Something is bobbing in the shallows by the forecourt, catching what light there is.' },
    { do: 'walk', who: 'bramble', to: { x: 20, y: 22 } },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'camera', who: 'bramble' },
    { do: 'wait', seconds: 1 },
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'leave', who: 'bell' },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.8 },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'say', text: 'Haddock\'s bell. The wave must have torn it off your belt.\n\nBramble holds it in both hands, so it can\'t ring. He doesn\'t give it back. Nobody asks him to.' },
    { do: 'take', item: 'haddocks_bell' },
    { do: 'wait', seconds: 1.4 },
    // The Bother, tied up where he left her.
    { do: 'camera' },
    { do: 'walk', who: 'ves', to: { x: 16, y: 21 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 21 } },
    { do: 'walk', who: 'ves', to: { x: 11, y: 22 } },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'walk', who: 'player', to: { x: 13, y: 21 } },
    { do: 'walk', who: 'player', to: { x: 12, y: 22 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', text: 'The Bother is still tied up at the landing, bumping the planks. Her oars are shipped. On the thwart, wrapped in an oilcloth, is a fat old ledger.' },
    { do: 'give', item: 'haddocks_ledger' },
    { do: 'say', text: 'Today\'s date, and one word.\n\nfound\n\nThe ink is hardly dry.' },
    { do: 'wait', seconds: 1.6 },
    { do: 'act', who: 'ves', act: 'sigh' },
    { do: 'wait', seconds: 2 },
    // Later. The water goes out of the tower as fast as it came in; at first light they climb back up.
    { do: 'stage', dim: 1, seconds: 2.5 },
    { do: 'wait', seconds: 2.6 },
    { do: 'time', of: 0.02 },
    { do: 'goto', room: 'lastlight_balcony', spawn: { x: 12, y: 5 } },
  ],
};

// --- 5. The tide held (lastlight_balcony) -----------------------------------------------------------
// Dawn on the balcony. The view is `low_tide_dawn` (src/overworld/seaVista.js); the camera looks down
// over the rail at the carved slip (12,17), then settles half way (12,10) for the rest. The far lantern
// is `tf_far_light` (tideFinale.js) out on the sand (7, 12.6), where it sits on the far sand with the camera half way.
export const THE_TIDE_HELD = {
  id: 'the_tide_held',
  room: 'lastlight_balcony',
  once: true,

  actors: [
    { id: 'lantern', look: 'anim:tf_far_light', x: 7, y: 12.6, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 11, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 13, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'time', of: 0.02 },
    { do: 'stage', dim: 1 },
    { do: 'stage', dim: 0, seconds: 3.5 },
    { do: 'walk', who: 'ves', to: { x: 10, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 14, y: 6 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 12, y: 6 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'wait', seconds: 2 },
    { do: 'say', text: 'Dawn.\n\nThe storm has gone as if it had never been. The sky is the colour of the inside of a shell.' },
    // Looking down over the rail.
    { do: 'textbox', top: true },
    { do: 'camera', to: { x: 12, y: 17 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'And the sea has gone out. Further than anyone has ever seen it go: past the reef, past the wrecks, out to a thin bright thread at the very edge of the world.' },
    { do: 'say', text: 'Far below the tower, a stone slip runs down onto the bare sand. Carved into the head of it, worn nearly smooth, is the prow of a small boat.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera', to: { x: 12, y: 10 } },
    { do: 'textbox', top: false },
    { do: 'appear', who: 'lantern' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Away to the north-east, low on the sky, there is a long smudge of smoke.' },
    { do: 'wait', seconds: 2 },
    { do: 'say', text: 'Bramble still has the bell. He hasn\'t put it down.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'ves', text: '{thoughtful}He\'d have said he was only minding it.' },
    { do: 'wait', seconds: 2.4 },
    // Far off, across the sand.
    // (tideFinale.js: it catches, then its small star of light twinkles, so it reads from this far off.)
    { do: 'animate', who: 'lantern', animation: 'tf_far_light', speed: 0.6, once: true },
    { do: 'wait', seconds: 2.2 },
    { do: 'animate', who: 'lantern', animation: 'tf_far_glow', speed: 0.35 },
    { do: 'wait', seconds: 1.8 },
    { do: 'stage', dim: 1, seconds: 3.5 },
    { do: 'wait', seconds: 3.7 },
    // The credits ("Found"), the card, and on in Saltcombe, in the harbour office.
    { do: 'end_chapter', chapter: 5, credits: { song: 'creditsTide', text: 'credits_tide.txt', ambience: 'credits_sea', sea: true }, card: 'chapter_end_tide.txt', room: 'saltcombe_harbour_office', spawn: { x: 6, y: 8 } },
  ],
};
