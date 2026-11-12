// THE FIGUREHEAD'S PERCH (Chapter 5, the ghost ship's DEEP PART, optional): the very bow of the Fair Return, out in the open again, in a fog that has
// stars in it. A little forecastle deck (x 1-13) with a save crystal, and the bowsprit running out from it (x 14-26, rows 6-8) to the head, where the
// carved figurehead hangs over the water: the star-shard lodged in her breast has woken her. The way in is the west door (0, rows 6-7) from the flooded bow.
// Scene figurehead_meets (the column x 18, rows 6-8, once): she turns her head; the battle (enemy fairweather, spared figurehead_spared, defeated
// figurehead_beaten). After either, the Wreck Star Shard is yours (the gear star_shard_wreck) and the figurehead hangs dark and still on her bracket.
// No monsters here, and no puzzle: save, then walk out to her.
// Tile key: # hull (solid)   . deck planks   o the bowsprit's planks   ~ the sea and the fog (solid)
export const SHIP_FIGUREHEAD_PERCH = {
  id: 'ship_figurehead_perch',
  name: 'THE FIGUREHEAD\'S PERCH',
  area: 'ghostship',
  music: 'ghostShip',
  ambience: 'ghost_ship',
  vesWell: true,
  // Outdoors, in the fog at the bow (stars in it).
  atmosphere: { fog: 2, rain: 0, drips: 0 },
  haunt: { whispers: ['...stay for the party...', '...nobody leaves...', '...catch me...'] },
  playerStart: { x: 2, y: 7 },

  tiles: [
      '##############################',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
      '#.............~~~~~~~~~~~~~~~#',
      '#.............~~~~~~~~~~~~~~~#',
      '..............ooooooooooooo~~#',
      '..............ooooooooooooo~~#',
      '#.............ooooooooooooo~~#',
      '#.............~~~~~~~~~~~~~~~#',
      '#.............~~~~~~~~~~~~~~~#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
      '##############################',
    ],

  // No tiles change here, but she leans, and the whole room with her.
  list: {},

  doors: [
    { x: 0, y: 6, w: 1, h: 2, to: 'ship_flooded_bow', spawn: { x: 27, y: 9 } },
  ],

  cutscenes: [
    { x: 18, y: 6, w: 1, h: 3, scene: 'figurehead_meets' },
  ],

  textFile: 'interactions/ghostship.txt',
  props: [
    { sprite: 'savepoint', x: 3, y: 7, save: true },
    { sprite: 'gs_figurehead', x: 25, y: 7, text: 'perch_figurehead', until: 'figurehead_meets' },
    { sprite: 'gs_figurehead_dark', x: 25, y: 7, text: 'perch_figurehead_dark', after: 'figurehead_beaten' },
    { sprite: 'gs_figurehead_dark', x: 25, y: 7, text: 'perch_figurehead_dark', after: 'figurehead_spared' },
    { sprite: 'gs_rail_post', x: 2, y: 4 },
    { sprite: 'gs_rail_post', x: 2, y: 10 },
    { sprite: 'gs_rail_post', x: 13, y: 4 },
    { sprite: 'gs_rail_post', x: 13, y: 10 },
    { sprite: 'gs_capstan', x: 8, y: 5, text: 'perch_capstan' },
    { sprite: 'gs_coil', x: 6, y: 9, text: 'deck_coil', flat: true, walkable: true },
    { sprite: 'c5_chain_bollard', x: 12, y: 9, text: 'plank_bollard' },
    { sprite: 'gs_post_lantern', x: 5, y: 4, text: 'perch_lantern' },
    { sprite: 'gs_post_lantern', x: 11, y: 10, text: 'perch_lantern' },
    { sprite: 'gs_puddle', x: 9, y: 7, flat: true, walkable: true },
    { sprite: 'gs_puddle_b', x: 4, y: 9, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 16, y: 10, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 22, y: 4, flat: true, walkable: true },
    { sprite: 'gs_fog_c', x: 20, y: 10, flat: true, walkable: true },
    { sprite: 'gs_fog_a', x: 7, y: 2, flat: true, walkable: true },
    { sprite: 'gs_fog_b', x: 24, y: 11, flat: true, walkable: true },
    { sprite: 'gs_shoe', x: 10, y: 8, flat: true, walkable: true },
    { sprite: 'gs_letter_dropped', x: 7, y: 6, flat: true, walkable: true },
    { sprite: 'gs_shadow_a', x: 3, y: 5, flat: true, walkable: true },
    { sprite: 'gs_shadow_b', x: 11, y: 6, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 15, y: 9, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 19, y: 9, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'hold_wall', '~': 'perch_sea' },

  npcs: [

  ],
};
