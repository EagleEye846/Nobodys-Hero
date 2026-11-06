// THE OLD SEAM: the older workings, further down, darker, and quiet. The
// line runs east from a cart standing at the west end, but there's a barricade
// across it in the tunnel (nailed up by the last shift to leave) and another
// across the side line down to a store room. A rider stops short of a
// barricade; an EMPTY cart doesn't, so you climb out and push: stand behind
// the cart at the stub, lean on it, and it goes off by itself and goes through
// the planks.
//
// The trick is the fork at 13,8. It is set with its stem DOWN, so anything
// that rolls in from the west is taken down to the store room, whatever the
// lever says: the lever (seam_sw) only picks the way for a cart coming back UP
// the store line (off: back out west, on: east into the tunnel). So the first
// push can only break the store room's barricade, and leaves the cart at the
// dead end by the chest. The lever is in the store room, past that barricade.
// To get into the tunnel you throw it and send the cart back up the store line:
// push it from the dead end, or ride it up (it stops short of the tunnel's
// barricade) and push from behind. Wrong lever? The cart just goes home to
// the west stub, and a fresh push takes it down to the store room again.
//
// The secret: on the wall at the south-west is a lever with a hand-lettered
// BROKEN sign. It is the switch for a second junction in the east chamber (at
// 33,8) and for the gate in the narrow shaft that goes down from it. With
// that thrown, an empty cart sent along the tunnel turns down the shaft and
// stops at the door at its foot (diggings_lost_seam); climb in at the foot and
// ride through. (Track: row 8 from the stub at 3 to 35; side line col 13 down
// to row 13, east to the stub at 25; shaft col 33 from row 9 down to the door at 33,17.)

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   ^  stalagmite (solid)

export const DIGGINGS_OLD_SEAM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_old_seam',
  // The room's name, for the Room Editor.
  name: 'THE OLD SEAM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  // Darker the further down you go.
  lamplight: { shade: 0.5 },

  tiles: [
    '######################################',
    '######################################',
    '#WWWW#WWWWWWW#########################',
    '#....I.......^#############W#WWWWWWW##',
    '#.O...........#############.I.......^#',
    '#..........O..#############...O......#',
    '#.............#############........O.#',
    'W.............WWWWWWWWWWWWW..........W',
    '......................................',
    '..............#############...........',
    '#.............####WWWW#WWWW######.####',
    '#.............####....I....######.####',
    '#......O......WWWW.........######.####',
    '#^.......I.................######.####',
    '#.............####..O...O..######.####',
    '##################.........######.####',
    '#################################.####',
    '#################################.####',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '......................................',
    '...╶─────────┬───────────────────┬─╴..',
    '.............│...................│....',
    '.............│...................│....',
    '.............│...................│....',
    '.............│...................│....',
    '.............└───────────╴.......│....',
    '.................................│....',
    '.................................│....',
    '.................................│....',
    '.................................│....',
  ],
  // Junctions you can throw (a rail lever, a button or an eye answers to the name).
  switches: [
    { x: 13, y: 8, name: 'seam_sw', stem: 'D' },
    { x: 33, y: 8, name: 'seam_secret', stem: 'L' },
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // The last door, at the foot of the shaft, is the secret one (the cart rides through).
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_switchback', spawn: { x: 38, y: 14 } },
    { x: 37, y: 8, w: 1, h: 2, to: 'diggings_trestle', spawn: { x: 1, y: 8 } },
    { x: 33, y: 17, w: 1, h: 1, to: 'diggings_lost_seam', spawn: { x: 13, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The cart, the junction lever (in the store room), the BROKEN lever (secret) with its sign, two
  // barricades, the shaft gate, signs, the store-room chest (Miner's Helm) and purses.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 3, y: 5, save: true },
    { sprite: 'mine_cart', x: 4, y: 8, cart: 'a', dir: 'R', text: 'cart_stuck' },
    { sprite: 'rail_lever', x: 23, y: 12, switch: 'seam_sw', text: 'seam_lever' },
    { sprite: 'rail_lever', x: 3, y: 13, switch: 'seam_secret', text: 'seam_nope_lever' },
    { sprite: 'sign', x: 4, y: 13, text: 'seam_nope' },
    { sprite: 'barricade', x: 21, y: 8, smash: true, text: 'seam_barricade' },
    { sprite: 'barricade', x: 16, y: 13, smash: true, text: 'seam_barricade' },
    { sprite: 'gate_narrow', x: 33, y: 12, text: 'seam_gate_secret', opensWith: ['seam_secret'], openText: 'seam_gate_open' },
    { sprite: 'sign', x: 2, y: 6, text: 'seam_sign' },
    { sprite: 'sign', x: 8, y: 9, text: 'seam_board' },
    { sprite: 'chest', x: 25, y: 12, text: 'seam_chest', gives: 'miners_helm', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 19, y: 15, text: 'seam_pouch', gold: 105, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 36, y: 5, text: 'seam_pouch_east', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'moles_hard_hat', x: 20, y: 7, text: 'd_hat' },
    { sprite: 'pickaxe_in_rock', x: 7, y: 2, text: 'd_pick' },
    { sprite: 'broken_ladder', x: 12, y: 14, text: 'd_ladder' },
    { sprite: 'ore_sacks', x: 31, y: 5, text: 'd_sacks' },
    { sprite: 'warning_sign', x: 29, y: 9, text: 'seam_warning' },
    { sprite: 'mine_lamp_hung', x: 4, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 15, y: 7, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 31, y: 4, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 21, y: 12, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 10, y: 14, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 1, y: 2, text: 'd_post' },
    { sprite: 'tiny_tools', x: 6, y: 2, text: 'd_tiny_tools' },
    { sprite: 'wall_shoring', x: 11, y: 2, text: 'd_post' },
    { sprite: 'wall_shoring', x: 21, y: 10, text: 'd_post' },
    { sprite: 'tiny_door', x: 27, y: 3, text: 'd_tiny_door' },
    { sprite: 'wall_shoring', x: 33, y: 3, text: 'd_post' },
    { sprite: 'drip_puddle', x: 1, y: 4, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 13, y: 4, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 34, y: 5, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 13, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 7, y: 9, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 30, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 8, y: 14, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 21, y: 14, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', '^': 'd_stalag', W: 'd_face' },

  // A drillbug in the west chamber (row 11, x 2 to 11; the track goes down col 13) and a
  // slagling in the east chamber (row 5, x 32 to 35; the track is on row 8 and the
  // shaft in col 33). Neither is near the cart's path.
  npcs: [
    { enemy: 'drillbug', x: 6, y: 11, patrol: [2, 11] },
    { enemy: 'slagling', x: 32, y: 5, patrol: [32, 35] },
    // A magpie mole in the north-west chamber (row 5, x 6 to 10), away from the save point,
    // the track (row 8) and the door.
    { enemy: 'magpiemole', x: 8, y: 5, patrol: [6, 10] },
  ],
};
