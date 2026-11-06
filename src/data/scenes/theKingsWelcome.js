// THE KING'S WELCOME: King Peptup's show. Tuck sets the two of you on the
// carpet and slips away behind the curtain. The lights go down, a frog beats
// a roll on his own belly, spotlights sweep the hall and land on the curtain,
// which opens on the king in a blast of fanfare and confetti. His head sways
// as he talks and his mouth never moves; the folk cheer
// in waves, a beetle holds up a sign that says CHEER, and he tells the hall
// its favourite story: how he came down the stair WITH the Hero, shoulder to
// shoulder, lost them in the dark, wandered lost for years till a brave
// little page found him, and was crowned by the folk (look at him: tall,
// HUMAN, the Hero's own friend). Tuck made all that up; it's the story that
// lets a puppet be king. Then the Sunstone
// overhead gutters and the whole hall goes quiet. He recovers ("A small
// flicker. Nothing to worry about."), and sends you on a quest: down through
// the Diggings, over the Stillwater, to the bottom of the Deep.
//
// The effects (spotlights, curtains, confetti, the flicker) are `stage`
// steps: see src/overworld/stageShow.js. The audience, guards, the king and
// the Sunstone are the room's own props, cast as actors and put back (every
// audience member's animation is stopped at the end, so none keep cheering).
//
// King Peptup may be voice-acted, the only character who is: each of his
// lines has a `// voice: rumbold_welcome_<n>` comment above it.

// The audience: [actor id, the room's cast name or npc id, picture, how fast they cheer].
const AUDIENCE = [
  ['a2', 'a2', 'bf_mole_crowd_b', 0.3],
  ['a1', 'a1', 'bf_mole_crowd', 0.34],
  ['a4', 'a4', 'bf_mole_crowd_c', 0.28],
  ['a7', 'a7', 'bf_mole_crowd_d', 0.36],
  ['a5', 'a5', 'bf_mole_miner_a', 0.4],
  ['a8', 'a8', 'bf_glowworm', 0.4],
  ['a9', 'a9', 'bf_mole_crowd', 0.32],
  ['kid', 'bt_throne_kid', 'bf_frog_kid_a', 0.4],
  ['snail', 'bt_throne_snail', 'bf_snail_elder', 0.5],
  ['b1', 'b1', 'bf_mole_crowd_d', 0.3],
  ['b3', 'b3', 'bf_mole_crowd_b', 0.35],
  ['b5', 'b5', 'bf_mole_crowd', 0.27],
  ['b6', 'b6', 'bf_mole_crowd_c', 0.33],
  ['b7', 'b7', 'bf_toad_innkeeper', 0.5],
  ['b8', 'b8', 'bf_mole_crowd_b', 0.31],
  ['b9', 'b9', 'bf_beetle_postman', 0.5],
  ['kid2', 'bt_throne_kid2', 'bf_frog_kid_b', 0.4],
  ['miner', 'bt_throne_miner', 'bf_mole_miner_b', 0.4],
];
const POSITIONS = {
  a1: [6, 10], a2: [8, 10], kid: [10, 10], a4: [5, 12], a5: [7, 12], snail: [9, 12], a7: [6, 14], a8: [8, 14], a9: [10, 14],
  b1: [15, 10], kid2: [17, 10], b3: [19, 10], miner: [16, 12], b5: [18, 12], b6: [20, 12], b7: [15, 14], b8: [17, 14], b9: [19, 14],
};

// The whole hall cheers, one after another from the left, and keeps cheering.
const wave = (gap = 0.1) => AUDIENCE.flatMap(([id, , sprite, speed]) => [
  { do: 'animate', who: id, animation: sprite, speed },
  { do: 'wait', seconds: gap },
]);
// Everyone goes quiet at once.
const hush = () => AUDIENCE.map(([id]) => ({ do: 'animate', who: id }));

// Three spotlights roaming the audience.
const ROAMING = [
  { at: { x: 8, y: 11 }, color: '255, 240, 180', radius: 38, sweep: { rx: 5, ry: 2.5, period: 5, phase: 0 } },
  { at: { x: 17, y: 12 }, color: '255, 170, 200', radius: 34, sweep: { rx: 5, ry: 2, period: 6.3, phase: 2 } },
  { at: { x: 12, y: 14 }, color: '160, 210, 255', radius: 34, sweep: { rx: 4, ry: 3, period: 4.4, phase: 4 } },
];
// And all on the king.
const ON_THE_KING = [
  { onto: 'king', color: '255, 240, 180', radius: 46 },
  { onto: 'king', color: '255, 190, 210', radius: 34, from: { x: 5, y: -2 } },
  { onto: 'king', color: '170, 215, 255', radius: 34, from: { x: 20, y: -2 } },
];

export const THE_KINGS_WELCOME = {
  // Triggers in rooms name the scene by this id.
  id: 'the_kings_welcome',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_throne',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 18, portrait: 'vesper', plays: 'vesper' },
    { id: 'tuck', look: 'prop:bf_tuck', x: 13, y: 19, portrait: 'tuck', hidden: true },
    { id: 'king', look: 'prop:bf_rumbold', x: 11, y: 7, portrait: 'rumbold', plays: 'rumbold' },
    { id: 'sun', look: 'prop:sunstone', x: 12, y: 4, plays: 'sunstone', animation: 'sunstone_dim_pulse', speed: 1.1 },
    ...AUDIENCE.map(([id, who, sprite]) => ({ id, look: `prop:${sprite}`, x: POSITIONS[id][0], y: POSITIONS[id][1], plays: who })),
    // The stage hands for the show: a frog with a drum for a belly, a beetle with a sign.
    { id: 'drum', look: 'prop:bf_drummer', x: 10, y: 15, hidden: true },
    { id: 'sign', look: 'prop:bf_cheer_beetle', x: 15, y: 15, hidden: true },
  ],

  steps: [
    // The curtains are drawn across the dais, and the hall is quiet.
    { do: 'stage', curtains: { x: 8, y: 0, w: 10, h: 8, open: 0 } },
    { do: 'music' },
    // The king (3 tiles wide) and the old snail (2) are cast from their left
    // tile, so they're set on the middle of their footprint: half a tile on.
    { do: 'appear', who: 'king', at: { x: 12, y: 7 } },
    { do: 'appear', who: 'snail', at: { x: 9.5, y: 12 } },
    { do: 'walk', who: 'player', to: { x: 12, y: 14 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 14 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    // (Held low while Tuck talks, so the text box doesn't sit on the two of you.)
    { do: 'camera', to: { x: 13, y: 12 } },
    { do: 'appear', who: 'tuck', at: { x: 13, y: 19 } },
    // (Up the right side of the carpet, so he doesn't walk through the two of you.)
    { do: 'walk', who: 'tuck', to: { x: 14, y: 15 } },
    { do: 'walk', who: 'tuck', to: { x: 14, y: 13 } },
    { do: 'walk', who: 'tuck', to: { x: 13, y: 13 } },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'say', who: 'tuck', text: '{shy}Um. Here. Here is good. On the carpet, please. His Majesty likes people to stand on the carpet.' },
    { do: 'say', who: 'tuck', text: '{worried}And whatever happens... it\'s mostly noise. It\'s a lot of noise. Sorry.' },
    { do: 'say', who: 'ves', text: '{bored}Does it come with a warning, or is that the warning?' },
    { do: 'say', who: 'tuck', text: '{scared}...That was the warning.' },
    // Tuck goes up the aisle, round the dais and in at the edge of the curtain.
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_left', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 11, y: 13 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_up', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 11, y: 9 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_left', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 10, y: 8 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_up', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 10, y: 7 }, keep: true },
    { do: 'animate', who: 'tuck' },
    { do: 'leave', who: 'tuck' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Tuck slips in at the edge of the curtain, and is gone.' },
    // You step up the carpet, clear of the text box.
    { do: 'walk', who: 'player', to: { x: 12, y: 12 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 12 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },

    // The lights go down. A drum roll.
    { do: 'stage', dim: 0.55, seconds: 1.2 },
    { do: 'appear', who: 'drum' },
    { do: 'appear', who: 'sign' },
    { do: 'wait', seconds: 1.2 },
    { do: 'animate', who: 'drum', animation: 'bf_drummer', speed: 0.12 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.42 },
    { do: 'stage', spots: ROAMING },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.34 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.28 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.22 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.18 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.14 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.12 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.1 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 0.1 },
    // The spotlights gather on the curtain.
    { do: 'stage', spots: [
      { at: { x: 13, y: 8 }, color: '255, 240, 180', radius: 44 },
      { at: { x: 11, y: 8 }, color: '255, 190, 210', radius: 36, from: { x: 5, y: -2 } },
      { at: { x: 15, y: 8 }, color: '170, 215, 255', radius: 36, from: { x: 20, y: -2 } },
    ] },
    { do: 'sound', name: 'boom' },
    { do: 'wait', seconds: 0.9 },
    { do: 'animate', who: 'drum' },

    // The curtains open on the king, to a fanfare.
    { do: 'camera', to: { x: 13, y: 10.5 } },
    { do: 'music', song: 'peptup' },
    { do: 'stage', curtains: { x: 8, y: 0, w: 10, h: 8, open: 1, seconds: 1.8 }, confetti: 4 },
    { do: 'sound', name: 'levelUp' },
    { do: 'wait', seconds: 0.9 },
    { do: 'stage', spots: ON_THE_KING, dim: 0.28, seconds: 1 },
    { do: 'animate', who: 'sign', animation: 'bf_cheer_beetle', speed: 0.45 },
    ...wave(0.08),
    { do: 'wait', seconds: 0.8 },

    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    // voice: rumbold_welcome_1
    { do: 'say', who: 'king', text: '{shouting}WELCOME! Welcome, welcome, WELCOME, my friends!' },
    // voice: rumbold_welcome_2
    { do: 'say', who: 'king', text: '{laughing}Strangers from the TOP of the world! In MY hall! On a TUESDAY!' },
    // voice: rumbold_welcome_3
    { do: 'say', who: 'king', text: '{proud}Do you know who I am? Of course you do. Everybody does.\n\n{shouting}King PEPTUP! The RESPLENDENT!' },
    // He throws his arms wide for the roar, the one time he moves them.
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'stage', confetti: 2 },
    { do: 'sound', name: 'burst' },
    ...hush(),
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'At the front, the beetle holds his sign higher. It says CHEER. The hall obliges.' },
    ...wave(0.07),
    { do: 'wait', seconds: 0.9 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    // voice: rumbold_welcome_4
    { do: 'say', who: 'king', text: '{proud}And do you know who ELSE stood where you\'re standing? The HERO! My dear, dear, PERSONAL friend!' },
    { do: 'say', who: 'ves', text: '{surprised}You knew the Hero?' },
    // voice: rumbold_welcome_5
    { do: 'say', who: 'king', text: '{outraged}KNEW them? I came down the stair WITH them!\n\nShoulder to shoulder! Tall as me, the Hero was. Every inch!' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'sound', name: 'burst' },
    ...hush(),
    ...wave(0.05),
    { do: 'wait', seconds: 0.9 },

    // The legend, the folk's favourite story: how their king came to them.
    // The spotlights narrow; the cheering drops. (For a second play: he
    // never tells it the same way twice, and nobody saw him found but Tuck,
    // who is behind the curtain doing the voice, so can't answer.)
    { do: 'stage', spots: [{ onto: 'king', color: '255, 236, 190', radius: 40 }], dim: 0.5, seconds: 0.8 },
    ...hush(),
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    // voice: rumbold_welcome_6
    { do: 'say', who: 'king', text: '{sly}Long ago... the dark came up from the DEEP! And the Sunstone... went OUT!' },
    // voice: rumbold_welcome_7
    { do: 'say', who: 'king', text: '{shouting}So down the stair came the Hero, and ME beside them! Down and down and DOWN!' },
    // voice: rumbold_welcome_15
    { do: 'say', who: 'king', text: '{sly}And somewhere in the dark... we lost each other.' },
    // voice: rumbold_welcome_16
    { do: 'say', who: 'king', text: '{shouting}The Hero went on alone, all the way to the bottom... and LIT IT AGAIN!' },
    // voice: rumbold_welcome_8
    { do: 'say', who: 'king', text: '{proud}And then they went back up the stair... and never came back.' },
    { do: 'say', text: 'Near the front, a little mole is mouthing every word along with him.' },
    // voice: rumbold_welcome_17
    { do: 'say', who: 'king', text: '{sly}And poor Peptup? LOST! Wandering in the dark, for days! For YEARS!\n\nUntil a brave little page FOUND me. Didn\'t you, Tuck?' },
    { do: 'wait', seconds: 1 },
    // voice: rumbold_welcome_18
    { do: 'say', who: 'king', text: '{laughing}...Tuck\'s shy.' },
    { do: 'say', who: 'ves', text: '{bored}How long were you lost, exactly?' },
    // voice: rumbold_welcome_19
    { do: 'say', who: 'king', text: '{laughing}Who was COUNTING? It was DARK!' },
    { do: 'stage', spots: ON_THE_KING, dim: 0.28, seconds: 0.4 },
    // voice: rumbold_welcome_20
    { do: 'say', who: 'king', text: '{shouting}And the good folk of Belowtown put a CROWN on me!\n\nAnd why not? Look at me! TALL! HUMAN! The Hero\'s own FRIEND!' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'sound', name: 'burst' },
    ...wave(0.05),
    { do: 'say', text: '"HUMAN!" cheers the hall, very proudly.' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    // voice: rumbold_welcome_21
    { do: 'say', who: 'king', text: '{proud}And I\'ve looked after you ever since. Just as the Hero ASKED me to!' },
    { do: 'wait', seconds: 0.5 },
    { do: 'stage', spots: [{ onto: 'king', color: '255, 236, 190', radius: 40 }], dim: 0.5, seconds: 0.6 },
    ...hush(),
    // voice: rumbold_welcome_9
    { do: 'say', who: 'king', text: '{sly}And one day...' },
    { do: 'stage', spots: ON_THE_KING, dim: 0.28, seconds: 0.4 },
    // voice: rumbold_welcome_10
    { do: 'say', who: 'king', text: '{shouting}...they\'ll come BACK!' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'sound', name: 'burst' },
    ...wave(0.05),
    { do: 'say', text: '"COME BACK!" roars the whole hall.' },

    // And overhead, the Sunstone gutters.
    { do: 'music' },
    { do: 'stage', spots: [], flicker: 2.8 },
    { do: 'animate', who: 'sun', animation: 'sunstone_flicker', speed: 0.2 },
    { do: 'sound', name: 'creak' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold', speed: 0.6 },
    ...hush(),
    { do: 'quake', amount: 2, seconds: 0.8 },
    { do: 'wait', seconds: 1.4 },
    { do: 'sound', name: 'toll' },
    { do: 'wait', seconds: 1.8 },
    { do: 'say', text: 'The cheering falters. Then there is no sound in the hall at all.' },
    { do: 'animate', who: 'sun', animation: 'sunstone_dim_pulse', speed: 1.1 },
    { do: 'stage', dim: 0.3, seconds: 0.6 },
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    // voice: rumbold_welcome_11
    { do: 'say', who: 'king', text: '{sly}...Ahem. A small flicker. Nothing to worry about. Peptup has it in hand.' },
    { do: 'music', song: 'peptup' },
    { do: 'stage', spots: ON_THE_KING, dim: 0.2, seconds: 0.8, confetti: 1.5 },
    { do: 'animate', who: 'sign', animation: 'bf_cheer_beetle', speed: 0.45 },
    // voice: rumbold_welcome_12
    { do: 'say', who: 'king', text: '{shouting}Which is why... my new friends... Peptup has a QUEST for you!' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'sound', name: 'burst' },
    ...wave(0.05),
    { do: 'wait', seconds: 0.6 },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_talk', speed: 0.14 },
    // voice: rumbold_welcome_13
    { do: 'say', who: 'king', text: '{proud}Down through the Diggings! Over the Stillwater! To the very bottom of the Deep! Light the Sunstone from its root, as the Hero did!' },
    { do: 'say', who: 'ves', text: '{bored}And if we don\'t?' },
    // voice: rumbold_welcome_14
    { do: 'say', who: 'king', text: '{laughing}Then you won\'t! And that\'s fine! And it\'ll get very DARK!\n\nHa ha ha! Off you go!' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold_gesture', speed: 0.35, once: true },
    { do: 'stage', confetti: 3 },
    { do: 'sound', name: 'burst' },
    ...hush(),
    ...wave(0.04),
    { do: 'wait', seconds: 1.6 },

    // Curtain call: the lights come up, the hall settles, the stage hands go home.
    { do: 'stage', spots: [], dim: 0, seconds: 1.2 },
    ...hush(),
    { do: 'animate', who: 'sign' },
    { do: 'leave', who: 'drum' },
    { do: 'leave', who: 'sign' },
    { do: 'animate', who: 'king', animation: 'bf_rumbold', speed: 0.6 },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    // Ves turns to you to talk it over.
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{laughing}That was a great deal of confetti for one sentence.' },
    { do: 'say', who: 'ves', text: '{smile}Lost in the dark for years, and they made him king.\n\n{bored}I spent a week in a marsh and got a crutch.' },
    { do: 'say', who: 'ves', text: '{smile}"The bottom of the Deep." {determined}Well. It\'s a direction.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', text: 'At the back of the hall, a guard steps away from a little door. It goes down.' },
    { do: 'stage', curtains: null },
    { do: 'animate', who: 'sun', animation: 'sunstone_dim_pulse', speed: 1.1 },
    // And back to their left tile, so the props stand where they did.
    { do: 'appear', who: 'king', at: { x: 11, y: 7 } },
    { do: 'appear', who: 'snail', at: { x: 9, y: 12 } },
  ],
};
