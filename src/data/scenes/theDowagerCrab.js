// THE DOWAGER CRAB: stepping in from the west onto the Dowager's beach (wrack_bathtub).
// The bay is tidy for a bay: a mat laid out, a notice. Then a hermit crab the size of a
// cart hauls herself out of a bathtub, bell clanging, and is extremely polite about it. She
// insists you wipe your feet (the hero does, on the mat: he never speaks), is satisfied for
// exactly one line, and then remembers the trespass. Then the fight. Spared (manners won
// her round): dowager_spared. Beaten: dowager_beaten. Both give the Bathtub Bell.
//
// The mat is at (10,9). The party walks along rows 9 and 11; she stands at (25,10). No
// monsters in this room, so nothing crosses the walk.
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
    { do: 'walk', who: 'player', to: { x: 8, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 6, y: 9 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 6, y: 11 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'camera', to: { x: 22, y: 9 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'thud' },
    { do: 'appear', who: 'crab' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Out on the shingle, a bathtub gets up.\n\nIt has iron feet and a blue painted band and a ship\'s bell bolted to its top with a pink bow on it, and underneath it, in a string of pearls, with a monocle on one eyestalk, is a crab the size of a cart.' },
    { do: 'sound', name: 'bell' },
    { do: 'say', who: 'crab', text: '"Good afternoon."\n\n"You have walked on my beach."' },
    { do: 'say', who: 'bramble', text: '{worried}...She\'s very big.' },
    { do: 'say', who: 'ves', text: '{bored}She\'s got a monocle. That\'s not a threat. That\'s a lifestyle.' },
    { do: 'say', who: 'crab', text: '"In those."\n\n"Do wipe your feet."' },
    // The hero wipes his feet on the mat.
    { do: 'camera' },
    { do: 'walk', who: 'player', to: { x: 10, y: 9 } },
    { do: 'walk', who: 'player', to: { x: 9, y: 9 }, pace: 70 },
    { do: 'walk', who: 'player', to: { x: 10, y: 9 }, pace: 70 },
    { do: 'walk', who: 'player', to: { x: 9, y: 9 }, pace: 70 },
    { do: 'walk', who: 'player', to: { x: 10, y: 9 }, pace: 70 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'You wipe your feet. Left, right. Left, right. A great deal of wet shingle comes off, and a little of the mat.\n\nFrom the far end of the beach comes a long, careful silence, as of a very old crab counting.' },
    { do: 'camera', to: { x: 22, y: 9 } },
    { do: 'say', who: 'crab', text: '"...Acceptable."\n\n"Thank you. That is the first correct thing anybody has done on this beach since the spring tides."' },
    { do: 'say', who: 'ves', text: '{thoughtful}So we\'re fine?' },
    { do: 'say', who: 'crab', text: '"Certainly not."\n\n"You came in. You were not asked in. There is a notice. I shall have to see you off."' },
    { do: 'say', who: 'bramble', text: '{worried}But we wiped our FEET.' },
    { do: 'say', who: 'crab', text: '"And I am grateful. It will be taken into account."\n\n"Do mind the bell."' },
    { do: 'camera' },
    { do: 'battle', enemy: 'dowager_crab', who: 'crab', spared: 'dowager_spared', defeated: 'dowager_beaten' },
  ],
};
