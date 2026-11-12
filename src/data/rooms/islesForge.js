// ORLA'S FORGE: the foot of the biggest of the Beacon Isles' lights, made into a smithy. The
// big light's lamp is up at the top of the tower, and it shines straight down through the high
// window into the room: a pale shaft of it stands on the floor all day and all night. Orla Cobb,
// a gruff grey seal, works at her anvil beside the forge she lights from the lamp's oil. Her
// shop (`orla_forge`, src/data/shops.js) sells a little and reforges the Fallen Star (+3) once
// you bring the shard from the Wreck Yard's snapped mast: her TALK menu's "The star sword"
// (src/data/fallenStar.js; the words, with the hold-it-up-to-the-light moment, are in
// text/shops/orla_forge.txt). Walk in with the sword and the shard and it plays as a scene instead
// (isles_star_brought), the shop's topic kept for anyone who missed that. A save point.
// PUZZLE-FREE, no monsters. The way runs through: in from the rope bridge (west), out to the West Light (east).
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   h  the tower's brick (solid)   6  the high window   o  boards

export const ISLES_FORGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_forge',
  // The room's name, for the Room Editor.
  name: "ORLA'S FORGE",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  // Hobnail's forge song, for Orla's too.
  music: 'forge',
  ambience: 'lighthouse',
  // After the chapter the storm is over: no rain on the glass, only the sea below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_lighthouse' },
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  tiles: [
    '####################',
    '#hhhhhhhh66hhhhhhhh#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    'oooooooooooooooooooo',
    'oooooooooooooooooooo',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '####################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'isles_bridge', spawn: { x: 37, y: 9 } },
    { x: 19, y: 9, w: 1, h: 2, to: 'isles_west_light', spawn: { x: 2, y: 11 } },
  ],

  // Walking in with the Fallen Star and the Wreck Yard's shard, Orla hears them hum and does the
  // reforge there and then (isles_star_brought, then the sword in the light as isles_star_held).
  // Just inside each door; `forge` keeps it shut until that reforge is ready, so without the sword
  // or the shard nothing plays. The shop's "The star sword" still works for anyone who missed it.
  cutscenes: [
    { x: 1, y: 9, w: 3, h: 2, scene: 'isles_star_brought', forge: 'orla_forge', until: 'isles_star_held' },
    { x: 16, y: 9, w: 3, h: 2, scene: 'isles_star_brought', forge: 'orla_forge', until: 'isles_star_held' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The big light's beam, down through the high window onto the boards.
    { sprite: 'il_light_shaft', x: 9, y: 6, text: 'forge_shaft', animation: 'il_light_shaft', speed: 0.3, walkable: true, flat: true, glow: [{ dy: -30, bloom: 20, strength: 0.35, flicker: 0, color: '255, 240, 200' }, { dy: -4, pool: 60, strength: 0.5, flicker: 0, color: '255, 240, 200' }] },
    // The forge (lit from the lamp's oil) and Orla at her anvil: Z on her opens the shop.
    { sprite: 'c5_forge', x: 2, y: 3, text: 'forge_fire', animation: 'c5_forge', speed: 0.2 },
    { sprite: 'cf_orla_forge', x: 6, y: 4, shop: 'orla_forge', animation: 'cf_orla_forge', speed: 0.28 },
    { sprite: 'quench_tub', x: 12, y: 3, text: 'forge_tub' },
    { sprite: 'grindstone', x: 14, y: 3, text: 'forge_grind' },
    { sprite: 'c5_barrels', x: 16, y: 2, text: 'forge_oil' },
    { sprite: 'savepoint', x: 15, y: 7, save: true },
    { sprite: 'c5_crates_stack', x: 2, y: 11, text: 'forge_crates' },
    { sprite: 'c5_rope_coil', x: 13, y: 11, text: 'forge_rope', walkable: true, flat: true },
    { sprite: 'sign', x: 4, y: 8, text: 'forge_sign' },
    { sprite: 'c5_chest', x: 17, y: 12, text: 'forge_chest', gives: 'tinder_bun', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    // Lived in (2026-11-08): Orla's oilskin on its peg by the forge, a shelf of tins, a lamp on the
    // far wall, and her tea on a stool beside the anvil. (Clear of isles_star_held's walks.)
    { sprite: 'in_oilskin_peg', x: 5, y: 1, text: 'in_forge_oilskin' },
    { sprite: 'in_shelf_tins', x: 11, y: 1, text: 'in_forge_shelf' },
    { sprite: 'in_wall_lamp', x: 18, y: 1, text: 'in_forge_lamp' },
    { sprite: 'in_stool_mug', x: 8, y: 3, text: 'in_forge_tea' },
    // Second pass: more of a working forge: a lens bench in the light, oil, stores, a rug by the
    // door, a chart and a shelf on the wall. Nothing on the way across (rows 9-10), at Orla's
    // counter, the save crystal or the chest.
    { sprite: 'il_workbench', x: 11, y: 6, text: 'forge_bench' },
    { sprite: 'il_oil_cans', x: 18, y: 4, text: 'forge_oil_cans' },
    { sprite: 'in_tins_crate', x: 5, y: 12, text: 'forge_tins' },
    { sprite: 'c5_crate', x: 8, y: 12, text: 'forge_crate' },
    { sprite: 'c5_barrel', x: 18, y: 7, text: 'forge_barrel' },
    { sprite: 'in_rug_red', x: 13, y: 12, flat: true, walkable: true },
    { sprite: 'in_shelf_neat', x: 15, y: 1, text: 'forge_shelf_neat' },
    { sprite: 'in_chart', x: 7, y: 1, text: 'forge_chart' },
  ],
  tileTexts: { '#': 'forge_wall', h: 'forge_wall', 6: 'forge_window', o: 'forge_floor' },

  // Nobody to fight in a smithy.
  npcs: [],
};
