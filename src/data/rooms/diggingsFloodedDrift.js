// THE FLOODED DRIFT: a stretch of the workings that filled with water when a
// pump gave out. The diggers left plank causeways over the lake and the way
// across is by them, but the water has come up over parts of the planks. It's
// a water puzzle, all sluices and levels (the carts are next door, not here):
//
//   THE PUMP (the lever on the little pump house, 18-21 x 4-7). It's at the
//   end of a footbridge (row 6) with three rotten planks in it: you'd go
//   straight through; Ves is light enough (Q to steer her, pull it). Running,
//   it drains the water over the start of the upper causeway (row 12, x 8-12).
//   Until then you can't set foot on the causeway at all.
//   THE WHEEL (an iron wheel at the far end of the upper causeway, 25,12). It's
//   a see-saw, the lake has to go somewhere: turned, it floods the middle of
//   the upper deck (row 12, x 15-19) and drains the west half of the lower deck
//   (row 14, x 15-20, flooded until then). Turned back, it swaps them again.
//   Nobody can be standing in the water it would send (it won't turn), so
//   nothing can strand anyone: from the east end of the upper deck the lower
//   deck is always a way round, or the upper one is.
//   THE FLOAT PLATE (a pressure board on the upper deck, 22,12) and THE DRAIN
//   WHEEL (on the east bank, 32,13). Together they keep the east half of the
//   lower deck (row 14, x 22-29) dry: it's dry while someone stands on the
//   plate, and for good once the drain wheel is turned. Neither alone does
//   what you need, and a person on the plate can't be anywhere else.
//   THE LOG (6,12, the end of the west bank). Lean on it and it rolls, east,
//   along whatever dry planking there is, and keeps rolling until something is
//   in the way: the water is its brake. It sinks in the gap in the lower deck
//   (30,14) to make the last stepping-stone to the east bank.
//
// THE WAY THROUGH (the aha is that the east half of the lower deck needs two
// people at once, and that the water, not you, is what stops the log):
//   1. Ves pulls the pump. (The planks.)
//   2. Someone walks the dry upper deck to the wheel and turns it: the middle of
//      the upper deck floods, the west half of the lower deck drains.
//   3. The hero leans on the log (from 5,12). It rolls along the causeway and
//      STOPS at the water (14,12), right over the first spur. Do it before the
//      wheel and it rolls the whole deck and jams against the wheel (the stump
//      puts it back). Ves standing in its way would stop it too.
//   4. The hero goes round by the little landing (13-14, 11) and leans on it
//      from the north: it rolls down the spur onto the lower deck and stops at
//      the post (14,14).
//   5. Ves goes along the (now dry) lower deck, up the second spur (21,13) and
//      stands on the float plate (22,12). Now the east half of the lower deck
//      is dry, as long as she stays put.
//   6. The hero goes down the landing (13,13), leans on the log from the west
//      (13,14), and it rolls the whole lower deck and drops into the gap. He
//      walks across the log's back, to the drain wheel, and turns it. Now the
//      east half is dry for good: Ves comes off the plate and walks over.
// Every wrong shove is undone by the stump at the start (2,10), which puts the
// log back on the bank (the wheels stay as you left them), and by leaving the
// room and coming back. The sluices never trap anyone: a lever won't turn with
// anyone or the log in the water it would send, and the plate's water waits
// for whoever's standing in it to step out.
//
// The water is `wet` props (water that's only there while its sluice says so,
// from the Hushwood's millrace); the plate is a treadle, the same as the
// Hushwood's; the log is the Hushwood's log. Nothing here is a cart.
// The chest (Glint Sugar) is on a separate islet in the east (28-30, 6-8), a
// one-tile gap of water off the east bank: roll a log from the bank into the
// gap (the logs at 35,7 and 35,9, lean on one from the east) and it sinks to
// make a stepping-stone. That's the extra, and it works from the start.
// Arrival: the trestle's cart rides in at 1,12 and rolls on along the short
// west-bank track to the parked cart; a cart here rides back to the trestle.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid, standing)
//   .  packed dirt floor
//   ~  flood water (solid; a log shoved in sinks and makes a stepping-stone)
//   o  plank causeway (walkable; sluice water can cover it)   J  snapped timber (solid, standing)


export const DIGGINGS_FLOODED_DRIFT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_flooded_drift',
  // The room's name, for the Room Editor.
  name: 'THE FLOODED DRIFT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js).
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine_flooded',
  // How it rings (a narrow drift: ECHOES in src/audio/music.js).
  echo: 'tunnel',
  // Darker the further down you go.
  lamplight: { shade: 0.52 },

  tiles: [
    '########################################',
    '########WWWWWWWWWWWWWWWWWWWWWWWW########',
    '##WWWWWW~~~~~~~~~~~~~~~~~~~~~~~~WWWWW###',
    '#W......~~~~~~~~~~~~~~~~~~~~~~~~q....WW#',
    '#.......~~~~~~~~~~....~~~J~~~~~~.......#',
    '#..qOqq.~~~~~~~~~~....~~~~~~~~~~....O..#',
    '#..qqqq.oooooooooo....~~~~~~...~......q#',
    '#..qq...~~~~~~~~~~....~~~~~~...~......q#',
    '#.......~~~~~~~~~~~~~~~~~~~~...~......q#',
    '#.....O.~I~~~~~~~~~~~~~I~~~~~~~~......q#',
    '#.......~~~~~~~~J~~~~~~~~~~~~~~~......q#',
    'W.......~~~~~oo~~~~~~~~~~~~~~~~~.......#',
    '........oooooooooooooooooo~~~~~~.......W',
    '........~~~~~oo~~~~~~o~~~~~~~~~~........',
    '###..##.~~~~~ooooooooooooooooo~oqq......',
    '########~~~~~~I~~~~~~~~~~~~~~~~~########',
    '########################################',
    '########################################',
  ],

  // The track, laid over the floor (see the mine-cart notes in the builders' guide).
  rails: [
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '.╶───╴..................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
  ],
  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 12, w: 1, h: 2, to: 'diggings_trestle', spawn: { x: 38, y: 11 } },
    { x: 39, y: 13, w: 1, h: 2, to: 'diggings_cave_in', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The cart (rides back to the trestle), the log at the end of the bank and the stump that
  // puts it back, the pump lever on the pump house, the rotten planks (Ves only), the wheel,
  // the float plate and the drain wheel, the water over the causeways (from the pump, the
  // wheel, the plate and the drain wheel), the two logs and the chest on the islet, signs,
  // a purse on the pump house and one on the islet.
  textFile: 'interactions/diggings.txt',
  props: [
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 2, y: 4, save: true },
    { sprite: 'mine_cart', x: 4, y: 12, cart: 'a', text: 'cart_stuck' },
    // The stump that puts the log (and the party) back; the wheels stay as they are.
    { sprite: 'rock_stump', x: 2, y: 10, text: 'drift_stump', rockReset: true },
    // The log that does the work: rolls east along the upper deck as far as the water lets it.
    { sprite: 'roll_log', x: 6, y: 12, text: 'drift_start_log', log: true },
    { sprite: 'lever', x: 20, y: 5, lever: 'pump', text: 'drift_lever' },
    { sprite: 'rotten_planks', x: 11, y: 6, text: 'rotten_planks', gap: true },
    { sprite: 'rotten_planks', x: 12, y: 6, text: 'rotten_planks', gap: true },
    { sprite: 'rotten_planks', x: 13, y: 6, text: 'rotten_planks', gap: true },
    // The wheel at the end of the upper deck (floods the middle of the upper deck, 15-19, and drains the lower deck's west half, 15-20).
    { sprite: 'valve_wheel', x: 25, y: 12, lever: 'valve', text: 'drift_valve' },
    // The float plate: a treadle. While someone stands on it the east half of the lower deck is dry.
    { sprite: 'treadle', x: 22, y: 12, text: 'drift_plate', treadle: 'plate' },
    // The drain wheel on the east bank: keeps the east half of the lower deck dry for good.
    { sprite: 'valve_wheel', x: 32, y: 13, lever: 'drain', text: 'drift_drain' },
    // Water over the start of the upper deck (gone when the pump runs).
    { sprite: 'water_flow', x: 8, y: 12, text: 'drift_water', wet: ['!pump'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 9, y: 12, text: 'drift_water', wet: ['!pump'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 10, y: 12, text: 'drift_water', wet: ['!pump'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 11, y: 12, text: 'drift_water', wet: ['!pump'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 12, y: 12, text: 'drift_water', wet: ['!pump'], animation: 'water_flow_side', speed: 0.15 },
    // Water over the middle of the upper deck (there when the wheel is turned) and over the west half of the lower deck (there until it is).
    { sprite: 'water_flow', x: 15, y: 12, text: 'drift_water', wet: ['valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 16, y: 12, text: 'drift_water', wet: ['valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 17, y: 12, text: 'drift_water', wet: ['valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 18, y: 12, text: 'drift_water', wet: ['valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 19, y: 12, text: 'drift_water', wet: ['valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 15, y: 14, text: 'drift_water', wet: ['!valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 16, y: 14, text: 'drift_water', wet: ['!valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 17, y: 14, text: 'drift_water', wet: ['!valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 18, y: 14, text: 'drift_water', wet: ['!valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 19, y: 14, text: 'drift_water', wet: ['!valve'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 20, y: 14, text: 'drift_water', wet: ['!valve'], animation: 'water_flow_side', speed: 0.15 },
    // Water over the east half of the lower deck (gone while the plate is held or once the drain wheel is turned).
    { sprite: 'water_flow', x: 22, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 23, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 24, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 25, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 26, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 27, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 28, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'water_flow', x: 29, y: 14, text: 'drift_water', wet: ['!plate', '!drain'], animation: 'water_flow_side', speed: 0.15 },
    { sprite: 'roll_log', x: 35, y: 7, text: 'drift_log', log: true },
    { sprite: 'roll_log', x: 35, y: 9, text: 'drift_log', log: true },
    { sprite: 'chest', x: 28, y: 7, text: 'drift_chest', gives: 'glint_sugar', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 29, y: 6, text: 'drift_pouch_islet', gold: 95, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 19, y: 7, text: 'drift_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 6, y: 11, text: 'drift_sign' },
    { sprite: 'warning_sign', x: 7, y: 14, text: 'drift_warning' },
    { sprite: 'broken_ladder', x: 3, y: 4, text: 'd_ladder' },
    { sprite: 'ore_sacks', x: 2, y: 8, text: 'd_sacks' },
    { sprite: 'moles_hard_hat', x: 34, y: 13, text: 'd_hat' },
    { sprite: 'mine_lamp_hung', x: 5, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 35, y: 3, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 7, y: 11, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 32, y: 11, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 19, y: 4, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    // Set dressing: shoring timbers on the walls, and loose stones, spilled
    // ore and a drip or two on the floor (walkable: in nobody's way).
    { sprite: 'wall_shoring', x: 7, y: 2, text: 'd_post' },
    { sprite: 'tiny_tools', x: 34, y: 2, text: 'd_tiny_tools' },
    { sprite: 'floor_pebbles', x: 32, y: 4, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 36, y: 4, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 9, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 3, y: 7, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 32, y: 9, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 5, y: 10, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'd_rock', O: 'd_ore', I: 'd_post', J: 'd_snapped', '~': 'd_water', o: 'd_planks', W: 'd_face' },

  // A drillbug on the west bank (row 8, x 3 to 6; the log, the rail and the stump are
  // south of it) and a slagling on the east bank's north shore (row 4, x 33 to 37; the
  // logs are at rows 7 and 9, the drain wheel at row 13).
  npcs: [
    { enemy: 'drillbug', x: 4, y: 8, patrol: [3, 6] },
    { enemy: 'slagling', x: 35, y: 4, patrol: [33, 37] },
  ],
};
