// SECRET: THE SOUNDINGS BELL. Up through the sea-glass outcrop in the Echo Hall's north-west
// corner (Bramble's crack, his bolt wheel, the grille), a dry pocket where the Harbour Board kept
// its old diving bell: the one the sounders went down in, to measure the caves by hand. It sits on
// the floor with its chain coiled beside it. A chest (the Sounders' Flask, a full mend), the sounders' tin of pay
// (a purse, 300), their last slate of soundings. Nothing hostile.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   x  glowing sea-glass (solid)

// The light off a lump of sea-glass: a small bloom and a pool round it.
const GLASS_GLOW = [{ dy: -8, bloom: 10, strength: 0.45, flicker: 0.1, color: '120, 240, 220' }, { dy: 2, pool: 40, strength: 0.38, flicker: 0.05, color: '120, 240, 220' }];
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
  // After chapter 5 the storm is over (`calmAfter`): the same cave sounds, but the sky in the
  // cave mouth of its fights clears (coastBackdrops.js) and any `_calm` words are used.
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
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
    // QUEST PIECE 2 (the Fair Return's compass needle): in the divers' helmet by the bell.
    { sprite: 'gs_compass_needle', x: 8, y: 3, text: 'bell_compass', gives: 'compass_needle', taken: { gone: true } },
    { sprite: 'sd_diving_bell', x: 6, y: 4, text: 'bell_bell', notice: true },
    { sprite: 'c5_chest', x: 2, y: 4, text: 'bell_chest', gives: 'sounders_flask', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 12, y: 3, text: 'bell_pouch', gold: 300, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 11, y: 6, text: 'bell_slate' },
    { sprite: 'c5_rope_coil', x: 3, y: 6, text: 'bell_line', walkable: true },
    // The pocket as the sounders left it: the divers' helmet and boots by the bell, their pit
    // prop and ladder on the back wall, weed off a shelf, sea-glass in the corners, a heap of
    // old timbers and stones down from the roof.
    { sprite: 'sd_weed_ledge', x: 3, y: 2, text: 'sound_weed_ledge' },
    { sprite: 'sd_pit_prop', x: 5, y: 2, text: 'sound_pit_prop' },
    { sprite: 'sd_rope_ladder', x: 13, y: 2, text: 'sound_rope_ladder' },
    { sprite: 'sd_diver_gear', x: 9, y: 4, text: 'sound_diver_gear' },
    { sprite: 'sd_glass_rock', x: 1, y: 5, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_glass_rock', x: 14, y: 5, text: 'sound_glass', glow: GLASS_GLOW },
    { sprite: 'sd_stalagmite', x: 13, y: 7, text: 'sound_stalagmites' },
    { sprite: 'sd_timbers', x: 2, y: 7, text: 'sound_timbers' },
    { sprite: 'sd_scree', x: 5, y: 7, flat: true, walkable: true },
    { sprite: 'sd_glass_bed', x: 10, y: 2, flat: true, walkable: true },
    { sprite: 'c5_stalactite_drip', x: 9, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', x: 'sound_glass' },

  // None: a secret.
  npcs: [],
};
