// THE MOSSY PILLOW: Belowtown's inn, run by a toad with a moss tuft and a
// ladle she never puts down. A fire, a pot that's always on, a long table and
// three beds that rest you (your HP comes back), a save crystal by the rug, a
// bat asleep in the rafters who has not been woken since before the Sunstone
// dimmed, and a purse that rolled under the last bed.
// Tile key: # rock  h panelled wall  o floorboards  r rug  D doorway
export const BELOWTOWN_INN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_inn',
  // The room's name, for the Room Editor.
  name: 'THE MOSSY PILLOW',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  music: 'belowtown',
  ambience: 'belowtown_inn',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhh#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oorrrrrrrrrooo#',
    '#oorrrrrrrrrooo#',
    '#oorrrrrrrrrooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#######D########',
  ],

  playerStart: { x: 7, y: 11 },

  doors: [
    { x: 7, y: 12, w: 1, h: 1, to: 'belowtown_square', spawn: { x: 5, y: 6 } },
  ],

  cutscenes: [],

  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'fireplace', x: 6, y: 2, text: 'inn_fire', animation: 'fireplace', speed: 0.18 },
    { sprite: 'counter', x: 11, y: 4, text: 'inn_counter' },
    { sprite: 'bf_toad_innkeeper', x: 12, y: 3, npc: 'bt_innkeeper', animation: 'bf_toad_innkeeper', speed: 0.5, stroll: { path: [[12, 3], [8, 3]], speed: 9, pause: [3, 6], greet: true, keepAnim: true } },
    { sprite: 'stove_pot', x: 13, y: 2, text: 'inn_pot', gives: 'mushroom_pasty', taken: { sprite: 'stove', text: 'inn_pot_empty' } },
    { sprite: 'long_table', x: 5, y: 6, text: 'inn_table' },
    { sprite: 'bench', x: 5, y: 7, text: 'inn_bench' },
    { sprite: 'bed', x: 1, y: 9, text: 'inn_bed', rest: true },
    { sprite: 'bed', x: 1, y: 11, text: 'inn_bed', rest: true },
    { sprite: 'bed', x: 13, y: 9, text: 'inn_bed', rest: true },
    { sprite: 'savepoint', x: 10, y: 8, save: true },
    { sprite: 'barrel', x: 14, y: 4, text: 'inn_barrel' },
    { sprite: 'sign', x: 9, y: 11, text: 'inn_rules' },
    { sprite: 'bf_mole_miner_a', x: 4, y: 8, npc: 'bt_inn_mole', animation: 'bf_mole_miner_a', speed: 0.5 },
    { sprite: 'bf_snail_elder', x: 9, y: 6, npc: 'bt_inn_snail', animation: 'bf_snail_elder', speed: 0.5, quest: [
      { needs: ['has:slow_toffee'], take: 'slow_toffee', set: ['q_toffee_asked', 'q_toffee_done'], give: 'warm_teacup', text: 'toffee_done' },
      { needs: ['q_toffee_done'], text: 'toffee_after', append: true },
    ] },
    { sprite: 'bf_bat_sleeper', x: 3, y: 2, npc: 'bt_inn_bat', animation: 'bf_bat_sleeper', speed: 0.6 },
    { sprite: 'gold_pouch', x: 14, y: 11, text: 'inn_pouch', gold: 25, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { h: 'inn_wall', r: 'inn_rug', '#': 'town_rock' },

  // Nobody to fight at an inn.
  npcs: [],
};
