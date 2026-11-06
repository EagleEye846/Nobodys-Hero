// THE GATE OF BELOWTOWN: the buried kingdom's front door. A stone gatehouse
// across the road, a banner hung over it that says WELLCOME (two Ls, and
// nobody's had the heart to say), glow-worm strings and lamps, newt guards in
// helmets too big for them, and, east of the gate, half the town come out to
// see who fell in from the top. Walking in from the Glimmering sets off
// into_belowtown: the crowd can't stop asking whether it's the Hero come back.
// (In Lasthome nobody asked. Here they can't stop.) A purse is tucked in
// behind the barrels in the south-east corner.
// Tile key (see src/overworld/brightTiles.js for how Belowtown draws them):
//   #  cavern rock overhead (solid)       W  old carved stone (solid)
//   V  stone wall hung with glow-worm lamps   H  wall with a red-and-gold banner
//   .  worn flagstone      X  cobbles (the road)     ,  mossy turf
//   I  carved pillar with a hanging lantern (solid)  O  barrel (solid)
export const BELOWTOWN_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_gate',
  // The room's name, for the Room Editor.
  name: 'THE GATE OF BELOWTOWN',
  // The region it's in (see src/data/areas.js): names the title card.
  area: 'belowtown',
  // "Lamps Lit Early" (belowtownTheme.js).
  music: 'belowtown',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'belowtown',

  tiles: [
    '##############################',
    '#WWVWWHWWVWWWWWWWWWWVWWHWWVWW#',
    '#.............WWWW...........#',
    '#.............WWWW...........#',
    '#..,,...,,...,WWWW,,...,,...,#',
    '#..,.,..,.,..,WWWW,.,..,.,..,#',
    '#...,.,..,.,.I....I,.,..,.,..#',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '#............I....I..........#',
    '#...,.,..,.,..WWWW.,.,..,.,..#',
    '#....,,...,,..WWWW..,,...,O..#',
    '#.............WWWW.......OO..#',
    '#..,,...,,...,WWWW,,...,,...,#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates (the west edge, where the
  // King's Road comes in).
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 3, to: 'glimmer_kings_road', spawn: { x: 38, y: 7 } },
    { x: 29, y: 7, w: 1, h: 3, to: 'belowtown_market', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 4, y: 2, w: 1, h: 13, scene: 'into_belowtown' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'wellcome_banner', x: 14, y: 5, text: 'gate_banner', animation: 'wellcome_banner', speed: 0.5, walkable: true },
    { sprite: 'glowworm_string', x: 6, y: 5, animation: 'glowworm_string', speed: 0.4, walkable: true },
    { sprite: 'glowworm_string', x: 22, y: 5, animation: 'glowworm_string', speed: 0.4, walkable: true },
    { sprite: 'glowworm_lamp', x: 3, y: 6, text: 'gate_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 3, y: 10, text: 'gate_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 11, y: 6, text: 'gate_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 11, y: 10, text: 'gate_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'town_signpost', x: 8, y: 6, text: 'gate_signpost' },
    { sprite: 'town_noticeboard', x: 9, y: 5, text: 'gate_noticeboard' },
    { sprite: 'town_barrels', x: 2, y: 13, text: 'gate_barrels' },
    { sprite: 'town_crates', x: 24, y: 3, text: 'gate_crates' },
    { sprite: 'bf_mole_miner_a', x: 20, y: 7, npc: 'bt_gate_mole', animation: 'bf_mole_miner_a', speed: 0.5 },
    { sprite: 'bf_frog_kid_a', x: 19, y: 9, npc: 'bt_gate_frogkid', animation: 'bf_frog_kid_a', speed: 0.4 },
    { sprite: 'bf_frog_kid_b', x: 21, y: 10, npc: 'bt_gate_frogkid2', animation: 'bf_frog_kid_b', speed: 0.45 },
    { sprite: 'bf_newt_guard', x: 12, y: 5, npc: 'bt_gate_newt', animation: 'bf_newt_guard', speed: 0.5 },
    { sprite: 'bf_newt_guard', x: 18, y: 11, npc: 'bt_gate_newt2', animation: 'bf_newt_guard', speed: 0.5, stroll: { path: [[18, 11], [21, 11]], speed: 10, pause: [4, 8], greet: true } },
    { sprite: 'bf_glowworm', x: 5, y: 11, npc: 'bt_gate_lamplighter', animation: 'bf_glowworm', speed: 0.4, stroll: { path: [[5, 11], [11, 11]], speed: 12, pause: [3, 5], greet: true }, glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    { sprite: 'bf_snail_elder', x: 23, y: 11, npc: 'bt_gate_snail', animation: 'bf_snail_elder', speed: 0.5, stroll: { path: [[23, 11], [26, 11]], speed: 4, pause: [3, 7], greet: true } },
    { sprite: 'bf_mole_miner_b', x: 22, y: 6, npc: 'bt_gate_mole2', animation: 'bf_mole_miner_b', speed: 0.5 },
    { sprite: 'bf_beetle_postman', x: 26, y: 6, npc: 'bt_gate_beetle', animation: 'bf_beetle_postman', speed: 0.5 },
    { sprite: 'gold_pouch', x: 27, y: 13, text: 'gate_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing: a front door and a tidy row of tools along the wall.
    { sprite: 'tiny_door', x: 13, y: 1, text: 'town_house_door' },
    { sprite: 'tiny_tools', x: 27, y: 1, text: 'bt_tiny_tools' },
  ],
  tileTexts: { W: 'town_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall', I: 'town_pillar', O: 'town_barrel' },

  // Nobody to fight in town. The crowd east of the gate stays off row 8, the
  // road the scene walks along (x 1 to 13). The folk who walk about (the
  // lamplighter on row 11 west, the second guard and the snail on row 11
  // east) keep to row 11; the crowd cast in the scene stands still.
  npcs: [],
};
