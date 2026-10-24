// THE FAR JETTY: out of the stilt hut's back door with Ves on your back.
// Strips of bog cross the way, each only a stride wide. Alone you'd hop them;
// you can't, carrying her. Bramble can, and on the far side of each lies a
// drift log for him to roll back in.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ;  fen turf
//   =  old duckboards
export const MARSH_JETTY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_jetty',
  // The room's name, for the Room Editor.
  name: 'THE FAR JETTY',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.45,

  tiles: [
    '""""""""""""""""""""""""""""""',
    '";;;;;;;%;"";;;;%;;;;;;%;""";"',
    '";;;;;;;%;"";;;;%;;;;;;%;""";"',
    '";;;;;;;%;"";;;;%;;;;;;%;;;;;"',
    '";;;;;;;%;;;;;;;%;;;;;;%;;;;;"',
    '====;;;;%;;;;;;;%;;;;;;%;;;;;"',
    '====;;;;%;;;;;;;%;;;;;;%;;;;;;',
    '";;;;;;;%;;;;;;;%;;;;;;%;;;;;;',
    '";;;;;;;%;;;;;;;%;;;;;;%;;;;;"',
    '";;;;;;;%;;;;;;;%;""";;%;;;;;"',
    '";;;$$$;%;;;;;;;%;""";;%;;;;;"',
    '";;;$$$;%;;;;;;;%;""";;%;;;;;"',
    '";;;$$$;%;;;;;;;%;""";;%;;;;;"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 5, w: 1, h: 2, to: 'marsh_hut', spawn: { x: 12, y: 5 } },
    { x: 29, y: 6, w: 1, h: 2, to: 'marsh_wisp_hollow', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 4, y: 4, w: 1, h: 4, scene: 'no_jumping' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'roll_log', x: 10, y: 7, text: 'bog_log', log: true },
    { sprite: 'roll_log', x: 18, y: 4, text: 'bog_log', log: true },
    { sprite: 'roll_log', x: 26, y: 9, text: 'bog_log', log: true },
    { sprite: 'marsh_lantern', x: 7, y: 3, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 15, y: 10, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 22, y: 4, text: 'marsh_lantern', light: 60 },
    { sprite: 'sign', x: 5, y: 3, text: 'jetty_post' },
    { sprite: 'gold_pouch', x: 28, y: 12, text: 'jetty_purse', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 1, y: 11, text: 'jetty_chest', gives: 'punt_pole', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', '=': 'duckboards' },

  // A Bog Toad on the middle stretch.
  npcs: [
    { enemy: 'bog_toad', x: 12, y: 11, patrol: [10, 14] },
  ],
};
