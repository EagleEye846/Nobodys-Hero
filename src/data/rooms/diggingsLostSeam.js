// SEAM NINE (secret): the seam the maps leave out. It's a short branch off the
// old line, reached by the BROKEN lever in the old seam, and then only by a
// cart pushed down a shaft. Nobody has been in here for a very long time, and
// whoever was last in left tidily: a row of hard hats on nails, a table laid
// for a break, a tally board that stops mid-week. A chest (Rivet Handle for
// Ves), a purse, and the Deep Star Shard, standing in a crack at the back of
// the room. The way out is the way in: the cart stub at 13,9 is the end of the
// line; ride it back up the shaft or just walk.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   ^  stalagmite (solid)

export const DIGGINGS_LOST_SEAM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_lost_seam',
  // The room's name, for the Room Editor.
  name: 'SEAM NINE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  // "Left Tidy" (src/data/music/seamNineTheme.js).
  music: 'seamNine',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  // Darker the further down you go.
  lamplight: { shade: 0.55 },

  tiles: [
    '#############.################',
    '#############.################',
    '####WWWWWWWWW.WWWWWWWWWWWW####',
    '###O......................O###',
    '###........................###',
    '###........................###',
    '###.....I..................###',
    '###......................O.###',
    '###........................###',
    '###...............I........###',
    '###........................###',
    '###........................###',
    '###.O....^...........^.....###',
    '###........................###',
    '##############################',
    '##############################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '.............│................',
    '.............│................',
    '.............│................',
    '.............│................',
    '.............│................',
    '.............│................',
    '.............│................',
    '.............│................',
    '.............│................',
    '.............╵................',
    '..............................',
    '..............................',
    '..............................',
    '..............................',
    '..............................',
    '..............................',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 13, y: 1 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // Back up the shaft to the old seam (the door has rail in it; so does the spawn).
  doors: [
    { x: 13, y: 0, w: 1, h: 1, to: 'diggings_old_seam', spawn: { x: 33, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The chest, the shard (it glows a little, and takes itself off the shelf when you
  // pick it up), the hats, the table laid for a break, the tally board.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save point near the way in (added so the mines have more of them).
    { sprite: 'savepoint', x: 11, y: 9, save: true },
    { sprite: 'chest', x: 22, y: 5, text: 'lost_chest', gives: 'rivet_handle', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'star_shard', x: 5, y: 11, text: 'lost_shard', gives: 'star_shard_deep', taken: { gone: true }, light: 24, notice: true },
    { sprite: 'moles_hard_hat', x: 6, y: 3, text: 'lost_hats' },
    { sprite: 'moles_hard_hat', x: 7, y: 3, text: 'lost_hats' },
    { sprite: 'moles_hard_hat', x: 8, y: 3, text: 'lost_hats' },
    { sprite: 'moles_hard_hat', x: 9, y: 3, text: 'lost_hats' },
    { sprite: 'moles_hard_hat', x: 10, y: 3, text: 'lost_hats' },
    { sprite: 'sign', x: 17, y: 5, text: 'lost_board' },
    { sprite: 'warning_sign', x: 12, y: 6, text: 'lost_sign' },
    { sprite: 'table', x: 15, y: 11, text: 'lost_table' },
    { sprite: 'bench', x: 18, y: 12, text: 'lost_bench' },
    { sprite: 'toolbox', x: 23, y: 4, text: 'd_toolbox' },
    { sprite: 'ore_sacks', x: 4, y: 5, text: 'd_sacks' },
    { sprite: 'spoil_heap', x: 20, y: 3, text: 'd_spoil' },
    { sprite: 'mine_lamp_hung', x: 14, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 5, y: 8, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 24, y: 9, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 11, y: 12, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 25, y: 12, text: 'lost_pouch', gold: 160, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 5, y: 2, text: 'd_post' },
    { sprite: 'tiny_tools', x: 18, y: 2, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 23, y: 2, text: 'd_post' },
    { sprite: 'drip_puddle', x: 12, y: 3, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 9, y: 4, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 19, y: 4, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 5, y: 5, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 11, y: 7, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'ore_crumbs', x: 16, y: 7, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 6, y: 9, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 22, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 11, y: 11, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 6, y: 13, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 26, y: 13, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', '^': 'd_stalag', W: 'd_face' },

  // One slagling, warm and stubborn, in the south half of the room (row 11, x 16 to 23);
  // the cart stub and the shaft are in column 13.
  npcs: [
    { enemy: 'slagling', x: 18, y: 11, patrol: [16, 23] },
  ],
};
