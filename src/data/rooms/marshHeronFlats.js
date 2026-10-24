// THE HERON FLATS: open mudflats, and across them a band of bog three strides
// wide. Two fallen stones on your side to shove in, one after the other along
// the same line, and a drift log on the far side for Bramble (who can hop it)
// to roll in after them. Herons stand about in the reeds as still as reeds.
//
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ;  fen turf
export const MARSH_HERON_FLATS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_heron_flats',
  // The room's name, for the Room Editor.
  name: 'THE HERON FLATS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.4,

  tiles: [
    '""""""""""""""""""""""""""""""',
    '";;;;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '";;""";;;;;;;%%%;;""";;;;;;;;"',
    '";;""";;;;;;;%%%;;""";;;;;;;;"',
    '";;;;;;;;;;;;%%%;;""";;;;;$$;"',
    '";;;;;;;;;;;;%%%;;;;;;;;;;$$;"',
    ';;;;;;;;;;;;;%%%;;;;;;;;;;$$;"',
    ';;;;;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '";$$;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '";$$;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '";;;;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '";;;;;;;;;;;;%%%;;;;;;"""";;;"',
    '";;;;;;;""";;%%%;;;;;;"""";;;;',
    '";;;;;;;""";;%%%;;;;;;"""";;;;',
    '";;;;;;;""";;%%%;;;;;;;;;;;;;"',
    '";;;;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '";;;;;;;;;;;;%%%;;;;;;;;;;;;;"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'marsh_wisp_hollow', spawn: { x: 32, y: 6 } },
    { x: 29, y: 12, w: 1, h: 2, to: 'marsh_watergate', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 6, y: 5, w: 1, h: 4, scene: 'the_heron_flats' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The stones are rocks, and the log a log (Z twice on any of them puts
  // everything back).
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'push_rock', x: 8, y: 6, text: 'flats_stone', rock: true },
    { sprite: 'push_rock', x: 6, y: 11, text: 'flats_stone', rock: true },
    { sprite: 'roll_log', x: 21, y: 8, text: 'bog_log', log: true },
    { sprite: 'marsh_lantern', x: 12, y: 3, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 16, y: 14, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 28, y: 10, text: 'marsh_lantern', light: 60 },
    { sprite: 'coat_strip', x: 17, y: 7, text: 'flats_strip' },
    { sprite: 'chest', x: 1, y: 15, text: 'flats_chest', gives: 'wisp_cordial', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'chest', x: 28, y: 1, text: 'flats_down_chest', gives: 'heron_down_coat', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water' },

  // Two Reed Stalkers, standing like reeds.
  npcs: [
    { enemy: 'reed_stalker', x: 24, y: 6, patrol: [21, 27], behaviour: 'disguise' },
    { enemy: 'reed_stalker', x: 4, y: 14, patrol: [2, 7], behaviour: 'disguise' },
  ],
};
