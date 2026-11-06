// HOBNAIL'S FORGE: a low stone room built over a heat vent, the one place in
// Belowtown that's never cold. Hobnail the mole smith hammers on the far side
// of the vent with his goggles up and says as little as he can get away with.
// He sells a pick and goggles, bakes slag bread, and reforges the Fallen Star
// once you bring him the shard (shop `hobnail_forge`: see src/data/fallenStar.js).
// An apprentice who doesn't talk much either, a bat asleep in the rafters
// through all the noise, and a chest behind the coal.
// Tile key: # rock  W carved stone  V lamp wall  H banner wall  . flagstone
import { HEAT_VENT_GLOW } from '../art/belowtownScenes.js';

export const BELOWTOWN_FORGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_forge',
  // The room's name, for the Room Editor.
  name: 'HOBNAIL\'S FORGE',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  music: 'belowtown',
  ambience: 'belowtown_forge',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '################',
    '#WVWWWWHWHWWWVW#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '########D#######',
  ],

  playerStart: { x: 8, y: 10 },

  doors: [
    { x: 8, y: 11, w: 1, h: 1, to: 'belowtown_square', spawn: { x: 13, y: 6 } },
  ],

  cutscenes: [],

  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'heat_vent', x: 7, y: 6, text: 'forge_vent', animation: 'heat_vent', speed: 0.35, walkable: true, glow: HEAT_VENT_GLOW },
    { sprite: 'bf_hobnail_forge', x: 7, y: 5, shop: 'hobnail_forge', animation: 'bf_hobnail_forge', speed: 0.28 },
    { sprite: 'coal_heap', x: 2, y: 3, text: 'forge_coal' },
    { sprite: 'anvil', x: 4, y: 4, text: 'forge_anvil' },
    { sprite: 'quench_tub', x: 11, y: 4, text: 'forge_quench' },
    { sprite: 'grindstone', x: 13, y: 4, text: 'forge_grindstone' },
    { sprite: 'barrel', x: 2, y: 9, text: 'forge_barrel' },
    { sprite: 'crates', x: 3, y: 9, text: 'forge_crates' },
    { sprite: 'barrel', x: 13, y: 9, text: 'forge_barrel' },
    { sprite: 'sign', x: 10, y: 8, text: 'forge_sign' },
    { sprite: 'chest', x: 1, y: 2, text: 'forge_chest', gives: 'ash_candle', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'bf_mole_miner_a', x: 11, y: 7, npc: 'bt_forge_apprentice', animation: 'bf_mole_miner_a', speed: 0.5, stroll: { path: [[4, 7], [11, 7]], speed: 14, pause: [2, 4], greet: true } },
    { sprite: 'bf_bat_sleeper', x: 5, y: 2, npc: 'bt_forge_bat', animation: 'bf_bat_sleeper', speed: 0.6 },
    // Set dressing: a back door, little tools, ore crumbs by the bench (walkable).
    { sprite: 'tiny_door', x: 3, y: 1, text: 'town_house_door' },
    { sprite: 'tiny_tools', x: 8, y: 1, text: 'bt_tiny_tools' },
    { sprite: 'ore_crumbs', x: 9, y: 4, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 14, y: 6, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 4, y: 7, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 9, y: 7, walkable: true, flat: true },
  ],
  tileTexts: { W: 'town_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall' },

  // Nobody to fight in a smithy.
  npcs: [],
};
