// THE DROWNED FORUM: the old city's great square, under water now. Two ways
// round the pool: north over a fallen colonnade (jump up and over; Ves can't),
// south over rotten boards (Ves is light enough; you'd go straight through).
// The gate out east is shut, and its lever's high on the wall, on Ves's side.
//
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   !  cracked flagstones: they give way under you (see src/overworld/crumble.js)
//   b  old stone step (jump up onto it; Ves can not)
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
//   ~  water (solid)
export const CITY_FORUM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_forum',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED FORUM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "What They Built for Him" (valleyTheme.js).
  music: 'valley',
  // Its old flagstones crack under every landing, and give way in the end,
  // like the Ruins' floors (see OverworldScene.handleLanding). The north
  // bank past the fallen colonnade and the broken statue is split right
  // through (`!`): it goes as you cross it, and it's gone behind you
  // (crumble.js). Keep walking.
  crumbles: true,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#..............bb...!!!!.WWWWWW#',
    '#..............bb...!!!!.WWWWWW#',
    '#..I...........bb...!!!!.WWWWWW#',
    '#.......~~~~~~~~~~~~~~~~.WWWWWW#',
    '#.......~~~~~~~~~~~~~~~~.WWWWWW#',
    '#.......~~~~~~~~~~~~~~~~.WWWWWW#',
    '#.......~~~~~~~~~~~~~~~~..WI...#',
    '........~~~~~~~~~~~~~~~~........',
    '........~~~~~~~~~~~~~~~~........',
    '#.......~~~~~~~~~~~~~~~~..WI...#',
    '#.......~~~~~~~~~~~~~~~~.WWWWWW#',
    '#.......~~~~~~~~~~~~~~~~.WWWWWW#',
    '#..I..........~~~~.......WWWWWW#',
    '#........................WWWWWW#',
    '#.............~~~~.......WWWWWW#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'city_old_street', spawn: { x: 28, y: 6 } },
    { x: 31, y: 9, w: 1, h: 2, to: 'city_colonnade', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'rotten_planks', x: 14, y: 15, text: 'rotten_planks', gap: true },
    { sprite: 'rotten_planks', x: 15, y: 15, text: 'rotten_planks', gap: true },
    { sprite: 'rotten_planks', x: 16, y: 15, text: 'rotten_planks', gap: true },
    { sprite: 'rotten_planks', x: 17, y: 15, text: 'rotten_planks', gap: true },
    { sprite: 'gate_narrow', x: 26, y: 9, text: 'city_gate', opensWith: ['forum'] },
    { sprite: 'gate_narrow', x: 26, y: 10, text: 'city_gate', opensWith: ['forum'] },
    { sprite: 'high_lever', x: 25, y: 13, text: 'forum_lever', lever: 'forum', high: true },
    { sprite: 'inscription', x: 5, y: 3, text: 'forum_inscription' },
    { sprite: 'street_lamp_dead', x: 6, y: 15, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 24, y: 3, text: 'dead_lamp' },
    { sprite: 'hero_statue_broken', x: 19, y: 3, text: 'forum_statue' },
    { sprite: 'gold_pouch', x: 29, y: 8, text: 'forum_purse', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 1, y: 16, text: 'forum_chest', gives: 'forum_bronze_ferrule', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', '!': 'cracked_floor', I: 'city_pillar', J: 'city_pillar', b: 'city_step', '~': 'forum_water' },

  // A Cairn Hound, guarding the forum.
  npcs: [
    { enemy: 'cairn_hound', x: 4, y: 11, patrol: [2, 6] },
  ],
};
