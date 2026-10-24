// THE COLONNADE: a long hall of columns, cut across by a wall with two gates
// in it. The north one stays open only while somebody stands on a treadle in a
// little room you can only get into over rotten boards, so Ves holds it. The
// south one opens for good when a stone's on its plate, and the stone's on the
// far side.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
export const CITY_COLONNADE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_colonnade',
  // The room's name, for the Room Editor.
  name: 'THE COLONNADE',
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
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.....WWWWWWW..W.............#',
    '#.....W.....W..W.............#',
    '#..I..W.....W..W...I...I...I.#',
    '#.....WWW.WWW..W.............#',
    '#..............W.............#',
    '..............................',
    '...............W..............',
    '#..............W.............#',
    '#..I...........W...I...I...I.#',
    '#..............W.............#',
    '#............................#',
    '#..............W.............#',
    '#..............W.............#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'city_forum', spawn: { x: 30, y: 9 } },
    { x: 29, y: 7, w: 1, h: 2, to: 'city_library', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'rotten_planks', x: 9, y: 5, text: 'rotten_planks', gap: true },
    { sprite: 'treadle', x: 9, y: 3, text: 'treadle', treadle: 'hold' },
    { sprite: 'gate_narrow', x: 15, y: 7, text: 'city_gate', opensWith: ['hold'] },
    { sprite: 'gate_narrow', x: 15, y: 12, text: 'city_gate', opensWith: ['plate'] },
    { sprite: 'stone_button', x: 20, y: 13, text: 'stone_button', button: 'plate' },
    { sprite: 'push_rock', x: 24, y: 12, text: 'colonnade_stone', rock: true },
    { sprite: 'rock_stump', x: 28, y: 3, text: 'rock_stump', rockReset: true },
    { sprite: 'street_lamp_dead', x: 5, y: 9, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 25, y: 9, text: 'dead_lamp' },
    { sprite: 'sign', x: 13, y: 9, text: 'colonnade_sign' },
    { sprite: 'chest', x: 1, y: 2, text: 'colonnade_chest', gives: 'herald_banner_cloak', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall', I: 'city_pillar' },

  // Two Lamp Mites.
  npcs: [
    { enemy: 'lamp_mite', x: 4, y: 12, patrol: [2, 8] },
    { enemy: 'lamp_mite', x: 22, y: 6, patrol: [18, 26] },
  ],
};
