// THE WAY UP: the sounders' stair out of the caves, climbing to daylight and the Beacon Isles. A
// SAVE crystal at its foot. Half way up, an iron grille across the throat of the stair hangs from a
// chain over a wheel on a counterweight frame, and the hook at the chain's end is empty: WEIGHT
// KEPT BELOW. With the brass sounding-weight from the Weight Room, the scene
// `soundings_weight_gate` hangs it on the hook and the grille goes up for good. No monsters (a save
// room); no puzzle but the key.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   s  stair
//   x  glowing sea-glass (solid)   I  a rock pillar

export const SOUNDINGS_UP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_up',
  // The room's name, for the Room Editor.
  name: 'THE WAY UP',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  tiles: [
    '###########..###########',
    '#WWWWWWWWWW..WWWWWWWWWW#',
    '####................####',
    '####.x..............####',
    '####................####',
    '####...I........I...####',
    '####................####',
    '####................####',
    '####..............x.####',
    '####................####',
    '###########ss###########',
    '###########ss###########',
    '###########ss###########',
    '###########ss###########',
    '###########ss###########',
    '###########..###########',
    '###########..###########',
    '#########......#########',
    '#########.....x#########',
    '#########......#########',
    '#########x.....#########',
    '#########......#########',
    '#########......#########',
    '###.x................###',
    '###..................###',
    '###..................###',
    '###.................x###',
    '###..................###',
    'WWWWWWWWWWW..WWWWWWWWWWW',
    '###########..###########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 26 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 11, y: 29, w: 2, h: 1, to: 'soundings_echo_hall', spawn: { x: 21, y: 2 } },
    { x: 11, y: 0, w: 2, h: 1, to: 'isles_landing', spawn: { x: 5, y: 4 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // At the grille, with the weight (it's given by soundings_the_weight).
    { x: 11, y: 17, w: 2, h: 2, scene: 'soundings_weight_gate', after: 'soundings_the_weight' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    { sprite: 'savepoint', x: 6, y: 24, save: true },
    // The grille (two props, the throat is two wide) and its counterweight frame.
    { sprite: 'gate_narrow', x: 11, y: 16, text: 'up_grille', until: 'soundings_weight_gate' },
    { sprite: 'gate_narrow', x: 12, y: 16, text: 'up_grille', until: 'soundings_weight_gate' },
    { sprite: 'sd_counterweight', x: 13, y: 17, text: 'up_counterweight', until: 'soundings_weight_gate' },
    { sprite: 'sd_counterweight_full', x: 13, y: 17, text: 'up_counterweight_full', after: 'soundings_weight_gate' },
    { sprite: 'sign', x: 16, y: 24, text: 'up_sign' },
    { sprite: 'c5_stalactite_drip', x: 8, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_rope_coil', x: 18, y: 25, text: 'up_line', walkable: true },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', x: 'sound_glass', I: 'sound_pillar', s: 'up_stair' },

  // None: a save room.
  npcs: [],
};
