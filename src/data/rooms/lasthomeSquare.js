// LASTHOME: inside the old city's great hall. Its roof is half fallen, and the
// evening comes in through the holes in long shafts; under it, a whole town,
// houses built against the old pillars and the hall's back wall, a cobbled
// square with a market, and lamps everywhere. Along the back wall: the
// healer's (north west, the green door), Teasel's forge next to it, its
// front open on the square, and the inn (north east). Down by the market,
// Corran's and the bakehouse. The chapel's down the lane to the west. The far
// door, east, is barred; Thistle unbars it once Bramble's gone home
// (the_far_door), and it goes out into the dead part of the city.
//
// The houses are big props (src/data/art/lasthome.js): each its own, drawn
// whole, smoke going up from its chimney. They stand `walkable` on blocks of
// cottage-wall tiles, which do the blocking; a doorway tile in the block is
// the way in.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   5  cottage wall, under a house (solid)
//   D  doorway (walk through it; see `doors`)
//   F  flower bed (solid)
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
//   X  cobbles

// The light the houses give off (see roomLights in src/overworld/lamplight.js):
// their lit windows, the lanterns by their doors, and the forge. Each is
// placed from the middle of a house's foot, `dx` across and `dy` up.
const CANDLE = '255, 180, 92';
const LAMP = '255, 156, 68';
const FIRE = '255, 128, 48';
const windows = (...at) => at.map(([dx, dy]) => ({ dx, dy, bloom: 9, strength: 0.4, flicker: 0.15, color: CANDLE }));
const doorLantern = (dx, dy) => [
  { dx, dy, bloom: 11, strength: 0.6, flicker: 0.3, color: LAMP },
  { dx, dy: dy + 20, pool: 44, strength: 0.45, flicker: 0.2, color: LAMP },
];
// A glow on the ground in front of a lit ground-floor window.
const spill = (dx, pool = 40) => ({ dx, dy: 2, pool, strength: 0.28, flicker: 0.1, color: CANDLE });

const HEALER_GLOW = [...windows([-21, -46], [29, -46], [18, -56], [-23, -22]), spill(-23), ...doorLantern(34, -25)];
const INN_GLOW = [...windows([-35, -44], [-1, -44], [37, -44], [-19, -56], [19, -56], [-31, -23], [29, -23]), spill(-31), spill(29), ...doorLantern(10, -25)];
const SMITHY_GLOW = [
  { dx: -1, dy: -24, bloom: 22, strength: 0.75, flicker: 1, color: FIRE },
  { dx: -1, dy: 4, pool: 90, strength: 0.6, flicker: 0.7, color: FIRE },
  { dx: 32, dy: -30, bloom: 8, strength: 0.5, flicker: 0.8, color: FIRE },
];
const CARTER_GLOW = [...windows([-21, -41], [3, -41], [5, -26], [-7, -60]), spill(5, 34), ...doorLantern(-8, -25)];
const BAKEHOUSE_GLOW = [...windows([-24, -27], [22, -27], [14, -45]), spill(-24, 34), spill(22, 34), ...doorLantern(-10, -25)];

export const LASTHOME_SQUARE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lasthome_square',
  // The room's name, for the Room Editor.
  name: 'LASTHOME',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'lasthome',
  // "The Ones Who Stopped Waiting" (lasthomeTheme.js).
  music: 'lasthome',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'village',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,
  // Lit by its own lamps (see src/overworld/lamplight.js): how dark it is
  // between them, by day and by night.
  lamplight: { shade: 0.36, nightShade: 0.24 },

  tiles: [
    '##################################',
    '#555555W555555WWWWWWWWWWW5555555W#',
    '#555555.555555...........5555555.#',
    '#555555.555555...........5555555.#',
    '#555555.555555...........5555555.#',
    '#5555D5.555555..FFFFF....555D555.#',
    '#................................#',
    '#.............I........I........I#',
    '#..........XXXXXXXXXXXX..........#',
    '.......I...XXXXXXXXXXXX...........',
    '...........XXXXXXXXXXXX...........',
    '#55555.....XXXXXXXXXXXX....55555.#',
    '#55555....IXXXXXXXXXXXXI...55555.#',
    '#55555.....XXXXXXXXXXXX....55555.#',
    '#55555.....XXXXXXXXXXXX....55555.#',
    '#55555.....XXXXXXXXXXXX....55555.#',
    '#................................#',
    '#...I.....I............I.....I...#',
    '#................................#',
    '#................................#',
    '#................................#',
    '################DD################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 20 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 21, w: 2, h: 1, to: 'lasthome_gate', spawn: { x: 11, y: 4 } },
    { x: 5, y: 5, w: 1, h: 1, to: 'lasthome_healer', spawn: { x: 6, y: 10 } },
    { x: 28, y: 5, w: 1, h: 1, to: 'lasthome_inn', spawn: { x: 7, y: 11 } },
    { x: 0, y: 9, w: 1, h: 2, to: 'lasthome_chapel', spawn: { x: 12, y: 7 } },
    { x: 33, y: 9, w: 1, h: 2, to: 'city_old_street', spawn: { x: 1, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 15, y: 18, w: 4, h: 1, scene: 'into_lasthome' },
    // A line right down the square, just east of the healer's and the chapel:
    // once Ves is up, you can't head anywhere else without saying goodbye.
    { x: 8, y: 6, w: 1, h: 15, scene: 'bramble_goes_home', after: 'ves_on_her_feet' },
    { x: 26, y: 8, w: 1, h: 4, scene: 'the_far_door', after: 'bramble_goes_home' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lasthome.txt',
  props: [
    // The houses, along the back wall and down by the market. Each stands on
    // its block of wall tiles, walkable itself, and plays its own smoke.
    { sprite: 'house_healer', x: 1, y: 5, text: 'square_healer_house', animation: 'house_healer', speed: 0.42, walkable: true, glow: HEALER_GLOW },
    { sprite: 'house_smithy', x: 8, y: 5, text: 'square_smithy', animation: 'house_smithy', speed: 0.3, walkable: true, glow: SMITHY_GLOW },
    { sprite: 'house_inn', x: 25, y: 5, text: 'square_inn_house', animation: 'house_inn', speed: 0.38, walkable: true, glow: INN_GLOW },
    { sprite: 'house_carter', x: 1, y: 15, text: 'square_carter_house', animation: 'house_carter', speed: 0.45, walkable: true, glow: CARTER_GLOW },
    { sprite: 'house_bakehouse', x: 27, y: 15, text: 'square_bakehouse', animation: 'house_bakehouse', speed: 0.4, walkable: true, glow: BAKEHOUSE_GLOW },
    // Teasel's forge yard, in front of the open front: talk to her to shop.
    { sprite: 'coal_heap', x: 8, y: 6, text: 'square_coal' },
    { sprite: 'anvil', x: 10, y: 6, text: 'square_anvil' },
    { sprite: 'lh_teasel', x: 11, y: 6, shop: 'lasthome_smithy' },
    { sprite: 'quench_tub', x: 12, y: 6, text: 'square_quench' },
    { sprite: 'grindstone', x: 13, y: 6, text: 'square_grindstone' },
    // A rain barrel in the gap between the healer's and the forge, under a
    // gutter from a hole in the hall's roof.
    { sprite: 'barrel', x: 7, y: 6, text: 'square_barrel' },
    { sprite: 'crates', x: 24, y: 6, text: 'square_crates' },
    { sprite: 'well', x: 17, y: 7, text: 'square_well' },
    // The market.
    { sprite: 'savepoint', x: 20, y: 17, save: true },
    { sprite: 'lh_pell', x: 13, y: 9, shop: 'lasthome_market' },
    { sprite: 'market_stall', x: 12, y: 10, text: 'square_stall' },
    { sprite: 'market_stall_fish', x: 19, y: 10, text: 'square_fish_stall' },
    { sprite: 'lh_fisher', x: 21, y: 9, npc: 'lh_fisher' },
    { sprite: 'lh_wren', x: 16, y: 13, npc: 'lh_wren' },
    { sprite: 'lh_corran', x: 24, y: 16, npc: 'lh_corran', until: 'bramble_goes_home' },
    { sprite: 'notice_board', x: 8, y: 8, text: 'square_notices' },
    { sprite: 'pot_pile', x: 22, y: 14, text: 'square_pots' },
    { sprite: 'washing_line', x: 6, y: 13, text: 'square_washing' },
    { sprite: 'locked_door', x: 32, y: 9, text: 'square_far_door', until: 'the_far_door' },
    { sprite: 'locked_door', x: 32, y: 10, text: 'square_far_door', until: 'the_far_door' },
    { sprite: 'light_shaft', x: 9, y: 11, text: 'square_light', walkable: true },
    { sprite: 'light_shaft', x: 25, y: 9, text: 'square_light', walkable: true },
    { sprite: 'street_lamp', x: 6, y: 8, text: 'square_lamp' },
    { sprite: 'street_lamp', x: 22, y: 7, text: 'square_lamp' },
    { sprite: 'street_lamp', x: 11, y: 16, text: 'square_lamp' },
    { sprite: 'bench', x: 13, y: 15, text: 'square_bench' },
  ],
  tileTexts: { W: 'hall_wall', '#': 'hall_wall', I: 'hall_pillar', '5': 'square_house', F: 'square_flowers' },

  // Nobody to fight in town.
  npcs: [],
};
