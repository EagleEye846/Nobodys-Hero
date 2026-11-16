// THE HALL FALLING: the south end of King Peptup's hall, once the duel has
// cracked the pillars that hold it up. You only ever see it in one scene
// (the_hall_falls): the folk run for the great doorway at the bottom of the
// room, the hero and Ves hold it open for them, and at the very end Bramble
// comes down the tunnel at the top on a log. There's nothing to do here but
// watch, so it has no doors and no props: everything that moves, cracks or
// falls is a scene actor (src/data/art/finaleScenes.js), and the roof coming
// down is the `stage` step's rubble and shafts (src/overworld/stageShow.js).
//
// It's the same hall as belowtown_throne, seen from the doors end (the carved
// pillars along both sides, the carpet down the middle), with the doorway made
// wide for the great doorway's arch (the scene draws it over the bottom wall:
// five tiles across, x 11 to 15), with a little passage running on out of the bottom of the room for the folk to run along.
//
// Tile key: # rock  W carved stone  V lamp wall  H banner wall  . flagstone
//   r  royal carpet    I  carved pillar with a lantern (solid)   D  doorway
import { R3C_PROPS } from '../r3cLife.js';

export const BELOWTOWN_COLLAPSE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_collapse',
  // The room's name, for the Room Editor.
  name: 'THE HALL FALLING',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  music: null,
  ambience: 'hall_falling',
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##########################',
    '#VWHWVWHWWWWVVWWWWHWVWHWV#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...I.......rrr.......I..#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...I.......rrr.......I..#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '#...I.......rrr.......I..#',
    '#...........rrr..........#',
    '#...........rrr..........#',
    '###########DDDDD##########',
    '###########.....##########',
    '###########.....##########',
    '###########.....##########',
  ],

  // Where the player starts: just inside the doorway, where the scene's
  // trigger is (the scene walks everyone to where they stand).
  playerStart: { x: 13, y: 20 },

  // No doors: this room is only ever left by the chapter ending.
  doors: [],

  // Arriving plays the scene.
  cutscenes: [
    { x: 13, y: 20, w: 1, h: 1, scene: 'the_hall_falls' },
  ],

  textFile: 'interactions/belowtown.txt',
  // Left from the welcome show and the duel, along the walls (clear of where the
  // folk run, the pillars and the doorway): benches knocked over, the barrels
  // for afterwards, and the show's confetti and streamers trodden into the floor.
  props: [
    ...(R3C_PROPS.belowtown_collapse ?? []),
    { sprite: 'bench', x: 2, y: 10, text: 'collapse_bench' },
    { sprite: 'bench', x: 23, y: 6, text: 'collapse_bench' },
    { sprite: 'town_barrels', x: 1, y: 20, text: 'collapse_barrels' },
    { sprite: 'town_barrels', x: 24, y: 3, text: 'collapse_barrels' },
    { sprite: 'bf_confetti_a', x: 6, y: 4, flat: true, walkable: true },
    { sprite: 'bf_confetti_b', x: 19, y: 9, flat: true, walkable: true },
    { sprite: 'bf_confetti_a', x: 7, y: 15, flat: true, walkable: true },
    { sprite: 'bf_streamer', x: 20, y: 4, flat: true, walkable: true },
    { sprite: 'bf_confetti_b', x: 18, y: 18, flat: true, walkable: true },
    { sprite: 'bench', x: 23, y: 15, text: 'collapse_bench' },
    { sprite: 'bf_confetti_b', x: 8, y: 7, flat: true, walkable: true },
    { sprite: 'bf_confetti_a', x: 17, y: 12, flat: true, walkable: true },
    { sprite: 'bf_streamer', x: 6, y: 19, flat: true, walkable: true },
    { sprite: 'bf_confetti_a', x: 21, y: 2, flat: true, walkable: true },
    { sprite: 'bf_confetti_b', x: 3, y: 16, flat: true, walkable: true },
  ],
  tileTexts: { W: 'hall_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall', I: 'town_pillar', r: 'throne_carpet' },

  // After the credits (tuck_afterwards) the hall is left wrecked: cracks, heaps
  // of stone about the pillars, bits of crystal, dust settling (see
  // src/overworld/atmosphere.js). Only floor decals and drifting dust: no
  // light, nothing that could be mistaken for a shape. `clear` is where Tuck
  // walks and the shadow falls, kept free of stones.
  wreck: {
    during: 'tuck_afterwards',
    piles: [[4, 9], [22, 9], [4, 14], [22, 14], [4, 19], [22, 19]],
    shards: [[6, 6], [19, 5], [9, 12], [17, 13], [7, 17], [20, 17], [12, 4], [14, 15]],
    clear: { x: 10, y: 7, w: 7, h: 5 },
    cracks: 8,
  },

  // Nobody to fight: it's a story scene, and the roof is coming down.
  npcs: [],
};
