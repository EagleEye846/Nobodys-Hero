// SWIMMING LESSON: the bathing pool at Saltcombe's lagoon, in the rain.
// Haddock is already in, up to his chest in his oilskin, and Bramble is
// learning to swim whether he likes it or not. He's terrified (the sea is "a
// very big puddle with opinions"), puts one boot in, then the other, then is
// suddenly doing something with a great deal of splash, and stops while he's
// good at it. Haddock gives him a paper boat (the keepsake `bramble_paper_boat`).
// Warm and funny, no speeches. Haddock mishears Ves. Then he goes round to the
// lookout with the Bother, and tells them how the lagoon's sluice works.
// (The hero never speaks.)
//
// Everything happens on the plank walk (x 1..3, rows 9 to 12) and in the
// bathing pool (x 2..7, rows 13 to 19; Haddock wades at 5..6, row 15), which is the same at both tides, so
// nobody walks over a tile the tide changes. No monsters in the room.
export const SWIMMING_LESSON = {
  id: 'swimming_lesson',
  room: 'saltcombe_lagoon',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:sc_haddock_wade', x: 6, y: 15, portrait: 'haddock', plays: 'haddock_lagoon', centered: true, animation: 'sc_haddock_wade', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 1, y: 10, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 10, portrait: 'bramble', plays: 'bramble', hidden: true },
    // Bramble in the water: his own actor, swapped in at the pool's edge and out again.
    { id: 'swimmer', look: 'prop:sc_bramble_swim', x: 3, y: 13, portrait: 'bramble', hidden: true, animation: 'sc_bramble_swim', speed: 0.18 },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed. The pool, the boot going in, the splash and the dripping climb
    // out are all acted, not described; the paper boat's words are the item's own.
    // The hero first, then Ves and Bramble in at the door behind (nobody walks
    // through anybody).
    { do: 'walk', who: 'player', to: { x: 2, y: 12 } },
    { do: 'appear', who: 'ves', at: { x: 0, y: 9 }, instant: true },
    { do: 'appear', who: 'bramble', at: { x: 0, y: 10 }, instant: true },
    { do: 'walk', who: 'ves', to: { x: 1, y: 11 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 1, y: 10 } },
    { do: 'walk', who: 'bramble', to: { x: 3, y: 11 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    // The pool is at the bottom of the room: the camera goes down to it, and the words go up top.
    { do: 'textbox', top: true },
    { do: 'camera', to: { x: 5, y: 13 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'haddock', text: '{proud}There he is! Lesson one. In ye come.' },
    { do: 'act', who: 'bramble', act: 'shake' },
    { do: 'say', who: 'bramble', text: '{determined}I\'ve been thinking about it. And I\'m not.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{laughing}He\'s terrified.' },
    { do: 'emote', who: 'haddock', emote: '?' },
    { do: 'say', who: 'haddock', text: '{laughing}Terrific! That\'s the spirit.' },
    { do: 'emote', who: 'ves', emote: '...', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}The sea is a very big puddle with opinions.' },
    { do: 'say', who: 'haddock', text: '{smile}This isn\'t the sea. This is the lagoon. It\'s the sea\'s front room. It wipes its feet.' },
    // One boot in. Then the other. Then very still, as if the water might not notice.
    { do: 'walk', who: 'bramble', to: { x: 3, y: 12 } },
    { do: 'walk', who: 'bramble', to: { x: 3, y: 13 } },
    { do: 'sound', name: 'paddle' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'haddock', text: '{proud}Arms like ye\'re diggin\'. Kick like ye\'re cross. Breathe when yer face is out, not when it\'s in.' },
    { do: 'say', who: 'bramble', text: '{worried}What if my face is in a lot?' },
    { do: 'say', who: 'haddock', text: '{smile}Then I\'ve got ye by the braces. Nobody\'s ever sunk with me holdin\' the braces.' },
    // In he goes.
    { do: 'leave', who: 'bramble', instant: true },
    { do: 'appear', who: 'swimmer', at: { x: 3, y: 13 }, instant: true },
    { do: 'walk', who: 'swimmer', to: { x: 3, y: 14 } },
    { do: 'sound', name: 'splashes' },
    { do: 'quake', amount: 1, seconds: 0.25 },
    { do: 'walk', who: 'swimmer', to: { x: 4, y: 16 } },
    { do: 'sound', name: 'paddle' },
    { do: 'face', who: 'ves', at: 'swimmer' },
    { do: 'act', who: 'ves', act: 'hop', wait: false },
    { do: 'act', who: 'player', act: 'hop', wait: false },
    { do: 'say', who: 'bramble', text: '{glee}I\'M DOING IT!\n\n{surprised}Am I doing it?' },
    { do: 'say', who: 'haddock', text: '{laughing}Ye\'re doin\' somethin\'! Keep doin\' it!' },
    { do: 'walk', who: 'swimmer', to: { x: 3, y: 15 } },
    { do: 'sound', name: 'paddle' },
    { do: 'say', who: 'swimmer', text: '{proud}Can I stop now? I want to stop while I\'m good at it.' },
    // Out, dripping.
    { do: 'walk', who: 'swimmer', to: { x: 3, y: 13 } },
    { do: 'leave', who: 'swimmer', instant: true },
    { do: 'appear', who: 'bramble', at: { x: 3, y: 13 }, instant: true },
    { do: 'walk', who: 'bramble', to: { x: 3, y: 12 } },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'say', who: 'haddock', text: '{tender}For yer first swim. Every swimmer gets one. Rules.\n\n{laughing}It floats better than you. For now.' },
    { do: 'give', item: 'bramble_paper_boat' },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    { do: 'act', who: 'bramble', act: 'bounce' },
    { do: 'say', who: 'haddock', text: '{determined}Right. I\'ll take the Bother round under the lookout. When ye want the Wreck Yard, that\'s where I\'ll be.' },
    { do: 'say', who: 'haddock', text: '{smile}Rope up to the lookout\'s on the far ledge. Lagoon\'s too full to walk now: the wheel by the rail lets the sluice out, and lets it back. Mind the gully in the middle. When she\'s out, it all runs down there.' }, // (draft) 2026-11-10
    { do: 'leave', who: 'haddock' },
    { do: 'camera' },
    { do: 'textbox', top: false },
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'say', who: 'bramble', text: '{proud}...I\'m going to name the boat.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{smile}Not "Boat".' },
    { do: 'act', who: 'bramble', act: 'look', wait: false },
    { do: 'say', who: 'bramble', text: '{grin}...I\'ll think of something else, then.' },
  ],
};
