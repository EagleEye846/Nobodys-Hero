// THE GREAT WEIR: where the old conduit drops into a basin, and the weir that
// turned its water this way and that. Here the weir doesn't still a channel,
// it turns it round: weir up, the top channel runs east to the sluice house
// and the shaft runs north up into it; weir down, the top channel runs back
// west and the shaft runs south, through a grating, into the basin. The way
// out of the basin is through a gate held by a treadle up in the sluice house,
// and the only thing that'll sit on it is a cask, sent along the top channel.
// But it comes out rolling, and rolls straight over the treadle unless a
// rock's just past it, and only you can shift the rock. So you cross and set
// the rock, cross back for the cask, send it, cross again; then down the
// shaft, where the grating stops you a step short and Bramble rides on, to
// hold the basin's side gate open for you.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   j  dry gutter (a current or sluice water can run in it)
//   W  the old city's stone wall (solid)
export const DRAINS_WEIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'drains_weir',
  // The room's name, for the Room Editor.
  name: 'THE GREAT WEIR',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'drains',
  // "Kept Sweet" (drainsTheme.js): drips, and Ves's chalk.
  music: 'drains',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'cave',
  // Dark: only lights and your candle show anything (0 to 1).
  dark: 0.35,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#......WWWWWWWWWWWWWWWWWWWWWW#',
    '#......jjjjjjjjjjjjjjj......W#',
    '#......WWWWWWWWWWWWWWW.WWW.WW#',
    '.......WWWWWWWWWWWWWWW.......#',
    '.......WWWWWWWWWWWWWWW.......#',
    '#......WWWWWWWWWWWWWWWWWjWWWW#',
    '#......WWWWWWWWWWWWWWWWWjWWWW#',
    '#WWWWWWWWWWWWWWWWWWWW...jWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWW.WjWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWW.Wj.WWW#',
    '#WWWWWWWWWWWWWWWWWWWWW.Wj.WWW#',
    '#WWWWWWWWWWWWWWWWW...........#',
    '#WWWWWWWWWWWWWWWWW............',
    '#WWWWWWWWWWWWWWWWW...........#',
    '#WWWWWWWWWWWWWWWWW...........#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 5, w: 1, h: 2, to: 'drains_conduit', spawn: { x: 30, y: 14 } },
    { x: 29, y: 14, w: 1, h: 1, to: 'drains_stair', spawn: { x: 1, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The top channel and the shaft run one way or the other with the weir (a
  // prop's `flow` and `wet`).
  textFile: 'interactions/drains.txt',
  props: [
    { sprite: 'chalk_rock_right', x: 2, y: 2, text: 'weir_chalk' },
    { sprite: 'sign', x: 5, y: 8, text: 'weir_sign' },
    { sprite: 'valve_wheel', x: 4, y: 2, text: 'weir_wheel', lever: 'weir' },
    { sprite: 'valve_wheel', x: 22, y: 6, text: 'weir_wheel', lever: 'weir' },
    { sprite: 'valve_wheel', x: 23, y: 8, text: 'weir_wheel', lever: 'weir' },
    { sprite: 'cask', x: 3, y: 3, text: 'cask', log: true },
    { sprite: 'push_rock', x: 27, y: 5, text: 'weir_rock', rock: true },
    { sprite: 'treadle', x: 25, y: 3, text: 'weir_treadle_house', treadle: 'house' },
    { sprite: 'treadle', x: 20, y: 15, text: 'weir_treadle_basin', treadle: 'basin' },
    { sprite: 'drain_grate', x: 24, y: 10, text: 'drain_grate', gap: true },
    { sprite: 'gate_narrow', x: 22, y: 12, text: 'weir_side_gate', opensWith: ['basin'] },
    { sprite: 'gate_narrow', x: 28, y: 14, text: 'weir_gate', opensWith: ['house'] },
    { sprite: 'rock_stump', x: 1, y: 8, text: 'rock_stump', rockReset: true },
    { sprite: 'gold_pouch', x: 21, y: 9, text: 'weir_purse', gold: 240, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 28, y: 16, text: 'weir_chest', gives: 'penny_bun', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // The top channel and the shaft, running with the weir.
    { sprite: 'current_right', x: 7, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 8, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 9, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 10, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 11, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 12, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 13, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 14, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 15, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 16, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 17, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 18, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 19, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 20, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_right', x: 21, y: 3, text: 'current', flow: 'right', animation: 'current_right', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_left', x: 21, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 20, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 19, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 18, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 17, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 16, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 15, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 14, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 13, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 12, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 11, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 10, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 9, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 8, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_left', x: 7, y: 3, text: 'current', flow: 'left', animation: 'current_left', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_up', x: 24, y: 13, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_up', x: 24, y: 12, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_up', x: 24, y: 11, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_up', x: 24, y: 10, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_up', x: 24, y: 9, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_up', x: 24, y: 8, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_up', x: 24, y: 7, text: 'current', flow: 'up', animation: 'current_up', speed: 0.1, wet: ['weir'] },
    { sprite: 'current_down', x: 24, y: 7, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_down', x: 24, y: 8, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_down', x: 24, y: 9, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_down', x: 24, y: 10, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_down', x: 24, y: 11, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_down', x: 24, y: 12, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
    { sprite: 'current_down', x: 24, y: 13, text: 'current', flow: 'down', animation: 'current_down', speed: 0.1, wet: ['!weir'] },
  ],
  tileTexts: { W: 'conduit_wall', '#': 'conduit_wall', j: 'conduit_channel' },

  // A Slipjack in the sluice house, a Clinker in the basin.
  npcs: [
    { enemy: 'slipjack', x: 23, y: 5, patrol: [22, 26] },
    { enemy: 'clinker', x: 26, y: 15, patrol: [23, 27] },
  ],
};
