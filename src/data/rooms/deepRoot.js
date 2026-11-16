// THE ROOT: the bottom of everything. A cliff of black rock goes straight
// up into the dark, and running up the middle of it, out of sight, is the
// root of the Sunstone: a vein of crystal as thick as a house, dark, cold,
// waiting for somebody to light it again. A great drop lies between you and it.
// This is the chapter's last puzzle, and it takes two of you, and everything
// the chapter taught: prisms, Ves's umbrella, an eye that burns only while it is
// lit, a gate, a bridge of light, and a rock in the way.
//
// What happens, in order:
//   1. West ledge. A sun-crystal (S1) throws its beam up the wall to a prism
//      (P0 at 2,19) that is set wrong. Turn it and the beam runs east along
//      row 19, right across the drop to the foot of the root: an eye there
//      (root_w, 16,19) wakes... but only while the light is on it. A rock (5,19)
//      is in the way of the beam: push it off the row (sideways).
//   2. The foot of the root lit isn't enough, and it doesn't build a bridge.
//      Down at 8,22 a prism is fixed to the floor, set to send light east along
//      row 22 over the drop to an eye on the far ledge. Light only reaches it
//      from above, down column 8, so Ves has to stand in the beam on row 19, at
//      8,19, with her umbrella down. (While she does, she holds the light off the
//      root: the base goes dark.) The eye (E1, 23,22) lights for good and lays
//      the bridge on row 22 and wakes a second sun-crystal (S2, 24,24).
//   3. Ves has to step out of the beam again (Q, walk her aside). The light goes
//      straight on over the drop and finds the foot of the root once more. It stays
//      lit as long as nobody stands in row 19: that holds the gate (24,21) open,
//      the gate across S2's beam on the far ledge. Across the bridge, go and move the rock (24,19) off column 24 (a
//      push sideways), and S2's beam climbs column 24 to the last prism (P3 at
//      24,17), which is set wrong. Turn it from 25,17 and the beam goes west
//      across the drop to the root itself (root_lit): the scene
//      the_light_goes_up plays, when you are both together again.
//   Stumps on both ledges roll the rocks home and put the prisms back as the room
//   set them (eyes that have lit stay lit).
//
// beam: S1 at 2,24 throws up column 2 to P0 at 2,19. Set '/' it sends the beam
//   right along row 19 to the eye root_w at 16,19 (the rock at 5,19 must be off
//   the row); Ves at 8,19 facing down sends it down column 8 to the fixed prism
//   at 8,22 ('\') and right along row 22, over the drop (12-21), to the eye at
//   23,22 (root_e1). S2 at 24,24 (awake once root_e1 is lit) throws up column 24
//   through the gate at 24,21 (open while root_w is lit) to P3 at 24,17; set '\'
//   it sends the beam left along row 17 over the drop to root_lit at 16-17,17.
//   Every eye latches except root_w. Once the root is lit, a pier of light
//   (18-21,17) walks you out to touch it, and the gate at 31,22 lets you on to
//   the way up.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face with faint veins
//   .  black stone floor   0  a drop into the dark (solid, a beam flies over)
//   ^  black stalagmite (solid)   O  glossy black boulder (solid)   J  smooth knob
import { R3C_PROPS } from '../r3cLife.js';

export const DEEP_ROOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_root',
  // The room's name, for the Room Editor.
  name: 'THE ROOT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "The Deep" (src/data/music/deepTheme.js).
  music: 'deep',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // How it rings (a huge space: ECHOES in src/audio/music.js).
  echo: 'cavern',
  // Dark: only your light and the beams show anything (0 to 1).
  dark: 0.94,
  // Glow-worms on Ves's umbrella: your light never drops below this here.
  glowworms: 38,

  tiles: [
    '##################################',
    '##################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#O..........0000000000........####',
    '#..........^0000000000........####',
    '#...........0000000000......^.####',
    '#.........O.0000000000........####',
    'W....J......0000000000....J...WWWW',
    '............0000000000............',
    '............0000000000.......^####',
    '#.........^.0000000000........####',
    '#^...^......0000000000.^...^..####',
    '##################################',
  ],

  // Where the player starts, in tile coordinates (just in from the Keeper's Fire).
  playerStart: { x: 1, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 22, w: 1, h: 2, to: 'deep_keepers_fire', spawn: { x: 38, y: 6 } },
    { x: 33, y: 22, w: 1, h: 1, to: 'deep_way_up', spawn: { x: 1, y: 41 } },
  ],

  // The bridge of light over the drop (once Ves has sent the beam to the first
  // eye), and the pier to the root (once it's lit).
  lightBridges: [
    { x: 12, y: 22, w: 10, h: 1, when: 'root_e1' },
    { x: 18, y: 17, w: 4, h: 1, when: 'root_lit' },
  ],

  // The scene plays the moment the root is lit, wherever you are standing
  // (once you're together again).
  cutscenes: [
    { x: 0, y: 0, w: 34, h: 27, scene: 'the_light_goes_up', when: 'root_lit' },
    // The root is lit but she's still on the far ledge: the scene waits until
    // you're together, so Ves says so, once (`rt_rejoin`).
    { x: 0, y: 0, w: 34, h: 27, nudge: 'rt_rejoin', when: 'root_lit' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The puzzle (west ledge: sun-crystal, two prisms; east ledge: an eye, a second
  // sun-crystal, the last prism), the root itself (an eye: lit by the last beam),
  // the dark vein above it that the scene lights (the lit copies show once the
  // light has gone up), a gate to the way up, and a couple of purses.
  textFile: 'interactions/deep.txt',
  props: [
    ...(R3C_PROPS.deep_root ?? []),
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 6, y: 21, save: true },
    // The west ledge: S1, the wrong-way prism, the rock in the beam's way, the prism fixed to the
    // floor under the spot where Ves stands, a stump to roll the rocks home.
    { sprite: 'sun_crystal', x: 2, y: 24, beam: 'up', text: 'rt_sun_crystal' },
    { sprite: 'prism', x: 2, y: 19, mirror: '\\', text: 'rt_prism_first' },
    { sprite: 'push_rock', x: 5, y: 19, rock: true, seenInLight: true, text: 'rt_rock' },
    { sprite: 'prism', x: 8, y: 22, mirror: '\\', fixed: true, text: 'rt_prism_fixed' },
    { sprite: 'rock_stump', x: 4, y: 23, rockReset: true, seenInLight: true, text: 'rt_stump' },
    // The far ledge: the eye the bridge answers to, the second sun-crystal and the gate across its
    // beam, the rock in the beam's way, the last prism, a stump.
    { sprite: 'crystal_eye', x: 23, y: 22, eye: 'root_e1', text: 'rt_eye' },
    { sprite: 'sun_crystal', x: 24, y: 24, beam: 'up', beamWhen: 'root_e1', text: 'rt_sun_crystal_asleep' },
    { sprite: 'gate_narrow', x: 24, y: 21, opensWith: ['root_w'], text: 'rt_beam_gate' },
    { sprite: 'push_rock', x: 24, y: 19, rock: true, seenInLight: true, text: 'rt_rock' },
    { sprite: 'prism', x: 24, y: 17, mirror: '/', text: 'rt_prism_last' },
    { sprite: 'rock_stump', x: 28, y: 20, rockReset: true, seenInLight: true, text: 'rt_stump' },
    // The root: its foot (an eye that burns only while a beam is on it) and the first great crystal of the vein
    // (the last eye, which the scene waits on).
    { sprite: 'root_vein', x: 16, y: 19, eye: 'root_w', latch: false, text: 'rt_root_base' },
    { sprite: 'root_vein', x: 16, y: 17, eye: 'root_lit', text: 'rt_root' },
    { sprite: 'root_vein', x: 16, y: 15, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 13, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 11, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 9, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 7, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 5, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 3, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein', x: 16, y: 1, text: 'rt_vein', until: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 15, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 13, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 11, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 9, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 7, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 5, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 3, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'root_vein_lit', x: 16, y: 1, text: 'rt_vein_lit', animation: 'root_vein_lit', speed: 0.3, after: 'the_light_goes_up' },
    { sprite: 'gate_narrow', x: 31, y: 22, opensWith: ['root_lit'], text: 'rt_gate' },
    { sprite: 'gold_pouch', x: 29, y: 18, text: 'rt_purse', gold: 90, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'little_cairn', x: 5, y: 23, text: 'rt_cairn', seenInLight: true },
    { sprite: 'smooth_stone_b', x: 26, y: 24, text: 'rt_stone', seenInLight: true },
    // --- life pass: things to see and poke (all bodiless) ---
    { sprite: 'gold_pouch', x: 4, y: 25, text: 'lp_root_nook', gives: 'deep_root_chew', seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // --- end life pass ---
  ],
  tileTexts: { '#': 'deep_rock', W: 'rt_face', '^': 'deep_stalagmite', O: 'deep_boulder', J: 'deep_knob', '0': 'rt_drop' },

  // Nothing alive down here, not even a murk. The scene (the light going up)
  // has the whole room to itself.
  npcs: [],
};
