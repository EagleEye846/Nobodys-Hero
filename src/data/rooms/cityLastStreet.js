// THE LAST STREET: the last street before the Gate, and something is going up
// and down it over the roofs: the Hush's shadow. When it comes over, tuck into
// a doorway and keep still (an alcove: like the Hushwood's leaf piles). If it
// sees you, back to the start. Ves is slow on her crutch.
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   .  the old city's flagstones
//   W  the old city's stone wall (solid)
export const CITY_LAST_STREET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'city_last_street',
  // The room's name, for the Room Editor.
  name: 'THE LAST STREET',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'valley',
  // The Hush's stalking music (hushStalkTheme.js).
  music: 'hushStalk',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // How dark the street is under the roofs (0 to 1; see OverworldScene.drawGloom:
  // darker still, and the edges of the screen beating, when the Hush is near).
  gloom: 0.4,
  // The Hush's shadow going over (see src/overworld/hushwood.js).
  hush: { path: [[3, 6], [32, 6, 1.2], [32, 8], [3, 8, 1.2]], speed: 40, radius: 30, start: 0.35 },

  tiles: [
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#..................................#',
    '#..................................#',
    '#...................................',
    '#...................................',
    '#..................................#',
    '#..................................#',
    '#..................................#',
    '################..##################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 11, w: 2, h: 1, to: 'city_statue_court', spawn: { x: 15, y: 1 } },
    { x: 35, y: 6, w: 1, h: 2, to: 'city_gate_foot', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/deadcity.txt',
  props: [
    { sprite: 'alcove', x: 5, y: 4, text: 'alcove', hide: true },
    { sprite: 'alcove', x: 11, y: 4, text: 'alcove', hide: true },
    { sprite: 'alcove', x: 19, y: 4, text: 'alcove', hide: true },
    { sprite: 'alcove', x: 25, y: 4, text: 'alcove', hide: true },
    { sprite: 'alcove', x: 31, y: 4, text: 'alcove', hide: true },
    { sprite: 'street_lamp_dead', x: 8, y: 4, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 22, y: 4, text: 'dead_lamp' },
    { sprite: 'street_lamp_dead', x: 28, y: 4, text: 'dead_lamp' },
    { sprite: 'water_mark', x: 14, y: 7, text: 'water_mark', walkable: true },
    { sprite: 'sign', x: 33, y: 9, text: 'last_sign' },
    // What's been up and down here: claws dragged across the paving, a lamp
    // knocked flat, and bristles left on the doorposts (deadcity.js).
    { sprite: 'claw_gouges', x: 8, y: 7, text: 'claw_gouges', walkable: true },
    { sprite: 'claw_gouges', x: 24, y: 9, text: 'claw_gouges', walkable: true },
    { sprite: 'street_lamp_fallen', x: 15, y: 9, text: 'fallen_lamp' },
    { sprite: 'bristle_tuft', x: 12, y: 5, text: 'bristle_tuft', walkable: true },
    { sprite: 'bristle_tuft', x: 26, y: 5, text: 'bristle_tuft', walkable: true },
  ],
  tileTexts: { W: 'city_wall', '#': 'city_wall' },

  // Nothing else comes down this street. Nothing dares.
  npcs: [],
};
