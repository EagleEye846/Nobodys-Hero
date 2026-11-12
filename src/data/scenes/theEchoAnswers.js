// THE ECHO ANSWERS (draft): the far bank of the Echo Falls, the first time
// you cross the lake. The falls never stop talking, and the cave gives back
// whatever you say to it. Ves shouts HELLO at it, and it answers, which is
// more than the chapel at home ever did. A small moment between four puzzle
// rooms in a row, before Tuck finds you.
//
// Clearance: the walks stay on the far bank's west edge (x 21 to 22, rows 8
// and 9). The quartzling sits at 25,7 and the prismoth patrols 24-26 on row
// 12, so nobody crosses them.
export const THE_ECHO_ANSWERS = {
  // Triggers in rooms name the scene by this id.
  id: 'the_echo_answers',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'glimmer_echo_falls',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 21, y: 10, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 22, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 21, y: 8 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'wait', seconds: 0.6 },
    // Back across the lake, to the falls.
    { do: 'camera', to: { x: 14, y: 7 } },
    { do: 'say', text: 'The falls never stop talking. Every sound you make comes back off the water a moment later, smaller, and a little bluer.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{glee}HELLO!' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', text: '...HELLO... hello... lo...' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{laughing}It answers. {smile}That\'s more than the chapel ever did.' },
    { do: 'say', who: 'ves', text: '{bored}Eight years I talked to that ceiling. Not a peep.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}And then somebody walked in anyway. Late. Half frozen. Not even the right one.' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{proud}I\'ve decided it counts.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: '...counts... counts...' },
    { do: 'say', who: 'ves', text: '{smile}See? The cave agrees.' },
    { do: 'wait', seconds: 0.3 },
  ],
};
