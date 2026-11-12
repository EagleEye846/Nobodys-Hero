// THE DEN: a gap in the thickness of the gallery's north wall, behind a false bit of brick (the
// gallery's G at x 4). Just room for a boy. A fish crate lined with sailcloth for a bed, tally marks
// scratched in the back wall (four and a crossbar, row on row, and then they stop), and a tin
// with a lump of humbugs in it. PUZZLE-FREE, no monsters, no lamps (the tower is dark; the only
// lantern up here is the one that lights after Corrie). The way out is the gap (4,6), back into the
// gallery under the false wall (lastlight_gallery 4,3). The tally marks are over the gap (4,2), the bed at (2,3).
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   6  a slit in the brick   .  flagstones   o  the gap out
// (draft).

export const SECRET_LASTLIGHT_DEN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_lastlight_den',
  // The room's name, for the Room Editor.
  name: 'THE DEN',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  music: 'lastlight',
  ambience: 'last_light',
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
  vesWell: true,

  tiles: [
    '#########',
    '#hhhhhhh#',
    '#hhhhh6h#',
    '#.......#',
    '#.......#',
    '#.......#',
    '####o####',
  ],

  // Where the player starts, in tile coordinates: just in from the gap.
  playerStart: { x: 4, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 4, y: 6, w: 1, h: 1, to: 'lastlight_gallery', spawn: { x: 4, y: 3 } },
  ],

  // The tally marks (the_den_tally), as you come in through the gap.
  cutscenes: [
    { x: 3, y: 4, w: 3, h: 2, scene: 'the_den_tally', until: ['the_light_answers', 'haddock_gone'] },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lastlight.txt',
  props: [
    { sprite: 'c5_crate', x: 2, y: 3, text: 'den_bed' },
    { sprite: 'c5_height_marks', x: 4, y: 2, text: 'den_tally' },
    { sprite: 'c5_chest', x: 6, y: 3, text: 'den_tin', gives: 'humbug_lump', react: true, taken: { sprite: 'c5_chest_open', text: 'den_tin_empty' } },
    // (2026-11-08b) A slit in the brick (6,2) lets in a line of sea light, the only light there is.
    // A boy's things: his handwriting on the wall over the bed, library books, a paper boat.
    { sprite: 'll_chalk_hand', x: 1, y: 2, text: 'gal_hand' },
    { sprite: 'in_book_pile', x: 6, y: 5, text: 'den_books' },
    { sprite: 'c5_toy_boat', x: 2, y: 5, text: 'den_boat' },
    { sprite: 'c5_puddle', x: 5, y: 3, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', 6: 'den_window', '.': 'll_floor', o: 'den_gap' },

  // Nobody here.
  npcs: [],
};
