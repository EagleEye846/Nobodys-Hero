// THE SCULPTOR'S YARD (a secret): behind the stone head in the Court of
// Statues. Where the Hero's statues were made, all from one model: the
// sculptor never knew his face, so they're all left blank. One's half done,
// and on its plinth, the sculptor's tools and savings.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
export const CITY_SCULPTORS_YARD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_sculptors_yard',
  // The room's name, for the Room Editor.
  name: 'THE SCULPTOR\'S YARD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // Quiet.
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',

  tiles: [
    '######.#######',
    '#WWWWW.WWWWWW#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 1 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 0, w: 1, h: 1, to: 'city_statue_court', spawn: { x: 5, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'plinth_empty', x: 6, y: 5, text: 'yard_unfinished' },
    { sprite: 'hero_statue_head', x: 2, y: 7, text: 'yard_heads' },
    { sprite: 'hero_statue_head', x: 10, y: 4, text: 'yard_heads' },
    { sprite: 'chest', x: 9, y: 7, text: 'yard_chest', gives: 'sculptors_mallet', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 3, text: 'yard_purse', gold: 320, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall' },

  // Nobody.
  npcs: [],
};
