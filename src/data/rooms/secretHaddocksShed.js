// HADDOCK'S SHED (a secret): behind the harbour office, a small cluttered timber
// shed that opens only once the chapter is over (the world flag `haddock_gone`; the
// office door is locked until then). Nets, floats, oars, a workbench, a stove gone
// cold, a cot. Every bit of junk has a paper label with a date in his square
// capitals, so the things tell his life in small ways, and a couple of them are
// quietly about Corrie. On the workbench, three gifts, each with its own label:
// the Muffler (the hero), the Ugly Sou'wester (Ves), the Cork Float (Bramble).
// No monsters, no puzzle.
//
// (draft) story text, for Patrick to review (text/interactions/haddock_shed.txt)
//
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards

export const SECRET_HADDOCKS_SHED = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_haddocks_shed',
  // The room's name, for the Room Editor.
  name: "HADDOCK'S SHED",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof.
  music: 'saltcombe',
  ambience: 'stilt_inside',
  vesWell: true,
  indoors: true,

  tiles: [
    '##############',
    'hhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhh',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######oo######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Back out to the harbour office's back door.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'saltcombe_harbour_office', spawn: { x: 12, y: 4 } },
  ],

  cutscenes: [],

  // Along the back wall, left to right: the cold stove, the net, the oars, the tide table, the
  // cabinet with the tooth, the gulls notice, the float rail, the bung barrel. On the floor: the
  // cot, the workbench with the three gifts (hero, Ves, Bramble), a coil of rope.
  textFile: 'interactions/haddock_shed.txt',
  props: [
    { sprite: 'stove', x: 1, y: 3, text: 'shed_stove' },
    { sprite: 'hs_nets', x: 2, y: 3, text: 'shed_nets' },
    { sprite: 'hs_oars', x: 3, y: 3, text: 'shed_oars' },
    { sprite: 'hs_tide_table', x: 5, y: 3, text: 'shed_tide_table' },
    { sprite: 'hs_cabinet', x: 6, y: 3, text: 'shed_cabinet' },
    { sprite: 'hs_notice', x: 7, y: 3, text: 'shed_notice' },
    { sprite: 'hs_floats', x: 8, y: 3, text: 'shed_floats' },
    { sprite: 'c5_barrel', x: 11, y: 3, text: 'shed_barrel' },
    { sprite: 'bed', x: 1, y: 7, text: 'shed_cot' },
    { sprite: 'c5_rope_coil', x: 10, y: 6, walkable: true, text: 'shed_wall' },
    { sprite: 'hs_bench_hero_0', x: 6, y: 6, text: 'shed_gift_hero', gives: 'haddocks_muffler', react: true, taken: { sprite: 'hs_bench_empty_0', text: 'shed_bench_empty' } },
    { sprite: 'hs_bench_ves_1', x: 7, y: 6, text: 'shed_gift_ves', gives: 'ugly_sou_wester', react: true, taken: { sprite: 'hs_bench_empty_1', text: 'shed_bench_empty' } },
    { sprite: 'hs_bench_bramble_2', x: 8, y: 6, text: 'shed_gift_bramble', gives: 'cork_float', react: true, taken: { sprite: 'hs_bench_empty_2', text: 'shed_bench_empty' } },
  ],
  tileTexts: { h: 'shed_wall', '#': 'shed_beams' },

  // None: a secret.
  npcs: [],
};
