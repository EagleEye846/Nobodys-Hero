// THE STAIR: a stair cut straight down into the rock, four strides wide,
// older than the hall, older than the lake. At the top, a landing with the
// last of the lake's light on it, and a notice board somebody has hammered
// up in a hurry. Then step after step after step, down, with no rail and no
// lamps, and the dark getting thicker the further down you go.
// Tile key (see src/overworld/deepTiles.js for how the Stillwater draws them):
//   #  black rock overhead (solid)   W  rock face (solid)
//   .  pale stone   q  worn stone (the steps alternate, so you can see them)
//   ^  stalagmite (solid)   J  broken pillar (solid)
export const STILLWATER_STAIR_DOWN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'stillwater_stair_down',
  // The room's name, for the Room Editor.
  name: 'THE STAIR',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'stillwater',
  // "The Stillwater" (src/data/music/stillwaterTheme.js), thinning out.
  music: 'stillwater',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'lake',
  // The light gives out as you go down: only lights and your own show.
  dark: 0.55,
  // Under cover: no sky, and the edges of the screen sink into shadow.
  indoors: true,

  tiles: [
    '##################',
    '##################',
    '#WWWWWWWWWWWWWWWW#',
    '####^........^####',
    '####..........####',
    '####..........####',
    '####.J......J.####',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '######W....W######',
    '######WqqqqW######',
    '#######....#######',
    '#######....#######',
    '##################',
  ],

  // Where the player starts, in tile coordinates (the landing).
  playerStart: { x: 8, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 3, w: 4, h: 1, to: 'stillwater_far_shore', spawn: { x: 30, y: 12 } },
    { x: 7, y: 24, w: 4, h: 1, to: 'deep_first_dark', spawn: { x: 8, y: 2 } },
  ],

  // No cutscenes here.
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/stillwater.txt',
  props: [
    { sprite: 'sign', x: 5, y: 5, text: 'stair_notice' },
    { sprite: 'gold_pouch', x: 12, y: 5, text: 'stair_purse', gold: 110, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'glow_reeds_tall', x: 6, y: 4, text: 'glow_reeds', animation: 'glow_reeds_tall', speed: 0.5 },
    { sprite: 'glow_reeds', x: 12, y: 4, text: 'glow_reeds', animation: 'glow_reeds', speed: 0.45 },
    { sprite: 'fungus_pads', x: 8, y: 4, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 10, y: 6, walkable: true, animation: 'fungus_pads', speed: 0.9 },
    { sprite: 'fungus_pads', x: 9, y: 9, walkable: true, animation: 'fungus_pads', speed: 1.0 },
    { sprite: 'jetty_post', x: 7, y: 6, text: 'stair_hook' },
  ],
  tileTexts: {
    '#': 'lake_rock', W: 'stair_wall', q: 'stair_step', '.': 'stair_step', '^': 'lake_stalagmite', J: 'lake_broken_pillar',
  },

  // Nothing lives on the stair. (Nothing you can see, anyway.)
  npcs: [],
};
