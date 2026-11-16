import { R3M_PROPS } from '../lifePass3m.js';
// THE LANTERN PATH: thick mist over open bog, and one way across it, old
// duckboards winding from tussock to tussock with lanterns on poles beside
// them. In the mist you can only see the boards near a lantern. Two in the
// middle have gone out. Spurs run off and stop in the bog; the one with no
// lantern at all goes to the old tollhouse (a secret). Wisps drift over the
// bog, glowing just like the lanterns.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ;  fen turf
//   =  old duckboards
export const MARSH_LANTERN_PATH = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_lantern_path',
  // The room's name, for the Room Editor.
  name: 'THE LANTERN PATH',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.4,
  // Thick mist: you can only see a few steps, except near the lanterns (0 to 1;
  // see OverworldScene.drawMist).
  mist: 0.82,

  tiles: [
    '""""""""""""""""""""""""""""""""""""',
    '"%;;;%%%%%%%%%%%%%%%$$$%%;;%%%%%%%%"',
    '"%;;;%%%%%%%%%%%%%%%$$$%=;;%%%%%%%%"',
    '"%;;;%%%%%%%%%%%%%%%$$$%=%%%%%%%%%%"',
    '"%%%%%=======%%%%%%%%%%%=%%%%%======',
    '"%%%%%=%%%%%=%%%%%%%%%%%=%%%%%=%%%==',
    '"%%%%%=%%%%%=%%%%%%%%%%%=%%%%%=%%%%"',
    '"%%%%%=%%%%%=%%%%%=======%%%%%=%%%%"',
    '=======%%%%%=%%%%%=%%%%%=%%$$%=%%%%"',
    '==%%%%%%%%%%=%%%%%=%%%%%=%%$$%=%%%%"',
    '"%%%%%%%%%%%=%%%%%=%%%%%=%%$$%=%%%%"',
    '"%%%%%%%%%%%=%%%%%=%%%%%=%%%%%=%%%%"',
    '"%%%%%%%%%%%=======%%%%%=%%%%%=%%%%"',
    '"%%%%%%%$$%%=%%%%%%%%%%%==========="',
    '"%%%%%%%$$%%=%%;;%%%%%%%%%%%%%%%%%==',
    '"%%%%%%%$$%%=%%;;%%%%%%%%%%%%%%%%%%"',
    '"%%%%%%%%%%%%%%;;%%%%%%%%%%%%%%%%%%"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'marsh_falls_foot', spawn: { x: 26, y: 9 } },
    { x: 35, y: 4, w: 1, h: 2, to: 'marsh_rushes', spawn: { x: 1, y: 4 } },
    { x: 35, y: 14, w: 1, h: 1, to: 'marsh_tollhouse', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 8, w: 1, h: 2, scene: 'the_lanterns' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'marsh_lantern', x: 2, y: 7, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 5, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 9, y: 3, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 13, y: 7, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 11, y: 11, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 17, y: 13, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 19, y: 9, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 23, y: 6, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern_out', x: 25, y: 11, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern_out', x: 28, y: 14, text: 'marsh_lantern_out' },
    { sprite: 'marsh_lantern', x: 31, y: 10, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 29, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 33, y: 3, text: 'marsh_lantern', light: 60 },
    { sprite: 'drag_print', x: 6, y: 6, text: 'drag_print', walkable: true },
    { sprite: 'coat_strip', x: 7, y: 3, text: 'lantern_strip' },
    { sprite: 'gold_pouch', x: 26, y: 2, text: 'lantern_purse', gold: 160, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 13, y: 15, text: 'lantern_spur_end' },
    // The life pass (15 November 2026): see src/data/lifePass3m.js.
    ...(R3M_PROPS['marsh_lantern_path'] ?? []),
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', '=': 'duckboards' },

  // Wisps, drifting over the bog (they glow in the mist, like the lanterns). AMBUSH: the middle
  // one isn't drifting: it stands at the end of the spur up to the purse (25,1), passing for one
  // more lantern on a pole, till you come within three and a half tiles, halfway up the spur (it blinks, its flame flares:
  // the wisp's own lantern art, with `look: 'marsh_lantern'` for the shower of sparks,
  // src/overworld/hideouts.js). The main way (row 7 and down) is five tiles or more away.
  npcs: [
    { enemy: 'wisp', x: 9, y: 9, patrol: [7, 11], behaviour: 'wander', light: 44 },
    { enemy: 'wisp', x: 25, y: 1, patrol: [25, 25], behaviour: 'disguise', look: 'marsh_lantern', reach: 3.5, light: 44 },
    { enemy: 'wisp', x: 27, y: 15, patrol: [25, 29], behaviour: 'wander', light: 44 },
  ],
};
