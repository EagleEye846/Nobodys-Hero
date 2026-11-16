// THE DOWAGER CRAB: stepping in from the west onto the Dowager's beach (wrack_bathtub).
// The bay is tidy for a bay: a mat laid out, a notice. Then a hermit crab the size of a
// cart hauls herself out of a bathtub, bell clanging, and is extremely polite about it. She
// insists you wipe your feet (the hero does, on the mat: he never speaks), is satisfied for
// exactly one line, and then remembers the trespass. Then the fight. Spared (manners won
// her round): dowager_spared. Beaten: dowager_beaten. Both give the Bathtub Bell.
//
// The mat is at (10,9). The party walks in together (Ves to 8,8, Bramble to 8,11, the
// hero to 9,9); the camera sits at 17,9 so the three of them and she are all in view;
// she stands at (25,10). No monsters in this room, so nothing crosses the walk.
export const THE_DOWAGER_CRAB = {
  // Triggers in rooms name the scene by this id.
  id: 'the_dowager_crab',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'wrack_bathtub',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'crab', look: 'enemy:dowager_crab', x: 25, y: 10, hidden: true, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The beach goes quiet in a way the others did not. The rain is still falling, but it seems to be falling more politely.\n\nSomeone has laid a mat out on the shingle. A very neat mat, squared up with the tide line, with a notice beside it.' },
    { do: 'walk', who: 'ves', to: { x: 8, y: 8 }, wait: false },
    // (Bramble round below the notice at 6,10.)
    { do: 'walk', who: 'bramble', to: { x: 5, y: 11 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 9, y: 9 } },
    { do: 'wait', seconds: 0.4 },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 11 } },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'camera', to: { x: 17, y: 9 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'thud' },
    { do: 'appear', who: 'crab' },
    { do: 'quake', amount: 2, seconds: 0.3 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Out on the shingle, a bathtub gets up.\n\nIt has iron feet and a blue painted band and a ship\'s bell bolted to its top with a pink bow on it, and underneath it, in a string of pearls, with a monocle on one eyestalk, is a crab the size of a cart.' },
    { do: 'sound', name: 'bell' },
    { do: 'say', who: 'crab', text: '"Good afternoon."\n\n"You have walked on my beach."' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{awed}...She\'s very big.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{glee}She\'s got a MONOCLE. That\'s not a threat. That\'s a lifestyle.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'crab', text: '"In those."\n\n"Do wipe your feet."' },
    // The hero wipes his feet on the mat (all still in view).
    { do: 'walk', who: 'player', to: { x: 10, y: 9 } },
    { do: 'walk', who: 'player', to: { x: 9, y: 9 }, pace: 70 },
    { do: 'walk', who: 'player', to: { x: 10, y: 9 }, pace: 70 },
    { do: 'walk', who: 'player', to: { x: 9, y: 9 }, pace: 70 },
    { do: 'walk', who: 'player', to: { x: 10, y: 9 }, pace: 70 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'You wipe your feet. Left, right. Left, right. A great deal of wet shingle comes off, and a little of the mat.\n\nFrom the far end of the beach comes a long, careful silence, as of a very old crab counting.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'crab', text: '"...Acceptable."\n\n"Thank you. That is the first correct thing anybody has done on this beach since the spring tides."' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'ves', text: '{hopeful}So we\'re fine?' },
    { do: 'say', who: 'crab', text: '"Certainly not."\n\n"You came in. You were not asked in. There is a notice. I shall have to see you off."' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{angry}But we wiped our FEET.' },
    { do: 'say', who: 'crab', text: '"And I am grateful. It will be taken into account."\n\n"Do mind the bell."' },
    // She comes up the beach at you, so she's in the spotlight with you when it closes.
    { do: 'camera', to: { x: 13, y: 9 } },
    { do: 'walk', who: 'crab', to: { x: 16, y: 9 }, pace: 60 },
    { do: 'battle', enemy: 'dowager_crab', who: 'crab', spared: 'dowager_spared', defeated: 'dowager_beaten' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
