// THE FIRST DARK: the lake's stair ends here (you come in through the gap in
// the north wall), and so does every light but your own. A wide black cavern of pillars, knobs and stalagmites, with a
// few drops you only learn about by their edges. There is no path to follow
// except the one somebody else made: little piles of flat stones, set at
// the turns by a hand that wanted to find the way back. They only show in
// your light. Something drifts at the very edge of it, now and then. A
// murk keeps the west side and a gnawer the bones in the south.
//
// The puzzle is whose cairns to trust, and the open way is the wrong one. There are two kinds of
// cairn. The child's (the ones you learnt in the Reeds and on the far shore): three small flat
// stones, smallest on top, and three pale pebbles laid in a line the way to go. And older ones
// (`old_cairn_*`): five heavy stones under dust, and four dark pebbles, which point just as firmly,
// and lie. You meet the child's ones first (the start, the corner), so you know what honest looks like.
//
// The way on is NOT east along the open hall. At (11,8), beside a one-tile-wide way down (12,8..9),
// the child's cairn points DOWN. The trail goes south, then east along the bottom of the cave
// (through the gap in row 14 at x 21..25) and up the east side to the door. Walking on east instead
// brings you to the fork (21..22,8..9) with two ways on, and both are lies:
//   (20,9) an older cairn pointing up   -> the north corridor, one tile wide at (23,7)
//   (22,9) an older cairn pointing down -> the south corridor, one tile wide at (24,11)
//   (22,8) the child's cairn pointing LEFT: back the way you came.
// Stepping on either choke plays dark_turns_you_round, which sets you down at the fork again (no
// harm done, and the walk back to the turn is about ten tiles). Past those chokes lies the hub
// (27..28,8..10) with the older cairns and the child's cairn knocked flat at (27,10), whose pebbles
// lie east; it is only reached from the east side (the door, or the secret), where east is honest.
//
// The secret: far over in the north-east a faint blue glow is the only light
// in the room, a crack with two crystals either side. Go and find it
// (deep_hidden_vug). It is up from the hub at (28,5), or up the east side, which no cairn points to.
//
// Tile key (see src/overworld/deepTiles.js for how the Deep draws them):
//   #  black rock overhead (solid)   W  smooth black rock face (solid)
//   .  black stone floor   q  ash (floor)   0  a drop into the dark (solid)
//   I  smooth pinched column (solid)   J  smooth knob (solid)
//   ^  black stalagmite (solid)   O  glossy black boulder (solid)
//   x  glowing crystal (solid, gives light)
export const DEEP_FIRST_DARK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'deep_first_dark',
  // The room's name, for the Room Editor.
  name: 'THE FIRST DARK',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'deep',
  // "The Deep" (src/data/music/deepTheme.js).
  music: 'deep',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'deep',
  // Dark: only your light and what glows show anything (0 to 1).
  dark: 0.92,
  // Glow-worms on Ves's umbrella: your light never drops below this here.
  glowworms: 38,

  tiles: [
    '#######....#########################W###',
    '##WWWWW....W##WWWWWWWWW#####WWWWWWWx.x##',
    '##..........##.........#####..........##',
    '##....####..##...^..qq.#####..........##',
    '##.O..####..##J........WWWWW..........##',
    '##....WWWW..##..#####00......####.....##',
    '##..........WW..#####00...^..####.....##',
    '##.....qq.I.....WWWWW........####.....##',
    '##.......q...00........####..WW#W.....##',
    '##...^..####.00....O...####....O...I..WW',
    '##......####...#####I..WWWW..J...qq.....',
    '##......####.qq#####..........#####.....',
    '##.###..#WWW...WWWWW....J..00.#####.^.##',
    '##.###..O...^........######00#WWWWW...##',
    '##.###................................##',
    '########################################',
  ],

  // Where the player starts, in tile coordinates (just in from the lake's stair).
  playerStart: { x: 8, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 0, w: 4, h: 1, to: 'stillwater_stair_down', spawn: { x: 8, y: 22 } },
    { x: 39, y: 10, w: 1, h: 2, to: 'deep_crawl', spawn: { x: 1, y: 17 } },
    // The secret: the crack with the two crystals, up in the north-east.
    { x: 36, y: 1, w: 1, h: 1, to: 'deep_hidden_vug', spawn: { x: 6, y: 9 } },
  ],

  // Off the stair: the glow-worms find Ves's umbrella. And the two corridors off the fork, one tile wide
  // at (23,7) and (24,11): each turns you round and sets you down at the fork again.
  cutscenes: [
    { x: 2, y: 3, w: 4, h: 2, scene: 'glowworm_umbrella' },
    { x: 10, y: 3, w: 2, h: 2, scene: 'glowworm_umbrella' },
    { x: 24, y: 11, w: 1, h: 1, scene: 'dark_turns_you_round' },
    // And the north corridor (row 7), one tile wide at (23,7): the same trick.
    { x: 23, y: 7, w: 1, h: 1, scene: 'dark_turns_you_round_north' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The waymark cairns (seen only in your light), a few smooth stones, the bones
  // the gnawer sleeps on, and a purse at the end of a blind nook.
  textFile: 'interactions/deep.txt',
  props: [
    // A save crystal, so the caves never go long without one.
    { sprite: 'savepoint', x: 3, y: 3, save: true },
    // The child's waymarks: a cairn with three pale pebbles laid in a line in front of it, pointing
    // the way to go on. They stand beside the turns, and the open places where it is easy to go on
    // by mistake. (cairn_fallen: the child's, knocked flat; the one at the hub says which way it lay.)
    // The older cairns (old_cairn_*, five heavy stones and four dark pebbles) point firmly the wrong way.
    { sprite: 'cairn_down', x: 10, y: 3, text: 'fd_cairn_first', seenInLight: true },
    { sprite: 'cairn_right', x: 10, y: 6, text: 'fd_cairn', seenInLight: true },
    // The turn: the open way east is the wrong one. The child's cairn at the top of the narrow
    // way down (12,8) points DOWN, and the trail goes on south, then east along the bottom.
    { sprite: 'cairn_down', x: 11, y: 8, text: 'fd_cairn_turn', seenInLight: true },
    { sprite: 'cairn_right', x: 14, y: 12, text: 'fd_cairn', seenInLight: true },
    { sprite: 'cairn_right', x: 20, y: 13, text: 'fd_cairn', seenInLight: true },
    { sprite: 'cairn_up', x: 36, y: 14, text: 'fd_cairn', seenInLight: true },
    // The fork: the child's cairn points BACK; both ways on are the older hands' lies.
    { sprite: 'cairn_left', x: 22, y: 8, text: 'fd_cairn_fork', seenInLight: true },
    { sprite: 'old_cairn_up', x: 20, y: 9, text: 'fd_old_cairn_north', seenInLight: true },
    { sprite: 'old_cairn_down', x: 22, y: 9, text: 'fd_old_cairn', seenInLight: true },
    { sprite: 'old_cairn_down', x: 27, y: 8, text: 'fd_old_cairn_hub', seenInLight: true },
    { sprite: 'cairn_fallen', x: 27, y: 10, text: 'fd_fallen_right', seenInLight: true },
    { sprite: 'old_cairn_right', x: 29, y: 11, text: 'fd_old_cairn_last', seenInLight: true },
    // Three more knocked flat, in the open places off the trail: nobody went on from them.
    { sprite: 'cairn_fallen', x: 4, y: 6, text: 'fd_fallen', seenInLight: true },
    { sprite: 'cairn_fallen', x: 6, y: 12, text: 'fd_fallen', seenInLight: true },
    { sprite: 'cairn_fallen', x: 4, y: 10, text: 'fd_fallen', seenInLight: true },
    { sprite: 'smooth_stone_a', x: 8, y: 6, text: 'fd_stone', seenInLight: true },
    { sprite: 'smooth_stone_b', x: 24, y: 12, text: 'fd_stone_wide', seenInLight: true },
    { sprite: 'smooth_stone_c', x: 31, y: 3, text: 'fd_stone', seenInLight: true },
    { sprite: 'big_bones', x: 9, y: 13, text: 'fd_bones', seenInLight: true },
    { sprite: 'gold_pouch', x: 2, y: 14, text: 'fd_purse', gold: 60, seenInLight: true, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'deep_rock', W: 'deep_face', I: 'deep_column', J: 'deep_knob', '^': 'deep_stalagmite', O: 'deep_boulder', x: 'deep_crystal', '0': 'deep_drop', q: 'deep_ash' },

  // A murk drifts along the west side (row 7, x 2 to 9), just at the edge of your
  // light as you come down from the stair, and a gnawer lives on the bones in
  // the south (row 14, x 6 to 15; the trail comes down x 12..14 and goes east along row 13). Neither is near the fork or the two loop scenes.
  npcs: [
    { enemy: 'murk', x: 5, y: 7, patrol: [2, 9] },
    { enemy: 'gnawer', x: 12, y: 14, patrol: [6, 15] },
    // A fiddler on the north-east shelf (row 5, x 33 to 37), on the way to the secret crack,
    // well off the cairn trail and the two glow-worm triggers in the north-west.
    { enemy: 'fiddler', x: 35, y: 5, patrol: [33, 37], behaviour: 'patrol' },
  ],
};
