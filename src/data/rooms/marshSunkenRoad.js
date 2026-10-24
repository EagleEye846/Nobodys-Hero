// THE SUNKEN ROAD: the old city's road, raised over the fen on a causeway, its
// pillars half sunk. Partway across it has slumped into the bog, five tiles of
// it. Fallen blocks of it lie about the road: shove two into the bog, one
// after the other along the same line, to make stepping-stones, and hop the
// rest.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   .  the old city's flagstones
//   ;  fen turf
//   I  old stone pillar (solid)
//   J  broken pillar (solid)
export const MARSH_SUNKEN_ROAD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_sunken_road',
  // The room's name, for the Room Editor.
  name: 'THE SUNKEN ROAD',
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
    '""""""""""""""""""""""""""""""""',
    '"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"',
    '"$$;;;;;;$$$$$$$$$$$$$$$$$$$$$$"',
    '"$$;;;;;;$$$$$$$$$$$$$$$$$$$$$$"',
    '"$$$$$$$$$$$%%%%%%%$$$$$$$$$$$$"',
    '"$$$I$$$$$I$%%%%%%%$$$I$$$$$I$$"',
    '"............%%%%%............."',
    '.............%%%%%..............',
    '.............%%%%%..............',
    '"$$$$$$J$$$$%%%%%%%J$$$$$J$$$$$"',
    '"$$$$$$$$$$$%%%%%%%$$$$$$$$$$$$"',
    '"$$$$$$$$$$$$$$$$$$$$$$$;;;;;$$"',
    '"$$$$$$$$$$$$$$$$$$$$$$$;;;;;$$"',
    '"$$$$$$$$$$$$$$$$$$$$$$$;;;;;$$"',
    '"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'marsh_rushes', spawn: { x: 28, y: 8 } },
    { x: 31, y: 7, w: 1, h: 2, to: 'marsh_hut_island', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The fallen blocks are rocks (Z twice on one rolls them all home); pushed
  // into the bog, they sink into it as something to step on.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'push_rock', x: 6, y: 7, text: 'road_block', rock: true },
    { sprite: 'push_rock', x: 9, y: 6, text: 'road_block', rock: true },
    { sprite: 'push_rock', x: 9, y: 8, text: 'road_block', rock: true },
    { sprite: 'sign', x: 2, y: 6, text: 'road_milestone' },
    { sprite: 'coat_strip', x: 19, y: 5, text: 'road_strip' },
    { sprite: 'marsh_lantern', x: 11, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 20, y: 9, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 29, y: 5, text: 'marsh_lantern', light: 60 },
    { sprite: 'gold_pouch', x: 5, y: 2, text: 'road_purse', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 15, y: 7, text: 'road_slump' },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water', I: 'road_pillar', J: 'road_pillar' },

  // A Reed Stalker, standing on the far side so still you'd take it for a reed.
  npcs: [
    { enemy: 'reed_stalker', x: 25, y: 7, patrol: [21, 28], behaviour: 'disguise' },
  ],
};
