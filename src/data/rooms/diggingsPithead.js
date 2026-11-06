// THE PITHEAD: the top of the mines, where the folk's working shaft comes up
// under the Sunstone's light. Belowtown's back way down ends here. It should
// be the busiest place in the Diggings, and it is the quietest: the shift
// board is full, and every miner on it has stopped work, because the light
// has started going and nobody likes digging in the dark (two moles are
// left, being brave about it). A save point, a covered shaft with a winch over
// it, and the first look at rails: a lone ore cart on a short run of track
// you can climb in and take for a rattle, just to see what it does.
// No monsters: it's the top of the line.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   0  the shaft: a drop, boarded over with a rope round it (solid)
//   ^  stalagmite (solid)

export const DIGGINGS_PITHEAD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_pithead',
  // The room's name, for the Room Editor.
  name: 'THE PITHEAD',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  vesWell: true,

  tiles: [
    '##################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#................................#',
    '#..I.....I...0000....I..hhhhhh...#',
    '#............0000.......hhhhhh...#',
    '#.......................hhhhhh...#',
    '#...OO.........................O.#',
    'W................................W',
    '..................................',
    '..................................',
    '#................................#',
    '#................................#',
    '#.O..........................OO..#',
    '#...........................^....#',
    '#..I......I...........I..........#',
    '#.....^..........................#',
    '##################################',
    '##################################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '.....╶────────────────╴...........',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // West: back up to the king's hall (belowtown_throne's back door). East: the yard.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'belowtown_throne', spawn: { x: 24, y: 16 } },
    { x: 33, y: 8, w: 1, h: 2, to: 'diggings_cart_yard', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The save crystal, the shaft and its winch, the shift board, the foreman's office
  // sign, tools and sacks, a hard hat on a nail, and a purse by the ladder. The
  // ore cart on the demonstration track is a real cart: Z beside it to climb in.
  textFile: 'interactions/diggings.txt',
  props: [
    { sprite: 'savepoint', x: 6, y: 6, save: true },
    { sprite: 'mine_winch', x: 14, y: 5, text: 'pit_winch' },
    { sprite: 'warning_sign', x: 12, y: 5, text: 'pit_warning' },
    { sprite: 'sign', x: 19, y: 6, text: 'pit_tally' },
    { sprite: 'sign', x: 27, y: 6, text: 'pit_office' },
    { sprite: 'toolbox', x: 17, y: 5, text: 'd_toolbox' },
    { sprite: 'ore_sacks', x: 2, y: 4, text: 'd_sacks' },
    { sprite: 'ore_sacks', x: 2, y: 5, text: 'd_sacks' },
    { sprite: 'spoil_heap', x: 27, y: 12, text: 'd_spoil' },
    { sprite: 'moles_hard_hat', x: 22, y: 2, text: 'pit_hat' },
    { sprite: 'pickaxe_in_rock', x: 31, y: 2, text: 'd_pick' },
    { sprite: 'broken_ladder', x: 31, y: 15, text: 'd_ladder' },
    { sprite: 'mine_lamp_hung', x: 8, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 20, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 5, y: 11, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 30, y: 9, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 17, y: 9, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'gold_pouch', x: 32, y: 15, text: 'pit_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'mine_cart', x: 6, y: 13, cart: 'demo', text: 'cart_stuck' },
    { sprite: 'bf_mole_miner_a', x: 11, y: 10, npc: 'mole_sedge', animation: 'bf_mole_miner_a', speed: 0.5 },
    { sprite: 'bf_mole_miner_b', x: 19, y: 11, npc: 'mole_mattock', animation: 'bf_mole_miner_b', speed: 0.5, quest: [
      { needs: ['has:mattock_letter'], take: 'mattock_letter', set: 'q_letter_read', give: 'mattock_reply', text: 'letter_in' },
    ] },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 1, y: 1, text: 'd_post' },
    { sprite: 'tiny_tools', x: 10, y: 1, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 15, y: 1, text: 'd_post' },
    { sprite: 'wall_shoring', x: 21, y: 1, text: 'd_post' },
    { sprite: 'tiny_door', x: 26, y: 1, text: 'd_tiny_door' },
    { sprite: 'ore_crumbs', x: 1, y: 2, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 24, y: 2, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 11, y: 4, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 21, y: 4, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 16, y: 5, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 30, y: 5, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'drip_puddle', x: 14, y: 8, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'ore_crumbs', x: 17, y: 8, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 30, y: 8, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 3, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 20, y: 10, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 9, y: 12, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 25, y: 12, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 1, y: 15, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 4, y: 15, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 8, y: 15, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 16, y: 15, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 28, y: 15, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', h: 'd_timber_wall', O: 'd_ore', I: 'd_post', '^': 'd_stalag', '0': 'pit_shaft', W: 'd_face' },

  // No monsters: it's the way in. (Two mole miners stand about; they talk.)
  npcs: [
  ],
};
