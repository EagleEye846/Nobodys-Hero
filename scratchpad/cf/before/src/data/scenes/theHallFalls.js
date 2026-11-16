// THE HALL FALLS, and BRAMBLE AND THE LOG: the end of Chapter 4, in
// belowtown_collapse (the hall seen from its doors end).
//
// The duel cracked the pillars that hold the hall up. Rock and crystal come
// down, light pours out of the cracked pillars, and the folk run for the great
// doorway: moles, frog kids, a glow-worm, a beetle, a toad, a shrew, the
// king's guards, and Tuck last of all, dragging the king's carved head (with
// its paper crown) out behind him: all that's left of the king.
// The hero and Ves hold the doorway for them. A pot lid has rolled out of the
// feast and lies by the doorway: the hero dives and rolls for it, springs up
// and holds it over his head, Zelda-style. The lintel breaks off both posts and
// comes down, and he takes its low end on the lid's knob (knees going, the
// lid wobbling, slipping, heaving it back up), Ves the high end on her open
// umbrella, which bends more and more. When it won't hold, the hero takes
// Bramble's whistle in his teeth (one hand is still holding the lid up) and blows: a long, silly whistle and a
// stream of notes floating up through the rock. "...He's three mountains
// away." A rumble. A whoop. The rock at the head of the hall bursts open and
// down the long hall, on a huge log, at full speed, comes Bramble, hatchet up
// (his song, `brambleRescue`, "REALLY Should've Minded the Camp", waits
// until after "...Meant to do that."). He hits a bump, flies off spinning, and lands flat on his face with a
// SQUISH (squashed flat, then popped back), just up the hall from the
// doorway. The log rolls on without him and comes for the doorway: the hero
// and Ves let go and dive out of its way (the lid slips off his hands and
// clangs flat on the floor), the lintel drops, and the log
// sails in under it with a THUNK, shoving it back up into its sockets and
// wedging there, high, as a new beam. The stone settles onto it, creaks...
// and holds. Dust settles. A long silence. "...Meant to do that." He lifts his
// head out of a face-shaped dent in the dirt, sits up, and takes all the
// credit. Then the three of you walk out under the log, on to the long rope
// (the_long_rope, in belowtown_long_rope), and that's how the chapter ends.
//
// `the_hall_falls` is the whole thing. `bramble_and_the_log` is just the
// second half (from the whistle's echo on), to try out on its own: it sets
// up the held doorway first.
//
// Everything that moves is a scene actor (the pictures are in
// src/data/art/finaleScenes.js); the falling rock, the shafts of light and the
// whistle's notes are `stage` effects (src/overworld/stageShow.js). The
// room has no props, so there's nothing for the scene to put back.
//
// The arch is drawn standing on y 21.9 and reaches four tiles up, so anything
// just north of it is hidden behind it: Bramble lands at y 17.5, in plain
// view. While the hero holds the lintel it's drawn in HIS frames
// (finale_hero_brace_in / strain / slip / whistle: all drawn with the pot lid
// over his head, the lintel resting on its knob), so it sinks and heaves
// with him; the arch shows the gap where it was. The lid on the floor is the
// `lid` actor (finale_pot_lid, then finale_pot_lid_fall when he lets go).

// Where the hero and Ves hold the doorway (the great doorway: x 11 to 15).
// (Their holding frames are drawn for exactly these spots: finaleScenes.js.)
const HERO_AT = { x: 11, y: 22 };
// The pot lid lies in the doorway where he lands; he dives for it from up the hall.
const LID_AT = { x: 11, y: 22 };
const LEAP_FROM = { x: 8.6, y: 21.2 };
const VES_AT = { x: 15, y: 22 };
// Where Bramble comes down, and where they dive to out of the log's way.
// (Clear of the wall over the doorway, so it never hides him.)
const SPLAT_AT = { x: 13, y: 16.8 };
const HERO_DIVE = { x: 11, y: 24.4 };
const VES_DIVE = { x: 15, y: 24.4 };
// The doorway's arch is centred on x 13: its feet are a touch above the folk's,
// so everyone draws in front of it.
const ARCH_AT = { x: 13, y: 21.9 };

// The folk who run out: [actor id, picture, from x, from y, out through x, wave].
// (They run in a straight line for a spot just below the doorway, and the
// lines cross the doorway between the hero and Ves.)
const FOLK = [
  ['m1', 'bf_mole_miner_a', 9, 12, 14, 1],
  ['m2', 'bf_mole_miner_b', 17, 12, 12, 1],
  ['f1', 'bf_frog_kid_a', 11, 10, 14, 1],
  ['f2', 'bf_frog_kid_b', 15, 10, 13, 1],
  ['g1', 'bf_glowworm', 10, 14, 14, 1],
  ['p1', 'bf_beetle_postman', 17, 14, 12, 1],
  ['t1', 'bf_toad_innkeeper', 10, 15, 14, 2],
  ['s1', 'bf_shrew_stallkeeper', 15, 16, 12, 2],
  ['n1', 'bf_newt_guard', 11, 17, 14, 2],
  ['n2', 'bf_newt_guard', 14, 17, 13, 2],
];
const RUN = 80;

// Six pillars, three down each side, cracking.
const PILLARS = [
  { id: 'pc0', x: 4, y: 9 }, { id: 'pc1', x: 22, y: 9 },
  { id: 'pc2', x: 4, y: 14 }, { id: 'pc3', x: 22, y: 14 },
  { id: 'pc4', x: 4, y: 19 }, { id: 'pc5', x: 22, y: 19 },
];
const SHAFTS = PILLARS.map((p) => ({ at: { x: p.x, y: p.y }, w: 1.3, color: '255, 232, 150' }));

const actors = () => [
  { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 20, portrait: 'vesper', plays: 'vesper' },
  // The pot lid, rolled out of the feast and lying in the doorway.
  { id: 'lid', look: 'anim:finale_pot_lid', x: LID_AT.x, y: LID_AT.y + 0.06 },
  { id: 'tuck', look: 'prop:bf_tuck', x: 13, y: 13, portrait: 'tuck' },
  { id: 'king', look: 'prop:bf_rumbold_head', x: 13, y: 12.125, portrait: 'rumbold' },
  ...FOLK.map(([id, sprite, x, y]) => ({ id, look: `prop:${sprite}`, x, y })),
  // Bramble's face and name for his lines; and, at the end, him on his feet
  // again, walking out with you.
  { id: 'bramble', look: 'prop:bramble_stand', x: 13, y: -6, portrait: 'bramble', hidden: true },
  // Things that crack, fall, ride and splat.
  { id: 'arch', look: 'anim:finale_arch', x: ARCH_AT.x, y: ARCH_AT.y },
  // The hall's wall going on over the doorway, standing on the arch's top.
  { id: 'archWall', look: 'anim:finale_arch_wall', x: ARCH_AT.x, y: ARCH_AT.y - 4 },
  ...PILLARS.map((p) => ({ id: p.id, look: 'anim:finale_pillar_crack', x: p.x, y: p.y + 0.06, hidden: true })),
  { id: 'tunnel', look: 'anim:finale_tunnel', x: 13, y: 2, flat: true, hidden: true },
  // The bricks Bramble knocks out of it, over the floor below the hole.
  { id: 'bricks', look: 'anim:finale_bricks', x: 13, y: 8, flat: true, hidden: true },
  { id: 'bump', look: 'anim:finale_bump', x: 13, y: 15.9, flat: true },
  // (Its own look is the bare log: a toss that settles stops its animation,
  // and it mustn't fall back to Bramble still riding it.)
  { id: 'log', look: 'anim:finale_log_roll', x: 13, y: -6, hidden: true },
  { id: 'fly', look: 'anim:finale_bramble_fly', x: 13, y: -6, hidden: true },
  { id: 'splat', look: 'anim:finale_bramble_splat', x: SPLAT_AT.x, y: SPLAT_AT.y, hidden: true },
  { id: 'puff', look: 'anim:finale_puff', x: SPLAT_AT.x, y: SPLAT_AT.y, hidden: true },
  { id: 'puffL', look: 'anim:finale_puff', x: 11, y: 21.2, hidden: true },
  { id: 'puffR', look: 'anim:finale_puff', x: 15, y: 21.2, hidden: true },
  { id: 'print', look: 'anim:finale_face_print', x: SPLAT_AT.x, y: SPLAT_AT.y - 1.1, hidden: true, flat: true },
];

// A folk member runs for the door, and the scene goes straight on.
const run = (id, pace = RUN) => {
  const [, , , , outX] = FOLK.find((f) => f[0] === id);
  return { do: 'walk', who: id, to: { x: outX, y: 28 }, pace, wait: false };
};
// Everyone in one wave, a beat apart.
const runWave = (wave) => FOLK.filter((f) => f[5] === wave).flatMap(([id], i) => [
  run(id, RUN + (i % 3) * 8),
  { do: 'wait', seconds: 0.22 },
]);

// Pillars cracking and the light coming through: `speed` is seconds a frame.
const crackAll = (speed) => PILLARS.flatMap((p, i) => [
  { do: 'appear', who: p.id, instant: true },
  { do: 'animate', who: p.id, animation: 'finale_pillar_crack', speed: speed + (i % 3) * 0.05, once: true },
  { do: 'wait', seconds: 0.12 },
]);

// =========================================================================
// First half: the hall comes down, and the folk get out.
// =========================================================================
const FIRST_HALF = [
  { do: 'music', song: null },
  // The folk shouting as they run, the rock grinding (AMBIENCES in src/audio/music.js).
  { do: 'ambience', name: 'hall_falling' },
  { do: 'stage', dim: 0.1, seconds: 1, rubble: 80, rubbleAmount: 0.6, shafts: SHAFTS, haze: 0.35 },
  { do: 'face', who: 'player', dir: 'up' },
  { do: 'face', who: 'ves', dir: 'up' },
  { do: 'sound', name: 'creak' },
  { do: 'quake', amount: 2, seconds: 2.5 },
  ...crackAll(0.3),
  { do: 'wait', seconds: 0.6 },
  { do: 'sound', name: 'crumble' },
  { do: 'quake', amount: 3, seconds: 3 },
  { do: 'stage', dim: 0.2, seconds: 1, rubbleAmount: 0.85, haze: 0.7 },
  ...FOLK.slice(0, 5).map(([id]) => ({ do: 'act', who: id, act: 'startle', wait: false })),
  { do: 'act', who: 'tuck', act: 'startle' },
  { do: 'say', who: 'tuck', text: '{scared}Everybody OUT! Out out out!', shake: true },

  // The first folk run; the hero and Ves go to hold the doorway. (The doorway
  // is at the foot of the room, where the camera can't go lower, so the
  // words go up top while you're holding it.)
  { do: 'textbox', top: true },
  { do: 'walk', who: 'ves', to: VES_AT, fast: true, wait: false },
  ...runWave(1),
  // The hero spots the pot lid rattling on the floor of the doorway, dives
  // and rolls for it, springs up and holds it over his head.
  { do: 'walk', who: 'player', to: LEAP_FROM, fast: true },
  { do: 'face', who: 'player', dir: 'right' },
  { do: 'animate', who: 'lid', animation: 'finale_pot_lid', speed: 0.22 },
  { do: 'wait', seconds: 0.3 },
  { do: 'sound', name: 'whoosh' },
  { do: 'animate', who: 'player', animation: 'finale_hero_roll', speed: 0.08, once: true },
  { do: 'toss', who: 'player', to: HERO_AT, height: 9, airtime: 0.4, bounces: 0, wait: false },
  { do: 'wait', seconds: 0.45 },
  // Got it: the lid is in his hands and going up.
  { do: 'leave', who: 'lid', instant: true },
  { do: 'sound', name: 'thud' },
  { do: 'wait', seconds: 0.3 },
  { do: 'face', who: 'ves', dir: 'down' },

  // The lintel breaks off both posts and comes down: the hero takes the low
  // end on the lid, Ves the high end on her umbrella. (The arch's own lintel
  // is gone by the time the hero's frames drop it: a0 and a1 sit under b0.)
  { do: 'sound', name: 'crumble' },
  { do: 'animate', who: 'ves', animation: 'finale_ves_hold', speed: 999, once: true },
  { do: 'animate', who: 'arch', animation: 'finale_arch', speed: 0.13, once: true },
  { do: 'animate', who: 'archWall', animation: 'finale_arch_wall_crack', speed: 0.2, once: true },
  { do: 'animate', who: 'player', animation: 'finale_hero_brace_in', speed: 0.26, once: true },
  { do: 'wait', seconds: 0.52 },
  { do: 'sound', name: 'thud' },
  { do: 'quake', amount: 4, seconds: 0.6 },
  { do: 'wait', seconds: 0.9 },
  { do: 'animate', who: 'player', animation: 'finale_hero_strain', speed: 0.12 },
  { do: 'say', who: 'ves', text: '{determined}Go! GO!' },
  ...runWave(2),
  { do: 'wait', seconds: 0.4 },

  // Tuck, last, dragging the king's head (and its paper crown) behind him.
  // (The head is the one who's carried along: Tuck stays pinned to its front, so he's drawn in front of it.)
  { do: 'hold', who: 'king', what: 'tuck', offset: { x: 0, y: 7 } },
  { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_down', speed: 0.18 },
  { do: 'walk', who: 'king', to: { x: 13, y: 31.125 }, pace: 54, keep: true, wait: false },
  { do: 'sound', name: 'crumble' },
  { do: 'quake', amount: 2, seconds: 5 },
  { do: 'wait', seconds: 3 },
  { do: 'stage', rubbleAmount: 1.2, haze: 1, seconds: 2 },
  { do: 'wait', seconds: 1.6 },

  // Everyone's out. Now it's just the two of you and the weight.
  { do: 'ambience', name: 'hall_straining' },
  { do: 'camera', who: 'player' },
  { do: 'say', text: 'The stone grinds down onto the lid. The lid dents. It is very, very heavy.' },
  { do: 'sound', name: 'creak' },
  { do: 'quake', amount: 2, seconds: 1.4 },
  { do: 'animate', who: 'player', animation: 'finale_hero_slip', speed: 0.24, once: true },
  { do: 'wait', seconds: 1.5 },
  { do: 'animate', who: 'player', animation: 'finale_hero_strain', speed: 0.12 },
  { do: 'say', who: 'ves', text: '{determined}Don\'t you dare drop that. I\'ve only got the one umbrella.' },
  { do: 'animate', who: 'arch', animation: 'finale_arch_fail', speed: 0.9, once: true },
  { do: 'stage', rubbleAmount: 1.3, seconds: 1.5 },
  { do: 'wait', seconds: 2 },

  // It isn't holding.
  { do: 'sound', name: 'creak' },
  { do: 'quake', amount: 3, seconds: 5 },
  { do: 'animate', who: 'ves', animation: 'finale_ves_hold', speed: 0.8, once: true },
  { do: 'say', who: 'ves', text: '{worried}...It\'s not going to hold.' },
  { do: 'animate', who: 'player', animation: 'finale_hero_slip', speed: 0.2, once: true },
  { do: 'say', text: 'It isn\'t holding. Light and grit come pouring down where the lintel was.\n\nYour knees are going. The lid is shivering in your hands. Ves\'s umbrella is bending like a reed.' },
  { do: 'animate', who: 'player', animation: 'finale_hero_strain', speed: 0.1 },
  { do: 'wait', seconds: 0.6 },
];

// =========================================================================
// Second half: the whistle, and Bramble.
// =========================================================================
const SECOND_HALF = [
  { do: 'textbox', top: true },
  // One hand is holding the lid up, so the whistle goes in the other.
  { do: 'say', text: 'One hand is on the lid and it can\'t leave. You take Bramble\'s whistle in the other, and blow.' },
  { do: 'animate', who: 'player', animation: 'finale_hero_whistle', speed: 0.14 },
  { do: 'sound', name: 'whistle' },
  { do: 'stage', notes: { at: { x: 11, y: 20 }, seconds: 2.6 } },
  { do: 'wait', seconds: 4 },
  { do: 'say', who: 'ves', text: '{bored}...He\'s three mountains away.' },
  { do: 'animate', who: 'player', animation: 'finale_hero_strain', speed: 0.12 },
  { do: 'wait', seconds: 2 },

  // A rumble. A whoop.
  { do: 'sound', name: 'boom' },
  { do: 'quake', amount: 1, seconds: 3 },
  { do: 'say', text: 'Then, very faintly, from somewhere far up the hall and getting closer: a rumble. And a whoop.' },
  { do: 'camera', to: { x: 13, y: 5 } },
  // Up the hall now: the words can go back down.
  { do: 'textbox', top: false },
  { do: 'appear', who: 'tunnel', instant: true },
  { do: 'animate', who: 'tunnel', animation: 'finale_tunnel', speed: 0.2, once: true },
  { do: 'sound', name: 'crumble' },
  { do: 'wait', seconds: 0.4 },
  // It bursts: bricks everywhere.
  { do: 'appear', who: 'bricks', instant: true },
  { do: 'animate', who: 'bricks', animation: 'finale_bricks', speed: 0.08, once: true },
  { do: 'sound', name: 'boom' },
  { do: 'sound', name: 'crumble' },
  { do: 'quake', amount: 4, seconds: 1.5 },
  { do: 'stage', rubbleAmount: 1.6, flicker: 1.4, haze: 1.3 },
  { do: 'wait', seconds: 0.8 },
  { do: 'say', who: 'bramble', text: '{shout}HOLD ON, SWORD! I\'M COMIIIIING!', shake: true },

  // Down the hall on a huge log, hair flying, hatchet up.
  { do: 'appear', who: 'log', at: { x: 13, y: 1.6 }, instant: true },
  { do: 'animate', who: 'log', animation: 'finale_log_ride', speed: 0.06 },
  { do: 'camera', who: 'log' },
  // Down to the doorway with him: the words go back up top.
  { do: 'textbox', top: true },
  { do: 'sound', name: 'whoosh' },
  { do: 'walk', who: 'log', to: { x: 13, y: 15 }, pace: 170, keep: true },

  // The bump: the log leaps, and he goes flying. (No music yet: his song
  // starts after he's said he meant to do that.)
  { do: 'animate', who: 'bump', animation: 'finale_bump', speed: 0.12, once: true },
  { do: 'sound', name: 'thud' },
  { do: 'quake', amount: 2, seconds: 0.3 },
  { do: 'animate', who: 'log', animation: 'finale_log_roll', speed: 0.06 },
  { do: 'appear', who: 'fly', at: { x: 13, y: 15 }, instant: true },
  { do: 'animate', who: 'fly', animation: 'finale_bramble_fly', speed: 0.07 },
  { do: 'toss', who: 'fly', to: SPLAT_AT, height: 96, airtime: 1.86, bounces: 0, wait: false },
  // The log, meanwhile, rolls on without him, bouncing.
  { do: 'toss', who: 'log', to: { x: 13, y: 15.5 }, height: 16, airtime: 0.8, bounces: 2, wait: false },
  { do: 'wait', seconds: 1.84 },

  // SQUISH: flat on his face, squashed flat and popping back. BONK.
  { do: 'leave', who: 'fly', instant: true },
  { do: 'appear', who: 'splat', at: SPLAT_AT, instant: true },
  { do: 'animate', who: 'splat', animation: 'finale_bramble_splat', speed: 0.09, once: true },
  { do: 'sound', name: 'squish' },
  { do: 'appear', who: 'puff', instant: true },
  { do: 'animate', who: 'puff', animation: 'finale_puff', speed: 0.1, once: true },
  { do: 'stage', burst: { at: SPLAT_AT, power: 1.3 } },
  { do: 'quake', amount: 2, seconds: 0.3 },

  // And the log comes on, straight for the doorway. Let go! Jump!
  { do: 'act', who: 'ves', act: 'startle', wait: false },
  { do: 'say', who: 'ves', text: '{surprised}LOG!', shake: true },
  { do: 'animate', who: 'player', animation: 'finale_hero_dive', speed: 0.12, once: true },
  { do: 'animate', who: 'ves', animation: 'finale_ves_dive', speed: 0.12, once: true },
  // The lid slips off over his head as he lets go: it clangs and rocks flat.
  { do: 'appear', who: 'lid', at: { x: HERO_AT.x, y: HERO_AT.y + 0.06 }, instant: true },
  { do: 'animate', who: 'lid', animation: 'finale_pot_lid_fall', speed: 0.1, once: true },
  { do: 'animate', who: 'arch', animation: 'finale_arch_drop', speed: 0.3, once: true },
  { do: 'sound', name: 'whoosh' },
  { do: 'toss', who: 'player', to: HERO_DIVE, height: 10, airtime: 0.4, bounces: 0, wait: false },
  { do: 'toss', who: 'ves', to: VES_DIVE, height: 10, airtime: 0.4, bounces: 0, wait: false, keep: true },
  // It sails on over Bramble's head as the lintel drops...
  { do: 'toss', who: 'log', to: { x: 13, y: 20.2 }, height: 44, airtime: 0.92, bounces: 0 },

  // ...and in under it: THUNK. It shoves the stone back up into its sockets
  // and wedges there, high across the doorway.
  { do: 'leave', who: 'log', instant: true },
  { do: 'animate', who: 'arch', animation: 'finale_arch_jam', speed: 0.75, once: true },
  { do: 'animate', who: 'archWall', animation: 'finale_arch_wall_settled', speed: 0.5, once: true },
  { do: 'sound', name: 'thunk' },
  { do: 'stage', burst: { at: { x: 13, y: 20.6 }, power: 2 } },
  { do: 'quake', amount: 5, seconds: 0.6 },
  { do: 'appear', who: 'puffL', instant: true },
  { do: 'appear', who: 'puffR', instant: true },
  { do: 'animate', who: 'puffL', animation: 'finale_puff', speed: 0.14, once: true },
  { do: 'animate', who: 'puffR', animation: 'finale_puff', speed: 0.14, once: true },
  // The stone settles onto it. It creaks... and holds.
  { do: 'wait', seconds: 0.8 },
  { do: 'sound', name: 'creak' },
  { do: 'quake', amount: 1, seconds: 1.2 },
  { do: 'wait', seconds: 1.4 },
  { do: 'stage', rubble: 0, shafts: [], dim: 0, haze: 0, seconds: 2.5 },
  { do: 'say', text: 'The stone comes down onto the log with a long, deep creak. The log bows. Grit trickles.\n\nIt holds.' },
  // Up off the floor.
  { do: 'leave', who: 'puffL', instant: true },
  { do: 'leave', who: 'puffR', instant: true },
  { do: 'animate', who: 'player' },
  { do: 'face', who: 'player', dir: 'up' },
  { do: 'animate', who: 'ves', animation: 'finale_ves_bent', speed: 0.9 },
  // Dust settles. A long silence.
  { do: 'ambience', name: 'hall_settled' },
  { do: 'wait', seconds: 1.4 },
  { do: 'leave', who: 'puff', instant: true },
  { do: 'say', who: 'bramble', text: '{proud}...Meant to do that.' },
  // NOW his song: "REALLY Should've Minded the Camp".
  { do: 'music', song: 'brambleRescue' },

  // His head comes up out of the dirt, and there's his face in it.
  { do: 'wait', seconds: 0.6 },
  { do: 'appear', who: 'print', instant: true },
  { do: 'animate', who: 'print', animation: 'finale_face_print', speed: 1.4 },
  { do: 'animate', who: 'splat', animation: 'finale_bramble_up', speed: 0.55, once: true },
  { do: 'sound', name: 'select' },
  { do: 'wait', seconds: 1.6 },
  // (He never went home: he's been sneaking along behind you since Lasthome.)
  { do: 'say', who: 'ves', text: '{thoughtful}Best ears in the camp. Three mountains away. And that took about ten seconds.' },
  { do: 'say', who: 'bramble', text: '{sheepish}...I might not have gone home.\n\n{proud}I\'ve been right behind you the WHOLE time. Sneaking. I\'m brilliant at sneaking.' },
  { do: 'say', who: 'ves', text: '{bored}The bush I threw my crutch into.' },
  { do: 'say', who: 'bramble', text: '{sheepish}...That was a different bush.' },
  { do: 'say', who: 'ves', text: '{laughing}Bramble. You absolute...\n\n{smile}Thanks.' },
  { do: 'animate', who: 'splat', animation: 'finale_bramble_thumbs', speed: 0.3 },
  { do: 'say', who: 'bramble', text: '{proud}Somebody had to.' },
  { do: 'wait', seconds: 1.6 },

  // On his feet, and out under the log, all three of you: it's a doorway again.
  { do: 'leave', who: 'splat', instant: true },
  { do: 'appear', who: 'bramble', at: SPLAT_AT, instant: true },
  { do: 'face', who: 'bramble', dir: 'down' },
  { do: 'animate', who: 'ves' },
  { do: 'say', who: 'ves', text: '{bored}Out. Before that log has second thoughts.' },
  { do: 'walk', who: 'bramble', to: { x: 13, y: 25 }, wait: false },
  { do: 'walk', who: 'ves', to: { x: 14, y: 25 }, wait: false },
  { do: 'walk', who: 'player', to: { x: 12, y: 25 } },
  { do: 'wait', seconds: 0.6 },
  // He's with you again; Tuck takes you the quiet way round to the long rope
  // (the chapter ends up top): out into the square first, then the secret way.
  { do: 'join', who: 'bramble' },
  { do: 'goto', room: 'belowtown_square', spawn: { x: 20, y: 19 } },
];

// The second half on its own: the doorway already held, the light and grit
// already coming down.
const HELD_ALREADY = [
  { do: 'music', song: null },
  { do: 'stage', dim: 0.25, rubble: 80, rubbleAmount: 1.3, shafts: SHAFTS, haze: 1 },
  // (Ves's walk finishes first: a walk still going stops any animation.)
  { do: 'walk', who: 'player', to: HERO_AT, fast: true, wait: false },
  { do: 'walk', who: 'ves', to: VES_AT, fast: true },
  { do: 'wait', seconds: 0.4 },
  { do: 'face', who: 'player', dir: 'down' },
  { do: 'face', who: 'ves', dir: 'down' },
  ...PILLARS.flatMap((p) => [
    { do: 'appear', who: p.id, instant: true },
    { do: 'animate', who: p.id, animation: 'finale_pillar_crack', speed: 0.001, once: true },
  ]),
  { do: 'animate', who: 'player', animation: 'finale_hero_strain', speed: 0.12 },
  { do: 'leave', who: 'lid', instant: true },
  { do: 'animate', who: 'ves', animation: 'finale_ves_hold', speed: 0.001, once: true },
  { do: 'animate', who: 'arch', animation: 'finale_arch_fail', speed: 0.001, once: true },
  { do: 'animate', who: 'archWall', animation: 'finale_arch_wall_crack', speed: 0.001, once: true },
  { do: 'quake', amount: 3, seconds: 6 },
  { do: 'wait', seconds: 0.8 },
];

export const THE_HALL_FALLS = {
  // Triggers in rooms name the scene by this id.
  id: 'the_hall_falls',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_collapse',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,
  actors: actors(),
  steps: [...FIRST_HALF, ...SECOND_HALF],
};

export const BRAMBLE_AND_THE_LOG = {
  id: 'bramble_and_the_log',
  room: 'belowtown_collapse',
  once: true,
  actors: actors().map((a) => (FOLK.some((f) => f[0] === a.id) || a.id === 'tuck' || a.id === 'king' ? { ...a, hidden: true } : a)),
  steps: [...HELD_ALREADY, ...SECOND_HALF],
};
