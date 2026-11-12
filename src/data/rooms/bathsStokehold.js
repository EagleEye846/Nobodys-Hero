// THE STOKEHOLD (a secret, Chapter 3): under the Old Baths, behind the stack of
// pots that doesn't quite sit right against the wall. Where the bath
// stokers fed the spring's fire and kept their own tally of the days, and
// where a leaf of the Welcome Register ended up, used to wedge a furnace door
// shut. Three chambers, two gates: the hero pushes a stone onto a plate for
// the first, and only Ves, on her crutch, can reach the high lever that lifts
// the second. The third of the Registry's three leaves (the Leaf of the Seal; see
// src/data/rooms/registryCleft.js).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   W  the old city's stone wall (solid)
export const BATHS_STOKEHOLD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'baths_stokehold',
  // The room's name, for the Room Editor.
  name: 'THE STOKEHOLD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "The Ones Who Stopped Waiting" (lasthomeTheme.js): somewhere warm.
  music: 'lasthome',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '########################',
    '#WWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWW#',
    '#......WWW.....WWW.....#',
    '#.I.....W..I....W...J..#',
    '#.......W.......W......#',
    '.......................#',
    '#.......W.......W......#',
    '#...J...W..I....W......#',
    '#......WWW......WW.J...#',
    '#.......W......WW......#',
    '########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 1, to: 'city_baths', spawn: { x: 19, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    // The first gate holds open once the stone is on its plate. The second lifts for
    // a lever only Ves can reach (high on the wall).
    { sprite: 'gate_narrow', x: 8, y: 6, text: 'city_gate', opensWith: ['stoke_plate'] },
    { sprite: 'stone_button', x: 6, y: 7, text: 'stone_button', button: 'stoke_plate' },
    { sprite: 'push_rock', x: 4, y: 4, text: 'stoke_stone', rock: true },
    { sprite: 'rock_stump', x: 1, y: 9, text: 'rock_stump', rockReset: true },
    { sprite: 'high_lever', x: 12, y: 3, text: 'stoke_lever', lever: 'stoke', high: true },
    { sprite: 'gate_narrow', x: 16, y: 6, text: 'city_gate', opensWith: ['stoke'] },
    // The leaf, wedged in a furnace door to keep it shut.
    { sprite: 'register_leaf', x: 20, y: 6, text: 'stoke_leaf', gives: 'register_leaf_seal', light: 14, notice: true, taken: { sprite: 'pot_pile', text: 'stoke_leaf_taken' } },
    { sprite: 'inscription', x: 5, y: 4, text: 'stoke_inscription' },
    { sprite: 'sign', x: 18, y: 4, text: 'stoke_sign' },
    { sprite: 'pot_pile', x: 21, y: 9, text: 'baths_pots' },
    { sprite: 'book_heap', x: 13, y: 9, text: 'stacks_heap' },
  ],
  tileTexts: { W: 'baths_wall', '#': 'baths_wall', I: 'city_pillar', J: 'city_pillar' },

  // A Cairn Hound lying across the middle chamber, and a Lamp Mite in the furnace room.
  npcs: [
    { enemy: 'cairn_hound', x: 13, y: 7, patrol: [12, 15], behaviour: 'disguise' },
    { enemy: 'lamp_mite', x: 20, y: 8, patrol: [18, 22] },
  ],
};
