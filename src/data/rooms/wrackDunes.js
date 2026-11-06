// THE DUNES: wide pale dunes, and a ridge of rock down the middle with no way round. Wind
// blows up out of the sand either side of it (the same gusts Ves rides): step into one and it
// tosses you over to the other side. Every gust has one coming back, so nothing can go
// wrong. In the north-west corner a ring of bank blocks (a pen) holds a hidden crate and a
// door in the cliff into a half-buried hulk (secret_wrack_hulk); a gust at the pen's west
// wall tosses you in, and one inside tosses you out. The sandcastles live here (sand only).
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   :  dune sand   ,  salt grass   N  marram (walk)
//   B  bank block (24): the pen's walls and the ridge (cols 26-28), too high to climb   O  boulder (solid)

export const WRACK_DUNES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_dunes',
  // The room's name, for the Room Editor.
  name: 'THE DUNES',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  vesWell: true,

  tiles: [
    '############################################',
    '#WWWWWWWWWWWWWWWWW::WWWWWWWWWWWWWWWWWWWWWWW#',
    '#:::::::::::::B:::::::B:::BBB::::::::::::::#',
    '#:::::::::::::B:::::::B:::BBB::::::::::::::#',
    '#:::NN:::::O::B:::::::B:::BBB:::::::::N::::#',
    '#:::::::N:::::B:::::::B:::BBB::O:::::::::::#',
    '#:::::::::::::B:::::::B:::BBB::::::::::::::#',
    '#:::::::::::::BBBBBBBBB:::BBB:::::,,:::::::#',
    '#:::::::::::::::::::::::::BBB::::::::::::::#',
    '.:::::::::::::::::::::::::BBB::::::::::::::.',
    '.:::::::::::::::::::::::::BBB:::::::::::O::.',
    '#:::::::::::::::::::::::::BBB::::::::::::::#',
    '#:::::N::::::::::,,:::::::BBB:::::::N::::::#',
    '#::O::::::N::::::::,::::::BBB::::N:::::::::#',
    '#:::::::::::::::::::::::::BBB::::::::::::::#',
    '#:::::::::::::::::::::::::BBB::::::::::::::#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'wrack_gaps', spawn: { x: 36, y: 13 } },
    { x: 43, y: 9, w: 1, h: 2, to: 'wrack_tide_clock', spawn: { x: 2, y: 9 } },
    { x: 18, y: 1, w: 2, h: 1, to: 'secret_wrack_hulk', spawn: { x: 7, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // The wind (src/overworld/windGeyser.js, `gusts`): step in and it tosses you to `to`.
  // West of the ridge: (25,8) and (25,9) toss to the east side; (31,12) and (31,13) toss back.
  // The pen: (13,5) tosses in; (16,5) tosses out to (12,6).
  gusts: [
    { x: 25, y: 8, to: { x: 30, y: 8 } },
    { x: 25, y: 9, to: { x: 30, y: 9 } },
    { x: 31, y: 12, to: { x: 24, y: 12 } },
    { x: 31, y: 13, to: { x: 24, y: 13 } },
    { x: 13, y: 5, to: { x: 18, y: 5 } },
    { x: 16, y: 5, to: { x: 12, y: 6 } },
  ],
  looks: [
    { x: 25, y: 8, text: 'dunes_gust' },
    { x: 25, y: 9, text: 'dunes_gust' },
    { x: 31, y: 12, text: 'dunes_gust' },
    { x: 31, y: 13, text: 'dunes_gust' },
    { x: 13, y: 5, text: 'dunes_gust' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // The hulk's bow and wheel in the pen, the hidden crate, a sign and a purse.
    { sprite: 'c5_hull_lean_b', x: 15, y: 3, text: 'dunes_hulk' },
    { sprite: 'c5_crate', x: 20, y: 5, text: 'dunes_crate', gives: 'winkle_skewer', taken: { sprite: 'c5_crate', text: 'dunes_crate_empty' } },
    { sprite: 'sign', x: 23, y: 9, text: 'dunes_sign' },
    { sprite: 'c5_driftwood_tall', x: 5, y: 8, text: 'landing_driftwood' },
    { sprite: 'sy_dune_grass', x: 9, y: 6, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    { sprite: 'sy_dune_grass', x: 37, y: 6, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.45, walkable: true },
    { sprite: 'gold_pouch', x: 40, y: 14, text: 'dunes_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', B: 'dunes_bank', O: 'landing_rock' },

  // A sandcastle (sand only) at the west (row 4, x 3 to 10), and a PAIR in the east: a sandcastle
  // (x 34 to 37, home row 12) and a shellac (row 13, x 34 to 37) on the same stretch, so they fight
  // together. All clear of the gusts (the nearest, 31,12 and 31,13, is three tiles off), the
  // landing tiles, the doors and the pen. No cutscenes in this room.
  npcs: [
    { enemy: 'sandcastle', x: 6, y: 4, patrol: [3, 10], behaviour: 'wander' },
    { enemy: 'sandcastle', x: 35, y: 12, patrol: [34, 37], behaviour: 'wander' },
    { enemy: 'shellac', x: 36, y: 13, patrol: [34, 37], behaviour: 'patrol' },
  ],
};
