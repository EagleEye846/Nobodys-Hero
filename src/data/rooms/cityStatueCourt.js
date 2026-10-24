// THE COURT OF STATUES: a court full of statues of the Hero, every one with
// the same blank face. The way out north is a great gate that wants two
// things: a stone on its plate, and a lever high on the wall across a channel,
// over rotten boards only Ves can cross. And by the south wall, a great stone
// head rolled against a doorway: push it aside for the Sculptor's Yard (a
// secret).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   S  statue (solid)
//   W  the old city's stone wall (solid)
//   ~  water (solid)
export const CITY_STATUE_COURT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_statue_court',
  // The room's name, for the Room Editor.
  name: 'THE COURT OF STATUES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "What They Built for Him" (valleyTheme.js).
  music: 'valley',
  // Its old flagstones crack under every landing, and give way in the end,
  // like the Ruins' floors (see OverworldScene.handleLanding).
  crumbles: true,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mountain',

  tiles: [
    '###############..###############',
    '#WWWWWWWWWWWWWW..WWWWWWWWWWWWWW#',
    '#.....................~~.......#',
    '#.....................~~.......#',
    '#...S.....S...........~~..S....#',
    '#.....................~~.......#',
    '#..............................#',
    '#.....................~~.......#',
    '#.....................~~.......#',
    '...................S..~~.......#',
    '......................~~.......#',
    '#.....................~~.......#',
    '#.....................~~.......#',
    '#.....................~~.......#',
    '#...S.....S...........~~..S....#',
    '#.....................~~.......#',
    '#.....................~~.......#',
    '#####.##########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'city_aqueduct', spawn: { x: 28, y: 10 } },
    { x: 15, y: 0, w: 2, h: 1, to: 'city_last_street', spawn: { x: 16, y: 10 } },
    { x: 5, y: 17, w: 1, h: 1, to: 'city_sculptors_yard', spawn: { x: 6, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'gate_narrow', x: 15, y: 1, text: 'court_gate', opensWith: ['plate', 'court'], openText: 'court_gate_open' },
    { sprite: 'gate_narrow', x: 16, y: 1, text: 'court_gate', opensWith: ['plate', 'court'] },
    { sprite: 'stone_button', x: 13, y: 7, text: 'stone_button', button: 'plate' },
    { sprite: 'push_rock', x: 8, y: 11, text: 'court_stone', rock: true },
    { sprite: 'rotten_planks', x: 22, y: 6, text: 'rotten_planks', gap: true },
    { sprite: 'rotten_planks', x: 23, y: 6, text: 'rotten_planks', gap: true },
    { sprite: 'high_lever', x: 28, y: 2, text: 'court_lever', lever: 'court', high: true },
    { sprite: 'hero_statue_head', x: 5, y: 16, text: 'court_head', rock: true },
    { sprite: 'rock_stump', x: 1, y: 15, text: 'rock_stump', rockReset: true },
    { sprite: 'inscription', x: 18, y: 3, text: 'court_inscription' },
    { sprite: 'gold_pouch', x: 29, y: 15, text: 'court_purse', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', S: 'court_statue', '~': 'forum_water' },

  // Two Cairn Hounds, disguised as cairns.
  npcs: [
    { enemy: 'cairn_hound', x: 7, y: 6, patrol: [5, 9], behaviour: 'disguise' },
    { enemy: 'cairn_hound', x: 27, y: 11, patrol: [25, 29], behaviour: 'disguise' },
  ],
};
