// THE LOOKOUT: a platform off the east side of the village, hanging over the
// cloud sea, with a telescope trained on the summit. The stair goes on north
// from here, up into the cloud, to the second cairn (vigilSecondCairn.js) and
// on towards the top of Mount Vigil. A rope is strung across it until Ves has
// joined you: nobody from the village goes up alone. A herald keeps watch
// here for the Hero, as one always has.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    s  the great stair
//   E  ice-veined cliff face (solid)              n  snow
//   i  trodden snow path                          Y  snow pine (walk or hide behind) (solid)
//   Q  snowy boulder (solid)                      _  open sky (the view shows through) (solid)
//   l  swept cobble lane
export const REST_LOOKOUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_lookout',
  // The room's name, for the Room Editor.
  name: 'THE LOOKOUT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain, and the weather.
  vista: { altitude: 0.95, heading: 0.55 },
  weather: 'flurry',
  snowy: true,
  birds: 6,

  tiles: [
    'AAAAAAAAAAAAsssssAAAAAAA',
    'EEEEEEEEEEEEsssssEEEEEEE',
    'AnnnnnnnnnnnilllinnnnnnA',
    'AnYnnnnnnnnnilllinnnnYnA',
    'AnnnnnnnnnnnilllinnnnnnA',
    'AnnnnnnQnnnnilllinnnnnnA',
    'AnnnnnnnnnnnilllinnnQnnA',
    'AnnninnnnnnnilllinnnnnnA',
    'AnnninnnnnnnilllinnnnnnA',
    'Annninnnnnnnilllinnnnn__',
    'llllllllllllllllnnnnn___',
    'llllllllllllllllnnnnn___',
    'AnnnnnnnnnnnnnnnnnnnA___',
    'AAnnnnnnnnnnnnnnnAAAA___',
    '_AAnnnnnnnnnnnnAAE______',
    '__EAAAAAAAAAAAAE________',
    '___EEEEEEEEEEEEE________',
    '________________________',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'rest_square', spawn: { x: 38, y: 25 } },
    { x: 12, y: 0, w: 5, h: 1, to: 'vigil_second_cairn', spawn: { x: 12, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    { sprite: 'telescope', x: 16, y: 10, text: 'lookout_telescope', nightText: 'lookout_telescope_night' },
    { sprite: 'bench', x: 7, y: 13, text: 'lookout_bench' },
    { sprite: 'savepoint', x: 4, y: 6, save: true },
    { sprite: 'sign', x: 11, y: 5, text: 'lookout_sign' },
    { sprite: 'waymark', x: 18, y: 4, text: 'lookout_waymark' },
    { sprite: 'street_lamp', x: 11, y: 3, text: 'square_lamp' },
    { sprite: 'street_lamp', x: 17, y: 3, text: 'square_lamp' },
    { sprite: 'chest', x: 19, y: 12, text: 'lookout_chest', gives: 'fanfare_fudge', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'herald', x: 6, y: 9, npc: 'herald_lookout' },
    { sprite: 'chough', x: 20, y: 8, text: 'ridge_chough', walkable: true },
    { sprite: 'chough', x: 3, y: 12, text: 'ridge_chough', walkable: true },
    // Across the stair north, until Ves joins you in the chapel.
    { sprite: 'stair_rope', x: 12, y: 1, text: 'lookout_rope', until: 'ves_in_the_chapel' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 12, y: 0, text: 'lookout_onward' },
    { x: 13, y: 0, text: 'lookout_onward' },
    { x: 14, y: 0, text: 'lookout_onward' },
    { x: 15, y: 0, text: 'lookout_onward' },
    { x: 16, y: 0, text: 'lookout_onward' },
  ],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', Q: 'vigil_snow_boulder', n: 'rest_snow', s: 'lookout_stair', l: 'rest_lane' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
