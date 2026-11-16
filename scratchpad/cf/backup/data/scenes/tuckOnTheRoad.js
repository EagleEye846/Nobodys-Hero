// TUCK ON THE ROAD: where the road bends, the whole kingdom opens out below
// the edge, and Tuck is standing at the rail with his back to you, looking
// at it. Belowtown, far down, small and golden, and the Sunstone over it
// like a lamp somebody has turned down to save the oil. Tuck says what he is
// afraid of. Ves says what she thinks of that. He asks you to be kind, and
// goes ahead to the gate.
//
// Clearance: no monsters on the road. The camera pans down over the edge, the
// walks keep to rows 6 to 8 between x 21 and 38.
export const TUCK_ON_THE_ROAD = {
  // Triggers in rooms name the scene by this id.
  id: 'tuck_on_the_road',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'glimmer_kings_road',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: 27, y: 7, portrait: 'tuck', hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 8, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'music', song: 'tuck' },
    { do: 'walk', who: 'player', to: { x: 24, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 23, y: 8 } },
    { do: 'appear', who: 'tuck' },
    { do: 'face', who: 'tuck', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    // The view opens out.
    { do: 'camera', to: { x: 29, y: 12 } },
    { do: 'wait', seconds: 1.4 },
    // He points it out with his whole arm (tuck_point), then the Sunstone
    // up over the town (tuck_point_up).
    { do: 'animate', who: 'tuck', animation: 'tuck_point', speed: 0.2, once: true },
    { do: 'say', who: 'tuck', text: '{shy}That\'s Belowtown. Down there.' },
    { do: 'animate', who: 'tuck', animation: 'tuck_point_up', speed: 0.2, once: true },
    { do: 'say', who: 'tuck', text: '{worried}And that\'s the Sunstone. It used to be so bright you couldn\'t look at it.\n\nEveryone says. I was small. I don\'t remember.' },
    { do: 'say', who: 'ves', text: '{bored}It\'s a very large lamp to be running low.' },
    { do: 'camera' },
    { do: 'animate', who: 'tuck' },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'say', who: 'tuck', text: '{shy}His Majesty says it\'s only a flicker. He says it every time.\n\n{whisper}I say it too, sometimes. It helps a bit.' },
    { do: 'say', who: 'ves', text: '{bored}Does it?' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'tuck', text: '{sad}...No. Sorry.' },
    { do: 'act', who: 'tuck', act: 'sigh' },
    { do: 'say', who: 'tuck', text: '{shy}Everyone will want to look at you. They don\'t mean anything by it.\n\nThey\'ve only... only ever seen one of you before.' },
    { do: 'say', who: 'ves', text: '{thoughtful}One.' },
    { do: 'act', who: 'tuck', act: 'shiver' },
    { do: 'say', who: 'tuck', text: '{worried}I didn\'t say that. I didn\'t say anything. Please, this way. It\'s not far.' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 38, y: 7 }, keep: true },
    { do: 'leave', who: 'tuck' },
    { do: 'wait', seconds: 0.4 },
    // Back to the room's song.
    { do: 'music' },
  ],
};
