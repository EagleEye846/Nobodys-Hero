// THE BROKEN SPAN: the great stair crosses a gorge here on a span of stone,
// and the middle of the span is gone. The way over uses everything: jump the
// fallen blocks into a pocket at the foot of the west face, swing up the
// face's rings to a high ledge over the gorge, and ride the wind from there
// across to the far side. From the far side a ring ropes down its cliff to the
// near side, so there's always a way back. A Loose Step lies among the fallen
// blocks, pretending to be one.
// Tile key (see src/overworld/tileset.js):
//   A  snowy cliff top (solid)                    E  ice-veined cliff face (solid)
//   n  snow                                       s  the great stair
//   Y  snow pine (walk or hide behind) (solid)    Q  snowy boulder (solid)
//   _  open sky (the view shows through) (solid)  b  low stone block (jump up onto it)
//   B  tall stone block (jump onto it from a low block)
export const VIGIL_BROKEN_SPAN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_broken_span',
  // The room's name, for the Room Editor.
  name: 'THE BROKEN SPAN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'vigil',
  // The song that plays here (a file in src/data/music/).
  music: 'vigil',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'summit',
  // The view off the mountain (see src/overworld/vista.js): how high up it is, and which way you look.
  vista: { altitude: 1.0, heading: 0.64 },
  // Snow lies under anything that stands here.
  snowy: true,
  // The weather over the room (see src/overworld/weather.js).
  weather: 'flurry',
  // How hard the wind blows the snow sideways.
  wind: 1.8,
  // Birds circling the spire.
  birds: 4,

  tiles: [
    'AAAAAAAAAAAsssssAAAAAAAAAA',
    'AEEEEEEEEEEsssssEEEEEEEEEA',
    'AnnnnnnnnnnsssssnnnnnnnnnA',
    'AnYnnnnnnnnsssssnnnnnnnnnA',
    'AnnnnnnnnnnsssssnnnnnnnnnA',
    'AnnnnnnnnnnsssssnnnnnnnnnA',
    'AnnnnnnnnnnsssssnnnnnnYnnA',
    'AnnnnnnnnnnsssssnnnnnnnnnA',
    'AnnnnnnQnnnsssssnnnnnnnnnA',
    'AnnnnnnnnnnsssssnnnnnnnnnA',
    'AnnnnnnnnnnsssssnnnnnnnnnA',
    'A__________sssss_AAAAAAAAA',
    'A__________sssss_EEEEEEEEA',
    'A________________EEEEEEEEA',
    'A________________EEEEEEEEA',
    'A________________EEEEEEEEA',
    'A________________EEEEEEEEA',
    'A__________sssss_EEEEEEEEA',
    'A__________sssss_nnnnnnnnA',
    'Annnnnnn___sssssnnnnnnnnnA',
    'Annnnnnn___sssssnnnnnnnnnA',
    'AAAAAAAAAnnsssssnnnnnnnnnA',
    'AEEEEEEEEnnsssssnnnnnnnnnA',
    'AEEEEEEEEnnsssssnnnnnbbnnA',
    'AEEEEEEEEnnsssssnnnnnnnnnA',
    'AEEEEEEEEnnsssssnnnnnnnnnA',
    'AEEEEEEEEnnsssssnnbnnnnnnA',
    'AnnnnnnnBnnsssssnnnnnnnnnA',
    'AnbnnnnnBnnsssssnnnnnnnQnA',
    'ABBBBBBBBbnsssssnnnnnnnnnA',
    'AnnnnbnnnnnsssssnnnnnnnnnA',
    'AnYnnnnnnnnsssssnnnnnnnnnA',
    'AAAAAAAAAAAsssssAAAAAAAAAA',
    'EEEEEEEEEEEsssssEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 13, y: 31 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 11, y: 33, w: 5, h: 1, to: 'vigil_cloud_bank', spawn: { x: 20, y: 2 } },
    { x: 11, y: 0, w: 5, h: 1, to: 'vigil_wind_stair', spawn: { x: 21, y: 33 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Wind geysers (src/overworld/windGeyser.js): with Ves, stepping in floats
  // you up into the room `to`, landing at `spawn`. Without her the wind holds you off.
  geysers: [
    { x: 6, y: 19, to: 'vigil_broken_span', spawn: { x: 6, y: 6 } },
  ],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    // The near side: jump the fallen blocks into the pocket, swing up the face
    // to the high ledge, and ride the wind over the gorge to the far side.
    { sprite: 'swing_ring', x: 4, y: 26 },
    { sprite: 'swing_ring', x: 6, y: 24 },
    { sprite: 'swing_ring', x: 4, y: 22 },
    { sprite: 'grapple_ring', x: 4, y: 20, grapple: true },
    { sprite: 'lamp_cold', x: 2, y: 19, text: 'span_lamp' },
    { sprite: 'savepoint', x: 21, y: 30, save: true },
    { sprite: 'sign', x: 17, y: 30, text: 'span_sign' },
    { sprite: 'scorch_mark', x: 13, y: 17, text: 'span_scorch', walkable: true },
    // The far side, and a ring to rope down its cliff, back to the near side.
    { sprite: 'grapple_ring', x: 21, y: 10, grapple: true },
    { sprite: 'chest', x: 23, y: 3, text: 'span_chest', gives: 'fanfare_fudge', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'cairn', x: 9, y: 3, text: 'span_marker' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [
    { x: 11, y: 13, text: 'span_gap' },
    { x: 12, y: 13, text: 'span_gap' },
    { x: 13, y: 13, text: 'span_gap' },
    { x: 14, y: 13, text: 'span_gap' },
    { x: 15, y: 13, text: 'span_gap' },
    { x: 11, y: 16, text: 'span_gap' },
    { x: 12, y: 16, text: 'span_gap' },
    { x: 13, y: 16, text: 'span_gap' },
    { x: 14, y: 16, text: 'span_gap' },
    { x: 15, y: 16, text: 'span_gap' },
  ],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', s: 'span_stair', _: 'upper_cloud', b: 'span_blocks', B: 'span_blocks' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between; `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js).
  npcs: [
    { enemy: 'step', x: 19, y: 28, patrol: [19, 19], behaviour: 'disguise', reach: 2 },
  ],
};
