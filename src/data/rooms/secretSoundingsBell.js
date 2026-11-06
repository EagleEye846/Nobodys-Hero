// SECRET: THE SOUNDINGS BELL. Up through the sea-glass outcrop in the Echo Hall's north-west
// corner (Bramble's crack, his bolt wheel, the grille), a dry pocket where the Harbour Board kept
// its old diving bell: the one the sounders went down in, to measure the caves by hand. It sits on
// the floor with its chain coiled beside it. A chest (Cockle Chowder), the sounders' tin of pay
// (a purse, 300), their last slate of soundings. Nothing hostile.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   x  glowing sea-glass (solid)

export const SECRET_SOUNDINGS_BELL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_soundings_bell',
  // The room's name, for the Room Editor.
  name: 'THE SOUNDINGS BELL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  tiles: [
    '################',
    '#WWWWWWWWWWWWWW#',
    '#x............x#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#x............x#',
    'WWWWWWW..WWWWWWW',
    '#######..#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 9, w: 2, h: 1, to: 'soundings_echo_hall', spawn: { x: 3, y: 2 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    { sprite: 'sd_diving_bell', x: 6, y: 4, text: 'bell_bell', notice: true },
    { sprite: 'c5_chest', x: 2, y: 4, text: 'bell_chest', gives: 'cockle_chowder', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 12, y: 3, text: 'bell_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 11, y: 6, text: 'bell_slate' },
    { sprite: 'c5_rope_coil', x: 3, y: 6, text: 'bell_line', walkable: true },
    { sprite: 'c5_stalactite_drip', x: 9, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', x: 'sound_glass' },

  // None: a secret.
  npcs: [],
};
