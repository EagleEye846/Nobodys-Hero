// DIGGINGS LIFT DOWN: stepping out onto the lift's planks. The cage gives a
// jerk, drops a hand's breadth, thinks about it, and goes down, slow and
// creaking, into a long dark that smells of wet stone. The picture doesn't
// change (the planks go with you); the screen shudders, and Ves holds the
// umbrella a little tighter than she'd admit. On the way down, the cage's
// corner post: the diggers' height marks, and one much lower notch that was
// the Hero's, the night they rode down alone. When it settles, the way out is
// at the east end of the cage, and it leads to the lake.
export const DIGGINGS_LIFT_DOWN = {
  // Triggers in rooms name the scene by this id.
  id: 'diggings_lift_down',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'diggings_lift',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 30, y: 9, portrait: 'vesper', plays: 'vesper' },
    // The winch on the cage's roof, turning (the room's own prop takes its place).
    { id: 'winch', look: 'prop:mine_winch', x: 31, y: 6, plays: 'winch', centered: true },
  ],

  steps: [
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 2, seconds: 0.5 },
    // The jerk: both of you jolt, grit shakes off the rope, and Ves braces
    // (crouched, umbrella clutched) as the cage sinks into the dark, which
    // comes up round you a little more with every notch.
    { do: 'stage', burst: { at: { x: 30, y: 9 }, power: 0.8 }, rubble: 2.5, rubbleAmount: 0.3 },
    { do: 'act', who: 'player', act: 'hop', wait: false },
    { do: 'act', who: 'ves', act: 'hop' },
    { do: 'animate', who: 'winch', animation: 'mine_winch_turn', speed: 0.12 },
    { do: 'stage', dim: 0.5, haze: 0.5, seconds: 7 },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'sound', name: 'creak' },
    { do: 'say', text: 'The cage jerks, drops a hand\'s breadth, thinks about it, and then goes down. The rope sings. The dark comes up past the bars, slow and cool, smelling of wet stone.' },
    { do: 'quake', amount: 1, seconds: 2.4 },
    { do: 'say', who: 'ves', text: '{glee}We\'re going down in a bucket on a string. {bored}I want it noted that the string was not my idea.' },
    { do: 'wait', seconds: 1 },
    // The cage's corner post: the diggers' height marks, and one that isn't a digger's.
    { do: 'say', text: 'The cage\'s corner post slides past your nose as you sink. It\'s covered in notches, each with a name painted beside it.\n\nDiggers\' children, measured on the way down to their first shift, years and years of them.' },
    { do: 'say', text: 'One notch is lower than all the rest, and cut with something long and sharp, not a knife.\n\nBeside it, in old flaking paint: CAME THROUGH ON THE NIGHT SHIFT. ASKED FOR THE BOTTOM. WE SAID THERE ISN\'T ONE.' },
    { do: 'say', text: 'Under that, in another paint: WOUND THE CAGE BACK UP EMPTY. And under that, smaller: GOOD LUCK, LITTLE ONE.' },
    { do: 'say', text: 'On the bar beside the notch, the iron is worn bright in two small patches, where somebody held on with both hands all the way down.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}...They were scared stiff. {smile}And they still got in the bucket.' },
    { do: 'wait', seconds: 1 },
    { do: 'animate', who: 'winch', animation: 'mine_winch_turn', speed: 0.4 },
    { do: 'wait', seconds: 0.8 },
    { do: 'animate', who: 'winch' },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 2, seconds: 0.3 },
    // It settles: a puff of dust off the planks, Ves straightens up and
    // lets out the breath she's been holding.
    { do: 'stage', burst: { at: { x: 30, y: 9 }, power: 1.2 }, haze: 0, dim: 0, seconds: 1.6 },
    { do: 'act', who: 'ves', act: 'stand' },
    { do: 'act', who: 'ves', act: 'sigh' },
    { do: 'say', text: 'The cage settles with a clunk. Somewhere beyond the far end of it there is the sound of water, very large and very still.' },
  ],
};
