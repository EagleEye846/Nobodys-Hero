// THE AIR SHAFT: behind the Pithead's back corner, an old shaft the diggers
// cut straight up through the rock to let the bad air out, long before the
// lift. They went up and down it on ropes, and their iron eye-bolts are still
// hammered into the face, all the way up: two pitches, with a plank landing
// between them, and a timbered gallery at the top where the last shift kept
// its spare kit (a chest). A ring climb (see src/overworld/climbing.js), harder
// than the Chimney in the Glimmering: each pitch has one long catch straight
// across, which wants a big swing (four tiles on the lower pitch, five on the
// upper). Ves comes up after you. To come back, stand on a clifftop ring and
// face down to rope down. Optional, and nothing to fight: the climb is the
// challenge.
//
// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face with ore seams (solid)
//   h  timber-framed wall (solid)   O  ore rock (solid)   I  timber post (solid)
//   J  broken post (solid)   .  packed dirt floor   o  planks   q  gravel
//   ^  stalagmite (solid)
import { DIGGINGS_DRESSING } from '../diggingsDressing.js';

export const DIGGINGS_AIR_SHAFT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'diggings_air_shaft',
  // The room's name, for the Room Editor.
  name: 'THE AIR SHAFT',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'diggings',
  // "Down the Line" (diggingsTheme.js), as at the Pithead.
  music: 'diggings',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'mine',
  // How it rings (a narrow drift: ECHOES in src/audio/music.js).
  echo: 'tunnel',
  vesWell: true,

  // The shaft's faces are drawn as broken rock, not coursed wall (src/overworld/cragRock.js).
  crag: [{ x: 0, y: 5, w: 20, h: 23 }],

  tiles: [
    '####################',
    '####################',
    '#####hhWWhhhWhh#####',
    '####O.qoooooo.qJ####',
    '####..q.oooo...#####',
    '#####WWWWWW..WW#####',
    '#####WWWWWWWWWWW####',
    '####WWWWWWWWWWW#####',
    '###WWWWWWWWWWWWWW###',
    '###WWWWWWWWWWWWWW###',
    '###WWWWWWWWWWWWWW###',
    '##WWWWWWWWWWWWWWW###',
    '##WWWWWWWWWWWWWWWW##',
    '###WWWWWWWWWWWWWWW##',
    '###WWWWWW..WWWWWWW##',
    '###W.ooooooooo.q.J##',
    '##O..qoooooooo..W###',
    '###WWWWWWWWWWWWWW###',
    '##WWWWWWWWWWWWWWWW##',
    '##WWWWWWWWWWWWWWWW##',
    '##WWWWWWWWWWWWWWWW##',
    '##WWWWWWWWWWWWWWWW##',
    '###WWWWWWWWWWWWWWW##',
    '##WWWWWWWWWWWWWWWW##',
    '##WWWWWWWWWWWWWWWWW#',
    '##WWWWWWWWWWWWWW####',
    '###WWWWW..WWWWWWWW##',
    '##I..q.......q.WWO##',
    '#O..q....qq.....q.##',
    '##^.....q....q..^###',
    '###J.q..........####',
    '#####.q....q.#######',
    '########....########',
    '########....########',
  ],

  // Where the player starts, in tile coordinates: just in from the Pithead.
  playerStart: { x: 9, y: 31 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // South, back out into the Pithead's back corner.
  doors: [
    { x: 8, y: 33, w: 4, h: 1, to: 'diggings_pithead', spawn: { x: 29, y: 2 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The lower pitch: hook the first bolt from 5,27; a step up and across, a
  // long catch four tiles straight across (pump the swing high first), a step
  // up, straight up, and the clifftop ring at the landing's edge (13,16).
  // The upper pitch: hook the first bolt from 14,15; a step up and across,
  // a long catch five tiles straight across, two steps up, and the ring at
  // the gallery's edge (7,4). Roping down: 7,4 lands you on the landing at
  // 7,15, and 13,16 at the foot at 13,27.
  textFile: 'interactions/diggings.txt',
  props: [
    ...(DIGGINGS_DRESSING.diggings_air_shaft ?? []),
    { sprite: 'sign', x: 7, y: 28, text: 'shaft_sign' },
    // The lower pitch.
    { sprite: 'swing_ring', x: 5, y: 25 },
    { sprite: 'swing_ring', x: 7, y: 23 },
    { sprite: 'swing_ring', x: 11, y: 23 },
    { sprite: 'swing_ring', x: 13, y: 21 },
    { sprite: 'swing_ring', x: 13, y: 19 },
    { sprite: 'grapple_ring', x: 13, y: 16, grapple: true },
    // Old shoring left on the face where the diggers propped the bad bits,
    // here and there, not in a row.
    { sprite: 'wall_shoring', x: 3, y: 19, text: 'd_post' },
    { sprite: 'wall_shoring', x: 16, y: 21, text: 'd_post' },
    { sprite: 'wall_shoring', x: 15, y: 9, text: 'd_post' },
    { sprite: 'wall_shoring', x: 4, y: 13, text: 'd_post' },
    // The landing halfway: planks over a shelf of rock.
    { sprite: 'mine_lamp', x: 4, y: 15, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'lunch_crate', x: 10, y: 16, text: 'shaft_crate' },
    // The upper pitch.
    { sprite: 'swing_ring', x: 14, y: 13 },
    { sprite: 'swing_ring', x: 12, y: 11 },
    { sprite: 'swing_ring', x: 7, y: 11 },
    { sprite: 'swing_ring', x: 5, y: 9 },
    { sprite: 'swing_ring', x: 7, y: 7 },
    { sprite: 'grapple_ring', x: 7, y: 4, grapple: true },
    // The gallery at the top.
    { sprite: 'chest', x: 10, y: 3, text: 'shaft_chest', gives: 'cave_dew', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'moles_hard_hat', x: 12, y: 2, text: 'shaft_hats' },
    { sprite: 'mine_lamp_hung', x: 6, y: 2, text: 'd_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    // The foot of the shaft.
    { sprite: 'mine_lamp', x: 3, y: 28, text: 'd_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'ore_sacks', x: 15, y: 28, text: 'd_sacks' },
    { sprite: 'timber_stack', x: 12, y: 29, text: 'd_timber' },
    { sprite: 'scree_heap', x: 10, y: 27, text: 'shaft_scree', walkable: true },
    { sprite: 'floor_pebbles', x: 4, y: 16, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 14, y: 15, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 10, y: 29, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 5, y: 30, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 12, y: 30, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'col_token', x: 14, y: 4, walkable: true, flat: true, gives: 'tally_cart', taken: { gone: true } },
  ],
  tileTexts: { '#': 'd_rock', h: 'd_timber_wall', O: 'd_ore', I: 'd_post', J: 'd_post', '^': 'd_stalag', W: 'shaft_face' },

  // None: the climb is the challenge.
  npcs: [],
};
