// THE SECOND CAIRN: up the stair from the Lookout, as far as anyone from
// Heralds' Rest has gone and come back. Every herald who got this far tied a
// ribbon on the cairn and turned round. Past it the stair runs into a sheer
// face with no rings in it, sheared off and carrying on above. At the foot of
// the face the wind comes up the rock in a column, the first wind geyser: Ves
// sees it (vesAndTheWind.js) and, with her umbrella, it carries you both up
// onto the terrace above. A ring at the top ropes you back down. The
// lamplighter's lamps begin here, cold.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    E  ice-veined cliff face (solid)
//   n  snow                                       s  the great stair
//   Y  snow pine (walk or hide behind) (solid)    Q  snowy boulder (solid)
//   _  open sky (the view shows through) (solid)
export const VIGIL_SECOND_CAIRN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_second_cairn',
  // The room's name, for the Room Editor.
  name: 'THE SECOND CAIRN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 0.96, heading: 0.56 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // How hard the wind blows the snow sideways.
  wind: 1.4,
  // Birds circling the spire.
  birds: 3,

  tiles: [
    'AAAAAAAAAAsssssAAAAAAAAA',
    'AEEEEEEEEEsssssEEEEEEEEE',
    'AnYnnnnnnnsssssnnnnnnYn_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'AnnnnnnnnnsssssnnnnQnnn_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'AAAAAAAAAAAAAAAAAAAAAAA_',
    'AEEEEEEEEEEEEEEEEEEEEEE_',
    'AEEEEEEEEEEEEEEEEEEEEEE_',
    'AEEEEEEEEEEEEEEEEEEEEEE_',
    'AEEEEEEEEEEEEEEEEEEEEEE_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'AnnnnnnnnnsssssnnnnnQnn_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'AnnnnnnQnnsssssnnnnnnnn_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'Annnnnnnnnsssssnnnnnnnn_',
    'AnYnnnnnnnsssssnnnnnnnn_',
    'Annnnnnnnnsssssnnnn_____',
    'Annnnnnnnnsssssnnn______',
    'AnnnQnnnnnsssssnn_______',
    'AAAAAAAAAAsssssAAAAAAAA_',
    'EEEEEEEEEEsssssEEEEEEEE_',
    'EEEEEEEEEEsssssEEEEEEEE_',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 12, y: 21 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 10, y: 24, w: 5, h: 1, to: 'rest_lookout', spawn: { x: 14, y: 2 } },
    { x: 10, y: 0, w: 5, h: 1, to: 'vigil_cloud_bank', spawn: { x: 18, y: 21 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 1, y: 16, w: 22, h: 1, scene: 'ves_and_the_wind' },
  ],

  // Wind geysers (src/overworld/windGeyser.js): with Ves, stepping in floats
  // you up into the room `to`, landing at `spawn`. Without her the wind holds you off.
  geysers: [
    { x: 5, y: 13, to: 'vigil_second_cairn', spawn: { x: 5, y: 4 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    // The second cairn, where the village turns back, and the heralds' last waymark.
    { sprite: 'ribbon_cairn', x: 16, y: 17, text: 'cairn_ribbons' },
    { sprite: 'waymark', x: 7, y: 20, text: 'cairn_waymark' },
    // The lamplighter's lamps: one at the foot of the face, one at the top.
    { sprite: 'lamp_cold', x: 9, y: 12, text: 'cairn_lamp' },
    { sprite: 'lamp_cold', x: 15, y: 2, text: 'cairn_lamp_top' },
    // Up on the terrace (by the wind), and a ring to rope back down the face.
    { sprite: 'chest', x: 21, y: 4, text: 'cairn_chest', gives: 'climbers_ration', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'grapple_ring', x: 18, y: 6, grapple: true },
    { sprite: 'chough', x: 3, y: 13, text: 'upper_chough', walkable: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 10, y: 11, text: 'cairn_sheared' },
    { x: 11, y: 11, text: 'cairn_sheared' },
    { x: 12, y: 11, text: 'cairn_sheared' },
    { x: 13, y: 11, text: 'cairn_sheared' },
    { x: 14, y: 11, text: 'cairn_sheared' },
  ],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'cairn_look_back' },

  // No enemies here: the mountain itself is the challenge.
  npcs: [],
};
