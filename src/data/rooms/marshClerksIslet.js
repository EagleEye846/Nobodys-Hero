import { R3M_PROPS } from '../lifePass3m.js';
// THE CLERK'S ISLET (a secret, Chapter 3): off the Far Shore, through a gap in the
// reeds that somebody has kept trodden. The fen cuts a channel across a little
// patch of turf, two tiles wide, and on the far side, on a stand of old
// duckboards, a leaf of the Welcome Register is pinned out of the wet. It blew
// down the valley the night the star fell and fetched up in the reeds; the
// toll clerk who lived out here (the Tollhouse's) kept it. Two stones to sink
// in the channel, one for each tile of water. The second of the Registry's
// three leaves (the Leaf of Hours; see src/data/rooms/registryCleft.js).
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ,  grass
//   :  dirt path
//   ;  fen turf
//   =  old duckboards
export const MARSH_CLERKS_ISLET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_clerks_islet',
  // The room's name, for the Room Editor.
  name: 'THE CLERK\'S ISLET',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.3,

  tiles: [
    '""""""""""""""""""""',
    '"%%;;;;;,;;$$"";;;""',
    '"%%;;,,;;;;$$;;;;;;"',
    '"%;;;;;;;,;$$;;,,,;"',
    '";;;;;;;;;;$$;;,;;;"',
    '";;;;;;;;;;$$;;,,;;"',
    '";;;;;,;;,;$$;;;;;;"',
    '";;;,;;;;;;$$===;;;"',
    '"%%;;,;;,;;$$;;;;;;"',
    '"%%%;;;,;;;$$";;;;""',
    '"%%%;;;;::;$$";;;"""',
    '""""""""::""""""""""',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 8, y: 11, w: 2, h: 1, to: 'marsh_far_shore', spawn: { x: 10, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    // Two stones in a line with the channel: the first sinks in the near tile, and the
    // second rolls over it and sinks in the far one.
    { sprite: 'push_rock', x: 7, y: 4, text: 'islet_stone', rock: true },
    { sprite: 'push_rock', x: 4, y: 4, text: 'islet_stone', rock: true },
    { sprite: 'rock_stump', x: 2, y: 6, text: 'islet_stump', rockReset: true },
    // The leaf, pinned to a clerk's board on a post.
    { sprite: 'register_leaf', x: 17, y: 5, text: 'islet_leaf', gives: 'register_leaf_hours', light: 14, notice: true, taken: { sprite: 'sign', text: 'islet_leaf_taken' } },
    { sprite: 'sign', x: 8, y: 8, text: 'islet_sign' },
    { sprite: 'marsh_lantern', x: 14, y: 5, text: 'marsh_lantern', light: 50 },
    { sprite: 'cairn', x: 6, y: 1, text: 'shore_cairn' },
    // The life pass (15 November 2026): see src/data/lifePass3m.js.
    ...(R3M_PROPS['marsh_clerks_islet'] ?? []),
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', '=': 'duckboards', ',': 'shore_grass', ':': 'shore_path' },

  // Nobody out here but the frogs.
  npcs: [],
};
