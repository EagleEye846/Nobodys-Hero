// THE RINGERS' LOFT (a secret): the upstairs of Merrow's old ringers' hall, behind the barred
// door on the drowned square. The water never got up here. The bell ropes the ringers practised
// on hang from the beams, the peal board on the wall lists the peals rung (the last one never
// finished), and there's a chest and the ringers' tin. It opens when the square's three practice
// bells are rung in the tower's order (G C C D: see merrow_square). Asks nothing of the story.
// Tile key: #  the hall's walls (solid)   h  inner wall (solid)   o  floorboards

export const SECRET_MERROW_RINGERS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_merrow_ringers',
  // The room's name, for the Room Editor.
  name: "THE RINGERS' LOFT",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'merrow',
  indoors: true,
  // "Bells Under Water", quieter under a roof, with the rain on it.
  music: 'merrowIndoor',
  // An empty house in a drowned place: no talk, no fire, the flood somewhere below.
  ambience: 'drowned_house',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_drowned_house' },
  vesWell: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######oo######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'merrow_square', spawn: { x: 14, y: 5 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/merrow.txt',
  props: [
    { sprite: 'mw_peal_board', x: 5, y: 2, text: 'loft_board' },
    { sprite: 'mw_bell_rope', x: 2, y: 2, text: 'loft_rope' },
    { sprite: 'mw_bell_rope', x: 9, y: 2, text: 'loft_rope' },
    { sprite: 'mw_bell_rope', x: 11, y: 2, text: 'loft_rope' },
    { sprite: 'c5_chest', x: 12, y: 5, text: 'loft_chest', gives: 'ringers_cordial', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'loft_tin', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'mw_ropes_coiled', x: 8, y: 6, text: 'loft_ropes', walkable: true },
    { sprite: 'mw_coat_pegs', x: 7, y: 2, text: 'loft_pegs' },
    // Lived in, once (2026-11-08): the practice nights on a calendar, a window, two mugs left on a
    // stool after the last practice.
    { sprite: 'in_calendar', x: 3, y: 1, text: 'in_loft_calendar' },
    { sprite: 'in_window_storm', x: 10, y: 1, text: 'in_loft_window', until: 'the_light_answers' },
    { sprite: 'in_window_calm', x: 10, y: 1, text: 'in_loft_window', after: 'the_light_answers' },
    { sprite: 'in_stool_mugs', x: 4, y: 4, text: 'in_loft_mugs' },
    // (2026-11-08) The hall's barrels, stood in the corner.
    { sprite: 'c5_barrels', x: 11, y: 7, text: 'loft_barrels' },
    // A page of the Fair Return's log (optional, secret: the way to her fog bell), in a bottle the ringers kept on their
    // floor by the window, unopened.
    { sprite: 'gs_log_bottle', x: 9, y: 4, text: 'loft_log_bottle', gives: 'log_page_4', notice: true, taken: { gone: true } },
  ],
  tileTexts: { '#': 'loft_wall', h: 'loft_wall' },

  // None: a secret.
  npcs: [],
};
