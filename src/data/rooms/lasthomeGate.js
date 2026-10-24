// LASTHOME GATE: the front of the old city's great hall. Its great doors went
// long ago; the doorway's closed now with a gate of planks. In front, a yard
// with washing lines, flower beds and a brazier, and Thistle, who keeps the
// gate. He doesn't ask you anything at all (lasthome_arrival).
// Tile key (see src/overworld/tileset.js):
//   #  the old city's stone, overhead (solid)
//   ,  grass
//   D  doorway (walk through it; see `doors`)
//   F  flower bed (solid)
//   I  old stone pillar (solid)
//   W  the old city's stone wall (solid)
//   X  cobbles
export const LASTHOME_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lasthome_gate',
  // The room's name, for the Room Editor.
  name: 'LASTHOME GATE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'lasthome',
  // "The Ones Who Stopped Waiting" (lasthomeTheme.js).
  music: 'lasthome',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'village',
  // Lit by its own lamps (see src/overworld/lamplight.js): how dark it is
  // between them, by day and by night.
  lamplight: { shade: 0.3, nightShade: 0.2 },

  tiles: [
    '########################',
    '#WWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWDDWWWWWWWWWW#',
    '#,,,XIXXXXXXXXXXXXIX,,,#',
    '#,,,XXXXXXXXXXXXXXXX,,,#',
    '#,,,XXXXXXXXXXXXXXXX,,,#',
    '#,,,XXXXXXXXXXXXXXXX,,,#',
    '#,,,XXXXXXXXXXXXXXXX,,,#',
    'X,,,XXXXXXXXXXXXXXXX,,,#',
    'X,,,XXXXXXXXXXXXXXXX,,,#',
    '#,,,XXXXXXXXXXXXXXXX,,,#',
    '#,FFXXXXXXXXXXXXXXXXFF,#',
    '#,FFXXXXXXXXXXXXXXXXFF,#',
    '#XXXXXXXXXXXXXXXXXXXXXX#',
    '########################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'valley_road', spawn: { x: 28, y: 7 } },
    { x: 11, y: 3, w: 2, h: 1, to: 'lasthome_square', spawn: { x: 16, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 4, y: 8, w: 1, h: 4, scene: 'lasthome_arrival' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lasthome.txt',
  props: [
    { sprite: 'lh_thistle', x: 14, y: 5, npc: 'lh_thistle' },
    { sprite: 'brazier', x: 9, y: 5, text: 'gate_brazier' },
    { sprite: 'washing_line', x: 5, y: 6, text: 'gate_washing' },
    { sprite: 'washing_line', x: 16, y: 9, text: 'gate_washing' },
    { sprite: 'street_lamp', x: 8, y: 4, text: 'gate_lamp' },
    { sprite: 'street_lamp', x: 15, y: 4, text: 'gate_lamp' },
    { sprite: 'carter_cart', x: 18, y: 11, text: 'gate_cart', until: 'bramble_goes_home' },
    { sprite: 'sign', x: 13, y: 4, text: 'gate_sign' },
  ],
  tileTexts: { W: 'hall_front', '#': 'hall_front', F: 'gate_flowers', I: 'hall_pillar' },

  // Nobody but the townsfolk.
  npcs: [],
};
