// THE RUSHES: tall rushes higher than your head, in a little maze, and Ves's
// scarf trodden into the mud in the middle of it (the_scarf). Then a channel
// of fen water across the way, and one drift log lying on the far bank. At the
// top, the rushes have grown right over the channel, with a gap through them
// only Bramble fits: he goes over and rolls the log in for you.
// Tile key (see src/overworld/tileset.js):
//   "  tall reeds (walk behind them) (solid)
//   $  fen water (solid, until a log or rock sinks into it)
//   %  bog (walk on it and it swallows you; a log or rock sinks into it)
//   ;  fen turf
export const MARSH_RUSHES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'marsh_rushes',
  // The room's name, for the Room Editor.
  name: 'THE RUSHES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'marsh',
  // "The Quiet Way" (marshTheme.js).
  music: 'marsh',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'marsh',
  // Mist drifting through, 0 to 1.
  fog: 0.45,

  tiles: [
    '""""""""""""""""""""""""""""""',
    '";;;";;;;%;";;;;;;;;;;;;;;;;;"',
    '";;;";;;;;;";;;;;;$;;;;;;;;;;"',
    '";;;";;;";;";"""";$;;;""""";;"',
    ';;;;";;;";;";;;;;;$;;;;;;;;;;"',
    ';;;;";;;";;"""";;;$;;;;;;;;;;"',
    '";;;";;;";%";;;;;;$;;;;;;;";;"',
    '";;;;;;;";;";;;;;;$;;;;;;;";;"',
    '";;;;;;;";;";;;;;;$;;;;;;;";;;',
    '";;;";;;";;;;;;;;;$;;;;;;;";;;',
    '";;;";;;";;;""""";$;;;;;;;";;"',
    '";;;";;;";;;""""";$;;;;;;;";;"',
    '";;;""""";;"""""";$;;;;;;;;;;"',
    '";;;";;;;;;"""""";$;;;""";;;;"',
    '";;;"%%;;;;"""""";$;;;""";;;;"',
    '";;;";;;""""""""";$;;;;;;;;;;"',
    '";;;";;;;;;"""""";$;;;;;;;;;;"',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 4, w: 1, h: 2, to: 'marsh_lantern_path', spawn: { x: 34, y: 4 } },
    { x: 29, y: 8, w: 1, h: 2, to: 'marsh_sunken_road', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 9, y: 13, w: 2, h: 2, scene: 'the_scarf' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/marsh.txt',
  props: [
    { sprite: 'ves_scarf', x: 10, y: 14, text: 'rushes_scarf', gives: 'ves_scarf', taken: { gone: true }, walkable: true },
    { sprite: 'drag_print', x: 6, y: 7, text: 'drag_print', walkable: true },
    { sprite: 'drag_print', x: 9, y: 13, text: 'drag_print_2', walkable: true },
    { sprite: 'roll_log', x: 20, y: 9, text: 'bog_log', log: true },
    { sprite: 'reed_gap', x: 18, y: 1, text: 'reed_gap', gap: true },
    { sprite: 'sign', x: 17, y: 7, text: 'rushes_channel' },
    { sprite: 'marsh_lantern', x: 19, y: 7, text: 'marsh_lantern', light: 60 },
    { sprite: 'marsh_lantern', x: 27, y: 10, text: 'marsh_lantern', light: 60 },
    { sprite: 'chest', x: 27, y: 2, text: 'rushes_chest', gives: 'gloam_honeydew', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'chest', x: 1, y: 15, text: 'rushes_knife_chest', gives: 'reed_knife', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { '"': 'reeds', '%': 'bog', $: 'fen_water' },

  // A Bog Toad across the channel.
  npcs: [
    { enemy: 'bog_toad', x: 22, y: 15, patrol: [20, 27] },
  ],
};
