// THE FOOT OF THE TOWER: just inside the door. A round black chamber at the bottom of the Last Light,
// iron pillars holding up the roof, a puddle that has come in under the door and stayed, lamps on
// posts, and the SAVE crystal. The stair up is the door in the north wall. PUZZLE-FREE, no monsters:
// the last breath before the climb. Haddock stays outside with the Bother, tied up at the rock.
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick ribbed with iron (solid)   H  lamp niche   6  slit window
//   D  the door up   .  black flagstones   o  the door out   ;  the puddle   I  iron pillar
// (draft).

export const LASTLIGHT_FOOT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_foot',
  // The room's name, for the Room Editor.
  name: 'THE FOOT OF THE TOWER',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  // "The Long Climb" (src/data/music/lastlightTheme.js), and the howl of the storm on the other side of the wall.
  music: 'lastlight',
  ambience: 'last_light',
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
  vesWell: true,

  tiles: [
    '########################',
    '#hhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhHhh6hhDDhh6hhHhhhh#',
    '#......................#',
    '#..I................I..#',
    '#......................#',
    '#......................#',
    '#......................#',
    '#......................#',
    '#......................#',
    '#......................#',
    '#..I................I..#',
    '#.......;;;;;;;;.......#',
    '###########oo###########',
  ],

  // Where the player starts, in tile coordinates: just in from the door.
  playerStart: { x: 11, y: 11 },

  doors: [
    // Out to the forecourt (reach_foot's door, 19-21 row 18).
    { x: 11, y: 13, w: 2, h: 1, to: 'reach_foot', spawn: { x: 20, y: 19 } },
    // Up the stair.
    { x: 11, y: 2, w: 2, h: 1, to: 'lastlight_stair', spawn: { x: 2, y: 22 } },
  ],

  cutscenes: [],

  textFile: 'interactions/lastlight.txt',
  props: [
    { sprite: 'savepoint', x: 5, y: 6, save: true },
    // Lamps on posts either side of the way to the stair, long out (the tower is dark; the
    // only lantern hint up here is the one that lights after Corrie).
    { sprite: 'c5_lantern_post_unlit', x: 9, y: 5, text: 'foot_lamp' },
    { sprite: 'c5_lantern_post_unlit', x: 14, y: 5, text: 'foot_lamp' },
    { sprite: 'sign', x: 13, y: 3, text: 'foot_sign' },
    { sprite: 'c5_chain_bollard', x: 3, y: 8, text: 'foot_chains' },
    { sprite: 'c5_barrels', x: 17, y: 8, text: 'foot_barrels' },
    { sprite: 'c5_lifebuoy_post', x: 20, y: 6, text: 'foot_buoy' },
    { sprite: 'c5_crate', x: 7, y: 10, text: 'foot_crate' },
    { sprite: 'c5_rope_coil', x: 12, y: 8, text: 'foot_rope', walkable: true, flat: true },
    // (2026-11-08b) A working tower's ground floor: pipes and a chain on the north wall, the tide's
    // scratched marks by the stair door, oil drums waiting to go up with a slick under them, a grating
    // over the drain, and kelp the sea dragged in under the door. Off the way to the stair.
    { sprite: 'll_pipes_run', x: 1, y: 2, text: 'll_pipes' },
    { sprite: 'll_pipes_end', x: 3, y: 2, text: 'll_pipes' },
    { sprite: 'll_chain_hook', x: 7, y: 2, text: 'll_chain_hook' },
    { sprite: 'll_tide_marks', x: 13, y: 2, text: 'll_tide_marks' },
    { sprite: 'll_pipe_riser', x: 17, y: 2, text: 'll_pipes' },
    { sprite: 'll_chain_hook', x: 21, y: 2, text: 'll_chain_hook' },
    { sprite: 'll_drums', x: 19, y: 10, text: 'foot_drums' },
    { sprite: 'll_drum_tipped', x: 21, y: 8, text: 'll_drum_tipped' },
    { sprite: 'll_oil_spill', x: 17, y: 10, flat: true, walkable: true },
    { sprite: 'll_coal_spill', x: 5, y: 10, flat: true, walkable: true },
    { sprite: 'll_grating', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'll_kelp_drag', x: 15, y: 11, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 4, y: 12, flat: true, walkable: true },
    // Wear on the flags.
    { sprite: 'c5_floor_crack', x: 11, y: 6, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 2, y: 10, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 18, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 22, y: 5, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', D: 'foot_stair_door', o: 'foot_door_out', '.': 'll_floor', ';': 'foot_puddle', I: 'll_pillar' },

  // Nobody here: a save room.
  npcs: [],
};
