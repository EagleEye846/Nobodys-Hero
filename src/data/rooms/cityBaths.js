// THE OLD BATHS: off the Old Street, the city's bathhouse, where a hot spring
// still comes up into the great stone tubs and the steam keeps it warm. Slowly
// lives here: a tortoise three hundred years old, who remembers the city when
// it was alive (meet_slowly). A save point, a bath to rest in, and Slowly's
// things to buy.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
//   ~  water (solid)
export const CITY_BATHS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_baths',
  // The room's name, for the Room Editor.
  name: 'THE OLD BATHS',
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
    '#########...##########',
    '#WWWWWWWW...WWWWWWWWW#',
    '#WWWWWWWW...WWWWWWWWW#',
    '#....................#',
    '#.I.....I....I.....I.#',
    '#....................#',
    '#....................#',
    '#....................#',
    '#....................#',
    '#..~~~~........~~~~..#',
    '#..~~~~........~~~~..#',
    '#..~~~~........~~~~..#',
    '#....................#',
    '######################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 1 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 0, w: 3, h: 1, to: 'city_old_street', spawn: { x: 13, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 9, y: 3, w: 3, h: 1, scene: 'meet_slowly' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'slowly', x: 10, y: 7, shop: 'slowly_shop' },
    { sprite: 'bathhouse_tub', x: 5, y: 6, text: 'baths_tub', rest: true },
    { sprite: 'bathhouse_tub', x: 15, y: 6, text: 'baths_tub', rest: true },
    { sprite: 'savepoint', x: 17, y: 3, save: true },
    { sprite: 'pot_pile', x: 1, y: 12, text: 'baths_pots' },
    { sprite: 'sign', x: 14, y: 3, text: 'baths_sign' },
  ],
  tileTexts: { W: 'baths_wall', '#': 'baths_wall', '~': 'baths_pool', I: 'city_pillar' },

  // Nobody to fight.
  npcs: [],
};
