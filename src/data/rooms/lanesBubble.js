// THE DRY POCKET: the mill's tail race runs out through a stone culvert under the drowned lane,
// and halfway along it the culvert opens into air. A round pocket of it, no bigger than a room,
// sits on the old lane bed under the water; the flood stands up all round it like glass, with
// fish nosing at the outside. In the middle, on its post, a lantern is burning. (Lantern 4 of
// the chapter. Nobody says who lit it, and nobody guesses.) The scene `lanes_lantern` plays as
// you step into the pocket: Ves stops for a second and says nothing. PUZZLE-FREE, no monsters.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  culvert wall (solid)   W  stone (solid)   .  the old lane's cobbles
//   ~  water (solid)   0  deep water (solid)

export const LANES_BUBBLE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_bubble',
  // The room's name, for the Room Editor.
  name: 'THE DRY POCKET',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The lantern rooms' own quiet song (lanternRoomTheme.js); under the water you hear the sea
  // in the stones, not the rain.
  music: 'lanternRoom',
  ambience: 'sea_cave',
  // After chapter 5 the storm is over (`calmAfter`): the room's `_calm` words (no rain on the flood overhead).
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  vesWell: true,
  // Under the water: no rain, lightning or fog, but drips, rings and a haze; and darker and
  // greener than the lanes above, lifted only round the lantern.
  atmosphere: { rain: 0, lightning: 0, fog: 0, spray: 0, drips: 0.8, rings: 0.8, haze: 0.7 },
  lamplight: { shade: 0.5, tint: '6, 44, 38' },
  skyline: false,

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#~000~~~~~~~~~~~F~~~~0000000~#',
    '#00000~~xx~~~~x~~~~~~~~000000#',
    '#~000000~~~~~~~~~~~~~~~~~0000#',
    '#~~0000~~~~~~.....~~~~^~~~00~#',
    '#~F~~00~~~~.........~~~~~~~~~#',
    '#~~~~~~~~~~.........~~~~~x~~~#',
    '#~x###x##x...........x#x####x#',
    '..............................',
    '..............................',
    '###x#x###x...........x###x#x~#',
    '#~~x~~~~~~~.........~~~~~~F~~#',
    '#~~~~x~~~~~.........~~~~~~~~~#',
    '#~~~~~~~~~~~~.....~~~~~x0000~#',
    '#~~~000~~~~~~~~~~~~~~~0000000#',
    '#~00000F~~~~~~~~~~~~000000000#',
    '#0000000~~~~~x~~~~~0000000000#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'lanes_mill', spawn: { x: 37, y: 13 } },
    { x: 29, y: 9, w: 1, h: 2, to: 'lanes_down', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/): the mouth of the
  // west culvert, where it opens into the pocket. The walks in it stay on rows 7 to 10.
  cutscenes: [
    { x: 10, y: 9, w: 1, h: 2, scene: 'lanes_lantern' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The lantern on its post, in the middle of the pocket, and the pocket's glassy edge.
    { sprite: 'c5_lantern_post_lit', x: 15, y: 6, text: 'bubble_lantern', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'ln_pocket_rim', x: 10, y: 14, text: 'bubble_rim', flat: true, walkable: true },
    // Bubbles rising and fish outside the pocket (over the water).
    { sprite: 'ln_bubbles', x: 8, y: 6, text: 'bubble_water', flat: true, walkable: true, animation: 'ln_bubbles', speed: 0.18 },
    { sprite: 'ln_bubbles', x: 22, y: 13, text: 'bubble_water', flat: true, walkable: true, animation: 'ln_bubbles', speed: 0.22 },
    { sprite: 'ln_bubbles', x: 13, y: 16, text: 'bubble_water', flat: true, walkable: true, animation: 'ln_bubbles', speed: 0.2 },
    { sprite: 'ln_bubbles', x: 18, y: 3, text: 'bubble_water', flat: true, walkable: true, animation: 'ln_bubbles', speed: 0.24 },
    // What the lane left behind on its floor (off the scene's walks, rows 8-10).
    { sprite: 'c5_drowned_signpost', x: 12, y: 13, text: 'bubble_signpost' },
    { sprite: 'c5_seaweed_heap', x: 18, y: 6, text: 'bubble_weed' },
    { sprite: 'ln_fish', x: 4, y: 6, text: 'bubble_fish', flat: true, walkable: true, animation: 'ln_fish', speed: 0.29 },
    { sprite: 'ln_fish', x: 6, y: 13, text: 'bubble_fish', flat: true, walkable: true, animation: 'ln_fish', speed: 0.3 },
    { sprite: 'ln_fish', x: 21, y: 5, text: 'bubble_fish', flat: true, walkable: true, animation: 'ln_fish', speed: 0.26 },
    { sprite: 'ln_fish', x: 25, y: 16, text: 'bubble_fish', flat: true, walkable: true, animation: 'ln_fish', speed: 0.34 },
    // The flood all round, seen through: light coming down in bands, the old lane's walls
    // and beds lying dark on the bottom, and weed standing up off it, swaying.
    { sprite: 'ln_light_shafts', x: 2, y: 7, flat: true, walkable: true },
    { sprite: 'ln_light_shafts', x: 22, y: 17, flat: true, walkable: true },
    { sprite: 'ln_under_a', x: 2, y: 5, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 23, y: 6, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 2, y: 17, flat: true, walkable: true },
    { sprite: 'ln_under_a', x: 21, y: 15, flat: true, walkable: true },
    { sprite: 'ln_kelp', x: 9, y: 7, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.5 },
    { sprite: 'ln_kelp', x: 7, y: 4, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.6 },
    { sprite: 'ln_kelp', x: 22, y: 7, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.55 },
    { sprite: 'ln_kelp', x: 26, y: 4, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.45 },
    { sprite: 'ln_kelp', x: 9, y: 15, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.52 },
    { sprite: 'ln_kelp', x: 21, y: 14, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.48 },
    { sprite: 'ln_kelp', x: 3, y: 13, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.58 },
    { sprite: 'ln_kelp', x: 27, y: 13, flat: true, walkable: true, animation: 'ln_kelp', speed: 0.5 },
    // The pocket's skin catching the lamp, and that light wobbling on the floor under it.
    { sprite: 'ln_dome_wall', x: 10, y: 14, flat: true, walkable: true },
    { sprite: 'ln_dome_glint', x: 10, y: 14, flat: true, walkable: true },
    { sprite: 'ln_caustics', x: 11, y: 7, flat: true, walkable: true, animation: 'ln_caustics', speed: 0.4 },
    { sprite: 'ln_caustics', x: 16, y: 13, flat: true, walkable: true, animation: 'ln_caustics', speed: 0.45 },
    { sprite: 'ln_caustics', x: 12, y: 11, flat: true, walkable: true, animation: 'ln_caustics', speed: 0.5 },
    // The lane's own floor: moss in the joints, puddles where the drops land, weed drying.
    { sprite: 'ln_moss_b', x: 17, y: 7, flat: true, walkable: true },
    { sprite: 'ln_moss_a', x: 12, y: 14, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 14, y: 12, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 18, y: 10, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 19, y: 13, walkable: true },
    { sprite: 'c5_rubble', x: 11, y: 6, walkable: true },
    // Weed and wet streaks down the culvert walls.
    { sprite: 'ln_wall_weed', x: 3, y: 8, flat: true, walkable: true },
    { sprite: 'ln_wall_weed_b', x: 24, y: 8, flat: true, walkable: true },
    { sprite: 'ln_wall_weed_b', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'ln_wall_weed', x: 22, y: 11, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'bubble_culvert', W: 'bubble_culvert', '~': 'bubble_water', 0: 'bubble_deep' },

  // None: the pocket is quiet.
  npcs: [],
};
