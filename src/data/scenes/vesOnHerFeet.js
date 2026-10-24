// VES ON HER FEET: morning at the healer's. Ves is up on a crutch, very
// pleased with herself, and Bryony is not. She's back with you, walking now
// (slowly, and still hurt: no umbrella). And Bryony turns to Bramble: he's
// ten, his mother doesn't know where he is, and he's going home with the
// charcoal cart (bramble_goes_home, in the square).
export const VES_ON_HER_FEET = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_on_her_feet',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_healer',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 9, y: 5, portrait: 'vesper_bare', hidden: true },
    { id: 'bryony', look: 'prop:lh_bryony', x: 4, y: 4, portrait: 'bryony', plays: 'lh_bryony' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 7, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'bed', pose: 'sitting' },
    { do: 'wait', seconds: 0.8 },
    { do: 'appear', who: 'ves' },
    { do: 'walk', who: 'ves', to: { x: 10, y: 7 } },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{glee}Morning! Look. LOOK.\n\n{laughing}I\'m standing up! Sort of! Bryony found me a stick!' },
    { do: 'say', who: 'bryony', text: '{stern}It\'s a crutch, and you\'re to sit down before you fall down.' },
    { do: 'say', who: 'ves', text: '{determined}Never.' },
    { do: 'bed', pose: 'up' },
    { do: 'walk', who: 'player', to: { x: 8, y: 7 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'bryony', text: '{thoughtful}It\'ll mend, slowly. Keep off it what you can. When she tells you it\'s fine, it isn\'t.' },
    { do: 'say', who: 'ves', text: '{smile}It\'s fine.' },
    { do: 'say', who: 'bryony', text: '{tired}You see?' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'bryony', dir: 'right' },
    { do: 'say', who: 'bryony', text: '{stern}And YOU, young man.' },
    { do: 'say', who: 'bramble', text: '{scared}What? What did I do?' },
    { do: 'say', who: 'bryony', text: '{stern}You\'re ten years old, and your mother doesn\'t know where you are.\n\nCorran\'s taking his cart up to the forest edge this morning. He knows your camp. You\'re going with him.' },
    { do: 'say', who: 'bramble', text: '{angry}But I\'m HELPING! I found her! Me and Sword! I followed the chalk and the coat and everything!' },
    { do: 'say', who: 'bryony', text: '{tender}You did. You did a good, brave thing. And now you\'re going home, so your mother can stop being frightened.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{tender}Bramble...' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{crying}...FINE.\n\n{angry}But I\'m not saying goodbye yet. Not in here. I\'ll say it at the gate.' },
    // Her coat, torn in the Hushwood, mended overnight (the Mended Evening Coat).
    { do: 'say', who: 'bryony', text: '{thoughtful}One more thing. Your coat. I sat up with it.\n\n{tired}Some of the patches are the bits of blue this one brought in, off the trees. The rest don\'t match, I\'m afraid.' },
    { do: 'say', who: 'ves', text: '{tender}...You mended it.\n\n{smile}I like them not matching. Now it\'s got a story.' },
    // She's with you again, walking (slowly, and still hurt).
    { do: 'leave', who: 'ves' },
    { do: 'join', who: 'vesper' },
    { do: 'say', text: 'VES is with you again. She walks with a crutch, slowly, but she walks.\n\n(She\'s still hurt, with no umbrella: she can COVER you and CALL OUT, but not much else.)' },
    { do: 'give', item: 'mended_coat' },
  ],
};
