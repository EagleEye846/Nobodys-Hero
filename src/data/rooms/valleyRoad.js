// THE VALLEY ROAD: out of the fen and down into the valley, at dusk. Grass
// over the old city's paving, toppled pillars, and a great statue fallen on
// its face in the weeds. Ahead, the city's biggest hall, with lights in it,
// and smoke going up from its broken roof. A notice nailed to a post about the
// north ridge.
// Tile key (see src/overworld/tileset.js):
//   ,  grass
//   .  the old city's flagstones
//   :  the old road
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
//   O  boulder (solid)
//   R  rubble (solid)
//   T  pine (walk behind it) (solid)
export const VALLEY_ROAD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'valley_road',
  // The room's name, for the Room Editor.
  name: 'THE VALLEY ROAD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // "The Ones Who Stopped Waiting" (lasthomeTheme.js): the town's song, from the
  // road.
  music: 'lasthome',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'village',

  tiles: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,I..J..I,,,,,,,,,,,,T',
    'T,,,O,,,,,.......,,,,,,T,,,,,T',
    'T,,,,,,,,,.......,,,,,,,T,,,,T',
    'T,,,,,,,,,J.....J,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    ':::::::::,,,,,,,,,::::::::::::',
    ':::,,,,,:,,,,,,,,,:,,,,,,,,:::',
    'T,,,,,,,:,,,,,,,,,:,,,,,,,,,,T',
    'T,,,,,,,:::::::::::,,,,,,,,,,T',
    'T,,T,,,,,,,,,,,,,,,,I.....J,,T',
    'T,,,,O,,,,,,,,,,,,,,.......,,T',
    'T,,,,,,,,,,,,RR,,,,,.......,,T',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'marsh_far_shore', spawn: { x: 26, y: 6 } },
    { x: 29, y: 7, w: 1, h: 2, to: 'lasthome_gate', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 12, y: 9, w: 1, h: 3, scene: 'the_valley_road' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lasthome.txt',
  props: [
    { sprite: 'notice_board', x: 20, y: 6, text: 'road_notice' },
    { sprite: 'sign', x: 6, y: 6, text: 'road_signpost' },
    { sprite: 'rubble_heap', x: 15, y: 3, text: 'road_statue' },
    { sprite: 'rubble_heap', x: 12, y: 4, text: 'road_statue' },
    { sprite: 'cairn', x: 22, y: 12, text: 'road_cairn' },
    { sprite: 'street_lamp', x: 26, y: 6, text: 'road_lamp' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 13, y: 3, text: 'road_statue' },
    { x: 13, y: 4, text: 'road_statue' },
  ],
  tileTexts: { T: 'road_trees', I: 'road_pillar', J: 'road_pillar', O: 'road_boulder', R: 'road_rubble', '.': 'road_paving' },

  // Nobody about.
  npcs: [],
};
