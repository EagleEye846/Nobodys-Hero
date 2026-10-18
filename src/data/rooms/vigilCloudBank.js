// THE CLOUD BANK: a long shelf in the cloud, so thick the snow comes
// sideways. The great stair goes on from a higher shelf, above a face too tall
// to throw a rope up. Two winds blow up the face: the eastern one only reaches
// a pocket of the shelf, cut off by a crack (a chest, and a ring back down);
// the western one, under the lamplighter's chalk mark, carries you up onto the
// High Shelf above (vigilHighShelf.js), whose stair comes back down onto the
// shelf here. A ring on the shelf ropes back down to the bank.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    E  ice-veined cliff face (solid)
//   n  snow                                       i  trodden snow path
//   s  the great stair                            Y  snow pine (walk or hide behind) (solid)
//   Q  snowy boulder (solid)                      _  open sky (the view shows through) (solid)
//   z  ice
export const VIGIL_CLOUD_BANK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_cloud_bank',
  // The room's name, for the Room Editor.
  name: 'THE CLOUD BANK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 0.98, heading: 0.6 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'snow',
  // How hard the wind blows the snow sideways.
  wind: 2.4,

  tiles: [
    'AAAAAAAAAAAAAAAAAAsssssAAAAAssAAAAAAAAAA',
    'AEEEEEEEEEEEEEEEEEsssssEEEEEssEEEEEEEEEA',
    'AnYnnnnnnnnnnnnnnnsssssnnnnnssnn___nnnnA',
    'AnnnnnnnnnnYnnnnnniiiiinnnnnnnnn___nnQnA',
    'Annnnnnnnnnnnnnnnniiiiinnnnnnnnn___nnnnA',
    'AnnnnnnnnnnnnnnnnnnnnnnnnnQnnnnn___nnnnA',
    'Annnnnnnnnnnnnnnnnnnnnnnnnnnnnnn___nnnnA',
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA___AAAAA',
    'AEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEEA',
    'AEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEEA',
    'AEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEEA',
    'AEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE___EEEEA',
    'Annnnnnnnnnnnnnnniiinnnnnnnnnnnnnnnnnnn_',
    'AnnnnnnnnnnnnnnnniiinnnnQnnnnnnnnnnnnnn_',
    'Annnnnnnnnnnnnnnniiinnnnnzzzzzznnnnnnnn_',
    'AnnYnnnnnnnnnnnnniiinnnnzzzzzzzznnnnnnn_',
    'AnnnnnnnnnnnQnnnniiinnnnzzzzzzzznnnnnnn_',
    'Annnnnnnnnnnnnnnniiinnnnnzzzzzznnnnnnnn_',
    'Annnnnnnnnnnnnnnniiinnnnnnnnnnnnnnnnnnn_',
    'A__nnnnnnYnnnnnnniiinnnnnnnnnnYnn_______',
    'A___nnnnnnnnnnnnniiinnnnnnnnnnnn________',
    'A____nnnnnnnnnnnniiinnnnnnnnnnn_________',
    'AAAAAAAAAAAAAAAAsssssAAAAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEsssssEEEEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 18, y: 21 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 16, y: 23, w: 5, h: 1, to: 'vigil_second_cairn', spawn: { x: 12, y: 2 } },
    { x: 18, y: 0, w: 5, h: 1, to: 'vigil_broken_span', spawn: { x: 13, y: 31 } },
    { x: 28, y: 0, w: 2, h: 1, to: 'vigil_high_shelf', spawn: { x: 26, y: 11 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Wind geysers (src/overworld/windGeyser.js): with Ves, stepping in floats
  // you up into the room `to`, landing at `spawn`. Without her the wind holds you off.
  geysers: [
    { x: 6, y: 13, to: 'vigil_high_shelf', spawn: { x: 3, y: 9 } },
    { x: 36, y: 15, to: 'vigil_cloud_bank', spawn: { x: 36, y: 4 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    // Two winds: the one with her mark goes up to the High Shelf; the other only
    // reaches a pocket of the shelf cut off by a crack, with a chest and a ring down.
    { sprite: 'chalk_mark', x: 8, y: 11, text: 'bank_chalk', notice: true },
    { sprite: 'chest', x: 37, y: 2, text: 'bank_chest', gives: 'snowmelt_tea', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'grapple_ring', x: 36, y: 6, grapple: true },
    // Back down from the shelf by rope; the great stair goes on from it.
    { sprite: 'grapple_ring', x: 12, y: 6, grapple: true },
    { sprite: 'lamp_cold', x: 17, y: 3, text: 'bank_lamp' },
    { sprite: 'cairn', x: 26, y: 3, text: 'bank_cairn' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'upper_stair', _: 'upper_cloud', z: 'bank_pond' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between; `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js).
  npcs: [
    { enemy: 'craghorn', x: 16, y: 18, patrol: [5, 27] },
    // A frostbite on the middle shelf, and a chough on the ledge above.
    { enemy: 'frostbite', x: 24, y: 12, patrol: [24, 24], behaviour: 'disguise', reach: 3 },
    { enemy: 'chough', x: 22, y: 6, patrol: [15, 30] },
  ],
};
