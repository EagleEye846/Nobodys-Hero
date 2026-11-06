// THE WEIGHT ROOM: the deepest sounding in the caves. In the middle of a black pool, on a rock
// platform, an oak gallows stands over a well that goes down further than anyone ever sounded, and
// from its pulley hangs the BRASS SOUNDING-WEIGHT: the key that hangs on the counterweight of the
// gate in the Way Up. Three races of fast water (currents) cut the pool, and a race wheel on the
// north-east ledge sends the water down one way or the other:
//   - wheel OFF (as you find it): race A runs east along row 4 from the entry ledge to the NE ledge;
//     races B and C lie still and deep.
//   - wheel ON: A lies still; B runs south down column 31 to the SE ledge, and C runs west along
//     row 17 from the SE ledge onto the platform.
// So: ride A, turn the wheel, ride B, ride C, and take the weight (scene `soundings_the_weight`).
// The way out is the Climbing Rope: a ring at the top of the cliff north of the platform (19,10),
// thrown from (19,14). The gallery up there runs west to a gate (2,9 and 2,10) that its lever
// (4,9) opens from this side only: the shortcut down a passage to the Echo Hall's SW ledge. Coming
// back that way, rope down from the ring to the platform. Nowhere strands you: the wheel is on the
// only ledge you can be stuck on with it wrong, and the rope is always on the platform.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   ;  shallows (and the races)
//   ~  black water (solid)   x  glowing sea-glass (solid)

export const SOUNDINGS_WEIGHT_ROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_weight_room',
  // The room's name, for the Room Editor.
  name: 'THE WEIGHT ROOM',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  tiles: [
    '####..##############################',
    '#WWW..WWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.x......~~~~~~~~~~~~~~~~~~~.......#',
    '#........~~~~~~~~~~~~~~~~~~~.......#',
    '#........;;;;;;;;;;;;;;;;;;;.......#',
    '#........~~~~~~~~~~~~~~~~~~~.......#',
    '#........~~~~~~~~~~~~~~~~~~~.......#',
    '#########~~~~~~~~~~~~~~~~~~~~~~;~~~#',
    '#WWWWWWWW~~~~~~~~~~~~~~~~~~~~~~;~~~#',
    '.....................~~~~~~~~~~;~x~#',
    '.....................~~~x~~~~~~;~~~#',
    '#####################~~~~~~~~~~;~~~#',
    '#####################~~~~~~~~~~;~~~#',
    '#WWWWWWWWWWWWWWWWWWWW~~~~~~~~~~;~~~#',
    '##############..~~...~~~~~~~~~~;~~~#',
    '############x#.......~~~~~~~.......#',
    '###x##########.......~~~~~~~.......#',
    '########x#####.......;;;;;;;.......#',
    '##############.......~~~~~~~.;;;;;.#',
    '#WWWWWWWWWWWWW.......~x~~~~~.;;;;;.#',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 4, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 4, y: 0, w: 2, h: 1, to: 'soundings_drowned_chapel', spawn: { x: 16, y: 19 } },
    // The shortcut down to the Echo Hall's SW ledge (behind the gallery gate).
    { x: 0, y: 9, w: 1, h: 2, to: 'soundings_echo_hall', spawn: { x: 2, y: 17 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 15, y: 16, w: 4, h: 2, scene: 'soundings_the_weight' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Each race is a current while the wheel sends water down it, and still deep water otherwise.
  textFile: 'interactions/soundings.txt',
  props: [
    // The weight on its gallows, and the same frame once it's taken.
    { sprite: 'sd_weight_frame', x: 16, y: 15, text: 'weight_frame', until: 'soundings_the_weight', light: 40 },
    { sprite: 'sd_weight_frame_empty', x: 16, y: 15, text: 'weight_frame_empty', after: 'soundings_the_weight' },
    // The race wheel on the NE ledge.
    { sprite: 'valve_wheel', x: 33, y: 3, text: 'weight_wheel', lever: 'race' },
    { sprite: 'sign', x: 3, y: 3, text: 'weight_sign' },
    // The rope up to the gallery, the shortcut gate and its lever.
    { sprite: 'grapple_ring', x: 19, y: 10, grapple: true },
    { sprite: 'lever', x: 4, y: 9, text: 'weight_shortcut_lever', lever: 'shortcut' },
    { sprite: 'gate_narrow', x: 2, y: 9, text: 'weight_shortcut_gate', opensWith: ['shortcut'], openText: 'weight_shortcut_open' },
    { sprite: 'gate_narrow', x: 2, y: 10, text: 'weight_shortcut_gate', opensWith: ['shortcut'] },
    { sprite: 'gold_pouch', x: 29, y: 2, text: 'weight_pouch', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_stalactite_drip', x: 13, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactites_wide', x: 22, y: 2, text: 'sound_stalactites' },
    { sprite: 'c5_rope_coil', x: 14, y: 19, text: 'weight_line', walkable: true },
    // The three races.
    { sprite: 'current_right', x: 9, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 10, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 11, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 12, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 13, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 14, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 15, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 16, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 17, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 18, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 19, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 20, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 21, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 22, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 23, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 24, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 25, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 26, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'current_right', x: 27, y: 4, text: 'weight_current', flow: 'right', animation: 'sd_current_right', speed: 0.1, wet: ['!race'] },
    { sprite: 'water_flow', x: 9, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 10, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 11, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 12, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 13, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 14, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 15, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 16, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 17, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 18, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 19, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 20, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 21, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 22, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 23, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 24, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 25, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 26, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 27, y: 4, text: 'weight_still', wet: ['race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'current_down', x: 31, y: 7, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 8, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 9, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 10, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 11, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 12, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 13, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'current_down', x: 31, y: 14, text: 'weight_current', flow: 'down', animation: 'sd_current_down', speed: 0.1, wet: ['race'] },
    { sprite: 'water_flow', x: 31, y: 7, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 8, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 9, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 10, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 11, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 12, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 13, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 31, y: 14, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'current_left', x: 21, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'current_left', x: 22, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'current_left', x: 23, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'current_left', x: 24, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'current_left', x: 25, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'current_left', x: 26, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'current_left', x: 27, y: 17, text: 'weight_current', flow: 'left', animation: 'sd_current_left', speed: 0.1, wet: ['race'] },
    { sprite: 'water_flow', x: 21, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 22, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 23, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 24, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 25, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 26, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
    { sprite: 'water_flow', x: 27, y: 17, text: 'weight_still', wet: ['!race'], animation: 'sd_still_side', speed: 0.3 },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'weight_water', ';': 'weight_shallows', x: 'sound_glass' },

  // A wrackeel in the deep water east of the platform (row 12, x 22 to 27; no race crosses it)
  // and a kelpie foal wading the SE ledge's shallow pool (row 19, x 29 to 33, shallows). Clear of
  // the races' ends, the wheel, the platform, the rope and the scene's trigger (x 15 to 18, rows
  // 16 and 17).
  npcs: [
    { enemy: 'wrackeel', x: 25, y: 12, patrol: [22, 27], behaviour: 'patrol' },
    { enemy: 'kelpie_foal', x: 31, y: 19, patrol: [29, 33], behaviour: 'patrol' },
  ],
};
